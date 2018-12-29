# Welcome to Wizard Query!

Have you ever been in need of accessing data deeply nested in multitude of files? Have you thought of a tool that can help you dig deep in a chain of files to find what you are looking for? This wizard allows you to just do that.

You can use this wizard to discover content or call the service through provided methods to have your application access and use data in the most efficient way. the target URL could have extension (i.e., XML, HTML, JSON, ...) or no extension at all. You can fetch content of a file or content of a site. To do so, begin with '' as a JSON path of the root site page. this will reveal every node in object hierarchy. look at the content and if you find something you want to get all the times, use its JSON path in your query. if the target node value is another file, use a join query for JSON path to the target node with a '' JSON path for it to discover its content and repeat the steps you have followed to find the content you are looking for.


[Live Demo](https://wizard-query.stackblitz.io) | [Source code](https://github.com/msalehisedeh/wizard-query/tree/master/src/app) | [Comments/Requests](https://github.com/msalehisedeh/wizard-query/issues)

## How to use?
If you do not want to directly use wizardQueryService, you can use the wizardQuery directive on any tag and receive the result using onQueryResult. The wizard service provides the following methods:

| Method              |Description                                                   |
|------------|-----------------------------------------------------------------------|
|select      |Use a single path or a list of JSON qualifying paths to access content.|
|arraySelect |Use an array of {path: '', in:'', deepXml: true, handler: afunction} to access content. This method will invoke select(). But first, requests with similar paths will be merged into one call. deepXml attribute is optional. This method is useful when paths are dynamically given and it is not clear in advance if there are requests with similar paths. the handler function is optional.|
|chainSelect |Use a chained set of {path: ['path1','path2'], in: 'url1', deepXml: true, handler: afunction, join: {path1: {path:'px', in:'urlx', handler: anotherfunction, join: {}}, path2: {path: 'py', in: 'urly'}}} in a JSON object to access data deep in a chain of files. When result of a single query becomes available, the join attribute of query will be examined to see if a key for the JSON path is available. If so, then the URL for the result appends to the 'in' value of the join query. deepXml attribute is optional. This method is useful when result of a query is a JSON or an XML file and additional query is needed further down in the proceeding files. the handler function and join attributes are optional.|


If multiple paths are supplied in a query, the query result will be a JSON object where each attribute will be a given query path and its value will be query result for that path. For example: select(['books.book.title', 'books.book.author'], '/example1.xml', false) will result in {'books.book.title': [], 'books.book.author': []}. 


if deepXml is set to true, the cdata-sections will also be parsed when parsing an xml content.


If a clause/handler argument is supplied, it will be invoked to further assist in filtering the query result. for example if certain category of books are required, the clause/handler function can look for a book category attribute and return the query result if acceptable or undefined if result should be filtered out of the result. You can use both handler function and filtering mechanism to manage generated results. In a certain situations that it is not possible to set up a filtering logic, I recommend using the handler mechanism in conjunction with the filtering. Fore example, if you have multiple attributes in a structure and you need to pick one based on the device user is using, you can use a handler to decide the resulting value based on key in JSON path to trigger a code to decide on attribute value based on user device. Or format a value based on the key!!


The wizard service allows you to set a default base path that prepends to all query URLs. By default it's value is blank. Note: If the subsequent URLs in a chain query point to different website URLs, do not set the base url value.


## Sample Use
To use the directive, load it on any tag as follows:
```javascript
<div [wizardQuery]="myQuery" (onQueryResult)="result=$event" (onQueryError)="error=$event"></div>
```

To use the component which allows you to interactively discover the contents, do the following code:
```javascript
<wizard-query [queryInfo]="myQuery"></wizard-query>
```

To use the service directly, call anyone of available methods as follows:
```javascript
private publicationHandler(node: any, path: string, value: any) {
	// examine the node and return the value if it should be included in final result.
	// return undefined otherwise.
}

// this call will return the entire node structure in sample1.xml
this.select('', 'sample1.xml', false, this.publicationHandler).subscribe(
	(success) => {
		if(success) {
			this.result = success;
		}
	},
	(error) => {
		this.error = error;
	}
);

// this call will return the entire book contents in sample1.xml
this.select('books.book', 'sample1.xml', false, this.publicationHandler).subscribe(
	(success) => {
		if(success) {
			this.result = success;
		}
	},
	(error) => {
		this.error = error;
	}
);

// this call will return author and title of books in sample1 and entire book contents in sample2
this.wizardService.arraySelect(
	[
		{path: 'books.book',in: 'sample2'},
		{path: 'books.book.author',in: 'sample1'},
		{path: 'books.book.title',in: 'sample1'}
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

// this call will chain into urls provided in each books.book and returns title and author 
// of books listed in the secondary level files or API responses located in '/samples/books/' 
// directory.
this.wizardService.chainSelect({
	path: 'books.book',
	in: 'sample1.xml',
	join: {
		'books.book': {
		path: ['publication.title', 'publication.author'],
		in: '/samples/books/',
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

Alternative to supplying of handler method to evaluate a query, special filtering syntax used in a JSON path will allow you to evaluate a node and filter it out of the result if the filter results in a boolean false. For example you can do the following call:

```javascript
// this call will return title of books with category WEB published 
// after year 2000. and the book ratings grater than 3.5
this.select(
	[
		"books.book[@.category=='WEB' && @.year > 2000].title",
		"books.book.ratings.rating[ @ > 3.5]"
	],
	'sample1.xml',
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
// this call will return list of titles of books published after year 2000 and are under WEB category
// sorted out in descending fashion by their author name.
this.select(
    "books.book[@.year > 2000][@.category=='WEB'][order-by: author.name ~DES].title",
    'sample1.xml',
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
// this call will return the sentence within description of books with category WEB published 
// after year 2000 which contains 'discovered platinum' phrase.
this.select(
    "books.book[@.category=='WEB' && @.year > 2000].description.discovered platinum",
    'sample1.xml',
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

// this call will return the entire description of books with category WEB published 
// after year 2000 which contains 'discovered platinum' phrase.
this.select(
    "books.book[@.category=='WEB' && @.year > 2000].description[@.indexOf('discovered platinum') > -1]",
    'sample1.xml',
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

# Version 1.1.0
added deepXml flag to enable possibility of accessing cdata-section of xml content as a structure when cdata by itself is a html fragment.

# Version 1.0.1
corrections to README file.

# Version 1.0.0
initial functionality.



![alt text](https://raw.githubusercontent.com/msalehisedeh/wizard-query/master/sample.png  "What you would see when a wizard-query sampler is used")
