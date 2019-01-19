/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import * as xmldom from 'xmldom';
/** @typedef {?} */
var clauseEvaluator;
export { clauseEvaluator };
var WizardQueryService = /** @class */ (function () {
    function WizardQueryService(http) {
        this.http = http;
        this.SERVICE_PATH = '';
        this.logEnabled = false;
    }
    /**
     * @return {?}
     */
    WizardQueryService.prototype._globalFunctions = /**
     * @return {?}
     */
    function () {
        return "\n        function reverse(a) {\n            var result = a;\n            if (a instanceof Array) {\n                result = a.reverse();\n            } else if (typeof a === 'string') {\n                result = a.split('').reverse().join('');\n            }\n            return result;\n        }\n        function sum(a,b) {\n            var total = 0;\n            if (a instanceof Array) { \n                a.map(function(k) {\n                    total += sum(k, b);\n                });\n            } else if (typeof a === 'object') {\n                if (b.indexOf('.')>0) {\n                    var t = a;\n                    b.split('.').map(function(k){\n                        total+=sum( t[k], b.substring(k.length+1) );\n                    });\n                } else if(a[b]) {\n                    var t = a[b];\n                    total += (typeof t === 'number') ? t : parseFloat(t);\n                } \n            } else if (typeof a === 'number') {\n                total = a;\n            } \n            return total;\n        }\n        function count(a,b) {\n            var total = 0;\n            if (a instanceof Array) { \n                a.map(function(k) {\n                    total += count(k, b);\n                });\n            } else if (typeof a === 'object') {\n                Object.keys(a).map(function(k){\n                    total += count(a[k],b);\n                });\n            } else if (typeof a === 'string') {\n                total = a.split(b).length - 1;\n            } else if (a === b) {\n                total++;\n            }\n            return total;\n        }\n        function like(a, b) {\n            var result = undefined;\n            if (a instanceof Array) {\n                result = [];\n                a.map(function(k) {\n                    result.push(like(k, b));\n                });\n            } else if (typeof a === 'object') {\n                result = [];\n                Object.keys(a).map(function(k){\n                    result.push(like(a[k], b));\n                });\n            } else if (typeof a === 'string') {\n                if (a.indexOf(b) > -1) {\n                    result = a;\n                }\n            } else if (a === b) {\n                result = a;\n            }\n            return result;\n        }\n        function as(a, b) {\n            if (asList[b] === undefined) {\n                asList[b] = [a];\n            } else {\n                asList[b].push(a);\n            }\n            return a;\n        }\n        function is_in(a, b, list) {\n            var result = undefined;\n            if (b instanceof Array) { \n                result = [];\n                b.map(function(k) {\n                    result.push(is_in(k, list));\n                });\n            } else if (typeof b === 'object') {\n                result = [];\n                Object.keys(b).map(function(k) {\n                    result.push(is_in(b[k], list));\n                });\n            } else if (asList[list]){\n                asList[list].map(function(t) {\n                    if (typeof t ==='string') {\n                        if (t.indexOf(b) > -1) {\n                            result = a;\n                        }\n                    }\n                });\n            }\n            return result;\n        }\n        ";
    };
    /**
     * @param {?} value
     * @param {?} deepXml
     * @return {?}
     */
    WizardQueryService.prototype._normalize = /**
     * @param {?} value
     * @param {?} deepXml
     * @return {?}
     */
    function (value, deepXml) {
        var _this = this;
        if (value instanceof Array) {
            /** @type {?} */
            var result_1 = [];
            value.map(function (item) {
                result_1.push(_this._normalize(item, deepXml));
            });
            value = result_1;
        }
        else if (typeof value === 'object') {
            /** @type {?} */
            var items = Object.keys(value);
            if (items.length === 1 && !(value[items[0]] instanceof Array)) {
                if (value['#text']) {
                    value = value['#text'];
                }
                else if (value['#cdata-section']) {
                    value = value['#cdata-section'];
                    if (deepXml) {
                        try {
                            /** @type {?} */
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
                /** @type {?} */
                var result_2 = {};
                items.map(function (item) {
                    result_2[item] = _this._normalize(value[item], deepXml);
                });
                value = result_2;
            }
        }
        return value;
    };
    /**
     * @param {?} path
     * @param {?} data
     * @param {?} as
     * @param {?} deepXml
     * @param {?=} clause
     * @return {?}
     */
    WizardQueryService.prototype._valueOfJsonPath = /**
     * @param {?} path
     * @param {?} data
     * @param {?} as
     * @param {?} deepXml
     * @param {?=} clause
     * @return {?}
     */
    function (path, data, as, deepXml, clause) {
        /** @type {?} */
        var result;
        /** @type {?} */
        var x = this._normalize(data, deepXml);
        path.map(function (subkey) {
            /** @type {?} */
            var node = x;
            if (node && node instanceof Array) {
                /** @type {?} */
                var t_1 = [];
                if (subkey.sort) {
                    node = subkey.sort(node);
                }
                node.map(function (item) {
                    if (typeof item === 'object') {
                        if (subkey.key.length) {
                            x = subkey.key.length ? item[subkey.key] : item;
                            if (x && subkey.validated) {
                                /** @type {?} */
                                var r_1 = true;
                                subkey.validated.map(function (v) {
                                    /** @type {?} */
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
                                /** @type {?} */
                                var r_2 = true;
                                subkey.validated.map(function (v) {
                                    /** @type {?} */
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
                    /** @type {?} */
                    var t_2 = [];
                    if (subkey.sort) {
                        x = subkey.sort(x);
                    }
                    x.map(function (item) {
                        if (subkey.validated) {
                            /** @type {?} */
                            var r_3 = true;
                            subkey.validated.map(function (v) {
                                /** @type {?} */
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
                        /** @type {?} */
                        var r_4 = true;
                        subkey.validated.map(function (v) {
                            /** @type {?} */
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
    /**
     * @param {?} path
     * @return {?}
     */
    WizardQueryService.prototype._get = /**
     * @param {?} path
     * @return {?}
     */
    function (path) {
        var _this = this;
        /** @type {?} */
        var url = this.SERVICE_PATH + path;
        /** @type {?} */
        var dot = path.lastIndexOf('.');
        /** @type {?} */
        var ext = dot < 0 ? undefined : path.toLowerCase().substr(dot);
        /** @type {?} */
        var headers = new HttpHeaders();
        /** @type {?} */
        var result;
        headers.set('Access-Control-Allow-Origin', '*');
        if (ext === '.xml') {
            headers.set('Content-Type', 'text; charset=utf-8').set('Accept', 'text');
            result = this.http.get(url, { headers: headers, responseType: 'text' })
                .pipe(map(function (res) {
                /** @type {?} */
                var xml = new xmldom.DOMParser().parseFromString(res);
                /** @type {?} */
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
                /** @type {?} */
                var parsed;
                try {
                    parsed = JSON.parse(res);
                }
                catch (e) {
                    try {
                        /** @type {?} */
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
    /**
     * @param {?} key
     * @return {?}
     */
    WizardQueryService.prototype._stringValueOfKey = /**
     * @param {?} key
     * @return {?}
     */
    function (key) {
        /** @type {?} */
        var result = [];
        if (key instanceof Array) {
            key.map(function (item) {
                if (item instanceof Array) {
                    /** @type {?} */
                    var x_1 = [];
                    item.map(function (subitem) {
                        if (subitem.key.length) {
                            x_1.push(subitem.key);
                        }
                    });
                    result.push(x_1.join('.'));
                }
                else if (typeof item === 'string') {
                    /** @type {?} */
                    var i = item.indexOf('[');
                    /** @type {?} */
                    var j = item.indexOf(']');
                    /** @type {?} */
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
    /**
     * @param {?} value
     * @param {?} key
     * @param {?} operation
     * @param {?} action
     * @return {?}
     */
    WizardQueryService.prototype._addToResult = /**
     * @param {?} value
     * @param {?} key
     * @param {?} operation
     * @param {?} action
     * @return {?}
     */
    function (value, key, operation, action) {
        /** @type {?} */
        var path = this._stringValueOfKey(action.path);
        /** @type {?} */
        var key2 = this._stringValueOfKey(key);
        /** @type {?} */
        var op = operation.result[path];
        /** @type {?} */
        var complete = false;
        if (!op) {
            operation.result[path] = {};
        }
        if (op) {
            /** @type {?} */
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
    /**
     * @param {?} result
     * @return {?}
     */
    WizardQueryService.prototype._pack = /**
     * @param {?} result
     * @return {?}
     */
    function (result) {
        var _this = this;
        if (result instanceof Array) {
            /** @type {?} */
            var list_1 = [];
            result.map(function (item) {
                list_1.push(_this._pack(item));
            });
            result = list_1;
        }
        else if (typeof result === 'object') {
            /** @type {?} */
            var keys = Object.keys(result);
            keys.map(function (key) {
                /** @type {?} */
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
    /**
     * @param {?} promise
     * @param {?} as
     * @param {?} result
     * @return {?}
     */
    WizardQueryService.prototype._triggerResult = /**
     * @param {?} promise
     * @param {?} as
     * @param {?} result
     * @return {?}
     */
    function (promise, as, result) {
        /** @type {?} */
        var x = this._pack(result);
        /** @type {?} */
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
    /**
     * @param {?} promise
     * @param {?} path
     * @param {?} operation
     * @param {?} action
     * @return {?}
     */
    WizardQueryService.prototype._subquery = /**
     * @param {?} promise
     * @param {?} path
     * @param {?} operation
     * @param {?} action
     * @return {?}
     */
    function (promise, path, operation, action) {
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
                /** @type {?} */
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
    /**
     * @param {?} promise
     * @param {?} operation
     * @param {?} action
     * @param {?=} cacheNamed
     * @return {?}
     */
    WizardQueryService.prototype._queryIteration = /**
     * @param {?} promise
     * @param {?} operation
     * @param {?} action
     * @param {?=} cacheNamed
     * @return {?}
     */
    function (promise, operation, action, cacheNamed) {
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
                        /** @type {?} */
                        var operationalKey_1 = action.join ? action.join[action.path] : undefined;
                        if (operationalKey_1) {
                            // assumption is the resulting list is a list of file paths.
                            data.map(function (content) {
                                /** @type {?} */
                                var path = content['#text'] ? content['#text'] : content;
                                /** @type {?} */
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
                                /** @type {?} */
                                var result = operation.result ? operation.result : {};
                                operation.as = _this._triggerResult(promise, operation.as, Object.keys(operation.result).length ? operation.result : data);
                            }
                        }
                    }
                    else if (typeof data === 'object') {
                        Object.keys(data).map(function (key) {
                            /** @type {?} */
                            var content = data[key];
                            /** @type {?} */
                            var operationalKey = action.join ? action.join[key] : undefined;
                            if (content && content.length && operationalKey) {
                                /** @type {?} */
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
    /**
     * @param {?} key
     * @return {?}
     */
    WizardQueryService.prototype._makeArguments = /**
     * @param {?} key
     * @return {?}
     */
    function (key) {
        var _this = this;
        /** @type {?} */
        var list = key.split('.');
        /** @type {?} */
        var result = [];
        list.map(function (item) {
            /** @type {?} */
            var b = item.indexOf('[');
            if (b < 0) {
                result.push({
                    key: item,
                    validated: [function (data, as) { return true; }]
                });
            }
            else {
                /** @type {?} */
                var str = item.substring(b + 1, item.length - 1);
                /** @type {?} */
                var vList = str.split('][');
                /** @type {?} */
                var object_1 = {
                    key: item.substring(0, b),
                    validated: [function (data, as) { return true; }]
                };
                vList.map(function (filter) {
                    filter = filter.replace(/\`/g, '.');
                    filter = filter.replace(/\@/g, 'data');
                    if (filter.indexOf('order-by:') > -1) {
                        /** @type {?} */
                        var arg = filter.substring(filter.indexOf('order-by:') + 10).trim();
                        /** @type {?} */
                        var arglist = arg.split('~');
                        /** @type {?} */
                        var key_1 = arglist[0].trim();
                        /** @type {?} */
                        var order_1 = arglist[1] ? arglist[1].trim().toLowerCase() : 'asc';
                        object_1['sort'] = function (array) {
                            /** @type {?} */
                            var _valueOf = function (key, p) {
                                key.split('.').map(function (x) { p = p[x]; });
                                return p;
                            };
                            return array.sort(function (a, b) {
                                /** @type {?} */
                                var flag = _valueOf(key_1, a) > _valueOf(key_1, b);
                                return flag ? (order_1 === 'asc' ? 1 : -1) : (order_1 === 'asc' ? -1 : 1);
                            });
                        };
                    }
                    else {
                        /** @type {?} */
                        var t = filter.indexOf('&&') > 0 || filter.indexOf('||') > 0;
                        /** @type {?} */
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
    /**
     * @param {?} path
     * @return {?}
     */
    WizardQueryService.prototype._handleSpecialCharacters = /**
     * @param {?} path
     * @return {?}
     */
    function (path) {
        /** @type {?} */
        var result = [];
        path.split(']').map(function (item) {
            /** @type {?} */
            var bindex = item.indexOf('[');
            if (bindex >= 0) {
                /** @type {?} */
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
    /**
     * @param {?} path
     * @return {?}
     */
    WizardQueryService.prototype._prepareJsonPath = /**
     * @param {?} path
     * @return {?}
     */
    function (path) {
        var _this = this;
        /** @type {?} */
        var result;
        if (path instanceof Array) {
            result = [];
            path.map(function (i) {
                /** @type {?} */
                var x = _this._handleSpecialCharacters(i);
                result.push(_this._makeArguments(x));
            });
        }
        else {
            /** @type {?} */
            var x = this._handleSpecialCharacters(path);
            result = this._makeArguments(x);
        }
        return result;
    };
    /**
     * @param {?} path
     * @param {?} from
     * @param {?} deepXml
     * @param {?} as
     * @param {?=} clause
     * @return {?}
     */
    WizardQueryService.prototype._select = /**
     * @param {?} path
     * @param {?} from
     * @param {?} deepXml
     * @param {?} as
     * @param {?=} clause
     * @return {?}
     */
    function (path, from, deepXml, as, clause) {
        var _this = this;
        /** @type {?} */
        var dataStore = new BehaviorSubject(null);
        this._get(from).subscribe(function (data) {
            /** @type {?} */
            var result;
            /** @type {?} */
            var jpath = _this._prepareJsonPath(path);
            if (!clause) {
                clause = function (node, path, value) { return value; };
            }
            if (path instanceof Array) {
                result = {};
                jpath.map(function (pathItem) {
                    /** @type {?} */
                    var y = _this._valueOfJsonPath(pathItem, data, as, deepXml, clause);
                    if (y) {
                        /** @type {?} */
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
    /**
     * @param {?} xml
     * @return {?}
     */
    WizardQueryService.prototype._xml2json = /**
     * @param {?} xml
     * @return {?}
     */
    function (xml) {
        try {
            /** @type {?} */
            var obj = {};
            if (xml.attributes) {
                /** @type {?} */
                var c = xml.attributes;
                for (var i = 0; i < c.length; i++) {
                    /** @type {?} */
                    var attr = c[i];
                    obj[attr.name] = attr.value;
                }
            }
            if (xml.childNodes && xml.childNodes.length) {
                for (var i = 0; i < xml.childNodes.length; i++) {
                    /** @type {?} */
                    var item = xml.childNodes[i];
                    /** @type {?} */
                    var nodeName = item.nodeName;
                    if (obj[nodeName] === undefined) {
                        /** @type {?} */
                        var fragment = this._xml2json(item);
                        if (fragment) {
                            obj[nodeName] = fragment;
                        }
                    }
                    else {
                        if (obj[nodeName].push === undefined) {
                            /** @type {?} */
                            var old = obj[nodeName];
                            obj[nodeName] = [];
                            obj[nodeName].push(old);
                        }
                        /** @type {?} */
                        var fragment = this._xml2json(item);
                        if (fragment) {
                            obj[nodeName].push(fragment);
                        }
                    }
                }
            }
            else {
                /** @type {?} */
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
    /**
     * @param {?} chainQuery
     * @return {?}
     */
    WizardQueryService.prototype.chainSelect = /**
     * @param {?} chainQuery
     * @return {?}
     */
    function (chainQuery) {
        /** @type {?} */
        var size = (chainQuery.path instanceof Array) ? chainQuery.path.length : 1;
        /** @type {?} */
        var operation = { cachedFiles: {}, as: {}, result: {} };
        /** @type {?} */
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
    /**
     * @param {?} list
     * @param {?=} clause
     * @return {?}
     */
    WizardQueryService.prototype.arraySelect = /**
     * @param {?} list
     * @param {?=} clause
     * @return {?}
     */
    function (list, clause) {
        var _this = this;
        /** @type {?} */
        var groupedList = {};
        list.map(function (item) {
            if (groupedList[item.in] === undefined) {
                groupedList[item.in] = [];
            }
            groupedList[item.in].push({ path: item.path, deepXml: item.deepXml });
        });
        /** @type {?} */
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
    /**
     * @param {?} path
     * @param {?} from
     * @param {?} deepXml
     * @param {?=} clause
     * @return {?}
     */
    WizardQueryService.prototype.select = /**
     * @param {?} path
     * @param {?} from
     * @param {?} deepXml
     * @param {?=} clause
     * @return {?}
     */
    function (path, from, deepXml, clause) {
        return this._select(path, from, deepXml, undefined, clause);
    };
    WizardQueryService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    WizardQueryService.ctorParameters = function () { return [
        { type: HttpClient }
    ]; };
    return WizardQueryService;
}());
export { WizardQueryService };
if (false) {
    /** @type {?} */
    WizardQueryService.prototype.SERVICE_PATH;
    /** @type {?} */
    WizardQueryService.prototype.logEnabled;
    /** @type {?} */
    WizardQueryService.prototype.http;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLXF1ZXJ5LnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VkZWgvd2l6YXJkLXF1ZXJ5LyIsInNvdXJjZXMiOlsic3JjL2FwcC93aXphcmQtcXVlcnkvd2l6YXJkLXF1ZXJ5LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQXFDQSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxVQUFVLEVBQUUsV0FBVyxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFFN0QsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ25DLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDckMsT0FBTyxLQUFLLE1BQU0sTUFBTSxRQUFRLENBQUM7Ozs7O0lBZ0I3Qiw0QkFDVTtRQUFBLFNBQUksR0FBSixJQUFJOzRCQUpRLEVBQUU7MEJBQ0osS0FBSztLQU14Qjs7OztJQUVPLDZDQUFnQjs7OztRQUNwQixNQUFNLENBQUMsd3lHQW9HTixDQUFDOzs7Ozs7O0lBU0UsdUNBQVU7Ozs7O2NBQUMsS0FBVSxFQUFFLE9BQWdCOztRQUMzQyxFQUFFLENBQUMsQ0FBQyxLQUFLLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQzs7WUFDekIsSUFBTSxRQUFNLEdBQUcsRUFBRSxDQUFDO1lBQ2xCLEtBQUssQ0FBQyxHQUFHLENBQUUsVUFBQyxJQUFJO2dCQUNaLFFBQU0sQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQzthQUMvQyxDQUFDLENBQUM7WUFDSCxLQUFLLEdBQUcsUUFBTSxDQUFDO1NBQ2xCO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7O1lBQ25DLElBQUksS0FBSyxHQUFRLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFD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QUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0tBQy9EOztnQkE3OEJKLFVBQVU7Ozs7Z0JBZEgsVUFBVTs7NkJBdENsQjs7U0FxRGEsa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiogUXVlcnkgc2VydmljZSBwcm92aWRlcyBhIHdheSB0byBxdWVyeSBhIHJlbW90ZSBKU09OIG9yIFhNTCBmaWxlLiBJdCBjYW4gYmUgdXNlZCBpbiBmb2xsb3dpbmcgd2F5cy5cbipcbiogMSkgV2l0aCBzZWxlY3QoKSBtZXRob2QsIGEgc2luZ2xlIHBhdGggb3IgYSBsaXN0IG9mIHBhdGhzIGNhbiBiZSBnaXZlbi4gZWFjaCBwYXRoIHdpbGwgYmUgYSBqc29uIHF1YWxpZnlpbmdcbiogcGF0aCB0byBhbiBlbmQgbm9kZSAoaS5lLiwgJ2Jvb2tzLmJvb2sudGl0bGUnKS4gSWYgbXVsdGlwbGUgcGF0aHMgYXJlIHN1cHBsaWVkLCBxdWVyeSByZXN1bHQgd2lsbCBiZSBhIGpzb25cbiogb2JqZWN0IHdoZXJlIGVhY2ggYXR0cmlidXRlIHdpbGwgYmUgYSBnaXZlbiBxdWVyeSBwYXRoIGFuZCBpdHMgdmFsdWUgd2lsbCBiZSBxdWVyeSByZXN1bHQgZm9yIHRoYXQgcGF0aC5cbiogRm9yIGV4YW1wbGU6XG4qIHNlbGVjdChbJ2Jvb2tzLmJvb2sudGl0bGUnLCAnYm9va3MuYm9vay5hdXRob3InXSwgJy9leGFtcGxlMS54bWwnLCBmYWxzZSlcbiogd2lsbCByZXN1bHQgaW4geydib29rcy5ib29rLnRpdGxlJzogW10sICdib29rcy5ib29rLmF1dGhvcic6IFtdfS5cbiogRWFjaCByZXN1bHQgd2lsbCBub3QgY28tcmVsYXRlZCB3aXRoIG90aGVyIHJlc3VsdCBpbiBvcmRlciBvciBpbiBhbnkgb3RoZXIgZm9ybS4gaWYgYSBjbGF1c2UgYXJndW1lbnQgaXNcbiogc3VwcGxpZWQsIGl0IHdpbGwgYmUgaW52b2tlZCB0byBmdXJ0aGVyIGFzc2lzdCBpbiBmaWx0ZXJpbmcgdGhlIHF1ZXJ5IHJlc3VsdC4gZm9yIGV4YW1wbGUgaWYgY2VydGFpbiBjYXRlZ29yeVxuKiBvZiBib29rcyBhcmUgcmVxdWlyZWQsIHRoZSBjbGF1c2UgZnVuY3Rpb24gY2FuIGxvb2sgZm9yIGEgYm9vayBjYXRlZ29yeSBhdHRyaWJ1dGUgYW5kIHJldHVybiB0aGUgcXVlcnkgcmVzdWx0XG4qIGlmIGFjY2VwdGFibGUgb3IgdW5kZWZpbmVkIGlmIHJlc3VsdCBzaG91bGQgYmUgZmlsdGVyZWQgb3V0IG9mIHRoZSByZXN1bHQuXG4qXG4qIDIpIFdpdGggYXJyYXlTZWxlY3QoKSBtZXRob2QsIGFuIGFycmF5IG9mIHtwYXRoOiAnJywgaW46JycsIGRlZXBYbWw6IHRydWV9IGNhbiBiZSBzdXBwbGllZCwgZWFjaCBlbnRyeSB3aWxsIGJlIGV2YWx1YXRlZFxuKiBhcyBpZiBzZWxlY3QoKSBtZXRob2QgaXMgaW52b2tlZC4gQnV0IGZpcnN0LCByZXF1ZXN0cyB3aXRoIHNpbWlsYXIgcGF0aHMgd2lsbCBiZSBtZXJnZWQgaW50byBvbmUgY2FsbC4gIFRoaXNcbiogbWV0aG9kIGlzIHVzZWZ1bCB3aGVuIHBhdGhzIGFyZSBkeW5hbWljbHkgZ2l2ZW4gYW5kIGl0IGlzIG5vdCBjbGVhciBpbiBhZHZhbmNlIGlmIHRoZXJlIGFyZSByZXF1ZXN0cyB3aXRoXG4qIHNpbWlsYXIgcGF0aHMuIGRlZXBYbWwgYXR0cmlidXRlIGlzIG9wdGlvbmFsLlxuKlxuKiAzKSBXaXRoIGNoYWluU2VsZWN0KCkgbWV0aG9kLCBhIGNoYWluZWQgc2V0IG9mIHtwYXRoOiAnJywgaW46ICcnLCBkZWVwWG1sOiB0cnVlfSBpcyBnaXZlbiBpbiBhIGpzb24gb2JqZWN0LiBXaGVuIHJlc3VsdCBvZlxuKiBhIHF1ZXJ5IGJlY29tZXMgYXZhaWxhYmxlLCB0aGUgcmVxdWVzdCBqc29uIHdpbGwgYmUgZXhhbWluZWQgdG8gc2VlIGlmIGEgcmVxdWVzdCBmb3IgdGhlIGtleSBpcyBhdmFpbGFibGUuIElmXG4qIHNvLCB0aGVuIHRoZSAnaW4nIGZvciB0aGUgcGF0aCB3aWxsIGJlIHByZXBlbmRlZCB0byB0aGUgcmVzdWx0aW5nIHZhbHVlIG9mIHRoZSBwcmV2aW91cyBxdWVyeS4gLCBkZWVwWG1sIGF0dHJpYnV0ZSBpcyBcbiogb3B0aW9uYWwuIFRoaXMgbWV0aG9kIGlzIHVzZWZ1bCB3aGVuIHJlc3VsdCBvZiBhIHF1ZXJ5IGlzIGEganNvbiBvciBhbiB4bWwgZmlsZSBhbmQgYWRkaXRpb25hbCBxdWVyeSBpcyBuZWVkZWQgXG4qIGZ1cnRoZXIgZG93biBpbiB0aGUgcHJlY2VlZGluZyBmaWxlcy4gRm9yIGV4YW1wbGUgdGhlIGFzc3VtcHRpb24gaW4gdGhlIGZvbGxvd2luZyBjYWxsIGlzIHRoYXQgZWFjaCBib29rcy5ib29rIFxuKiByZXN1bHQgd2lsbCBiZSBhIGZpbGUgbmFtZSBhbmQgdGhlIGZpbGUgcGF0aCBmb3IgZWFjaCByZXN1bHQgaXMgJy9zYW1wbGVzL2Jvb2tzLycuXG4qIGNoYWluU2VsZWN0KHtcbiogICBwYXRoOiAnYm9va3MuYm9vaycsXG4qICAgaW46ICdzYW1wbGUxLnhtbCcsXG4qICAgZGVlcFhtbDogdHJ1ZSxcbiogICAnYm9va3MuYm9vayc6IHtcbiogICAgICAgaW46ICcvc2FtcGxlcy9ib29rcy8nLFxuKiAgICAgICBwYXRoOiBbJ3B1YmxpY2F0aW9uLnRpdGxlJywgJ3B1YmxpY2F0aW9uLmF1dGhvciddLFxuKiAgICAgICBoYW5kbGVyOiB0aGlzLmJ1YmxpY2F0aW9uSGFuZGxlclxuKiAgIH0pXG4qIGlmIGEgaGFuZGxlciBpcyBzdXBwbGllZCwgaXQgd2lsbCBiZSB1c2VkIHRvIGZpbHRlciBvdXQgYW55IHJlc3VsdCB0aGF0IGlzIG5vdCBhY2NlcHRhYmxlLlxuKlxuKi9cbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0h0dHBDbGllbnQsIEh0dHBIZWFkZXJzfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5cbmltcG9ydCB7bWFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgKiBhcyB4bWxkb20gZnJvbSAneG1sZG9tJztcblxuLypcbiogQHBhcmFtIG5vZGUgVGhlIHBhcmVudCBub2RlLiBpdCBjYW4gYmUgdXNlZCB0byBldmFsdWF0ZSBiYXNlZCBvbiBvdGhlciBhdHRyaWJ1dGVzIGluIHRoZSBub2RlLlxuKiBAcGFyYW0gcGF0aCBhdHRyaWJ1dGUgdG8gYmUgZXhhbWluZWQuXG4qIEBwYXJhbSB2YWx1ZSB0aGUgdmFsdWUgb2YgdGhlIHBhdGguIGl0IGNvdWxkIGJlIHVuZGVmaW5lZCwgYSBsaXRlcmFsLCBvciBhIGxpc3QuXG4qIEByZXR1cm5zIHJldHVybnMgdGhlIHZhbHVlIG9yIGZpbHRlcmVkIHZlcnNpb24gb2YgdGhlIHZhbHVlIG9yIHVuZGVmaW5lZCBvdGhlcndpc2UuXG4qL1xuZXhwb3J0IHR5cGUgY2xhdXNlRXZhbHVhdG9yID0gKG5vZGU6IGFueSwgcGF0aDogc3RyaW5nLCB2YWx1ZTogYW55KSA9PiBhbnk7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBXaXphcmRRdWVyeVNlcnZpY2Uge1xuXG4gICAgcHVibGljIFNFUlZJQ0VfUEFUSCA9ICcnO1xuICAgIHB1YmxpYyBsb2dFbmFibGVkID0gZmFsc2U7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgaHR0cDogSHR0cENsaWVudFxuICAgICkge1xuXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZ2xvYmFsRnVuY3Rpb25zKCkge1xuICAgICAgICByZXR1cm4gYFxuICAgICAgICBmdW5jdGlvbiByZXZlcnNlKGEpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBhO1xuICAgICAgICAgICAgaWYgKGEgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGEucmV2ZXJzZSgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBhLnNwbGl0KCcnKS5yZXZlcnNlKCkuam9pbignJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHN1bShhLGIpIHtcbiAgICAgICAgICAgIHZhciB0b3RhbCA9IDA7XG4gICAgICAgICAgICBpZiAoYSBpbnN0YW5jZW9mIEFycmF5KSB7IFxuICAgICAgICAgICAgICAgIGEubWFwKGZ1bmN0aW9uKGspIHtcbiAgICAgICAgICAgICAgICAgICAgdG90YWwgKz0gc3VtKGssIGIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICBpZiAoYi5pbmRleE9mKCcuJyk+MCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdCA9IGE7XG4gICAgICAgICAgICAgICAgICAgIGIuc3BsaXQoJy4nKS5tYXAoZnVuY3Rpb24oayl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbCs9c3VtKCB0W2tdLCBiLnN1YnN0cmluZyhrLmxlbmd0aCsxKSApO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYoYVtiXSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdCA9IGFbYl07XG4gICAgICAgICAgICAgICAgICAgIHRvdGFsICs9ICh0eXBlb2YgdCA9PT0gJ251bWJlcicpID8gdCA6IHBhcnNlRmxvYXQodCk7XG4gICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGEgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgdG90YWwgPSBhO1xuICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIHJldHVybiB0b3RhbDtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBjb3VudChhLGIpIHtcbiAgICAgICAgICAgIHZhciB0b3RhbCA9IDA7XG4gICAgICAgICAgICBpZiAoYSBpbnN0YW5jZW9mIEFycmF5KSB7IFxuICAgICAgICAgICAgICAgIGEubWFwKGZ1bmN0aW9uKGspIHtcbiAgICAgICAgICAgICAgICAgICAgdG90YWwgKz0gY291bnQoaywgYik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGEpLm1hcChmdW5jdGlvbihrKXtcbiAgICAgICAgICAgICAgICAgICAgdG90YWwgKz0gY291bnQoYVtrXSxiKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgdG90YWwgPSBhLnNwbGl0KGIpLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGEgPT09IGIpIHtcbiAgICAgICAgICAgICAgICB0b3RhbCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRvdGFsO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGxpa2UoYSwgYikge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGlmIChhIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBbXTtcbiAgICAgICAgICAgICAgICBhLm1hcChmdW5jdGlvbihrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGxpa2UoaywgYikpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBbXTtcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhhKS5tYXAoZnVuY3Rpb24oayl7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGxpa2UoYVtrXSwgYikpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBpZiAoYS5pbmRleE9mKGIpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gYTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGEgPT09IGIpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBhO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBhcyhhLCBiKSB7XG4gICAgICAgICAgICBpZiAoYXNMaXN0W2JdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBhc0xpc3RbYl0gPSBbYV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFzTGlzdFtiXS5wdXNoKGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGE7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaXNfaW4oYSwgYiwgbGlzdCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGlmIChiIGluc3RhbmNlb2YgQXJyYXkpIHsgXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gW107XG4gICAgICAgICAgICAgICAgYi5tYXAoZnVuY3Rpb24oaykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChpc19pbihrLCBsaXN0KSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBiID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IFtdO1xuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGIpLm1hcChmdW5jdGlvbihrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGlzX2luKGJba10sIGxpc3QpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYXNMaXN0W2xpc3RdKXtcbiAgICAgICAgICAgICAgICBhc0xpc3RbbGlzdF0ubWFwKGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0ID09PSdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodC5pbmRleE9mKGIpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBhO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICAgIGA7XG4gICAgfVxuXG4gICAgLypcbiAgICAqIFdpbGwgbm9ybWFsaXplIHRoZSBnaXZlbiB4bWwgb3V0IG9mIGFkZGl0aW9uYWwgI3RleHQgb3IgI2NkYXRhLXNlY3Rpb24gbm9kZXMuXG4gICAgKiBAcGFyYW0gdmFsdWUgdGhlIHhtbCB0byBiZSBub3JtYWlsemVkLlxuICAgICogQHBhcmFtIGRlZXBYbWwgaWYgY2RhdGEtc2VjdGlvbiBzaG91bGQgYmUgcGFyc2VkLlxuICAgICogQHJldHVybiBub3JtYWxpemVkIHhtbC5cbiAgICAqL1xuICAgIHByaXZhdGUgX25vcm1hbGl6ZSh2YWx1ZTogYW55LCBkZWVwWG1sOiBib29sZWFuKSB7XG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICAgICAgICAgIHZhbHVlLm1hcCggKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLl9ub3JtYWxpemUoaXRlbSwgZGVlcFhtbCkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YWx1ZSA9IHJlc3VsdDtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBsZXQgaXRlbXM6IGFueSA9IE9iamVjdC5rZXlzKHZhbHVlKTtcblxuICAgICAgICAgICAgaWYgKGl0ZW1zLmxlbmd0aCA9PT0gMSAmJiAhKHZhbHVlW2l0ZW1zWzBdXSBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZVsnI3RleHQnXSkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlWycjdGV4dCddO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWVbJyNjZGF0YS1zZWN0aW9uJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZVsnI2NkYXRhLXNlY3Rpb24nXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlZXBYbWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeG1sID0gbmV3IHhtbGRvbS5ET01QYXJzZXIoKS5wYXJzZUZyb21TdHJpbmcodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gKHhtbC5kb2N1bWVudEVsZW1lbnQgJiYgeG1sLmRvY3VtZW50RWxlbWVudCAhPSBudWxsKSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5feG1sMmpzb24oeG1sLmRvY3VtZW50RWxlbWVudCkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfWNhdGNoKGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICAgICAgICAgICAgICBpdGVtcy5tYXAoIChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtpdGVtXSA9IHRoaXMuX25vcm1hbGl6ZSh2YWx1ZVtpdGVtXSwgZGVlcFhtbCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSByZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIC8qXG4gICAgKiBAcGFyYW0gcGF0aCBKU09OIHBhdGggdG8gZXZhbHVhdGUuIEEgcGF0aCBjb3VsZCBiZSBmdWxseSBxdWFsaWZpZWQgZm9yIGRlcHRoIG9mIGpzb24gKGkuZS4sICdhLmIuYycpXG4gICAgKiBAcGFyYW0gZGF0YSB0aGUgZGF0YSBzb3VyY2UuXG4gICAgKiBAcGFyYW0gZGVlcFhtbCBpZiBjZGF0YS1zZWN0aW9uIHNob3VsZCBiZSBwYXJzZWQuXG4gICAgKiBAcGFyYW0gY2xhdXNlIEEgbWV0aG9kIGJ5IHdoaWNoIHZhbHVlKHMpIGZvciB0aGUga2V5KHMpIGNvdWxkIGJlIGV2YWx1YXRlZC4gdGhlIGNhbGxlciB3b3VsZCBldmFsdWF0ZSB0aGUgdmFsdWUgZm9yIGEgZ2l2ZW4gYXR0cmlidXRlLlxuICAgICogQHJldHVybnMgcmV0dXJucyBldmx1YXRlZCB2YWx1ZSBmb3IgdGhlIGtleSBpbiBkYXRhIHNvdXJjZS5cbiAgICAqL1xuICAgIHByaXZhdGUgX3ZhbHVlT2ZKc29uUGF0aChcbiAgICAgICAgcGF0aDogYW55LFxuICAgICAgICBkYXRhOiBhbnksXG4gICAgICAgIGFzOiBhbnksXG4gICAgICAgIGRlZXBYbWw6IGJvb2xlYW4sXG4gICAgICAgIGNsYXVzZT86IGNsYXVzZUV2YWx1YXRvcik6IGFueSB7XG5cbiAgICAgICAgbGV0IHJlc3VsdDogYW55O1xuICAgICAgICBsZXQgeCA9IHRoaXMuX25vcm1hbGl6ZShkYXRhLCBkZWVwWG1sKTtcbiAgICAgICAgcGF0aC5tYXAoIChzdWJrZXk6IGFueSkgPT4ge1xuICAgICAgICAgICAgbGV0IG5vZGUgPSB4O1xuICAgICAgICAgICAgaWYgKG5vZGUgJiYgbm9kZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdCA9IFtdO1xuICAgICAgICAgICAgICAgIGlmIChzdWJrZXkuc29ydCkge1xuICAgICAgICAgICAgICAgICAgICBub2RlID0gc3Via2V5LnNvcnQobm9kZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG5vZGUubWFwIChcbiAgICAgICAgICAgICAgICAgICAgKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3Via2V5LmtleS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeCA9IHN1YmtleS5rZXkubGVuZ3RoID8gaXRlbVtzdWJrZXkua2V5XSA6IGl0ZW07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh4ICYmIHN1YmtleS52YWxpZGF0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YmtleS52YWxpZGF0ZWQubWFwKHYgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHogPSB2KHgsIGFzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHogPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih6ICA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeCA9IHo7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAociAmJiB4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdC5wdXNoKHgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1YmtleS52YWxpZGF0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YmtleS52YWxpZGF0ZWQubWFwKHYgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHogPSB2KGl0ZW0sIGFzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHogPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih6ICA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbSA9IHo7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAociAmJiBpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdC5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdC5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdWJrZXkua2V5Lmxlbmd0aCAmJiAodHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uc3BsaXQoJy4nKS5tYXAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChzdHIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdHIuaW5kZXhPZihzdWJrZXkua2V5KSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdC5wdXNoKHN0cik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHggPSB0O1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHg7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5vZGUgJiYgKHR5cGVvZiBub2RlID09PSAnb2JqZWN0JykpIHtcbiAgICAgICAgICAgICAgICB4ID0geCA/XG4gICAgICAgICAgICAgICAgICAgIGNsYXVzZShub2RlLCBzdWJrZXkua2V5LCBzdWJrZXkua2V5Lmxlbmd0aCA/IHhbc3Via2V5LmtleV06ICB4KSA6XG4gICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBpZiAoeCAmJiB4IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3Via2V5LnNvcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHggPSBzdWJrZXkuc29ydCh4KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB4Lm1hcChcbiAgICAgICAgICAgICAgICAgICAgICAgIChpdGVtOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3Via2V5LnZhbGlkYXRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YmtleS52YWxpZGF0ZWQubWFwKHYgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeiA9IHYoaXRlbSwgYXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB6ID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih6ICA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtID0gejtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyICYmIGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHggPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIHggPSB0O1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB4O1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoeCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3Via2V5LnZhbGlkYXRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3Via2V5LnZhbGlkYXRlZC5tYXAodiA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeiA9IHYoeCwgYXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgeiA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHogID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4ID0gejtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyICYmIHgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB4O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0geDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAobm9kZSAmJiAodHlwZW9mIG5vZGUgPT09ICdzdHJpbmcnKSAmJiBzdWJrZXkua2V5Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IFtdO1xuICAgICAgICAgICAgICAgIG5vZGUuc3BsaXQoJy4nKS5tYXAoXG4gICAgICAgICAgICAgICAgICAgIChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5pbmRleE9mKHN1YmtleS5rZXkpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gbm9kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZ2V0KHBhdGg6IHN0cmluZykge1xuICAgICAgICBjb25zdCB1cmwgPSB0aGlzLlNFUlZJQ0VfUEFUSCArIHBhdGg7XG4gICAgICAgIGNvbnN0IGRvdCA9IHBhdGgubGFzdEluZGV4T2YoJy4nKTtcbiAgICAgICAgY29uc3QgZXh0ID0gZG90IDwgMCA/IHVuZGVmaW5lZCA6IHBhdGgudG9Mb3dlckNhc2UoKS5zdWJzdHIoZG90KTtcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycygpO1xuICAgICAgICBsZXQgcmVzdWx0OiBhbnk7XG5cbiAgICAgICAgaGVhZGVycy5zZXQoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbicsICcqJyk7XG5cbiAgICAgICAgaWYgKGV4dCA9PT0gJy54bWwnKSB7XG4gICAgICAgICAgICBoZWFkZXJzLnNldCgnQ29udGVudC1UeXBlJywgJ3RleHQ7IGNoYXJzZXQ9dXRmLTgnKS5zZXQoJ0FjY2VwdCcsICd0ZXh0Jyk7XG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLmh0dHAuZ2V0KHVybCwgeyBoZWFkZXJzLCByZXNwb25zZVR5cGU6ICd0ZXh0JyB9KVxuICAgICAgICAgICAgICAgIC5waXBlKG1hcCgocmVzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHhtbCA9IG5ldyB4bWxkb20uRE9NUGFyc2VyKCkucGFyc2VGcm9tU3RyaW5nKHJlcyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGpzb24gPSB0aGlzLl94bWwyanNvbih4bWwuZG9jdW1lbnRFbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGpzb247XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXh0ID09PSAnLnR4dCcpIHtcbiAgICAgICAgICAgIGhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCAndGV4dDsgY2hhcnNldD11dGYtOCcpLnNldCgnQWNjZXB0JywgJ3RleHQnKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5nZXQodXJsLCB7IGhlYWRlcnMsIHJlc3BvbnNlVHlwZTogJ3RleHQnIH0pLnBpcGUobWFwKChyZXMpID0+IHJlcykpO1xuICAgICAgICB9IGVsc2UgaWYgKGV4dCA9PT0gJy5qc29uJyl7XG4gICAgICAgICAgICBoZWFkZXJzLnNldCgnQ29udGVudC1UeXBlJywgJ2pzb247IGNoYXJzZXQ9dXRmLTgnKS5zZXQoJ0FjY2VwdCcsICdqc29uJyk7XG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLmh0dHAuZ2V0KHVybCwge2hlYWRlcnN9KS5waXBlKG1hcCgocmVzKSA9PiByZXMpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCAndGV4dDsgY2hhcnNldD11dGYtOCcpLnNldCgnQWNjZXB0JywgJ3RleHQnKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5nZXQodXJsLCB7IGhlYWRlcnMsIHJlc3BvbnNlVHlwZTogJ3RleHQnIH0pXG4gICAgICAgICAgICAgICAgLnBpcGUobWFwKChyZXMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhcnNlZDogYW55O1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VkID0gSlNPTi5wYXJzZShyZXMpO1xuICAgICAgICAgICAgICAgICAgICB9Y2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeG1sID0gbmV3IHhtbGRvbS5ET01QYXJzZXIoKS5wYXJzZUZyb21TdHJpbmcocmVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZWQgPSB0aGlzLl94bWwyanNvbih4bWwuZG9jdW1lbnRFbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VkID0gcmVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VkID8gcGFyc2VkIDogcmVzO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfc3RyaW5nVmFsdWVPZktleShrZXk6IGFueSkge1xuICAgICAgICBsZXQgcmVzdWx0OiBhbnkgPSBbXTtcblxuICAgICAgICBpZiAoa2V5IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIGtleS5tYXAoIFxuICAgICAgICAgICAgICAgIChpdGVtOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHggPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ubWFwKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChzdWJpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdWJpdGVtLmtleS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHgucHVzaChzdWJpdGVtLmtleSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh4LmpvaW4oJy4nKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpID0gaXRlbS5pbmRleE9mKCdbJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBqID0gaXRlbS5pbmRleE9mKCddJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBrID0gaXRlbS5sZW5ndGggPiAoaiArIDEpID8gMiA6IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChpID4gMCA/IGl0ZW0uc3Vic3RyaW5nKDAsaSkgOiBqID4gMCA/IGl0ZW0uc3Vic3RyaW5nKGogKyBrKSA6IGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0ua2V5Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goaXRlbS5rZXkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5qb2luKCcsJyk7XG4gICAgICAgICAgICByZXN1bHQgPSByZXN1bHQuaW5kZXhPZignLicpIDwgMCA/IHJlc3VsdC5yZXBsYWNlKC9cXCwvZywgJy4nKSA6IHJlc3VsdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGtleS5rZXk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9hZGRUb1Jlc3VsdCh2YWx1ZTogYW55LCBrZXk6IHN0cmluZywgb3BlcmF0aW9uOiBhbnksIGFjdGlvbjogYW55KSB7XG4gICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLl9zdHJpbmdWYWx1ZU9mS2V5KGFjdGlvbi5wYXRoKTtcbiAgICAgICAgY29uc3Qga2V5MiA9IHRoaXMuX3N0cmluZ1ZhbHVlT2ZLZXkoa2V5KTtcbiAgICAgICAgbGV0IG9wID0gb3BlcmF0aW9uLnJlc3VsdFtwYXRoXTtcbiAgICAgICAgbGV0IGNvbXBsZXRlID0gZmFsc2U7XG4gICAgXG4gICAgICAgIGlmICghb3ApIHtcbiAgICAgICAgICAgIG9wZXJhdGlvbi5yZXN1bHRbcGF0aF0gPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3ApIHtcbiAgICAgICAgICAgIGxldCBvcGsgPSBvcFtrZXkyXTtcbiAgICAgICAgICAgIGlmIChvcGVyYXRpb25bJ3RlbXAnXSAmJlxuICAgICAgICAgICAgICAgIG9wZXJhdGlvblsndGVtcCddW2tleTJdKSB7XG4gICAgICAgICAgICAgICAgb3Bba2V5Ml0gPSBbb3Bba2V5Ml1dO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBvcGVyYXRpb25bJ3RlbXAnXTtcbiAgICAgICAgICAgIH1lbHNlIGlmIChvcGsgJiYgKG9wayBpbnN0YW5jZW9mIEFycmF5KSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb24ucmVzdWx0W3BhdGhdW2tleTJdID0gW29wa11cbiAgICAgICAgICAgICAgICBvcCA9IG9wZXJhdGlvbi5yZXN1bHRbcGF0aF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YWx1ZSA9IHRoaXMuX25vcm1hbGl6ZSh2YWx1ZSwgYWN0aW9uLmRlZXBYbWwpO1xuICAgICAgICAgICAgaWYgKG9wW2tleTJdKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKEpTT04uc3RyaW5naWZ5KHZhbHVlKSAhPT0gSlNPTi5zdHJpbmdpZnkob3Bba2V5Ml1bMF0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcFtrZXkyXS5wdXNoKCB2YWx1ZVtrZXkyXSA/IHZhbHVlW2tleTJdIDogdmFsdWUgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG9wW2tleTJdLnB1c2goIHZhbHVlW2tleTJdID8gdmFsdWVba2V5Ml0gOiB2YWx1ZSApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKChvcCBpbnN0YW5jZW9mIEFycmF5KSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLnJlc3VsdFtwYXRoXSA9IFtvcF07XG4gICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5yZXN1bHRbcGF0aF0ucHVzaCggdmFsdWVba2V5Ml0gPyB2YWx1ZVtrZXkyXSA6IHZhbHVlICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChKU09OLnN0cmluZ2lmeSh2YWx1ZSkgIT09IEpTT04uc3RyaW5naWZ5KG9wWzBdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wLnB1c2goIHZhbHVlW2tleTJdID8gdmFsdWVba2V5Ml0gOiB2YWx1ZSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3AucHVzaCggdmFsdWVba2V5Ml0gPyB2YWx1ZVtrZXkyXSA6IHZhbHVlICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgIC8vIGlmIGFscmVhZHkgYW4gYXJyYXkgcmVtZW1iZXIgaXQuXG4gICAgICAgICAgICAgICAgaWYgKCFvcGVyYXRpb25bJ3RlbXAnXSkge1xuICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb25bJ3RlbXAnXSA9IHt9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIW9wZXJhdGlvblsndGVtcCddW2tleTJdKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvblsndGVtcCddW2tleTJdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcGVyYXRpb24ucmVzdWx0W3BhdGhdW2tleTJdID0gdGhpcy5fbm9ybWFsaXplKHZhbHVlLCBhY3Rpb24uZGVlcFhtbCk7XG4gICAgICAgICAgICBjb21wbGV0ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbXBsZXRlO1xuICAgIH1cblxuICAgIHByaXZhdGUgX3BhY2socmVzdWx0OiBhbnkpIHtcbiAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICBjb25zdCBsaXN0ID0gW107XG4gICAgICAgICAgICByZXN1bHQubWFwKFxuICAgICAgICAgICAgICAgIChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaCh0aGlzLl9wYWNrKGl0ZW0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmVzdWx0ID0gbGlzdDtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgcmVzdWx0ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHJlc3VsdCk7XG4gICAgICAgICAgICBrZXlzLm1hcCAoXG4gICAgICAgICAgICAgICAgKGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gcmVzdWx0W2tleV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgQXJyYXkpIHtcblxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW1ba2V5XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2tleV0gPSBpdGVtW2tleV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIF90cmlnZ2VyUmVzdWx0KHByb21pc2U6IGFueSwgYXM6IGFueSwgcmVzdWx0OiBhbnkpIHtcbiAgICAgICAgY29uc3QgeCA9IHRoaXMuX3BhY2socmVzdWx0KTtcbiAgICAgICAgbGV0IHNhdmVBczogYW55O1xuICAgICAgICBpZiAoYXMpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgc2F2ZUFzID0ge307XG4gICAgICAgICAgICAgICAgc2F2ZUFzW2FzXSA9IHg7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhcyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICBzYXZlQXMgPSBhcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBwcm9taXNlLm5leHQoeCk7XG4gICAgICAgIHJldHVybiBzYXZlQXM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfc3VicXVlcnkoXG4gICAgICAgIHByb21pc2U6IGFueSxcbiAgICAgICAgcGF0aDogYW55LFxuICAgICAgICBvcGVyYXRpb246IGFueSxcbiAgICAgICAgYWN0aW9uOiBhbnkpIHtcblxuICAgICAgICBpZiAob3BlcmF0aW9uLmNhY2hlZEZpbGVzW3BhdGhdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIG9uZSBvZiB0aGUga2V5cyBhdCB0aGlzIGxldmVsIGNvdWxkIGJlIHJlZmVyZW5jaW5nIHRoZSBzYW1lIGZpbGUgd2hpY2hcbiAgICAgICAgICAgIC8vIGlzIG5vdCB5ZXQgZmV0Y2hlZC4gbmVlZCB0byB3YWl0IHRpbGwgaXQgaXMgYXZhaWxhYmxlLlxuICAgICAgICAgICAgb3BlcmF0aW9uLmNhY2hlZEZpbGVzW3BhdGhdID0gbmV3IEJlaGF2aW9yU3ViamVjdDxhbnk+KG51bGwpO1xuICAgICAgICAgICAgdGhpcy5fcXVlcnlJdGVyYXRpb24oXG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uLmNhY2hlZEZpbGVzW3BhdGhdLFxuICAgICAgICAgICAgICAgIG9wZXJhdGlvbixcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHBhdGg6IGFjdGlvbi5wYXRoLFxuICAgICAgICAgICAgICAgICAgICBpbjogYWN0aW9uLmluLFxuICAgICAgICAgICAgICAgICAgICBkZWVwWG1sOiBhY3Rpb24uZGVlcFhtbCxcbiAgICAgICAgICAgICAgICAgICAgam9pbjogYWN0aW9uLmpvaW4sXG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXI6IGFjdGlvbi5oYW5kbGVyLFxuICAgICAgICAgICAgICAgICAgICBxdWVyeUl0ZW1zOiAoYWN0aW9uLnBhdGggaW5zdGFuY2VvZiBBcnJheSkgPyBhY3Rpb24ucGF0aC5sZW5ndGggOiAxXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBwYXRoXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gd2FpdCBmb3IgcmVzdWx0IHJhaXNlZCBhYm92ZS5cbiAgICAgICAgb3BlcmF0aW9uLmNhY2hlZEZpbGVzW3BhdGhdLnN1YnNjcmliZShcbiAgICAgICAgICAgIChzb3VyY2U6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3BrZXlpID0gYWN0aW9uLmpvaW4gPyBhY3Rpb24uam9pblthY3Rpb24ucGF0aF0gOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcGtleWkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzb3VyY2UgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZS5tYXAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdWJxdWVyeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogb3BrZXlpLnBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluOiBvcGtleWkuaW4gPT0gdW5kZWZpbmVkID8gYWN0aW9uLmluIDogKG9wa2V5aS5pbiArIGl0ZW0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWVwWG1sOiBvcGtleWkuZGVlcFhtbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgam9pbjogb3BrZXlpLmpvaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXI6IG9wa2V5aS5oYW5kbGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWVyeUl0ZW1zOiAob3BrZXlpLnBhdGggaW5zdGFuY2VvZiBBcnJheSkgPyBvcGtleWkucGF0aC5sZW5ndGggOiAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3VicXVlcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBhY3Rpb24uam9pbltvcGtleWkucGF0aF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbjogb3BrZXlpLmluID09IHVuZGVmaW5lZCA/IGFjdGlvbi5pbiA6IChvcGtleWkuaW4gKyBzb3VyY2UpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVlcFhtbDogYWN0aW9uLmRlZXBYbWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqb2luOiBvcGtleWkuam9pbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXI6IG9wa2V5aS5oYW5kbGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnlJdGVtczogKG9wa2V5aS5wYXRoIGluc3RhbmNlb2YgQXJyYXkpID8gb3BrZXlpLnBhdGgubGVuZ3RoIDogMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9hZGRUb1Jlc3VsdChzb3VyY2UsIGFjdGlvbi5wYXRoLCBvcGVyYXRpb24sIGFjdGlvbikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbi5xdWVyeUl0ZW1zLS07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aW9uLnF1ZXJ5SXRlbXMgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb24uYXMgPSB0aGlzLl90cmlnZ2VyUmVzdWx0KHByb21pc2UsIG9wZXJhdGlvbi5hcywgb3BlcmF0aW9uLnJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbi5xdWVyeUl0ZW1zLS07XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb24uYXMgPSB0aGlzLl90cmlnZ2VyUmVzdWx0KHByb21pc2UsIG9wZXJhdGlvbi5hcywgb3BlcmF0aW9uLnJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgKGVycm9yOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5sb2dFbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYWN0aW9uLnF1ZXJ5SXRlbXMtLTtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb24uYXMgPSB0aGlzLl90cmlnZ2VyUmVzdWx0KHByb21pc2UsIG9wZXJhdGlvbi5hcywgb3BlcmF0aW9uLnJlc3VsdCk7XG4gICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG4gICAgLypcbiAgICAqIEl0ZXJhdGVzIHRocm91Z2ggYSBjaGFpbiBxdWVyeS5cbiAgICAqIEBwYXJhbSBwcm9taXNlIFRoZSBwcm9taXNlIHdoaWNoIG9yaWdpbmFsIGNhbGxlciBpcyB3YWl0aW5nIGZvci5cbiAgICAqIEBwYXJhbSBvcGVyYXRpb24gZGF0YSBmb3Iga2VlcGluZyB0cmFjayBvZiB0aGUgaXRlcmF0aW9uLlxuICAgICogQHBhcmFtIGFjdGlvbiBjb250YWluczoge3BhdGg6IGN1cnJlbnQga2V5cyB0byBxdWVyeSBmb3IsIGluOiBjdXJyZW50IHF1ZXJ5IHBhdGgsIGhhbmRsZXI6IHJlc29sdmVyIG1ldGhvZH0uXG4gICAgKiBAcGFyYW0gY2FjaGVOYW1lZCBUaGUgY2FjaGVkIG5hbWUgZnJvbSBwcmV2aW91cyBpdGVyYXRpb24gaWYgYW55LlxuICAgICogQHJldHVybnMgcmV0dXJucyBub25lLlxuICAgICovXG4gICAgcHJpdmF0ZSBfcXVlcnlJdGVyYXRpb24oXG4gICAgICAgIHByb21pc2U6IEJlaGF2aW9yU3ViamVjdDxhbnk+LFxuICAgICAgICBvcGVyYXRpb246IGFueSxcbiAgICAgICAgYWN0aW9uOiBhbnksXG4gICAgICAgIGNhY2hlTmFtZWQ/OiBzdHJpbmcpIHtcblxuICAgICAgICBpZiAoIWFjdGlvbi5oYW5kbGVyKSB7XG4gICAgICAgICAgICBhY3Rpb24uaGFuZGxlciA9IChub2RlOiBhbnksIHBhdGg6IHN0cmluZywgdmFsdWU6IGFueSkgPT4gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc2VsZWN0KGFjdGlvbi5wYXRoLCBhY3Rpb24uaW4sIGFjdGlvbi5kZWVwWG1sLCBvcGVyYXRpb24uYXMsIGFjdGlvbi5oYW5kbGVyKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYWNoZU5hbWVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyByZXN1bHQgb2Ygbi10aCBsZXZlbCBjYWxsIHRvIGJlIHBsYWNlZCBvbiBwcmV2aW91cyBsZXZlbCBjYWNoZSByZWZlcmVuY2UuXG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb24uY2FjaGVkRmlsZXNbY2FjaGVOYW1lZF0ubmV4dChkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvcGVyYXRpb25hbEtleSA9IGFjdGlvbi5qb2luID8gYWN0aW9uLmpvaW5bYWN0aW9uLnBhdGhdIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcGVyYXRpb25hbEtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhc3N1bXB0aW9uIGlzIHRoZSByZXN1bHRpbmcgbGlzdCBpcyBhIGxpc3Qgb2YgZmlsZSBwYXRocy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5tYXAoIChjb250ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXRoID0gY29udGVudFsnI3RleHQnXSA/IGNvbnRlbnRbJyN0ZXh0J10gOiBjb250ZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNpemUgPSAob3BlcmF0aW9uYWxLZXkucGF0aCBpbnN0YW5jZW9mIEFycmF5KSA/IG9wZXJhdGlvbmFsS2V5LnBhdGgubGVuZ3RoIDogMTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wZXJhdGlvbmFsS2V5LmluID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5jYWNoZWRGaWxlc1twYXRoXSA9IHRoaXMuX3NlbGVjdChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uYWxLZXkucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uLmluLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb25hbEtleS5kZWVwWG1sLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb24uYXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbmFsS2V5LmhhbmRsZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpemUgLS07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdWJxdWVyeShwcm9taXNlLCBwYXRoLCBvcGVyYXRpb24sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBvcGVyYXRpb25hbEtleS5wYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluOiBvcGVyYXRpb25hbEtleS5pbiA9PSB1bmRlZmluZWQgPyBhY3Rpb24uaW4gOiAob3BlcmF0aW9uYWxLZXkuaW4gKyBjb250ZW50KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWVwWG1sOiBvcGVyYXRpb25hbEtleS5kZWVwWG1sLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpvaW46IG9wZXJhdGlvbmFsS2V5LmpvaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlcjogb3BlcmF0aW9uYWxLZXkuaGFuZGxlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWVyeUl0ZW1zOiBzaXplXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbm8gbW9yZSBxdWVyeSBpbiB0aGUgY2hhaW4uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbi5xdWVyeUl0ZW1zLS07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhY3Rpb24ucXVlcnlJdGVtcyA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID1vcGVyYXRpb24ucmVzdWx0ID8gb3BlcmF0aW9uLnJlc3VsdCA6IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLmFzID0gdGhpcy5fdHJpZ2dlclJlc3VsdChwcm9taXNlLCBvcGVyYXRpb24uYXMsIE9iamVjdC5rZXlzKG9wZXJhdGlvbi5yZXN1bHQpLmxlbmd0aCA/IG9wZXJhdGlvbi5yZXN1bHQgOiBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGRhdGEgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoZGF0YSkubWFwKCAoa2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBkYXRhW2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9wZXJhdGlvbmFsS2V5ID0gYWN0aW9uLmpvaW4gPyBhY3Rpb24uam9pbltrZXldOiB1bmRlZmluZWQ7XG4gICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb250ZW50ICYmIGNvbnRlbnQubGVuZ3RoICYmIG9wZXJhdGlvbmFsS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2l6ZSA9IChvcGVyYXRpb25hbEtleS5wYXRoIGluc3RhbmNlb2YgQXJyYXkpID8gb3BlcmF0aW9uYWxLZXkucGF0aC5sZW5ndGggOiAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wZXJhdGlvbmFsS2V5LmluID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5jYWNoZWRGaWxlc1tjb250ZW50XSA9IHRoaXMuX3NlbGVjdChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uYWxLZXkucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uLmluLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb25hbEtleS5kZWVwWG1sLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb24uYXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbmFsS2V5LmhhbmRsZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpemUgLS07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdWJxdWVyeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogb3BlcmF0aW9uYWxLZXkucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW46IG9wZXJhdGlvbmFsS2V5LmluID09IHVuZGVmaW5lZCA/IGFjdGlvbi5pbiA6IChvcGVyYXRpb25hbEtleS5pbiArIGNvbnRlbnQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWVwWG1sOiBvcGVyYXRpb25hbEtleS5kZWVwWG1sLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyOiBvcGVyYXRpb25hbEtleS5oYW5kbGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWVyeUl0ZW1zOiBzaXplXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbi5xdWVyeUl0ZW1zLS07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29udGVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghb3BlcmF0aW9uLnJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb24ucmVzdWx0ID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcGVyYXRpb24ucmVzdWx0IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLnJlc3VsdC5wdXNoKGNvbnRlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5yZXN1bHRba2V5XSA9IGNvbnRlbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGlvbi5xdWVyeUl0ZW1zID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLmFzID0gdGhpcy5fdHJpZ2dlclJlc3VsdChwcm9taXNlLCBvcGVyYXRpb24uYXMsIE9iamVjdC5rZXlzKG9wZXJhdGlvbi5yZXN1bHQpLmxlbmd0aCA/IG9wZXJhdGlvbi5yZXN1bHQgOiBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb24ucXVlcnlJdGVtcy0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhY3Rpb24ucXVlcnlJdGVtcyA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMob3BlcmF0aW9uLnJlc3VsdCkubGVuZ3RoID09PSAwICYmIGRhdGEgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLnJlc3VsdCA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLmFzID0gdGhpcy5fdHJpZ2dlclJlc3VsdChwcm9taXNlLCBvcGVyYXRpb24uYXMsIG9wZXJhdGlvbi5yZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIChlcnJvcjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgcHJvbWlzZS5lcnJvcih7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdmYWlsZWQgdG8gcXVlcnkgJyArIGFjdGlvbi5wYXRoLFxuICAgICAgICAgICAgICAgICAgICByZWFzb246IGVycm9yLm1lc3NhZ2UgPyBlcnJvci5tZXNzYWdlIDogZXJyb3JcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBhY3Rpb24ucXVlcnlJdGVtcy0tO1xuICAgICAgICAgICAgICAgIGlmIChhY3Rpb24ucXVlcnlJdGVtcyA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb24uYXMgPSB0aGlzLl90cmlnZ2VyUmVzdWx0KHByb21pc2UsIG9wZXJhdGlvbi5hcywgb3BlcmF0aW9uLnJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHByaXZhdGUgX21ha2VBcmd1bWVudHMoa2V5OiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgbGlzdCA9IGtleS5zcGxpdCgnLicpO1xuICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICAgICAgbGlzdC5tYXAoIChpdGVtKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBiID0gaXRlbS5pbmRleE9mKCdbJyk7XG4gICAgICAgICAgICBpZiAoYiA8IDApIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGtleTogaXRlbSxcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGVkOiBbKGRhdGE6IGFueSwgYXM6IGFueSkgPT4gdHJ1ZV1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IHN0ciA9IGl0ZW0uc3Vic3RyaW5nKGIgKyAxLCBpdGVtLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHZMaXN0ID0gc3RyLnNwbGl0KCddWycpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG9iamVjdCA9IHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiBpdGVtLnN1YnN0cmluZygwLGIpLFxuICAgICAgICAgICAgICAgICAgICB2YWxpZGF0ZWQ6IFsoZGF0YTogYW55LCBhczogYW55KSA9PiB0cnVlXVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgdkxpc3QubWFwKCBcbiAgICAgICAgICAgICAgICAgICAgKGZpbHRlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyID0gZmlsdGVyLnJlcGxhY2UoL1xcYC9nLCAnLicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyID0gZmlsdGVyLnJlcGxhY2UoL1xcQC9nLCAnZGF0YScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpbHRlci5pbmRleE9mKCdvcmRlci1ieTonKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXJnOiBhbnkgPSBmaWx0ZXIuc3Vic3RyaW5nKGZpbHRlci5pbmRleE9mKCdvcmRlci1ieTonKSArIDEwKS50cmltKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXJnbGlzdCA9IGFyZy5zcGxpdCgnficpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGFyZ2xpc3RbMF0udHJpbSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9yZGVyPSBhcmdsaXN0WzFdID8gYXJnbGlzdFsxXS50cmltKCkudG9Mb3dlckNhc2UoKTogJ2FzYyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0Wydzb3J0J10gPSBmdW5jdGlvbiAoYXJyYXk6IGFueSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBfdmFsdWVPZiA9IChrZXk6IHN0cmluZywgcDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXkuc3BsaXQoJy4nKS5tYXAoICh4KSA9PiB7cCA9IHBbeF19KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhcnJheS5zb3J0KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oYTogYW55LGI6IGFueSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZmxhZyA9X3ZhbHVlT2Yoa2V5LCBhKSA+IF92YWx1ZU9mKGtleSwgYik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZsYWcgPyAob3JkZXIgPT09ICdhc2MnID8gMTogLTEpIDogKG9yZGVyID09PSAnYXNjJyA/IC0xOiAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdCA9IGZpbHRlci5pbmRleE9mKCcmJicpID4gMCB8fCBmaWx0ZXIuaW5kZXhPZignfHwnKSA+IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGYgPSAncmV0dXJuIGZ1bmN0aW9uIChkYXRhLCBhc0xpc3QpIHsgXFxuJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmICs9IHRoaXMuX2dsb2JhbEZ1bmN0aW9ucygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGYgKz0gJ3ZhciB4ID0gZmFsc2U7XFxuIHRyeXtcXG4geCA9ICc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZiArPSAodCA/ICcoJyArIGZpbHRlciArICcpJyA6IGZpbHRlcikgKyAnOyBcXG59Y2F0Y2goZSl7fVxcbiByZXR1cm4geDtcXG59JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RbJ3ZhbGlkYXRlZCddLnB1c2goIG5ldyBGdW5jdGlvbihmKSgpICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKG9iamVjdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHByaXZhdGUgX2hhbmRsZVNwZWNpYWxDaGFyYWN0ZXJzKHBhdGg6IHN0cmluZykge1xuICAgICAgICBsZXQgcmVzdWx0ID0gW107XG4gICAgICAgIHBhdGguc3BsaXQoJ10nKS5tYXAoXG4gICAgICAgICAgICAoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGJpbmRleCA9IGl0ZW0uaW5kZXhPZignWycpO1xuICAgICAgICAgICAgICAgIGlmIChiaW5kZXggPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgeCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIGJpbmRleCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHggKz0gaXRlbS5zdWJzdHJpbmcoMCwgYmluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB4ICs9IGl0ZW0uc3Vic3RyaW5nKGJpbmRleCkucmVwbGFjZSgvXFwuL2csJ2AnKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goeCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gcmVzdWx0LmpvaW4oJ10nKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBfcHJlcGFyZUpzb25QYXRoKHBhdGg6IGFueSkge1xuICAgICAgICBsZXQgcmVzdWx0OiBhbnk7XG4gICAgICAgIGlmIChwYXRoIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IFtdO1xuICAgICAgICAgICAgcGF0aC5tYXAoXG4gICAgICAgICAgICAgICAgKGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeCA9IHRoaXMuX2hhbmRsZVNwZWNpYWxDaGFyYWN0ZXJzKGkpO1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLl9tYWtlQXJndW1lbnRzKHgpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgeCA9IHRoaXMuX2hhbmRsZVNwZWNpYWxDaGFyYWN0ZXJzKHBhdGgpO1xuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5fbWFrZUFyZ3VtZW50cyh4KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIF9zZWxlY3QoXG4gICAgICAgIHBhdGg6IGFueSxcbiAgICAgICAgZnJvbTogc3RyaW5nLFxuICAgICAgICBkZWVwWG1sOiBib29sZWFuLFxuICAgICAgICBhczogYW55LFxuICAgICAgICBjbGF1c2U/OiBjbGF1c2VFdmFsdWF0b3IpOiBCZWhhdmlvclN1YmplY3Q8YW55PiB7XG5cbiAgICAgICAgY29uc3QgZGF0YVN0b3JlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxhbnk+KG51bGwpO1xuXG4gICAgICAgIHRoaXMuX2dldChmcm9tKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAoZGF0YTogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdDogYW55O1xuICAgICAgICAgICAgICAgIGNvbnN0IGpwYXRoID0gdGhpcy5fcHJlcGFyZUpzb25QYXRoKHBhdGgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFjbGF1c2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xhdXNlID0gKG5vZGU6IGFueSwgcGF0aDogc3RyaW5nLCB2YWx1ZTogYW55KSA9PiB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHBhdGggaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAganBhdGgubWFwKChwYXRoSXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeSA9IHRoaXMuX3ZhbHVlT2ZKc29uUGF0aChwYXRoSXRlbSwgZGF0YSwgYXMsIGRlZXBYbWwsIGNsYXVzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoeSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBrZXkgPSB0aGlzLl9zdHJpbmdWYWx1ZU9mS2V5KHBhdGhJdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IHk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMocmVzdWx0KS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuX3ZhbHVlT2ZKc29uUGF0aChqcGF0aCwgZGF0YSwgYXMsIGRlZXBYbWwsIGNsYXVzZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YVN0b3JlLm5leHQocmVzdWx0KTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFTdG9yZS5lcnJvcignUmVzdWx0IG5vdCBmb3VuZCBmb3IgJyArIHBhdGgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAoZXJyb3I6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGRhdGFTdG9yZS5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBkYXRhU3RvcmU7XG4gICAgfVxuXG4gICAgLypcbiAgICAqIFdpbGwgY29udmVydCB0aGUgeG1sIGludG8gYSBqc29uLlxuICAgICogQHBhcmFtIHhtbCBYTUwgdG8gYmUgY29udmVydGVkLlxuICAgICogQHJldHVybnMgcmV0dXJucyBjb252ZXJ0ZWQgSlNPTi5cbiAgICAqL1xuICAgIHByaXZhdGUgX3htbDJqc29uKHhtbDogYW55KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgb2JqID0ge307XG4gICAgICAgICAgICBpZiAoeG1sLmF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjID0geG1sLmF0dHJpYnV0ZXM7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYXR0ciA9IGNbaV07XG4gICAgICAgICAgICAgICAgb2JqW2F0dHIubmFtZV0gPSBhdHRyLnZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh4bWwuY2hpbGROb2RlcyAmJiB4bWwuY2hpbGROb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHhtbC5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSB4bWwuY2hpbGROb2Rlc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm9kZU5hbWUgPSBpdGVtLm5vZGVOYW1lO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChvYmpbbm9kZU5hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZyYWdtZW50ID0gdGhpcy5feG1sMmpzb24oaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZnJhZ21lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ialtub2RlTmFtZV0gPSBmcmFnbWVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmpbbm9kZU5hbWVdLnB1c2ggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9sZCA9IG9ialtub2RlTmFtZV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmpbbm9kZU5hbWVdID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqW25vZGVOYW1lXS5wdXNoKG9sZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmcmFnbWVudCA9IHRoaXMuX3htbDJqc29uKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZyYWdtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqW25vZGVOYW1lXS5wdXNoKGZyYWdtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IHhtbC50ZXh0Q29udGVudC50cmltKCkucmVwbGFjZSgvKD86XFxyXFxufFxccnxcXG58XFx0KS9nLCAnJyk7XG4gICAgICAgICAgICAgICAgb2JqID0gdGV4dC5sZW5ndGggPyB0ZXh0IDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMubG9nRW5hYmxlZCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUubWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKlxuICAgICogV2lsbCBkbyBhIGNoYWluIHF1ZXJ5IG9uIHNwZWNpZmllZCBwYXRocyBmcm9tIHJlbW90ZSBsb2NhdGlvbi5cbiAgICAqIEBwYXJhbSBjaGFpblF1ZXJ5IEEgSnNvbiBzdHJ1Y3R1cmUgd2l0aCBwYXRocy4gRWFjaCBwYXRoIHdpbGwgY29udGFpbiBhIGNoYWluIG9mIGluc3RydWN0aW9ucy5cbiAgICAqIEVhY2ggaW5zdHJ1Y3Rpb24gd2lsbCBoYXZlIGEgJ2luJyB0byBhIGZpbGUgYW5kIGEgcGF0aCB0byBzZWFyY2ggb24gaXQgKHNlZS4gc2VsZWN0KCkpLiBvbmNlIHRoZVxuICAgICogcmVzdWx0IGlzIGluLCB0aGUgbmV4dCBpbnN0cnVjdGlvbiBpbiB0aGUgcGF0aCBjaGFpbiB3aWxsIGJlIHRyaWdnZWQuIEFmdGVyIHRoZSBwYXRoIHRocm91Z2ggYWxsXG4gICAgKiBjaGFpbmVkIHBhdGhzIGlzIGNvbXBsZXRlZCwgcmVzdWx0aW5nIHZhbHVlIHdpbGwgYmUgcHV0IGluIGEganNvbiB3aGVyZSBpdHMgcGF0aCBpcyB0aGUgb3JpZ2luYWxcbiAgICAqIGpzb24gcGF0aCBhbmQgaXRzIHZhbHVlIHdpbGwgYmUgdGhlIHJlc3VsdGluZyB2YWx1ZS5cbiAgICAqXG4gICAgKiB0aGlzIGlzIG5vdCBmdWxseSB0ZXN0ZWQuIGNhbGxlciBzaG91bGQgcGFzcyBzb21ldGhpbmcgbGlrZVxuICAgICoge3BhdGg6IFtwYXRoMSxwYXRoMl0sIGluOiAnc29tZXRoaW5nIG9yIGJsYW5rJywgZGVlcFhtbDogdHJ1ZSwgam9pbjoge2sxOiB7cGF0aDogcGF0aDMsIGluOiAnc29tZXRoaW5nIG9yIHBsYW5rJywgY2xhdXNlOiBmdW5jdGlvbn19fVxuICAgICogaWYgcGF0aDEgb3IgcGF0aDIgb3IgcGF0aDMgYXJlIGZvdW5kIGF0IHRoZSByb290IG9iamVjdCwgYSBjaGFpbiByZWFjdGlvbiB0byBmZXRjaCBkZWVwIHdpbGwgZm9sbG93LiBBblxuICAgICogb3B0aW9uYWwgY2xhdXNlIHdpbGwgaGVscCByZXNvbHZlIGNvbXBsZXggc2l0dWF0aW9ucy5cbiAgICAqXG4gICAgKiBAcmV0dXJucyByZXR1cm5zIGFuIG9ic2VydmFibGUuIHRoZSBjYWxsZXIgc2hvdWxkIHN1YnNjcmliZSB0byB0aGlzIGluIG9yZGVyIHRvIHJlY2VpdmUgdGhlIHJlc3VsdC5cbiAgICAqL1xuICAgIGNoYWluU2VsZWN0KGNoYWluUXVlcnk6IGFueSk6IEJlaGF2aW9yU3ViamVjdDxhbnk+IHtcbiAgICAgICAgY29uc3Qgc2l6ZSA9IChjaGFpblF1ZXJ5LnBhdGggaW5zdGFuY2VvZiBBcnJheSkgPyAgY2hhaW5RdWVyeS5wYXRoLmxlbmd0aCA6IDE7XG4gICAgICAgIGNvbnN0IG9wZXJhdGlvbiA9IHtjYWNoZWRGaWxlczoge30sIGFzOiB7fSwgcmVzdWx0OiB7fX07XG4gICAgICAgIGNvbnN0IGRhdGFTdG9yZSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8YW55PihudWxsKTtcblxuICAgICAgICBvcGVyYXRpb24uY2FjaGVkRmlsZXNbY2hhaW5RdWVyeS5wYXRoXSA9IGRhdGFTdG9yZTtcbiAgICAgICAgdGhpcy5fcXVlcnlJdGVyYXRpb24oXG4gICAgICAgICAgICBkYXRhU3RvcmUsXG4gICAgICAgICAgICBvcGVyYXRpb24sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcGF0aDogY2hhaW5RdWVyeS5wYXRoLFxuICAgICAgICAgICAgICAgIGluOiBjaGFpblF1ZXJ5LmluLFxuICAgICAgICAgICAgICAgIGRlZXBYbWw6IGNoYWluUXVlcnkuZGVlcFhtbCxcbiAgICAgICAgICAgICAgICBqb2luOiBjaGFpblF1ZXJ5LmpvaW4sXG4gICAgICAgICAgICAgICAgaGFuZGxlcjogY2hhaW5RdWVyeS5oYW5kbGVyLFxuICAgICAgICAgICAgICAgIHF1ZXJ5SXRlbXM6IHNpemVcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIGRhdGFTdG9yZTtcbiAgICB9XG5cbiAgICAvKlxuICAgICogV2lsbCBncm91cCBmaWxlIHBhdGhzIGlmIHRoZXkgYXJlIHNpbWlsYXIgdG8gYXZvaWQgbXVsdGlwbGUgY2FsbHMuXG4gICAgKiBAcGFyYW0gbGlzdCBBIGxpc3Qgb2YgSnNvbiB7cGF0aHMsIGluLCBkZWVwWG1sfSBzdHJ1Y3R1cmVzLiBkZWVwWG1sIGlzIG9wdGlvbmFsLlxuICAgICogQHBhcmFtIGNsYXVzZSBBIG1ldGhvZCBieSB3aGljaCB2YWx1ZShzKSBmb3IgdGhlIHBhdGgocykgY291bGQgYmUgZXZhbHVhdGVkLiB0aGUgY2FsbGVyIHdvdWxkIGV2YWx1YXRlIHRoZSB2YWx1ZSBmb3IgYSBnaXZlbiBhdHRyaWJ1dGUuXG4gICAgKiBAcmV0dXJucyByZXR1cm5zIGFuIG9ic2VydmFibGUuIHRoZSBjYWxsZXIgc2hvdWxkIHN1YnNjcmliZSB0byB0aGlzIGluIG9yZGVyIHRvIHJlY2VpdmUgdGhlIHJlc3VsdC5cbiAgICAqL1xuICAgIGFycmF5U2VsZWN0KFxuICAgICAgICBsaXN0OiBhbnksXG4gICAgICAgIGNsYXVzZT86IGNsYXVzZUV2YWx1YXRvcik6IEJlaGF2aW9yU3ViamVjdDxhbnk+ICB7XG4gICAgICAgIGNvbnN0IGdyb3VwZWRMaXN0ID0ge307XG4gICAgICAgIGxpc3QubWFwKCAoaXRlbTogYW55KSA9PiB7XG4gICAgICAgICAgICBpZiAoZ3JvdXBlZExpc3RbaXRlbS5pbl0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGdyb3VwZWRMaXN0W2l0ZW0uaW5dID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBncm91cGVkTGlzdFtpdGVtLmluXS5wdXNoKHtwYXRoOiBpdGVtLnBhdGgsIGRlZXBYbWw6IGl0ZW0uZGVlcFhtbH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgZGF0YVN0b3JlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxhbnk+KG51bGwpO1xuXG4gICAgICAgIE9iamVjdC5rZXlzKGdyb3VwZWRMaXN0KS5tYXAgKCAodXJsKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9zZWxlY3QoZ3JvdXBlZExpc3RbdXJsXS5wYXRoLCB1cmwsIGdyb3VwZWRMaXN0W3VybF0uZGVlcFhtbCwgdW5kZWZpbmVkLCBjbGF1c2UpLnN1YnNjcmliZShcbiAgICAgICAgICAgICAgICAoZGF0YTogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhU3RvcmUubmV4dChkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgKGVycm9yOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YVN0b3JlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGRhdGFTdG9yZTtcbiAgICB9XG5cbiAgICAvKlxuICAgICogV2lsbCBxdWVyeSBwYXRoIGZyb20gYSByZW1vdGUgbG9jYXRpb24gcXVhbGlmaWVkIHRocm91Z2ggYW4gb3B0aW9uYWwgY2xhdXNlIGZ1bmN0aW9uIHRoYXRcbiAgICAqIGV2YWx1YXRlcywgZmlsdGVycywgb3Igc29ydHMgdGhlIHJlc3VsIG9mIHRoZSBxdWVyeS5cbiAgICAqIEBwYXJhbSBwYXRoIEEgYSBzaW5nbGUgSlNPTiBwYXRoIG9yIGxpc3Qgb2YgcGF0aHMgdG8gc2VsZWN0IChpLmUuLCAnYS5iLmMnKVxuICAgICogQHBhcmFtIGZyb20gQSByZWZlcmVuY2UgVVJMIHRvIGEgcmVtb3RlIHNvdXJjZS5cbiAgICAqIEBwYXJhbSBkZWVwWG1sIGlmIGNkYXRhLXNlY3Rpb24gc2hvdWxkIGJlIHBhcnNlZC5cbiAgICAqIEBwYXJhbSBjbGF1c2UgQSBtZXRob2QgYnkgd2hpY2ggdmFsdWUocykgZm9yIHRoZSBwYXRoKHMpIGNvdWxkIGJlIGV2YWx1YXRlZC4gdGhlIGNhbGxlciB3b3VsZCBldmFsdWF0ZSB0aGUgdmFsdWUgZm9yIGEgZ2l2ZW4gYXR0cmlidXRlLlxuICAgICogQHJldHVybnMgcmV0dXJucyBhbiBvYnNlcnZhYmxlLiB0aGUgY2FsbGVyIHNob3VsZCBzdWJzY3JpYmUgdG8gdGhpcyBpbiBvcmRlciB0byByZWNlaXZlIHRoZSByZXN1bHQuXG4gICAgKi9cbiAgICBzZWxlY3QoXG4gICAgICAgIHBhdGg6IGFueSxcbiAgICAgICAgZnJvbTogc3RyaW5nLFxuICAgICAgICBkZWVwWG1sOiBib29sZWFuLFxuICAgICAgICBjbGF1c2U/OiBjbGF1c2VFdmFsdWF0b3IpOiBCZWhhdmlvclN1YmplY3Q8YW55PiB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdChwYXRoLCBmcm9tLCBkZWVwWG1sLCB1bmRlZmluZWQsIGNsYXVzZSk7XG4gICAgfVxufVxuIl19