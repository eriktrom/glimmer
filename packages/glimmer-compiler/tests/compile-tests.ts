import { compile } from "glimmer-compiler";

QUnit.module('compile: buildMeta');

QUnit.skip('is merged into meta in template', function() {
  var template = compile('Hi, {{name}}!', {
    buildMeta: function() {
      return { blah: 'zorz' };
    }
  });

  equal(template.meta['blah'], 'zorz', 'return value from buildMeta was pass through');
});

QUnit.skip('the program is passed to the callback function', function() {
  var template = compile('Hi, {{name}}!', {
    buildMeta: function(program) {
      return { loc: program.loc };
    }
  });

  equal(template.meta['loc'].start.line, 1, 'the loc was passed through from program');
});

QUnit.skip('value keys are properly stringified', function() {
  var template = compile('Hi, {{name}}!', {
    buildMeta: function() {
      return { 'loc-derp.lol': 'zorz' };
    }
  });

  equal(template.meta['loc-derp.lol'], 'zorz', 'return value from buildMeta was pass through');
});

QUnit.skip('returning undefined does not throw errors', function () {
  var template = compile('Hi, {{name}}!', {
    buildMeta: function() {
      return;
    }
  });

  ok(template.meta, 'meta is present in template, even if empty');
});

QUnit.skip('options are not required for `compile`', function () {
  var template = compile('Hi, {{name}}!');

  ok(template.meta, 'meta is present in template, even if empty');
});
