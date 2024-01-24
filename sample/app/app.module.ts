import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { WizardQueryModule } from '@sedeh/wizard-query';


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
