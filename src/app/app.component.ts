import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Wizard Query';
  testFiles = [
    {
      label:'Document .xml Extention',
      query: {
        path: "book[@.category=='WEB' && @.price > 30].description[ @.indexOf('linguistic') > 0]",
        in: "http://localhost:4200/assets/sample.xml"
      }
    },
    {
      label:'Document .xml Extention order by',
      query: {
        path: "book[order-by: title.#text ~DES].description",
        in: "http://localhost:4200/assets/sample.xml"
      }
    },
    {
      label:'Document .json Extention',
      query: {
        path: "[@.category =='WEB'][order-by: title.#text ~DES].description",
        in: "http://localhost:4200/assets/sampleJ.json"
      }
    },
    {
      label:'Document .xml Extention Deep Chained content',
      query: {
        path: "market[@.indexOf('books') > 0]",
        in: "http://localhost:4200/assets/market.xml",
        join: {
          "market[@.indexOf('books') > 0]": {
            path: "library",
            in: "",
            join: {
              "library": {
                path: ["author","year"],
                in: ""
              }
            }
          }
        },
      }
    },
    {
      label:'Document .xml Extention Chained content',
      query: {
        path: "info",
        in: "http://localhost:4200/assets/sample2.xml",
        join: {
          info: {
            path: ["ratings.rate[ @ > 3]", "[@.category=='WEB'].description"],
            in: ""
          }
        }
      }
    },
    {
      label:'Document .txt Extention',
      query: {
        path: ["speech","common"],
        in: "http://localhost:4200/assets/sample3.txt"
      }
    },
    {
      label:'Plain text No Extention',
      query: {
        path: ["speech","common"],
        in: "http://localhost:4200/assets/sample4"
      }
    },
    {
      label:'HTML content No Extention',
      query: {
        path: "head.title",
        in: "http://localhost:4200/assets/sample5"
      }
    },
    {
      label:'Document 2 .xml Extention Chained content',
      query: {
        path: [
          'article:Abstract',
          'article:AdditionalPath',
          'article:RelatedToolsPath'
        ],
        in: "http://localhost:4200/assets/article.xml",
        join: {
          'article:AdditionalPath': {
            path: [
              'ref:Title',
              'ref:Links.ref:Link[order-by: ref:LinkText ~ASC]'
            ],
            in: '/assets/'
          },
          'article:RelatedToolsPath': {
            path: [
              'ref:Title',
              'ref:Links.ref:Link[order-by: ref:LinkText ~DES]'
            ],
            in: '/assets/'
          }
        }
      }
    }
  ]

  data: any;

  constructor() {
  }

  selectSample(event) {
    const index = event.target.selectedIndex;
    
    if (index > 0) {
      this.data = this.testFiles[index - 1].query;
    } else {
      this.data = undefined;
    }
  }
}
