import { EventEmitter } from '@angular/core';
import { WizardQueryService } from './wizard-query.service';
export declare class WizardQueryDirective {
    private queryService;
    query: any;
    onQueryResult: EventEmitter<any>;
    onQueryError: EventEmitter<any>;
    wizardQuery: any;
    constructor(queryService: WizardQueryService);
}
