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
            if (this.query instanceof Array) {
                this.queryService.arraySelect(this.query).subscribe((success) => {
                    if (success) {
                        this.onQueryResult.emit(success);
                    }
                }, (error) => {
                    this.onQueryResult.emit(error);
                });
            }
            else {
                this.queryService.chainSelect(this.query).subscribe((success) => {
                    if (success) {
                        this.onQueryResult.emit(success);
                    }
                }, (error) => {
                    this.onQueryResult.emit(error);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLXF1ZXJ5LmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3dpemFyZC1xdWVyeS8iLCJzb3VyY2VzIjpbInNyYy9hcHAvd2l6YXJkLXF1ZXJ5L3dpemFyZC1xdWVyeS5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFDSCxTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ2YsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFLNUQsTUFBTTs7OztJQTBDRixZQUFvQixZQUFnQztRQUFoQyxpQkFBWSxHQUFaLFlBQVksQ0FBb0I7NkJBckNqQixJQUFJLFlBQVksRUFBRTs0QkFHbkIsSUFBSSxZQUFZLEVBQUU7S0FrQ0k7Ozs7O0lBaEN4RCxJQUNJLFdBQVcsQ0FBQyxJQUFTO1FBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUM5QixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUMvQyxDQUFDLE9BQU8sRUFBRSxFQUFFO29CQUNSLEVBQUUsQ0FBQSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7d0JBQ1QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7cUJBQ3BDO2lCQUNKLEVBQ0QsQ0FBQyxLQUFLLEVBQUUsRUFBRTtvQkFDTixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztpQkFDbEMsQ0FDSixDQUFDO2FBQ0w7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUMvQyxDQUFDLE9BQU8sRUFBRSxFQUFFO29CQUNSLEVBQUUsQ0FBQSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7d0JBQ1QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7cUJBQ3BDO2lCQUNKLEVBQ0QsQ0FBQyxLQUFLLEVBQUUsRUFBRTtvQkFDTixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztpQkFDbEMsQ0FDSixDQUFDO2FBQ0w7U0FDSjtRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDdEM7S0FDSjs7O1lBM0NKLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsZUFBZTthQUM1Qjs7OztZQUpRLGtCQUFrQjs7OzRCQVN0QixNQUFNOzJCQUdOLE1BQU07MEJBR04sS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgICBEaXJlY3RpdmUsXHJcbiAgICBJbnB1dCxcclxuICAgIE91dHB1dCxcclxuICAgIEV2ZW50RW1pdHRlclxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgV2l6YXJkUXVlcnlTZXJ2aWNlIH0gZnJvbSAnLi93aXphcmQtcXVlcnkuc2VydmljZSc7XHJcblxyXG5ARGlyZWN0aXZlKHtcclxuICAgIHNlbGVjdG9yOiAnW3dpemFyZFF1ZXJ5XSdcclxufSlcclxuZXhwb3J0IGNsYXNzIFdpemFyZFF1ZXJ5RGlyZWN0aXZlIHtcclxuICAgIHF1ZXJ5OiBhbnk7XHJcblxyXG4gICAgICAgICAgICBcclxuICAgIEBPdXRwdXQoKVxyXG4gICAgb25RdWVyeVJlc3VsdDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gICAgQE91dHB1dCgpXHJcbiAgICBvblF1ZXJ5RXJyb3I6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICAgIEBJbnB1dCgpXHJcbiAgICBzZXQgd2l6YXJkUXVlcnkoaW5mbzogYW55KSB7XHJcbiAgICAgICAgdGhpcy5xdWVyeSA9IGluZm87XHJcbiAgICAgICAgaWYgKHRoaXMucXVlcnkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucXVlcnkgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5xdWVyeVNlcnZpY2UuYXJyYXlTZWxlY3QodGhpcy5xdWVyeSkuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgICAgICAgICAgIChzdWNjZXNzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25RdWVyeVJlc3VsdC5lbWl0KHN1Y2Nlc3MpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vblF1ZXJ5UmVzdWx0LmVtaXQoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5U2VydmljZS5jaGFpblNlbGVjdCh0aGlzLnF1ZXJ5KS5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgICAgICAgICAgKHN1Y2Nlc3MpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoc3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vblF1ZXJ5UmVzdWx0LmVtaXQoc3VjY2Vzcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uUXVlcnlSZXN1bHQuZW1pdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMub25RdWVyeVJlc3VsdC5lbWl0KHVuZGVmaW5lZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcXVlcnlTZXJ2aWNlOiBXaXphcmRRdWVyeVNlcnZpY2UpIHt9XHJcblxyXG59Il19