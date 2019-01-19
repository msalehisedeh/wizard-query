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
                    content[key] = new Function('return function' + content[key])();
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLXF1ZXJ5LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZWRlaC93aXphcmQtcXVlcnkvIiwic291cmNlcyI6WyJzcmMvYXBwL3dpemFyZC1xdWVyeS93aXphcmQtcXVlcnkuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVqRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQU81RCxNQUFNOzs7O0lBaUNKLFlBQW9CLFlBQWdDO1FBQWhDLGlCQUFZLEdBQVosWUFBWSxDQUFvQjtLQUNuRDs7Ozs7SUEzQkQsSUFDSSxTQUFTLENBQUMsSUFBUztRQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNsQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNmLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDcEYsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUM7Z0JBQzVCLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ2pCLElBQUksRUFBRSxFQUFFO2FBQ1QsQ0FBQyxDQUFDLFNBQVMsQ0FDVixDQUFDLE9BQU8sRUFBRSxFQUFFO2dCQUNWLEVBQUUsQ0FBQSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ1gsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUM7b0JBQ3RCLElBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO2lCQUN2QjthQUNGLEVBQ0QsQ0FBQyxLQUFLLEVBQUUsRUFBRTtnQkFDUixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztnQkFDcEIsSUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7YUFDdkIsQ0FDRixDQUFDO1NBQ0g7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO1NBQ3pCO0tBQ0Y7Ozs7O0lBS08sY0FBYyxDQUFDLE9BQVk7UUFDakMsRUFBRSxDQUFDLENBQUMsT0FBTyxZQUFZLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDN0IsT0FBTyxDQUFDLEdBQUcsQ0FDVCxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUNQLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDM0IsQ0FDRixDQUFBO1NBQ0Y7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxPQUFPLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN2QyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FDdEIsQ0FBQyxHQUFHLEVBQUUsRUFBRTtnQkFDTixFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDdEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksUUFBUSxDQUFDLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7aUJBQ2pFO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7aUJBQ25DO2FBQ0YsQ0FDRixDQUFDO1NBQ0g7Ozs7OztJQUdILFlBQVksQ0FBQyxJQUFTO1FBQ3BCLElBQUksQ0FBQzs7WUFDSCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN2QyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQzVCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQzlDLENBQUMsT0FBTyxFQUFFLEVBQUU7b0JBQ1YsRUFBRSxDQUFBLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzt3QkFDWCxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztxQkFDckI7aUJBQ0YsRUFDRCxDQUFDLEtBQUssRUFBRSxFQUFFO29CQUNSLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUM7aUJBQzVCLENBQ0YsQ0FBQzthQUNIO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUM5QyxDQUFDLE9BQU8sRUFBRSxFQUFFO29CQUNWLEVBQUUsQ0FBQSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7d0JBQ1gsSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7cUJBQ3JCO2lCQUNGLEVBQ0QsQ0FBQyxLQUFLLEVBQUUsRUFBRTtvQkFDUixJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBQyxDQUFDO2lCQUM1QixDQUNGLENBQUM7YUFDSDtTQUNGO1FBQUEsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDWixJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxPQUFPLEVBQUMsQ0FBQztTQUNsQztLQUNGOzs7WUEzRkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxjQUFjO2dCQUN4QiwwZUFBa0M7O2FBRW5DOzs7O1lBTlEsa0JBQWtCOzs7d0JBY3hCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IFdpemFyZFF1ZXJ5U2VydmljZSB9IGZyb20gJy4vd2l6YXJkLXF1ZXJ5LnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd3aXphcmQtcXVlcnknLFxuICB0ZW1wbGF0ZVVybDogJy4vd2l6YXJkLXF1ZXJ5Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi93aXphcmQtcXVlcnkuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIFdpemFyZFF1ZXJ5Q29tcG9uZW50IHtcbiAgc2VsZWN0ZWREb2N1bWVudE5hbWU6IHN0cmluZztcblxuICBkYXRhOiBhbnk7XG4gIHNvdXJjZTogYW55O1xuICBxdWVyeTogYW55O1xuICBcbiAgQElucHV0KClcbiAgc2V0IHF1ZXJ5SW5mbyhkYXRhOiBhbnkpIHtcbiAgICB0aGlzLnF1ZXJ5ID0gZGF0YTtcbiAgICBpZiAodGhpcy5xdWVyeSkge1xuICAgICAgdGhpcy5zZWxlY3RlZERvY3VtZW50TmFtZSA9IHRoaXMucXVlcnkuaW4uc3Vic3RyaW5nKHRoaXMucXVlcnkuaW4ubGFzdEluZGV4T2YoJy8nKSk7XG4gICAgICB0aGlzLnF1ZXJ5U2VydmljZS5jaGFpblNlbGVjdCh7XG4gICAgICAgIGluOiB0aGlzLnF1ZXJ5LmluLFxuICAgICAgICBwYXRoOiAnJ1xuICAgICAgfSkuc3Vic2NyaWJlKFxuICAgICAgICAoc3VjY2VzcykgPT4ge1xuICAgICAgICAgIGlmKHN1Y2Nlc3MpIHtcbiAgICAgICAgICAgIHRoaXMuc291cmNlID0gc3VjY2VzcztcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIChlcnJvcikgPT4ge1xuICAgICAgICAgIHRoaXMuc291cmNlID0gZXJyb3I7XG4gICAgICAgICAgdGhpcy5kYXRhID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRhdGEgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLnNvdXJjZSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHF1ZXJ5U2VydmljZTogV2l6YXJkUXVlcnlTZXJ2aWNlKSB7XG4gIH1cblxuICBwcml2YXRlIHBhcnNlRnVuY3Rpb25zKGNvbnRlbnQ6IGFueSkge1xuICAgIGlmIChjb250ZW50IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIGNvbnRlbnQubWFwKFxuICAgICAgICAoaXRlbSkgPT4ge1xuICAgICAgICAgIHRoaXMucGFyc2VGdW5jdGlvbnMoaXRlbSk7XG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb250ZW50ID09PSAnb2JqZWN0Jykge1xuICAgICAgT2JqZWN0LmtleXMoY29udGVudCkubWFwKFxuICAgICAgICAoa2V5KSA9PiB7XG4gICAgICAgICAgaWYgKGtleSA9PT0gJ2hhbmRsZXInKSB7XG4gICAgICAgICAgICBjb250ZW50W2tleV0gPSBuZXcgRnVuY3Rpb24oJ3JldHVybiBmdW5jdGlvbicgKyBjb250ZW50W2tleV0pKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucGFyc2VGdW5jdGlvbnMoY29udGVudFtrZXldKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgZXhlY3V0ZVF1ZXJ5KHRleHQ6IGFueSkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBjb250ZW50ID0gSlNPTi5wYXJzZSh0ZXh0LnZhbHVlKTtcbiAgICAgIHRoaXMucGFyc2VGdW5jdGlvbnMoY29udGVudClcbiAgICAgIGlmIChjb250ZW50IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgdGhpcy5xdWVyeVNlcnZpY2UuYXJyYXlTZWxlY3QoY29udGVudCkuc3Vic2NyaWJlKFxuICAgICAgICAgIChzdWNjZXNzKSA9PiB7XG4gICAgICAgICAgICBpZihzdWNjZXNzKSB7XG4gICAgICAgICAgICAgIHRoaXMuZGF0YSA9IHN1Y2Nlc3M7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IHthbGVydDogZXJyb3J9O1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucXVlcnlTZXJ2aWNlLmNoYWluU2VsZWN0KGNvbnRlbnQpLnN1YnNjcmliZShcbiAgICAgICAgICAoc3VjY2VzcykgPT4ge1xuICAgICAgICAgICAgaWYoc3VjY2Vzcykge1xuICAgICAgICAgICAgICB0aGlzLmRhdGEgPSBzdWNjZXNzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgKGVycm9yKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSB7YWxlcnQ6IGVycm9yfTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfWNhdGNoIChlcnIpIHtcbiAgICAgIHRoaXMuZGF0YSA9IHthbGVydDogZXJyLm1lc3NhZ2V9O1xuICAgIH1cbiAgfVxufVxuIl19