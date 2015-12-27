enifed("component-test", ["exports", "glimmer-compiler", "glimmer-test-helpers", "./support"], function (exports, _glimmerCompiler, _glimmerTestHelpers, _support) {
    "use strict";

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    var env = undefined,
        root = undefined,
        result = undefined;
    function rootElement() {
        return env.getDOM().createElement('div', document.body);
    }
    function compile(template) {
        return _glimmerCompiler.compile(template, { disableComponentGeneration: false });
    }
    function commonSetup() {
        env = new _support.TestEnvironment(window.document); // TODO: Support SimpleDOM
        env.registerGlimmerComponent('my-component', MyComponent, "<div>{{yield}}</div>");
        root = rootElement();
    }
    function render(template) {
        var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        result = template.render(context, env, { appendTo: root });
        assertInvariants(result);
        return result;
    }
    function rerender() {
        var context = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        result.rerender(context);
    }
    function assertInvariants(result) {
        strictEqual(result.firstNode(), root.firstChild, "The firstNode of the result is the same as the root's firstChild");
        strictEqual(result.lastNode(), root.lastChild, "The lastNode of the result is the same as the root's lastChild");
    }
    QUnit.module("Components", {
        beforeEach: commonSetup
    });

    var MyComponent = (function () {
        function MyComponent(attrs) {
            _classCallCheck(this, MyComponent);

            this.attrs = attrs;
        }

        _createClass(MyComponent, [{
            key: "testing",
            get: function () {
                if (this.attrs.color === 'red') {
                    return '123';
                } else {
                    return '456';
                }
            }
        }]);

        return MyComponent;
    })();

    QUnit.skip('creating a new component', function (assert) {
        var template = compile("<my-component color='{{color}}'>hello!</my-component>");
        render(template, { color: 'red' });
        _glimmerTestHelpers.equalTokens(root, "<div color='red'>hello!</div>");
        rerender({ color: 'green' });
        _glimmerTestHelpers.equalTokens(root, "<div color='green'>hello!</div>");
    });
    QUnit.skip('the component class is its context', function (assert) {
        env.registerGlimmerComponent('my-component', MyComponent, '<div><p>{{testing}}</p>{{yield}}</div>');
        var template = compile("<my-component color='{{color}}'>hello!</my-component>");
        render(template, { color: 'red' });
        _glimmerTestHelpers.equalTokens(root, "<div color='red'><p>123</p>hello!</div>");
        rerender({ color: 'green' });
        _glimmerTestHelpers.equalTokens(root, "<div color='green'><p>456</p>hello!</div>");
    });
    QUnit.skip('attrs are available in the layout', function (assert) {
        env.registerGlimmerComponent('my-component', MyComponent, '<div><p>{{attrs.color}}</p>{{yield}}</div>');
        var template = compile("<my-component color='{{color}}'>hello!</my-component>");
        render(template, { color: 'red' });
        _glimmerTestHelpers.equalTokens(root, "<div color='red'><p>red</p>hello!</div>");
        rerender({ color: 'green' });
        _glimmerTestHelpers.equalTokens(root, "<div color='green'><p>green</p>hello!</div>");
    });
    function testError(layout, expected) {
        QUnit.skip("'" + layout + "' produces an error like " + expected, function (assert) {
            env.registerGlimmerComponent('my-component', MyComponent, layout);
            var template = compile("<my-component>hello!</my-component>");
            assert.throws(function () {
                return render(template);
            }, expected);
        });
    }
    testError("<div>{{yield}}</div>nope", /non-whitespace text/);
    testError("<div>{{yield}}</div><div></div>", /multiple root elements/);
    testError("<div>{{yield}}</div>{{color}}", /cannot have curlies/);
    testError("{{color}}", /cannot have curlies/);
    testError("nope", /non-whitespace text/);
    testError("", /single root element/);
});

