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
                    content[key] = new Function(content[key])();
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLXF1ZXJ5LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3dpemFyZC1xdWVyeS8iLCJzb3VyY2VzIjpbInNyYy9hcHAvd2l6YXJkLXF1ZXJ5L3dpemFyZC1xdWVyeS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRWpELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDOztJQXdDMUQsOEJBQW9CLFlBQWdDO1FBQWhDLGlCQUFZLEdBQVosWUFBWSxDQUFvQjtLQUNuRDtJQTNCRCxzQkFDSSwyQ0FBUzs7Ozs7UUFEYixVQUNjLElBQVM7WUFEdkIsaUJBd0JDO1lBdEJDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2xCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNmLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BGLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDO29CQUM1QixFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUNqQixJQUFJLEVBQUUsRUFBRTtpQkFDVCxDQUFDLENBQUMsU0FBUyxDQUNWLFVBQUMsT0FBTztvQkFDTixFQUFFLENBQUEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO3dCQUNYLEtBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDO3dCQUN0QixLQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztxQkFDdkI7aUJBQ0YsRUFDRCxVQUFDLEtBQUs7b0JBQ0osS0FBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7b0JBQ3BCLEtBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO2lCQUN2QixDQUNGLENBQUM7YUFDSDtZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLElBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO2dCQUN0QixJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQzthQUN6QjtTQUNGOzs7T0FBQTs7Ozs7SUFLTyw2Q0FBYzs7OztjQUFDLE9BQVk7O1FBQ2pDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQzdCLE9BQU8sQ0FBQyxHQUFHLENBQ1QsVUFBQyxJQUFJO2dCQUNILEtBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDM0IsQ0FDRixDQUFBO1NBQ0Y7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxPQUFPLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN2QyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FDdEIsVUFBQyxHQUFHO2dCQUNGLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUN0QixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQztpQkFDN0M7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sS0FBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUUsQ0FBQTtpQkFDbkM7YUFDRixDQUNGLENBQUM7U0FDSDs7Ozs7O0lBR0gsMkNBQVk7Ozs7SUFBWixVQUFhLElBQVM7UUFBdEIsaUJBOEJDO1FBN0JDLElBQUksQ0FBQzs7WUFDSCxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN2QyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQzVCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQzlDLFVBQUMsT0FBTztvQkFDTixFQUFFLENBQUEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO3dCQUNYLEtBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO3FCQUNyQjtpQkFDRixFQUNELFVBQUMsS0FBSztvQkFDSixLQUFJLENBQUMsSUFBSSxHQUFHLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBQyxDQUFDO2lCQUM1QixDQUNGLENBQUM7YUFDSDtZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FDOUMsVUFBQyxPQUFPO29CQUNOLEVBQUUsQ0FBQSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7d0JBQ1gsS0FBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7cUJBQ3JCO2lCQUNGLEVBQ0QsVUFBQyxLQUFLO29CQUNKLEtBQUksQ0FBQyxJQUFJLEdBQUcsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUM7aUJBQzVCLENBQ0YsQ0FBQzthQUNIO1NBQ0Y7UUFBQSxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNaLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLE9BQU8sRUFBQyxDQUFDO1NBQ2xDO0tBQ0Y7O2dCQTNGRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLGNBQWM7b0JBQ3hCLDBlQUFrQzs7aUJBRW5DOzs7O2dCQU5RLGtCQUFrQjs7OzRCQWN4QixLQUFLOzsrQkFoQlI7O1NBU2Esb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBXaXphcmRRdWVyeVNlcnZpY2UgfSBmcm9tICcuL3dpemFyZC1xdWVyeS5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnd2l6YXJkLXF1ZXJ5JyxcbiAgdGVtcGxhdGVVcmw6ICcuL3dpemFyZC1xdWVyeS5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vd2l6YXJkLXF1ZXJ5LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBXaXphcmRRdWVyeUNvbXBvbmVudCB7XG4gIHNlbGVjdGVkRG9jdW1lbnROYW1lOiBzdHJpbmc7XG5cbiAgZGF0YTogYW55O1xuICBzb3VyY2U6IGFueTtcbiAgcXVlcnk6IGFueTtcbiAgXG4gIEBJbnB1dCgpXG4gIHNldCBxdWVyeUluZm8oZGF0YTogYW55KSB7XG4gICAgdGhpcy5xdWVyeSA9IGRhdGE7XG4gICAgaWYgKHRoaXMucXVlcnkpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWREb2N1bWVudE5hbWUgPSB0aGlzLnF1ZXJ5LmluLnN1YnN0cmluZyh0aGlzLnF1ZXJ5LmluLmxhc3RJbmRleE9mKCcvJykpO1xuICAgICAgdGhpcy5xdWVyeVNlcnZpY2UuY2hhaW5TZWxlY3Qoe1xuICAgICAgICBpbjogdGhpcy5xdWVyeS5pbixcbiAgICAgICAgcGF0aDogJydcbiAgICAgIH0pLnN1YnNjcmliZShcbiAgICAgICAgKHN1Y2Nlc3MpID0+IHtcbiAgICAgICAgICBpZihzdWNjZXNzKSB7XG4gICAgICAgICAgICB0aGlzLnNvdXJjZSA9IHN1Y2Nlc3M7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAoZXJyb3IpID0+IHtcbiAgICAgICAgICB0aGlzLnNvdXJjZSA9IGVycm9yO1xuICAgICAgICAgIHRoaXMuZGF0YSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kYXRhID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5zb3VyY2UgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBxdWVyeVNlcnZpY2U6IFdpemFyZFF1ZXJ5U2VydmljZSkge1xuICB9XG5cbiAgcHJpdmF0ZSBwYXJzZUZ1bmN0aW9ucyhjb250ZW50OiBhbnkpIHtcbiAgICBpZiAoY29udGVudCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICBjb250ZW50Lm1hcChcbiAgICAgICAgKGl0ZW0pID0+IHtcbiAgICAgICAgICB0aGlzLnBhcnNlRnVuY3Rpb25zKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICApXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgY29udGVudCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIE9iamVjdC5rZXlzKGNvbnRlbnQpLm1hcChcbiAgICAgICAgKGtleSkgPT4ge1xuICAgICAgICAgIGlmIChrZXkgPT09ICdoYW5kbGVyJykge1xuICAgICAgICAgICAgY29udGVudFtrZXldID0gbmV3IEZ1bmN0aW9uKGNvbnRlbnRba2V5XSkoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wYXJzZUZ1bmN0aW9ucyhjb250ZW50W2tleV0gKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBleGVjdXRlUXVlcnkodGV4dDogYW55KSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBKU09OLnBhcnNlKHRleHQudmFsdWUpO1xuICAgICAgdGhpcy5wYXJzZUZ1bmN0aW9ucyhjb250ZW50KVxuICAgICAgaWYgKGNvbnRlbnQgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICB0aGlzLnF1ZXJ5U2VydmljZS5hcnJheVNlbGVjdChjb250ZW50KS5zdWJzY3JpYmUoXG4gICAgICAgICAgKHN1Y2Nlc3MpID0+IHtcbiAgICAgICAgICAgIGlmKHN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgdGhpcy5kYXRhID0gc3VjY2VzcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgdGhpcy5kYXRhID0ge2FsZXJ0OiBlcnJvcn07XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5xdWVyeVNlcnZpY2UuY2hhaW5TZWxlY3QoY29udGVudCkuc3Vic2NyaWJlKFxuICAgICAgICAgIChzdWNjZXNzKSA9PiB7XG4gICAgICAgICAgICBpZihzdWNjZXNzKSB7XG4gICAgICAgICAgICAgIHRoaXMuZGF0YSA9IHN1Y2Nlc3M7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IHthbGVydDogZXJyb3J9O1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9Y2F0Y2ggKGVycikge1xuICAgICAgdGhpcy5kYXRhID0ge2FsZXJ0OiBlcnIubWVzc2FnZX07XG4gICAgfVxuICB9XG59XG4iXX0=