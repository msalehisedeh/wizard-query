import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
export declare type clauseEvaluator = (node: any, path: string, value: any) => any;
export declare class WizardQueryService {
    private http;
    SERVICE_PATH: string;
    logEnabled: boolean;
    constructor(http: HttpClient);
    private _globalFunctions;
    private _normalize;
    private _valueOfJsonPath;
    private _get;
    private _stringValueOfKey;
    private _addToResult;
    private _pack;
    private _triggerResult;
    private _subquery;
    private _queryIteration;
    private _makeArguments;
    private _handleSpecialCharacters;
    private _prepareJsonPath;
    private _select;
    private _xml2json;
    chainSelect(chainQuery: any): BehaviorSubject<any>;
    arraySelect(list: any, clause?: clauseEvaluator): BehaviorSubject<any>;
    select(path: any, from: string, deepXml: boolean, clause?: clauseEvaluator): BehaviorSubject<any>;
}