enifed("ember-component-test", ["exports", "glimmer-object", "./support", "glimmer-util", "glimmer-test-helpers", "glimmer-reference"], function (exports, _glimmerObject, _support, _glimmerUtil, _glimmerTestHelpers, _glimmerReference) {
    "use strict";

    var _templateObject = _taggedTemplateLiteralLoose(["\n      {{#each items key=\"id\" as |item|}}\n        <sub-item name={{item.id}} />\n      {{/each}}"], ["\n      {{#each items key=\"id\" as |item|}}\n        <sub-item name={{item.id}} />\n      {{/each}}"]),
        _templateObject2 = _taggedTemplateLiteralLoose(["\n      <aside>{{@item.id}}:\n        {{#if @item.visible}}\n          {{#each @item.subitems key=\"id\" as |subitem|}}\n             <sub-item name={{subitem.id}} />\n          {{/each}}\n        {{/if}}\n      </aside>"], ["\n      <aside>{{@item.id}}:\n        {{#if @item.visible}}\n          {{#each @item.subitems key=\"id\" as |subitem|}}\n             <sub-item name={{subitem.id}} />\n          {{/each}}\n        {{/if}}\n      </aside>"]),
        _templateObject3 = _taggedTemplateLiteralLoose(["\n        <article>{{#each items key=\"id\" as |item|}}\n          <my-item item={{item}} />\n        {{/each}}</article>"], ["\n        <article>{{#each items key=\"id\" as |item|}}\n          <my-item item={{item}} />\n        {{/each}}</article>"]),
        _templateObject4 = _taggedTemplateLiteralLoose(["\n        <aside>0:<p>0.0</p><p>0.1</p><!----></aside>\n        <aside>1:<!----></aside>\n        <aside>2:<p>2.0</p><p>2.1</p><!----></aside>\n        <!---->"], ["\n        <aside>0:<p>0.0</p><p>0.1</p><!----></aside>\n        <aside>1:<!----></aside>\n        <aside>2:<p>2.0</p><p>2.1</p><!----></aside>\n        <!---->"]),
        _templateObject5 = _taggedTemplateLiteralLoose(["<div>{{sample-component \"Foo\" 4 \"Bar\" id=\"args-3\"}}\n      {{sample-component \"Foo\" 4 \"Bar\" 5 \"Baz\" id=\"args-5\"}}\n      {{!sample-component \"Foo\" 4 \"Bar\" 5 \"Baz\" id=\"helper\"}}</div>"], ["<div>{{sample-component \"Foo\" 4 \"Bar\" id=\"args-3\"}}\n      {{sample-component \"Foo\" 4 \"Bar\" 5 \"Baz\" id=\"args-5\"}}\n      {{!sample-component \"Foo\" 4 \"Bar\" 5 \"Baz\" id=\"helper\"}}</div>"]);

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    function _taggedTemplateLiteralLoose(strings, raw) { strings.raw = raw; return strings; }

    var Component = (function (_EmberObject) {
        _inherits(Component, _EmberObject);

        function Component() {
            _classCallCheck(this, Component);

            _EmberObject.apply(this, arguments);
        }

        Component.prototype.appendTo = function appendTo(selector) {
            var element = this.parent = document.querySelector(selector);
            this._result = this.template.render(this, this.env, { appendTo: element, hostOptions: { component: this } });
            this.element = element.firstElementChild;
        };

        Component.prototype.rerender = function rerender() {
            this._result.rerender();
            this.element = this.parent.firstElementChild;
        };

        return Component;
    })(_glimmerObject.default);

    var EmberishComponent = (function (_Component) {
        _inherits(EmberishComponent, _Component);

        function EmberishComponent() {
            _classCallCheck(this, EmberishComponent);

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            _Component.call.apply(_Component, [this].concat(args));
            this.attributeBindings = ['id', 'ariaRole:role'];
        }

        return EmberishComponent;
    })(Component);

    var GlimmerComponent = (function (_Component2) {
        _inherits(GlimmerComponent, _Component2);

        function GlimmerComponent() {
            _classCallCheck(this, GlimmerComponent);

            _Component2.apply(this, arguments);
        }

        return GlimmerComponent;
    })(Component);

    var EmberishGlimmerComponent = (function (_GlimmerComponent) {
        _inherits(EmberishGlimmerComponent, _GlimmerComponent);

        function EmberishGlimmerComponent() {
            _classCallCheck(this, EmberishGlimmerComponent);

            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            _GlimmerComponent.call.apply(_GlimmerComponent, [this].concat(args));
            this.parentView = null;
        }

        return EmberishGlimmerComponent;
    })(GlimmerComponent);

    var view = undefined,
        env = undefined;
    QUnit.module("GlimmerComponent - invocation", {
        setup: function () {
            env = new _support.TestEnvironment();
        }
    });
    function appendViewFor(template) {
        var attrs = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var MyComponent = (function (_Component3) {
            _inherits(MyComponent, _Component3);

            function MyComponent() {
                _classCallCheck(this, MyComponent);

                for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                    args[_key3] = arguments[_key3];
                }

                _Component3.call.apply(_Component3, [this].concat(args));
                this.env = env;
                this.template = _support.compile(template);
            }

            return MyComponent;
        })(Component);

        MyComponent[_glimmerReference.CLASS_META].seal();
        view = new MyComponent(attrs);
        env.begin();
        view.appendTo('#qunit-fixture');
        env.commit();
    }
    function assertAppended(content) {
        _glimmerTestHelpers.equalTokens(document.querySelector('#qunit-fixture'), content);
    }
    function assertFired(hooks, name) {
        var count = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

        if (name in hooks.hooks) {
            equal(hooks.hooks[name].length, count, "The " + name + " hook fired " + count + " " + (count === 1 ? 'time' : 'times'));
        } else {
            ok(false, "The " + name + " hook fired");
        }
    }
    function assertComponentElement() {
        var tagName = undefined,
            attrs = undefined,
            contents = undefined;

        for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            args[_key4] = arguments[_key4];
        }

        if (args.length === 2) {
            if (typeof args[1] === 'string') {
                ;
                tagName = args[0];
                attrs = {};
                contents = args[1];
            } else {
                ;
                tagName = args[0];
                attrs = args[1];
                contents = null;
            }
        } else if (args.length === 1) {
            tagName = args[0];
            attrs = {};
            contents = null;
        } else {
            tagName = args[0];
            attrs = args[1];
            contents = args[2];
        }
        _support.equalsElement(view.element, tagName, attrs, contents);
    }
    function assertEmberishElement() {
        var tagName = undefined,
            attrs = undefined,
            contents = undefined;

        for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
            args[_key5] = arguments[_key5];
        }

        if (args.length === 2) {
            if (typeof args[1] === 'string') {
                ;
                tagName = args[0];
                attrs = {};
                contents = args[1];
            } else {
                ;
                tagName = args[0];
                attrs = args[1];
                contents = null;
            }
        } else if (args.length === 1) {
            tagName = args[0];
            attrs = {};
            contents = null;
        } else {
            tagName = args[0];
            attrs = args[1];
            contents = args[2];
        }
        var fullAttrs = _glimmerUtil.assign({ class: _support.classes('ember-view'), id: _support.regex(/^ember\d*$/) }, attrs);
        _support.equalsElement(view.element, tagName, fullAttrs, contents);
    }
    function assertElementIsEmberishElement(element) {
        var tagName = undefined,
            attrs = undefined,
            contents = undefined;

        for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
            args[_key6 - 1] = arguments[_key6];
        }

        if (args.length === 2) {
            if (typeof args[1] === 'string') {
                ;
                tagName = args[0];
                attrs = {};
                contents = args[1];
            } else {
                ;
                tagName = args[0];
                attrs = args[1];
                contents = null;
            }
        } else if (args.length === 1) {
            tagName = args[0];
            attrs = {};
            contents = null;
        } else {
            tagName = args[0];
            attrs = args[1];
            contents = args[2];
        }
        var fullAttrs = _glimmerUtil.assign({ class: _support.classes('ember-view'), id: _support.regex(/^ember\d*$/) }, attrs);
        _support.equalsElement(element, tagName, fullAttrs, contents);
    }
    function rerender() {
        env.begin();
        view.rerender();
        env.commit();
    }
    ;
    function testComponent(title, _ref) {
        var kind = _ref.kind;
        var layout = _ref.layout;
        var invokeAs = _ref.invokeAs;
        var block = _ref.block;
        var _expected = _ref.expected;
        var skip = _ref.skip;

        if (skip !== false) return;
        if (typeof block === 'string') invokeAs = { template: block };
        invokeAs = _glimmerUtil.assign({
            attrs: {},
            context: {},
            blockParams: null,
            inverse: null
        }, invokeAs || {});
        var _invokeAs = invokeAs;
        var attrs = _invokeAs.attrs;
        var context = _invokeAs.context;
        var blockParams = _invokeAs.blockParams;
        var template = _invokeAs.template;
        var inverse = _invokeAs.inverse;

        if (!kind || kind === 'curly') {
            (function () {
                var expected = undefined;
                if (typeof _expected === 'string') {
                    expected = {
                        content: _expected,
                        attrs: {}
                    };
                } else {
                    expected = _expected;
                }
                QUnit.test("curly: " + title, function () {
                    env.registerEmberishComponent('test-component', EmberishComponent, layout);
                    var attrList = Object.keys(attrs).reduce(function (list, key) {
                        return list.concat(key + "=" + attrs[key]);
                    }, []);
                    if (typeof template === 'string') {
                        var args = blockParams ? " as |" + blockParams.join(' ') + "|" : '';
                        var inv = typeof inverse === 'string' ? "{{else}}" + inverse : '';
                        appendViewFor("{{#test-component " + attrList.join(' ') + args + "}}" + template + inv + "{{/test-component}}", context || {});
                    } else {
                        appendViewFor("{{test-component " + attrList.join(' ') + "}}", context || {});
                    }
                    assertEmberishElement('div', expected.attrs, expected.content);
                });
            })();
        }
        var keys = Object.keys(attrs);
        if (!kind || kind === 'glimmer') {
            (function () {
                var expected = undefined;
                if (typeof _expected === 'string') {
                    expected = {
                        content: _expected,
                        attrs: attrs
                    };
                } else {
                    expected = _expected;
                }
                QUnit.test("glimmer: " + title, function () {
                    env.registerEmberishGlimmerComponent('test-component', GlimmerComponent, " <aside>" + layout + "</aside><!-- hi -->");
                    var attrList = keys.reduce(function (list, key) {
                        return list.concat(key + "=" + attrs[key]);
                    }, []);
                    if (typeof template === 'string') {
                        var args = blockParams ? " as |" + blockParams.join(' ') + "|" : '';
                        appendViewFor("<test-component " + attrList.join(' ') + args + ">" + template + "</test-component>", context || {});
                    } else {
                        appendViewFor("<test-component " + attrList.join(' ') + " />", context || {});
                    }
                    assertEmberishElement('aside', expected.attrs, expected.content);
                });
            })();
        }
        var expected = undefined;
        if (typeof _expected === 'string') {
            expected = {
                content: _expected,
                attrs: attrs
            };
        } else {
            expected = _expected;
        }
        if (!kind || kind === 'glimmer') {
            QUnit.test("basic: " + title, function () {
                env.registerGlimmerComponent('test-component', GlimmerComponent, " <aside>" + layout + "</aside><!-- hi -->");
                var attrList = keys.reduce(function (list, key) {
                    return list.concat(key + "=" + attrs[key]);
                }, []);
                if (typeof template === 'string') {
                    var args = blockParams ? " as |" + blockParams.join(' ') + "|" : '';
                    appendViewFor("<test-component " + attrList.join(' ') + args + ">" + template + "</test-component>", context || {});
                } else {
                    appendViewFor("<test-component " + attrList.join(' ') + " />", context || {});
                }
                assertComponentElement('aside', expected.attrs, expected.content);
            });
        }
    }
    // TODO: <component>
    // QUnit.skip(`glimmer - component helper: ${title}`, () => {
    //   env.registerGlimmerComponent('test-component', GlimmerComponent, layout);
    //   env.registerGlimmerComponent('test-component2', GlimmerComponent, layout2);
    //   let attrList: string[] = keys.reduce((list, key) => {
    //     return list.concat(`${key}=${attrs[key]}`);
    //   }, <string[]>[]);
    //   if (contents) {
    //     appendViewFor(`{{#component componentName ${attrList.join(' ')}}}${contents}{{/component}}`, { componentName: 'test-component' });
    //   } else {
    //     appendViewFor(`{{component componentName ${attrList.join(' ')}}}`, { componentName: 'test-component' });
    //   }
    //   assertAppended(expected);
    //   set(view, 'componentName', 'test-component2');
    //   rerender();
    //   assertAppended(expected2);
    // });
    testComponent('non-block without properties', {
        skip: false,
        layout: 'In layout',
        expected: 'In layout'
    });
    testComponent('block without properties', {
        skip: false,
        layout: 'In layout -- {{yield}}',
        expected: 'In layout -- In template',
        block: 'In template'
    });
    testComponent('non-block with properties on attrs', {
        skip: false,
        layout: 'In layout - someProp: {{@someProp}}',
        invokeAs: { attrs: { someProp: '"something here"' } },
        expected: 'In layout - someProp: something here'
    });
    testComponent('block with properties on attrs', {
        skip: false,
        layout: 'In layout - someProp: {{@someProp}} - {{yield}}',
        invokeAs: { template: 'In template', attrs: { someProp: '"something here"' } },
        expected: 'In layout - someProp: something here - In template'
    });
    testComponent('with ariaRole specified', {
        skip: false,
        kind: 'curly',
        layout: 'Here!',
        invokeAs: { attrs: { id: '"aria-test"', ariaRole: '"main"' } },
        expected: {
            content: 'Here!',
            attrs: { id: '"aria-test"', role: '"main"' }
        }
    });
    testComponent('with ariaRole and class specified', {
        kind: 'curly',
        layout: 'Here!',
        invokeAs: { attrs: { id: '"aria-test"', class: '"foo"', ariaRole: '"main"' } },
        expected: {
            content: 'Here!',
            attrs: { id: '"aria-test"', class: _support.classes('ember-view foo'), role: '"main"' }
        }
    });
    testComponent('with ariaRole specified as an outer binding', {
        kind: 'curly',
        layout: 'Here!',
        invokeAs: {
            attrs: { id: '"aria-test"', class: '"foo"', ariaRole: 'ariaRole' },
            context: { ariaRole: 'main' }
        },
        expected: {
            content: 'Here!',
            attrs: { id: '"aria-test"', class: _support.classes('ember-view foo'), role: '"main"' }
        }
    });
    testComponent('glimmer component with role specified as an outer binding and copied', {
        skip: false,
        kind: 'glimmer',
        layout: 'Here!',
        invokeAs: {
            attrs: { id: '"aria-test"', role: '"{{myRole}}"' },
            context: { myRole: 'main' }
        },
        expected: {
            content: 'Here!',
            attrs: { id: '"aria-test"', role: '"main"' }
        }
    });
    testComponent('hasBlock is true when block supplied', {
        layout: '{{#if hasBlock}}{{yield}}{{else}}No Block!{{/if}}',
        block: 'In template',
        expected: 'In template'
    });
    testComponent('hasBlock is false when block supplied', {
        layout: '{{#if hasBlock}}{{yield}}{{else}}No Block!{{/if}}',
        expected: 'No Block!'
    });
    testComponent('hasBlockParams is true when block param supplied', {
        layout: '{{#if hasBlockParams}}{{yield this}} - In Component{{else}}{{yield}} No Block Param!{{/if}}',
        invokeAs: {
            blockParams: ['something'],
            template: 'In template'
        },
        expected: 'In template - In Component'
    });
    testComponent('hasBlockParams is false when no block param supplied', {
        layout: '{{#if hasBlockParams}}{{yield this}} - In Component{{else}}{{yield}} - No Block Param!{{/if}}',
        block: 'In template',
        expected: 'In template - No Block Param!'
    });
    testComponent('yield to inverse', {
        kind: 'curly',
        layout: '{{#if predicate}}Yes:{{yield someValue}}{{else}}No:{{yield to="inverse"}}{{/if}}',
        invokeAs: {
            attrs: { predicate: 'activated', someValue: '42' },
            context: { activated: true },
            blockParams: ['result'],
            template: 'Hello{{result}}',
            inverse: 'Goodbye'
        },
        expected: 'Yes:Hello42'
    });
    testComponent('parameterized hasBlock (inverse) when inverse supplied', {
        kind: 'curly',
        layout: '{{#if (hasBlock "inverse")}}Yes{{else}}No{{/if}}',
        invokeAs: {
            template: 'block here',
            inverse: 'inverse here'
        },
        expected: 'Yes'
    });
    testComponent('parameterized hasBlock (inverse) when inverse not supplied', {
        layout: '{{#if (hasBlock "inverse")}}Yes{{else}}No{{/if}}',
        block: 'block here',
        expected: 'No'
    });
    testComponent('parameterized hasBlock (default) when block supplied', {
        layout: '{{#if (hasBlock)}}Yes{{else}}No{{/if}}',
        block: 'block here',
        expected: 'Yes'
    });
    testComponent('parameterized hasBlock (default) when block not supplied', {
        layout: '{{#if (hasBlock)}}Yes{{else}}No{{/if}}',
        expected: 'No'
    });
    testComponent('hasBlock keyword when block supplied', {
        layout: '{{#if hasBlock}}Yes{{else}}No{{/if}}',
        block: 'block here',
        expected: 'Yes'
    });
    testComponent('hasBlock keyword when block not supplied', {
        layout: '{{#if hasBlock}}Yes{{else}}No{{/if}}',
        expected: 'No'
    });
    QUnit.test('correct scope - simple', function (assert) {
        env.registerGlimmerComponent('sub-item', EmberishComponent, "<p>{{@name}}</p>");
        var subitemId = 0;
        var subitems = [];
        for (var i = 0; i < 1; i++) {
            subitems.push({
                id: subitemId++
            });
        }
        appendViewFor(_glimmerTestHelpers.stripTight(_templateObject), { items: subitems });
        _support.equalsElement(view.element, 'p', {}, '0');
    });
    QUnit.test('correct scope - complex', function (assert) {
        env.registerGlimmerComponent('my-item', EmberishComponent, _glimmerTestHelpers.stripTight(_templateObject2));
        env.registerGlimmerComponent('sub-item', EmberishComponent, "<p>{{@name}}</p>");
        var itemId = 0;
        var items = [];
        for (var i = 0; i < 3; i++) {
            var subitems = [];
            var subitemId = 0;
            for (var j = 0; j < 2; j++) {
                subitems.push({
                    id: itemId + "." + subitemId++
                });
            }
            items.push({
                id: String(itemId++),
                visible: i % 2 === 0,
                subitems: subitems
            });
        }
        appendViewFor(_glimmerTestHelpers.stripTight(_templateObject3), { items: items });
        _support.equalsElement(view.element, 'article', {}, _glimmerTestHelpers.stripTight(_templateObject4));
    });
    QUnit.skip('static named positional parameters', function () {
        var SampleComponent = (function (_EmberishComponent) {
            _inherits(SampleComponent, _EmberishComponent);

            function SampleComponent() {
                _classCallCheck(this, SampleComponent);

                _EmberishComponent.apply(this, arguments);
            }

            return SampleComponent;
        })(EmberishComponent);

        SampleComponent.positionalParams = ['name', 'age'];
        SampleComponent[_glimmerReference.CLASS_META].seal();
        env.registerEmberishComponent('sample-component', SampleComponent, '{{name}}{{age}}');
        appendViewFor('{{sample-component "Quint" 4}}');
        assertEmberishElement('div', 'Quint4');
    });
    QUnit.skip('dynamic named positional parameters', function () {
        var SampleComponent = Component.extend();
        SampleComponent.reopenClass({
            positionalParams: ['name', 'age']
        });
        env.registerEmberishComponent('sample-component', SampleComponent, '{{name}}{{age}}');
        appendViewFor('{{sample-component myName myAge}}', {
            myName: 'Quint',
            myAge: 4
        });
        assertEmberishElement('div', 'Quint4');
        _glimmerReference.setProperty(view, 'myName', 'Edward');
        _glimmerReference.setProperty(view, 'myAge', 5);
        rerender();
        assertEmberishElement('div', 'Edward5');
    });
    QUnit.skip('if a value is passed as a non-positional parameter, it takes precedence over the named one', function (assert) {
        var SampleComponent = Component.extend();
        SampleComponent.reopenClass({
            positionalParams: ['name']
        });
        env.registerEmberishComponent('sample-component', SampleComponent, '{{name}}');
        assert.throws(function () {
            appendViewFor('{{sample-component notMyName name=myName}}', {
                myName: 'Quint',
                notMyName: 'Sergio'
            });
        }, "You cannot specify both a positional param (at position 0) and the hash argument `name`.");
    });
    QUnit.skip('static arbitrary number of positional parameters', function () {
        var SampleComponent = Component.extend();
        SampleComponent.reopenClass({
            positionalParams: 'names'
        });
        env.registerEmberishComponent('sample-component', SampleComponent, '{{#each names as |name|}}{{name}}{{/each}}');
        appendViewFor(_glimmerTestHelpers.stripTight(_templateObject5));
        var first = view.element.firstChild;
        var second = first.nextSibling;
        // let third = <Element>second.nextSibling;
        assertElementIsEmberishElement(first, 'div', { id: 'args-3' }, 'Foo4Bar');
        assertElementIsEmberishElement(second, 'div', { id: 'args-5' }, 'Foo4Bar5Baz');
        // equalsElement(third, ...emberishElement('div', { id: 'helper' }, 'Foo4Bar5Baz'));
    });
    QUnit.skip('arbitrary positional parameter conflict with hash parameter is reported', function (assert) {
        var SampleComponent = Component.extend();
        SampleComponent.reopenClass({
            positionalParams: 'names'
        });
        env.registerEmberishComponent('sample-component', SampleComponent, '{{#each attrs.names as |name|}}{{name}}{{/each}}');
        assert.throws(function () {
            appendViewFor('{{sample-component "Foo" 4 "Bar" names=numbers id="args-3"}}', {
                numbers: [1, 2, 3]
            });
        }, "You cannot specify positional parameters and the hash argument `names`.");
    });
    QUnit.skip('can use hash parameter instead of arbitrary positional param [GH #12444]', function () {
        var SampleComponent = Component.extend();
        SampleComponent.reopenClass({
            positionalParams: 'names'
        });
        env.registerEmberishComponent('sample-component', SampleComponent, '{{#each names as |name|}}{{name}}{{/each}}');
        appendViewFor('{{sample-component names=things id="args-3"}}', {
            things: ['Foo', 4, 'Bar']
        });
        assertEmberishElement('div', { id: 'args-3' }, 'Foo4Bar');
    });
    QUnit.skip('can use hash parameter instead of positional param', function () {
        var SampleComponent = Component.extend();
        SampleComponent.reopenClass({
            positionalParams: ['first', 'second']
        });
        env.registerEmberishComponent('sample-component', SampleComponent, '{{first}} - {{second}}');
        appendViewFor("<div>\n    {{sample-component \"one\" \"two\" id=\"two-positional\"}}\n    {{sample-component \"one\" second=\"two\" id=\"one-positional\"}}\n    {{sample-component first=\"one\" second=\"two\" id=\"no-positional\"}}</div>\n  ", {
            things: ['Foo', 4, 'Bar']
        });
        var first = view.element.firstElementChild;
        var second = first.nextElementSibling;
        var third = second.nextElementSibling;
        assertElementIsEmberishElement(first, 'div', { id: 'two-positional' }, 'one - two');
        assertElementIsEmberishElement(second, 'div', { id: 'one-positional' }, 'one - two');
        assertElementIsEmberishElement(third, 'div', { id: 'no-positional' }, 'one - two');
    });
    QUnit.skip('dynamic arbitrary number of positional parameters', function () {
        var SampleComponent = Component.extend();
        SampleComponent.reopenClass({
            positionalParams: 'n'
        });
        env.registerEmberishComponent('sample-component', SampleComponent, '{{#each attrs.n as |name|}}{{name}}{{/each}}');
        appendViewFor('<div>{{sample-component user1 user2 id="direct"}}{{!component "sample-component" user1 user2 id="helper"}}</div>', {
            user1: 'Foo',
            user2: 4
        });
        var first = view.element.firstElementChild;
        // let second = first.nextElementSibling;
        assertElementIsEmberishElement(first, 'div', { id: 'direct' }, 'Foo4');
        // assertElementIsEmberishElement(first, 'div', { id: 'helper' }, 'Foo4');
        _glimmerReference.setProperty(view, 'user1', "Bar");
        _glimmerReference.setProperty(view, 'user2', "5");
        rerender();
        assertElementIsEmberishElement(first, 'div', { id: 'direct' }, 'Bar5');
        // assertElementIsEmberishElement(second, 'div', { id: 'helper' }, 'Bar5');
        _glimmerReference.setProperty(view, 'user2', '6');
        rerender();
        assertElementIsEmberishElement(first, 'div', { id: 'direct' }, 'Bar6');
        // assertElementIsEmberishElement(second, 'div', { id: 'helper' }, 'Bar6');
    });
    // QUnit.skip('{{component}} helper works with positional params', function() {
    //   var SampleComponent = Component.extend();
    //   SampleComponent.reopenClass({
    //     positionalParams: ['name', 'age']
    //   });
    //   registry.register('template:components/sample-component', compile('{{attrs.name}}{{attrs.age}}'));
    //   registry.register('component:sample-component', SampleComponent);
    //   view = EmberView.extend({
    //     layout: compile('{{component "sample-component" myName myAge}}'),
    //     container: container,
    //     context: {
    //       myName: 'Quint',
    //       myAge: 4
    //     }
    //   }).create();
    //   runAppend(view);
    //   equal(jQuery('#qunit-fixture').text(), 'Quint4');
    //   run(function() {
    //     set(view.context, 'myName', 'Edward');
    //     set(view.context, 'myAge', '5');
    //   });
    //   equal(jQuery('#qunit-fixture').text(), 'Edward5');
    // });
    QUnit.skip('components in template of a yielding component should have the proper parentView', function () {
        var outer, innerTemplate, innerLayout;
        var Outer = EmberishComponent.extend({
            init: function () {
                this._super.apply(this, arguments);
                outer = this;
            }
        });
        var InnerInTemplate = EmberishComponent.extend({
            init: function () {
                this._super.apply(this, arguments);
                innerTemplate = this;
            }
        });
        var InnerInLayout = EmberishComponent.extend({
            init: function () {
                this._super.apply(this, arguments);
                innerLayout = this;
            }
        });
        env.registerEmberishComponent('x-outer', Outer, "{{x-inner-in-layout}}{{yield}}");
        env.registerEmberishComponent('x-inner-in-layout', InnerInLayout, '');
        env.registerEmberishComponent('x-inner-in-template', InnerInTemplate, '');
        appendViewFor('{{#x-outer}}{{x-inner-in-template}}{{/x-outer}}');
        assertEmberishElement('div');
        equalObject(innerTemplate.parentView, outer, 'receives the wrapping component as its parentView in template blocks');
        equalObject(innerLayout.parentView, outer, 'receives the wrapping component as its parentView in layout');
        equalObject(outer.parentView, view, 'x-outer receives the ambient scope as its parentView');
    });
    function equalObject(actual, expected, msg) {
        equal(actual._meta.identity(), expected._meta.identity(), msg);
    }
    QUnit.skip('newly-added sub-components get correct parentView', function () {
        var outer, inner;
        var Outer = EmberishComponent.extend({
            init: function () {
                this._super.apply(this, arguments);
                outer = this;
            }
        });
        var Inner = EmberishComponent.extend({
            init: function () {
                this._super.apply(this, arguments);
                inner = this;
            }
        });
        env.registerEmberishComponent('x-outer', Outer, "{{x-inner-in-layout}}{{yield}}");
        env.registerEmberishComponent('x-inner', Inner, '');
        appendViewFor('{{#x-outer}}{{#if showInner}}{{x-inner}}{{/if}}{{/x-outer}}', { showInner: false });
        equalObject(outer.parentView, view, 'x-outer receives the ambient scope as its parentView');
        _glimmerReference.setProperty(view, 'showInner', true);
        rerender();
        equalObject(inner.parentView, outer, 'receives the wrapping component as its parentView in template blocks');
        equalObject(outer.parentView, view, 'x-outer receives the ambient scope as its parentView');
    });
    // QUnit.skip('non-block with each rendering child components', function() {
    //   expect(2);
    //   registry.register(
    //     'template:components/non-block',
    //     compile('In layout. {{#each attrs.items as |item|}}[{{child-non-block item=item}}]{{/each}}')
    //   );
    //   registry.register('template:components/child-non-block', compile('Child: {{attrs.item}}.'));
    //   var items = emberA(['Tom', 'Dick', 'Harry']);
    //   view = EmberView.extend({
    //     template: compile('{{non-block items=view.items}}'),
    //     container: container,
    //     items: items
    //   }).create();
    //   runAppend(view);
    //   equal(jQuery('#qunit-fixture').text(), 'In layout. [Child: Tom.][Child: Dick.][Child: Harry.]');
    //   run(function() {
    //     items.pushObject('James');
    //   });
    //   equal(jQuery('#qunit-fixture').text(), 'In layout. [Child: Tom.][Child: Dick.][Child: Harry.][Child: James.]');
    // });
    // QUnit.skip('specifying classNames results in correct class', function(assert) {
    //   expect(3);
    //   let clickyThing;
    //   registry.register('component:some-clicky-thing', Component.extend({
    //     tagName: 'button',
    //     classNames: ['foo', 'bar'],
    //     init() {
    //       this._super(...arguments);
    //       clickyThing = this;
    //     }
    //   }));
    //   view = EmberView.extend({
    //     template: compile('{{#some-clicky-thing classNames="baz"}}Click Me{{/some-clicky-thing}}'),
    //     container: container
    //   }).create();
    //   runAppend(view);
    //   let button = view.$('button');
    //   ok(button.is('.foo.bar.baz.ember-view'), 'the element has the correct classes: ' + button.attr('class'));
    //   let expectedClassNames = ['ember-view', 'foo', 'bar', 'baz'];
    //   assert.deepEqual(clickyThing.get('classNames'),  expectedClassNames, 'classNames are properly combined');
    //   let buttonClassNames = button.attr('class');
    //   assert.deepEqual(buttonClassNames.split(' '), expectedClassNames, 'all classes are set 1:1 in DOM');
    // });
    // QUnit.skip('specifying custom concatenatedProperties avoids clobbering', function(assert) {
    //   expect(1);
    //   let clickyThing;
    //   registry.register('component:some-clicky-thing', Component.extend({
    //     concatenatedProperties: ['blahzz'],
    //     blahzz: ['blark', 'pory'],
    //     init() {
    //       this._super(...arguments);
    //       clickyThing = this;
    //     }
    //   }));
    //   view = EmberView.extend({
    //     template: compile('{{#some-clicky-thing blahzz="baz"}}Click Me{{/some-clicky-thing}}'),
    //     container: container
    //   }).create();
    //   runAppend(view);
    //   assert.deepEqual(clickyThing.get('blahzz'),  ['blark', 'pory', 'baz'], 'property is properly combined');
    // });
    // // jscs:disable validateIndentation
    // if (isEnabled('ember-glimmer-component-generation')) {
    //   QUnit.module('component - invocation (angle brackets)', {
    //     setup() {
    //       commonSetup();
    //     },
    //     teardown() {
    //       commonTeardown();
    //     }
    //   });
    //   QUnit.skip('legacy components cannot be invoked with angle brackets', function() {
    //     registry.register('template:components/non-block', compile('In layout'));
    //     registry.register('component:non-block', Component.extend());
    //     expectAssertion(function() {
    //       view = appendViewFor('<non-block />');
    //     }, /cannot invoke the 'non-block' component with angle brackets/);
    //   });
    //   QUnit.skip('using a text-fragment in a GlimmerComponent layout gives an error', function() {
    //     registry.register('template:components/non-block', compile('In layout'));
    //     expectAssertion(() => {
    //       view = appendViewFor('<non-block />');
    //     }, `The <non-block> template must have a single top-level element because it is a GlimmerComponent.`);
    //   });
    //   QUnit.skip('having multiple top-level elements in a GlimmerComponent layout gives an error', function() {
    //     registry.register('template:components/non-block', compile('<div>This is a</div><div>fragment</div>'));
    //     expectAssertion(() => {
    //       view = appendViewFor('<non-block />');
    //     }, `The <non-block> template must have a single top-level element because it is a GlimmerComponent.`);
    //   });
    //   QUnit.skip('using a modifier in a GlimmerComponent layout gives an error', function() {
    //     registry.register('template:components/non-block', compile('<div {{action "foo"}}></div>'));
    //     expectAssertion(() => {
    //       view = appendViewFor('<non-block />');
    //     }, `You cannot use {{action ...}} in the top-level element of the <non-block> template because it is a GlimmerComponent.`);
    //   });
    //   QUnit.skip('using triple-curlies in a GlimmerComponent layout gives an error', function() {
    //     registry.register('template:components/non-block', compile('<div style={{{bar}}}>This is a</div>'));
    //     expectAssertion(() => {
    //       view = appendViewFor('<non-block />');
    //     }, strip`You cannot use triple curlies (e.g. style={{{ ... }}})
    //       in the top-level element of the <non-block> template because it is a GlimmerComponent.`
    //     );
    //   });
    var styles = [{
        name: 'a div',
        tagName: 'div'
    }, {
        name: 'an identity element',
        tagName: 'non-block'
    }, {
        name: 'a web component',
        tagName: 'not-an-ember-component'
    }];
    styles.forEach(function (style) {
        QUnit.skip("non-block without attributes replaced with " + style.name, function () {
            env.registerEmberishGlimmerComponent('non-block', EmberishGlimmerComponent, "  <" + style.tagName + ">In layout</" + style.tagName + ">  ");
            appendViewFor('<non-block />');
            var node = view.element.firstChild;
            _support.equalsElement(view.element, style.tagName, { class: 'ember-view', id: _support.regex(/^ember\d*$/) }, 'In layout');
            rerender();
            strictEqual(node, view.element.firstChild, 'The inner element has not changed');
            _support.equalsElement(view.element, style.tagName, { class: 'ember-view', id: _support.regex(/^ember\d*$/) }, 'In layout');
        });
        QUnit.skip("non-block with attributes replaced with " + style.name, function () {
            env.registerEmberishGlimmerComponent('non-block', EmberishGlimmerComponent, "  <" + style.tagName + " such=\"{{attrs.stability}}\">In layout</" + style.tagName + ">  ");
            appendViewFor('<non-block stability={{view.stability}} />', { stability: 'stability' });
            var node = view.element;
            _support.equalsElement(node, style.tagName, { such: 'stability', class: 'ember-view', id: _support.regex(/^ember\d*$/) }, 'In layout');
            _glimmerReference.setProperty(view, 'stability', 'changed!!!');
            rerender();
            strictEqual(node.firstElementChild, view.element.firstElementChild, 'The inner element has not changed');
            _support.equalsElement(node, style.tagName, { such: 'changed!!!', class: 'ember-view', id: _support.regex(/^ember\d*$/) }, 'In layout');
        });
        QUnit.skip("non-block replaced with " + style.name + " (regression with single element in the root element)", function () {
            env.registerEmberishGlimmerComponent('non-block', EmberishGlimmerComponent, "  <" + style.tagName + " such=\"{{attrs.stability}}\"><p>In layout</p></" + style.tagName + ">  ");
            appendViewFor('<non-block stability={{view.stability}} />', { stability: 'stability' });
            var node = view.element;
            _support.equalsElement(node, style.tagName, { such: 'stability', class: 'ember-view', id: _support.regex(/^ember\d*$/) }, '<p>In layout</p>');
            _glimmerReference.setProperty(view, 'stability', 'changed!!!');
            rerender();
            strictEqual(node.firstElementChild, view.element.firstElementChild, 'The inner element has not changed');
            _support.equalsElement(node, style.tagName, { such: 'changed!!!', class: 'ember-view', id: _support.regex(/^ember\d*$/) }, '<p>In layout</p>');
        });
        QUnit.skip("non-block with class replaced with " + style.name + " merges classes", function () {
            env.registerEmberishGlimmerComponent('non-block', EmberishGlimmerComponent, "<" + style.tagName + " class=\"inner-class\" />");
            appendViewFor('<non-block class="{{outer}}" />', { outer: 'outer' });
            _support.equalsElement(view.element, style.tagName, { class: _support.classes('inner-class outer ember-view'), id: _support.regex(/^ember\d*$/) }, '');
            _glimmerReference.setProperty(view, 'outer', 'new-outer');
            rerender();
            _support.equalsElement(view.element, style.tagName, { class: _support.classes('inner-class new-outer ember-view'), id: _support.regex(/^ember\d*$/) }, '');
        });
        QUnit.skip("non-block with outer attributes replaced with " + style.name + " shadows inner attributes", function () {
            var component = undefined;

            var MyComponent = (function (_EmberishGlimmerComponent) {
                _inherits(MyComponent, _EmberishGlimmerComponent);

                function MyComponent(attrs) {
                    _classCallCheck(this, MyComponent);

                    _EmberishGlimmerComponent.call(this, attrs);
                    component = this;
                }

                return MyComponent;
            })(EmberishGlimmerComponent);

            MyComponent[_glimmerReference.CLASS_META].seal();
            env.registerEmberishGlimmerComponent('non-block', MyComponent, "<" + style.tagName + " data-static=\"static\" data-dynamic=\"{{internal}}\" />");
            appendViewFor('<non-block data-static="outer" data-dynamic="outer" />');
            _support.equalsElement(view.element, style.tagName, {
                class: _support.classes('ember-view'),
                id: _support.regex(/^ember\d*$/),
                'data-static': 'outer',
                'data-dynamic': 'outer'
            }, '');
            _glimmerReference.setProperty(component, 'internal', 'changed');
            _support.equalsElement(view.element, style.tagName, {
                class: _support.classes('ember-view'),
                id: _support.regex(/^ember\d*$/),
                'data-static': 'outer',
                'data-dynamic': 'outer'
            }, '');
        });
        QUnit.skip("non-block replaced with " + style.name + " should have correct scope", function () {
            var NonBlock = (function (_EmberishGlimmerComponent2) {
                _inherits(NonBlock, _EmberishGlimmerComponent2);

                function NonBlock() {
                    _classCallCheck(this, NonBlock);

                    _EmberishGlimmerComponent2.apply(this, arguments);
                }

                NonBlock.prototype.init = function init() {
                    this._super.apply(this, arguments);
                    _glimmerReference.setProperty(this, 'internal', 'stuff');
                };

                return NonBlock;
            })(EmberishGlimmerComponent);

            NonBlock[_glimmerReference.CLASS_META].seal();
            env.registerEmberishGlimmerComponent('non-block', NonBlock, "<" + style.tagName + ">{{internal}}</" + style.tagName + ">");
            appendViewFor('<non-block />');
            _support.equalsElement(view.element, style.tagName, { class: _support.classes('ember-view'), id: _support.regex(/^ember\d*$/) }, 'stuff');
        });
        QUnit.skip("non-block replaced with " + style.name + " should have correct 'element'", function () {
            var component = undefined;

            var MyComponent = (function (_EmberishGlimmerComponent3) {
                _inherits(MyComponent, _EmberishGlimmerComponent3);

                function MyComponent(attrs) {
                    _classCallCheck(this, MyComponent);

                    _EmberishGlimmerComponent3.call(this, attrs);
                    component = this;
                }

                return MyComponent;
            })(EmberishGlimmerComponent);

            MyComponent[_glimmerReference.CLASS_META].seal();
            env.registerEmberishGlimmerComponent('non-block', MyComponent, "<" + style.tagName + " />");
            appendViewFor('<non-block />');
            _support.equalsElement(view.element, style.tagName, { class: _support.classes('ember-view'), id: _support.regex(/^ember\d*$/) }, '');
        });
        QUnit.skip("non-block replaced with " + style.name + " should have inner attributes", function () {
            var NonBlock = (function (_EmberishGlimmerComponent4) {
                _inherits(NonBlock, _EmberishGlimmerComponent4);

                function NonBlock() {
                    _classCallCheck(this, NonBlock);

                    _EmberishGlimmerComponent4.apply(this, arguments);
                }

                NonBlock.prototype.init = function init() {
                    this._super.apply(this, arguments);
                    _glimmerReference.setProperty(this, 'internal', 'stuff');
                };

                return NonBlock;
            })(EmberishGlimmerComponent);

            NonBlock[_glimmerReference.CLASS_META].seal();
            env.registerEmberishGlimmerComponent('non-block', NonBlock, "<" + style.tagName + " data-static=\"static\" data-dynamic=\"{{internal}}\" />");
            appendViewFor('<non-block />');
            _support.equalsElement(view.element, style.tagName, {
                class: _support.classes('ember-view'),
                id: _support.regex(/^ember\d*$/),
                'data-static': 'static',
                'data-dynamic': 'stuff'
            }, '');
        });
        QUnit.skip("only text attributes are reflected on the underlying DOM element (" + style.name + ")", function () {
            env.registerEmberishGlimmerComponent('non-block', EmberishGlimmerComponent, "<" + style.tagName + ">In layout</" + style.tagName + ">");
            appendViewFor('<non-block static-prop="static text" concat-prop="{{view.dynamic}} text" dynamic-prop={{view.dynamic}} />', {
                dynamic: 'dynamic'
            });
            _support.equalsElement(view.element, style.tagName, {
                class: _support.classes('ember-view'),
                id: _support.regex(/^ember\d*$/),
                'static-prop': 'static text',
                'concat-prop': 'dynamic text'
            }, 'In layout');
        });
    });
    QUnit.skip('block without properties', function () {
        env.registerEmberishGlimmerComponent('with-block', EmberishGlimmerComponent, '<with-block>In layout - {{yield}}</with-block>');
        appendViewFor('<with-block>In template</with-block>');
        _support.equalsElement(view.element, 'with-block', { class: _support.classes('ember-view'), id: _support.regex(/^ember\d*$/) }, 'In layout - In template');
    });
    QUnit.skip('attributes are not installed on the top level', function () {
        var component = undefined;

        var NonBlock = (function (_EmberishGlimmerComponent5) {
            _inherits(NonBlock, _EmberishGlimmerComponent5);

            function NonBlock() {
                _classCallCheck(this, NonBlock);

                _EmberishGlimmerComponent5.apply(this, arguments);
            }

            NonBlock.prototype.init = function init() {
                this._super.apply(this, arguments);
                component = this;
            };

            return NonBlock;
        })(EmberishGlimmerComponent);

        NonBlock[_glimmerReference.CLASS_META].seal();
        // This is specifically attempting to trigger a 1.x-era heuristic that only copied
        // attrs that were present as defined properties on the component.
        NonBlock.prototype['text'] = null;
        NonBlock.prototype['dynamic'] = null;
        env.registerEmberishGlimmerComponent('non-block', NonBlock, '<non-block>In layout - {{attrs.text}} -- {{text}}</non-block>');
        appendViewFor('<non-block text="texting" dynamic={{dynamic}} />', {
            dynamic: 'dynamic'
        });
        _support.equalsElement(view.element, 'non-block', {
            class: _support.classes('ember-view'),
            id: _support.regex(/^ember\d*$/),
            text: 'texting'
        }, 'In layout - texting -- null');
        equal(component.attrs['text'], 'texting');
        equal(component.attrs['dynamic'], 'dynamic');
        strictEqual(component['text'], null);
        strictEqual(component['dynamic'], null);
        rerender();
        _support.equalsElement(view.element, 'non-block', {
            class: _support.classes('ember-view'),
            id: _support.regex(/^ember\d*$/),
            text: 'texting'
        }, 'In layout - texting -- <!---->');
        equal(component.attrs['text'], 'texting');
        equal(component.attrs['dynamic'], 'dynamic');
        strictEqual(component['text'], null);
        strictEqual(component['dynamic'], null);
    });
    QUnit.skip('non-block with properties on attrs and component class', function () {
        env.registerEmberishGlimmerComponent('non-block', EmberishGlimmerComponent, '<non-block>In layout - someProp: {{attrs.someProp}}</non-block>');
        appendViewFor('<non-block someProp="something here" />');
        assertEmberishElement('non-block', { someProp: 'something here' }, 'In layout - someProp: something here');
    });
    QUnit.skip('rerendering component with attrs from parent', function () {
        var hooks = env.registerEmberishGlimmerComponent('non-block', EmberishGlimmerComponent, '<non-block>In layout - someProp: {{attrs.someProp}}</non-block>').hooks;
        appendViewFor('<non-block someProp={{someProp}} />', {
            someProp: 'wycats'
        });
        assertFired(hooks, 'didReceiveAttrs');
        assertEmberishElement('non-block', 'In layout - someProp: wycats');
        _support.equalsElement(view.element, 'non-block', { class: _support.classes('ember-view'), id: _support.regex(/^ember\d*$/) }, 'In layout - someProp: wycats');
        _glimmerReference.setProperty(view, 'someProp', 'tomdale');
        rerender();
        assertEmberishElement('non-block', 'In layout - someProp: tomdale');
        assertFired(hooks, 'didReceiveAttrs', 2);
        assertFired(hooks, 'willUpdate', 1);
        rerender();
        assertEmberishElement('non-block', 'In layout - someProp: tomdale');
        assertFired(hooks, 'didReceiveAttrs', 3);
        assertFired(hooks, 'willUpdate', 2);
    });
    QUnit.skip('block with properties on attrs', function () {
        env.registerEmberishGlimmerComponent('with-block', EmberishGlimmerComponent, '<with-block>In layout - someProp: {{attrs.someProp}} - {{yield}}</with-block>');
        appendViewFor('<with-block someProp="something here">In template</with-block>');
        assertEmberishElement('with-block', { someProp: 'something here' }, 'In layout - someProp: something here - In template');
    });
    QUnit.skip('computed property alias on a static attr', function () {
        var ComputedAlias = EmberishGlimmerComponent.extend({
            otherProp: _glimmerObject.alias('attrs.someProp')
        });
        env.registerEmberishGlimmerComponent('computed-alias', ComputedAlias, '<computed-alias>{{otherProp}}</computed-alias>');
        appendViewFor('<computed-alias someProp="value"></computed-alias>', {
            someProp: 'value'
        });
        assertEmberishElement('computed-alias', { someProp: 'value' }, 'value');
    });
    QUnit.skip('computed property alias on a dynamic attr', function () {
        var ComputedAlias = EmberishGlimmerComponent.extend({
            otherProp: _glimmerObject.alias('attrs.someProp')
        });
        env.registerEmberishGlimmerComponent('computed-alias', ComputedAlias, '<computed-alias>{{otherProp}}</computed-alias>');
        appendViewFor('<computed-alias someProp="{{someProp}}"></computed-alias>', {
            someProp: 'value'
        });
        assertEmberishElement('computed-alias', { someProp: 'value' }, 'value');
        _glimmerReference.setProperty(view, 'someProp', 'other value');
        rerender();
        assertEmberishElement('computed-alias', { someProp: 'other value' }, 'other value');
    });
    QUnit.skip('lookup of component takes priority over property', function () {
        expect(1);

        var MyComponent = (function (_Component4) {
            _inherits(MyComponent, _Component4);

            function MyComponent() {
                _classCallCheck(this, MyComponent);

                for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
                    args[_key7] = arguments[_key7];
                }

                _Component4.call.apply(_Component4, [this].concat(args));
                this['some-component'] = 'not-some-component';
                this['some-prop'] = 'some-prop';
            }

            return MyComponent;
        })(Component);

        var SomeComponent = (function (_Component5) {
            _inherits(SomeComponent, _Component5);

            function SomeComponent() {
                _classCallCheck(this, SomeComponent);

                _Component5.apply(this, arguments);
            }

            return SomeComponent;
        })(Component);

        env.registerCurlyComponent('my-component', MyComponent, '{{some-prop}} {{some-component}}');
        env.registerCurlyComponent('some-component', SomeComponent, 'some-component');
        appendViewFor('{{my-component}}');
        assertAppended('<div>some-prop <div>some-component</div></div>');
    });
    QUnit.skip('rerendering component with attrs from parent', function () {
        var NonBlock = (function (_Component6) {
            _inherits(NonBlock, _Component6);

            function NonBlock() {
                _classCallCheck(this, NonBlock);

                _Component6.apply(this, arguments);
            }

            return NonBlock;
        })(Component);

        var hooks = env.registerCurlyComponent('non-block', NonBlock, 'In layout - someProp: {{someProp}}').hooks;
        appendViewFor('{{non-block someProp=someProp}}', { someProp: 'wycats' });
        assertFired(hooks, 'didReceiveAttrs');
        assertFired(hooks, 'willRender');
        assertFired(hooks, 'didInsertElement');
        assertFired(hooks, 'didRender');
        assertAppended('<div>In layout - someProp: wycats</div>');
        _glimmerReference.setProperty(view, 'someProp', 'tomdale');
        rerender();
        assertAppended('<div>In layout - someProp: tomdale</div>');
        assertFired(hooks, 'didReceiveAttrs', 2);
        assertFired(hooks, 'willUpdate');
        assertFired(hooks, 'willRender', 2);
        assertFired(hooks, 'didUpdate');
        assertFired(hooks, 'didRender', 2);
        rerender();
        assertAppended('<div>In layout - someProp: tomdale</div>');
        assertFired(hooks, 'didReceiveAttrs', 3);
        assertFired(hooks, 'willUpdate', 2);
        assertFired(hooks, 'willRender', 3);
        assertFired(hooks, 'didUpdate', 2);
        assertFired(hooks, 'didRender', 3);
    });
    // QUnit.skip('[DEPRECATED] non-block with properties on self', function() {
    //   // TODO: attrs
    //   // expectDeprecation("You accessed the `someProp` attribute directly. Please use `attrs.someProp` instead.");
    //   registry.register('template:components/non-block', compile('In layout - someProp: {{someProp}}'));
    //   view = EmberView.extend({
    //     template: compile('{{non-block someProp="something here"}}'),
    //     container: container
    //   }).create();
    //   runAppend(view);
    //   equal(jQuery('#qunit-fixture').text(), 'In layout - someProp: something here');
    // });
    // QUnit.skip('[DEPRECATED] block with properties on self', function() {
    //   // TODO: attrs
    //   // expectDeprecation("You accessed the `someProp` attribute directly. Please use `attrs.someProp` instead.");
    //   registry.register('template:components/with-block', compile('In layout - someProp: {{someProp}} - {{yield}}'));
    //   view = EmberView.extend({
    //     template: compile('{{#with-block someProp="something here"}}In template{{/with-block}}'),
    //     container: container
    //   }).create();
    //   runAppend(view);
    //   equal(jQuery('#qunit-fixture').text(), 'In layout - someProp: something here - In template');
    // });
    //   QUnit.skip('moduleName is available on _renderNode when a layout is present', function() {
    //     expect(1);
    //     var layoutModuleName = 'my-app-name/templates/components/sample-component';
    //     var sampleComponentLayout = compile('<sample-component>Sample Component - {{yield}}</sample-component>', {
    //       moduleName: layoutModuleName
    //     });
    //     registry.register('template:components/sample-component', sampleComponentLayout);
    //     registry.register('component:sample-component', GlimmerComponent.extend({
    //       didInsertElement: function() {
    //         equal(this._renderNode.lastResult.template.meta.moduleName, layoutModuleName);
    //       }
    //     }));
    //     view = EmberView.extend({
    //       layout: compile('<sample-component />'),
    //       container
    //     }).create();
    //     runAppend(view);
    //   });
    //   QUnit.skip('moduleName is available on _renderNode when no layout is present', function() {
    //     expect(1);
    //     var templateModuleName = 'my-app-name/templates/application';
    //     registry.register('component:sample-component', Component.extend({
    //       didInsertElement: function() {
    //         equal(this._renderNode.lastResult.template.meta.moduleName, templateModuleName);
    //       }
    //     }));
    //     view = EmberView.extend({
    //       layout: compile('{{#sample-component}}Derp{{/sample-component}}', {
    //         moduleName: templateModuleName
    //       }),
    //       container
    //     }).create();
    //     runAppend(view);
    //   });
    // QUnit.skip('component without dash is not looked up', function() {
    //   expect(1);
    //   registry.register('template:components/somecomponent', compile('somecomponent'));
    //   view = EmberView.extend({
    //     template: compile('{{somecomponent}}'),
    //     container: container,
    //     context: {
    //       'somecomponent': 'notsomecomponent'
    //     }
    //   }).create();
    //   runAppend(view);
    //   equal(jQuery('#qunit-fixture').text(), 'notsomecomponent');
    // });
    // QUnit.skip(`partials templates should not be treated like a component layout for ${style.name}`, function() {
    //   registry.register('template:_zomg', compile(`<p>In partial</p>`));
    //   registry.register('template:components/non-block', compile(`<${style.tagName}>{{partial "zomg"}}</${style.tagName}>`));
    //   view = appendViewFor('<non-block />');
    //   let el = view.$(style.tagName).find('p');
    //   equal(el.length, 1, 'precond - the partial was rendered');
    //   equal(el.text(), 'In partial');
    //   strictEqual(el.attr('id'), undefined, 'the partial should not get an id');
    //   strictEqual(el.attr('class'), undefined, 'the partial should not get a class');
    // });
    //   QUnit.skip('[FRAGMENT] non-block rendering a fragment', function() {
    //     registry.register('template:components/non-block', compile('<p>{{attrs.first}}</p><p>{{attrs.second}}</p>'));
    //     view = appendViewFor('<non-block first={{view.first}} second={{view.second}} />', {
    //       first: 'first1',
    //       second: 'second1'
    //     });
    //     equal(view.$().html(), '<p>first1</p><p>second1</p>', 'No wrapping element was created');
    //     run(view, 'setProperties', {
    //       first: 'first2',
    //       second: 'second2'
    //     });
    //     equal(view.$().html(), '<p>first2</p><p>second2</p>', 'The fragment was updated');
    //   });
    // // TODO: When un-skipping, fix this so it handles all styles
    // QUnit.skip('non-block recursive invocations with outer attributes replaced with a div shadows inner attributes', function() {
    //   registry.register('template:components/non-block-wrapper', compile('<non-block />'));
    //   registry.register('template:components/non-block', compile('<div data-static="static" data-dynamic="{{internal}}" />'));
    //   view = appendViewFor('<non-block-wrapper data-static="outer" data-dynamic="outer" />');
    //   equal(view.$('div').attr('data-static'), 'outer', 'the outer-most attribute wins');
    //   equal(view.$('div').attr('data-dynamic'), 'outer', 'the outer-most attribute wins');
    //   let component = view.childViews[0].childViews[0]; // HAX
    //   run(() => component.set('internal', 'changed'));
    //   equal(view.$('div').attr('data-static'), 'outer', 'the outer-most attribute wins');
    //   equal(view.$('div').attr('data-dynamic'), 'outer', 'the outer-most attribute wins');
    // });
    // QUnit.skip('components should receive the viewRegistry from the parent view', function() {
    //   var outer, innerTemplate, innerLayout;
    //   var viewRegistry = {};
    //   registry.register('component:x-outer', Component.extend({
    //     init() {
    //       this._super(...arguments);
    //       outer = this;
    //     }
    //   }));
    //   registry.register('component:x-inner-in-template', Component.extend({
    //     init() {
    //       this._super(...arguments);
    //       innerTemplate = this;
    //     }
    //   }));
    //   registry.register('component:x-inner-in-layout', Component.extend({
    //     init() {
    //       this._super(...arguments);
    //       innerLayout = this;
    //     }
    //   }));
    //   registry.register('template:components/x-outer', compile('{{x-inner-in-layout}}{{yield}}'));
    //   view = EmberView.extend({
    //     _viewRegistry: viewRegistry,
    //     template: compile('{{#x-outer}}{{x-inner-in-template}}{{/x-outer}}'),
    //     container: container
    //   }).create();
    //   runAppend(view);
    //   equal(innerTemplate._viewRegistry, viewRegistry);
    //   equal(innerLayout._viewRegistry, viewRegistry);
    //   equal(outer._viewRegistry, viewRegistry);
    // });
    // QUnit.skip('comopnent should rerender when a property is changed during children\'s rendering', function() {
    //   expectDeprecation(/modified value twice in a single render/);
    //   var outer, middle;
    //   registry.register('component:x-outer', Component.extend({
    //     value: 1,
    //     grabReference: Ember.on('init', function() {
    //       outer = this;
    //     })
    //   }));
    //   registry.register('component:x-middle', Component.extend({
    //     value: null,
    //     grabReference: Ember.on('init', function() {
    //       middle = this;
    //     })
    //   }));
    //   registry.register('component:x-inner', Component.extend({
    //     value: null,
    //     pushDataUp: Ember.observer('value', function() {
    //       middle.set('value', this.get('value'));
    //     })
    //   }));
    //   registry.register('template:components/x-outer', compile('{{#x-middle}}{{x-inner value=value}}{{/x-middle}}'));
    //   registry.register('template:components/x-middle', compile('<div id="middle-value">{{value}}</div>{{yield}}'));
    //   registry.register('template:components/x-inner', compile('<div id="inner-value">{{value}}</div>'));
    //   view = EmberView.extend({
    //     template: compile('{{x-outer}}'),
    //     container: container
    //   }).create();
    //   runAppend(view);
    //   equal(view.$('#inner-value').text(), '1', 'initial render of inner');
    //   equal(view.$('#middle-value').text(), '', 'initial render of middle (observers do not run during init)');
    //   run(() => outer.set('value', 2));
    //   equal(view.$('#inner-value').text(), '2', 'second render of inner');
    //   equal(view.$('#middle-value').text(), '2', 'second render of middle');
    //   run(() => outer.set('value', 3));
    //   equal(view.$('#inner-value').text(), '3', 'third render of inner');
    //   equal(view.$('#middle-value').text(), '3', 'third render of middle');
    // });
    // QUnit.skip('moduleName is available on _renderNode when a layout is present', function() {
    //   expect(1);
    //   var layoutModuleName = 'my-app-name/templates/components/sample-component';
    //   var sampleComponentLayout = compile('Sample Component - {{yield}}', {
    //     moduleName: layoutModuleName
    //   });
    //   registry.register('template:components/sample-component', sampleComponentLayout);
    //   registry.register('component:sample-component', Component.extend({
    //     didInsertElement: function() {
    //       equal(this._renderNode.lastResult.template.meta.moduleName, layoutModuleName);
    //     }
    //   }));
    //   view = EmberView.extend({
    //     layout: compile('{{sample-component}}'),
    //     container
    //   }).create();
    //   runAppend(view);
    // });
    // QUnit.skip('moduleName is available on _renderNode when no layout is present', function() {
    //   expect(1);
    //   var templateModuleName = 'my-app-name/templates/application';
    //   registry.register('component:sample-component', Component.extend({
    //     didInsertElement: function() {
    //       equal(this._renderNode.lastResult.template.meta.moduleName, templateModuleName);
    //     }
    //   }));
    //   view = EmberView.extend({
    //     layout: compile('{{#sample-component}}Derp{{/sample-component}}', {
    //       moduleName: templateModuleName
    //     }),
    //     container
    //   }).create();
    //   runAppend(view);
    // });
    // QUnit.skip('`template` specified in a component is overridden by block', function() {
    //   expect(1);
    //   registry.register('component:with-block', Component.extend({
    //     layout: compile('{{yield}}'),
    //     template: compile('Oh, noes!')
    //   }));
    //   view = EmberView.extend({
    //     template: compile('{{#with-block}}Whoop, whoop!{{/with-block}}'),
    //     container: container
    //   }).create();
    //   runAppend(view);
    //   equal(view.$().text(), 'Whoop, whoop!', 'block provided always overrides template property');
    // });
});

