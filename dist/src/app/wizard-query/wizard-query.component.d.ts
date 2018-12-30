import { WizardQueryService } from './wizard-query.service';
export declare class WizardQueryComponent {
    private queryService;
    selectedDocumentName: string;
    data: any;
    source: any;
    query: any;
    queryInfo: any;
    constructor(queryService: WizardQueryService);
    private parseFunctions(content);
    executeQuery(text: any): void;
}
