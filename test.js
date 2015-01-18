var test = require('tape');
var template = require('lodash.template');
var model = require('./index');

test('create a simple view', function (t) {
  var options = { template: '<h1>wooo</h1>' };
  var example = model(options);
  t.equal(example.html(), options.template);
  t.end();
});

test('create a model with template and data', function (t) {
  var options = { 
    template: template('<h1><%= hi %></h1>'),
    data: { hi: 'wooo' }
  };

  var example = model(options);
  t.equal(example.html(), '<h1>wooo</h1>');
  t.end();
});

test('update a model with template and data', function (t) {
  var options = { 
    template: template('<h1><%= hi %> <%= count %></h1>'),
    data: { hi: 'wooo', count: 0 }
  };

  var counter = model(options);
  counter.render();

  var interval = setInterval(function () {
    options.data.count += 2;
    counter.set('count', options.data.count);
    t.equal(counter.html(), '<h1>wooo ' + options.data.count + '</h1>');
    if (options.data.count == 10) {
      t.end();
      clearInterval(interval);
    }
  }, 1);
});

test('get/set model with nested data', function (t) {
  var options = { 
    template: template('<h1><%= nested.value %></h1>'),
    data: { nested: { value: 'cool' } }
  };
  
  var example = model(options);
  example.render();
  
  var value = example.get('nested.value');
  t.equal(value, 'cool');
  
  example.set('nested.value', 'awesome');
  value = example.get('nested.value');
  t.equal(value, 'awesome');
  t.end();
});

test('listen for update event', function (t) {
  var options = { 
    template: template('<h1><%= hi %></h1>'),
    data: { hi: 'wooo' }
  };
  
  var example = model(options);
  example.on('update', function () {
    t.equal(example.get('hi'), 'heyo');
    t.end();
  });
  
  example.set('hi', 'heyo');
});

test('listen for change event', function (t) {
  var options = { 
    template: template('<h1><%= hi %></h1>'),
    data: { hi: 'wooo' }
  };
  
  var example = model(options);
  example.on('change', function () {
    t.equal(example.get('hi'), 'heyo');
    t.end();
  });
  
  example.set('hi', 'heyo');
});