enifed("extern", ["exports"], function (exports) {
  "use strict";
});

enifed("glimmer-demos/index", ["exports", "glimmer-runtime", "glimmer-compiler", "glimmer-util", "glimmer-reference"], function (exports, _glimmerRuntime, _glimmerCompiler, _glimmerUtil, _glimmerReference) {
    "use strict";

    exports.compile = compile;
    exports.equalsElement = equalsElement;
    exports.equalsAttr = equalsAttr;
    exports.equals = equals;
    exports.regex = regex;
    exports.classes = classes;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    function compile(template) {
        return _glimmerCompiler.compile(template, { disableComponentGeneration: true });
    }

    var hooks = {
        begin: function () {},
        commit: function () {},
        didReceiveAttrs: function (component) {
            if (typeof component.didReceiveAttrs === 'function') component.didReceiveAttrs();
        },
        didInsertElement: function (component) {
            if (typeof component.didInsertElement === 'function') component.didInsertElement();
        },
        didRender: function (component) {
            if (typeof component.didRender === 'function') component.didRender();
        },
        willRender: function (component) {
            if (typeof component.willRender === 'function') component.willRender();
        },
        willUpdate: function (component) {
            if (typeof component.willUpdate === 'function') component.willUpdate();
        },
        didUpdate: function (component) {
            if (typeof component.didUpdate === 'function') component.didUpdate();
        },
        didUpdateAttrs: function (component) {
            if (typeof component.didUpdateAttrs === 'function') component.didUpdateAttrs();
        }
    };

    var TestEnvironment = (function (_Environment) {
        _inherits(TestEnvironment, _Environment);

        function TestEnvironment() {
            var doc = arguments.length <= 0 || arguments[0] === undefined ? document : arguments[0];

            _classCallCheck(this, TestEnvironment);

            _Environment.call(this, new _glimmerRuntime.DOMHelper(doc), _glimmerReference.Meta);
            this.helpers = {};
            this.components = _glimmerUtil.dict();
        }

        TestEnvironment.prototype.registerHelper = function registerHelper(name, helper) {
            this.helpers[name] = helper;
        };

        TestEnvironment.prototype.registerComponent = function registerComponent(name, definition) {
            this.components[name] = definition;
            return definition;
        };

        TestEnvironment.prototype.registerGlimmerComponent = function registerGlimmerComponent(name, Component, layout) {
            var testHooks = new HookIntrospection(hooks);
            var definition = new GlimmerComponentDefinition(testHooks, Component, compile(layout).raw, GlimmerComponentInvocation);
            return this.registerComponent(name, definition);
        };

        TestEnvironment.prototype.registerEmberishComponent = function registerEmberishComponent(name, Component, layout) {
            var testHooks = new HookIntrospection(hooks);
            var definition = new EmberishComponentDefinition(testHooks, Component, compile(layout).raw, GlimmerComponentInvocation);
            return this.registerComponent(name, definition);
        };

        TestEnvironment.prototype.registerEmberishGlimmerComponent = function registerEmberishGlimmerComponent(name, Component, layout) {
            var testHooks = new HookIntrospection(hooks);
            var definition = new EmberishGlimmerComponentDefinition(testHooks, Component, compile(layout).raw, GlimmerComponentInvocation);
            return this.registerComponent(name, definition);
        };

        TestEnvironment.prototype.registerCurlyComponent = function registerCurlyComponent() {
            throw new Error("Curly components not yet implemented");
        };

        TestEnvironment.prototype.statement = function statement(_statement) {
            var type = _statement.type;
            var block = type === 'block' ? _statement : null;
            var append = type === 'append' ? _statement : null;
            var named = undefined;
            var args = undefined;
            var path = undefined;
            var unknown = undefined;
            var helper = undefined;
            if (block) {
                args = block.args;
                named = args.named;
                path = block.path;
            } else if (append && append.value.type === 'unknown') {
                unknown = append.value;
                args = _glimmerRuntime.ArgsSyntax.empty();
                named = _glimmerRuntime.NamedArgsSyntax.empty();
                path = unknown.ref.path();
            } else if (append && append.value.type === 'helper') {
                helper = append.value;
                args = helper.args;
                named = args.named;
                path = helper.ref.path();
            }
            var key = undefined,
                isSimple = undefined;
            if (path) {
                isSimple = path.length === 1;
                key = path[0];
            }
            if (isSimple && block) {
                switch (key) {
                    case 'identity':
                        return new IdentitySyntax({ args: block.args, templates: block.templates });
                    case 'render-inverse':
                        return new RenderInverseIdentitySyntax({ args: block.args, templates: block.templates });
                    case 'each':
                        return new EachSyntax({ args: block.args, templates: block.templates });
                    case 'if':
                        return new IfSyntax({ args: block.args, templates: block.templates });
                    case 'with':
                        return new WithSyntax({ args: block.args, templates: block.templates });
                }
            }
            if (isSimple && (append || block)) {
                var component = this.getComponentDefinition(path, _statement);
                if (component) {
                    return new CurlyComponent({ args: args, component: component, templates: block && block.templates });
                }
            }
            return _Environment.prototype.statement.call(this, _statement);
        };

        TestEnvironment.prototype.hasHelper = function hasHelper(helperName) {
            return helperName.length === 1 && helperName[0] in this.helpers;
        };

        TestEnvironment.prototype.lookupHelper = function lookupHelper(helperParts) {
            var helperName = helperParts[0];
            var helper = this.helpers[helperName];
            if (!helper) throw new Error("Helper for " + helperParts.join('.') + " not found.");
            return this.helpers[helperName];
        };

        TestEnvironment.prototype.getComponentDefinition = function getComponentDefinition(name, syntax) {
            return this.components[name[0]];
        };

        return TestEnvironment;
    })(_glimmerRuntime.Environment);

    exports.TestEnvironment = TestEnvironment;

    var CurlyComponent = (function (_StatementSyntax) {
        _inherits(CurlyComponent, _StatementSyntax);

        function CurlyComponent(_ref) {
            var args = _ref.args;
            var component = _ref.component;
            var templates = _ref.templates;

            _classCallCheck(this, CurlyComponent);

            _StatementSyntax.call(this);
            this.args = args;
            this.component = component;
            this.templates = templates;
        }

        CurlyComponent.prototype.compile = function compile(compiler) {
            var lookup = this.getLookup();
            compiler.append(new _glimmerRuntime.OpenComponentOpcode(this.component.compile(lookup, this.templates), this.getArgs().compile(compiler)));
        };

        CurlyComponent.prototype.getLookup = function getLookup() {
            return {
                args: this.args,
                syntax: new _glimmerUtil.LinkedList(),
                named: this.getNamed(),
                locals: null
            };
        };

        CurlyComponent.prototype.getArgs = function getArgs() {
            var original = this.args.named.map;
            var map = _glimmerUtil.dict();
            Object.keys(original).forEach(function (a) {
                map["@" + a] = original[a];
            });
            return _glimmerRuntime.ArgsSyntax.fromHash(_glimmerRuntime.NamedArgsSyntax.build(map));
        };

        CurlyComponent.prototype.getNamed = function getNamed() {
            return this.args.named.keys;
        };

        return CurlyComponent;
    })(_glimmerRuntime.StatementSyntax);

    var HookIntrospection = (function () {
        function HookIntrospection(hooks) {
            _classCallCheck(this, HookIntrospection);

            this.hooks = {};
            this.inner = hooks;
        }

        HookIntrospection.prototype.begin = function begin(component) {
            this.hooks = {};
            this.inner.begin(component);
        };

        HookIntrospection.prototype.commit = function commit(component) {
            this.inner.commit(component);
        };

        HookIntrospection.prototype.didReceiveAttrs = function didReceiveAttrs(component) {
            this.initialize('didReceiveAttrs').push(component);
            this.inner.didReceiveAttrs(component);
        };

        HookIntrospection.prototype.didUpdateAttrs = function didUpdateAttrs(component) {
            this.initialize('didUpdateAttrs').push(component);
            this.inner.didUpdateAttrs(component);
        };

        HookIntrospection.prototype.didInsertElement = function didInsertElement(component) {
            this.initialize('didInsertElement').push(component);
            this.inner.didInsertElement(component);
        };

        HookIntrospection.prototype.willRender = function willRender(component) {
            this.initialize('willRender').push(component);
            this.inner.willRender(component);
        };

        HookIntrospection.prototype.willUpdate = function willUpdate(component) {
            this.initialize('willUpdate').push(component);
            this.inner.willUpdate(component);
        };

        HookIntrospection.prototype.didRender = function didRender(component) {
            this.initialize('didRender').push(component);
            this.inner.didRender(component);
        };

        HookIntrospection.prototype.didUpdate = function didUpdate(component) {
            this.initialize('didUpdate').push(component);
            this.inner.didUpdate(component);
        };

        HookIntrospection.prototype.initialize = function initialize(name) {
            return this.hooks[name] = this.hooks[name] || [];
        };

        return HookIntrospection;
    })();

    exports.HookIntrospection = HookIntrospection;

    var GlimmerComponentDefinition = (function (_ComponentDefinition) {
        _inherits(GlimmerComponentDefinition, _ComponentDefinition);

        function GlimmerComponentDefinition() {
            _classCallCheck(this, GlimmerComponentDefinition);

            _ComponentDefinition.apply(this, arguments);
        }

        GlimmerComponentDefinition.prototype.compile = function compile(_ref2, templates) {
            var syntax = _ref2.syntax;
            var args = _ref2.args;
            var named = _ref2.named;

            var layout = this.templateWithAttrs(syntax, args, named);
            return new GlimmerComponentInvocation(templates, layout);
        };

        GlimmerComponentDefinition.prototype.templateWithAttrs = function templateWithAttrs(attrs, args, named) {
            return this.layout.cloneWith(function (program, table) {
                var toSplice = _glimmerUtil.ListSlice.toList(attrs);
                var current = program.head();
                table.putNamed(named);
                while (current) {
                    var next = program.nextNode(current);
                    if (current.type === 'open-element' || current.type === 'open-primitive-element') {
                        program.spliceList(toSplice, program.nextNode(current));
                        break;
                    }
                    current = next;
                }
            });
        };

        return GlimmerComponentDefinition;
    })(_glimmerRuntime.ComponentDefinition);

    var EMBER_VIEW = new _glimmerRuntime.ValueSyntax('ember-view');
    var id = 1;

    var EmberishComponentDefinition = (function (_ComponentDefinition2) {
        _inherits(EmberishComponentDefinition, _ComponentDefinition2);

        function EmberishComponentDefinition() {
            _classCallCheck(this, EmberishComponentDefinition);

            _ComponentDefinition2.apply(this, arguments);
        }

        EmberishComponentDefinition.prototype.compile = function compile(_ref3, templates) {
            var args = _ref3.args;
            var locals = _ref3.locals;
            var named = _ref3.named;

            var layout = this.templateWithAttrs(args, named);
            if (locals) throw new Error("Positional arguments not supported");
            return new EmberishComponentInvocation(templates, layout);
        };

        EmberishComponentDefinition.prototype.templateWithAttrs = function templateWithAttrs(args, named) {
            return this.layout.cloneWith(function (program, table) {
                var toSplice = new _glimmerUtil.LinkedList();
                toSplice.append(new _glimmerRuntime.AddClass({ value: EMBER_VIEW }));
                toSplice.append(new _glimmerRuntime.StaticAttr({ name: 'id', value: "ember" + id++ }));
                var named = args.named.map;
                Object.keys(named).forEach(function (name) {
                    var attr = undefined;
                    var value = named[name];
                    if (name === 'class') {
                        attr = new _glimmerRuntime.AddClass({ value: value });
                    } else if (name === 'id') {
                        attr = new _glimmerRuntime.DynamicAttr({ name: name, value: value, namespace: null });
                    } else if (name === 'ariaRole') {
                        attr = new _glimmerRuntime.DynamicAttr({ name: 'role', value: value, namespace: null });
                    } else {
                        return;
                    }
                    toSplice.append(attr);
                });
                var head = program.head();
                program.insertBefore(new _glimmerRuntime.OpenPrimitiveElementSyntax({ tag: 'div' }), head);
                program.spliceList(toSplice, program.nextNode(head));
                program.append(new _glimmerRuntime.CloseElementSyntax());
            });
        };

        return EmberishComponentDefinition;
    })(_glimmerRuntime.ComponentDefinition);

    var EmberishGlimmerComponentDefinition = (function (_ComponentDefinition3) {
        _inherits(EmberishGlimmerComponentDefinition, _ComponentDefinition3);

        function EmberishGlimmerComponentDefinition() {
            _classCallCheck(this, EmberishGlimmerComponentDefinition);

            _ComponentDefinition3.apply(this, arguments);
        }

        EmberishGlimmerComponentDefinition.prototype.compile = function compile(_ref4, templates) {
            var syntax = _ref4.syntax;
            var args = _ref4.args;
            var named = _ref4.named;

            var layout = this.templateWithAttrs(syntax, args, named);
            return new GlimmerComponentInvocation(templates, layout);
        };

        EmberishGlimmerComponentDefinition.prototype.templateWithAttrs = function templateWithAttrs(attrs, args, named) {
            return this.layout.cloneWith(function (program, table) {
                var toSplice = _glimmerUtil.ListSlice.toList(attrs);
                toSplice.append(new _glimmerRuntime.AddClass({ value: EMBER_VIEW }));
                if (!args.named.has('@id')) {
                    toSplice.append(new _glimmerRuntime.StaticAttr({ name: 'id', value: "ember" + id++ }));
                }
                table.putNamed(named);
                var current = program.head();
                while (current) {
                    var next = program.nextNode(current);
                    if (current.type === 'open-element' || current.type === 'open-primitive-element') {
                        program.spliceList(toSplice, program.nextNode(current));
                        break;
                    }
                    current = next;
                }
            });
        };

        return EmberishGlimmerComponentDefinition;
    })(_glimmerRuntime.ComponentDefinition);

    var GlimmerComponentInvocation = function GlimmerComponentInvocation(templates, layout) {
        _classCallCheck(this, GlimmerComponentInvocation);

        this.templates = templates;
        this.layout = layout;
    };

    var EmberishComponentInvocation = function EmberishComponentInvocation(templates, layout) {
        _classCallCheck(this, EmberishComponentInvocation);

        this.templates = templates;
        this.layout = layout;
    };

    var EmberishGlimmrComponentInvocation = function EmberishGlimmrComponentInvocation(templates, layout) {
        _classCallCheck(this, EmberishGlimmrComponentInvocation);

        this.templates = templates;
        this.layout = layout;
    };

    var EachSyntax = (function (_StatementSyntax2) {
        _inherits(EachSyntax, _StatementSyntax2);

        function EachSyntax(_ref5) {
            var args = _ref5.args;
            var templates = _ref5.templates;

            _classCallCheck(this, EachSyntax);

            _StatementSyntax2.call(this);
            this.type = "each-statement";
            this.isStatic = false;
            this.args = args;
            this.templates = templates;
        }

        EachSyntax.prototype.prettyPrint = function prettyPrint() {
            return "#each " + this.args.prettyPrint();
        };

        EachSyntax.prototype.compile = function compile(compiler) {
            //        PutArgs
            //        EnterList(BEGIN, END)
            // ITER:  Noop
            //        NextIter(BREAK)
            //        EnterWithKey(BEGIN, END)
            // BEGIN: Noop
            //        PushChildScope
            //        Evaluate(default)
            //        PopScope
            // END:   Noop
            //        Exit
            //        Jump(ITER)
            // BREAK: Noop
            //        ExitList
            var BEGIN = new _glimmerRuntime.NoopOpcode("BEGIN");
            var ITER = new _glimmerRuntime.NoopOpcode("ITER");
            var BREAK = new _glimmerRuntime.NoopOpcode("BREAK");
            var END = new _glimmerRuntime.NoopOpcode("END");
            compiler.append(new _glimmerRuntime.PutArgsOpcode(this.args.compile(compiler)));
            compiler.append(new _glimmerRuntime.EnterListOpcode(BEGIN, END));
            compiler.append(ITER);
            compiler.append(new _glimmerRuntime.NextIterOpcode(BREAK));
            compiler.append(new _glimmerRuntime.EnterWithKeyOpcode(BEGIN, END));
            compiler.append(BEGIN);
            compiler.append(new _glimmerRuntime.PushChildScopeOpcode());
            compiler.append(new _glimmerRuntime.EvaluateOpcode(this.templates.default.raw));
            compiler.append(new _glimmerRuntime.PopScopeOpcode());
            compiler.append(END);
            compiler.append(new _glimmerRuntime.ExitOpcode());
            compiler.append(new _glimmerRuntime.JumpOpcode(ITER));
            compiler.append(BREAK);
            compiler.append(new _glimmerRuntime.ExitListOpcode());
        };

        return EachSyntax;
    })(_glimmerRuntime.StatementSyntax);

    var IdentitySyntax = (function (_StatementSyntax3) {
        _inherits(IdentitySyntax, _StatementSyntax3);

        function IdentitySyntax(_ref6) {
            var args = _ref6.args;
            var templates = _ref6.templates;

            _classCallCheck(this, IdentitySyntax);

            _StatementSyntax3.call(this);
            this.type = "identity";
            this.args = args;
            this.templates = templates;
        }

        IdentitySyntax.prototype.compile = function compile(compiler) {
            compiler.append(new _glimmerRuntime.EvaluateOpcode(this.templates.default.raw));
        };

        return IdentitySyntax;
    })(_glimmerRuntime.StatementSyntax);

    var RenderInverseIdentitySyntax = (function (_StatementSyntax4) {
        _inherits(RenderInverseIdentitySyntax, _StatementSyntax4);

        function RenderInverseIdentitySyntax(_ref7) {
            var args = _ref7.args;
            var templates = _ref7.templates;

            _classCallCheck(this, RenderInverseIdentitySyntax);

            _StatementSyntax4.call(this);
            this.type = "render-inverse-identity";
            this.args = args;
            this.templates = templates;
        }

        RenderInverseIdentitySyntax.prototype.compile = function compile(compiler) {
            compiler.append(new _glimmerRuntime.EvaluateOpcode(this.templates.inverse.raw));
        };

        return RenderInverseIdentitySyntax;
    })(_glimmerRuntime.StatementSyntax);

    var IfSyntax = (function (_StatementSyntax5) {
        _inherits(IfSyntax, _StatementSyntax5);

        function IfSyntax(_ref8) {
            var args = _ref8.args;
            var templates = _ref8.templates;

            _classCallCheck(this, IfSyntax);

            _StatementSyntax5.call(this);
            this.type = "if-statement";
            this.isStatic = false;
            this.args = args;
            this.templates = templates;
        }

        IfSyntax.prototype.prettyPrint = function prettyPrint() {
            return "#if " + this.args.prettyPrint();
        };

        IfSyntax.prototype.compile = function compile(compiler) {
            //        Enter(BEGIN, END)
            // BEGIN: Noop
            //        PutArgs
            //        Test
            //        JumpUnless(ELSE)
            //        Evaluate(default)
            //        Jump(END)
            // ELSE:  Noop
            //        Evalulate(inverse)
            // END:   Noop
            //        Exit
            var BEGIN = new _glimmerRuntime.NoopOpcode("BEGIN");
            var ELSE = new _glimmerRuntime.NoopOpcode("ELSE");
            var END = new _glimmerRuntime.NoopOpcode("END");
            compiler.append(new _glimmerRuntime.EnterOpcode(BEGIN, END));
            compiler.append(BEGIN);
            compiler.append(new _glimmerRuntime.PutArgsOpcode(this.args.compile(compiler)));
            compiler.append(new _glimmerRuntime.TestOpcode());
            if (this.templates.inverse) {
                compiler.append(new _glimmerRuntime.JumpUnlessOpcode(ELSE));
                compiler.append(new _glimmerRuntime.EvaluateOpcode(this.templates.default.raw));
                compiler.append(new _glimmerRuntime.JumpOpcode(END));
                compiler.append(ELSE);
                compiler.append(new _glimmerRuntime.EvaluateOpcode(this.templates.inverse.raw));
            } else {
                compiler.append(new _glimmerRuntime.JumpUnlessOpcode(END));
                compiler.append(new _glimmerRuntime.EvaluateOpcode(this.templates.default.raw));
            }
            compiler.append(END);
            compiler.append(new _glimmerRuntime.ExitOpcode());
        };

        return IfSyntax;
    })(_glimmerRuntime.StatementSyntax);

    var WithSyntax = (function (_StatementSyntax6) {
        _inherits(WithSyntax, _StatementSyntax6);

        function WithSyntax(_ref9) {
            var args = _ref9.args;
            var templates = _ref9.templates;

            _classCallCheck(this, WithSyntax);

            _StatementSyntax6.call(this);
            this.type = "with-statement";
            this.isStatic = false;
            this.args = args;
            this.templates = templates;
        }

        WithSyntax.prototype.prettyPrint = function prettyPrint() {
            return "#with " + this.args.prettyPrint();
        };

        WithSyntax.prototype.compile = function compile(compiler) {
            //        Enter(BEGIN, END)
            // BEGIN: Noop
            //        PutArgs
            //        Test
            //        JumpUnless(ELSE)
            //        Evaluate(default)
            //        Jump(END)
            // ELSE:  Noop
            //        Evaluate(inverse)
            // END:   Noop
            //        Exit
            var BEGIN = new _glimmerRuntime.NoopOpcode("BEGIN");
            var ELSE = new _glimmerRuntime.NoopOpcode("ELSE");
            var END = new _glimmerRuntime.NoopOpcode("END");
            compiler.append(new _glimmerRuntime.EnterOpcode(BEGIN, END));
            compiler.append(BEGIN);
            compiler.append(new _glimmerRuntime.PutArgsOpcode(this.args.compile(compiler)));
            compiler.append(new _glimmerRuntime.TestOpcode());
            if (this.templates.inverse) {
                compiler.append(new _glimmerRuntime.JumpUnlessOpcode(ELSE));
            } else {
                compiler.append(new _glimmerRuntime.JumpUnlessOpcode(END));
            }
            compiler.append(new _glimmerRuntime.EvaluateOpcode(this.templates.default.raw));
            compiler.append(new _glimmerRuntime.JumpOpcode(END));
            if (this.templates.inverse) {
                compiler.append(ELSE);
                compiler.append(new _glimmerRuntime.EvaluateOpcode(this.templates.inverse.raw));
            }
            compiler.append(END);
            compiler.append(new _glimmerRuntime.ExitOpcode());
        };

        return WithSyntax;
    })(_glimmerRuntime.StatementSyntax);

    function equalsElement(element, tagName, attributes, content) {
        QUnit.push(element.tagName === tagName.toUpperCase(), element.tagName.toLowerCase(), tagName, "expect tagName to be " + tagName);
        var expectedAttrs = _glimmerUtil.dict();
        var expectedCount = 0;
        for (var prop in attributes) {
            expectedCount++;
            var expected = attributes[prop];
            var matcher = typeof expected === 'object' && MATCHER in expected ? expected : equalsAttr(expected);
            expectedAttrs[prop] = matcher;
            QUnit.push(expectedAttrs[prop].match(element.getAttribute(prop)), matcher.fail(element.getAttribute(prop)), matcher.fail(element.getAttribute(prop)), "Expected element's " + prop + " attribute " + matcher.expected());
        }
        var actualAttributes = {};
        for (var i = 0, l = element.attributes.length; i < l; i++) {
            actualAttributes[element.attributes[i].name] = element.attributes[i].value;
        }
        if (!(element instanceof HTMLElement)) {
            QUnit.push(element instanceof HTMLElement, null, null, "Element must be an HTML Element, not an SVG Element");
        } else {
            QUnit.push(element.attributes.length === expectedCount, element.attributes.length, expectedCount, "Expected " + expectedCount + " attributes; got " + element.outerHTML);
            if (content !== null) {
                QUnit.push(element.innerHTML === content, element.innerHTML, content, "The element had '" + content + "' as its content");
            }
        }
    }

    var MATCHER = "3d4ef194-13be-4ccf-8dc7-862eea02c93e";
    exports.MATCHER = MATCHER;

    function equalsAttr(expected) {
        return {
            "3d4ef194-13be-4ccf-8dc7-862eea02c93e": true,
            match: function (actual) {
                return expected[0] === '"' && expected.slice(-1) === '"' && expected.slice(1, -1) === actual;
            },
            expected: function () {
                return "to equal " + expected.slice(1, -1);
            },
            fail: function (actual) {
                return actual + " did not equal " + expected.slice(1, -1);
            }
        };
    }

    function equals(expected) {
        return {
            "3d4ef194-13be-4ccf-8dc7-862eea02c93e": true,
            match: function (actual) {
                return expected === actual;
            },
            expected: function () {
                return "to equal " + expected;
            },
            fail: function (actual) {
                return actual + " did not equal " + expected;
            }
        };
    }

    function regex(r) {
        return {
            "3d4ef194-13be-4ccf-8dc7-862eea02c93e": true,
            match: function (v) {
                return r.test(v);
            },
            expected: function () {
                return "to match " + r;
            },
            fail: function (actual) {
                return actual + " did not match " + r;
            }
        };
    }

    function classes(expected) {
        return {
            "3d4ef194-13be-4ccf-8dc7-862eea02c93e": true,
            match: function (actual) {
                return actual && expected.split(' ').sort().join(' ') === actual.split(' ').sort().join(' ');
            },
            expected: function () {
                return "to include '" + expected + "'";
            },
            fail: function (actual) {
                return "'" + actual + "'' did not match '" + expected + "'";
            }
        };
    }
});

