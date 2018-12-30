/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input } from '@angular/core';
import { WizardQueryService } from './wizard-query.service';
export class WizardQueryComponent {
    /**
     * @param {?} queryService
     */
    constructor(queryService) {
        this.queryService = queryService;
    }
    /**
     * @param {?} data
     * @return {?}
     */
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
    /**
     * @param {?} content
     * @return {?}
     */
    parseFunctions(content) {
        if (content instanceof Array) {
            content.map((item) => {
                this.parseFunctions(item);
            });
        }
        else if (typeof content === 'object') {
            Object.keys(content).map((key) => {
                if (key === 'handler') {
                    content[key] = new Function(content[key])();
                }
                else {
                    this.parseFunctions(content[key]);
                }
            });
        }
    }
    /**
     * @param {?} text
     * @return {?}
     */
    executeQuery(text) {
        try {
            /** @type {?} */
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
}
WizardQueryComponent.decorators = [
    { type: Component, args: [{
                selector: 'wizard-query',
                template: "\n<div class=\"entry\" *ngIf=\"source\">\n  <div class=\"entry-label\">Source: {{selectedDocumentName}}</div>\n  <div class=\"entry-label\">Type or modify query</div>\n  <div class=\"entry-json\">{{ source | json }}</div>\n  <textarea #text [value]=\"query | json\" (input)=\"data = undefined\"></textarea>\n  <div class=\"submit\"><button (click)=\"executeQuery(text)\">Execute query</button></div>\n</div>\n\n<div *ngIf=\"data\" class=\"result-json\">{{ data | json }}</div>\n",
                styles: [".result-json{border:1px solid #633;background-color:#fefefe;border-radius:5px;box-sizing:border-box;display:block;max-height:222px;min-height:222px;overflow-y:auto;position:relative;font-family:monospace;float:left;padding:5px;unicode-bidi:embed;width:100%;white-space:pre-wrap}.entry .entry-json{border:1px solid #633;background-color:#fefefe;box-sizing:border-box;display:block;max-height:222px;min-height:222px;overflow-y:auto;position:relative;font-family:monospace;float:left;padding:5px;unicode-bidi:embed;width:50%;white-space:pre-wrap;border-radius:0 0 0 5px}.entry textarea{width:50%;min-height:222px;max-height:222px;resize:none;box-sizing:border-box;padding:5px;border-radius:0 0 5px}.entry .entry-label{width:50%;font-weight:700;padding:5px;background-color:#888;color:#fff;float:left;box-sizing:border-box}.entry .submit{text-align:center;padding-bottom:5px}.entry .submit button{padding:5px 35px}"]
            }] }
];
/** @nocollapse */
WizardQueryComponent.ctorParameters = () => [
    { type: WizardQueryService }
];
WizardQueryComponent.propDecorators = {
    queryInfo: [{ type: Input }]
};
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLXF1ZXJ5LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3dpemFyZC1xdWVyeS8iLCJzb3VyY2VzIjpbInNyYy9hcHAvd2l6YXJkLXF1ZXJ5L3dpemFyZC1xdWVyeS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRWpELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBTzVELE1BQU07Ozs7SUFpQ0osWUFBb0IsWUFBZ0M7UUFBaEMsaUJBQVksR0FBWixZQUFZLENBQW9CO0tBQ25EOzs7OztJQTNCRCxJQUNJLFNBQVMsQ0FBQyxJQUFTO1FBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNwRixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQztnQkFDNUIsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDakIsSUFBSSxFQUFFLEVBQUU7YUFDVCxDQUFDLENBQUMsU0FBUyxDQUNWLENBQUMsT0FBTyxFQUFFLEVBQUU7Z0JBQ1YsRUFBRSxDQUFBLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDWCxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQztvQkFDdEIsSUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7aUJBQ3ZCO2FBQ0YsRUFDRCxDQUFDLEtBQUssRUFBRSxFQUFFO2dCQUNSLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO2dCQUNwQixJQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQzthQUN2QixDQUNGLENBQUM7U0FDSDtRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7WUFDdEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7U0FDekI7S0FDRjs7Ozs7SUFLTyxjQUFjLENBQUMsT0FBWTtRQUNqQyxFQUFFLENBQUMsQ0FBQyxPQUFPLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQztZQUM3QixPQUFPLENBQUMsR0FBRyxDQUNULENBQUMsSUFBSSxFQUFFLEVBQUU7Z0JBQ1AsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUMzQixDQUNGLENBQUE7U0FDRjtRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLE9BQU8sS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUN0QixDQUFDLEdBQUcsRUFBRSxFQUFFO2dCQUNOLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUN0QixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQztpQkFDN0M7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUUsQ0FBQTtpQkFDbkM7YUFDRixDQUNGLENBQUM7U0FDSDs7Ozs7O0lBR0gsWUFBWSxDQUFDLElBQVM7UUFDcEIsSUFBSSxDQUFDOztZQUNILE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUE7WUFDNUIsRUFBRSxDQUFDLENBQUMsT0FBTyxZQUFZLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQzdCLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FDOUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtvQkFDVixFQUFFLENBQUEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO3dCQUNYLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO3FCQUNyQjtpQkFDRixFQUNELENBQUMsS0FBSyxFQUFFLEVBQUU7b0JBQ1IsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUMsQ0FBQztpQkFDNUIsQ0FDRixDQUFDO2FBQ0g7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQzlDLENBQUMsT0FBTyxFQUFFLEVBQUU7b0JBQ1YsRUFBRSxDQUFBLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzt3QkFDWCxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztxQkFDckI7aUJBQ0YsRUFDRCxDQUFDLEtBQUssRUFBRSxFQUFFO29CQUNSLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUM7aUJBQzVCLENBQ0YsQ0FBQzthQUNIO1NBQ0Y7UUFBQSxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNaLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLE9BQU8sRUFBQyxDQUFDO1NBQ2xDO0tBQ0Y7OztZQTNGRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGNBQWM7Z0JBQ3hCLDBlQUFrQzs7YUFFbkM7Ozs7WUFOUSxrQkFBa0I7Ozt3QkFjeEIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgV2l6YXJkUXVlcnlTZXJ2aWNlIH0gZnJvbSAnLi93aXphcmQtcXVlcnkuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3dpemFyZC1xdWVyeScsXG4gIHRlbXBsYXRlVXJsOiAnLi93aXphcmQtcXVlcnkuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3dpemFyZC1xdWVyeS5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgV2l6YXJkUXVlcnlDb21wb25lbnQge1xuICBzZWxlY3RlZERvY3VtZW50TmFtZTogc3RyaW5nO1xuXG4gIGRhdGE6IGFueTtcbiAgc291cmNlOiBhbnk7XG4gIHF1ZXJ5OiBhbnk7XG4gIFxuICBASW5wdXQoKVxuICBzZXQgcXVlcnlJbmZvKGRhdGE6IGFueSkge1xuICAgIHRoaXMucXVlcnkgPSBkYXRhO1xuICAgIGlmICh0aGlzLnF1ZXJ5KSB7XG4gICAgICB0aGlzLnNlbGVjdGVkRG9jdW1lbnROYW1lID0gdGhpcy5xdWVyeS5pbi5zdWJzdHJpbmcodGhpcy5xdWVyeS5pbi5sYXN0SW5kZXhPZignLycpKTtcbiAgICAgIHRoaXMucXVlcnlTZXJ2aWNlLmNoYWluU2VsZWN0KHtcbiAgICAgICAgaW46IHRoaXMucXVlcnkuaW4sXG4gICAgICAgIHBhdGg6ICcnXG4gICAgICB9KS5zdWJzY3JpYmUoXG4gICAgICAgIChzdWNjZXNzKSA9PiB7XG4gICAgICAgICAgaWYoc3VjY2Vzcykge1xuICAgICAgICAgICAgdGhpcy5zb3VyY2UgPSBzdWNjZXNzO1xuICAgICAgICAgICAgdGhpcy5kYXRhID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgKGVycm9yKSA9PiB7XG4gICAgICAgICAgdGhpcy5zb3VyY2UgPSBlcnJvcjtcbiAgICAgICAgICB0aGlzLmRhdGEgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGF0YSA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuc291cmNlID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcXVlcnlTZXJ2aWNlOiBXaXphcmRRdWVyeVNlcnZpY2UpIHtcbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VGdW5jdGlvbnMoY29udGVudDogYW55KSB7XG4gICAgaWYgKGNvbnRlbnQgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgY29udGVudC5tYXAoXG4gICAgICAgIChpdGVtKSA9PiB7XG4gICAgICAgICAgdGhpcy5wYXJzZUZ1bmN0aW9ucyhpdGVtKTtcbiAgICAgICAgfVxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbnRlbnQgPT09ICdvYmplY3QnKSB7XG4gICAgICBPYmplY3Qua2V5cyhjb250ZW50KS5tYXAoXG4gICAgICAgIChrZXkpID0+IHtcbiAgICAgICAgICBpZiAoa2V5ID09PSAnaGFuZGxlcicpIHtcbiAgICAgICAgICAgIGNvbnRlbnRba2V5XSA9IG5ldyBGdW5jdGlvbihjb250ZW50W2tleV0pKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucGFyc2VGdW5jdGlvbnMoY29udGVudFtrZXldIClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgZXhlY3V0ZVF1ZXJ5KHRleHQ6IGFueSkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBjb250ZW50ID0gSlNPTi5wYXJzZSh0ZXh0LnZhbHVlKTtcbiAgICAgIHRoaXMucGFyc2VGdW5jdGlvbnMoY29udGVudClcbiAgICAgIGlmIChjb250ZW50IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgdGhpcy5xdWVyeVNlcnZpY2UuYXJyYXlTZWxlY3QoY29udGVudCkuc3Vic2NyaWJlKFxuICAgICAgICAgIChzdWNjZXNzKSA9PiB7XG4gICAgICAgICAgICBpZihzdWNjZXNzKSB7XG4gICAgICAgICAgICAgIHRoaXMuZGF0YSA9IHN1Y2Nlc3M7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IHthbGVydDogZXJyb3J9O1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucXVlcnlTZXJ2aWNlLmNoYWluU2VsZWN0KGNvbnRlbnQpLnN1YnNjcmliZShcbiAgICAgICAgICAoc3VjY2VzcykgPT4ge1xuICAgICAgICAgICAgaWYoc3VjY2Vzcykge1xuICAgICAgICAgICAgICB0aGlzLmRhdGEgPSBzdWNjZXNzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgKGVycm9yKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSB7YWxlcnQ6IGVycm9yfTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfWNhdGNoIChlcnIpIHtcbiAgICAgIHRoaXMuZGF0YSA9IHthbGVydDogZXJyLm1lc3NhZ2V9O1xuICAgIH1cbiAgfVxufVxuIl19