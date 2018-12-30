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
                if (this.query instanceof Array) {
                    this.queryService.arraySelect(this.query).subscribe(function (success) {
                        if (success) {
                            _this.onQueryResult.emit(success);
                        }
                    }, function (error) {
                        _this.onQueryResult.emit(error);
                    });
                }
                else {
                    this.queryService.chainSelect(this.query).subscribe(function (success) {
                        if (success) {
                            _this.onQueryResult.emit(success);
                        }
                    }, function (error) {
                        _this.onQueryResult.emit(error);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLXF1ZXJ5LmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3dpemFyZC1xdWVyeS8iLCJzb3VyY2VzIjpbInNyYy9hcHAvd2l6YXJkLXF1ZXJ5L3dpemFyZC1xdWVyeS5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFDSCxTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ2YsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7O0lBK0N4RCw4QkFBb0IsWUFBZ0M7UUFBaEMsaUJBQVksR0FBWixZQUFZLENBQW9COzZCQXJDakIsSUFBSSxZQUFZLEVBQUU7NEJBR25CLElBQUksWUFBWSxFQUFFO0tBa0NJO0lBaEN4RCxzQkFDSSw2Q0FBVzs7Ozs7UUFEZixVQUNnQixJQUFTO1lBRHpCLGlCQThCQztZQTVCRyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztZQUNsQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDYixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxZQUFZLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQzlCLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQy9DLFVBQUMsT0FBTzt3QkFDSixFQUFFLENBQUEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDOzRCQUNULEtBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3lCQUNwQztxQkFDSixFQUNELFVBQUMsS0FBSzt3QkFDRixLQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztxQkFDbEMsQ0FDSixDQUFDO2lCQUNMO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQy9DLFVBQUMsT0FBTzt3QkFDSixFQUFFLENBQUEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDOzRCQUNULEtBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3lCQUNwQztxQkFDSixFQUNELFVBQUMsS0FBSzt3QkFDRixLQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztxQkFDbEMsQ0FDSixDQUFDO2lCQUNMO2FBQ0o7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUN0QztTQUNKOzs7T0FBQTs7Z0JBM0NKLFNBQVMsU0FBQztvQkFDUCxRQUFRLEVBQUUsZUFBZTtpQkFDNUI7Ozs7Z0JBSlEsa0JBQWtCOzs7Z0NBU3RCLE1BQU07K0JBR04sTUFBTTs4QkFHTixLQUFLOzsrQkF0QlY7O1NBWWEsb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICAgIERpcmVjdGl2ZSxcclxuICAgIElucHV0LFxyXG4gICAgT3V0cHV0LFxyXG4gICAgRXZlbnRFbWl0dGVyXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBXaXphcmRRdWVyeVNlcnZpY2UgfSBmcm9tICcuL3dpemFyZC1xdWVyeS5zZXJ2aWNlJztcclxuXHJcbkBEaXJlY3RpdmUoe1xyXG4gICAgc2VsZWN0b3I6ICdbd2l6YXJkUXVlcnldJ1xyXG59KVxyXG5leHBvcnQgY2xhc3MgV2l6YXJkUXVlcnlEaXJlY3RpdmUge1xyXG4gICAgcXVlcnk6IGFueTtcclxuXHJcbiAgICAgICAgICAgIFxyXG4gICAgQE91dHB1dCgpXHJcbiAgICBvblF1ZXJ5UmVzdWx0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgICBAT3V0cHV0KClcclxuICAgIG9uUXVlcnlFcnJvcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIHNldCB3aXphcmRRdWVyeShpbmZvOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnF1ZXJ5ID0gaW5mbztcclxuICAgICAgICBpZiAodGhpcy5xdWVyeSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5xdWVyeSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5U2VydmljZS5hcnJheVNlbGVjdCh0aGlzLnF1ZXJ5KS5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgICAgICAgICAgKHN1Y2Nlc3MpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoc3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vblF1ZXJ5UmVzdWx0LmVtaXQoc3VjY2Vzcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uUXVlcnlSZXN1bHQuZW1pdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucXVlcnlTZXJ2aWNlLmNoYWluU2VsZWN0KHRoaXMucXVlcnkpLnN1YnNjcmliZShcclxuICAgICAgICAgICAgICAgICAgICAoc3VjY2VzcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihzdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uUXVlcnlSZXN1bHQuZW1pdChzdWNjZXNzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25RdWVyeVJlc3VsdC5lbWl0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5vblF1ZXJ5UmVzdWx0LmVtaXQodW5kZWZpbmVkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBxdWVyeVNlcnZpY2U6IFdpemFyZFF1ZXJ5U2VydmljZSkge31cclxuXHJcbn0iXX0=