/* */ 
'use strict';
var fs = require('fs');
var path = require('path');
var language = require('graphql/language');
var utilities = require('graphql/utilities');
var graphql = require('graphql');
var TESTS_DIR = path.resolve(__dirname, '..', '__tests__');
try {
  (function() {
    var inFile = path.join(TESTS_DIR, 'testschema.rfc.graphql');
    var outFile = path.join(TESTS_DIR, 'testschema.rfc.json');
    var body = fs.readFileSync(inFile, 'utf8');
    var ast = language.parse(body);
    var astSchema = utilities.buildASTSchema(ast, 'Root', 'Mutation', 'Subscription');
    graphql.graphql(astSchema, utilities.introspectionQuery).then(function(result) {
      var out = JSON.stringify(result, null, 2);
      fs.writeFileSync(outFile, out);
    });
  })();
} catch (error) {
  console.error(error);
  console.error(error.stack);
}
