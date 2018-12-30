import {
    Directive,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import { WizardQueryService } from './wizard-query.service';

@Directive({
    selector: '[wizardQuery]'
})
export class WizardQueryDirective {
    query: any;

            
    @Output()
    onQueryResult: EventEmitter<any> = new EventEmitter();

    @Output()
    onQueryError: EventEmitter<any> = new EventEmitter();

    @Input()
    set wizardQuery(info: any) {
        this.query = info;
        if (this.query) {
            if (this.query instanceof Array) {
                this.queryService.arraySelect(this.query).subscribe(
                    (success) => {
                        if(success) {
                            this.onQueryResult.emit(success);
                        }
                    },
                    (error) => {
                        this.onQueryResult.emit(error);
                    }
                );
            } else {
                this.queryService.chainSelect(this.query).subscribe(
                    (success) => {
                        if(success) {
                            this.onQueryResult.emit(success);
                        }
                    },
                    (error) => {
                        this.onQueryResult.emit(error);
                    }
                );
            }
        } else {
            this.onQueryResult.emit(undefined);
        }
    }

    constructor(private queryService: WizardQueryService) {}

}