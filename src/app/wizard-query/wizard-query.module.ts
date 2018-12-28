import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { WizardQueryComponent } from './wizard-query.component';
import { WizardQueryService } from './wizard-query.service';
import { WizardQueryDirective } from './wizard-query.directive';


@NgModule({
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
export class WizardQueryModule { }
