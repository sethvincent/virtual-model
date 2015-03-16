var Emitter = require('component-emitter');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');
var isString = require('amp-is-string');
var observify = require('observify');
var keypath = require('observify-keypath');
var VNode = require('virtual-dom/vnode/vnode');
var VText = require('virtual-dom/vnode/vtext');

var convertHTML = require('html-to-vdom')({
    VNode: VNode,
    VText: VText
});

module.exports = VirtualModel;

function VirtualModel (opts, cb) {
  if (!(this instanceof VirtualModel)) {
    return new VirtualModel(opts, cb);
  }

  var self = this;
  this.template = opts.template || null;
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

  var dom = convertHTML(this.renderedTemplate);

  if (firstRender) {
    this.tree = dom;
    this.el = createElement(dom);
  } else {
    var patches = diff(this.tree, dom);
    this.tree = dom;
    this.el = patch(this.el, patches);
  }

  self.emit('update', this);

  if (cb) cb(null, this);
  
  return this;
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