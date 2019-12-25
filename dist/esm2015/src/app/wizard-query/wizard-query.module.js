import * as tslib_1 from "tslib";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { WizardQueryComponent } from './wizard-query.component';
import { WizardQueryService } from './wizard-query.service';
import { WizardQueryDirective } from './wizard-query.directive';
let WizardQueryModule = class WizardQueryModule {
};
WizardQueryModule = tslib_1.__decorate([
    NgModule({
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
    })
], WizardQueryModule);
export { WizardQueryModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLXF1ZXJ5Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZWRlaC93aXphcmQtcXVlcnkvIiwic291cmNlcyI6WyJzcmMvYXBwL3dpemFyZC1xdWVyeS93aXphcmQtcXVlcnkubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLHNCQUFzQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2pFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUV4RCxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNoRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUM1RCxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQXFCaEUsSUFBYSxpQkFBaUIsR0FBOUIsTUFBYSxpQkFBaUI7Q0FBRyxDQUFBO0FBQXBCLGlCQUFpQjtJQWxCN0IsUUFBUSxDQUFDO1FBQ1IsWUFBWSxFQUFFO1lBQ1osb0JBQW9CO1lBQ3BCLG9CQUFvQjtTQUNyQjtRQUNELE9BQU8sRUFBRTtZQUNQLG9CQUFvQjtZQUNwQixvQkFBb0I7U0FDckI7UUFDRCxPQUFPLEVBQUU7WUFDUCxZQUFZO1lBQ1osZ0JBQWdCO1NBQ2pCO1FBQ0QsU0FBUyxFQUFFO1lBQ1Qsa0JBQWtCO1NBQ25CO1FBQ0QsT0FBTyxFQUFFLENBQUMsc0JBQXNCLENBQUM7S0FDbEMsQ0FBQztHQUNXLGlCQUFpQixDQUFHO1NBQXBCLGlCQUFpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBDVVNUT01fRUxFTUVOVFNfU0NIRU1BIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgSHR0cENsaWVudE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcblxuaW1wb3J0IHsgV2l6YXJkUXVlcnlDb21wb25lbnQgfSBmcm9tICcuL3dpemFyZC1xdWVyeS5jb21wb25lbnQnO1xuaW1wb3J0IHsgV2l6YXJkUXVlcnlTZXJ2aWNlIH0gZnJvbSAnLi93aXphcmQtcXVlcnkuc2VydmljZSc7XG5pbXBvcnQgeyBXaXphcmRRdWVyeURpcmVjdGl2ZSB9IGZyb20gJy4vd2l6YXJkLXF1ZXJ5LmRpcmVjdGl2ZSc7XG5cblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgV2l6YXJkUXVlcnlDb21wb25lbnQsXG4gICAgV2l6YXJkUXVlcnlEaXJlY3RpdmVcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIFdpemFyZFF1ZXJ5Q29tcG9uZW50LFxuICAgIFdpemFyZFF1ZXJ5RGlyZWN0aXZlXG4gIF0sXG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGUsXG4gICAgSHR0cENsaWVudE1vZHVsZVxuICBdLFxuICBwcm92aWRlcnM6IFtcbiAgICBXaXphcmRRdWVyeVNlcnZpY2VcbiAgXSxcbiAgc2NoZW1hczogW0NVU1RPTV9FTEVNRU5UU19TQ0hFTUFdXG59KVxuZXhwb3J0IGNsYXNzIFdpemFyZFF1ZXJ5TW9kdWxlIHt9XG4iXX0=