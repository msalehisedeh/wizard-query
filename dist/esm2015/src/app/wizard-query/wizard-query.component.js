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
     * @param {?} text
     * @return {?}
     */
    executeQuery(text) {
        /** @type {?} */
        const content = JSON.parse(text.value);
        this.queryService.chainSelect(content).subscribe((success) => {
            if (success) {
                this.data = success;
            }
        }, (error) => {
            this.data = error;
        });
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLXF1ZXJ5LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3dpemFyZC1xdWVyeS8iLCJzb3VyY2VzIjpbInNyYy9hcHAvd2l6YXJkLXF1ZXJ5L3dpemFyZC1xdWVyeS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRWpELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBTzVELE1BQU07Ozs7SUFpQ0osWUFBb0IsWUFBZ0M7UUFBaEMsaUJBQVksR0FBWixZQUFZLENBQW9CO0tBQ25EOzs7OztJQTNCRCxJQUNJLFNBQVMsQ0FBQyxJQUFTO1FBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNwRixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQztnQkFDNUIsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDakIsSUFBSSxFQUFFLEVBQUU7YUFDVCxDQUFDLENBQUMsU0FBUyxDQUNWLENBQUMsT0FBTyxFQUFFLEVBQUU7Z0JBQ1YsRUFBRSxDQUFBLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDWCxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQztvQkFDdEIsSUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7aUJBQ3ZCO2FBQ0YsRUFDRCxDQUFDLEtBQUssRUFBRSxFQUFFO2dCQUNSLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO2dCQUNwQixJQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQzthQUN2QixDQUNGLENBQUM7U0FDSDtRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7WUFDdEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7U0FDekI7S0FDRjs7Ozs7SUFLRCxZQUFZLENBQUMsSUFBUzs7UUFDcEIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUM5QyxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQ1YsRUFBRSxDQUFBLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDWCxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQzthQUNyQjtTQUNGLEVBQ0QsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUNSLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO1NBQ25CLENBQ0YsQ0FBQztLQUNIOzs7WUFyREYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxjQUFjO2dCQUN4QiwwZUFBa0M7O2FBRW5DOzs7O1lBTlEsa0JBQWtCOzs7d0JBY3hCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IFdpemFyZFF1ZXJ5U2VydmljZSB9IGZyb20gJy4vd2l6YXJkLXF1ZXJ5LnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd3aXphcmQtcXVlcnknLFxuICB0ZW1wbGF0ZVVybDogJy4vd2l6YXJkLXF1ZXJ5Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi93aXphcmQtcXVlcnkuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIFdpemFyZFF1ZXJ5Q29tcG9uZW50IHtcbiAgc2VsZWN0ZWREb2N1bWVudE5hbWU6IHN0cmluZztcblxuICBkYXRhOiBhbnk7XG4gIHNvdXJjZTogYW55O1xuICBxdWVyeTogYW55O1xuICBcbiAgQElucHV0KClcbiAgc2V0IHF1ZXJ5SW5mbyhkYXRhOiBhbnkpIHtcbiAgICB0aGlzLnF1ZXJ5ID0gZGF0YTtcbiAgICBpZiAodGhpcy5xdWVyeSkge1xuICAgICAgdGhpcy5zZWxlY3RlZERvY3VtZW50TmFtZSA9IHRoaXMucXVlcnkuaW4uc3Vic3RyaW5nKHRoaXMucXVlcnkuaW4ubGFzdEluZGV4T2YoJy8nKSk7XG4gICAgICB0aGlzLnF1ZXJ5U2VydmljZS5jaGFpblNlbGVjdCh7XG4gICAgICAgIGluOiB0aGlzLnF1ZXJ5LmluLFxuICAgICAgICBwYXRoOiAnJ1xuICAgICAgfSkuc3Vic2NyaWJlKFxuICAgICAgICAoc3VjY2VzcykgPT4ge1xuICAgICAgICAgIGlmKHN1Y2Nlc3MpIHtcbiAgICAgICAgICAgIHRoaXMuc291cmNlID0gc3VjY2VzcztcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIChlcnJvcikgPT4ge1xuICAgICAgICAgIHRoaXMuc291cmNlID0gZXJyb3I7XG4gICAgICAgICAgdGhpcy5kYXRhID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRhdGEgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLnNvdXJjZSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHF1ZXJ5U2VydmljZTogV2l6YXJkUXVlcnlTZXJ2aWNlKSB7XG4gIH1cblxuICBleGVjdXRlUXVlcnkodGV4dDogYW55KSB7XG4gICAgY29uc3QgY29udGVudCA9IEpTT04ucGFyc2UodGV4dC52YWx1ZSk7XG4gICAgdGhpcy5xdWVyeVNlcnZpY2UuY2hhaW5TZWxlY3QoY29udGVudCkuc3Vic2NyaWJlKFxuICAgICAgKHN1Y2Nlc3MpID0+IHtcbiAgICAgICAgaWYoc3VjY2Vzcykge1xuICAgICAgICAgIHRoaXMuZGF0YSA9IHN1Y2Nlc3M7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAoZXJyb3IpID0+IHtcbiAgICAgICAgdGhpcy5kYXRhID0gZXJyb3I7XG4gICAgICB9XG4gICAgKTtcbiAgfVxufVxuIl19