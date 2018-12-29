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
     * @param {?} deepXml
     * @param {?=} clause
     * @return {?}
     */
    _valueOfJsonPath(path, data, deepXml, clause) {
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
                                    if (v(x) == false) {
                                        r = false;
                                    }
                                });
                                if (r) {
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
                                    if (v(item) == false) {
                                        r = false;
                                    }
                                });
                                if (r) {
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
                                if (v(item) == false) {
                                    r = false;
                                }
                            });
                            if (r) {
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
                            if (v(x) == false) {
                                r = false;
                            }
                        });
                        if (r) {
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
        const result = [];
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
        }
        else {
            result.push(key.key);
        }
        return result.join(',');
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
     * @param {?} result
     * @return {?}
     */
    _triggerResult(promise, result) {
        promise.next(this._pack(result));
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
                                in: opkeyi.in + item,
                                deepXml: opkeyi.deepXml,
                                join: opkeyi.join,
                                queryItems: (opkeyi.path instanceof Array) ? opkeyi.path.length : 1
                            });
                        });
                    }
                    else {
                        this._subquery(promise, source, operation, {
                            path: action.join[opkeyi.path],
                            in: opkeyi.in + source,
                            deepXml: action.deepXml,
                            join: opkeyi.join,
                            queryItems: (opkeyi.path instanceof Array) ? opkeyi.path.length : 1
                        });
                    }
                }
                else if (this._addToResult(source, action.path, operation, action)) {
                    action.queryItems--;
                    if (action.queryItems === 0) {
                        this._triggerResult(promise, operation.result);
                    }
                }
                else {
                    action.queryItems--;
                    this._triggerResult(promise, operation.result);
                }
            }
        }, (error) => {
            if (this.logEnabled) {
                console.log(error);
            }
            action.queryItems--;
            this._triggerResult(promise, operation.result);
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
        if (!action.handle) {
            action.handler = (node, path, value) => value;
        }
        this.select(action.path, action.in, action.deepXml, action.handler).subscribe((data) => {
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
                                this._subquery(promise, path, operation, {
                                    path: operationalKey.path,
                                    in: operationalKey.in + content,
                                    deepXml: operationalKey.deepXml,
                                    join: operationalKey.join,
                                    queryItems: (operationalKey.path instanceof Array) ? operationalKey.path.length : 1
                                });
                            });
                        }
                        else {
                            // no more query in the chain.
                            action.queryItems--;
                            if (action.queryItems === 0) {
                                /** @type {?} */
                                const result = operation.result ? operation.result : {};
                                this._triggerResult(promise, Object.keys(operation.result).length ? operation.result : data);
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
                                this._subquery(promise, content, operation, {
                                    path: operationalKey.path,
                                    in: operationalKey.in + content,
                                    deepXml: operationalKey.deepXml,
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
                                    this._triggerResult(promise, Object.keys(operation.result).length ? operation.result : data);
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
                        this._triggerResult(promise, operation.result);
                    }
                }
            }
        }, (error) => {
            promise.error('failed to query ' + action.path);
            action.queryItems--;
            if (action.queryItems === 0) {
                this._triggerResult(promise, operation.result);
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
                    validated: [(data) => true]
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
                    validated: [(data) => true]
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
                        filter = 'return function (data) { var x = false; try{ x = (' + filter + '); }catch(e){} return x;}';
                        object['validated'].push(new Function(filter)());
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
    _prepareJsonPath(path) {
        /** @type {?} */
        let result;
        if (path instanceof Array) {
            result = [];
            path.map((i) => {
                /** @type {?} */
                const x = i.replace(/([\[(])(.+?)([\])])/g, (match, p1, p2, p3, offset, s) => {
                    return p1 + p2.replace(/\./g, '`') + p3;
                });
                result.push(this._makeArguments(x));
            });
        }
        else {
            path = path ? path : '';
            /** @type {?} */
            const x = path.replace(/([\[(])(.+?)([\])])/g, (match, p1, p2, p3, offset, s) => {
                return p1 + p2.replace(/\./g, '`') + p3;
            });
            result = this._makeArguments(x);
        }
        return result;
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
        const operation = { cachedFiles: {}, result: {} };
        /** @type {?} */
        const dataStore = new BehaviorSubject(null);
        this._queryIteration(dataStore, operation, {
            path: chainQuery.path,
            in: chainQuery.in,
            deepXml: chainQuery.deepXml,
            join: chainQuery.join,
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
            this.select(groupedList[url].path, url, groupedList[url].deepXml, clause).subscribe((data) => {
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
                    const y = this._valueOfJsonPath(pathItem, data, deepXml, clause);
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
                result = this._valueOfJsonPath(jpath, data, deepXml, clause);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLXF1ZXJ5LnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly93aXphcmQtcXVlcnkvIiwic291cmNlcyI6WyJzcmMvYXBwL3dpemFyZC1xdWVyeS93aXphcmQtcXVlcnkuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBcUNBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLFVBQVUsRUFBRSxXQUFXLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUU3RCxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDbkMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUNyQyxPQUFPLEtBQUssTUFBTSxNQUFNLFFBQVEsQ0FBQzs7OztBQVdqQyxNQUFNOzs7O0lBS0YsWUFDVTtRQUFBLFNBQUksR0FBSixJQUFJOzRCQUpRLEVBQUU7MEJBQ0osS0FBSztLQU14Qjs7Ozs7O0lBUU8sVUFBVSxDQUFDLEtBQVUsRUFBRSxPQUFnQjtRQUMzQyxFQUFFLENBQUMsQ0FBQyxLQUFLLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQzs7WUFDekIsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO1lBQ2xCLEtBQUssQ0FBQyxHQUFHLENBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRTtnQkFDaEIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO2FBQy9DLENBQUMsQ0FBQztZQUNILEtBQUssR0FBRyxNQUFNLENBQUM7U0FDbEI7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQzs7WUFDbkMsSUFBSSxLQUFLLEdBQVEsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUVwQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFB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QUksS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNsQyxNQUFNLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2FBQ2hFO1lBQ0QsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDVCxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBRTFCO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osU0FBUyxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLENBQUMsQ0FBQzthQUNuRDtTQUNKLEVBQ0QsQ0FBQyxLQUFVLEVBQUUsRUFBRTtZQUNYLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDMUIsQ0FDSixDQUFDO1FBQ0YsTUFBTSxDQUFDLFNBQVMsQ0FBQztLQUNwQjs7O1lBM3ZCSixVQUFVOzs7O1lBZEgsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4qIFF1ZXJ5IHNlcnZpY2UgcHJvdmlkZXMgYSB3YXkgdG8gcXVlcnkgYSByZW1vdGUgSlNPTiBvciBYTUwgZmlsZS4gSXQgY2FuIGJlIHVzZWQgaW4gZm9sbG93aW5nIHdheXMuXG4qXG4qIDEpIFdpdGggc2VsZWN0KCkgbWV0aG9kLCBhIHNpbmdsZSBwYXRoIG9yIGEgbGlzdCBvZiBwYXRocyBjYW4gYmUgZ2l2ZW4uIGVhY2ggcGF0aCB3aWxsIGJlIGEganNvbiBxdWFsaWZ5aW5nXG4qIHBhdGggdG8gYW4gZW5kIG5vZGUgKGkuZS4sICdib29rcy5ib29rLnRpdGxlJykuIElmIG11bHRpcGxlIHBhdGhzIGFyZSBzdXBwbGllZCwgcXVlcnkgcmVzdWx0IHdpbGwgYmUgYSBqc29uXG4qIG9iamVjdCB3aGVyZSBlYWNoIGF0dHJpYnV0ZSB3aWxsIGJlIGEgZ2l2ZW4gcXVlcnkgcGF0aCBhbmQgaXRzIHZhbHVlIHdpbGwgYmUgcXVlcnkgcmVzdWx0IGZvciB0aGF0IHBhdGguXG4qIEZvciBleGFtcGxlOlxuKiBzZWxlY3QoWydib29rcy5ib29rLnRpdGxlJywgJ2Jvb2tzLmJvb2suYXV0aG9yJ10sICcvZXhhbXBsZTEueG1sJywgZmFsc2UpXG4qIHdpbGwgcmVzdWx0IGluIHsnYm9va3MuYm9vay50aXRsZSc6IFtdLCAnYm9va3MuYm9vay5hdXRob3InOiBbXX0uXG4qIEVhY2ggcmVzdWx0IHdpbGwgbm90IGNvLXJlbGF0ZWQgd2l0aCBvdGhlciByZXN1bHQgaW4gb3JkZXIgb3IgaW4gYW55IG90aGVyIGZvcm0uIGlmIGEgY2xhdXNlIGFyZ3VtZW50IGlzXG4qIHN1cHBsaWVkLCBpdCB3aWxsIGJlIGludm9rZWQgdG8gZnVydGhlciBhc3Npc3QgaW4gZmlsdGVyaW5nIHRoZSBxdWVyeSByZXN1bHQuIGZvciBleGFtcGxlIGlmIGNlcnRhaW4gY2F0ZWdvcnlcbiogb2YgYm9va3MgYXJlIHJlcXVpcmVkLCB0aGUgY2xhdXNlIGZ1bmN0aW9uIGNhbiBsb29rIGZvciBhIGJvb2sgY2F0ZWdvcnkgYXR0cmlidXRlIGFuZCByZXR1cm4gdGhlIHF1ZXJ5IHJlc3VsdFxuKiBpZiBhY2NlcHRhYmxlIG9yIHVuZGVmaW5lZCBpZiByZXN1bHQgc2hvdWxkIGJlIGZpbHRlcmVkIG91dCBvZiB0aGUgcmVzdWx0LlxuKlxuKiAyKSBXaXRoIGFycmF5U2VsZWN0KCkgbWV0aG9kLCBhbiBhcnJheSBvZiB7cGF0aDogJycsIGluOicnLCBkZWVwWG1sOiB0cnVlfSBjYW4gYmUgc3VwcGxpZWQsIGVhY2ggZW50cnkgd2lsbCBiZSBldmFsdWF0ZWRcbiogYXMgaWYgc2VsZWN0KCkgbWV0aG9kIGlzIGludm9rZWQuIEJ1dCBmaXJzdCwgcmVxdWVzdHMgd2l0aCBzaW1pbGFyIHBhdGhzIHdpbGwgYmUgbWVyZ2VkIGludG8gb25lIGNhbGwuICBUaGlzXG4qIG1ldGhvZCBpcyB1c2VmdWwgd2hlbiBwYXRocyBhcmUgZHluYW1pY2x5IGdpdmVuIGFuZCBpdCBpcyBub3QgY2xlYXIgaW4gYWR2YW5jZSBpZiB0aGVyZSBhcmUgcmVxdWVzdHMgd2l0aFxuKiBzaW1pbGFyIHBhdGhzLiBkZWVwWG1sIGF0dHJpYnV0ZSBpcyBvcHRpb25hbC5cbipcbiogMykgV2l0aCBjaGFpblNlbGVjdCgpIG1ldGhvZCwgYSBjaGFpbmVkIHNldCBvZiB7cGF0aDogJycsIGluOiAnJywgZGVlcFhtbDogdHJ1ZX0gaXMgZ2l2ZW4gaW4gYSBqc29uIG9iamVjdC4gV2hlbiByZXN1bHQgb2ZcbiogYSBxdWVyeSBiZWNvbWVzIGF2YWlsYWJsZSwgdGhlIHJlcXVlc3QganNvbiB3aWxsIGJlIGV4YW1pbmVkIHRvIHNlZSBpZiBhIHJlcXVlc3QgZm9yIHRoZSBrZXkgaXMgYXZhaWxhYmxlLiBJZlxuKiBzbywgdGhlbiB0aGUgJ2luJyBmb3IgdGhlIHBhdGggd2lsbCBiZSBwcmVwZW5kZWQgdG8gdGhlIHJlc3VsdGluZyB2YWx1ZSBvZiB0aGUgcHJldmlvdXMgcXVlcnkuICwgZGVlcFhtbCBhdHRyaWJ1dGUgaXMgXG4qIG9wdGlvbmFsLiBUaGlzIG1ldGhvZCBpcyB1c2VmdWwgd2hlbiByZXN1bHQgb2YgYSBxdWVyeSBpcyBhIGpzb24gb3IgYW4geG1sIGZpbGUgYW5kIGFkZGl0aW9uYWwgcXVlcnkgaXMgbmVlZGVkIFxuKiBmdXJ0aGVyIGRvd24gaW4gdGhlIHByZWNlZWRpbmcgZmlsZXMuIEZvciBleGFtcGxlIHRoZSBhc3N1bXB0aW9uIGluIHRoZSBmb2xsb3dpbmcgY2FsbCBpcyB0aGF0IGVhY2ggYm9va3MuYm9vayBcbiogcmVzdWx0IHdpbGwgYmUgYSBmaWxlIG5hbWUgYW5kIHRoZSBmaWxlIHBhdGggZm9yIGVhY2ggcmVzdWx0IGlzICcvc2FtcGxlcy9ib29rcy8nLlxuKiBjaGFpblNlbGVjdCh7XG4qICAgcGF0aDogJ2Jvb2tzLmJvb2snLFxuKiAgIGluOiAnc2FtcGxlMS54bWwnLFxuKiAgIGRlZXBYbWw6IHRydWUsXG4qICAgJ2Jvb2tzLmJvb2snOiB7XG4qICAgICAgIGluOiAnL3NhbXBsZXMvYm9va3MvJyxcbiogICAgICAgcGF0aDogWydwdWJsaWNhdGlvbi50aXRsZScsICdwdWJsaWNhdGlvbi5hdXRob3InXSxcbiogICAgICAgaGFuZGxlcjogdGhpcy5idWJsaWNhdGlvbkhhbmRsZXJcbiogICB9KVxuKiBpZiBhIGhhbmRsZXIgaXMgc3VwcGxpZWQsIGl0IHdpbGwgYmUgdXNlZCB0byBmaWx0ZXIgb3V0IGFueSByZXN1bHQgdGhhdCBpcyBub3QgYWNjZXB0YWJsZS5cbipcbiovXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtIdHRwQ2xpZW50LCBIdHRwSGVhZGVyc30gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuXG5pbXBvcnQge21hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtCZWhhdmlvclN1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0ICogYXMgeG1sZG9tIGZyb20gJ3htbGRvbSc7XG5cbi8qXG4qIEBwYXJhbSBub2RlIFRoZSBwYXJlbnQgbm9kZS4gaXQgY2FuIGJlIHVzZWQgdG8gZXZhbHVhdGUgYmFzZWQgb24gb3RoZXIgYXR0cmlidXRlcyBpbiB0aGUgbm9kZS5cbiogQHBhcmFtIHBhdGggYXR0cmlidXRlIHRvIGJlIGV4YW1pbmVkLlxuKiBAcGFyYW0gdmFsdWUgdGhlIHZhbHVlIG9mIHRoZSBwYXRoLiBpdCBjb3VsZCBiZSB1bmRlZmluZWQsIGEgbGl0ZXJhbCwgb3IgYSBsaXN0LlxuKiBAcmV0dXJucyByZXR1cm5zIHRoZSB2YWx1ZSBvciBmaWx0ZXJlZCB2ZXJzaW9uIG9mIHRoZSB2YWx1ZSBvciB1bmRlZmluZWQgb3RoZXJ3aXNlLlxuKi9cbmV4cG9ydCB0eXBlIGNsYXVzZUV2YWx1YXRvciA9IChub2RlOiBhbnksIHBhdGg6IHN0cmluZywgdmFsdWU6IGFueSkgPT4gYW55O1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgV2l6YXJkUXVlcnlTZXJ2aWNlIHtcblxuICAgIHB1YmxpYyBTRVJWSUNFX1BBVEggPSAnJztcbiAgICBwdWJsaWMgbG9nRW5hYmxlZCA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnRcbiAgICApIHtcblxuICAgIH1cblxuICAgIC8qXG4gICAgKiBXaWxsIG5vcm1hbGl6ZSB0aGUgZ2l2ZW4geG1sIG91dCBvZiBhZGRpdGlvbmFsICN0ZXh0IG9yICNjZGF0YS1zZWN0aW9uIG5vZGVzLlxuICAgICogQHBhcmFtIHZhbHVlIHRoZSB4bWwgdG8gYmUgbm9ybWFpbHplZC5cbiAgICAqIEBwYXJhbSBkZWVwWG1sIGlmIGNkYXRhLXNlY3Rpb24gc2hvdWxkIGJlIHBhcnNlZC5cbiAgICAqIEByZXR1cm4gbm9ybWFsaXplZCB4bWwuXG4gICAgKi9cbiAgICBwcml2YXRlIF9ub3JtYWxpemUodmFsdWU6IGFueSwgZGVlcFhtbDogYm9vbGVhbikge1xuICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgICAgICAgICB2YWx1ZS5tYXAoIChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5fbm9ybWFsaXplKGl0ZW0sIGRlZXBYbWwpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFsdWUgPSByZXN1bHQ7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgbGV0IGl0ZW1zOiBhbnkgPSBPYmplY3Qua2V5cyh2YWx1ZSk7XG5cbiAgICAgICAgICAgIGlmIChpdGVtcy5sZW5ndGggPT09IDEgJiYgISh2YWx1ZVtpdGVtc1swXV0gaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWVbJyN0ZXh0J10pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZVsnI3RleHQnXTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlWycjY2RhdGEtc2VjdGlvbiddKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWVbJyNjZGF0YS1zZWN0aW9uJ107XG4gICAgICAgICAgICAgICAgICAgIGlmIChkZWVwWG1sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHhtbCA9IG5ldyB4bWxkb20uRE9NUGFyc2VyKCkucGFyc2VGcm9tU3RyaW5nKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9ICh4bWwuZG9jdW1lbnRFbGVtZW50ICYmIHhtbC5kb2N1bWVudEVsZW1lbnQgIT0gbnVsbCkgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3htbDJqc29uKHhtbC5kb2N1bWVudEVsZW1lbnQpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1jYXRjaChlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgICAgICAgICAgICAgaXRlbXMubWFwKCAoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRbaXRlbV0gPSB0aGlzLl9ub3JtYWxpemUodmFsdWVbaXRlbV0sIGRlZXBYbWwpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHZhbHVlID0gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICAvKlxuICAgICogQHBhcmFtIHBhdGggSlNPTiBwYXRoIHRvIGV2YWx1YXRlLiBBIHBhdGggY291bGQgYmUgZnVsbHkgcXVhbGlmaWVkIGZvciBkZXB0aCBvZiBqc29uIChpLmUuLCAnYS5iLmMnKVxuICAgICogQHBhcmFtIGRhdGEgdGhlIGRhdGEgc291cmNlLlxuICAgICogQHBhcmFtIGRlZXBYbWwgaWYgY2RhdGEtc2VjdGlvbiBzaG91bGQgYmUgcGFyc2VkLlxuICAgICogQHBhcmFtIGNsYXVzZSBBIG1ldGhvZCBieSB3aGljaCB2YWx1ZShzKSBmb3IgdGhlIGtleShzKSBjb3VsZCBiZSBldmFsdWF0ZWQuIHRoZSBjYWxsZXIgd291bGQgZXZhbHVhdGUgdGhlIHZhbHVlIGZvciBhIGdpdmVuIGF0dHJpYnV0ZS5cbiAgICAqIEByZXR1cm5zIHJldHVybnMgZXZsdWF0ZWQgdmFsdWUgZm9yIHRoZSBrZXkgaW4gZGF0YSBzb3VyY2UuXG4gICAgKi9cbiAgICBwcml2YXRlIF92YWx1ZU9mSnNvblBhdGgoXG4gICAgICAgIHBhdGg6IGFueSxcbiAgICAgICAgZGF0YTogYW55LFxuICAgICAgICBkZWVwWG1sOiBib29sZWFuLFxuICAgICAgICBjbGF1c2U/OiBjbGF1c2VFdmFsdWF0b3IpOiBhbnkge1xuXG4gICAgICAgIGxldCByZXN1bHQ6IGFueTtcbiAgICAgICAgbGV0IHggPSB0aGlzLl9ub3JtYWxpemUoZGF0YSwgZGVlcFhtbCk7XG4gICAgICAgIHBhdGgubWFwKCAoc3Via2V5OiBhbnkpID0+IHtcbiAgICAgICAgICAgIGxldCBub2RlID0geDtcbiAgICAgICAgICAgIGlmIChub2RlICYmIG5vZGUgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHQgPSBbXTtcbiAgICAgICAgICAgICAgICBpZiAoc3Via2V5LnNvcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZSA9IHN1YmtleS5zb3J0KG5vZGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBub2RlLm1hcCAoXG4gICAgICAgICAgICAgICAgICAgIChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1YmtleS5rZXkubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHggPSBzdWJrZXkua2V5Lmxlbmd0aCA/IGl0ZW1bc3Via2V5LmtleV0gOiBpdGVtO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoeCAmJiBzdWJrZXkudmFsaWRhdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJrZXkudmFsaWRhdGVkLm1hcCh2ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih2KHgpID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdC5wdXNoKHgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1YmtleS52YWxpZGF0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YmtleS52YWxpZGF0ZWQubWFwKHYgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHYoaXRlbSkgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0LnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHggPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0LnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHN1YmtleS5rZXkubGVuZ3RoICYmICh0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5zcGxpdCgnLicpLm1hcChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHN0cikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0ci5pbmRleE9mKHN1YmtleS5rZXkpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0LnB1c2goc3RyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgeCA9IHQ7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0geDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobm9kZSAmJiAodHlwZW9mIG5vZGUgPT09ICdvYmplY3QnKSkge1xuICAgICAgICAgICAgICAgIHggPSB4ID9cbiAgICAgICAgICAgICAgICAgICAgY2xhdXNlKG5vZGUsIHN1YmtleS5rZXksIHN1YmtleS5rZXkubGVuZ3RoID8geFtzdWJrZXkua2V5XTogIHgpIDpcbiAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIGlmICh4ICYmIHggaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ID0gW107XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdWJrZXkuc29ydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgeCA9IHN1YmtleS5zb3J0KHgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHgubWFwKFxuICAgICAgICAgICAgICAgICAgICAgICAgKGl0ZW06IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdWJrZXkudmFsaWRhdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Via2V5LnZhbGlkYXRlZC5tYXAodiA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih2KGl0ZW0pID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHggPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIHggPSB0O1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB4O1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoeCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3Via2V5LnZhbGlkYXRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3Via2V5LnZhbGlkYXRlZC5tYXAodiA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodih4KSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHg7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHggPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB4O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChub2RlICYmICh0eXBlb2Ygbm9kZSA9PT0gJ3N0cmluZycpICYmIHN1YmtleS5rZXkubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gW107XG4gICAgICAgICAgICAgICAgbm9kZS5zcGxpdCgnLicpLm1hcChcbiAgICAgICAgICAgICAgICAgICAgKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLmluZGV4T2Yoc3Via2V5LmtleSkgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBub2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9nZXQocGF0aDogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IHVybCA9IHRoaXMuU0VSVklDRV9QQVRIICsgcGF0aDtcbiAgICAgICAgY29uc3QgZG90ID0gcGF0aC5sYXN0SW5kZXhPZignLicpO1xuICAgICAgICBjb25zdCBleHQgPSBkb3QgPCAwID8gdW5kZWZpbmVkIDogcGF0aC50b0xvd2VyQ2FzZSgpLnN1YnN0cihkb3QpO1xuICAgICAgICBjb25zdCBoZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKCk7XG4gICAgICAgIGxldCByZXN1bHQ6IGFueTtcblxuICAgICAgICBoZWFkZXJzLnNldCgnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJywgJyonKTtcblxuICAgICAgICBpZiAoZXh0ID09PSAnLnhtbCcpIHtcbiAgICAgICAgICAgIGhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCAndGV4dDsgY2hhcnNldD11dGYtOCcpLnNldCgnQWNjZXB0JywgJ3RleHQnKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5nZXQodXJsLCB7IGhlYWRlcnMsIHJlc3BvbnNlVHlwZTogJ3RleHQnIH0pXG4gICAgICAgICAgICAgICAgLnBpcGUobWFwKChyZXMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeG1sID0gbmV3IHhtbGRvbS5ET01QYXJzZXIoKS5wYXJzZUZyb21TdHJpbmcocmVzKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QganNvbiA9IHRoaXMuX3htbDJqc29uKHhtbC5kb2N1bWVudEVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ganNvbjtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmIChleHQgPT09ICcudHh0Jykge1xuICAgICAgICAgICAgaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsICd0ZXh0OyBjaGFyc2V0PXV0Zi04Jykuc2V0KCdBY2NlcHQnLCAndGV4dCcpO1xuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLmdldCh1cmwsIHsgaGVhZGVycywgcmVzcG9uc2VUeXBlOiAndGV4dCcgfSkucGlwZShtYXAoKHJlcykgPT4gcmVzKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXh0ID09PSAnLmpzb24nKXtcbiAgICAgICAgICAgIGhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCAnanNvbjsgY2hhcnNldD11dGYtOCcpLnNldCgnQWNjZXB0JywgJ2pzb24nKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5nZXQodXJsLCB7aGVhZGVyc30pLnBpcGUobWFwKChyZXMpID0+IHJlcykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsICd0ZXh0OyBjaGFyc2V0PXV0Zi04Jykuc2V0KCdBY2NlcHQnLCAndGV4dCcpO1xuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLmdldCh1cmwsIHsgaGVhZGVycywgcmVzcG9uc2VUeXBlOiAndGV4dCcgfSlcbiAgICAgICAgICAgICAgICAucGlwZShtYXAoKHJlcykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcGFyc2VkOiBhbnk7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZWQgPSBKU09OLnBhcnNlKHJlcyk7XG4gICAgICAgICAgICAgICAgICAgIH1jYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB4bWwgPSBuZXcgeG1sZG9tLkRPTVBhcnNlcigpLnBhcnNlRnJvbVN0cmluZyhyZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlZCA9IHRoaXMuX3htbDJqc29uKHhtbC5kb2N1bWVudEVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZTIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZWQgPSByZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZWQgPyBwYXJzZWQgOiByZXM7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9zdHJpbmdWYWx1ZU9mS2V5KGtleTogYW55KSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuXG4gICAgICAgIGlmIChrZXkgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAga2V5Lm1hcCggXG4gICAgICAgICAgICAgICAgKGl0ZW06IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgeCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5tYXAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHN1Yml0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1Yml0ZW0ua2V5Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeC5wdXNoKHN1Yml0ZW0ua2V5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHguam9pbignLicpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGkgPSBpdGVtLmluZGV4T2YoJ1snKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGogPSBpdGVtLmluZGV4T2YoJ10nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGsgPSBpdGVtLmxlbmd0aCA+IChqICsgMSkgPyAyIDogMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGkgPiAwID8gaXRlbS5zdWJzdHJpbmcoMCxpKSA6IGogPiAwID8gaXRlbS5zdWJzdHJpbmcoaiArIGspIDogaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS5rZXkubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChpdGVtLmtleSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaChrZXkua2V5KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQuam9pbignLCcpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2FkZFRvUmVzdWx0KHZhbHVlOiBhbnksIGtleTogc3RyaW5nLCBvcGVyYXRpb246IGFueSwgYWN0aW9uOiBhbnkpIHtcbiAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMuX3N0cmluZ1ZhbHVlT2ZLZXkoYWN0aW9uLnBhdGgpO1xuICAgICAgICBjb25zdCBrZXkyID0gdGhpcy5fc3RyaW5nVmFsdWVPZktleShrZXkpO1xuICAgICAgICBsZXQgb3AgPSBvcGVyYXRpb24ucmVzdWx0W3BhdGhdO1xuICAgICAgICBsZXQgY29tcGxldGUgPSBmYWxzZTtcbiAgICBcbiAgICAgICAgaWYgKCFvcCkge1xuICAgICAgICAgICAgb3BlcmF0aW9uLnJlc3VsdFtwYXRoXSA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcCkge1xuICAgICAgICAgICAgbGV0IG9wayA9IG9wW2tleTJdO1xuICAgICAgICAgICAgaWYgKG9wZXJhdGlvblsndGVtcCddICYmXG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uWyd0ZW1wJ11ba2V5Ml0pIHtcbiAgICAgICAgICAgICAgICBvcFtrZXkyXSA9IFtvcFtrZXkyXV07XG4gICAgICAgICAgICAgICAgZGVsZXRlIG9wZXJhdGlvblsndGVtcCddO1xuICAgICAgICAgICAgfWVsc2UgaWYgKG9wayAmJiAob3BrIGluc3RhbmNlb2YgQXJyYXkpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5yZXN1bHRbcGF0aF1ba2V5Ml0gPSBbb3BrXVxuICAgICAgICAgICAgICAgIG9wID0gb3BlcmF0aW9uLnJlc3VsdFtwYXRoXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhbHVlID0gdGhpcy5fbm9ybWFsaXplKHZhbHVlLCBhY3Rpb24uZGVlcFhtbCk7XG4gICAgICAgICAgICBpZiAob3Bba2V5Ml0pIHtcbiAgICAgICAgICAgICAgICBvcFtrZXkyXS5wdXNoKCB2YWx1ZVtrZXkyXSA/IHZhbHVlW2tleTJdIDogdmFsdWUgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKChvcCBpbnN0YW5jZW9mIEFycmF5KSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLnJlc3VsdFtwYXRoXSA9IFtvcF07XG4gICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5yZXN1bHRbcGF0aF0ucHVzaCggdmFsdWVba2V5Ml0gPyB2YWx1ZVtrZXkyXSA6IHZhbHVlICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgb3AucHVzaCggdmFsdWVba2V5Ml0gPyB2YWx1ZVtrZXkyXSA6IHZhbHVlICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiBhbHJlYWR5IGFuIGFycmF5IHJlbWVtYmVyIGl0LlxuICAgICAgICAgICAgICAgIGlmICghb3BlcmF0aW9uWyd0ZW1wJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uWyd0ZW1wJ10gPSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFvcGVyYXRpb25bJ3RlbXAnXVtrZXkyXSkge1xuICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb25bJ3RlbXAnXVtrZXkyXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3BlcmF0aW9uLnJlc3VsdFtwYXRoXVtrZXkyXSA9IHRoaXMuX25vcm1hbGl6ZSh2YWx1ZSwgYWN0aW9uLmRlZXBYbWwpO1xuICAgICAgICAgICAgY29tcGxldGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb21wbGV0ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9wYWNrKHJlc3VsdDogYW55KSB7XG4gICAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgY29uc3QgbGlzdCA9IFtdO1xuICAgICAgICAgICAgcmVzdWx0Lm1hcChcbiAgICAgICAgICAgICAgICAoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2godGhpcy5fcGFjayhpdGVtKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IGxpc3Q7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHJlc3VsdCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhyZXN1bHQpO1xuICAgICAgICAgICAga2V5cy5tYXAgKFxuICAgICAgICAgICAgICAgIChrZXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IHJlc3VsdFtrZXldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIEFycmF5KSB7XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpdGVtW2tleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gaXRlbVtrZXldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfdHJpZ2dlclJlc3VsdChwcm9taXNlOiBhbnksIHJlc3VsdDogYW55KSB7XG4gICAgICAgIHByb21pc2UubmV4dCh0aGlzLl9wYWNrKHJlc3VsdCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX3N1YnF1ZXJ5KFxuICAgICAgICBwcm9taXNlOiBhbnksXG4gICAgICAgIHBhdGg6IGFueSxcbiAgICAgICAgb3BlcmF0aW9uOiBhbnksXG4gICAgICAgIGFjdGlvbjogYW55KSB7XG5cbiAgICAgICAgaWYgKG9wZXJhdGlvbi5jYWNoZWRGaWxlc1twYXRoXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBvbmUgb2YgdGhlIGtleXMgYXQgdGhpcyBsZXZlbCBjb3VsZCBiZSByZWZlcmVuY2luZyB0aGUgc2FtZSBmaWxlIHdoaWNoXG4gICAgICAgICAgICAvLyBpcyBub3QgeWV0IGZldGNoZWQuIG5lZWQgdG8gd2FpdCB0aWxsIGl0IGlzIGF2YWlsYWJsZS5cbiAgICAgICAgICAgIG9wZXJhdGlvbi5jYWNoZWRGaWxlc1twYXRoXSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8YW55PihudWxsKTtcbiAgICAgICAgICAgIHRoaXMuX3F1ZXJ5SXRlcmF0aW9uKFxuICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5jYWNoZWRGaWxlc1twYXRoXSxcbiAgICAgICAgICAgICAgICBvcGVyYXRpb24sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBwYXRoOiBhY3Rpb24ucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgaW46IGFjdGlvbi5pbixcbiAgICAgICAgICAgICAgICAgICAgZGVlcFhtbDogYWN0aW9uLmRlZXBYbWwsXG4gICAgICAgICAgICAgICAgICAgIGpvaW46IGFjdGlvbi5qb2luLFxuICAgICAgICAgICAgICAgICAgICBxdWVyeUl0ZW1zOiAoYWN0aW9uLnBhdGggaW5zdGFuY2VvZiBBcnJheSkgPyBhY3Rpb24ucGF0aC5sZW5ndGggOiAxXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBwYXRoXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gd2FpdCBmb3IgcmVzdWx0IHJhaXNlZCBhYm92ZS5cbiAgICAgICAgb3BlcmF0aW9uLmNhY2hlZEZpbGVzW3BhdGhdLnN1YnNjcmliZShcbiAgICAgICAgICAgIChzb3VyY2U6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3BrZXlpID0gYWN0aW9uLmpvaW4gPyBhY3Rpb24uam9pblthY3Rpb24ucGF0aF0gOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcGtleWkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzb3VyY2UgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZS5tYXAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdWJxdWVyeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogb3BrZXlpLnBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluOiBvcGtleWkuaW4gKyBpdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWVwWG1sOiBvcGtleWkuZGVlcFhtbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgam9pbjogb3BrZXlpLmpvaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5SXRlbXM6IChvcGtleWkucGF0aCBpbnN0YW5jZW9mIEFycmF5KSA/IG9wa2V5aS5wYXRoLmxlbmd0aCA6IDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdWJxdWVyeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IGFjdGlvbi5qb2luW29wa2V5aS5wYXRoXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluOiBvcGtleWkuaW4gKyBzb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWVwWG1sOiBhY3Rpb24uZGVlcFhtbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpvaW46IG9wa2V5aS5qb2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnlJdGVtczogKG9wa2V5aS5wYXRoIGluc3RhbmNlb2YgQXJyYXkpID8gb3BrZXlpLnBhdGgubGVuZ3RoIDogMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9hZGRUb1Jlc3VsdChzb3VyY2UsIGFjdGlvbi5wYXRoLCBvcGVyYXRpb24sIGFjdGlvbikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbi5xdWVyeUl0ZW1zLS07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aW9uLnF1ZXJ5SXRlbXMgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl90cmlnZ2VyUmVzdWx0KHByb21pc2UsIG9wZXJhdGlvbi5yZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb24ucXVlcnlJdGVtcy0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdHJpZ2dlclJlc3VsdChwcm9taXNlLCBvcGVyYXRpb24ucmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAoZXJyb3I6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxvZ0VuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhY3Rpb24ucXVlcnlJdGVtcy0tO1xuICAgICAgICAgICAgICAgIHRoaXMuX3RyaWdnZXJSZXN1bHQocHJvbWlzZSwgb3BlcmF0aW9uLnJlc3VsdCk7XG4gICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG4gICAgLypcbiAgICAqIEl0ZXJhdGVzIHRocm91Z2ggYSBjaGFpbiBxdWVyeS5cbiAgICAqIEBwYXJhbSBwcm9taXNlIFRoZSBwcm9taXNlIHdoaWNoIG9yaWdpbmFsIGNhbGxlciBpcyB3YWl0aW5nIGZvci5cbiAgICAqIEBwYXJhbSBvcGVyYXRpb24gZGF0YSBmb3Iga2VlcGluZyB0cmFjayBvZiB0aGUgaXRlcmF0aW9uLlxuICAgICogQHBhcmFtIGFjdGlvbiBjb250YWluczoge3BhdGg6IGN1cnJlbnQga2V5cyB0byBxdWVyeSBmb3IsIGluOiBjdXJyZW50IHF1ZXJ5IHBhdGgsIGhhbmRsZXI6IHJlc29sdmVyIG1ldGhvZH0uXG4gICAgKiBAcGFyYW0gY2FjaGVOYW1lZCBUaGUgY2FjaGVkIG5hbWUgZnJvbSBwcmV2aW91cyBpdGVyYXRpb24gaWYgYW55LlxuICAgICogQHJldHVybnMgcmV0dXJucyBub25lLlxuICAgICovXG4gICAgcHJpdmF0ZSBfcXVlcnlJdGVyYXRpb24oXG4gICAgICAgIHByb21pc2U6IEJlaGF2aW9yU3ViamVjdDxhbnk+LFxuICAgICAgICBvcGVyYXRpb246IGFueSxcbiAgICAgICAgYWN0aW9uOiBhbnksXG4gICAgICAgIGNhY2hlTmFtZWQ/OiBzdHJpbmcpIHtcblxuICAgICAgICBpZiAoIWFjdGlvbi5oYW5kbGUpIHtcbiAgICAgICAgICAgIGFjdGlvbi5oYW5kbGVyID0gKG5vZGU6IGFueSwgcGF0aDogc3RyaW5nLCB2YWx1ZTogYW55KSA9PiB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNlbGVjdChhY3Rpb24ucGF0aCwgYWN0aW9uLmluLCBhY3Rpb24uZGVlcFhtbCwgYWN0aW9uLmhhbmRsZXIpLnN1YnNjcmliZShcbiAgICAgICAgICAgIChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhY2hlTmFtZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlc3VsdCBvZiBuLXRoIGxldmVsIGNhbGwgdG8gYmUgcGxhY2VkIG9uIHByZXZpb3VzIGxldmVsIGNhY2hlIHJlZmVyZW5jZS5cbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5jYWNoZWRGaWxlc1tjYWNoZU5hbWVkXS5uZXh0KGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9wZXJhdGlvbmFsS2V5ID0gYWN0aW9uLmpvaW4gPyBhY3Rpb24uam9pblthY3Rpb24ucGF0aF0gOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wZXJhdGlvbmFsS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFzc3VtcHRpb24gaXMgdGhlIHJlc3VsdGluZyBsaXN0IGlzIGEgbGlzdCBvZiBmaWxlIHBhdGhzLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLm1hcCggKGNvbnRlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhdGggPSBjb250ZW50WycjdGV4dCddID8gY29udGVudFsnI3RleHQnXSA6IGNvbnRlbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdWJxdWVyeShwcm9taXNlLCBwYXRoLCBvcGVyYXRpb24sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBvcGVyYXRpb25hbEtleS5wYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluOiBvcGVyYXRpb25hbEtleS5pbiArIGNvbnRlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVlcFhtbDogb3BlcmF0aW9uYWxLZXkuZGVlcFhtbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqb2luOiBvcGVyYXRpb25hbEtleS5qb2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5SXRlbXM6IChvcGVyYXRpb25hbEtleS5wYXRoIGluc3RhbmNlb2YgQXJyYXkpID8gb3BlcmF0aW9uYWxLZXkucGF0aC5sZW5ndGggOiAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbm8gbW9yZSBxdWVyeSBpbiB0aGUgY2hhaW4uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbi5xdWVyeUl0ZW1zLS07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhY3Rpb24ucXVlcnlJdGVtcyA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID1vcGVyYXRpb24ucmVzdWx0ID8gb3BlcmF0aW9uLnJlc3VsdCA6IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdHJpZ2dlclJlc3VsdChwcm9taXNlLCBPYmplY3Qua2V5cyhvcGVyYXRpb24ucmVzdWx0KS5sZW5ndGggPyBvcGVyYXRpb24ucmVzdWx0IDogZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBkYXRhID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGRhdGEpLm1hcCggKGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjb250ZW50ID0gZGF0YVtrZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvcGVyYXRpb25hbEtleSA9IGFjdGlvbi5qb2luID8gYWN0aW9uLmpvaW5ba2V5XTogdW5kZWZpbmVkO1xuICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29udGVudCAmJiBjb250ZW50Lmxlbmd0aCAmJiBvcGVyYXRpb25hbEtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3VicXVlcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IG9wZXJhdGlvbmFsS2V5LnBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluOiBvcGVyYXRpb25hbEtleS5pbiArIGNvbnRlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZXBYbWw6IG9wZXJhdGlvbmFsS2V5LmRlZXBYbWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5SXRlbXM6IChvcGVyYXRpb25hbEtleS5wYXRoIGluc3RhbmNlb2YgQXJyYXkpID8gb3BlcmF0aW9uYWxLZXkucGF0aC5sZW5ndGggOiAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbi5xdWVyeUl0ZW1zLS07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29udGVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghb3BlcmF0aW9uLnJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb24ucmVzdWx0ID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcGVyYXRpb24ucmVzdWx0IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLnJlc3VsdC5wdXNoKGNvbnRlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5yZXN1bHRba2V5XSA9IGNvbnRlbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGlvbi5xdWVyeUl0ZW1zID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdHJpZ2dlclJlc3VsdChwcm9taXNlLCBPYmplY3Qua2V5cyhvcGVyYXRpb24ucmVzdWx0KS5sZW5ndGggPyBvcGVyYXRpb24ucmVzdWx0IDogZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uLnF1ZXJ5SXRlbXMtLTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aW9uLnF1ZXJ5SXRlbXMgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKG9wZXJhdGlvbi5yZXN1bHQpLmxlbmd0aCA9PT0gMCAmJiBkYXRhICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5yZXN1bHQgPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3RyaWdnZXJSZXN1bHQocHJvbWlzZSwgb3BlcmF0aW9uLnJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgKGVycm9yOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBwcm9taXNlLmVycm9yKCdmYWlsZWQgdG8gcXVlcnkgJyArIGFjdGlvbi5wYXRoKTtcbiAgICAgICAgICAgICAgICBhY3Rpb24ucXVlcnlJdGVtcy0tO1xuICAgICAgICAgICAgICAgIGlmIChhY3Rpb24ucXVlcnlJdGVtcyA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl90cmlnZ2VyUmVzdWx0KHByb21pc2UsIG9wZXJhdGlvbi5yZXN1bHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9tYWtlQXJndW1lbnRzKGtleTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGxpc3QgPSBrZXkuc3BsaXQoJy4nKTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgICAgIGxpc3QubWFwKCAoaXRlbSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgYiA9IGl0ZW0uaW5kZXhPZignWycpO1xuICAgICAgICAgICAgaWYgKGIgPCAwKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBrZXk6IGl0ZW0sXG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRlZDogWyhkYXRhKSA9PiB0cnVlXVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgc3RyID0gaXRlbS5zdWJzdHJpbmcoYiArIDEsIGl0ZW0ubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICAgICAgY29uc3Qgdkxpc3QgPSBzdHIuc3BsaXQoJ11bJyk7XG4gICAgICAgICAgICAgICAgY29uc3Qgb2JqZWN0ID0ge1xuICAgICAgICAgICAgICAgICAgICBrZXk6IGl0ZW0uc3Vic3RyaW5nKDAsYiksXG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRlZDogWyhkYXRhKSA9PiB0cnVlXVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgdkxpc3QubWFwKCBcbiAgICAgICAgICAgICAgICAgICAgKGZpbHRlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyID0gZmlsdGVyLnJlcGxhY2UoL1xcYC9nLCAnLicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyID0gZmlsdGVyLnJlcGxhY2UoL1xcQC9nLCAnZGF0YScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpbHRlci5pbmRleE9mKCdvcmRlci1ieTonKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXJnOiBhbnkgPSBmaWx0ZXIuc3Vic3RyaW5nKGZpbHRlci5pbmRleE9mKCdvcmRlci1ieTonKSArIDEwKS50cmltKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXJnbGlzdCA9IGFyZy5zcGxpdCgnficpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGFyZ2xpc3RbMF0udHJpbSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9yZGVyPSBhcmdsaXN0WzFdID8gYXJnbGlzdFsxXS50cmltKCkudG9Mb3dlckNhc2UoKTogJ2FzYyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0Wydzb3J0J10gPSBmdW5jdGlvbiAoYXJyYXk6IGFueSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBfdmFsdWVPZiA9IChrZXk6IHN0cmluZywgcDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXkuc3BsaXQoJy4nKS5tYXAoICh4KSA9PiB7cCA9IHBbeF19KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhcnJheS5zb3J0KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oYTogYW55LGI6IGFueSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZmxhZyA9X3ZhbHVlT2Yoa2V5LCBhKSA+IF92YWx1ZU9mKGtleSwgYik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZsYWcgPyAob3JkZXIgPT09ICdhc2MnID8gMTogLTEpIDogKG9yZGVyID09PSAnYXNjJyA/IC0xOiAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyID0gJ3JldHVybiBmdW5jdGlvbiAoZGF0YSkgeyB2YXIgeCA9IGZhbHNlOyB0cnl7IHggPSAoJyArIGZpbHRlciArICcpOyB9Y2F0Y2goZSl7fSByZXR1cm4geDt9JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RbJ3ZhbGlkYXRlZCddLnB1c2goIG5ldyBGdW5jdGlvbihmaWx0ZXIpKCkgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gob2JqZWN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfcHJlcGFyZUpzb25QYXRoKHBhdGg6IGFueSkge1xuICAgICAgICBsZXQgcmVzdWx0OiBhbnk7XG4gICAgICAgIGlmIChwYXRoIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IFtdO1xuICAgICAgICAgICAgcGF0aC5tYXAoXG4gICAgICAgICAgICAgICAgKGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeCA9IGkucmVwbGFjZSgvKFtcXFsoXSkoLis/KShbXFxdKV0pL2csIChtYXRjaCwgcDEsIHAyLCBwMywgb2Zmc2V0LCBzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcDEgKyBwMi5yZXBsYWNlKC9cXC4vZywnYCcpICsgcDM7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLl9tYWtlQXJndW1lbnRzKHgpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGF0aCA9IHBhdGggPyBwYXRoIDogJyc7XG4gICAgICAgICAgICBjb25zdCB4ID0gcGF0aC5yZXBsYWNlKC8oW1xcWyhdKSguKz8pKFtcXF0pXSkvZywgKG1hdGNoLCBwMSwgcDIsIHAzLCBvZmZzZXQsIHMpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcDEgKyBwMi5yZXBsYWNlKC9cXC4vZywnYCcpICsgcDM7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuX21ha2VBcmd1bWVudHMoeCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgXG5cbiAgICAvKlxuICAgICogV2lsbCBjb252ZXJ0IHRoZSB4bWwgaW50byBhIGpzb24uXG4gICAgKiBAcGFyYW0geG1sIFhNTCB0byBiZSBjb252ZXJ0ZWQuXG4gICAgKiBAcmV0dXJucyByZXR1cm5zIGNvbnZlcnRlZCBKU09OLlxuICAgICovXG4gICAgcHJpdmF0ZSBfeG1sMmpzb24oeG1sOiBhbnkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBvYmogPSB7fTtcbiAgICAgICAgICAgIGlmICh4bWwuYXR0cmlidXRlcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGMgPSB4bWwuYXR0cmlidXRlcztcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhdHRyID0gY1tpXTtcbiAgICAgICAgICAgICAgICBvYmpbYXR0ci5uYW1lXSA9IGF0dHIudmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHhtbC5jaGlsZE5vZGVzICYmIHhtbC5jaGlsZE5vZGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB4bWwuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSB4bWwuY2hpbGROb2Rlc1tpXTtcbiAgICAgICAgICAgICAgICBjb25zdCBub2RlTmFtZSA9IGl0ZW0ubm9kZU5hbWU7XG5cbiAgICAgICAgICAgICAgICBpZiAob2JqW25vZGVOYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZyYWdtZW50ID0gdGhpcy5feG1sMmpzb24oaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmcmFnbWVudCkge1xuICAgICAgICAgICAgICAgICAgICBvYmpbbm9kZU5hbWVdID0gZnJhZ21lbnQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChvYmpbbm9kZU5hbWVdLnB1c2ggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvbGQgPSBvYmpbbm9kZU5hbWVdO1xuXG4gICAgICAgICAgICAgICAgICAgIG9ialtub2RlTmFtZV0gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgb2JqW25vZGVOYW1lXS5wdXNoKG9sZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGZyYWdtZW50ID0gdGhpcy5feG1sMmpzb24oaXRlbSk7XG4gICAgICAgICAgICAgICAgaWYgKGZyYWdtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIG9ialtub2RlTmFtZV0ucHVzaChmcmFnbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0geG1sLnRleHRDb250ZW50LnRyaW0oKS5yZXBsYWNlKC8oPzpcXHJcXG58XFxyfFxcbnxcXHQpL2csICcnKTtcbiAgICAgICAgICAgIG9iaiA9IHRleHQubGVuZ3RoID8gdGV4dCA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmxvZ0VuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlLm1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLypcbiAgICAqIFdpbGwgZG8gYSBjaGFpbiBxdWVyeSBvbiBzcGVjaWZpZWQgcGF0aHMgZnJvbSByZW1vdGUgbG9jYXRpb24uXG4gICAgKiBAcGFyYW0gY2hhaW5RdWVyeSBBIEpzb24gc3RydWN0dXJlIHdpdGggcGF0aHMuIEVhY2ggcGF0aCB3aWxsIGNvbnRhaW4gYSBjaGFpbiBvZiBpbnN0cnVjdGlvbnMuXG4gICAgKiBFYWNoIGluc3RydWN0aW9uIHdpbGwgaGF2ZSBhICdpbicgdG8gYSBmaWxlIGFuZCBhIHBhdGggdG8gc2VhcmNoIG9uIGl0IChzZWUuIHNlbGVjdCgpKS4gb25jZSB0aGVcbiAgICAqIHJlc3VsdCBpcyBpbiwgdGhlIG5leHQgaW5zdHJ1Y3Rpb24gaW4gdGhlIHBhdGggY2hhaW4gd2lsbCBiZSB0cmlnZ2VkLiBBZnRlciB0aGUgcGF0aCB0aHJvdWdoIGFsbFxuICAgICogY2hhaW5lZCBwYXRocyBpcyBjb21wbGV0ZWQsIHJlc3VsdGluZyB2YWx1ZSB3aWxsIGJlIHB1dCBpbiBhIGpzb24gd2hlcmUgaXRzIHBhdGggaXMgdGhlIG9yaWdpbmFsXG4gICAgKiBqc29uIHBhdGggYW5kIGl0cyB2YWx1ZSB3aWxsIGJlIHRoZSByZXN1bHRpbmcgdmFsdWUuXG4gICAgKlxuICAgICogdGhpcyBpcyBub3QgZnVsbHkgdGVzdGVkLiBjYWxsZXIgc2hvdWxkIHBhc3Mgc29tZXRoaW5nIGxpa2VcbiAgICAqIHtwYXRoOiBbcGF0aDEscGF0aDJdLCBpbjogJ3NvbWV0aGluZyBvciBibGFuaycsIGRlZXBYbWw6IHRydWUsIGpvaW46IHtrMToge3BhdGg6IHBhdGgzLCBpbjogJ3NvbWV0aGluZyBvciBwbGFuaycsIGNsYXVzZTogZnVuY3Rpb259fX1cbiAgICAqIGlmIHBhdGgxIG9yIHBhdGgyIG9yIHBhdGgzIGFyZSBmb3VuZCBhdCB0aGUgcm9vdCBvYmplY3QsIGEgY2hhaW4gcmVhY3Rpb24gdG8gZmV0Y2ggZGVlcCB3aWxsIGZvbGxvdy4gQW5cbiAgICAqIG9wdGlvbmFsIGNsYXVzZSB3aWxsIGhlbHAgcmVzb2x2ZSBjb21wbGV4IHNpdHVhdGlvbnMuXG4gICAgKlxuICAgICogQHJldHVybnMgcmV0dXJucyBhbiBvYnNlcnZhYmxlLiB0aGUgY2FsbGVyIHNob3VsZCBzdWJzY3JpYmUgdG8gdGhpcyBpbiBvcmRlciB0byByZWNlaXZlIHRoZSByZXN1bHQuXG4gICAgKi9cbiAgICBjaGFpblNlbGVjdChjaGFpblF1ZXJ5OiBhbnkpOiBCZWhhdmlvclN1YmplY3Q8YW55PiB7XG4gICAgICAgIGNvbnN0IHNpemUgPSAoY2hhaW5RdWVyeS5wYXRoIGluc3RhbmNlb2YgQXJyYXkpID8gIGNoYWluUXVlcnkucGF0aC5sZW5ndGggOiAxO1xuICAgICAgICBjb25zdCBvcGVyYXRpb24gPSB7Y2FjaGVkRmlsZXM6IHt9LCByZXN1bHQ6IHt9fTtcbiAgICAgICAgY29uc3QgZGF0YVN0b3JlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxhbnk+KG51bGwpO1xuXG4gICAgICAgIHRoaXMuX3F1ZXJ5SXRlcmF0aW9uKFxuICAgICAgICAgICAgZGF0YVN0b3JlLFxuICAgICAgICAgICAgb3BlcmF0aW9uLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHBhdGg6IGNoYWluUXVlcnkucGF0aCxcbiAgICAgICAgICAgICAgICBpbjogY2hhaW5RdWVyeS5pbixcbiAgICAgICAgICAgICAgICBkZWVwWG1sOiBjaGFpblF1ZXJ5LmRlZXBYbWwsXG4gICAgICAgICAgICAgICAgam9pbjogY2hhaW5RdWVyeS5qb2luLFxuICAgICAgICAgICAgICAgIHF1ZXJ5SXRlbXM6IHNpemVcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIGRhdGFTdG9yZTtcbiAgICB9XG5cbiAgICAvKlxuICAgICogV2lsbCBncm91cCBmaWxlIHBhdGhzIGlmIHRoZXkgYXJlIHNpbWlsYXIgdG8gYXZvaWQgbXVsdGlwbGUgY2FsbHMuXG4gICAgKiBAcGFyYW0gbGlzdCBBIGxpc3Qgb2YgSnNvbiB7cGF0aHMsIGluLCBkZWVwWG1sfSBzdHJ1Y3R1cmVzLiBkZWVwWG1sIGlzIG9wdGlvbmFsLlxuICAgICogQHBhcmFtIGNsYXVzZSBBIG1ldGhvZCBieSB3aGljaCB2YWx1ZShzKSBmb3IgdGhlIHBhdGgocykgY291bGQgYmUgZXZhbHVhdGVkLiB0aGUgY2FsbGVyIHdvdWxkIGV2YWx1YXRlIHRoZSB2YWx1ZSBmb3IgYSBnaXZlbiBhdHRyaWJ1dGUuXG4gICAgKiBAcmV0dXJucyByZXR1cm5zIGFuIG9ic2VydmFibGUuIHRoZSBjYWxsZXIgc2hvdWxkIHN1YnNjcmliZSB0byB0aGlzIGluIG9yZGVyIHRvIHJlY2VpdmUgdGhlIHJlc3VsdC5cbiAgICAqL1xuICAgIGFycmF5U2VsZWN0KFxuICAgICAgICBsaXN0OiBhbnksXG4gICAgICAgIGNsYXVzZT86IGNsYXVzZUV2YWx1YXRvcik6IEJlaGF2aW9yU3ViamVjdDxhbnk+ICB7XG4gICAgICAgIGNvbnN0IGdyb3VwZWRMaXN0ID0ge307XG4gICAgICAgIGxpc3QubWFwKCAoaXRlbTogYW55KSA9PiB7XG4gICAgICAgICAgICBpZiAoZ3JvdXBlZExpc3RbaXRlbS5pbl0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGdyb3VwZWRMaXN0W2l0ZW0uaW5dID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBncm91cGVkTGlzdFtpdGVtLmluXS5wdXNoKHtwYXRoOiBpdGVtLnBhdGgsIGRlZXBYbWw6IGl0ZW0uZGVlcFhtbH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgZGF0YVN0b3JlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxhbnk+KG51bGwpO1xuXG4gICAgICAgIE9iamVjdC5rZXlzKGdyb3VwZWRMaXN0KS5tYXAgKCAodXJsKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdChncm91cGVkTGlzdFt1cmxdLnBhdGgsIHVybCwgZ3JvdXBlZExpc3RbdXJsXS5kZWVwWG1sLCBjbGF1c2UpLnN1YnNjcmliZShcbiAgICAgICAgICAgICAgICAoZGF0YTogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhU3RvcmUubmV4dChkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgKGVycm9yOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YVN0b3JlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGRhdGFTdG9yZTtcbiAgICB9XG5cbiAgICAvKlxuICAgICogV2lsbCBxdWVyeSBwYXRoIGZyb20gYSByZW1vdGUgbG9jYXRpb24gcXVhbGlmaWVkIHRocm91Z2ggYW4gb3B0aW9uYWwgY2xhdXNlIGZ1bmN0aW9uIHRoYXRcbiAgICAqIGV2YWx1YXRlcywgZmlsdGVycywgb3Igc29ydHMgdGhlIHJlc3VsIG9mIHRoZSBxdWVyeS5cbiAgICAqIEBwYXJhbSBwYXRoIEEgYSBzaW5nbGUgSlNPTiBwYXRoIG9yIGxpc3Qgb2YgcGF0aHMgdG8gc2VsZWN0IChpLmUuLCAnYS5iLmMnKVxuICAgICogQHBhcmFtIGZyb20gQSByZWZlcmVuY2UgVVJMIHRvIGEgcmVtb3RlIHNvdXJjZS5cbiAgICAqIEBwYXJhbSBkZWVwWG1sIGlmIGNkYXRhLXNlY3Rpb24gc2hvdWxkIGJlIHBhcnNlZC5cbiAgICAqIEBwYXJhbSBjbGF1c2UgQSBtZXRob2QgYnkgd2hpY2ggdmFsdWUocykgZm9yIHRoZSBwYXRoKHMpIGNvdWxkIGJlIGV2YWx1YXRlZC4gdGhlIGNhbGxlciB3b3VsZCBldmFsdWF0ZSB0aGUgdmFsdWUgZm9yIGEgZ2l2ZW4gYXR0cmlidXRlLlxuICAgICogQHJldHVybnMgcmV0dXJucyBhbiBvYnNlcnZhYmxlLiB0aGUgY2FsbGVyIHNob3VsZCBzdWJzY3JpYmUgdG8gdGhpcyBpbiBvcmRlciB0byByZWNlaXZlIHRoZSByZXN1bHQuXG4gICAgKi9cbiAgICBzZWxlY3QoXG4gICAgICAgIHBhdGg6IGFueSxcbiAgICAgICAgZnJvbTogc3RyaW5nLFxuICAgICAgICBkZWVwWG1sOiBib29sZWFuLFxuICAgICAgICBjbGF1c2U/OiBjbGF1c2VFdmFsdWF0b3IpOiBCZWhhdmlvclN1YmplY3Q8YW55PiB7XG5cbiAgICAgICAgY29uc3QgZGF0YVN0b3JlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxhbnk+KG51bGwpO1xuXG4gICAgICAgIHRoaXMuX2dldChmcm9tKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAoZGF0YTogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdDogYW55O1xuICAgICAgICAgICAgICAgIGNvbnN0IGpwYXRoID0gdGhpcy5fcHJlcGFyZUpzb25QYXRoKHBhdGgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFjbGF1c2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xhdXNlID0gKG5vZGU6IGFueSwgcGF0aDogc3RyaW5nLCB2YWx1ZTogYW55KSA9PiB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHBhdGggaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAganBhdGgubWFwKChwYXRoSXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeSA9IHRoaXMuX3ZhbHVlT2ZKc29uUGF0aChwYXRoSXRlbSwgZGF0YSwgZGVlcFhtbCwgY2xhdXNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGtleSA9IHRoaXMuX3N0cmluZ1ZhbHVlT2ZLZXkocGF0aEl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0geTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhyZXN1bHQpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgcGF0aCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5fdmFsdWVPZkpzb25QYXRoKGpwYXRoLCBkYXRhLCBkZWVwWG1sLCBjbGF1c2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFTdG9yZS5uZXh0KHJlc3VsdCk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkYXRhU3RvcmUuZXJyb3IoJ1Jlc3VsdCBub3QgZm91bmQgZm9yICcgKyBwYXRoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgKGVycm9yOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBkYXRhU3RvcmUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gZGF0YVN0b3JlO1xuICAgIH1cbn1cbiJdfQ==