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
                                    if (v(x) == false) {
                                        r_1 = false;
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
                                    if (v(item) == false) {
                                        r_2 = false;
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
                                if (v(item) == false) {
                                    r_3 = false;
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
                            if (v(x) == false) {
                                r_4 = false;
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
                        filter = 'return function (data) { var x = false; try{ x = (' + filter + '); }catch(e){} return x;}';
                        object_1['validated'].push(new Function(filter)());
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
                var x = i.replace(/([\[(])(.+?)([\])])/g, function (match, p1, p2, p3, offset, s) {
                    return p1 + p2.replace(/\./g, '`') + p3;
                });
                result.push(_this._makeArguments(x));
            });
        }
        else {
            path = path ? path : '';
            /** @type {?} */
            var x = path.replace(/([\[(])(.+?)([\])])/g, function (match, p1, p2, p3, offset, s) {
                return p1 + p2.replace(/\./g, '`') + p3;
            });
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
        var dataStore = new BehaviorSubject(null);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLXF1ZXJ5LnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly93aXphcmQtcXVlcnkvIiwic291cmNlcyI6WyJzcmMvYXBwL3dpemFyZC1xdWVyeS93aXphcmQtcXVlcnkuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBcUNBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLFVBQVUsRUFBRSxXQUFXLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUU3RCxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDbkMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUNyQyxPQUFPLEtBQUssTUFBTSxNQUFNLFFBQVEsQ0FBQzs7Ozs7SUFnQjdCLDRCQUNVO1FBQUEsU0FBSSxHQUFKLElBQUk7NEJBSlEsRUFBRTswQkFDSixLQUFLO0tBTXhCOzs7Ozs7SUFRTyx1Q0FBVTs7Ozs7Y0FBQyxLQUFVLEVBQUUsT0FBZ0I7O1FBQzNDLEVBQUUsQ0FBQyxDQUFDLEtBQUssWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDOztZQUN6QixJQUFNLFFBQU0sR0FBRyxFQUFFLENBQUM7WUFDbEIsS0FBSyxDQUFDLEdBQUcsQ0FBRSxVQUFDLElBQUk7Z0JBQ1osUUFBTSxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO2FBQy9DLENBQUMsQ0FBQztZQUNILEtBQUssR0FBRyxRQUFNLENBQUM7U0FDbEI7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQzs7WUFDbkMsSUFBSSxLQUFLLEdBQVEsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUVwQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsSUFB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QztnQkFDSCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNuQyxNQUFNLEdBQUcsU0FBUyxDQUFDO2lCQUN0QjthQUNKO1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xDLE1BQU0sR0FBRyxLQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7YUFDaEU7WUFDRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNULFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7YUFFMUI7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixTQUFTLENBQUMsS0FBSyxDQUFDLHVCQUF1QixHQUFHLElBQUksQ0FBQyxDQUFDO2FBQ25EO1NBQ0osRUFDRCxVQUFDLEtBQVU7WUFDUCxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzFCLENBQ0osQ0FBQztRQUNGLE1BQU0sQ0FBQyxTQUFTLENBQUM7S0FDcEI7O2dCQXB3QkosVUFBVTs7OztnQkFkSCxVQUFVOzs2QkF0Q2xCOztTQXFEYSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuKiBRdWVyeSBzZXJ2aWNlIHByb3ZpZGVzIGEgd2F5IHRvIHF1ZXJ5IGEgcmVtb3RlIEpTT04gb3IgWE1MIGZpbGUuIEl0IGNhbiBiZSB1c2VkIGluIGZvbGxvd2luZyB3YXlzLlxuKlxuKiAxKSBXaXRoIHNlbGVjdCgpIG1ldGhvZCwgYSBzaW5nbGUgcGF0aCBvciBhIGxpc3Qgb2YgcGF0aHMgY2FuIGJlIGdpdmVuLiBlYWNoIHBhdGggd2lsbCBiZSBhIGpzb24gcXVhbGlmeWluZ1xuKiBwYXRoIHRvIGFuIGVuZCBub2RlIChpLmUuLCAnYm9va3MuYm9vay50aXRsZScpLiBJZiBtdWx0aXBsZSBwYXRocyBhcmUgc3VwcGxpZWQsIHF1ZXJ5IHJlc3VsdCB3aWxsIGJlIGEganNvblxuKiBvYmplY3Qgd2hlcmUgZWFjaCBhdHRyaWJ1dGUgd2lsbCBiZSBhIGdpdmVuIHF1ZXJ5IHBhdGggYW5kIGl0cyB2YWx1ZSB3aWxsIGJlIHF1ZXJ5IHJlc3VsdCBmb3IgdGhhdCBwYXRoLlxuKiBGb3IgZXhhbXBsZTpcbiogc2VsZWN0KFsnYm9va3MuYm9vay50aXRsZScsICdib29rcy5ib29rLmF1dGhvciddLCAnL2V4YW1wbGUxLnhtbCcsIGZhbHNlKVxuKiB3aWxsIHJlc3VsdCBpbiB7J2Jvb2tzLmJvb2sudGl0bGUnOiBbXSwgJ2Jvb2tzLmJvb2suYXV0aG9yJzogW119LlxuKiBFYWNoIHJlc3VsdCB3aWxsIG5vdCBjby1yZWxhdGVkIHdpdGggb3RoZXIgcmVzdWx0IGluIG9yZGVyIG9yIGluIGFueSBvdGhlciBmb3JtLiBpZiBhIGNsYXVzZSBhcmd1bWVudCBpc1xuKiBzdXBwbGllZCwgaXQgd2lsbCBiZSBpbnZva2VkIHRvIGZ1cnRoZXIgYXNzaXN0IGluIGZpbHRlcmluZyB0aGUgcXVlcnkgcmVzdWx0LiBmb3IgZXhhbXBsZSBpZiBjZXJ0YWluIGNhdGVnb3J5XG4qIG9mIGJvb2tzIGFyZSByZXF1aXJlZCwgdGhlIGNsYXVzZSBmdW5jdGlvbiBjYW4gbG9vayBmb3IgYSBib29rIGNhdGVnb3J5IGF0dHJpYnV0ZSBhbmQgcmV0dXJuIHRoZSBxdWVyeSByZXN1bHRcbiogaWYgYWNjZXB0YWJsZSBvciB1bmRlZmluZWQgaWYgcmVzdWx0IHNob3VsZCBiZSBmaWx0ZXJlZCBvdXQgb2YgdGhlIHJlc3VsdC5cbipcbiogMikgV2l0aCBhcnJheVNlbGVjdCgpIG1ldGhvZCwgYW4gYXJyYXkgb2Yge3BhdGg6ICcnLCBpbjonJywgZGVlcFhtbDogdHJ1ZX0gY2FuIGJlIHN1cHBsaWVkLCBlYWNoIGVudHJ5IHdpbGwgYmUgZXZhbHVhdGVkXG4qIGFzIGlmIHNlbGVjdCgpIG1ldGhvZCBpcyBpbnZva2VkLiBCdXQgZmlyc3QsIHJlcXVlc3RzIHdpdGggc2ltaWxhciBwYXRocyB3aWxsIGJlIG1lcmdlZCBpbnRvIG9uZSBjYWxsLiAgVGhpc1xuKiBtZXRob2QgaXMgdXNlZnVsIHdoZW4gcGF0aHMgYXJlIGR5bmFtaWNseSBnaXZlbiBhbmQgaXQgaXMgbm90IGNsZWFyIGluIGFkdmFuY2UgaWYgdGhlcmUgYXJlIHJlcXVlc3RzIHdpdGhcbiogc2ltaWxhciBwYXRocy4gZGVlcFhtbCBhdHRyaWJ1dGUgaXMgb3B0aW9uYWwuXG4qXG4qIDMpIFdpdGggY2hhaW5TZWxlY3QoKSBtZXRob2QsIGEgY2hhaW5lZCBzZXQgb2Yge3BhdGg6ICcnLCBpbjogJycsIGRlZXBYbWw6IHRydWV9IGlzIGdpdmVuIGluIGEganNvbiBvYmplY3QuIFdoZW4gcmVzdWx0IG9mXG4qIGEgcXVlcnkgYmVjb21lcyBhdmFpbGFibGUsIHRoZSByZXF1ZXN0IGpzb24gd2lsbCBiZSBleGFtaW5lZCB0byBzZWUgaWYgYSByZXF1ZXN0IGZvciB0aGUga2V5IGlzIGF2YWlsYWJsZS4gSWZcbiogc28sIHRoZW4gdGhlICdpbicgZm9yIHRoZSBwYXRoIHdpbGwgYmUgcHJlcGVuZGVkIHRvIHRoZSByZXN1bHRpbmcgdmFsdWUgb2YgdGhlIHByZXZpb3VzIHF1ZXJ5LiAsIGRlZXBYbWwgYXR0cmlidXRlIGlzIFxuKiBvcHRpb25hbC4gVGhpcyBtZXRob2QgaXMgdXNlZnVsIHdoZW4gcmVzdWx0IG9mIGEgcXVlcnkgaXMgYSBqc29uIG9yIGFuIHhtbCBmaWxlIGFuZCBhZGRpdGlvbmFsIHF1ZXJ5IGlzIG5lZWRlZCBcbiogZnVydGhlciBkb3duIGluIHRoZSBwcmVjZWVkaW5nIGZpbGVzLiBGb3IgZXhhbXBsZSB0aGUgYXNzdW1wdGlvbiBpbiB0aGUgZm9sbG93aW5nIGNhbGwgaXMgdGhhdCBlYWNoIGJvb2tzLmJvb2sgXG4qIHJlc3VsdCB3aWxsIGJlIGEgZmlsZSBuYW1lIGFuZCB0aGUgZmlsZSBwYXRoIGZvciBlYWNoIHJlc3VsdCBpcyAnL3NhbXBsZXMvYm9va3MvJy5cbiogY2hhaW5TZWxlY3Qoe1xuKiAgIHBhdGg6ICdib29rcy5ib29rJyxcbiogICBpbjogJ3NhbXBsZTEueG1sJyxcbiogICBkZWVwWG1sOiB0cnVlLFxuKiAgICdib29rcy5ib29rJzoge1xuKiAgICAgICBpbjogJy9zYW1wbGVzL2Jvb2tzLycsXG4qICAgICAgIHBhdGg6IFsncHVibGljYXRpb24udGl0bGUnLCAncHVibGljYXRpb24uYXV0aG9yJ10sXG4qICAgICAgIGhhbmRsZXI6IHRoaXMuYnVibGljYXRpb25IYW5kbGVyXG4qICAgfSlcbiogaWYgYSBoYW5kbGVyIGlzIHN1cHBsaWVkLCBpdCB3aWxsIGJlIHVzZWQgdG8gZmlsdGVyIG91dCBhbnkgcmVzdWx0IHRoYXQgaXMgbm90IGFjY2VwdGFibGUuXG4qXG4qL1xuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7SHR0cENsaWVudCwgSHR0cEhlYWRlcnN9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcblxuaW1wb3J0IHttYXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7QmVoYXZpb3JTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCAqIGFzIHhtbGRvbSBmcm9tICd4bWxkb20nO1xuXG4vKlxuKiBAcGFyYW0gbm9kZSBUaGUgcGFyZW50IG5vZGUuIGl0IGNhbiBiZSB1c2VkIHRvIGV2YWx1YXRlIGJhc2VkIG9uIG90aGVyIGF0dHJpYnV0ZXMgaW4gdGhlIG5vZGUuXG4qIEBwYXJhbSBwYXRoIGF0dHJpYnV0ZSB0byBiZSBleGFtaW5lZC5cbiogQHBhcmFtIHZhbHVlIHRoZSB2YWx1ZSBvZiB0aGUgcGF0aC4gaXQgY291bGQgYmUgdW5kZWZpbmVkLCBhIGxpdGVyYWwsIG9yIGEgbGlzdC5cbiogQHJldHVybnMgcmV0dXJucyB0aGUgdmFsdWUgb3IgZmlsdGVyZWQgdmVyc2lvbiBvZiB0aGUgdmFsdWUgb3IgdW5kZWZpbmVkIG90aGVyd2lzZS5cbiovXG5leHBvcnQgdHlwZSBjbGF1c2VFdmFsdWF0b3IgPSAobm9kZTogYW55LCBwYXRoOiBzdHJpbmcsIHZhbHVlOiBhbnkpID0+IGFueTtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFdpemFyZFF1ZXJ5U2VydmljZSB7XG5cbiAgICBwdWJsaWMgU0VSVklDRV9QQVRIID0gJyc7XG4gICAgcHVibGljIGxvZ0VuYWJsZWQgPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50XG4gICAgKSB7XG5cbiAgICB9XG5cbiAgICAvKlxuICAgICogV2lsbCBub3JtYWxpemUgdGhlIGdpdmVuIHhtbCBvdXQgb2YgYWRkaXRpb25hbCAjdGV4dCBvciAjY2RhdGEtc2VjdGlvbiBub2Rlcy5cbiAgICAqIEBwYXJhbSB2YWx1ZSB0aGUgeG1sIHRvIGJlIG5vcm1haWx6ZWQuXG4gICAgKiBAcGFyYW0gZGVlcFhtbCBpZiBjZGF0YS1zZWN0aW9uIHNob3VsZCBiZSBwYXJzZWQuXG4gICAgKiBAcmV0dXJuIG5vcm1hbGl6ZWQgeG1sLlxuICAgICovXG4gICAgcHJpdmF0ZSBfbm9ybWFsaXplKHZhbHVlOiBhbnksIGRlZXBYbWw6IGJvb2xlYW4pIHtcbiAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgICAgICAgICAgdmFsdWUubWFwKCAoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXMuX25vcm1hbGl6ZShpdGVtLCBkZWVwWG1sKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhbHVlID0gcmVzdWx0O1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGxldCBpdGVtczogYW55ID0gT2JqZWN0LmtleXModmFsdWUpO1xuXG4gICAgICAgICAgICBpZiAoaXRlbXMubGVuZ3RoID09PSAxICYmICEodmFsdWVbaXRlbXNbMF1dIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlWycjdGV4dCddKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWVbJyN0ZXh0J107XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZVsnI2NkYXRhLXNlY3Rpb24nXSkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlWycjY2RhdGEtc2VjdGlvbiddO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGVlcFhtbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB4bWwgPSBuZXcgeG1sZG9tLkRPTVBhcnNlcigpLnBhcnNlRnJvbVN0cmluZyh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSAoeG1sLmRvY3VtZW50RWxlbWVudCAmJiB4bWwuZG9jdW1lbnRFbGVtZW50ICE9IG51bGwpID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl94bWwyanNvbih4bWwuZG9jdW1lbnRFbGVtZW50KSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9Y2F0Y2goZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgICAgICAgICAgICAgIGl0ZW1zLm1hcCggKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2l0ZW1dID0gdGhpcy5fbm9ybWFsaXplKHZhbHVlW2l0ZW1dLCBkZWVwWG1sKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgLypcbiAgICAqIEBwYXJhbSBwYXRoIEpTT04gcGF0aCB0byBldmFsdWF0ZS4gQSBwYXRoIGNvdWxkIGJlIGZ1bGx5IHF1YWxpZmllZCBmb3IgZGVwdGggb2YganNvbiAoaS5lLiwgJ2EuYi5jJylcbiAgICAqIEBwYXJhbSBkYXRhIHRoZSBkYXRhIHNvdXJjZS5cbiAgICAqIEBwYXJhbSBkZWVwWG1sIGlmIGNkYXRhLXNlY3Rpb24gc2hvdWxkIGJlIHBhcnNlZC5cbiAgICAqIEBwYXJhbSBjbGF1c2UgQSBtZXRob2QgYnkgd2hpY2ggdmFsdWUocykgZm9yIHRoZSBrZXkocykgY291bGQgYmUgZXZhbHVhdGVkLiB0aGUgY2FsbGVyIHdvdWxkIGV2YWx1YXRlIHRoZSB2YWx1ZSBmb3IgYSBnaXZlbiBhdHRyaWJ1dGUuXG4gICAgKiBAcmV0dXJucyByZXR1cm5zIGV2bHVhdGVkIHZhbHVlIGZvciB0aGUga2V5IGluIGRhdGEgc291cmNlLlxuICAgICovXG4gICAgcHJpdmF0ZSBfdmFsdWVPZkpzb25QYXRoKFxuICAgICAgICBwYXRoOiBhbnksXG4gICAgICAgIGRhdGE6IGFueSxcbiAgICAgICAgZGVlcFhtbDogYm9vbGVhbixcbiAgICAgICAgY2xhdXNlPzogY2xhdXNlRXZhbHVhdG9yKTogYW55IHtcblxuICAgICAgICBsZXQgcmVzdWx0OiBhbnk7XG4gICAgICAgIGxldCB4ID0gdGhpcy5fbm9ybWFsaXplKGRhdGEsIGRlZXBYbWwpO1xuICAgICAgICBwYXRoLm1hcCggKHN1YmtleTogYW55KSA9PiB7XG4gICAgICAgICAgICBsZXQgbm9kZSA9IHg7XG4gICAgICAgICAgICBpZiAobm9kZSAmJiBub2RlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0ID0gW107XG4gICAgICAgICAgICAgICAgaWYgKHN1YmtleS5zb3J0KSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUgPSBzdWJrZXkuc29ydChub2RlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbm9kZS5tYXAgKFxuICAgICAgICAgICAgICAgICAgICAoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpdGVtID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdWJrZXkua2V5Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4ID0gc3Via2V5LmtleS5sZW5ndGggPyBpdGVtW3N1YmtleS5rZXldIDogaXRlbTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHggJiYgc3Via2V5LnZhbGlkYXRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Via2V5LnZhbGlkYXRlZC5tYXAodiA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodih4KSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQucHVzaCh4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdWJrZXkudmFsaWRhdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJrZXkudmFsaWRhdGVkLm1hcCh2ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih2KGl0ZW0pID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdC5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdC5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdWJrZXkua2V5Lmxlbmd0aCAmJiAodHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uc3BsaXQoJy4nKS5tYXAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChzdHIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdHIuaW5kZXhPZihzdWJrZXkua2V5KSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdC5wdXNoKHN0cik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHggPSB0O1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHg7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5vZGUgJiYgKHR5cGVvZiBub2RlID09PSAnb2JqZWN0JykpIHtcbiAgICAgICAgICAgICAgICB4ID0geCA/XG4gICAgICAgICAgICAgICAgICAgIGNsYXVzZShub2RlLCBzdWJrZXkua2V5LCBzdWJrZXkua2V5Lmxlbmd0aCA/IHhbc3Via2V5LmtleV06ICB4KSA6XG4gICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBpZiAoeCAmJiB4IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3Via2V5LnNvcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHggPSBzdWJrZXkuc29ydCh4KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB4Lm1hcChcbiAgICAgICAgICAgICAgICAgICAgICAgIChpdGVtOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3Via2V5LnZhbGlkYXRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YmtleS52YWxpZGF0ZWQubWFwKHYgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodihpdGVtKSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0LnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB4ID0gdDtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0geDtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN1YmtleS52YWxpZGF0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YmtleS52YWxpZGF0ZWQubWFwKHYgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHYoeCkgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB4O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0geDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAobm9kZSAmJiAodHlwZW9mIG5vZGUgPT09ICdzdHJpbmcnKSAmJiBzdWJrZXkua2V5Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IFtdO1xuICAgICAgICAgICAgICAgIG5vZGUuc3BsaXQoJy4nKS5tYXAoXG4gICAgICAgICAgICAgICAgICAgIChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5pbmRleE9mKHN1YmtleS5rZXkpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gbm9kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZ2V0KHBhdGg6IHN0cmluZykge1xuICAgICAgICBjb25zdCB1cmwgPSB0aGlzLlNFUlZJQ0VfUEFUSCArIHBhdGg7XG4gICAgICAgIGNvbnN0IGRvdCA9IHBhdGgubGFzdEluZGV4T2YoJy4nKTtcbiAgICAgICAgY29uc3QgZXh0ID0gZG90IDwgMCA/IHVuZGVmaW5lZCA6IHBhdGgudG9Mb3dlckNhc2UoKS5zdWJzdHIoZG90KTtcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycygpO1xuICAgICAgICBsZXQgcmVzdWx0OiBhbnk7XG5cbiAgICAgICAgaGVhZGVycy5zZXQoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbicsICcqJyk7XG5cbiAgICAgICAgaWYgKGV4dCA9PT0gJy54bWwnKSB7XG4gICAgICAgICAgICBoZWFkZXJzLnNldCgnQ29udGVudC1UeXBlJywgJ3RleHQ7IGNoYXJzZXQ9dXRmLTgnKS5zZXQoJ0FjY2VwdCcsICd0ZXh0Jyk7XG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLmh0dHAuZ2V0KHVybCwgeyBoZWFkZXJzLCByZXNwb25zZVR5cGU6ICd0ZXh0JyB9KVxuICAgICAgICAgICAgICAgIC5waXBlKG1hcCgocmVzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHhtbCA9IG5ldyB4bWxkb20uRE9NUGFyc2VyKCkucGFyc2VGcm9tU3RyaW5nKHJlcyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGpzb24gPSB0aGlzLl94bWwyanNvbih4bWwuZG9jdW1lbnRFbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGpzb247XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXh0ID09PSAnLnR4dCcpIHtcbiAgICAgICAgICAgIGhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCAndGV4dDsgY2hhcnNldD11dGYtOCcpLnNldCgnQWNjZXB0JywgJ3RleHQnKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5nZXQodXJsLCB7IGhlYWRlcnMsIHJlc3BvbnNlVHlwZTogJ3RleHQnIH0pLnBpcGUobWFwKChyZXMpID0+IHJlcykpO1xuICAgICAgICB9IGVsc2UgaWYgKGV4dCA9PT0gJy5qc29uJyl7XG4gICAgICAgICAgICBoZWFkZXJzLnNldCgnQ29udGVudC1UeXBlJywgJ2pzb247IGNoYXJzZXQ9dXRmLTgnKS5zZXQoJ0FjY2VwdCcsICdqc29uJyk7XG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLmh0dHAuZ2V0KHVybCwge2hlYWRlcnN9KS5waXBlKG1hcCgocmVzKSA9PiByZXMpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCAndGV4dDsgY2hhcnNldD11dGYtOCcpLnNldCgnQWNjZXB0JywgJ3RleHQnKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5nZXQodXJsLCB7IGhlYWRlcnMsIHJlc3BvbnNlVHlwZTogJ3RleHQnIH0pXG4gICAgICAgICAgICAgICAgLnBpcGUobWFwKChyZXMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhcnNlZDogYW55O1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VkID0gSlNPTi5wYXJzZShyZXMpO1xuICAgICAgICAgICAgICAgICAgICB9Y2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeG1sID0gbmV3IHhtbGRvbS5ET01QYXJzZXIoKS5wYXJzZUZyb21TdHJpbmcocmVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZWQgPSB0aGlzLl94bWwyanNvbih4bWwuZG9jdW1lbnRFbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VkID0gcmVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VkID8gcGFyc2VkIDogcmVzO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfc3RyaW5nVmFsdWVPZktleShrZXk6IGFueSkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcblxuICAgICAgICBpZiAoa2V5IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIGtleS5tYXAoIFxuICAgICAgICAgICAgICAgIChpdGVtOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHggPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ubWFwKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChzdWJpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdWJpdGVtLmtleS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHgucHVzaChzdWJpdGVtLmtleSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh4LmpvaW4oJy4nKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpID0gaXRlbS5pbmRleE9mKCdbJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBqID0gaXRlbS5pbmRleE9mKCddJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBrID0gaXRlbS5sZW5ndGggPiAoaiArIDEpID8gMiA6IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChpID4gMCA/IGl0ZW0uc3Vic3RyaW5nKDAsaSkgOiBqID4gMCA/IGl0ZW0uc3Vic3RyaW5nKGogKyBrKSA6IGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0ua2V5Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goaXRlbS5rZXkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goa2V5LmtleSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0LmpvaW4oJywnKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9hZGRUb1Jlc3VsdCh2YWx1ZTogYW55LCBrZXk6IHN0cmluZywgb3BlcmF0aW9uOiBhbnksIGFjdGlvbjogYW55KSB7XG4gICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLl9zdHJpbmdWYWx1ZU9mS2V5KGFjdGlvbi5wYXRoKTtcbiAgICAgICAgY29uc3Qga2V5MiA9IHRoaXMuX3N0cmluZ1ZhbHVlT2ZLZXkoa2V5KTtcbiAgICAgICAgbGV0IG9wID0gb3BlcmF0aW9uLnJlc3VsdFtwYXRoXTtcbiAgICAgICAgbGV0IGNvbXBsZXRlID0gZmFsc2U7XG4gICAgXG4gICAgICAgIGlmICghb3ApIHtcbiAgICAgICAgICAgIG9wZXJhdGlvbi5yZXN1bHRbcGF0aF0gPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3ApIHtcbiAgICAgICAgICAgIGxldCBvcGsgPSBvcFtrZXkyXTtcbiAgICAgICAgICAgIGlmIChvcGVyYXRpb25bJ3RlbXAnXSAmJlxuICAgICAgICAgICAgICAgIG9wZXJhdGlvblsndGVtcCddW2tleTJdKSB7XG4gICAgICAgICAgICAgICAgb3Bba2V5Ml0gPSBbb3Bba2V5Ml1dO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBvcGVyYXRpb25bJ3RlbXAnXTtcbiAgICAgICAgICAgIH1lbHNlIGlmIChvcGsgJiYgKG9wayBpbnN0YW5jZW9mIEFycmF5KSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb24ucmVzdWx0W3BhdGhdW2tleTJdID0gW29wa11cbiAgICAgICAgICAgICAgICBvcCA9IG9wZXJhdGlvbi5yZXN1bHRbcGF0aF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YWx1ZSA9IHRoaXMuX25vcm1hbGl6ZSh2YWx1ZSwgYWN0aW9uLmRlZXBYbWwpO1xuICAgICAgICAgICAgaWYgKG9wW2tleTJdKSB7XG4gICAgICAgICAgICAgICAgb3Bba2V5Ml0ucHVzaCggdmFsdWVba2V5Ml0gPyB2YWx1ZVtrZXkyXSA6IHZhbHVlICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICgob3AgaW5zdGFuY2VvZiBBcnJheSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5yZXN1bHRbcGF0aF0gPSBbb3BdO1xuICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb24ucmVzdWx0W3BhdGhdLnB1c2goIHZhbHVlW2tleTJdID8gdmFsdWVba2V5Ml0gOiB2YWx1ZSApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG9wLnB1c2goIHZhbHVlW2tleTJdID8gdmFsdWVba2V5Ml0gOiB2YWx1ZSApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgYWxyZWFkeSBhbiBhcnJheSByZW1lbWJlciBpdC5cbiAgICAgICAgICAgICAgICBpZiAoIW9wZXJhdGlvblsndGVtcCddKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvblsndGVtcCddID0ge307XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghb3BlcmF0aW9uWyd0ZW1wJ11ba2V5Ml0pIHtcbiAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uWyd0ZW1wJ11ba2V5Ml0gPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wZXJhdGlvbi5yZXN1bHRbcGF0aF1ba2V5Ml0gPSB0aGlzLl9ub3JtYWxpemUodmFsdWUsIGFjdGlvbi5kZWVwWG1sKTtcbiAgICAgICAgICAgIGNvbXBsZXRlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29tcGxldGU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfcGFjayhyZXN1bHQ6IGFueSkge1xuICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIGNvbnN0IGxpc3QgPSBbXTtcbiAgICAgICAgICAgIHJlc3VsdC5tYXAoXG4gICAgICAgICAgICAgICAgKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKHRoaXMuX3BhY2soaXRlbSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXN1bHQgPSBsaXN0O1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiByZXN1bHQgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMocmVzdWx0KTtcbiAgICAgICAgICAgIGtleXMubWFwIChcbiAgICAgICAgICAgICAgICAoa2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSByZXN1bHRba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBBcnJheSkge1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbVtrZXldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IGl0ZW1ba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHByaXZhdGUgX3RyaWdnZXJSZXN1bHQocHJvbWlzZTogYW55LCByZXN1bHQ6IGFueSkge1xuICAgICAgICBwcm9taXNlLm5leHQodGhpcy5fcGFjayhyZXN1bHQpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9zdWJxdWVyeShcbiAgICAgICAgcHJvbWlzZTogYW55LFxuICAgICAgICBwYXRoOiBhbnksXG4gICAgICAgIG9wZXJhdGlvbjogYW55LFxuICAgICAgICBhY3Rpb246IGFueSkge1xuXG4gICAgICAgIGlmIChvcGVyYXRpb24uY2FjaGVkRmlsZXNbcGF0aF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gb25lIG9mIHRoZSBrZXlzIGF0IHRoaXMgbGV2ZWwgY291bGQgYmUgcmVmZXJlbmNpbmcgdGhlIHNhbWUgZmlsZSB3aGljaFxuICAgICAgICAgICAgLy8gaXMgbm90IHlldCBmZXRjaGVkLiBuZWVkIHRvIHdhaXQgdGlsbCBpdCBpcyBhdmFpbGFibGUuXG4gICAgICAgICAgICBvcGVyYXRpb24uY2FjaGVkRmlsZXNbcGF0aF0gPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGFueT4obnVsbCk7XG4gICAgICAgICAgICB0aGlzLl9xdWVyeUl0ZXJhdGlvbihcbiAgICAgICAgICAgICAgICBvcGVyYXRpb24uY2FjaGVkRmlsZXNbcGF0aF0sXG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcGF0aDogYWN0aW9uLnBhdGgsXG4gICAgICAgICAgICAgICAgICAgIGluOiBhY3Rpb24uaW4sXG4gICAgICAgICAgICAgICAgICAgIGRlZXBYbWw6IGFjdGlvbi5kZWVwWG1sLFxuICAgICAgICAgICAgICAgICAgICBqb2luOiBhY3Rpb24uam9pbixcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlcjogYWN0aW9uLmhhbmRsZXIsXG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5SXRlbXM6IChhY3Rpb24ucGF0aCBpbnN0YW5jZW9mIEFycmF5KSA/IGFjdGlvbi5wYXRoLmxlbmd0aCA6IDFcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHBhdGhcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB3YWl0IGZvciByZXN1bHQgcmFpc2VkIGFib3ZlLlxuICAgICAgICBvcGVyYXRpb24uY2FjaGVkRmlsZXNbcGF0aF0uc3Vic2NyaWJlKFxuICAgICAgICAgICAgKHNvdXJjZTogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHNvdXJjZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvcGtleWkgPSBhY3Rpb24uam9pbiA/IGFjdGlvbi5qb2luW2FjdGlvbi5wYXRoXSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wa2V5aSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNvdXJjZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlLm1hcChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N1YnF1ZXJ5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBvcGtleWkucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW46IG9wa2V5aS5pbiArIGl0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZXBYbWw6IG9wa2V5aS5kZWVwWG1sLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqb2luOiBvcGtleWkuam9pbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlcjogb3BrZXlpLmhhbmRsZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5SXRlbXM6IChvcGtleWkucGF0aCBpbnN0YW5jZW9mIEFycmF5KSA/IG9wa2V5aS5wYXRoLmxlbmd0aCA6IDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdWJxdWVyeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IGFjdGlvbi5qb2luW29wa2V5aS5wYXRoXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluOiBvcGtleWkuaW4gKyBzb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWVwWG1sOiBhY3Rpb24uZGVlcFhtbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpvaW46IG9wa2V5aS5qb2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlcjogb3BrZXlpLmhhbmRsZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWVyeUl0ZW1zOiAob3BrZXlpLnBhdGggaW5zdGFuY2VvZiBBcnJheSkgPyBvcGtleWkucGF0aC5sZW5ndGggOiAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2FkZFRvUmVzdWx0KHNvdXJjZSwgYWN0aW9uLnBhdGgsIG9wZXJhdGlvbiwgYWN0aW9uKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uLnF1ZXJ5SXRlbXMtLTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhY3Rpb24ucXVlcnlJdGVtcyA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3RyaWdnZXJSZXN1bHQocHJvbWlzZSwgb3BlcmF0aW9uLnJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbi5xdWVyeUl0ZW1zLS07XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl90cmlnZ2VyUmVzdWx0KHByb21pc2UsIG9wZXJhdGlvbi5yZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIChlcnJvcjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubG9nRW5hYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFjdGlvbi5xdWVyeUl0ZW1zLS07XG4gICAgICAgICAgICAgICAgdGhpcy5fdHJpZ2dlclJlc3VsdChwcm9taXNlLCBvcGVyYXRpb24ucmVzdWx0KTtcbiAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cbiAgICAvKlxuICAgICogSXRlcmF0ZXMgdGhyb3VnaCBhIGNoYWluIHF1ZXJ5LlxuICAgICogQHBhcmFtIHByb21pc2UgVGhlIHByb21pc2Ugd2hpY2ggb3JpZ2luYWwgY2FsbGVyIGlzIHdhaXRpbmcgZm9yLlxuICAgICogQHBhcmFtIG9wZXJhdGlvbiBkYXRhIGZvciBrZWVwaW5nIHRyYWNrIG9mIHRoZSBpdGVyYXRpb24uXG4gICAgKiBAcGFyYW0gYWN0aW9uIGNvbnRhaW5zOiB7cGF0aDogY3VycmVudCBrZXlzIHRvIHF1ZXJ5IGZvciwgaW46IGN1cnJlbnQgcXVlcnkgcGF0aCwgaGFuZGxlcjogcmVzb2x2ZXIgbWV0aG9kfS5cbiAgICAqIEBwYXJhbSBjYWNoZU5hbWVkIFRoZSBjYWNoZWQgbmFtZSBmcm9tIHByZXZpb3VzIGl0ZXJhdGlvbiBpZiBhbnkuXG4gICAgKiBAcmV0dXJucyByZXR1cm5zIG5vbmUuXG4gICAgKi9cbiAgICBwcml2YXRlIF9xdWVyeUl0ZXJhdGlvbihcbiAgICAgICAgcHJvbWlzZTogQmVoYXZpb3JTdWJqZWN0PGFueT4sXG4gICAgICAgIG9wZXJhdGlvbjogYW55LFxuICAgICAgICBhY3Rpb246IGFueSxcbiAgICAgICAgY2FjaGVOYW1lZD86IHN0cmluZykge1xuXG4gICAgICAgIGlmICghYWN0aW9uLmhhbmRsZXIpIHtcbiAgICAgICAgICAgIGFjdGlvbi5oYW5kbGVyID0gKG5vZGU6IGFueSwgcGF0aDogc3RyaW5nLCB2YWx1ZTogYW55KSA9PiB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNlbGVjdChhY3Rpb24ucGF0aCwgYWN0aW9uLmluLCBhY3Rpb24uZGVlcFhtbCwgYWN0aW9uLmhhbmRsZXIpLnN1YnNjcmliZShcbiAgICAgICAgICAgIChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhY2hlTmFtZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlc3VsdCBvZiBuLXRoIGxldmVsIGNhbGwgdG8gYmUgcGxhY2VkIG9uIHByZXZpb3VzIGxldmVsIGNhY2hlIHJlZmVyZW5jZS5cbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5jYWNoZWRGaWxlc1tjYWNoZU5hbWVkXS5uZXh0KGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9wZXJhdGlvbmFsS2V5ID0gYWN0aW9uLmpvaW4gPyBhY3Rpb24uam9pblthY3Rpb24ucGF0aF0gOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wZXJhdGlvbmFsS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFzc3VtcHRpb24gaXMgdGhlIHJlc3VsdGluZyBsaXN0IGlzIGEgbGlzdCBvZiBmaWxlIHBhdGhzLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLm1hcCggKGNvbnRlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhdGggPSBjb250ZW50WycjdGV4dCddID8gY29udGVudFsnI3RleHQnXSA6IGNvbnRlbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdWJxdWVyeShwcm9taXNlLCBwYXRoLCBvcGVyYXRpb24sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBvcGVyYXRpb25hbEtleS5wYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluOiBvcGVyYXRpb25hbEtleS5pbiArIGNvbnRlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVlcFhtbDogb3BlcmF0aW9uYWxLZXkuZGVlcFhtbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqb2luOiBvcGVyYXRpb25hbEtleS5qb2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXI6IG9wZXJhdGlvbmFsS2V5LmhhbmRsZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnlJdGVtczogKG9wZXJhdGlvbmFsS2V5LnBhdGggaW5zdGFuY2VvZiBBcnJheSkgPyBvcGVyYXRpb25hbEtleS5wYXRoLmxlbmd0aCA6IDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBubyBtb3JlIHF1ZXJ5IGluIHRoZSBjaGFpbi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uLnF1ZXJ5SXRlbXMtLTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGlvbi5xdWVyeUl0ZW1zID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPW9wZXJhdGlvbi5yZXN1bHQgPyBvcGVyYXRpb24ucmVzdWx0IDoge307XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl90cmlnZ2VyUmVzdWx0KHByb21pc2UsIE9iamVjdC5rZXlzKG9wZXJhdGlvbi5yZXN1bHQpLmxlbmd0aCA/IG9wZXJhdGlvbi5yZXN1bHQgOiBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGRhdGEgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoZGF0YSkubWFwKCAoa2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBkYXRhW2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9wZXJhdGlvbmFsS2V5ID0gYWN0aW9uLmpvaW4gPyBhY3Rpb24uam9pbltrZXldOiB1bmRlZmluZWQ7XG4gICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb250ZW50ICYmIGNvbnRlbnQubGVuZ3RoICYmIG9wZXJhdGlvbmFsS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdWJxdWVyeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogb3BlcmF0aW9uYWxLZXkucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW46IG9wZXJhdGlvbmFsS2V5LmluICsgY29udGVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVlcFhtbDogb3BlcmF0aW9uYWxLZXkuZGVlcFhtbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlcjogb3BlcmF0aW9uYWxLZXkuaGFuZGxlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnlJdGVtczogKG9wZXJhdGlvbmFsS2V5LnBhdGggaW5zdGFuY2VvZiBBcnJheSkgPyBvcGVyYXRpb25hbEtleS5wYXRoLmxlbmd0aCA6IDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uLnF1ZXJ5SXRlbXMtLTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb250ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFvcGVyYXRpb24ucmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5yZXN1bHQgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wZXJhdGlvbi5yZXN1bHQgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb24ucmVzdWx0LnB1c2goY29udGVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLnJlc3VsdFtrZXldID0gY29udGVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aW9uLnF1ZXJ5SXRlbXMgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl90cmlnZ2VyUmVzdWx0KHByb21pc2UsIE9iamVjdC5rZXlzKG9wZXJhdGlvbi5yZXN1bHQpLmxlbmd0aCA/IG9wZXJhdGlvbi5yZXN1bHQgOiBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb24ucXVlcnlJdGVtcy0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhY3Rpb24ucXVlcnlJdGVtcyA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMob3BlcmF0aW9uLnJlc3VsdCkubGVuZ3RoID09PSAwICYmIGRhdGEgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLnJlc3VsdCA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdHJpZ2dlclJlc3VsdChwcm9taXNlLCBvcGVyYXRpb24ucmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAoZXJyb3I6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIHByb21pc2UuZXJyb3Ioe1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnZmFpbGVkIHRvIHF1ZXJ5ICcgKyBhY3Rpb24ucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgcmVhc29uOiBlcnJvci5tZXNzYWdlID8gZXJyb3IubWVzc2FnZSA6IGVycm9yXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgYWN0aW9uLnF1ZXJ5SXRlbXMtLTtcbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uLnF1ZXJ5SXRlbXMgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdHJpZ2dlclJlc3VsdChwcm9taXNlLCBvcGVyYXRpb24ucmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfbWFrZUFyZ3VtZW50cyhrZXk6IHN0cmluZykge1xuICAgICAgICBjb25zdCBsaXN0ID0ga2V5LnNwbGl0KCcuJyk7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgICAgICBsaXN0Lm1hcCggKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGIgPSBpdGVtLmluZGV4T2YoJ1snKTtcbiAgICAgICAgICAgIGlmIChiIDwgMCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiBpdGVtLFxuICAgICAgICAgICAgICAgICAgICB2YWxpZGF0ZWQ6IFsoZGF0YSkgPT4gdHJ1ZV1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IHN0ciA9IGl0ZW0uc3Vic3RyaW5nKGIgKyAxLCBpdGVtLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHZMaXN0ID0gc3RyLnNwbGl0KCddWycpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG9iamVjdCA9IHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiBpdGVtLnN1YnN0cmluZygwLGIpLFxuICAgICAgICAgICAgICAgICAgICB2YWxpZGF0ZWQ6IFsoZGF0YSkgPT4gdHJ1ZV1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHZMaXN0Lm1hcCggXG4gICAgICAgICAgICAgICAgICAgIChmaWx0ZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlciA9IGZpbHRlci5yZXBsYWNlKC9cXGAvZywgJy4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlciA9IGZpbHRlci5yZXBsYWNlKC9cXEAvZywgJ2RhdGEnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaWx0ZXIuaW5kZXhPZignb3JkZXItYnk6JykgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFyZzogYW55ID0gZmlsdGVyLnN1YnN0cmluZyhmaWx0ZXIuaW5kZXhPZignb3JkZXItYnk6JykgKyAxMCkudHJpbSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFyZ2xpc3QgPSBhcmcuc3BsaXQoJ34nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBhcmdsaXN0WzBdLnRyaW0oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvcmRlcj0gYXJnbGlzdFsxXSA/IGFyZ2xpc3RbMV0udHJpbSgpLnRvTG93ZXJDYXNlKCk6ICdhc2MnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdFsnc29ydCddID0gZnVuY3Rpb24gKGFycmF5OiBhbnkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgX3ZhbHVlT2YgPSAoa2V5OiBzdHJpbmcsIHA6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5LnNwbGl0KCcuJykubWFwKCAoeCkgPT4ge3AgPSBwW3hdfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJyYXkuc29ydChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGE6IGFueSxiOiBhbnkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZsYWcgPV92YWx1ZU9mKGtleSwgYSkgPiBfdmFsdWVPZihrZXksIGIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmbGFnID8gKG9yZGVyID09PSAnYXNjJyA/IDE6IC0xKSA6IChvcmRlciA9PT0gJ2FzYycgPyAtMTogMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlciA9ICdyZXR1cm4gZnVuY3Rpb24gKGRhdGEpIHsgdmFyIHggPSBmYWxzZTsgdHJ5eyB4ID0gKCcgKyBmaWx0ZXIgKyAnKTsgfWNhdGNoKGUpe30gcmV0dXJuIHg7fSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0Wyd2YWxpZGF0ZWQnXS5wdXNoKCBuZXcgRnVuY3Rpb24oZmlsdGVyKSgpICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKG9iamVjdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHByaXZhdGUgX3ByZXBhcmVKc29uUGF0aChwYXRoOiBhbnkpIHtcbiAgICAgICAgbGV0IHJlc3VsdDogYW55O1xuICAgICAgICBpZiAocGF0aCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICByZXN1bHQgPSBbXTtcbiAgICAgICAgICAgIHBhdGgubWFwKFxuICAgICAgICAgICAgICAgIChpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHggPSBpLnJlcGxhY2UoLyhbXFxbKF0pKC4rPykoW1xcXSldKS9nLCAobWF0Y2gsIHAxLCBwMiwgcDMsIG9mZnNldCwgcykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHAxICsgcDIucmVwbGFjZSgvXFwuL2csJ2AnKSArIHAzO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5fbWFrZUFyZ3VtZW50cyh4KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhdGggPSBwYXRoID8gcGF0aCA6ICcnO1xuICAgICAgICAgICAgY29uc3QgeCA9IHBhdGgucmVwbGFjZSgvKFtcXFsoXSkoLis/KShbXFxdKV0pL2csIChtYXRjaCwgcDEsIHAyLCBwMywgb2Zmc2V0LCBzKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHAxICsgcDIucmVwbGFjZSgvXFwuL2csJ2AnKSArIHAzO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLl9tYWtlQXJndW1lbnRzKHgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIFxuXG4gICAgLypcbiAgICAqIFdpbGwgY29udmVydCB0aGUgeG1sIGludG8gYSBqc29uLlxuICAgICogQHBhcmFtIHhtbCBYTUwgdG8gYmUgY29udmVydGVkLlxuICAgICogQHJldHVybnMgcmV0dXJucyBjb252ZXJ0ZWQgSlNPTi5cbiAgICAqL1xuICAgIHByaXZhdGUgX3htbDJqc29uKHhtbDogYW55KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgb2JqID0ge307XG4gICAgICAgICAgICBpZiAoeG1sLmF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjID0geG1sLmF0dHJpYnV0ZXM7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYXR0ciA9IGNbaV07XG4gICAgICAgICAgICAgICAgb2JqW2F0dHIubmFtZV0gPSBhdHRyLnZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh4bWwuY2hpbGROb2RlcyAmJiB4bWwuY2hpbGROb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHhtbC5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSB4bWwuY2hpbGROb2Rlc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm9kZU5hbWUgPSBpdGVtLm5vZGVOYW1lO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChvYmpbbm9kZU5hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZyYWdtZW50ID0gdGhpcy5feG1sMmpzb24oaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZnJhZ21lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ialtub2RlTmFtZV0gPSBmcmFnbWVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmpbbm9kZU5hbWVdLnB1c2ggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9sZCA9IG9ialtub2RlTmFtZV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmpbbm9kZU5hbWVdID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqW25vZGVOYW1lXS5wdXNoKG9sZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmcmFnbWVudCA9IHRoaXMuX3htbDJqc29uKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZyYWdtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqW25vZGVOYW1lXS5wdXNoKGZyYWdtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IHhtbC50ZXh0Q29udGVudC50cmltKCkucmVwbGFjZSgvKD86XFxyXFxufFxccnxcXG58XFx0KS9nLCAnJyk7XG4gICAgICAgICAgICAgICAgb2JqID0gdGV4dC5sZW5ndGggPyB0ZXh0IDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMubG9nRW5hYmxlZCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUubWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKlxuICAgICogV2lsbCBkbyBhIGNoYWluIHF1ZXJ5IG9uIHNwZWNpZmllZCBwYXRocyBmcm9tIHJlbW90ZSBsb2NhdGlvbi5cbiAgICAqIEBwYXJhbSBjaGFpblF1ZXJ5IEEgSnNvbiBzdHJ1Y3R1cmUgd2l0aCBwYXRocy4gRWFjaCBwYXRoIHdpbGwgY29udGFpbiBhIGNoYWluIG9mIGluc3RydWN0aW9ucy5cbiAgICAqIEVhY2ggaW5zdHJ1Y3Rpb24gd2lsbCBoYXZlIGEgJ2luJyB0byBhIGZpbGUgYW5kIGEgcGF0aCB0byBzZWFyY2ggb24gaXQgKHNlZS4gc2VsZWN0KCkpLiBvbmNlIHRoZVxuICAgICogcmVzdWx0IGlzIGluLCB0aGUgbmV4dCBpbnN0cnVjdGlvbiBpbiB0aGUgcGF0aCBjaGFpbiB3aWxsIGJlIHRyaWdnZWQuIEFmdGVyIHRoZSBwYXRoIHRocm91Z2ggYWxsXG4gICAgKiBjaGFpbmVkIHBhdGhzIGlzIGNvbXBsZXRlZCwgcmVzdWx0aW5nIHZhbHVlIHdpbGwgYmUgcHV0IGluIGEganNvbiB3aGVyZSBpdHMgcGF0aCBpcyB0aGUgb3JpZ2luYWxcbiAgICAqIGpzb24gcGF0aCBhbmQgaXRzIHZhbHVlIHdpbGwgYmUgdGhlIHJlc3VsdGluZyB2YWx1ZS5cbiAgICAqXG4gICAgKiB0aGlzIGlzIG5vdCBmdWxseSB0ZXN0ZWQuIGNhbGxlciBzaG91bGQgcGFzcyBzb21ldGhpbmcgbGlrZVxuICAgICoge3BhdGg6IFtwYXRoMSxwYXRoMl0sIGluOiAnc29tZXRoaW5nIG9yIGJsYW5rJywgZGVlcFhtbDogdHJ1ZSwgam9pbjoge2sxOiB7cGF0aDogcGF0aDMsIGluOiAnc29tZXRoaW5nIG9yIHBsYW5rJywgY2xhdXNlOiBmdW5jdGlvbn19fVxuICAgICogaWYgcGF0aDEgb3IgcGF0aDIgb3IgcGF0aDMgYXJlIGZvdW5kIGF0IHRoZSByb290IG9iamVjdCwgYSBjaGFpbiByZWFjdGlvbiB0byBmZXRjaCBkZWVwIHdpbGwgZm9sbG93LiBBblxuICAgICogb3B0aW9uYWwgY2xhdXNlIHdpbGwgaGVscCByZXNvbHZlIGNvbXBsZXggc2l0dWF0aW9ucy5cbiAgICAqXG4gICAgKiBAcmV0dXJucyByZXR1cm5zIGFuIG9ic2VydmFibGUuIHRoZSBjYWxsZXIgc2hvdWxkIHN1YnNjcmliZSB0byB0aGlzIGluIG9yZGVyIHRvIHJlY2VpdmUgdGhlIHJlc3VsdC5cbiAgICAqL1xuICAgIGNoYWluU2VsZWN0KGNoYWluUXVlcnk6IGFueSk6IEJlaGF2aW9yU3ViamVjdDxhbnk+IHtcbiAgICAgICAgY29uc3Qgc2l6ZSA9IChjaGFpblF1ZXJ5LnBhdGggaW5zdGFuY2VvZiBBcnJheSkgPyAgY2hhaW5RdWVyeS5wYXRoLmxlbmd0aCA6IDE7XG4gICAgICAgIGNvbnN0IG9wZXJhdGlvbiA9IHtjYWNoZWRGaWxlczoge30sIHJlc3VsdDoge319O1xuICAgICAgICBjb25zdCBkYXRhU3RvcmUgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGFueT4obnVsbCk7XG5cbiAgICAgICAgdGhpcy5fcXVlcnlJdGVyYXRpb24oXG4gICAgICAgICAgICBkYXRhU3RvcmUsXG4gICAgICAgICAgICBvcGVyYXRpb24sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcGF0aDogY2hhaW5RdWVyeS5wYXRoLFxuICAgICAgICAgICAgICAgIGluOiBjaGFpblF1ZXJ5LmluLFxuICAgICAgICAgICAgICAgIGRlZXBYbWw6IGNoYWluUXVlcnkuZGVlcFhtbCxcbiAgICAgICAgICAgICAgICBqb2luOiBjaGFpblF1ZXJ5LmpvaW4sXG4gICAgICAgICAgICAgICAgaGFuZGxlcjogY2hhaW5RdWVyeS5oYW5kbGVyLFxuICAgICAgICAgICAgICAgIHF1ZXJ5SXRlbXM6IHNpemVcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIGRhdGFTdG9yZTtcbiAgICB9XG5cbiAgICAvKlxuICAgICogV2lsbCBncm91cCBmaWxlIHBhdGhzIGlmIHRoZXkgYXJlIHNpbWlsYXIgdG8gYXZvaWQgbXVsdGlwbGUgY2FsbHMuXG4gICAgKiBAcGFyYW0gbGlzdCBBIGxpc3Qgb2YgSnNvbiB7cGF0aHMsIGluLCBkZWVwWG1sfSBzdHJ1Y3R1cmVzLiBkZWVwWG1sIGlzIG9wdGlvbmFsLlxuICAgICogQHBhcmFtIGNsYXVzZSBBIG1ldGhvZCBieSB3aGljaCB2YWx1ZShzKSBmb3IgdGhlIHBhdGgocykgY291bGQgYmUgZXZhbHVhdGVkLiB0aGUgY2FsbGVyIHdvdWxkIGV2YWx1YXRlIHRoZSB2YWx1ZSBmb3IgYSBnaXZlbiBhdHRyaWJ1dGUuXG4gICAgKiBAcmV0dXJucyByZXR1cm5zIGFuIG9ic2VydmFibGUuIHRoZSBjYWxsZXIgc2hvdWxkIHN1YnNjcmliZSB0byB0aGlzIGluIG9yZGVyIHRvIHJlY2VpdmUgdGhlIHJlc3VsdC5cbiAgICAqL1xuICAgIGFycmF5U2VsZWN0KFxuICAgICAgICBsaXN0OiBhbnksXG4gICAgICAgIGNsYXVzZT86IGNsYXVzZUV2YWx1YXRvcik6IEJlaGF2aW9yU3ViamVjdDxhbnk+ICB7XG4gICAgICAgIGNvbnN0IGdyb3VwZWRMaXN0ID0ge307XG4gICAgICAgIGxpc3QubWFwKCAoaXRlbTogYW55KSA9PiB7XG4gICAgICAgICAgICBpZiAoZ3JvdXBlZExpc3RbaXRlbS5pbl0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGdyb3VwZWRMaXN0W2l0ZW0uaW5dID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBncm91cGVkTGlzdFtpdGVtLmluXS5wdXNoKHtwYXRoOiBpdGVtLnBhdGgsIGRlZXBYbWw6IGl0ZW0uZGVlcFhtbH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgZGF0YVN0b3JlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxhbnk+KG51bGwpO1xuXG4gICAgICAgIE9iamVjdC5rZXlzKGdyb3VwZWRMaXN0KS5tYXAgKCAodXJsKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdChncm91cGVkTGlzdFt1cmxdLnBhdGgsIHVybCwgZ3JvdXBlZExpc3RbdXJsXS5kZWVwWG1sLCBjbGF1c2UpLnN1YnNjcmliZShcbiAgICAgICAgICAgICAgICAoZGF0YTogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhU3RvcmUubmV4dChkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgKGVycm9yOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YVN0b3JlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGRhdGFTdG9yZTtcbiAgICB9XG5cbiAgICAvKlxuICAgICogV2lsbCBxdWVyeSBwYXRoIGZyb20gYSByZW1vdGUgbG9jYXRpb24gcXVhbGlmaWVkIHRocm91Z2ggYW4gb3B0aW9uYWwgY2xhdXNlIGZ1bmN0aW9uIHRoYXRcbiAgICAqIGV2YWx1YXRlcywgZmlsdGVycywgb3Igc29ydHMgdGhlIHJlc3VsIG9mIHRoZSBxdWVyeS5cbiAgICAqIEBwYXJhbSBwYXRoIEEgYSBzaW5nbGUgSlNPTiBwYXRoIG9yIGxpc3Qgb2YgcGF0aHMgdG8gc2VsZWN0IChpLmUuLCAnYS5iLmMnKVxuICAgICogQHBhcmFtIGZyb20gQSByZWZlcmVuY2UgVVJMIHRvIGEgcmVtb3RlIHNvdXJjZS5cbiAgICAqIEBwYXJhbSBkZWVwWG1sIGlmIGNkYXRhLXNlY3Rpb24gc2hvdWxkIGJlIHBhcnNlZC5cbiAgICAqIEBwYXJhbSBjbGF1c2UgQSBtZXRob2QgYnkgd2hpY2ggdmFsdWUocykgZm9yIHRoZSBwYXRoKHMpIGNvdWxkIGJlIGV2YWx1YXRlZC4gdGhlIGNhbGxlciB3b3VsZCBldmFsdWF0ZSB0aGUgdmFsdWUgZm9yIGEgZ2l2ZW4gYXR0cmlidXRlLlxuICAgICogQHJldHVybnMgcmV0dXJucyBhbiBvYnNlcnZhYmxlLiB0aGUgY2FsbGVyIHNob3VsZCBzdWJzY3JpYmUgdG8gdGhpcyBpbiBvcmRlciB0byByZWNlaXZlIHRoZSByZXN1bHQuXG4gICAgKi9cbiAgICBzZWxlY3QoXG4gICAgICAgIHBhdGg6IGFueSxcbiAgICAgICAgZnJvbTogc3RyaW5nLFxuICAgICAgICBkZWVwWG1sOiBib29sZWFuLFxuICAgICAgICBjbGF1c2U/OiBjbGF1c2VFdmFsdWF0b3IpOiBCZWhhdmlvclN1YmplY3Q8YW55PiB7XG5cbiAgICAgICAgY29uc3QgZGF0YVN0b3JlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxhbnk+KG51bGwpO1xuXG4gICAgICAgIHRoaXMuX2dldChmcm9tKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAoZGF0YTogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdDogYW55O1xuICAgICAgICAgICAgICAgIGNvbnN0IGpwYXRoID0gdGhpcy5fcHJlcGFyZUpzb25QYXRoKHBhdGgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFjbGF1c2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xhdXNlID0gKG5vZGU6IGFueSwgcGF0aDogc3RyaW5nLCB2YWx1ZTogYW55KSA9PiB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHBhdGggaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAganBhdGgubWFwKChwYXRoSXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeSA9IHRoaXMuX3ZhbHVlT2ZKc29uUGF0aChwYXRoSXRlbSwgZGF0YSwgZGVlcFhtbCwgY2xhdXNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGtleSA9IHRoaXMuX3N0cmluZ1ZhbHVlT2ZLZXkocGF0aEl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0geTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhyZXN1bHQpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgcGF0aCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5fdmFsdWVPZkpzb25QYXRoKGpwYXRoLCBkYXRhLCBkZWVwWG1sLCBjbGF1c2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFTdG9yZS5uZXh0KHJlc3VsdCk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkYXRhU3RvcmUuZXJyb3IoJ1Jlc3VsdCBub3QgZm91bmQgZm9yICcgKyBwYXRoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgKGVycm9yOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBkYXRhU3RvcmUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gZGF0YVN0b3JlO1xuICAgIH1cbn1cbiJdfQ==