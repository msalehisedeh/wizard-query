/*
* Query service provides a way to query a remote JSON or XML file. It can be used in following ways.
*
* 1) With select() method, a single path or a list of paths can be given. each path will be a json qualifying
* path to an end node (i.e., 'books.book.title'). If multiple paths are supplied, query result will be a json
* object where each attribute will be a given query path and its value will be query result for that path.
* For example:
* select(['books.book.title', 'books.book.author'], '/example1.xml', false)
* will result in {'books.book.title': [], 'books.book.author': []}.
* Each result will not co-related with other result in order or in any other form. if a clause argument is
* supplied, it will be invoked to further assist in filtering the query result. for example if certain category
* of books are required, the clause function can look for a book category attribute and return the query result
* if acceptable or undefined if result should be filtered out of the result.
*
* 2) With arraySelect() method, an array of {path: '', in:'', deepXml: true} can be supplied, each entry will be evaluated
* as if select() method is invoked. But first, requests with similar paths will be merged into one call.  This
* method is useful when paths are dynamicly given and it is not clear in advance if there are requests with
* similar paths. deepXml attribute is optional.
*
* 3) With chainSelect() method, a chained set of {path: '', in: '', deepXml: true} is given in a json object. When result of
* a query becomes available, the request json will be examined to see if a request for the key is available. If
* so, then the 'in' for the path will be prepended to the resulting value of the previous query. , deepXml attribute is 
* optional. This method is useful when result of a query is a json or an xml file and additional query is needed 
* further down in the preceeding files. For example the assumption in the following call is that each books.book 
* result will be a file name and the file path for each result is '/samples/books/'.
* chainSelect({
*   path: 'books.book',
*   in: 'sample1.xml',
*   deepXml: true,
*   'books.book': {
*       in: '/samples/books/',
*       path: ['publication.title', 'publication.author'],
*       handler: this.bublicationHandler
*   })
* if a handler is supplied, it will be used to filter out any result that is not acceptable.
*
*/
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {map} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import * as xmldom from 'xmldom';

/*
* @param node The parent node. it can be used to evaluate based on other attributes in the node.
* @param path attribute to be examined.
* @param value the value of the path. it could be undefined, a literal, or a list.
* @returns returns the value or filtered version of the value or undefined otherwise.
*/
export type clauseEvaluator = (node: any, path: string, value: any) => any;

@Injectable()
export class WizardQueryService {

    public SERVICE_PATH = '';
    public logEnabled = false;

    constructor(
      private http: HttpClient
    ) {

    }

    private _globalFunctions() {
        return "function reverse(a) {\n"+
            " if (a instanceof Array) {\n"+
            "  return a.reverse();\n"+
            " \n} else if (typeof a === 'string') {\n"+
            "  return a.split('').reverse().join('');\n"+
            " } else return a;\n"+
            "}\n"+
            "function sum(a,b) {\n"+
            " var total = 0;\n" +
            " if (a instanceof Array) { \n"+
            "  a.map(function(k) {total += sum(k, b);});\n"+
            " } else if (typeof a === 'object') {\n"+
            "   if (b.indexOf('.')>0){\n" +
            "     var t = a; b.split('.').map(function(k){total+=sum(t[k],b.substring(k.length+1))});" +
            "   } else if(a[b]) {\n"+
            "     var t = a[b];\n"+
            "     total += (typeof t === 'number') ? t : parseFloat(t);\n"+
            "   } \n"+
            " } \n"+
            " return total;\n" +
            "}\n"+
            "function count(a,b) {\n"+
            " var total = 0;\n" +
            " if (a instanceof Array) { \n"+
            "  a.map(function(k) {total += count(k, b);});\n"+
            " } else if (typeof a === 'object') {\n"+
            "  Object.keys(a).map(function(k){ total += count(a[k],b);});\n"+
            " } else if (typeof a === 'string') {\n"+
            "   total = a.split(b).length - 1;\n"+
            " } else if (a === b) {total++;}\n"+
            " return total;\n" +
            "}\n";
    }

