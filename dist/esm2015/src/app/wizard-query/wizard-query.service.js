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
export class WizardQueryService {
    /**
     * @param {?} http
     */
    constructor(http) {
        this.http = http;
        this.SERVICE_PATH = '';
        this.logEnabled = false;
    }
    /**
     * @return {?}
     */
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
    /**
     * @param {?} value
     * @param {?} deepXml
     * @return {?}
     */
    _normalize(value, deepXml) {
        if (value instanceof Array) {
            /** @type {?} */
            const result = [];
            value.map((item) => {
                result.push(this._normalize(item, deepXml));
            });
            value = result;
        }
        else if (typeof value === 'object') {
            /** @type {?} */
            let items = Object.keys(value);
            if (items.length === 1 && !(value[items[0]] instanceof Array)) {
                if (value['#text']) {
                    value = value['#text'];
                }
                else if (value['#cdata-section']) {
                    value = value['#cdata-section'];
                    if (deepXml) {
                        try {
                            /** @type {?} */
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
                /** @type {?} */
                const result = {};
                items.map((item) => {
                    result[item] = this._normalize(value[item], deepXml);
                });
                value = result;
            }
        }
        return value;
    }
    /**
     * @param {?} path
     * @param {?} data
     * @param {?} as
     * @param {?} deepXml
     * @param {?=} clause
     * @return {?}
     */
    _valueOfJsonPath(path, data, as, deepXml, clause) {
        /** @type {?} */
        let result;
        /** @type {?} */
        let x = this._normalize(data, deepXml);
        path.map((subkey) => {
            /** @type {?} */
            let node = x;
            if (node && node instanceof Array) {
                /** @type {?} */
                const t = [];
                if (subkey.sort) {
                    node = subkey.sort(node);
                }
                node.map((item) => {
                    if (typeof item === 'object') {
                        if (subkey.key.length) {
                            x = subkey.key.length ? item[subkey.key] : item;
                            if (x && subkey.validated) {
                                /** @type {?} */
                                let r = true;
                                subkey.validated.map(v => {
                                    /** @type {?} */
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
                                /** @type {?} */
                                let r = true;
                                subkey.validated.map(v => {
                                    /** @type {?} */
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
                    /** @type {?} */
                    const t = [];
                    if (subkey.sort) {
                        x = subkey.sort(x);
                    }
                    x.map((item) => {
                        if (subkey.validated) {
                            /** @type {?} */
                            let r = true;
                            subkey.validated.map(v => {
                                /** @type {?} */
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
                        /** @type {?} */
                        let r = true;
                        subkey.validated.map(v => {
                            /** @type {?} */
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
    /**
     * @param {?} path
     * @return {?}
     */
    _get(path) {
        /** @type {?} */
        const url = this.SERVICE_PATH + path;
        /** @type {?} */
        const dot = path.lastIndexOf('.');
        /** @type {?} */
        const ext = dot < 0 ? undefined : path.toLowerCase().substr(dot);
        /** @type {?} */
        const headers = new HttpHeaders();
        /** @type {?} */
        let result;
        headers.set('Access-Control-Allow-Origin', '*');
        if (ext === '.xml') {
            headers.set('Content-Type', 'text; charset=utf-8').set('Accept', 'text');
            result = this.http.get(url, { headers, responseType: 'text' })
                .pipe(map((res) => {
                /** @type {?} */
                const xml = new xmldom.DOMParser().parseFromString(res);
                /** @type {?} */
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
                /** @type {?} */
                let parsed;
                try {
                    parsed = JSON.parse(res);
                }
                catch (e) {
                    try {
                        /** @type {?} */
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
    /**
     * @param {?} key
     * @return {?}
     */
    _stringValueOfKey(key) {
        /** @type {?} */
        let result = [];
        if (key instanceof Array) {
            key.map((item) => {
                if (item instanceof Array) {
                    /** @type {?} */
                    let x = [];
                    item.map((subitem) => {
                        if (subitem.key.length) {
                            x.push(subitem.key);
                        }
                    });
                    result.push(x.join('.'));
                }
                else if (typeof item === 'string') {
                    /** @type {?} */
                    const i = item.indexOf('[');
                    /** @type {?} */
                    const j = item.indexOf(']');
                    /** @type {?} */
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
    /**
     * @param {?} value
     * @param {?} key
     * @param {?} operation
     * @param {?} action
     * @return {?}
     */
    _addToResult(value, key, operation, action) {
        /** @type {?} */
        const path = this._stringValueOfKey(action.path);
        /** @type {?} */
        const key2 = this._stringValueOfKey(key);
        /** @type {?} */
        let op = operation.result[path];
        /** @type {?} */
        let complete = false;
        if (!op) {
            operation.result[path] = {};
        }
        if (op) {
            /** @type {?} */
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
    /**
     * @param {?} result
     * @return {?}
     */
    _pack(result) {
        if (result instanceof Array) {
            /** @type {?} */
            const list = [];
            result.map((item) => {
                list.push(this._pack(item));
            });
            result = list;
        }
        else if (typeof result === 'object') {
            /** @type {?} */
            const keys = Object.keys(result);
            keys.map((key) => {
                /** @type {?} */
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
    /**
     * @param {?} promise
     * @param {?} as
     * @param {?} result
     * @return {?}
     */
    _triggerResult(promise, as, result) {
        /** @type {?} */
        const x = this._pack(result);
        /** @type {?} */
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
    /**
     * @param {?} promise
     * @param {?} path
     * @param {?} operation
     * @param {?} action
     * @return {?}
     */
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
                /** @type {?} */
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
    /**
     * @param {?} promise
     * @param {?} operation
     * @param {?} action
     * @param {?=} cacheNamed
     * @return {?}
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
                        /** @type {?} */
                        const operationalKey = action.join ? action.join[action.path] : undefined;
                        if (operationalKey) {
                            // assumption is the resulting list is a list of file paths.
                            data.map((content) => {
                                /** @type {?} */
                                const path = content['#text'] ? content['#text'] : content;
                                /** @type {?} */
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
                                /** @type {?} */
                                const result = operation.result ? operation.result : {};
                                operation.as = this._triggerResult(promise, operation.as, Object.keys(operation.result).length ? operation.result : data);
                            }
                        }
                    }
                    else if (typeof data === 'object') {
                        Object.keys(data).map((key) => {
                            /** @type {?} */
                            const content = data[key];
                            /** @type {?} */
                            const operationalKey = action.join ? action.join[key] : undefined;
                            if (content && content.length && operationalKey) {
                                /** @type {?} */
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
    /**
     * @param {?} key
     * @return {?}
     */
    _makeArguments(key) {
        /** @type {?} */
        const list = key.split('.');
        /** @type {?} */
        const result = [];
        list.map((item) => {
            /** @type {?} */
            const b = item.indexOf('[');
            if (b < 0) {
                result.push({
                    key: item,
                    validated: [(data, as) => true]
                });
            }
            else {
                /** @type {?} */
                let str = item.substring(b + 1, item.length - 1);
                /** @type {?} */
                const vList = str.split('][');
                /** @type {?} */
                const object = {
                    key: item.substring(0, b),
                    validated: [(data, as) => true]
                };
                vList.map((filter) => {
                    filter = filter.replace(/\`/g, '.');
                    filter = filter.replace(/\@/g, 'data');
                    if (filter.indexOf('order-by:') > -1) {
                        /** @type {?} */
                        const arg = filter.substring(filter.indexOf('order-by:') + 10).trim();
                        /** @type {?} */
                        const arglist = arg.split('~');
                        /** @type {?} */
                        const key = arglist[0].trim();
                        /** @type {?} */
                        const order = arglist[1] ? arglist[1].trim().toLowerCase() : 'asc';
                        object['sort'] = function (array) {
                            /** @type {?} */
                            const _valueOf = (key, p) => {
                                key.split('.').map((x) => { p = p[x]; });
                                return p;
                            };
                            return array.sort(function (a, b) {
                                /** @type {?} */
                                const flag = _valueOf(key, a) > _valueOf(key, b);
                                return flag ? (order === 'asc' ? 1 : -1) : (order === 'asc' ? -1 : 1);
                            });
                        };
                    }
                    else {
                        /** @type {?} */
                        const t = filter.indexOf('&&') > 0 || filter.indexOf('||') > 0;
                        /** @type {?} */
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
    /**
     * @param {?} path
     * @return {?}
     */
    _handleSpecialCharacters(path) {
        /** @type {?} */
        let result = [];
        path.split(']').map((item) => {
            /** @type {?} */
            const bindex = item.indexOf('[');
            if (bindex >= 0) {
                /** @type {?} */
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
    /**
     * @param {?} path
     * @return {?}
     */
    _prepareJsonPath(path) {
        /** @type {?} */
        let result;
        if (path instanceof Array) {
            result = [];
            path.map((i) => {
                /** @type {?} */
                const x = this._handleSpecialCharacters(i);
                result.push(this._makeArguments(x));
            });
        }
        else {
            /** @type {?} */
            const x = this._handleSpecialCharacters(path);
            result = this._makeArguments(x);
        }
        return result;
    }
    /**
     * @param {?} path
     * @param {?} from
     * @param {?} deepXml
     * @param {?} as
     * @param {?=} clause
     * @return {?}
     */
    _select(path, from, deepXml, as, clause) {
        /** @type {?} */
        const dataStore = new BehaviorSubject(null);
        this._get(from).subscribe((data) => {
            /** @type {?} */
            let result;
            /** @type {?} */
            const jpath = this._prepareJsonPath(path);
            if (!clause) {
                clause = (node, path, value) => value;
            }
            if (path instanceof Array) {
                result = {};
                jpath.map((pathItem) => {
                    /** @type {?} */
                    const y = this._valueOfJsonPath(pathItem, data, as, deepXml, clause);
                    if (y) {
                        /** @type {?} */
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
    /**
     * @param {?} xml
     * @return {?}
     */
    _xml2json(xml) {
        try {
            /** @type {?} */
            let obj = {};
            if (xml.attributes) {
                /** @type {?} */
                const c = xml.attributes;
                for (let i = 0; i < c.length; i++) {
                    /** @type {?} */
                    const attr = c[i];
                    obj[attr.name] = attr.value;
                }
            }
            if (xml.childNodes && xml.childNodes.length) {
                for (let i = 0; i < xml.childNodes.length; i++) {
                    /** @type {?} */
                    const item = xml.childNodes[i];
                    /** @type {?} */
                    const nodeName = item.nodeName;
                    if (obj[nodeName] === undefined) {
                        /** @type {?} */
                        const fragment = this._xml2json(item);
                        if (fragment) {
                            obj[nodeName] = fragment;
                        }
                    }
                    else {
                        if (obj[nodeName].push === undefined) {
                            /** @type {?} */
                            const old = obj[nodeName];
                            obj[nodeName] = [];
                            obj[nodeName].push(old);
                        }
                        /** @type {?} */
                        const fragment = this._xml2json(item);
                        if (fragment) {
                            obj[nodeName].push(fragment);
                        }
                    }
                }
            }
            else {
                /** @type {?} */
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
    /**
     * @param {?} chainQuery
     * @return {?}
     */
    chainSelect(chainQuery) {
        /** @type {?} */
        const size = (chainQuery.path instanceof Array) ? chainQuery.path.length : 1;
        /** @type {?} */
        const operation = { cachedFiles: {}, as: {}, result: {} };
        /** @type {?} */
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
    /**
     * @param {?} list
     * @param {?=} clause
     * @return {?}
     */
    arraySelect(list, clause) {
        /** @type {?} */
        const groupedList = {};
        list.map((item) => {
            if (groupedList[item.in] === undefined) {
                groupedList[item.in] = [];
            }
            groupedList[item.in].push({ path: item.path, deepXml: item.deepXml });
        });
        /** @type {?} */
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
    /**
     * @param {?} path
     * @param {?} from
     * @param {?} deepXml
     * @param {?=} clause
     * @return {?}
     */
    select(path, from, deepXml, clause) {
        return this._select(path, from, deepXml, undefined, clause);
    }
}
WizardQueryService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
WizardQueryService.ctorParameters = () => [
    { type: HttpClient }
];
if (false) {
    /** @type {?} */
    WizardQueryService.prototype.SERVICE_PATH;
    /** @type {?} */
    WizardQueryService.prototype.logEnabled;
    /** @type {?} */
    WizardQueryService.prototype.http;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLXF1ZXJ5LnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly93aXphcmQtcXVlcnkvIiwic291cmNlcyI6WyJzcmMvYXBwL3dpemFyZC1xdWVyeS93aXphcmQtcXVlcnkuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBcUNBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLFVBQVUsRUFBRSxXQUFXLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUU3RCxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDbkMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUNyQyxPQUFPLEtBQUssTUFBTSxNQUFNLFFBQVEsQ0FBQzs7OztBQVdqQyxNQUFNOzs7O0lBS0YsWUFDVTtRQUFBLFNBQUksR0FBSixJQUFJOzRCQUpRLEVBQUU7MEJBQ0osS0FBSztLQU14Qjs7OztJQUVPLGdCQUFnQjtRQUNwQixNQUFNLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7U0FvR04sQ0FBQzs7Ozs7OztJQVNFLFVBQVUsQ0FBQyxLQUFVLEVBQUUsT0FBZ0I7UUFDM0MsRUFBRSxDQUFDLENBQUMsS0FBSyxZQUFZLEtBQUssQ0FBQyxDQUFDLENBQUM7O1lBQ3pCLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQztZQUNsQixLQUFLLENBQUMsR0FBRyxDQUFFLENBQUMsSUFBSSxFQUFFLEVBQUU7Z0JBQ2hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQzthQUMvQyxDQUFDLENBQUM7WUFDSCxLQUFLLEdBQUcsTUFBTSxDQUFDO1NBQ2xCO1FBQUMsSUFBSSxDQUFD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LENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQzFCLENBQ0osQ0FBQztTQUNMLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxTQUFTLENBQUM7S0FDcEI7Ozs7Ozs7O0lBV0QsTUFBTSxDQUNGLElBQVMsRUFDVCxJQUFZLEVBQ1osT0FBZ0IsRUFDaEIsTUFBd0I7UUFFeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0tBQy9EOzs7WUE3OEJKLFVBQVU7Ozs7WUFkSCxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiogUXVlcnkgc2VydmljZSBwcm92aWRlcyBhIHdheSB0byBxdWVyeSBhIHJlbW90ZSBKU09OIG9yIFhNTCBmaWxlLiBJdCBjYW4gYmUgdXNlZCBpbiBmb2xsb3dpbmcgd2F5cy5cbipcbiogMSkgV2l0aCBzZWxlY3QoKSBtZXRob2QsIGEgc2luZ2xlIHBhdGggb3IgYSBsaXN0IG9mIHBhdGhzIGNhbiBiZSBnaXZlbi4gZWFjaCBwYXRoIHdpbGwgYmUgYSBqc29uIHF1YWxpZnlpbmdcbiogcGF0aCB0byBhbiBlbmQgbm9kZSAoaS5lLiwgJ2Jvb2tzLmJvb2sudGl0bGUnKS4gSWYgbXVsdGlwbGUgcGF0aHMgYXJlIHN1cHBsaWVkLCBxdWVyeSByZXN1bHQgd2lsbCBiZSBhIGpzb25cbiogb2JqZWN0IHdoZXJlIGVhY2ggYXR0cmlidXRlIHdpbGwgYmUgYSBnaXZlbiBxdWVyeSBwYXRoIGFuZCBpdHMgdmFsdWUgd2lsbCBiZSBxdWVyeSByZXN1bHQgZm9yIHRoYXQgcGF0aC5cbiogRm9yIGV4YW1wbGU6XG4qIHNlbGVjdChbJ2Jvb2tzLmJvb2sudGl0bGUnLCAnYm9va3MuYm9vay5hdXRob3InXSwgJy9leGFtcGxlMS54bWwnLCBmYWxzZSlcbiogd2lsbCByZXN1bHQgaW4geydib29rcy5ib29rLnRpdGxlJzogW10sICdib29rcy5ib29rLmF1dGhvcic6IFtdfS5cbiogRWFjaCByZXN1bHQgd2lsbCBub3QgY28tcmVsYXRlZCB3aXRoIG90aGVyIHJlc3VsdCBpbiBvcmRlciBvciBpbiBhbnkgb3RoZXIgZm9ybS4gaWYgYSBjbGF1c2UgYXJndW1lbnQgaXNcbiogc3VwcGxpZWQsIGl0IHdpbGwgYmUgaW52b2tlZCB0byBmdXJ0aGVyIGFzc2lzdCBpbiBmaWx0ZXJpbmcgdGhlIHF1ZXJ5IHJlc3VsdC4gZm9yIGV4YW1wbGUgaWYgY2VydGFpbiBjYXRlZ29yeVxuKiBvZiBib29rcyBhcmUgcmVxdWlyZWQsIHRoZSBjbGF1c2UgZnVuY3Rpb24gY2FuIGxvb2sgZm9yIGEgYm9vayBjYXRlZ29yeSBhdHRyaWJ1dGUgYW5kIHJldHVybiB0aGUgcXVlcnkgcmVzdWx0XG4qIGlmIGFjY2VwdGFibGUgb3IgdW5kZWZpbmVkIGlmIHJlc3VsdCBzaG91bGQgYmUgZmlsdGVyZWQgb3V0IG9mIHRoZSByZXN1bHQuXG4qXG4qIDIpIFdpdGggYXJyYXlTZWxlY3QoKSBtZXRob2QsIGFuIGFycmF5IG9mIHtwYXRoOiAnJywgaW46JycsIGRlZXBYbWw6IHRydWV9IGNhbiBiZSBzdXBwbGllZCwgZWFjaCBlbnRyeSB3aWxsIGJlIGV2YWx1YXRlZFxuKiBhcyBpZiBzZWxlY3QoKSBtZXRob2QgaXMgaW52b2tlZC4gQnV0IGZpcnN0LCByZXF1ZXN0cyB3aXRoIHNpbWlsYXIgcGF0aHMgd2lsbCBiZSBtZXJnZWQgaW50byBvbmUgY2FsbC4gIFRoaXNcbiogbWV0aG9kIGlzIHVzZWZ1bCB3aGVuIHBhdGhzIGFyZSBkeW5hbWljbHkgZ2l2ZW4gYW5kIGl0IGlzIG5vdCBjbGVhciBpbiBhZHZhbmNlIGlmIHRoZXJlIGFyZSByZXF1ZXN0cyB3aXRoXG4qIHNpbWlsYXIgcGF0aHMuIGRlZXBYbWwgYXR0cmlidXRlIGlzIG9wdGlvbmFsLlxuKlxuKiAzKSBXaXRoIGNoYWluU2VsZWN0KCkgbWV0aG9kLCBhIGNoYWluZWQgc2V0IG9mIHtwYXRoOiAnJywgaW46ICcnLCBkZWVwWG1sOiB0cnVlfSBpcyBnaXZlbiBpbiBhIGpzb24gb2JqZWN0LiBXaGVuIHJlc3VsdCBvZlxuKiBhIHF1ZXJ5IGJlY29tZXMgYXZhaWxhYmxlLCB0aGUgcmVxdWVzdCBqc29uIHdpbGwgYmUgZXhhbWluZWQgdG8gc2VlIGlmIGEgcmVxdWVzdCBmb3IgdGhlIGtleSBpcyBhdmFpbGFibGUuIElmXG4qIHNvLCB0aGVuIHRoZSAnaW4nIGZvciB0aGUgcGF0aCB3aWxsIGJlIHByZXBlbmRlZCB0byB0aGUgcmVzdWx0aW5nIHZhbHVlIG9mIHRoZSBwcmV2aW91cyBxdWVyeS4gLCBkZWVwWG1sIGF0dHJpYnV0ZSBpcyBcbiogb3B0aW9uYWwuIFRoaXMgbWV0aG9kIGlzIHVzZWZ1bCB3aGVuIHJlc3VsdCBvZiBhIHF1ZXJ5IGlzIGEganNvbiBvciBhbiB4bWwgZmlsZSBhbmQgYWRkaXRpb25hbCBxdWVyeSBpcyBuZWVkZWQgXG4qIGZ1cnRoZXIgZG93biBpbiB0aGUgcHJlY2VlZGluZyBmaWxlcy4gRm9yIGV4YW1wbGUgdGhlIGFzc3VtcHRpb24gaW4gdGhlIGZvbGxvd2luZyBjYWxsIGlzIHRoYXQgZWFjaCBib29rcy5ib29rIFxuKiByZXN1bHQgd2lsbCBiZSBhIGZpbGUgbmFtZSBhbmQgdGhlIGZpbGUgcGF0aCBmb3IgZWFjaCByZXN1bHQgaXMgJy9zYW1wbGVzL2Jvb2tzLycuXG4qIGNoYWluU2VsZWN0KHtcbiogICBwYXRoOiAnYm9va3MuYm9vaycsXG4qICAgaW46ICdzYW1wbGUxLnhtbCcsXG4qICAgZGVlcFhtbDogdHJ1ZSxcbiogICAnYm9va3MuYm9vayc6IHtcbiogICAgICAgaW46ICcvc2FtcGxlcy9ib29rcy8nLFxuKiAgICAgICBwYXRoOiBbJ3B1YmxpY2F0aW9uLnRpdGxlJywgJ3B1YmxpY2F0aW9uLmF1dGhvciddLFxuKiAgICAgICBoYW5kbGVyOiB0aGlzLmJ1YmxpY2F0aW9uSGFuZGxlclxuKiAgIH0pXG4qIGlmIGEgaGFuZGxlciBpcyBzdXBwbGllZCwgaXQgd2lsbCBiZSB1c2VkIHRvIGZpbHRlciBvdXQgYW55IHJlc3VsdCB0aGF0IGlzIG5vdCBhY2NlcHRhYmxlLlxuKlxuKi9cbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0h0dHBDbGllbnQsIEh0dHBIZWFkZXJzfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5cbmltcG9ydCB7bWFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgKiBhcyB4bWxkb20gZnJvbSAneG1sZG9tJztcblxuLypcbiogQHBhcmFtIG5vZGUgVGhlIHBhcmVudCBub2RlLiBpdCBjYW4gYmUgdXNlZCB0byBldmFsdWF0ZSBiYXNlZCBvbiBvdGhlciBhdHRyaWJ1dGVzIGluIHRoZSBub2RlLlxuKiBAcGFyYW0gcGF0aCBhdHRyaWJ1dGUgdG8gYmUgZXhhbWluZWQuXG4qIEBwYXJhbSB2YWx1ZSB0aGUgdmFsdWUgb2YgdGhlIHBhdGguIGl0IGNvdWxkIGJlIHVuZGVmaW5lZCwgYSBsaXRlcmFsLCBvciBhIGxpc3QuXG4qIEByZXR1cm5zIHJldHVybnMgdGhlIHZhbHVlIG9yIGZpbHRlcmVkIHZlcnNpb24gb2YgdGhlIHZhbHVlIG9yIHVuZGVmaW5lZCBvdGhlcndpc2UuXG4qL1xuZXhwb3J0IHR5cGUgY2xhdXNlRXZhbHVhdG9yID0gKG5vZGU6IGFueSwgcGF0aDogc3RyaW5nLCB2YWx1ZTogYW55KSA9PiBhbnk7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBXaXphcmRRdWVyeVNlcnZpY2Uge1xuXG4gICAgcHVibGljIFNFUlZJQ0VfUEFUSCA9ICcnO1xuICAgIHB1YmxpYyBsb2dFbmFibGVkID0gZmFsc2U7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgaHR0cDogSHR0cENsaWVudFxuICAgICkge1xuXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZ2xvYmFsRnVuY3Rpb25zKCkge1xuICAgICAgICByZXR1cm4gYFxuICAgICAgICBmdW5jdGlvbiByZXZlcnNlKGEpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBhO1xuICAgICAgICAgICAgaWYgKGEgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGEucmV2ZXJzZSgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBhLnNwbGl0KCcnKS5yZXZlcnNlKCkuam9pbignJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHN1bShhLGIpIHtcbiAgICAgICAgICAgIHZhciB0b3RhbCA9IDA7XG4gICAgICAgICAgICBpZiAoYSBpbnN0YW5jZW9mIEFycmF5KSB7IFxuICAgICAgICAgICAgICAgIGEubWFwKGZ1bmN0aW9uKGspIHtcbiAgICAgICAgICAgICAgICAgICAgdG90YWwgKz0gc3VtKGssIGIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICBpZiAoYi5pbmRleE9mKCcuJyk+MCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdCA9IGE7XG4gICAgICAgICAgICAgICAgICAgIGIuc3BsaXQoJy4nKS5tYXAoZnVuY3Rpb24oayl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbCs9c3VtKCB0W2tdLCBiLnN1YnN0cmluZyhrLmxlbmd0aCsxKSApO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYoYVtiXSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdCA9IGFbYl07XG4gICAgICAgICAgICAgICAgICAgIHRvdGFsICs9ICh0eXBlb2YgdCA9PT0gJ251bWJlcicpID8gdCA6IHBhcnNlRmxvYXQodCk7XG4gICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGEgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgdG90YWwgPSBhO1xuICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIHJldHVybiB0b3RhbDtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBjb3VudChhLGIpIHtcbiAgICAgICAgICAgIHZhciB0b3RhbCA9IDA7XG4gICAgICAgICAgICBpZiAoYSBpbnN0YW5jZW9mIEFycmF5KSB7IFxuICAgICAgICAgICAgICAgIGEubWFwKGZ1bmN0aW9uKGspIHtcbiAgICAgICAgICAgICAgICAgICAgdG90YWwgKz0gY291bnQoaywgYik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGEpLm1hcChmdW5jdGlvbihrKXtcbiAgICAgICAgICAgICAgICAgICAgdG90YWwgKz0gY291bnQoYVtrXSxiKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgdG90YWwgPSBhLnNwbGl0KGIpLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGEgPT09IGIpIHtcbiAgICAgICAgICAgICAgICB0b3RhbCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRvdGFsO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGxpa2UoYSwgYikge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGlmIChhIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBbXTtcbiAgICAgICAgICAgICAgICBhLm1hcChmdW5jdGlvbihrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGxpa2UoaywgYikpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBbXTtcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhhKS5tYXAoZnVuY3Rpb24oayl7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGxpa2UoYVtrXSwgYikpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBpZiAoYS5pbmRleE9mKGIpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gYTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGEgPT09IGIpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBhO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBhcyhhLCBiKSB7XG4gICAgICAgICAgICBpZiAoYXNMaXN0W2JdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBhc0xpc3RbYl0gPSBbYV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFzTGlzdFtiXS5wdXNoKGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGE7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaXNfaW4oYSwgYiwgbGlzdCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGlmIChiIGluc3RhbmNlb2YgQXJyYXkpIHsgXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gW107XG4gICAgICAgICAgICAgICAgYi5tYXAoZnVuY3Rpb24oaykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChpc19pbihrLCBsaXN0KSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBiID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IFtdO1xuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGIpLm1hcChmdW5jdGlvbihrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGlzX2luKGJba10sIGxpc3QpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYXNMaXN0W2xpc3RdKXtcbiAgICAgICAgICAgICAgICBhc0xpc3RbbGlzdF0ubWFwKGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0ID09PSdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodC5pbmRleE9mKGIpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBhO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICAgIGA7XG4gICAgfVxuXG4gICAgLypcbiAgICAqIFdpbGwgbm9ybWFsaXplIHRoZSBnaXZlbiB4bWwgb3V0IG9mIGFkZGl0aW9uYWwgI3RleHQgb3IgI2NkYXRhLXNlY3Rpb24gbm9kZXMuXG4gICAgKiBAcGFyYW0gdmFsdWUgdGhlIHhtbCB0byBiZSBub3JtYWlsemVkLlxuICAgICogQHBhcmFtIGRlZXBYbWwgaWYgY2RhdGEtc2VjdGlvbiBzaG91bGQgYmUgcGFyc2VkLlxuICAgICogQHJldHVybiBub3JtYWxpemVkIHhtbC5cbiAgICAqL1xuICAgIHByaXZhdGUgX25vcm1hbGl6ZSh2YWx1ZTogYW55LCBkZWVwWG1sOiBib29sZWFuKSB7XG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICAgICAgICAgIHZhbHVlLm1hcCggKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLl9ub3JtYWxpemUoaXRlbSwgZGVlcFhtbCkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YWx1ZSA9IHJlc3VsdDtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBsZXQgaXRlbXM6IGFueSA9IE9iamVjdC5rZXlzKHZhbHVlKTtcblxuICAgICAgICAgICAgaWYgKGl0ZW1zLmxlbmd0aCA9PT0gMSAmJiAhKHZhbHVlW2l0ZW1zWzBdXSBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZVsnI3RleHQnXSkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlWycjdGV4dCddO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWVbJyNjZGF0YS1zZWN0aW9uJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZVsnI2NkYXRhLXNlY3Rpb24nXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlZXBYbWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeG1sID0gbmV3IHhtbGRvbS5ET01QYXJzZXIoKS5wYXJzZUZyb21TdHJpbmcodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gKHhtbC5kb2N1bWVudEVsZW1lbnQgJiYgeG1sLmRvY3VtZW50RWxlbWVudCAhPSBudWxsKSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5feG1sMmpzb24oeG1sLmRvY3VtZW50RWxlbWVudCkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfWNhdGNoKGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICAgICAgICAgICAgICBpdGVtcy5tYXAoIChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtpdGVtXSA9IHRoaXMuX25vcm1hbGl6ZSh2YWx1ZVtpdGVtXSwgZGVlcFhtbCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSByZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIC8qXG4gICAgKiBAcGFyYW0gcGF0aCBKU09OIHBhdGggdG8gZXZhbHVhdGUuIEEgcGF0aCBjb3VsZCBiZSBmdWxseSBxdWFsaWZpZWQgZm9yIGRlcHRoIG9mIGpzb24gKGkuZS4sICdhLmIuYycpXG4gICAgKiBAcGFyYW0gZGF0YSB0aGUgZGF0YSBzb3VyY2UuXG4gICAgKiBAcGFyYW0gZGVlcFhtbCBpZiBjZGF0YS1zZWN0aW9uIHNob3VsZCBiZSBwYXJzZWQuXG4gICAgKiBAcGFyYW0gY2xhdXNlIEEgbWV0aG9kIGJ5IHdoaWNoIHZhbHVlKHMpIGZvciB0aGUga2V5KHMpIGNvdWxkIGJlIGV2YWx1YXRlZC4gdGhlIGNhbGxlciB3b3VsZCBldmFsdWF0ZSB0aGUgdmFsdWUgZm9yIGEgZ2l2ZW4gYXR0cmlidXRlLlxuICAgICogQHJldHVybnMgcmV0dXJucyBldmx1YXRlZCB2YWx1ZSBmb3IgdGhlIGtleSBpbiBkYXRhIHNvdXJjZS5cbiAgICAqL1xuICAgIHByaXZhdGUgX3ZhbHVlT2ZKc29uUGF0aChcbiAgICAgICAgcGF0aDogYW55LFxuICAgICAgICBkYXRhOiBhbnksXG4gICAgICAgIGFzOiBhbnksXG4gICAgICAgIGRlZXBYbWw6IGJvb2xlYW4sXG4gICAgICAgIGNsYXVzZT86IGNsYXVzZUV2YWx1YXRvcik6IGFueSB7XG5cbiAgICAgICAgbGV0IHJlc3VsdDogYW55O1xuICAgICAgICBsZXQgeCA9IHRoaXMuX25vcm1hbGl6ZShkYXRhLCBkZWVwWG1sKTtcbiAgICAgICAgcGF0aC5tYXAoIChzdWJrZXk6IGFueSkgPT4ge1xuICAgICAgICAgICAgbGV0IG5vZGUgPSB4O1xuICAgICAgICAgICAgaWYgKG5vZGUgJiYgbm9kZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdCA9IFtdO1xuICAgICAgICAgICAgICAgIGlmIChzdWJrZXkuc29ydCkge1xuICAgICAgICAgICAgICAgICAgICBub2RlID0gc3Via2V5LnNvcnQobm9kZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG5vZGUubWFwIChcbiAgICAgICAgICAgICAgICAgICAgKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3Via2V5LmtleS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeCA9IHN1YmtleS5rZXkubGVuZ3RoID8gaXRlbVtzdWJrZXkua2V5XSA6IGl0ZW07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh4ICYmIHN1YmtleS52YWxpZGF0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YmtleS52YWxpZGF0ZWQubWFwKHYgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHogPSB2KHgsIGFzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHogPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih6ICA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeCA9IHo7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAociAmJiB4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdC5wdXNoKHgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1YmtleS52YWxpZGF0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YmtleS52YWxpZGF0ZWQubWFwKHYgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHogPSB2KGl0ZW0sIGFzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHogPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih6ICA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbSA9IHo7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAociAmJiBpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdC5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdC5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdWJrZXkua2V5Lmxlbmd0aCAmJiAodHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uc3BsaXQoJy4nKS5tYXAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChzdHIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdHIuaW5kZXhPZihzdWJrZXkua2V5KSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdC5wdXNoKHN0cik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHggPSB0O1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHg7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5vZGUgJiYgKHR5cGVvZiBub2RlID09PSAnb2JqZWN0JykpIHtcbiAgICAgICAgICAgICAgICB4ID0geCA/XG4gICAgICAgICAgICAgICAgICAgIGNsYXVzZShub2RlLCBzdWJrZXkua2V5LCBzdWJrZXkua2V5Lmxlbmd0aCA/IHhbc3Via2V5LmtleV06ICB4KSA6XG4gICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBpZiAoeCAmJiB4IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3Via2V5LnNvcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHggPSBzdWJrZXkuc29ydCh4KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB4Lm1hcChcbiAgICAgICAgICAgICAgICAgICAgICAgIChpdGVtOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3Via2V5LnZhbGlkYXRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YmtleS52YWxpZGF0ZWQubWFwKHYgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeiA9IHYoaXRlbSwgYXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB6ID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih6ICA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtID0gejtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyICYmIGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHggPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIHggPSB0O1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB4O1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoeCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3Via2V5LnZhbGlkYXRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3Via2V5LnZhbGlkYXRlZC5tYXAodiA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeiA9IHYoeCwgYXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgeiA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHogID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4ID0gejtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyICYmIHgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB4O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0geDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAobm9kZSAmJiAodHlwZW9mIG5vZGUgPT09ICdzdHJpbmcnKSAmJiBzdWJrZXkua2V5Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IFtdO1xuICAgICAgICAgICAgICAgIG5vZGUuc3BsaXQoJy4nKS5tYXAoXG4gICAgICAgICAgICAgICAgICAgIChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5pbmRleE9mKHN1YmtleS5rZXkpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gbm9kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZ2V0KHBhdGg6IHN0cmluZykge1xuICAgICAgICBjb25zdCB1cmwgPSB0aGlzLlNFUlZJQ0VfUEFUSCArIHBhdGg7XG4gICAgICAgIGNvbnN0IGRvdCA9IHBhdGgubGFzdEluZGV4T2YoJy4nKTtcbiAgICAgICAgY29uc3QgZXh0ID0gZG90IDwgMCA/IHVuZGVmaW5lZCA6IHBhdGgudG9Mb3dlckNhc2UoKS5zdWJzdHIoZG90KTtcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycygpO1xuICAgICAgICBsZXQgcmVzdWx0OiBhbnk7XG5cbiAgICAgICAgaGVhZGVycy5zZXQoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbicsICcqJyk7XG5cbiAgICAgICAgaWYgKGV4dCA9PT0gJy54bWwnKSB7XG4gICAgICAgICAgICBoZWFkZXJzLnNldCgnQ29udGVudC1UeXBlJywgJ3RleHQ7IGNoYXJzZXQ9dXRmLTgnKS5zZXQoJ0FjY2VwdCcsICd0ZXh0Jyk7XG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLmh0dHAuZ2V0KHVybCwgeyBoZWFkZXJzLCByZXNwb25zZVR5cGU6ICd0ZXh0JyB9KVxuICAgICAgICAgICAgICAgIC5waXBlKG1hcCgocmVzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHhtbCA9IG5ldyB4bWxkb20uRE9NUGFyc2VyKCkucGFyc2VGcm9tU3RyaW5nKHJlcyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGpzb24gPSB0aGlzLl94bWwyanNvbih4bWwuZG9jdW1lbnRFbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGpzb247XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXh0ID09PSAnLnR4dCcpIHtcbiAgICAgICAgICAgIGhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCAndGV4dDsgY2hhcnNldD11dGYtOCcpLnNldCgnQWNjZXB0JywgJ3RleHQnKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5nZXQodXJsLCB7IGhlYWRlcnMsIHJlc3BvbnNlVHlwZTogJ3RleHQnIH0pLnBpcGUobWFwKChyZXMpID0+IHJlcykpO1xuICAgICAgICB9IGVsc2UgaWYgKGV4dCA9PT0gJy5qc29uJyl7XG4gICAgICAgICAgICBoZWFkZXJzLnNldCgnQ29udGVudC1UeXBlJywgJ2pzb247IGNoYXJzZXQ9dXRmLTgnKS5zZXQoJ0FjY2VwdCcsICdqc29uJyk7XG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLmh0dHAuZ2V0KHVybCwge2hlYWRlcnN9KS5waXBlKG1hcCgocmVzKSA9PiByZXMpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCAndGV4dDsgY2hhcnNldD11dGYtOCcpLnNldCgnQWNjZXB0JywgJ3RleHQnKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5nZXQodXJsLCB7IGhlYWRlcnMsIHJlc3BvbnNlVHlwZTogJ3RleHQnIH0pXG4gICAgICAgICAgICAgICAgLnBpcGUobWFwKChyZXMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhcnNlZDogYW55O1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VkID0gSlNPTi5wYXJzZShyZXMpO1xuICAgICAgICAgICAgICAgICAgICB9Y2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeG1sID0gbmV3IHhtbGRvbS5ET01QYXJzZXIoKS5wYXJzZUZyb21TdHJpbmcocmVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZWQgPSB0aGlzLl94bWwyanNvbih4bWwuZG9jdW1lbnRFbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VkID0gcmVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VkID8gcGFyc2VkIDogcmVzO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfc3RyaW5nVmFsdWVPZktleShrZXk6IGFueSkge1xuICAgICAgICBsZXQgcmVzdWx0OiBhbnkgPSBbXTtcblxuICAgICAgICBpZiAoa2V5IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIGtleS5tYXAoIFxuICAgICAgICAgICAgICAgIChpdGVtOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHggPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ubWFwKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChzdWJpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdWJpdGVtLmtleS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHgucHVzaChzdWJpdGVtLmtleSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh4LmpvaW4oJy4nKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpID0gaXRlbS5pbmRleE9mKCdbJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBqID0gaXRlbS5pbmRleE9mKCddJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBrID0gaXRlbS5sZW5ndGggPiAoaiArIDEpID8gMiA6IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChpID4gMCA/IGl0ZW0uc3Vic3RyaW5nKDAsaSkgOiBqID4gMCA/IGl0ZW0uc3Vic3RyaW5nKGogKyBrKSA6IGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0ua2V5Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goaXRlbS5rZXkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5qb2luKCcsJyk7XG4gICAgICAgICAgICByZXN1bHQgPSByZXN1bHQuaW5kZXhPZignLicpIDwgMCA/IHJlc3VsdC5yZXBsYWNlKC9cXCwvZywgJy4nKSA6IHJlc3VsdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGtleS5rZXk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9hZGRUb1Jlc3VsdCh2YWx1ZTogYW55LCBrZXk6IHN0cmluZywgb3BlcmF0aW9uOiBhbnksIGFjdGlvbjogYW55KSB7XG4gICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLl9zdHJpbmdWYWx1ZU9mS2V5KGFjdGlvbi5wYXRoKTtcbiAgICAgICAgY29uc3Qga2V5MiA9IHRoaXMuX3N0cmluZ1ZhbHVlT2ZLZXkoa2V5KTtcbiAgICAgICAgbGV0IG9wID0gb3BlcmF0aW9uLnJlc3VsdFtwYXRoXTtcbiAgICAgICAgbGV0IGNvbXBsZXRlID0gZmFsc2U7XG4gICAgXG4gICAgICAgIGlmICghb3ApIHtcbiAgICAgICAgICAgIG9wZXJhdGlvbi5yZXN1bHRbcGF0aF0gPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3ApIHtcbiAgICAgICAgICAgIGxldCBvcGsgPSBvcFtrZXkyXTtcbiAgICAgICAgICAgIGlmIChvcGVyYXRpb25bJ3RlbXAnXSAmJlxuICAgICAgICAgICAgICAgIG9wZXJhdGlvblsndGVtcCddW2tleTJdKSB7XG4gICAgICAgICAgICAgICAgb3Bba2V5Ml0gPSBbb3Bba2V5Ml1dO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBvcGVyYXRpb25bJ3RlbXAnXTtcbiAgICAgICAgICAgIH1lbHNlIGlmIChvcGsgJiYgKG9wayBpbnN0YW5jZW9mIEFycmF5KSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb24ucmVzdWx0W3BhdGhdW2tleTJdID0gW29wa11cbiAgICAgICAgICAgICAgICBvcCA9IG9wZXJhdGlvbi5yZXN1bHRbcGF0aF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YWx1ZSA9IHRoaXMuX25vcm1hbGl6ZSh2YWx1ZSwgYWN0aW9uLmRlZXBYbWwpO1xuICAgICAgICAgICAgaWYgKG9wW2tleTJdKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKEpTT04uc3RyaW5naWZ5KHZhbHVlKSAhPT0gSlNPTi5zdHJpbmdpZnkob3Bba2V5Ml1bMF0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcFtrZXkyXS5wdXNoKCB2YWx1ZVtrZXkyXSA/IHZhbHVlW2tleTJdIDogdmFsdWUgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG9wW2tleTJdLnB1c2goIHZhbHVlW2tleTJdID8gdmFsdWVba2V5Ml0gOiB2YWx1ZSApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKChvcCBpbnN0YW5jZW9mIEFycmF5KSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLnJlc3VsdFtwYXRoXSA9IFtvcF07XG4gICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5yZXN1bHRbcGF0aF0ucHVzaCggdmFsdWVba2V5Ml0gPyB2YWx1ZVtrZXkyXSA6IHZhbHVlICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChKU09OLnN0cmluZ2lmeSh2YWx1ZSkgIT09IEpTT04uc3RyaW5naWZ5KG9wWzBdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wLnB1c2goIHZhbHVlW2tleTJdID8gdmFsdWVba2V5Ml0gOiB2YWx1ZSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3AucHVzaCggdmFsdWVba2V5Ml0gPyB2YWx1ZVtrZXkyXSA6IHZhbHVlICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgIC8vIGlmIGFscmVhZHkgYW4gYXJyYXkgcmVtZW1iZXIgaXQuXG4gICAgICAgICAgICAgICAgaWYgKCFvcGVyYXRpb25bJ3RlbXAnXSkge1xuICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb25bJ3RlbXAnXSA9IHt9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIW9wZXJhdGlvblsndGVtcCddW2tleTJdKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvblsndGVtcCddW2tleTJdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcGVyYXRpb24ucmVzdWx0W3BhdGhdW2tleTJdID0gdGhpcy5fbm9ybWFsaXplKHZhbHVlLCBhY3Rpb24uZGVlcFhtbCk7XG4gICAgICAgICAgICBjb21wbGV0ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbXBsZXRlO1xuICAgIH1cblxuICAgIHByaXZhdGUgX3BhY2socmVzdWx0OiBhbnkpIHtcbiAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICBjb25zdCBsaXN0ID0gW107XG4gICAgICAgICAgICByZXN1bHQubWFwKFxuICAgICAgICAgICAgICAgIChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaCh0aGlzLl9wYWNrKGl0ZW0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmVzdWx0ID0gbGlzdDtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgcmVzdWx0ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHJlc3VsdCk7XG4gICAgICAgICAgICBrZXlzLm1hcCAoXG4gICAgICAgICAgICAgICAgKGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gcmVzdWx0W2tleV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgQXJyYXkpIHtcblxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW1ba2V5XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2tleV0gPSBpdGVtW2tleV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIF90cmlnZ2VyUmVzdWx0KHByb21pc2U6IGFueSwgYXM6IGFueSwgcmVzdWx0OiBhbnkpIHtcbiAgICAgICAgY29uc3QgeCA9IHRoaXMuX3BhY2socmVzdWx0KTtcbiAgICAgICAgbGV0IHNhdmVBczogYW55O1xuICAgICAgICBpZiAoYXMpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgc2F2ZUFzID0ge307XG4gICAgICAgICAgICAgICAgc2F2ZUFzW2FzXSA9IHg7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhcyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICBzYXZlQXMgPSBhcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBwcm9taXNlLm5leHQoeCk7XG4gICAgICAgIHJldHVybiBzYXZlQXM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfc3VicXVlcnkoXG4gICAgICAgIHByb21pc2U6IGFueSxcbiAgICAgICAgcGF0aDogYW55LFxuICAgICAgICBvcGVyYXRpb246IGFueSxcbiAgICAgICAgYWN0aW9uOiBhbnkpIHtcblxuICAgICAgICBpZiAob3BlcmF0aW9uLmNhY2hlZEZpbGVzW3BhdGhdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIG9uZSBvZiB0aGUga2V5cyBhdCB0aGlzIGxldmVsIGNvdWxkIGJlIHJlZmVyZW5jaW5nIHRoZSBzYW1lIGZpbGUgd2hpY2hcbiAgICAgICAgICAgIC8vIGlzIG5vdCB5ZXQgZmV0Y2hlZC4gbmVlZCB0byB3YWl0IHRpbGwgaXQgaXMgYXZhaWxhYmxlLlxuICAgICAgICAgICAgb3BlcmF0aW9uLmNhY2hlZEZpbGVzW3BhdGhdID0gbmV3IEJlaGF2aW9yU3ViamVjdDxhbnk+KG51bGwpO1xuICAgICAgICAgICAgdGhpcy5fcXVlcnlJdGVyYXRpb24oXG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uLmNhY2hlZEZpbGVzW3BhdGhdLFxuICAgICAgICAgICAgICAgIG9wZXJhdGlvbixcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHBhdGg6IGFjdGlvbi5wYXRoLFxuICAgICAgICAgICAgICAgICAgICBpbjogYWN0aW9uLmluLFxuICAgICAgICAgICAgICAgICAgICBkZWVwWG1sOiBhY3Rpb24uZGVlcFhtbCxcbiAgICAgICAgICAgICAgICAgICAgam9pbjogYWN0aW9uLmpvaW4sXG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXI6IGFjdGlvbi5oYW5kbGVyLFxuICAgICAgICAgICAgICAgICAgICBxdWVyeUl0ZW1zOiAoYWN0aW9uLnBhdGggaW5zdGFuY2VvZiBBcnJheSkgPyBhY3Rpb24ucGF0aC5sZW5ndGggOiAxXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBwYXRoXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gd2FpdCBmb3IgcmVzdWx0IHJhaXNlZCBhYm92ZS5cbiAgICAgICAgb3BlcmF0aW9uLmNhY2hlZEZpbGVzW3BhdGhdLnN1YnNjcmliZShcbiAgICAgICAgICAgIChzb3VyY2U6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3BrZXlpID0gYWN0aW9uLmpvaW4gPyBhY3Rpb24uam9pblthY3Rpb24ucGF0aF0gOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcGtleWkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzb3VyY2UgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZS5tYXAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdWJxdWVyeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogb3BrZXlpLnBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluOiBvcGtleWkuaW4gPT0gdW5kZWZpbmVkID8gYWN0aW9uLmluIDogKG9wa2V5aS5pbiArIGl0ZW0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWVwWG1sOiBvcGtleWkuZGVlcFhtbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgam9pbjogb3BrZXlpLmpvaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXI6IG9wa2V5aS5oYW5kbGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWVyeUl0ZW1zOiAob3BrZXlpLnBhdGggaW5zdGFuY2VvZiBBcnJheSkgPyBvcGtleWkucGF0aC5sZW5ndGggOiAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3VicXVlcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBhY3Rpb24uam9pbltvcGtleWkucGF0aF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbjogb3BrZXlpLmluID09IHVuZGVmaW5lZCA/IGFjdGlvbi5pbiA6IChvcGtleWkuaW4gKyBzb3VyY2UpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVlcFhtbDogYWN0aW9uLmRlZXBYbWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqb2luOiBvcGtleWkuam9pbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXI6IG9wa2V5aS5oYW5kbGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnlJdGVtczogKG9wa2V5aS5wYXRoIGluc3RhbmNlb2YgQXJyYXkpID8gb3BrZXlpLnBhdGgubGVuZ3RoIDogMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9hZGRUb1Jlc3VsdChzb3VyY2UsIGFjdGlvbi5wYXRoLCBvcGVyYXRpb24sIGFjdGlvbikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbi5xdWVyeUl0ZW1zLS07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aW9uLnF1ZXJ5SXRlbXMgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb24uYXMgPSB0aGlzLl90cmlnZ2VyUmVzdWx0KHByb21pc2UsIG9wZXJhdGlvbi5hcywgb3BlcmF0aW9uLnJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbi5xdWVyeUl0ZW1zLS07XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb24uYXMgPSB0aGlzLl90cmlnZ2VyUmVzdWx0KHByb21pc2UsIG9wZXJhdGlvbi5hcywgb3BlcmF0aW9uLnJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgKGVycm9yOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5sb2dFbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYWN0aW9uLnF1ZXJ5SXRlbXMtLTtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb24uYXMgPSB0aGlzLl90cmlnZ2VyUmVzdWx0KHByb21pc2UsIG9wZXJhdGlvbi5hcywgb3BlcmF0aW9uLnJlc3VsdCk7XG4gICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG4gICAgLypcbiAgICAqIEl0ZXJhdGVzIHRocm91Z2ggYSBjaGFpbiBxdWVyeS5cbiAgICAqIEBwYXJhbSBwcm9taXNlIFRoZSBwcm9taXNlIHdoaWNoIG9yaWdpbmFsIGNhbGxlciBpcyB3YWl0aW5nIGZvci5cbiAgICAqIEBwYXJhbSBvcGVyYXRpb24gZGF0YSBmb3Iga2VlcGluZyB0cmFjayBvZiB0aGUgaXRlcmF0aW9uLlxuICAgICogQHBhcmFtIGFjdGlvbiBjb250YWluczoge3BhdGg6IGN1cnJlbnQga2V5cyB0byBxdWVyeSBmb3IsIGluOiBjdXJyZW50IHF1ZXJ5IHBhdGgsIGhhbmRsZXI6IHJlc29sdmVyIG1ldGhvZH0uXG4gICAgKiBAcGFyYW0gY2FjaGVOYW1lZCBUaGUgY2FjaGVkIG5hbWUgZnJvbSBwcmV2aW91cyBpdGVyYXRpb24gaWYgYW55LlxuICAgICogQHJldHVybnMgcmV0dXJucyBub25lLlxuICAgICovXG4gICAgcHJpdmF0ZSBfcXVlcnlJdGVyYXRpb24oXG4gICAgICAgIHByb21pc2U6IEJlaGF2aW9yU3ViamVjdDxhbnk+LFxuICAgICAgICBvcGVyYXRpb246IGFueSxcbiAgICAgICAgYWN0aW9uOiBhbnksXG4gICAgICAgIGNhY2hlTmFtZWQ/OiBzdHJpbmcpIHtcblxuICAgICAgICBpZiAoIWFjdGlvbi5oYW5kbGVyKSB7XG4gICAgICAgICAgICBhY3Rpb24uaGFuZGxlciA9IChub2RlOiBhbnksIHBhdGg6IHN0cmluZywgdmFsdWU6IGFueSkgPT4gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc2VsZWN0KGFjdGlvbi5wYXRoLCBhY3Rpb24uaW4sIGFjdGlvbi5kZWVwWG1sLCBvcGVyYXRpb24uYXMsIGFjdGlvbi5oYW5kbGVyKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYWNoZU5hbWVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyByZXN1bHQgb2Ygbi10aCBsZXZlbCBjYWxsIHRvIGJlIHBsYWNlZCBvbiBwcmV2aW91cyBsZXZlbCBjYWNoZSByZWZlcmVuY2UuXG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb24uY2FjaGVkRmlsZXNbY2FjaGVOYW1lZF0ubmV4dChkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvcGVyYXRpb25hbEtleSA9IGFjdGlvbi5qb2luID8gYWN0aW9uLmpvaW5bYWN0aW9uLnBhdGhdIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcGVyYXRpb25hbEtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhc3N1bXB0aW9uIGlzIHRoZSByZXN1bHRpbmcgbGlzdCBpcyBhIGxpc3Qgb2YgZmlsZSBwYXRocy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5tYXAoIChjb250ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXRoID0gY29udGVudFsnI3RleHQnXSA/IGNvbnRlbnRbJyN0ZXh0J10gOiBjb250ZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNpemUgPSAob3BlcmF0aW9uYWxLZXkucGF0aCBpbnN0YW5jZW9mIEFycmF5KSA/IG9wZXJhdGlvbmFsS2V5LnBhdGgubGVuZ3RoIDogMTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wZXJhdGlvbmFsS2V5LmluID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5jYWNoZWRGaWxlc1twYXRoXSA9IHRoaXMuX3NlbGVjdChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uYWxLZXkucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uLmluLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb25hbEtleS5kZWVwWG1sLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb24uYXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbmFsS2V5LmhhbmRsZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpemUgLS07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdWJxdWVyeShwcm9taXNlLCBwYXRoLCBvcGVyYXRpb24sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBvcGVyYXRpb25hbEtleS5wYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluOiBvcGVyYXRpb25hbEtleS5pbiA9PSB1bmRlZmluZWQgPyBhY3Rpb24uaW4gOiAob3BlcmF0aW9uYWxLZXkuaW4gKyBjb250ZW50KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWVwWG1sOiBvcGVyYXRpb25hbEtleS5kZWVwWG1sLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpvaW46IG9wZXJhdGlvbmFsS2V5LmpvaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlcjogb3BlcmF0aW9uYWxLZXkuaGFuZGxlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWVyeUl0ZW1zOiBzaXplXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbm8gbW9yZSBxdWVyeSBpbiB0aGUgY2hhaW4uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbi5xdWVyeUl0ZW1zLS07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhY3Rpb24ucXVlcnlJdGVtcyA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID1vcGVyYXRpb24ucmVzdWx0ID8gb3BlcmF0aW9uLnJlc3VsdCA6IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLmFzID0gdGhpcy5fdHJpZ2dlclJlc3VsdChwcm9taXNlLCBvcGVyYXRpb24uYXMsIE9iamVjdC5rZXlzKG9wZXJhdGlvbi5yZXN1bHQpLmxlbmd0aCA/IG9wZXJhdGlvbi5yZXN1bHQgOiBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGRhdGEgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoZGF0YSkubWFwKCAoa2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBkYXRhW2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9wZXJhdGlvbmFsS2V5ID0gYWN0aW9uLmpvaW4gPyBhY3Rpb24uam9pbltrZXldOiB1bmRlZmluZWQ7XG4gICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb250ZW50ICYmIGNvbnRlbnQubGVuZ3RoICYmIG9wZXJhdGlvbmFsS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2l6ZSA9IChvcGVyYXRpb25hbEtleS5wYXRoIGluc3RhbmNlb2YgQXJyYXkpID8gb3BlcmF0aW9uYWxLZXkucGF0aC5sZW5ndGggOiAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wZXJhdGlvbmFsS2V5LmluID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5jYWNoZWRGaWxlc1tjb250ZW50XSA9IHRoaXMuX3NlbGVjdChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uYWxLZXkucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uLmluLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb25hbEtleS5kZWVwWG1sLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb24uYXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbmFsS2V5LmhhbmRsZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpemUgLS07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdWJxdWVyeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogb3BlcmF0aW9uYWxLZXkucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW46IG9wZXJhdGlvbmFsS2V5LmluID09IHVuZGVmaW5lZCA/IGFjdGlvbi5pbiA6IChvcGVyYXRpb25hbEtleS5pbiArIGNvbnRlbnQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWVwWG1sOiBvcGVyYXRpb25hbEtleS5kZWVwWG1sLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyOiBvcGVyYXRpb25hbEtleS5oYW5kbGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWVyeUl0ZW1zOiBzaXplXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbi5xdWVyeUl0ZW1zLS07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29udGVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghb3BlcmF0aW9uLnJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb24ucmVzdWx0ID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcGVyYXRpb24ucmVzdWx0IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLnJlc3VsdC5wdXNoKGNvbnRlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5yZXN1bHRba2V5XSA9IGNvbnRlbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGlvbi5xdWVyeUl0ZW1zID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLmFzID0gdGhpcy5fdHJpZ2dlclJlc3VsdChwcm9taXNlLCBvcGVyYXRpb24uYXMsIE9iamVjdC5rZXlzKG9wZXJhdGlvbi5yZXN1bHQpLmxlbmd0aCA/IG9wZXJhdGlvbi5yZXN1bHQgOiBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb24ucXVlcnlJdGVtcy0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhY3Rpb24ucXVlcnlJdGVtcyA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMob3BlcmF0aW9uLnJlc3VsdCkubGVuZ3RoID09PSAwICYmIGRhdGEgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLnJlc3VsdCA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLmFzID0gdGhpcy5fdHJpZ2dlclJlc3VsdChwcm9taXNlLCBvcGVyYXRpb24uYXMsIG9wZXJhdGlvbi5yZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIChlcnJvcjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgcHJvbWlzZS5lcnJvcih7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdmYWlsZWQgdG8gcXVlcnkgJyArIGFjdGlvbi5wYXRoLFxuICAgICAgICAgICAgICAgICAgICByZWFzb246IGVycm9yLm1lc3NhZ2UgPyBlcnJvci5tZXNzYWdlIDogZXJyb3JcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBhY3Rpb24ucXVlcnlJdGVtcy0tO1xuICAgICAgICAgICAgICAgIGlmIChhY3Rpb24ucXVlcnlJdGVtcyA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb24uYXMgPSB0aGlzLl90cmlnZ2VyUmVzdWx0KHByb21pc2UsIG9wZXJhdGlvbi5hcywgb3BlcmF0aW9uLnJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHByaXZhdGUgX21ha2VBcmd1bWVudHMoa2V5OiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgbGlzdCA9IGtleS5zcGxpdCgnLicpO1xuICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICAgICAgbGlzdC5tYXAoIChpdGVtKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBiID0gaXRlbS5pbmRleE9mKCdbJyk7XG4gICAgICAgICAgICBpZiAoYiA8IDApIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGtleTogaXRlbSxcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGVkOiBbKGRhdGE6IGFueSwgYXM6IGFueSkgPT4gdHJ1ZV1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IHN0ciA9IGl0ZW0uc3Vic3RyaW5nKGIgKyAxLCBpdGVtLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHZMaXN0ID0gc3RyLnNwbGl0KCddWycpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG9iamVjdCA9IHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiBpdGVtLnN1YnN0cmluZygwLGIpLFxuICAgICAgICAgICAgICAgICAgICB2YWxpZGF0ZWQ6IFsoZGF0YTogYW55LCBhczogYW55KSA9PiB0cnVlXVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgdkxpc3QubWFwKCBcbiAgICAgICAgICAgICAgICAgICAgKGZpbHRlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyID0gZmlsdGVyLnJlcGxhY2UoL1xcYC9nLCAnLicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyID0gZmlsdGVyLnJlcGxhY2UoL1xcQC9nLCAnZGF0YScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpbHRlci5pbmRleE9mKCdvcmRlci1ieTonKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXJnOiBhbnkgPSBmaWx0ZXIuc3Vic3RyaW5nKGZpbHRlci5pbmRleE9mKCdvcmRlci1ieTonKSArIDEwKS50cmltKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXJnbGlzdCA9IGFyZy5zcGxpdCgnficpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGFyZ2xpc3RbMF0udHJpbSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9yZGVyPSBhcmdsaXN0WzFdID8gYXJnbGlzdFsxXS50cmltKCkudG9Mb3dlckNhc2UoKTogJ2FzYyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0Wydzb3J0J10gPSBmdW5jdGlvbiAoYXJyYXk6IGFueSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBfdmFsdWVPZiA9IChrZXk6IHN0cmluZywgcDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXkuc3BsaXQoJy4nKS5tYXAoICh4KSA9PiB7cCA9IHBbeF19KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhcnJheS5zb3J0KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oYTogYW55LGI6IGFueSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZmxhZyA9X3ZhbHVlT2Yoa2V5LCBhKSA+IF92YWx1ZU9mKGtleSwgYik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZsYWcgPyAob3JkZXIgPT09ICdhc2MnID8gMTogLTEpIDogKG9yZGVyID09PSAnYXNjJyA/IC0xOiAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdCA9IGZpbHRlci5pbmRleE9mKCcmJicpID4gMCB8fCBmaWx0ZXIuaW5kZXhPZignfHwnKSA+IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGYgPSAncmV0dXJuIGZ1bmN0aW9uIChkYXRhLCBhc0xpc3QpIHsgXFxuJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmICs9IHRoaXMuX2dsb2JhbEZ1bmN0aW9ucygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGYgKz0gJ3ZhciB4ID0gZmFsc2U7XFxuIHRyeXtcXG4geCA9ICc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZiArPSAodCA/ICcoJyArIGZpbHRlciArICcpJyA6IGZpbHRlcikgKyAnOyBcXG59Y2F0Y2goZSl7fVxcbiByZXR1cm4geDtcXG59JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RbJ3ZhbGlkYXRlZCddLnB1c2goIG5ldyBGdW5jdGlvbihmKSgpICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKG9iamVjdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHByaXZhdGUgX2hhbmRsZVNwZWNpYWxDaGFyYWN0ZXJzKHBhdGg6IHN0cmluZykge1xuICAgICAgICBsZXQgcmVzdWx0ID0gW107XG4gICAgICAgIHBhdGguc3BsaXQoJ10nKS5tYXAoXG4gICAgICAgICAgICAoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGJpbmRleCA9IGl0ZW0uaW5kZXhPZignWycpO1xuICAgICAgICAgICAgICAgIGlmIChiaW5kZXggPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgeCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIGJpbmRleCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHggKz0gaXRlbS5zdWJzdHJpbmcoMCwgYmluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB4ICs9IGl0ZW0uc3Vic3RyaW5nKGJpbmRleCkucmVwbGFjZSgvXFwuL2csJ2AnKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goeCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gcmVzdWx0LmpvaW4oJ10nKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBfcHJlcGFyZUpzb25QYXRoKHBhdGg6IGFueSkge1xuICAgICAgICBsZXQgcmVzdWx0OiBhbnk7XG4gICAgICAgIGlmIChwYXRoIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IFtdO1xuICAgICAgICAgICAgcGF0aC5tYXAoXG4gICAgICAgICAgICAgICAgKGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeCA9IHRoaXMuX2hhbmRsZVNwZWNpYWxDaGFyYWN0ZXJzKGkpO1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLl9tYWtlQXJndW1lbnRzKHgpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgeCA9IHRoaXMuX2hhbmRsZVNwZWNpYWxDaGFyYWN0ZXJzKHBhdGgpO1xuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5fbWFrZUFyZ3VtZW50cyh4KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIF9zZWxlY3QoXG4gICAgICAgIHBhdGg6IGFueSxcbiAgICAgICAgZnJvbTogc3RyaW5nLFxuICAgICAgICBkZWVwWG1sOiBib29sZWFuLFxuICAgICAgICBhczogYW55LFxuICAgICAgICBjbGF1c2U/OiBjbGF1c2VFdmFsdWF0b3IpOiBCZWhhdmlvclN1YmplY3Q8YW55PiB7XG5cbiAgICAgICAgY29uc3QgZGF0YVN0b3JlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxhbnk+KG51bGwpO1xuXG4gICAgICAgIHRoaXMuX2dldChmcm9tKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAoZGF0YTogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdDogYW55O1xuICAgICAgICAgICAgICAgIGNvbnN0IGpwYXRoID0gdGhpcy5fcHJlcGFyZUpzb25QYXRoKHBhdGgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFjbGF1c2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xhdXNlID0gKG5vZGU6IGFueSwgcGF0aDogc3RyaW5nLCB2YWx1ZTogYW55KSA9PiB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHBhdGggaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAganBhdGgubWFwKChwYXRoSXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeSA9IHRoaXMuX3ZhbHVlT2ZKc29uUGF0aChwYXRoSXRlbSwgZGF0YSwgYXMsIGRlZXBYbWwsIGNsYXVzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoeSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBrZXkgPSB0aGlzLl9zdHJpbmdWYWx1ZU9mS2V5KHBhdGhJdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IHk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMocmVzdWx0KS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuX3ZhbHVlT2ZKc29uUGF0aChqcGF0aCwgZGF0YSwgYXMsIGRlZXBYbWwsIGNsYXVzZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YVN0b3JlLm5leHQocmVzdWx0KTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFTdG9yZS5lcnJvcignUmVzdWx0IG5vdCBmb3VuZCBmb3IgJyArIHBhdGgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAoZXJyb3I6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGRhdGFTdG9yZS5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBkYXRhU3RvcmU7XG4gICAgfVxuXG4gICAgLypcbiAgICAqIFdpbGwgY29udmVydCB0aGUgeG1sIGludG8gYSBqc29uLlxuICAgICogQHBhcmFtIHhtbCBYTUwgdG8gYmUgY29udmVydGVkLlxuICAgICogQHJldHVybnMgcmV0dXJucyBjb252ZXJ0ZWQgSlNPTi5cbiAgICAqL1xuICAgIHByaXZhdGUgX3htbDJqc29uKHhtbDogYW55KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgb2JqID0ge307XG4gICAgICAgICAgICBpZiAoeG1sLmF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjID0geG1sLmF0dHJpYnV0ZXM7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYXR0ciA9IGNbaV07XG4gICAgICAgICAgICAgICAgb2JqW2F0dHIubmFtZV0gPSBhdHRyLnZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh4bWwuY2hpbGROb2RlcyAmJiB4bWwuY2hpbGROb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHhtbC5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSB4bWwuY2hpbGROb2Rlc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm9kZU5hbWUgPSBpdGVtLm5vZGVOYW1lO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChvYmpbbm9kZU5hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZyYWdtZW50ID0gdGhpcy5feG1sMmpzb24oaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZnJhZ21lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ialtub2RlTmFtZV0gPSBmcmFnbWVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmpbbm9kZU5hbWVdLnB1c2ggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9sZCA9IG9ialtub2RlTmFtZV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmpbbm9kZU5hbWVdID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqW25vZGVOYW1lXS5wdXNoKG9sZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmcmFnbWVudCA9IHRoaXMuX3htbDJqc29uKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZyYWdtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqW25vZGVOYW1lXS5wdXNoKGZyYWdtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IHhtbC50ZXh0Q29udGVudC50cmltKCkucmVwbGFjZSgvKD86XFxyXFxufFxccnxcXG58XFx0KS9nLCAnJyk7XG4gICAgICAgICAgICAgICAgb2JqID0gdGV4dC5sZW5ndGggPyB0ZXh0IDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMubG9nRW5hYmxlZCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUubWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKlxuICAgICogV2lsbCBkbyBhIGNoYWluIHF1ZXJ5IG9uIHNwZWNpZmllZCBwYXRocyBmcm9tIHJlbW90ZSBsb2NhdGlvbi5cbiAgICAqIEBwYXJhbSBjaGFpblF1ZXJ5IEEgSnNvbiBzdHJ1Y3R1cmUgd2l0aCBwYXRocy4gRWFjaCBwYXRoIHdpbGwgY29udGFpbiBhIGNoYWluIG9mIGluc3RydWN0aW9ucy5cbiAgICAqIEVhY2ggaW5zdHJ1Y3Rpb24gd2lsbCBoYXZlIGEgJ2luJyB0byBhIGZpbGUgYW5kIGEgcGF0aCB0byBzZWFyY2ggb24gaXQgKHNlZS4gc2VsZWN0KCkpLiBvbmNlIHRoZVxuICAgICogcmVzdWx0IGlzIGluLCB0aGUgbmV4dCBpbnN0cnVjdGlvbiBpbiB0aGUgcGF0aCBjaGFpbiB3aWxsIGJlIHRyaWdnZWQuIEFmdGVyIHRoZSBwYXRoIHRocm91Z2ggYWxsXG4gICAgKiBjaGFpbmVkIHBhdGhzIGlzIGNvbXBsZXRlZCwgcmVzdWx0aW5nIHZhbHVlIHdpbGwgYmUgcHV0IGluIGEganNvbiB3aGVyZSBpdHMgcGF0aCBpcyB0aGUgb3JpZ2luYWxcbiAgICAqIGpzb24gcGF0aCBhbmQgaXRzIHZhbHVlIHdpbGwgYmUgdGhlIHJlc3VsdGluZyB2YWx1ZS5cbiAgICAqXG4gICAgKiB0aGlzIGlzIG5vdCBmdWxseSB0ZXN0ZWQuIGNhbGxlciBzaG91bGQgcGFzcyBzb21ldGhpbmcgbGlrZVxuICAgICoge3BhdGg6IFtwYXRoMSxwYXRoMl0sIGluOiAnc29tZXRoaW5nIG9yIGJsYW5rJywgZGVlcFhtbDogdHJ1ZSwgam9pbjoge2sxOiB7cGF0aDogcGF0aDMsIGluOiAnc29tZXRoaW5nIG9yIHBsYW5rJywgY2xhdXNlOiBmdW5jdGlvbn19fVxuICAgICogaWYgcGF0aDEgb3IgcGF0aDIgb3IgcGF0aDMgYXJlIGZvdW5kIGF0IHRoZSByb290IG9iamVjdCwgYSBjaGFpbiByZWFjdGlvbiB0byBmZXRjaCBkZWVwIHdpbGwgZm9sbG93LiBBblxuICAgICogb3B0aW9uYWwgY2xhdXNlIHdpbGwgaGVscCByZXNvbHZlIGNvbXBsZXggc2l0dWF0aW9ucy5cbiAgICAqXG4gICAgKiBAcmV0dXJucyByZXR1cm5zIGFuIG9ic2VydmFibGUuIHRoZSBjYWxsZXIgc2hvdWxkIHN1YnNjcmliZSB0byB0aGlzIGluIG9yZGVyIHRvIHJlY2VpdmUgdGhlIHJlc3VsdC5cbiAgICAqL1xuICAgIGNoYWluU2VsZWN0KGNoYWluUXVlcnk6IGFueSk6IEJlaGF2aW9yU3ViamVjdDxhbnk+IHtcbiAgICAgICAgY29uc3Qgc2l6ZSA9IChjaGFpblF1ZXJ5LnBhdGggaW5zdGFuY2VvZiBBcnJheSkgPyAgY2hhaW5RdWVyeS5wYXRoLmxlbmd0aCA6IDE7XG4gICAgICAgIGNvbnN0IG9wZXJhdGlvbiA9IHtjYWNoZWRGaWxlczoge30sIGFzOiB7fSwgcmVzdWx0OiB7fX07XG4gICAgICAgIGNvbnN0IGRhdGFTdG9yZSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8YW55PihudWxsKTtcblxuICAgICAgICBvcGVyYXRpb24uY2FjaGVkRmlsZXNbY2hhaW5RdWVyeS5wYXRoXSA9IGRhdGFTdG9yZTtcbiAgICAgICAgdGhpcy5fcXVlcnlJdGVyYXRpb24oXG4gICAgICAgICAgICBkYXRhU3RvcmUsXG4gICAgICAgICAgICBvcGVyYXRpb24sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcGF0aDogY2hhaW5RdWVyeS5wYXRoLFxuICAgICAgICAgICAgICAgIGluOiBjaGFpblF1ZXJ5LmluLFxuICAgICAgICAgICAgICAgIGRlZXBYbWw6IGNoYWluUXVlcnkuZGVlcFhtbCxcbiAgICAgICAgICAgICAgICBqb2luOiBjaGFpblF1ZXJ5LmpvaW4sXG4gICAgICAgICAgICAgICAgaGFuZGxlcjogY2hhaW5RdWVyeS5oYW5kbGVyLFxuICAgICAgICAgICAgICAgIHF1ZXJ5SXRlbXM6IHNpemVcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIGRhdGFTdG9yZTtcbiAgICB9XG5cbiAgICAvKlxuICAgICogV2lsbCBncm91cCBmaWxlIHBhdGhzIGlmIHRoZXkgYXJlIHNpbWlsYXIgdG8gYXZvaWQgbXVsdGlwbGUgY2FsbHMuXG4gICAgKiBAcGFyYW0gbGlzdCBBIGxpc3Qgb2YgSnNvbiB7cGF0aHMsIGluLCBkZWVwWG1sfSBzdHJ1Y3R1cmVzLiBkZWVwWG1sIGlzIG9wdGlvbmFsLlxuICAgICogQHBhcmFtIGNsYXVzZSBBIG1ldGhvZCBieSB3aGljaCB2YWx1ZShzKSBmb3IgdGhlIHBhdGgocykgY291bGQgYmUgZXZhbHVhdGVkLiB0aGUgY2FsbGVyIHdvdWxkIGV2YWx1YXRlIHRoZSB2YWx1ZSBmb3IgYSBnaXZlbiBhdHRyaWJ1dGUuXG4gICAgKiBAcmV0dXJucyByZXR1cm5zIGFuIG9ic2VydmFibGUuIHRoZSBjYWxsZXIgc2hvdWxkIHN1YnNjcmliZSB0byB0aGlzIGluIG9yZGVyIHRvIHJlY2VpdmUgdGhlIHJlc3VsdC5cbiAgICAqL1xuICAgIGFycmF5U2VsZWN0KFxuICAgICAgICBsaXN0OiBhbnksXG4gICAgICAgIGNsYXVzZT86IGNsYXVzZUV2YWx1YXRvcik6IEJlaGF2aW9yU3ViamVjdDxhbnk+ICB7XG4gICAgICAgIGNvbnN0IGdyb3VwZWRMaXN0ID0ge307XG4gICAgICAgIGxpc3QubWFwKCAoaXRlbTogYW55KSA9PiB7XG4gICAgICAgICAgICBpZiAoZ3JvdXBlZExpc3RbaXRlbS5pbl0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGdyb3VwZWRMaXN0W2l0ZW0uaW5dID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBncm91cGVkTGlzdFtpdGVtLmluXS5wdXNoKHtwYXRoOiBpdGVtLnBhdGgsIGRlZXBYbWw6IGl0ZW0uZGVlcFhtbH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgZGF0YVN0b3JlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxhbnk+KG51bGwpO1xuXG4gICAgICAgIE9iamVjdC5rZXlzKGdyb3VwZWRMaXN0KS5tYXAgKCAodXJsKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9zZWxlY3QoZ3JvdXBlZExpc3RbdXJsXS5wYXRoLCB1cmwsIGdyb3VwZWRMaXN0W3VybF0uZGVlcFhtbCwgdW5kZWZpbmVkLCBjbGF1c2UpLnN1YnNjcmliZShcbiAgICAgICAgICAgICAgICAoZGF0YTogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhU3RvcmUubmV4dChkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgKGVycm9yOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YVN0b3JlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGRhdGFTdG9yZTtcbiAgICB9XG5cbiAgICAvKlxuICAgICogV2lsbCBxdWVyeSBwYXRoIGZyb20gYSByZW1vdGUgbG9jYXRpb24gcXVhbGlmaWVkIHRocm91Z2ggYW4gb3B0aW9uYWwgY2xhdXNlIGZ1bmN0aW9uIHRoYXRcbiAgICAqIGV2YWx1YXRlcywgZmlsdGVycywgb3Igc29ydHMgdGhlIHJlc3VsIG9mIHRoZSBxdWVyeS5cbiAgICAqIEBwYXJhbSBwYXRoIEEgYSBzaW5nbGUgSlNPTiBwYXRoIG9yIGxpc3Qgb2YgcGF0aHMgdG8gc2VsZWN0IChpLmUuLCAnYS5iLmMnKVxuICAgICogQHBhcmFtIGZyb20gQSByZWZlcmVuY2UgVVJMIHRvIGEgcmVtb3RlIHNvdXJjZS5cbiAgICAqIEBwYXJhbSBkZWVwWG1sIGlmIGNkYXRhLXNlY3Rpb24gc2hvdWxkIGJlIHBhcnNlZC5cbiAgICAqIEBwYXJhbSBjbGF1c2UgQSBtZXRob2QgYnkgd2hpY2ggdmFsdWUocykgZm9yIHRoZSBwYXRoKHMpIGNvdWxkIGJlIGV2YWx1YXRlZC4gdGhlIGNhbGxlciB3b3VsZCBldmFsdWF0ZSB0aGUgdmFsdWUgZm9yIGEgZ2l2ZW4gYXR0cmlidXRlLlxuICAgICogQHJldHVybnMgcmV0dXJucyBhbiBvYnNlcnZhYmxlLiB0aGUgY2FsbGVyIHNob3VsZCBzdWJzY3JpYmUgdG8gdGhpcyBpbiBvcmRlciB0byByZWNlaXZlIHRoZSByZXN1bHQuXG4gICAgKi9cbiAgICBzZWxlY3QoXG4gICAgICAgIHBhdGg6IGFueSxcbiAgICAgICAgZnJvbTogc3RyaW5nLFxuICAgICAgICBkZWVwWG1sOiBib29sZWFuLFxuICAgICAgICBjbGF1c2U/OiBjbGF1c2VFdmFsdWF0b3IpOiBCZWhhdmlvclN1YmplY3Q8YW55PiB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdChwYXRoLCBmcm9tLCBkZWVwWG1sLCB1bmRlZmluZWQsIGNsYXVzZSk7XG4gICAgfVxufVxuIl19