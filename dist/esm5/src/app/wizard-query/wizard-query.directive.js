import * as tslib_1 from "tslib";
import { Directive, Input, Output, EventEmitter } from '@angular/core';
import { WizardQueryService } from './wizard-query.service';
var WizardQueryDirective = /** @class */ (function () {
    function WizardQueryDirective(queryService) {
        this.queryService = queryService;
        this.onQueryResult = new EventEmitter();
        this.onQueryError = new EventEmitter();
    }
    Object.defineProperty(WizardQueryDirective.prototype, "wizardQuery", {
        set: function (info) {
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
    WizardQueryDirective.ctorParameters = function () { return [
        { type: WizardQueryService }
    ]; };
    tslib_1.__decorate([
        Output()
    ], WizardQueryDirective.prototype, "onQueryResult", void 0);
    tslib_1.__decorate([
        Output()
    ], WizardQueryDirective.prototype, "onQueryError", void 0);
    tslib_1.__decorate([
        Input()
    ], WizardQueryDirective.prototype, "wizardQuery", null);
    WizardQueryDirective = tslib_1.__decorate([
        Directive({
            selector: '[wizardQuery]'
        })
    ], WizardQueryDirective);
    return WizardQueryDirective;
}());
export { WizardQueryDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLXF1ZXJ5LmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZWRlaC93aXphcmQtcXVlcnkvIiwic291cmNlcyI6WyJzcmMvYXBwL3dpemFyZC1xdWVyeS93aXphcmQtcXVlcnkuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0gsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNmLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBSzVEO0lBMENJLDhCQUFvQixZQUFnQztRQUFoQyxpQkFBWSxHQUFaLFlBQVksQ0FBb0I7UUFyQ3BELGtCQUFhLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFHdEQsaUJBQVksR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQWtDRSxDQUFDO0lBL0J4RCxzQkFBSSw2Q0FBVzthQUFmLFVBQWdCLElBQVM7WUFEekIsaUJBOEJDO1lBNUJHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2xCLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDWixJQUFJLElBQUksQ0FBQyxLQUFLLFlBQVksS0FBSyxFQUFFO29CQUM3QixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUMvQyxVQUFDLE9BQU87d0JBQ0osSUFBRyxPQUFPLEVBQUU7NEJBQ1IsS0FBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7eUJBQ3BDO29CQUNMLENBQUMsRUFDRCxVQUFDLEtBQUs7d0JBQ0YsS0FBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztvQkFDNUMsQ0FBQyxDQUNKLENBQUM7aUJBQ0w7cUJBQU07b0JBQ0gsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FDL0MsVUFBQyxPQUFPO3dCQUNKLElBQUcsT0FBTyxFQUFFOzRCQUNSLEtBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3lCQUNwQztvQkFDTCxDQUFDLEVBQ0QsVUFBQyxLQUFLO3dCQUNGLEtBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7b0JBQzVDLENBQUMsQ0FDSixDQUFDO2lCQUNMO2FBQ0o7aUJBQU07Z0JBQ0gsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDdEM7UUFDTCxDQUFDOzs7T0FBQTs7Z0JBRWlDLGtCQUFrQjs7SUFyQ3BEO1FBREMsTUFBTSxFQUFFOytEQUM2QztJQUd0RDtRQURDLE1BQU0sRUFBRTs4REFDNEM7SUFHckQ7UUFEQyxLQUFLLEVBQUU7MkRBOEJQO0lBeENRLG9CQUFvQjtRQUhoQyxTQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsZUFBZTtTQUM1QixDQUFDO09BQ1csb0JBQW9CLENBNENoQztJQUFELDJCQUFDO0NBQUEsQUE1Q0QsSUE0Q0M7U0E1Q1ksb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICAgIERpcmVjdGl2ZSxcclxuICAgIElucHV0LFxyXG4gICAgT3V0cHV0LFxyXG4gICAgRXZlbnRFbWl0dGVyXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBXaXphcmRRdWVyeVNlcnZpY2UgfSBmcm9tICcuL3dpemFyZC1xdWVyeS5zZXJ2aWNlJztcclxuXHJcbkBEaXJlY3RpdmUoe1xyXG4gICAgc2VsZWN0b3I6ICdbd2l6YXJkUXVlcnldJ1xyXG59KVxyXG5leHBvcnQgY2xhc3MgV2l6YXJkUXVlcnlEaXJlY3RpdmUge1xyXG4gICAgcXVlcnk6IGFueTtcclxuXHJcbiAgICAgICAgICAgIFxyXG4gICAgQE91dHB1dCgpXHJcbiAgICBvblF1ZXJ5UmVzdWx0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgICBAT3V0cHV0KClcclxuICAgIG9uUXVlcnlFcnJvcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIHNldCB3aXphcmRRdWVyeShpbmZvOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnF1ZXJ5ID0gaW5mbztcclxuICAgICAgICBpZiAodGhpcy5xdWVyeSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5xdWVyeSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5U2VydmljZS5hcnJheVNlbGVjdCh0aGlzLnF1ZXJ5KS5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgICAgICAgICAgKHN1Y2Nlc3MpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoc3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vblF1ZXJ5UmVzdWx0LmVtaXQoc3VjY2Vzcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uUXVlcnlSZXN1bHQuZW1pdCh7YWxlcnQ6IGVycm9yfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucXVlcnlTZXJ2aWNlLmNoYWluU2VsZWN0KHRoaXMucXVlcnkpLnN1YnNjcmliZShcclxuICAgICAgICAgICAgICAgICAgICAoc3VjY2VzcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihzdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uUXVlcnlSZXN1bHQuZW1pdChzdWNjZXNzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25RdWVyeVJlc3VsdC5lbWl0KHthbGVydDogZXJyb3J9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5vblF1ZXJ5UmVzdWx0LmVtaXQodW5kZWZpbmVkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBxdWVyeVNlcnZpY2U6IFdpemFyZFF1ZXJ5U2VydmljZSkge31cclxuXHJcbn0iXX0=