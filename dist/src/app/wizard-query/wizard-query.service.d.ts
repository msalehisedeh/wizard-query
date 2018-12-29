import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
export declare type clauseEvaluator = (node: any, path: string, value: any) => any;
export declare class WizardQueryService {
    private http;
    SERVICE_PATH: string;
    logEnabled: boolean;
    constructor(http: HttpClient);
    private _normalize(value, deepXml);
    private _valueOfJsonPath(path, data, deepXml, clause?);
    private _get(path);
    private _stringValueOfKey(key);
    private _addToResult(value, key, operation, action);
    private _pack(result);
    private _triggerResult(promise, result);
    private _subquery(promise, path, operation, action);
    private _queryIteration(promise, operation, action, cacheNamed?);
    private _makeArguments(key);
    private _prepareJsonPath(path);
    private _xml2json(xml);
    chainSelect(chainQuery: any): BehaviorSubject<any>;
    arraySelect(list: any, clause?: clauseEvaluator): BehaviorSubject<any>;
    select(path: any, from: string, deepXml: boolean, clause?: clauseEvaluator): BehaviorSubject<any>;
}
