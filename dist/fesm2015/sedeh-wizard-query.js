import { __decorate } from 'tslib';
import { Injectable, Input, Component, EventEmitter, Output, Directive, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpHeaders, HttpClient, HttpClientModule } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { DOMParser } from 'xmldom';
import { CommonModule } from '@angular/common';

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
                const xml = new DOMParser().parseFromString(res);
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
                        const xml = new DOMParser().parseFromString(res);
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
WizardQueryService = __decorate([
    Injectable()
], WizardQueryService);

let WizardQueryComponent = class WizardQueryComponent {
    constructor(queryService) {
        this.queryService = queryService;
    }
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
    executeQuery(text) {
        try {
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
};
WizardQueryComponent.ctorParameters = () => [
    { type: WizardQueryService }
];
__decorate([
    Input()
], WizardQueryComponent.prototype, "queryInfo", null);
WizardQueryComponent = __decorate([
    Component({
        selector: 'wizard-query',
        template: "\n<div class=\"entry\" *ngIf=\"source\">\n  <div class=\"entry-label\">Source: {{selectedDocumentName}}</div>\n  <div class=\"entry-label\">Type or modify query</div>\n  <div class=\"entry-json\">{{ source | json }}</div>\n  <textarea #text [value]=\"query | json\" (input)=\"data = undefined\"></textarea>\n  <div class=\"submit\"><button (click)=\"executeQuery(text)\">Execute query</button></div>\n</div>\n\n<div *ngIf=\"data\" class=\"result-json\">{{ data | json }}</div>\n",
        styles: [".result-json{border:1px solid #633;background-color:#fefefe;border-radius:5px;box-sizing:border-box;display:block;max-height:222px;min-height:222px;overflow-y:auto;position:relative;font-family:monospace;float:left;padding:5px;unicode-bidi:embed;width:100%;white-space:pre-wrap}.entry .entry-json{border:1px solid #633;background-color:#fefefe;box-sizing:border-box;display:block;max-height:222px;min-height:222px;overflow-y:auto;position:relative;font-family:monospace;float:left;padding:5px;unicode-bidi:embed;width:50%;white-space:pre-wrap;border-radius:0 0 0 5px}.entry textarea{width:50%;min-height:222px;max-height:222px;resize:none;box-sizing:border-box;padding:5px;border-radius:0 0 5px}.entry .entry-label{width:50%;font-weight:700;padding:5px;background-color:#888;color:#fff;float:left;box-sizing:border-box}.entry .submit{text-align:center;padding-bottom:5px}.entry .submit button{padding:5px 35px}"]
    })
], WizardQueryComponent);

let WizardQueryDirective = class WizardQueryDirective {
    constructor(queryService) {
        this.queryService = queryService;
        this.onQueryResult = new EventEmitter();
        this.onQueryError = new EventEmitter();
    }
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
};
WizardQueryDirective.ctorParameters = () => [
    { type: WizardQueryService }
];
__decorate([
    Output()
], WizardQueryDirective.prototype, "onQueryResult", void 0);
__decorate([
    Output()
], WizardQueryDirective.prototype, "onQueryError", void 0);
__decorate([
    Input()
], WizardQueryDirective.prototype, "wizardQuery", null);
WizardQueryDirective = __decorate([
    Directive({
        selector: '[wizardQuery]'
    })
], WizardQueryDirective);

let WizardQueryModule = class WizardQueryModule {
};
WizardQueryModule = __decorate([
    NgModule({
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
    })
], WizardQueryModule);

/**
 * Generated bundle index. Do not edit.
 */

export { WizardQueryComponent, WizardQueryDirective, WizardQueryModule, WizardQueryService };
//# sourceMappingURL=sedeh-wizard-query.js.map