    /*
    * Will normalize the given xml out of additional #text or #cdata-section nodes.
    * @param value the xml to be normailzed.
    * @param deepXml if cdata-section should be parsed.
    * @return normalized xml.
    */
    private _normalize(value: any, deepXml: boolean) {
        if (value instanceof Array) {
            const result = [];
            value.map( (item) => {
                result.push(this._normalize(item, deepXml));
            });
            value = result;
        } else if (typeof value === 'object') {
            let items: any = Object.keys(value);

            if (items.length === 1 && !(value[items[0]] instanceof Array)) {
                if (value['#text']) {
                    value = value['#text'];
                } else if (value['#cdata-section']) {
                    value = value['#cdata-section'];
                    if (deepXml) {
                        try {
                            const xml = new xmldom.DOMParser().parseFromString(value);
                            value = (xml.documentElement && xml.documentElement != null) ?
                                        this._xml2json(xml.documentElement) :
                                        value;
                        }catch(e){
                        }
                    }
                }
            } else {
                const result = {};
                items.map( (item) => {
                    result[item] = this._normalize(value[item], deepXml);
                });
                value = result;
            }
        }
        return value;
    }

    /*
    * @param path JSON path to evaluate. A path could be fully qualified for depth of json (i.e., 'a.b.c')
    * @param data the data source.
    * @param deepXml if cdata-section should be parsed.
    * @param clause A method by which value(s) for the key(s) could be evaluated. the caller would evaluate the value for a given attribute.
    * @returns returns evluated value for the key in data source.
    */
    private _valueOfJsonPath(
        path: any,
        data: any,
        deepXml: boolean,
        clause?: clauseEvaluator): any {

        let result: any;
        let x = this._normalize(data, deepXml);
        path.map( (subkey: any) => {
            let node = x;
            if (node && node instanceof Array) {
                const t = [];
                if (subkey.sort) {
                    node = subkey.sort(node);
                }
                node.map (
                    (item) => {
                        if (typeof item === 'object') {
                            if (subkey.key.length) {
                                x = subkey.key.length ? item[subkey.key] : item;
                                if (x && subkey.validated) {
                                    let r = true;
                                    subkey.validated.map(v => {
                                        const z = v(x);
                                        if (typeof z === 'boolean') {
                                            if(z  == false) {
                                                r = false;
                                            }
                                        } else {
                                            x = z;
                                        }
                                    });
                                    if (r) {
                                        t.push(x);
                                    } else {
                                        x = undefined;
                                    }
                                }
                            } else {
                                if (subkey.validated) {
                                    let r = true;
                                    subkey.validated.map(v => {
                                        const z = v(item);
                                        if (typeof z === 'boolean') {
                                            if(z  == false) {
                                                r = false;
                                            }
                                        } else {
                                            item = z;
                                        }
                                    });
                                    if (r) {
                                        t.push(item);
                                    } else {
                                        x = undefined;
                                    }
                                } else {
                                    t.push(item);
                                }
                            }
                        } else if (subkey.key.length && (typeof item === 'string')) {
                            item.split('.').map(
                                (str) => {
                                    if (str.indexOf(subkey.key) >= 0) {
                                        t.push(str);
                                    }
                                }
                            )
                        }
                    }
                );
                x = t;
                result = x;
            } else if (node && (typeof node === 'object')) {
                x = x ?
                    clause(node, subkey.key, subkey.key.length ? x[subkey.key]:  x) :
                    undefined;
                if (x && x instanceof Array) {
                    const t = [];
                    if (subkey.sort) {
                        x = subkey.sort(x);
                    }
                    x.map(
                        (item: any) => {
                            if (subkey.validated) {
                                let r = true;
                                subkey.validated.map(v => {
                                    const z = v(item);
                                    if (typeof z === 'boolean') {
                                        if(z  == false) {
                                            r = false;
                                        }
                                    } else {
                                        item = z;
                                    }
                                });
                                if (r) {
                                    t.push(item);
                                } else {
                                    x = undefined;
                                }
                            }
                        }
                    );
                    x = t;
                    result = x;
                } else if (x) {
                    if (subkey.validated) {
                        let r = true;
                        subkey.validated.map(v => {
                            const z = v(x);
                            if (typeof z === 'boolean') {
                                if(z  == false) {
                                    r = false;
                                }
                            } else {
                                x = z;
                            }
                        });
                        if (r) {
                            result = x;
                        } else {
                            x = undefined;
                        }
                    } else {
                        result = x;
                    }
                }
            } else if (node && (typeof node === 'string') && subkey.key.length) {
                result = [];
                node.split('.').map(
                    (item) => {
                        if (item.indexOf(subkey.key) >= 0) {
                            result.push(item);
                        }
                    }
                )
            } else {
                result = node;
            }
        });
        return result;
    }

