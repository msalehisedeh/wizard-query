import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { WizardQueryService } from './wizard-query.service';
var WizardQueryComponent = /** @class */ (function () {
    function WizardQueryComponent(queryService) {
        this.queryService = queryService;
    }
    Object.defineProperty(WizardQueryComponent.prototype, "queryInfo", {
        set: function (data) {
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
    WizardQueryComponent.prototype.parseFunctions = function (content) {
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
    WizardQueryComponent.prototype.executeQuery = function (text) {
        var _this = this;
        try {
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
    WizardQueryComponent.ctorParameters = function () { return [
        { type: WizardQueryService }
    ]; };
    tslib_1.__decorate([
        Input()
    ], WizardQueryComponent.prototype, "queryInfo", null);
    WizardQueryComponent = tslib_1.__decorate([
        Component({
            selector: 'wizard-query',
            template: "\n<div class=\"entry\" *ngIf=\"source\">\n  <div class=\"entry-label\">Source: {{selectedDocumentName}}</div>\n  <div class=\"entry-label\">Type or modify query</div>\n  <div class=\"entry-json\">{{ source | json }}</div>\n  <textarea #text [value]=\"query | json\" (input)=\"data = undefined\"></textarea>\n  <div class=\"submit\"><button (click)=\"executeQuery(text)\">Execute query</button></div>\n</div>\n\n<div *ngIf=\"data\" class=\"result-json\">{{ data | json }}</div>\n",
            styles: [".result-json{border:1px solid #633;background-color:#fefefe;border-radius:5px;box-sizing:border-box;display:block;max-height:222px;min-height:222px;overflow-y:auto;position:relative;font-family:monospace;float:left;padding:5px;unicode-bidi:embed;width:100%;white-space:pre-wrap}.entry .entry-json{border:1px solid #633;background-color:#fefefe;box-sizing:border-box;display:block;max-height:222px;min-height:222px;overflow-y:auto;position:relative;font-family:monospace;float:left;padding:5px;unicode-bidi:embed;width:50%;white-space:pre-wrap;border-radius:0 0 0 5px}.entry textarea{width:50%;min-height:222px;max-height:222px;resize:none;box-sizing:border-box;padding:5px;border-radius:0 0 5px}.entry .entry-label{width:50%;font-weight:700;padding:5px;background-color:#888;color:#fff;float:left;box-sizing:border-box}.entry .submit{text-align:center;padding-bottom:5px}.entry .submit button{padding:5px 35px}"]
        })
    ], WizardQueryComponent);
    return WizardQueryComponent;
}());
export { WizardQueryComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLXF1ZXJ5LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZWRlaC93aXphcmQtcXVlcnkvIiwic291cmNlcyI6WyJzcmMvYXBwL3dpemFyZC1xdWVyeS93aXphcmQtcXVlcnkuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVqRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQU81RDtJQWlDRSw4QkFBb0IsWUFBZ0M7UUFBaEMsaUJBQVksR0FBWixZQUFZLENBQW9CO0lBQ3BELENBQUM7SUExQkQsc0JBQUksMkNBQVM7YUFBYixVQUFjLElBQVM7WUFEdkIsaUJBd0JDO1lBdEJDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2xCLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDZCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNwRixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQztvQkFDNUIsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtvQkFDakIsSUFBSSxFQUFFLEVBQUU7aUJBQ1QsQ0FBQyxDQUFDLFNBQVMsQ0FDVixVQUFDLE9BQU87b0JBQ04sSUFBRyxPQUFPLEVBQUU7d0JBQ1YsS0FBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUM7d0JBQ3RCLEtBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO3FCQUN2QjtnQkFDSCxDQUFDLEVBQ0QsVUFBQyxLQUFLO29CQUNKLEtBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO29CQUNwQixLQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztnQkFDeEIsQ0FBQyxDQUNGLENBQUM7YUFDSDtpQkFBTTtnQkFDTCxJQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztnQkFDdEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7YUFDekI7UUFDSCxDQUFDOzs7T0FBQTtJQUtPLDZDQUFjLEdBQXRCLFVBQXVCLE9BQVk7UUFBbkMsaUJBa0JDO1FBakJDLElBQUksT0FBTyxZQUFZLEtBQUssRUFBRTtZQUM1QixPQUFPLENBQUMsR0FBRyxDQUNULFVBQUMsSUFBSTtnQkFDSCxLQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzVCLENBQUMsQ0FDRixDQUFBO1NBQ0Y7YUFBTSxJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBRTtZQUN0QyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FDdEIsVUFBQyxHQUFHO2dCQUNGLElBQUksR0FBRyxLQUFLLFNBQVMsRUFBRTtvQkFDckIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksUUFBUSxDQUFDLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7aUJBQ2pFO3FCQUFNO29CQUNMLEtBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7aUJBQ25DO1lBQ0gsQ0FBQyxDQUNGLENBQUM7U0FDSDtJQUNILENBQUM7SUFFRCwyQ0FBWSxHQUFaLFVBQWEsSUFBUztRQUF0QixpQkE4QkM7UUE3QkMsSUFBSTtZQUNGLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUE7WUFDNUIsSUFBSSxPQUFPLFlBQVksS0FBSyxFQUFFO2dCQUM1QixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQzlDLFVBQUMsT0FBTztvQkFDTixJQUFHLE9BQU8sRUFBRTt3QkFDVixLQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztxQkFDckI7Z0JBQ0gsQ0FBQyxFQUNELFVBQUMsS0FBSztvQkFDSixLQUFJLENBQUMsSUFBSSxHQUFHLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBQyxDQUFDO2dCQUM3QixDQUFDLENBQ0YsQ0FBQzthQUNIO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FDOUMsVUFBQyxPQUFPO29CQUNOLElBQUcsT0FBTyxFQUFFO3dCQUNWLEtBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO3FCQUNyQjtnQkFDSCxDQUFDLEVBQ0QsVUFBQyxLQUFLO29CQUNKLEtBQUksQ0FBQyxJQUFJLEdBQUcsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUM7Z0JBQzdCLENBQUMsQ0FDRixDQUFDO2FBQ0g7U0FDRjtRQUFBLE9BQU8sR0FBRyxFQUFFO1lBQ1gsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsT0FBTyxFQUFDLENBQUM7U0FDbEM7SUFDSCxDQUFDOztnQkFyRGlDLGtCQUFrQjs7SUF6QnBEO1FBREMsS0FBSyxFQUFFO3lEQXdCUDtJQS9CVSxvQkFBb0I7UUFMaEMsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLGNBQWM7WUFDeEIsMGVBQWtDOztTQUVuQyxDQUFDO09BQ1csb0JBQW9CLENBdUZoQztJQUFELDJCQUFDO0NBQUEsQUF2RkQsSUF1RkM7U0F2Rlksb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBXaXphcmRRdWVyeVNlcnZpY2UgfSBmcm9tICcuL3dpemFyZC1xdWVyeS5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnd2l6YXJkLXF1ZXJ5JyxcbiAgdGVtcGxhdGVVcmw6ICcuL3dpemFyZC1xdWVyeS5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vd2l6YXJkLXF1ZXJ5LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBXaXphcmRRdWVyeUNvbXBvbmVudCB7XG4gIHNlbGVjdGVkRG9jdW1lbnROYW1lOiBzdHJpbmc7XG5cbiAgZGF0YTogYW55O1xuICBzb3VyY2U6IGFueTtcbiAgcXVlcnk6IGFueTtcbiAgXG4gIEBJbnB1dCgpXG4gIHNldCBxdWVyeUluZm8oZGF0YTogYW55KSB7XG4gICAgdGhpcy5xdWVyeSA9IGRhdGE7XG4gICAgaWYgKHRoaXMucXVlcnkpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWREb2N1bWVudE5hbWUgPSB0aGlzLnF1ZXJ5LmluLnN1YnN0cmluZyh0aGlzLnF1ZXJ5LmluLmxhc3RJbmRleE9mKCcvJykpO1xuICAgICAgdGhpcy5xdWVyeVNlcnZpY2UuY2hhaW5TZWxlY3Qoe1xuICAgICAgICBpbjogdGhpcy5xdWVyeS5pbixcbiAgICAgICAgcGF0aDogJydcbiAgICAgIH0pLnN1YnNjcmliZShcbiAgICAgICAgKHN1Y2Nlc3MpID0+IHtcbiAgICAgICAgICBpZihzdWNjZXNzKSB7XG4gICAgICAgICAgICB0aGlzLnNvdXJjZSA9IHN1Y2Nlc3M7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAoZXJyb3IpID0+IHtcbiAgICAgICAgICB0aGlzLnNvdXJjZSA9IGVycm9yO1xuICAgICAgICAgIHRoaXMuZGF0YSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kYXRhID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5zb3VyY2UgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBxdWVyeVNlcnZpY2U6IFdpemFyZFF1ZXJ5U2VydmljZSkge1xuICB9XG5cbiAgcHJpdmF0ZSBwYXJzZUZ1bmN0aW9ucyhjb250ZW50OiBhbnkpIHtcbiAgICBpZiAoY29udGVudCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICBjb250ZW50Lm1hcChcbiAgICAgICAgKGl0ZW0pID0+IHtcbiAgICAgICAgICB0aGlzLnBhcnNlRnVuY3Rpb25zKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICApXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgY29udGVudCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIE9iamVjdC5rZXlzKGNvbnRlbnQpLm1hcChcbiAgICAgICAgKGtleSkgPT4ge1xuICAgICAgICAgIGlmIChrZXkgPT09ICdoYW5kbGVyJykge1xuICAgICAgICAgICAgY29udGVudFtrZXldID0gbmV3IEZ1bmN0aW9uKCdyZXR1cm4gZnVuY3Rpb24nICsgY29udGVudFtrZXldKSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnBhcnNlRnVuY3Rpb25zKGNvbnRlbnRba2V5XSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGV4ZWN1dGVRdWVyeSh0ZXh0OiBhbnkpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgY29udGVudCA9IEpTT04ucGFyc2UodGV4dC52YWx1ZSk7XG4gICAgICB0aGlzLnBhcnNlRnVuY3Rpb25zKGNvbnRlbnQpXG4gICAgICBpZiAoY29udGVudCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIHRoaXMucXVlcnlTZXJ2aWNlLmFycmF5U2VsZWN0KGNvbnRlbnQpLnN1YnNjcmliZShcbiAgICAgICAgICAoc3VjY2VzcykgPT4ge1xuICAgICAgICAgICAgaWYoc3VjY2Vzcykge1xuICAgICAgICAgICAgICB0aGlzLmRhdGEgPSBzdWNjZXNzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgKGVycm9yKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSB7YWxlcnQ6IGVycm9yfTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnF1ZXJ5U2VydmljZS5jaGFpblNlbGVjdChjb250ZW50KS5zdWJzY3JpYmUoXG4gICAgICAgICAgKHN1Y2Nlc3MpID0+IHtcbiAgICAgICAgICAgIGlmKHN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgdGhpcy5kYXRhID0gc3VjY2VzcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgdGhpcy5kYXRhID0ge2FsZXJ0OiBlcnJvcn07XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1jYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLmRhdGEgPSB7YWxlcnQ6IGVyci5tZXNzYWdlfTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==