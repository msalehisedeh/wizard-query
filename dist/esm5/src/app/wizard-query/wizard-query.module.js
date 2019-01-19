/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { WizardQueryComponent } from './wizard-query.component';
import { WizardQueryService } from './wizard-query.service';
import { WizardQueryDirective } from './wizard-query.directive';
var WizardQueryModule = /** @class */ (function () {
    function WizardQueryModule() {
    }
    WizardQueryModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        WizardQueryComponent,
                        WizardQueryDirective
                    ],
                    exports: [
                        WizardQueryComponent,
                        WizardQueryDirective
                    ],
                    imports: [
                        CommonModule,
                        HttpClientModule
                    ],
                    providers: [
                        WizardQueryService
                    ],
                    schemas: [CUSTOM_ELEMENTS_SCHEMA]
                },] }
    ];
    return WizardQueryModule;
}());
export { WizardQueryModule };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLXF1ZXJ5Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZWRlaC93aXphcmQtcXVlcnkvIiwic291cmNlcyI6WyJzcmMvYXBwL3dpemFyZC1xdWVyeS93aXphcmQtcXVlcnkubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLHNCQUFzQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2pFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUV4RCxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNoRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUM1RCxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQzs7Ozs7Z0JBRy9ELFFBQVEsU0FBQztvQkFDUixZQUFZLEVBQUU7d0JBQ1osb0JBQW9CO3dCQUNwQixvQkFBb0I7cUJBQ3JCO29CQUNELE9BQU8sRUFBRTt3QkFDUCxvQkFBb0I7d0JBQ3BCLG9CQUFvQjtxQkFDckI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLFlBQVk7d0JBQ1osZ0JBQWdCO3FCQUNqQjtvQkFDRCxTQUFTLEVBQUU7d0JBQ1Qsa0JBQWtCO3FCQUNuQjtvQkFDRCxPQUFPLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQztpQkFDbEM7OzRCQTFCRDs7U0EyQmEsaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIENVU1RPTV9FTEVNRU5UU19TQ0hFTUEgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBIdHRwQ2xpZW50TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuXG5pbXBvcnQgeyBXaXphcmRRdWVyeUNvbXBvbmVudCB9IGZyb20gJy4vd2l6YXJkLXF1ZXJ5LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBXaXphcmRRdWVyeVNlcnZpY2UgfSBmcm9tICcuL3dpemFyZC1xdWVyeS5zZXJ2aWNlJztcbmltcG9ydCB7IFdpemFyZFF1ZXJ5RGlyZWN0aXZlIH0gZnJvbSAnLi93aXphcmQtcXVlcnkuZGlyZWN0aXZlJztcblxuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBXaXphcmRRdWVyeUNvbXBvbmVudCxcbiAgICBXaXphcmRRdWVyeURpcmVjdGl2ZVxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgV2l6YXJkUXVlcnlDb21wb25lbnQsXG4gICAgV2l6YXJkUXVlcnlEaXJlY3RpdmVcbiAgXSxcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZSxcbiAgICBIdHRwQ2xpZW50TW9kdWxlXG4gIF0sXG4gIHByb3ZpZGVyczogW1xuICAgIFdpemFyZFF1ZXJ5U2VydmljZVxuICBdLFxuICBzY2hlbWFzOiBbQ1VTVE9NX0VMRU1FTlRTX1NDSEVNQV1cbn0pXG5leHBvcnQgY2xhc3MgV2l6YXJkUXVlcnlNb2R1bGUgeyB9XG4iXX0=