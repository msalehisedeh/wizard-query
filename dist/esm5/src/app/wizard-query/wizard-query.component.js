/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input } from '@angular/core';
import { WizardQueryService } from './wizard-query.service';
var WizardQueryComponent = /** @class */ (function () {
    function WizardQueryComponent(queryService) {
        this.queryService = queryService;
    }
    Object.defineProperty(WizardQueryComponent.prototype, "queryInfo", {
        set: /**
         * @param {?} data
         * @return {?}
         */
        function (data) {
            var _this = this;
            this.query = data;
            if (this.query) {
                this.selectedDocumentName = this.query.in.substring(this.query.in.lastIndexOf('/'));
                this.queryService.chainSelect({
                    in: this.query.in,
                    path: ''
                }).subscribe(function (success) {
                    if (success) {
                        _this.source = success;
                        _this.data = undefined;
                    }
                }, function (error) {
                    _this.source = error;
                    _this.data = undefined;
                });
            }
            else {
                this.data = undefined;
                this.source = undefined;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} text
     * @return {?}
     */
    WizardQueryComponent.prototype.executeQuery = /**
     * @param {?} text
     * @return {?}
     */
    function (text) {
        var _this = this;
        /** @type {?} */
        var content = JSON.parse(text.value);
        this.queryService.chainSelect(content).subscribe(function (success) {
            if (success) {
                _this.data = success;
            }
        }, function (error) {
            _this.data = error;
        });
    };
    WizardQueryComponent.decorators = [
        { type: Component, args: [{
                    selector: 'wizard-query',
                    template: "\n<div class=\"entry\" *ngIf=\"source\">\n  <div class=\"entry-label\">Source: {{selectedDocumentName}}</div>\n  <div class=\"entry-label\">Type or modify query</div>\n  <div class=\"entry-json\">{{ source | json }}</div>\n  <textarea #text [value]=\"query | json\" (input)=\"data = undefined\"></textarea>\n  <div class=\"submit\"><button (click)=\"executeQuery(text)\">Execute query</button></div>\n</div>\n\n<div *ngIf=\"data\" class=\"result-json\">{{ data | json }}</div>\n",
                    styles: [".result-json{border:1px solid #633;background-color:#fefefe;border-radius:5px;box-sizing:border-box;display:block;max-height:222px;min-height:222px;overflow-y:auto;position:relative;font-family:monospace;float:left;padding:5px;unicode-bidi:embed;width:100%;white-space:pre-wrap}.entry .entry-json{border:1px solid #633;background-color:#fefefe;box-sizing:border-box;display:block;max-height:222px;min-height:222px;overflow-y:auto;position:relative;font-family:monospace;float:left;padding:5px;unicode-bidi:embed;width:50%;white-space:pre-wrap;border-radius:0 0 0 5px}.entry textarea{width:50%;min-height:222px;max-height:222px;resize:none;box-sizing:border-box;padding:5px;border-radius:0 0 5px}.entry .entry-label{width:50%;font-weight:700;padding:5px;background-color:#888;color:#fff;float:left;box-sizing:border-box}.entry .submit{text-align:center;padding-bottom:5px}.entry .submit button{padding:5px 35px}"]
                }] }
    ];
    /** @nocollapse */
    WizardQueryComponent.ctorParameters = function () { return [
        { type: WizardQueryService }
    ]; };
    WizardQueryComponent.propDecorators = {
        queryInfo: [{ type: Input }]
    };
    return WizardQueryComponent;
}());
export { WizardQueryComponent };
if (false) {
    /** @type {?} */
    WizardQueryComponent.prototype.selectedDocumentName;
    /** @type {?} */
    WizardQueryComponent.prototype.data;
    /** @type {?} */
    WizardQueryComponent.prototype.source;
    /** @type {?} */
    WizardQueryComponent.prototype.query;
    /** @type {?} */
    WizardQueryComponent.prototype.queryService;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLXF1ZXJ5LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3dpemFyZC1xdWVyeS8iLCJzb3VyY2VzIjpbInNyYy9hcHAvd2l6YXJkLXF1ZXJ5L3dpemFyZC1xdWVyeS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRWpELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDOztJQXdDMUQsOEJBQW9CLFlBQWdDO1FBQWhDLGlCQUFZLEdBQVosWUFBWSxDQUFvQjtLQUNuRDtJQTNCRCxzQkFDSSwyQ0FBUzs7Ozs7UUFEYixVQUNjLElBQVM7WUFEdkIsaUJBd0JDO1lBdEJDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2xCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNmLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BGLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDO29CQUM1QixFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUNqQixJQUFJLEVBQUUsRUFBRTtpQkFDVCxDQUFDLENBQUMsU0FBUyxDQUNWLFVBQUMsT0FBTztvQkFDTixFQUFFLENBQUEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO3dCQUNYLEtBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDO3dCQUN0QixLQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztxQkFDdkI7aUJBQ0YsRUFDRCxVQUFDLEtBQUs7b0JBQ0osS0FBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7b0JBQ3BCLEtBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO2lCQUN2QixDQUNGLENBQUM7YUFDSDtZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLElBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO2dCQUN0QixJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQzthQUN6QjtTQUNGOzs7T0FBQTs7Ozs7SUFLRCwyQ0FBWTs7OztJQUFaLFVBQWEsSUFBUztRQUF0QixpQkFZQzs7UUFYQyxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQzlDLFVBQUMsT0FBTztZQUNOLEVBQUUsQ0FBQSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsS0FBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7YUFDckI7U0FDRixFQUNELFVBQUMsS0FBSztZQUNKLEtBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO1NBQ25CLENBQ0YsQ0FBQztLQUNIOztnQkFyREYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxjQUFjO29CQUN4QiwwZUFBa0M7O2lCQUVuQzs7OztnQkFOUSxrQkFBa0I7Ozs0QkFjeEIsS0FBSzs7K0JBaEJSOztTQVNhLG9CQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgV2l6YXJkUXVlcnlTZXJ2aWNlIH0gZnJvbSAnLi93aXphcmQtcXVlcnkuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3dpemFyZC1xdWVyeScsXG4gIHRlbXBsYXRlVXJsOiAnLi93aXphcmQtcXVlcnkuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3dpemFyZC1xdWVyeS5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgV2l6YXJkUXVlcnlDb21wb25lbnQge1xuICBzZWxlY3RlZERvY3VtZW50TmFtZTogc3RyaW5nO1xuXG4gIGRhdGE6IGFueTtcbiAgc291cmNlOiBhbnk7XG4gIHF1ZXJ5OiBhbnk7XG4gIFxuICBASW5wdXQoKVxuICBzZXQgcXVlcnlJbmZvKGRhdGE6IGFueSkge1xuICAgIHRoaXMucXVlcnkgPSBkYXRhO1xuICAgIGlmICh0aGlzLnF1ZXJ5KSB7XG4gICAgICB0aGlzLnNlbGVjdGVkRG9jdW1lbnROYW1lID0gdGhpcy5xdWVyeS5pbi5zdWJzdHJpbmcodGhpcy5xdWVyeS5pbi5sYXN0SW5kZXhPZignLycpKTtcbiAgICAgIHRoaXMucXVlcnlTZXJ2aWNlLmNoYWluU2VsZWN0KHtcbiAgICAgICAgaW46IHRoaXMucXVlcnkuaW4sXG4gICAgICAgIHBhdGg6ICcnXG4gICAgICB9KS5zdWJzY3JpYmUoXG4gICAgICAgIChzdWNjZXNzKSA9PiB7XG4gICAgICAgICAgaWYoc3VjY2Vzcykge1xuICAgICAgICAgICAgdGhpcy5zb3VyY2UgPSBzdWNjZXNzO1xuICAgICAgICAgICAgdGhpcy5kYXRhID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgKGVycm9yKSA9PiB7XG4gICAgICAgICAgdGhpcy5zb3VyY2UgPSBlcnJvcjtcbiAgICAgICAgICB0aGlzLmRhdGEgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGF0YSA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuc291cmNlID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcXVlcnlTZXJ2aWNlOiBXaXphcmRRdWVyeVNlcnZpY2UpIHtcbiAgfVxuXG4gIGV4ZWN1dGVRdWVyeSh0ZXh0OiBhbnkpIHtcbiAgICBjb25zdCBjb250ZW50ID0gSlNPTi5wYXJzZSh0ZXh0LnZhbHVlKTtcbiAgICB0aGlzLnF1ZXJ5U2VydmljZS5jaGFpblNlbGVjdChjb250ZW50KS5zdWJzY3JpYmUoXG4gICAgICAoc3VjY2VzcykgPT4ge1xuICAgICAgICBpZihzdWNjZXNzKSB7XG4gICAgICAgICAgdGhpcy5kYXRhID0gc3VjY2VzcztcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIChlcnJvcikgPT4ge1xuICAgICAgICB0aGlzLmRhdGEgPSBlcnJvcjtcbiAgICAgIH1cbiAgICApO1xuICB9XG59XG4iXX0=