# haitao, Micro Mobile Framework 

a framework for mobile

## About

haitao is a small and light framework

> haitao 是一个很小且轻巧的移动学习框架


## Usage ##

###Template(模板)###

```javascript
var H = new haitao();
var tpl = '<% if(true) {%><p>Hei, my name is <%=name%>, and I\'m <%= age %> years old</p><%}%>';
var data = {
    "name": "Barret Lee",
    "age": "20"
};
var result = H.Template.tmpl(tpl, data);
```
###Router(路由)###

```javascript
var author = function () { console.log("author"); };
var books = function () { console.log("books"); };
var viewBook = function (bookId) {
    console.log("viewBook: bookId is populated: " + bookId);
};
var routes = {
    '/author': author,
    '/books': [books, function() {
        console.log("An inline route handler.");
    }],
    '/books/view/:bookId': viewBook
};
var H = new haitao();
H.router(routes).init();
```

###Ajax###

```javascript
var params = {name:"andy"};
haitao.get("http://127.0.0.1:80", params, function(data){
    console.log(data)
})
haitao.post("http://127.0.0.1:80", params, function(data){
    console.log(data)
})
```

###Event###

```javascript
var H = new haitao();
var a = function(bb){alert(bb)}
H.addEvent("hh",a)  // 自定义事件
H.removeEvent("hh")  // 移除事件
H.fireEvent("hh",'hello world');  //触发自定义事件
```



## Contributing

We'll check out your contribution if you:

* Provide a comprehensive suite of tests for your fork.
* Have a clear and documented rationale for your changes.
* Package these up in a pull request.

We'll do our best to help you out with any contribution issues you may have.

## License

MIT. See `LICENSE.txt` in this directory.
