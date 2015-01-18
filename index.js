var Emitter = require('component-emitter');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');
var parse = require('html-parse-stringify').parse;
var isString = require('amp-is-string');
var virtual = require('virtual-html');
var observify = require('observify');
var keypath = require('observify-keypath');

module.exports = VirtualModel;

function VirtualModel (opts, cb) {
  if (!(this instanceof VirtualModel)) {
    return new VirtualModel(opts, cb);
  }

  var self = this;
  this.template = opts.template || '';
  this.data = observify(opts.data || {});

  if (opts.el) this.appendTo(opts.el);

  this.data(function (value) {
    self.emit('change', self.data());
    self.render(cb);
  });
};

Emitter(VirtualModel.prototype);

VirtualModel.prototype.render = function (cb) {
  var self = this;
  
  var firstRender = !this.tree || !this.el;
  if (isString(this.template)) this.renderedTemplate = this.template;
  else this.renderedTemplate = this.template(this.data());

  virtual(this.renderedTemplate, function (err, dom) {
    if (err) {
      if (cb) return cb(err);
      throw err;
    }

    if (firstRender) {
      self.tree = dom;
      self.el = createElement(dom);
    } else {
      var patches = diff(self.tree, dom);
      self.tree = dom;
      self.el = patch(self.el, patches);
    }
    
    self.emit('update', self);
    
    if (cb) cb(null, self);
  });
};

VirtualModel.prototype.appendTo = function (el) {
  if (!this.el) this.render();
  el.appendChild(this.el);
};

VirtualModel.prototype.set = function (key, value) {
  if (typeof key === 'object') return this.data.set(key);
  return keypath.set(this.data, key, value)
};

VirtualModel.prototype.get = function (key) {
  return keypath.get(this.data, key);
};

VirtualModel.prototype.html = function () {
  if (!this.renderedTemplate) this.render();
  return this.renderedTemplate;
};


