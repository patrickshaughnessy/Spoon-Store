/* */ 
'use strict';
var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];
var GraphQLFragmentPointer = require('./GraphQLFragmentPointer');
function recycleNodesInto(prevData, nextData) {
  if (typeof prevData !== 'object' || !prevData || typeof nextData !== 'object' || !nextData) {
    return nextData;
  }
  var canRecycle = false;
  if (prevData instanceof GraphQLFragmentPointer) {
    canRecycle = nextData instanceof GraphQLFragmentPointer && nextData.equals(prevData);
  } else {
    var isPrevArray = Array.isArray(prevData);
    var isNextArray = Array.isArray(nextData);
    if (isPrevArray && isNextArray) {
      var prevArray = prevData;
      var nextArray = nextData;
      canRecycle = nextArray.reduce(function(wasEqual, nextItem, ii) {
        nextArray[ii] = recycleNodesInto(prevArray[ii], nextItem);
        return wasEqual && nextArray[ii] === prevArray[ii];
      }, true) && prevArray.length === nextArray.length;
    } else if (!isPrevArray && !isNextArray) {
      var prevObject = prevData;
      var nextObject = nextData;
      var prevKeys = _Object$keys(prevObject);
      var nextKeys = _Object$keys(nextObject);
      canRecycle = nextKeys.reduce(function(wasEqual, key) {
        var nextValue = nextObject[key];
        nextObject[key] = recycleNodesInto(prevObject[key], nextValue);
        return wasEqual && nextObject[key] === prevObject[key];
      }, true) && prevKeys.length === nextKeys.length;
    }
  }
  return canRecycle ? prevData : nextData;
}
module.exports = recycleNodesInto;
