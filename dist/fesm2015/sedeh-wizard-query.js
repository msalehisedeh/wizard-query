import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { DOMParser } from 'xmldom';
import { Injectable, Component, Input, Directive, Output, EventEmitter, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class WizardQueryService {
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
                            const xml = new DOMParser().parseFromString(value);
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
                const xml = new DOMParser().parseFromString(res);
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
                        const xml = new DOMParser().parseFromString(res);
                        parsed = this._xml2json(xml.documentElement);
                    }
                    catch (e2) {
                        parsed = res;
                    }
                }
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
                if (item instanceof Array) ;
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class WizardQueryComponent {
    /**
     * @param {?} queryService
     */
    constructor(queryService) {
        this.queryService = queryService;
    }
    /**
     * @param {?} data
     * @return {?}
     */
    set queryInfo(data) {
        this.query = data;
        if (this.query) {
            this.selectedDocumentName = this.query.in.substring(this.query.in.lastIndexOf('/'));
            this.queryService.chainSelect({
                in: this.query.in,
                path: ''
            }).subscribe((success) => {
                if (success) {
                    this.source = success;
                    this.data = undefined;
                }
            }, (error) => {
                this.source = error;
                this.data = undefined;
            });
        }
        else {
            this.data = undefined;
            this.source = undefined;
        }
    }
    /**
     * @param {?} content
     * @return {?}
     */
    parseFunctions(content) {
        if (content instanceof Array) {
            content.map((item) => {
                this.parseFunctions(item);
            });
        }
        else if (typeof content === 'object') {
            Object.keys(content).map((key) => {
                if (key === 'handler') {
                    content[key] = new Function('return function' + content[key])();
                }
                else {
                    this.parseFunctions(content[key]);
                }
            });
        }
    }
    /**
     * @param {?} text
     * @return {?}
     */
    executeQuery(text) {
        try {
            /** @type {?} */
            const content = JSON.parse(text.value);
            this.parseFunctions(content);
            if (content instanceof Array) {
                this.queryService.arraySelect(content).subscribe((success) => {
                    if (success) {
                        this.data = success;
                    }
                }, (error) => {
                    this.data = { alert: error };
                });
            }
            else {
                this.queryService.chainSelect(content).subscribe((success) => {
                    if (success) {
                        this.data = success;
                    }
                }, (error) => {
                    this.data = { alert: error };
                });
            }
        }
        catch (err) {
            this.data = { alert: err.message };
        }
    }
}
WizardQueryComponent.decorators = [
    { type: Component, args: [{
                selector: 'wizard-query',
                template: "\n<div class=\"entry\" *ngIf=\"source\">\n  <div class=\"entry-label\">Source: {{selectedDocumentName}}</div>\n  <div class=\"entry-label\">Type or modify query</div>\n  <div class=\"entry-json\">{{ source | json }}</div>\n  <textarea #text [value]=\"query | json\" (input)=\"data = undefined\"></textarea>\n  <div class=\"submit\"><button (click)=\"executeQuery(text)\">Execute query</button></div>\n</div>\n\n<div *ngIf=\"data\" class=\"result-json\">{{ data | json }}</div>\n",
                styles: [".result-json{border:1px solid #633;background-color:#fefefe;border-radius:5px;box-sizing:border-box;display:block;max-height:222px;min-height:222px;overflow-y:auto;position:relative;font-family:monospace;float:left;padding:5px;unicode-bidi:embed;width:100%;white-space:pre-wrap}.entry .entry-json{border:1px solid #633;background-color:#fefefe;box-sizing:border-box;display:block;max-height:222px;min-height:222px;overflow-y:auto;position:relative;font-family:monospace;float:left;padding:5px;unicode-bidi:embed;width:50%;white-space:pre-wrap;border-radius:0 0 0 5px}.entry textarea{width:50%;min-height:222px;max-height:222px;resize:none;box-sizing:border-box;padding:5px;border-radius:0 0 5px}.entry .entry-label{width:50%;font-weight:700;padding:5px;background-color:#888;color:#fff;float:left;box-sizing:border-box}.entry .submit{text-align:center;padding-bottom:5px}.entry .submit button{padding:5px 35px}"]
            }] }
];
/** @nocollapse */
WizardQueryComponent.ctorParameters = () => [
    { type: WizardQueryService }
];
WizardQueryComponent.propDecorators = {
    queryInfo: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class WizardQueryDirective {
    /**
     * @param {?} queryService
     */
    constructor(queryService) {
        this.queryService = queryService;
        this.onQueryResult = new EventEmitter();
        this.onQueryError = new EventEmitter();
    }
    /**
     * @param {?} info
     * @return {?}
     */
    set wizardQuery(info) {
        this.query = info;
        if (this.query) {
            if (this.query instanceof Array) {
                this.queryService.arraySelect(this.query).subscribe((success) => {
                    if (success) {
                        this.onQueryResult.emit(success);
                    }
                }, (error) => {
                    this.onQueryResult.emit({ alert: error });
                });
            }
            else {
                this.queryService.chainSelect(this.query).subscribe((success) => {
                    if (success) {
                        this.onQueryResult.emit(success);
                    }
                }, (error) => {
                    this.onQueryResult.emit({ alert: error });
                });
            }
        }
        else {
            this.onQueryResult.emit(undefined);
        }
    }
}
WizardQueryDirective.decorators = [
    { type: Directive, args: [{
                selector: '[wizardQuery]'
            },] }
];
/** @nocollapse */
WizardQueryDirective.ctorParameters = () => [
    { type: WizardQueryService }
];
WizardQueryDirective.propDecorators = {
    onQueryResult: [{ type: Output }],
    onQueryError: [{ type: Output }],
    wizardQuery: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class WizardQueryModule {
}
WizardQueryModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    WizardQueryComponent,
                    WizardQueryDirective
                ],
                exports: [
                    WizardQueryComponent,
                    WizardQueryDirective
                ],
                imports: [
                    CommonModule,
                    HttpClientModule
                ],
                providers: [
                    WizardQueryService
                ],
                schemas: [CUSTOM_ELEMENTS_SCHEMA]
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { WizardQueryComponent, WizardQueryService, WizardQueryDirective, WizardQueryModule };

//# sourceMappingURL=sedeh-wizard-query.js.map