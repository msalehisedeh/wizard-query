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
var WizardQueryService = /** @class */ (function () {
    function WizardQueryService(http) {
        this.http = http;
        this.SERVICE_PATH = '';
        this.logEnabled = false;
    }
    WizardQueryService.prototype._globalFunctions = function () {
        return "\n        function reverse(a) {\n            var result = a;\n            if (a instanceof Array) {\n                result = a.reverse();\n            } else if (typeof a === 'string') {\n                result = a.split('').reverse().join('');\n            }\n            return result;\n        }\n        function sum(a,b) {\n            var total = 0;\n            if (a instanceof Array) { \n                a.map(function(k) {\n                    total += sum(k, b);\n                });\n            } else if (typeof a === 'object') {\n                if (b.indexOf('.')>0) {\n                    var t = a;\n                    b.split('.').map(function(k){\n                        total+=sum( t[k], b.substring(k.length+1) );\n                    });\n                } else if(a[b]) {\n                    var t = a[b];\n                    total += (typeof t === 'number') ? t : parseFloat(t);\n                } \n            } else if (typeof a === 'number') {\n                total = a;\n            } \n            return total;\n        }\n        function count(a,b) {\n            var total = 0;\n            if (a instanceof Array) { \n                a.map(function(k) {\n                    total += count(k, b);\n                });\n            } else if (typeof a === 'object') {\n                Object.keys(a).map(function(k){\n                    total += count(a[k],b);\n                });\n            } else if (typeof a === 'string') {\n                total = a.split(b).length - 1;\n            } else if (a === b) {\n                total++;\n            }\n            return total;\n        }\n        function like(a, b) {\n            var result = undefined;\n            if (a instanceof Array) {\n                result = [];\n                a.map(function(k) {\n                    result.push(like(k, b));\n                });\n            } else if (typeof a === 'object') {\n                result = [];\n                Object.keys(a).map(function(k){\n                    result.push(like(a[k], b));\n                });\n            } else if (typeof a === 'string') {\n                if (a.indexOf(b) > -1) {\n                    result = a;\n                }\n            } else if (a === b) {\n                result = a;\n            }\n            return result;\n        }\n        function as(a, b) {\n            if (asList[b] === undefined) {\n                asList[b] = [a];\n            } else {\n                asList[b].push(a);\n            }\n            return a;\n        }\n        function is_in(a, b, list) {\n            var result = undefined;\n            if (b instanceof Array) { \n                result = [];\n                b.map(function(k) {\n                    result.push(is_in(k, list));\n                });\n            } else if (typeof b === 'object') {\n                result = [];\n                Object.keys(b).map(function(k) {\n                    result.push(is_in(b[k], list));\n                });\n            } else if (asList[list]){\n                asList[list].map(function(t) {\n                    if (typeof t ==='string') {\n                        if (t.indexOf(b) > -1) {\n                            result = a;\n                        }\n                    }\n                });\n            }\n            return result;\n        }\n        ";
    };
    /*
    * Will normalize the given xml out of additional #text or #cdata-section nodes.
    * @param value the xml to be normailzed.
    * @param deepXml if cdata-section should be parsed.
    * @return normalized xml.
    */
    WizardQueryService.prototype._normalize = function (value, deepXml) {
        var _this = this;
        if (value instanceof Array) {
            var result_1 = [];
            value.map(function (item) {
                result_1.push(_this._normalize(item, deepXml));
            });
            value = result_1;
        }
        else if (typeof value === 'object') {
            var items = Object.keys(value);
            if (items.length === 1 && !(value[items[0]] instanceof Array)) {
                if (value['#text']) {
                    value = value['#text'];
                }
                else if (value['#cdata-section']) {
                    value = value['#cdata-section'];
                    if (deepXml) {
                        try {
                            var xml = new xmldom.DOMParser().parseFromString(value);
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
                var result_2 = {};
                items.map(function (item) {
                    result_2[item] = _this._normalize(value[item], deepXml);
                });
                value = result_2;
            }
        }
        return value;
    };
    /*
    * @param path JSON path to evaluate. A path could be fully qualified for depth of json (i.e., 'a.b.c')
    * @param data the data source.
    * @param deepXml if cdata-section should be parsed.
    * @param clause A method by which value(s) for the key(s) could be evaluated. the caller would evaluate the value for a given attribute.
    * @returns returns evluated value for the key in data source.
    */
    WizardQueryService.prototype._valueOfJsonPath = function (path, data, as, deepXml, clause) {
        var result;
        var x = this._normalize(data, deepXml);
        path.map(function (subkey) {
            var node = x;
            if (node && node instanceof Array) {
                var t_1 = [];
                if (subkey.sort) {
                    node = subkey.sort(node);
                }
                node.map(function (item) {
                    if (typeof item === 'object') {
                        if (subkey.key.length) {
                            x = subkey.key.length ? item[subkey.key] : item;
                            if (x && subkey.validated) {
                                var r_1 = true;
                                subkey.validated.map(function (v) {
                                    var z = v(x, as);
                                    if (typeof z === 'boolean') {
                                        if (z == false) {
                                            r_1 = false;
                                        }
                                    }
                                    else {
                                        x = z;
                                    }
                                });
                                if (r_1 && x) {
                                    t_1.push(x);
                                }
                                else {
                                    x = undefined;
                                }
                            }
                        }
                        else {
                            if (subkey.validated) {
                                var r_2 = true;
                                subkey.validated.map(function (v) {
                                    var z = v(item, as);
                                    if (typeof z === 'boolean') {
                                        if (z == false) {
                                            r_2 = false;
                                        }
                                    }
                                    else {
                                        item = z;
                                    }
                                });
                                if (r_2 && item) {
                                    t_1.push(item);
                                }
                                else {
                                    x = undefined;
                                }
                            }
                            else {
                                t_1.push(item);
                            }
                        }
                    }
                    else if (subkey.key.length && (typeof item === 'string')) {
                        item.split('.').map(function (str) {
                            if (str.indexOf(subkey.key) >= 0) {
                                t_1.push(str);
                            }
                        });
                    }
                });
                x = t_1;
                result = x;
            }
            else if (node && (typeof node === 'object')) {
                x = x ?
                    clause(node, subkey.key, subkey.key.length ? x[subkey.key] : x) :
                    undefined;
                if (x && x instanceof Array) {
                    var t_2 = [];
                    if (subkey.sort) {
                        x = subkey.sort(x);
                    }
                    x.map(function (item) {
                        if (subkey.validated) {
                            var r_3 = true;
                            subkey.validated.map(function (v) {
                                var z = v(item, as);
                                if (typeof z === 'boolean') {
                                    if (z == false) {
                                        r_3 = false;
                                    }
                                }
                                else {
                                    item = z;
                                }
                            });
                            if (r_3 && item) {
                                t_2.push(item);
                            }
                            else {
                                x = undefined;
                            }
                        }
                    });
                    x = t_2;
                    result = x;
                }
                else if (x) {
                    if (subkey.validated) {
                        var r_4 = true;
                        subkey.validated.map(function (v) {
                            var z = v(x, as);
                            if (typeof z === 'boolean') {
                                if (z == false) {
                                    r_4 = false;
                                }
                            }
                            else {
                                x = z;
                            }
                        });
                        if (r_4 && x) {
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
                node.split('.').map(function (item) {
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
    };
    WizardQueryService.prototype._get = function (path) {
        var _this = this;
        var url = this.SERVICE_PATH + path;
        var dot = path.lastIndexOf('.');
        var ext = dot < 0 ? undefined : path.toLowerCase().substr(dot);
        var headers = new HttpHeaders();
        var result;
        headers.set('Access-Control-Allow-Origin', '*');
        if (ext === '.xml') {
            headers.set('Content-Type', 'text; charset=utf-8').set('Accept', 'text');
            result = this.http.get(url, { headers: headers, responseType: 'text' })
                .pipe(map(function (res) {
                var xml = new xmldom.DOMParser().parseFromString(res);
                var json = _this._xml2json(xml.documentElement);
                return json;
            }));
        }
        else if (ext === '.txt') {
            headers.set('Content-Type', 'text; charset=utf-8').set('Accept', 'text');
            result = this.http.get(url, { headers: headers, responseType: 'text' }).pipe(map(function (res) { return res; }));
        }
        else if (ext === '.json') {
            headers.set('Content-Type', 'json; charset=utf-8').set('Accept', 'json');
            result = this.http.get(url, { headers: headers }).pipe(map(function (res) { return res; }));
        }
        else {
            headers.set('Content-Type', 'text; charset=utf-8').set('Accept', 'text');
            result = this.http.get(url, { headers: headers, responseType: 'text' })
                .pipe(map(function (res) {
                var parsed;
                try {
                    parsed = JSON.parse(res);
                }
                catch (e) {
                    try {
                        var xml = new xmldom.DOMParser().parseFromString(res);
                        parsed = _this._xml2json(xml.documentElement);
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
    };
    WizardQueryService.prototype._stringValueOfKey = function (key) {
        var result = [];
        if (key instanceof Array) {
            key.map(function (item) {
                if (item instanceof Array) {
                    var x_1 = [];
                    item.map(function (subitem) {
                        if (subitem.key.length) {
                            x_1.push(subitem.key);
                        }
                    });
                    result.push(x_1.join('.'));
                }
                else if (typeof item === 'string') {
                    var i = item.indexOf('[');
                    var j = item.indexOf(']');
                    var k = item.length > (j + 1) ? 2 : 1;
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
    };
    WizardQueryService.prototype._addToResult = function (value, key, operation, action) {
        var path = this._stringValueOfKey(action.path);
        var key2 = this._stringValueOfKey(key);
        var op = operation.result[path];
        var complete = false;
        if (!op) {
            operation.result[path] = {};
        }
        if (op) {
            var opk = op[key2];
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
    };
    WizardQueryService.prototype._pack = function (result) {
        var _this = this;
        if (result instanceof Array) {
            var list_1 = [];
            result.map(function (item) {
                list_1.push(_this._pack(item));
            });
            result = list_1;
        }
        else if (typeof result === 'object') {
            var keys = Object.keys(result);
            keys.map(function (key) {
                var item = result[key];
                if (item instanceof Array) {
                }
                else if (item[key]) {
                    result[key] = item[key];
                }
            });
        }
        return result;
    };
    WizardQueryService.prototype._triggerResult = function (promise, as, result) {
        var x = this._pack(result);
        var saveAs;
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
    };
    WizardQueryService.prototype._subquery = function (promise, path, operation, action) {
        var _this = this;
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
        operation.cachedFiles[path].subscribe(function (source) {
            if (source) {
                var opkeyi_1 = action.join ? action.join[action.path] : undefined;
                if (opkeyi_1) {
                    if (source instanceof Array) {
                        source.map(function (item) {
                            _this._subquery(promise, item, operation, {
                                path: opkeyi_1.path,
                                in: opkeyi_1.in == undefined ? action.in : (opkeyi_1.in + item),
                                deepXml: opkeyi_1.deepXml,
                                join: opkeyi_1.join,
                                handler: opkeyi_1.handler,
                                queryItems: (opkeyi_1.path instanceof Array) ? opkeyi_1.path.length : 1
                            });
                        });
                    }
                    else {
                        _this._subquery(promise, source, operation, {
                            path: action.join[opkeyi_1.path],
                            in: opkeyi_1.in == undefined ? action.in : (opkeyi_1.in + source),
                            deepXml: action.deepXml,
                            join: opkeyi_1.join,
                            handler: opkeyi_1.handler,
                            queryItems: (opkeyi_1.path instanceof Array) ? opkeyi_1.path.length : 1
                        });
                    }
                }
                else if (_this._addToResult(source, action.path, operation, action)) {
                    action.queryItems--;
                    if (action.queryItems === 0) {
                        operation.as = _this._triggerResult(promise, operation.as, operation.result);
                    }
                }
                else {
                    action.queryItems--;
                    operation.as = _this._triggerResult(promise, operation.as, operation.result);
                }
            }
        }, function (error) {
            if (_this.logEnabled) {
                console.log(error);
            }
            action.queryItems--;
            operation.as = _this._triggerResult(promise, operation.as, operation.result);
        });
    };
    /*
    * Iterates through a chain query.
    * @param promise The promise which original caller is waiting for.
    * @param operation data for keeping track of the iteration.
    * @param action contains: {path: current keys to query for, in: current query path, handler: resolver method}.
    * @param cacheNamed The cached name from previous iteration if any.
    * @returns returns none.
    */
    WizardQueryService.prototype._queryIteration = function (promise, operation, action, cacheNamed) {
        var _this = this;
        if (!action.handler) {
            action.handler = function (node, path, value) { return value; };
        }
        this._select(action.path, action.in, action.deepXml, operation.as, action.handler).subscribe(function (data) {
            if (data) {
                if (cacheNamed) {
                    // result of n-th level call to be placed on previous level cache reference.
                    operation.cachedFiles[cacheNamed].next(data);
                }
                else {
                    if (data instanceof Array) {
                        var operationalKey_1 = action.join ? action.join[action.path] : undefined;
                        if (operationalKey_1) {
                            // assumption is the resulting list is a list of file paths.
                            data.map(function (content) {
                                var path = content['#text'] ? content['#text'] : content;
                                var size = (operationalKey_1.path instanceof Array) ? operationalKey_1.path.length : 1;
                                if (operationalKey_1.in == undefined) {
                                    operation.cachedFiles[path] = _this._select(operationalKey_1.path, action.in, operationalKey_1.deepXml, operation.as, operationalKey_1.handler);
                                    size--;
                                }
                                _this._subquery(promise, path, operation, {
                                    path: operationalKey_1.path,
                                    in: operationalKey_1.in == undefined ? action.in : (operationalKey_1.in + content),
                                    deepXml: operationalKey_1.deepXml,
                                    join: operationalKey_1.join,
                                    handler: operationalKey_1.handler,
                                    queryItems: size
                                });
                            });
                        }
                        else {
                            // no more query in the chain.
                            action.queryItems--;
                            if (action.queryItems === 0) {
                                var result = operation.result ? operation.result : {};
                                operation.as = _this._triggerResult(promise, operation.as, Object.keys(operation.result).length ? operation.result : data);
                            }
                        }
                    }
                    else if (typeof data === 'object') {
                        Object.keys(data).map(function (key) {
                            var content = data[key];
                            var operationalKey = action.join ? action.join[key] : undefined;
                            if (content && content.length && operationalKey) {
                                var size = (operationalKey.path instanceof Array) ? operationalKey.path.length : 1;
                                if (operationalKey.in == undefined) {
                                    operation.cachedFiles[content] = _this._select(operationalKey.path, action.in, operationalKey.deepXml, operation.as, operationalKey.handler);
                                    size--;
                                }
                                _this._subquery(promise, content, operation, {
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
                                    operation.as = _this._triggerResult(promise, operation.as, Object.keys(operation.result).length ? operation.result : data);
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
                        operation.as = _this._triggerResult(promise, operation.as, operation.result);
                    }
                }
            }
        }, function (error) {
            promise.error({
                message: 'failed to query ' + action.path,
                reason: error.message ? error.message : error
            });
            action.queryItems--;
            if (action.queryItems === 0) {
                operation.as = _this._triggerResult(promise, operation.as, operation.result);
            }
        });
    };
    WizardQueryService.prototype._makeArguments = function (key) {
        var _this = this;
        var list = key.split('.');
        var result = [];
        list.map(function (item) {
            var b = item.indexOf('[');
            if (b < 0) {
                result.push({
                    key: item,
                    validated: [function (data, as) { return true; }]
                });
            }
            else {
                var str = item.substring(b + 1, item.length - 1);
                var vList = str.split('][');
                var object_1 = {
                    key: item.substring(0, b),
                    validated: [function (data, as) { return true; }]
                };
                vList.map(function (filter) {
                    filter = filter.replace(/\`/g, '.');
                    filter = filter.replace(/\@/g, 'data');
                    if (filter.indexOf('order-by:') > -1) {
                        var arg = filter.substring(filter.indexOf('order-by:') + 10).trim();
                        var arglist = arg.split('~');
                        var key_1 = arglist[0].trim();
                        var order_1 = arglist[1] ? arglist[1].trim().toLowerCase() : 'asc';
                        object_1['sort'] = function (array) {
                            var _valueOf = function (key, p) {
                                key.split('.').map(function (x) { p = p[x]; });
                                return p;
                            };
                            return array.sort(function (a, b) {
                                var flag = _valueOf(key_1, a) > _valueOf(key_1, b);
                                return flag ? (order_1 === 'asc' ? 1 : -1) : (order_1 === 'asc' ? -1 : 1);
                            });
                        };
                    }
                    else {
                        var t = filter.indexOf('&&') > 0 || filter.indexOf('||') > 0;
                        var f = 'return function (data, asList) { \n';
                        f += _this._globalFunctions();
                        f += 'var x = false;\n try{\n x = ';
                        f += (t ? '(' + filter + ')' : filter) + '; \n}catch(e){}\n return x;\n}';
                        object_1['validated'].push(new Function(f)());
                    }
                });
                result.push(object_1);
            }
        });
        return result;
    };
    WizardQueryService.prototype._handleSpecialCharacters = function (path) {
        var result = [];
        path.split(']').map(function (item) {
            var bindex = item.indexOf('[');
            if (bindex >= 0) {
                var x = '';
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
    };
    WizardQueryService.prototype._prepareJsonPath = function (path) {
        var _this = this;
        var result;
        if (path instanceof Array) {
            result = [];
            path.map(function (i) {
                var x = _this._handleSpecialCharacters(i);
                result.push(_this._makeArguments(x));
            });
        }
        else {
            var x = this._handleSpecialCharacters(path);
            result = this._makeArguments(x);
        }
        return result;
    };
    WizardQueryService.prototype._select = function (path, from, deepXml, as, clause) {
        var _this = this;
        var dataStore = new BehaviorSubject(null);
        this._get(from).subscribe(function (data) {
            var result;
            var jpath = _this._prepareJsonPath(path);
            if (!clause) {
                clause = function (node, path, value) { return value; };
            }
            if (path instanceof Array) {
                result = {};
                jpath.map(function (pathItem) {
                    var y = _this._valueOfJsonPath(pathItem, data, as, deepXml, clause);
                    if (y) {
                        var key = _this._stringValueOfKey(pathItem);
                        result[key] = y;
                    }
                });
                if (Object.keys(result).length === 0) {
                    result = undefined;
                }
            }
            else if (typeof path === 'string') {
                result = _this._valueOfJsonPath(jpath, data, as, deepXml, clause);
            }
            if (result) {
                dataStore.next(result);
            }
            else {
                dataStore.error('Result not found for ' + path);
            }
        }, function (error) {
            dataStore.error(error);
        });
        return dataStore;
    };
    /*
    * Will convert the xml into a json.
    * @param xml XML to be converted.
    * @returns returns converted JSON.
    */
    WizardQueryService.prototype._xml2json = function (xml) {
        try {
            var obj = {};
            if (xml.attributes) {
                var c = xml.attributes;
                for (var i = 0; i < c.length; i++) {
                    var attr = c[i];
                    obj[attr.name] = attr.value;
                }
            }
            if (xml.childNodes && xml.childNodes.length) {
                for (var i = 0; i < xml.childNodes.length; i++) {
                    var item = xml.childNodes[i];
                    var nodeName = item.nodeName;
                    if (obj[nodeName] === undefined) {
                        var fragment = this._xml2json(item);
                        if (fragment) {
                            obj[nodeName] = fragment;
                        }
                    }
                    else {
                        if (obj[nodeName].push === undefined) {
                            var old = obj[nodeName];
                            obj[nodeName] = [];
                            obj[nodeName].push(old);
                        }
                        var fragment = this._xml2json(item);
                        if (fragment) {
                            obj[nodeName].push(fragment);
                        }
                    }
                }
            }
            else {
                var text = xml.textContent.trim().replace(/(?:\r\n|\r|\n|\t)/g, '');
                obj = text.length ? text : undefined;
            }
            return obj;
        }
        catch (e) {
            if (this.logEnabled) {
                console.log(e.message);
            }
        }
    };
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
    WizardQueryService.prototype.chainSelect = function (chainQuery) {
        var size = (chainQuery.path instanceof Array) ? chainQuery.path.length : 1;
        var operation = { cachedFiles: {}, as: {}, result: {} };
        var dataStore = new BehaviorSubject(null);
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
    };
    /*
    * Will group file paths if they are similar to avoid multiple calls.
    * @param list A list of Json {paths, in, deepXml} structures. deepXml is optional.
    * @param clause A method by which value(s) for the path(s) could be evaluated. the caller would evaluate the value for a given attribute.
    * @returns returns an observable. the caller should subscribe to this in order to receive the result.
    */
    WizardQueryService.prototype.arraySelect = function (list, clause) {
        var _this = this;
        var groupedList = {};
        list.map(function (item) {
            if (groupedList[item.in] === undefined) {
                groupedList[item.in] = [];
            }
            groupedList[item.in].push({ path: item.path, deepXml: item.deepXml });
        });
        var dataStore = new BehaviorSubject(null);
        Object.keys(groupedList).map(function (url) {
            _this._select(groupedList[url].path, url, groupedList[url].deepXml, undefined, clause).subscribe(function (data) {
                if (data) {
                    dataStore.next(data);
                }
            }, function (error) {
                dataStore.error(error);
            });
        });
        return dataStore;
    };
    /*
    * Will query path from a remote location qualified through an optional clause function that
    * evaluates, filters, or sorts the resul of the query.
    * @param path A a single JSON path or list of paths to select (i.e., 'a.b.c')
    * @param from A reference URL to a remote source.
    * @param deepXml if cdata-section should be parsed.
    * @param clause A method by which value(s) for the path(s) could be evaluated. the caller would evaluate the value for a given attribute.
    * @returns returns an observable. the caller should subscribe to this in order to receive the result.
    */
    WizardQueryService.prototype.select = function (path, from, deepXml, clause) {
        return this._select(path, from, deepXml, undefined, clause);
    };
    WizardQueryService.ctorParameters = function () { return [
        { type: HttpClient }
    ]; };
    WizardQueryService = tslib_1.__decorate([
        Injectable()
    ], WizardQueryService);
    return WizardQueryService;
}());
export { WizardQueryService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLXF1ZXJ5LnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VkZWgvd2l6YXJkLXF1ZXJ5LyIsInNvdXJjZXMiOlsic3JjL2FwcC93aXphcmQtcXVlcnkvd2l6YXJkLXF1ZXJ5LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFvQ0U7QUFDRixPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxVQUFVLEVBQUUsV0FBVyxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFFN0QsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ25DLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDckMsT0FBTyxLQUFLLE1BQU0sTUFBTSxRQUFRLENBQUM7QUFXakM7SUFLSSw0QkFDVSxJQUFnQjtRQUFoQixTQUFJLEdBQUosSUFBSSxDQUFZO1FBSm5CLGlCQUFZLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLGVBQVUsR0FBRyxLQUFLLENBQUM7SUFNMUIsQ0FBQztJQUVPLDZDQUFnQixHQUF4QjtRQUNJLE9BQU8sd3lHQW9HTixDQUFDO0lBQ04sQ0FBQztJQUVEOzs7OztNQUtFO0lBQ00sdUNBQVUsR0FBbEIsVUFBbUIsS0FBVSxFQUFFLE9BQWdCO1FBQS9DLGlCQWtDQztRQWpDRyxJQUFJLEtBQUssWUFBWSxLQUFLLEVBQUU7WUFDeEIsSUFBTSxRQUFNLEdBQUcsRUFBRSxDQUFDO1lBQ2xCLEtBQUssQ0FBQyxHQUFHLENBQUUsVUFBQyxJQUFJO2dCQUNaLFFBQU0sQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNoRCxDQUFDLENBQUMsQ0FBQztZQUNILEtBQUssR0FBRyxRQUFNLENBQUM7U0FDbEI7YUFBTSxJQUFJLE9BQU8s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QUFDLENBQUM7WUFDM0IsQ0FBQyxDQUNKLENBQUM7UUFDTixDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sU0FBUyxDQUFDO0lBQ3JCLENBQUM7SUFFRDs7Ozs7Ozs7TUFRRTtJQUNGLG1DQUFNLEdBQU4sVUFDSSxJQUFTLEVBQ1QsSUFBWSxFQUNaLE9BQWdCLEVBQ2hCLE1BQXdCO1FBRXhCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDaEUsQ0FBQzs7Z0JBdDhCZSxVQUFVOztJQU5qQixrQkFBa0I7UUFEOUIsVUFBVSxFQUFFO09BQ0Esa0JBQWtCLENBNjhCOUI7SUFBRCx5QkFBQztDQUFBLEFBNzhCRCxJQTY4QkM7U0E3OEJZLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4qIFF1ZXJ5IHNlcnZpY2UgcHJvdmlkZXMgYSB3YXkgdG8gcXVlcnkgYSByZW1vdGUgSlNPTiBvciBYTUwgZmlsZS4gSXQgY2FuIGJlIHVzZWQgaW4gZm9sbG93aW5nIHdheXMuXG4qXG4qIDEpIFdpdGggc2VsZWN0KCkgbWV0aG9kLCBhIHNpbmdsZSBwYXRoIG9yIGEgbGlzdCBvZiBwYXRocyBjYW4gYmUgZ2l2ZW4uIGVhY2ggcGF0aCB3aWxsIGJlIGEganNvbiBxdWFsaWZ5aW5nXG4qIHBhdGggdG8gYW4gZW5kIG5vZGUgKGkuZS4sICdib29rcy5ib29rLnRpdGxlJykuIElmIG11bHRpcGxlIHBhdGhzIGFyZSBzdXBwbGllZCwgcXVlcnkgcmVzdWx0IHdpbGwgYmUgYSBqc29uXG4qIG9iamVjdCB3aGVyZSBlYWNoIGF0dHJpYnV0ZSB3aWxsIGJlIGEgZ2l2ZW4gcXVlcnkgcGF0aCBhbmQgaXRzIHZhbHVlIHdpbGwgYmUgcXVlcnkgcmVzdWx0IGZvciB0aGF0IHBhdGguXG4qIEZvciBleGFtcGxlOlxuKiBzZWxlY3QoWydib29rcy5ib29rLnRpdGxlJywgJ2Jvb2tzLmJvb2suYXV0aG9yJ10sICcvZXhhbXBsZTEueG1sJywgZmFsc2UpXG4qIHdpbGwgcmVzdWx0IGluIHsnYm9va3MuYm9vay50aXRsZSc6IFtdLCAnYm9va3MuYm9vay5hdXRob3InOiBbXX0uXG4qIEVhY2ggcmVzdWx0IHdpbGwgbm90IGNvLXJlbGF0ZWQgd2l0aCBvdGhlciByZXN1bHQgaW4gb3JkZXIgb3IgaW4gYW55IG90aGVyIGZvcm0uIGlmIGEgY2xhdXNlIGFyZ3VtZW50IGlzXG4qIHN1cHBsaWVkLCBpdCB3aWxsIGJlIGludm9rZWQgdG8gZnVydGhlciBhc3Npc3QgaW4gZmlsdGVyaW5nIHRoZSBxdWVyeSByZXN1bHQuIGZvciBleGFtcGxlIGlmIGNlcnRhaW4gY2F0ZWdvcnlcbiogb2YgYm9va3MgYXJlIHJlcXVpcmVkLCB0aGUgY2xhdXNlIGZ1bmN0aW9uIGNhbiBsb29rIGZvciBhIGJvb2sgY2F0ZWdvcnkgYXR0cmlidXRlIGFuZCByZXR1cm4gdGhlIHF1ZXJ5IHJlc3VsdFxuKiBpZiBhY2NlcHRhYmxlIG9yIHVuZGVmaW5lZCBpZiByZXN1bHQgc2hvdWxkIGJlIGZpbHRlcmVkIG91dCBvZiB0aGUgcmVzdWx0LlxuKlxuKiAyKSBXaXRoIGFycmF5U2VsZWN0KCkgbWV0aG9kLCBhbiBhcnJheSBvZiB7cGF0aDogJycsIGluOicnLCBkZWVwWG1sOiB0cnVlfSBjYW4gYmUgc3VwcGxpZWQsIGVhY2ggZW50cnkgd2lsbCBiZSBldmFsdWF0ZWRcbiogYXMgaWYgc2VsZWN0KCkgbWV0aG9kIGlzIGludm9rZWQuIEJ1dCBmaXJzdCwgcmVxdWVzdHMgd2l0aCBzaW1pbGFyIHBhdGhzIHdpbGwgYmUgbWVyZ2VkIGludG8gb25lIGNhbGwuICBUaGlzXG4qIG1ldGhvZCBpcyB1c2VmdWwgd2hlbiBwYXRocyBhcmUgZHluYW1pY2x5IGdpdmVuIGFuZCBpdCBpcyBub3QgY2xlYXIgaW4gYWR2YW5jZSBpZiB0aGVyZSBhcmUgcmVxdWVzdHMgd2l0aFxuKiBzaW1pbGFyIHBhdGhzLiBkZWVwWG1sIGF0dHJpYnV0ZSBpcyBvcHRpb25hbC5cbipcbiogMykgV2l0aCBjaGFpblNlbGVjdCgpIG1ldGhvZCwgYSBjaGFpbmVkIHNldCBvZiB7cGF0aDogJycsIGluOiAnJywgZGVlcFhtbDogdHJ1ZX0gaXMgZ2l2ZW4gaW4gYSBqc29uIG9iamVjdC4gV2hlbiByZXN1bHQgb2ZcbiogYSBxdWVyeSBiZWNvbWVzIGF2YWlsYWJsZSwgdGhlIHJlcXVlc3QganNvbiB3aWxsIGJlIGV4YW1pbmVkIHRvIHNlZSBpZiBhIHJlcXVlc3QgZm9yIHRoZSBrZXkgaXMgYXZhaWxhYmxlLiBJZlxuKiBzbywgdGhlbiB0aGUgJ2luJyBmb3IgdGhlIHBhdGggd2lsbCBiZSBwcmVwZW5kZWQgdG8gdGhlIHJlc3VsdGluZyB2YWx1ZSBvZiB0aGUgcHJldmlvdXMgcXVlcnkuICwgZGVlcFhtbCBhdHRyaWJ1dGUgaXMgXG4qIG9wdGlvbmFsLiBUaGlzIG1ldGhvZCBpcyB1c2VmdWwgd2hlbiByZXN1bHQgb2YgYSBxdWVyeSBpcyBhIGpzb24gb3IgYW4geG1sIGZpbGUgYW5kIGFkZGl0aW9uYWwgcXVlcnkgaXMgbmVlZGVkIFxuKiBmdXJ0aGVyIGRvd24gaW4gdGhlIHByZWNlZWRpbmcgZmlsZXMuIEZvciBleGFtcGxlIHRoZSBhc3N1bXB0aW9uIGluIHRoZSBmb2xsb3dpbmcgY2FsbCBpcyB0aGF0IGVhY2ggYm9va3MuYm9vayBcbiogcmVzdWx0IHdpbGwgYmUgYSBmaWxlIG5hbWUgYW5kIHRoZSBmaWxlIHBhdGggZm9yIGVhY2ggcmVzdWx0IGlzICcvc2FtcGxlcy9ib29rcy8nLlxuKiBjaGFpblNlbGVjdCh7XG4qICAgcGF0aDogJ2Jvb2tzLmJvb2snLFxuKiAgIGluOiAnc2FtcGxlMS54bWwnLFxuKiAgIGRlZXBYbWw6IHRydWUsXG4qICAgJ2Jvb2tzLmJvb2snOiB7XG4qICAgICAgIGluOiAnL3NhbXBsZXMvYm9va3MvJyxcbiogICAgICAgcGF0aDogWydwdWJsaWNhdGlvbi50aXRsZScsICdwdWJsaWNhdGlvbi5hdXRob3InXSxcbiogICAgICAgaGFuZGxlcjogdGhpcy5idWJsaWNhdGlvbkhhbmRsZXJcbiogICB9KVxuKiBpZiBhIGhhbmRsZXIgaXMgc3VwcGxpZWQsIGl0IHdpbGwgYmUgdXNlZCB0byBmaWx0ZXIgb3V0IGFueSByZXN1bHQgdGhhdCBpcyBub3QgYWNjZXB0YWJsZS5cbipcbiovXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtIdHRwQ2xpZW50LCBIdHRwSGVhZGVyc30gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuXG5pbXBvcnQge21hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtCZWhhdmlvclN1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0ICogYXMgeG1sZG9tIGZyb20gJ3htbGRvbSc7XG5cbi8qXG4qIEBwYXJhbSBub2RlIFRoZSBwYXJlbnQgbm9kZS4gaXQgY2FuIGJlIHVzZWQgdG8gZXZhbHVhdGUgYmFzZWQgb24gb3RoZXIgYXR0cmlidXRlcyBpbiB0aGUgbm9kZS5cbiogQHBhcmFtIHBhdGggYXR0cmlidXRlIHRvIGJlIGV4YW1pbmVkLlxuKiBAcGFyYW0gdmFsdWUgdGhlIHZhbHVlIG9mIHRoZSBwYXRoLiBpdCBjb3VsZCBiZSB1bmRlZmluZWQsIGEgbGl0ZXJhbCwgb3IgYSBsaXN0LlxuKiBAcmV0dXJucyByZXR1cm5zIHRoZSB2YWx1ZSBvciBmaWx0ZXJlZCB2ZXJzaW9uIG9mIHRoZSB2YWx1ZSBvciB1bmRlZmluZWQgb3RoZXJ3aXNlLlxuKi9cbmV4cG9ydCB0eXBlIGNsYXVzZUV2YWx1YXRvciA9IChub2RlOiBhbnksIHBhdGg6IHN0cmluZywgdmFsdWU6IGFueSkgPT4gYW55O1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgV2l6YXJkUXVlcnlTZXJ2aWNlIHtcblxuICAgIHB1YmxpYyBTRVJWSUNFX1BBVEggPSAnJztcbiAgICBwdWJsaWMgbG9nRW5hYmxlZCA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnRcbiAgICApIHtcblxuICAgIH1cblxuICAgIHByaXZhdGUgX2dsb2JhbEZ1bmN0aW9ucygpIHtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgZnVuY3Rpb24gcmV2ZXJzZShhKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gYTtcbiAgICAgICAgICAgIGlmIChhIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBhLnJldmVyc2UoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gYS5zcGxpdCgnJykucmV2ZXJzZSgpLmpvaW4oJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBzdW0oYSxiKSB7XG4gICAgICAgICAgICB2YXIgdG90YWwgPSAwO1xuICAgICAgICAgICAgaWYgKGEgaW5zdGFuY2VvZiBBcnJheSkgeyBcbiAgICAgICAgICAgICAgICBhLm1hcChmdW5jdGlvbihrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvdGFsICs9IHN1bShrLCBiKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGEgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgaWYgKGIuaW5kZXhPZignLicpPjApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHQgPSBhO1xuICAgICAgICAgICAgICAgICAgICBiLnNwbGl0KCcuJykubWFwKGZ1bmN0aW9uKGspe1xuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWwrPXN1bSggdFtrXSwgYi5zdWJzdHJpbmcoay5sZW5ndGgrMSkgKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKGFbYl0pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHQgPSBhW2JdO1xuICAgICAgICAgICAgICAgICAgICB0b3RhbCArPSAodHlwZW9mIHQgPT09ICdudW1iZXInKSA/IHQgOiBwYXJzZUZsb2F0KHQpO1xuICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgIHRvdGFsID0gYTtcbiAgICAgICAgICAgIH0gXG4gICAgICAgICAgICByZXR1cm4gdG90YWw7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gY291bnQoYSxiKSB7XG4gICAgICAgICAgICB2YXIgdG90YWwgPSAwO1xuICAgICAgICAgICAgaWYgKGEgaW5zdGFuY2VvZiBBcnJheSkgeyBcbiAgICAgICAgICAgICAgICBhLm1hcChmdW5jdGlvbihrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvdGFsICs9IGNvdW50KGssIGIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhhKS5tYXAoZnVuY3Rpb24oayl7XG4gICAgICAgICAgICAgICAgICAgIHRvdGFsICs9IGNvdW50KGFba10sYik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIHRvdGFsID0gYS5zcGxpdChiKS5sZW5ndGggLSAxO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhID09PSBiKSB7XG4gICAgICAgICAgICAgICAgdG90YWwrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0b3RhbDtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBsaWtlKGEsIGIpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBpZiAoYSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gW107XG4gICAgICAgICAgICAgICAgYS5tYXAoZnVuY3Rpb24oaykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChsaWtlKGssIGIpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGEgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gW107XG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoYSkubWFwKGZ1bmN0aW9uKGspe1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChsaWtlKGFba10sIGIpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgaWYgKGEuaW5kZXhPZihiKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IGE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChhID09PSBiKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gYTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gYXMoYSwgYikge1xuICAgICAgICAgICAgaWYgKGFzTGlzdFtiXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYXNMaXN0W2JdID0gW2FdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhc0xpc3RbYl0ucHVzaChhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBhO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGlzX2luKGEsIGIsIGxpc3QpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBpZiAoYiBpbnN0YW5jZW9mIEFycmF5KSB7IFxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IFtdO1xuICAgICAgICAgICAgICAgIGIubWFwKGZ1bmN0aW9uKGspIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goaXNfaW4oaywgbGlzdCkpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYiA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBbXTtcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhiKS5tYXAoZnVuY3Rpb24oaykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChpc19pbihiW2tdLCBsaXN0KSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFzTGlzdFtsaXN0XSl7XG4gICAgICAgICAgICAgICAgYXNMaXN0W2xpc3RdLm1hcChmdW5jdGlvbih0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdCA9PT0nc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHQuaW5kZXhPZihiKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gYTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICBgO1xuICAgIH1cblxuICAgIC8qXG4gICAgKiBXaWxsIG5vcm1hbGl6ZSB0aGUgZ2l2ZW4geG1sIG91dCBvZiBhZGRpdGlvbmFsICN0ZXh0IG9yICNjZGF0YS1zZWN0aW9uIG5vZGVzLlxuICAgICogQHBhcmFtIHZhbHVlIHRoZSB4bWwgdG8gYmUgbm9ybWFpbHplZC5cbiAgICAqIEBwYXJhbSBkZWVwWG1sIGlmIGNkYXRhLXNlY3Rpb24gc2hvdWxkIGJlIHBhcnNlZC5cbiAgICAqIEByZXR1cm4gbm9ybWFsaXplZCB4bWwuXG4gICAgKi9cbiAgICBwcml2YXRlIF9ub3JtYWxpemUodmFsdWU6IGFueSwgZGVlcFhtbDogYm9vbGVhbikge1xuICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgICAgICAgICB2YWx1ZS5tYXAoIChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5fbm9ybWFsaXplKGl0ZW0sIGRlZXBYbWwpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFsdWUgPSByZXN1bHQ7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgbGV0IGl0ZW1zOiBhbnkgPSBPYmplY3Qua2V5cyh2YWx1ZSk7XG5cbiAgICAgICAgICAgIGlmIChpdGVtcy5sZW5ndGggPT09IDEgJiYgISh2YWx1ZVtpdGVtc1swXV0gaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWVbJyN0ZXh0J10pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZVsnI3RleHQnXTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlWycjY2RhdGEtc2VjdGlvbiddKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWVbJyNjZGF0YS1zZWN0aW9uJ107XG4gICAgICAgICAgICAgICAgICAgIGlmIChkZWVwWG1sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHhtbCA9IG5ldyB4bWxkb20uRE9NUGFyc2VyKCkucGFyc2VGcm9tU3RyaW5nKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9ICh4bWwuZG9jdW1lbnRFbGVtZW50ICYmIHhtbC5kb2N1bWVudEVsZW1lbnQgIT0gbnVsbCkgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3htbDJqc29uKHhtbC5kb2N1bWVudEVsZW1lbnQpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1jYXRjaChlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgICAgICAgICAgICAgaXRlbXMubWFwKCAoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRbaXRlbV0gPSB0aGlzLl9ub3JtYWxpemUodmFsdWVbaXRlbV0sIGRlZXBYbWwpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHZhbHVlID0gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICAvKlxuICAgICogQHBhcmFtIHBhdGggSlNPTiBwYXRoIHRvIGV2YWx1YXRlLiBBIHBhdGggY291bGQgYmUgZnVsbHkgcXVhbGlmaWVkIGZvciBkZXB0aCBvZiBqc29uIChpLmUuLCAnYS5iLmMnKVxuICAgICogQHBhcmFtIGRhdGEgdGhlIGRhdGEgc291cmNlLlxuICAgICogQHBhcmFtIGRlZXBYbWwgaWYgY2RhdGEtc2VjdGlvbiBzaG91bGQgYmUgcGFyc2VkLlxuICAgICogQHBhcmFtIGNsYXVzZSBBIG1ldGhvZCBieSB3aGljaCB2YWx1ZShzKSBmb3IgdGhlIGtleShzKSBjb3VsZCBiZSBldmFsdWF0ZWQuIHRoZSBjYWxsZXIgd291bGQgZXZhbHVhdGUgdGhlIHZhbHVlIGZvciBhIGdpdmVuIGF0dHJpYnV0ZS5cbiAgICAqIEByZXR1cm5zIHJldHVybnMgZXZsdWF0ZWQgdmFsdWUgZm9yIHRoZSBrZXkgaW4gZGF0YSBzb3VyY2UuXG4gICAgKi9cbiAgICBwcml2YXRlIF92YWx1ZU9mSnNvblBhdGgoXG4gICAgICAgIHBhdGg6IGFueSxcbiAgICAgICAgZGF0YTogYW55LFxuICAgICAgICBhczogYW55LFxuICAgICAgICBkZWVwWG1sOiBib29sZWFuLFxuICAgICAgICBjbGF1c2U/OiBjbGF1c2VFdmFsdWF0b3IpOiBhbnkge1xuXG4gICAgICAgIGxldCByZXN1bHQ6IGFueTtcbiAgICAgICAgbGV0IHggPSB0aGlzLl9ub3JtYWxpemUoZGF0YSwgZGVlcFhtbCk7XG4gICAgICAgIHBhdGgubWFwKCAoc3Via2V5OiBhbnkpID0+IHtcbiAgICAgICAgICAgIGxldCBub2RlID0geDtcbiAgICAgICAgICAgIGlmIChub2RlICYmIG5vZGUgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHQgPSBbXTtcbiAgICAgICAgICAgICAgICBpZiAoc3Via2V5LnNvcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZSA9IHN1YmtleS5zb3J0KG5vZGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBub2RlLm1hcCAoXG4gICAgICAgICAgICAgICAgICAgIChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1YmtleS5rZXkubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHggPSBzdWJrZXkua2V5Lmxlbmd0aCA/IGl0ZW1bc3Via2V5LmtleV0gOiBpdGVtO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoeCAmJiBzdWJrZXkudmFsaWRhdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJrZXkudmFsaWRhdGVkLm1hcCh2ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB6ID0gdih4LCBhcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB6ID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoeiAgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHggPSB6O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHIgJiYgeCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQucHVzaCh4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdWJrZXkudmFsaWRhdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJrZXkudmFsaWRhdGVkLm1hcCh2ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB6ID0gdihpdGVtLCBhcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB6ID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoeiAgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0gPSB6O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHIgJiYgaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3Via2V5LmtleS5sZW5ndGggJiYgKHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnNwbGl0KCcuJykubWFwKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoc3RyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RyLmluZGV4T2Yoc3Via2V5LmtleSkgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQucHVzaChzdHIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB4ID0gdDtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB4O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChub2RlICYmICh0eXBlb2Ygbm9kZSA9PT0gJ29iamVjdCcpKSB7XG4gICAgICAgICAgICAgICAgeCA9IHggP1xuICAgICAgICAgICAgICAgICAgICBjbGF1c2Uobm9kZSwgc3Via2V5LmtleSwgc3Via2V5LmtleS5sZW5ndGggPyB4W3N1YmtleS5rZXldOiAgeCkgOlxuICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgaWYgKHggJiYgeCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHQgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN1YmtleS5zb3J0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB4ID0gc3Via2V5LnNvcnQoeCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgeC5tYXAoXG4gICAgICAgICAgICAgICAgICAgICAgICAoaXRlbTogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1YmtleS52YWxpZGF0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJrZXkudmFsaWRhdGVkLm1hcCh2ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHogPSB2KGl0ZW0sIGFzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgeiA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoeiAgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbSA9IHo7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAociAmJiBpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0LnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB4ID0gdDtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0geDtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN1YmtleS52YWxpZGF0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YmtleS52YWxpZGF0ZWQubWFwKHYgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHogPSB2KHgsIGFzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHogPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih6ICA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeCA9IHo7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAociAmJiB4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0geDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5vZGUgJiYgKHR5cGVvZiBub2RlID09PSAnc3RyaW5nJykgJiYgc3Via2V5LmtleS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBbXTtcbiAgICAgICAgICAgICAgICBub2RlLnNwbGl0KCcuJykubWFwKFxuICAgICAgICAgICAgICAgICAgICAoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uaW5kZXhPZihzdWJrZXkua2V5KSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IG5vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHByaXZhdGUgX2dldChwYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgdXJsID0gdGhpcy5TRVJWSUNFX1BBVEggKyBwYXRoO1xuICAgICAgICBjb25zdCBkb3QgPSBwYXRoLmxhc3RJbmRleE9mKCcuJyk7XG4gICAgICAgIGNvbnN0IGV4dCA9IGRvdCA8IDAgPyB1bmRlZmluZWQgOiBwYXRoLnRvTG93ZXJDYXNlKCkuc3Vic3RyKGRvdCk7XG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoKTtcbiAgICAgICAgbGV0IHJlc3VsdDogYW55O1xuXG4gICAgICAgIGhlYWRlcnMuc2V0KCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nLCAnKicpO1xuXG4gICAgICAgIGlmIChleHQgPT09ICcueG1sJykge1xuICAgICAgICAgICAgaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsICd0ZXh0OyBjaGFyc2V0PXV0Zi04Jykuc2V0KCdBY2NlcHQnLCAndGV4dCcpO1xuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLmdldCh1cmwsIHsgaGVhZGVycywgcmVzcG9uc2VUeXBlOiAndGV4dCcgfSlcbiAgICAgICAgICAgICAgICAucGlwZShtYXAoKHJlcykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB4bWwgPSBuZXcgeG1sZG9tLkRPTVBhcnNlcigpLnBhcnNlRnJvbVN0cmluZyhyZXMpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBqc29uID0gdGhpcy5feG1sMmpzb24oeG1sLmRvY3VtZW50RWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBqc29uO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKGV4dCA9PT0gJy50eHQnKSB7XG4gICAgICAgICAgICBoZWFkZXJzLnNldCgnQ29udGVudC1UeXBlJywgJ3RleHQ7IGNoYXJzZXQ9dXRmLTgnKS5zZXQoJ0FjY2VwdCcsICd0ZXh0Jyk7XG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLmh0dHAuZ2V0KHVybCwgeyBoZWFkZXJzLCByZXNwb25zZVR5cGU6ICd0ZXh0JyB9KS5waXBlKG1hcCgocmVzKSA9PiByZXMpKTtcbiAgICAgICAgfSBlbHNlIGlmIChleHQgPT09ICcuanNvbicpe1xuICAgICAgICAgICAgaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsICdqc29uOyBjaGFyc2V0PXV0Zi04Jykuc2V0KCdBY2NlcHQnLCAnanNvbicpO1xuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLmdldCh1cmwsIHtoZWFkZXJzfSkucGlwZShtYXAoKHJlcykgPT4gcmVzKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBoZWFkZXJzLnNldCgnQ29udGVudC1UeXBlJywgJ3RleHQ7IGNoYXJzZXQ9dXRmLTgnKS5zZXQoJ0FjY2VwdCcsICd0ZXh0Jyk7XG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLmh0dHAuZ2V0KHVybCwgeyBoZWFkZXJzLCByZXNwb25zZVR5cGU6ICd0ZXh0JyB9KVxuICAgICAgICAgICAgICAgIC5waXBlKG1hcCgocmVzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwYXJzZWQ6IGFueTtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlZCA9IEpTT04ucGFyc2UocmVzKTtcbiAgICAgICAgICAgICAgICAgICAgfWNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHhtbCA9IG5ldyB4bWxkb20uRE9NUGFyc2VyKCkucGFyc2VGcm9tU3RyaW5nKHJlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VkID0gdGhpcy5feG1sMmpzb24oeG1sLmRvY3VtZW50RWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlZCA9IHJlcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlZCA/IHBhcnNlZCA6IHJlcztcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHByaXZhdGUgX3N0cmluZ1ZhbHVlT2ZLZXkoa2V5OiBhbnkpIHtcbiAgICAgICAgbGV0IHJlc3VsdDogYW55ID0gW107XG5cbiAgICAgICAgaWYgKGtleSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICBrZXkubWFwKCBcbiAgICAgICAgICAgICAgICAoaXRlbTogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB4ID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLm1hcChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoc3ViaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3ViaXRlbS5rZXkubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4LnB1c2goc3ViaXRlbS5rZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goeC5qb2luKCcuJykpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaSA9IGl0ZW0uaW5kZXhPZignWycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaiA9IGl0ZW0uaW5kZXhPZignXScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgayA9IGl0ZW0ubGVuZ3RoID4gKGogKyAxKSA/IDIgOiAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goaSA+IDAgPyBpdGVtLnN1YnN0cmluZygwLGkpIDogaiA+IDAgPyBpdGVtLnN1YnN0cmluZyhqICsgaykgOiBpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpdGVtLmtleS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGl0ZW0ua2V5KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXN1bHQgPSByZXN1bHQuam9pbignLCcpO1xuICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LmluZGV4T2YoJy4nKSA8IDAgPyByZXN1bHQucmVwbGFjZSgvXFwsL2csICcuJykgOiByZXN1bHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSBrZXkua2V5O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfYWRkVG9SZXN1bHQodmFsdWU6IGFueSwga2V5OiBzdHJpbmcsIG9wZXJhdGlvbjogYW55LCBhY3Rpb246IGFueSkge1xuICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5fc3RyaW5nVmFsdWVPZktleShhY3Rpb24ucGF0aCk7XG4gICAgICAgIGNvbnN0IGtleTIgPSB0aGlzLl9zdHJpbmdWYWx1ZU9mS2V5KGtleSk7XG4gICAgICAgIGxldCBvcCA9IG9wZXJhdGlvbi5yZXN1bHRbcGF0aF07XG4gICAgICAgIGxldCBjb21wbGV0ZSA9IGZhbHNlO1xuICAgIFxuICAgICAgICBpZiAoIW9wKSB7XG4gICAgICAgICAgICBvcGVyYXRpb24ucmVzdWx0W3BhdGhdID0ge307XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wKSB7XG4gICAgICAgICAgICBsZXQgb3BrID0gb3Bba2V5Ml07XG4gICAgICAgICAgICBpZiAob3BlcmF0aW9uWyd0ZW1wJ10gJiZcbiAgICAgICAgICAgICAgICBvcGVyYXRpb25bJ3RlbXAnXVtrZXkyXSkge1xuICAgICAgICAgICAgICAgIG9wW2tleTJdID0gW29wW2tleTJdXTtcbiAgICAgICAgICAgICAgICBkZWxldGUgb3BlcmF0aW9uWyd0ZW1wJ107XG4gICAgICAgICAgICB9ZWxzZSBpZiAob3BrICYmIChvcGsgaW5zdGFuY2VvZiBBcnJheSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uLnJlc3VsdFtwYXRoXVtrZXkyXSA9IFtvcGtdXG4gICAgICAgICAgICAgICAgb3AgPSBvcGVyYXRpb24ucmVzdWx0W3BhdGhdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFsdWUgPSB0aGlzLl9ub3JtYWxpemUodmFsdWUsIGFjdGlvbi5kZWVwWG1sKTtcbiAgICAgICAgICAgIGlmIChvcFtrZXkyXSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChKU09OLnN0cmluZ2lmeSh2YWx1ZSkgIT09IEpTT04uc3RyaW5naWZ5KG9wW2tleTJdWzBdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3Bba2V5Ml0ucHVzaCggdmFsdWVba2V5Ml0gPyB2YWx1ZVtrZXkyXSA6IHZhbHVlICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBvcFtrZXkyXS5wdXNoKCB2YWx1ZVtrZXkyXSA/IHZhbHVlW2tleTJdIDogdmFsdWUgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICgob3AgaW5zdGFuY2VvZiBBcnJheSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5yZXN1bHRbcGF0aF0gPSBbb3BdO1xuICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb24ucmVzdWx0W3BhdGhdLnB1c2goIHZhbHVlW2tleTJdID8gdmFsdWVba2V5Ml0gOiB2YWx1ZSApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoSlNPTi5zdHJpbmdpZnkodmFsdWUpICE9PSBKU09OLnN0cmluZ2lmeShvcFswXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcC5wdXNoKCB2YWx1ZVtrZXkyXSA/IHZhbHVlW2tleTJdIDogdmFsdWUgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wLnB1c2goIHZhbHVlW2tleTJdID8gdmFsdWVba2V5Ml0gOiB2YWx1ZSApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiBhbHJlYWR5IGFuIGFycmF5IHJlbWVtYmVyIGl0LlxuICAgICAgICAgICAgICAgIGlmICghb3BlcmF0aW9uWyd0ZW1wJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uWyd0ZW1wJ10gPSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFvcGVyYXRpb25bJ3RlbXAnXVtrZXkyXSkge1xuICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb25bJ3RlbXAnXVtrZXkyXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3BlcmF0aW9uLnJlc3VsdFtwYXRoXVtrZXkyXSA9IHRoaXMuX25vcm1hbGl6ZSh2YWx1ZSwgYWN0aW9uLmRlZXBYbWwpO1xuICAgICAgICAgICAgY29tcGxldGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb21wbGV0ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9wYWNrKHJlc3VsdDogYW55KSB7XG4gICAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgY29uc3QgbGlzdCA9IFtdO1xuICAgICAgICAgICAgcmVzdWx0Lm1hcChcbiAgICAgICAgICAgICAgICAoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2godGhpcy5fcGFjayhpdGVtKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IGxpc3Q7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHJlc3VsdCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhyZXN1bHQpO1xuICAgICAgICAgICAga2V5cy5tYXAgKFxuICAgICAgICAgICAgICAgIChrZXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IHJlc3VsdFtrZXldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIEFycmF5KSB7XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpdGVtW2tleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gaXRlbVtrZXldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfdHJpZ2dlclJlc3VsdChwcm9taXNlOiBhbnksIGFzOiBhbnksIHJlc3VsdDogYW55KSB7XG4gICAgICAgIGNvbnN0IHggPSB0aGlzLl9wYWNrKHJlc3VsdCk7XG4gICAgICAgIGxldCBzYXZlQXM6IGFueTtcbiAgICAgICAgaWYgKGFzKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGFzID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIHNhdmVBcyA9IHt9O1xuICAgICAgICAgICAgICAgIHNhdmVBc1thc10gPSB4O1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYXMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgc2F2ZUFzID0gYXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcHJvbWlzZS5uZXh0KHgpO1xuICAgICAgICByZXR1cm4gc2F2ZUFzO1xuICAgIH1cblxuICAgIHByaXZhdGUgX3N1YnF1ZXJ5KFxuICAgICAgICBwcm9taXNlOiBhbnksXG4gICAgICAgIHBhdGg6IGFueSxcbiAgICAgICAgb3BlcmF0aW9uOiBhbnksXG4gICAgICAgIGFjdGlvbjogYW55KSB7XG5cbiAgICAgICAgaWYgKG9wZXJhdGlvbi5jYWNoZWRGaWxlc1twYXRoXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBvbmUgb2YgdGhlIGtleXMgYXQgdGhpcyBsZXZlbCBjb3VsZCBiZSByZWZlcmVuY2luZyB0aGUgc2FtZSBmaWxlIHdoaWNoXG4gICAgICAgICAgICAvLyBpcyBub3QgeWV0IGZldGNoZWQuIG5lZWQgdG8gd2FpdCB0aWxsIGl0IGlzIGF2YWlsYWJsZS5cbiAgICAgICAgICAgIG9wZXJhdGlvbi5jYWNoZWRGaWxlc1twYXRoXSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8YW55PihudWxsKTtcbiAgICAgICAgICAgIHRoaXMuX3F1ZXJ5SXRlcmF0aW9uKFxuICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5jYWNoZWRGaWxlc1twYXRoXSxcbiAgICAgICAgICAgICAgICBvcGVyYXRpb24sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBwYXRoOiBhY3Rpb24ucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgaW46IGFjdGlvbi5pbixcbiAgICAgICAgICAgICAgICAgICAgZGVlcFhtbDogYWN0aW9uLmRlZXBYbWwsXG4gICAgICAgICAgICAgICAgICAgIGpvaW46IGFjdGlvbi5qb2luLFxuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyOiBhY3Rpb24uaGFuZGxlcixcbiAgICAgICAgICAgICAgICAgICAgcXVlcnlJdGVtczogKGFjdGlvbi5wYXRoIGluc3RhbmNlb2YgQXJyYXkpID8gYWN0aW9uLnBhdGgubGVuZ3RoIDogMVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcGF0aFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHdhaXQgZm9yIHJlc3VsdCByYWlzZWQgYWJvdmUuXG4gICAgICAgIG9wZXJhdGlvbi5jYWNoZWRGaWxlc1twYXRoXS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAoc291cmNlOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9wa2V5aSA9IGFjdGlvbi5qb2luID8gYWN0aW9uLmpvaW5bYWN0aW9uLnBhdGhdIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICBpZiAob3BrZXlpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc291cmNlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2UubWFwKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3VicXVlcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IG9wa2V5aS5wYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbjogb3BrZXlpLmluID09IHVuZGVmaW5lZCA/IGFjdGlvbi5pbiA6IChvcGtleWkuaW4gKyBpdGVtKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVlcFhtbDogb3BrZXlpLmRlZXBYbWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpvaW46IG9wa2V5aS5qb2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyOiBvcGtleWkuaGFuZGxlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnlJdGVtczogKG9wa2V5aS5wYXRoIGluc3RhbmNlb2YgQXJyYXkpID8gb3BrZXlpLnBhdGgubGVuZ3RoIDogMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N1YnF1ZXJ5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogYWN0aW9uLmpvaW5bb3BrZXlpLnBhdGhdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW46IG9wa2V5aS5pbiA9PSB1bmRlZmluZWQgPyBhY3Rpb24uaW4gOiAob3BrZXlpLmluICsgc291cmNlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZXBYbWw6IGFjdGlvbi5kZWVwWG1sLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgam9pbjogb3BrZXlpLmpvaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyOiBvcGtleWkuaGFuZGxlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5SXRlbXM6IChvcGtleWkucGF0aCBpbnN0YW5jZW9mIEFycmF5KSA/IG9wa2V5aS5wYXRoLmxlbmd0aCA6IDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fYWRkVG9SZXN1bHQoc291cmNlLCBhY3Rpb24ucGF0aCwgb3BlcmF0aW9uLCBhY3Rpb24pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb24ucXVlcnlJdGVtcy0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGlvbi5xdWVyeUl0ZW1zID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLmFzID0gdGhpcy5fdHJpZ2dlclJlc3VsdChwcm9taXNlLCBvcGVyYXRpb24uYXMsIG9wZXJhdGlvbi5yZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb24ucXVlcnlJdGVtcy0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLmFzID0gdGhpcy5fdHJpZ2dlclJlc3VsdChwcm9taXNlLCBvcGVyYXRpb24uYXMsIG9wZXJhdGlvbi5yZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIChlcnJvcjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubG9nRW5hYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFjdGlvbi5xdWVyeUl0ZW1zLS07XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uLmFzID0gdGhpcy5fdHJpZ2dlclJlc3VsdChwcm9taXNlLCBvcGVyYXRpb24uYXMsIG9wZXJhdGlvbi5yZXN1bHQpO1xuICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuICAgIC8qXG4gICAgKiBJdGVyYXRlcyB0aHJvdWdoIGEgY2hhaW4gcXVlcnkuXG4gICAgKiBAcGFyYW0gcHJvbWlzZSBUaGUgcHJvbWlzZSB3aGljaCBvcmlnaW5hbCBjYWxsZXIgaXMgd2FpdGluZyBmb3IuXG4gICAgKiBAcGFyYW0gb3BlcmF0aW9uIGRhdGEgZm9yIGtlZXBpbmcgdHJhY2sgb2YgdGhlIGl0ZXJhdGlvbi5cbiAgICAqIEBwYXJhbSBhY3Rpb24gY29udGFpbnM6IHtwYXRoOiBjdXJyZW50IGtleXMgdG8gcXVlcnkgZm9yLCBpbjogY3VycmVudCBxdWVyeSBwYXRoLCBoYW5kbGVyOiByZXNvbHZlciBtZXRob2R9LlxuICAgICogQHBhcmFtIGNhY2hlTmFtZWQgVGhlIGNhY2hlZCBuYW1lIGZyb20gcHJldmlvdXMgaXRlcmF0aW9uIGlmIGFueS5cbiAgICAqIEByZXR1cm5zIHJldHVybnMgbm9uZS5cbiAgICAqL1xuICAgIHByaXZhdGUgX3F1ZXJ5SXRlcmF0aW9uKFxuICAgICAgICBwcm9taXNlOiBCZWhhdmlvclN1YmplY3Q8YW55PixcbiAgICAgICAgb3BlcmF0aW9uOiBhbnksXG4gICAgICAgIGFjdGlvbjogYW55LFxuICAgICAgICBjYWNoZU5hbWVkPzogc3RyaW5nKSB7XG5cbiAgICAgICAgaWYgKCFhY3Rpb24uaGFuZGxlcikge1xuICAgICAgICAgICAgYWN0aW9uLmhhbmRsZXIgPSAobm9kZTogYW55LCBwYXRoOiBzdHJpbmcsIHZhbHVlOiBhbnkpID0+IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3NlbGVjdChhY3Rpb24ucGF0aCwgYWN0aW9uLmluLCBhY3Rpb24uZGVlcFhtbCwgb3BlcmF0aW9uLmFzLCBhY3Rpb24uaGFuZGxlcikuc3Vic2NyaWJlKFxuICAgICAgICAgICAgKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2FjaGVOYW1lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVzdWx0IG9mIG4tdGggbGV2ZWwgY2FsbCB0byBiZSBwbGFjZWQgb24gcHJldmlvdXMgbGV2ZWwgY2FjaGUgcmVmZXJlbmNlLlxuICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLmNhY2hlZEZpbGVzW2NhY2hlTmFtZWRdLm5leHQoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3BlcmF0aW9uYWxLZXkgPSBhY3Rpb24uam9pbiA/IGFjdGlvbi5qb2luW2FjdGlvbi5wYXRoXSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob3BlcmF0aW9uYWxLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXNzdW1wdGlvbiBpcyB0aGUgcmVzdWx0aW5nIGxpc3QgaXMgYSBsaXN0IG9mIGZpbGUgcGF0aHMuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEubWFwKCAoY29udGVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGF0aCA9IGNvbnRlbnRbJyN0ZXh0J10gPyBjb250ZW50WycjdGV4dCddIDogY29udGVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzaXplID0gKG9wZXJhdGlvbmFsS2V5LnBhdGggaW5zdGFuY2VvZiBBcnJheSkgPyBvcGVyYXRpb25hbEtleS5wYXRoLmxlbmd0aCA6IDE7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcGVyYXRpb25hbEtleS5pbiA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb24uY2FjaGVkRmlsZXNbcGF0aF0gPSB0aGlzLl9zZWxlY3QoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbmFsS2V5LnBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbi5pbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uYWxLZXkuZGVlcFhtbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLmFzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb25hbEtleS5oYW5kbGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaXplIC0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3VicXVlcnkocHJvbWlzZSwgcGF0aCwgb3BlcmF0aW9uLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogb3BlcmF0aW9uYWxLZXkucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbjogb3BlcmF0aW9uYWxLZXkuaW4gPT0gdW5kZWZpbmVkID8gYWN0aW9uLmluIDogKG9wZXJhdGlvbmFsS2V5LmluICsgY29udGVudCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVlcFhtbDogb3BlcmF0aW9uYWxLZXkuZGVlcFhtbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqb2luOiBvcGVyYXRpb25hbEtleS5qb2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXI6IG9wZXJhdGlvbmFsS2V5LmhhbmRsZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnlJdGVtczogc2l6ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5vIG1vcmUgcXVlcnkgaW4gdGhlIGNoYWluLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb24ucXVlcnlJdGVtcy0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aW9uLnF1ZXJ5SXRlbXMgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9b3BlcmF0aW9uLnJlc3VsdCA/IG9wZXJhdGlvbi5yZXN1bHQgOiB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5hcyA9IHRoaXMuX3RyaWdnZXJSZXN1bHQocHJvbWlzZSwgb3BlcmF0aW9uLmFzLCBPYmplY3Qua2V5cyhvcGVyYXRpb24ucmVzdWx0KS5sZW5ndGggPyBvcGVyYXRpb24ucmVzdWx0IDogZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBkYXRhID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGRhdGEpLm1hcCggKGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjb250ZW50ID0gZGF0YVtrZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvcGVyYXRpb25hbEtleSA9IGFjdGlvbi5qb2luID8gYWN0aW9uLmpvaW5ba2V5XTogdW5kZWZpbmVkO1xuICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29udGVudCAmJiBjb250ZW50Lmxlbmd0aCAmJiBvcGVyYXRpb25hbEtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNpemUgPSAob3BlcmF0aW9uYWxLZXkucGF0aCBpbnN0YW5jZW9mIEFycmF5KSA/IG9wZXJhdGlvbmFsS2V5LnBhdGgubGVuZ3RoIDogMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcGVyYXRpb25hbEtleS5pbiA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb24uY2FjaGVkRmlsZXNbY29udGVudF0gPSB0aGlzLl9zZWxlY3QoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbmFsS2V5LnBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbi5pbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uYWxLZXkuZGVlcFhtbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLmFzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb25hbEtleS5oYW5kbGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaXplIC0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3VicXVlcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IG9wZXJhdGlvbmFsS2V5LnBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluOiBvcGVyYXRpb25hbEtleS5pbiA9PSB1bmRlZmluZWQgPyBhY3Rpb24uaW4gOiAob3BlcmF0aW9uYWxLZXkuaW4gKyBjb250ZW50KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVlcFhtbDogb3BlcmF0aW9uYWxLZXkuZGVlcFhtbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlcjogb3BlcmF0aW9uYWxLZXkuaGFuZGxlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnlJdGVtczogc2l6ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb24ucXVlcnlJdGVtcy0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW9wZXJhdGlvbi5yZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLnJlc3VsdCA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob3BlcmF0aW9uLnJlc3VsdCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5yZXN1bHQucHVzaChjb250ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb24ucmVzdWx0W2tleV0gPSBjb250ZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhY3Rpb24ucXVlcnlJdGVtcyA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5hcyA9IHRoaXMuX3RyaWdnZXJSZXN1bHQocHJvbWlzZSwgb3BlcmF0aW9uLmFzLCBPYmplY3Qua2V5cyhvcGVyYXRpb24ucmVzdWx0KS5sZW5ndGggPyBvcGVyYXRpb24ucmVzdWx0IDogZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uLnF1ZXJ5SXRlbXMtLTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aW9uLnF1ZXJ5SXRlbXMgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKG9wZXJhdGlvbi5yZXN1bHQpLmxlbmd0aCA9PT0gMCAmJiBkYXRhICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5yZXN1bHQgPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5hcyA9IHRoaXMuX3RyaWdnZXJSZXN1bHQocHJvbWlzZSwgb3BlcmF0aW9uLmFzLCBvcGVyYXRpb24ucmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAoZXJyb3I6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIHByb21pc2UuZXJyb3Ioe1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnZmFpbGVkIHRvIHF1ZXJ5ICcgKyBhY3Rpb24ucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgcmVhc29uOiBlcnJvci5tZXNzYWdlID8gZXJyb3IubWVzc2FnZSA6IGVycm9yXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgYWN0aW9uLnF1ZXJ5SXRlbXMtLTtcbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uLnF1ZXJ5SXRlbXMgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLmFzID0gdGhpcy5fdHJpZ2dlclJlc3VsdChwcm9taXNlLCBvcGVyYXRpb24uYXMsIG9wZXJhdGlvbi5yZXN1bHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9tYWtlQXJndW1lbnRzKGtleTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGxpc3QgPSBrZXkuc3BsaXQoJy4nKTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgICAgIGxpc3QubWFwKCAoaXRlbSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgYiA9IGl0ZW0uaW5kZXhPZignWycpO1xuICAgICAgICAgICAgaWYgKGIgPCAwKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBrZXk6IGl0ZW0sXG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRlZDogWyhkYXRhOiBhbnksIGFzOiBhbnkpID0+IHRydWVdXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBzdHIgPSBpdGVtLnN1YnN0cmluZyhiICsgMSwgaXRlbS5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgICAgICBjb25zdCB2TGlzdCA9IHN0ci5zcGxpdCgnXVsnKTtcbiAgICAgICAgICAgICAgICBjb25zdCBvYmplY3QgPSB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogaXRlbS5zdWJzdHJpbmcoMCxiKSxcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGVkOiBbKGRhdGE6IGFueSwgYXM6IGFueSkgPT4gdHJ1ZV1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHZMaXN0Lm1hcCggXG4gICAgICAgICAgICAgICAgICAgIChmaWx0ZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlciA9IGZpbHRlci5yZXBsYWNlKC9cXGAvZywgJy4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlciA9IGZpbHRlci5yZXBsYWNlKC9cXEAvZywgJ2RhdGEnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaWx0ZXIuaW5kZXhPZignb3JkZXItYnk6JykgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFyZzogYW55ID0gZmlsdGVyLnN1YnN0cmluZyhmaWx0ZXIuaW5kZXhPZignb3JkZXItYnk6JykgKyAxMCkudHJpbSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFyZ2xpc3QgPSBhcmcuc3BsaXQoJ34nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBhcmdsaXN0WzBdLnRyaW0oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvcmRlcj0gYXJnbGlzdFsxXSA/IGFyZ2xpc3RbMV0udHJpbSgpLnRvTG93ZXJDYXNlKCk6ICdhc2MnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdFsnc29ydCddID0gZnVuY3Rpb24gKGFycmF5OiBhbnkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgX3ZhbHVlT2YgPSAoa2V5OiBzdHJpbmcsIHA6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5LnNwbGl0KCcuJykubWFwKCAoeCkgPT4ge3AgPSBwW3hdfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJyYXkuc29ydChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGE6IGFueSxiOiBhbnkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZsYWcgPV92YWx1ZU9mKGtleSwgYSkgPiBfdmFsdWVPZihrZXksIGIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmbGFnID8gKG9yZGVyID09PSAnYXNjJyA/IDE6IC0xKSA6IChvcmRlciA9PT0gJ2FzYycgPyAtMTogMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHQgPSBmaWx0ZXIuaW5kZXhPZignJiYnKSA+IDAgfHwgZmlsdGVyLmluZGV4T2YoJ3x8JykgPiAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmID0gJ3JldHVybiBmdW5jdGlvbiAoZGF0YSwgYXNMaXN0KSB7IFxcbic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZiArPSB0aGlzLl9nbG9iYWxGdW5jdGlvbnMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmICs9ICd2YXIgeCA9IGZhbHNlO1xcbiB0cnl7XFxuIHggPSAnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGYgKz0gKHQgPyAnKCcgKyBmaWx0ZXIgKyAnKScgOiBmaWx0ZXIpICsgJzsgXFxufWNhdGNoKGUpe31cXG4gcmV0dXJuIHg7XFxufSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0Wyd2YWxpZGF0ZWQnXS5wdXNoKCBuZXcgRnVuY3Rpb24oZikoKSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChvYmplY3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9oYW5kbGVTcGVjaWFsQ2hhcmFjdGVycyhwYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgICAgICBwYXRoLnNwbGl0KCddJykubWFwKFxuICAgICAgICAgICAgKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBiaW5kZXggPSBpdGVtLmluZGV4T2YoJ1snKTtcbiAgICAgICAgICAgICAgICBpZiAoYmluZGV4ID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHggPSAnJztcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBiaW5kZXggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB4ICs9IGl0ZW0uc3Vic3RyaW5nKDAsIGJpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgeCArPSBpdGVtLnN1YnN0cmluZyhiaW5kZXgpLnJlcGxhY2UoL1xcLi9nLCdgJyk7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5qb2luKCddJyk7XG4gICAgfVxuICAgIHByaXZhdGUgX3ByZXBhcmVKc29uUGF0aChwYXRoOiBhbnkpIHtcbiAgICAgICAgbGV0IHJlc3VsdDogYW55O1xuICAgICAgICBpZiAocGF0aCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICByZXN1bHQgPSBbXTtcbiAgICAgICAgICAgIHBhdGgubWFwKFxuICAgICAgICAgICAgICAgIChpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLl9oYW5kbGVTcGVjaWFsQ2hhcmFjdGVycyhpKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5fbWFrZUFyZ3VtZW50cyh4KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLl9oYW5kbGVTcGVjaWFsQ2hhcmFjdGVycyhwYXRoKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuX21ha2VBcmd1bWVudHMoeCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBfc2VsZWN0KFxuICAgICAgICBwYXRoOiBhbnksXG4gICAgICAgIGZyb206IHN0cmluZyxcbiAgICAgICAgZGVlcFhtbDogYm9vbGVhbixcbiAgICAgICAgYXM6IGFueSxcbiAgICAgICAgY2xhdXNlPzogY2xhdXNlRXZhbHVhdG9yKTogQmVoYXZpb3JTdWJqZWN0PGFueT4ge1xuXG4gICAgICAgIGNvbnN0IGRhdGFTdG9yZSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8YW55PihudWxsKTtcblxuICAgICAgICB0aGlzLl9nZXQoZnJvbSkuc3Vic2NyaWJlKFxuICAgICAgICAgICAgKGRhdGE6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCByZXN1bHQ6IGFueTtcbiAgICAgICAgICAgICAgICBjb25zdCBqcGF0aCA9IHRoaXMuX3ByZXBhcmVKc29uUGF0aChwYXRoKTtcblxuICAgICAgICAgICAgICAgIGlmICghY2xhdXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsYXVzZSA9IChub2RlOiBhbnksIHBhdGg6IHN0cmluZywgdmFsdWU6IGFueSkgPT4gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChwYXRoIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0ge307XG4gICAgICAgICAgICAgICAgICAgIGpwYXRoLm1hcCgocGF0aEl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHkgPSB0aGlzLl92YWx1ZU9mSnNvblBhdGgocGF0aEl0ZW0sIGRhdGEsIGFzLCBkZWVwWG1sLCBjbGF1c2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQga2V5ID0gdGhpcy5fc3RyaW5nVmFsdWVPZktleShwYXRoSXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2tleV0gPSB5O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKHJlc3VsdCkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBwYXRoID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB0aGlzLl92YWx1ZU9mSnNvblBhdGgoanBhdGgsIGRhdGEsIGFzLCBkZWVwWG1sLCBjbGF1c2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFTdG9yZS5uZXh0KHJlc3VsdCk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkYXRhU3RvcmUuZXJyb3IoJ1Jlc3VsdCBub3QgZm91bmQgZm9yICcgKyBwYXRoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgKGVycm9yOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBkYXRhU3RvcmUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gZGF0YVN0b3JlO1xuICAgIH1cblxuICAgIC8qXG4gICAgKiBXaWxsIGNvbnZlcnQgdGhlIHhtbCBpbnRvIGEganNvbi5cbiAgICAqIEBwYXJhbSB4bWwgWE1MIHRvIGJlIGNvbnZlcnRlZC5cbiAgICAqIEByZXR1cm5zIHJldHVybnMgY29udmVydGVkIEpTT04uXG4gICAgKi9cbiAgICBwcml2YXRlIF94bWwyanNvbih4bWw6IGFueSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IG9iaiA9IHt9O1xuICAgICAgICAgICAgaWYgKHhtbC5hdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYyA9IHhtbC5hdHRyaWJ1dGVzO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGF0dHIgPSBjW2ldO1xuICAgICAgICAgICAgICAgIG9ialthdHRyLm5hbWVdID0gYXR0ci52YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoeG1sLmNoaWxkTm9kZXMgJiYgeG1sLmNoaWxkTm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB4bWwuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0geG1sLmNoaWxkTm9kZXNbaV07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5vZGVOYW1lID0gaXRlbS5ub2RlTmFtZTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAob2JqW25vZGVOYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmcmFnbWVudCA9IHRoaXMuX3htbDJqc29uKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZyYWdtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYmpbbm9kZU5hbWVdID0gZnJhZ21lbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqW25vZGVOYW1lXS5wdXNoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvbGQgPSBvYmpbbm9kZU5hbWVdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqW25vZGVOYW1lXSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ialtub2RlTmFtZV0ucHVzaChvbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZnJhZ21lbnQgPSB0aGlzLl94bWwyanNvbihpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmcmFnbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ialtub2RlTmFtZV0ucHVzaChmcmFnbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRleHQgPSB4bWwudGV4dENvbnRlbnQudHJpbSgpLnJlcGxhY2UoLyg/OlxcclxcbnxcXHJ8XFxufFxcdCkvZywgJycpO1xuICAgICAgICAgICAgICAgIG9iaiA9IHRleHQubGVuZ3RoID8gdGV4dCA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmxvZ0VuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlLm1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLypcbiAgICAqIFdpbGwgZG8gYSBjaGFpbiBxdWVyeSBvbiBzcGVjaWZpZWQgcGF0aHMgZnJvbSByZW1vdGUgbG9jYXRpb24uXG4gICAgKiBAcGFyYW0gY2hhaW5RdWVyeSBBIEpzb24gc3RydWN0dXJlIHdpdGggcGF0aHMuIEVhY2ggcGF0aCB3aWxsIGNvbnRhaW4gYSBjaGFpbiBvZiBpbnN0cnVjdGlvbnMuXG4gICAgKiBFYWNoIGluc3RydWN0aW9uIHdpbGwgaGF2ZSBhICdpbicgdG8gYSBmaWxlIGFuZCBhIHBhdGggdG8gc2VhcmNoIG9uIGl0IChzZWUuIHNlbGVjdCgpKS4gb25jZSB0aGVcbiAgICAqIHJlc3VsdCBpcyBpbiwgdGhlIG5leHQgaW5zdHJ1Y3Rpb24gaW4gdGhlIHBhdGggY2hhaW4gd2lsbCBiZSB0cmlnZ2VkLiBBZnRlciB0aGUgcGF0aCB0aHJvdWdoIGFsbFxuICAgICogY2hhaW5lZCBwYXRocyBpcyBjb21wbGV0ZWQsIHJlc3VsdGluZyB2YWx1ZSB3aWxsIGJlIHB1dCBpbiBhIGpzb24gd2hlcmUgaXRzIHBhdGggaXMgdGhlIG9yaWdpbmFsXG4gICAgKiBqc29uIHBhdGggYW5kIGl0cyB2YWx1ZSB3aWxsIGJlIHRoZSByZXN1bHRpbmcgdmFsdWUuXG4gICAgKlxuICAgICogdGhpcyBpcyBub3QgZnVsbHkgdGVzdGVkLiBjYWxsZXIgc2hvdWxkIHBhc3Mgc29tZXRoaW5nIGxpa2VcbiAgICAqIHtwYXRoOiBbcGF0aDEscGF0aDJdLCBpbjogJ3NvbWV0aGluZyBvciBibGFuaycsIGRlZXBYbWw6IHRydWUsIGpvaW46IHtrMToge3BhdGg6IHBhdGgzLCBpbjogJ3NvbWV0aGluZyBvciBwbGFuaycsIGNsYXVzZTogZnVuY3Rpb259fX1cbiAgICAqIGlmIHBhdGgxIG9yIHBhdGgyIG9yIHBhdGgzIGFyZSBmb3VuZCBhdCB0aGUgcm9vdCBvYmplY3QsIGEgY2hhaW4gcmVhY3Rpb24gdG8gZmV0Y2ggZGVlcCB3aWxsIGZvbGxvdy4gQW5cbiAgICAqIG9wdGlvbmFsIGNsYXVzZSB3aWxsIGhlbHAgcmVzb2x2ZSBjb21wbGV4IHNpdHVhdGlvbnMuXG4gICAgKlxuICAgICogQHJldHVybnMgcmV0dXJucyBhbiBvYnNlcnZhYmxlLiB0aGUgY2FsbGVyIHNob3VsZCBzdWJzY3JpYmUgdG8gdGhpcyBpbiBvcmRlciB0byByZWNlaXZlIHRoZSByZXN1bHQuXG4gICAgKi9cbiAgICBjaGFpblNlbGVjdChjaGFpblF1ZXJ5OiBhbnkpOiBCZWhhdmlvclN1YmplY3Q8YW55PiB7XG4gICAgICAgIGNvbnN0IHNpemUgPSAoY2hhaW5RdWVyeS5wYXRoIGluc3RhbmNlb2YgQXJyYXkpID8gIGNoYWluUXVlcnkucGF0aC5sZW5ndGggOiAxO1xuICAgICAgICBjb25zdCBvcGVyYXRpb24gPSB7Y2FjaGVkRmlsZXM6IHt9LCBhczoge30sIHJlc3VsdDoge319O1xuICAgICAgICBjb25zdCBkYXRhU3RvcmUgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGFueT4obnVsbCk7XG5cbiAgICAgICAgb3BlcmF0aW9uLmNhY2hlZEZpbGVzW2NoYWluUXVlcnkucGF0aF0gPSBkYXRhU3RvcmU7XG4gICAgICAgIHRoaXMuX3F1ZXJ5SXRlcmF0aW9uKFxuICAgICAgICAgICAgZGF0YVN0b3JlLFxuICAgICAgICAgICAgb3BlcmF0aW9uLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHBhdGg6IGNoYWluUXVlcnkucGF0aCxcbiAgICAgICAgICAgICAgICBpbjogY2hhaW5RdWVyeS5pbixcbiAgICAgICAgICAgICAgICBkZWVwWG1sOiBjaGFpblF1ZXJ5LmRlZXBYbWwsXG4gICAgICAgICAgICAgICAgam9pbjogY2hhaW5RdWVyeS5qb2luLFxuICAgICAgICAgICAgICAgIGhhbmRsZXI6IGNoYWluUXVlcnkuaGFuZGxlcixcbiAgICAgICAgICAgICAgICBxdWVyeUl0ZW1zOiBzaXplXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBkYXRhU3RvcmU7XG4gICAgfVxuXG4gICAgLypcbiAgICAqIFdpbGwgZ3JvdXAgZmlsZSBwYXRocyBpZiB0aGV5IGFyZSBzaW1pbGFyIHRvIGF2b2lkIG11bHRpcGxlIGNhbGxzLlxuICAgICogQHBhcmFtIGxpc3QgQSBsaXN0IG9mIEpzb24ge3BhdGhzLCBpbiwgZGVlcFhtbH0gc3RydWN0dXJlcy4gZGVlcFhtbCBpcyBvcHRpb25hbC5cbiAgICAqIEBwYXJhbSBjbGF1c2UgQSBtZXRob2QgYnkgd2hpY2ggdmFsdWUocykgZm9yIHRoZSBwYXRoKHMpIGNvdWxkIGJlIGV2YWx1YXRlZC4gdGhlIGNhbGxlciB3b3VsZCBldmFsdWF0ZSB0aGUgdmFsdWUgZm9yIGEgZ2l2ZW4gYXR0cmlidXRlLlxuICAgICogQHJldHVybnMgcmV0dXJucyBhbiBvYnNlcnZhYmxlLiB0aGUgY2FsbGVyIHNob3VsZCBzdWJzY3JpYmUgdG8gdGhpcyBpbiBvcmRlciB0byByZWNlaXZlIHRoZSByZXN1bHQuXG4gICAgKi9cbiAgICBhcnJheVNlbGVjdChcbiAgICAgICAgbGlzdDogYW55LFxuICAgICAgICBjbGF1c2U/OiBjbGF1c2VFdmFsdWF0b3IpOiBCZWhhdmlvclN1YmplY3Q8YW55PiAge1xuICAgICAgICBjb25zdCBncm91cGVkTGlzdCA9IHt9O1xuICAgICAgICBsaXN0Lm1hcCggKGl0ZW06IGFueSkgPT4ge1xuICAgICAgICAgICAgaWYgKGdyb3VwZWRMaXN0W2l0ZW0uaW5dID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBncm91cGVkTGlzdFtpdGVtLmluXSA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZ3JvdXBlZExpc3RbaXRlbS5pbl0ucHVzaCh7cGF0aDogaXRlbS5wYXRoLCBkZWVwWG1sOiBpdGVtLmRlZXBYbWx9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGRhdGFTdG9yZSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8YW55PihudWxsKTtcblxuICAgICAgICBPYmplY3Qua2V5cyhncm91cGVkTGlzdCkubWFwICggKHVybCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fc2VsZWN0KGdyb3VwZWRMaXN0W3VybF0ucGF0aCwgdXJsLCBncm91cGVkTGlzdFt1cmxdLmRlZXBYbWwsIHVuZGVmaW5lZCwgY2xhdXNlKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAgICAgKGRhdGE6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVN0b3JlLm5leHQoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIChlcnJvcjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFTdG9yZS5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBkYXRhU3RvcmU7XG4gICAgfVxuXG4gICAgLypcbiAgICAqIFdpbGwgcXVlcnkgcGF0aCBmcm9tIGEgcmVtb3RlIGxvY2F0aW9uIHF1YWxpZmllZCB0aHJvdWdoIGFuIG9wdGlvbmFsIGNsYXVzZSBmdW5jdGlvbiB0aGF0XG4gICAgKiBldmFsdWF0ZXMsIGZpbHRlcnMsIG9yIHNvcnRzIHRoZSByZXN1bCBvZiB0aGUgcXVlcnkuXG4gICAgKiBAcGFyYW0gcGF0aCBBIGEgc2luZ2xlIEpTT04gcGF0aCBvciBsaXN0IG9mIHBhdGhzIHRvIHNlbGVjdCAoaS5lLiwgJ2EuYi5jJylcbiAgICAqIEBwYXJhbSBmcm9tIEEgcmVmZXJlbmNlIFVSTCB0byBhIHJlbW90ZSBzb3VyY2UuXG4gICAgKiBAcGFyYW0gZGVlcFhtbCBpZiBjZGF0YS1zZWN0aW9uIHNob3VsZCBiZSBwYXJzZWQuXG4gICAgKiBAcGFyYW0gY2xhdXNlIEEgbWV0aG9kIGJ5IHdoaWNoIHZhbHVlKHMpIGZvciB0aGUgcGF0aChzKSBjb3VsZCBiZSBldmFsdWF0ZWQuIHRoZSBjYWxsZXIgd291bGQgZXZhbHVhdGUgdGhlIHZhbHVlIGZvciBhIGdpdmVuIGF0dHJpYnV0ZS5cbiAgICAqIEByZXR1cm5zIHJldHVybnMgYW4gb2JzZXJ2YWJsZS4gdGhlIGNhbGxlciBzaG91bGQgc3Vic2NyaWJlIHRvIHRoaXMgaW4gb3JkZXIgdG8gcmVjZWl2ZSB0aGUgcmVzdWx0LlxuICAgICovXG4gICAgc2VsZWN0KFxuICAgICAgICBwYXRoOiBhbnksXG4gICAgICAgIGZyb206IHN0cmluZyxcbiAgICAgICAgZGVlcFhtbDogYm9vbGVhbixcbiAgICAgICAgY2xhdXNlPzogY2xhdXNlRXZhbHVhdG9yKTogQmVoYXZpb3JTdWJqZWN0PGFueT4ge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3QocGF0aCwgZnJvbSwgZGVlcFhtbCwgdW5kZWZpbmVkLCBjbGF1c2UpO1xuICAgIH1cbn1cbiJdfQ==