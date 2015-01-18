var template = require('mustache');
var model = require('./index');

var str = '<div style="height:500px; background-image: url({{ img }});"';
str += ' data-foo="{{ foo }}">{{ text }} {{ count }}</div>';

var options = {
  template: template(str),
  data: { 
    count: 0,
    text: 'pizzzzzaaaaa',
    img: 'http://a.fod4.com/misc/Internet%20Pizza.gif',
    foo: 'bar'
  }
};

var counter = model(options);

setInterval(function () {
  options.data.count += 2;

  if (options.data.count == 10) {
    options.data.text += ' is awesoooooooome';
  }

  counter.set(options.data);
}, 2700);

counter.appendTo(document.body);