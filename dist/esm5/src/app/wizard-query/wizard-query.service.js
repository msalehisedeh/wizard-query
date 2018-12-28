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
     * @return {?}
     */
    WizardQueryService.prototype._normalize = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        var _this = this;
        if (value instanceof Array) {
            /** @type {?} */
            var result_1 = [];
            value.map(function (item) {
                result_1.push(_this._normalize(item));
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
            else {
                /** @type {?} */
                var result_2 = {};
                items.map(function (item) {
                    result_2[item] = _this._normalize(value[item]);
                });
                value = result_2;
            }
        }
        return value;
    };
    /**
     * @param {?} path
     * @param {?} data
     * @param {?=} clause
     * @return {?}
     */
    WizardQueryService.prototype._valueOfJsonPath = /**
     * @param {?} path
     * @param {?} data
     * @param {?=} clause
     * @return {?}
     */
    function (path, data, clause) {
        /** @type {?} */
        var result;
        /** @type {?} */
        var x = this._normalize(data);
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
                        }
                    });
                    x = t_2;
                }
                result = x;
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
                opk = [opk];
                op[key2] = opk;
            }
            if (op[key2]) {
                op[key2].push(this._normalize(value));
            }
            else {
                op.push(this._normalize(value));
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
            operation.result[path][key2] = this._normalize(value);
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
                join: action.join,
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
                                join: opkeyi_1.join,
                                queryItems: (opkeyi_1.path instanceof Array) ? opkeyi_1.path.length : 1
                            });
                        });
                    }
                    else {
                        _this._subquery(promise, source, operation, {
                            path: action.join[opkeyi_1.path],
                            in: opkeyi_1.in + source,
                            join: opkeyi_1.join,
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
        if (!action.handle) {
            action.handler = function (node, path, value) { return value; };
        }
        this.select(action.path, action.in, action.handler).subscribe(function (data) {
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
                                    join: operationalKey_1.join,
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
            promise.error('failed to query ' + action.path);
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
    * {path: [path1,path2], in: 'something or blank', k1: {path: path3, in: 'something or plank', clause: function}}
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
            join: chainQuery.join,
            queryItems: size
        });
        return dataStore;
    };
    /*
    * Will group file paths if they are similar to avoid multiple calls.
    * @param list A list of Json {paths, in} structures.
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
            groupedList[item.in].push(item.path);
        });
        /** @type {?} */
        var dataStore = new BehaviorSubject(null);
        Object.keys(groupedList).map(function (url) {
            _this.select(groupedList[url], url, clause).subscribe(function (data) {
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
    * @param clause A method by which value(s) for the path(s) could be evaluated. the caller would evaluate the value for a given attribute.
    * @returns returns an observable. the caller should subscribe to this in order to receive the result.
    */
    /**
     * @param {?} path
     * @param {?} from
     * @param {?=} clause
     * @return {?}
     */
    WizardQueryService.prototype.select = /**
     * @param {?} path
     * @param {?} from
     * @param {?=} clause
     * @return {?}
     */
    function (path, from, clause) {
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
                    var y = _this._valueOfJsonPath(pathItem, data, clause);
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
                result = _this._valueOfJsonPath(jpath, data, clause);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLXF1ZXJ5LnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly93aXphcmQtcXVlcnkvIiwic291cmNlcyI6WyJzcmMvYXBwL3dpemFyZC1xdWVyeS93aXphcmQtcXVlcnkuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBb0NBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLFVBQVUsRUFBRSxXQUFXLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUU3RCxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDbkMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUNyQyxPQUFPLEtBQUssTUFBTSxNQUFNLFFBQVEsQ0FBQzs7Ozs7SUFnQjdCLDRCQUNVO1FBQUEsU0FBSSxHQUFKLElBQUk7NEJBSlEsRUFBRTswQkFDSixLQUFLO0tBTXhCOzs7OztJQU9PLHVDQUFVOzs7O2NBQUMsS0FBVTs7UUFDekIsRUFBRSxDQUFDLENBQUMsS0FBSyxZQUFZLEtBQUssQ0FBQyxDQUFDLENBQUM7O1lBQ3pCLElBQU0sUUFBTSxHQUFHLEVBQUUsQ0FBQztZQUNsQixLQUFLLENBQUMsR0FBRyxDQUFFLFVBQUMsSUFBSTtnQkFDWixRQUFNLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzthQUN0QyxDQUFDLENBQUM7WUFDSCxLQUFLLEdBQUcsUUFBTSxDQUFDO1NBQ2xCO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7O1lBQ25DLElBQUksS0FBSyxHQUFRLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFcEMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxL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QUN0QjthQUNKO1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xDLE1BQU0sR0FBRyxLQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQzthQUN2RDtZQUNELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ1QsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUUxQjtZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLFNBQVMsQ0FBQyxLQUFLLENBQUMsdUJBQXVCLEdBQUcsSUFBSSxDQUFDLENBQUM7YUFDbkQ7U0FDSixFQUNELFVBQUMsS0FBVTtZQUNQLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDMUIsQ0FDSixDQUFDO1FBQ0YsTUFBTSxDQUFDLFNBQVMsQ0FBQztLQUNwQjs7Z0JBbHRCSixVQUFVOzs7O2dCQWRILFVBQVU7OzZCQXJDbEI7O1NBb0RhLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4qIFF1ZXJ5IHNlcnZpY2UgcHJvdmlkZXMgYSB3YXkgdG8gcXVlcnkgYSByZW1vdGUgSlNPTiBvciBYTUwgZmlsZS4gSXQgY2FuIGJlIHVzZWQgaW4gZm9sbG93aW5nIHdheXMuXG4qXG4qIDEpIFdpdGggc2VsZWN0KCkgbWV0aG9kLCBhIHNpbmdsZSBwYXRoIG9yIGEgbGlzdCBvZiBwYXRocyBjYW4gYmUgZ2l2ZW4uIGVhY2ggcGF0aCB3aWxsIGJlIGEganNvbiBxdWFsaWZ5aW5nXG4qIHBhdGggdG8gYW4gZW5kIG5vZGUgKGkuZS4sICdib29rcy5ib29rLnRpdGxlJykuIElmIG11bHRpcGxlIHBhdGhzIGFyZSBzdXBwbGllZCwgcXVlcnkgcmVzdWx0IHdpbGwgYmUgYSBqc29uXG4qIG9iamVjdCB3aGVyZSBlYWNoIGF0dHJpYnV0ZSB3aWxsIGJlIGEgZ2l2ZW4gcXVlcnkgcGF0aCBhbmQgaXRzIHZhbHVlIHdpbGwgYmUgcXVlcnkgcmVzdWx0IGZvciB0aGF0IHBhdGguXG4qIEZvciBleGFtcGxlOlxuKiBzZWxlY3QoJy9leGFtcGxlMS54bWwnLCBbJ2Jvb2tzLmJvb2sudGl0bGUnLCAnYm9va3MuYm9vay5hdXRob3InXSlcbiogd2lsbCByZXN1bHQgaW4geydib29rcy5ib29rLnRpdGxlJzogW10sICdib29rcy5ib29rLmF1dGhvcic6IFtdfS5cbiogRWFjaCByZXN1bHQgd2lsbCBub3QgY28tcmVsYXRlZCB3aXRoIG90aGVyIHJlc3VsdCBpbiBvcmRlciBvciBpbiBhbnkgb3RoZXIgZm9ybS4gaWYgYSBjbGF1c2UgYXJndW1lbnQgaXNcbiogc3VwcGxpZWQsIGl0IHdpbGwgYmUgaW52b2tlZCB0byBmdXJ0aGVyIGFzc2lzdCBpbiBmaWx0ZXJpbmcgdGhlIHF1ZXJ5IHJlc3VsdC4gZm9yIGV4YW1wbGUgaWYgY2VydGFpbiBjYXRlZ29yeVxuKiBvZiBib29rcyBhcmUgcmVxdWlyZWQsIHRoZSBjbGF1c2UgZnVuY3Rpb24gY2FuIGxvb2sgZm9yIGEgYm9vayBjYXRlZ29yeSBhdHRyaWJ1dGUgYW5kIHJldHVybiB0aGUgcXVlcnkgcmVzdWx0XG4qIGlmIGFjY2VwdGFibGUgb3IgdW5kZWZpbmVkIGlmIHJlc3VsdCBzaG91bGQgYmUgZmlsdGVyZWQgb3V0IG9mIHRoZSByZXN1bHQuXG4qXG4qIDIpIFdpdGggYXJyYXlTZWxlY3QoKSBtZXRob2QsIGFuIGFycmF5IG9mIHtwYXRoOiAnJywgaW46Jyd9IGNhbiBiZSBzdXBwbGllZCwgZWFjaCBlbnRyeSB3aWxsIGJlIGV2YWx1YXRlZFxuKiBhcyBpZiBzZWxlY3QoKSBtZXRob2QgaXMgaW52b2tlZC4gQnV0IGZpcnN0LCByZXF1ZXN0cyB3aXRoIHNpbWlsYXIgcGF0aHMgd2lsbCBiZSBtZXJnZWQgaW50byBvbmUgY2FsbC4gIFRoaXNcbiogbWV0aG9kIGlzIHVzZWZ1bCB3aGVuIHBhdGhzIGFyZSBkeW5hbWljbHkgZ2l2ZW4gYW5kIGl0IGlzIG5vdCBjbGVhciBpbiBhZHZhbmNlIGlmIHRoZXJlIGFyZSByZXF1ZXN0cyB3aXRoXG4qIHNpbWlsYXIgcGF0aHMuXG4qXG4qIDMpIFdpdGggY2hhaW5TZWxlY3QoKSBtZXRob2QsIGEgY2hhaW5lZCBzZXQgb2Yge3BhdGg6ICcnLCBpbjogJyd9IGlzIGdpdmVuIGluIGEganNvbiBvYmplY3QuIFdoZW4gcmVzdWx0IG9mXG4qIGEgcXVlcnkgYmVjb21lcyBhdmFpbGFibGUsIHRoZSByZXF1ZXN0IGpzb24gd2lsbCBiZSBleGFtaW5lZCB0byBzZWUgaWYgYSByZXF1ZXN0IGZvciB0aGUga2V5IGlzIGF2YWlsYWJsZS4gSWZcbiogc28sIHRoZW4gdGhlICdpbicgZm9yIHRoZSBwYXRoIHdpbGwgYmUgcHJlcGVuZGVkIHRvIHRoZSByZXN1bHRpbmcgdmFsdWUgb2YgdGhlIHByZXZpb3VzIHF1ZXJ5LiBUaGlzIG1ldGhvZCBpc1xuKiB1c2VmdWwgd2hlbiByZXN1bHQgb2YgYSBxdWVyeSBpcyBhIGpzb24gb3IgYW4geG1sIGZpbGUgYW5kIGFkZGl0aW9uYWwgcXVlcnkgaXMgbmVlZGVkIGZ1cnRoZXIgZG93biBpbiB0aGVcbiogcHJlY2VlZGluZyBmaWxlcy4gRm9yIGV4YW1wbGUgdGhlIGFzc3VtcHRpb24gaW4gdGhlIGZvbGxvd2luZyBjYWxsIGlzIHRoYXQgZWFjaCBib29rcy5ib29rIHJlc3VsdCB3aWxsIGJlIGFcbiogZmlsZSBuYW1lIGFuZCB0aGUgZmlsZSBwYXRoIGZvciBlYWNoIHJlc3VsdCBpcyAnL3NhbXBsZXMvYm9va3MvJy5cbiogY2hhaW5TZWxlY3Qoe1xuKiAgIHBhdGg6ICdib29rcy5ib29rJyxcbiogICBpbjogJ3NhbXBsZTEueG1sJyxcbiogICAnYm9va3MuYm9vayc6IHtcbiogICAgICAgaW46ICcvc2FtcGxlcy9ib29rcy8nLFxuKiAgICAgICBwYXRoOiBbJ3B1YmxpY2F0aW9uLnRpdGxlJywgJ3B1YmxpY2F0aW9uLmF1dGhvciddLFxuKiAgICAgICBoYW5kbGVyOiB0aGlzLmJ1YmxpY2F0aW9uSGFuZGxlclxuKiAgIH0pXG4qIGlmIGEgaGFuZGxlciBpcyBzdXBwbGllZCwgaXQgd2lsbCBiZSB1c2VkIHRvIGZpbHRlciBvdXQgYW55IHJlc3VsdCB0aGF0IGlzIG5vdCBhY2NlcHRhYmxlLlxuKlxuKi9cbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0h0dHBDbGllbnQsIEh0dHBIZWFkZXJzfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5cbmltcG9ydCB7bWFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgKiBhcyB4bWxkb20gZnJvbSAneG1sZG9tJztcblxuLypcbiogQHBhcmFtIG5vZGUgVGhlIHBhcmVudCBub2RlLiBpdCBjYW4gYmUgdXNlZCB0byBldmFsdWF0ZSBiYXNlZCBvbiBvdGhlciBhdHRyaWJ1dGVzIGluIHRoZSBub2RlLlxuKiBAcGFyYW0gcGF0aCBhdHRyaWJ1dGUgdG8gYmUgZXhhbWluZWQuXG4qIEBwYXJhbSB2YWx1ZSB0aGUgdmFsdWUgb2YgdGhlIHBhdGguIGl0IGNvdWxkIGJlIHVuZGVmaW5lZCwgYSBsaXRlcmFsLCBvciBhIGxpc3QuXG4qIEByZXR1cm5zIHJldHVybnMgdGhlIHZhbHVlIG9yIGZpbHRlcmVkIHZlcnNpb24gb2YgdGhlIHZhbHVlIG9yIHVuZGVmaW5lZCBvdGhlcndpc2UuXG4qL1xuZXhwb3J0IHR5cGUgY2xhdXNlRXZhbHVhdG9yID0gKG5vZGU6IGFueSwgcGF0aDogc3RyaW5nLCB2YWx1ZTogYW55KSA9PiBhbnk7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBXaXphcmRRdWVyeVNlcnZpY2Uge1xuXG4gICAgcHVibGljIFNFUlZJQ0VfUEFUSCA9ICcnO1xuICAgIHB1YmxpYyBsb2dFbmFibGVkID0gZmFsc2U7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgaHR0cDogSHR0cENsaWVudFxuICAgICkge1xuXG4gICAgfVxuXG4gICAgLypcbiAgICAqIFdpbGwgbm9ybWFsaXplIHRoZSBnaXZlbiB4bWwgb3V0IG9mIGFkZGl0aW9uYWwgI3RleHQgb3IgI2NkYXRhLXNlY3Rpb24gbm9kZXMuXG4gICAgKiBAcGFyYW0gdmFsdWUgdGhlIHhtbCB0byBiZSBub3JtYWlsemVkLlxuICAgICogQHJldHVybiBub3JtYWxpemVkIHhtbC5cbiAgICAqL1xuICAgIHByaXZhdGUgX25vcm1hbGl6ZSh2YWx1ZTogYW55KSB7XG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICAgICAgICAgIHZhbHVlLm1hcCggKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLl9ub3JtYWxpemUoaXRlbSkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YWx1ZSA9IHJlc3VsdDtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBsZXQgaXRlbXM6IGFueSA9IE9iamVjdC5rZXlzKHZhbHVlKTtcblxuICAgICAgICAgICAgaWYgKGl0ZW1zLmxlbmd0aCA9PT0gMSAmJiAhKHZhbHVlW2l0ZW1zWzBdXSBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZVsnI3RleHQnXSkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlWycjdGV4dCddO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWVbJyNjZGF0YS1zZWN0aW9uJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZVsnI2NkYXRhLXNlY3Rpb24nXTtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHhtbCA9IG5ldyB4bWxkb20uRE9NUGFyc2VyKCkucGFyc2VGcm9tU3RyaW5nKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gKHhtbC5kb2N1bWVudEVsZW1lbnQgJiYgeG1sLmRvY3VtZW50RWxlbWVudCAhPSBudWxsKSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl94bWwyanNvbih4bWwuZG9jdW1lbnRFbGVtZW50KSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfWNhdGNoKGUpe1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICAgICAgICAgICAgICBpdGVtcy5tYXAoIChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtpdGVtXSA9IHRoaXMuX25vcm1hbGl6ZSh2YWx1ZVtpdGVtXSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSByZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIC8qXG4gICAgKiBAcGFyYW0gcGF0aCBKU09OIHBhdGggdG8gZXZhbHVhdGUuIEEgcGF0aCBjb3VsZCBiZSBmdWxseSBxdWFsaWZpZWQgZm9yIGRlcHRoIG9mIGpzb24gKGkuZS4sICdhLmIuYycpXG4gICAgKiBAcGFyYW0gZGF0YSB0aGUgZGF0YSBzb3VyY2UuXG4gICAgKiBAcGFyYW0gY2xhdXNlIEEgbWV0aG9kIGJ5IHdoaWNoIHZhbHVlKHMpIGZvciB0aGUga2V5KHMpIGNvdWxkIGJlIGV2YWx1YXRlZC4gdGhlIGNhbGxlciB3b3VsZCBldmFsdWF0ZSB0aGUgdmFsdWUgZm9yIGEgZ2l2ZW4gYXR0cmlidXRlLlxuICAgICogQHJldHVybnMgcmV0dXJucyBldmx1YXRlZCB2YWx1ZSBmb3IgdGhlIGtleSBpbiBkYXRhIHNvdXJjZS5cbiAgICAqL1xuICAgIHByaXZhdGUgX3ZhbHVlT2ZKc29uUGF0aChcbiAgICAgICAgcGF0aDogYW55LFxuICAgICAgICBkYXRhOiBhbnksXG4gICAgICAgIGNsYXVzZT86IGNsYXVzZUV2YWx1YXRvcik6IGFueSB7XG5cbiAgICAgICAgbGV0IHJlc3VsdDogYW55O1xuICAgICAgICBsZXQgeCA9IHRoaXMuX25vcm1hbGl6ZShkYXRhKTtcbiAgICAgICAgcGF0aC5tYXAoIChzdWJrZXk6IGFueSkgPT4ge1xuICAgICAgICAgICAgbGV0IG5vZGUgPSB4O1xuICAgICAgICAgICAgaWYgKG5vZGUgJiYgbm9kZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdCA9IFtdO1xuICAgICAgICAgICAgICAgIGlmIChzdWJrZXkuc29ydCkge1xuICAgICAgICAgICAgICAgICAgICBub2RlID0gc3Via2V5LnNvcnQobm9kZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG5vZGUubWFwIChcbiAgICAgICAgICAgICAgICAgICAgKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3Via2V5LmtleS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeCA9IHN1YmtleS5rZXkubGVuZ3RoID8gaXRlbVtzdWJrZXkua2V5XSA6IGl0ZW07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh4ICYmIHN1YmtleS52YWxpZGF0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YmtleS52YWxpZGF0ZWQubWFwKHYgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHYoeCkgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0LnB1c2goeCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3Via2V5LnZhbGlkYXRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Via2V5LnZhbGlkYXRlZC5tYXAodiA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodihpdGVtKSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3Via2V5LmtleS5sZW5ndGggJiYgKHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnNwbGl0KCcuJykubWFwKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoc3RyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RyLmluZGV4T2Yoc3Via2V5LmtleSkgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQucHVzaChzdHIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB4ID0gdDtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB4O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChub2RlICYmICh0eXBlb2Ygbm9kZSA9PT0gJ29iamVjdCcpKSB7XG4gICAgICAgICAgICAgICAgeCA9IHggP1xuICAgICAgICAgICAgICAgICAgICBjbGF1c2Uobm9kZSwgc3Via2V5LmtleSwgc3Via2V5LmtleS5sZW5ndGggPyB4W3N1YmtleS5rZXldOiAgeCkgOlxuICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgaWYgKHggJiYgeCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHQgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN1YmtleS5zb3J0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB4ID0gc3Via2V5LnNvcnQoeCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgeC5tYXAoXG4gICAgICAgICAgICAgICAgICAgICAgICAoaXRlbTogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1YmtleS52YWxpZGF0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJrZXkudmFsaWRhdGVkLm1hcCh2ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHYoaXRlbSkgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdC5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB4ID0gdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0geDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobm9kZSAmJiAodHlwZW9mIG5vZGUgPT09ICdzdHJpbmcnKSAmJiBzdWJrZXkua2V5Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IFtdO1xuICAgICAgICAgICAgICAgIG5vZGUuc3BsaXQoJy4nKS5tYXAoXG4gICAgICAgICAgICAgICAgICAgIChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5pbmRleE9mKHN1YmtleS5rZXkpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gbm9kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZ2V0KHBhdGg6IHN0cmluZykge1xuICAgICAgICBjb25zdCB1cmwgPSB0aGlzLlNFUlZJQ0VfUEFUSCArIHBhdGg7XG4gICAgICAgIGNvbnN0IGRvdCA9IHBhdGgubGFzdEluZGV4T2YoJy4nKTtcbiAgICAgICAgY29uc3QgZXh0ID0gZG90IDwgMCA/IHVuZGVmaW5lZCA6IHBhdGgudG9Mb3dlckNhc2UoKS5zdWJzdHIoZG90KTtcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycygpO1xuICAgICAgICBsZXQgcmVzdWx0OiBhbnk7XG5cbiAgICAgICAgaGVhZGVycy5zZXQoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbicsICcqJyk7XG5cbiAgICAgICAgaWYgKGV4dCA9PT0gJy54bWwnKSB7XG4gICAgICAgICAgICBoZWFkZXJzLnNldCgnQ29udGVudC1UeXBlJywgJ3RleHQ7IGNoYXJzZXQ9dXRmLTgnKS5zZXQoJ0FjY2VwdCcsICd0ZXh0Jyk7XG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLmh0dHAuZ2V0KHVybCwgeyBoZWFkZXJzLCByZXNwb25zZVR5cGU6ICd0ZXh0JyB9KVxuICAgICAgICAgICAgICAgIC5waXBlKG1hcCgocmVzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHhtbCA9IG5ldyB4bWxkb20uRE9NUGFyc2VyKCkucGFyc2VGcm9tU3RyaW5nKHJlcyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGpzb24gPSB0aGlzLl94bWwyanNvbih4bWwuZG9jdW1lbnRFbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGpzb247XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXh0ID09PSAnLnR4dCcpIHtcbiAgICAgICAgICAgIGhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCAndGV4dDsgY2hhcnNldD11dGYtOCcpLnNldCgnQWNjZXB0JywgJ3RleHQnKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5nZXQodXJsLCB7IGhlYWRlcnMsIHJlc3BvbnNlVHlwZTogJ3RleHQnIH0pLnBpcGUobWFwKChyZXMpID0+IHJlcykpO1xuICAgICAgICB9IGVsc2UgaWYgKGV4dCA9PT0gJy5qc29uJyl7XG4gICAgICAgICAgICBoZWFkZXJzLnNldCgnQ29udGVudC1UeXBlJywgJ2pzb247IGNoYXJzZXQ9dXRmLTgnKS5zZXQoJ0FjY2VwdCcsICdqc29uJyk7XG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLmh0dHAuZ2V0KHVybCwge2hlYWRlcnN9KS5waXBlKG1hcCgocmVzKSA9PiByZXMpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCAndGV4dDsgY2hhcnNldD11dGYtOCcpLnNldCgnQWNjZXB0JywgJ3RleHQnKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5nZXQodXJsLCB7IGhlYWRlcnMsIHJlc3BvbnNlVHlwZTogJ3RleHQnIH0pXG4gICAgICAgICAgICAgICAgLnBpcGUobWFwKChyZXMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhcnNlZDogYW55O1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VkID0gSlNPTi5wYXJzZShyZXMpO1xuICAgICAgICAgICAgICAgICAgICB9Y2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeG1sID0gbmV3IHhtbGRvbS5ET01QYXJzZXIoKS5wYXJzZUZyb21TdHJpbmcocmVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZWQgPSB0aGlzLl94bWwyanNvbih4bWwuZG9jdW1lbnRFbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VkID0gcmVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VkID8gcGFyc2VkIDogcmVzO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfc3RyaW5nVmFsdWVPZktleShrZXk6IGFueSkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcblxuICAgICAgICBpZiAoa2V5IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIGtleS5tYXAoIFxuICAgICAgICAgICAgICAgIChpdGVtOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHggPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ubWFwKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChzdWJpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdWJpdGVtLmtleS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHgucHVzaChzdWJpdGVtLmtleSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh4LmpvaW4oJy4nKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpID0gaXRlbS5pbmRleE9mKCdbJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBqID0gaXRlbS5pbmRleE9mKCddJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBrID0gaXRlbS5sZW5ndGggPiAoaiArIDEpID8gMiA6IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChpID4gMCA/IGl0ZW0uc3Vic3RyaW5nKDAsaSkgOiBqID4gMCA/IGl0ZW0uc3Vic3RyaW5nKGogKyBrKSA6IGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0ua2V5Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goaXRlbS5rZXkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goa2V5LmtleSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0LmpvaW4oJywnKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9hZGRUb1Jlc3VsdCh2YWx1ZTogYW55LCBrZXk6IHN0cmluZywgb3BlcmF0aW9uOiBhbnksIGFjdGlvbjogYW55KSB7XG4gICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLl9zdHJpbmdWYWx1ZU9mS2V5KGFjdGlvbi5wYXRoKTtcbiAgICAgICAgY29uc3Qga2V5MiA9IHRoaXMuX3N0cmluZ1ZhbHVlT2ZLZXkoa2V5KTtcbiAgICAgICAgbGV0IG9wID0gb3BlcmF0aW9uLnJlc3VsdFtwYXRoXTtcbiAgICAgICAgbGV0IGNvbXBsZXRlID0gZmFsc2U7XG4gICAgXG4gICAgICAgIGlmICghb3ApIHtcbiAgICAgICAgICAgIG9wZXJhdGlvbi5yZXN1bHRbcGF0aF0gPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3ApIHtcbiAgICAgICAgICAgIGxldCBvcGsgPSBvcFtrZXkyXTtcbiAgICAgICAgICAgIGlmIChvcGVyYXRpb25bJ3RlbXAnXSAmJlxuICAgICAgICAgICAgICAgIG9wZXJhdGlvblsndGVtcCddW2tleTJdKSB7XG4gICAgICAgICAgICAgICAgb3Bba2V5Ml0gPSBbb3Bba2V5Ml1dO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBvcGVyYXRpb25bJ3RlbXAnXTtcbiAgICAgICAgICAgIH1lbHNlIGlmIChvcGsgJiYgKG9wayBpbnN0YW5jZW9mIEFycmF5KSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBvcGsgPSBbb3BrXTtcbiAgICAgICAgICAgICAgICBvcFtrZXkyXSA9IG9waztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcFtrZXkyXSkge1xuICAgICAgICAgICAgICAgIG9wW2tleTJdLnB1c2godGhpcy5fbm9ybWFsaXplKHZhbHVlKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG9wLnB1c2godGhpcy5fbm9ybWFsaXplKHZhbHVlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgIC8vIGlmIGFscmVhZHkgYW4gYXJyYXkgcmVtZW1iZXIgaXQuXG4gICAgICAgICAgICAgICAgaWYgKCFvcGVyYXRpb25bJ3RlbXAnXSkge1xuICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb25bJ3RlbXAnXSA9IHt9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIW9wZXJhdGlvblsndGVtcCddW2tleTJdKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvblsndGVtcCddW2tleTJdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcGVyYXRpb24ucmVzdWx0W3BhdGhdW2tleTJdID0gdGhpcy5fbm9ybWFsaXplKHZhbHVlKTtcbiAgICAgICAgICAgIGNvbXBsZXRlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29tcGxldGU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfcGFjayhyZXN1bHQ6IGFueSkge1xuICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIGNvbnN0IGxpc3QgPSBbXTtcbiAgICAgICAgICAgIHJlc3VsdC5tYXAoXG4gICAgICAgICAgICAgICAgKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKHRoaXMuX3BhY2soaXRlbSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXN1bHQgPSBsaXN0O1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiByZXN1bHQgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMocmVzdWx0KTtcbiAgICAgICAgICAgIGtleXMubWFwIChcbiAgICAgICAgICAgICAgICAoa2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSByZXN1bHRba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBBcnJheSkge1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbVtrZXldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IGl0ZW1ba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHByaXZhdGUgX3RyaWdnZXJSZXN1bHQocHJvbWlzZTogYW55LCByZXN1bHQ6IGFueSkge1xuICAgICAgICBwcm9taXNlLm5leHQodGhpcy5fcGFjayhyZXN1bHQpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9zdWJxdWVyeShcbiAgICAgICAgcHJvbWlzZTogYW55LFxuICAgICAgICBwYXRoOiBhbnksXG4gICAgICAgIG9wZXJhdGlvbjogYW55LFxuICAgICAgICBhY3Rpb246IGFueSkge1xuXG4gICAgICAgIGlmIChvcGVyYXRpb24uY2FjaGVkRmlsZXNbcGF0aF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gb25lIG9mIHRoZSBrZXlzIGF0IHRoaXMgbGV2ZWwgY291bGQgYmUgcmVmZXJlbmNpbmcgdGhlIHNhbWUgZmlsZSB3aGljaFxuICAgICAgICAgICAgLy8gaXMgbm90IHlldCBmZXRjaGVkLiBuZWVkIHRvIHdhaXQgdGlsbCBpdCBpcyBhdmFpbGFibGUuXG4gICAgICAgICAgICBvcGVyYXRpb24uY2FjaGVkRmlsZXNbcGF0aF0gPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGFueT4obnVsbCk7XG4gICAgICAgICAgICB0aGlzLl9xdWVyeUl0ZXJhdGlvbihcbiAgICAgICAgICAgICAgICBvcGVyYXRpb24uY2FjaGVkRmlsZXNbcGF0aF0sXG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcGF0aDogYWN0aW9uLnBhdGgsXG4gICAgICAgICAgICAgICAgICAgIGluOiBhY3Rpb24uaW4sXG4gICAgICAgICAgICAgICAgICAgIGpvaW46IGFjdGlvbi5qb2luLFxuICAgICAgICAgICAgICAgICAgICBxdWVyeUl0ZW1zOiAoYWN0aW9uLnBhdGggaW5zdGFuY2VvZiBBcnJheSkgPyBhY3Rpb24ucGF0aC5sZW5ndGggOiAxXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBwYXRoXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gd2FpdCBmb3IgcmVzdWx0IHJhaXNlZCBhYm92ZS5cbiAgICAgICAgb3BlcmF0aW9uLmNhY2hlZEZpbGVzW3BhdGhdLnN1YnNjcmliZShcbiAgICAgICAgICAgIChzb3VyY2U6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3BrZXlpID0gYWN0aW9uLmpvaW4gPyBhY3Rpb24uam9pblthY3Rpb24ucGF0aF0gOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcGtleWkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzb3VyY2UgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZS5tYXAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdWJxdWVyeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogb3BrZXlpLnBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluOiBvcGtleWkuaW4gKyBpdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqb2luOiBvcGtleWkuam9pbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnlJdGVtczogKG9wa2V5aS5wYXRoIGluc3RhbmNlb2YgQXJyYXkpID8gb3BrZXlpLnBhdGgubGVuZ3RoIDogMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N1YnF1ZXJ5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogYWN0aW9uLmpvaW5bb3BrZXlpLnBhdGhdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW46IG9wa2V5aS5pbiArIHNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpvaW46IG9wa2V5aS5qb2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnlJdGVtczogKG9wa2V5aS5wYXRoIGluc3RhbmNlb2YgQXJyYXkpID8gb3BrZXlpLnBhdGgubGVuZ3RoIDogMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9hZGRUb1Jlc3VsdChzb3VyY2UsIGFjdGlvbi5wYXRoLCBvcGVyYXRpb24sIGFjdGlvbikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbi5xdWVyeUl0ZW1zLS07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aW9uLnF1ZXJ5SXRlbXMgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl90cmlnZ2VyUmVzdWx0KHByb21pc2UsIG9wZXJhdGlvbi5yZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb24ucXVlcnlJdGVtcy0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdHJpZ2dlclJlc3VsdChwcm9taXNlLCBvcGVyYXRpb24ucmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAoZXJyb3I6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxvZ0VuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhY3Rpb24ucXVlcnlJdGVtcy0tO1xuICAgICAgICAgICAgICAgIHRoaXMuX3RyaWdnZXJSZXN1bHQocHJvbWlzZSwgb3BlcmF0aW9uLnJlc3VsdCk7XG4gICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG4gICAgLypcbiAgICAqIEl0ZXJhdGVzIHRocm91Z2ggYSBjaGFpbiBxdWVyeS5cbiAgICAqIEBwYXJhbSBwcm9taXNlIFRoZSBwcm9taXNlIHdoaWNoIG9yaWdpbmFsIGNhbGxlciBpcyB3YWl0aW5nIGZvci5cbiAgICAqIEBwYXJhbSBvcGVyYXRpb24gZGF0YSBmb3Iga2VlcGluZyB0cmFjayBvZiB0aGUgaXRlcmF0aW9uLlxuICAgICogQHBhcmFtIGFjdGlvbiBjb250YWluczoge3BhdGg6IGN1cnJlbnQga2V5cyB0byBxdWVyeSBmb3IsIGluOiBjdXJyZW50IHF1ZXJ5IHBhdGgsIGhhbmRsZXI6IHJlc29sdmVyIG1ldGhvZH0uXG4gICAgKiBAcGFyYW0gY2FjaGVOYW1lZCBUaGUgY2FjaGVkIG5hbWUgZnJvbSBwcmV2aW91cyBpdGVyYXRpb24gaWYgYW55LlxuICAgICogQHJldHVybnMgcmV0dXJucyBub25lLlxuICAgICovXG4gICAgcHJpdmF0ZSBfcXVlcnlJdGVyYXRpb24oXG4gICAgICAgIHByb21pc2U6IEJlaGF2aW9yU3ViamVjdDxhbnk+LFxuICAgICAgICBvcGVyYXRpb246IGFueSxcbiAgICAgICAgYWN0aW9uOiBhbnksXG4gICAgICAgIGNhY2hlTmFtZWQ/OiBzdHJpbmcpIHtcblxuICAgICAgICBpZiAoIWFjdGlvbi5oYW5kbGUpIHtcbiAgICAgICAgICAgIGFjdGlvbi5oYW5kbGVyID0gKG5vZGU6IGFueSwgcGF0aDogc3RyaW5nLCB2YWx1ZTogYW55KSA9PiB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNlbGVjdChhY3Rpb24ucGF0aCwgYWN0aW9uLmluLCBhY3Rpb24uaGFuZGxlcikuc3Vic2NyaWJlKFxuICAgICAgICAgICAgKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2FjaGVOYW1lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVzdWx0IG9mIG4tdGggbGV2ZWwgY2FsbCB0byBiZSBwbGFjZWQgb24gcHJldmlvdXMgbGV2ZWwgY2FjaGUgcmVmZXJlbmNlLlxuICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLmNhY2hlZEZpbGVzW2NhY2hlTmFtZWRdLm5leHQoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3BlcmF0aW9uYWxLZXkgPSBhY3Rpb24uam9pbiA/IGFjdGlvbi5qb2luW2FjdGlvbi5wYXRoXSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob3BlcmF0aW9uYWxLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXNzdW1wdGlvbiBpcyB0aGUgcmVzdWx0aW5nIGxpc3QgaXMgYSBsaXN0IG9mIGZpbGUgcGF0aHMuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEubWFwKCAoY29udGVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGF0aCA9IGNvbnRlbnRbJyN0ZXh0J10gPyBjb250ZW50WycjdGV4dCddIDogY29udGVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N1YnF1ZXJ5KHByb21pc2UsIHBhdGgsIG9wZXJhdGlvbiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IG9wZXJhdGlvbmFsS2V5LnBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW46IG9wZXJhdGlvbmFsS2V5LmluICsgY29udGVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqb2luOiBvcGVyYXRpb25hbEtleS5qb2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5SXRlbXM6IChvcGVyYXRpb25hbEtleS5wYXRoIGluc3RhbmNlb2YgQXJyYXkpID8gb3BlcmF0aW9uYWxLZXkucGF0aC5sZW5ndGggOiAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbm8gbW9yZSBxdWVyeSBpbiB0aGUgY2hhaW4uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbi5xdWVyeUl0ZW1zLS07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhY3Rpb24ucXVlcnlJdGVtcyA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID1vcGVyYXRpb24ucmVzdWx0ID8gb3BlcmF0aW9uLnJlc3VsdCA6IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdHJpZ2dlclJlc3VsdChwcm9taXNlLCBPYmplY3Qua2V5cyhvcGVyYXRpb24ucmVzdWx0KS5sZW5ndGggPyBvcGVyYXRpb24ucmVzdWx0IDogZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBkYXRhID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGRhdGEpLm1hcCggKGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjb250ZW50ID0gZGF0YVtrZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvcGVyYXRpb25hbEtleSA9IGFjdGlvbi5qb2luID8gYWN0aW9uLmpvaW5ba2V5XTogdW5kZWZpbmVkO1xuICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29udGVudCAmJiBjb250ZW50Lmxlbmd0aCAmJiBvcGVyYXRpb25hbEtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3VicXVlcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IG9wZXJhdGlvbmFsS2V5LnBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluOiBvcGVyYXRpb25hbEtleS5pbiArIGNvbnRlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5SXRlbXM6IChvcGVyYXRpb25hbEtleS5wYXRoIGluc3RhbmNlb2YgQXJyYXkpID8gb3BlcmF0aW9uYWxLZXkucGF0aC5sZW5ndGggOiAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbi5xdWVyeUl0ZW1zLS07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29udGVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghb3BlcmF0aW9uLnJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb24ucmVzdWx0ID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcGVyYXRpb24ucmVzdWx0IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLnJlc3VsdC5wdXNoKGNvbnRlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5yZXN1bHRba2V5XSA9IGNvbnRlbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGlvbi5xdWVyeUl0ZW1zID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdHJpZ2dlclJlc3VsdChwcm9taXNlLCBPYmplY3Qua2V5cyhvcGVyYXRpb24ucmVzdWx0KS5sZW5ndGggPyBvcGVyYXRpb24ucmVzdWx0IDogZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uLnF1ZXJ5SXRlbXMtLTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aW9uLnF1ZXJ5SXRlbXMgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKG9wZXJhdGlvbi5yZXN1bHQpLmxlbmd0aCA9PT0gMCAmJiBkYXRhICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5yZXN1bHQgPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3RyaWdnZXJSZXN1bHQocHJvbWlzZSwgb3BlcmF0aW9uLnJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgKGVycm9yOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBwcm9taXNlLmVycm9yKCdmYWlsZWQgdG8gcXVlcnkgJyArIGFjdGlvbi5wYXRoKTtcbiAgICAgICAgICAgICAgICBhY3Rpb24ucXVlcnlJdGVtcy0tO1xuICAgICAgICAgICAgICAgIGlmIChhY3Rpb24ucXVlcnlJdGVtcyA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl90cmlnZ2VyUmVzdWx0KHByb21pc2UsIG9wZXJhdGlvbi5yZXN1bHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9tYWtlQXJndW1lbnRzKGtleTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGxpc3QgPSBrZXkuc3BsaXQoJy4nKTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgICAgIGxpc3QubWFwKCAoaXRlbSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgYiA9IGl0ZW0uaW5kZXhPZignWycpO1xuICAgICAgICAgICAgaWYgKGIgPCAwKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBrZXk6IGl0ZW0sXG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRlZDogWyhkYXRhKSA9PiB0cnVlXVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgc3RyID0gaXRlbS5zdWJzdHJpbmcoYiArIDEsIGl0ZW0ubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICAgICAgY29uc3Qgdkxpc3QgPSBzdHIuc3BsaXQoJ11bJyk7XG4gICAgICAgICAgICAgICAgY29uc3Qgb2JqZWN0ID0ge1xuICAgICAgICAgICAgICAgICAgICBrZXk6IGl0ZW0uc3Vic3RyaW5nKDAsYiksXG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRlZDogWyhkYXRhKSA9PiB0cnVlXVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgdkxpc3QubWFwKCBcbiAgICAgICAgICAgICAgICAgICAgKGZpbHRlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyID0gZmlsdGVyLnJlcGxhY2UoL1xcYC9nLCAnLicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyID0gZmlsdGVyLnJlcGxhY2UoL1xcQC9nLCAnZGF0YScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpbHRlci5pbmRleE9mKCdvcmRlci1ieTonKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXJnOiBhbnkgPSBmaWx0ZXIuc3Vic3RyaW5nKGZpbHRlci5pbmRleE9mKCdvcmRlci1ieTonKSArIDEwKS50cmltKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXJnbGlzdCA9IGFyZy5zcGxpdCgnficpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGFyZ2xpc3RbMF0udHJpbSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9yZGVyPSBhcmdsaXN0WzFdID8gYXJnbGlzdFsxXS50cmltKCkudG9Mb3dlckNhc2UoKTogJ2FzYyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0Wydzb3J0J10gPSBmdW5jdGlvbiAoYXJyYXk6IGFueSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBfdmFsdWVPZiA9IChrZXk6IHN0cmluZywgcDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXkuc3BsaXQoJy4nKS5tYXAoICh4KSA9PiB7cCA9IHBbeF19KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhcnJheS5zb3J0KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oYTogYW55LGI6IGFueSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZmxhZyA9X3ZhbHVlT2Yoa2V5LCBhKSA+IF92YWx1ZU9mKGtleSwgYik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZsYWcgPyAob3JkZXIgPT09ICdhc2MnID8gMTogLTEpIDogKG9yZGVyID09PSAnYXNjJyA/IC0xOiAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyID0gJ3JldHVybiBmdW5jdGlvbiAoZGF0YSkgeyB2YXIgeCA9IGZhbHNlOyB0cnl7IHggPSAoJyArIGZpbHRlciArICcpOyB9Y2F0Y2goZSl7fSByZXR1cm4geDt9JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RbJ3ZhbGlkYXRlZCddLnB1c2goIG5ldyBGdW5jdGlvbihmaWx0ZXIpKCkgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gob2JqZWN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfcHJlcGFyZUpzb25QYXRoKHBhdGg6IGFueSkge1xuICAgICAgICBsZXQgcmVzdWx0OiBhbnk7XG4gICAgICAgIGlmIChwYXRoIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IFtdO1xuICAgICAgICAgICAgcGF0aC5tYXAoXG4gICAgICAgICAgICAgICAgKGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeCA9IGkucmVwbGFjZSgvKFtcXFsoXSkoLis/KShbXFxdKV0pL2csIChtYXRjaCwgcDEsIHAyLCBwMywgb2Zmc2V0LCBzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcDEgKyBwMi5yZXBsYWNlKC9cXC4vZywnYCcpICsgcDM7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLl9tYWtlQXJndW1lbnRzKHgpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGF0aCA9IHBhdGggPyBwYXRoIDogJyc7XG4gICAgICAgICAgICBjb25zdCB4ID0gcGF0aC5yZXBsYWNlKC8oW1xcWyhdKSguKz8pKFtcXF0pXSkvZywgKG1hdGNoLCBwMSwgcDIsIHAzLCBvZmZzZXQsIHMpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcDEgKyBwMi5yZXBsYWNlKC9cXC4vZywnYCcpICsgcDM7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuX21ha2VBcmd1bWVudHMoeCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgXG5cbiAgICAvKlxuICAgICogV2lsbCBjb252ZXJ0IHRoZSB4bWwgaW50byBhIGpzb24uXG4gICAgKiBAcGFyYW0geG1sIFhNTCB0byBiZSBjb252ZXJ0ZWQuXG4gICAgKiBAcmV0dXJucyByZXR1cm5zIGNvbnZlcnRlZCBKU09OLlxuICAgICovXG4gICAgcHJpdmF0ZSBfeG1sMmpzb24oeG1sOiBhbnkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBvYmogPSB7fTtcbiAgICAgICAgICAgIGlmICh4bWwuYXR0cmlidXRlcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGMgPSB4bWwuYXR0cmlidXRlcztcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhdHRyID0gY1tpXTtcbiAgICAgICAgICAgICAgICBvYmpbYXR0ci5uYW1lXSA9IGF0dHIudmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHhtbC5jaGlsZE5vZGVzICYmIHhtbC5jaGlsZE5vZGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB4bWwuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSB4bWwuY2hpbGROb2Rlc1tpXTtcbiAgICAgICAgICAgICAgICBjb25zdCBub2RlTmFtZSA9IGl0ZW0ubm9kZU5hbWU7XG5cbiAgICAgICAgICAgICAgICBpZiAob2JqW25vZGVOYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZyYWdtZW50ID0gdGhpcy5feG1sMmpzb24oaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmcmFnbWVudCkge1xuICAgICAgICAgICAgICAgICAgICBvYmpbbm9kZU5hbWVdID0gZnJhZ21lbnQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChvYmpbbm9kZU5hbWVdLnB1c2ggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvbGQgPSBvYmpbbm9kZU5hbWVdO1xuXG4gICAgICAgICAgICAgICAgICAgIG9ialtub2RlTmFtZV0gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgb2JqW25vZGVOYW1lXS5wdXNoKG9sZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGZyYWdtZW50ID0gdGhpcy5feG1sMmpzb24oaXRlbSk7XG4gICAgICAgICAgICAgICAgaWYgKGZyYWdtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIG9ialtub2RlTmFtZV0ucHVzaChmcmFnbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0geG1sLnRleHRDb250ZW50LnRyaW0oKS5yZXBsYWNlKC8oPzpcXHJcXG58XFxyfFxcbnxcXHQpL2csICcnKTtcbiAgICAgICAgICAgIG9iaiA9IHRleHQubGVuZ3RoID8gdGV4dCA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmxvZ0VuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlLm1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLypcbiAgICAqIFdpbGwgZG8gYSBjaGFpbiBxdWVyeSBvbiBzcGVjaWZpZWQgcGF0aHMgZnJvbSByZW1vdGUgbG9jYXRpb24uXG4gICAgKiBAcGFyYW0gY2hhaW5RdWVyeSBBIEpzb24gc3RydWN0dXJlIHdpdGggcGF0aHMuIEVhY2ggcGF0aCB3aWxsIGNvbnRhaW4gYSBjaGFpbiBvZiBpbnN0cnVjdGlvbnMuXG4gICAgKiBFYWNoIGluc3RydWN0aW9uIHdpbGwgaGF2ZSBhICdpbicgdG8gYSBmaWxlIGFuZCBhIHBhdGggdG8gc2VhcmNoIG9uIGl0IChzZWUuIHNlbGVjdCgpKS4gb25jZSB0aGVcbiAgICAqIHJlc3VsdCBpcyBpbiwgdGhlIG5leHQgaW5zdHJ1Y3Rpb24gaW4gdGhlIHBhdGggY2hhaW4gd2lsbCBiZSB0cmlnZ2VkLiBBZnRlciB0aGUgcGF0aCB0aHJvdWdoIGFsbFxuICAgICogY2hhaW5lZCBwYXRocyBpcyBjb21wbGV0ZWQsIHJlc3VsdGluZyB2YWx1ZSB3aWxsIGJlIHB1dCBpbiBhIGpzb24gd2hlcmUgaXRzIHBhdGggaXMgdGhlIG9yaWdpbmFsXG4gICAgKiBqc29uIHBhdGggYW5kIGl0cyB2YWx1ZSB3aWxsIGJlIHRoZSByZXN1bHRpbmcgdmFsdWUuXG4gICAgKlxuICAgICogdGhpcyBpcyBub3QgZnVsbHkgdGVzdGVkLiBjYWxsZXIgc2hvdWxkIHBhc3Mgc29tZXRoaW5nIGxpa2VcbiAgICAqIHtwYXRoOiBbcGF0aDEscGF0aDJdLCBpbjogJ3NvbWV0aGluZyBvciBibGFuaycsIGsxOiB7cGF0aDogcGF0aDMsIGluOiAnc29tZXRoaW5nIG9yIHBsYW5rJywgY2xhdXNlOiBmdW5jdGlvbn19XG4gICAgKiBpZiBwYXRoMSBvciBwYXRoMiBvciBwYXRoMyBhcmUgZm91bmQgYXQgdGhlIHJvb3Qgb2JqZWN0LCBhIGNoYWluIHJlYWN0aW9uIHRvIGZldGNoIGRlZXAgd2lsbCBmb2xsb3cuIEFuXG4gICAgKiBvcHRpb25hbCBjbGF1c2Ugd2lsbCBoZWxwIHJlc29sdmUgY29tcGxleCBzaXR1YXRpb25zLlxuICAgICpcbiAgICAqIEByZXR1cm5zIHJldHVybnMgYW4gb2JzZXJ2YWJsZS4gdGhlIGNhbGxlciBzaG91bGQgc3Vic2NyaWJlIHRvIHRoaXMgaW4gb3JkZXIgdG8gcmVjZWl2ZSB0aGUgcmVzdWx0LlxuICAgICovXG4gICAgY2hhaW5TZWxlY3QoY2hhaW5RdWVyeTogYW55KTogQmVoYXZpb3JTdWJqZWN0PGFueT4ge1xuICAgICAgICBjb25zdCBzaXplID0gKGNoYWluUXVlcnkucGF0aCBpbnN0YW5jZW9mIEFycmF5KSA/ICBjaGFpblF1ZXJ5LnBhdGgubGVuZ3RoIDogMTtcbiAgICAgICAgY29uc3Qgb3BlcmF0aW9uID0ge2NhY2hlZEZpbGVzOiB7fSwgcmVzdWx0OiB7fX07XG4gICAgICAgIGNvbnN0IGRhdGFTdG9yZSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8YW55PihudWxsKTtcblxuICAgICAgICB0aGlzLl9xdWVyeUl0ZXJhdGlvbihcbiAgICAgICAgICAgIGRhdGFTdG9yZSxcbiAgICAgICAgICAgIG9wZXJhdGlvbixcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBwYXRoOiBjaGFpblF1ZXJ5LnBhdGgsXG4gICAgICAgICAgICAgICAgaW46IGNoYWluUXVlcnkuaW4sXG4gICAgICAgICAgICAgICAgam9pbjogY2hhaW5RdWVyeS5qb2luLFxuICAgICAgICAgICAgICAgIHF1ZXJ5SXRlbXM6IHNpemVcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIGRhdGFTdG9yZTtcbiAgICB9XG5cbiAgICAvKlxuICAgICogV2lsbCBncm91cCBmaWxlIHBhdGhzIGlmIHRoZXkgYXJlIHNpbWlsYXIgdG8gYXZvaWQgbXVsdGlwbGUgY2FsbHMuXG4gICAgKiBAcGFyYW0gbGlzdCBBIGxpc3Qgb2YgSnNvbiB7cGF0aHMsIGlufSBzdHJ1Y3R1cmVzLlxuICAgICogQHBhcmFtIGNsYXVzZSBBIG1ldGhvZCBieSB3aGljaCB2YWx1ZShzKSBmb3IgdGhlIHBhdGgocykgY291bGQgYmUgZXZhbHVhdGVkLiB0aGUgY2FsbGVyIHdvdWxkIGV2YWx1YXRlIHRoZSB2YWx1ZSBmb3IgYSBnaXZlbiBhdHRyaWJ1dGUuXG4gICAgKiBAcmV0dXJucyByZXR1cm5zIGFuIG9ic2VydmFibGUuIHRoZSBjYWxsZXIgc2hvdWxkIHN1YnNjcmliZSB0byB0aGlzIGluIG9yZGVyIHRvIHJlY2VpdmUgdGhlIHJlc3VsdC5cbiAgICAqL1xuICAgIGFycmF5U2VsZWN0KFxuICAgICAgICBsaXN0OiBhbnksXG4gICAgICAgIGNsYXVzZT86IGNsYXVzZUV2YWx1YXRvcik6IEJlaGF2aW9yU3ViamVjdDxhbnk+ICB7XG4gICAgICAgIGNvbnN0IGdyb3VwZWRMaXN0ID0ge307XG4gICAgICAgIGxpc3QubWFwKCAoaXRlbTogYW55KSA9PiB7XG4gICAgICAgICAgICBpZiAoZ3JvdXBlZExpc3RbaXRlbS5pbl0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGdyb3VwZWRMaXN0W2l0ZW0uaW5dID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBncm91cGVkTGlzdFtpdGVtLmluXS5wdXNoKGl0ZW0ucGF0aCk7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBkYXRhU3RvcmUgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGFueT4obnVsbCk7XG5cbiAgICAgICAgT2JqZWN0LmtleXMoZ3JvdXBlZExpc3QpLm1hcCAoICh1cmwpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0KGdyb3VwZWRMaXN0W3VybF0sIHVybCwgY2xhdXNlKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAgICAgKGRhdGE6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVN0b3JlLm5leHQoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIChlcnJvcjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFTdG9yZS5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBkYXRhU3RvcmU7XG4gICAgfVxuXG4gICAgLypcbiAgICAqIFdpbGwgcXVlcnkgcGF0aCBmcm9tIGEgcmVtb3RlIGxvY2F0aW9uIHF1YWxpZmllZCB0aHJvdWdoIGFuIG9wdGlvbmFsIGNsYXVzZSBmdW5jdGlvbiB0aGF0XG4gICAgKiBldmFsdWF0ZXMsIGZpbHRlcnMsIG9yIHNvcnRzIHRoZSByZXN1bCBvZiB0aGUgcXVlcnkuXG4gICAgKiBAcGFyYW0gcGF0aCBBIGEgc2luZ2xlIEpTT04gcGF0aCBvciBsaXN0IG9mIHBhdGhzIHRvIHNlbGVjdCAoaS5lLiwgJ2EuYi5jJylcbiAgICAqIEBwYXJhbSBmcm9tIEEgcmVmZXJlbmNlIFVSTCB0byBhIHJlbW90ZSBzb3VyY2UuXG4gICAgKiBAcGFyYW0gY2xhdXNlIEEgbWV0aG9kIGJ5IHdoaWNoIHZhbHVlKHMpIGZvciB0aGUgcGF0aChzKSBjb3VsZCBiZSBldmFsdWF0ZWQuIHRoZSBjYWxsZXIgd291bGQgZXZhbHVhdGUgdGhlIHZhbHVlIGZvciBhIGdpdmVuIGF0dHJpYnV0ZS5cbiAgICAqIEByZXR1cm5zIHJldHVybnMgYW4gb2JzZXJ2YWJsZS4gdGhlIGNhbGxlciBzaG91bGQgc3Vic2NyaWJlIHRvIHRoaXMgaW4gb3JkZXIgdG8gcmVjZWl2ZSB0aGUgcmVzdWx0LlxuICAgICovXG4gICAgc2VsZWN0KFxuICAgICAgICBwYXRoOiBhbnksXG4gICAgICAgIGZyb206IHN0cmluZyxcbiAgICAgICAgY2xhdXNlPzogY2xhdXNlRXZhbHVhdG9yKTogQmVoYXZpb3JTdWJqZWN0PGFueT4ge1xuXG4gICAgICAgIGNvbnN0IGRhdGFTdG9yZSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8YW55PihudWxsKTtcblxuICAgICAgICB0aGlzLl9nZXQoZnJvbSkuc3Vic2NyaWJlKFxuICAgICAgICAgICAgKGRhdGE6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCByZXN1bHQ6IGFueTtcbiAgICAgICAgICAgICAgICBjb25zdCBqcGF0aCA9IHRoaXMuX3ByZXBhcmVKc29uUGF0aChwYXRoKTtcblxuICAgICAgICAgICAgICAgIGlmICghY2xhdXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsYXVzZSA9IChub2RlOiBhbnksIHBhdGg6IHN0cmluZywgdmFsdWU6IGFueSkgPT4gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChwYXRoIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0ge307XG4gICAgICAgICAgICAgICAgICAgIGpwYXRoLm1hcCgocGF0aEl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHkgPSB0aGlzLl92YWx1ZU9mSnNvblBhdGgocGF0aEl0ZW0sIGRhdGEsIGNsYXVzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoeSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBrZXkgPSB0aGlzLl9zdHJpbmdWYWx1ZU9mS2V5KHBhdGhJdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IHk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMocmVzdWx0KS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuX3ZhbHVlT2ZKc29uUGF0aChqcGF0aCwgZGF0YSwgY2xhdXNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICBkYXRhU3RvcmUubmV4dChyZXN1bHQpO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YVN0b3JlLmVycm9yKCdSZXN1bHQgbm90IGZvdW5kIGZvciAnICsgcGF0aCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIChlcnJvcjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgZGF0YVN0b3JlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIGRhdGFTdG9yZTtcbiAgICB9XG59XG4iXX0=