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
     * @param {?} content
     * @return {?}
     */
    WizardQueryComponent.prototype.parseFunctions = /**
     * @param {?} content
     * @return {?}
     */
    function (content) {
        var _this = this;
        if (content instanceof Array) {
            content.map(function (item) {
                _this.parseFunctions(item);
            });
        }
        else if (typeof content === 'object') {
            Object.keys(content).map(function (key) {
                if (key === 'handler') {
                    content[key] = new Function('return function' + content[key])();
                }
                else {
                    _this.parseFunctions(content[key]);
                }
            });
        }
    };
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
        try {
            /** @type {?} */
            var content = JSON.parse(text.value);
            this.parseFunctions(content);
            if (content instanceof Array) {
                this.queryService.arraySelect(content).subscribe(function (success) {
                    if (success) {
                        _this.data = success;
                    }
                }, function (error) {
                    _this.data = { alert: error };
                });
            }
            else {
                this.queryService.chainSelect(content).subscribe(function (success) {
                    if (success) {
                        _this.data = success;
                    }
                }, function (error) {
                    _this.data = { alert: error };
                });
            }
        }
        catch (err) {
            this.data = { alert: err.message };
        }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLXF1ZXJ5LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZWRlaC93aXphcmQtcXVlcnkvIiwic291cmNlcyI6WyJzcmMvYXBwL3dpemFyZC1xdWVyeS93aXphcmQtcXVlcnkuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVqRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQzs7SUF3QzFELDhCQUFvQixZQUFnQztRQUFoQyxpQkFBWSxHQUFaLFlBQVksQ0FBb0I7S0FDbkQ7SUEzQkQsc0JBQ0ksMkNBQVM7Ozs7O1FBRGIsVUFDYyxJQUFTO1lBRHZCLGlCQXdCQztZQXRCQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztZQUNsQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDZixJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNwRixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQztvQkFDNUIsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtvQkFDakIsSUFBSSxFQUFFLEVBQUU7aUJBQ1QsQ0FBQyxDQUFDLFNBQVMsQ0FDVixVQUFDLE9BQU87b0JBQ04sRUFBRSxDQUFBLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzt3QkFDWCxLQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQzt3QkFDdEIsS0FBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7cUJBQ3ZCO2lCQUNGLEVBQ0QsVUFBQyxLQUFLO29CQUNKLEtBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO29CQUNwQixLQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztpQkFDdkIsQ0FDRixDQUFDO2FBQ0g7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixJQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztnQkFDdEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7YUFDekI7U0FDRjs7O09BQUE7Ozs7O0lBS08sNkNBQWM7Ozs7Y0FBQyxPQUFZOztRQUNqQyxFQUFFLENBQUMsQ0FBQyxPQUFPLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQztZQUM3QixPQUFPLENBQUMsR0FBRyxDQUNULFVBQUMsSUFBSTtnQkFDSCxLQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzNCLENBQ0YsQ0FBQTtTQUNGO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sT0FBTyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDdkMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQ3RCLFVBQUMsR0FBRztnQkFDRixFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDdEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksUUFBUSxDQUFDLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7aUJBQ2pFO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLEtBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7aUJBQ25DO2FBQ0YsQ0FDRixDQUFDO1NBQ0g7Ozs7OztJQUdILDJDQUFZOzs7O0lBQVosVUFBYSxJQUFTO1FBQXRCLGlCQThCQztRQTdCQyxJQUFJLENBQUM7O1lBQ0gsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdkMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUM1QixFQUFFLENBQUMsQ0FBQyxPQUFPLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDN0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUM5QyxVQUFDLE9BQU87b0JBQ04sRUFBRSxDQUFBLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzt3QkFDWCxLQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztxQkFDckI7aUJBQ0YsRUFDRCxVQUFDLEtBQUs7b0JBQ0osS0FBSSxDQUFDLElBQUksR0FBRyxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUMsQ0FBQztpQkFDNUIsQ0FDRixDQUFDO2FBQ0g7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQzlDLFVBQUMsT0FBTztvQkFDTixFQUFFLENBQUEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO3dCQUNYLEtBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO3FCQUNyQjtpQkFDRixFQUNELFVBQUMsS0FBSztvQkFDSixLQUFJLENBQUMsSUFBSSxHQUFHLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBQyxDQUFDO2lCQUM1QixDQUNGLENBQUM7YUFDSDtTQUNGO1FBQUEsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDWixJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxPQUFPLEVBQUMsQ0FBQztTQUNsQztLQUNGOztnQkEzRkYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxjQUFjO29CQUN4QiwwZUFBa0M7O2lCQUVuQzs7OztnQkFOUSxrQkFBa0I7Ozs0QkFjeEIsS0FBSzs7K0JBaEJSOztTQVNhLG9CQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgV2l6YXJkUXVlcnlTZXJ2aWNlIH0gZnJvbSAnLi93aXphcmQtcXVlcnkuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3dpemFyZC1xdWVyeScsXG4gIHRlbXBsYXRlVXJsOiAnLi93aXphcmQtcXVlcnkuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3dpemFyZC1xdWVyeS5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgV2l6YXJkUXVlcnlDb21wb25lbnQge1xuICBzZWxlY3RlZERvY3VtZW50TmFtZTogc3RyaW5nO1xuXG4gIGRhdGE6IGFueTtcbiAgc291cmNlOiBhbnk7XG4gIHF1ZXJ5OiBhbnk7XG4gIFxuICBASW5wdXQoKVxuICBzZXQgcXVlcnlJbmZvKGRhdGE6IGFueSkge1xuICAgIHRoaXMucXVlcnkgPSBkYXRhO1xuICAgIGlmICh0aGlzLnF1ZXJ5KSB7XG4gICAgICB0aGlzLnNlbGVjdGVkRG9jdW1lbnROYW1lID0gdGhpcy5xdWVyeS5pbi5zdWJzdHJpbmcodGhpcy5xdWVyeS5pbi5sYXN0SW5kZXhPZignLycpKTtcbiAgICAgIHRoaXMucXVlcnlTZXJ2aWNlLmNoYWluU2VsZWN0KHtcbiAgICAgICAgaW46IHRoaXMucXVlcnkuaW4sXG4gICAgICAgIHBhdGg6ICcnXG4gICAgICB9KS5zdWJzY3JpYmUoXG4gICAgICAgIChzdWNjZXNzKSA9PiB7XG4gICAgICAgICAgaWYoc3VjY2Vzcykge1xuICAgICAgICAgICAgdGhpcy5zb3VyY2UgPSBzdWNjZXNzO1xuICAgICAgICAgICAgdGhpcy5kYXRhID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgKGVycm9yKSA9PiB7XG4gICAgICAgICAgdGhpcy5zb3VyY2UgPSBlcnJvcjtcbiAgICAgICAgICB0aGlzLmRhdGEgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGF0YSA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuc291cmNlID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcXVlcnlTZXJ2aWNlOiBXaXphcmRRdWVyeVNlcnZpY2UpIHtcbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VGdW5jdGlvbnMoY29udGVudDogYW55KSB7XG4gICAgaWYgKGNvbnRlbnQgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgY29udGVudC5tYXAoXG4gICAgICAgIChpdGVtKSA9PiB7XG4gICAgICAgICAgdGhpcy5wYXJzZUZ1bmN0aW9ucyhpdGVtKTtcbiAgICAgICAgfVxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbnRlbnQgPT09ICdvYmplY3QnKSB7XG4gICAgICBPYmplY3Qua2V5cyhjb250ZW50KS5tYXAoXG4gICAgICAgIChrZXkpID0+IHtcbiAgICAgICAgICBpZiAoa2V5ID09PSAnaGFuZGxlcicpIHtcbiAgICAgICAgICAgIGNvbnRlbnRba2V5XSA9IG5ldyBGdW5jdGlvbigncmV0dXJuIGZ1bmN0aW9uJyArIGNvbnRlbnRba2V5XSkoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wYXJzZUZ1bmN0aW9ucyhjb250ZW50W2tleV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBleGVjdXRlUXVlcnkodGV4dDogYW55KSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBKU09OLnBhcnNlKHRleHQudmFsdWUpO1xuICAgICAgdGhpcy5wYXJzZUZ1bmN0aW9ucyhjb250ZW50KVxuICAgICAgaWYgKGNvbnRlbnQgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICB0aGlzLnF1ZXJ5U2VydmljZS5hcnJheVNlbGVjdChjb250ZW50KS5zdWJzY3JpYmUoXG4gICAgICAgICAgKHN1Y2Nlc3MpID0+IHtcbiAgICAgICAgICAgIGlmKHN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgdGhpcy5kYXRhID0gc3VjY2VzcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgdGhpcy5kYXRhID0ge2FsZXJ0OiBlcnJvcn07XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5xdWVyeVNlcnZpY2UuY2hhaW5TZWxlY3QoY29udGVudCkuc3Vic2NyaWJlKFxuICAgICAgICAgIChzdWNjZXNzKSA9PiB7XG4gICAgICAgICAgICBpZihzdWNjZXNzKSB7XG4gICAgICAgICAgICAgIHRoaXMuZGF0YSA9IHN1Y2Nlc3M7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IHthbGVydDogZXJyb3J9O1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9Y2F0Y2ggKGVycikge1xuICAgICAgdGhpcy5kYXRhID0ge2FsZXJ0OiBlcnIubWVzc2FnZX07XG4gICAgfVxuICB9XG59XG4iXX0=