var Funnel = require('broccoli-funnel');
var concat = require('broccoli-concat');
var merge = require('broccoli-merge-trees');
var typescript = require('broccoli-typescript-compiler');
var transpileES6 = require('emberjs-build/lib/utils/transpile-es6');
var handlebarsInlinedTrees = require('./build-support/handlebars-inliner');
var getVersion = require('git-repo-version');
var stew = require('broccoli-stew');
var mv = stew.mv;
var find = stew.find;
var log = stew.log;
var rename = stew.rename;

function transpile(tree, label) {
  return transpileES6(tree, label, {
    resolveModuleSource: null,
    sourceMaps: 'inline'
  });
}

module.exports = function() {
  var bower = 'bower_components';
  var demoHTML = find('demos/*.html');

  var demoTS = merge([
    find('demos/**/*.ts'),
    mv('packages/glimmer-runtime/tests/support.ts', 'glimmer-demos/index.ts')
  ]);

  var demoES6 = typescript(demoTS);
  var demoES5 = transpile(demoES6);

  var demoConcat = concat(demoES5, {
    inputFiles: ['**/*.js'],
    outputFile: '/demos/demos.amd.js'
  });

  var benchmarkjs = stew.npm.main('benchmark', undefined, __dirname);
  var benchHarness = 'bench';
  var bench = find(
    merge([
      benchmarkjs,
      benchHarness
    ]),
    { destDir: '/demos' }
  );

  var demos = merge([
    demoHTML,
    demoConcat,
    bench
  ]);

  var HTMLTokenizer = new Funnel(bower + '/simple-html-tokenizer/lib/');

  var DTSTree = find('packages', {
    include: ['*/index.d.ts'],
    getDestinationPath: function(relativePath) {
      return relativePath.replace(/\.d\.ts$/, '.js');
    }
  });

  var tsTree = find('packages', {
    include: ["**/*.ts"],
    exclude: ["**/*.d.ts"]
  });

  var jsTree = typescript(tsTree);

  var libTree = find(jsTree, '*/lib/**/*.js');

  var packagesTree = merge([
    DTSTree,
    libTree,
    HTMLTokenizer
  ]);

  var runtimeTree = find(packagesTree, 'glimmer-runtime/**/*');

  runtimeTree = merge([
    runtimeTree,
    handlebarsInlinedTrees.runtime
  ]);

  var compilerTree = merge([
    packagesTree,
    handlebarsInlinedTrees.compiler
  ]);

  var testTree = find(jsTree, '*/tests/**/*.js');

  // Test Assets

  var testHarness = find('tests', {
    srcDir: '/',
    files: [ 'index.html' ],
    destDir: '/tests'
  });

  testHarness = merge([
    testHarness, new Funnel(bower, {
      srcDir: '/qunit/qunit',
      destDir: '/tests'
    })
  ]);

  var transpiledCompiler = transpile(compilerTree, 'transpiledLibs');
  var transpiledRuntime = transpile(runtimeTree, 'transpiledRuntime');
  var transpiledTests = transpile(testTree, 'transpiledTests');

  var concatenatedCompiler = concat(transpiledCompiler, {
    inputFiles: ['**/*.js'],
    outputFile: '/amd/glimmer-compiler.amd.js'
  });

  var concatenatedRuntime = concat(transpiledRuntime, {
    inputFiles: ['**/*.js'],
    outputFile: '/amd/glimmer-runtime.amd.js'
  });

  var concatenatedTests = concat(transpiledTests, {
    inputFiles: ['**/*.js'],
    outputFile: '/tests.js'
  });

  var loader = new Funnel(bower + '/loader.js/', {
    files: [ 'loader.js' ],
    destDir: '/assets'
  });

  var es6Tree = mv(packagesTree, 'es6');

  return merge([
    es6Tree,
    demos,
    concatenatedCompiler,
    concatenatedRuntime,
    loader,
    testHarness,
    concatenatedTests
  ]);
}