enifed("glimmer-demos/stats", ["exports"], function (exports) {
    /*
    Note that if your data is too large, there _will_ be overflow.
    */
    "use strict";

    exports.default = Stats;
    function asc(a, b) {
        return a - b;
    }
    var config_params = {
        bucket_precision: function (o, s) {
            if (typeof s != "number" || s <= 0) {
                throw new Error("bucket_precision must be a positive number");
            }
            o._config.bucket_precision = s;
            o.buckets = [];
        },
        buckets: function (o, b) {
            if (!Array.isArray(b) || b.length == 0) {
                throw new Error("buckets must be an array of bucket limits");
            }
            o._config.buckets = b;
            o.buckets = [];
        },
        bucket_extension_interval: function (o, s) {
            if (s === undefined) return;
            if (typeof s != "number" || s <= 0) {
                throw new Error("bucket_extension_interval must be a positive number");
            }
            o._config.bucket_extension_interval = s;
        },
        store_data: function (o, s) {
            if (typeof s != "boolean") {
                throw new Error("store_data must be a true or false");
            }
            o._config.store_data = s;
        },
        sampling: function (o, s) {
            if (typeof s != "boolean") {
                throw new Error("sampling must be a true or false");
            }
            o._config.sampling = s;
        }
    };

    function Stats(c) {
        this._config = { store_data: true };
        if (c) {
            for (var k in config_params) {
                if (c.hasOwnProperty(k)) {
                    config_params[k](this, c[k]);
                }
            }
        }
        this.reset();
        return this;
    }

    Stats.prototype = {
        reset: function () {
            if (this._config.store_data) this.data = [];
            this.length = 0;
            this.sum = 0;
            this.sum_of_squares = 0;
            this.sum_of_logs = 0;
            this.sum_of_square_of_logs = 0;
            this.zeroes = 0;
            this.max = this.min = null;
            this._reset_cache();
            return this;
        },
        _reset_cache: function () {
            this._stddev = null;
            if (this._config.store_data) this._data_sorted = null;
        },
        _find_bucket: function (a) {
            var b = 0,
                e,
                l;
            if (this._config.buckets) {
                l = this._config.buckets.length;
                if (this._config.bucket_extension_interval && a >= this._config.buckets[l - 1]) {
                    e = a - this._config.buckets[l - 1];
                    b = parseInt(e / this._config.bucket_extension_interval) + l;
                    if (this._config.buckets[b] === undefined) this._config.buckets[b] = this._config.buckets[l - 1] + (parseInt(e / this._config.bucket_extension_interval) + 1) * this._config.bucket_extension_interval;
                    if (this._config.buckets[b - 1] === undefined) this._config.buckets[b - 1] = this._config.buckets[l - 1] + parseInt(e / this._config.bucket_extension_interval) * this._config.bucket_extension_interval;
                }
                for (; b < l; b++) {
                    if (a < this._config.buckets[b]) {
                        break;
                    }
                }
            } else if (this._config.bucket_precision) {
                b = Math.floor(a / this._config.bucket_precision);
            }
            return b;
        },
        _add_cache: function (a) {
            var tuple = [1],
                i;
            if (a instanceof Array) {
                tuple = a;
                a = tuple.shift();
            }
            this.sum += a * tuple[0];
            this.sum_of_squares += a * a * tuple[0];
            if (a === 0) {
                this.zeroes++;
            } else {
                this.sum_of_logs += Math.log(a) * tuple[0];
                this.sum_of_square_of_logs += Math.pow(Math.log(a), 2) * tuple[0];
            }
            this.length += tuple[0];
            if (tuple[0] > 0) {
                if (this.max === null || this.max < a) this.max = a;
                if (this.min === null || this.min > a) this.min = a;
            }
            if (this.buckets) {
                var b = this._find_bucket(a);
                if (!this.buckets[b]) this.buckets[b] = [0];
                this.buckets[b][0] += tuple.shift();
                for (i = 0; i < tuple.length; i++) this.buckets[b][i + 1] = (this.buckets[b][i + 1] | 0) + (tuple[i] | 0);
            }
            this._reset_cache();
        },
        _del_cache: function (a) {
            var tuple = [1],
                i;
            if (a instanceof Array) {
                tuple = a;
                a = tuple.shift();
            }
            this.sum -= a * tuple[0];
            this.sum_of_squares -= a * a * tuple[0];
            if (a === 0) {
                this.zeroes--;
            } else {
                this.sum_of_logs -= Math.log(a) * tuple[0];
                this.sum_of_square_of_logs -= Math.pow(Math.log(a), 2) * tuple[0];
            }
            this.length -= tuple[0];
            if (this._config.store_data) {
                if (this.length === 0) {
                    this.max = this.min = null;
                }
                if (this.length === 1) {
                    this.max = this.min = this.data[0];
                } else if (tuple[0] > 0 && (this.max === a || this.min === a)) {
                    var i = this.length - 1;
                    if (i >= 0) {
                        this.max = this.min = this.data[i--];
                        while (i-- >= 0) {
                            if (this.max < this.data[i]) this.max = this.data[i];
                            if (this.min > this.data[i]) this.min = this.data[i];
                        }
                    }
                }
            }
            if (this.buckets) {
                var b = this._find_bucket(a);
                if (this.buckets[b]) {
                    this.buckets[b][0] -= tuple.shift();
                    if (this.buckets[b][0] === 0) delete this.buckets[b];else for (i = 0; i < tuple.length; i++) this.buckets[b][i + 1] = (this.buckets[b][i + 1] | 0) - (tuple[i] | 0);
                }
            }
            this._reset_cache();
        },
        push: function () {
            var i,
                a,
                args = Array.prototype.slice.call(arguments, 0);
            if (args.length && args[0] instanceof Array) args = args[0];
            for (i = 0; i < args.length; i++) {
                a = args[i];
                if (this._config.store_data) this.data.push(a);
                this._add_cache(a);
            }
            return this;
        },
        push_tuple: function (tuple) {
            if (!this.buckets) {
                throw new Error("push_tuple is only valid when using buckets");
            }
            this._add_cache(tuple);
        },
        pop: function () {
            if (this.length === 0 || this._config.store_data === false) return undefined;
            var a = this.data.pop();
            this._del_cache(a);
            return a;
        },
        remove_tuple: function (tuple) {
            if (!this.buckets) {
                throw new Error("remove_tuple is only valid when using buckets");
            }
            this._del_cache(tuple);
        },
        reset_tuples: function (tuple) {
            var b,
                l,
                t,
                ts = tuple.length;
            if (!this.buckets) {
                throw new Error("reset_tuple is only valid when using buckets");
            }
            for (b = 0, l = this.buckets.length; b < l; b++) {
                if (!this.buckets[b] || this.buckets[b].length <= 1) {
                    continue;
                }
                for (t = 0; t < ts; t++) {
                    if (typeof tuple[t] !== 'undefined') {
                        this.buckets[b][t] = tuple[t];
                    }
                }
            }
        },
        unshift: function () {
            var i,
                a,
                args = Array.prototype.slice.call(arguments, 0);
            if (args.length && args[0] instanceof Array) args = args[0];
            i = args.length;
            while (i--) {
                a = args[i];
                if (this._config.store_data) this.data.unshift(a);
                this._add_cache(a);
            }
            return this;
        },
        shift: function () {
            if (this.length === 0 || this._config.store_data === false) return undefined;
            var a = this.data.shift();
            this._del_cache(a);
            return a;
        },
        amean: function () {
            if (this.length === 0) return NaN;
            return this.sum / this.length;
        },
        gmean: function () {
            if (this.length === 0) return NaN;
            if (this.zeroes > 0) return NaN;
            return Math.exp(this.sum_of_logs / this.length);
        },
        stddev: function () {
            if (this.length === 0) return NaN;
            var n = this.length;
            if (this._config.sampling) n--;
            if (this._stddev === null) this._stddev = Math.sqrt((this.length * this.sum_of_squares - this.sum * this.sum) / (this.length * n));
            return this._stddev;
        },
        gstddev: function () {
            if (this.length === 0) return NaN;
            if (this.zeroes > 0) return NaN;
            var n = this.length;
            if (this._config.sampling) n--;
            return Math.exp(Math.sqrt((this.length * this.sum_of_square_of_logs - this.sum_of_logs * this.sum_of_logs) / (this.length * n)));
        },
        moe: function () {
            if (this.length === 0) return NaN;
            // see http://en.wikipedia.org/wiki/Standard_error_%28statistics%29
            return 1.96 * this.stddev() / Math.sqrt(this.length);
        },
        range: function () {
            if (this.length === 0) return [NaN, NaN];
            return [this.min, this.max];
        },
        distribution: function () {
            if (this.length === 0) return [];
            if (!this.buckets) throw new Error("bucket_precision or buckets not configured.");
            var d = [],
                i,
                j,
                k,
                l;
            if (this._config.buckets) {
                j = this.min;
                l = Math.min(this.buckets.length, this._config.buckets.length);
                for (i = 0; i < l; j = this._config.buckets[i++]) {
                    if (this._config.buckets[i] === undefined && this._config.bucket_extension_interval) this._config.buckets[i] = this._config.buckets[i - 1] + this._config.bucket_extension_interval;
                    if (this.min > this._config.buckets[i]) continue;
                    d[i] = {
                        bucket: (j + this._config.buckets[i]) / 2,
                        range: [j, this._config.buckets[i]],
                        count: this.buckets[i] ? this.buckets[i][0] : 0,
                        tuple: this.buckets[i] ? this.buckets[i].slice(1) : []
                    };
                    if (this.max < this._config.buckets[i]) break;
                }
                if (i == l && this.buckets[i]) {
                    d[i] = {
                        bucket: (j + this.max) / 2,
                        range: [j, this.max],
                        count: this.buckets[i][0],
                        tuple: this.buckets[i] ? this.buckets[i].slice(1) : []
                    };
                }
            } else if (this._config.bucket_precision) {
                i = Math.floor(this.min / this._config.bucket_precision);
                l = Math.floor(this.max / this._config.bucket_precision) + 1;
                for (j = 0; i < l && i < this.buckets.length; i++, j++) {
                    if (!this.buckets[i]) {
                        continue;
                    }
                    d[j] = {
                        bucket: (i + 0.5) * this._config.bucket_precision,
                        range: [i * this._config.bucket_precision, (i + 1) * this._config.bucket_precision],
                        count: this.buckets[i][0],
                        tuple: this.buckets[i] ? this.buckets[i].slice(1) : []
                    };
                }
            }
            return d;
        },
        percentile: function (p) {
            if (this.length === 0 || !this._config.store_data && !this.buckets) return NaN;
            // If we come here, we either have sorted data or sorted buckets
            var v;
            if (p <= 0) v = 0;else if (p == 25) v = [Math.floor((this.length - 1) * 0.25), Math.ceil((this.length - 1) * 0.25)];else if (p == 50) v = [Math.floor((this.length - 1) * 0.5), Math.ceil((this.length - 1) * 0.5)];else if (p == 75) v = [Math.floor((this.length - 1) * 0.75), Math.ceil((this.length - 1) * 0.75)];else if (p >= 100) v = this.length - 1;else v = Math.floor(this.length * p / 100);
            if (v === 0) return this.min;
            if (v === this.length - 1) return this.max;
            if (this._config.store_data) {
                if (this._data_sorted === null) this._data_sorted = this.data.slice(0).sort(asc);
                if (typeof v == 'number') return this._data_sorted[v];else return (this._data_sorted[v[0]] + this._data_sorted[v[1]]) / 2;
            } else {
                var j;
                if (typeof v != 'number') v = (v[0] + v[1]) / 2;
                if (this._config.buckets) j = 0;else if (this._config.bucket_precision) j = Math.floor(this.min / this._config.bucket_precision);
                for (; j < this.buckets.length; j++) {
                    if (!this.buckets[j]) continue;
                    if (v <= this.buckets[j][0]) {
                        break;
                    }
                    v -= this.buckets[j][0];
                }
                return this._get_nth_in_bucket(v, j);
            }
        },
        _get_nth_in_bucket: function (n, b) {
            var range = [];
            if (this._config.buckets) {
                range[0] = b > 0 ? this._config.buckets[b - 1] : this.min;
                range[1] = b < this._config.buckets.length ? this._config.buckets[b] : this.max;
            } else if (this._config.bucket_precision) {
                range[0] = Math.max(b * this._config.bucket_precision, this.min);
                range[1] = Math.min((b + 1) * this._config.bucket_precision, this.max);
            }
            return range[0] + (range[1] - range[0]) * n / this.buckets[b][0];
        },
        median: function () {
            return this.percentile(50);
        },
        iqr: function () {
            var q1, q3, fw;
            q1 = this.percentile(25);
            q3 = this.percentile(75);
            fw = (q3 - q1) * 1.5;
            return this.band_pass(q1 - fw, q3 + fw, true);
        },
        band_pass: function (low, high, open, config) {
            var i, j, b, b_val, i_val;
            if (!config) config = this._config;
            b = new Stats(config);
            if (this.length === 0) return b;
            if (this._config.store_data) {
                if (this._data_sorted === null) this._data_sorted = this.data.slice(0).sort(asc);
                for (i = 0; i < this.length && (this._data_sorted[i] < high || !open && this._data_sorted[i] === high); i++) {
                    if (this._data_sorted[i] > low || !open && this._data_sorted[i] === low) {
                        b.push(this._data_sorted[i]);
                    }
                }
            } else if (this._config.buckets) {
                for (i = 0; i <= this._config.buckets.length; i++) {
                    if (this._config.buckets[i] < this.min) continue;
                    b_val = i == 0 ? this.min : this._config.buckets[i - 1];
                    if (b_val < this.min) b_val = this.min;
                    if (b_val > this.max) b_val = this.max;
                    if (high < b_val || open && high === b_val) {
                        break;
                    }
                    if (low < b_val || !open && low === b_val) {
                        for (j = 0; j < (this.buckets[i] ? this.buckets[i][0] : 0); j++) {
                            i_val = Stats.prototype._get_nth_in_bucket.call(this, j, i);
                            if ((i_val > low || !open && i_val === low) && (i_val < high || !open && i_val === high)) {
                                b.push(i_val);
                            }
                        }
                    }
                }
                b.min = Math.max(low, b.min);
                b.max = Math.min(high, b.max);
            } else if (this._config.bucket_precision) {
                var low_i = Math.floor(low / this._config.bucket_precision),
                    high_i = Math.floor(high / this._config.bucket_precision) + 1;
                for (i = low_i; i < Math.min(this.buckets.length, high_i); i++) {
                    for (j = 0; j < (this.buckets[i] ? this.buckets[i][0] : 0); j++) {
                        i_val = Stats.prototype._get_nth_in_bucket.call(this, j, i);
                        if ((i_val > low || !open && i_val === low) && (i_val < high || !open && i_val === high)) {
                            b.push(i_val);
                        }
                    }
                }
                b.min = Math.max(low, b.min);
                b.max = Math.min(high, b.max);
            }
            return b;
        },
        copy: function (config) {
            var b = Stats.prototype.band_pass.call(this, this.min, this.max, false, config);
            b.sum = this.sum;
            b.sum_of_squares = this.sum_of_squares;
            b.sum_of_logs = this.sum_of_logs;
            b.sum_of_square_of_logs = this.sum_of_square_of_logs;
            b.zeroes = this.zeroes;
            return b;
        },
        sum: function () {
            return this.sum;
        },
        pi: function () {
            return this.zeroes > 0 ? 0 : Math.exp(this.sum_of_logs);
        }
    };
    Stats.prototype.σ = Stats.prototype.stddev;
    Stats.prototype.amean = Stats.prototype.amean;
});

