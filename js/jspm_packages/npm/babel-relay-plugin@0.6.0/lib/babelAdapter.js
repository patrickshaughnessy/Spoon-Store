/* */ 
'use strict';
var _extends = Object.assign || function(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
};
var path = require('path');
function babelAdapter(Plugin, t, name, visitorsBuilder) {
  if (Plugin == null) {
    return visitorsBuilder(t);
  }
  var legacyT = _extends({}, t, {
    nullLiteral: function nullLiteral() {
      return t.literal(null);
    },
    valueToNode: function valueToNode(value) {
      return t.literal(value);
    },
    objectProperty: function objectProperty(ident, value) {
      return t.property('init', ident, value);
    }
  });
  var visitors = visitorsBuilder(legacyT).visitor;
  var legacyVisitors = {};
  Object.keys(visitors).forEach(function(key) {
    legacyVisitors[key] = function(node, parent, scope, state) {
      var _this = this;
      var compatPath = {
        get: function get() {
          return _this.get.apply(_this, arguments);
        },
        node: node,
        parent: parent
      };
      var compatState = state.opts.compatState;
      if (!compatState) {
        var filename = state.opts.filename;
        state.opts.compatState = compatState = {
          file: {opts: {
              basename: path.basename(filename, path.extname(filename)),
              filename: filename
            }},
          isLegacyState: true
        };
      }
      return visitors[key](compatPath, compatState);
    };
  });
  return new Plugin(name, {visitor: legacyVisitors});
}
module.exports = babelAdapter;