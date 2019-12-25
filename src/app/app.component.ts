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
        in: "http://localhost:4200/assets/sample.xml",
        handler: "(node, path, value) {console.log(node, path, value); return value;}"
      }
    },
    {
      label:'Document .xml Extention order by',
      query: {
        path: "book[order-by: title.#text ~DES].description",
        in: "http://localhost:4200/assets/sample.xml",
        handler: "(node, path, value) {console.log(node, path, value); return value;}"
      }
    },
    {
      label:'Document .json Extention',
      query: {
        path: "[@.category =='WEB'][order-by: title.#text ~DES].description",
        in: "http://localhost:4200/assets/sampleJ.json",
        handler: "(node, path, value) {console.log(node, path, value); return value;}"
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
            handler: "(node, path, value) {console.log(node, path, value); return value;}",
            join: {
              "library": {
                path: ["author","year"],
                in: "",
                handler: "(node, path, value) {console.log(node, path, value); return value;}"
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
        handler: "(node, path, value) {console.log(node, path, value); return value;}",
        join: {
          info: {
            path: ["ratings.rate[ @ > 3]", "[@.category=='WEB'].description"],
            in: "",
            handler: "(node, path, value) {console.log(node, path, value); return value;}"
          }
        }
      }
    },
    {
      label:'Document .txt Extention',
      query: {
        path: ["speech","common"],
        in: "http://localhost:4200/assets/sample3.txt",
        handler: "(node, path, value) {console.log(node, path, value); return value;}"
      }
    },
    {
      label:'Plain text No Extention',
      query: {
        path: ["speech","common"],
        in: "http://localhost:4200/assets/sample4",
        handler: "(node, path, value) {console.log(node, path, value); return value;}"
      }
    },
    {
      label:'HTML content No Extention',
      query: {
        path: "head.title",
        in: "http://localhost:4200/assets/sample5",
        handler: "(node, path, value) {console.log(node, path, value); return value;}"
      }
    },
    {
      label:'Document in .xml  using is_in function',
      query: {
        "path": [
          "books.book[@.category=='WEB'].author[as(@,'authors')]",
          "books.book.year"
        ],
        "in": "http://localhost:4200/assets/mixed",
        "join": {
          "books.book.author": {
            "path": [
              "writers.writer[is_in(@,@.name.fname,'authors')].name.fname",
              "writers.writer[is_in(@,@.name.fname,'authors')].publications"
            ]
          }
        }
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
        handler: "(node, path, value) {console.log(node, path, value); return value;}",
        deepXml: true,
        join: {
          'article:AdditionalPath': {
            path: [
              'ref:Title',
              'ref:Links.ref:Link[order-by: ref:LinkText ~ASC]'
            ],
            in: '/assets/',
            handler: "(node, path, value) {console.log(node, path, value); return value;}"
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