enifed('glimmer-demos/uptime', ['exports', 'glimmer-object', 'glimmer-demos/index'], function (exports, _glimmerObject, _glimmerDemosIndex) {
    'use strict';

    exports.toggle = toggle;

    var ServerUptime = _glimmerDemosIndex.EmberComponent.extend({
        upDays: _glimmerObject.computed(function () {
            return this.attrs.days.reduce(function (upDays, day) {
                return upDays += day.up ? 1 : 0;
            }, 0);
        }).property('attrs.days'),
        streak: _glimmerObject.computed(function () {
            var _attrs$days$reduce = this.attrs.days.reduce(function (_ref, day) {
                var max = _ref[0];
                var streak = _ref[1];

                if (day.up && streak + 1 > max) {
                    return [streak + 1, streak + 1];
                } else if (day.up) {
                    return [max, streak + 1];
                } else {
                    return [max, 0];
                }
            }, [0, 0]);

            var max = _attrs$days$reduce[0];

            return max;
        }).property('attrs.days')
    });
    var UptimeDay = _glimmerDemosIndex.EmberComponent.extend({
        color: _glimmerObject.computed(function () {
            return this.attrs.day.up ? '#8cc665' : '#ccc';
        }).property('attrs.day.up'),
        memo: _glimmerObject.computed(function () {
            return this.attrs.day.up ? 'Servers operational!' : 'Red alert!';
        }).property('attrs.day.up')
    });
    var env = new _glimmerDemosIndex.DemoEnvironment();
    env.registerComponent('server-uptime', ServerUptime, _glimmerDemosIndex.compile('\n  <server-uptime>\n  <h1>{{attrs.name}}</h1>\n  <h2>{{upDays}} Days Up</h2>\n  <h2>Biggest Streak: {{streak}}</h2>\n\n  <div class="days">\n    {{#each attrs.days key="day.number" as |day|}}\n      <uptime-day day={{day}} />\n    {{/each}}\n  </div>\n  </server-uptime>\n'));
    env.registerComponent('uptime-day', UptimeDay, _glimmerDemosIndex.compile('\n  <uptime-day>\n    <span class="uptime-day" style="background-color: {{color}}" />\n    <span class="hover">{{attrs.day.number}}: {{memo}}</span>\n  </uptime-day>\n'));
    var app = _glimmerDemosIndex.compile('\n  {{#each servers key="name" as |server|}}\n    <server-uptime name={{server.name}} days={{server.days}} />\n  {{/each}}\n');
    var clear = undefined;
    var playing = false;

    function toggle() {
        if (playing) {
            window['playpause'].innerHTML = "Play";
            clearInterval(clear);
        } else {
            window['playpause'].innerHTML = "Pause";
            start();
            playing = true;
        }
    }

    function start() {
        var output = document.getElementById('output');
        console.time('rendering');
        env.begin();
        var result = app.render({ servers: servers() }, env, { appendTo: output });
        console.log(env['createdComponents'].length);
        env.commit();
        console.timeEnd('rendering');
        clear = setInterval(function () {
            result.scope.updateSelf({ servers: servers() });
            console.time('updating');
            result.rerender();
            console.timeEnd('updating');
        }, 300);
    }
    function servers() {
        return [server("Stefan's Server"), server("Godfrey's Server"), server("Yehuda's Server"), server("Chad's Server"), server("Robert's Server 1"), server("Robert's Server 2"), server("Robert's Server 3"), server("Robert's Server 4"), server("Robert's Server 5"), server("Robert's Server 6")];
    }
    function server(name) {
        var days = [];
        for (var i = 0; i <= 364; i++) {
            var up = Math.random() > 0.2;
            days.push({ number: i, up: up });
        }
        return { name: name, days: days };
    }
});

