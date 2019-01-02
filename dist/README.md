# Welcome to Wizard Query!

Have you ever been in need of accessing data deeply nested in multitude of files? Have you thought of a tool that can help you dig deep in a chain of files to find what you are looking for? This wizard allows you to just do that.

You can use this wizard to discover content or call the WizardQueryService through provided methods to have your application access and use data in the most efficient way. The wizard will automatically parse the target URL into JSON no matter what the target content is. The target could have (XML, HTML, JSON, ...) externsion or no extension at all. You can fetch content of a remote file or a site. To do so, begin with blank `''` as a JSON path of the root page. This will reveal every node in object hierarchy of the target. Look at the content and if you find something you want to get all the times, use its JSON path in your fixed query. If the target node value is pointing to another file, use a join query for the JSON path that resulted the target node with a blank `''` JSON path for it to discover its content and repeat the steps you have followed to find the content you are looking for deeply nested in multitude of files.

**I appreciate comments and ideas to make this tool versatile.**


[Live Demo](https://wizard-query.stackblitz.io) | [Source code](https://github.com/msalehisedeh/wizard-query/tree/master/src/app) | [Comments/Requests](https://github.com/msalehisedeh/wizard-query/issues)

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


If a clause/handler argument is supplied, it will be invoked to further assist in filtering the query result. For example if result should be filtered out of the result and if certain category of books are required, the clause/handler function can look for a book category attribute and return the query result if acceptable or undefined. You can use both handler function and query filtering mechanism to manage generated results. In a certain situations that it is not possible to set up a filtering logic, I recommend using the handler mechanism in conjunction with the query filtering mechanism. Fore example, if you have multiple attributes in a structure and you need to pick one based on the device user is using, you can use a handler to decide the resulting value based on key in JSON path to trigger a code to decide on attribute value based on user device. Or format a value based on the key!!


The wizard service allows you to set a default base path `SERVICE_PATH` that prepends to all query URLs. By default it's value is blank. Note: If the subsequent URLs in a chain query point to different website URLs, do not set the base url value. If the subsequent URLs are absolute, do not pass value for 'in' attribute of join statement. the 'in' attribute of joint statement is prepended to the path of the subsequent file resulten in parent query.

There is a `logEnabled` attribute that allows service to log additional information while running code. this attribute is set to false by default.

## global functions
You can use the following functions in query filtering mechanism.
| Method        |args      |Description                                                                     |
|---------------|-----------------|-------------------------------------------------------------------------|
| reverse(@)    |currentNode      |Will return reverse order of currentNode. `books.book.title[reverse(@.book.title)]`      |
| as(@,val)     |currentNode,value|Will cache currentNode as val for a later use. Will return currentNode. `books.book.author[as(@,'authors')]`  |
| like(@,val)   |currentNode,value|Will return currentNode if a is like val. `books.book.title[like(@,'freedom')]` |
| is_in(@,node,list) |currentNode,node,list |Will return currentNode if a node is in the list. `authors.author[is_in(@,@.name.fname,'authors')]` |
| count(@, val) |currentNode,value|Will count the number of val in currentNode. `books[count(@book.description.trim().toLowerCase(),'is')]`|
| sum(@,key)    |currentNode,key  |Will retuen total value of attribute key in currentNode. if currentNode is array total of value in array nodes will be returned. If currentNode is a number, will return currentNode and ignores the key. `books[sum(@,'book.price')]` |

## Sample Use
To use the directive, load it on any tag (H, SPAN, I, ...). It does not matter what would host this directive. Load it as follows:
```javascript
<div 
	[wizardQuery]="myQuery" 
	(onQueryResult)="result=$event" 
	(onQueryError)="error=$event"></div>
```

To use the component which allows you to interactively discover the contents, do the following code:
```javascript
<wizard-query [queryInfo]="myQuery"></wizard-query>
```

To use the service directly, call anyone of available methods as follows:
```javascript
private publicationHandler(node: any, path: string, value: any) {
	// examine the node and return the value if it should be included 
	// in final result.
	//
	// return undefined otherwise.
}

// will return the entire node structure in books.xml
this.select(
	'', /* select all */
	'books.xml', /* in this file */
	false, /* do not parse cdata section */
	this.publicationHandler).subscribe(
	(success) => {
		if(success) {
			this.result = success;
		}
	},
	(error) => {
		this.error = error;
	}
);

// will return the entire book contents in books.xml
this.select(
	'books.book', /* select book of books */
	'books.xml', /* in this file */
	false, /* do not parse cdata section */
	this.publicationHandler).subscribe(
	(success) => {
		if(success) {
			this.result = success;
		}
	},
	(error) => {
		this.error = error;
	}
);

// will return author and title of books in scientific file and 
// entire book contents in fictional file
this.wizardService.arraySelect(
	[
		{path: 'books.book',in: 'fictional'},
		{path: 'books.book.author',in: 'scientific'},
		{path: 'books.book.title',in: 'scientific'}
	], this.publicationHandler
).subscribe(
	(success) => {
		if(success) {
			this.result = success;
		}
	},
	(error) => {
		this.error = error;
	}
);

// will chain into urls provided in each books in marketplace.xml and 
// returns title and author of books listed in the secondary level files
// or API responses located in '/categories/books/' directory.
this.wizardService.chainSelect({
	path: 'books',
	in: 'marketplace.xml',
	join: {
		'books': {
		path: ['publication.title', 'publication.author'],
		in: '/categories/books/',
		handler: this.publicationHandler
	}
}).subscribe(
	(success) => {
		if(success) {
			this.result = success;
		}
	},
	(error) => {
		this.error = error;
	}
);
```

Alternative to supplying of handler method to evaluate a query, special query filtering syntax used in a JSON path will allow you to evaluate a node and filter it out of the result if the filter results in a boolean false. For example you can do the following call:

```javascript
// will return book title with category WEB 
// published after year 2000.
// And the book ratings grater than 3.5
this.select(
	[
		"books.book[@.category=='WEB' && @.year > 2000].title",
		"books.book.ratings.rating[ @ > 3.5]"
	],
	'books.xml',
	false
).subscribe(
	(success) => {
		if(success) {
			this.result = success;
		}
	},
	(error) => {
		this.error = error;
	}
);

// will return the first 3 characters of book title 
// in uppercase and in reverse order.
this.select(
	"books.book.title[@.trim().substring(0,3).toUpperCase()][reverse(@)]",
	'books.xml',
	false
).subscribe(
	(success) => {
		if(success) {
			this.result = success;
		}
	},
	(error) => {
		this.error = error;
	}
);

// will return total price of all books.
this.select(
	"[sum(@,'book.price')]",
	'books.xml',
	false
).subscribe(
	(success) => {
		if(success) {
			this.result = success;
		}
	},
	(error) => {
		this.error = error;
	}
);

// will return number of times 'IS' is repeated in description of each book.
this.select(
	"book[ count(@.description.trim().toUpperCase(),'IS')]",
	'books.xml',
	false
).subscribe(
	(success) => {
		if(success) {
			this.result = success;
		}
	},
	(error) => {
		this.error = error;
	}
);

// will return number of books with category WEB published 
// after year 2000.
this.select(
	"books.book[@.category=='WEB'][@.year > 2000][@.length]",
	'books.xml',
	false
).subscribe(
	(success) => {
		if(success) {
			this.result = success;
		}
	},
	(error) => {
		this.error = error;
	}
);
```

The syntax is simple. '@' signifies the current node and statement inside bracket [] has to be a valid JavaScript conditional statement. You can still use the handler method in combination with special syntax.  In such case you can use the handler to reformat the value. You can cascade bracket filters. you can also use bracket filter syntax to sort result. The syntax of sorting is [order-by: json-path ~ DES/ASC] if you leave out the last arggumet of DES or ASC, then by default the list will be sorted on ASC order.

```javascript
// will return list of titles of books published after year 2000 and 
// are under WEB category sorted out in descending fashion by their 
// author name.
this.select(
    "books.book[@.year > 2000][@.category=='WEB'][order-by: author.name ~DES].title",
    'books.xml',
	false
).subscribe(
	(success) => {
		if(success) {
			this.result = success;
		}
	},
	(error) => {
		this.error = error;
	}
);
```

## Ability to search
You can search on a text node and for a particular phrase and get the sentence that holds the phrase in return. To achieve this you can append the phrase to the end of JSON path or use bracket syntax.
For example:

```javascript
// will return the sentence within description of books with category WEB 
// published after year 2000 which contains 'discovered platinum' phrase.
this.select(
    "books.book[@.category=='WEB' && @.year > 2000].description.discovered platinum",
    'books.xml',
	false
).subscribe(
	(success) => {
		if(success) {
			this.result = success;
		}
	},
	(error) => {
		this.error = error;
	}
);

// will return the entire description of books with category WEB 
// published after year 2000 which contains 'discovered platinum' 
// phrase.
this.select(
    "books.book[@.category=='WEB' && @.year > 2000].description[@.indexOf('discovered platinum') > -1]",
    'books.xml',
	false
).subscribe(
	(success) => {
		if(success) {
			this.result = success;
		}
	},
	(error) => {
		this.error = error;
	}
);
```
## Releases

### Version 1.3.1
Lat update for a while. Made corrections to README file.

### Version 1.3.0
added more global functions and ability to save result of one query as a value to be used in subsequent joined queries.

### Version 1.2.0
added global functions to be used in query filtering syntax.

### Version 1.1.4
I am a perfectionist and trying to make this tool perfect. modified the wizard component to parse handler function typed in query editor without explicit 'return function'. This way the query handler function looks more natural.

### Version 1.1.3
Modified the component to make a call to arraySelect() if wizardQuery value is an array and call chainSelect() if the value is a JSON object. Also, if you type in a handler in the JSON query, it can be parsed and become functional as well. Also, fixed a type in service which was not taking the handler function in chainSelect.

### Version 1.1.2
Modified the directive to make a call to arraySelect() if wizardQuery value is an array and call chainSelect() if the value is a JSON object.

### Version 1.1.1
Fixed an internal logic that was not returning correct results under special circumstances.

### Version 1.1.0
added deepXml flag to enable possibility of accessing cdata-section of xml content as a structure when cdata by itself is a html fragment.

### Version 1.0.1
corrections to README file.

### Version 1.0.0
initial functionality.



![alt text](https://raw.githubusercontent.com/msalehisedeh/wizard-query/master/sample.png  "What you would see when a wizard-query sampler is used")
