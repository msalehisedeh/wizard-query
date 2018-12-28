/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Directive, Input, Output, EventEmitter } from '@angular/core';
import { WizardQueryService } from './wizard-query.service';
export class WizardQueryDirective {
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
            this.queryService.chainSelect(this.query).subscribe((success) => {
                if (success) {
                    this.onQueryResult.emit(success);
                }
            }, (error) => {
                this.onQueryResult.emit(error);
            });
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
if (false) {
    /** @type {?} */
    WizardQueryDirective.prototype.query;
    /** @type {?} */
    WizardQueryDirective.prototype.onQueryResult;
    /** @type {?} */
    WizardQueryDirective.prototype.onQueryError;
    /** @type {?} */
    WizardQueryDirective.prototype.queryService;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLXF1ZXJ5LmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3dpemFyZC1xdWVyeS8iLCJzb3VyY2VzIjpbInNyYy9hcHAvd2l6YXJkLXF1ZXJ5L3dpemFyZC1xdWVyeS5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFDSCxTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ2YsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFLNUQsTUFBTTs7OztJQTZCRixZQUFvQixZQUFnQztRQUFoQyxpQkFBWSxHQUFaLFlBQVksQ0FBb0I7NkJBeEJqQixJQUFJLFlBQVksRUFBRTs0QkFHbkIsSUFBSSxZQUFZLEVBQUU7S0FxQkk7Ozs7O0lBbkJ4RCxJQUNJLFdBQVcsQ0FBQyxJQUFTO1FBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2IsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FDL0MsQ0FBQyxPQUFPLEVBQUUsRUFBRTtnQkFDUixFQUFFLENBQUEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUNULElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUNwQzthQUNKLEVBQ0QsQ0FBQyxLQUFLLEVBQUUsRUFBRTtnQkFDTixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNsQyxDQUNKLENBQUM7U0FDTDtRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDdEM7S0FDSjs7O1lBOUJKLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsZUFBZTthQUM1Qjs7OztZQUpRLGtCQUFrQjs7OzRCQVN0QixNQUFNOzJCQUdOLE1BQU07MEJBR04sS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgICBEaXJlY3RpdmUsXHJcbiAgICBJbnB1dCxcclxuICAgIE91dHB1dCxcclxuICAgIEV2ZW50RW1pdHRlclxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgV2l6YXJkUXVlcnlTZXJ2aWNlIH0gZnJvbSAnLi93aXphcmQtcXVlcnkuc2VydmljZSc7XHJcblxyXG5ARGlyZWN0aXZlKHtcclxuICAgIHNlbGVjdG9yOiAnW3dpemFyZFF1ZXJ5XSdcclxufSlcclxuZXhwb3J0IGNsYXNzIFdpemFyZFF1ZXJ5RGlyZWN0aXZlIHtcclxuICAgIHF1ZXJ5OiBhbnk7XHJcblxyXG4gICAgICAgICAgICBcclxuICAgIEBPdXRwdXQoKVxyXG4gICAgb25RdWVyeVJlc3VsdDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gICAgQE91dHB1dCgpXHJcbiAgICBvblF1ZXJ5RXJyb3I6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICAgIEBJbnB1dCgpXHJcbiAgICBzZXQgd2l6YXJkUXVlcnkoaW5mbzogYW55KSB7XHJcbiAgICAgICAgdGhpcy5xdWVyeSA9IGluZm87XHJcbiAgICAgICAgaWYgKHRoaXMucXVlcnkpIHtcclxuICAgICAgICAgICAgdGhpcy5xdWVyeVNlcnZpY2UuY2hhaW5TZWxlY3QodGhpcy5xdWVyeSkuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgICAgICAgKHN1Y2Nlc3MpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZihzdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25RdWVyeVJlc3VsdC5lbWl0KHN1Y2Nlc3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uUXVlcnlSZXN1bHQuZW1pdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5vblF1ZXJ5UmVzdWx0LmVtaXQodW5kZWZpbmVkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBxdWVyeVNlcnZpY2U6IFdpemFyZFF1ZXJ5U2VydmljZSkge31cclxuXHJcbn0iXX0=