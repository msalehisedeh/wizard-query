import * as tslib_1 from "tslib";
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
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import * as xmldom from 'xmldom';
let WizardQueryService = class WizardQueryService {
    constructor(http) {
        this.http = http;
        this.SERVICE_PATH = '';
        this.logEnabled = false;
    }
    _globalFunctions() {
        return `
        function reverse(a) {
            var result = a;
            if (a instanceof Array) {
                result = a.reverse();
            } else if (typeof a === 'string') {
                result = a.split('').reverse().join('');
            }
            return result;
        }
        function sum(a,b) {
            var total = 0;
            if (a instanceof Array) { 
                a.map(function(k) {
                    total += sum(k, b);
                });
            } else if (typeof a === 'object') {
                if (b.indexOf('.')>0) {
                    var t = a;
                    b.split('.').map(function(k){
                        total+=sum( t[k], b.substring(k.length+1) );
                    });
                } else if(a[b]) {
                    var t = a[b];
                    total += (typeof t === 'number') ? t : parseFloat(t);
                } 
            } else if (typeof a === 'number') {
                total = a;
            } 
            return total;
        }
        function count(a,b) {
            var total = 0;
            if (a instanceof Array) { 
                a.map(function(k) {
                    total += count(k, b);
                });
            } else if (typeof a === 'object') {
                Object.keys(a).map(function(k){
                    total += count(a[k],b);
                });
            } else if (typeof a === 'string') {
                total = a.split(b).length - 1;
            } else if (a === b) {
                total++;
            }
            return total;
        }
        function like(a, b) {
            var result = undefined;
            if (a instanceof Array) {
                result = [];
                a.map(function(k) {
                    result.push(like(k, b));
                });
            } else if (typeof a === 'object') {
                result = [];
                Object.keys(a).map(function(k){
                    result.push(like(a[k], b));
                });
            } else if (typeof a === 'string') {
                if (a.indexOf(b) > -1) {
                    result = a;
                }
            } else if (a === b) {
                result = a;
            }
            return result;
        }
        function as(a, b) {
            if (asList[b] === undefined) {
                asList[b] = [a];
            } else {
                asList[b].push(a);
            }
            return a;
        }
        function is_in(a, b, list) {
            var result = undefined;
            if (b instanceof Array) { 
                result = [];
                b.map(function(k) {
                    result.push(is_in(k, list));
                });
            } else if (typeof b === 'object') {
                result = [];
                Object.keys(b).map(function(k) {
                    result.push(is_in(b[k], list));
                });
            } else if (asList[list]){
                asList[list].map(function(t) {
                    if (typeof t ==='string') {
                        if (t.indexOf(b) > -1) {
                            result = a;
                        }
                    }
                });
            }
            return result;
        }
        `;
    }
    /*
    * Will normalize the given xml out of additional #text or #cdata-section nodes.
    * @param value the xml to be normailzed.
    * @param deepXml if cdata-section should be parsed.
    * @return normalized xml.
    */
    _normalize(value, deepXml) {
        if (value instanceof Array) {
            const result = [];
            value.map((item) => {
                result.push(this._normalize(item, deepXml));
            });
            value = result;
        }
        else if (typeof value === 'object') {
            let items = Object.keys(value);
            if (items.length === 1 && !(value[items[0]] instanceof Array)) {
                if (value['#text']) {
                    value = value['#text'];
                }
                else if (value['#cdata-section']) {
                    value = value['#cdata-section'];
                    if (deepXml) {
                        try {
                            const xml = new xmldom.DOMParser().parseFromString(value);
                            value = (xml.documentElement && xml.documentElement != null) ?
                                this._xml2json(xml.documentElement) :
                                value;
                        }
                        catch (e) {
                        }
                    }
                }
            }
            else {
                const result = {};
                items.map((item) => {
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
    _valueOfJsonPath(path, data, as, deepXml, clause) {
        let result;
        let x = this._normalize(data, deepXml);
        path.map((subkey) => {
            let node = x;
            if (node && node instanceof Array) {
                const t = [];
                if (subkey.sort) {
                    node = subkey.sort(node);
                }
                node.map((item) => {
                    if (typeof item === 'object') {
                        if (subkey.key.length) {
                            x = subkey.key.length ? item[subkey.key] : item;
                            if (x && subkey.validated) {
                                let r = true;
                                subkey.validated.map(v => {
                                    const z = v(x, as);
                                    if (typeof z === 'boolean') {
                                        if (z == false) {
                                            r = false;
                                        }
                                    }
                                    else {
                                        x = z;
                                    }
                                });
                                if (r && x) {
                                    t.push(x);
                                }
                                else {
                                    x = undefined;
                                }
                            }
                        }
                        else {
                            if (subkey.validated) {
                                let r = true;
                                subkey.validated.map(v => {
                                    const z = v(item, as);
                                    if (typeof z === 'boolean') {
                                        if (z == false) {
                                            r = false;
                                        }
                                    }
                                    else {
                                        item = z;
                                    }
                                });
                                if (r && item) {
                                    t.push(item);
                                }
                                else {
                                    x = undefined;
                                }
                            }
                            else {
                                t.push(item);
                            }
                        }
                    }
                    else if (subkey.key.length && (typeof item === 'string')) {
                        item.split('.').map((str) => {
                            if (str.indexOf(subkey.key) >= 0) {
                                t.push(str);
                            }
                        });
                    }
                });
                x = t;
                result = x;
            }
            else if (node && (typeof node === 'object')) {
                x = x ?
                    clause(node, subkey.key, subkey.key.length ? x[subkey.key] : x) :
                    undefined;
                if (x && x instanceof Array) {
                    const t = [];
                    if (subkey.sort) {
                        x = subkey.sort(x);
                    }
                    x.map((item) => {
                        if (subkey.validated) {
                            let r = true;
                            subkey.validated.map(v => {
                                const z = v(item, as);
                                if (typeof z === 'boolean') {
                                    if (z == false) {
                                        r = false;
                                    }
                                }
                                else {
                                    item = z;
                                }
                            });
                            if (r && item) {
                                t.push(item);
                            }
                            else {
                                x = undefined;
                            }
                        }
                    });
                    x = t;
                    result = x;
                }
                else if (x) {
                    if (subkey.validated) {
                        let r = true;
                        subkey.validated.map(v => {
                            const z = v(x, as);
                            if (typeof z === 'boolean') {
                                if (z == false) {
                                    r = false;
                                }
                            }
                            else {
                                x = z;
                            }
                        });
                        if (r && x) {
                            result = x;
                        }
                        else {
                            x = undefined;
                        }
                    }
                    else {
                        result = x;
                    }
                }
            }
            else if (node && (typeof node === 'string') && subkey.key.length) {
                result = [];
                node.split('.').map((item) => {
                    if (item.indexOf(subkey.key) >= 0) {
                        result.push(item);
                    }
                });
            }
            else {
                result = node;
            }
        });
        return result;
    }
    _get(path) {
        const url = this.SERVICE_PATH + path;
        const dot = path.lastIndexOf('.');
        const ext = dot < 0 ? undefined : path.toLowerCase().substr(dot);
        const headers = new HttpHeaders();
        let result;
        headers.set('Access-Control-Allow-Origin', '*');
        if (ext === '.xml') {
            headers.set('Content-Type', 'text; charset=utf-8').set('Accept', 'text');
            result = this.http.get(url, { headers, responseType: 'text' })
                .pipe(map((res) => {
                const xml = new xmldom.DOMParser().parseFromString(res);
                const json = this._xml2json(xml.documentElement);
                return json;
            }));
        }
        else if (ext === '.txt') {
            headers.set('Content-Type', 'text; charset=utf-8').set('Accept', 'text');
            result = this.http.get(url, { headers, responseType: 'text' }).pipe(map((res) => res));
        }
        else if (ext === '.json') {
            headers.set('Content-Type', 'json; charset=utf-8').set('Accept', 'json');
            result = this.http.get(url, { headers }).pipe(map((res) => res));
        }
        else {
            headers.set('Content-Type', 'text; charset=utf-8').set('Accept', 'text');
            result = this.http.get(url, { headers, responseType: 'text' })
                .pipe(map((res) => {
                let parsed;
                try {
                    parsed = JSON.parse(res);
                }
                catch (e) {
                    try {
                        const xml = new xmldom.DOMParser().parseFromString(res);
                        parsed = this._xml2json(xml.documentElement);
                    }
                    catch (e2) {
                        parsed = res;
                    }
                }
                ;
                return parsed ? parsed : res;
            }));
        }
        return result;
    }
    _stringValueOfKey(key) {
        let result = [];
        if (key instanceof Array) {
            key.map((item) => {
                if (item instanceof Array) {
                    let x = [];
                    item.map((subitem) => {
                        if (subitem.key.length) {
                            x.push(subitem.key);
                        }
                    });
                    result.push(x.join('.'));
                }
                else if (typeof item === 'string') {
                    const i = item.indexOf('[');
                    const j = item.indexOf(']');
                    const k = item.length > (j + 1) ? 2 : 1;
                    result.push(i > 0 ? item.substring(0, i) : j > 0 ? item.substring(j + k) : item);
                }
                else if (item.key.length) {
                    result.push(item.key);
                }
            });
            result = result.join(',');
            result = result.indexOf('.') < 0 ? result.replace(/\,/g, '.') : result;
        }
        else {
            result = key.key;
        }
        return result;
    }
    _addToResult(value, key, operation, action) {
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
            }
            else if (opk && (opk instanceof Array) === false) {
                operation.result[path][key2] = [opk];
                op = operation.result[path];
            }
            value = this._normalize(value, action.deepXml);
            if (op[key2]) {
                if (typeof value === 'object') {
                    if (JSON.stringify(value) !== JSON.stringify(op[key2][0])) {
                        op[key2].push(value[key2] ? value[key2] : value);
                    }
                }
                else {
                    op[key2].push(value[key2] ? value[key2] : value);
                }
            }
            else {
                if ((op instanceof Array) === false) {
                    operation.result[path] = [op];
                    operation.result[path].push(value[key2] ? value[key2] : value);
                }
                else {
                    if (typeof value === 'object') {
                        if (JSON.stringify(value) !== JSON.stringify(op[0])) {
                            op.push(value[key2] ? value[key2] : value);
                        }
                    }
                    else {
                        op.push(value[key2] ? value[key2] : value);
                    }
                }
            }
        }
        else {
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
    _pack(result) {
        if (result instanceof Array) {
            const list = [];
            result.map((item) => {
                list.push(this._pack(item));
            });
            result = list;
        }
        else if (typeof result === 'object') {
            const keys = Object.keys(result);
            keys.map((key) => {
                const item = result[key];
                if (item instanceof Array) {
                }
                else if (item[key]) {
                    result[key] = item[key];
                }
            });
        }
        return result;
    }
    _triggerResult(promise, as, result) {
        const x = this._pack(result);
        let saveAs;
        if (as) {
            if (typeof as === 'string') {
                saveAs = {};
                saveAs[as] = x;
            }
            else if (typeof as === 'object') {
                saveAs = as;
            }
        }
        promise.next(x);
        return saveAs;
    }
    _subquery(promise, path, operation, action) {
        if (operation.cachedFiles[path] === undefined) {
            // one of the keys at this level could be referencing the same file which
            // is not yet fetched. need to wait till it is available.
            operation.cachedFiles[path] = new BehaviorSubject(null);
            this._queryIteration(operation.cachedFiles[path], operation, {
                path: action.path,
                in: action.in,
                deepXml: action.deepXml,
                join: action.join,
                handler: action.handler,
                queryItems: (action.path instanceof Array) ? action.path.length : 1
            }, path);
        }
        // wait for result raised above.
        operation.cachedFiles[path].subscribe((source) => {
            if (source) {
                const opkeyi = action.join ? action.join[action.path] : undefined;
                if (opkeyi) {
                    if (source instanceof Array) {
                        source.map((item) => {
                            this._subquery(promise, item, operation, {
                                path: opkeyi.path,
                                in: opkeyi.in == undefined ? action.in : (opkeyi.in + item),
                                deepXml: opkeyi.deepXml,
                                join: opkeyi.join,
                                handler: opkeyi.handler,
                                queryItems: (opkeyi.path instanceof Array) ? opkeyi.path.length : 1
                            });
                        });
                    }
                    else {
                        this._subquery(promise, source, operation, {
                            path: action.join[opkeyi.path],
                            in: opkeyi.in == undefined ? action.in : (opkeyi.in + source),
                            deepXml: action.deepXml,
                            join: opkeyi.join,
                            handler: opkeyi.handler,
                            queryItems: (opkeyi.path instanceof Array) ? opkeyi.path.length : 1
                        });
                    }
                }
                else if (this._addToResult(source, action.path, operation, action)) {
                    action.queryItems--;
                    if (action.queryItems === 0) {
                        operation.as = this._triggerResult(promise, operation.as, operation.result);
                    }
                }
                else {
                    action.queryItems--;
                    operation.as = this._triggerResult(promise, operation.as, operation.result);
                }
            }
        }, (error) => {
            if (this.logEnabled) {
                console.log(error);
            }
            action.queryItems--;
            operation.as = this._triggerResult(promise, operation.as, operation.result);
        });
    }
    /*
    * Iterates through a chain query.
    * @param promise The promise which original caller is waiting for.
    * @param operation data for keeping track of the iteration.
    * @param action contains: {path: current keys to query for, in: current query path, handler: resolver method}.
    * @param cacheNamed The cached name from previous iteration if any.
    * @returns returns none.
    */
    _queryIteration(promise, operation, action, cacheNamed) {
        if (!action.handler) {
            action.handler = (node, path, value) => value;
        }
        this._select(action.path, action.in, action.deepXml, operation.as, action.handler).subscribe((data) => {
            if (data) {
                if (cacheNamed) {
                    // result of n-th level call to be placed on previous level cache reference.
                    operation.cachedFiles[cacheNamed].next(data);
                }
                else {
                    if (data instanceof Array) {
                        const operationalKey = action.join ? action.join[action.path] : undefined;
                        if (operationalKey) {
                            // assumption is the resulting list is a list of file paths.
                            data.map((content) => {
                                const path = content['#text'] ? content['#text'] : content;
                                let size = (operationalKey.path instanceof Array) ? operationalKey.path.length : 1;
                                if (operationalKey.in == undefined) {
                                    operation.cachedFiles[path] = this._select(operationalKey.path, action.in, operationalKey.deepXml, operation.as, operationalKey.handler);
                                    size--;
                                }
                                this._subquery(promise, path, operation, {
                                    path: operationalKey.path,
                                    in: operationalKey.in == undefined ? action.in : (operationalKey.in + content),
                                    deepXml: operationalKey.deepXml,
                                    join: operationalKey.join,
                                    handler: operationalKey.handler,
                                    queryItems: size
                                });
                            });
                        }
                        else {
                            // no more query in the chain.
                            action.queryItems--;
                            if (action.queryItems === 0) {
                                const result = operation.result ? operation.result : {};
                                operation.as = this._triggerResult(promise, operation.as, Object.keys(operation.result).length ? operation.result : data);
                            }
                        }
                    }
                    else if (typeof data === 'object') {
                        Object.keys(data).map((key) => {
                            const content = data[key];
                            const operationalKey = action.join ? action.join[key] : undefined;
                            if (content && content.length && operationalKey) {
                                let size = (operationalKey.path instanceof Array) ? operationalKey.path.length : 1;
                                if (operationalKey.in == undefined) {
                                    operation.cachedFiles[content] = this._select(operationalKey.path, action.in, operationalKey.deepXml, operation.as, operationalKey.handler);
                                    size--;
                                }
                                this._subquery(promise, content, operation, {
                                    path: operationalKey.path,
                                    in: operationalKey.in == undefined ? action.in : (operationalKey.in + content),
                                    deepXml: operationalKey.deepXml,
                                    handler: operationalKey.handler,
                                    queryItems: size
                                });
                            }
                            else {
                                action.queryItems--;
                                if (content) {
                                    if (!operation.result) {
                                        operation.result = {};
                                    }
                                    if (operation.result instanceof Array) {
                                        operation.result.push(content);
                                    }
                                    else {
                                        operation.result[key] = content;
                                    }
                                }
                                if (action.queryItems === 0) {
                                    operation.as = this._triggerResult(promise, operation.as, Object.keys(operation.result).length ? operation.result : data);
                                }
                            }
                        });
                    }
                    else {
                        action.queryItems--;
                        if (action.queryItems === 0) {
                            if (Object.keys(operation.result).length === 0 && data !== undefined) {
                                operation.result = data;
                            }
                        }
                        operation.as = this._triggerResult(promise, operation.as, operation.result);
                    }
                }
            }
        }, (error) => {
            promise.error({
                message: 'failed to query ' + action.path,
                reason: error.message ? error.message : error
            });
            action.queryItems--;
            if (action.queryItems === 0) {
                operation.as = this._triggerResult(promise, operation.as, operation.result);
            }
        });
    }
    _makeArguments(key) {
        const list = key.split('.');
        const result = [];
        list.map((item) => {
            const b = item.indexOf('[');
            if (b < 0) {
                result.push({
                    key: item,
                    validated: [(data, as) => true]
                });
            }
            else {
                let str = item.substring(b + 1, item.length - 1);
                const vList = str.split('][');
                const object = {
                    key: item.substring(0, b),
                    validated: [(data, as) => true]
                };
                vList.map((filter) => {
                    filter = filter.replace(/\`/g, '.');
                    filter = filter.replace(/\@/g, 'data');
                    if (filter.indexOf('order-by:') > -1) {
                        const arg = filter.substring(filter.indexOf('order-by:') + 10).trim();
                        const arglist = arg.split('~');
                        const key = arglist[0].trim();
                        const order = arglist[1] ? arglist[1].trim().toLowerCase() : 'asc';
                        object['sort'] = function (array) {
                            const _valueOf = (key, p) => {
                                key.split('.').map((x) => { p = p[x]; });
                                return p;
                            };
                            return array.sort(function (a, b) {
                                const flag = _valueOf(key, a) > _valueOf(key, b);
                                return flag ? (order === 'asc' ? 1 : -1) : (order === 'asc' ? -1 : 1);
                            });
                        };
                    }
                    else {
                        const t = filter.indexOf('&&') > 0 || filter.indexOf('||') > 0;
                        let f = 'return function (data, asList) { \n';
                        f += this._globalFunctions();
                        f += 'var x = false;\n try{\n x = ';
                        f += (t ? '(' + filter + ')' : filter) + '; \n}catch(e){}\n return x;\n}';
                        object['validated'].push(new Function(f)());
                    }
                });
                result.push(object);
            }
        });
        return result;
    }
    _handleSpecialCharacters(path) {
        let result = [];
        path.split(']').map((item) => {
            const bindex = item.indexOf('[');
            if (bindex >= 0) {
                let x = '';
                if (bindex > 0) {
                    x += item.substring(0, bindex);
                }
                x += item.substring(bindex).replace(/\./g, '`');
                result.push(x);
            }
            else {
                result.push(item);
            }
        });
        return result.join(']');
    }
    _prepareJsonPath(path) {
        let result;
        if (path instanceof Array) {
            result = [];
            path.map((i) => {
                const x = this._handleSpecialCharacters(i);
                result.push(this._makeArguments(x));
            });
        }
        else {
            const x = this._handleSpecialCharacters(path);
            result = this._makeArguments(x);
        }
        return result;
    }
    _select(path, from, deepXml, as, clause) {
        const dataStore = new BehaviorSubject(null);
        this._get(from).subscribe((data) => {
            let result;
            const jpath = this._prepareJsonPath(path);
            if (!clause) {
                clause = (node, path, value) => value;
            }
            if (path instanceof Array) {
                result = {};
                jpath.map((pathItem) => {
                    const y = this._valueOfJsonPath(pathItem, data, as, deepXml, clause);
                    if (y) {
                        let key = this._stringValueOfKey(pathItem);
                        result[key] = y;
                    }
                });
                if (Object.keys(result).length === 0) {
                    result = undefined;
                }
            }
            else if (typeof path === 'string') {
                result = this._valueOfJsonPath(jpath, data, as, deepXml, clause);
            }
            if (result) {
                dataStore.next(result);
            }
            else {
                dataStore.error('Result not found for ' + path);
            }
        }, (error) => {
            dataStore.error(error);
        });
        return dataStore;
    }
    /*
    * Will convert the xml into a json.
    * @param xml XML to be converted.
    * @returns returns converted JSON.
    */
    _xml2json(xml) {
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
                    }
                    else {
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
            }
            else {
                const text = xml.textContent.trim().replace(/(?:\r\n|\r|\n|\t)/g, '');
                obj = text.length ? text : undefined;
            }
            return obj;
        }
        catch (e) {
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
    chainSelect(chainQuery) {
        const size = (chainQuery.path instanceof Array) ? chainQuery.path.length : 1;
        const operation = { cachedFiles: {}, as: {}, result: {} };
        const dataStore = new BehaviorSubject(null);
        operation.cachedFiles[chainQuery.path] = dataStore;
        this._queryIteration(dataStore, operation, {
            path: chainQuery.path,
            in: chainQuery.in,
            deepXml: chainQuery.deepXml,
            join: chainQuery.join,
            handler: chainQuery.handler,
            queryItems: size
        });
        return dataStore;
    }
    /*
    * Will group file paths if they are similar to avoid multiple calls.
    * @param list A list of Json {paths, in, deepXml} structures. deepXml is optional.
    * @param clause A method by which value(s) for the path(s) could be evaluated. the caller would evaluate the value for a given attribute.
    * @returns returns an observable. the caller should subscribe to this in order to receive the result.
    */
    arraySelect(list, clause) {
        const groupedList = {};
        list.map((item) => {
            if (groupedList[item.in] === undefined) {
                groupedList[item.in] = [];
            }
            groupedList[item.in].push({ path: item.path, deepXml: item.deepXml });
        });
        const dataStore = new BehaviorSubject(null);
        Object.keys(groupedList).map((url) => {
            this._select(groupedList[url].path, url, groupedList[url].deepXml, undefined, clause).subscribe((data) => {
                if (data) {
                    dataStore.next(data);
                }
            }, (error) => {
                dataStore.error(error);
            });
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
    select(path, from, deepXml, clause) {
        return this._select(path, from, deepXml, undefined, clause);
    }
};
WizardQueryService.ctorParameters = () => [
    { type: HttpClient }
];
WizardQueryService = tslib_1.__decorate([
    Injectable()
], WizardQueryService);
export { WizardQueryService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLXF1ZXJ5LnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VkZWgvd2l6YXJkLXF1ZXJ5LyIsInNvdXJjZXMiOlsic3JjL2FwcC93aXphcmQtcXVlcnkvd2l6YXJkLXF1ZXJ5LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFvQ0U7QUFDRixPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxVQUFVLEVBQUUsV0FBVyxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFFN0QsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ25DLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDckMsT0FBTyxLQUFLLE1BQU0sTUFBTSxRQUFRLENBQUM7QUFXakMsSUFBYSxrQkFBa0IsR0FBL0IsTUFBYSxrQkFBa0I7SUFLM0IsWUFDVSxJQUFnQjtRQUFoQixTQUFJLEdBQUosSUFBSSxDQUFZO1FBSm5CLGlCQUFZLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLGVBQVUsR0FBRyxLQUFLLENBQUM7SUFNMUIsQ0FBQztJQUVPLGdCQUFnQjtRQUNwQixPQUFPOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1NBb0dOLENBQUM7SUFDTixDQUFDO0lBRUQ7Ozs7O01BS0U7SUFDTSxVQUFVLENBQUMsS0FBVSxFQUFFLE9BQWdCO1FBQzNDLElBQUksS0FBSyxZQUFZLEtBQUssRUFBRTtZQUN4QixNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7WUFDbEIsS0FBSyxDQUFDLEdBQUcsQ0FBRSxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUNoQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUks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LEVBQUUsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUMzRixDQUFDLElBQVMsRUFBRSxFQUFFO2dCQUNWLElBQUksSUFBSSxFQUFFO29CQUNOLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ3hCO1lBQ0wsQ0FBQyxFQUNELENBQUMsS0FBVSxFQUFFLEVBQUU7Z0JBQ1gsU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMzQixDQUFDLENBQ0osQ0FBQztRQUNOLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUVEOzs7Ozs7OztNQVFFO0lBQ0YsTUFBTSxDQUNGLElBQVMsRUFDVCxJQUFZLEVBQ1osT0FBZ0IsRUFDaEIsTUFBd0I7UUFFeEIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNoRSxDQUFDO0NBQ0osQ0FBQTs7WUF2OEJtQixVQUFVOztBQU5qQixrQkFBa0I7SUFEOUIsVUFBVSxFQUFFO0dBQ0Esa0JBQWtCLENBNjhCOUI7U0E3OEJZLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4qIFF1ZXJ5IHNlcnZpY2UgcHJvdmlkZXMgYSB3YXkgdG8gcXVlcnkgYSByZW1vdGUgSlNPTiBvciBYTUwgZmlsZS4gSXQgY2FuIGJlIHVzZWQgaW4gZm9sbG93aW5nIHdheXMuXG4qXG4qIDEpIFdpdGggc2VsZWN0KCkgbWV0aG9kLCBhIHNpbmdsZSBwYXRoIG9yIGEgbGlzdCBvZiBwYXRocyBjYW4gYmUgZ2l2ZW4uIGVhY2ggcGF0aCB3aWxsIGJlIGEganNvbiBxdWFsaWZ5aW5nXG4qIHBhdGggdG8gYW4gZW5kIG5vZGUgKGkuZS4sICdib29rcy5ib29rLnRpdGxlJykuIElmIG11bHRpcGxlIHBhdGhzIGFyZSBzdXBwbGllZCwgcXVlcnkgcmVzdWx0IHdpbGwgYmUgYSBqc29uXG4qIG9iamVjdCB3aGVyZSBlYWNoIGF0dHJpYnV0ZSB3aWxsIGJlIGEgZ2l2ZW4gcXVlcnkgcGF0aCBhbmQgaXRzIHZhbHVlIHdpbGwgYmUgcXVlcnkgcmVzdWx0IGZvciB0aGF0IHBhdGguXG4qIEZvciBleGFtcGxlOlxuKiBzZWxlY3QoWydib29rcy5ib29rLnRpdGxlJywgJ2Jvb2tzLmJvb2suYXV0aG9yJ10sICcvZXhhbXBsZTEueG1sJywgZmFsc2UpXG4qIHdpbGwgcmVzdWx0IGluIHsnYm9va3MuYm9vay50aXRsZSc6IFtdLCAnYm9va3MuYm9vay5hdXRob3InOiBbXX0uXG4qIEVhY2ggcmVzdWx0IHdpbGwgbm90IGNvLXJlbGF0ZWQgd2l0aCBvdGhlciByZXN1bHQgaW4gb3JkZXIgb3IgaW4gYW55IG90aGVyIGZvcm0uIGlmIGEgY2xhdXNlIGFyZ3VtZW50IGlzXG4qIHN1cHBsaWVkLCBpdCB3aWxsIGJlIGludm9rZWQgdG8gZnVydGhlciBhc3Npc3QgaW4gZmlsdGVyaW5nIHRoZSBxdWVyeSByZXN1bHQuIGZvciBleGFtcGxlIGlmIGNlcnRhaW4gY2F0ZWdvcnlcbiogb2YgYm9va3MgYXJlIHJlcXVpcmVkLCB0aGUgY2xhdXNlIGZ1bmN0aW9uIGNhbiBsb29rIGZvciBhIGJvb2sgY2F0ZWdvcnkgYXR0cmlidXRlIGFuZCByZXR1cm4gdGhlIHF1ZXJ5IHJlc3VsdFxuKiBpZiBhY2NlcHRhYmxlIG9yIHVuZGVmaW5lZCBpZiByZXN1bHQgc2hvdWxkIGJlIGZpbHRlcmVkIG91dCBvZiB0aGUgcmVzdWx0LlxuKlxuKiAyKSBXaXRoIGFycmF5U2VsZWN0KCkgbWV0aG9kLCBhbiBhcnJheSBvZiB7cGF0aDogJycsIGluOicnLCBkZWVwWG1sOiB0cnVlfSBjYW4gYmUgc3VwcGxpZWQsIGVhY2ggZW50cnkgd2lsbCBiZSBldmFsdWF0ZWRcbiogYXMgaWYgc2VsZWN0KCkgbWV0aG9kIGlzIGludm9rZWQuIEJ1dCBmaXJzdCwgcmVxdWVzdHMgd2l0aCBzaW1pbGFyIHBhdGhzIHdpbGwgYmUgbWVyZ2VkIGludG8gb25lIGNhbGwuICBUaGlzXG4qIG1ldGhvZCBpcyB1c2VmdWwgd2hlbiBwYXRocyBhcmUgZHluYW1pY2x5IGdpdmVuIGFuZCBpdCBpcyBub3QgY2xlYXIgaW4gYWR2YW5jZSBpZiB0aGVyZSBhcmUgcmVxdWVzdHMgd2l0aFxuKiBzaW1pbGFyIHBhdGhzLiBkZWVwWG1sIGF0dHJpYnV0ZSBpcyBvcHRpb25hbC5cbipcbiogMykgV2l0aCBjaGFpblNlbGVjdCgpIG1ldGhvZCwgYSBjaGFpbmVkIHNldCBvZiB7cGF0aDogJycsIGluOiAnJywgZGVlcFhtbDogdHJ1ZX0gaXMgZ2l2ZW4gaW4gYSBqc29uIG9iamVjdC4gV2hlbiByZXN1bHQgb2ZcbiogYSBxdWVyeSBiZWNvbWVzIGF2YWlsYWJsZSwgdGhlIHJlcXVlc3QganNvbiB3aWxsIGJlIGV4YW1pbmVkIHRvIHNlZSBpZiBhIHJlcXVlc3QgZm9yIHRoZSBrZXkgaXMgYXZhaWxhYmxlLiBJZlxuKiBzbywgdGhlbiB0aGUgJ2luJyBmb3IgdGhlIHBhdGggd2lsbCBiZSBwcmVwZW5kZWQgdG8gdGhlIHJlc3VsdGluZyB2YWx1ZSBvZiB0aGUgcHJldmlvdXMgcXVlcnkuICwgZGVlcFhtbCBhdHRyaWJ1dGUgaXMgXG4qIG9wdGlvbmFsLiBUaGlzIG1ldGhvZCBpcyB1c2VmdWwgd2hlbiByZXN1bHQgb2YgYSBxdWVyeSBpcyBhIGpzb24gb3IgYW4geG1sIGZpbGUgYW5kIGFkZGl0aW9uYWwgcXVlcnkgaXMgbmVlZGVkIFxuKiBmdXJ0aGVyIGRvd24gaW4gdGhlIHByZWNlZWRpbmcgZmlsZXMuIEZvciBleGFtcGxlIHRoZSBhc3N1bXB0aW9uIGluIHRoZSBmb2xsb3dpbmcgY2FsbCBpcyB0aGF0IGVhY2ggYm9va3MuYm9vayBcbiogcmVzdWx0IHdpbGwgYmUgYSBmaWxlIG5hbWUgYW5kIHRoZSBmaWxlIHBhdGggZm9yIGVhY2ggcmVzdWx0IGlzICcvc2FtcGxlcy9ib29rcy8nLlxuKiBjaGFpblNlbGVjdCh7XG4qICAgcGF0aDogJ2Jvb2tzLmJvb2snLFxuKiAgIGluOiAnc2FtcGxlMS54bWwnLFxuKiAgIGRlZXBYbWw6IHRydWUsXG4qICAgJ2Jvb2tzLmJvb2snOiB7XG4qICAgICAgIGluOiAnL3NhbXBsZXMvYm9va3MvJyxcbiogICAgICAgcGF0aDogWydwdWJsaWNhdGlvbi50aXRsZScsICdwdWJsaWNhdGlvbi5hdXRob3InXSxcbiogICAgICAgaGFuZGxlcjogdGhpcy5idWJsaWNhdGlvbkhhbmRsZXJcbiogICB9KVxuKiBpZiBhIGhhbmRsZXIgaXMgc3VwcGxpZWQsIGl0IHdpbGwgYmUgdXNlZCB0byBmaWx0ZXIgb3V0IGFueSByZXN1bHQgdGhhdCBpcyBub3QgYWNjZXB0YWJsZS5cbipcbiovXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtIdHRwQ2xpZW50LCBIdHRwSGVhZGVyc30gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuXG5pbXBvcnQge21hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtCZWhhdmlvclN1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0ICogYXMgeG1sZG9tIGZyb20gJ3htbGRvbSc7XG5cbi8qXG4qIEBwYXJhbSBub2RlIFRoZSBwYXJlbnQgbm9kZS4gaXQgY2FuIGJlIHVzZWQgdG8gZXZhbHVhdGUgYmFzZWQgb24gb3RoZXIgYXR0cmlidXRlcyBpbiB0aGUgbm9kZS5cbiogQHBhcmFtIHBhdGggYXR0cmlidXRlIHRvIGJlIGV4YW1pbmVkLlxuKiBAcGFyYW0gdmFsdWUgdGhlIHZhbHVlIG9mIHRoZSBwYXRoLiBpdCBjb3VsZCBiZSB1bmRlZmluZWQsIGEgbGl0ZXJhbCwgb3IgYSBsaXN0LlxuKiBAcmV0dXJucyByZXR1cm5zIHRoZSB2YWx1ZSBvciBmaWx0ZXJlZCB2ZXJzaW9uIG9mIHRoZSB2YWx1ZSBvciB1bmRlZmluZWQgb3RoZXJ3aXNlLlxuKi9cbmV4cG9ydCB0eXBlIGNsYXVzZUV2YWx1YXRvciA9IChub2RlOiBhbnksIHBhdGg6IHN0cmluZywgdmFsdWU6IGFueSkgPT4gYW55O1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgV2l6YXJkUXVlcnlTZXJ2aWNlIHtcblxuICAgIHB1YmxpYyBTRVJWSUNFX1BBVEggPSAnJztcbiAgICBwdWJsaWMgbG9nRW5hYmxlZCA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnRcbiAgICApIHtcblxuICAgIH1cblxuICAgIHByaXZhdGUgX2dsb2JhbEZ1bmN0aW9ucygpIHtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgZnVuY3Rpb24gcmV2ZXJzZShhKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gYTtcbiAgICAgICAgICAgIGlmIChhIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBhLnJldmVyc2UoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gYS5zcGxpdCgnJykucmV2ZXJzZSgpLmpvaW4oJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBzdW0oYSxiKSB7XG4gICAgICAgICAgICB2YXIgdG90YWwgPSAwO1xuICAgICAgICAgICAgaWYgKGEgaW5zdGFuY2VvZiBBcnJheSkgeyBcbiAgICAgICAgICAgICAgICBhLm1hcChmdW5jdGlvbihrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvdGFsICs9IHN1bShrLCBiKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGEgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgaWYgKGIuaW5kZXhPZignLicpPjApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHQgPSBhO1xuICAgICAgICAgICAgICAgICAgICBiLnNwbGl0KCcuJykubWFwKGZ1bmN0aW9uKGspe1xuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWwrPXN1bSggdFtrXSwgYi5zdWJzdHJpbmcoay5sZW5ndGgrMSkgKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKGFbYl0pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHQgPSBhW2JdO1xuICAgICAgICAgICAgICAgICAgICB0b3RhbCArPSAodHlwZW9mIHQgPT09ICdudW1iZXInKSA/IHQgOiBwYXJzZUZsb2F0KHQpO1xuICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgIHRvdGFsID0gYTtcbiAgICAgICAgICAgIH0gXG4gICAgICAgICAgICByZXR1cm4gdG90YWw7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gY291bnQoYSxiKSB7XG4gICAgICAgICAgICB2YXIgdG90YWwgPSAwO1xuICAgICAgICAgICAgaWYgKGEgaW5zdGFuY2VvZiBBcnJheSkgeyBcbiAgICAgICAgICAgICAgICBhLm1hcChmdW5jdGlvbihrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvdGFsICs9IGNvdW50KGssIGIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhhKS5tYXAoZnVuY3Rpb24oayl7XG4gICAgICAgICAgICAgICAgICAgIHRvdGFsICs9IGNvdW50KGFba10sYik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIHRvdGFsID0gYS5zcGxpdChiKS5sZW5ndGggLSAxO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhID09PSBiKSB7XG4gICAgICAgICAgICAgICAgdG90YWwrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0b3RhbDtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBsaWtlKGEsIGIpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBpZiAoYSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gW107XG4gICAgICAgICAgICAgICAgYS5tYXAoZnVuY3Rpb24oaykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChsaWtlKGssIGIpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGEgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gW107XG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoYSkubWFwKGZ1bmN0aW9uKGspe1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChsaWtlKGFba10sIGIpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgaWYgKGEuaW5kZXhPZihiKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IGE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChhID09PSBiKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gYTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gYXMoYSwgYikge1xuICAgICAgICAgICAgaWYgKGFzTGlzdFtiXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYXNMaXN0W2JdID0gW2FdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhc0xpc3RbYl0ucHVzaChhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBhO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGlzX2luKGEsIGIsIGxpc3QpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBpZiAoYiBpbnN0YW5jZW9mIEFycmF5KSB7IFxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IFtdO1xuICAgICAgICAgICAgICAgIGIubWFwKGZ1bmN0aW9uKGspIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goaXNfaW4oaywgbGlzdCkpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYiA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBbXTtcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhiKS5tYXAoZnVuY3Rpb24oaykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChpc19pbihiW2tdLCBsaXN0KSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFzTGlzdFtsaXN0XSl7XG4gICAgICAgICAgICAgICAgYXNMaXN0W2xpc3RdLm1hcChmdW5jdGlvbih0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdCA9PT0nc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHQuaW5kZXhPZihiKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gYTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICBgO1xuICAgIH1cblxuICAgIC8qXG4gICAgKiBXaWxsIG5vcm1hbGl6ZSB0aGUgZ2l2ZW4geG1sIG91dCBvZiBhZGRpdGlvbmFsICN0ZXh0IG9yICNjZGF0YS1zZWN0aW9uIG5vZGVzLlxuICAgICogQHBhcmFtIHZhbHVlIHRoZSB4bWwgdG8gYmUgbm9ybWFpbHplZC5cbiAgICAqIEBwYXJhbSBkZWVwWG1sIGlmIGNkYXRhLXNlY3Rpb24gc2hvdWxkIGJlIHBhcnNlZC5cbiAgICAqIEByZXR1cm4gbm9ybWFsaXplZCB4bWwuXG4gICAgKi9cbiAgICBwcml2YXRlIF9ub3JtYWxpemUodmFsdWU6IGFueSwgZGVlcFhtbDogYm9vbGVhbikge1xuICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgICAgICAgICB2YWx1ZS5tYXAoIChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5fbm9ybWFsaXplKGl0ZW0sIGRlZXBYbWwpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFsdWUgPSByZXN1bHQ7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgbGV0IGl0ZW1zOiBhbnkgPSBPYmplY3Qua2V5cyh2YWx1ZSk7XG5cbiAgICAgICAgICAgIGlmIChpdGVtcy5sZW5ndGggPT09IDEgJiYgISh2YWx1ZVtpdGVtc1swXV0gaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWVbJyN0ZXh0J10pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZVsnI3RleHQnXTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlWycjY2RhdGEtc2VjdGlvbiddKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWVbJyNjZGF0YS1zZWN0aW9uJ107XG4gICAgICAgICAgICAgICAgICAgIGlmIChkZWVwWG1sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHhtbCA9IG5ldyB4bWxkb20uRE9NUGFyc2VyKCkucGFyc2VGcm9tU3RyaW5nKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9ICh4bWwuZG9jdW1lbnRFbGVtZW50ICYmIHhtbC5kb2N1bWVudEVsZW1lbnQgIT0gbnVsbCkgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3htbDJqc29uKHhtbC5kb2N1bWVudEVsZW1lbnQpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1jYXRjaChlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgICAgICAgICAgICAgaXRlbXMubWFwKCAoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRbaXRlbV0gPSB0aGlzLl9ub3JtYWxpemUodmFsdWVbaXRlbV0sIGRlZXBYbWwpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHZhbHVlID0gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICAvKlxuICAgICogQHBhcmFtIHBhdGggSlNPTiBwYXRoIHRvIGV2YWx1YXRlLiBBIHBhdGggY291bGQgYmUgZnVsbHkgcXVhbGlmaWVkIGZvciBkZXB0aCBvZiBqc29uIChpLmUuLCAnYS5iLmMnKVxuICAgICogQHBhcmFtIGRhdGEgdGhlIGRhdGEgc291cmNlLlxuICAgICogQHBhcmFtIGRlZXBYbWwgaWYgY2RhdGEtc2VjdGlvbiBzaG91bGQgYmUgcGFyc2VkLlxuICAgICogQHBhcmFtIGNsYXVzZSBBIG1ldGhvZCBieSB3aGljaCB2YWx1ZShzKSBmb3IgdGhlIGtleShzKSBjb3VsZCBiZSBldmFsdWF0ZWQuIHRoZSBjYWxsZXIgd291bGQgZXZhbHVhdGUgdGhlIHZhbHVlIGZvciBhIGdpdmVuIGF0dHJpYnV0ZS5cbiAgICAqIEByZXR1cm5zIHJldHVybnMgZXZsdWF0ZWQgdmFsdWUgZm9yIHRoZSBrZXkgaW4gZGF0YSBzb3VyY2UuXG4gICAgKi9cbiAgICBwcml2YXRlIF92YWx1ZU9mSnNvblBhdGgoXG4gICAgICAgIHBhdGg6IGFueSxcbiAgICAgICAgZGF0YTogYW55LFxuICAgICAgICBhczogYW55LFxuICAgICAgICBkZWVwWG1sOiBib29sZWFuLFxuICAgICAgICBjbGF1c2U/OiBjbGF1c2VFdmFsdWF0b3IpOiBhbnkge1xuXG4gICAgICAgIGxldCByZXN1bHQ6IGFueTtcbiAgICAgICAgbGV0IHggPSB0aGlzLl9ub3JtYWxpemUoZGF0YSwgZGVlcFhtbCk7XG4gICAgICAgIHBhdGgubWFwKCAoc3Via2V5OiBhbnkpID0+IHtcbiAgICAgICAgICAgIGxldCBub2RlID0geDtcbiAgICAgICAgICAgIGlmIChub2RlICYmIG5vZGUgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHQgPSBbXTtcbiAgICAgICAgICAgICAgICBpZiAoc3Via2V5LnNvcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZSA9IHN1YmtleS5zb3J0KG5vZGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBub2RlLm1hcCAoXG4gICAgICAgICAgICAgICAgICAgIChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1YmtleS5rZXkubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHggPSBzdWJrZXkua2V5Lmxlbmd0aCA/IGl0ZW1bc3Via2V5LmtleV0gOiBpdGVtO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoeCAmJiBzdWJrZXkudmFsaWRhdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJrZXkudmFsaWRhdGVkLm1hcCh2ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB6ID0gdih4LCBhcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB6ID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoeiAgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHggPSB6O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHIgJiYgeCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQucHVzaCh4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdWJrZXkudmFsaWRhdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJrZXkudmFsaWRhdGVkLm1hcCh2ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB6ID0gdihpdGVtLCBhcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB6ID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoeiAgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0gPSB6O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHIgJiYgaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3Via2V5LmtleS5sZW5ndGggJiYgKHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnNwbGl0KCcuJykubWFwKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoc3RyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RyLmluZGV4T2Yoc3Via2V5LmtleSkgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQucHVzaChzdHIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB4ID0gdDtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB4O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChub2RlICYmICh0eXBlb2Ygbm9kZSA9PT0gJ29iamVjdCcpKSB7XG4gICAgICAgICAgICAgICAgeCA9IHggP1xuICAgICAgICAgICAgICAgICAgICBjbGF1c2Uobm9kZSwgc3Via2V5LmtleSwgc3Via2V5LmtleS5sZW5ndGggPyB4W3N1YmtleS5rZXldOiAgeCkgOlxuICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgaWYgKHggJiYgeCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHQgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN1YmtleS5zb3J0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB4ID0gc3Via2V5LnNvcnQoeCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgeC5tYXAoXG4gICAgICAgICAgICAgICAgICAgICAgICAoaXRlbTogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1YmtleS52YWxpZGF0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJrZXkudmFsaWRhdGVkLm1hcCh2ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHogPSB2KGl0ZW0sIGFzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgeiA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoeiAgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbSA9IHo7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAociAmJiBpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0LnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB4ID0gdDtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0geDtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN1YmtleS52YWxpZGF0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YmtleS52YWxpZGF0ZWQubWFwKHYgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHogPSB2KHgsIGFzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHogPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih6ICA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeCA9IHo7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAociAmJiB4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0geDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5vZGUgJiYgKHR5cGVvZiBub2RlID09PSAnc3RyaW5nJykgJiYgc3Via2V5LmtleS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBbXTtcbiAgICAgICAgICAgICAgICBub2RlLnNwbGl0KCcuJykubWFwKFxuICAgICAgICAgICAgICAgICAgICAoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uaW5kZXhPZihzdWJrZXkua2V5KSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IG5vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHByaXZhdGUgX2dldChwYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgdXJsID0gdGhpcy5TRVJWSUNFX1BBVEggKyBwYXRoO1xuICAgICAgICBjb25zdCBkb3QgPSBwYXRoLmxhc3RJbmRleE9mKCcuJyk7XG4gICAgICAgIGNvbnN0IGV4dCA9IGRvdCA8IDAgPyB1bmRlZmluZWQgOiBwYXRoLnRvTG93ZXJDYXNlKCkuc3Vic3RyKGRvdCk7XG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoKTtcbiAgICAgICAgbGV0IHJlc3VsdDogYW55O1xuXG4gICAgICAgIGhlYWRlcnMuc2V0KCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nLCAnKicpO1xuXG4gICAgICAgIGlmIChleHQgPT09ICcueG1sJykge1xuICAgICAgICAgICAgaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsICd0ZXh0OyBjaGFyc2V0PXV0Zi04Jykuc2V0KCdBY2NlcHQnLCAndGV4dCcpO1xuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLmdldCh1cmwsIHsgaGVhZGVycywgcmVzcG9uc2VUeXBlOiAndGV4dCcgfSlcbiAgICAgICAgICAgICAgICAucGlwZShtYXAoKHJlcykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB4bWwgPSBuZXcgeG1sZG9tLkRPTVBhcnNlcigpLnBhcnNlRnJvbVN0cmluZyhyZXMpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBqc29uID0gdGhpcy5feG1sMmpzb24oeG1sLmRvY3VtZW50RWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBqc29uO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKGV4dCA9PT0gJy50eHQnKSB7XG4gICAgICAgICAgICBoZWFkZXJzLnNldCgnQ29udGVudC1UeXBlJywgJ3RleHQ7IGNoYXJzZXQ9dXRmLTgnKS5zZXQoJ0FjY2VwdCcsICd0ZXh0Jyk7XG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLmh0dHAuZ2V0KHVybCwgeyBoZWFkZXJzLCByZXNwb25zZVR5cGU6ICd0ZXh0JyB9KS5waXBlKG1hcCgocmVzKSA9PiByZXMpKTtcbiAgICAgICAgfSBlbHNlIGlmIChleHQgPT09ICcuanNvbicpe1xuICAgICAgICAgICAgaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsICdqc29uOyBjaGFyc2V0PXV0Zi04Jykuc2V0KCdBY2NlcHQnLCAnanNvbicpO1xuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLmdldCh1cmwsIHtoZWFkZXJzfSkucGlwZShtYXAoKHJlcykgPT4gcmVzKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBoZWFkZXJzLnNldCgnQ29udGVudC1UeXBlJywgJ3RleHQ7IGNoYXJzZXQ9dXRmLTgnKS5zZXQoJ0FjY2VwdCcsICd0ZXh0Jyk7XG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLmh0dHAuZ2V0KHVybCwgeyBoZWFkZXJzLCByZXNwb25zZVR5cGU6ICd0ZXh0JyB9KVxuICAgICAgICAgICAgICAgIC5waXBlKG1hcCgocmVzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwYXJzZWQ6IGFueTtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlZCA9IEpTT04ucGFyc2UocmVzKTtcbiAgICAgICAgICAgICAgICAgICAgfWNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHhtbCA9IG5ldyB4bWxkb20uRE9NUGFyc2VyKCkucGFyc2VGcm9tU3RyaW5nKHJlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VkID0gdGhpcy5feG1sMmpzb24oeG1sLmRvY3VtZW50RWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlZCA9IHJlcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlZCA/IHBhcnNlZCA6IHJlcztcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHByaXZhdGUgX3N0cmluZ1ZhbHVlT2ZLZXkoa2V5OiBhbnkpIHtcbiAgICAgICAgbGV0IHJlc3VsdDogYW55ID0gW107XG5cbiAgICAgICAgaWYgKGtleSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICBrZXkubWFwKCBcbiAgICAgICAgICAgICAgICAoaXRlbTogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB4ID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLm1hcChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoc3ViaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3ViaXRlbS5rZXkubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4LnB1c2goc3ViaXRlbS5rZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goeC5qb2luKCcuJykpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaSA9IGl0ZW0uaW5kZXhPZignWycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaiA9IGl0ZW0uaW5kZXhPZignXScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgayA9IGl0ZW0ubGVuZ3RoID4gKGogKyAxKSA/IDIgOiAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goaSA+IDAgPyBpdGVtLnN1YnN0cmluZygwLGkpIDogaiA+IDAgPyBpdGVtLnN1YnN0cmluZyhqICsgaykgOiBpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpdGVtLmtleS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGl0ZW0ua2V5KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXN1bHQgPSByZXN1bHQuam9pbignLCcpO1xuICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LmluZGV4T2YoJy4nKSA8IDAgPyByZXN1bHQucmVwbGFjZSgvXFwsL2csICcuJykgOiByZXN1bHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSBrZXkua2V5O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfYWRkVG9SZXN1bHQodmFsdWU6IGFueSwga2V5OiBzdHJpbmcsIG9wZXJhdGlvbjogYW55LCBhY3Rpb246IGFueSkge1xuICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5fc3RyaW5nVmFsdWVPZktleShhY3Rpb24ucGF0aCk7XG4gICAgICAgIGNvbnN0IGtleTIgPSB0aGlzLl9zdHJpbmdWYWx1ZU9mS2V5KGtleSk7XG4gICAgICAgIGxldCBvcCA9IG9wZXJhdGlvbi5yZXN1bHRbcGF0aF07XG4gICAgICAgIGxldCBjb21wbGV0ZSA9IGZhbHNlO1xuICAgIFxuICAgICAgICBpZiAoIW9wKSB7XG4gICAgICAgICAgICBvcGVyYXRpb24ucmVzdWx0W3BhdGhdID0ge307XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wKSB7XG4gICAgICAgICAgICBsZXQgb3BrID0gb3Bba2V5Ml07XG4gICAgICAgICAgICBpZiAob3BlcmF0aW9uWyd0ZW1wJ10gJiZcbiAgICAgICAgICAgICAgICBvcGVyYXRpb25bJ3RlbXAnXVtrZXkyXSkge1xuICAgICAgICAgICAgICAgIG9wW2tleTJdID0gW29wW2tleTJdXTtcbiAgICAgICAgICAgICAgICBkZWxldGUgb3BlcmF0aW9uWyd0ZW1wJ107XG4gICAgICAgICAgICB9ZWxzZSBpZiAob3BrICYmIChvcGsgaW5zdGFuY2VvZiBBcnJheSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uLnJlc3VsdFtwYXRoXVtrZXkyXSA9IFtvcGtdXG4gICAgICAgICAgICAgICAgb3AgPSBvcGVyYXRpb24ucmVzdWx0W3BhdGhdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFsdWUgPSB0aGlzLl9ub3JtYWxpemUodmFsdWUsIGFjdGlvbi5kZWVwWG1sKTtcbiAgICAgICAgICAgIGlmIChvcFtrZXkyXSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChKU09OLnN0cmluZ2lmeSh2YWx1ZSkgIT09IEpTT04uc3RyaW5naWZ5KG9wW2tleTJdWzBdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3Bba2V5Ml0ucHVzaCggdmFsdWVba2V5Ml0gPyB2YWx1ZVtrZXkyXSA6IHZhbHVlICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBvcFtrZXkyXS5wdXNoKCB2YWx1ZVtrZXkyXSA/IHZhbHVlW2tleTJdIDogdmFsdWUgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICgob3AgaW5zdGFuY2VvZiBBcnJheSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5yZXN1bHRbcGF0aF0gPSBbb3BdO1xuICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb24ucmVzdWx0W3BhdGhdLnB1c2goIHZhbHVlW2tleTJdID8gdmFsdWVba2V5Ml0gOiB2YWx1ZSApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoSlNPTi5zdHJpbmdpZnkodmFsdWUpICE9PSBKU09OLnN0cmluZ2lmeShvcFswXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcC5wdXNoKCB2YWx1ZVtrZXkyXSA/IHZhbHVlW2tleTJdIDogdmFsdWUgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wLnB1c2goIHZhbHVlW2tleTJdID8gdmFsdWVba2V5Ml0gOiB2YWx1ZSApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiBhbHJlYWR5IGFuIGFycmF5IHJlbWVtYmVyIGl0LlxuICAgICAgICAgICAgICAgIGlmICghb3BlcmF0aW9uWyd0ZW1wJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uWyd0ZW1wJ10gPSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFvcGVyYXRpb25bJ3RlbXAnXVtrZXkyXSkge1xuICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb25bJ3RlbXAnXVtrZXkyXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3BlcmF0aW9uLnJlc3VsdFtwYXRoXVtrZXkyXSA9IHRoaXMuX25vcm1hbGl6ZSh2YWx1ZSwgYWN0aW9uLmRlZXBYbWwpO1xuICAgICAgICAgICAgY29tcGxldGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb21wbGV0ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9wYWNrKHJlc3VsdDogYW55KSB7XG4gICAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgY29uc3QgbGlzdCA9IFtdO1xuICAgICAgICAgICAgcmVzdWx0Lm1hcChcbiAgICAgICAgICAgICAgICAoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2godGhpcy5fcGFjayhpdGVtKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IGxpc3Q7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHJlc3VsdCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhyZXN1bHQpO1xuICAgICAgICAgICAga2V5cy5tYXAgKFxuICAgICAgICAgICAgICAgIChrZXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IHJlc3VsdFtrZXldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIEFycmF5KSB7XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpdGVtW2tleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gaXRlbVtrZXldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfdHJpZ2dlclJlc3VsdChwcm9taXNlOiBhbnksIGFzOiBhbnksIHJlc3VsdDogYW55KSB7XG4gICAgICAgIGNvbnN0IHggPSB0aGlzLl9wYWNrKHJlc3VsdCk7XG4gICAgICAgIGxldCBzYXZlQXM6IGFueTtcbiAgICAgICAgaWYgKGFzKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGFzID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIHNhdmVBcyA9IHt9O1xuICAgICAgICAgICAgICAgIHNhdmVBc1thc10gPSB4O1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYXMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgc2F2ZUFzID0gYXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcHJvbWlzZS5uZXh0KHgpO1xuICAgICAgICByZXR1cm4gc2F2ZUFzO1xuICAgIH1cblxuICAgIHByaXZhdGUgX3N1YnF1ZXJ5KFxuICAgICAgICBwcm9taXNlOiBhbnksXG4gICAgICAgIHBhdGg6IGFueSxcbiAgICAgICAgb3BlcmF0aW9uOiBhbnksXG4gICAgICAgIGFjdGlvbjogYW55KSB7XG5cbiAgICAgICAgaWYgKG9wZXJhdGlvbi5jYWNoZWRGaWxlc1twYXRoXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBvbmUgb2YgdGhlIGtleXMgYXQgdGhpcyBsZXZlbCBjb3VsZCBiZSByZWZlcmVuY2luZyB0aGUgc2FtZSBmaWxlIHdoaWNoXG4gICAgICAgICAgICAvLyBpcyBub3QgeWV0IGZldGNoZWQuIG5lZWQgdG8gd2FpdCB0aWxsIGl0IGlzIGF2YWlsYWJsZS5cbiAgICAgICAgICAgIG9wZXJhdGlvbi5jYWNoZWRGaWxlc1twYXRoXSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8YW55PihudWxsKTtcbiAgICAgICAgICAgIHRoaXMuX3F1ZXJ5SXRlcmF0aW9uKFxuICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5jYWNoZWRGaWxlc1twYXRoXSxcbiAgICAgICAgICAgICAgICBvcGVyYXRpb24sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBwYXRoOiBhY3Rpb24ucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgaW46IGFjdGlvbi5pbixcbiAgICAgICAgICAgICAgICAgICAgZGVlcFhtbDogYWN0aW9uLmRlZXBYbWwsXG4gICAgICAgICAgICAgICAgICAgIGpvaW46IGFjdGlvbi5qb2luLFxuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyOiBhY3Rpb24uaGFuZGxlcixcbiAgICAgICAgICAgICAgICAgICAgcXVlcnlJdGVtczogKGFjdGlvbi5wYXRoIGluc3RhbmNlb2YgQXJyYXkpID8gYWN0aW9uLnBhdGgubGVuZ3RoIDogMVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcGF0aFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHdhaXQgZm9yIHJlc3VsdCByYWlzZWQgYWJvdmUuXG4gICAgICAgIG9wZXJhdGlvbi5jYWNoZWRGaWxlc1twYXRoXS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAoc291cmNlOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9wa2V5aSA9IGFjdGlvbi5qb2luID8gYWN0aW9uLmpvaW5bYWN0aW9uLnBhdGhdIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICBpZiAob3BrZXlpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc291cmNlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2UubWFwKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3VicXVlcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IG9wa2V5aS5wYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbjogb3BrZXlpLmluID09IHVuZGVmaW5lZCA/IGFjdGlvbi5pbiA6IChvcGtleWkuaW4gKyBpdGVtKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVlcFhtbDogb3BrZXlpLmRlZXBYbWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpvaW46IG9wa2V5aS5qb2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyOiBvcGtleWkuaGFuZGxlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnlJdGVtczogKG9wa2V5aS5wYXRoIGluc3RhbmNlb2YgQXJyYXkpID8gb3BrZXlpLnBhdGgubGVuZ3RoIDogMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N1YnF1ZXJ5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogYWN0aW9uLmpvaW5bb3BrZXlpLnBhdGhdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW46IG9wa2V5aS5pbiA9PSB1bmRlZmluZWQgPyBhY3Rpb24uaW4gOiAob3BrZXlpLmluICsgc291cmNlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZXBYbWw6IGFjdGlvbi5kZWVwWG1sLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgam9pbjogb3BrZXlpLmpvaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyOiBvcGtleWkuaGFuZGxlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5SXRlbXM6IChvcGtleWkucGF0aCBpbnN0YW5jZW9mIEFycmF5KSA/IG9wa2V5aS5wYXRoLmxlbmd0aCA6IDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fYWRkVG9SZXN1bHQoc291cmNlLCBhY3Rpb24ucGF0aCwgb3BlcmF0aW9uLCBhY3Rpb24pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb24ucXVlcnlJdGVtcy0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGlvbi5xdWVyeUl0ZW1zID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLmFzID0gdGhpcy5fdHJpZ2dlclJlc3VsdChwcm9taXNlLCBvcGVyYXRpb24uYXMsIG9wZXJhdGlvbi5yZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb24ucXVlcnlJdGVtcy0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLmFzID0gdGhpcy5fdHJpZ2dlclJlc3VsdChwcm9taXNlLCBvcGVyYXRpb24uYXMsIG9wZXJhdGlvbi5yZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIChlcnJvcjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubG9nRW5hYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFjdGlvbi5xdWVyeUl0ZW1zLS07XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uLmFzID0gdGhpcy5fdHJpZ2dlclJlc3VsdChwcm9taXNlLCBvcGVyYXRpb24uYXMsIG9wZXJhdGlvbi5yZXN1bHQpO1xuICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuICAgIC8qXG4gICAgKiBJdGVyYXRlcyB0aHJvdWdoIGEgY2hhaW4gcXVlcnkuXG4gICAgKiBAcGFyYW0gcHJvbWlzZSBUaGUgcHJvbWlzZSB3aGljaCBvcmlnaW5hbCBjYWxsZXIgaXMgd2FpdGluZyBmb3IuXG4gICAgKiBAcGFyYW0gb3BlcmF0aW9uIGRhdGEgZm9yIGtlZXBpbmcgdHJhY2sgb2YgdGhlIGl0ZXJhdGlvbi5cbiAgICAqIEBwYXJhbSBhY3Rpb24gY29udGFpbnM6IHtwYXRoOiBjdXJyZW50IGtleXMgdG8gcXVlcnkgZm9yLCBpbjogY3VycmVudCBxdWVyeSBwYXRoLCBoYW5kbGVyOiByZXNvbHZlciBtZXRob2R9LlxuICAgICogQHBhcmFtIGNhY2hlTmFtZWQgVGhlIGNhY2hlZCBuYW1lIGZyb20gcHJldmlvdXMgaXRlcmF0aW9uIGlmIGFueS5cbiAgICAqIEByZXR1cm5zIHJldHVybnMgbm9uZS5cbiAgICAqL1xuICAgIHByaXZhdGUgX3F1ZXJ5SXRlcmF0aW9uKFxuICAgICAgICBwcm9taXNlOiBCZWhhdmlvclN1YmplY3Q8YW55PixcbiAgICAgICAgb3BlcmF0aW9uOiBhbnksXG4gICAgICAgIGFjdGlvbjogYW55LFxuICAgICAgICBjYWNoZU5hbWVkPzogc3RyaW5nKSB7XG5cbiAgICAgICAgaWYgKCFhY3Rpb24uaGFuZGxlcikge1xuICAgICAgICAgICAgYWN0aW9uLmhhbmRsZXIgPSAobm9kZTogYW55LCBwYXRoOiBzdHJpbmcsIHZhbHVlOiBhbnkpID0+IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3NlbGVjdChhY3Rpb24ucGF0aCwgYWN0aW9uLmluLCBhY3Rpb24uZGVlcFhtbCwgb3BlcmF0aW9uLmFzLCBhY3Rpb24uaGFuZGxlcikuc3Vic2NyaWJlKFxuICAgICAgICAgICAgKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2FjaGVOYW1lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVzdWx0IG9mIG4tdGggbGV2ZWwgY2FsbCB0byBiZSBwbGFjZWQgb24gcHJldmlvdXMgbGV2ZWwgY2FjaGUgcmVmZXJlbmNlLlxuICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLmNhY2hlZEZpbGVzW2NhY2hlTmFtZWRdLm5leHQoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3BlcmF0aW9uYWxLZXkgPSBhY3Rpb24uam9pbiA/IGFjdGlvbi5qb2luW2FjdGlvbi5wYXRoXSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob3BlcmF0aW9uYWxLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXNzdW1wdGlvbiBpcyB0aGUgcmVzdWx0aW5nIGxpc3QgaXMgYSBsaXN0IG9mIGZpbGUgcGF0aHMuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEubWFwKCAoY29udGVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGF0aCA9IGNvbnRlbnRbJyN0ZXh0J10gPyBjb250ZW50WycjdGV4dCddIDogY29udGVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzaXplID0gKG9wZXJhdGlvbmFsS2V5LnBhdGggaW5zdGFuY2VvZiBBcnJheSkgPyBvcGVyYXRpb25hbEtleS5wYXRoLmxlbmd0aCA6IDE7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcGVyYXRpb25hbEtleS5pbiA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb24uY2FjaGVkRmlsZXNbcGF0aF0gPSB0aGlzLl9zZWxlY3QoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbmFsS2V5LnBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbi5pbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uYWxLZXkuZGVlcFhtbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLmFzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb25hbEtleS5oYW5kbGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaXplIC0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3VicXVlcnkocHJvbWlzZSwgcGF0aCwgb3BlcmF0aW9uLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogb3BlcmF0aW9uYWxLZXkucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbjogb3BlcmF0aW9uYWxLZXkuaW4gPT0gdW5kZWZpbmVkID8gYWN0aW9uLmluIDogKG9wZXJhdGlvbmFsS2V5LmluICsgY29udGVudCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVlcFhtbDogb3BlcmF0aW9uYWxLZXkuZGVlcFhtbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqb2luOiBvcGVyYXRpb25hbEtleS5qb2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXI6IG9wZXJhdGlvbmFsS2V5LmhhbmRsZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnlJdGVtczogc2l6ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5vIG1vcmUgcXVlcnkgaW4gdGhlIGNoYWluLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb24ucXVlcnlJdGVtcy0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aW9uLnF1ZXJ5SXRlbXMgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9b3BlcmF0aW9uLnJlc3VsdCA/IG9wZXJhdGlvbi5yZXN1bHQgOiB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5hcyA9IHRoaXMuX3RyaWdnZXJSZXN1bHQocHJvbWlzZSwgb3BlcmF0aW9uLmFzLCBPYmplY3Qua2V5cyhvcGVyYXRpb24ucmVzdWx0KS5sZW5ndGggPyBvcGVyYXRpb24ucmVzdWx0IDogZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBkYXRhID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGRhdGEpLm1hcCggKGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjb250ZW50ID0gZGF0YVtrZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvcGVyYXRpb25hbEtleSA9IGFjdGlvbi5qb2luID8gYWN0aW9uLmpvaW5ba2V5XTogdW5kZWZpbmVkO1xuICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29udGVudCAmJiBjb250ZW50Lmxlbmd0aCAmJiBvcGVyYXRpb25hbEtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNpemUgPSAob3BlcmF0aW9uYWxLZXkucGF0aCBpbnN0YW5jZW9mIEFycmF5KSA/IG9wZXJhdGlvbmFsS2V5LnBhdGgubGVuZ3RoIDogMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcGVyYXRpb25hbEtleS5pbiA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb24uY2FjaGVkRmlsZXNbY29udGVudF0gPSB0aGlzLl9zZWxlY3QoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbmFsS2V5LnBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbi5pbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uYWxLZXkuZGVlcFhtbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLmFzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb25hbEtleS5oYW5kbGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaXplIC0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3VicXVlcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IG9wZXJhdGlvbmFsS2V5LnBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluOiBvcGVyYXRpb25hbEtleS5pbiA9PSB1bmRlZmluZWQgPyBhY3Rpb24uaW4gOiAob3BlcmF0aW9uYWxLZXkuaW4gKyBjb250ZW50KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVlcFhtbDogb3BlcmF0aW9uYWxLZXkuZGVlcFhtbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlcjogb3BlcmF0aW9uYWxLZXkuaGFuZGxlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnlJdGVtczogc2l6ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb24ucXVlcnlJdGVtcy0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW9wZXJhdGlvbi5yZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLnJlc3VsdCA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob3BlcmF0aW9uLnJlc3VsdCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5yZXN1bHQucHVzaChjb250ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb24ucmVzdWx0W2tleV0gPSBjb250ZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhY3Rpb24ucXVlcnlJdGVtcyA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5hcyA9IHRoaXMuX3RyaWdnZXJSZXN1bHQocHJvbWlzZSwgb3BlcmF0aW9uLmFzLCBPYmplY3Qua2V5cyhvcGVyYXRpb24ucmVzdWx0KS5sZW5ndGggPyBvcGVyYXRpb24ucmVzdWx0IDogZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uLnF1ZXJ5SXRlbXMtLTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aW9uLnF1ZXJ5SXRlbXMgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKG9wZXJhdGlvbi5yZXN1bHQpLmxlbmd0aCA9PT0gMCAmJiBkYXRhICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5yZXN1bHQgPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5hcyA9IHRoaXMuX3RyaWdnZXJSZXN1bHQocHJvbWlzZSwgb3BlcmF0aW9uLmFzLCBvcGVyYXRpb24ucmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAoZXJyb3I6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIHByb21pc2UuZXJyb3Ioe1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnZmFpbGVkIHRvIHF1ZXJ5ICcgKyBhY3Rpb24ucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgcmVhc29uOiBlcnJvci5tZXNzYWdlID8gZXJyb3IubWVzc2FnZSA6IGVycm9yXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgYWN0aW9uLnF1ZXJ5SXRlbXMtLTtcbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uLnF1ZXJ5SXRlbXMgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLmFzID0gdGhpcy5fdHJpZ2dlclJlc3VsdChwcm9taXNlLCBvcGVyYXRpb24uYXMsIG9wZXJhdGlvbi5yZXN1bHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9tYWtlQXJndW1lbnRzKGtleTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGxpc3QgPSBrZXkuc3BsaXQoJy4nKTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgICAgIGxpc3QubWFwKCAoaXRlbSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgYiA9IGl0ZW0uaW5kZXhPZignWycpO1xuICAgICAgICAgICAgaWYgKGIgPCAwKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBrZXk6IGl0ZW0sXG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRlZDogWyhkYXRhOiBhbnksIGFzOiBhbnkpID0+IHRydWVdXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBzdHIgPSBpdGVtLnN1YnN0cmluZyhiICsgMSwgaXRlbS5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgICAgICBjb25zdCB2TGlzdCA9IHN0ci5zcGxpdCgnXVsnKTtcbiAgICAgICAgICAgICAgICBjb25zdCBvYmplY3QgPSB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogaXRlbS5zdWJzdHJpbmcoMCxiKSxcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGVkOiBbKGRhdGE6IGFueSwgYXM6IGFueSkgPT4gdHJ1ZV1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHZMaXN0Lm1hcCggXG4gICAgICAgICAgICAgICAgICAgIChmaWx0ZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlciA9IGZpbHRlci5yZXBsYWNlKC9cXGAvZywgJy4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlciA9IGZpbHRlci5yZXBsYWNlKC9cXEAvZywgJ2RhdGEnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaWx0ZXIuaW5kZXhPZignb3JkZXItYnk6JykgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFyZzogYW55ID0gZmlsdGVyLnN1YnN0cmluZyhmaWx0ZXIuaW5kZXhPZignb3JkZXItYnk6JykgKyAxMCkudHJpbSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFyZ2xpc3QgPSBhcmcuc3BsaXQoJ34nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBhcmdsaXN0WzBdLnRyaW0oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvcmRlcj0gYXJnbGlzdFsxXSA/IGFyZ2xpc3RbMV0udHJpbSgpLnRvTG93ZXJDYXNlKCk6ICdhc2MnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdFsnc29ydCddID0gZnVuY3Rpb24gKGFycmF5OiBhbnkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgX3ZhbHVlT2YgPSAoa2V5OiBzdHJpbmcsIHA6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5LnNwbGl0KCcuJykubWFwKCAoeCkgPT4ge3AgPSBwW3hdfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJyYXkuc29ydChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGE6IGFueSxiOiBhbnkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZsYWcgPV92YWx1ZU9mKGtleSwgYSkgPiBfdmFsdWVPZihrZXksIGIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmbGFnID8gKG9yZGVyID09PSAnYXNjJyA/IDE6IC0xKSA6IChvcmRlciA9PT0gJ2FzYycgPyAtMTogMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHQgPSBmaWx0ZXIuaW5kZXhPZignJiYnKSA+IDAgfHwgZmlsdGVyLmluZGV4T2YoJ3x8JykgPiAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmID0gJ3JldHVybiBmdW5jdGlvbiAoZGF0YSwgYXNMaXN0KSB7IFxcbic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZiArPSB0aGlzLl9nbG9iYWxGdW5jdGlvbnMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmICs9ICd2YXIgeCA9IGZhbHNlO1xcbiB0cnl7XFxuIHggPSAnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGYgKz0gKHQgPyAnKCcgKyBmaWx0ZXIgKyAnKScgOiBmaWx0ZXIpICsgJzsgXFxufWNhdGNoKGUpe31cXG4gcmV0dXJuIHg7XFxufSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0Wyd2YWxpZGF0ZWQnXS5wdXNoKCBuZXcgRnVuY3Rpb24oZikoKSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChvYmplY3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9oYW5kbGVTcGVjaWFsQ2hhcmFjdGVycyhwYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgICAgICBwYXRoLnNwbGl0KCddJykubWFwKFxuICAgICAgICAgICAgKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBiaW5kZXggPSBpdGVtLmluZGV4T2YoJ1snKTtcbiAgICAgICAgICAgICAgICBpZiAoYmluZGV4ID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHggPSAnJztcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBiaW5kZXggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB4ICs9IGl0ZW0uc3Vic3RyaW5nKDAsIGJpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgeCArPSBpdGVtLnN1YnN0cmluZyhiaW5kZXgpLnJlcGxhY2UoL1xcLi9nLCdgJyk7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5qb2luKCddJyk7XG4gICAgfVxuICAgIHByaXZhdGUgX3ByZXBhcmVKc29uUGF0aChwYXRoOiBhbnkpIHtcbiAgICAgICAgbGV0IHJlc3VsdDogYW55O1xuICAgICAgICBpZiAocGF0aCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICByZXN1bHQgPSBbXTtcbiAgICAgICAgICAgIHBhdGgubWFwKFxuICAgICAgICAgICAgICAgIChpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLl9oYW5kbGVTcGVjaWFsQ2hhcmFjdGVycyhpKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5fbWFrZUFyZ3VtZW50cyh4KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLl9oYW5kbGVTcGVjaWFsQ2hhcmFjdGVycyhwYXRoKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuX21ha2VBcmd1bWVudHMoeCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBfc2VsZWN0KFxuICAgICAgICBwYXRoOiBhbnksXG4gICAgICAgIGZyb206IHN0cmluZyxcbiAgICAgICAgZGVlcFhtbDogYm9vbGVhbixcbiAgICAgICAgYXM6IGFueSxcbiAgICAgICAgY2xhdXNlPzogY2xhdXNlRXZhbHVhdG9yKTogQmVoYXZpb3JTdWJqZWN0PGFueT4ge1xuXG4gICAgICAgIGNvbnN0IGRhdGFTdG9yZSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8YW55PihudWxsKTtcblxuICAgICAgICB0aGlzLl9nZXQoZnJvbSkuc3Vic2NyaWJlKFxuICAgICAgICAgICAgKGRhdGE6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCByZXN1bHQ6IGFueTtcbiAgICAgICAgICAgICAgICBjb25zdCBqcGF0aCA9IHRoaXMuX3ByZXBhcmVKc29uUGF0aChwYXRoKTtcblxuICAgICAgICAgICAgICAgIGlmICghY2xhdXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsYXVzZSA9IChub2RlOiBhbnksIHBhdGg6IHN0cmluZywgdmFsdWU6IGFueSkgPT4gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChwYXRoIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0ge307XG4gICAgICAgICAgICAgICAgICAgIGpwYXRoLm1hcCgocGF0aEl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHkgPSB0aGlzLl92YWx1ZU9mSnNvblBhdGgocGF0aEl0ZW0sIGRhdGEsIGFzLCBkZWVwWG1sLCBjbGF1c2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQga2V5ID0gdGhpcy5fc3RyaW5nVmFsdWVPZktleShwYXRoSXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2tleV0gPSB5O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKHJlc3VsdCkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBwYXRoID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB0aGlzLl92YWx1ZU9mSnNvblBhdGgoanBhdGgsIGRhdGEsIGFzLCBkZWVwWG1sLCBjbGF1c2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFTdG9yZS5uZXh0KHJlc3VsdCk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkYXRhU3RvcmUuZXJyb3IoJ1Jlc3VsdCBub3QgZm91bmQgZm9yICcgKyBwYXRoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgKGVycm9yOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBkYXRhU3RvcmUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gZGF0YVN0b3JlO1xuICAgIH1cblxuICAgIC8qXG4gICAgKiBXaWxsIGNvbnZlcnQgdGhlIHhtbCBpbnRvIGEganNvbi5cbiAgICAqIEBwYXJhbSB4bWwgWE1MIHRvIGJlIGNvbnZlcnRlZC5cbiAgICAqIEByZXR1cm5zIHJldHVybnMgY29udmVydGVkIEpTT04uXG4gICAgKi9cbiAgICBwcml2YXRlIF94bWwyanNvbih4bWw6IGFueSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IG9iaiA9IHt9O1xuICAgICAgICAgICAgaWYgKHhtbC5hdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYyA9IHhtbC5hdHRyaWJ1dGVzO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGF0dHIgPSBjW2ldO1xuICAgICAgICAgICAgICAgIG9ialthdHRyLm5hbWVdID0gYXR0ci52YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoeG1sLmNoaWxkTm9kZXMgJiYgeG1sLmNoaWxkTm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB4bWwuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0geG1sLmNoaWxkTm9kZXNbaV07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5vZGVOYW1lID0gaXRlbS5ub2RlTmFtZTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAob2JqW25vZGVOYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmcmFnbWVudCA9IHRoaXMuX3htbDJqc29uKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZyYWdtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYmpbbm9kZU5hbWVdID0gZnJhZ21lbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqW25vZGVOYW1lXS5wdXNoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvbGQgPSBvYmpbbm9kZU5hbWVdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqW25vZGVOYW1lXSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ialtub2RlTmFtZV0ucHVzaChvbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZnJhZ21lbnQgPSB0aGlzLl94bWwyanNvbihpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmcmFnbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ialtub2RlTmFtZV0ucHVzaChmcmFnbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRleHQgPSB4bWwudGV4dENvbnRlbnQudHJpbSgpLnJlcGxhY2UoLyg/OlxcclxcbnxcXHJ8XFxufFxcdCkvZywgJycpO1xuICAgICAgICAgICAgICAgIG9iaiA9IHRleHQubGVuZ3RoID8gdGV4dCA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmxvZ0VuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlLm1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLypcbiAgICAqIFdpbGwgZG8gYSBjaGFpbiBxdWVyeSBvbiBzcGVjaWZpZWQgcGF0aHMgZnJvbSByZW1vdGUgbG9jYXRpb24uXG4gICAgKiBAcGFyYW0gY2hhaW5RdWVyeSBBIEpzb24gc3RydWN0dXJlIHdpdGggcGF0aHMuIEVhY2ggcGF0aCB3aWxsIGNvbnRhaW4gYSBjaGFpbiBvZiBpbnN0cnVjdGlvbnMuXG4gICAgKiBFYWNoIGluc3RydWN0aW9uIHdpbGwgaGF2ZSBhICdpbicgdG8gYSBmaWxlIGFuZCBhIHBhdGggdG8gc2VhcmNoIG9uIGl0IChzZWUuIHNlbGVjdCgpKS4gb25jZSB0aGVcbiAgICAqIHJlc3VsdCBpcyBpbiwgdGhlIG5leHQgaW5zdHJ1Y3Rpb24gaW4gdGhlIHBhdGggY2hhaW4gd2lsbCBiZSB0cmlnZ2VkLiBBZnRlciB0aGUgcGF0aCB0aHJvdWdoIGFsbFxuICAgICogY2hhaW5lZCBwYXRocyBpcyBjb21wbGV0ZWQsIHJlc3VsdGluZyB2YWx1ZSB3aWxsIGJlIHB1dCBpbiBhIGpzb24gd2hlcmUgaXRzIHBhdGggaXMgdGhlIG9yaWdpbmFsXG4gICAgKiBqc29uIHBhdGggYW5kIGl0cyB2YWx1ZSB3aWxsIGJlIHRoZSByZXN1bHRpbmcgdmFsdWUuXG4gICAgKlxuICAgICogdGhpcyBpcyBub3QgZnVsbHkgdGVzdGVkLiBjYWxsZXIgc2hvdWxkIHBhc3Mgc29tZXRoaW5nIGxpa2VcbiAgICAqIHtwYXRoOiBbcGF0aDEscGF0aDJdLCBpbjogJ3NvbWV0aGluZyBvciBibGFuaycsIGRlZXBYbWw6IHRydWUsIGpvaW46IHtrMToge3BhdGg6IHBhdGgzLCBpbjogJ3NvbWV0aGluZyBvciBwbGFuaycsIGNsYXVzZTogZnVuY3Rpb259fX1cbiAgICAqIGlmIHBhdGgxIG9yIHBhdGgyIG9yIHBhdGgzIGFyZSBmb3VuZCBhdCB0aGUgcm9vdCBvYmplY3QsIGEgY2hhaW4gcmVhY3Rpb24gdG8gZmV0Y2ggZGVlcCB3aWxsIGZvbGxvdy4gQW5cbiAgICAqIG9wdGlvbmFsIGNsYXVzZSB3aWxsIGhlbHAgcmVzb2x2ZSBjb21wbGV4IHNpdHVhdGlvbnMuXG4gICAgKlxuICAgICogQHJldHVybnMgcmV0dXJucyBhbiBvYnNlcnZhYmxlLiB0aGUgY2FsbGVyIHNob3VsZCBzdWJzY3JpYmUgdG8gdGhpcyBpbiBvcmRlciB0byByZWNlaXZlIHRoZSByZXN1bHQuXG4gICAgKi9cbiAgICBjaGFpblNlbGVjdChjaGFpblF1ZXJ5OiBhbnkpOiBCZWhhdmlvclN1YmplY3Q8YW55PiB7XG4gICAgICAgIGNvbnN0IHNpemUgPSAoY2hhaW5RdWVyeS5wYXRoIGluc3RhbmNlb2YgQXJyYXkpID8gIGNoYWluUXVlcnkucGF0aC5sZW5ndGggOiAxO1xuICAgICAgICBjb25zdCBvcGVyYXRpb24gPSB7Y2FjaGVkRmlsZXM6IHt9LCBhczoge30sIHJlc3VsdDoge319O1xuICAgICAgICBjb25zdCBkYXRhU3RvcmUgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGFueT4obnVsbCk7XG5cbiAgICAgICAgb3BlcmF0aW9uLmNhY2hlZEZpbGVzW2NoYWluUXVlcnkucGF0aF0gPSBkYXRhU3RvcmU7XG4gICAgICAgIHRoaXMuX3F1ZXJ5SXRlcmF0aW9uKFxuICAgICAgICAgICAgZGF0YVN0b3JlLFxuICAgICAgICAgICAgb3BlcmF0aW9uLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHBhdGg6IGNoYWluUXVlcnkucGF0aCxcbiAgICAgICAgICAgICAgICBpbjogY2hhaW5RdWVyeS5pbixcbiAgICAgICAgICAgICAgICBkZWVwWG1sOiBjaGFpblF1ZXJ5LmRlZXBYbWwsXG4gICAgICAgICAgICAgICAgam9pbjogY2hhaW5RdWVyeS5qb2luLFxuICAgICAgICAgICAgICAgIGhhbmRsZXI6IGNoYWluUXVlcnkuaGFuZGxlcixcbiAgICAgICAgICAgICAgICBxdWVyeUl0ZW1zOiBzaXplXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBkYXRhU3RvcmU7XG4gICAgfVxuXG4gICAgLypcbiAgICAqIFdpbGwgZ3JvdXAgZmlsZSBwYXRocyBpZiB0aGV5IGFyZSBzaW1pbGFyIHRvIGF2b2lkIG11bHRpcGxlIGNhbGxzLlxuICAgICogQHBhcmFtIGxpc3QgQSBsaXN0IG9mIEpzb24ge3BhdGhzLCBpbiwgZGVlcFhtbH0gc3RydWN0dXJlcy4gZGVlcFhtbCBpcyBvcHRpb25hbC5cbiAgICAqIEBwYXJhbSBjbGF1c2UgQSBtZXRob2QgYnkgd2hpY2ggdmFsdWUocykgZm9yIHRoZSBwYXRoKHMpIGNvdWxkIGJlIGV2YWx1YXRlZC4gdGhlIGNhbGxlciB3b3VsZCBldmFsdWF0ZSB0aGUgdmFsdWUgZm9yIGEgZ2l2ZW4gYXR0cmlidXRlLlxuICAgICogQHJldHVybnMgcmV0dXJucyBhbiBvYnNlcnZhYmxlLiB0aGUgY2FsbGVyIHNob3VsZCBzdWJzY3JpYmUgdG8gdGhpcyBpbiBvcmRlciB0byByZWNlaXZlIHRoZSByZXN1bHQuXG4gICAgKi9cbiAgICBhcnJheVNlbGVjdChcbiAgICAgICAgbGlzdDogYW55LFxuICAgICAgICBjbGF1c2U/OiBjbGF1c2VFdmFsdWF0b3IpOiBCZWhhdmlvclN1YmplY3Q8YW55PiAge1xuICAgICAgICBjb25zdCBncm91cGVkTGlzdCA9IHt9O1xuICAgICAgICBsaXN0Lm1hcCggKGl0ZW06IGFueSkgPT4ge1xuICAgICAgICAgICAgaWYgKGdyb3VwZWRMaXN0W2l0ZW0uaW5dID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBncm91cGVkTGlzdFtpdGVtLmluXSA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZ3JvdXBlZExpc3RbaXRlbS5pbl0ucHVzaCh7cGF0aDogaXRlbS5wYXRoLCBkZWVwWG1sOiBpdGVtLmRlZXBYbWx9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGRhdGFTdG9yZSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8YW55PihudWxsKTtcblxuICAgICAgICBPYmplY3Qua2V5cyhncm91cGVkTGlzdCkubWFwICggKHVybCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fc2VsZWN0KGdyb3VwZWRMaXN0W3VybF0ucGF0aCwgdXJsLCBncm91cGVkTGlzdFt1cmxdLmRlZXBYbWwsIHVuZGVmaW5lZCwgY2xhdXNlKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAgICAgKGRhdGE6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVN0b3JlLm5leHQoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIChlcnJvcjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFTdG9yZS5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBkYXRhU3RvcmU7XG4gICAgfVxuXG4gICAgLypcbiAgICAqIFdpbGwgcXVlcnkgcGF0aCBmcm9tIGEgcmVtb3RlIGxvY2F0aW9uIHF1YWxpZmllZCB0aHJvdWdoIGFuIG9wdGlvbmFsIGNsYXVzZSBmdW5jdGlvbiB0aGF0XG4gICAgKiBldmFsdWF0ZXMsIGZpbHRlcnMsIG9yIHNvcnRzIHRoZSByZXN1bCBvZiB0aGUgcXVlcnkuXG4gICAgKiBAcGFyYW0gcGF0aCBBIGEgc2luZ2xlIEpTT04gcGF0aCBvciBsaXN0IG9mIHBhdGhzIHRvIHNlbGVjdCAoaS5lLiwgJ2EuYi5jJylcbiAgICAqIEBwYXJhbSBmcm9tIEEgcmVmZXJlbmNlIFVSTCB0byBhIHJlbW90ZSBzb3VyY2UuXG4gICAgKiBAcGFyYW0gZGVlcFhtbCBpZiBjZGF0YS1zZWN0aW9uIHNob3VsZCBiZSBwYXJzZWQuXG4gICAgKiBAcGFyYW0gY2xhdXNlIEEgbWV0aG9kIGJ5IHdoaWNoIHZhbHVlKHMpIGZvciB0aGUgcGF0aChzKSBjb3VsZCBiZSBldmFsdWF0ZWQuIHRoZSBjYWxsZXIgd291bGQgZXZhbHVhdGUgdGhlIHZhbHVlIGZvciBhIGdpdmVuIGF0dHJpYnV0ZS5cbiAgICAqIEByZXR1cm5zIHJldHVybnMgYW4gb2JzZXJ2YWJsZS4gdGhlIGNhbGxlciBzaG91bGQgc3Vic2NyaWJlIHRvIHRoaXMgaW4gb3JkZXIgdG8gcmVjZWl2ZSB0aGUgcmVzdWx0LlxuICAgICovXG4gICAgc2VsZWN0KFxuICAgICAgICBwYXRoOiBhbnksXG4gICAgICAgIGZyb206IHN0cmluZyxcbiAgICAgICAgZGVlcFhtbDogYm9vbGVhbixcbiAgICAgICAgY2xhdXNlPzogY2xhdXNlRXZhbHVhdG9yKTogQmVoYXZpb3JTdWJqZWN0PGFueT4ge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3QocGF0aCwgZnJvbSwgZGVlcFhtbCwgdW5kZWZpbmVkLCBjbGF1c2UpO1xuICAgIH1cbn1cbiJdfQ==