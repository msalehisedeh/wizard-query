(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common/http'), require('rxjs/operators'), require('rxjs'), require('xmldom'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('@sedeh/wizard-query', ['exports', '@angular/core', '@angular/common/http', 'rxjs/operators', 'rxjs', 'xmldom', '@angular/common'], factory) :
    (global = global || self, factory((global.sedeh = global.sedeh || {}, global.sedeh['wizard-query'] = {}), global.ng.core, global.ng.common.http, global.rxjs.operators, global.rxjs, global.xmldom, global.ng.common));
}(this, (function (exports, core, http, operators, rxjs, xmldom, common) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __exportStar(m, exports) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }

    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m) return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    }

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    function __importStar(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result.default = mod;
        return result;
    }

    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }

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
            var headers = new http.HttpHeaders();
            var result;
            headers.set('Access-Control-Allow-Origin', '*');
            if (ext === '.xml') {
                headers.set('Content-Type', 'text; charset=utf-8').set('Accept', 'text');
                result = this.http.get(url, { headers: headers, responseType: 'text' })
                    .pipe(operators.map(function (res) {
                    var xml = new xmldom.DOMParser().parseFromString(res);
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
            var dataStore = new rxjs.BehaviorSubject(null);
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
            var dataStore = new rxjs.BehaviorSubject(null);
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
            var dataStore = new rxjs.BehaviorSubject(null);
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
            { type: http.HttpClient }
        ]; };
        WizardQueryService = __decorate([
            core.Injectable()
        ], WizardQueryService);
        return WizardQueryService;
    }());

    var WizardQueryComponent = /** @class */ (function () {
        function WizardQueryComponent(queryService) {
            this.queryService = queryService;
        }
        Object.defineProperty(WizardQueryComponent.prototype, "queryInfo", {
            set: function (data) {
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
        WizardQueryComponent.prototype.parseFunctions = function (content) {
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
        WizardQueryComponent.prototype.executeQuery = function (text) {
            var _this = this;
            try {
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
        WizardQueryComponent.ctorParameters = function () { return [
            { type: WizardQueryService }
        ]; };
        __decorate([
            core.Input()
        ], WizardQueryComponent.prototype, "queryInfo", null);
        WizardQueryComponent = __decorate([
            core.Component({
                selector: 'wizard-query',
                template: "\n<div class=\"entry\" *ngIf=\"source\">\n  <div class=\"entry-label\">Source: {{selectedDocumentName}}</div>\n  <div class=\"entry-label\">Type or modify query</div>\n  <div class=\"entry-json\">{{ source | json }}</div>\n  <textarea #text [value]=\"query | json\" (input)=\"data = undefined\"></textarea>\n  <div class=\"submit\"><button (click)=\"executeQuery(text)\">Execute query</button></div>\n</div>\n\n<div *ngIf=\"data\" class=\"result-json\">{{ data | json }}</div>\n",
                styles: [".result-json{border:1px solid #633;background-color:#fefefe;border-radius:5px;box-sizing:border-box;display:block;max-height:222px;min-height:222px;overflow-y:auto;position:relative;font-family:monospace;float:left;padding:5px;unicode-bidi:embed;width:100%;white-space:pre-wrap}.entry .entry-json{border:1px solid #633;background-color:#fefefe;box-sizing:border-box;display:block;max-height:222px;min-height:222px;overflow-y:auto;position:relative;font-family:monospace;float:left;padding:5px;unicode-bidi:embed;width:50%;white-space:pre-wrap;border-radius:0 0 0 5px}.entry textarea{width:50%;min-height:222px;max-height:222px;resize:none;box-sizing:border-box;padding:5px;border-radius:0 0 5px}.entry .entry-label{width:50%;font-weight:700;padding:5px;background-color:#888;color:#fff;float:left;box-sizing:border-box}.entry .submit{text-align:center;padding-bottom:5px}.entry .submit button{padding:5px 35px}"]
            })
        ], WizardQueryComponent);
        return WizardQueryComponent;
    }());

    var WizardQueryDirective = /** @class */ (function () {
        function WizardQueryDirective(queryService) {
            this.queryService = queryService;
            this.onQueryResult = new core.EventEmitter();
            this.onQueryError = new core.EventEmitter();
        }
        Object.defineProperty(WizardQueryDirective.prototype, "wizardQuery", {
            set: function (info) {
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
        WizardQueryDirective.ctorParameters = function () { return [
            { type: WizardQueryService }
        ]; };
        __decorate([
            core.Output()
        ], WizardQueryDirective.prototype, "onQueryResult", void 0);
        __decorate([
            core.Output()
        ], WizardQueryDirective.prototype, "onQueryError", void 0);
        __decorate([
            core.Input()
        ], WizardQueryDirective.prototype, "wizardQuery", null);
        WizardQueryDirective = __decorate([
            core.Directive({
                selector: '[wizardQuery]'
            })
        ], WizardQueryDirective);
        return WizardQueryDirective;
    }());

    var WizardQueryModule = /** @class */ (function () {
        function WizardQueryModule() {
        }
        WizardQueryModule = __decorate([
            core.NgModule({
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
            })
        ], WizardQueryModule);
        return WizardQueryModule;
    }());

    exports.WizardQueryComponent = WizardQueryComponent;
    exports.WizardQueryDirective = WizardQueryDirective;
    exports.WizardQueryModule = WizardQueryModule;
    exports.WizardQueryService = WizardQueryService;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=sedeh-wizard-query.umd.js.map