    private _get(path: string) {
        const url = this.SERVICE_PATH + path;
        const dot = path.lastIndexOf('.');
        const ext = dot < 0 ? undefined : path.toLowerCase().substr(dot);
        const headers = new HttpHeaders();
        let result: any;

        headers.set('Access-Control-Allow-Origin', '*');

        if (ext === '.xml') {
            headers.set('Content-Type', 'text; charset=utf-8').set('Accept', 'text');
            result = this.http.get(url, { headers, responseType: 'text' })
                .pipe(map((res) => {
                    const xml = new xmldom.DOMParser().parseFromString(res);
                    const json = this._xml2json(xml.documentElement);
                    return json;
                })
            );
        } else if (ext === '.txt') {
            headers.set('Content-Type', 'text; charset=utf-8').set('Accept', 'text');
            result = this.http.get(url, { headers, responseType: 'text' }).pipe(map((res) => res));
        } else if (ext === '.json'){
            headers.set('Content-Type', 'json; charset=utf-8').set('Accept', 'json');
            result = this.http.get(url, {headers}).pipe(map((res) => res));
        } else {
            headers.set('Content-Type', 'text; charset=utf-8').set('Accept', 'text');
            result = this.http.get(url, { headers, responseType: 'text' })
                .pipe(map((res) => {
                    let parsed: any;
                    try {
                        parsed = JSON.parse(res);
                    }catch (e) {
                        try {
                            const xml = new xmldom.DOMParser().parseFromString(res);
                            parsed = this._xml2json(xml.documentElement);
                        } catch (e2) {
                            parsed = res;
                        }
                    };
                    return parsed ? parsed : res;
                })
            );
        }
        return result;
    }

    private _stringValueOfKey(key: any) {
        const result = [];

        if (key instanceof Array) {
            key.map( 
                (item: any) => {
                    if (item instanceof Array) {
                        let x = [];
                        item.map(
                            (subitem) => {
                                if (subitem.key.length) {
                                    x.push(subitem.key);
                                }
                            }
                        )
                        result.push(x.join('.'));
                    } else if (typeof item === 'string') {
                        const i = item.indexOf('[');
                        const j = item.indexOf(']');
                        const k = item.length > (j + 1) ? 2 : 1;
                        result.push(i > 0 ? item.substring(0,i) : j > 0 ? item.substring(j + k) : item);
                    } else if (item.key.length) {
                        result.push(item.key);
                    }
                }
            )
        } else {
            result.push(key.key)
        }
        return result.join(',');
    }

    private _addToResult(value: any, key: string, operation: any, action: any) {
        const path = this._stringValueOfKey(action.path);
        const key2 = this._stringValueOfKey(key);
        let op = operation.result[path];
        let complete = false;
    
        if (!op) {
            operation.result[path] = {};
        }
        if (op) {
            let opk = op[key2];
            if (operation['temp'] &&
                operation['temp'][key2]) {
                op[key2] = [op[key2]];
                delete operation['temp'];
            }else if (opk && (opk instanceof Array) === false) {
                operation.result[path][key2] = [opk]
                op = operation.result[path];
            }
            value = this._normalize(value, action.deepXml);
            if (op[key2]) {
                op[key2].push( value[key2] ? value[key2] : value );
            } else {
                if ((op instanceof Array) === false) {
                    operation.result[path] = [op];
                    operation.result[path].push( value[key2] ? value[key2] : value );
                } else {
                    op.push( value[key2] ? value[key2] : value );
                }
            }
        } else {
            if (value instanceof Array) {
                // if already an array remember it.
                if (!operation['temp']) {
                    operation['temp'] = {};
                }
                if (!operation['temp'][key2]) {
                    operation['temp'][key2] = true;
                }
            }
            operation.result[path][key2] = this._normalize(value, action.deepXml);
            complete = true;
        }
        return complete;
    }

    private _pack(result: any) {
        if (result instanceof Array) {
            const list = [];
            result.map(
                (item) => {
                    list.push(this._pack(item));
                }
            );
            result = list;
        } else if (typeof result === 'object') {
            const keys = Object.keys(result);
            keys.map (
                (key) => {
                    const item = result[key];
                    if (item instanceof Array) {

                    } else if (item[key]) {
                        result[key] = item[key];
                    }
                }
            )
        }
        return result;
    }

    private _triggerResult(promise: any, result: any) {
        promise.next(this._pack(result));
    }

