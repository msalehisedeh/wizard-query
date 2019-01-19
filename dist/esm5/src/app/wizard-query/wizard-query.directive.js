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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLXF1ZXJ5LmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZWRlaC93aXphcmQtcXVlcnkvIiwic291cmNlcyI6WyJzcmMvYXBwL3dpemFyZC1xdWVyeS93aXphcmQtcXVlcnkuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQ0gsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNmLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDOztJQStDeEQsOEJBQW9CLFlBQWdDO1FBQWhDLGlCQUFZLEdBQVosWUFBWSxDQUFvQjs2QkFyQ2pCLElBQUksWUFBWSxFQUFFOzRCQUduQixJQUFJLFlBQVksRUFBRTtLQWtDSTtJQWhDeEQsc0JBQ0ksNkNBQVc7Ozs7O1FBRGYsVUFDZ0IsSUFBUztZQUR6QixpQkE4QkM7WUE1QkcsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDbEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUM5QixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUMvQyxVQUFDLE9BQU87d0JBQ0osRUFBRSxDQUFBLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzs0QkFDVCxLQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzt5QkFDcEM7cUJBQ0osRUFDRCxVQUFDLEtBQUs7d0JBQ0YsS0FBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztxQkFDM0MsQ0FDSixDQUFDO2lCQUNMO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQy9DLFVBQUMsT0FBTzt3QkFDSixFQUFFLENBQUEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDOzRCQUNULEtBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3lCQUNwQztxQkFDSixFQUNELFVBQUMsS0FBSzt3QkFDRixLQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO3FCQUMzQyxDQUNKLENBQUM7aUJBQ0w7YUFDSjtZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQ3RDO1NBQ0o7OztPQUFBOztnQkEzQ0osU0FBUyxTQUFDO29CQUNQLFFBQVEsRUFBRSxlQUFlO2lCQUM1Qjs7OztnQkFKUSxrQkFBa0I7OztnQ0FTdEIsTUFBTTsrQkFHTixNQUFNOzhCQUdOLEtBQUs7OytCQXRCVjs7U0FZYSxvQkFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gICAgRGlyZWN0aXZlLFxyXG4gICAgSW5wdXQsXHJcbiAgICBPdXRwdXQsXHJcbiAgICBFdmVudEVtaXR0ZXJcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7IFdpemFyZFF1ZXJ5U2VydmljZSB9IGZyb20gJy4vd2l6YXJkLXF1ZXJ5LnNlcnZpY2UnO1xyXG5cclxuQERpcmVjdGl2ZSh7XHJcbiAgICBzZWxlY3RvcjogJ1t3aXphcmRRdWVyeV0nXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBXaXphcmRRdWVyeURpcmVjdGl2ZSB7XHJcbiAgICBxdWVyeTogYW55O1xyXG5cclxuICAgICAgICAgICAgXHJcbiAgICBAT3V0cHV0KClcclxuICAgIG9uUXVlcnlSZXN1bHQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICAgIEBPdXRwdXQoKVxyXG4gICAgb25RdWVyeUVycm9yOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgICBASW5wdXQoKVxyXG4gICAgc2V0IHdpemFyZFF1ZXJ5KGluZm86IGFueSkge1xyXG4gICAgICAgIHRoaXMucXVlcnkgPSBpbmZvO1xyXG4gICAgICAgIGlmICh0aGlzLnF1ZXJ5KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnF1ZXJ5IGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucXVlcnlTZXJ2aWNlLmFycmF5U2VsZWN0KHRoaXMucXVlcnkpLnN1YnNjcmliZShcclxuICAgICAgICAgICAgICAgICAgICAoc3VjY2VzcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihzdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uUXVlcnlSZXN1bHQuZW1pdChzdWNjZXNzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25RdWVyeVJlc3VsdC5lbWl0KHthbGVydDogZXJyb3J9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5xdWVyeVNlcnZpY2UuY2hhaW5TZWxlY3QodGhpcy5xdWVyeSkuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgICAgICAgICAgIChzdWNjZXNzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25RdWVyeVJlc3VsdC5lbWl0KHN1Y2Nlc3MpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vblF1ZXJ5UmVzdWx0LmVtaXQoe2FsZXJ0OiBlcnJvcn0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm9uUXVlcnlSZXN1bHQuZW1pdCh1bmRlZmluZWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHF1ZXJ5U2VydmljZTogV2l6YXJkUXVlcnlTZXJ2aWNlKSB7fVxyXG5cclxufSJdfQ==