enifed("initial-render-test", ["exports", "glimmer-compiler", "glimmer-util", "glimmer-test-helpers", "./support"], function (exports, _glimmerCompiler, _glimmerUtil, _glimmerTestHelpers, _support) {
    "use strict";

    var env = undefined,
        root = undefined;
    function compile(template) {
        return _glimmerCompiler.compile(template, { disableComponentGeneration: true });
    }
    function compilesTo(html) {
        var expected = arguments.length <= 1 || arguments[1] === undefined ? html : arguments[1];
        var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
        return (function () {
            var template = compile(html);
            root = rootElement();
            render(template, context);
            _glimmerTestHelpers.equalTokens(root, expected);
        })();
    }
    function rootElement() {
        return env.getDOM().createElement('div', document.body);
    }
    function commonSetup() {
        env = new _support.TestEnvironment(window.document); // TODO: Support SimpleDOM
        root = rootElement();
    }
    function render(template, self) {
        return template.render(self, env, { appendTo: root });
    }
    function _module(name) {
        return QUnit.module(name, {
            beforeEach: commonSetup
        });
    }
    _module("Initial render - simple content");
    test("Simple content gets appended properly", function () {
        var template = compile("content");
        render(template, {});
        _glimmerTestHelpers.equalTokens(root, "content");
    });
    test("Simple elements are created", function () {
        var template = compile("<h1>hello!</h1><div>content</div>");
        render(template, {});
        _glimmerTestHelpers.equalTokens(root, "<h1>hello!</h1><div>content</div>");
    });
    test("Simple elements can be re-rendered", function () {
        var template = compile("<h1>hello!</h1><div>content</div>");
        var result = render(template, {});
        var oldFirstChild = root.firstChild;
        result.rerender();
        strictEqual(root.firstChild, oldFirstChild);
        _glimmerTestHelpers.equalTokens(root, "<h1>hello!</h1><div>content</div>");
    });
    test("Simple elements can have attributes", function () {
        var template = compile("<div class='foo' id='bar'>content</div>");
        render(template, {});
        _glimmerTestHelpers.equalTokens(root, '<div class="foo" id="bar">content</div>');
    });
    test("Simple elements can have an empty attribute", function () {
        var template = compile("<div class=''>content</div>");
        render(template, {});
        _glimmerTestHelpers.equalTokens(root, '<div class="">content</div>');
    });
    test("presence of `disabled` attribute without value marks as disabled", function () {
        var template = compile('<input disabled>');
        render(template, {});
        ok(root.firstChild['disabled'], 'disabled without value set as property is true');
    });
    test("Null quoted attribute value calls toString on the value", function () {
        var template = compile('<input disabled="{{isDisabled}}">');
        render(template, { isDisabled: null });
        ok(root.firstChild['disabled'], 'string of "null" set as property is true');
    });
    test("Null unquoted attribute value removes that attribute", function () {
        var template = compile('<input disabled={{isDisabled}}>');
        render(template, { isDisabled: null });
        _glimmerTestHelpers.equalTokens(root, '<input>');
    });
    test("unquoted attribute string is just that", function () {
        var template = compile('<input value=funstuff>');
        render(template, {});
        var inputNode = root.firstChild;
        equal(inputNode.tagName, 'INPUT', 'input tag');
        equal(inputNode.value, 'funstuff', 'value is set as property');
    });
    test("unquoted attribute expression is string", function () {
        var template = compile('<input value={{funstuff}}>');
        render(template, { funstuff: "oh my" });
        var inputNode = root.firstChild;
        equal(inputNode.tagName, 'INPUT', 'input tag');
        equal(inputNode.value, 'oh my', 'string is set to property');
    });
    test("unquoted attribute expression works when followed by another attribute", function () {
        var template = compile('<div foo="{{funstuff}}" name="Alice"></div>');
        render(template, { funstuff: "oh my" });
        _glimmerTestHelpers.equalTokens(root, '<div name="Alice" foo="oh my"></div>');
    });
    test("Unquoted attribute value with multiple nodes throws an exception", function () {
        expect(4);
        QUnit.throws(function () {
            compile('<img class=foo{{bar}}>');
        }, expectedError(1));
        QUnit.throws(function () {
            compile('<img class={{foo}}{{bar}}>');
        }, expectedError(1));
        QUnit.throws(function () {
            compile('<img \nclass={{foo}}bar>');
        }, expectedError(2));
        QUnit.throws(function () {
            compile('<div \nclass\n=\n{{foo}}&amp;bar ></div>');
        }, expectedError(4));
        function expectedError(line) {
            return new Error("An unquoted attribute value must be a string or a mustache, " + "preceeded by whitespace or a '=' character, and " + ("followed by whitespace or a '>' character (on line " + line + ")"));
        }
    });
    test("Simple elements can have arbitrary attributes", function () {
        var template = compile("<div data-some-data='foo'>content</div>");
        render(template, {});
        _glimmerTestHelpers.equalTokens(root, '<div data-some-data="foo">content</div>');
    });
    test("checked attribute and checked property are present after clone and hydrate", function () {
        var template = compile("<input checked=\"checked\">");
        render(template, {});
        var inputNode = root.firstChild;
        equal(inputNode.tagName, 'INPUT', 'input tag');
        equal(inputNode.checked, true, 'input tag is checked');
    });
    function shouldBeVoid(tagName) {
        root.innerHTML = "";
        var html = "<" + tagName + " data-foo='bar'><p>hello</p>";
        var template = compile(html);
        render(template, {});
        var tag = '<' + tagName + ' data-foo="bar">';
        var closing = '</' + tagName + '>';
        var extra = "<p>hello</p>";
        html = _glimmerTestHelpers.normalizeInnerHTML(root.innerHTML);
        root = rootElement();
        QUnit.push(html === tag + extra || html === tag + closing + extra, html, tag + closing + extra, tagName + " should be a void element");
    }
    test("Void elements are self-closing", function () {
        var voidElements = "area base br col command embed hr img input keygen link meta param source track wbr";
        _glimmerUtil.forEach(voidElements.split(" "), function (tagName) {
            shouldBeVoid(tagName);
        });
    });
    test("The compiler can handle nesting", function () {
        var html = '<div class="foo"><p><span id="bar" data-foo="bar">hi!</span></p></div>&nbsp;More content';
        var template = compile(html);
        render(template, {});
        _glimmerTestHelpers.equalTokens(root, html);
    });
    test("The compiler can handle quotes", function () {
        compilesTo('<div>"This is a title," we\'re on a boat</div>');
    });
    test("The compiler can handle backslashes", function () {
        compilesTo('<div>This is a backslash: \\</div>');
    });
    test("The compiler can handle newlines", function () {
        compilesTo("<div>common\n\nbro</div>");
    });
    test("The compiler can handle comments", function () {
        compilesTo("<div>{{! Better not break! }}content</div>", '<div>content</div>', {});
    });
    test("The compiler can handle HTML comments", function () {
        compilesTo('<div><!-- Just passing through --></div>');
    });
    test("The compiler can handle HTML comments with mustaches in them", function () {
        compilesTo('<div><!-- {{foo}} --></div>', '<div><!-- {{foo}} --></div>', { foo: 'bar' });
    });
    test("The compiler can handle HTML comments with complex mustaches in them", function () {
        compilesTo('<div><!-- {{foo bar baz}} --></div>', '<div><!-- {{foo bar baz}} --></div>', { foo: 'bar' });
    });
    test("The compiler can handle HTML comments with multi-line mustaches in them", function () {
        compilesTo('<div><!-- {{#each foo as |bar|}}\n{{bar}}\n\n{{/each}} --></div>');
    });
    test('The compiler can handle comments with no parent element', function () {
        compilesTo('<!-- {{foo}} -->');
    });
    // TODO: Revisit partial syntax.
    // test("The compiler can handle partials in handlebars partial syntax", function() {
    //   registerPartial('partial_name', "<b>Partial Works!</b>");
    //   compilesTo('<div>{{>partial_name}} Plaintext content</div>', '<div><b>Partial Works!</b> Plaintext content</div>', {});
    // });
    test("The compiler can handle simple handlebars", function () {
        compilesTo('<div>{{title}}</div>', '<div>hello</div>', { title: 'hello' });
    });
    test("The compiler can handle escaping HTML", function () {
        compilesTo('<div>{{title}}</div>', '<div>&lt;strong&gt;hello&lt;/strong&gt;</div>', { title: '<strong>hello</strong>' });
    });
    test("The compiler can handle unescaped HTML", function () {
        compilesTo('<div>{{{title}}}</div>', '<div><strong>hello</strong></div>', { title: '<strong>hello</strong>' });
    });
    test("The compiler can handle top-level unescaped HTML", function () {
        compilesTo('{{{html}}}', '<strong>hello</strong>', { html: '<strong>hello</strong>' });
    });
    function createElement(tag) {
        return env.getDOM().createElement(tag, document.body);
    }
    test("The compiler can handle top-level unescaped tr", function () {
        var template = compile('{{{html}}}');
        var context = { html: '<tr><td>Yo</td></tr>' };
        root = createElement('table');
        render(template, context);
        equal(root.firstChild['tagName'], 'TBODY', "root tbody is present");
    });
    test("The compiler can handle top-level unescaped td inside tr contextualElement", function () {
        var template = compile('{{{html}}}');
        var context = { html: '<td>Yo</td>' };
        root = createElement('tr');
        render(template, context);
        equal(root.firstChild['tagName'], 'TD', "root td is returned");
    });
    test("second render respects whitespace", function () {
        var template = compile('Hello {{ foo }} ');
        render(template, {});
        root = rootElement();
        render(template, {});
        equal(root.childNodes.length, 3, 'fragment contains 3 text nodes');
        equal(_glimmerTestHelpers.getTextContent(root.childNodes[0]), 'Hello ', 'first text node ends with one space character');
        equal(_glimmerTestHelpers.getTextContent(root.childNodes[2]), ' ', 'last text node contains one space character');
    });
    test("Morphs are escaped correctly", function () {
        env.registerHelper('testing-unescaped', function (params) {
            return params[0];
        });
        env.registerHelper('testing-escaped', function (params, hash, blocks) {
            return params[0];
        });
        compilesTo('<div>{{{testing-unescaped "<span>hi</span>"}}}</div>', '<div><span>hi</span></div>');
        compilesTo('<div>{{testing-escaped "<hi>"}}</div>', '<div>&lt;hi&gt;</div>');
    });
    test("Attributes can use computed values", function () {
        compilesTo('<a href="{{url}}">linky</a>', '<a href="linky.html">linky</a>', { url: 'linky.html' });
    });
    test("Mountain range of nesting", function () {
        var context = { foo: "FOO", bar: "BAR", baz: "BAZ", boo: "BOO", brew: "BREW", bat: "BAT", flute: "FLUTE", argh: "ARGH" };
        compilesTo('{{foo}}<span></span>', 'FOO<span></span>', context);
        compilesTo('<span></span>{{foo}}', '<span></span>FOO', context);
        compilesTo('<span>{{foo}}</span>{{foo}}', '<span>FOO</span>FOO', context);
        compilesTo('{{foo}}<span>{{foo}}</span>{{foo}}', 'FOO<span>FOO</span>FOO', context);
        compilesTo('{{foo}}<span></span>{{foo}}', 'FOO<span></span>FOO', context);
        compilesTo('{{foo}}<span></span>{{bar}}<span><span><span>{{baz}}</span></span></span>', 'FOO<span></span>BAR<span><span><span>BAZ</span></span></span>', context);
        compilesTo('{{foo}}<span></span>{{bar}}<span>{{argh}}<span><span>{{baz}}</span></span></span>', 'FOO<span></span>BAR<span>ARGH<span><span>BAZ</span></span></span>', context);
        compilesTo('{{foo}}<span>{{bar}}<a>{{baz}}<em>{{boo}}{{brew}}</em>{{bat}}</a></span><span><span>{{flute}}</span></span>{{argh}}', 'FOO<span>BAR<a>BAZ<em>BOOBREW</em>BAT</a></span><span><span>FLUTE</span></span>ARGH', context);
    });
    _module("Initial render - simple blocks");
    test("The compiler can handle unescaped tr in top of content", function () {
        var template = compile('{{#identity}}{{{html}}}{{/identity}}');
        var context = { html: '<tr><td>Yo</td></tr>' };
        root = createElement('table');
        render(template, context);
        equal(root.firstChild['tagName'], 'TBODY', "root tbody is present");
    });
    test("The compiler can handle unescaped tr inside fragment table", function () {
        var template = compile('<table>{{#identity}}{{{html}}}{{/identity}}</table>');
        var context = { html: '<tr><td>Yo</td></tr>' };
        render(template, context);
        var tableNode = root.firstChild;
        equal(tableNode.firstChild['tagName'], 'TBODY', "root tbody is present");
    });
    _module("Initial render - inline helpers");
    test("The compiler can handle simple helpers", function () {
        env.registerHelper('testing', function (params) {
            return params[0];
        });
        compilesTo('<div>{{testing title}}</div>', '<div>hello</div>', { title: 'hello' });
    });
    test("The compiler can handle sexpr helpers", function () {
        env.registerHelper('testing', function (params) {
            return params[0] + "!";
        });
        compilesTo('<div>{{testing (testing "hello")}}</div>', '<div>hello!!</div>', {});
    });
    test("The compiler can handle multiple invocations of sexprs", function () {
        env.registerHelper('testing', function (params) {
            return "" + params[0] + params[1];
        });
        compilesTo('<div>{{testing (testing "hello" foo) (testing (testing bar "lol") baz)}}</div>', '<div>helloFOOBARlolBAZ</div>', { foo: "FOO", bar: "BAR", baz: "BAZ" });
    });
    test("The compiler passes along the hash arguments", function () {
        env.registerHelper('testing', function (params, hash) {
            return hash.first + '-' + hash.second;
        });
        compilesTo('<div>{{testing first="one" second="two"}}</div>', '<div>one-two</div>');
    });
    // test("Attributes can use computed paths", function() {
    //   compilesTo('<a href="{{post.url}}">linky</a>', '<a href="linky.html">linky</a>', { post: { url: 'linky.html' }});
    // });
    /*
    
    test("It is possible to use RESOLVE_IN_ATTR for data binding", function() {
      var callback;
    
      registerHelper('RESOLVE_IN_ATTR', function(parts, options) {
        return boundValue(function(c) {
          callback = c;
          return this[parts[0]];
        }, this);
      });
    
      var object = { url: 'linky.html' };
      var fragment = compilesTo('<a href="{{url}}">linky</a>', '<a href="linky.html">linky</a>', object);
    
      object.url = 'clippy.html';
      callback();
    
      equalTokens(fragment, '<a href="clippy.html">linky</a>');
    
      object.url = 'zippy.html';
      callback();
    
      equalTokens(fragment, '<a href="zippy.html">linky</a>');
    });
    */
    test("Attributes can be populated with helpers that generate a string", function () {
        env.registerHelper('testing', function (params) {
            return params[0];
        });
        compilesTo('<a href="{{testing url}}">linky</a>', '<a href="linky.html">linky</a>', { url: 'linky.html' });
    });
    /*
    test("A helper can return a stream for the attribute", function() {
      env.registerHelper('testing', function(path, options) {
        return streamValue(this[path]);
      });
    
      compilesTo('<a href="{{testing url}}">linky</a>', '<a href="linky.html">linky</a>', { url: 'linky.html'});
    });
    */
    test("Attribute helpers take a hash", function () {
        env.registerHelper('testing', function (params, hash) {
            return hash.path;
        });
        compilesTo('<a href="{{testing path=url}}">linky</a>', '<a href="linky.html">linky</a>', { url: 'linky.html' });
    });
    /*
    test("Attribute helpers can use the hash for data binding", function() {
      var callback;
    
      env.registerHelper('testing', function(path, hash, options) {
        return boundValue(function(c) {
          callback = c;
          return this[path] ? hash.truthy : hash.falsy;
        }, this);
      });
    
      var object = { on: true };
      var fragment = compilesTo('<div class="{{testing on truthy="yeah" falsy="nope"}}">hi</div>', '<div class="yeah">hi</div>', object);
    
      object.on = false;
      callback();
      equalTokens(fragment, '<div class="nope">hi</div>');
    });
    */
    test("Attributes containing multiple helpers are treated like a block", function () {
        env.registerHelper('testing', function (params) {
            return params[0];
        });
        compilesTo('<a href="http://{{foo}}/{{testing bar}}/{{testing "baz"}}">linky</a>', '<a href="http://foo.com/bar/baz">linky</a>', { foo: 'foo.com', bar: 'bar' });
    });
    test("Attributes containing a helper are treated like a block", function () {
        expect(2);
        env.registerHelper('testing', function (params) {
            deepEqual(params, [123]);
            return "example.com";
        });
        compilesTo('<a href="http://{{testing 123}}/index.html">linky</a>', '<a href="http://example.com/index.html">linky</a>', { person: { url: 'example.com' } });
    });
    /*
    test("It is possible to trigger a re-render of an attribute from a child resolution", function() {
      var callback;
    
      env.registerHelper('RESOLVE_IN_ATTR', function(path, options) {
        return boundValue(function(c) {
          callback = c;
          return this[path];
        }, this);
      });
    
      var context = { url: "example.com" };
      var fragment = compilesTo('<a href="http://{{url}}/index.html">linky</a>', '<a href="http://example.com/index.html">linky</a>', context);
    
      context.url = "www.example.com";
      callback();
    
      equalTokens(fragment, '<a href="http://www.example.com/index.html">linky</a>');
    });
    
    test("A child resolution can pass contextual information to the parent", function() {
      var callback;
    
      registerHelper('RESOLVE_IN_ATTR', function(path, options) {
        return boundValue(function(c) {
          callback = c;
          return this[path];
        }, this);
      });
    
      var context = { url: "example.com" };
      var fragment = compilesTo('<a href="http://{{url}}/index.html">linky</a>', '<a href="http://example.com/index.html">linky</a>', context);
    
      context.url = "www.example.com";
      callback();
    
      equalTokens(fragment, '<a href="http://www.example.com/index.html">linky</a>');
    });
    
    test("Attribute runs can contain helpers", function() {
      var callbacks = [];
    
      registerHelper('RESOLVE_IN_ATTR', function(path, options) {
        return boundValue(function(c) {
          callbacks.push(c);
          return this[path];
        }, this);
      });
    
      registerHelper('testing', function(path, options) {
        return boundValue(function(c) {
          callbacks.push(c);
    
          if (options.paramTypes[0] === 'id') {
            return this[path] + '.html';
          } else {
            return path;
          }
        }, this);
      });
    
      var context = { url: "example.com", path: 'index' };
      var fragment = compilesTo(
        '<a href="http://{{url}}/{{testing path}}/{{testing "linky"}}">linky</a>',
        '<a href="http://example.com/index.html/linky">linky</a>',
        context
      );
    
      context.url = "www.example.com";
      context.path = "yep";
      forEach(callbacks, function(callback) { callback(); });
    
      equalTokens(fragment, '<a href="http://www.example.com/yep.html/linky">linky</a>');
    
      context.url = "nope.example.com";
      context.path = "nope";
      forEach(callbacks, function(callback) { callback(); });
    
      equalTokens(fragment, '<a href="http://nope.example.com/nope.html/linky">linky</a>');
    });
    */
    test("Elements inside a yielded block", function () {
        compilesTo('{{#identity}}<div id="test">123</div>{{/identity}}', '<div id="test">123</div>');
    });
    test("A simple block helper can return text", function () {
        compilesTo('{{#identity}}test{{else}}not shown{{/identity}}', 'test');
    });
    test("A block helper can have an else block", function () {
        compilesTo('{{#render-inverse}}Nope{{else}}<div id="test">123</div>{{/render-inverse}}', '<div id="test">123</div>');
    });
    _module("Initial render - miscellaneous");
    QUnit.skip("Node helpers can modify the node", function () {
        env.registerHelper('testing', function (params, hash, options) {
            options.element.setAttribute('zomg', 'zomg');
        });
        compilesTo('<div {{testing}}>Node helpers</div>', '<div zomg="zomg">Node helpers</div>');
    });
    QUnit.skip("Node helpers can modify the node after one node appended by top-level helper", function () {
        env.registerHelper('top-helper', function () {
            return document.createElement('span');
        });
        env.registerHelper('attr-helper', function (params, hash, options) {
            options.element.setAttribute('zomg', 'zomg');
        });
        compilesTo('<div {{attr-helper}}>Node helpers</div>{{top-helper}}', '<div zomg="zomg">Node helpers</div><span></span>');
    });
    QUnit.skip("Node helpers can modify the node after one node prepended by top-level helper", function () {
        env.registerHelper('top-helper', function () {
            return document.createElement('span');
        });
        env.registerHelper('attr-helper', function (params, hash, options) {
            options.element.setAttribute('zomg', 'zomg');
        });
        compilesTo('{{top-helper}}<div {{attr-helper}}>Node helpers</div>', '<span></span><div zomg="zomg">Node helpers</div>');
    });
    QUnit.skip("Node helpers can modify the node after many nodes returned from top-level helper", function () {
        env.registerHelper('top-helper', function () {
            var frag = document.createDocumentFragment();
            frag.appendChild(document.createElement('span'));
            frag.appendChild(document.createElement('span'));
            return frag;
        });
        env.registerHelper('attr-helper', function (params, hash, options) {
            options.element.setAttribute('zomg', 'zomg');
        });
        compilesTo('{{top-helper}}<div {{attr-helper}}>Node helpers</div>', '<span></span><span></span><div zomg="zomg">Node helpers</div>');
    });
    QUnit.skip("Node helpers can be used for attribute bindings", function () {
        env.registerHelper('testing', function (params, hash, options) {
            var value = hash.href,
                element = options.element;
            element.setAttribute('href', value);
        });
        var object = { url: 'linky.html' };
        var template = compile('<a {{testing href=url}}>linky</a>');
        var result = render(template, object);
        _glimmerTestHelpers.equalTokens(root, '<a href="linky.html">linky</a>');
        object.url = 'zippy.html';
        result.rerender();
        _glimmerTestHelpers.equalTokens(root, '<a href="zippy.html">linky</a>');
    });
    function equalHash(_actual, expected) {
        var actual = {};
        Object.keys(_actual).forEach(function (k) {
            return actual[k] = _actual[k];
        });
        QUnit.deepEqual(actual, expected);
    }
    QUnit.skip('Components - Called as helpers', function () {
        env.registerHelper('x-append', function (params, hash, blocks) {
            equalHash(hash, { text: 'de' });
            blocks.template.yield();
        });
        var object = { bar: 'e', baz: 'c' };
        compilesTo('a<x-append text="d{{bar}}">b{{baz}}</x-append>f', 'abcf', object);
    });
    test('Components - Unknown helpers fall back to elements', function () {
        var object = { size: 'med', foo: 'b' };
        compilesTo('<x-bar class="btn-{{size}}">a{{foo}}c</x-bar>', '<x-bar class="btn-med">abc</x-bar>', object);
    });
    test('Components - Text-only attributes work', function () {
        var object = { foo: 'qux' };
        compilesTo('<x-bar id="test">{{foo}}</x-bar>', '<x-bar id="test">qux</x-bar>', object);
    });
    test('Components - Empty components work', function () {
        compilesTo('<x-bar></x-bar>', '<x-bar></x-bar>', {});
    });
    test('Components - Text-only dashed attributes work', function () {
        var object = { foo: 'qux' };
        compilesTo('<x-bar aria-label="foo" id="test">{{foo}}</x-bar>', '<x-bar aria-label="foo" id="test">qux</x-bar>', object);
    });
    test('Repaired text nodes are ensured in the right place', function () {
        var object = { a: "A", b: "B", c: "C", d: "D" };
        compilesTo('{{a}} {{b}}', 'A B', object);
        compilesTo('<div>{{a}}{{b}}{{c}}wat{{d}}</div>', '<div>ABCwatD</div>', object);
        compilesTo('{{a}}{{b}}<img><img><img><img>', 'AB<img><img><img><img>', object);
    });
    test("Simple elements can have dashed attributes", function () {
        var template = compile("<div aria-label='foo'>content</div>");
        render(template, {});
        _glimmerTestHelpers.equalTokens(root, '<div aria-label="foo">content</div>');
    });
    test('Block params in HTML syntax - Throws exception if given zero parameters', function () {
        expect(2);
        QUnit.throws(function () {
            compile('<x-bar as ||>foo</x-bar>');
        }, /Cannot use zero block parameters: 'as \|\|'/);
        QUnit.throws(function () {
            compile('<x-bar as | |>foo</x-bar>');
        }, /Cannot use zero block parameters: 'as \| \|'/);
    });
    QUnit.skip('Block params in HTML syntax - Works with a single parameter', function () {
        env.registerHelper('x-bar', function (params, hash, blocks) {
            return blocks.template.yield(['Xerxes']);
        });
        compilesTo('<x-bar as |x|>{{x}}</x-bar>', 'Xerxes', {});
    });
    QUnit.skip('Block params in HTML syntax - Works with other attributes', function () {
        env.registerHelper('x-bar', function (params, hash) {
            equalHash(hash, { firstName: 'Alice', lastName: 'Smith' });
        });
        var template = compile('<x-bar firstName="Alice" lastName="Smith" as |x y|></x-bar>');
        render(template, {});
    });
    QUnit.skip('Block params in HTML syntax - Ignores whitespace', function () {
        expect(3);
        env.registerHelper('x-bar', function (params, hash, blocks) {
            return blocks.template.yield(['Xerxes', 'York']);
        });
        compilesTo('<x-bar as |x y|>{{x}},{{y}}</x-bar>', 'Xerxes,York', {});
        compilesTo('<x-bar as | x y|>{{x}},{{y}}</x-bar>', 'Xerxes,York', {});
        compilesTo('<x-bar as | x y |>{{x}},{{y}}</x-bar>', 'Xerxes,York', {});
    });
    QUnit.skip('Block params in HTML syntax - Helper should know how many block params it was called with', function () {
        expect(4);
        env.registerHelper('count-block-params', function (params, hash, options) {
            equal(options.template.arity, parseInt(hash.count, 10), 'Helpers should receive the correct number of block params in options.template.blockParams.');
        });
        render(compile('<count-block-params count="0"></count-block-params>'), { count: 0 });
        render(compile('<count-block-params count="1" as |x|></count-block-params>'), { count: 1 });
        render(compile('<count-block-params count="2" as |x y|></count-block-params>'), { count: 2 });
        render(compile('<count-block-params count="3" as |x y z|></count-block-params>'), { count: 3 });
    });
    test("Block params in HTML syntax - Throws an error on invalid block params syntax", function () {
        expect(3);
        QUnit.throws(function () {
            compile('<x-bar as |x y>{{x}},{{y}}</x-bar>');
        }, /Invalid block parameters syntax: 'as |x y'/);
        QUnit.throws(function () {
            compile('<x-bar as |x| y>{{x}},{{y}}</x-bar>');
        }, /Invalid block parameters syntax: 'as \|x\| y'/);
        QUnit.throws(function () {
            compile('<x-bar as |x| y|>{{x}},{{y}}</x-bar>');
        }, /Invalid block parameters syntax: 'as \|x\| y\|'/);
    });
    test("Block params in HTML syntax - Throws an error on invalid identifiers for params", function () {
        expect(3);
        QUnit.throws(function () {
            compile('<x-bar as |x foo.bar|></x-bar>');
        }, /Invalid identifier for block parameters: 'foo\.bar' in 'as \|x foo\.bar|'/);
        QUnit.throws(function () {
            compile('<x-bar as |x "foo"|></x-bar>');
        }, /Invalid identifier for block parameters: '"foo"' in 'as \|x "foo"|'/);
        QUnit.throws(function () {
            compile('<x-bar as |foo[bar]|></x-bar>');
        }, /Invalid identifier for block parameters: 'foo\[bar\]' in 'as \|foo\[bar\]\|'/);
    });
    _module("Initial render (invalid HTML)");
    test("A helpful error message is provided for unclosed elements", function () {
        expect(2);
        QUnit.throws(function () {
            compile('\n<div class="my-div" \n foo={{bar}}>\n<span>\n</span>\n');
        }, /Unclosed element `div` \(on line 2\)\./);
        QUnit.throws(function () {
            compile('\n<div class="my-div">\n<span>\n');
        }, /Unclosed element `span` \(on line 3\)\./);
    });
    test("A helpful error message is provided for unmatched end tags", function () {
        expect(2);
        QUnit.throws(function () {
            compile("</p>");
        }, /Closing tag `p` \(on line 1\) without an open tag\./);
        QUnit.throws(function () {
            compile("<em>{{ foo }}</em> \n {{ bar }}\n</div>");
        }, /Closing tag `div` \(on line 3\) without an open tag\./);
    });
    test("A helpful error message is provided for end tags for void elements", function () {
        expect(3);
        QUnit.throws(function () {
            compile("<input></input>");
        }, /Invalid end tag `input` \(on line 1\) \(void elements cannot have end tags\)./);
        QUnit.throws(function () {
            compile("<div>\n  <input></input>\n</div>");
        }, /Invalid end tag `input` \(on line 2\) \(void elements cannot have end tags\)./);
        QUnit.throws(function () {
            compile("\n\n</br>");
        }, /Invalid end tag `br` \(on line 3\) \(void elements cannot have end tags\)./);
    });
    test("A helpful error message is provided for end tags with attributes", function () {
        QUnit.throws(function () {
            compile('<div>\nSomething\n\n</div foo="bar">');
        }, /Invalid end tag: closing tag must not have attributes, in `div` \(on line 4\)\./);
    });
    test("A helpful error message is provided for mismatched start/end tags", function () {
        QUnit.throws(function () {
            compile("<div>\n<p>\nSomething\n\n</div>");
        }, /Closing tag `div` \(on line 5\) did not match last open tag `p` \(on line 2\)\./);
    });
    test("error line numbers include comment lines", function () {
        QUnit.throws(function () {
            compile("<div>\n<p>\n{{! some comment}}\n\n</div>");
        }, /Closing tag `div` \(on line 5\) did not match last open tag `p` \(on line 2\)\./);
    });
    test("error line numbers include mustache only lines", function () {
        QUnit.throws(function () {
            compile("<div>\n<p>\n{{someProp}}\n\n</div>");
        }, /Closing tag `div` \(on line 5\) did not match last open tag `p` \(on line 2\)\./);
    });
    test("error line numbers include block lines", function () {
        QUnit.throws(function () {
            compile("<div>\n<p>\n{{#some-comment}}\n{{/some-comment}}\n</div>");
        }, /Closing tag `div` \(on line 5\) did not match last open tag `p` \(on line 2\)\./);
    });
    test("error line numbers include whitespace control mustaches", function () {
        QUnit.throws(function () {
            compile("<div>\n<p>\n{{someProp~}}\n\n</div>{{some-comment}}");
        }, /Closing tag `div` \(on line 5\) did not match last open tag `p` \(on line 2\)\./);
    });
    test("error line numbers include multiple mustache lines", function () {
        QUnit.throws(function () {
            compile("<div>\n<p>\n{{some-comment}}</div>{{some-comment}}");
        }, /Closing tag `div` \(on line 3\) did not match last open tag `p` \(on line 2\)\./);
    });
    if (document.createElement('div').namespaceURI) {}
});