    private _subquery(
        promise: any,
        path: any,
        operation: any,
        action: any) {

        if (operation.cachedFiles[path] === undefined) {
            // one of the keys at this level could be referencing the same file which
            // is not yet fetched. need to wait till it is available.
            operation.cachedFiles[path] = new BehaviorSubject<any>(null);
            this._queryIteration(
                operation.cachedFiles[path],
                operation,
                {
                    path: action.path,
                    in: action.in,
                    deepXml: action.deepXml,
                    join: action.join,
                    handler: action.handler,
                    queryItems: (action.path instanceof Array) ? action.path.length : 1
                },
                path
            );
        }

        // wait for result raised above.
        operation.cachedFiles[path].subscribe(
            (source: any) => {
                if (source) {
                    const opkeyi = action.join ? action.join[action.path] : undefined;
                    if (opkeyi) {
                        if (source instanceof Array) {
                            source.map(
                                (item) => {
                                    this._subquery(
                                        promise,
                                        item,
                                        operation,
                                        {
                                            path: opkeyi.path,
                                            in: opkeyi.in + item,
                                            deepXml: opkeyi.deepXml,
                                            join: opkeyi.join,
                                            handler: opkeyi.handler,
                                            queryItems: (opkeyi.path instanceof Array) ? opkeyi.path.length : 1
                                        }
                                    );
                                }
                            )
                        } else {
                            this._subquery(
                                promise,
                                source,
                                operation,
                                {
                                    path: action.join[opkeyi.path],
                                    in: opkeyi.in + source,
                                    deepXml: action.deepXml,
                                    join: opkeyi.join,
                                    handler: opkeyi.handler,
                                    queryItems: (opkeyi.path instanceof Array) ? opkeyi.path.length : 1
                                }
                            );
                        }
                    } else if (this._addToResult(source, action.path, operation, action)) {
                        action.queryItems--;
                        if (action.queryItems === 0) {
                            this._triggerResult(promise, operation.result);
                        }
                    }else {
                        action.queryItems--;
                        this._triggerResult(promise, operation.result);
                    }
                }
            },
            (error: any) => {
                if (this.logEnabled) {
                    console.log(error);
                }
                action.queryItems--;
                this._triggerResult(promise, operation.result);
           }
        );
    }
    /*
    * Iterates through a chain query.
    * @param promise The promise which original caller is waiting for.
    * @param operation data for keeping track of the iteration.
    * @param action contains: {path: current keys to query for, in: current query path, handler: resolver method}.
    * @param cacheNamed The cached name from previous iteration if any.
    * @returns returns none.
    */
    private _queryIteration(
        promise: BehaviorSubject<any>,
        operation: any,
        action: any,
        cacheNamed?: string) {

        if (!action.handler) {
            action.handler = (node: any, path: string, value: any) => value;
        }
        this.select(action.path, action.in, action.deepXml, action.handler).subscribe(
            (data) => {
                if (data) {
                    if (cacheNamed) {
                        // result of n-th level call to be placed on previous level cache reference.
                        operation.cachedFiles[cacheNamed].next(data);
                    } else {
                        if (data instanceof Array) {
                            const operationalKey = action.join ? action.join[action.path] : undefined;
                            if (operationalKey) {
                                // assumption is the resulting list is a list of file paths.
                                data.map( (content) => {
                                    const path = content['#text'] ? content['#text'] : content;
                                    this._subquery(promise, path, operation, {
                                        path: operationalKey.path,
                                        in: operationalKey.in + content,
                                        deepXml: operationalKey.deepXml,
                                        join: operationalKey.join,
                                        handler: operationalKey.handler,
                                        queryItems: (operationalKey.path instanceof Array) ? operationalKey.path.length : 1
                                    });
                                });
                            } else {
                                // no more query in the chain.
                                action.queryItems--;
                                if (action.queryItems === 0) {
                                    const result =operation.result ? operation.result : {};
                                    this._triggerResult(promise, Object.keys(operation.result).length ? operation.result : data);
                                }
                            }
                        } else if (typeof data === 'object') {
                            Object.keys(data).map( (key) => {
                                const content = data[key];
                                const operationalKey = action.join ? action.join[key]: undefined;
    
                                if (content && content.length && operationalKey) {
                                    this._subquery(
                                        promise,
                                        content,
                                        operation,
                                        {
                                            path: operationalKey.path,
                                            in: operationalKey.in + content,
                                            deepXml: operationalKey.deepXml,
                                            handler: operationalKey.handler,
                                            queryItems: (operationalKey.path instanceof Array) ? operationalKey.path.length : 1
                                        }
                                    );
                                } else {
                                    action.queryItems--;
                                    if (content) {
                                        if (!operation.result) {
                                            operation.result = {};
                                        }
                                        if (operation.result instanceof Array) {
                                            operation.result.push(content);
                                        } else {
                                            operation.result[key] = content;
                                        }
                                    }
                                    if (action.queryItems === 0) {
                                        this._triggerResult(promise, Object.keys(operation.result).length ? operation.result : data);
                                    }
                                }
                            });
                        } else {
                            action.queryItems--;
                            if (action.queryItems === 0) {
                                if (Object.keys(operation.result).length === 0 && data !== undefined) {
                                    operation.result = data;
                                }
                            }
                            this._triggerResult(promise, operation.result);
                        }
                    }
                }
            },
            (error: any) => {
                promise.error({
                    message: 'failed to query ' + action.path,
                    reason: error.message ? error.message : error
                });
                action.queryItems--;
                if (action.queryItems === 0) {
                    this._triggerResult(promise, operation.result);
                }
            }
        );
    }

