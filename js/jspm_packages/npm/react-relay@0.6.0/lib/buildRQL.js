/* */ 
(function(process) {
  'use strict';
  var _extends = require('babel-runtime/helpers/extends')['default'];
  var _toConsumableArray = require('babel-runtime/helpers/to-consumable-array')['default'];
  Object.defineProperty(exports, '__esModule', {value: true});
  var Map = require('fbjs/lib/Map');
  var QueryBuilder = require('./QueryBuilder');
  var RelayProfiler = require('./RelayProfiler');
  var filterObject = require('fbjs/lib/filterObject');
  var invariant = require('fbjs/lib/invariant');
  var mapObject = require('fbjs/lib/mapObject');
  var fragmentCache = new Map();
  var queryCache = new Map();
  function isDeprecatedCallWithArgCountGreaterThan(nodeBuilder, count) {
    var argLength = nodeBuilder.length;
    if (process.env.NODE_ENV !== 'production') {
      var mockImpl = nodeBuilder;
      while (mockImpl && mockImpl._getMockImplementation) {
        mockImpl = mockImpl._getMockImplementation();
      }
      if (mockImpl) {
        argLength = mockImpl.length;
      }
    }
    return argLength > count;
  }
  var buildRQL = {
    Fragment: function Fragment(fragmentBuilder, values) {
      var node = fragmentCache.get(fragmentBuilder);
      if (!node) {
        var variables = toVariables(values);
        !!isDeprecatedCallWithArgCountGreaterThan(fragmentBuilder, 1) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Relay.QL: Deprecated usage detected. If you are trying to define a ' + 'fragment, use `variables => Relay.QL`.') : invariant(false) : undefined;
        node = fragmentBuilder(variables);
        fragmentCache.set(fragmentBuilder, node);
      }
      if (node) {
        return QueryBuilder.getFragment(node);
      }
    },
    Query: function Query(queryBuilder, Component, queryName, values) {
      var componentCache = queryCache.get(queryBuilder);
      var node = undefined;
      if (!componentCache) {
        componentCache = new Map();
        queryCache.set(queryBuilder, componentCache);
      } else {
        node = componentCache.get(Component);
      }
      if (!node) {
        var _variables = toVariables(values);
        !!isDeprecatedCallWithArgCountGreaterThan(queryBuilder, 2) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Relay.QL: Deprecated usage detected. If you are trying to define a ' + 'query, use `(Component, variables) => Relay.QL`.') : invariant(false) : undefined;
        if (isDeprecatedCallWithArgCountGreaterThan(queryBuilder, 0)) {
          node = queryBuilder(Component, _variables);
        } else {
          node = queryBuilder(Component, _variables);
          var query = QueryBuilder.getQuery(node);
          if (query) {
            (function() {
              var hasFragment = false;
              var hasScalarFieldsOnly = true;
              if (query.children) {
                query.children.forEach(function(child) {
                  if (child) {
                    hasFragment = hasFragment || child.kind === 'Fragment';
                    hasScalarFieldsOnly = hasScalarFieldsOnly && child.kind === 'Field' && (!child.children || child.children.length === 0);
                  }
                });
              }
              if (!hasFragment) {
                var children = query.children ? [].concat(_toConsumableArray(query.children)) : [];
                !hasScalarFieldsOnly ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Relay.QL: Expected query `%s` to be empty. For example, use ' + '`node(id: $id)`, not `node(id: $id) { ... }`.', query.fieldName) : invariant(false) : undefined;
                var fragmentValues = filterObject(values, function(_, name) {
                  return Component.hasVariable(name);
                });
                children.push(Component.getFragment(queryName, fragmentValues));
                node = _extends({}, query, {children: children});
              }
            })();
          }
        }
        componentCache.set(Component, node);
      }
      if (node) {
        return QueryBuilder.getQuery(node) || undefined;
      }
      return null;
    }
  };
  function toVariables(variables) {
    return mapObject(variables, function(_, name) {
      return QueryBuilder.createCallVariable(name);
    });
  }
  RelayProfiler.instrumentMethods(buildRQL, {
    Fragment: 'buildRQL.Fragment',
    Query: 'buildRQL.Query'
  });
  module.exports = buildRQL;
})(require('process'));
