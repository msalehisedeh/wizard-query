import { Component, Input } from '@angular/core';

import { WizardQueryService } from './wizard-query.service';

@Component({
  selector: 'wizard-query',
  templateUrl: './wizard-query.html',
  styleUrls: ['./wizard-query.scss']
})
export class WizardQueryComponent {
  selectedDocumentName: string;

  data: any;
  source: any;
  query: any;
  
  @Input()
  set queryInfo(data: any) {
    this.query = data;
    if (this.query) {
      this.selectedDocumentName = this.query.in.substring(this.query.in.lastIndexOf('/'));
      this.queryService.chainSelect({
        in: this.query.in,
        path: ''
      }).subscribe(
        (success) => {
          if(success) {
            this.source = success;
            this.data = undefined;
          }
        },
        (error) => {
          this.source = error;
          this.data = undefined;
        }
      );
    } else {
      this.data = undefined;
      this.source = undefined;
    }
  }

  constructor(private queryService: WizardQueryService) {
  }

  executeQuery(text: any) {
    const content = JSON.parse(text.value);
    this.queryService.chainSelect(content).subscribe(
      (success) => {
        if(success) {
          this.data = success;
        }
      },
      (error) => {
        this.data = error;
      }
    );
  }
}
