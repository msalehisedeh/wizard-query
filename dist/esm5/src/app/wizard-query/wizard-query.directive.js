/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Directive, Input, Output, EventEmitter } from '@angular/core';
import { WizardQueryService } from './wizard-query.service';
var WizardQueryDirective = /** @class */ (function () {
    function WizardQueryDirective(queryService) {
        this.queryService = queryService;
        this.onQueryResult = new EventEmitter();
        this.onQueryError = new EventEmitter();
    }
    Object.defineProperty(WizardQueryDirective.prototype, "wizardQuery", {
        set: /**
         * @param {?} info
         * @return {?}
         */
        function (info) {
            var _this = this;
            this.query = info;
            if (this.query) {
                this.queryService.chainSelect(this.query).subscribe(function (success) {
                    if (success) {
                        _this.onQueryResult.emit(success);
                    }
                }, function (error) {
                    _this.onQueryResult.emit(error);
                });
            }
            else {
                this.onQueryResult.emit(undefined);
            }
        },
        enumerable: true,
        configurable: true
    });
    WizardQueryDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[wizardQuery]'
                },] }
    ];
    /** @nocollapse */
    WizardQueryDirective.ctorParameters = function () { return [
        { type: WizardQueryService }
    ]; };
    WizardQueryDirective.propDecorators = {
        onQueryResult: [{ type: Output }],
        onQueryError: [{ type: Output }],
        wizardQuery: [{ type: Input }]
    };
    return WizardQueryDirective;
}());
export { WizardQueryDirective };
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLXF1ZXJ5LmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3dpemFyZC1xdWVyeS8iLCJzb3VyY2VzIjpbInNyYy9hcHAvd2l6YXJkLXF1ZXJ5L3dpemFyZC1xdWVyeS5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFDSCxTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ2YsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7O0lBa0N4RCw4QkFBb0IsWUFBZ0M7UUFBaEMsaUJBQVksR0FBWixZQUFZLENBQW9COzZCQXhCakIsSUFBSSxZQUFZLEVBQUU7NEJBR25CLElBQUksWUFBWSxFQUFFO0tBcUJJO0lBbkJ4RCxzQkFDSSw2Q0FBVzs7Ozs7UUFEZixVQUNnQixJQUFTO1lBRHpCLGlCQWlCQztZQWZHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2xCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNiLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQy9DLFVBQUMsT0FBTztvQkFDSixFQUFFLENBQUEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO3dCQUNULEtBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3FCQUNwQztpQkFDSixFQUNELFVBQUMsS0FBSztvQkFDRixLQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztpQkFDbEMsQ0FDSixDQUFDO2FBQ0w7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUN0QztTQUNKOzs7T0FBQTs7Z0JBOUJKLFNBQVMsU0FBQztvQkFDUCxRQUFRLEVBQUUsZUFBZTtpQkFDNUI7Ozs7Z0JBSlEsa0JBQWtCOzs7Z0NBU3RCLE1BQU07K0JBR04sTUFBTTs4QkFHTixLQUFLOzsrQkF0QlY7O1NBWWEsb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICAgIERpcmVjdGl2ZSxcclxuICAgIElucHV0LFxyXG4gICAgT3V0cHV0LFxyXG4gICAgRXZlbnRFbWl0dGVyXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBXaXphcmRRdWVyeVNlcnZpY2UgfSBmcm9tICcuL3dpemFyZC1xdWVyeS5zZXJ2aWNlJztcclxuXHJcbkBEaXJlY3RpdmUoe1xyXG4gICAgc2VsZWN0b3I6ICdbd2l6YXJkUXVlcnldJ1xyXG59KVxyXG5leHBvcnQgY2xhc3MgV2l6YXJkUXVlcnlEaXJlY3RpdmUge1xyXG4gICAgcXVlcnk6IGFueTtcclxuXHJcbiAgICAgICAgICAgIFxyXG4gICAgQE91dHB1dCgpXHJcbiAgICBvblF1ZXJ5UmVzdWx0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgICBAT3V0cHV0KClcclxuICAgIG9uUXVlcnlFcnJvcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIHNldCB3aXphcmRRdWVyeShpbmZvOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnF1ZXJ5ID0gaW5mbztcclxuICAgICAgICBpZiAodGhpcy5xdWVyeSkge1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXJ5U2VydmljZS5jaGFpblNlbGVjdCh0aGlzLnF1ZXJ5KS5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgICAgICAoc3VjY2VzcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vblF1ZXJ5UmVzdWx0LmVtaXQoc3VjY2Vzcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25RdWVyeVJlc3VsdC5lbWl0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm9uUXVlcnlSZXN1bHQuZW1pdCh1bmRlZmluZWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHF1ZXJ5U2VydmljZTogV2l6YXJkUXVlcnlTZXJ2aWNlKSB7fVxyXG5cclxufSJdfQ==