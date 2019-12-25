import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { WizardQueryModule } from './wizard-query/wizard-query.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    WizardQueryModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
