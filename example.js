var template = require('lodash.template');
var model = require('./index');

var str = '<div style="height:500px; background-image: url(<%= img %>);"';
str += ' data-foo="<%= foo %>"><%= text %> <%= count %></div>';

var options = {
  template: template(str),
  data: { 
    count: 0,
    text: 'pizzzzzaaaaa',
    img: 'http://a.fod4.com/misc/Internet%20Pizza.gif',
    foo: 'bar',
    wat: {
      nested: 'stuff'
    }
  }
};

var counter = model(options);
counter.render();

setInterval(function () {
  options.data.count += 2;

  if (options.data.count == 10) {
    options.data.text += ' is awesoooooooome';
  }

  counter.set('count', options.data.count);
}, 2700);

counter.on('change', function (data) {
  console.log('waaaaaa');
});

counter.set('wat.nested', 'did it');
console.log(counter.get('wat.nested'))