    private _makeArguments(key: string) {
        const list = key.split('.');
        const result = [];
        list.map( (item) => {
            const b = item.indexOf('[');
            if (b < 0) {
                result.push({
                    key: item,
                    validated: [(data) => true]
                });
            } else {
                let str = item.substring(b + 1, item.length - 1);
                const vList = str.split('][');
                const object = {
                    key: item.substring(0,b),
                    validated: [(data) => true]
                };
                vList.map( 
                    (filter) => {
                        filter = filter.replace(/\`/g, '.');
                        filter = filter.replace(/\@/g, 'data');
                        if (filter.indexOf('order-by:') > -1) {
                            const arg: any = filter.substring(filter.indexOf('order-by:') + 10).trim();
                            const arglist = arg.split('~');
                            const key = arglist[0].trim();
                            const order= arglist[1] ? arglist[1].trim().toLowerCase(): 'asc';
                            object['sort'] = function (array: any) {
                                const _valueOf = (key: string, p: any) => {
                                    key.split('.').map( (x) => {p = p[x]});
                                    return p;
                                }
                                return array.sort(
                                    function(a: any,b: any){
                                        const flag =_valueOf(key, a) > _valueOf(key, b);
                                        return flag ? (order === 'asc' ? 1: -1) : (order === 'asc' ? -1: 1);
                                    }
                                );
                            }
                        }else {
                            const t = filter.indexOf('&&') > 0 || filter.indexOf('||') > 0;
                            let f = 'return function (data) { \n';
                            f += this._globalFunctions();
                            f += 'var x = false;\n try{\n x = ';
                            f += (t ? '(' + filter + ')' : filter) + '; \n}catch(e){}\n return x;\n}';
                            object['validated'].push( new Function(f)() );
                        }
                    }
                );
                result.push(object);
            }
        });
        return result;
    }

    private _handleSpecialCharacters(path: string) {
        let result = [];
        path.split(']').map(
            (item) => {
                const bindex = item.indexOf('[');
                if (bindex >= 0) {
                    let x = '';
                    if ( bindex > 0) {
                        x += item.substring(0, bindex);
                    }
                    x += item.substring(bindex).replace(/\./g,'`');
                    result.push(x);
                } else {
                    result.push(item);
                }
            }
        );
        return result.join(']');
    }
    private _prepareJsonPath(path: any) {
        let result: any;
        if (path instanceof Array) {
            result = [];
            path.map(
                (i) => {
                    const x = this._handleSpecialCharacters(i);
                    result.push(this._makeArguments(x));
                }
            );
        } else {
            const x = this._handleSpecialCharacters(path);
            result = this._makeArguments(x);
        }
        return result;
    }
    

    /*
    * Will convert the xml into a json.
    * @param xml XML to be converted.
    * @returns returns converted JSON.
    */
    private _xml2json(xml: any) {
        try {
            let obj = {};
            if (xml.attributes) {
                const c = xml.attributes;
                for (let i = 0; i < c.length; i++) {
                const attr = c[i];
                obj[attr.name] = attr.value;
                }
            }
            if (xml.childNodes && xml.childNodes.length) {
                for (let i = 0; i < xml.childNodes.length; i++) {
                    const item = xml.childNodes[i];
                    const nodeName = item.nodeName;

                    if (obj[nodeName] === undefined) {
                        const fragment = this._xml2json(item);
                        if (fragment) {
                        obj[nodeName] = fragment;
                        }
                    } else {
                        if (obj[nodeName].push === undefined) {
                            const old = obj[nodeName];

                            obj[nodeName] = [];
                            obj[nodeName].push(old);
                        }
                        const fragment = this._xml2json(item);
                        if (fragment) {
                            obj[nodeName].push(fragment);
                        }
                    }
                }
            } else {
                const text = xml.textContent.trim().replace(/(?:\r\n|\r|\n|\t)/g, '');
                obj = text.length ? text : undefined;
            }
            return obj;
        } catch (e) {
            if (this.logEnabled) {
                console.log(e.message);
            }
        }
    }

    /*
    * Will do a chain query on specified paths from remote location.
    * @param chainQuery A Json structure with paths. Each path will contain a chain of instructions.
    * Each instruction will have a 'in' to a file and a path to search on it (see. select()). once the
    * result is in, the next instruction in the path chain will be trigged. After the path through all
    * chained paths is completed, resulting value will be put in a json where its path is the original
    * json path and its value will be the resulting value.
    *
    * this is not fully tested. caller should pass something like
    * {path: [path1,path2], in: 'something or blank', deepXml: true, join: {k1: {path: path3, in: 'something or plank', clause: function}}}
    * if path1 or path2 or path3 are found at the root object, a chain reaction to fetch deep will follow. An
    * optional clause will help resolve complex situations.
    *
    * @returns returns an observable. the caller should subscribe to this in order to receive the result.
    */
    chainSelect(chainQuery: any): BehaviorSubject<any> {
        const size = (chainQuery.path instanceof Array) ?  chainQuery.path.length : 1;
        const operation = {cachedFiles: {}, result: {}};
        const dataStore = new BehaviorSubject<any>(null);

        this._queryIteration(
            dataStore,
            operation,
            {
                path: chainQuery.path,
                in: chainQuery.in,
                deepXml: chainQuery.deepXml,
                join: chainQuery.join,
                handler: chainQuery.handler,
                queryItems: size
            }
        );
        return dataStore;
    }

    /*
    * Will group file paths if they are similar to avoid multiple calls.
    * @param list A list of Json {paths, in, deepXml} structures. deepXml is optional.
    * @param clause A method by which value(s) for the path(s) could be evaluated. the caller would evaluate the value for a given attribute.
    * @returns returns an observable. the caller should subscribe to this in order to receive the result.
    */
    arraySelect(
        list: any,
        clause?: clauseEvaluator): BehaviorSubject<any>  {
        const groupedList = {};
        list.map( (item: any) => {
            if (groupedList[item.in] === undefined) {
                groupedList[item.in] = [];
            }
            groupedList[item.in].push({path: item.path, deepXml: item.deepXml});
        });
        const dataStore = new BehaviorSubject<any>(null);

        Object.keys(groupedList).map ( (url) => {
            this.select(groupedList[url].path, url, groupedList[url].deepXml, clause).subscribe(
                (data: any) => {
                    if (data) {
                        dataStore.next(data);
                    }
                },
                (error: any) => {
                    dataStore.error(error);
                }
            );
        });
        return dataStore;
    }

    /*
    * Will query path from a remote location qualified through an optional clause function that
    * evaluates, filters, or sorts the resul of the query.
    * @param path A a single JSON path or list of paths to select (i.e., 'a.b.c')
    * @param from A reference URL to a remote source.
    * @param deepXml if cdata-section should be parsed.
    * @param clause A method by which value(s) for the path(s) could be evaluated. the caller would evaluate the value for a given attribute.
    * @returns returns an observable. the caller should subscribe to this in order to receive the result.
    */
    select(
        path: any,
        from: string,
        deepXml: boolean,
        clause?: clauseEvaluator): BehaviorSubject<any> {

        const dataStore = new BehaviorSubject<any>(null);

        this._get(from).subscribe(
            (data: any) => {
                let result: any;
                const jpath = this._prepareJsonPath(path);

                if (!clause) {
                    clause = (node: any, path: string, value: any) => value;
                }
                if (path instanceof Array) {
                    result = {};
                    jpath.map((pathItem) => {
                        const y = this._valueOfJsonPath(pathItem, data, deepXml, clause);
                        if (y) {
                            let key = this._stringValueOfKey(pathItem);
                            result[key] = y;
                        }
                    });
                    if (Object.keys(result).length === 0) {
                        result = undefined;
                    }
                } else if (typeof path === 'string') {
                    result = this._valueOfJsonPath(jpath, data, deepXml, clause);
                }
                if (result) {
                    dataStore.next(result);

                } else {
                    dataStore.error('Result not found for ' + path);
                }
            },
            (error: any) => {
                dataStore.error(error);
            }
        );
        return dataStore;
    }
}
