import * as tslib_1 from "tslib";
import { Directive, Input, Output, EventEmitter } from '@angular/core';
import { WizardQueryService } from './wizard-query.service';
let WizardQueryDirective = class WizardQueryDirective {
    constructor(queryService) {
        this.queryService = queryService;
        this.onQueryResult = new EventEmitter();
        this.onQueryError = new EventEmitter();
    }
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
};
WizardQueryDirective.ctorParameters = () => [
    { type: WizardQueryService }
];
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
export { WizardQueryDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLXF1ZXJ5LmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZWRlaC93aXphcmQtcXVlcnkvIiwic291cmNlcyI6WyJzcmMvYXBwL3dpemFyZC1xdWVyeS93aXphcmQtcXVlcnkuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0gsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNmLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBSzVELElBQWEsb0JBQW9CLEdBQWpDLE1BQWEsb0JBQW9CO0lBMEM3QixZQUFvQixZQUFnQztRQUFoQyxpQkFBWSxHQUFaLFlBQVksQ0FBb0I7UUFyQ3BELGtCQUFhLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFHdEQsaUJBQVksR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQWtDRSxDQUFDO0lBL0J4RCxJQUFJLFdBQVcsQ0FBQyxJQUFTO1FBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNaLElBQUksSUFBSSxDQUFDLEtBQUssWUFBWSxLQUFLLEVBQUU7Z0JBQzdCLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQy9DLENBQUMsT0FBTyxFQUFFLEVBQUU7b0JBQ1IsSUFBRyxPQUFPLEVBQUU7d0JBQ1IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7cUJBQ3BDO2dCQUNMLENBQUMsRUFDRCxDQUFDLEtBQUssRUFBRSxFQUFFO29CQUNOLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7Z0JBQzVDLENBQUMsQ0FDSixDQUFDO2FBQ0w7aUJBQU07Z0JBQ0gsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FDL0MsQ0FBQyxPQUFPLEVBQUUsRUFBRTtvQkFDUixJQUFHLE9BQU8sRUFBRTt3QkFDUixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztxQkFDcEM7Z0JBQ0wsQ0FBQyxFQUNELENBQUMsS0FBSyxFQUFFLEVBQUU7b0JBQ04sSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztnQkFDNUMsQ0FBQyxDQUNKLENBQUM7YUFDTDtTQUNKO2FBQU07WUFDSCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUN0QztJQUNMLENBQUM7Q0FJSixDQUFBOztZQUZxQyxrQkFBa0I7O0FBckNwRDtJQURDLE1BQU0sRUFBRTsyREFDNkM7QUFHdEQ7SUFEQyxNQUFNLEVBQUU7MERBQzRDO0FBR3JEO0lBREMsS0FBSyxFQUFFO3VEQThCUDtBQXhDUSxvQkFBb0I7SUFIaEMsU0FBUyxDQUFDO1FBQ1AsUUFBUSxFQUFFLGVBQWU7S0FDNUIsQ0FBQztHQUNXLG9CQUFvQixDQTRDaEM7U0E1Q1ksb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICAgIERpcmVjdGl2ZSxcclxuICAgIElucHV0LFxyXG4gICAgT3V0cHV0LFxyXG4gICAgRXZlbnRFbWl0dGVyXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBXaXphcmRRdWVyeVNlcnZpY2UgfSBmcm9tICcuL3dpemFyZC1xdWVyeS5zZXJ2aWNlJztcclxuXHJcbkBEaXJlY3RpdmUoe1xyXG4gICAgc2VsZWN0b3I6ICdbd2l6YXJkUXVlcnldJ1xyXG59KVxyXG5leHBvcnQgY2xhc3MgV2l6YXJkUXVlcnlEaXJlY3RpdmUge1xyXG4gICAgcXVlcnk6IGFueTtcclxuXHJcbiAgICAgICAgICAgIFxyXG4gICAgQE91dHB1dCgpXHJcbiAgICBvblF1ZXJ5UmVzdWx0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgICBAT3V0cHV0KClcclxuICAgIG9uUXVlcnlFcnJvcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIHNldCB3aXphcmRRdWVyeShpbmZvOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnF1ZXJ5ID0gaW5mbztcclxuICAgICAgICBpZiAodGhpcy5xdWVyeSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5xdWVyeSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5U2VydmljZS5hcnJheVNlbGVjdCh0aGlzLnF1ZXJ5KS5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgICAgICAgICAgKHN1Y2Nlc3MpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoc3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vblF1ZXJ5UmVzdWx0LmVtaXQoc3VjY2Vzcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uUXVlcnlSZXN1bHQuZW1pdCh7YWxlcnQ6IGVycm9yfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucXVlcnlTZXJ2aWNlLmNoYWluU2VsZWN0KHRoaXMucXVlcnkpLnN1YnNjcmliZShcclxuICAgICAgICAgICAgICAgICAgICAoc3VjY2VzcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihzdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uUXVlcnlSZXN1bHQuZW1pdChzdWNjZXNzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25RdWVyeVJlc3VsdC5lbWl0KHthbGVydDogZXJyb3J9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5vblF1ZXJ5UmVzdWx0LmVtaXQodW5kZWZpbmVkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBxdWVyeVNlcnZpY2U6IFdpemFyZFF1ZXJ5U2VydmljZSkge31cclxuXHJcbn0iXX0=