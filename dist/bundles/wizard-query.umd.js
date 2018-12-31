(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs/operators'), require('rxjs'), require('xmldom'), require('@angular/common'), require('@angular/common/http'), require('@angular/core')) :
    typeof define === 'function' && define.amd ? define('wizard-query', ['exports', 'rxjs/operators', 'rxjs', 'xmldom', '@angular/common', '@angular/common/http', '@angular/core'], factory) :
    (factory((global['wizard-query'] = {}),global.rxjs.operators,global.rxjs,global.xmldom,global.ng.common,global.ng.common.http,global.ng.core));
}(this, (function (exports,operators,rxjs,xmldom,common,http,core) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var WizardQueryService = (function () {
        function WizardQueryService(http$$1) {
            this.http = http$$1;
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
                return "function reverse(a) {\n" +
                    " if (a instanceof Array) {\n" +
                    "  return a.reverse();\n" +
                    " \n} else if (typeof a === 'string') {\n" +
                    "  return a.split('').reverse().join('');\n" +
                    " } else return a;\n" +
                    "}\n" +
                    "function sum(a,b) {\n" +
                    " var total = 0;\n" +
                    " if (a instanceof Array) { \n" +
                    "  a.map(function(k) {total += sum(k, b);});\n" +
                    " } else if (typeof a === 'object') {\n" +
                    "   if (b.indexOf('.')>0){\n" +
                    "     var t = a; b.split('.').map(function(k){total+=sum(t[k],b.substring(k.length+1))});" +
                    "   } else if(a[b]) {\n" +
                    "     var t = a[b];\n" +
                    "     total += (typeof t === 'number') ? t : parseFloat(t);\n" +
                    "   } \n" +
                    " } \n" +
                    " return total;\n" +
                    "}\n" +
                    "function count(a,b) {\n" +
                    " var total = 0;\n" +
                    " if (a instanceof Array) { \n" +
                    "  a.map(function(k) {total += count(k, b);});\n" +
                    " } else if (typeof a === 'object') {\n" +
                    "  Object.keys(a).map(function(k){ total += count(a[k],b);});\n" +
                    " } else if (typeof a === 'string') {\n" +
                    "   total = a.split(b).length - 1;\n" +
                    " } else if (a === b) {total++;}\n" +
                    " return total;\n" +
                    "}\n";
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
         * @param {?} deepXml
         * @param {?=} clause
         * @return {?}
         */
        WizardQueryService.prototype._valueOfJsonPath = /**
         * @param {?} path
         * @param {?} data
         * @param {?} deepXml
         * @param {?=} clause
         * @return {?}
         */
            function (path, data, deepXml, clause) {
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
                                            var z = v(x);
                                            if (typeof z === 'boolean') {
                                                if (z == false) {
                                                    r_1 = false;
                                                }
                                            }
                                            else {
                                                x = z;
                                            }
                                        });
                                        if (r_1) {
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
                                            var z = v(item);
                                            if (typeof z === 'boolean') {
                                                if (z == false) {
                                                    r_2 = false;
                                                }
                                            }
                                            else {
                                                item = z;
                                            }
                                        });
                                        if (r_2) {
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
                                        var z = v(item);
                                        if (typeof z === 'boolean') {
                                            if (z == false) {
                                                r_3 = false;
                                            }
                                        }
                                        else {
                                            item = z;
                                        }
                                    });
                                    if (r_3) {
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
                                    var z = v(x);
                                    if (typeof z === 'boolean') {
                                        if (z == false) {
                                            r_4 = false;
                                        }
                                    }
                                    else {
                                        x = z;
                                    }
                                });
                                if (r_4) {
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
                var headers = new http.HttpHeaders();
                /** @type {?} */
                var result;
                headers.set('Access-Control-Allow-Origin', '*');
                if (ext === '.xml') {
                    headers.set('Content-Type', 'text; charset=utf-8').set('Accept', 'text');
                    result = this.http.get(url, { headers: headers, responseType: 'text' })
                        .pipe(operators.map(function (res) {
                        /** @type {?} */
                        var xml = new xmldom.DOMParser().parseFromString(res);
                        /** @type {?} */
                        var json = _this._xml2json(xml.documentElement);
                        return json;
                    }));
                }
                else if (ext === '.txt') {
                    headers.set('Content-Type', 'text; charset=utf-8').set('Accept', 'text');
                    result = this.http.get(url, { headers: headers, responseType: 'text' }).pipe(operators.map(function (res) { return res; }));
                }
                else if (ext === '.json') {
                    headers.set('Content-Type', 'json; charset=utf-8').set('Accept', 'json');
                    result = this.http.get(url, { headers: headers }).pipe(operators.map(function (res) { return res; }));
                }
                else {
                    headers.set('Content-Type', 'text; charset=utf-8').set('Accept', 'text');
                    result = this.http.get(url, { headers: headers, responseType: 'text' })
                        .pipe(operators.map(function (res) {
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
                }
                else {
                    result.push(key.key);
                }
                return result.join(',');
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
                        op[key2].push(value[key2] ? value[key2] : value);
                    }
                    else {
                        if ((op instanceof Array) === false) {
                            operation.result[path] = [op];
                            operation.result[path].push(value[key2] ? value[key2] : value);
                        }
                        else {
                            op.push(value[key2] ? value[key2] : value);
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
                        if (item instanceof Array) ;
                        else if (item[key]) {
                            result[key] = item[key];
                        }
                    });
                }
                return result;
            };
        /**
         * @param {?} promise
         * @param {?} result
         * @return {?}
         */
        WizardQueryService.prototype._triggerResult = /**
         * @param {?} promise
         * @param {?} result
         * @return {?}
         */
            function (promise, result) {
                promise.next(this._pack(result));
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
                    operation.cachedFiles[path] = new rxjs.BehaviorSubject(null);
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
                                        in: opkeyi_1.in + item,
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
                                    in: opkeyi_1.in + source,
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
                                _this._triggerResult(promise, operation.result);
                            }
                        }
                        else {
                            action.queryItems--;
                            _this._triggerResult(promise, operation.result);
                        }
                    }
                }, function (error) {
                    if (_this.logEnabled) {
                        console.log(error);
                    }
                    action.queryItems--;
                    _this._triggerResult(promise, operation.result);
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
                this.select(action.path, action.in, action.deepXml, action.handler).subscribe(function (data) {
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
                                        _this._subquery(promise, path, operation, {
                                            path: operationalKey_1.path,
                                            in: operationalKey_1.in + content,
                                            deepXml: operationalKey_1.deepXml,
                                            join: operationalKey_1.join,
                                            handler: operationalKey_1.handler,
                                            queryItems: (operationalKey_1.path instanceof Array) ? operationalKey_1.path.length : 1
                                        });
                                    });
                                }
                                else {
                                    // no more query in the chain.
                                    action.queryItems--;
                                    if (action.queryItems === 0) {
                                        /** @type {?} */
                                        var result = operation.result ? operation.result : {};
                                        _this._triggerResult(promise, Object.keys(operation.result).length ? operation.result : data);
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
                                        _this._subquery(promise, content, operation, {
                                            path: operationalKey.path,
                                            in: operationalKey.in + content,
                                            deepXml: operationalKey.deepXml,
                                            handler: operationalKey.handler,
                                            queryItems: (operationalKey.path instanceof Array) ? operationalKey.path.length : 1
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
                                            _this._triggerResult(promise, Object.keys(operation.result).length ? operation.result : data);
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
                                _this._triggerResult(promise, operation.result);
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
                        _this._triggerResult(promise, operation.result);
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
                            validated: [function (data) { return true; }]
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
                            validated: [function (data) { return true; }]
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
                                var f = 'return function (data) { \n';
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
                var operation = { cachedFiles: {}, result: {} };
                /** @type {?} */
                var dataStore = new rxjs.BehaviorSubject(null);
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
                var dataStore = new rxjs.BehaviorSubject(null);
                Object.keys(groupedList).map(function (url) {
                    _this.select(groupedList[url].path, url, groupedList[url].deepXml, clause).subscribe(function (data) {
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
                var _this = this;
                /** @type {?} */
                var dataStore = new rxjs.BehaviorSubject(null);
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
                            var y = _this._valueOfJsonPath(pathItem, data, deepXml, clause);
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
                        result = _this._valueOfJsonPath(jpath, data, deepXml, clause);
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
        WizardQueryService.decorators = [
            { type: core.Injectable }
        ];
        /** @nocollapse */
        WizardQueryService.ctorParameters = function () {
            return [
                { type: http.HttpClient }
            ];
        };
        return WizardQueryService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var WizardQueryComponent = (function () {
        function WizardQueryComponent(queryService) {
            this.queryService = queryService;
        }
        Object.defineProperty(WizardQueryComponent.prototype, "queryInfo", {
            set: /**
             * @param {?} data
             * @return {?}
             */ function (data) {
                var _this = this;
                this.query = data;
                if (this.query) {
                    this.selectedDocumentName = this.query.in.substring(this.query.in.lastIndexOf('/'));
                    this.queryService.chainSelect({
                        in: this.query.in,
                        path: ''
                    }).subscribe(function (success) {
                        if (success) {
                            _this.source = success;
                            _this.data = undefined;
                        }
                    }, function (error) {
                        _this.source = error;
                        _this.data = undefined;
                    });
                }
                else {
                    this.data = undefined;
                    this.source = undefined;
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @param {?} content
         * @return {?}
         */
        WizardQueryComponent.prototype.parseFunctions = /**
         * @param {?} content
         * @return {?}
         */
            function (content) {
                var _this = this;
                if (content instanceof Array) {
                    content.map(function (item) {
                        _this.parseFunctions(item);
                    });
                }
                else if (typeof content === 'object') {
                    Object.keys(content).map(function (key) {
                        if (key === 'handler') {
                            content[key] = new Function('return function' + content[key])();
                        }
                        else {
                            _this.parseFunctions(content[key]);
                        }
                    });
                }
            };
        /**
         * @param {?} text
         * @return {?}
         */
        WizardQueryComponent.prototype.executeQuery = /**
         * @param {?} text
         * @return {?}
         */
            function (text) {
                var _this = this;
                try {
                    /** @type {?} */
                    var content = JSON.parse(text.value);
                    this.parseFunctions(content);
                    if (content instanceof Array) {
                        this.queryService.arraySelect(content).subscribe(function (success) {
                            if (success) {
                                _this.data = success;
                            }
                        }, function (error) {
                            _this.data = { alert: error };
                        });
                    }
                    else {
                        this.queryService.chainSelect(content).subscribe(function (success) {
                            if (success) {
                                _this.data = success;
                            }
                        }, function (error) {
                            _this.data = { alert: error };
                        });
                    }
                }
                catch (err) {
                    this.data = { alert: err.message };
                }
            };
        WizardQueryComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'wizard-query',
                        template: "\n<div class=\"entry\" *ngIf=\"source\">\n  <div class=\"entry-label\">Source: {{selectedDocumentName}}</div>\n  <div class=\"entry-label\">Type or modify query</div>\n  <div class=\"entry-json\">{{ source | json }}</div>\n  <textarea #text [value]=\"query | json\" (input)=\"data = undefined\"></textarea>\n  <div class=\"submit\"><button (click)=\"executeQuery(text)\">Execute query</button></div>\n</div>\n\n<div *ngIf=\"data\" class=\"result-json\">{{ data | json }}</div>\n",
                        styles: [".result-json{border:1px solid #633;background-color:#fefefe;border-radius:5px;box-sizing:border-box;display:block;max-height:222px;min-height:222px;overflow-y:auto;position:relative;font-family:monospace;float:left;padding:5px;unicode-bidi:embed;width:100%;white-space:pre-wrap}.entry .entry-json{border:1px solid #633;background-color:#fefefe;box-sizing:border-box;display:block;max-height:222px;min-height:222px;overflow-y:auto;position:relative;font-family:monospace;float:left;padding:5px;unicode-bidi:embed;width:50%;white-space:pre-wrap;border-radius:0 0 0 5px}.entry textarea{width:50%;min-height:222px;max-height:222px;resize:none;box-sizing:border-box;padding:5px;border-radius:0 0 5px}.entry .entry-label{width:50%;font-weight:700;padding:5px;background-color:#888;color:#fff;float:left;box-sizing:border-box}.entry .submit{text-align:center;padding-bottom:5px}.entry .submit button{padding:5px 35px}"]
                    }] }
        ];
        /** @nocollapse */
        WizardQueryComponent.ctorParameters = function () {
            return [
                { type: WizardQueryService }
            ];
        };
        WizardQueryComponent.propDecorators = {
            queryInfo: [{ type: core.Input }]
        };
        return WizardQueryComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var WizardQueryDirective = (function () {
        function WizardQueryDirective(queryService) {
            this.queryService = queryService;
            this.onQueryResult = new core.EventEmitter();
            this.onQueryError = new core.EventEmitter();
        }
        Object.defineProperty(WizardQueryDirective.prototype, "wizardQuery", {
            set: /**
             * @param {?} info
             * @return {?}
             */ function (info) {
                var _this = this;
                this.query = info;
                if (this.query) {
                    if (this.query instanceof Array) {
                        this.queryService.arraySelect(this.query).subscribe(function (success) {
                            if (success) {
                                _this.onQueryResult.emit(success);
                            }
                        }, function (error) {
                            _this.onQueryResult.emit({ alert: error });
                        });
                    }
                    else {
                        this.queryService.chainSelect(this.query).subscribe(function (success) {
                            if (success) {
                                _this.onQueryResult.emit(success);
                            }
                        }, function (error) {
                            _this.onQueryResult.emit({ alert: error });
                        });
                    }
                }
                else {
                    this.onQueryResult.emit(undefined);
                }
            },
            enumerable: true,
            configurable: true
        });
        WizardQueryDirective.decorators = [
            { type: core.Directive, args: [{
                        selector: '[wizardQuery]'
                    },] }
        ];
        /** @nocollapse */
        WizardQueryDirective.ctorParameters = function () {
            return [
                { type: WizardQueryService }
            ];
        };
        WizardQueryDirective.propDecorators = {
            onQueryResult: [{ type: core.Output }],
            onQueryError: [{ type: core.Output }],
            wizardQuery: [{ type: core.Input }]
        };
        return WizardQueryDirective;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var WizardQueryModule = (function () {
        function WizardQueryModule() {
        }
        WizardQueryModule.decorators = [
            { type: core.NgModule, args: [{
                        declarations: [
                            WizardQueryComponent,
                            WizardQueryDirective
                        ],
                        exports: [
                            WizardQueryComponent,
                            WizardQueryDirective
                        ],
                        imports: [
                            common.CommonModule,
                            http.HttpClientModule
                        ],
                        providers: [
                            WizardQueryService
                        ],
                        schemas: [core.CUSTOM_ELEMENTS_SCHEMA]
                    },] }
        ];
        return WizardQueryModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    exports.WizardQueryComponent = WizardQueryComponent;
    exports.WizardQueryService = WizardQueryService;
    exports.WizardQueryModule = WizardQueryModule;
    exports.ɵa = WizardQueryDirective;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=wizard-query.umd.js.map