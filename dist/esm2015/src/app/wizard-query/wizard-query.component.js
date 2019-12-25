import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { WizardQueryService } from './wizard-query.service';
let WizardQueryComponent = class WizardQueryComponent {
    constructor(queryService) {
        this.queryService = queryService;
    }
    set queryInfo(data) {
        this.query = data;
        if (this.query) {
            this.selectedDocumentName = this.query.in.substring(this.query.in.lastIndexOf('/'));
            this.queryService.chainSelect({
                in: this.query.in,
                path: ''
            }).subscribe((success) => {
                if (success) {
                    this.source = success;
                    this.data = undefined;
                }
            }, (error) => {
                this.source = error;
                this.data = undefined;
            });
        }
        else {
            this.data = undefined;
            this.source = undefined;
        }
    }
    parseFunctions(content) {
        if (content instanceof Array) {
            content.map((item) => {
                this.parseFunctions(item);
            });
        }
        else if (typeof content === 'object') {
            Object.keys(content).map((key) => {
                if (key === 'handler') {
                    content[key] = new Function('return function' + content[key])();
                }
                else {
                    this.parseFunctions(content[key]);
                }
            });
        }
    }
    executeQuery(text) {
        try {
            const content = JSON.parse(text.value);
            this.parseFunctions(content);
            if (content instanceof Array) {
                this.queryService.arraySelect(content).subscribe((success) => {
                    if (success) {
                        this.data = success;
                    }
                }, (error) => {
                    this.data = { alert: error };
                });
            }
            else {
                this.queryService.chainSelect(content).subscribe((success) => {
                    if (success) {
                        this.data = success;
                    }
                }, (error) => {
                    this.data = { alert: error };
                });
            }
        }
        catch (err) {
            this.data = { alert: err.message };
        }
    }
};
WizardQueryComponent.ctorParameters = () => [
    { type: WizardQueryService }
];
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
export { WizardQueryComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLXF1ZXJ5LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZWRlaC93aXphcmQtcXVlcnkvIiwic291cmNlcyI6WyJzcmMvYXBwL3dpemFyZC1xdWVyeS93aXphcmQtcXVlcnkuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVqRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQU81RCxJQUFhLG9CQUFvQixHQUFqQyxNQUFhLG9CQUFvQjtJQWlDL0IsWUFBb0IsWUFBZ0M7UUFBaEMsaUJBQVksR0FBWixZQUFZLENBQW9CO0lBQ3BELENBQUM7SUExQkQsSUFBSSxTQUFTLENBQUMsSUFBUztRQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNsQixJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDZCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3BGLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDO2dCQUM1QixFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNqQixJQUFJLEVBQUUsRUFBRTthQUNULENBQUMsQ0FBQyxTQUFTLENBQ1YsQ0FBQyxPQUFPLEVBQUUsRUFBRTtnQkFDVixJQUFHLE9BQU8sRUFBRTtvQkFDVixJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQztvQkFDdEIsSUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7aUJBQ3ZCO1lBQ0gsQ0FBQyxFQUNELENBQUMsS0FBSyxFQUFFLEVBQUU7Z0JBQ1IsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7Z0JBQ3BCLElBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO1lBQ3hCLENBQUMsQ0FDRixDQUFDO1NBQ0g7YUFBTTtZQUNMLElBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO1NBQ3pCO0lBQ0gsQ0FBQztJQUtPLGNBQWMsQ0FBQyxPQUFZO1FBQ2pDLElBQUksT0FBTyxZQUFZLEtBQUssRUFBRTtZQUM1QixPQUFPLENBQUMsR0FBRyxDQUNULENBQUMsSUFBSSxFQUFFLEVBQUU7Z0JBQ1AsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM1QixDQUFDLENBQ0YsQ0FBQTtTQUNGO2FBQU0sSUFBSSxPQUFPLE9BQU8sS0FBSyxRQUFRLEVBQUU7WUFDdEMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQ3RCLENBQUMsR0FBRyxFQUFFLEVBQUU7Z0JBQ04sSUFBSSxHQUFHLEtBQUssU0FBUyxFQUFFO29CQUNyQixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxRQUFRLENBQUMsaUJBQWlCLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQztpQkFDakU7cUJBQU07b0JBQ0wsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztpQkFDbkM7WUFDSCxDQUFDLENBQ0YsQ0FBQztTQUNIO0lBQ0gsQ0FBQztJQUVELFlBQVksQ0FBQyxJQUFTO1FBQ3BCLElBQUk7WUFDRixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN2QyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQzVCLElBQUksT0FBTyxZQUFZLEtBQUssRUFBRTtnQkFDNUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUM5QyxDQUFDLE9BQU8sRUFBRSxFQUFFO29CQUNWLElBQUcsT0FBTyxFQUFFO3dCQUNWLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO3FCQUNyQjtnQkFDSCxDQUFDLEVBQ0QsQ0FBQyxLQUFLLEVBQUUsRUFBRTtvQkFDUixJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBQyxDQUFDO2dCQUM3QixDQUFDLENBQ0YsQ0FBQzthQUNIO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FDOUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtvQkFDVixJQUFHLE9BQU8sRUFBRTt3QkFDVixJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztxQkFDckI7Z0JBQ0gsQ0FBQyxFQUNELENBQUMsS0FBSyxFQUFFLEVBQUU7b0JBQ1IsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUMsQ0FBQztnQkFDN0IsQ0FBQyxDQUNGLENBQUM7YUFDSDtTQUNGO1FBQUEsT0FBTyxHQUFHLEVBQUU7WUFDWCxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxPQUFPLEVBQUMsQ0FBQztTQUNsQztJQUNILENBQUM7Q0FDRixDQUFBOztZQXREbUMsa0JBQWtCOztBQXpCcEQ7SUFEQyxLQUFLLEVBQUU7cURBd0JQO0FBL0JVLG9CQUFvQjtJQUxoQyxTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsY0FBYztRQUN4QiwwZUFBa0M7O0tBRW5DLENBQUM7R0FDVyxvQkFBb0IsQ0F1RmhDO1NBdkZZLG9CQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgV2l6YXJkUXVlcnlTZXJ2aWNlIH0gZnJvbSAnLi93aXphcmQtcXVlcnkuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3dpemFyZC1xdWVyeScsXG4gIHRlbXBsYXRlVXJsOiAnLi93aXphcmQtcXVlcnkuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3dpemFyZC1xdWVyeS5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgV2l6YXJkUXVlcnlDb21wb25lbnQge1xuICBzZWxlY3RlZERvY3VtZW50TmFtZTogc3RyaW5nO1xuXG4gIGRhdGE6IGFueTtcbiAgc291cmNlOiBhbnk7XG4gIHF1ZXJ5OiBhbnk7XG4gIFxuICBASW5wdXQoKVxuICBzZXQgcXVlcnlJbmZvKGRhdGE6IGFueSkge1xuICAgIHRoaXMucXVlcnkgPSBkYXRhO1xuICAgIGlmICh0aGlzLnF1ZXJ5KSB7XG4gICAgICB0aGlzLnNlbGVjdGVkRG9jdW1lbnROYW1lID0gdGhpcy5xdWVyeS5pbi5zdWJzdHJpbmcodGhpcy5xdWVyeS5pbi5sYXN0SW5kZXhPZignLycpKTtcbiAgICAgIHRoaXMucXVlcnlTZXJ2aWNlLmNoYWluU2VsZWN0KHtcbiAgICAgICAgaW46IHRoaXMucXVlcnkuaW4sXG4gICAgICAgIHBhdGg6ICcnXG4gICAgICB9KS5zdWJzY3JpYmUoXG4gICAgICAgIChzdWNjZXNzKSA9PiB7XG4gICAgICAgICAgaWYoc3VjY2Vzcykge1xuICAgICAgICAgICAgdGhpcy5zb3VyY2UgPSBzdWNjZXNzO1xuICAgICAgICAgICAgdGhpcy5kYXRhID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgKGVycm9yKSA9PiB7XG4gICAgICAgICAgdGhpcy5zb3VyY2UgPSBlcnJvcjtcbiAgICAgICAgICB0aGlzLmRhdGEgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGF0YSA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuc291cmNlID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcXVlcnlTZXJ2aWNlOiBXaXphcmRRdWVyeVNlcnZpY2UpIHtcbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VGdW5jdGlvbnMoY29udGVudDogYW55KSB7XG4gICAgaWYgKGNvbnRlbnQgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgY29udGVudC5tYXAoXG4gICAgICAgIChpdGVtKSA9PiB7XG4gICAgICAgICAgdGhpcy5wYXJzZUZ1bmN0aW9ucyhpdGVtKTtcbiAgICAgICAgfVxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbnRlbnQgPT09ICdvYmplY3QnKSB7XG4gICAgICBPYmplY3Qua2V5cyhjb250ZW50KS5tYXAoXG4gICAgICAgIChrZXkpID0+IHtcbiAgICAgICAgICBpZiAoa2V5ID09PSAnaGFuZGxlcicpIHtcbiAgICAgICAgICAgIGNvbnRlbnRba2V5XSA9IG5ldyBGdW5jdGlvbigncmV0dXJuIGZ1bmN0aW9uJyArIGNvbnRlbnRba2V5XSkoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wYXJzZUZ1bmN0aW9ucyhjb250ZW50W2tleV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBleGVjdXRlUXVlcnkodGV4dDogYW55KSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBKU09OLnBhcnNlKHRleHQudmFsdWUpO1xuICAgICAgdGhpcy5wYXJzZUZ1bmN0aW9ucyhjb250ZW50KVxuICAgICAgaWYgKGNvbnRlbnQgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICB0aGlzLnF1ZXJ5U2VydmljZS5hcnJheVNlbGVjdChjb250ZW50KS5zdWJzY3JpYmUoXG4gICAgICAgICAgKHN1Y2Nlc3MpID0+IHtcbiAgICAgICAgICAgIGlmKHN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgdGhpcy5kYXRhID0gc3VjY2VzcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgdGhpcy5kYXRhID0ge2FsZXJ0OiBlcnJvcn07XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5xdWVyeVNlcnZpY2UuY2hhaW5TZWxlY3QoY29udGVudCkuc3Vic2NyaWJlKFxuICAgICAgICAgIChzdWNjZXNzKSA9PiB7XG4gICAgICAgICAgICBpZihzdWNjZXNzKSB7XG4gICAgICAgICAgICAgIHRoaXMuZGF0YSA9IHN1Y2Nlc3M7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IHthbGVydDogZXJyb3J9O1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9Y2F0Y2ggKGVycikge1xuICAgICAgdGhpcy5kYXRhID0ge2FsZXJ0OiBlcnIubWVzc2FnZX07XG4gICAgfVxuICB9XG59XG4iXX0=