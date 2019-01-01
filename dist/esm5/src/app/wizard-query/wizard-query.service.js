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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLXF1ZXJ5LnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly93aXphcmQtcXVlcnkvIiwic291cmNlcyI6WyJzcmMvYXBwL3dpemFyZC1xdWVyeS93aXphcmQtcXVlcnkuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBcUNBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLFVBQVUsRUFBRSxXQUFXLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUU3RCxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDbkMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUNyQyxPQUFPLEtBQUssTUFBTSxNQUFNLFFBQVEsQ0FBQzs7Ozs7SUFnQjdCLDRCQUNVO1FBQUEsU0FBSSxHQUFKLElBQUk7NEJBSlEsRUFBRTswQkFDSixLQUFLO0tBTXhCOzs7O0lBRU8sNkNBQWdCOzs7O1FBQ3BCLE1BQU0sQ0FBQyx3eUdBb0dOLENBQUM7Ozs7Ozs7SUFTRSx1Q0FBVTs7Ozs7Y0FBQyxLQUFVLEVBQUUsT0FBZ0I7O1FBQzNDLEVBQUUsQ0FBQyxDQUFDLEtBQUssWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDOztZQUN6QixJQUFNLFFBQU0sR0FBRyxFQUFFLENBQUM7WUFDbEIsS0FBSyxDQUFDLEdBQUcsQ0FBRSxVQUFDLElBQUk7Z0JBQ1osUUFBTSxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO2FBQy9DLENBQUMsQ0FBQztZQUNILEtBQUssR0FBRyxRQUFNLENBQUM7U0FDbEI7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQzs7WUFDbkMsSUFBSSxLQUFLLEdBQVEsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZ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RSxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDL0Q7O2dCQTc4QkosVUFBVTs7OztnQkFkSCxVQUFVOzs2QkF0Q2xCOztTQXFEYSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuKiBRdWVyeSBzZXJ2aWNlIHByb3ZpZGVzIGEgd2F5IHRvIHF1ZXJ5IGEgcmVtb3RlIEpTT04gb3IgWE1MIGZpbGUuIEl0IGNhbiBiZSB1c2VkIGluIGZvbGxvd2luZyB3YXlzLlxuKlxuKiAxKSBXaXRoIHNlbGVjdCgpIG1ldGhvZCwgYSBzaW5nbGUgcGF0aCBvciBhIGxpc3Qgb2YgcGF0aHMgY2FuIGJlIGdpdmVuLiBlYWNoIHBhdGggd2lsbCBiZSBhIGpzb24gcXVhbGlmeWluZ1xuKiBwYXRoIHRvIGFuIGVuZCBub2RlIChpLmUuLCAnYm9va3MuYm9vay50aXRsZScpLiBJZiBtdWx0aXBsZSBwYXRocyBhcmUgc3VwcGxpZWQsIHF1ZXJ5IHJlc3VsdCB3aWxsIGJlIGEganNvblxuKiBvYmplY3Qgd2hlcmUgZWFjaCBhdHRyaWJ1dGUgd2lsbCBiZSBhIGdpdmVuIHF1ZXJ5IHBhdGggYW5kIGl0cyB2YWx1ZSB3aWxsIGJlIHF1ZXJ5IHJlc3VsdCBmb3IgdGhhdCBwYXRoLlxuKiBGb3IgZXhhbXBsZTpcbiogc2VsZWN0KFsnYm9va3MuYm9vay50aXRsZScsICdib29rcy5ib29rLmF1dGhvciddLCAnL2V4YW1wbGUxLnhtbCcsIGZhbHNlKVxuKiB3aWxsIHJlc3VsdCBpbiB7J2Jvb2tzLmJvb2sudGl0bGUnOiBbXSwgJ2Jvb2tzLmJvb2suYXV0aG9yJzogW119LlxuKiBFYWNoIHJlc3VsdCB3aWxsIG5vdCBjby1yZWxhdGVkIHdpdGggb3RoZXIgcmVzdWx0IGluIG9yZGVyIG9yIGluIGFueSBvdGhlciBmb3JtLiBpZiBhIGNsYXVzZSBhcmd1bWVudCBpc1xuKiBzdXBwbGllZCwgaXQgd2lsbCBiZSBpbnZva2VkIHRvIGZ1cnRoZXIgYXNzaXN0IGluIGZpbHRlcmluZyB0aGUgcXVlcnkgcmVzdWx0LiBmb3IgZXhhbXBsZSBpZiBjZXJ0YWluIGNhdGVnb3J5XG4qIG9mIGJvb2tzIGFyZSByZXF1aXJlZCwgdGhlIGNsYXVzZSBmdW5jdGlvbiBjYW4gbG9vayBmb3IgYSBib29rIGNhdGVnb3J5IGF0dHJpYnV0ZSBhbmQgcmV0dXJuIHRoZSBxdWVyeSByZXN1bHRcbiogaWYgYWNjZXB0YWJsZSBvciB1bmRlZmluZWQgaWYgcmVzdWx0IHNob3VsZCBiZSBmaWx0ZXJlZCBvdXQgb2YgdGhlIHJlc3VsdC5cbipcbiogMikgV2l0aCBhcnJheVNlbGVjdCgpIG1ldGhvZCwgYW4gYXJyYXkgb2Yge3BhdGg6ICcnLCBpbjonJywgZGVlcFhtbDogdHJ1ZX0gY2FuIGJlIHN1cHBsaWVkLCBlYWNoIGVudHJ5IHdpbGwgYmUgZXZhbHVhdGVkXG4qIGFzIGlmIHNlbGVjdCgpIG1ldGhvZCBpcyBpbnZva2VkLiBCdXQgZmlyc3QsIHJlcXVlc3RzIHdpdGggc2ltaWxhciBwYXRocyB3aWxsIGJlIG1lcmdlZCBpbnRvIG9uZSBjYWxsLiAgVGhpc1xuKiBtZXRob2QgaXMgdXNlZnVsIHdoZW4gcGF0aHMgYXJlIGR5bmFtaWNseSBnaXZlbiBhbmQgaXQgaXMgbm90IGNsZWFyIGluIGFkdmFuY2UgaWYgdGhlcmUgYXJlIHJlcXVlc3RzIHdpdGhcbiogc2ltaWxhciBwYXRocy4gZGVlcFhtbCBhdHRyaWJ1dGUgaXMgb3B0aW9uYWwuXG4qXG4qIDMpIFdpdGggY2hhaW5TZWxlY3QoKSBtZXRob2QsIGEgY2hhaW5lZCBzZXQgb2Yge3BhdGg6ICcnLCBpbjogJycsIGRlZXBYbWw6IHRydWV9IGlzIGdpdmVuIGluIGEganNvbiBvYmplY3QuIFdoZW4gcmVzdWx0IG9mXG4qIGEgcXVlcnkgYmVjb21lcyBhdmFpbGFibGUsIHRoZSByZXF1ZXN0IGpzb24gd2lsbCBiZSBleGFtaW5lZCB0byBzZWUgaWYgYSByZXF1ZXN0IGZvciB0aGUga2V5IGlzIGF2YWlsYWJsZS4gSWZcbiogc28sIHRoZW4gdGhlICdpbicgZm9yIHRoZSBwYXRoIHdpbGwgYmUgcHJlcGVuZGVkIHRvIHRoZSByZXN1bHRpbmcgdmFsdWUgb2YgdGhlIHByZXZpb3VzIHF1ZXJ5LiAsIGRlZXBYbWwgYXR0cmlidXRlIGlzIFxuKiBvcHRpb25hbC4gVGhpcyBtZXRob2QgaXMgdXNlZnVsIHdoZW4gcmVzdWx0IG9mIGEgcXVlcnkgaXMgYSBqc29uIG9yIGFuIHhtbCBmaWxlIGFuZCBhZGRpdGlvbmFsIHF1ZXJ5IGlzIG5lZWRlZCBcbiogZnVydGhlciBkb3duIGluIHRoZSBwcmVjZWVkaW5nIGZpbGVzLiBGb3IgZXhhbXBsZSB0aGUgYXNzdW1wdGlvbiBpbiB0aGUgZm9sbG93aW5nIGNhbGwgaXMgdGhhdCBlYWNoIGJvb2tzLmJvb2sgXG4qIHJlc3VsdCB3aWxsIGJlIGEgZmlsZSBuYW1lIGFuZCB0aGUgZmlsZSBwYXRoIGZvciBlYWNoIHJlc3VsdCBpcyAnL3NhbXBsZXMvYm9va3MvJy5cbiogY2hhaW5TZWxlY3Qoe1xuKiAgIHBhdGg6ICdib29rcy5ib29rJyxcbiogICBpbjogJ3NhbXBsZTEueG1sJyxcbiogICBkZWVwWG1sOiB0cnVlLFxuKiAgICdib29rcy5ib29rJzoge1xuKiAgICAgICBpbjogJy9zYW1wbGVzL2Jvb2tzLycsXG4qICAgICAgIHBhdGg6IFsncHVibGljYXRpb24udGl0bGUnLCAncHVibGljYXRpb24uYXV0aG9yJ10sXG4qICAgICAgIGhhbmRsZXI6IHRoaXMuYnVibGljYXRpb25IYW5kbGVyXG4qICAgfSlcbiogaWYgYSBoYW5kbGVyIGlzIHN1cHBsaWVkLCBpdCB3aWxsIGJlIHVzZWQgdG8gZmlsdGVyIG91dCBhbnkgcmVzdWx0IHRoYXQgaXMgbm90IGFjY2VwdGFibGUuXG4qXG4qL1xuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7SHR0cENsaWVudCwgSHR0cEhlYWRlcnN9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcblxuaW1wb3J0IHttYXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7QmVoYXZpb3JTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCAqIGFzIHhtbGRvbSBmcm9tICd4bWxkb20nO1xuXG4vKlxuKiBAcGFyYW0gbm9kZSBUaGUgcGFyZW50IG5vZGUuIGl0IGNhbiBiZSB1c2VkIHRvIGV2YWx1YXRlIGJhc2VkIG9uIG90aGVyIGF0dHJpYnV0ZXMgaW4gdGhlIG5vZGUuXG4qIEBwYXJhbSBwYXRoIGF0dHJpYnV0ZSB0byBiZSBleGFtaW5lZC5cbiogQHBhcmFtIHZhbHVlIHRoZSB2YWx1ZSBvZiB0aGUgcGF0aC4gaXQgY291bGQgYmUgdW5kZWZpbmVkLCBhIGxpdGVyYWwsIG9yIGEgbGlzdC5cbiogQHJldHVybnMgcmV0dXJucyB0aGUgdmFsdWUgb3IgZmlsdGVyZWQgdmVyc2lvbiBvZiB0aGUgdmFsdWUgb3IgdW5kZWZpbmVkIG90aGVyd2lzZS5cbiovXG5leHBvcnQgdHlwZSBjbGF1c2VFdmFsdWF0b3IgPSAobm9kZTogYW55LCBwYXRoOiBzdHJpbmcsIHZhbHVlOiBhbnkpID0+IGFueTtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFdpemFyZFF1ZXJ5U2VydmljZSB7XG5cbiAgICBwdWJsaWMgU0VSVklDRV9QQVRIID0gJyc7XG4gICAgcHVibGljIGxvZ0VuYWJsZWQgPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50XG4gICAgKSB7XG5cbiAgICB9XG5cbiAgICBwcml2YXRlIF9nbG9iYWxGdW5jdGlvbnMoKSB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgIGZ1bmN0aW9uIHJldmVyc2UoYSkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGE7XG4gICAgICAgICAgICBpZiAoYSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gYS5yZXZlcnNlKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGEuc3BsaXQoJycpLnJldmVyc2UoKS5qb2luKCcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gc3VtKGEsYikge1xuICAgICAgICAgICAgdmFyIHRvdGFsID0gMDtcbiAgICAgICAgICAgIGlmIChhIGluc3RhbmNlb2YgQXJyYXkpIHsgXG4gICAgICAgICAgICAgICAgYS5tYXAoZnVuY3Rpb24oaykge1xuICAgICAgICAgICAgICAgICAgICB0b3RhbCArPSBzdW0oaywgYik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIGlmIChiLmluZGV4T2YoJy4nKT4wKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0ID0gYTtcbiAgICAgICAgICAgICAgICAgICAgYi5zcGxpdCgnLicpLm1hcChmdW5jdGlvbihrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsKz1zdW0oIHRba10sIGIuc3Vic3RyaW5nKGsubGVuZ3RoKzEpICk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZihhW2JdKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0ID0gYVtiXTtcbiAgICAgICAgICAgICAgICAgICAgdG90YWwgKz0gKHR5cGVvZiB0ID09PSAnbnVtYmVyJykgPyB0IDogcGFyc2VGbG9hdCh0KTtcbiAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICB0b3RhbCA9IGE7XG4gICAgICAgICAgICB9IFxuICAgICAgICAgICAgcmV0dXJuIHRvdGFsO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGNvdW50KGEsYikge1xuICAgICAgICAgICAgdmFyIHRvdGFsID0gMDtcbiAgICAgICAgICAgIGlmIChhIGluc3RhbmNlb2YgQXJyYXkpIHsgXG4gICAgICAgICAgICAgICAgYS5tYXAoZnVuY3Rpb24oaykge1xuICAgICAgICAgICAgICAgICAgICB0b3RhbCArPSBjb3VudChrLCBiKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGEgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoYSkubWFwKGZ1bmN0aW9uKGspe1xuICAgICAgICAgICAgICAgICAgICB0b3RhbCArPSBjb3VudChhW2tdLGIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICB0b3RhbCA9IGEuc3BsaXQoYikubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYSA9PT0gYikge1xuICAgICAgICAgICAgICAgIHRvdGFsKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdG90YWw7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gbGlrZShhLCBiKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgaWYgKGEgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IFtdO1xuICAgICAgICAgICAgICAgIGEubWFwKGZ1bmN0aW9uKGspIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gobGlrZShrLCBiKSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IFtdO1xuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGEpLm1hcChmdW5jdGlvbihrKXtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gobGlrZShhW2tdLCBiKSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIGlmIChhLmluZGV4T2YoYikgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBhO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYSA9PT0gYikge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGFzKGEsIGIpIHtcbiAgICAgICAgICAgIGlmIChhc0xpc3RbYl0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGFzTGlzdFtiXSA9IFthXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXNMaXN0W2JdLnB1c2goYSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBpc19pbihhLCBiLCBsaXN0KSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgaWYgKGIgaW5zdGFuY2VvZiBBcnJheSkgeyBcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBbXTtcbiAgICAgICAgICAgICAgICBiLm1hcChmdW5jdGlvbihrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGlzX2luKGssIGxpc3QpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGIgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gW107XG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoYikubWFwKGZ1bmN0aW9uKGspIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goaXNfaW4oYltrXSwgbGlzdCkpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhc0xpc3RbbGlzdF0pe1xuICAgICAgICAgICAgICAgIGFzTGlzdFtsaXN0XS5tYXAoZnVuY3Rpb24odCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHQgPT09J3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0LmluZGV4T2YoYikgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IGE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgYDtcbiAgICB9XG5cbiAgICAvKlxuICAgICogV2lsbCBub3JtYWxpemUgdGhlIGdpdmVuIHhtbCBvdXQgb2YgYWRkaXRpb25hbCAjdGV4dCBvciAjY2RhdGEtc2VjdGlvbiBub2Rlcy5cbiAgICAqIEBwYXJhbSB2YWx1ZSB0aGUgeG1sIHRvIGJlIG5vcm1haWx6ZWQuXG4gICAgKiBAcGFyYW0gZGVlcFhtbCBpZiBjZGF0YS1zZWN0aW9uIHNob3VsZCBiZSBwYXJzZWQuXG4gICAgKiBAcmV0dXJuIG5vcm1hbGl6ZWQgeG1sLlxuICAgICovXG4gICAgcHJpdmF0ZSBfbm9ybWFsaXplKHZhbHVlOiBhbnksIGRlZXBYbWw6IGJvb2xlYW4pIHtcbiAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgICAgICAgICAgdmFsdWUubWFwKCAoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXMuX25vcm1hbGl6ZShpdGVtLCBkZWVwWG1sKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhbHVlID0gcmVzdWx0O1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGxldCBpdGVtczogYW55ID0gT2JqZWN0LmtleXModmFsdWUpO1xuXG4gICAgICAgICAgICBpZiAoaXRlbXMubGVuZ3RoID09PSAxICYmICEodmFsdWVbaXRlbXNbMF1dIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlWycjdGV4dCddKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWVbJyN0ZXh0J107XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZVsnI2NkYXRhLXNlY3Rpb24nXSkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlWycjY2RhdGEtc2VjdGlvbiddO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGVlcFhtbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB4bWwgPSBuZXcgeG1sZG9tLkRPTVBhcnNlcigpLnBhcnNlRnJvbVN0cmluZyh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSAoeG1sLmRvY3VtZW50RWxlbWVudCAmJiB4bWwuZG9jdW1lbnRFbGVtZW50ICE9IG51bGwpID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl94bWwyanNvbih4bWwuZG9jdW1lbnRFbGVtZW50KSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9Y2F0Y2goZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgICAgICAgICAgICAgIGl0ZW1zLm1hcCggKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2l0ZW1dID0gdGhpcy5fbm9ybWFsaXplKHZhbHVlW2l0ZW1dLCBkZWVwWG1sKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgLypcbiAgICAqIEBwYXJhbSBwYXRoIEpTT04gcGF0aCB0byBldmFsdWF0ZS4gQSBwYXRoIGNvdWxkIGJlIGZ1bGx5IHF1YWxpZmllZCBmb3IgZGVwdGggb2YganNvbiAoaS5lLiwgJ2EuYi5jJylcbiAgICAqIEBwYXJhbSBkYXRhIHRoZSBkYXRhIHNvdXJjZS5cbiAgICAqIEBwYXJhbSBkZWVwWG1sIGlmIGNkYXRhLXNlY3Rpb24gc2hvdWxkIGJlIHBhcnNlZC5cbiAgICAqIEBwYXJhbSBjbGF1c2UgQSBtZXRob2QgYnkgd2hpY2ggdmFsdWUocykgZm9yIHRoZSBrZXkocykgY291bGQgYmUgZXZhbHVhdGVkLiB0aGUgY2FsbGVyIHdvdWxkIGV2YWx1YXRlIHRoZSB2YWx1ZSBmb3IgYSBnaXZlbiBhdHRyaWJ1dGUuXG4gICAgKiBAcmV0dXJucyByZXR1cm5zIGV2bHVhdGVkIHZhbHVlIGZvciB0aGUga2V5IGluIGRhdGEgc291cmNlLlxuICAgICovXG4gICAgcHJpdmF0ZSBfdmFsdWVPZkpzb25QYXRoKFxuICAgICAgICBwYXRoOiBhbnksXG4gICAgICAgIGRhdGE6IGFueSxcbiAgICAgICAgYXM6IGFueSxcbiAgICAgICAgZGVlcFhtbDogYm9vbGVhbixcbiAgICAgICAgY2xhdXNlPzogY2xhdXNlRXZhbHVhdG9yKTogYW55IHtcblxuICAgICAgICBsZXQgcmVzdWx0OiBhbnk7XG4gICAgICAgIGxldCB4ID0gdGhpcy5fbm9ybWFsaXplKGRhdGEsIGRlZXBYbWwpO1xuICAgICAgICBwYXRoLm1hcCggKHN1YmtleTogYW55KSA9PiB7XG4gICAgICAgICAgICBsZXQgbm9kZSA9IHg7XG4gICAgICAgICAgICBpZiAobm9kZSAmJiBub2RlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0ID0gW107XG4gICAgICAgICAgICAgICAgaWYgKHN1YmtleS5zb3J0KSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUgPSBzdWJrZXkuc29ydChub2RlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbm9kZS5tYXAgKFxuICAgICAgICAgICAgICAgICAgICAoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpdGVtID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdWJrZXkua2V5Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4ID0gc3Via2V5LmtleS5sZW5ndGggPyBpdGVtW3N1YmtleS5rZXldIDogaXRlbTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHggJiYgc3Via2V5LnZhbGlkYXRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Via2V5LnZhbGlkYXRlZC5tYXAodiA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeiA9IHYoeCwgYXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgeiA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHogID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4ID0gejtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyICYmIHgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0LnB1c2goeCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHggPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3Via2V5LnZhbGlkYXRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Via2V5LnZhbGlkYXRlZC5tYXAodiA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeiA9IHYoaXRlbSwgYXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgeiA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHogID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtID0gejtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyICYmIGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0LnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHggPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0LnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHN1YmtleS5rZXkubGVuZ3RoICYmICh0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5zcGxpdCgnLicpLm1hcChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHN0cikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0ci5pbmRleE9mKHN1YmtleS5rZXkpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0LnB1c2goc3RyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgeCA9IHQ7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0geDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobm9kZSAmJiAodHlwZW9mIG5vZGUgPT09ICdvYmplY3QnKSkge1xuICAgICAgICAgICAgICAgIHggPSB4ID9cbiAgICAgICAgICAgICAgICAgICAgY2xhdXNlKG5vZGUsIHN1YmtleS5rZXksIHN1YmtleS5rZXkubGVuZ3RoID8geFtzdWJrZXkua2V5XTogIHgpIDpcbiAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIGlmICh4ICYmIHggaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ID0gW107XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdWJrZXkuc29ydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgeCA9IHN1YmtleS5zb3J0KHgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHgubWFwKFxuICAgICAgICAgICAgICAgICAgICAgICAgKGl0ZW06IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdWJrZXkudmFsaWRhdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Via2V5LnZhbGlkYXRlZC5tYXAodiA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB6ID0gdihpdGVtLCBhcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHogPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHogID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0gPSB6O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHIgJiYgaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdC5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgeCA9IHQ7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHg7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh4KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdWJrZXkudmFsaWRhdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJrZXkudmFsaWRhdGVkLm1hcCh2ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB6ID0gdih4LCBhcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB6ID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoeiAgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHggPSB6O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHIgJiYgeCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHg7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHggPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB4O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChub2RlICYmICh0eXBlb2Ygbm9kZSA9PT0gJ3N0cmluZycpICYmIHN1YmtleS5rZXkubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gW107XG4gICAgICAgICAgICAgICAgbm9kZS5zcGxpdCgnLicpLm1hcChcbiAgICAgICAgICAgICAgICAgICAgKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLmluZGV4T2Yoc3Via2V5LmtleSkgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBub2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9nZXQocGF0aDogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IHVybCA9IHRoaXMuU0VSVklDRV9QQVRIICsgcGF0aDtcbiAgICAgICAgY29uc3QgZG90ID0gcGF0aC5sYXN0SW5kZXhPZignLicpO1xuICAgICAgICBjb25zdCBleHQgPSBkb3QgPCAwID8gdW5kZWZpbmVkIDogcGF0aC50b0xvd2VyQ2FzZSgpLnN1YnN0cihkb3QpO1xuICAgICAgICBjb25zdCBoZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKCk7XG4gICAgICAgIGxldCByZXN1bHQ6IGFueTtcblxuICAgICAgICBoZWFkZXJzLnNldCgnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJywgJyonKTtcblxuICAgICAgICBpZiAoZXh0ID09PSAnLnhtbCcpIHtcbiAgICAgICAgICAgIGhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCAndGV4dDsgY2hhcnNldD11dGYtOCcpLnNldCgnQWNjZXB0JywgJ3RleHQnKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5nZXQodXJsLCB7IGhlYWRlcnMsIHJlc3BvbnNlVHlwZTogJ3RleHQnIH0pXG4gICAgICAgICAgICAgICAgLnBpcGUobWFwKChyZXMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeG1sID0gbmV3IHhtbGRvbS5ET01QYXJzZXIoKS5wYXJzZUZyb21TdHJpbmcocmVzKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QganNvbiA9IHRoaXMuX3htbDJqc29uKHhtbC5kb2N1bWVudEVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ganNvbjtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmIChleHQgPT09ICcudHh0Jykge1xuICAgICAgICAgICAgaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsICd0ZXh0OyBjaGFyc2V0PXV0Zi04Jykuc2V0KCdBY2NlcHQnLCAndGV4dCcpO1xuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLmdldCh1cmwsIHsgaGVhZGVycywgcmVzcG9uc2VUeXBlOiAndGV4dCcgfSkucGlwZShtYXAoKHJlcykgPT4gcmVzKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXh0ID09PSAnLmpzb24nKXtcbiAgICAgICAgICAgIGhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCAnanNvbjsgY2hhcnNldD11dGYtOCcpLnNldCgnQWNjZXB0JywgJ2pzb24nKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5nZXQodXJsLCB7aGVhZGVyc30pLnBpcGUobWFwKChyZXMpID0+IHJlcykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsICd0ZXh0OyBjaGFyc2V0PXV0Zi04Jykuc2V0KCdBY2NlcHQnLCAndGV4dCcpO1xuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLmdldCh1cmwsIHsgaGVhZGVycywgcmVzcG9uc2VUeXBlOiAndGV4dCcgfSlcbiAgICAgICAgICAgICAgICAucGlwZShtYXAoKHJlcykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcGFyc2VkOiBhbnk7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZWQgPSBKU09OLnBhcnNlKHJlcyk7XG4gICAgICAgICAgICAgICAgICAgIH1jYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB4bWwgPSBuZXcgeG1sZG9tLkRPTVBhcnNlcigpLnBhcnNlRnJvbVN0cmluZyhyZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlZCA9IHRoaXMuX3htbDJqc29uKHhtbC5kb2N1bWVudEVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZTIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZWQgPSByZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZWQgPyBwYXJzZWQgOiByZXM7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9zdHJpbmdWYWx1ZU9mS2V5KGtleTogYW55KSB7XG4gICAgICAgIGxldCByZXN1bHQ6IGFueSA9IFtdO1xuXG4gICAgICAgIGlmIChrZXkgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAga2V5Lm1hcCggXG4gICAgICAgICAgICAgICAgKGl0ZW06IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgeCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5tYXAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHN1Yml0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1Yml0ZW0ua2V5Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeC5wdXNoKHN1Yml0ZW0ua2V5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHguam9pbignLicpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGkgPSBpdGVtLmluZGV4T2YoJ1snKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGogPSBpdGVtLmluZGV4T2YoJ10nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGsgPSBpdGVtLmxlbmd0aCA+IChqICsgMSkgPyAyIDogMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGkgPiAwID8gaXRlbS5zdWJzdHJpbmcoMCxpKSA6IGogPiAwID8gaXRlbS5zdWJzdHJpbmcoaiArIGspIDogaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS5rZXkubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChpdGVtLmtleSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LmpvaW4oJywnKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5pbmRleE9mKCcuJykgPCAwID8gcmVzdWx0LnJlcGxhY2UoL1xcLC9nLCAnLicpIDogcmVzdWx0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0ID0ga2V5LmtleTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHByaXZhdGUgX2FkZFRvUmVzdWx0KHZhbHVlOiBhbnksIGtleTogc3RyaW5nLCBvcGVyYXRpb246IGFueSwgYWN0aW9uOiBhbnkpIHtcbiAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMuX3N0cmluZ1ZhbHVlT2ZLZXkoYWN0aW9uLnBhdGgpO1xuICAgICAgICBjb25zdCBrZXkyID0gdGhpcy5fc3RyaW5nVmFsdWVPZktleShrZXkpO1xuICAgICAgICBsZXQgb3AgPSBvcGVyYXRpb24ucmVzdWx0W3BhdGhdO1xuICAgICAgICBsZXQgY29tcGxldGUgPSBmYWxzZTtcbiAgICBcbiAgICAgICAgaWYgKCFvcCkge1xuICAgICAgICAgICAgb3BlcmF0aW9uLnJlc3VsdFtwYXRoXSA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcCkge1xuICAgICAgICAgICAgbGV0IG9wayA9IG9wW2tleTJdO1xuICAgICAgICAgICAgaWYgKG9wZXJhdGlvblsndGVtcCddICYmXG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uWyd0ZW1wJ11ba2V5Ml0pIHtcbiAgICAgICAgICAgICAgICBvcFtrZXkyXSA9IFtvcFtrZXkyXV07XG4gICAgICAgICAgICAgICAgZGVsZXRlIG9wZXJhdGlvblsndGVtcCddO1xuICAgICAgICAgICAgfWVsc2UgaWYgKG9wayAmJiAob3BrIGluc3RhbmNlb2YgQXJyYXkpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5yZXN1bHRbcGF0aF1ba2V5Ml0gPSBbb3BrXVxuICAgICAgICAgICAgICAgIG9wID0gb3BlcmF0aW9uLnJlc3VsdFtwYXRoXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhbHVlID0gdGhpcy5fbm9ybWFsaXplKHZhbHVlLCBhY3Rpb24uZGVlcFhtbCk7XG4gICAgICAgICAgICBpZiAob3Bba2V5Ml0pIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoSlNPTi5zdHJpbmdpZnkodmFsdWUpICE9PSBKU09OLnN0cmluZ2lmeShvcFtrZXkyXVswXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wW2tleTJdLnB1c2goIHZhbHVlW2tleTJdID8gdmFsdWVba2V5Ml0gOiB2YWx1ZSApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgb3Bba2V5Ml0ucHVzaCggdmFsdWVba2V5Ml0gPyB2YWx1ZVtrZXkyXSA6IHZhbHVlICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoKG9wIGluc3RhbmNlb2YgQXJyYXkpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb24ucmVzdWx0W3BhdGhdID0gW29wXTtcbiAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLnJlc3VsdFtwYXRoXS5wdXNoKCB2YWx1ZVtrZXkyXSA/IHZhbHVlW2tleTJdIDogdmFsdWUgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKEpTT04uc3RyaW5naWZ5KHZhbHVlKSAhPT0gSlNPTi5zdHJpbmdpZnkob3BbMF0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3AucHVzaCggdmFsdWVba2V5Ml0gPyB2YWx1ZVtrZXkyXSA6IHZhbHVlICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcC5wdXNoKCB2YWx1ZVtrZXkyXSA/IHZhbHVlW2tleTJdIDogdmFsdWUgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgYWxyZWFkeSBhbiBhcnJheSByZW1lbWJlciBpdC5cbiAgICAgICAgICAgICAgICBpZiAoIW9wZXJhdGlvblsndGVtcCddKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvblsndGVtcCddID0ge307XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghb3BlcmF0aW9uWyd0ZW1wJ11ba2V5Ml0pIHtcbiAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uWyd0ZW1wJ11ba2V5Ml0gPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wZXJhdGlvbi5yZXN1bHRbcGF0aF1ba2V5Ml0gPSB0aGlzLl9ub3JtYWxpemUodmFsdWUsIGFjdGlvbi5kZWVwWG1sKTtcbiAgICAgICAgICAgIGNvbXBsZXRlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29tcGxldGU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfcGFjayhyZXN1bHQ6IGFueSkge1xuICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIGNvbnN0IGxpc3QgPSBbXTtcbiAgICAgICAgICAgIHJlc3VsdC5tYXAoXG4gICAgICAgICAgICAgICAgKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKHRoaXMuX3BhY2soaXRlbSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXN1bHQgPSBsaXN0O1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiByZXN1bHQgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMocmVzdWx0KTtcbiAgICAgICAgICAgIGtleXMubWFwIChcbiAgICAgICAgICAgICAgICAoa2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSByZXN1bHRba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBBcnJheSkge1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbVtrZXldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IGl0ZW1ba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHByaXZhdGUgX3RyaWdnZXJSZXN1bHQocHJvbWlzZTogYW55LCBhczogYW55LCByZXN1bHQ6IGFueSkge1xuICAgICAgICBjb25zdCB4ID0gdGhpcy5fcGFjayhyZXN1bHQpO1xuICAgICAgICBsZXQgc2F2ZUFzOiBhbnk7XG4gICAgICAgIGlmIChhcykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBhcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBzYXZlQXMgPSB7fTtcbiAgICAgICAgICAgICAgICBzYXZlQXNbYXNdID0geDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGFzID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIHNhdmVBcyA9IGFzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHByb21pc2UubmV4dCh4KTtcbiAgICAgICAgcmV0dXJuIHNhdmVBcztcbiAgICB9XG5cbiAgICBwcml2YXRlIF9zdWJxdWVyeShcbiAgICAgICAgcHJvbWlzZTogYW55LFxuICAgICAgICBwYXRoOiBhbnksXG4gICAgICAgIG9wZXJhdGlvbjogYW55LFxuICAgICAgICBhY3Rpb246IGFueSkge1xuXG4gICAgICAgIGlmIChvcGVyYXRpb24uY2FjaGVkRmlsZXNbcGF0aF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gb25lIG9mIHRoZSBrZXlzIGF0IHRoaXMgbGV2ZWwgY291bGQgYmUgcmVmZXJlbmNpbmcgdGhlIHNhbWUgZmlsZSB3aGljaFxuICAgICAgICAgICAgLy8gaXMgbm90IHlldCBmZXRjaGVkLiBuZWVkIHRvIHdhaXQgdGlsbCBpdCBpcyBhdmFpbGFibGUuXG4gICAgICAgICAgICBvcGVyYXRpb24uY2FjaGVkRmlsZXNbcGF0aF0gPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGFueT4obnVsbCk7XG4gICAgICAgICAgICB0aGlzLl9xdWVyeUl0ZXJhdGlvbihcbiAgICAgICAgICAgICAgICBvcGVyYXRpb24uY2FjaGVkRmlsZXNbcGF0aF0sXG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcGF0aDogYWN0aW9uLnBhdGgsXG4gICAgICAgICAgICAgICAgICAgIGluOiBhY3Rpb24uaW4sXG4gICAgICAgICAgICAgICAgICAgIGRlZXBYbWw6IGFjdGlvbi5kZWVwWG1sLFxuICAgICAgICAgICAgICAgICAgICBqb2luOiBhY3Rpb24uam9pbixcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlcjogYWN0aW9uLmhhbmRsZXIsXG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5SXRlbXM6IChhY3Rpb24ucGF0aCBpbnN0YW5jZW9mIEFycmF5KSA/IGFjdGlvbi5wYXRoLmxlbmd0aCA6IDFcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHBhdGhcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB3YWl0IGZvciByZXN1bHQgcmFpc2VkIGFib3ZlLlxuICAgICAgICBvcGVyYXRpb24uY2FjaGVkRmlsZXNbcGF0aF0uc3Vic2NyaWJlKFxuICAgICAgICAgICAgKHNvdXJjZTogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHNvdXJjZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvcGtleWkgPSBhY3Rpb24uam9pbiA/IGFjdGlvbi5qb2luW2FjdGlvbi5wYXRoXSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wa2V5aSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNvdXJjZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlLm1hcChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N1YnF1ZXJ5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBvcGtleWkucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW46IG9wa2V5aS5pbiA9PSB1bmRlZmluZWQgPyBhY3Rpb24uaW4gOiAob3BrZXlpLmluICsgaXRlbSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZXBYbWw6IG9wa2V5aS5kZWVwWG1sLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqb2luOiBvcGtleWkuam9pbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlcjogb3BrZXlpLmhhbmRsZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5SXRlbXM6IChvcGtleWkucGF0aCBpbnN0YW5jZW9mIEFycmF5KSA/IG9wa2V5aS5wYXRoLmxlbmd0aCA6IDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdWJxdWVyeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IGFjdGlvbi5qb2luW29wa2V5aS5wYXRoXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluOiBvcGtleWkuaW4gPT0gdW5kZWZpbmVkID8gYWN0aW9uLmluIDogKG9wa2V5aS5pbiArIHNvdXJjZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWVwWG1sOiBhY3Rpb24uZGVlcFhtbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpvaW46IG9wa2V5aS5qb2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlcjogb3BrZXlpLmhhbmRsZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWVyeUl0ZW1zOiAob3BrZXlpLnBhdGggaW5zdGFuY2VvZiBBcnJheSkgPyBvcGtleWkucGF0aC5sZW5ndGggOiAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2FkZFRvUmVzdWx0KHNvdXJjZSwgYWN0aW9uLnBhdGgsIG9wZXJhdGlvbiwgYWN0aW9uKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uLnF1ZXJ5SXRlbXMtLTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhY3Rpb24ucXVlcnlJdGVtcyA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5hcyA9IHRoaXMuX3RyaWdnZXJSZXN1bHQocHJvbWlzZSwgb3BlcmF0aW9uLmFzLCBvcGVyYXRpb24ucmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uLnF1ZXJ5SXRlbXMtLTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5hcyA9IHRoaXMuX3RyaWdnZXJSZXN1bHQocHJvbWlzZSwgb3BlcmF0aW9uLmFzLCBvcGVyYXRpb24ucmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAoZXJyb3I6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxvZ0VuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhY3Rpb24ucXVlcnlJdGVtcy0tO1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5hcyA9IHRoaXMuX3RyaWdnZXJSZXN1bHQocHJvbWlzZSwgb3BlcmF0aW9uLmFzLCBvcGVyYXRpb24ucmVzdWx0KTtcbiAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cbiAgICAvKlxuICAgICogSXRlcmF0ZXMgdGhyb3VnaCBhIGNoYWluIHF1ZXJ5LlxuICAgICogQHBhcmFtIHByb21pc2UgVGhlIHByb21pc2Ugd2hpY2ggb3JpZ2luYWwgY2FsbGVyIGlzIHdhaXRpbmcgZm9yLlxuICAgICogQHBhcmFtIG9wZXJhdGlvbiBkYXRhIGZvciBrZWVwaW5nIHRyYWNrIG9mIHRoZSBpdGVyYXRpb24uXG4gICAgKiBAcGFyYW0gYWN0aW9uIGNvbnRhaW5zOiB7cGF0aDogY3VycmVudCBrZXlzIHRvIHF1ZXJ5IGZvciwgaW46IGN1cnJlbnQgcXVlcnkgcGF0aCwgaGFuZGxlcjogcmVzb2x2ZXIgbWV0aG9kfS5cbiAgICAqIEBwYXJhbSBjYWNoZU5hbWVkIFRoZSBjYWNoZWQgbmFtZSBmcm9tIHByZXZpb3VzIGl0ZXJhdGlvbiBpZiBhbnkuXG4gICAgKiBAcmV0dXJucyByZXR1cm5zIG5vbmUuXG4gICAgKi9cbiAgICBwcml2YXRlIF9xdWVyeUl0ZXJhdGlvbihcbiAgICAgICAgcHJvbWlzZTogQmVoYXZpb3JTdWJqZWN0PGFueT4sXG4gICAgICAgIG9wZXJhdGlvbjogYW55LFxuICAgICAgICBhY3Rpb246IGFueSxcbiAgICAgICAgY2FjaGVOYW1lZD86IHN0cmluZykge1xuXG4gICAgICAgIGlmICghYWN0aW9uLmhhbmRsZXIpIHtcbiAgICAgICAgICAgIGFjdGlvbi5oYW5kbGVyID0gKG5vZGU6IGFueSwgcGF0aDogc3RyaW5nLCB2YWx1ZTogYW55KSA9PiB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zZWxlY3QoYWN0aW9uLnBhdGgsIGFjdGlvbi5pbiwgYWN0aW9uLmRlZXBYbWwsIG9wZXJhdGlvbi5hcywgYWN0aW9uLmhhbmRsZXIpLnN1YnNjcmliZShcbiAgICAgICAgICAgIChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhY2hlTmFtZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlc3VsdCBvZiBuLXRoIGxldmVsIGNhbGwgdG8gYmUgcGxhY2VkIG9uIHByZXZpb3VzIGxldmVsIGNhY2hlIHJlZmVyZW5jZS5cbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5jYWNoZWRGaWxlc1tjYWNoZU5hbWVkXS5uZXh0KGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9wZXJhdGlvbmFsS2V5ID0gYWN0aW9uLmpvaW4gPyBhY3Rpb24uam9pblthY3Rpb24ucGF0aF0gOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wZXJhdGlvbmFsS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFzc3VtcHRpb24gaXMgdGhlIHJlc3VsdGluZyBsaXN0IGlzIGEgbGlzdCBvZiBmaWxlIHBhdGhzLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLm1hcCggKGNvbnRlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhdGggPSBjb250ZW50WycjdGV4dCddID8gY29udGVudFsnI3RleHQnXSA6IGNvbnRlbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2l6ZSA9IChvcGVyYXRpb25hbEtleS5wYXRoIGluc3RhbmNlb2YgQXJyYXkpID8gb3BlcmF0aW9uYWxLZXkucGF0aC5sZW5ndGggOiAxO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob3BlcmF0aW9uYWxLZXkuaW4gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLmNhY2hlZEZpbGVzW3BhdGhdID0gdGhpcy5fc2VsZWN0KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb25hbEtleS5wYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb24uaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbmFsS2V5LmRlZXBYbWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5hcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uYWxLZXkuaGFuZGxlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZSAtLTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N1YnF1ZXJ5KHByb21pc2UsIHBhdGgsIG9wZXJhdGlvbiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IG9wZXJhdGlvbmFsS2V5LnBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW46IG9wZXJhdGlvbmFsS2V5LmluID09IHVuZGVmaW5lZCA/IGFjdGlvbi5pbiA6IChvcGVyYXRpb25hbEtleS5pbiArIGNvbnRlbnQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZXBYbWw6IG9wZXJhdGlvbmFsS2V5LmRlZXBYbWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgam9pbjogb3BlcmF0aW9uYWxLZXkuam9pbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyOiBvcGVyYXRpb25hbEtleS5oYW5kbGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5SXRlbXM6IHNpemVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBubyBtb3JlIHF1ZXJ5IGluIHRoZSBjaGFpbi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uLnF1ZXJ5SXRlbXMtLTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGlvbi5xdWVyeUl0ZW1zID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPW9wZXJhdGlvbi5yZXN1bHQgPyBvcGVyYXRpb24ucmVzdWx0IDoge307XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb24uYXMgPSB0aGlzLl90cmlnZ2VyUmVzdWx0KHByb21pc2UsIG9wZXJhdGlvbi5hcywgT2JqZWN0LmtleXMob3BlcmF0aW9uLnJlc3VsdCkubGVuZ3RoID8gb3BlcmF0aW9uLnJlc3VsdCA6IGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhkYXRhKS5tYXAoIChrZXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY29udGVudCA9IGRhdGFba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3BlcmF0aW9uYWxLZXkgPSBhY3Rpb24uam9pbiA/IGFjdGlvbi5qb2luW2tleV06IHVuZGVmaW5lZDtcbiAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRlbnQgJiYgY29udGVudC5sZW5ndGggJiYgb3BlcmF0aW9uYWxLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzaXplID0gKG9wZXJhdGlvbmFsS2V5LnBhdGggaW5zdGFuY2VvZiBBcnJheSkgPyBvcGVyYXRpb25hbEtleS5wYXRoLmxlbmd0aCA6IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob3BlcmF0aW9uYWxLZXkuaW4gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLmNhY2hlZEZpbGVzW2NvbnRlbnRdID0gdGhpcy5fc2VsZWN0KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb25hbEtleS5wYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb24uaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbmFsS2V5LmRlZXBYbWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5hcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uYWxLZXkuaGFuZGxlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZSAtLTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N1YnF1ZXJ5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBvcGVyYXRpb25hbEtleS5wYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbjogb3BlcmF0aW9uYWxLZXkuaW4gPT0gdW5kZWZpbmVkID8gYWN0aW9uLmluIDogKG9wZXJhdGlvbmFsS2V5LmluICsgY29udGVudCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZXBYbWw6IG9wZXJhdGlvbmFsS2V5LmRlZXBYbWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXI6IG9wZXJhdGlvbmFsS2V5LmhhbmRsZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5SXRlbXM6IHNpemVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uLnF1ZXJ5SXRlbXMtLTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb250ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFvcGVyYXRpb24ucmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5yZXN1bHQgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wZXJhdGlvbi5yZXN1bHQgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb24ucmVzdWx0LnB1c2goY29udGVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLnJlc3VsdFtrZXldID0gY29udGVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aW9uLnF1ZXJ5SXRlbXMgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb24uYXMgPSB0aGlzLl90cmlnZ2VyUmVzdWx0KHByb21pc2UsIG9wZXJhdGlvbi5hcywgT2JqZWN0LmtleXMob3BlcmF0aW9uLnJlc3VsdCkubGVuZ3RoID8gb3BlcmF0aW9uLnJlc3VsdCA6IGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbi5xdWVyeUl0ZW1zLS07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGlvbi5xdWVyeUl0ZW1zID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhvcGVyYXRpb24ucmVzdWx0KS5sZW5ndGggPT09IDAgJiYgZGF0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb24ucmVzdWx0ID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb24uYXMgPSB0aGlzLl90cmlnZ2VyUmVzdWx0KHByb21pc2UsIG9wZXJhdGlvbi5hcywgb3BlcmF0aW9uLnJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgKGVycm9yOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBwcm9taXNlLmVycm9yKHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ2ZhaWxlZCB0byBxdWVyeSAnICsgYWN0aW9uLnBhdGgsXG4gICAgICAgICAgICAgICAgICAgIHJlYXNvbjogZXJyb3IubWVzc2FnZSA/IGVycm9yLm1lc3NhZ2UgOiBlcnJvclxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGFjdGlvbi5xdWVyeUl0ZW1zLS07XG4gICAgICAgICAgICAgICAgaWYgKGFjdGlvbi5xdWVyeUl0ZW1zID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5hcyA9IHRoaXMuX3RyaWdnZXJSZXN1bHQocHJvbWlzZSwgb3BlcmF0aW9uLmFzLCBvcGVyYXRpb24ucmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfbWFrZUFyZ3VtZW50cyhrZXk6IHN0cmluZykge1xuICAgICAgICBjb25zdCBsaXN0ID0ga2V5LnNwbGl0KCcuJyk7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgICAgICBsaXN0Lm1hcCggKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGIgPSBpdGVtLmluZGV4T2YoJ1snKTtcbiAgICAgICAgICAgIGlmIChiIDwgMCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiBpdGVtLFxuICAgICAgICAgICAgICAgICAgICB2YWxpZGF0ZWQ6IFsoZGF0YTogYW55LCBhczogYW55KSA9PiB0cnVlXVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgc3RyID0gaXRlbS5zdWJzdHJpbmcoYiArIDEsIGl0ZW0ubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICAgICAgY29uc3Qgdkxpc3QgPSBzdHIuc3BsaXQoJ11bJyk7XG4gICAgICAgICAgICAgICAgY29uc3Qgb2JqZWN0ID0ge1xuICAgICAgICAgICAgICAgICAgICBrZXk6IGl0ZW0uc3Vic3RyaW5nKDAsYiksXG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRlZDogWyhkYXRhOiBhbnksIGFzOiBhbnkpID0+IHRydWVdXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB2TGlzdC5tYXAoIFxuICAgICAgICAgICAgICAgICAgICAoZmlsdGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXIgPSBmaWx0ZXIucmVwbGFjZSgvXFxgL2csICcuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXIgPSBmaWx0ZXIucmVwbGFjZSgvXFxAL2csICdkYXRhJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmlsdGVyLmluZGV4T2YoJ29yZGVyLWJ5OicpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhcmc6IGFueSA9IGZpbHRlci5zdWJzdHJpbmcoZmlsdGVyLmluZGV4T2YoJ29yZGVyLWJ5OicpICsgMTApLnRyaW0oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhcmdsaXN0ID0gYXJnLnNwbGl0KCd+Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gYXJnbGlzdFswXS50cmltKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3JkZXI9IGFyZ2xpc3RbMV0gPyBhcmdsaXN0WzFdLnRyaW0oKS50b0xvd2VyQ2FzZSgpOiAnYXNjJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RbJ3NvcnQnXSA9IGZ1bmN0aW9uIChhcnJheTogYW55KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IF92YWx1ZU9mID0gKGtleTogc3RyaW5nLCBwOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleS5zcGxpdCgnLicpLm1hcCggKHgpID0+IHtwID0gcFt4XX0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFycmF5LnNvcnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihhOiBhbnksYjogYW55KXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmbGFnID1fdmFsdWVPZihrZXksIGEpID4gX3ZhbHVlT2Yoa2V5LCBiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmxhZyA/IChvcmRlciA9PT0gJ2FzYycgPyAxOiAtMSkgOiAob3JkZXIgPT09ICdhc2MnID8gLTE6IDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0ID0gZmlsdGVyLmluZGV4T2YoJyYmJykgPiAwIHx8IGZpbHRlci5pbmRleE9mKCd8fCcpID4gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZiA9ICdyZXR1cm4gZnVuY3Rpb24gKGRhdGEsIGFzTGlzdCkgeyBcXG4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGYgKz0gdGhpcy5fZ2xvYmFsRnVuY3Rpb25zKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZiArPSAndmFyIHggPSBmYWxzZTtcXG4gdHJ5e1xcbiB4ID0gJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmICs9ICh0ID8gJygnICsgZmlsdGVyICsgJyknIDogZmlsdGVyKSArICc7IFxcbn1jYXRjaChlKXt9XFxuIHJldHVybiB4O1xcbn0nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdFsndmFsaWRhdGVkJ10ucHVzaCggbmV3IEZ1bmN0aW9uKGYpKCkgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gob2JqZWN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfaGFuZGxlU3BlY2lhbENoYXJhY3RlcnMocGF0aDogc3RyaW5nKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICAgICAgcGF0aC5zcGxpdCgnXScpLm1hcChcbiAgICAgICAgICAgIChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgYmluZGV4ID0gaXRlbS5pbmRleE9mKCdbJyk7XG4gICAgICAgICAgICAgICAgaWYgKGJpbmRleCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB4ID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGlmICggYmluZGV4ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgeCArPSBpdGVtLnN1YnN0cmluZygwLCBiaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHggKz0gaXRlbS5zdWJzdHJpbmcoYmluZGV4KS5yZXBsYWNlKC9cXC4vZywnYCcpO1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh4KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiByZXN1bHQuam9pbignXScpO1xuICAgIH1cbiAgICBwcml2YXRlIF9wcmVwYXJlSnNvblBhdGgocGF0aDogYW55KSB7XG4gICAgICAgIGxldCByZXN1bHQ6IGFueTtcbiAgICAgICAgaWYgKHBhdGggaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gW107XG4gICAgICAgICAgICBwYXRoLm1hcChcbiAgICAgICAgICAgICAgICAoaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB4ID0gdGhpcy5faGFuZGxlU3BlY2lhbENoYXJhY3RlcnMoaSk7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXMuX21ha2VBcmd1bWVudHMoeCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy5faGFuZGxlU3BlY2lhbENoYXJhY3RlcnMocGF0aCk7XG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLl9tYWtlQXJndW1lbnRzKHgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgX3NlbGVjdChcbiAgICAgICAgcGF0aDogYW55LFxuICAgICAgICBmcm9tOiBzdHJpbmcsXG4gICAgICAgIGRlZXBYbWw6IGJvb2xlYW4sXG4gICAgICAgIGFzOiBhbnksXG4gICAgICAgIGNsYXVzZT86IGNsYXVzZUV2YWx1YXRvcik6IEJlaGF2aW9yU3ViamVjdDxhbnk+IHtcblxuICAgICAgICBjb25zdCBkYXRhU3RvcmUgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGFueT4obnVsbCk7XG5cbiAgICAgICAgdGhpcy5fZ2V0KGZyb20pLnN1YnNjcmliZShcbiAgICAgICAgICAgIChkYXRhOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0OiBhbnk7XG4gICAgICAgICAgICAgICAgY29uc3QganBhdGggPSB0aGlzLl9wcmVwYXJlSnNvblBhdGgocGF0aCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWNsYXVzZSkge1xuICAgICAgICAgICAgICAgICAgICBjbGF1c2UgPSAobm9kZTogYW55LCBwYXRoOiBzdHJpbmcsIHZhbHVlOiBhbnkpID0+IHZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocGF0aCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHt9O1xuICAgICAgICAgICAgICAgICAgICBqcGF0aC5tYXAoKHBhdGhJdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB5ID0gdGhpcy5fdmFsdWVPZkpzb25QYXRoKHBhdGhJdGVtLCBkYXRhLCBhcywgZGVlcFhtbCwgY2xhdXNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGtleSA9IHRoaXMuX3N0cmluZ1ZhbHVlT2ZLZXkocGF0aEl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0geTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhyZXN1bHQpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgcGF0aCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5fdmFsdWVPZkpzb25QYXRoKGpwYXRoLCBkYXRhLCBhcywgZGVlcFhtbCwgY2xhdXNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICBkYXRhU3RvcmUubmV4dChyZXN1bHQpO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YVN0b3JlLmVycm9yKCdSZXN1bHQgbm90IGZvdW5kIGZvciAnICsgcGF0aCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIChlcnJvcjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgZGF0YVN0b3JlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIGRhdGFTdG9yZTtcbiAgICB9XG5cbiAgICAvKlxuICAgICogV2lsbCBjb252ZXJ0IHRoZSB4bWwgaW50byBhIGpzb24uXG4gICAgKiBAcGFyYW0geG1sIFhNTCB0byBiZSBjb252ZXJ0ZWQuXG4gICAgKiBAcmV0dXJucyByZXR1cm5zIGNvbnZlcnRlZCBKU09OLlxuICAgICovXG4gICAgcHJpdmF0ZSBfeG1sMmpzb24oeG1sOiBhbnkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBvYmogPSB7fTtcbiAgICAgICAgICAgIGlmICh4bWwuYXR0cmlidXRlcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGMgPSB4bWwuYXR0cmlidXRlcztcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhdHRyID0gY1tpXTtcbiAgICAgICAgICAgICAgICBvYmpbYXR0ci5uYW1lXSA9IGF0dHIudmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHhtbC5jaGlsZE5vZGVzICYmIHhtbC5jaGlsZE5vZGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgeG1sLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IHhtbC5jaGlsZE5vZGVzW2ldO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBub2RlTmFtZSA9IGl0ZW0ubm9kZU5hbWU7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9ialtub2RlTmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZnJhZ21lbnQgPSB0aGlzLl94bWwyanNvbihpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmcmFnbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JqW25vZGVOYW1lXSA9IGZyYWdtZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9ialtub2RlTmFtZV0ucHVzaCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2xkID0gb2JqW25vZGVOYW1lXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ialtub2RlTmFtZV0gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmpbbm9kZU5hbWVdLnB1c2gob2xkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZyYWdtZW50ID0gdGhpcy5feG1sMmpzb24oaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZnJhZ21lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmpbbm9kZU5hbWVdLnB1c2goZnJhZ21lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXh0ID0geG1sLnRleHRDb250ZW50LnRyaW0oKS5yZXBsYWNlKC8oPzpcXHJcXG58XFxyfFxcbnxcXHQpL2csICcnKTtcbiAgICAgICAgICAgICAgICBvYmogPSB0ZXh0Lmxlbmd0aCA/IHRleHQgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5sb2dFbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZS5tZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qXG4gICAgKiBXaWxsIGRvIGEgY2hhaW4gcXVlcnkgb24gc3BlY2lmaWVkIHBhdGhzIGZyb20gcmVtb3RlIGxvY2F0aW9uLlxuICAgICogQHBhcmFtIGNoYWluUXVlcnkgQSBKc29uIHN0cnVjdHVyZSB3aXRoIHBhdGhzLiBFYWNoIHBhdGggd2lsbCBjb250YWluIGEgY2hhaW4gb2YgaW5zdHJ1Y3Rpb25zLlxuICAgICogRWFjaCBpbnN0cnVjdGlvbiB3aWxsIGhhdmUgYSAnaW4nIHRvIGEgZmlsZSBhbmQgYSBwYXRoIHRvIHNlYXJjaCBvbiBpdCAoc2VlLiBzZWxlY3QoKSkuIG9uY2UgdGhlXG4gICAgKiByZXN1bHQgaXMgaW4sIHRoZSBuZXh0IGluc3RydWN0aW9uIGluIHRoZSBwYXRoIGNoYWluIHdpbGwgYmUgdHJpZ2dlZC4gQWZ0ZXIgdGhlIHBhdGggdGhyb3VnaCBhbGxcbiAgICAqIGNoYWluZWQgcGF0aHMgaXMgY29tcGxldGVkLCByZXN1bHRpbmcgdmFsdWUgd2lsbCBiZSBwdXQgaW4gYSBqc29uIHdoZXJlIGl0cyBwYXRoIGlzIHRoZSBvcmlnaW5hbFxuICAgICoganNvbiBwYXRoIGFuZCBpdHMgdmFsdWUgd2lsbCBiZSB0aGUgcmVzdWx0aW5nIHZhbHVlLlxuICAgICpcbiAgICAqIHRoaXMgaXMgbm90IGZ1bGx5IHRlc3RlZC4gY2FsbGVyIHNob3VsZCBwYXNzIHNvbWV0aGluZyBsaWtlXG4gICAgKiB7cGF0aDogW3BhdGgxLHBhdGgyXSwgaW46ICdzb21ldGhpbmcgb3IgYmxhbmsnLCBkZWVwWG1sOiB0cnVlLCBqb2luOiB7azE6IHtwYXRoOiBwYXRoMywgaW46ICdzb21ldGhpbmcgb3IgcGxhbmsnLCBjbGF1c2U6IGZ1bmN0aW9ufX19XG4gICAgKiBpZiBwYXRoMSBvciBwYXRoMiBvciBwYXRoMyBhcmUgZm91bmQgYXQgdGhlIHJvb3Qgb2JqZWN0LCBhIGNoYWluIHJlYWN0aW9uIHRvIGZldGNoIGRlZXAgd2lsbCBmb2xsb3cuIEFuXG4gICAgKiBvcHRpb25hbCBjbGF1c2Ugd2lsbCBoZWxwIHJlc29sdmUgY29tcGxleCBzaXR1YXRpb25zLlxuICAgICpcbiAgICAqIEByZXR1cm5zIHJldHVybnMgYW4gb2JzZXJ2YWJsZS4gdGhlIGNhbGxlciBzaG91bGQgc3Vic2NyaWJlIHRvIHRoaXMgaW4gb3JkZXIgdG8gcmVjZWl2ZSB0aGUgcmVzdWx0LlxuICAgICovXG4gICAgY2hhaW5TZWxlY3QoY2hhaW5RdWVyeTogYW55KTogQmVoYXZpb3JTdWJqZWN0PGFueT4ge1xuICAgICAgICBjb25zdCBzaXplID0gKGNoYWluUXVlcnkucGF0aCBpbnN0YW5jZW9mIEFycmF5KSA/ICBjaGFpblF1ZXJ5LnBhdGgubGVuZ3RoIDogMTtcbiAgICAgICAgY29uc3Qgb3BlcmF0aW9uID0ge2NhY2hlZEZpbGVzOiB7fSwgYXM6IHt9LCByZXN1bHQ6IHt9fTtcbiAgICAgICAgY29uc3QgZGF0YVN0b3JlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxhbnk+KG51bGwpO1xuXG4gICAgICAgIG9wZXJhdGlvbi5jYWNoZWRGaWxlc1tjaGFpblF1ZXJ5LnBhdGhdID0gZGF0YVN0b3JlO1xuICAgICAgICB0aGlzLl9xdWVyeUl0ZXJhdGlvbihcbiAgICAgICAgICAgIGRhdGFTdG9yZSxcbiAgICAgICAgICAgIG9wZXJhdGlvbixcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBwYXRoOiBjaGFpblF1ZXJ5LnBhdGgsXG4gICAgICAgICAgICAgICAgaW46IGNoYWluUXVlcnkuaW4sXG4gICAgICAgICAgICAgICAgZGVlcFhtbDogY2hhaW5RdWVyeS5kZWVwWG1sLFxuICAgICAgICAgICAgICAgIGpvaW46IGNoYWluUXVlcnkuam9pbixcbiAgICAgICAgICAgICAgICBoYW5kbGVyOiBjaGFpblF1ZXJ5LmhhbmRsZXIsXG4gICAgICAgICAgICAgICAgcXVlcnlJdGVtczogc2l6ZVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gZGF0YVN0b3JlO1xuICAgIH1cblxuICAgIC8qXG4gICAgKiBXaWxsIGdyb3VwIGZpbGUgcGF0aHMgaWYgdGhleSBhcmUgc2ltaWxhciB0byBhdm9pZCBtdWx0aXBsZSBjYWxscy5cbiAgICAqIEBwYXJhbSBsaXN0IEEgbGlzdCBvZiBKc29uIHtwYXRocywgaW4sIGRlZXBYbWx9IHN0cnVjdHVyZXMuIGRlZXBYbWwgaXMgb3B0aW9uYWwuXG4gICAgKiBAcGFyYW0gY2xhdXNlIEEgbWV0aG9kIGJ5IHdoaWNoIHZhbHVlKHMpIGZvciB0aGUgcGF0aChzKSBjb3VsZCBiZSBldmFsdWF0ZWQuIHRoZSBjYWxsZXIgd291bGQgZXZhbHVhdGUgdGhlIHZhbHVlIGZvciBhIGdpdmVuIGF0dHJpYnV0ZS5cbiAgICAqIEByZXR1cm5zIHJldHVybnMgYW4gb2JzZXJ2YWJsZS4gdGhlIGNhbGxlciBzaG91bGQgc3Vic2NyaWJlIHRvIHRoaXMgaW4gb3JkZXIgdG8gcmVjZWl2ZSB0aGUgcmVzdWx0LlxuICAgICovXG4gICAgYXJyYXlTZWxlY3QoXG4gICAgICAgIGxpc3Q6IGFueSxcbiAgICAgICAgY2xhdXNlPzogY2xhdXNlRXZhbHVhdG9yKTogQmVoYXZpb3JTdWJqZWN0PGFueT4gIHtcbiAgICAgICAgY29uc3QgZ3JvdXBlZExpc3QgPSB7fTtcbiAgICAgICAgbGlzdC5tYXAoIChpdGVtOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGlmIChncm91cGVkTGlzdFtpdGVtLmluXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgZ3JvdXBlZExpc3RbaXRlbS5pbl0gPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGdyb3VwZWRMaXN0W2l0ZW0uaW5dLnB1c2goe3BhdGg6IGl0ZW0ucGF0aCwgZGVlcFhtbDogaXRlbS5kZWVwWG1sfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBkYXRhU3RvcmUgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGFueT4obnVsbCk7XG5cbiAgICAgICAgT2JqZWN0LmtleXMoZ3JvdXBlZExpc3QpLm1hcCAoICh1cmwpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdChncm91cGVkTGlzdFt1cmxdLnBhdGgsIHVybCwgZ3JvdXBlZExpc3RbdXJsXS5kZWVwWG1sLCB1bmRlZmluZWQsIGNsYXVzZSkuc3Vic2NyaWJlKFxuICAgICAgICAgICAgICAgIChkYXRhOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFTdG9yZS5uZXh0KGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAoZXJyb3I6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBkYXRhU3RvcmUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZGF0YVN0b3JlO1xuICAgIH1cblxuICAgIC8qXG4gICAgKiBXaWxsIHF1ZXJ5IHBhdGggZnJvbSBhIHJlbW90ZSBsb2NhdGlvbiBxdWFsaWZpZWQgdGhyb3VnaCBhbiBvcHRpb25hbCBjbGF1c2UgZnVuY3Rpb24gdGhhdFxuICAgICogZXZhbHVhdGVzLCBmaWx0ZXJzLCBvciBzb3J0cyB0aGUgcmVzdWwgb2YgdGhlIHF1ZXJ5LlxuICAgICogQHBhcmFtIHBhdGggQSBhIHNpbmdsZSBKU09OIHBhdGggb3IgbGlzdCBvZiBwYXRocyB0byBzZWxlY3QgKGkuZS4sICdhLmIuYycpXG4gICAgKiBAcGFyYW0gZnJvbSBBIHJlZmVyZW5jZSBVUkwgdG8gYSByZW1vdGUgc291cmNlLlxuICAgICogQHBhcmFtIGRlZXBYbWwgaWYgY2RhdGEtc2VjdGlvbiBzaG91bGQgYmUgcGFyc2VkLlxuICAgICogQHBhcmFtIGNsYXVzZSBBIG1ldGhvZCBieSB3aGljaCB2YWx1ZShzKSBmb3IgdGhlIHBhdGgocykgY291bGQgYmUgZXZhbHVhdGVkLiB0aGUgY2FsbGVyIHdvdWxkIGV2YWx1YXRlIHRoZSB2YWx1ZSBmb3IgYSBnaXZlbiBhdHRyaWJ1dGUuXG4gICAgKiBAcmV0dXJucyByZXR1cm5zIGFuIG9ic2VydmFibGUuIHRoZSBjYWxsZXIgc2hvdWxkIHN1YnNjcmliZSB0byB0aGlzIGluIG9yZGVyIHRvIHJlY2VpdmUgdGhlIHJlc3VsdC5cbiAgICAqL1xuICAgIHNlbGVjdChcbiAgICAgICAgcGF0aDogYW55LFxuICAgICAgICBmcm9tOiBzdHJpbmcsXG4gICAgICAgIGRlZXBYbWw6IGJvb2xlYW4sXG4gICAgICAgIGNsYXVzZT86IGNsYXVzZUV2YWx1YXRvcik6IEJlaGF2aW9yU3ViamVjdDxhbnk+IHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0KHBhdGgsIGZyb20sIGRlZXBYbWwsIHVuZGVmaW5lZCwgY2xhdXNlKTtcbiAgICB9XG59XG4iXX0=