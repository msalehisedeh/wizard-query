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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLXF1ZXJ5LmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3dpemFyZC1xdWVyeS8iLCJzb3VyY2VzIjpbInNyYy9hcHAvd2l6YXJkLXF1ZXJ5L3dpemFyZC1xdWVyeS5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFDSCxTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ2YsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7O0lBK0N4RCw4QkFBb0IsWUFBZ0M7UUFBaEMsaUJBQVksR0FBWixZQUFZLENBQW9COzZCQXJDakIsSUFBSSxZQUFZLEVBQUU7NEJBR25CLElBQUksWUFBWSxFQUFFO0tBa0NJO0lBaEN4RCxzQkFDSSw2Q0FBVzs7Ozs7UUFEZixVQUNnQixJQUFTO1lBRHpCLGlCQThCQztZQTVCRyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztZQUNsQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDYixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxZQUFZLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQzlCLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQy9DLFVBQUMsT0FBTzt3QkFDSixFQUFFLENBQUEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDOzRCQUNULEtBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3lCQUNwQztxQkFDSixFQUNELFVBQUMsS0FBSzt3QkFDRixLQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO3FCQUMzQyxDQUNKLENBQUM7aUJBQ0w7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FDL0MsVUFBQyxPQUFPO3dCQUNKLEVBQUUsQ0FBQSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7NEJBQ1QsS0FBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7eUJBQ3BDO3FCQUNKLEVBQ0QsVUFBQyxLQUFLO3dCQUNGLEtBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7cUJBQzNDLENBQ0osQ0FBQztpQkFDTDthQUNKO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDdEM7U0FDSjs7O09BQUE7O2dCQTNDSixTQUFTLFNBQUM7b0JBQ1AsUUFBUSxFQUFFLGVBQWU7aUJBQzVCOzs7O2dCQUpRLGtCQUFrQjs7O2dDQVN0QixNQUFNOytCQUdOLE1BQU07OEJBR04sS0FBSzs7K0JBdEJWOztTQVlhLG9CQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgICBEaXJlY3RpdmUsXHJcbiAgICBJbnB1dCxcclxuICAgIE91dHB1dCxcclxuICAgIEV2ZW50RW1pdHRlclxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgV2l6YXJkUXVlcnlTZXJ2aWNlIH0gZnJvbSAnLi93aXphcmQtcXVlcnkuc2VydmljZSc7XHJcblxyXG5ARGlyZWN0aXZlKHtcclxuICAgIHNlbGVjdG9yOiAnW3dpemFyZFF1ZXJ5XSdcclxufSlcclxuZXhwb3J0IGNsYXNzIFdpemFyZFF1ZXJ5RGlyZWN0aXZlIHtcclxuICAgIHF1ZXJ5OiBhbnk7XHJcblxyXG4gICAgICAgICAgICBcclxuICAgIEBPdXRwdXQoKVxyXG4gICAgb25RdWVyeVJlc3VsdDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gICAgQE91dHB1dCgpXHJcbiAgICBvblF1ZXJ5RXJyb3I6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICAgIEBJbnB1dCgpXHJcbiAgICBzZXQgd2l6YXJkUXVlcnkoaW5mbzogYW55KSB7XHJcbiAgICAgICAgdGhpcy5xdWVyeSA9IGluZm87XHJcbiAgICAgICAgaWYgKHRoaXMucXVlcnkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucXVlcnkgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5xdWVyeVNlcnZpY2UuYXJyYXlTZWxlY3QodGhpcy5xdWVyeSkuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgICAgICAgICAgIChzdWNjZXNzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25RdWVyeVJlc3VsdC5lbWl0KHN1Y2Nlc3MpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vblF1ZXJ5UmVzdWx0LmVtaXQoe2FsZXJ0OiBlcnJvcn0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5U2VydmljZS5jaGFpblNlbGVjdCh0aGlzLnF1ZXJ5KS5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgICAgICAgICAgKHN1Y2Nlc3MpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoc3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vblF1ZXJ5UmVzdWx0LmVtaXQoc3VjY2Vzcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uUXVlcnlSZXN1bHQuZW1pdCh7YWxlcnQ6IGVycm9yfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMub25RdWVyeVJlc3VsdC5lbWl0KHVuZGVmaW5lZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcXVlcnlTZXJ2aWNlOiBXaXphcmRRdWVyeVNlcnZpY2UpIHt9XHJcblxyXG59Il19