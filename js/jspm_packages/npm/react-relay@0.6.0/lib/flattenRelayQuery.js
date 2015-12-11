/* */ 
'use strict';
var _inherits = require('babel-runtime/helpers/inherits')['default'];
var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];
var _Array$from = require('babel-runtime/core-js/array/from')['default'];
Object.defineProperty(exports, '__esModule', {value: true});
var Map = require('fbjs/lib/Map');
var RelayProfiler = require('./RelayProfiler');
var RelayQueryVisitor = require('./RelayQueryVisitor');
var sortTypeFirst = require('./sortTypeFirst');
function flattenRelayQuery(node, options) {
  var flattener = new RelayQueryFlattener(options && options.shouldRemoveFragments);
  var state = {
    node: node,
    type: node.getType(),
    flattenedFieldMap: new Map(),
    flattenedFragmentMap: new Map()
  };
  flattener.traverse(node, state);
  return toQuery(node, state);
}
function toQuery(node, _ref) {
  var flattenedFieldMap = _ref.flattenedFieldMap;
  var flattenedFragmentMap = _ref.flattenedFragmentMap;
  var children = [];
  var aliases = _Array$from(flattenedFieldMap.keys()).sort(sortTypeFirst);
  aliases.forEach(function(alias) {
    var field = flattenedFieldMap.get(alias);
    if (field) {
      children.push(toQuery(field.node, field));
    }
  });
  _Array$from(flattenedFragmentMap.keys()).forEach(function(type) {
    var fragment = flattenedFragmentMap.get(type);
    if (fragment) {
      children.push(toQuery(fragment.node, fragment));
    }
  });
  return node.clone(children);
}
var RelayQueryFlattener = (function(_RelayQueryVisitor) {
  _inherits(RelayQueryFlattener, _RelayQueryVisitor);
  function RelayQueryFlattener(shouldRemoveFragments) {
    _classCallCheck(this, RelayQueryFlattener);
    _RelayQueryVisitor.call(this);
    this._shouldRemoveFragments = !!shouldRemoveFragments;
  }
  RelayQueryFlattener.prototype.visitFragment = function visitFragment(node, state) {
    var type = node.getType();
    if (this._shouldRemoveFragments || type === state.type) {
      this.traverse(node, state);
      return;
    }
    var flattenedFragment = state.flattenedFragmentMap.get(type);
    if (!flattenedFragment) {
      flattenedFragment = {
        node: node,
        type: type,
        flattenedFieldMap: new Map(),
        flattenedFragmentMap: new Map()
      };
      state.flattenedFragmentMap.set(type, flattenedFragment);
    }
    this.traverse(node, flattenedFragment);
  };
  RelayQueryFlattener.prototype.visitField = function visitField(node, state) {
    var serializationKey = node.getSerializationKey();
    var flattenedField = state.flattenedFieldMap.get(serializationKey);
    if (!flattenedField) {
      flattenedField = {
        node: node,
        type: node.getType(),
        flattenedFieldMap: new Map(),
        flattenedFragmentMap: new Map()
      };
      state.flattenedFieldMap.set(serializationKey, flattenedField);
    }
    this.traverse(node, flattenedField);
  };
  return RelayQueryFlattener;
})(RelayQueryVisitor);
module.exports = RelayProfiler.instrument('flattenRelayQuery', flattenRelayQuery);
