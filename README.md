# virtual-model

Turn a template into a virtual dom. 

## See also

`virtual-model` uses [virtual-dom](http://npmjs.org/virtual-dom), [virtual-html](http://npmjs.org/virtual-html), and [observify](http://npmjs.org/observify).

This project is called virtual-model, but it really acts as both a model & view, similar to projects like [Ractive](https://github.com/ractivejs/ractive) and [Vue.js](https://github.com/yyx990803/vue), and was inspired by [ampersand-virtual-dom-mixin](https://www.npmjs.com/package/ampersand-virtual-dom-mixin).

## Example

```
var Handlebars = require('handlebars');
var model = require('./index');

var str = '<div style="height:500px; background-image: url({{ img }});"';
str += ' data-foo="{{ foo }}">{{ text }} {{ count }}</div>';

var options = {
  template: Handlebars.compile(str),
  data: { 
    count: 0,
    text: 'pizzzzzaaaaa',
    img: 'http://a.fod4.com/misc/Internet%20Pizza.gif',
    foo: 'bar'
  }
}

var counter = model(options);

setInterval(function () {
  options.data.count += 2;

  if (options.data.count == 10) {
    options.data.text += ' is awesoooooooome';
  }

  counter.set(options.data);
}, 2700);

counter.appendTo(document.body);
```

## Usage

### var model = require('virtual-model');

### var example = model(options[, callback]);

The `options` object has three properties:

- **template**
  - can take a string or a compiled template function like `Handlebars.compile(str)`
- **data**
  - _optional._ an object with the data you want to pass to the template function
- **el**
  - _optional._ the html node that will serve as the parent element for the view

The optional callback provides an `err` parameter that exists if there was an error parsing the html.
  
## Methods

### example.render([callback]);

Renders the the template with the data and updates the element.

The optional callback provides an `err` parameter that exists if there was an error parsing the html.

### example.set(data);

`data` is an object that will update the data of the model and automatically run `example.render()` to update the dom.

### example.html();

Returns the current html.

### example.appendTo(el);

The `el` argument is the html node that will serve as the parent element of the view.

## Properties

### example.tree

The [virtual-dom](https://github.com/Matt-Esch/virtual-dom) tree.

### example.el

The element that can be added to the dom of the web page.

## License

MIT