enifed("updating-test", ["exports", "glimmer-compiler", "glimmer-test-helpers", "./support"], function (exports, _glimmerCompiler, _glimmerTestHelpers, _support) {
    "use strict";

    var _templateObject = _taggedTemplateLiteralLoose(["<ul><li class='mmun'>Martin Muñoz</li><li class='krisselden'>Kristoph Selden</li>\n        <li class='mixonic'>Matthew Beale</li><!----></ul>"], ["<ul><li class='mmun'>Martin Muñoz</li><li class='krisselden'>Kristoph Selden</li>\n        <li class='mixonic'>Matthew Beale</li><!----></ul>"]),
        _templateObject2 = _taggedTemplateLiteralLoose(["<ul><li class='mmun'>Martin Muñoz</li><li class='stefanpenner'>Stefan Penner</li>\n        <li class='rwjblue'>Robert Jackson</li><!----></ul>"], ["<ul><li class='mmun'>Martin Muñoz</li><li class='stefanpenner'>Stefan Penner</li>\n        <li class='rwjblue'>Robert Jackson</li><!----></ul>"]);

    function _taggedTemplateLiteralLoose(strings, raw) { strings.raw = raw; return strings; }

    var hooks, root;
    var env = undefined;
    function rootElement() {
        return env.getDOM().createElement('div', document.body);
    }
    function commonSetup() {
        env = new _support.TestEnvironment(window.document); // TODO: Support SimpleDOM
        root = rootElement();
        root.setAttribute('debug-root', 'true');
    }
    function render(template) {
        var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var result = template.render(context, env, { appendTo: root });
        assertInvariants(result);
        return result;
    }
    QUnit.module("Updating", {
        beforeEach: commonSetup
    });
    test("updating a single curly", function () {
        var object = { value: 'hello world' };
        var template = _glimmerCompiler.compile('<div><p>{{value}}</p></div>');
        var result = render(template, object);
        var valueNode = root.firstChild.firstChild.firstChild;
        _glimmerTestHelpers.equalTokens(root, '<div><p>hello world</p></div>', "Initial render");
        result.rerender();
        _glimmerTestHelpers.equalTokens(root, '<div><p>hello world</p></div>', "no change");
        strictEqual(root.firstChild.firstChild.firstChild, valueNode, "The text node was not blown away");
        object.value = 'goodbye world';
        result.rerender();
        _glimmerTestHelpers.equalTokens(root, '<div><p>goodbye world</p></div>', "After updating and dirtying");
        strictEqual(root.firstChild.firstChild.firstChild, valueNode, "The text node was not blown away");
    });
    test("updating a single trusting curly", function () {
        var object = { value: '<p>hello world</p>' };
        var template = _glimmerCompiler.compile('<div>{{{value}}}</div>');
        var result = render(template, object);
        var valueNode = root.firstChild.firstChild.firstChild;
        _glimmerTestHelpers.equalTokens(root, '<div><p>hello world</p></div>', "Initial render");
        result.rerender();
        _glimmerTestHelpers.equalTokens(root, '<div><p>hello world</p></div>', "no change");
        strictEqual(root.firstChild.firstChild.firstChild, valueNode, "The text node was not blown away");
        object.value = '<span>goodbye world</span>';
        result.rerender();
        _glimmerTestHelpers.equalTokens(root, '<div><span>goodbye world</span></div>', "After updating and dirtying");
        notStrictEqual(root.firstChild.firstChild.firstChild, valueNode, "The text node was not blown away");
    });
    test("a simple implementation of a dirtying rerender", function () {
        var object = { condition: true, value: 'hello world' };
        var template = _glimmerCompiler.compile('<div>{{#if condition}}<p>{{value}}</p>{{else}}<p>Nothing</p>{{/if}}</div>');
        var result = render(template, object);
        var valueNode = root.firstChild.firstChild.firstChild;
        _glimmerTestHelpers.equalTokens(root, '<div><p>hello world</p></div>', "Initial render");
        result.rerender();
        _glimmerTestHelpers.equalTokens(root, '<div><p>hello world</p></div>', "After dirtying but not updating");
        strictEqual(root.firstChild.firstChild.firstChild, valueNode, "The text node was not blown away");
        // Even though the #if was stable, a dirty child node is updated
        object.value = 'goodbye world';
        result.rerender();
        _glimmerTestHelpers.equalTokens(root, '<div><p>goodbye world</p></div>', "After updating and dirtying");
        strictEqual(root.firstChild.firstChild.firstChild, valueNode, "The text node was not blown away");
        object.condition = false;
        result.rerender();
        _glimmerTestHelpers.equalTokens(root, '<div><p>Nothing</p></div>', "And then dirtying");
        QUnit.notStrictEqual(root.firstChild.firstChild.firstChild, valueNode, "The text node was not blown away");
    });
    test("a simple implementation of a dirtying rerender without inverse", function () {
        var object = { condition: true, value: 'hello world' };
        var template = _glimmerCompiler.compile('<div>{{#if condition}}<p>{{value}}</p>{{/if}}</div>');
        var result = render(template, object);
        _glimmerTestHelpers.equalTokens(root, '<div><p>hello world</p></div>', "Initial render");
        object.condition = false;
        result.rerender();
        _glimmerTestHelpers.equalTokens(root, '<div><!----></div>', "If the condition is false, the morph becomes empty");
        object.condition = true;
        result.rerender();
        _glimmerTestHelpers.equalTokens(root, '<div><p>hello world</p></div>', "If the condition is true, the morph repopulates");
    });
    test("a conditional that is false on the first run", function (assert) {
        var object = { condition: false, value: 'hello world' };
        var template = _glimmerCompiler.compile('<div>{{#if condition}}<p>{{value}}</p>{{/if}}</div>');
        var result = render(template, object);
        _glimmerTestHelpers.equalTokens(root, '<div><!----></div>', "Initial render");
        object.condition = true;
        result.rerender();
        _glimmerTestHelpers.equalTokens(root, '<div><p>hello world</p></div>', "If the condition is true, the morph populates");
        object.condition = false;
        result.rerender();
        _glimmerTestHelpers.equalTokens(root, '<div><!----></div>', "If the condition is false, the morph is empty");
    });
    test("block arguments", function (assert) {
        var template = _glimmerCompiler.compile("<div>{{#with person.name.first as |f|}}{{f}}{{/with}}</div>");
        var object = { person: { name: { first: "Godfrey", last: "Chan" } } };
        var result = render(template, object);
        _glimmerTestHelpers.equalTokens(root, '<div>Godfrey</div>', "Initial render");
        object.person.name.first = "Godfreak";
        result.rerender();
        _glimmerTestHelpers.equalTokens(root, '<div>Godfreak</div>', "After updating");
    });
    test("block arguments (ensure balanced push/pop)", function (assert) {
        var template = _glimmerCompiler.compile("<div>{{#with person.name.first as |f|}}{{f}}{{/with}}{{f}}</div>");
        var object = { person: { name: { first: "Godfrey", last: "Chan" } }, f: "Outer" };
        var result = render(template, object);
        _glimmerTestHelpers.equalTokens(root, '<div>GodfreyOuter</div>', "Initial render");
        object.person.name.first = "Godfreak";
        result.rerender();
        _glimmerTestHelpers.equalTokens(root, '<div>GodfreakOuter</div>', "After updating");
    });
    test("block helpers whose template has a morph at the edge", function () {
        var template = _glimmerCompiler.compile("{{#identity}}{{value}}{{/identity}}");
        var object = { value: "hello world" };
        var result = render(template, object);
        _glimmerTestHelpers.equalTokens(root, 'hello world');
        var firstNode = result.firstNode();
        equal(firstNode.nodeType, 3, "the first node of the helper should be a text node");
        equal(firstNode.nodeValue, "hello world", "its content should be hello world");
        strictEqual(firstNode.nextSibling, null, "there should only be one nodes");
    });
    function assertInvariants(result, msg) {
        strictEqual(result.firstNode(), root.firstChild, "The firstNode of the result is the same as the root's firstChild" + (msg ? ': ' + msg : ''));
        strictEqual(result.lastNode(), root.lastChild, "The lastNode of the result is the same as the root's lastChild" + (msg ? ': ' + msg : ''));
    }
    test("clean content doesn't get blown away", function () {
        var template = _glimmerCompiler.compile("<div>{{value}}</div>");
        var object = { value: "hello" };
        var result = render(template, object);
        var textNode = result.firstNode().firstChild;
        equal(textNode.nodeValue, "hello");
        object.value = "goodbye";
        result.rerender();
        _glimmerTestHelpers.equalTokens(root, '<div>goodbye</div>');
        object.value = "hello";
        result.rerender();
        textNode = root.firstChild.firstChild;
        equal(textNode.nodeValue, "hello");
    });
    test("helper calls follow the normal dirtying rules", function () {
        env.registerHelper('capitalize', function (params) {
            return params[0].toUpperCase();
        });
        var template = _glimmerCompiler.compile("<div>{{capitalize value}}</div>");
        var object = { value: "hello" };
        var result = render(template, object);
        var textNode = result.firstNode().firstChild;
        equal(textNode.nodeValue, "HELLO");
        object.value = "goodbye";
        result.rerender();
        _glimmerTestHelpers.equalTokens(root, '<div>GOODBYE</div>');
        result.rerender();
        _glimmerTestHelpers.equalTokens(root, '<div>GOODBYE</div>');
        // Checks normalized value, not raw value
        object.value = "GoOdByE";
        result.rerender();
        textNode = root.firstChild.firstChild;
        equal(textNode.nodeValue, "GOODBYE");
    });
    test("class attribute follow the normal dirtying rules", function () {
        var template = _glimmerCompiler.compile("<div class='{{value}}'>hello</div>");
        var object = { value: "world" };
        var result = render(template, object);
        _glimmerTestHelpers.equalTokens(root, "<div class='world'>hello</div>", "Initial render");
        object.value = "universe";
        result.rerender(); // without setting the node to dirty
        _glimmerTestHelpers.equalTokens(root, "<div class='universe'>hello</div>", "Revalidating without dirtying");
        result.rerender();
        _glimmerTestHelpers.equalTokens(root, "<div class='universe'>hello</div>", "Revalidating after dirtying");
        object.value = "world";
        result.rerender();
        _glimmerTestHelpers.equalTokens(root, "<div class='world'>hello</div>", "Revalidating after dirtying");
    });
    test("class attribute w/ concat follow the normal dirtying rules", function () {
        var template = _glimmerCompiler.compile("<div class='hello {{value}}'>hello</div>");
        var object = { value: "world" };
        var result = render(template, object);
        _glimmerTestHelpers.equalTokens(root, "<div class='hello world'>hello</div>");
        object.value = "universe";
        result.rerender(); // without setting the node to dirty
        _glimmerTestHelpers.equalTokens(root, "<div class='hello universe'>hello</div>");
        result.rerender();
        _glimmerTestHelpers.equalTokens(root, "<div class='hello universe'>hello</div>");
        object.value = "world";
        result.rerender();
        _glimmerTestHelpers.equalTokens(root, "<div class='hello world'>hello</div>");
    });
    test("attribute nodes follow the normal dirtying rules", function () {
        var template = _glimmerCompiler.compile("<div data-value='{{value}}'>hello</div>");
        var object = { value: "world" };
        var result = render(template, object);
        _glimmerTestHelpers.equalTokens(root, "<div data-value='world'>hello</div>", "Initial render");
        object.value = "universe";
        result.rerender(); // without setting the node to dirty
        _glimmerTestHelpers.equalTokens(root, "<div data-value='universe'>hello</div>", "Revalidating without dirtying");
        result.rerender();
        _glimmerTestHelpers.equalTokens(root, "<div data-value='universe'>hello</div>", "Revalidating after dirtying");
        object.value = "world";
        result.rerender();
        _glimmerTestHelpers.equalTokens(root, "<div data-value='world'>hello</div>", "Revalidating after dirtying");
    });
    test("attribute nodes w/ concat follow the normal dirtying rules", function () {
        var template = _glimmerCompiler.compile("<div data-value='hello {{value}}'>hello</div>");
        var object = { value: "world" };
        var result = render(template, object);
        _glimmerTestHelpers.equalTokens(root, "<div data-value='hello world'>hello</div>");
        object.value = "universe";
        result.rerender(); // without setting the node to dirty
        _glimmerTestHelpers.equalTokens(root, "<div data-value='hello universe'>hello</div>");
        result.rerender();
        _glimmerTestHelpers.equalTokens(root, "<div data-value='hello universe'>hello</div>");
        object.value = "world";
        result.rerender();
        _glimmerTestHelpers.equalTokens(root, "<div data-value='hello world'>hello</div>");
    });
    test("property nodes follow the normal dirtying rules", function () {
        var template = _glimmerCompiler.compile("<div foo={{value}}>hello</div>");
        var object = { value: true };
        var result = render(template, object);
        _glimmerTestHelpers.equalTokens(root, "<div>hello</div>", "Initial render");
        strictEqual(root.firstChild.foo, true, "Initial render");
        object.value = false;
        result.rerender(); // without setting the node to dirty
        _glimmerTestHelpers.equalTokens(root, "<div>hello</div>", "Revalidating without dirtying");
        strictEqual(root.firstChild.foo, false, "Revalidating without dirtying");
        result.rerender();
        _glimmerTestHelpers.equalTokens(root, "<div>hello</div>", "Revalidating after dirtying");
        strictEqual(root.firstChild.foo, false, "Revalidating after dirtying");
        object.value = true;
        result.rerender();
        _glimmerTestHelpers.equalTokens(root, "<div>hello</div>", "Revalidating after dirtying");
        strictEqual(root.firstChild.foo, true, "Revalidating after dirtying");
    });
    test("top-level bounds are correct when swapping order", function (assert) {
        var template = _glimmerCompiler.compile("{{#each list key='key' as |item|}}{{item.name}}{{/each}}");
        var tom = { key: "1", name: "Tom Dale", "class": "tomdale" };
        var yehuda = { key: "2", name: "Yehuda Katz", "class": "wycats" };
        var object = { list: [tom, yehuda] };
        var result = render(template, object);
        assertInvariants(result, "initial render");
        result.rerender();
        assertInvariants(result, "after no-op rerender");
        object = { list: [yehuda, tom] };
        result.rerender(object);
        assertInvariants(result, "after reordering");
        object = { list: [tom] };
        result.rerender(object);
        assertInvariants(result, "after deleting from the front");
        object = { list: [] };
        result.rerender(object);
        assertInvariants(result, "after emptying the list");
    });
    testEachHelper("An implementation of #each using block params", "<ul>{{#each list key='key' as |item|}}<li class='{{item.class}}'>{{item.name}}</li>{{/each}}</ul>");
    testEachHelper("An implementation of #each using a self binding", "<ul>{{#each list}}<li class={{class}}>{{name}}</li>{{/each}}</ul>", QUnit.skip);
    function testEachHelper(testName, templateSource) {
        var testMethod = arguments.length <= 2 || arguments[2] === undefined ? QUnit.test : arguments[2];

        testMethod(testName, function () {
            var template = _glimmerCompiler.compile(templateSource);
            var tom = { key: "1", name: "Tom Dale", "class": "tomdale" };
            var yehuda = { key: "2", name: "Yehuda Katz", "class": "wycats" };
            var object = { list: [tom, yehuda] };
            var result = render(template, object);
            var itemNode = getItemNode('tomdale');
            var nameNode = getNameNode('tomdale');
            _glimmerTestHelpers.equalTokens(root, "<ul><li class='tomdale'>Tom Dale</li><li class='wycats'>Yehuda Katz</li><!----></ul>", "Initial render");
            rerender();
            assertStableNodes('tomdale', "after no-op rerender");
            _glimmerTestHelpers.equalTokens(root, "<ul><li class='tomdale'>Tom Dale</li><li class='wycats'>Yehuda Katz</li><!----></ul>", "After no-op re-render");
            rerender();
            assertStableNodes('tomdale', "after non-dirty rerender");
            _glimmerTestHelpers.equalTokens(root, "<ul><li class='tomdale'>Tom Dale</li><li class='wycats'>Yehuda Katz</li><!----></ul>", "After no-op re-render");
            object = { list: [yehuda, tom] };
            rerender(object);
            assertStableNodes('tomdale', "after changing the list order");
            _glimmerTestHelpers.equalTokens(root, "<ul><li class='wycats'>Yehuda Katz</li><li class='tomdale'>Tom Dale</li><!----></ul>", "After changing the list order");
            object = { list: [{ key: "1", name: "Martin Muñoz", "class": "mmun" }, { key: "2", name: "Kris Selden", "class": "krisselden" }] };
            rerender(object);
            assertStableNodes('mmun', "after changing the list entries, but with stable keys");
            _glimmerTestHelpers.equalTokens(root, "<ul><li class='mmun'>Martin Muñoz</li><li class='krisselden'>Kris Selden</li><!----></ul>", "After changing the list entries, but with stable keys");
            object = { list: [{ key: "1", name: "Martin Muñoz", "class": "mmun" }, { key: "2", name: "Kristoph Selden", "class": "krisselden" }, { key: "3", name: "Matthew Beale", "class": "mixonic" }] };
            rerender(object);
            assertStableNodes('mmun', "after adding an additional entry");
            _glimmerTestHelpers.equalTokens(root, _glimmerTestHelpers.stripTight(_templateObject), "After adding an additional entry");
            object = { list: [{ key: "1", name: "Martin Muñoz", "class": "mmun" }, { key: "3", name: "Matthew Beale", "class": "mixonic" }] };
            rerender(object);
            assertStableNodes('mmun', "after removing the middle entry");
            _glimmerTestHelpers.equalTokens(root, "<ul><li class='mmun'>Martin Muñoz</li><li class='mixonic'>Matthew Beale</li><!----></ul>", "after removing the middle entry");
            object = { list: [{ key: "1", name: "Martin Muñoz", "class": "mmun" }, { key: "4", name: "Stefan Penner", "class": "stefanpenner" }, { key: "5", name: "Robert Jackson", "class": "rwjblue" }] };
            rerender(object);
            assertStableNodes('mmun', "after adding two more entries");
            _glimmerTestHelpers.equalTokens(root, _glimmerTestHelpers.stripTight(_templateObject2), "After adding two more entries");
            // New node for stability check
            itemNode = getItemNode('rwjblue');
            nameNode = getNameNode('rwjblue');
            object = { list: [{ key: "5", name: "Robert Jackson", "class": "rwjblue" }] };
            rerender(object);
            assertStableNodes('rwjblue', "after removing two entries");
            _glimmerTestHelpers.equalTokens(root, "<ul><li class='rwjblue'>Robert Jackson</li><!----></ul>", "After removing two entries");
            object = { list: [{ key: "1", name: "Martin Muñoz", "class": "mmun" }, { key: "4", name: "Stefan Penner", "class": "stefanpenner" }, { key: "5", name: "Robert Jackson", "class": "rwjblue" }] };
            rerender(object);
            assertStableNodes('rwjblue', "after adding back entries");
            _glimmerTestHelpers.equalTokens(root, _glimmerTestHelpers.stripTight(_templateObject2), "After adding back entries");
            // New node for stability check
            itemNode = getItemNode('mmun');
            nameNode = getNameNode('mmun');
            object = { list: [{ key: "1", name: "Martin Muñoz", "class": "mmun" }] };
            rerender(object);
            assertStableNodes('mmun', "after removing from the back");
            _glimmerTestHelpers.equalTokens(root, "<ul><li class='mmun'>Martin Muñoz</li><!----></ul>", "After removing from the back");
            object = { list: [] };
            rerender(object);
            strictEqual(root.firstChild.firstChild.nodeType, 8, "there are no li's after removing the remaining entry");
            _glimmerTestHelpers.equalTokens(root, "<ul><!----></ul>", "After removing the remaining entries");
            function rerender(context) {
                result.rerender(context);
            }
            function assertStableNodes(className, message) {
                strictEqual(getItemNode(className), itemNode, "The item node has not changed " + message);
                strictEqual(getNameNode(className), nameNode, "The name node has not changed " + message);
            }
            function getItemNode(className) {
                // <li>
                var itemNode = root.firstChild.firstChild;
                while (itemNode && itemNode.getAttribute) {
                    if (itemNode.getAttribute('class') === className) {
                        break;
                    }
                    itemNode = itemNode.nextSibling;
                }
                ok(itemNode, "Expected node with class='" + className + "'");
                return itemNode;
            }
            function getNameNode(className) {
                // {{item.name}}
                var itemNode = getItemNode(className);
                ok(itemNode, "Expected child node of node with class='" + className + "', but no parent node found");
                var childNode = itemNode && itemNode.firstChild;
                ok(childNode, "Expected child node of node with class='" + className + "', but not child node found");
                return childNode;
            }
        });
    }
    var destroyedRenderNodeCount;
    var destroyedRenderNode;
    QUnit.module("HTML-based compiler (dirtying) - pruning", {
        beforeEach: function () {
            commonSetup();
            destroyedRenderNodeCount = 0;
            destroyedRenderNode = null;
            hooks.destroyRenderNode = function (renderNode) {
                destroyedRenderNode = renderNode;
                destroyedRenderNodeCount++;
            };
        }
    });
    QUnit.skip("Pruned render nodes invoke a cleanup hook when replaced", function () {
        var object = { condition: true, value: 'hello world', falsy: "Nothing" };
        var template = _glimmerCompiler.compile('<div>{{#if condition}}<p>{{value}}</p>{{else}}<p>{{falsy}}</p>{{/if}}</div>');
        var result = render(template, object);
        _glimmerTestHelpers.equalTokens(root, "<div><p>hello world</p></div>");
        object.condition = false;
        result.rerender();
        strictEqual(destroyedRenderNodeCount, 1, "cleanup hook was invoked once");
        strictEqual(destroyedRenderNode.lastValue, 'hello world', "The correct render node is passed in");
        object.condition = true;
        result.rerender();
        strictEqual(destroyedRenderNodeCount, 2, "cleanup hook was invoked again");
        strictEqual(destroyedRenderNode.lastValue, 'Nothing', "The correct render node is passed in");
    });
    QUnit.skip("MorphLists in childMorphs are properly cleared", function () {
        var object = {
            condition: true,
            falsy: "Nothing",
            list: [{ key: "1", word: 'Hello' }, { key: "2", word: 'World' }]
        };
        var template = _glimmerCompiler.compile('<div>{{#if condition}}{{#each list as |item|}}<p>{{item.word}}</p>{{/each}}{{else}}<p>{{falsy}}</p>{{/if}}</div>');
        var result = render(template, object);
        _glimmerTestHelpers.equalTokens(root, "<div><p>Hello</p><p>World</p></div>");
        object.condition = false;
        result.rerender();
        _glimmerTestHelpers.equalTokens(root, "<div><p>Nothing</p></div>");
        strictEqual(destroyedRenderNodeCount, 5, "cleanup hook was invoked for each morph");
        object.condition = true;
        result.rerender();
        strictEqual(destroyedRenderNodeCount, 6, "cleanup hook was invoked again");
    });
    QUnit.skip("Pruned render nodes invoke a cleanup hook when cleared", function () {
        var object = { condition: true, value: 'hello world' };
        var template = _glimmerCompiler.compile('<div>{{#if condition}}<p>{{value}}</p>{{/if}}</div>');
        var result = render(template, object);
        _glimmerTestHelpers.equalTokens(root, "<div><p>hello world</p></div>");
        object.condition = false;
        result.rerender();
        strictEqual(destroyedRenderNodeCount, 1, "cleanup hook was invoked once");
        strictEqual(destroyedRenderNode.lastValue, 'hello world', "The correct render node is passed in");
        object.condition = true;
        result.rerender();
        strictEqual(destroyedRenderNodeCount, 1, "cleanup hook was not invoked again");
    });
    QUnit.skip("Pruned lists invoke a cleanup hook when removing elements", function () {
        var object = { list: [{ key: "1", word: "hello" }, { key: "2", word: "world" }] };
        var template = _glimmerCompiler.compile('<div>{{#each list as |item|}}<p>{{item.word}}</p>{{/each}}</div>');
        var result = render(template, object);
        _glimmerTestHelpers.equalTokens(root, "<div><p>hello</p><p>world</p></div>");
        object.list.pop();
        result.rerender();
        strictEqual(destroyedRenderNodeCount, 2, "cleanup hook was invoked once for the wrapper morph and once for the {{item.word}}");
        strictEqual(destroyedRenderNode.lastValue, "world", "The correct render node is passed in");
        object.list.pop();
        result.rerender();
        strictEqual(destroyedRenderNodeCount, 4, "cleanup hook was invoked once for the wrapper morph and once for the {{item.word}}");
        strictEqual(destroyedRenderNode.lastValue, "hello", "The correct render node is passed in");
    });
    QUnit.skip("Pruned lists invoke a cleanup hook on their subtrees when removing elements", function () {
        var object = { list: [{ key: "1", word: "hello" }, { key: "2", word: "world" }] };
        var template = _glimmerCompiler.compile('<div>{{#each list as |item|}}<p>{{#if item.word}}{{item.word}}{{/if}}</p>{{/each}}</div>');
        var result = render(template, object);
        _glimmerTestHelpers.equalTokens(root, "<div><p>hello</p><p>world</p></div>");
        object.list.pop();
        result.rerender();
        strictEqual(destroyedRenderNodeCount, 3, "cleanup hook was invoked once for the wrapper morph and once for the {{item.word}}");
        strictEqual(destroyedRenderNode.lastValue, "world", "The correct render node is passed in");
        object.list.pop();
        result.rerender();
        strictEqual(destroyedRenderNodeCount, 6, "cleanup hook was invoked once for the wrapper morph and once for the {{item.word}}");
        strictEqual(destroyedRenderNode.lastValue, "hello", "The correct render node is passed in");
    });
});
//# sourceMappingURL=demos.amd.map