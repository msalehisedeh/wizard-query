# Welcome to Wizard Query!

Have you ever been in need of accessing data deeply nested in multitude of files? Have you thought of a tool that can help you dig deep in a chain of files to find what you are looking for? This wizard allows you to just do that.

You can use this wizard to discover content through provided methods to have your application access and use data in the most efficient way. The wizard will automatically parse the target URL into JSON based on its content type. The target could have (XML, HTML, JSON, ...) externsion or no extension at all. You can fetch content of a remote file or a site. To do so, begin with blank `''` as a JSON path of the root page. This will reveal every node in object hierarchy of the target. Look at the content and if you find something you want to get all the times, use its JSON path in your fixed query. If the target node value is pointing to another file, use a join query for the JSON path that resulted the target node with a blank `''` JSON path for it to discover its content and repeat the steps you have followed to find the content you are looking for deeply nested in multitude of files.

**I appreciate comments and ideas to make this tool versatile.**

**NOTE:** Starting with version 1.3.4 all previous versions are deprecated and you need to import this library through @sedeh/wizard-query. Future bug fixes / enhancements will be on @sedeh scope.


[Live Demo](https://stackblitz.com/edit/wizard-query?file=src%2Fapp%2Fapp.component.ts) | 
[NPM](https://www.npmjs.com/package/@sedeh/wizard-query) | 
[Comments/Requests](https://github.com/msalehisedeh/wizard-query/issues)

## Dependencies

```javascript
MODULE: 
	WizardQueryModule

EXPORTS:
  WizardQueryComponent,
  WizardQueryDirective,
  WizardQueryService

DEPENDENCIES: 
    "xmldom": "^0.1.27"
```

## Imports

```javascript
@NgModule({
  declarations: [
    ...
  ],
  imports: [
    ...,
    WizardQueryModule
  ],
  providers: [
	  ...
  ],
  bootstrap: [
	  ...
  ]
})
export class AppModule { }
```

## How to use?
If you do not want to directly use the WizardQueryService, you can use the WizardQueryDirective on any tag and receive the result using onQueryResult event. The wizard service provides the following methods:

| Method     |Description                                                           |
|------------|----------------------------------------------------------------------|
|select      |Use a single path or a list of JSON qualifying paths to access content. |
|arraySelect |This method will invoke select(). But first, requests with similar paths will be merged into one call. This method is useful when paths are dynamically given and it is not clear in advance if there are requests with similar paths. |
|chainSelect |Use a chained set of paths in a JSON object to access data deep in a chain of files. When result of a single query becomes available, the join attribute of query will be examined to see if a key for the JSON path is available. If so, then the URL for the result appends to the 'in' value of the join query. This method is useful when result of a query is a JSON or an XML file and additional query is needed further down in the proceeding files. The handler function and join attributes are optional.|

### Methods and arguments
```javascript
slect(
	path,    // JSON-path (single string or array of paths)
	from,    // URL of the data source
	deepXml, // true/false - if xml content is fetched should the c-data parsed as well?
	clause) // The clause function is optional.

arraySelect(
	[	// array of
		{
			path:    // JSON-path (single string or array of paths)
			in:      // URL of the data source
			deepXml: // true/false - if xml content is fetched should the c-data parsed as well?
		}
	],
	clause: The clause function is optional.
)

// if the select path is a single string, then the join key for it
// should be exactly the same. otherwise, if the select path is an
// array, then the join key for each item in the array should be
// pure json-path without filtering brackets[].
chainSelect(
	{
		path:     // JSON-path (single string or array of paths)
		in:      // URL of the data source
		deepXml: // If xml content is fetched should the c-data parsed 
		         // as well?
		handler: // optional clause function handling data
		join: {  // Optional join with content of same or another file
			key: // a search key in parent query.
			{
				path:    // JSON-path (single string or array of paths)
				in:      // relative URL of join data - if undefined, 
				         // path will be searched in parent source,
				handler: // optional clause function handling data
				deepXml: // If xml content is fetched should the  
				         // c-data parsed as well?
				join: {
					// MORE OPTIONAL NESTED QUERY.
				}
			}
		}
	}
)
```

If multiple paths are supplied in a query, the query result will be a JSON object where each attribute will be a given query path and its value will be query result for that path. For example: 
```javascript
select(['books.book.title', 'books.book.author'], '/example1.xml', false)

will result in 

{'books.book.title': [], 'books.book.author': []}
```

if `deepXml` is set to true, the cdata-sections in xml files will also be parsed when parsing a content.


If a clause/handler argument is supplied, it will be invoked to further assist in filtering the query result. For example if result should be filtered out of the result and if certain category of books are required, the clause/handler function can look for a book category attribute and return the query result if acceptable or undefined. You can use both handler function and query filtering mechanism to manage generated results. In a certain situations that it is not possible to set up a filtering logic, I recommend using the handler mechanism in conjunction with the query filtering mechanism. Fore example, if you have multiple attributes in a structure and you need to pick one based on the device user is using, you can use a handler to decide the resulting value based on the JSON path argument in handler to decide on attribute value based on user device. Or format a value based on the path!!


The wizard service allows you to set a default base path `SERVICE_PATH` that prepends to all query URLs. By default it's value is blank. Note: If the subsequent URLs in a chain query point to different website URLs, do not set the base url value. If the subsequent URLs are absolute, do not pass value for 'in' attribute of join statement. the 'in' attribute of joint statement is prepended to the path of the subsequent file resulten in parent query.

There is a `logEnabled` attribute that allows service to log additional information while running code. this attribute is set to false by default.


![alt text](https://raw.githubusercontent.com/msalehisedeh/wizard-query/master/sample.png  "What you would see when a wizard-query sampler is used")
