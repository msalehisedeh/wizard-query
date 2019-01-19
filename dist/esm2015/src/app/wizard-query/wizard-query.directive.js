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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLXF1ZXJ5LmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZWRlaC93aXphcmQtcXVlcnkvIiwic291cmNlcyI6WyJzcmMvYXBwL3dpemFyZC1xdWVyeS93aXphcmQtcXVlcnkuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQ0gsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNmLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBSzVELE1BQU07Ozs7SUEwQ0YsWUFBb0IsWUFBZ0M7UUFBaEMsaUJBQVksR0FBWixZQUFZLENBQW9COzZCQXJDakIsSUFBSSxZQUFZLEVBQUU7NEJBR25CLElBQUksWUFBWSxFQUFFO0tBa0NJOzs7OztJQWhDeEQsSUFDSSxXQUFXLENBQUMsSUFBUztRQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNsQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNiLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDOUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FDL0MsQ0FBQyxPQUFPLEVBQUUsRUFBRTtvQkFDUixFQUFFLENBQUEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO3dCQUNULElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3FCQUNwQztpQkFDSixFQUNELENBQUMsS0FBSyxFQUFFLEVBQUU7b0JBQ04sSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztpQkFDM0MsQ0FDSixDQUFDO2FBQ0w7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUMvQyxDQUFDLE9BQU8sRUFBRSxFQUFFO29CQUNSLEVBQUUsQ0FBQSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7d0JBQ1QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7cUJBQ3BDO2lCQUNKLEVBQ0QsQ0FBQyxLQUFLLEVBQUUsRUFBRTtvQkFDTixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO2lCQUMzQyxDQUNKLENBQUM7YUFDTDtTQUNKO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUN0QztLQUNKOzs7WUEzQ0osU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxlQUFlO2FBQzVCOzs7O1lBSlEsa0JBQWtCOzs7NEJBU3RCLE1BQU07MkJBR04sTUFBTTswQkFHTixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICAgIERpcmVjdGl2ZSxcclxuICAgIElucHV0LFxyXG4gICAgT3V0cHV0LFxyXG4gICAgRXZlbnRFbWl0dGVyXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBXaXphcmRRdWVyeVNlcnZpY2UgfSBmcm9tICcuL3dpemFyZC1xdWVyeS5zZXJ2aWNlJztcclxuXHJcbkBEaXJlY3RpdmUoe1xyXG4gICAgc2VsZWN0b3I6ICdbd2l6YXJkUXVlcnldJ1xyXG59KVxyXG5leHBvcnQgY2xhc3MgV2l6YXJkUXVlcnlEaXJlY3RpdmUge1xyXG4gICAgcXVlcnk6IGFueTtcclxuXHJcbiAgICAgICAgICAgIFxyXG4gICAgQE91dHB1dCgpXHJcbiAgICBvblF1ZXJ5UmVzdWx0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgICBAT3V0cHV0KClcclxuICAgIG9uUXVlcnlFcnJvcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIHNldCB3aXphcmRRdWVyeShpbmZvOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnF1ZXJ5ID0gaW5mbztcclxuICAgICAgICBpZiAodGhpcy5xdWVyeSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5xdWVyeSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5U2VydmljZS5hcnJheVNlbGVjdCh0aGlzLnF1ZXJ5KS5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgICAgICAgICAgKHN1Y2Nlc3MpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoc3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vblF1ZXJ5UmVzdWx0LmVtaXQoc3VjY2Vzcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uUXVlcnlSZXN1bHQuZW1pdCh7YWxlcnQ6IGVycm9yfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucXVlcnlTZXJ2aWNlLmNoYWluU2VsZWN0KHRoaXMucXVlcnkpLnN1YnNjcmliZShcclxuICAgICAgICAgICAgICAgICAgICAoc3VjY2VzcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihzdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uUXVlcnlSZXN1bHQuZW1pdChzdWNjZXNzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25RdWVyeVJlc3VsdC5lbWl0KHthbGVydDogZXJyb3J9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5vblF1ZXJ5UmVzdWx0LmVtaXQodW5kZWZpbmVkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBxdWVyeVNlcnZpY2U6IFdpemFyZFF1ZXJ5U2VydmljZSkge31cclxuXHJcbn0iXX0=