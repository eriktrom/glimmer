import { alias } from 'glimmer-object';
import { Reference, Meta, fork } from 'glimmer-reference';
import { LITERAL } from 'glimmer-util';
import { get, set, defineProperty } from './support';

var obj, count;

QUnit.module('defineProperty - alias', {
  setup() {
    obj = { foo: { faz: 'FOO' } };
    count = 0;
  },
  teardown() {
    obj = null;
  }
});

function shouldBeClean(reference: Reference, msg?: string) {
  // a "clean" reference is allowed to report dirty
}

function shouldBeDirty(reference: Reference, msg?: string) {
  equal(reference.isDirty(), true, msg || `${reference} should be dirty`);
}

QUnit.test('should proxy get to alt key', function() {
  defineProperty(obj, 'bar', alias('foo.faz'));
  equal(get(obj, 'bar'), 'FOO');
});

QUnit.test('should proxy set to alt key', function() {
  defineProperty(obj, 'bar', alias('foo.faz'));
  set(obj, 'bar', 'BAR');
  equal(get(obj, 'foo.faz'), 'BAR');
});

QUnit.test('should observe the alias', function() {
  defineProperty(obj, 'bar', alias('foo.faz'));
  let ref = Meta.for(obj).root().get(LITERAL('bar'));
  let val = ref.value();
  equal(val, 'FOO');
  shouldBeClean(ref);

  set(obj.foo, 'faz', 'FAZ');
  shouldBeDirty(ref, "after setting the property the alias is for");
  equal(ref.isDirty(), true);
  equal(ref.value(), 'FAZ');
});

function observe(obj, key) {
  let ref = fork(Meta.for(obj).root().get(key));
  // ref.value();
  return ref;
}

QUnit.test('old dependent keys should not trigger property changes', function() {
  var obj1 = Object.create(null);
  defineProperty(obj1, 'foo', null);
  defineProperty(obj1, 'bar', alias('foo'));
  defineProperty(obj1, 'baz', alias('foo'));
  defineProperty(obj1, 'baz', alias('bar')); // redefine baz

  let ref = observe(obj1, 'baz');
  equal(ref.value(), null, "The value starts out null");
  shouldBeClean(ref);

  set(obj1, 'foo', 'FOO');
  shouldBeDirty(ref, "Now that we set the dependent value, the ref is dirty");
  equal(ref.value(), 'FOO', "And it sees the new value");
  shouldBeClean(ref, "But now that we got the value, the ref is no longer dirty");

  ref.destroy();

  set(obj1, 'foo', 'OOF');
  shouldBeClean(ref, "Destroyed refs aren't dirty");
});

QUnit.test('overridden dependent keys should not trigger property changes', function() {
  var obj1 = Object.create(null);
  defineProperty(obj1, 'foo', null);
  defineProperty(obj1, 'bar', alias('foo'));
  defineProperty(obj1, 'baz', alias('foo'));

  let ref = observe(obj1, 'baz');
  equal(ref.value(), null);
  shouldBeClean(ref);

  var obj2 = Object.create(obj1);
  defineProperty(obj2, 'baz', alias('bar')); // override baz

  set(obj2, 'foo', 'FOO');
  shouldBeClean(ref);

  ref.destroy();

  set(obj2, 'foo', 'OOF');

  shouldBeClean(ref);
});

QUnit.test('begins watching alt key as soon as alias is watched', function() {
  defineProperty(obj, 'bar', alias('foo.faz'));

  let ref = observe(obj, 'bar');
  equal(ref.value(), 'FOO');

  set(obj, 'foo.faz', 'BAR');

  shouldBeDirty(ref);
  equal(ref.value(), 'BAR');
});

QUnit.test('immediately sets up dependencies if already being watched', function() {
  let ref = observe(obj, 'bar');
  defineProperty(obj, 'bar', alias('foo.faz'));
  shouldBeDirty(ref, "The reference starts out dirty");

  set(obj, 'foo.faz', 'BAR');
  shouldBeDirty(ref, "The reference is still dirty");
  equal(ref.value(), 'BAR');
  // equal(count, 1);
});

QUnit.test('setting alias on self should fail assertion', assert => {
  assert.throws(function() {
    defineProperty(obj, 'bar', alias('bar'));
  }, /Setting alias \'bar\' on self/);
});
