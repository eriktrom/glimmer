enifed("glimmer/index", ["exports", "./glimmer-syntax", "glimmer-compiler"], function (exports, _glimmerSyntax, _glimmerCompiler) {
  /*
   * @overview  Glimmer
   * @copyright Copyright 2011-2015 Tilde Inc. and contributors
   * @license   Licensed under MIT license
   *            See https://raw.githubusercontent.com/tildeio/glimmer/master/LICENSE
   * @version   VERSION_STRING_PLACEHOLDER
   */

  // Break cycles in the module loader.
  "use strict";

  exports.compile = _glimmerCompiler.compile;
  exports.compileSpec = _glimmerCompiler.compileSpec;
});

enifed('glimmer-compiler/index', ['exports', './lib/compiler', './lib/template-compiler', './lib/template-visitor'], function (exports, _libCompiler, _libTemplateCompiler, _libTemplateVisitor) {
  'use strict';

  exports.TemplateCompiler = _libTemplateCompiler.default;
  exports.TemplateVisitor = _libTemplateVisitor.default;
  exports.compile = _libCompiler.compile;
  exports.compileSpec = _libCompiler.compileSpec;
  exports.template = _libCompiler.template;
});

enifed("glimmer-compiler/lib/compiler", ["exports", "glimmer-syntax", "./template-compiler", "glimmer-runtime"], function (exports, _glimmerSyntax, _templateCompiler, _glimmerRuntime) {
  "use strict";

  exports.compileSpec = compileSpec;
  exports.template = template;
  exports.compile = compile;

  /*
   * Compile a string into a template spec string. The template spec is a string
   * representation of a template. Usually, you would use compileSpec for
   * pre-compilation of a template on the server.
   *
   * Example usage:
   *
   *     var templateSpec = compileSpec("Howdy {{name}}");
   *     // This next step is basically what plain compile does
   *     var template = new Function("return " + templateSpec)();
   *
   * @method compileSpec
   * @param {String} string An Glimmer template string
   * @return {TemplateSpec} A template spec string
   */

  function compileSpec(string, options) {
    var ast = _glimmerSyntax.preprocess(string, options);
    var program = _templateCompiler.default.compile(options, ast);
    return JSON.stringify(program);
  }

  /*
   * @method template
   * @param {TemplateSpec} templateSpec A precompiled template
   * @return {Template} A template spec string
   */

  function template(templateSpec) {
    return new Function("return " + templateSpec)();
  }

  /*
   * Compile a string into a template rendering function
   *
   * Example usage:
   *
   *     // Template is the hydration portion of the compiled template
   *     var template = compile("Howdy {{name}}");
   *
   *     // Template accepts three arguments:
   *     //
   *     //   1. A context object
   *     //   2. An env object
   *     //   3. A contextualElement (optional, document.body is the default)
   *     //
   *     // The env object *must* have at least these two properties:
   *     //
   *     //   1. `hooks` - Basic hooks for rendering a template
   *     //   2. `dom` - An instance of DOMHelper
   *     //
   *     import {hooks} from 'glimmer-runtime';
   *     import {DOMHelper} from 'morph';
   *     var context = {name: 'whatever'},
   *         env = {hooks: hooks, dom: new DOMHelper()},
   *         contextualElement = document.body;
   *     var domFragment = template(context, env, contextualElement);
   *
   * @method compile
   * @param {String} string An Glimmer template string
   * @param {Object} options A set of options to provide to the compiler
   * @return {Template} A function for rendering the template
   */

  function compile(string) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var templateSpec = template(compileSpec(string, options));
    return _glimmerRuntime.Template.fromSpec(templateSpec);
  }
});

enifed("glimmer-compiler/lib/template-compiler", ["exports", "./template-visitor", "./utils", "glimmer-util", "glimmer-syntax"], function (exports, _templateVisitor, _utils, _glimmerUtil, _glimmerSyntax) {
    "use strict";

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    var Template = function Template() {
        _classCallCheck(this, Template);

        this.statements = null;
        this.locals = null;
        this.named = null;
        this.meta = null;
        this.arity = null;
    };

    var JavaScriptCompiler = (function () {
        function JavaScriptCompiler(opcodes) {
            _classCallCheck(this, JavaScriptCompiler);

            this.locals = null;
            this.namedAttrs = _glimmerUtil.dict();
            this.opcodes = opcodes;
            this.output = [];
            this.expressions = [];
            this.templates = [];
        }

        JavaScriptCompiler.process = function process(opcodes) {
            var compiler = new JavaScriptCompiler(opcodes);
            compiler.process();
            return compiler.templates;
        };

        JavaScriptCompiler.prototype.process = function process() {
            var _this = this;

            this.opcodes.forEach(function (_ref) {
                var opcode = _ref[0];

                var args = _ref.slice(1);

                if (!_this[opcode]) {
                    throw new Error("unimplemented " + opcode + " on JavaScriptCompiler");
                }
                _this[opcode].apply(_this, args);
            });
        };

        /// Nesting

        JavaScriptCompiler.prototype.startProgram = function startProgram(_ref2) {
            var program = _ref2[0];

            this.locals = program.blockParams;
        };

        JavaScriptCompiler.prototype.endProgram = function endProgram() {
            var template = new Template();
            var attrs = Object.keys(this.namedAttrs);
            if (this.locals.length) {
                template.locals = this.locals;
                this.locals = [];
            }
            if (attrs.length) {
                template.named = attrs;
                this.namedAttrs = _glimmerUtil.dict();
            }
            template.statements = this.output;
            this.output = [];
            this.templates.push(template);
        };

        /// Statements

        JavaScriptCompiler.prototype.text = function text(content) {
            this.push('text', content);
        };

        JavaScriptCompiler.prototype.append = function append(trusted) {
            this.push('append', this.popExpression(), trusted);
        };

        JavaScriptCompiler.prototype.comment = function comment(value) {
            this.push('comment', value);
        };

        JavaScriptCompiler.prototype.modifier = function modifier(path) {
            var params = this.popExpression();
            var hash = this.popExpression();
            this.push('modifier', path, params, hash);
        };

        JavaScriptCompiler.prototype.block = function block(path, template, inverse) {
            var params = this.popExpression();
            var hash = this.popExpression();
            this.push('block', path, params, hash, template, inverse);
        };

        JavaScriptCompiler.prototype.component = function component(tag, template) {
            var attrs = this.popExpression();
            this.push('component', tag, attrs, template);
        };

        JavaScriptCompiler.prototype.openElement = function openElement(tag, blockParams) {
            this.push('openElement', tag, blockParams);
        };

        JavaScriptCompiler.prototype.closeElement = function closeElement() {
            this.push('closeElement');
        };

        JavaScriptCompiler.prototype.addClass = function addClass(name) {
            var value = this.popExpression();
            this.push('addClass', value);
        };

        JavaScriptCompiler.prototype.staticAttr = function staticAttr(name, namespace) {
            var value = this.popExpression();
            this.push('staticAttr', name, value, namespace);
        };

        JavaScriptCompiler.prototype.dynamicAttr = function dynamicAttr(name, namespace) {
            var value = this.popExpression();
            this.push('dynamicAttr', name, value, namespace);
        };

        JavaScriptCompiler.prototype.dynamicProp = function dynamicProp(name) {
            var value = this.popExpression();
            this.push('dynamicProp', name, value);
        };

        /// Expressions

        JavaScriptCompiler.prototype.literal = function literal(value) {
            this.pushValue(value);
        };

        JavaScriptCompiler.prototype.unknown = function unknown(path) {
            this.pushExpression('unknown', path);
        };

        JavaScriptCompiler.prototype.attr = function attr(path) {
            this.namedAttrs[path[0]] = true;
            this.pushExpression('attr', path);
        };

        JavaScriptCompiler.prototype.get = function get(path) {
            this.pushExpression('get', path);
        };

        JavaScriptCompiler.prototype.concat = function concat() {
            this.pushExpression('concat', this.popExpression());
        };

        JavaScriptCompiler.prototype.helper = function helper(path) {
            var params = this.popExpression();
            var hash = this.popExpression();
            this.pushExpression('helper', path, params, hash);
        };

        /// Stack Management Opcodes

        JavaScriptCompiler.prototype.pushLiteral = function pushLiteral(literal) {
            this.pushValue(literal);
        };

        JavaScriptCompiler.prototype.prepareArray = function prepareArray(size) {
            var values = [];
            for (var i = 0; i < size; i++) {
                values.push(this.popExpression());
            }
            this.pushValue(values);
        };

        JavaScriptCompiler.prototype.prepareObject = function prepareObject(size) {
            _utils.assert(this.expressions.length >= size, "Expected " + size + " expressions on the stack, found " + this.expressions.length);
            var pairs = [];
            for (var i = 0; i < size; i++) {
                pairs.push(this.popExpression(), this.popExpression());
            }
            this.pushValue(pairs);
        };

        /// Utilities

        JavaScriptCompiler.prototype.push = function push(name) {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            while (args[args.length - 1] === null) {
                args.pop();
            }
            this.output.push([name].concat(args));
        };

        JavaScriptCompiler.prototype.pushExpression = function pushExpression(name) {
            for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
            }

            this.expressions.push([name].concat(args));
        };

        JavaScriptCompiler.prototype.pushValue = function pushValue(val) {
            this.expressions.push(val);
        };

        JavaScriptCompiler.prototype.popExpression = function popExpression() {
            _utils.assert(this.expressions.length, "No expression found on stack");
            return this.expressions.pop();
        };

        return JavaScriptCompiler;
    })();

    var TemplateCompiler = (function () {
        function TemplateCompiler() {
            var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            _classCallCheck(this, TemplateCompiler);

            this.templateId = 0;
            this.templateIds = [];
            this.opcodes = [];
            this.includeMeta = false;
            this.options = options;
        }

        TemplateCompiler.compile = function compile(options, ast) {
            var templateVisitor = new _templateVisitor.default();
            templateVisitor.visit(ast);
            var compiler = new TemplateCompiler(options);
            var opcodes = compiler.process(templateVisitor.actions);
            return JavaScriptCompiler.process(opcodes);
        };

        TemplateCompiler.prototype.process = function process(actions) {
            var _this2 = this;

            actions.forEach(function (_ref3) {
                var name = _ref3[0];

                var args = _ref3.slice(1);

                if (!_this2[name]) {
                    throw new Error("Unimplemented " + name + " on TemplateCompiler");
                }
                _this2[name].apply(_this2, args);
            });
            return this.opcodes;
        };

        TemplateCompiler.prototype.startProgram = function startProgram(program) {
            this.templateId++;
            this.opcode('startProgram', program, program);
        };

        TemplateCompiler.prototype.endProgram = function endProgram() {
            this.templateIds.push(this.templateId - 1);
            this.opcode('endProgram', null);
        };

        TemplateCompiler.prototype.text = function text(_ref4) {
            var action = _ref4[0];

            this.opcode('text', action, action.chars);
        };

        TemplateCompiler.prototype.comment = function comment(_ref5) {
            var action = _ref5[0];

            this.opcode('comment', action, action.value);
        };

        TemplateCompiler.prototype.openElement = function openElement(_ref6) {
            var action = _ref6[0];

            this.opcode('openElement', action, action.tag, action.blockParams);
            for (var i = 0; i < action.attributes.length; i++) {
                this.attribute([action.attributes[i]]);
            }
            for (var i = 0; i < action.modifiers.length; i++) {
                this.modifier([action.modifiers[i]]);
            }
        };

        TemplateCompiler.prototype.closeElement = function closeElement() {
            this.opcode('closeElement', null);
        };

        TemplateCompiler.prototype.component = function component(_ref7) {
            var action = _ref7[0];
            var attributes = action.attributes;
            var tag = action.tag;

            for (var i = 0; i < attributes.length; i++) {
                var _attributes$i = attributes[i];
                var _name = _attributes$i.name;
                var value = _attributes$i.value;

                this.prepareAttributeValue(value);
                this.opcode('pushLiteral', _name, _name);
            }
            this.opcode('prepareObject', null, attributes.length);
            this.opcode('component', action, tag, this.templateIds.pop());
        };

        TemplateCompiler.prototype.attribute = function attribute(_ref8) {
            var action = _ref8[0];
            var name = action.name;
            var value = action.value;

            var namespace = _glimmerUtil.getAttrNamespace(name);
            var isStatic = this.prepareAttributeValue(value);
            // REFACTOR TODO: escaped?
            if (name === 'class') {
                this.opcode('addClass', action);
            } else if (isStatic) {
                this.opcode('staticAttr', action, name, namespace);
            } else if (action.value.type === 'MustacheStatement') {
                this.opcode('dynamicProp', action, name);
            } else {
                this.opcode('dynamicAttr', action, name, namespace);
            }
        };

        TemplateCompiler.prototype.modifier = function modifier(_ref9) {
            var action = _ref9[0];
            var parts = action.path.parts;

            this.prepareHelper(action);
            this.opcode('modifier', action, parts);
        };

        TemplateCompiler.prototype.mustache = function mustache(_ref10) {
            var action = _ref10[0];

            if (action.path.data) {
                this.attr([action.path]);
            } else if (_glimmerSyntax.isHelper(action)) {
                this.SubExpression(action);
            } else {
                this.ambiguous([action]);
            }
            this.opcode('append', action, !action.escaped);
        };

        TemplateCompiler.prototype.block = function block(_ref11) /*, index, count*/{
            var action = _ref11[0];

            this.prepareHelper(action);
            var templateId = this.templateIds.pop();
            var inverseId = action.inverse === null ? null : this.templateIds.pop();
            this.opcode('block', action, action.path.parts, templateId, inverseId);
        };

        /// Internal actions, not found in the original processed actions

        TemplateCompiler.prototype.attributeMustache = function attributeMustache(_ref12) {
            var action = _ref12[0];
            var path = action.path;

            if (path.data) {
                this.attr([action.path]);
            } else if (_glimmerSyntax.isHelper(action)) {
                this.prepareHelper(action);
                this.opcode('helper', action, path.parts);
            } else if (path.type === 'PathExpression') {
                this.opcode('get', action, path.parts);
            } else {
                this.opcode('literal', action, path.value);
            }
        };

        TemplateCompiler.prototype.attr = function attr(_ref13) {
            var path = _ref13[0];
            var parts = path.parts;
            var data = path.data;

            if (data) {
                parts = parts.slice();
                parts[0] = "@" + parts[0];
            }
            this.opcode('attr', path, parts);
        };

        TemplateCompiler.prototype.ambiguous = function ambiguous(_ref14) {
            var action = _ref14[0];

            this.opcode('unknown', action, action.path.parts);
        };

        /// Expressions, invoked recursively from prepareParams and prepareHash

        TemplateCompiler.prototype.SubExpression = function SubExpression(expr) {
            this.prepareHelper(expr);
            this.opcode('helper', expr, expr.path.parts);
        };

        TemplateCompiler.prototype.PathExpression = function PathExpression(expr) {
            if (expr.data) {
                this.attr([expr]);
            } else {
                this.opcode('get', expr, expr.parts);
            }
        };

        TemplateCompiler.prototype.StringLiteral = function StringLiteral(action) {
            this.opcode('pushLiteral', null, action.value);
        };

        TemplateCompiler.prototype.BooleanLiteral = function BooleanLiteral(action) {
            this.opcode('pushLiteral', null, action.value);
        };

        TemplateCompiler.prototype.NumberLiteral = function NumberLiteral(action) {
            this.opcode('pushLiteral', null, action.value);
        };

        TemplateCompiler.prototype.NullLiteral = function NullLiteral(action) {
            this.opcode('pushLiteral', null, action.value);
        };

        TemplateCompiler.prototype.UndefinedLiteral = function UndefinedLiteral(action) {
            this.opcode('pushLiteral', null, action.value);
        };

        /// Utilities

        TemplateCompiler.prototype.opcode = function opcode(name, action) {
            for (var _len3 = arguments.length, args = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
                args[_key3 - 2] = arguments[_key3];
            }

            var opcode = [name].concat(args);
            if (this.includeMeta && action) {
                opcode.push(this.meta(action));
            }
            this.opcodes.push(opcode);
        };

        TemplateCompiler.prototype.prepareHelper = function prepareHelper(_ref15) {
            var params = _ref15.params;
            var hash = _ref15.hash;

            this.prepareHash(hash);
            this.prepareParams(params);
        };

        TemplateCompiler.prototype.preparePath = function preparePath(path) {
            this.opcode('pushLiteral', path, path.parts);
        };

        TemplateCompiler.prototype.prepareParams = function prepareParams(params) {
            if (!params.length) {
                this.opcode('pushLiteral', null, null);
                return;
            }
            for (var i = params.length - 1; i >= 0; i--) {
                var param = params[i];
                if (param.type === 'MustacheStatement') {
                    this.attributeMustache([param]);
                } else {
                    _utils.assert(this[param.type], "Unimplemented " + param.type + " on TemplateCompiler");
                    this[param.type](param);
                }
            }
            this.opcode('prepareArray', null, params.length);
        };

        TemplateCompiler.prototype.prepareHash = function prepareHash(hash) {
            var pairs = hash.pairs;
            if (!pairs.length) {
                this.opcode('pushLiteral', null, null);
                return;
            }
            for (var i = pairs.length - 1; i >= 0; i--) {
                var _pairs$i = pairs[i];
                var key = _pairs$i.key;
                var value = _pairs$i.value;

                _utils.assert(this[value.type], "Unimplemented " + value.type + " on TemplateCompiler");
                this[value.type](value);
                this.opcode('pushLiteral', null, key);
            }
            this.opcode('prepareObject', null, pairs.length);
        };

        TemplateCompiler.prototype.prepareAttributeValue = function prepareAttributeValue(value) {
            // returns the static value if the value is static
            switch (value.type) {
                case 'TextNode':
                    this.opcode('literal', value, value.chars);
                    return true;
                case 'MustacheStatement':
                    this.attributeMustache([value]);
                    return false;
                case 'ConcatStatement':
                    this.prepareParams(value.parts);
                    this.opcode('concat', value);
                    return false;
            }
        };

        TemplateCompiler.prototype.meta = function meta(node) {
            var loc = node.loc;
            if (!loc) {
                return [];
            }
            var source = loc.source;
            var start = loc.start;
            var end = loc.end;

            return ['loc', [source || null, [start.line, start.column], [end.line, end.column]]];
        };

        return TemplateCompiler;
    })();

    exports.default = TemplateCompiler;
});

enifed('glimmer-compiler/lib/template-visitor', ['exports'], function (exports) {
    'use strict';

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var push = Array.prototype.push;

    var Frame = function Frame() {
        _classCallCheck(this, Frame);

        this.parentNode = null;
        this.children = null;
        this.childIndex = null;
        this.childCount = null;
        this.childTemplateCount = 0;
        this.mustacheCount = 0;
        this.actions = [];
        this.blankChildTextNodes = null;
    }
    /**
     * Takes in an AST and outputs a list of actions to be consumed
     * by a compiler. For example, the template
     *
     *     foo{{bar}}<div>baz</div>
     *
     * produces the actions
     *
     *     [['startProgram', [programNode, 0]],
     *      ['text', [textNode, 0, 3]],
     *      ['mustache', [mustacheNode, 1, 3]],
     *      ['openElement', [elementNode, 2, 3, 0]],
     *      ['text', [textNode, 0, 1]],
     *      ['closeElement', [elementNode, 2, 3],
     *      ['endProgram', [programNode]]]
     *
     * This visitor walks the AST depth first and backwards. As
     * a result the bottom-most child template will appear at the
     * top of the actions list whereas the root template will appear
     * at the bottom of the list. For example,
     *
     *     <div>{{#if}}foo{{else}}bar<b></b>{{/if}}</div>
     *
     * produces the actions
     *
     *     [['startProgram', [programNode, 0]],
     *      ['text', [textNode, 0, 2, 0]],
     *      ['openElement', [elementNode, 1, 2, 0]],
     *      ['closeElement', [elementNode, 1, 2]],
     *      ['endProgram', [programNode]],
     *      ['startProgram', [programNode, 0]],
     *      ['text', [textNode, 0, 1]],
     *      ['endProgram', [programNode]],
     *      ['startProgram', [programNode, 2]],
     *      ['openElement', [elementNode, 0, 1, 1]],
     *      ['block', [blockNode, 0, 1]],
     *      ['closeElement', [elementNode, 0, 1]],
     *      ['endProgram', [programNode]]]
     *
     * The state of the traversal is maintained by a stack of frames.
     * Whenever a node with children is entered (either a ProgramNode
     * or an ElementNode) a frame is pushed onto the stack. The frame
     * contains information about the state of the traversal of that
     * node. For example,
     *
     *   - index of the current child node being visited
     *   - the number of mustaches contained within its child nodes
     *   - the list of actions generated by its child nodes
     */
    ;

    function TemplateVisitor() {
        this.frameStack = [];
        this.actions = [];
        this.programDepth = -1;
    }
    // Traversal methods
    TemplateVisitor.prototype.visit = function (node) {
        this[node.type](node);
    };
    TemplateVisitor.prototype.Program = function (program) {
        this.programDepth++;
        var parentFrame = this.getCurrentFrame();
        var programFrame = this.pushFrame();
        programFrame.parentNode = program;
        programFrame.children = program.body;
        programFrame.childCount = program.body.length;
        programFrame.blankChildTextNodes = [];
        programFrame.actions.push(['endProgram', [program, this.programDepth]]);
        for (var i = program.body.length - 1; i >= 0; i--) {
            programFrame.childIndex = i;
            this.visit(program.body[i]);
        }
        programFrame.actions.push(['startProgram', [program, programFrame.childTemplateCount, programFrame.blankChildTextNodes.reverse()]]);
        this.popFrame();
        this.programDepth--;
        // Push the completed template into the global actions list
        if (parentFrame) {
            parentFrame.childTemplateCount++;
        }
        push.apply(this.actions, programFrame.actions.reverse());
    };
    TemplateVisitor.prototype.ElementNode = function (element) {
        var parentFrame = this.getCurrentFrame();
        var elementFrame = this.pushFrame();
        elementFrame.parentNode = element;
        elementFrame.children = element.children;
        elementFrame.childCount = element.children.length;
        elementFrame.mustacheCount += element.modifiers.length;
        elementFrame.blankChildTextNodes = [];
        var actionArgs = [element, parentFrame.childIndex, parentFrame.childCount];
        elementFrame.actions.push(['closeElement', actionArgs]);
        for (var i = element.attributes.length - 1; i >= 0; i--) {
            this.visit(element.attributes[i]);
        }
        for (i = element.children.length - 1; i >= 0; i--) {
            elementFrame.childIndex = i;
            this.visit(element.children[i]);
        }
        elementFrame.actions.push(['openElement', actionArgs.concat([elementFrame.mustacheCount, elementFrame.blankChildTextNodes.reverse()])]);
        this.popFrame();
        // Propagate the element's frame state to the parent frame
        if (elementFrame.mustacheCount > 0) {
            parentFrame.mustacheCount++;
        }
        parentFrame.childTemplateCount += elementFrame.childTemplateCount;
        push.apply(parentFrame.actions, elementFrame.actions);
    };
    TemplateVisitor.prototype.AttrNode = function (attr) {
        if (attr.value.type !== 'TextNode') {
            this.getCurrentFrame().mustacheCount++;
        }
    };
    TemplateVisitor.prototype.TextNode = function (text) {
        var frame = this.getCurrentFrame();
        if (text.chars === '') {
            frame.blankChildTextNodes.push(domIndexOf(frame.children, text));
        }
        frame.actions.push(['text', [text, frame.childIndex, frame.childCount]]);
    };
    TemplateVisitor.prototype.BlockStatement = function (node) {
        var frame = this.getCurrentFrame();
        frame.mustacheCount++;
        frame.actions.push(['block', [node, frame.childIndex, frame.childCount]]);
        if (node.inverse) {
            this.visit(node.inverse);
        }
        if (node.program) {
            this.visit(node.program);
        }
    };
    TemplateVisitor.prototype.ComponentNode = function (node) {
        var frame = this.getCurrentFrame();
        frame.mustacheCount++;
        frame.actions.push(['component', [node, frame.childIndex, frame.childCount]]);
        if (node.program) {
            this.visit(node.program);
        }
    };
    TemplateVisitor.prototype.PartialStatement = function (node) {
        var frame = this.getCurrentFrame();
        frame.mustacheCount++;
        frame.actions.push(['mustache', [node, frame.childIndex, frame.childCount]]);
    };
    TemplateVisitor.prototype.CommentStatement = function (text) {
        var frame = this.getCurrentFrame();
        frame.actions.push(['comment', [text, frame.childIndex, frame.childCount]]);
    };
    TemplateVisitor.prototype.MustacheStatement = function (mustache) {
        var frame = this.getCurrentFrame();
        frame.mustacheCount++;
        frame.actions.push(['mustache', [mustache, frame.childIndex, frame.childCount]]);
    };
    // Frame helpers
    TemplateVisitor.prototype.getCurrentFrame = function () {
        return this.frameStack[this.frameStack.length - 1];
    };
    TemplateVisitor.prototype.pushFrame = function () {
        var frame = new Frame();
        this.frameStack.push(frame);
        return frame;
    };
    TemplateVisitor.prototype.popFrame = function () {
        return this.frameStack.pop();
    };
    exports.default = TemplateVisitor;

    // Returns the index of `domNode` in the `nodes` array, skipping
    // over any nodes which do not represent DOM nodes.
    function domIndexOf(nodes, domNode) {
        var index = -1;
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            if (node.type !== 'TextNode' && node.type !== 'ElementNode') {
                continue;
            } else {
                index++;
            }
            if (node === domNode) {
                return index;
            }
        }
        return -1;
    }
});

enifed("glimmer-compiler/lib/utils", ["exports"], function (exports) {
    "use strict";

    exports.processOpcodes = processOpcodes;
    exports.assert = assert;

    function processOpcodes(compiler, opcodes) {
        for (var i = 0, l = opcodes.length; i < l; i++) {
            var method = opcodes[i][0];
            var params = opcodes[i][1];
            if (params) {
                compiler[method].apply(compiler, params);
            } else {
                compiler[method].call(compiler);
            }
        }
    }

    // REFACTOR TODO: Remove

    function assert(test, error) {
        if (!test) {
            throw new Error(error);
        }
    }
});

enifed('glimmer-object/index', ['exports', './lib/object', './lib/computed', './lib/mixin', './lib/descriptors'], function (exports, _libObject, _libComputed, _libMixin, _libDescriptors) {
  'use strict';

  exports.default = _libObject.default;
  exports.ClassMeta = _libObject.ClassMeta;
  exports.InstanceMeta = _libObject.InstanceMeta;
  exports.GlimmerObjectFactory = _libObject.GlimmerObjectFactory;
  exports.computed = _libComputed.computed;
  exports.observer = _libComputed.observer;
  exports.Mixin = _libMixin.Mixin;
  exports.Blueprint = _libMixin.Blueprint;
  exports.toMixin = _libMixin.toMixin;
  exports.aliasMethod = _libDescriptors.aliasMethod;
  exports.alias = _libDescriptors.alias;
});

enifed('glimmer-object/lib/computed', ['exports', 'glimmer-util', 'glimmer-reference', './object', './mixin'], function (exports, _glimmerUtil, _glimmerReference, _object, _mixin) {
    'use strict';

    exports.computed = computed;
    exports.observer = observer;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    var ComputedBlueprint = (function (_Blueprint) {
        _inherits(ComputedBlueprint, _Blueprint);

        function ComputedBlueprint(accessor) {
            var deps = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

            _classCallCheck(this, ComputedBlueprint);

            _Blueprint.call(this);
            this.metadata = {};
            this.accessor = accessor;
            this.deps = deps;
        }

        ComputedBlueprint.prototype.descriptor = function descriptor(target, key, classMeta) {
            classMeta.addReferenceTypeFor(key, _glimmerReference.ComputedReferenceBlueprint(key, this.deps));
            classMeta.addPropertyMetadata(key, this.metadata);
            classMeta.addSlotFor(key);
            return new Computed(this.accessor);
        };

        ComputedBlueprint.prototype.property = function property() {
            for (var _len = arguments.length, paths = Array(_len), _key = 0; _key < _len; _key++) {
                paths[_key] = arguments[_key];
            }

            this.deps = paths.map(function (d) {
                return d.split('.').map(_glimmerUtil.intern);
            });
            return this;
        };

        ComputedBlueprint.prototype.meta = function meta(object) {
            this.metadata = object;
            return this;
        };

        ComputedBlueprint.prototype.volatile = function volatile() {
            return this;
        };

        return ComputedBlueprint;
    })(_mixin.Blueprint);

    exports.ComputedBlueprint = ComputedBlueprint;

    var Computed = (function () {
        function Computed(accessor) {
            _classCallCheck(this, Computed);

            this["5d90f84f-908e-4a42-9749-3d0f523c262c"] = true;
            this.accessor = accessor;
        }

        Computed.prototype.define = function define(prototype, key, home) {
            Object.defineProperty(prototype, key, wrapAccessor(home, key, this.accessor));
        };

        return Computed;
    })();

    function wrapAccessor(home, accessorName, _desc) {
        var superDesc = getPropertyDescriptor(home, accessorName);
        var originalGet = undefined;
        var originalSet = undefined;
        var desc = {
            enumerable: true,
            configurable: true
        };
        if (_desc.get && _desc.get.length > 0) {
            originalGet = function () {
                return _desc.get.call(this, accessorName);
            };
        } else {
            originalGet = _desc.get;
        }
        if (_desc.set && _desc.set.length > 1) {
            originalSet = function (value) {
                return _desc.set.call(this, accessorName, value);
            };
        } else {
            originalSet = _desc.set;
        }
        var cacheGet = function () {
            if (_glimmerReference.Meta.exists(this)) {
                var slot = _glimmerReference.Meta.for(this).getSlots()[accessorName];
                if (slot !== _object.EMPTY_CACHE) return slot;
            }
            return originalGet.call(this);
        };
        var cacheSet = undefined;
        if (originalSet) {
            cacheSet = function (value) {
                var meta = _glimmerReference.Meta.for(this);
                var slots = meta.getSlots();
                var ret = originalSet.call(this, value);
                if (ret !== undefined) {
                    slots[accessorName] = ret;
                }
            };
        } else {
            cacheSet = function (value) {
                var meta = _glimmerReference.Meta.for(this);
                var slots = meta.getSlots();
                if (value !== undefined) slots[accessorName] = value;
            };
        }
        if (!superDesc || 'value' in superDesc) {
            desc.get = cacheGet;
            desc.set = cacheSet;
            return desc;
        }
        desc.get = function () {
            var lastSuper = this._super;
            this._super = function () {
                return superDesc.get.call(this);
            };
            try {
                return cacheGet.call(this);
            } finally {
                this._super = lastSuper;
            }
        };
        desc.set = function (val) {
            var lastSuper = this._super;
            this._super = function () {
                return superDesc.set.call(this, val);
            };
            try {
                return cacheSet.call(this, val);
            } finally {
                this._super = lastSuper;
            }
        };
        return desc;
    }
    function getPropertyDescriptor(subject, name) {
        var pd = Object.getOwnPropertyDescriptor(subject, name);
        var proto = Object.getPrototypeOf(subject);
        while (typeof pd === 'undefined' && proto !== null) {
            pd = Object.getOwnPropertyDescriptor(proto, name);
            proto = Object.getPrototypeOf(proto);
        }
        return pd;
    }

    function computed() {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        var last = args.pop();
        var deps = args;
        if (typeof last === 'function') {
            var _ref;

            return (_ref = new ComputedBlueprint({
                get: last
            })).property.apply(_ref, deps);
        } else if (typeof last === 'object') {
            var _ref2;

            return (_ref2 = new ComputedBlueprint(last)).property.apply(_ref2, deps);
        } else {
            throw new TypeError("computed expects a function or an object as last argument");
        }
    }

    function observer() {}
});

enifed('glimmer-object/lib/descriptors', ['exports', './mixin', './computed', 'glimmer-util'], function (exports, _mixin, _computed, _glimmerUtil) {
    'use strict';

    exports.aliasMethod = aliasMethod;
    exports.alias = alias;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    var AliasMethodDescriptor = (function (_Descriptor) {
        _inherits(AliasMethodDescriptor, _Descriptor);

        function AliasMethodDescriptor(name) {
            _classCallCheck(this, AliasMethodDescriptor);

            _Descriptor.call(this);
            this.name = name;
        }

        AliasMethodDescriptor.prototype.define = function define(target, key, home) {
            var name = this.name;
            Object.defineProperty(target, key, {
                enumerable: true,
                configurable: true,
                get: function () {
                    return this[name];
                }
            });
        };

        return AliasMethodDescriptor;
    })(_mixin.Descriptor);

    var AliasMethodBlueprint = (function (_Blueprint) {
        _inherits(AliasMethodBlueprint, _Blueprint);

        function AliasMethodBlueprint(name) {
            _classCallCheck(this, AliasMethodBlueprint);

            _Blueprint.call(this);
            this.name = name;
        }

        AliasMethodBlueprint.prototype.descriptor = function descriptor(target, key, meta) {
            return new AliasMethodDescriptor(this.name);
        };

        return AliasMethodBlueprint;
    })(_mixin.Blueprint);

    function aliasMethod(name) {
        return new AliasMethodBlueprint(_glimmerUtil.intern(name));
    }

    var AliasBlueprint = (function (_ComputedBlueprint) {
        _inherits(AliasBlueprint, _ComputedBlueprint);

        function AliasBlueprint(name) {
            _classCallCheck(this, AliasBlueprint);

            var parent = name.slice(0, -1);
            var last = name[name.length - 1];
            var get = function () {
                return name.reduce(function (obj, n) {
                    return obj[n];
                }, this);
            };
            var set = function (value) {
                var p = parent.reduce(function (obj, n) {
                    return obj[n];
                }, this);
                p[last] = value;
            };
            _ComputedBlueprint.call(this, { get: get, set: set }, [name]);
            this.name = name;
        }

        AliasBlueprint.prototype.descriptor = function descriptor(target, key, meta) {
            if (this.name[0] === key) throw new Error('Setting alias \'' + key + '\' on self');
            return _ComputedBlueprint.prototype.descriptor.call(this, target, key, meta);
        };

        return AliasBlueprint;
    })(_computed.ComputedBlueprint);

    function alias(name) {
        return new AliasBlueprint(name.split('.').map(_glimmerUtil.intern));
    }
});

enifed('glimmer-object/lib/mixin', ['exports', 'glimmer-reference', 'glimmer-util', './object', './utils'], function (exports, _glimmerReference, _glimmerUtil, _object, _utils) {
    'use strict';

    exports.extend = extend;
    exports.relinkSubclasses = relinkSubclasses;
    exports.toMixin = toMixin;
    exports.wrapMethod = wrapMethod;

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var DESCRIPTOR = "5d90f84f-908e-4a42-9749-3d0f523c262c";
    exports.DESCRIPTOR = DESCRIPTOR;
    var BLUEPRINT = "8d97cf5f-db9e-48d8-a6b2-7a75b7170805";
    exports.BLUEPRINT = BLUEPRINT;

    var Descriptor = function Descriptor() {
        _classCallCheck(this, Descriptor);

        this["5d90f84f-908e-4a42-9749-3d0f523c262c"] = true;
    };

    exports.Descriptor = Descriptor;

    var Blueprint = function Blueprint() {
        _classCallCheck(this, Blueprint);

        this["8d97cf5f-db9e-48d8-a6b2-7a75b7170805"] = true;
    };

    exports.Blueprint = Blueprint;

    var Mixin = (function () {
        function Mixin(extensions, mixins) {
            var _dependencies;

            _classCallCheck(this, Mixin);

            this.extensions = null;
            this.concatenatedProperties = [];
            this.mergedProperties = [];
            this.dependencies = [];
            this.reopen(extensions);
            (_dependencies = this.dependencies).push.apply(_dependencies, mixins);
        }

        Mixin.create = function create() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var extensions = args[args.length - 1];
            if (args.length === 0) {
                return new this({}, []);
            } else if (extensions instanceof Mixin) {
                return new this({}, args);
            } else {
                var deps = args.slice(0, -1).map(toMixin);
                return new this(extensions, deps);
            }
        };

        Mixin.mixins = function mixins(obj) {
            if (typeof obj !== 'object' || obj === null) return [];
            var meta = _object.ClassMeta.for(obj);
            if (!meta) return [];
            return meta.getAppliedMixins();
        };

        Mixin.prototype.detect = function detect(obj) {
            if (typeof obj !== 'object' || obj === null) return false;
            if (obj instanceof Mixin) {
                return obj.dependencies.indexOf(this) !== -1;
            }
            var meta = _object.ClassMeta.for(obj);
            return !!meta && meta.hasAppliedMixin(this);
        };

        Mixin.prototype.reopen = function reopen(extensions) {
            if (this.extensions) {
                this.dependencies.push(toMixin(this.extensions));
            }
            if (typeof extensions === 'object' && 'concatenatedProperties' in extensions) {
                var concat = undefined;
                var rawConcat = extensions.concatenatedProperties;
                if (_glimmerUtil.isArray(rawConcat)) {
                    concat = rawConcat.slice().map(_glimmerUtil.intern);
                } else if (rawConcat === null || rawConcat === undefined) {
                    concat = [];
                } else {
                    concat = [_glimmerUtil.intern(rawConcat)];
                }
                delete extensions.concatenatedProperties;
                this.concatenatedProperties = concat;
            }
            if (typeof extensions === 'object' && 'mergedProperties' in extensions) {
                var merged = undefined;
                var rawMerged = extensions.mergedProperties;
                if (_glimmerUtil.isArray(rawMerged)) {
                    merged = rawMerged.slice().map(_glimmerUtil.intern);
                } else if (rawMerged === null || rawMerged === undefined) {
                    merged = [];
                } else {
                    merged = [_glimmerUtil.intern(rawMerged)];
                }
                delete extensions.mergedProperties;
                this.mergedProperties = merged;
            }
            var normalized = Object.keys(extensions).reduce(function (obj, key) {
                var value = extensions[key];
                switch (typeof value) {
                    case 'function':
                        obj[key] = new MethodBlueprint({ value: value });
                        break;
                    case 'object':
                        if (value && BLUEPRINT in value) {
                            obj[key] = value;
                            break;
                        }
                    /* falls through */
                    default:
                        obj[key] = new DataBlueprint({ value: value });
                }
                return obj;
            }, _glimmerUtil.dict());
            this.extensions = _glimmerUtil.dict();
            _glimmerUtil.assign(this.extensions, _object.turbocharge(normalized));
        };

        Mixin.prototype.apply = function apply(target) {
            var meta = target[_glimmerReference.CLASS_META] = target[_glimmerReference.CLASS_META] || new _object.ClassMeta();
            this.dependencies.forEach(function (m) {
                return m.apply(target);
            });
            this.mergeProperties(target, target, meta);
            meta.addMixin(this);
            meta.seal();
            meta.reseal(target);
            return target;
        };

        Mixin.prototype.extendPrototype = function extendPrototype(Original) {
            Original.prototype = Object.create(Original.prototype);
            this.dependencies.forEach(function (m) {
                return m.extendPrototype(Original);
            });
            this.extendPrototypeOnto(Original, Original);
        };

        Mixin.prototype.extendPrototypeOnto = function extendPrototypeOnto(Subclass, Parent) {
            this.dependencies.forEach(function (m) {
                return m.extendPrototypeOnto(Subclass, Parent);
            });
            this.mergeProperties(Subclass.prototype, Parent.prototype, Subclass[_glimmerReference.CLASS_META]);
            Subclass[_glimmerReference.CLASS_META].addMixin(this);
        };

        Mixin.prototype.extendStatic = function extendStatic(Target) {
            this.dependencies.forEach(function (m) {
                return m.extendStatic(Target);
            });
            this.mergeProperties(Target, Object.getPrototypeOf(Target), Target[_glimmerReference.CLASS_META][_glimmerReference.CLASS_META]);
            Target[_glimmerReference.CLASS_META].addStaticMixin(this);
        };

        Mixin.prototype.mergeProperties = function mergeProperties(target, parent, meta) {
            var _this = this;

            if (meta.hasAppliedMixin(this)) return;
            meta.addAppliedMixin(this);
            this.mergedProperties.forEach(function (k) {
                return meta.addMergedProperty(k, parent[k]);
            });
            this.concatenatedProperties.forEach(function (k) {
                return meta.addConcatenatedProperty(k, []);
            });
            new ValueDescriptor({ value: meta.getConcatenatedProperties() }).define(target, 'concatenatedProperties', null);
            new ValueDescriptor({ value: meta.getMergedProperties() }).define(target, 'mergedProperties', null);
            Object.keys(this.extensions).forEach(function (key) {
                var extension = _this.extensions[key];
                var desc = extension.descriptor(target, key, meta);
                desc.define(target, key, parent);
            });
            new ValueDescriptor({ value: _utils.ROOT }).define(target, '_super', null);
        };

        return Mixin;
    })();

    exports.Mixin = Mixin;

    function extend(Parent) {
        for (var _len2 = arguments.length, extensions = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            extensions[_key2 - 1] = arguments[_key2];
        }

        var Super = Parent;
        var Subclass = (function (_Super) {
            _inherits(Subclass, _Super);

            function Subclass() {
                _classCallCheck(this, Subclass);

                _Super.apply(this, arguments);
            }

            return Subclass;
        })(Super);
        Subclass[_glimmerReference.CLASS_META] = _object.InstanceMeta.fromParent(Parent[_glimmerReference.CLASS_META]);
        var mixins = extensions.map(toMixin);
        Parent[_glimmerReference.CLASS_META].addSubclass(Subclass);
        mixins.forEach(function (m) {
            return Subclass[_glimmerReference.CLASS_META].addMixin(m);
        });
        _object.ClassMeta.applyAllMixins(Subclass, Parent);
        return Subclass;
    }

    function relinkSubclasses(Parent) {
        Parent[_glimmerReference.CLASS_META].getSubclasses().forEach(function (Subclass) {
            Subclass[_glimmerReference.CLASS_META].reset(Parent[_glimmerReference.CLASS_META]);
            Subclass.prototype = Object.create(Parent.prototype);
            _object.ClassMeta.applyAllMixins(Subclass, Parent);
            // recurse into sub-subclasses
            relinkSubclasses(Subclass);
        });
    }

    function toMixin(extension) {
        if (extension instanceof Mixin) return extension;else return new Mixin(extension, []);
    }

    var ValueDescriptor = (function (_Descriptor) {
        _inherits(ValueDescriptor, _Descriptor);

        function ValueDescriptor(_ref) {
            var _ref$enumerable = _ref.enumerable;
            var enumerable = _ref$enumerable === undefined ? true : _ref$enumerable;
            var _ref$configurable = _ref.configurable;
            var configurable = _ref$configurable === undefined ? true : _ref$configurable;
            var _ref$writable = _ref.writable;
            var writable = _ref$writable === undefined ? true : _ref$writable;
            var value = _ref.value;

            _classCallCheck(this, ValueDescriptor);

            _Descriptor.call(this);
            this.enumerable = enumerable;
            this.configurable = configurable;
            this.writable = writable;
            this.value = value;
        }

        ValueDescriptor.prototype.define = function define(target, key, home) {
            Object.defineProperty(target, key, {
                enumerable: this.enumerable,
                configurable: this.configurable,
                writable: this.writable,
                value: this.value
            });
        };

        return ValueDescriptor;
    })(Descriptor);

    var AccessorDescriptor = (function (_Descriptor2) {
        _inherits(AccessorDescriptor, _Descriptor2);

        function AccessorDescriptor(_ref2) {
            var enumerable = _ref2.enumerable;
            var configurable = _ref2.configurable;
            var get = _ref2.get;
            var set = _ref2.set;

            _classCallCheck(this, AccessorDescriptor);

            _Descriptor2.call(this);
            this.enumerable = enumerable;
            this.configurable = configurable;
            this.get = get;
            this.set = set;
        }

        AccessorDescriptor.prototype.define = function define(target, key) {
            Object.defineProperty(target, key, {
                enumerable: this.enumerable,
                configurable: this.configurable,
                get: this.get,
                set: this.set
            });
        };

        return AccessorDescriptor;
    })(Descriptor);

    var DataBlueprint = (function (_Blueprint) {
        _inherits(DataBlueprint, _Blueprint);

        function DataBlueprint(_ref3) {
            var _ref3$enumerable = _ref3.enumerable;
            var enumerable = _ref3$enumerable === undefined ? true : _ref3$enumerable;
            var _ref3$configurable = _ref3.configurable;
            var configurable = _ref3$configurable === undefined ? true : _ref3$configurable;
            var _ref3$writable = _ref3.writable;
            var writable = _ref3$writable === undefined ? true : _ref3$writable;
            var value = _ref3.value;

            _classCallCheck(this, DataBlueprint);

            _Blueprint.call(this);
            this.enumerable = enumerable;
            this.configurable = configurable;
            this.value = value;
            this.writable = writable;
        }

        DataBlueprint.prototype.descriptor = function descriptor(target, key, classMeta) {
            var enumerable = this.enumerable;
            var configurable = this.configurable;
            var writable = this.writable;
            var value = this.value;

            if (classMeta.hasConcatenatedProperty(key)) {
                classMeta.addConcatenatedProperty(key, value);
                value = classMeta.getConcatenatedProperty(key);
            } else if (classMeta.hasMergedProperty(key)) {
                classMeta.addMergedProperty(key, value);
                value = classMeta.getMergedProperty(key);
            }
            return new ValueDescriptor({ enumerable: enumerable, configurable: configurable, writable: writable, value: value });
        };

        return DataBlueprint;
    })(Blueprint);

    exports.DataBlueprint = DataBlueprint;

    var AccessorBlueprint = (function (_Blueprint2) {
        _inherits(AccessorBlueprint, _Blueprint2);

        function AccessorBlueprint(_ref4) {
            var _ref4$enumerable = _ref4.enumerable;
            var enumerable = _ref4$enumerable === undefined ? true : _ref4$enumerable;
            var _ref4$configurable = _ref4.configurable;
            var configurable = _ref4$configurable === undefined ? true : _ref4$configurable;
            var get = _ref4.get;
            var set = _ref4.set;

            _classCallCheck(this, AccessorBlueprint);

            _Blueprint2.call(this);
            this.enumerable = enumerable;
            this.configurable = configurable;
            this.get = get;
            this.set = set;
        }

        AccessorBlueprint.prototype.descriptor = function descriptor(target, key, classMeta) {
            return new ValueDescriptor({
                enumerable: this.enumerable,
                configurable: this.configurable,
                get: this.get,
                set: this.set
            });
        };

        return AccessorBlueprint;
    })(Blueprint);

    exports.AccessorBlueprint = AccessorBlueprint;

    var MethodDescriptor = (function (_ValueDescriptor) {
        _inherits(MethodDescriptor, _ValueDescriptor);

        function MethodDescriptor() {
            _classCallCheck(this, MethodDescriptor);

            _ValueDescriptor.apply(this, arguments);
        }

        MethodDescriptor.prototype.define = function define(target, key, home) {
            this.value = wrapMethod(home, key, this.value);
            _ValueDescriptor.prototype.define.call(this, target, key, home);
        };

        return MethodDescriptor;
    })(ValueDescriptor);

    var MethodBlueprint = (function (_DataBlueprint) {
        _inherits(MethodBlueprint, _DataBlueprint);

        function MethodBlueprint() {
            _classCallCheck(this, MethodBlueprint);

            _DataBlueprint.apply(this, arguments);
        }

        MethodBlueprint.prototype.descriptor = function descriptor(target, key, classMeta) {
            var desc = _DataBlueprint.prototype.descriptor.call(this, target, key, classMeta);
            return new MethodDescriptor(desc);
        };

        return MethodBlueprint;
    })(DataBlueprint);

    function wrapMethod(home, methodName, original) {
        if (!(methodName in home)) return maybeWrap(original);
        var superMethod = home[methodName];
        var func = function () {
            for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                args[_key3] = arguments[_key3];
            }

            if (!this) return original.apply(this, args);
            var lastSuper = this._super;
            this._super = superMethod;
            try {
                return original.apply(this, args);
            } finally {
                this._super = lastSuper;
            }
        };
        func.__wrapped = true;
        return func;
    }

    function maybeWrap(original) {
        if ('__wrapped' in original) return original;
        return function () {
            for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                args[_key4] = arguments[_key4];
            }

            if (!this) return original.apply(this, args);
            var lastSuper = this._super;
            this._super = _utils.ROOT;
            try {
                return original.apply(this, args);
            } finally {
                this._super = lastSuper;
            }
        };
    }
});

enifed('glimmer-object/lib/object', ['exports', 'glimmer-reference', 'glimmer-util', './mixin', './utils'], function (exports, _glimmerReference, _glimmerUtil, _mixin, _utils) {
    'use strict';

    exports.turbocharge = turbocharge;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    var EMPTY_CACHE = function EMPTY_CACHE() {};
    exports.EMPTY_CACHE = EMPTY_CACHE;
    var CLASS_META = "df8be4c8-4e89-44e2-a8f9-550c8dacdca7";

    function turbocharge(obj) {
        function Dummy() {}
        Dummy.prototype = obj;
        return obj;
    }

    var SealedMeta = (function (_Meta) {
        _inherits(SealedMeta, _Meta);

        function SealedMeta() {
            _classCallCheck(this, SealedMeta);

            _Meta.apply(this, arguments);
        }

        SealedMeta.prototype.addReferenceTypeFor = function addReferenceTypeFor() {
            throw new Error("Cannot modify reference types on a sealed meta");
        };

        return SealedMeta;
    })(_glimmerReference.Meta);

    var ClassMeta = (function () {
        function ClassMeta() {
            _classCallCheck(this, ClassMeta);

            this.referenceTypes = _glimmerUtil.dict();
            this.propertyMetadata = _glimmerUtil.dict();
            this.concatenatedProperties = _glimmerUtil.dict();
            this.hasConcatenatedProperties = false;
            this.mergedProperties = _glimmerUtil.dict();
            this.hasMergedProperties = false;
            this.mixins = [];
            this.appliedMixins = [];
            this.staticMixins = [];
            this.subclasses = [];
            this.slots = [];
            this.InstanceMetaConstructor = null;
        }

        ClassMeta.fromParent = function fromParent(parent) {
            var meta = new this();
            meta.reset(parent);
            return meta;
        };

        ClassMeta.for = function _for(object) {
            if (CLASS_META in object) return object[CLASS_META];else if (object.constructor) return object.constructor[CLASS_META] || null;else return null;
        };

        ClassMeta.prototype.init = function init(object, attrs) {
            if (typeof attrs !== 'object' || attrs === null) return;
            if (this.hasConcatenatedProperties) {
                var concatProps = this.concatenatedProperties;
                for (var prop in concatProps) {
                    if (prop in attrs) {
                        var concat = concatProps[prop].slice();
                        object[prop] = concat.concat(attrs[prop]);
                    }
                }
            }
            if (this.hasMergedProperties) {
                var mergedProps = this.mergedProperties;
                for (var prop in mergedProps) {
                    if (prop in attrs) {
                        var merged = _glimmerUtil.assign({}, mergedProps[prop]);
                        object[prop] = _glimmerUtil.assign(merged, attrs[prop]);
                    }
                }
            }
        };

        ClassMeta.prototype.addStaticMixin = function addStaticMixin(mixin) {
            this.staticMixins.push(mixin);
        };

        ClassMeta.prototype.addMixin = function addMixin(mixin) {
            this.mixins.push(mixin);
        };

        ClassMeta.prototype.getStaticMixins = function getStaticMixins() {
            return this.staticMixins;
        };

        ClassMeta.prototype.getMixins = function getMixins() {
            return this.mixins;
        };

        ClassMeta.prototype.addAppliedMixin = function addAppliedMixin(mixin) {
            this.appliedMixins.push(mixin);
        };

        ClassMeta.prototype.hasAppliedMixin = function hasAppliedMixin(mixin) {
            return this.appliedMixins.indexOf(mixin) !== -1;
        };

        ClassMeta.prototype.getAppliedMixins = function getAppliedMixins() {
            return this.appliedMixins;
        };

        ClassMeta.prototype.hasStaticMixin = function hasStaticMixin(mixin) {
            return this.staticMixins.indexOf(mixin) !== -1;
        };

        ClassMeta.applyAllMixins = function applyAllMixins(Subclass, Parent) {
            Subclass[CLASS_META].getMixins().forEach(function (m) {
                return m.extendPrototypeOnto(Subclass, Parent);
            });
            Subclass[CLASS_META].getStaticMixins().forEach(function (m) {
                return m.extendStatic(Subclass);
            });
            Subclass[CLASS_META].seal();
        };

        ClassMeta.prototype.addSubclass = function addSubclass(constructor) {
            this.subclasses.push(constructor);
        };

        ClassMeta.prototype.getSubclasses = function getSubclasses() {
            return this.subclasses;
        };

        ClassMeta.prototype.addPropertyMetadata = function addPropertyMetadata(property, value) {
            this.propertyMetadata[property] = value;
        };

        ClassMeta.prototype.metadataForProperty = function metadataForProperty(property) {
            return this.propertyMetadata[property];
        };

        ClassMeta.prototype.addReferenceTypeFor = function addReferenceTypeFor(property, type) {
            this.referenceTypes[property] = type;
        };

        ClassMeta.prototype.addSlotFor = function addSlotFor(property) {
            this.slots.push(property);
        };

        ClassMeta.prototype.hasConcatenatedProperty = function hasConcatenatedProperty(property) {
            if (!this.hasConcatenatedProperties) return false;
            return property in this.concatenatedProperties;
        };

        ClassMeta.prototype.getConcatenatedProperty = function getConcatenatedProperty(property) {
            return this.concatenatedProperties[property];
        };

        ClassMeta.prototype.getConcatenatedProperties = function getConcatenatedProperties() {
            return Object.keys(this.concatenatedProperties);
        };

        ClassMeta.prototype.addConcatenatedProperty = function addConcatenatedProperty(property, value) {
            this.hasConcatenatedProperties = true;
            if (property in this.concatenatedProperties) {
                var val = this.concatenatedProperties[property].concat(value);
                this.concatenatedProperties[property] = val;
            } else {
                this.concatenatedProperties[property] = value;
            }
        };

        ClassMeta.prototype.hasMergedProperty = function hasMergedProperty(property) {
            if (!this.hasMergedProperties) return false;
            return property in this.mergedProperties;
        };

        ClassMeta.prototype.getMergedProperty = function getMergedProperty(property) {
            return this.mergedProperties[property];
        };

        ClassMeta.prototype.getMergedProperties = function getMergedProperties() {
            return Object.keys(this.mergedProperties);
        };

        ClassMeta.prototype.addMergedProperty = function addMergedProperty(property, value) {
            this.hasMergedProperties = true;
            if (_glimmerUtil.isArray(value)) {
                throw new Error('You passed in `' + JSON.stringify(value) + '` as the value for `foo` but `foo` cannot be an Array');
            }
            if (property in this.mergedProperties && this.mergedProperties[property] && value) {
                this.mergedProperties[property] = mergeMergedProperties(value, this.mergedProperties[property]);
            } else {
                value = value === null ? value : value || {};
                this.mergedProperties[property] = value;
            }
        };

        ClassMeta.prototype.getReferenceTypes = function getReferenceTypes() {
            return this.referenceTypes;
        };

        ClassMeta.prototype.getPropertyMetadata = function getPropertyMetadata() {
            return this.propertyMetadata;
        };

        ClassMeta.prototype.reset = function reset(parent) {
            this.referenceTypes = _glimmerUtil.dict();
            this.propertyMetadata = _glimmerUtil.dict();
            this.concatenatedProperties = _glimmerUtil.dict();
            this.mergedProperties = _glimmerUtil.dict();
            if (parent) {
                this.hasConcatenatedProperties = parent.hasConcatenatedProperties;
                for (var prop in parent.concatenatedProperties) {
                    this.concatenatedProperties[prop] = parent.concatenatedProperties[prop].slice();
                }
                this.hasMergedProperties = parent.hasMergedProperties;
                for (var prop in parent.mergedProperties) {
                    this.mergedProperties[prop] = _glimmerUtil.assign({}, parent.mergedProperties[prop]);
                }
                _glimmerUtil.assign(this.referenceTypes, parent.referenceTypes);
                _glimmerUtil.assign(this.propertyMetadata, parent.propertyMetadata);
            }
        };

        ClassMeta.prototype.reseal = function reseal(obj) {
            var meta = _glimmerReference.Meta.for(obj);
            var fresh = new this.InstanceMetaConstructor(obj, {});
            var referenceTypes = meta.getReferenceTypes();
            var slots = meta.getSlots();
            turbocharge(_glimmerUtil.assign(referenceTypes, this.referenceTypes));
            turbocharge(_glimmerUtil.assign(slots, fresh.getSlots()));
        };

        ClassMeta.prototype.seal = function seal() {
            var referenceTypes = turbocharge(_glimmerUtil.assign({}, this.referenceTypes));
            turbocharge(this.concatenatedProperties);
            turbocharge(this.mergedProperties);
            if (!this.hasMergedProperties && !this.hasConcatenatedProperties) {
                this.init = function () {};
            }
            var slots = this.slots;

            var Slots = function Slots() {
                var _this = this;

                _classCallCheck(this, Slots);

                slots.forEach(function (name) {
                    _this[name] = EMPTY_CACHE;
                });
            };

            this.InstanceMetaConstructor = (function (_SealedMeta) {
                _inherits(_class, _SealedMeta);

                function _class() {
                    _classCallCheck(this, _class);

                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = arguments[_key];
                    }

                    _SealedMeta.call.apply(_SealedMeta, [this].concat(args));
                    this.slots = new Slots();
                    this.referenceTypes = referenceTypes;
                }

                _class.prototype.getReferenceTypes = function getReferenceTypes() {
                    return this.referenceTypes;
                };

                _class.prototype.referenceTypeFor = function referenceTypeFor(property) {
                    return this.referenceTypes[property] || _glimmerReference.PropertyReference;
                };

                _class.prototype.getSlots = function getSlots() {
                    return this.slots;
                };

                return _class;
            })(SealedMeta);
            turbocharge(this);
        };

        return ClassMeta;
    })();

    exports.ClassMeta = ClassMeta;

    function mergeMergedProperties(attrs, parent) {
        var merged = _glimmerUtil.assign({}, parent);
        for (var prop in attrs) {
            if (prop in parent && typeof parent[prop] === 'function' && typeof attrs[prop] === 'function') {
                var wrapped = _mixin.wrapMethod(parent, prop, attrs[prop]);
                merged[prop] = wrapped;
            } else {
                merged[prop] = attrs[prop];
            }
        }
        return merged;
    }

    var InstanceMeta = (function (_ClassMeta) {
        _inherits(InstanceMeta, _ClassMeta);

        function InstanceMeta() {
            _classCallCheck(this, InstanceMeta);

            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            _ClassMeta.call.apply(_ClassMeta, [this].concat(args));
            this["df8be4c8-4e89-44e2-a8f9-550c8dacdca7"] = ClassMeta.fromParent(null);
        }

        InstanceMeta.fromParent = function fromParent(parent) {
            return _ClassMeta.fromParent.call(this, parent);
        };

        InstanceMeta.prototype.reset = function reset(parent) {
            _ClassMeta.prototype.reset.call(this, parent);
            if (parent) this[CLASS_META].reset(parent[CLASS_META]);
        };

        InstanceMeta.prototype.seal = function seal() {
            _ClassMeta.prototype.seal.call(this);
            this[CLASS_META].seal();
        };

        return InstanceMeta;
    })(ClassMeta);

    exports.InstanceMeta = InstanceMeta;

    var GlimmerObject = (function () {
        function GlimmerObject(attrs) {
            _classCallCheck(this, GlimmerObject);

            this._super = _utils.ROOT;
            this._meta = null;
            if (attrs) _glimmerUtil.assign(this, attrs);
            this.constructor[CLASS_META].init(this, attrs);
            this._super = _utils.ROOT;
            this.init();
        }

        GlimmerObject.extend = function extend() {
            for (var _len3 = arguments.length, extensions = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                extensions[_key3] = arguments[_key3];
            }

            return _mixin.extend.apply(undefined, [this].concat(extensions));
        };

        GlimmerObject.create = function create(attrs) {
            return new this(attrs);
        };

        GlimmerObject.reopen = function reopen(extensions) {
            _mixin.toMixin(extensions).extendPrototype(this);
            this[CLASS_META].seal();
            _mixin.relinkSubclasses(this);
        };

        GlimmerObject.reopenClass = function reopenClass(extensions) {
            _mixin.toMixin(extensions).extendStatic(this);
            this[CLASS_META].seal();
        };

        GlimmerObject.metaForProperty = function metaForProperty(property) {
            var value = this[CLASS_META].metadataForProperty(_glimmerUtil.intern(property));
            if (!value) throw new Error('metaForProperty() could not find a computed property with key \'' + property + '\'.');
            return value;
        };

        GlimmerObject.eachComputedProperty = function eachComputedProperty(callback) {
            var metadata = this[CLASS_META].getPropertyMetadata();
            if (!metadata) return;
            for (var prop in metadata) {
                callback(prop, metadata[prop]);
            }
        };

        GlimmerObject.prototype.init = function init() {};

        GlimmerObject.prototype.get = function get(key) {
            return this[key];
        };

        GlimmerObject.prototype.set = function set(key, value) {
            this[key] = value;
        };

        return GlimmerObject;
    })();

    exports.default = GlimmerObject;

    GlimmerObject["df8be4c8-4e89-44e2-a8f9-550c8dacdca7"] = InstanceMeta.fromParent(null);
    GlimmerObject.isClass = true;
});

enifed('glimmer-object/lib/utils', ['exports'], function (exports) {
    'use strict';

    exports.ROOT = ROOT;
    exports.hasSuper = hasSuper;
    var HAS_SUPER_PATTERN = /\.(_super|call\(this|apply\(this)/;
    var checkHasSuper = (function () {
        var sourceAvailable = (function () {
            return this;
        }).toString().indexOf('return this') > -1;
        if (sourceAvailable) {
            return function checkHasSuper(func) {
                return HAS_SUPER_PATTERN.test(func.toString());
            };
        }
        return function checkHasSuper() {
            return true;
        };
    })();
    exports.checkHasSuper = checkHasSuper;

    function ROOT() {}

    ROOT.__hasSuper = false;

    function hasSuper(func) {
        if (func.__hasSuper === undefined) {
            func.__hasSuper = checkHasSuper(func);
        }
        return func.__hasSuper;
    }
});

enifed("glimmer-reference/index", ["exports", "./lib/references/descriptors", "./lib/references/forked", "./lib/meta", "./lib/object", "./lib/references/push-pull", "./lib/types", "./lib/references/root", "./lib/references/const", "./lib/references/iterable"], function (exports, _libReferencesDescriptors, _libReferencesForked, _libMeta, _libObject, _libReferencesPushPull, _libTypes, _libReferencesRoot, _libReferencesConst, _libReferencesIterable) {
  "use strict";

  function _interopExportWildcard(obj, defaults) { var newObj = defaults({}, obj); delete newObj["default"]; return newObj; }

  function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

  exports.ComputedReferenceBlueprint = _libReferencesDescriptors.ComputedReferenceBlueprint;
  exports.InnerReferenceFactory = _libReferencesDescriptors.InnerReferenceFactory;
  exports.PropertyReference = _libReferencesDescriptors.PropertyReference;
  exports.fork = _libReferencesForked.fork;
  exports.CLASS_META = _libMeta.CLASS_META;
  exports.Meta = _libMeta.default;
  exports.metaFor = _libMeta.metaFor;
  exports.setProperty = _libObject.setProperty;
  exports.notifyProperty = _libObject.notifyProperty;
  exports.PushPullReference = _libReferencesPushPull.PushPullReference;

  _defaults(exports, _interopExportWildcard(_libTypes, _defaults));

  exports.UpdatableReference = _libReferencesRoot.default;
  exports.referenceFromParts = _libReferencesRoot.referenceFromParts;
  exports.ConstReference = _libReferencesConst.ConstReference;
  exports.ListManager = _libReferencesIterable.ListManager;
  exports.ListIterator = _libReferencesIterable.ListIterator;
  exports.ListDelegate = _libReferencesIterable.ListDelegate;
});

enifed('glimmer-reference/lib/meta', ['exports', './references/descriptors', './references/root', 'glimmer-util'], function (exports, _referencesDescriptors, _referencesRoot, _glimmerUtil) {
    'use strict';

    exports.metaFor = metaFor;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var NOOP_DESTROY = { destroy: function () {} };

    var ConstPath = (function () {
        function ConstPath(parent, property) {
            _classCallCheck(this, ConstPath);

            this.parent = parent;
        }

        ConstPath.prototype.chain = function chain() {
            return NOOP_DESTROY;
        };

        ConstPath.prototype.isDirty = function isDirty() {
            return false;
        };

        ConstPath.prototype.destroy = function destroy() {};

        ConstPath.prototype.notify = function notify() {};

        ConstPath.prototype.value = function value() {
            return this.parent[this.property];
        };

        ConstPath.prototype.get = function get(prop) {
            return new ConstPath(this.parent[this.property], prop);
        };

        return ConstPath;
    })();

    var ConstRoot = (function () {
        function ConstRoot(value) {
            _classCallCheck(this, ConstRoot);

            this.dirty = false;
            this.inner = value;
        }

        ConstRoot.prototype.update = function update(inner) {
            this.inner = inner;
            this.dirty = true;
        };

        ConstRoot.prototype.chain = function chain() {
            return NOOP_DESTROY;
        };

        ConstRoot.prototype.isDirty = function isDirty() {
            return this.dirty;
        };

        ConstRoot.prototype.destroy = function destroy() {};

        ConstRoot.prototype.notify = function notify() {};

        ConstRoot.prototype.value = function value() {
            this.dirty = false;
            return this.inner;
        };

        ConstRoot.prototype.referenceFromParts = function referenceFromParts(parts) {
            throw new Error("Not implemented");
        };

        ConstRoot.prototype.chainFor = function chainFor(prop) {
            throw new Error("Not implemented");
        };

        ConstRoot.prototype.get = function get(prop) {
            return new ConstPath(this.inner, prop);
        };

        return ConstRoot;
    })();

    var ConstMeta /*implements IMeta*/ = (function () {
        function ConstMeta(object) {
            _classCallCheck(this, ConstMeta);

            this.object = object;
        }

        ConstMeta.prototype.root = function root() {
            return new ConstRoot(this.object);
        };

        return ConstMeta;
    })();

    var CLASS_META = "df8be4c8-4e89-44e2-a8f9-550c8dacdca7";
    exports.CLASS_META = CLASS_META;
    var hasOwnProperty = Object.hasOwnProperty;

    var Meta = (function () {
        function Meta(object, _ref) {
            var RootReferenceFactory = _ref.RootReferenceFactory;
            var DefaultPathReferenceFactory = _ref.DefaultPathReferenceFactory;

            _classCallCheck(this, Meta);

            this.references = null;
            this.slots = null;
            this.referenceTypes = null;
            this.propertyMetadata = null;
            this.object = object;
            this.RootReferenceFactory = RootReferenceFactory || _referencesRoot.default;
            this.DefaultPathReferenceFactory = DefaultPathReferenceFactory || _referencesDescriptors.PropertyReference;
        }

        Meta.for = function _for(obj) {
            if (obj === null || obj === undefined) return new Meta(obj, {});
            if (hasOwnProperty.call(obj, '_meta') && obj._meta) return obj._meta;
            if (!Object.isExtensible(obj)) return new ConstMeta(obj);
            var MetaToUse = Meta;
            if (obj.constructor && obj.constructor[CLASS_META]) {
                var classMeta = obj.constructor[CLASS_META];
                MetaToUse = classMeta.InstanceMetaConstructor;
            } else if (obj[CLASS_META]) {
                MetaToUse = obj[CLASS_META].InstanceMetaConstructor;
            }
            return obj._meta = new MetaToUse(obj, {});
        };

        Meta.exists = function exists(obj) {
            return typeof obj === 'object' && obj._meta;
        };

        Meta.metadataForProperty = function metadataForProperty(key) {
            return null;
        };

        Meta.prototype.addReference = function addReference(property, reference) {
            var refs = this.references = this.references || _glimmerUtil.dict();
            var set = refs[property] = refs[property] || new _glimmerUtil.DictSet();
            set.add(reference);
        };

        Meta.prototype.addReferenceTypeFor = function addReferenceTypeFor(property, type) {
            this.referenceTypes = this.referenceTypes || _glimmerUtil.dict();
            this.referenceTypes[property] = type;
        };

        Meta.prototype.referenceTypeFor = function referenceTypeFor(property) {
            if (!this.referenceTypes) return _referencesDescriptors.PropertyReference;
            return this.referenceTypes[property] || _referencesDescriptors.PropertyReference;
        };

        Meta.prototype.removeReference = function removeReference(property, reference) {
            if (!this.references) return;
            var set = this.references[property];
            set.delete(reference);
        };

        Meta.prototype.getReferenceTypes = function getReferenceTypes() {
            this.referenceTypes = this.referenceTypes || _glimmerUtil.dict();
            return this.referenceTypes;
        };

        Meta.prototype.referencesFor = function referencesFor(property) {
            if (!this.references) return;
            return this.references[property];
        };

        Meta.prototype.getSlots = function getSlots() {
            return this.slots = this.slots || _glimmerUtil.dict();
        };

        Meta.prototype.root = function root() {
            return this.rootCache = this.rootCache || new this.RootReferenceFactory(this.object);
        };

        return Meta;
    })();

    exports.default = Meta;

    function metaFor(obj) {
        return Meta.for(obj);
    }
});

enifed("glimmer-reference/lib/object", ["exports"], function (exports) {
    // import { metaFor } from './meta';
    // import { intern } from 'glimmer-util';
    "use strict";

    exports.setProperty = setProperty;
    exports.notifyProperty = notifyProperty;

    function setProperty(parent, property, val) {
        // var rootProp = metaFor(parent).root().chainFor(intern(property));
        // var referencesToNotify = metaFor(parent).referencesFor(intern(property));
        parent[property] = val;
        // if (referencesToNotify) {
        //   referencesToNotify.forEach(function(ref) { ref.notify(); });
        // }
        // if (rootProp) rootProp.notify();
    }

    function notifyProperty(parent, property) {
        // var rootProp = metaFor(parent).root().chainFor(intern(property));
        // var referencesToNotify = metaFor(parent).referencesFor(intern(property));
        // if (referencesToNotify) {
        //   referencesToNotify.forEach(function(ref) { ref.notify(); });
        // }
        // if (rootProp) rootProp.notify();
    }
});

enifed("glimmer-reference/lib/references/const", ["exports"], function (exports) {
    "use strict";

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    var ConstReference = (function () {
        function ConstReference(inner) {
            _classCallCheck(this, ConstReference);

            this.inner = inner;
        }

        // TODO: A protocol for telling Glimmer to stop asking; could also be useful
        // for finalized references. Also, a reference composed only of const references
        // should itself be const.

        ConstReference.prototype.isDirty = function isDirty() {
            return false;
        };

        ConstReference.prototype.value = function value() {
            return this.inner;
        };

        ConstReference.prototype.chain = function chain() {
            return null;
        };

        ConstReference.prototype.destroy = function destroy() {};

        return ConstReference;
    })();

    exports.ConstReference = ConstReference;
});

enifed('glimmer-reference/lib/references/descriptors', ['exports', '../meta', './push-pull'], function (exports, _meta, _pushPull) {
    'use strict';

    exports.ComputedReferenceBlueprint = ComputedReferenceBlueprint;

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var PropertyReference = (function () {
        function PropertyReference(object, property, outer) {
            _classCallCheck(this, PropertyReference);

            this.object = object;
            this.property = property;
        }

        PropertyReference.prototype.isDirty = function isDirty() {
            return true;
        };

        PropertyReference.prototype.value = function value() {
            return this.object[this.property];
        };

        PropertyReference.prototype.destroy = function destroy() {};

        PropertyReference.prototype.label = function label() {
            return '[reference Property]';
        };

        return PropertyReference;
    })();

    exports.PropertyReference = PropertyReference;

    function ComputedReferenceBlueprint(property, dependencies) {
        return (function (_PushPullReference) {
            _inherits(ComputedReference, _PushPullReference);

            function ComputedReference(object, property, outer) {
                _classCallCheck(this, ComputedReference);

                _PushPullReference.call(this);
                this.installed = false;
                this.object = object;
                this.property = property;
                this.dependencies = dependencies;
                this.outer = outer;
            }

            ComputedReference.prototype.notify = function notify() {
                this.dirty = true;
                // this.outer.notify();
                _PushPullReference.prototype.notify.call(this);
            };

            ComputedReference.prototype.value = function value() {
                var _this = this;

                if (!this.installed) {
                    (function () {
                        var root = _meta.default.for(_this.object).root();
                        _this.dependencies.forEach(function (dep) {
                            var ref = root.referenceFromParts(dep);
                            _this._addSource(ref);
                            ref.value();
                        });
                        _this.dirty = false;
                        _this.installed = true;
                    })();
                }
                return this.object[this.property];
            };

            ComputedReference.prototype.label = function label() {
                return '[reference Computed]';
            };

            return ComputedReference;
        })(_pushPull.default);
    }
});

enifed('glimmer-reference/lib/references/forked', ['exports'], function (exports) {
    'use strict';

    exports.fork = fork;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var ForkedReference = (function () {
        function ForkedReference(reference) {
            _classCallCheck(this, ForkedReference);

            // private chain: Destroyable;
            this._guid = null;
            this.dirty = true;
            this.reference = reference;
            this._guid = null;
            this.dirty = true;
            // this.chain = reference.chain(this);
        }

        ForkedReference.prototype.notify = function notify() {
            this.dirty = true;
        };

        ForkedReference.prototype.isDirty = function isDirty() {
            return true;
        };

        ForkedReference.prototype.value = function value() {
            this.dirty = false;
            return this.reference.value();
        };

        ForkedReference.prototype.destroy = function destroy() {
            // this.chain.destroy();
        };

        ForkedReference.prototype.label = function label() {
            return '[reference Leaf]';
        };

        return ForkedReference;
    })();

    exports.default = ForkedReference;

    function fork(reference) {
        return new ForkedReference(reference);
    }
});

enifed('glimmer-reference/lib/references/iterable', ['exports', 'glimmer-util', './root'], function (exports, _glimmerUtil, _root) {
    'use strict';

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    var REFERENCE_ITERATOR = _glimmerUtil.symbol("reference-iterator");
    exports.REFERENCE_ITERATOR = REFERENCE_ITERATOR;

    var ListItem = (function (_ListNode) {
        _inherits(ListItem, _ListNode);

        function ListItem(value, key) {
            _classCallCheck(this, ListItem);

            _ListNode.call(this, value);
            this.handled = true;
            this.key = key;
        }

        ListItem.prototype.handle = function handle(value) {
            this.handled = true;
            this.value.update(value);
        };

        return ListItem;
    })(_glimmerUtil.ListNode);

    var ListManager = (function () {
        /* tslint:enable:no-unused-variable */

        function ListManager(array, keyPath) {
            _classCallCheck(this, ListManager);

            /* tslint:disable:no-unused-variable */
            this.map = _glimmerUtil.dict();
            this.list = new _glimmerUtil.LinkedList();
            this.array = array;
            this.keyPath = keyPath;
        }

        ListManager.prototype.iterator = function iterator(target) {
            var array = this.array;
            var map = this.map;
            var list = this.list;
            var keyPath = this.keyPath;

            var keyFor = undefined;
            if (keyPath === '@index') {
                keyFor = function (_, index) {
                    return String(index);
                };
            } else {
                keyFor = function (item) {
                    return _glimmerUtil.intern(item[keyPath]);
                };
            }
            return new ListIterator({ array: array.value(), keyFor: keyFor, target: target, map: map, list: list });
        };

        ListManager.prototype.sync = function sync(target) {
            var iterator = this.iterator(target);
            while (!iterator.next());
        };

        return ListManager;
    })();

    exports.ListManager = ListManager;

    var Phase;
    (function (Phase) {
        Phase[Phase["FirstAppend"] = 0] = "FirstAppend";
        Phase[Phase["Append"] = 1] = "Append";
        Phase[Phase["Prune"] = 2] = "Prune";
        Phase[Phase["Done"] = 3] = "Done";
    })(Phase || (Phase = {}));

    var ListIterator = (function () {
        function ListIterator(_ref) {
            var array = _ref.array;
            var keyFor = _ref.keyFor;
            var target = _ref.target;
            var map = _ref.map;
            var list = _ref.list;

            _classCallCheck(this, ListIterator);

            /* tslint:disable:no-unused-variable */
            this.candidates = _glimmerUtil.dict();
            this.arrayPosition = 0;
            this.phase = Phase.Append;
            this.array = array;
            this.keyFor = keyFor;
            this.target = target;
            this.map = map;
            this.list = list;
            if (list.isEmpty()) {
                this.phase = Phase.FirstAppend;
            } else {
                this.phase = Phase.Append;
            }
            this.listPosition = list.head();
        }

        ListIterator.prototype.advanceToKey = function advanceToKey(key) {
            var listPosition = this.listPosition;
            var candidates = this.candidates;
            var list = this.list;

            var seek = listPosition;
            while (seek && seek.key !== key) {
                candidates[seek.key] = seek;
                seek = list.nextNode(seek);
            }
            this.listPosition = seek && list.nextNode(seek);
        };

        ListIterator.prototype.next = function next() {
            while (true) {
                var handled = false;
                switch (this.phase) {
                    case Phase.FirstAppend:
                        if (this.array.length <= this.arrayPosition) {
                            this.startPrune();
                        } else {
                            handled = this.nextInitialAppend();
                        }
                        break;
                    case Phase.Append:
                        handled = this.nextAppend();
                        break;
                    case Phase.Prune:
                        this.nextPrune();
                        break;
                    case Phase.Done:
                        this.nextDone();
                        return true;
                }
                if (handled) return false;
            }
        };

        ListIterator.prototype.nextInitialAppend = function nextInitialAppend() {
            var array = this.array;
            var arrayPosition = this.arrayPosition;
            var keyFor = this.keyFor;
            var listPosition = this.listPosition;
            var map = this.map;

            var item = array[this.arrayPosition++];
            if (item === null || item === undefined) return;
            var key = keyFor(item, arrayPosition);
            this.nextInsert(map, listPosition, key, item);
            return true;
        };

        ListIterator.prototype.nextAppend = function nextAppend() {
            var keyFor = this.keyFor;
            var array = this.array;
            var listPosition = this.listPosition;
            var arrayPosition = this.arrayPosition;
            var map = this.map;

            if (array.length <= arrayPosition) {
                this.startPrune();
                return;
            }
            var item = array[this.arrayPosition++];
            if (item === null || item === undefined) return;
            var key = keyFor(item, arrayPosition);
            if (listPosition && listPosition.key === key) {
                this.nextRetain(listPosition, key, item);
                return false;
            } else if (map[key]) {
                this.nextMove(map, listPosition, key, item);
                return false;
            } else {
                this.nextInsert(map, listPosition, key, item);
                return true;
            }
        };

        ListIterator.prototype.nextRetain = function nextRetain(current, key, item) {
            current.handle(item);
            this.listPosition = this.list.nextNode(current);
            this.target.retain(key, item);
        };

        ListIterator.prototype.nextMove = function nextMove(map, current, key, item) {
            var candidates = this.candidates;
            var list = this.list;
            var target = this.target;

            var found = map[key];
            found.handle(item);
            if (candidates[key]) {
                list.remove(found);
                list.insertBefore(found, current);
                target.move(found.key, found.value, current ? current.key : null);
            } else {
                this.advanceToKey(key);
            }
        };

        ListIterator.prototype.nextInsert = function nextInsert(map, current, key, item) {
            var list = this.list;
            var target = this.target;

            var reference = new _root.default(item);
            var node = map[key] = new ListItem(reference, key);
            list.append(node);
            target.insert(node.key, node.value, current ? current.key : null);
        };

        ListIterator.prototype.startPrune = function startPrune() {
            this.phase = Phase.Prune;
            this.listPosition = this.list.head();
            return true;
        };

        ListIterator.prototype.nextPrune = function nextPrune() {
            var list = this.list;
            var target = this.target;

            if (this.listPosition === null) {
                this.phase = Phase.Done;
                return;
            }
            var node = this.listPosition;
            this.listPosition = list.nextNode(node);
            if (node.handled) {
                node.handled = false;
                return;
            } else {
                list.remove(node);
                delete this.map[node.key];
                target.delete(node.key);
                return;
            }
        };

        ListIterator.prototype.nextDone = function nextDone() {
            this.target.done();
        };

        return ListIterator;
    })();

    exports.ListIterator = ListIterator;
});

enifed('glimmer-reference/lib/references/path', ['exports', '../utils', 'glimmer-util', '../meta', './forked', './descriptors', './push-pull'], function (exports, _utils, _glimmerUtil, _meta, _forked, _descriptors, _pushPull) {
    'use strict';

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var UnchainFromPath = (function () {
        function UnchainFromPath(set, child) {
            _classCallCheck(this, UnchainFromPath);

            this.set = set;
            this.child = child;
        }

        UnchainFromPath.prototype.destroy = function destroy() {
            this.set.delete(this.child);
        };

        return UnchainFromPath;
    })();

    var PathReference = (function (_PushPullReference) {
        _inherits(PathReference, _PushPullReference);

        function PathReference(parent, property) {
            _classCallCheck(this, PathReference);

            _PushPullReference.call(this);
            this.cache = _utils.EMPTY_CACHE;
            this.inner = null;
            this.chains = null;
            this.notifyChildren = null;
            this.lastParentValue = _utils.EMPTY_CACHE;
            this._guid = null;
            this.parent = parent;
            this.property = property;
        }

        PathReference.prototype.isDirty = function isDirty() {
            return this.cache === _utils.EMPTY_CACHE || this.inner && this.inner.isDirty();
        };

        PathReference.prototype.value = function value() {
            if (!this.isDirty()) return this.cache;
            var lastParentValue = this.lastParentValue;
            var property = this.property;
            var inner = this.inner;

            var parentValue = this._parentValue();
            if (parentValue === null || parentValue === undefined) {
                return this.cache = undefined;
            }
            if (lastParentValue === parentValue) {
                inner = this.inner;
            } else {
                var ReferenceType = typeof parentValue === 'object' ? _meta.default.for(parentValue).referenceTypeFor(property) : _descriptors.PropertyReference;
                inner = this.inner = new ReferenceType(parentValue, property, this);
            }
            // if (typeof parentValue === 'object') {
            //   Meta.for(parentValue).addReference(property, this);
            // }
            return this.cache = inner.value();
        };

        PathReference.prototype.notify = function notify() {
            // this._notify();
            _PushPullReference.prototype.notify.call(this);
        };

        PathReference.prototype.get = function get(prop) {
            var chains = this._getChains();
            if (prop in chains) return chains[prop];
            return chains[prop] = new PathReference(this, prop);
        };

        PathReference.prototype.chain = function chain(child) {
            var notifySet = this._getNotifyChildren();
            notifySet.add(child);
            return new UnchainFromPath(notifySet, child);
        };

        PathReference.prototype.fork = function fork() {
            return new _forked.default(this);
        };

        PathReference.prototype.label = function label() {
            return '[reference Direct]';
        };

        PathReference.prototype._getNotifyChildren = function _getNotifyChildren() {
            if (this.notifyChildren) return this.notifyChildren;
            return this.notifyChildren = new _glimmerUtil.DictSet();
        };

        PathReference.prototype._getChains = function _getChains() {
            if (this.chains) return this.chains;
            return this.chains = _glimmerUtil.dict();
        };

        PathReference.prototype._parentValue = function _parentValue() {
            var parent = this.parent.value();
            this.lastParentValue = parent;
            return parent;
        };

        return PathReference;
    })(_pushPull.default);

    exports.PathReference = PathReference;
});

enifed("glimmer-reference/lib/references/push-pull", ["exports"], function (exports) {
    "use strict";

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    var NotifyNode = function NotifyNode(parent, child) {
        _classCallCheck(this, NotifyNode);

        this.previousSibling = null;
        this.nextSibling = null;
        this.parent = parent;
        this.child = child;
    };

    var Unchain = (function () {
        function Unchain(reference, notifyNode) {
            _classCallCheck(this, Unchain);

            this.reference = reference;
            this.notifyNode = notifyNode;
        }

        Unchain.prototype.destroy = function destroy() {
            var reference = this.reference;
            var notifyNode = this.notifyNode;
            var nextSibling = notifyNode.nextSibling;
            var previousSibling = notifyNode.previousSibling;

            if (nextSibling) nextSibling.previousSibling = previousSibling;
            if (previousSibling) previousSibling.nextSibling = nextSibling;
            if (reference._notifyTail === notifyNode) reference._notifyTail = previousSibling;
        };

        return Unchain;
    })();

    var PushPullReference = (function () {
        function PushPullReference() {
            _classCallCheck(this, PushPullReference);

            this.dirty = true;
            this._notifyTail = null;
            this.sources = null;
            this._guid = null;
        }

        PushPullReference.prototype.isDirty = function isDirty() {
            return true;
        };

        PushPullReference.prototype.chain = function chain(child) {
            // return this._append(child);
            return null;
        };

        PushPullReference.prototype.notify = function notify() {
            var notifyNode = this._notifyTail;
            while (notifyNode) {
                // notifyNode.child.notify();
                notifyNode = notifyNode.previousSibling;
            }
        };

        PushPullReference.prototype.destroy = function destroy() {
            if (!this.sources) return;
            this.sources.forEach(function (source) {
                return source.destroy();
            });
        };

        PushPullReference.prototype._addSource = function _addSource(source) {
            // this.sources = this.sources || [];
            // this.sources.push(source.chain(this));
            return source;
        };

        return PushPullReference;
    })();

    exports.PushPullReference = PushPullReference;
    exports.default = PushPullReference;
});

enifed('glimmer-reference/lib/references/root', ['exports', 'glimmer-util', './path', './push-pull'], function (exports, _glimmerUtil, _path, _pushPull) {
    'use strict';

    exports.referenceFromParts = referenceFromParts;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    var RootReference = (function (_PushPullReference) {
        _inherits(RootReference, _PushPullReference);

        function RootReference(object) {
            _classCallCheck(this, RootReference);

            _PushPullReference.call(this);
            this.chains = _glimmerUtil.dict();
            this.object = object;
        }

        RootReference.prototype.isDirty = function isDirty() {
            return true;
        };

        RootReference.prototype.value = function value() {
            return this.object;
        };

        RootReference.prototype.update = function update(object) {
            this.object = object;
            // this.notify();
        };

        RootReference.prototype.get = function get(prop) {
            var chains = this.chains;
            if (prop in chains) return chains[prop];
            return chains[prop] = new _path.PathReference(this, prop);
        };

        RootReference.prototype.chainFor = function chainFor(prop) {
            var chains = this.chains;
            if (prop in chains) return chains[prop];
            return null;
        };

        RootReference.prototype.path = function path(string) {
            return string.split('.').reduce(function (ref, part) {
                return ref.get(_glimmerUtil.intern(part));
            }, this);
        };

        RootReference.prototype.referenceFromParts = function referenceFromParts(parts) {
            return parts.reduce(function (ref, part) {
                return ref.get(part);
            }, this);
        };

        RootReference.prototype.label = function label() {
            return '[reference Root]';
        };

        return RootReference;
    })(_pushPull.default);

    exports.default = RootReference;

    function referenceFromParts(path, parts) {
        return parts.reduce(function (ref, part) {
            return ref.get(part);
        }, path);
    }
});

enifed("glimmer-reference/lib/types", ["exports"], function (exports) {
  "use strict";

  var CONST_REFERENCE = "503c5a44-e4a9-4bb5-85bc-102d35af6985";
  exports.CONST_REFERENCE = CONST_REFERENCE;
});

enifed("glimmer-reference/lib/utils", ["exports"], function (exports) {
  "use strict";

  exports.EMPTY_CACHE = EMPTY_CACHE;

  function EMPTY_CACHE() {}
});

enifed('glimmer-runtime/index', ['exports', './lib/syntax', './lib/template', './lib/syntax/core', './lib/compiler', './lib/opcodes', './lib/compiled/opcodes/vm', './lib/compiled/opcodes/component', './lib/compiled/opcodes/dom', './lib/compiled/expressions/args', './lib/compiled/opcodes/lists', './lib/vm', './lib/environment', './lib/component/interfaces', './lib/dom', './lib/builder'], function (exports, _libSyntax, _libTemplate, _libSyntaxCore, _libCompiler, _libOpcodes, _libCompiledOpcodesVm, _libCompiledOpcodesComponent, _libCompiledOpcodesDom, _libCompiledExpressionsArgs, _libCompiledOpcodesLists, _libVm, _libEnvironment, _libComponentInterfaces, _libDom, _libBuilder) {
  'use strict';

  exports.StatementSyntax = _libSyntax.StatementSyntax;
  exports.ExpressionSyntax = _libSyntax.ExpressionSyntax;
  exports.AttributeSyntax = _libSyntax.AttributeSyntax;
  exports.ATTRIBUTE_SYNTAX = _libSyntax.ATTRIBUTE_SYNTAX;
  exports.Syntax = _libSyntax.default;
  exports.Template = _libTemplate.default;
  exports.Templates = _libSyntaxCore.Templates;
  exports.Append = _libSyntaxCore.Append;
  exports.Unknown = _libSyntaxCore.Unknown;
  exports.StaticAttr = _libSyntaxCore.StaticAttr;
  exports.DynamicAttr = _libSyntaxCore.DynamicAttr;
  exports.DynamicProp = _libSyntaxCore.DynamicProp;
  exports.AddClass = _libSyntaxCore.AddClass;
  exports.ArgsSyntax = _libSyntaxCore.Args;
  exports.NamedArgsSyntax = _libSyntaxCore.NamedArgs;
  exports.PositionalArgsSyntax = _libSyntaxCore.PositionalArgs;
  exports.GetSyntax = _libSyntaxCore.Get;
  exports.ValueSyntax = _libSyntaxCore.Value;
  exports.OpenElement = _libSyntaxCore.OpenElement;
  exports.HelperSyntax = _libSyntaxCore.Helper;
  exports.BlockSyntax = _libSyntaxCore.Block;
  exports.OpenPrimitiveElementSyntax = _libSyntaxCore.OpenPrimitiveElement;
  exports.CloseElementSyntax = _libSyntaxCore.CloseElement;
  exports.Compiler = _libCompiler.default;
  exports.RawTemplate = _libCompiler.RawTemplate;
  exports.OpSeq = _libOpcodes.OpSeq;
  exports.OpSeqBuilder = _libOpcodes.OpSeqBuilder;
  exports.PushChildScopeOpcode = _libCompiledOpcodesVm.PushChildScopeOpcode;
  exports.PopScopeOpcode = _libCompiledOpcodesVm.PopScopeOpcode;
  exports.PutArgsOpcode = _libCompiledOpcodesVm.PutArgsOpcode;
  exports.BindArgsOpcode = _libCompiledOpcodesVm.BindArgsOpcode;
  exports.NoopOpcode = _libCompiledOpcodesVm.NoopOpcode;
  exports.EnterOpcode = _libCompiledOpcodesVm.EnterOpcode;
  exports.ExitOpcode = _libCompiledOpcodesVm.ExitOpcode;
  exports.EvaluateOpcode = _libCompiledOpcodesVm.EvaluateOpcode;
  exports.TestOpcode = _libCompiledOpcodesVm.TestOpcode;
  exports.JumpOpcode = _libCompiledOpcodesVm.JumpOpcode;
  exports.JumpIfOpcode = _libCompiledOpcodesVm.JumpIfOpcode;
  exports.JumpUnlessOpcode = _libCompiledOpcodesVm.JumpUnlessOpcode;
  exports.OpenComponentOpcode = _libCompiledOpcodesComponent.OpenComponentOpcode;
  exports.CloseElementOpcode = _libCompiledOpcodesDom.CloseElementOpcode;
  exports.CompiledArgs = _libCompiledExpressionsArgs.CompiledArgs;
  exports.CompiledNamedArgs = _libCompiledExpressionsArgs.CompiledNamedArgs;
  exports.CompiledPositionalArgs = _libCompiledExpressionsArgs.CompiledPositionalArgs;
  exports.EvaluatedArgs = _libCompiledExpressionsArgs.EvaluatedArgs;
  exports.EvaluatedNamedArgs = _libCompiledExpressionsArgs.EvaluatedNamedArgs;
  exports.EvaluatedPositionalArgs = _libCompiledExpressionsArgs.EvaluatedPositionalArgs;
  exports.EnterListOpcode = _libCompiledOpcodesLists.EnterListOpcode;
  exports.ExitListOpcode = _libCompiledOpcodesLists.ExitListOpcode;
  exports.EnterWithKeyOpcode = _libCompiledOpcodesLists.EnterWithKeyOpcode;
  exports.NextIterOpcode = _libCompiledOpcodesLists.NextIterOpcode;
  exports.VM = _libVm.VM;
  exports.UpdatingVM = _libVm.UpdatingVM;
  exports.RenderResult = _libVm.RenderResult;
  exports.Scope = _libEnvironment.Scope;
  exports.Environment = _libEnvironment.default;
  exports.Helper = _libEnvironment.Helper;
  exports.ComponentClass = _libComponentInterfaces.ComponentClass;
  exports.ComponentDefinition = _libComponentInterfaces.ComponentDefinition;
  exports.ComponentDefinitionOptions = _libComponentInterfaces.ComponentDefinitionOptions;
  exports.ComponentInvocation = _libComponentInterfaces.ComponentInvocation;
  exports.ComponentHooks = _libComponentInterfaces.ComponentHooks;
  exports.CompileComponentOptions = _libComponentInterfaces.CompileComponentOptions;
  exports.Component = _libComponentInterfaces.Component;
  exports.DOMHelper = _libDom.default;
  exports.isWhitespace = _libDom.isWhitespace;
  exports.ElementStack = _libBuilder.ElementStack;
});

enifed("glimmer-runtime/lib/bounds", ["exports"], function (exports) {
    "use strict";

    exports.bounds = bounds;
    exports.single = single;
    exports.move = move;
    exports.clear = clear;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    var ConcreteBounds = (function () {
        function ConcreteBounds(parent, first, last) {
            _classCallCheck(this, ConcreteBounds);

            this.parentNode = parent;
            this.first = first;
            this.last = last;
        }

        ConcreteBounds.prototype.parentElement = function parentElement() {
            return this.parentNode;
        };

        ConcreteBounds.prototype.firstNode = function firstNode() {
            return this.first;
        };

        ConcreteBounds.prototype.lastNode = function lastNode() {
            return this.last;
        };

        return ConcreteBounds;
    })();

    exports.ConcreteBounds = ConcreteBounds;

    var SingleNodeBounds = (function () {
        function SingleNodeBounds(parentNode, node) {
            _classCallCheck(this, SingleNodeBounds);

            this.parentNode = parentNode;
            this.node = node;
        }

        SingleNodeBounds.prototype.parentElement = function parentElement() {
            return this.parentNode;
        };

        SingleNodeBounds.prototype.firstNode = function firstNode() {
            return this.node;
        };

        SingleNodeBounds.prototype.lastNode = function lastNode() {
            return this.node;
        };

        return SingleNodeBounds;
    })();

    exports.SingleNodeBounds = SingleNodeBounds;

    function bounds(parent, first, last) {
        return new ConcreteBounds(parent, first, last);
    }

    function single(parent, node) {
        return new SingleNodeBounds(parent, node);
    }

    function move(bounds, reference) {
        var parent = bounds.parentElement();
        var first = bounds.firstNode();
        var last = bounds.lastNode();
        var node = first;
        while (node) {
            var next = node.nextSibling;
            parent.insertBefore(node, reference);
            if (node === last) return next;
            node = next;
        }
        return null;
    }

    function clear(bounds) {
        var parent = bounds.parentElement();
        var first = bounds.firstNode();
        var last = bounds.lastNode();
        var node = first;
        while (node) {
            var next = node.nextSibling;
            parent.removeChild(node);
            if (node === last) return next;
            node = next;
        }
        return null;
    }
});

enifed('glimmer-runtime/lib/builder', ['exports', 'glimmer-util', 'glimmer-reference'], function (exports, _glimmerUtil, _glimmerReference) {
    'use strict';

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var First = (function () {
        function First(node) {
            _classCallCheck(this, First);

            this.node = node;
        }

        First.prototype.firstNode = function firstNode() {
            return this.node;
        };

        return First;
    })();

    var Last = (function () {
        function Last(node) {
            _classCallCheck(this, Last);

            this.node = node;
        }

        Last.prototype.lastNode = function lastNode() {
            return this.node;
        };

        return Last;
    })();

    var ClassList = (function (_PushPullReference) {
        _inherits(ClassList, _PushPullReference);

        function ClassList() {
            _classCallCheck(this, ClassList);

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            _PushPullReference.call.apply(_PushPullReference, [this].concat(args));
            this.list = [];
        }

        ClassList.prototype.append = function append(reference) {
            this.list.push(reference);
            // this._addSource(reference);
        };

        ClassList.prototype.value = function value() {
            if (this.list.length === 0) return null;
            return this.list.map(function (i) {
                return i.value();
            }).join(' ');
        };

        return ClassList;
    })(_glimmerReference.PushPullReference);

    exports.ClassList = ClassList;

    var BlockStackElement = function BlockStackElement() {
        _classCallCheck(this, BlockStackElement);

        this.firstNode = null;
        this.lastNode = null;
    };

    var ElementStack = (function () {
        function ElementStack(_ref) {
            var dom = _ref.dom;
            var parentNode = _ref.parentNode;
            var nextSibling = _ref.nextSibling;

            _classCallCheck(this, ElementStack);

            this.classList = null;
            this.elementStack = new _glimmerUtil.Stack();
            this.nextSiblingStack = new _glimmerUtil.Stack();
            this.classListStack = new _glimmerUtil.Stack();
            this.blockStack = new _glimmerUtil.Stack();
            this.dom = dom;
            this.element = parentNode;
            this.nextSibling = nextSibling;
            if (nextSibling && !(nextSibling instanceof Node)) throw new Error("NOPE");
            this.elementStack.push(this.element);
            this.nextSiblingStack.push(this.nextSibling);
        }

        ElementStack.prototype.block = function block() {
            return this.blockStack.current;
        };

        ElementStack.prototype.pushElement = function pushElement(element) {
            this.elementStack.push(element);
            this.classListStack.push(null);
            this.nextSiblingStack.push(null);
            this.element = element;
            this.classList = null;
            this.nextSibling = null;
        };

        ElementStack.prototype.popElement = function popElement() {
            var elementStack = this.elementStack;
            var nextSiblingStack = this.nextSiblingStack;
            var classListStack = this.classListStack;

            var topElement = elementStack.pop();
            nextSiblingStack.pop();
            classListStack.pop();
            this.element = elementStack.current;
            this.nextSibling = nextSiblingStack.current;
            this.classList = classListStack.current;
            return topElement;
        };

        ElementStack.prototype.pushBlock = function pushBlock() {
            var tracker = new BlockTracker(this.element);
            if (this.blockStack.current !== null) this.blockStack.current.newBounds(tracker);
            this.blockStack.push(tracker);
        };

        ElementStack.prototype.pushBlockList = function pushBlockList(list) {
            var tracker = new BlockListTracker(this.element, list);
            if (this.blockStack.current !== null) this.blockStack.current.newBounds(tracker);
            this.blockStack.push(tracker);
        };

        ElementStack.prototype.popBlock = function popBlock() {
            this.blockStack.current.finalize(this);
            return this.blockStack.pop();
        };

        ElementStack.prototype.openElement = function openElement(tag) {
            var element = this.dom.createElement(tag, this.element);
            this.pushElement(element);
            this.blockStack.current.openElement(element);
            return element;
        };

        ElementStack.prototype.openBlock = function openBlock() {
            this.pushBlock();
        };

        ElementStack.prototype.closeBlock = function closeBlock() {
            return this.popBlock();
        };

        ElementStack.prototype.openBlockList = function openBlockList(list) {
            this.pushBlockList(list);
        };

        ElementStack.prototype.newBounds = function newBounds(bounds) {
            this.blockStack.current.newBounds(bounds);
        };

        ElementStack.prototype.appendText = function appendText(string) {
            var dom = this.dom;

            var text = dom.createTextNode(string);
            dom.insertBefore(this.element, text, this.nextSibling);
            this.blockStack.current.newNode(text);
            return text;
        };

        ElementStack.prototype.appendComment = function appendComment(string) {
            var dom = this.dom;

            var comment = dom.createComment(string);
            dom.insertBefore(this.element, comment, this.nextSibling);
            this.blockStack.current.newNode(comment);
            return comment;
        };

        ElementStack.prototype.insertHTMLBefore = function insertHTMLBefore(nextSibling, html) {
            if (!(this.element instanceof HTMLElement)) {
                throw new Error('You cannot insert HTML (using triple-curlies or htmlSafe) into an SVG context: ' + this.element.tagName);
            }
            var bounds = this.dom.insertHTMLBefore(this.element, nextSibling, html);
            this.blockStack.current.newBounds(bounds);
            return bounds;
        };

        ElementStack.prototype.setAttribute = function setAttribute(name, value) {
            this.dom.setAttribute(this.element, name, value);
        };

        ElementStack.prototype.setAttributeNS = function setAttributeNS(name, value, namespace) {
            this.dom.setAttributeNS(this.element, name, value, namespace);
        };

        ElementStack.prototype.addClass = function addClass(ref) {
            var classList = this.classList;
            if (classList === null) {
                classList = this.classList = new ClassList();
                this.classListStack.push(classList);
            }
            classList.append(ref);
        };

        ElementStack.prototype.closeElement = function closeElement() {
            var classList = this.classList;

            this.blockStack.current.closeElement();
            var child = this.popElement();
            this.dom.insertBefore(this.element, child, this.nextSibling);
            var classNames = classList ? classList.value() : null;
            if (classNames !== null) {
                this.dom.setAttribute(child, 'class', classNames);
            }
            return { element: child, classList: classList, classNames: classNames };
        };

        ElementStack.prototype.appendHTML = function appendHTML(html) {
            return this.dom.insertHTMLBefore(this.element, this.nextSibling, html);
        };

        return ElementStack;
    })();

    exports.ElementStack = ElementStack;

    var BlockTracker = (function () {
        function BlockTracker(parent) {
            _classCallCheck(this, BlockTracker);

            this.first = null;
            this.last = null;
            this.nesting = 0;
            this.parent = parent;
        }

        BlockTracker.prototype.parentElement = function parentElement() {
            return this.parent;
        };

        BlockTracker.prototype.firstNode = function firstNode() {
            return this.first && this.first.firstNode();
        };

        BlockTracker.prototype.lastNode = function lastNode() {
            return this.last && this.last.lastNode();
        };

        BlockTracker.prototype.openElement = function openElement(element) {
            this.newNode(element);
            this.nesting++;
        };

        BlockTracker.prototype.closeElement = function closeElement() {
            this.nesting--;
        };

        BlockTracker.prototype.newNode = function newNode(node) {
            if (this.nesting !== 0) return;
            if (!this.first) {
                this.first = new First(node);
            }
            this.last = new Last(node);
        };

        BlockTracker.prototype.newBounds = function newBounds(bounds) {
            if (this.nesting !== 0) return;
            if (!this.first) {
                this.first = bounds;
            }
            this.last = bounds;
        };

        BlockTracker.prototype.finalize = function finalize(stack) {
            if (!this.first) {
                stack.appendComment('');
            }
        };

        return BlockTracker;
    })();

    var BlockListTracker = (function () {
        function BlockListTracker(parent, boundList) {
            _classCallCheck(this, BlockListTracker);

            this.last = null;
            this.parent = parent;
            this.boundList = boundList;
        }

        BlockListTracker.prototype.parentElement = function parentElement() {
            return this.parent;
        };

        BlockListTracker.prototype.firstNode = function firstNode() {
            var head = this.boundList.head();
            return head ? head.firstNode() : this.last;
        };

        BlockListTracker.prototype.lastNode = function lastNode() {
            return this.last;
        };

        BlockListTracker.prototype.openElement = function openElement(element) {
            _glimmerUtil.assert(false, 'Cannot openElement directly inside a block list');
        };

        BlockListTracker.prototype.closeElement = function closeElement() {
            _glimmerUtil.assert(false, 'Cannot closeElement directly inside a block list');
        };

        BlockListTracker.prototype.newNode = function newNode(node) {
            _glimmerUtil.assert(false, 'Cannot create a new node directly inside a block list');
        };

        BlockListTracker.prototype.newBounds = function newBounds(bounds) {};

        BlockListTracker.prototype.finalize = function finalize(stack) {
            var dom = stack.dom;
            var parent = stack.element;
            var nextSibling = stack.nextSibling;

            var comment = dom.createComment('');
            dom.insertBefore(parent, comment, nextSibling);
            this.last = comment;
        };

        return BlockListTracker;
    })();
});

enifed('glimmer-runtime/lib/compiled/expressions/args', ['exports', './positional-args', './named-args'], function (exports, _positionalArgs, _namedArgs) {
    'use strict';

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var CompiledArgs = (function () {
        function CompiledArgs() {
            _classCallCheck(this, CompiledArgs);
        }

        CompiledArgs.create = function create(_ref) {
            var positional = _ref.positional;
            var named = _ref.named;

            if (positional === _positionalArgs.COMPILED_EMPTY_POSITIONAL_ARGS && named === _namedArgs.COMPILED_EMPTY_NAMED_ARGS) {
                return COMPILED_EMPTY_ARGS;
            } else {
                return new CompiledNonEmptyArgs({ positional: positional, named: named });
            }
        };

        CompiledArgs.empty = function empty() {
            return COMPILED_EMPTY_ARGS;
        };

        return CompiledArgs;
    })();

    exports.CompiledArgs = CompiledArgs;

    var CompiledNonEmptyArgs = (function (_CompiledArgs) {
        _inherits(CompiledNonEmptyArgs, _CompiledArgs);

        function CompiledNonEmptyArgs(_ref2) {
            var positional = _ref2.positional;
            var named = _ref2.named;

            _classCallCheck(this, CompiledNonEmptyArgs);

            _CompiledArgs.call(this);
            this.type = "named-args";
            this.positional = positional;
            this.named = named;
        }

        CompiledNonEmptyArgs.prototype.evaluate = function evaluate(vm) {
            return EvaluatedArgs.create({
                positional: this.positional.evaluate(vm),
                named: this.named.evaluate(vm)
            });
        };

        return CompiledNonEmptyArgs;
    })(CompiledArgs);

    var COMPILED_EMPTY_ARGS = new ((function (_CompiledArgs2) {
        _inherits(_class, _CompiledArgs2);

        function _class() {
            _classCallCheck(this, _class);

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            _CompiledArgs2.call.apply(_CompiledArgs2, [this].concat(args));
            this.type = "empty-named-args";
        }

        _class.prototype.evaluate = function evaluate(vm) {
            return EvaluatedArgs.empty();
        };

        return _class;
    })(CompiledArgs))();
    exports.COMPILED_EMPTY_ARGS = COMPILED_EMPTY_ARGS;

    var EvaluatedArgs = (function () {
        function EvaluatedArgs() {
            _classCallCheck(this, EvaluatedArgs);
        }

        EvaluatedArgs.empty = function empty() {
            return EMPTY_EVALUATED_ARGS;
        };

        EvaluatedArgs.create = function create(options) {
            return new NonEmptyEvaluatedArgs(options);
        };

        EvaluatedArgs.positional = function positional(values) {
            return new NonEmptyEvaluatedArgs({ positional: _positionalArgs.EvaluatedPositionalArgs.create({ values: values }), named: _namedArgs.EvaluatedNamedArgs.empty() });
        };

        return EvaluatedArgs;
    })();

    exports.EvaluatedArgs = EvaluatedArgs;

    var NonEmptyEvaluatedArgs = (function (_EvaluatedArgs) {
        _inherits(NonEmptyEvaluatedArgs, _EvaluatedArgs);

        function NonEmptyEvaluatedArgs(_ref3) {
            var positional = _ref3.positional;
            var named = _ref3.named;

            _classCallCheck(this, NonEmptyEvaluatedArgs);

            _EvaluatedArgs.call(this);
            this.positional = positional;
            this.named = named;
        }

        return NonEmptyEvaluatedArgs;
    })(EvaluatedArgs);

    var EMPTY_EVALUATED_ARGS = new ((function (_EvaluatedArgs2) {
        _inherits(_class2, _EvaluatedArgs2);

        function _class2() {
            _classCallCheck(this, _class2);

            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            _EvaluatedArgs2.call.apply(_EvaluatedArgs2, [this].concat(args));
            this.positional = _positionalArgs.EVALUATED_EMPTY_POSITIONAL_ARGS;
            this.named = _namedArgs.EVALUATED_EMPTY_NAMED_ARGS;
        }

        return _class2;
    })(EvaluatedArgs))();
    exports.EMPTY_EVALUATED_ARGS = EMPTY_EVALUATED_ARGS;
    exports.CompiledPositionalArgs = _positionalArgs.CompiledPositionalArgs;
    exports.EvaluatedPositionalArgs = _positionalArgs.EvaluatedPositionalArgs;
    exports.CompiledNamedArgs = _namedArgs.CompiledNamedArgs;
    exports.EvaluatedNamedArgs = _namedArgs.EvaluatedNamedArgs;
});

enifed("glimmer-runtime/lib/compiled/expressions/concat", ["exports"], function (exports) {
    "use strict";

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    var CompiledConcat = (function () {
        function CompiledConcat(_ref) {
            var parts = _ref.parts;

            _classCallCheck(this, CompiledConcat);

            this.type = "concat";
            this.parts = parts;
        }

        CompiledConcat.prototype.evaluate = function evaluate(vm) {
            var parts = this.parts.map(function (p) {
                return p.evaluate(vm);
            });
            return new ConcatReference(parts);
        };

        return CompiledConcat;
    })();

    exports.default = CompiledConcat;

    var ConcatReference = (function () {
        function ConcatReference(parts) {
            _classCallCheck(this, ConcatReference);

            this.parts = parts;
        }

        ConcatReference.prototype.isDirty = function isDirty() {
            return true;
        };

        ConcatReference.prototype.value = function value() {
            return this.parts.map(function (p) {
                return p.value();
            }).join('');
        };

        ConcatReference.prototype.destroy = function destroy() {};

        return ConcatReference;
    })();
});

enifed("glimmer-runtime/lib/compiled/expressions/helper", ["exports"], function (exports) {
    "use strict";

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    var CompiledHelper = (function () {
        function CompiledHelper(_ref) {
            var helper = _ref.helper;
            var args = _ref.args;

            _classCallCheck(this, CompiledHelper);

            this.type = "helper";
            this.helper = helper;
            this.args = args;
        }

        CompiledHelper.prototype.evaluate = function evaluate(vm) {
            return new HelperInvocationReference(this.helper, this.args.evaluate(vm));
        };

        return CompiledHelper;
    })();

    exports.default = CompiledHelper;

    var HelperInvocationReference = (function () {
        function HelperInvocationReference(helper, args) {
            _classCallCheck(this, HelperInvocationReference);

            this.helper = helper;
            this.args = args;
        }

        HelperInvocationReference.prototype.get = function get() {
            throw new Error("Unimplemented: Yielding the result of a helper call.");
        };

        HelperInvocationReference.prototype.isDirty = function isDirty() {
            return true;
        };

        HelperInvocationReference.prototype.value = function value() {
            var helper = this.helper;
            var _args = this.args;
            var positional = _args.positional;
            var named = _args.named;

            return helper(positional.value(), named.value(), null);
        };

        HelperInvocationReference.prototype.destroy = function destroy() {};

        return HelperInvocationReference;
    })();
});

enifed('glimmer-runtime/lib/compiled/expressions/named-args', ['exports', '../../references', 'glimmer-util'], function (exports, _references, _glimmerUtil) {
    'use strict';

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var CompiledNamedArgs = (function () {
        function CompiledNamedArgs() {
            _classCallCheck(this, CompiledNamedArgs);
        }

        CompiledNamedArgs.create = function create(_ref) {
            var keys = _ref.keys;
            var values = _ref.values;

            if (keys.length) {
                return new CompiledNonEmptyNamedArgs({ keys: keys, values: values });
            } else {
                return COMPILED_EMPTY_NAMED_ARGS;
            }
        };

        return CompiledNamedArgs;
    })();

    exports.CompiledNamedArgs = CompiledNamedArgs;

    var CompiledNonEmptyNamedArgs = (function (_CompiledNamedArgs) {
        _inherits(CompiledNonEmptyNamedArgs, _CompiledNamedArgs);

        function CompiledNonEmptyNamedArgs(_ref2) {
            var keys = _ref2.keys;
            var values = _ref2.values;

            _classCallCheck(this, CompiledNonEmptyNamedArgs);

            _CompiledNamedArgs.call(this);
            this.type = "named-args";
            this.keys = keys;
            this.values = values;
        }

        CompiledNonEmptyNamedArgs.prototype.evaluate = function evaluate(vm) {
            var keys = this.keys;
            var values = this.values;

            var valueReferences = values.map(function (value, i) {
                return value.evaluate(vm);
            });
            return EvaluatedNamedArgs.create({ keys: keys, values: valueReferences });
        };

        return CompiledNonEmptyNamedArgs;
    })(CompiledNamedArgs);

    var COMPILED_EMPTY_NAMED_ARGS = new ((function (_CompiledNamedArgs2) {
        _inherits(_class, _CompiledNamedArgs2);

        function _class() {
            _classCallCheck(this, _class);

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            _CompiledNamedArgs2.call.apply(_CompiledNamedArgs2, [this].concat(args));
            this.type = "empty-named-args";
        }

        _class.prototype.evaluate = function evaluate(vm) {
            return EvaluatedNamedArgs.empty();
        };

        return _class;
    })(CompiledNamedArgs))();
    exports.COMPILED_EMPTY_NAMED_ARGS = COMPILED_EMPTY_NAMED_ARGS;

    var EvaluatedNamedArgs = (function () {
        function EvaluatedNamedArgs() {
            _classCallCheck(this, EvaluatedNamedArgs);
        }

        EvaluatedNamedArgs.empty = function empty() {
            return EVALUATED_EMPTY_NAMED_ARGS;
        };

        EvaluatedNamedArgs.create = function create(_ref3) {
            var keys = _ref3.keys;
            var values = _ref3.values;

            return new NonEmptyEvaluatedNamedArgs({ keys: keys, values: values });
        };

        EvaluatedNamedArgs.prototype.forEach = function forEach(callback) {
            var keys = this.keys;
            var values = this.values;

            keys.forEach(function (key, i) {
                return callback(key, values[i]);
            });
        };

        return EvaluatedNamedArgs;
    })();

    exports.EvaluatedNamedArgs = EvaluatedNamedArgs;

    var NonEmptyEvaluatedNamedArgs = (function (_EvaluatedNamedArgs) {
        _inherits(NonEmptyEvaluatedNamedArgs, _EvaluatedNamedArgs);

        function NonEmptyEvaluatedNamedArgs(_ref4) {
            var keys = _ref4.keys;
            var values = _ref4.values;

            _classCallCheck(this, NonEmptyEvaluatedNamedArgs);

            _EvaluatedNamedArgs.call(this);
            var map = _glimmerUtil.dict();
            values.forEach(function (v, i) {
                return map[keys[i]] = v;
            });
            this.keys = keys;
            this.values = values;
            this.map = map;
        }

        NonEmptyEvaluatedNamedArgs.prototype.get = function get(key) {
            return this.map[key];
        };

        NonEmptyEvaluatedNamedArgs.prototype.value = function value() {
            var hash = _glimmerUtil.dict();
            var refs = this.values;
            this.keys.forEach(function (k, i) {
                hash[k] = refs[i].value();
            });
            return hash;
        };

        return NonEmptyEvaluatedNamedArgs;
    })(EvaluatedNamedArgs);

    var EVALUATED_EMPTY_NAMED_ARGS = new ((function (_EvaluatedNamedArgs2) {
        _inherits(_class2, _EvaluatedNamedArgs2);

        function _class2() {
            _classCallCheck(this, _class2);

            _EvaluatedNamedArgs2.apply(this, arguments);
        }

        _class2.prototype.get = function get() {
            return _references.NULL_REFERENCE;
        };

        _class2.prototype.value = function value() {
            return null;
        };

        return _class2;
    })(EvaluatedNamedArgs))();
    exports.EVALUATED_EMPTY_NAMED_ARGS = EVALUATED_EMPTY_NAMED_ARGS;
});

enifed("glimmer-runtime/lib/compiled/expressions/positional-args", ["exports", "../../references"], function (exports, _references) {
    "use strict";

    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    var CompiledPositionalArgs = (function () {
        function CompiledPositionalArgs() {
            _classCallCheck(this, CompiledPositionalArgs);
        }

        CompiledPositionalArgs.create = function create(_ref) {
            var values = _ref.values;

            if (values.length) {
                return new CompiledNonEmptyPositionalArgs({ values: values });
            } else {
                return COMPILED_EMPTY_POSITIONAL_ARGS;
            }
        };

        return CompiledPositionalArgs;
    })();

    exports.CompiledPositionalArgs = CompiledPositionalArgs;

    var CompiledNonEmptyPositionalArgs = (function (_CompiledPositionalArgs) {
        _inherits(CompiledNonEmptyPositionalArgs, _CompiledPositionalArgs);

        function CompiledNonEmptyPositionalArgs(_ref2) {
            var values = _ref2.values;

            _classCallCheck(this, CompiledNonEmptyPositionalArgs);

            _CompiledPositionalArgs.call(this);
            this.type = "named-args";
            this.values = values;
        }

        CompiledNonEmptyPositionalArgs.prototype.evaluate = function evaluate(vm) {
            var values = this.values;

            var valueReferences = values.map(function (value, i) {
                return value.evaluate(vm);
            });
            return EvaluatedPositionalArgs.create({ values: valueReferences });
        };

        return CompiledNonEmptyPositionalArgs;
    })(CompiledPositionalArgs);

    var COMPILED_EMPTY_POSITIONAL_ARGS = new ((function (_CompiledPositionalArgs2) {
        _inherits(_class, _CompiledPositionalArgs2);

        function _class() {
            _classCallCheck(this, _class);

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            _CompiledPositionalArgs2.call.apply(_CompiledPositionalArgs2, [this].concat(args));
            this.type = "empty-named-args";
        }

        _class.prototype.evaluate = function evaluate(vm) {
            return EvaluatedPositionalArgs.empty();
        };

        return _class;
    })(CompiledPositionalArgs))();
    exports.COMPILED_EMPTY_POSITIONAL_ARGS = COMPILED_EMPTY_POSITIONAL_ARGS;

    var EvaluatedPositionalArgs = (function () {
        function EvaluatedPositionalArgs() {
            _classCallCheck(this, EvaluatedPositionalArgs);
        }

        EvaluatedPositionalArgs.empty = function empty() {
            return EVALUATED_EMPTY_POSITIONAL_ARGS;
        };

        EvaluatedPositionalArgs.create = function create(_ref3) {
            var values = _ref3.values;

            return new NonEmptyEvaluatedPositionalArgs({ values: values });
        };

        EvaluatedPositionalArgs.prototype.forEach = function forEach(callback) {
            var values = this.values;
            values.forEach(function (key, i) {
                return callback(values[i]);
            });
        };

        return EvaluatedPositionalArgs;
    })();

    exports.EvaluatedPositionalArgs = EvaluatedPositionalArgs;

    var NonEmptyEvaluatedPositionalArgs = (function (_EvaluatedPositionalArgs) {
        _inherits(NonEmptyEvaluatedPositionalArgs, _EvaluatedPositionalArgs);

        function NonEmptyEvaluatedPositionalArgs(_ref4) {
            var values = _ref4.values;

            _classCallCheck(this, NonEmptyEvaluatedPositionalArgs);

            _EvaluatedPositionalArgs.call(this);
            this.values = values;
        }

        NonEmptyEvaluatedPositionalArgs.prototype.at = function at(index) {
            return this.values[index];
        };

        NonEmptyEvaluatedPositionalArgs.prototype.value = function value() {
            return this.values.map(function (v) {
                return v.value();
            });
        };

        return NonEmptyEvaluatedPositionalArgs;
    })(EvaluatedPositionalArgs);

    var EVALUATED_EMPTY_POSITIONAL_ARGS = new ((function (_EvaluatedPositionalArgs2) {
        _inherits(_class2, _EvaluatedPositionalArgs2);

        function _class2() {
            _classCallCheck(this, _class2);

            _EvaluatedPositionalArgs2.apply(this, arguments);
        }

        _class2.prototype.at = function at() {
            return _references.NULL_REFERENCE;
        };

        _class2.prototype.value = function value() {
            return null;
        };

        return _class2;
    })(EvaluatedPositionalArgs))();
    exports.EVALUATED_EMPTY_POSITIONAL_ARGS = EVALUATED_EMPTY_POSITIONAL_ARGS;
});

enifed("glimmer-runtime/lib/compiled/expressions/ref", ["exports", "glimmer-reference"], function (exports, _glimmerReference) {
    "use strict";

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    var CompiledLocalRef = (function () {
        function CompiledLocalRef(_ref) {
            var symbol = _ref.symbol;
            var lookup = _ref.lookup;

            _classCallCheck(this, CompiledLocalRef);

            this.type = "local-ref";
            this.symbol = symbol;
            this.lookup = lookup;
        }

        CompiledLocalRef.prototype.evaluate = function evaluate(vm) {
            var base = vm.referenceForSymbol(this.symbol);
            return _glimmerReference.referenceFromParts(base, this.lookup);
        };

        return CompiledLocalRef;
    })();

    exports.CompiledLocalRef = CompiledLocalRef;

    var CompiledSelfRef = (function () {
        function CompiledSelfRef(_ref2) {
            var parts = _ref2.parts;

            _classCallCheck(this, CompiledSelfRef);

            this.type = "self-ref";
            this.parts = parts;
        }

        CompiledSelfRef.prototype.evaluate = function evaluate(vm) {
            return _glimmerReference.referenceFromParts(vm.getSelf(), this.parts);
        };

        return CompiledSelfRef;
    })();

    exports.CompiledSelfRef = CompiledSelfRef;
});

enifed("glimmer-runtime/lib/compiled/expressions/value", ["exports", "glimmer-reference"], function (exports, _glimmerReference) {
    "use strict";

    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    var CompiledValue = (function () {
        function CompiledValue(_ref) {
            var value = _ref.value;

            _classCallCheck(this, CompiledValue);

            this.type = "value";
            this.reference = new ValueReference(value);
        }

        CompiledValue.prototype.clone = function clone() {
            return new CompiledValue({ value: this.reference.value() });
        };

        CompiledValue.prototype.evaluate = function evaluate(vm) {
            return this.reference;
        };

        return CompiledValue;
    })();

    exports.default = CompiledValue;

    var ValueReference = (function (_ConstReference) {
        _inherits(ValueReference, _ConstReference);

        function ValueReference() {
            _classCallCheck(this, ValueReference);

            _ConstReference.apply(this, arguments);
        }

        ValueReference.prototype.get = function get(key) {
            var children = this.children;

            var child = children[key];
            if (!child) {
                child = children[key] = new ValueReference(this.inner[key]);
            }
            return child;
        };

        ValueReference.prototype.isDirty = function isDirty() {
            return false;
        };

        ValueReference.prototype.value = function value() {
            return this.inner;
        };

        ValueReference.prototype.destroy = function destroy() {};

        return ValueReference;
    })(_glimmerReference.ConstReference);
});

enifed("glimmer-runtime/lib/compiled/expressions", ["exports"], function (exports) {
  "use strict";
});

enifed("glimmer-runtime/lib/compiled/opcodes/component", ["exports", "../../opcodes"], function (exports, _opcodes) {
    "use strict";

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    var OpenComponentOpcode = (function (_Opcode) {
        _inherits(OpenComponentOpcode, _Opcode);

        function OpenComponentOpcode(invocation, args) {
            _classCallCheck(this, OpenComponentOpcode);

            _Opcode.call(this);
            this.type = "open-component";
            this.invocation = invocation;
            this.args = args;
        }

        OpenComponentOpcode.prototype.evaluate = function evaluate(vm) {
            var args = this.args;
            var _invocation = this.invocation;
            var templates = _invocation.templates;
            var layout = _invocation.layout;

            vm.invoke(layout, args, templates);
        };

        return OpenComponentOpcode;
    })(_opcodes.Opcode);

    exports.OpenComponentOpcode = OpenComponentOpcode;
});

enifed('glimmer-runtime/lib/compiled/opcodes/content', ['exports', '../../bounds'], function (exports, _bounds) {
    'use strict';

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var ContentOpcode = function ContentOpcode() {
        _classCallCheck(this, ContentOpcode);

        this.next = null;
        this.prev = null;
    };

    var UpdatingContentOpcode = function UpdatingContentOpcode() {
        _classCallCheck(this, UpdatingContentOpcode);

        this.next = null;
        this.prev = null;
    };

    var AppendOpcode = (function (_ContentOpcode) {
        _inherits(AppendOpcode, _ContentOpcode);

        function AppendOpcode() {
            _classCallCheck(this, AppendOpcode);

            _ContentOpcode.apply(this, arguments);
        }

        AppendOpcode.prototype.evaluate = function evaluate(vm) {
            var reference = vm.frame.getOperand();
            var value = reference.value();
            var node = vm.stack().appendText(value);
            vm.updateWith(new UpdateAppendOpcode(reference, value, node));
        };

        return AppendOpcode;
    })(ContentOpcode);

    exports.AppendOpcode = AppendOpcode;

    var UpdateAppendOpcode = (function (_UpdatingContentOpcode) {
        _inherits(UpdateAppendOpcode, _UpdatingContentOpcode);

        function UpdateAppendOpcode(reference, lastValue, textNode) {
            _classCallCheck(this, UpdateAppendOpcode);

            _UpdatingContentOpcode.call(this);
            this.reference = reference;
            this.lastValue = lastValue;
            this.textNode = textNode;
        }

        UpdateAppendOpcode.prototype.evaluate = function evaluate() {
            var val = this.reference.value();
            if (val !== this.lastValue) {
                this.lastValue = this.textNode.nodeValue = val;
            }
        };

        return UpdateAppendOpcode;
    })(UpdatingContentOpcode);

    exports.UpdateAppendOpcode = UpdateAppendOpcode;

    var TrustingAppendOpcode = (function (_ContentOpcode2) {
        _inherits(TrustingAppendOpcode, _ContentOpcode2);

        function TrustingAppendOpcode() {
            _classCallCheck(this, TrustingAppendOpcode);

            _ContentOpcode2.apply(this, arguments);
        }

        TrustingAppendOpcode.prototype.evaluate = function evaluate(vm) {
            var reference = vm.frame.getOperand();
            var value = reference.value();
            var bounds = vm.stack().insertHTMLBefore(null, value);
            vm.updateWith(new UpdateTrustingAppendOpcode(reference, value, bounds));
        };

        return TrustingAppendOpcode;
    })(ContentOpcode);

    exports.TrustingAppendOpcode = TrustingAppendOpcode;

    var UpdateTrustingAppendOpcode = (function (_UpdatingContentOpcode2) {
        _inherits(UpdateTrustingAppendOpcode, _UpdatingContentOpcode2);

        function UpdateTrustingAppendOpcode(reference, lastValue, bounds) {
            _classCallCheck(this, UpdateTrustingAppendOpcode);

            _UpdatingContentOpcode2.call(this);
            this.reference = reference;
            this.lastValue = lastValue;
            this.bounds = bounds;
        }

        UpdateTrustingAppendOpcode.prototype.evaluate = function evaluate(vm) {
            var val = this.reference.value();
            if (val !== this.lastValue) {
                var _parent = this.bounds.parentElement();
                var nextSibling = _bounds.clear(this.bounds);
                this.bounds = vm.dom.insertHTMLBefore(_parent, nextSibling, val);
            }
        };

        return UpdateTrustingAppendOpcode;
    })(UpdatingContentOpcode);

    exports.UpdateTrustingAppendOpcode = UpdateTrustingAppendOpcode;
});

enifed("glimmer-runtime/lib/compiled/opcodes/dom", ["exports"], function (exports) {
    "use strict";

    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    var DOMOpcode = function DOMOpcode() {
        _classCallCheck(this, DOMOpcode);

        this.next = null;
        this.prev = null;
    };

    var DOMUpdatingOpcode = function DOMUpdatingOpcode() {
        _classCallCheck(this, DOMUpdatingOpcode);

        this.next = null;
        this.prev = null;
    };

    var TextOpcode = (function (_DOMOpcode) {
        _inherits(TextOpcode, _DOMOpcode);

        function TextOpcode(text) {
            _classCallCheck(this, TextOpcode);

            _DOMOpcode.call(this);
            this.type = "text";
            this.text = text;
        }

        TextOpcode.prototype.evaluate = function evaluate(vm) {
            vm.stack().appendText(this.text);
        };

        return TextOpcode;
    })(DOMOpcode);

    exports.TextOpcode = TextOpcode;

    var OpenPrimitiveElementOpcode = (function (_DOMOpcode2) {
        _inherits(OpenPrimitiveElementOpcode, _DOMOpcode2);

        function OpenPrimitiveElementOpcode(tag) {
            _classCallCheck(this, OpenPrimitiveElementOpcode);

            _DOMOpcode2.call(this);
            this.type = "open-primitive-element";
            this.tag = tag;
        }

        OpenPrimitiveElementOpcode.prototype.evaluate = function evaluate(vm) {
            vm.stack().openElement(this.tag);
        };

        return OpenPrimitiveElementOpcode;
    })(DOMOpcode);

    exports.OpenPrimitiveElementOpcode = OpenPrimitiveElementOpcode;

    var CloseElementOpcode = (function (_DOMOpcode3) {
        _inherits(CloseElementOpcode, _DOMOpcode3);

        function CloseElementOpcode() {
            _classCallCheck(this, CloseElementOpcode);

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            _DOMOpcode3.call.apply(_DOMOpcode3, [this].concat(args));
            this.type = "close-element";
        }

        CloseElementOpcode.prototype.evaluate = function evaluate(vm) {
            var _vm$stack$closeElement = vm.stack().closeElement();

            var element = _vm$stack$closeElement.element;
            var classList = _vm$stack$closeElement.classList;
            var classNames = _vm$stack$closeElement.classNames;

            if (classList) {
                vm.updateWith(new UpdateAttributeOpcode(element, "class", classList, classNames));
            }
        };

        return CloseElementOpcode;
    })(DOMOpcode);

    exports.CloseElementOpcode = CloseElementOpcode;

    var StaticAttrOpcode = (function (_DOMOpcode4) {
        _inherits(StaticAttrOpcode, _DOMOpcode4);

        function StaticAttrOpcode(attr) {
            _classCallCheck(this, StaticAttrOpcode);

            _DOMOpcode4.call(this);
            this.type = "static-attr";
            this.name = attr.name;
            this.value = attr.value;
            this.namespace = attr.namespace;
        }

        StaticAttrOpcode.prototype.evaluate = function evaluate(vm) {
            var name = this.name;
            var value = this.value;
            var namespace = this.namespace;

            if (this.namespace) {
                vm.stack().setAttributeNS(name, value, namespace);
            } else {
                vm.stack().setAttribute(name, value);
            }
        };

        return StaticAttrOpcode;
    })(DOMOpcode);

    exports.StaticAttrOpcode = StaticAttrOpcode;

    var DynamicAttrOpcode = (function (_DOMOpcode5) {
        _inherits(DynamicAttrOpcode, _DOMOpcode5);

        function DynamicAttrOpcode(attr) {
            _classCallCheck(this, DynamicAttrOpcode);

            _DOMOpcode5.call(this);
            this.type = "dynamic-attr";
            this.name = attr.name;
            this.namespace = attr.namespace;
        }

        DynamicAttrOpcode.prototype.evaluate = function evaluate(vm) {
            var name = this.name;
            var namespace = this.namespace;

            var reference = vm.frame.getOperand();
            var value = reference.value();
            if (this.namespace) {
                vm.stack().setAttributeNS(name, value, namespace);
            } else {
                vm.stack().setAttribute(name, value);
            }
            vm.updateWith(new UpdateAttributeOpcode(vm.stack().element, name, reference, value));
        };

        return DynamicAttrOpcode;
    })(DOMOpcode);

    exports.DynamicAttrOpcode = DynamicAttrOpcode;

    var UpdateAttributeOpcode = (function (_DOMUpdatingOpcode) {
        _inherits(UpdateAttributeOpcode, _DOMUpdatingOpcode);

        function UpdateAttributeOpcode(element, name, reference, lastValue, namespace) {
            _classCallCheck(this, UpdateAttributeOpcode);

            _DOMUpdatingOpcode.call(this);
            this.type = "update-attribute";
            this.element = element;
            this.name = name;
            this.reference = reference;
            this.lastValue = lastValue;
            this.namespace = namespace;
        }

        UpdateAttributeOpcode.prototype.evaluate = function evaluate(vm) {
            var value = this.reference.value();
            if (value !== this.lastValue) {
                if (this.namespace) {
                    vm.dom.setAttributeNS(this.element, this.name, value, this.namespace);
                } else {
                    vm.dom.setAttribute(this.element, this.name, value);
                }
                this.lastValue = value;
            }
        };

        return UpdateAttributeOpcode;
    })(DOMUpdatingOpcode);

    exports.UpdateAttributeOpcode = UpdateAttributeOpcode;

    var DynamicPropOpcode = (function (_DOMOpcode6) {
        _inherits(DynamicPropOpcode, _DOMOpcode6);

        function DynamicPropOpcode(attr) {
            _classCallCheck(this, DynamicPropOpcode);

            _DOMOpcode6.call(this);
            this.type = "dynamic-prop";
            this.name = attr.name;
        }

        DynamicPropOpcode.prototype.evaluate = function evaluate(vm) {
            var name = this.name;

            var element = vm.stack().element;
            var reference = vm.frame.getOperand();
            var value = reference.value();
            element[name] = value;
            vm.updateWith(new UpdatePropertyOpcode(element, name, reference, value));
        };

        return DynamicPropOpcode;
    })(DOMOpcode);

    exports.DynamicPropOpcode = DynamicPropOpcode;

    var UpdatePropertyOpcode = (function (_DOMUpdatingOpcode2) {
        _inherits(UpdatePropertyOpcode, _DOMUpdatingOpcode2);

        function UpdatePropertyOpcode(element, name, reference, lastValue) {
            _classCallCheck(this, UpdatePropertyOpcode);

            _DOMUpdatingOpcode2.call(this);
            this.type = "update-property";
            this.element = element;
            this.name = name;
            this.reference = reference;
            this.lastValue = lastValue;
        }

        UpdatePropertyOpcode.prototype.evaluate = function evaluate(vm) {
            var value = this.reference.value();
            if (value !== this.lastValue) {
                this.lastValue = this.element[this.name] = value;
            }
        };

        return UpdatePropertyOpcode;
    })(DOMUpdatingOpcode);

    exports.UpdatePropertyOpcode = UpdatePropertyOpcode;

    var AddClassOpcode = (function (_DOMOpcode7) {
        _inherits(AddClassOpcode, _DOMOpcode7);

        function AddClassOpcode() {
            _classCallCheck(this, AddClassOpcode);

            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            _DOMOpcode7.call.apply(_DOMOpcode7, [this].concat(args));
            this.type = "add-class";
        }

        AddClassOpcode.prototype.evaluate = function evaluate(vm) {
            vm.stack().addClass(vm.frame.getOperand());
        };

        return AddClassOpcode;
    })(DOMOpcode);

    exports.AddClassOpcode = AddClassOpcode;

    var CommentOpcode = (function (_DOMOpcode8) {
        _inherits(CommentOpcode, _DOMOpcode8);

        function CommentOpcode(comment) {
            _classCallCheck(this, CommentOpcode);

            _DOMOpcode8.call(this);
            this.type = "comment";
            this.value = comment.value;
        }

        CommentOpcode.prototype.evaluate = function evaluate(vm) {
            vm.stack().appendComment(this.value);
        };

        return CommentOpcode;
    })(DOMOpcode);

    exports.CommentOpcode = CommentOpcode;
});

enifed('glimmer-runtime/lib/compiled/opcodes/lists', ['exports', '../expressions/args', 'glimmer-util', 'glimmer-reference'], function (exports, _expressionsArgs, _glimmerUtil, _glimmerReference) {
    'use strict';

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var ListOpcode = function ListOpcode() {
        _classCallCheck(this, ListOpcode);

        this.next = null;
        this.prev = null;
    };

    var ListUpdatingOpcode = function ListUpdatingOpcode() {
        _classCallCheck(this, ListUpdatingOpcode);

        this.next = null;
        this.prev = null;
    };

    var EnterListOpcode = (function (_ListOpcode) {
        _inherits(EnterListOpcode, _ListOpcode);

        function EnterListOpcode(start, end) {
            _classCallCheck(this, EnterListOpcode);

            _ListOpcode.call(this);
            this.type = "enter-list";
            this.slice = new _glimmerUtil.ListSlice(start, end);
        }

        EnterListOpcode.prototype.evaluate = function evaluate(vm) {
            var listRef = vm.frame.getOperand();
            var keyPath = vm.frame.getArgs().named.get(_glimmerUtil.LITERAL("key")).value();
            var manager = new _glimmerReference.ListManager(listRef, /* WTF */keyPath);
            var delegate = new IterateDelegate(vm);
            vm.frame.setIterator(manager.iterator(delegate));
            vm.enterList(manager, this.slice);
        };

        return EnterListOpcode;
    })(ListOpcode);

    exports.EnterListOpcode = EnterListOpcode;

    var ExitListOpcode = (function (_ListOpcode2) {
        _inherits(ExitListOpcode, _ListOpcode2);

        function ExitListOpcode() {
            _classCallCheck(this, ExitListOpcode);

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            _ListOpcode2.call.apply(_ListOpcode2, [this].concat(args));
            this.type = "exit-list";
        }

        ExitListOpcode.prototype.evaluate = function evaluate(vm) {
            vm.exitList();
        };

        return ExitListOpcode;
    })(ListOpcode);

    exports.ExitListOpcode = ExitListOpcode;

    var EnterWithKeyOpcode = (function (_ListOpcode3) {
        _inherits(EnterWithKeyOpcode, _ListOpcode3);

        function EnterWithKeyOpcode(start, end) {
            _classCallCheck(this, EnterWithKeyOpcode);

            _ListOpcode3.call(this);
            this.type = "enter-with-key";
            this.slice = new _glimmerUtil.ListSlice(start, end);
        }

        EnterWithKeyOpcode.prototype.evaluate = function evaluate(vm) {
            vm.enterWithKey(vm.frame.getKey(), this.slice);
        };

        return EnterWithKeyOpcode;
    })(ListOpcode);

    exports.EnterWithKeyOpcode = EnterWithKeyOpcode;

    var TRUE_REF = new _glimmerReference.ConstReference(true);
    var FALSE_REF = new _glimmerReference.ConstReference(false);

    var IterateDelegate = (function () {
        function IterateDelegate(vm) {
            _classCallCheck(this, IterateDelegate);

            this.vm = vm;
        }

        IterateDelegate.prototype.insert = function insert(key, item, before) {
            var vm = this.vm;

            _glimmerUtil.assert(!before, "Insertion should be append-only on initial render");
            vm.frame.setArgs(_expressionsArgs.EvaluatedArgs.positional([item]));
            vm.frame.setOperand(item);
            vm.frame.setCondition(TRUE_REF);
            vm.frame.setKey(key);
        };

        IterateDelegate.prototype.retain = function retain(key, item) {
            _glimmerUtil.assert(false, "Insertion should be append-only on initial render");
        };

        IterateDelegate.prototype.move = function move(key, item, before) {
            _glimmerUtil.assert(false, "Insertion should be append-only on initial render");
        };

        IterateDelegate.prototype.delete = function _delete(key) {
            _glimmerUtil.assert(false, "Insertion should be append-only on initial render");
        };

        IterateDelegate.prototype.done = function done() {
            this.vm.frame.setCondition(FALSE_REF);
        };

        return IterateDelegate;
    })();

    var NextIterOpcode = (function (_ListOpcode4) {
        _inherits(NextIterOpcode, _ListOpcode4);

        function NextIterOpcode(end) {
            _classCallCheck(this, NextIterOpcode);

            _ListOpcode4.call(this);
            this.type = "next-iter";
            this.end = end;
        }

        NextIterOpcode.prototype.evaluate = function evaluate(vm) {
            if (vm.frame.getIterator().next()) {
                vm.goto(this.end);
            }
        };

        return NextIterOpcode;
    })(ListOpcode);

    exports.NextIterOpcode = NextIterOpcode;

    var ReiterateOpcode = (function (_ListUpdatingOpcode) {
        _inherits(ReiterateOpcode, _ListUpdatingOpcode);

        function ReiterateOpcode(initialize) {
            _classCallCheck(this, ReiterateOpcode);

            _ListUpdatingOpcode.call(this);
            this.type = "reiterate";
            this.initialize = initialize;
        }

        ReiterateOpcode.prototype.evaluate = function evaluate(vm) {
            vm.throw(this.initialize);
        };

        return ReiterateOpcode;
    })(ListUpdatingOpcode);
});

enifed("glimmer-runtime/lib/compiled/opcodes/vm", ["exports", "glimmer-util"], function (exports, _glimmerUtil) {
    "use strict";

    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    var VMOpcode = function VMOpcode() {
        _classCallCheck(this, VMOpcode);

        this.next = null;
        this.prev = null;
    };

    var VMUpdatingOpcode = function VMUpdatingOpcode() {
        _classCallCheck(this, VMUpdatingOpcode);

        this.next = null;
        this.prev = null;
    };

    var PushChildScopeOpcode = (function (_VMOpcode) {
        _inherits(PushChildScopeOpcode, _VMOpcode);

        function PushChildScopeOpcode() {
            _classCallCheck(this, PushChildScopeOpcode);

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            _VMOpcode.call.apply(_VMOpcode, [this].concat(args));
            this.type = "push-child-scope";
        }

        PushChildScopeOpcode.prototype.evaluate = function evaluate(vm) {
            vm.pushChildScope();
        };

        return PushChildScopeOpcode;
    })(VMOpcode);

    exports.PushChildScopeOpcode = PushChildScopeOpcode;

    var PopScopeOpcode = (function (_VMOpcode2) {
        _inherits(PopScopeOpcode, _VMOpcode2);

        function PopScopeOpcode() {
            _classCallCheck(this, PopScopeOpcode);

            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            _VMOpcode2.call.apply(_VMOpcode2, [this].concat(args));
            this.type = "pop-scope";
        }

        PopScopeOpcode.prototype.evaluate = function evaluate(vm) {
            vm.popScope();
        };

        return PopScopeOpcode;
    })(VMOpcode);

    exports.PopScopeOpcode = PopScopeOpcode;

    var PutValue = (function (_VMOpcode3) {
        _inherits(PutValue, _VMOpcode3);

        function PutValue(expression) {
            _classCallCheck(this, PutValue);

            _VMOpcode3.call(this);
            this.type = "put-value";
            this.expression = expression;
        }

        PutValue.prototype.evaluate = function evaluate(vm) {
            vm.evaluateOperand(this.expression);
        };

        return PutValue;
    })(VMOpcode);

    exports.PutValue = PutValue;

    var PutArgsOpcode = (function (_VMOpcode4) {
        _inherits(PutArgsOpcode, _VMOpcode4);

        function PutArgsOpcode(args) {
            _classCallCheck(this, PutArgsOpcode);

            _VMOpcode4.call(this);
            this.type = "put-args";
            this.args = args;
        }

        PutArgsOpcode.prototype.evaluate = function evaluate(vm) {
            vm.evaluateArgs(this.args);
        };

        return PutArgsOpcode;
    })(VMOpcode);

    exports.PutArgsOpcode = PutArgsOpcode;

    var BindArgsOpcode = (function (_VMOpcode5) {
        _inherits(BindArgsOpcode, _VMOpcode5);

        function BindArgsOpcode(template) {
            var _this = this;

            _classCallCheck(this, BindArgsOpcode);

            _VMOpcode5.call(this);
            this.type = "bind-args";
            this.positional = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            if (template.locals) {
                template.locals.forEach(function (name, i) {
                    _this.positional[i] = template.symbolTable.get(name);
                });
            }
            if (template.isTop() && template.named) {
                this.named = template.named.reduce(function (obj, name) {
                    var _assign;

                    return _glimmerUtil.assign(obj, (_assign = {}, _assign[name] = template.symbolTable.get(name), _assign));
                }, _glimmerUtil.dict());
            } else {
                this.named = _glimmerUtil.dict();
            }
        }

        BindArgsOpcode.prototype.evaluate = function evaluate(vm) {
            vm.bindArgs(this.positional, this.named);
        };

        return BindArgsOpcode;
    })(VMOpcode);

    exports.BindArgsOpcode = BindArgsOpcode;

    var EnterOpcode = (function (_VMOpcode6) {
        _inherits(EnterOpcode, _VMOpcode6);

        function EnterOpcode(begin, end) {
            _classCallCheck(this, EnterOpcode);

            _VMOpcode6.call(this);
            this.type = "enter";
            this.slice = new _glimmerUtil.ListSlice(begin, end);
        }

        EnterOpcode.prototype.evaluate = function evaluate(vm) {
            vm.enter(this.slice);
        };

        return EnterOpcode;
    })(VMOpcode);

    exports.EnterOpcode = EnterOpcode;

    var ExitOpcode = (function (_VMOpcode7) {
        _inherits(ExitOpcode, _VMOpcode7);

        function ExitOpcode() {
            _classCallCheck(this, ExitOpcode);

            for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                args[_key3] = arguments[_key3];
            }

            _VMOpcode7.call.apply(_VMOpcode7, [this].concat(args));
            this.type = "exit";
        }

        ExitOpcode.prototype.evaluate = function evaluate(vm) {
            vm.exit();
        };

        return ExitOpcode;
    })(VMOpcode);

    exports.ExitOpcode = ExitOpcode;

    var NoopOpcode = (function (_VMOpcode8) {
        _inherits(NoopOpcode, _VMOpcode8);

        function NoopOpcode(label) {
            _classCallCheck(this, NoopOpcode);

            _VMOpcode8.call(this);
            this.type = "noop";
            this.label = null;
            if (label) this.label = label;
        }

        NoopOpcode.prototype.evaluate = function evaluate(vm) {};

        return NoopOpcode;
    })(VMOpcode);

    exports.NoopOpcode = NoopOpcode;

    var EvaluateOpcode = (function (_VMOpcode9) {
        _inherits(EvaluateOpcode, _VMOpcode9);

        function EvaluateOpcode(template) {
            _classCallCheck(this, EvaluateOpcode);

            _VMOpcode9.call(this);
            this.type = "evaluate";
            this.template = template;
        }

        EvaluateOpcode.prototype.evaluate = function evaluate(vm) {
            this.template.compile(vm.env);
            vm.pushFrame(this.template.ops, vm.frame.getArgs());
        };

        return EvaluateOpcode;
    })(VMOpcode);

    exports.EvaluateOpcode = EvaluateOpcode;

    var TestOpcode = (function (_VMOpcode10) {
        _inherits(TestOpcode, _VMOpcode10);

        function TestOpcode() {
            _classCallCheck(this, TestOpcode);

            for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                args[_key4] = arguments[_key4];
            }

            _VMOpcode10.call.apply(_VMOpcode10, [this].concat(args));
            this.type = "test";
        }

        TestOpcode.prototype.evaluate = function evaluate(vm) {
            vm.frame.setCondition(vm.frame.getOperand());
        };

        return TestOpcode;
    })(VMOpcode);

    exports.TestOpcode = TestOpcode;

    var JumpOpcode = (function (_VMOpcode11) {
        _inherits(JumpOpcode, _VMOpcode11);

        function JumpOpcode(target) {
            _classCallCheck(this, JumpOpcode);

            _VMOpcode11.call(this);
            this.type = "jump";
            this.target = target;
        }

        JumpOpcode.prototype.evaluate = function evaluate(vm) {
            vm.goto(this.target);
        };

        return JumpOpcode;
    })(VMOpcode);

    exports.JumpOpcode = JumpOpcode;

    var JumpIfOpcode = (function (_JumpOpcode) {
        _inherits(JumpIfOpcode, _JumpOpcode);

        function JumpIfOpcode() {
            _classCallCheck(this, JumpIfOpcode);

            for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                args[_key5] = arguments[_key5];
            }

            _JumpOpcode.call.apply(_JumpOpcode, [this].concat(args));
            this.type = "jump-if";
        }

        JumpIfOpcode.prototype.evaluate = function evaluate(vm) {
            var reference = vm.frame.getCondition();
            var value = reference.value();
            if (value) {
                _JumpOpcode.prototype.evaluate.call(this, vm);
                vm.updateWith(new Assert(reference));
            } else {
                vm.updateWith(new AssertFalse(reference));
            }
        };

        return JumpIfOpcode;
    })(JumpOpcode);

    exports.JumpIfOpcode = JumpIfOpcode;

    var JumpUnlessOpcode = (function (_JumpOpcode2) {
        _inherits(JumpUnlessOpcode, _JumpOpcode2);

        function JumpUnlessOpcode() {
            _classCallCheck(this, JumpUnlessOpcode);

            for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                args[_key6] = arguments[_key6];
            }

            _JumpOpcode2.call.apply(_JumpOpcode2, [this].concat(args));
            this.type = "jump-unless";
        }

        JumpUnlessOpcode.prototype.evaluate = function evaluate(vm) {
            var reference = vm.frame.getCondition();
            var value = reference.value();
            if (value) {
                vm.updateWith(new Assert(reference));
            } else {
                _JumpOpcode2.prototype.evaluate.call(this, vm);
                vm.updateWith(new AssertFalse(reference));
            }
        };

        return JumpUnlessOpcode;
    })(JumpOpcode);

    exports.JumpUnlessOpcode = JumpUnlessOpcode;

    var Assert = (function (_VMUpdatingOpcode) {
        _inherits(Assert, _VMUpdatingOpcode);

        function Assert(reference) {
            _classCallCheck(this, Assert);

            _VMUpdatingOpcode.call(this);
            this.type = "assert";
            this.reference = reference;
        }

        Assert.prototype.evaluate = function evaluate(vm) {
            if (!this.reference.value()) {
                vm.throw();
            }
        };

        return Assert;
    })(VMUpdatingOpcode);

    exports.Assert = Assert;

    var AssertFalse = (function (_VMUpdatingOpcode2) {
        _inherits(AssertFalse, _VMUpdatingOpcode2);

        function AssertFalse(reference) {
            _classCallCheck(this, AssertFalse);

            _VMUpdatingOpcode2.call(this);
            this.type = "assert";
            this.reference = reference;
        }

        AssertFalse.prototype.evaluate = function evaluate(vm) {
            if (this.reference.value()) {
                vm.throw();
            }
        };

        return AssertFalse;
    })(VMUpdatingOpcode);

    exports.AssertFalse = AssertFalse;
});

enifed('glimmer-runtime/lib/compiler', ['exports', 'glimmer-util', './compiled/opcodes/vm', './syntax', './template', './syntax/core'], function (exports, _glimmerUtil, _compiledOpcodesVm, _syntax, _template, _syntaxCore) {
    'use strict';

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var RawTemplate = (function () {
        function RawTemplate(_ref) {
            var ops = _ref.ops;
            var locals = _ref.locals;
            var named = _ref.named;
            var program = _ref.program;

            _classCallCheck(this, RawTemplate);

            this.ops = null;
            this.symbolTable = null;
            this.ops = ops;
            this.locals = locals;
            this.named = named;
            this.program = program || null;
        }

        RawTemplate.prototype.cloneWith = function cloneWith(callback) {
            var program = this.program;
            var locals = this.locals;
            var named = this.named;

            var newProgram = _glimmerUtil.LinkedList.fromSlice(program);
            var template = new RawTemplate({
                ops: null,
                locals: locals && locals.slice(),
                named: named && named.slice(),
                program: newProgram
            });
            template.symbolTable = this.symbolTable.cloneFor(template);
            callback(newProgram, template.symbolTable);
            return template;
        };

        RawTemplate.prototype.compile = function compile(env) {
            this.compileSyntax(env);
        };

        RawTemplate.prototype.compileSyntax = function compileSyntax(env) {
            this.ops = this.ops || new Compiler(this, env).compile();
        };

        RawTemplate.prototype.isTop = function isTop() {
            return this.symbolTable.isTop();
        };

        RawTemplate.prototype.hasLocals = function hasLocals() {
            return !!(this.locals || this.named);
        };

        return RawTemplate;
    })();

    exports.RawTemplate = RawTemplate;

    var Compiler = (function () {
        function Compiler(template, env) {
            _classCallCheck(this, Compiler);

            this.env = env;
            this.template = template;
            this.current = template.program.head();
            this.ops = new _glimmerUtil.LinkedList();
            this.symbolTable = template.symbolTable;
        }

        Compiler.prototype.compile = function compile() {
            var template = this.template;
            var ops = this.ops;
            var env = this.env;
            var program = template.program;

            if (template.hasLocals()) ops.append(new _compiledOpcodesVm.BindArgsOpcode(this.template));
            while (this.current) {
                var current = this.current;
                this.current = program.nextNode(current);
                env.statement(current).compile(this, env);
            }
            return ops;
        };

        Compiler.prototype.append = function append(op) {
            this.ops.append(op);
        };

        Compiler.prototype.getSymbol = function getSymbol(name) {
            return this.symbolTable.get(name);
        };

        Compiler.prototype.sliceAttributes = function sliceAttributes() {
            var program = this.template.program;

            var begin = null;
            var end = null;
            while (this.current[_syntax.ATTRIBUTE_SYNTAX]) {
                var current = this.current;
                this.current = program.nextNode(current);
                begin = begin || current;
                end = current;
            }
            return new _glimmerUtil.ListSlice(begin, end);
        };

        Compiler.prototype.templateFromTagContents = function templateFromTagContents() {
            var program = this.template.program;

            var begin = null;
            var end = null;
            var nesting = 1;
            while (true) {
                var current = this.current;
                this.current = program.nextNode(current);
                if (current instanceof _syntaxCore.CloseElement && --nesting === 0) {
                    break;
                }
                begin = begin || current;
                end = current;
                if (current instanceof _syntaxCore.OpenElement || current instanceof _syntaxCore.OpenPrimitiveElement) {
                    nesting++;
                }
            }
            var slice = new _glimmerUtil.ListSlice(begin, end);
            return _template.default.fromList(_glimmerUtil.ListSlice.toList(slice));
        };

        return Compiler;
    })();

    exports.default = Compiler;
});

enifed("glimmer-runtime/lib/component/interfaces", ["exports"], function (exports) {
    "use strict";

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    var NullHooks = (function () {
        function NullHooks() {
            _classCallCheck(this, NullHooks);
        }

        NullHooks.prototype.begin = function begin() {};

        NullHooks.prototype.commit = function commit() {};

        NullHooks.prototype.didReceiveAttrs = function didReceiveAttrs() {};

        NullHooks.prototype.didUpdateAttrs = function didUpdateAttrs() {};

        NullHooks.prototype.didInsertElement = function didInsertElement() {};

        NullHooks.prototype.willRender = function willRender() {};

        NullHooks.prototype.willUpdate = function willUpdate() {};

        NullHooks.prototype.didRender = function didRender() {};

        NullHooks.prototype.didUpdate = function didUpdate() {};

        return NullHooks;
    })();

    var NULL_HOOKS = new NullHooks();

    var ComponentDefinition = function ComponentDefinition(hooks, ComponentClass, layout, ComponentInvocation) {
        _classCallCheck(this, ComponentDefinition);

        this.hooks = hooks || NULL_HOOKS;
        this.ComponentClass = ComponentClass;
        this.layout = layout;
        this.ComponentInvocation = ComponentInvocation;
    };

    exports.ComponentDefinition = ComponentDefinition;
});

enifed('glimmer-runtime/lib/dom', ['exports', './bounds'], function (exports, _bounds) {
    'use strict';

    exports.isWhitespace = isWhitespace;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

    var DOMHelper = (function () {
        function DOMHelper(document) {
            _classCallCheck(this, DOMHelper);

            this.document = document;
            this.namespace = null;
            this.uselessElement = this.document.createElement('div');
        }

        /* tslint:disable:no-unused-variable */
        // http://www.w3.org/TR/html/syntax.html#html-integration-point

        DOMHelper.prototype.setAttribute = function setAttribute(element, name, value) {
            element.setAttribute(name, value);
        };

        DOMHelper.prototype.setAttributeNS = function setAttributeNS(element, name, value, namespace) {
            element.setAttributeNS(name, namespace, value);
        };

        DOMHelper.prototype.removeAttribute = function removeAttribute(element, name) {
            element.removeAttribute(name);
        };

        DOMHelper.prototype.createTextNode = function createTextNode(text) {
            return this.document.createTextNode(text);
        };

        DOMHelper.prototype.createComment = function createComment(data) {
            return this.document.createComment(data);
        };

        DOMHelper.prototype.createElement = function createElement(tag, context) {
            if (context.namespaceURI === SVG_NAMESPACE || tag === 'svg') {
                // Note: This does not properly handle <font> with color, face, or size attributes, which is also
                // disallowed by the spec. We should fix this.
                if (BLACKLIST_TABLE[tag]) {
                    throw new Error('Cannot create a ' + tag + ' inside of a <' + context.tagName + '>, because it\'s inside an SVG context');
                }
                return this.document.createElementNS(SVG_NAMESPACE, tag);
            } else {
                return this.document.createElement(tag);
            }
        };

        DOMHelper.prototype.insertHTMLBefore = function insertHTMLBefore(parent, nextSibling, html) {
            // REFACTOR TODO: table stuff in IE9; maybe just catch exceptions?
            var prev = nextSibling && nextSibling.previousSibling;
            var last = undefined;
            if (html === null || html === '') {
                return new _bounds.ConcreteBounds(parent, null, null);
            }
            if (nextSibling === null) {
                parent.insertAdjacentHTML('beforeEnd', html);
                last = parent.lastChild;
            } else if (nextSibling instanceof HTMLElement) {
                nextSibling.insertAdjacentHTML('beforeBegin', html);
                last = nextSibling.previousSibling;
            } else {
                parent.insertBefore(this.uselessElement, nextSibling);
                this.uselessElement.insertAdjacentHTML('beforeBegin', html);
                last = this.uselessElement.previousSibling;
                parent.removeChild(this.uselessElement);
            }
            var first = prev ? prev.nextSibling : parent.firstChild;
            return new _bounds.ConcreteBounds(parent, first, last);
        };

        DOMHelper.prototype.insertBefore = function insertBefore(element, node, reference) {
            element.insertBefore(node, reference);
        };

        return DOMHelper;
    })();

    exports.default = DOMHelper;
    var SVG_INTEGRATION_POINTS = { foreignObject: 1, desc: 1, title: 1 };
    /* tslint:enable:no-unused-variable */
    // http://www.w3.org/TR/html/syntax.html#adjust-svg-attributes
    // TODO: Adjust SVG attributes
    // http://www.w3.org/TR/html/syntax.html#parsing-main-inforeign
    // TODO: Adjust SVG elements
    // http://www.w3.org/TR/html/syntax.html#parsing-main-inforeign
    var BLACKLIST_TABLE = Object.create(null);
    exports.BLACKLIST_TABLE = BLACKLIST_TABLE;
    ["b", "big", "blockquote", "body", "br", "center", "code", "dd", "div", "dl", "dt", "em", "embed", "h1", "h2", "h3", "h4", "h5", "h6", "head", "hr", "i", "img", "li", "listing", "main", "meta", "nobr", "ol", "p", "pre", "ruby", "s", "small", "span", "strong", "strike", "sub", "sup", "table", "tt", "u", "ul", "var"].forEach(function (tag) {
        return BLACKLIST_TABLE[tag] = 1;
    });
    var WHITESPACE = /[\t-\r \xA0\u1680\u180E\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]/;

    function isWhitespace(string) {
        return WHITESPACE.test(string);
    }
});

enifed('glimmer-runtime/lib/environment', ['exports', './syntax/core', './references', 'glimmer-reference', 'glimmer-util'], function (exports, _syntaxCore, _references, _glimmerReference, _glimmerUtil) {
    'use strict';

    exports.helper = helper;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var Scope = (function () {
        function Scope(parent, references) {
            _classCallCheck(this, Scope);

            this.references = references;
            this.parent = parent;
        }

        Scope.root = function root(parent) {
            var size = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

            var refs = new Array(size + 1);
            for (var i = 0; i <= size; i++) {
                refs[i] = _references.NULL_REFERENCE;
            }
            return new Scope(parent, refs);
        };

        Scope.prototype.init = function init(_ref) {
            var self = _ref.self;

            this.references[0] = self;
            return this;
        };

        Scope.prototype.getSelf = function getSelf() {
            return this.references[0];
        };

        Scope.prototype.getSymbol = function getSymbol(symbol) {
            return this.references[symbol];
        };

        Scope.prototype.bindSymbol = function bindSymbol(symbol, value) {
            this.references[symbol] = value;
        };

        Scope.prototype.child = function child() {
            return new Scope(this, this.references.slice());
        };

        return Scope;
    })();

    exports.Scope = Scope;

    var Environment = (function () {
        function Environment(dom, meta) {
            _classCallCheck(this, Environment);

            this.createdComponents = [];
            this.createdHooks = [];
            this.updatedComponents = [];
            this.updatedHooks = [];
            this.dom = dom;
            this.meta = meta;
        }

        Environment.prototype.getDOM = function getDOM() {
            return this.dom;
        };

        Environment.prototype.getIdentity = function getIdentity(object) {
            return _glimmerUtil.intern(_glimmerUtil.installGuid(object) + '');
        };

        Environment.prototype.createRootScope = function createRootScope(size) {
            return Scope.root(null, size);
        };

        Environment.prototype.statement = function statement(_statement) {
            var type = _statement.type;
            if (type === 'append') {
                var append = _statement;
                var unknown = append.value.type === 'unknown' ? append.value : null;
                var _helper = append.value.type === 'helper' ? append.value : null;
                if (unknown && unknown.simplePath() === 'yield') {
                    return new _syntaxCore.YieldSyntax({ args: null });
                } else if (_helper && _helper.ref.simplePath() === 'yield') {
                    return new _syntaxCore.YieldSyntax({ args: _helper.args });
                }
            }
            return _statement;
        };

        Environment.prototype.begin = function begin() {
            this.createdComponents = [];
            this.createdHooks = [];
            this.updatedComponents = [];
            this.updatedHooks = [];
        };

        Environment.prototype.didCreate = function didCreate(component, hooks) {
            this.createdComponents.push(component);
            this.createdHooks.push(hooks);
        };

        Environment.prototype.didUpdate = function didUpdate(component, hooks) {
            this.updatedComponents.push(component);
            this.updatedHooks.push(hooks);
        };

        Environment.prototype.commit = function commit() {
            var _this = this;

            this.createdComponents.forEach(function (component, i) {
                var hooks = _this.createdHooks[i];
                hooks.didInsertElement(component);
                hooks.didRender(component);
            });
            this.updatedComponents.forEach(function (component, i) {
                var hooks = _this.updatedHooks[i];
                hooks.didUpdate(component);
                hooks.didRender(component);
            });
        };

        Environment.prototype.iteratorFor = function iteratorFor(iterable) {
            var position = 0;
            var len = iterable.value().length;
            return {
                next: function () {
                    if (position >= len) return { done: true, value: undefined };
                    position++;
                    return {
                        done: false,
                        value: iterable.get(_glimmerUtil.intern("" + (position - 1)))
                    };
                }
            };
        };

        return Environment;
    })();

    exports.Environment = Environment;
    exports.default = Environment;

    function helper(h) {
        return new _glimmerReference.ConstReference(h);
    }
});

enifed("glimmer-runtime/lib/opcodes", ["exports"], function (exports) {
    "use strict";

    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    var Opcode = function Opcode() {
        _classCallCheck(this, Opcode);

        this.next = null;
        this.prev = null;
    };

    exports.Opcode = Opcode;

    var UnflattenedOpcode = (function (_Opcode) {
        _inherits(UnflattenedOpcode, _Opcode);

        function UnflattenedOpcode() {
            _classCallCheck(this, UnflattenedOpcode);

            _Opcode.apply(this, arguments);
        }

        UnflattenedOpcode.prototype.evaluate = function evaluate() {
            throw new Error("Unreachable");
        };

        return UnflattenedOpcode;
    })(Opcode);

    exports.UnflattenedOpcode = UnflattenedOpcode;
});

enifed('glimmer-runtime/lib/references', ['exports', 'glimmer-reference'], function (exports, _glimmerReference) {
    'use strict';

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    var PrimitiveReference = (function (_ConstReference) {
        _inherits(PrimitiveReference, _ConstReference);

        function PrimitiveReference() {
            _classCallCheck(this, PrimitiveReference);

            _ConstReference.apply(this, arguments);
        }

        PrimitiveReference.prototype.get = function get() {
            return NULL_REFERENCE;
        };

        return PrimitiveReference;
    })(_glimmerReference.ConstReference);

    exports.PrimitiveReference = PrimitiveReference;
    var NULL_REFERENCE = new PrimitiveReference(null);
    exports.NULL_REFERENCE = NULL_REFERENCE;
});

enifed('glimmer-runtime/lib/scanner', ['exports', './syntax/statements', './template', './syntax/core', './symbol-table', 'glimmer-util'], function (exports, _syntaxStatements, _template, _syntaxCore, _symbolTable, _glimmerUtil) {
    'use strict';

    exports.buildStatements = buildStatements;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var Scanner = (function () {
        function Scanner(specs) {
            _classCallCheck(this, Scanner);

            this.specs = specs;
        }

        Scanner.prototype.scan = function scan() {
            var specs = this.specs;

            var templates = new Array(specs.length);
            for (var i = 0; i < specs.length; i++) {
                var spec = specs[i];

                var _buildStatements = buildStatements(spec.statements, templates);

                var program = _buildStatements.program;
                var children = _buildStatements.children;

                templates[i] = new _template.default({
                    program: program,
                    children: children,
                    root: templates,
                    position: i,
                    meta: spec.meta,
                    locals: spec.locals,
                    named: spec.named,
                    isEmpty: spec.statements.length === 0,
                    spec: spec
                });
            }
            var top = templates[templates.length - 1];
            var table = top.raw.symbolTable = new _symbolTable.default(null, top.raw).initNamed(top.raw.named);
            top.children.forEach(function (t) {
                return initTemplate(t, table);
            });
            return top;
        };

        return Scanner;
    })();

    exports.default = Scanner;

    function initTemplate(template, parent) {
        var locals = template.raw.locals;

        var table = parent;
        table = new _symbolTable.default(parent, template.raw).initPositional(locals);
        template.raw.symbolTable = table;
        template.children.forEach(function (t) {
            return initTemplate(t, table);
        });
    }

    function buildStatements(statements, templates) {
        if (statements.length === 0) {
            return { program: _glimmerUtil.EMPTY_SLICE, children: [] };
        }
        var program = new _glimmerUtil.LinkedList();
        var children = [];
        statements.forEach(function (s) {
            var Statement = _syntaxStatements.default(s[0]);
            var statement = Statement.fromSpec(s, templates);
            if (statement instanceof _syntaxCore.Block) {
                if (statement.templates.default) children.push(statement.templates.default);
                if (statement.templates.inverse) children.push(statement.templates.inverse);
            }
            program.append(statement);
        });
        return { program: program, children: children };
    }
});

enifed("glimmer-runtime/lib/static-stack", ["exports"], function (exports) {
  "use strict";
});

enifed('glimmer-runtime/lib/symbol-table', ['exports', 'glimmer-util'], function (exports, _glimmerUtil) {
    'use strict';

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var SymbolTable = (function () {
        function SymbolTable(parent, template) {
            _classCallCheck(this, SymbolTable);

            this.locals = _glimmerUtil.dict();
            this.size = 1;
            this.parent = parent;
            this.top = parent ? parent.top : this;
            this.template = template;
        }

        SymbolTable.prototype.cloneFor = function cloneFor(template) {
            var table = new SymbolTable(this.parent, template);
            table.locals = _glimmerUtil.assign({}, this.locals);
            table.size = this.size;
            return table;
        };

        SymbolTable.prototype.initPositional = function initPositional(positional) {
            var _this = this;

            if (positional) positional.forEach(function (s) {
                return _this.putPositional(s);
            });
            return this;
        };

        SymbolTable.prototype.initNamed = function initNamed(named) {
            var _this2 = this;

            if (named) named.forEach(function (s) {
                return _this2.locals[s] = _this2.size++;
            });
            return this;
        };

        SymbolTable.prototype.putNamed = function putNamed(names) {
            var top = this.top;
            names.forEach(function (s) {
                return top.putSingleNamed(s);
            });
        };

        SymbolTable.prototype.get = function get(name) {
            var locals = this.locals;
            var parent = this.parent;

            var symbol = locals[name];
            if (!symbol && parent) {
                symbol = parent.get(name);
            }
            return symbol;
        };

        SymbolTable.prototype.isTop = function isTop() {
            return this.top === this;
        };

        SymbolTable.prototype.putSingleNamed = function putSingleNamed(name) {
            if (!this.locals[name]) {
                this.locals[name] = this.size++;
                this.template.named = this.template.named || [];
                this.template.named.push(name);
            }
        };

        SymbolTable.prototype.putPositional = function putPositional(name) {
            var position = this.locals[name];
            if (!position) {
                position = this.locals[name] = this.top.size++;
            }
            return position;
        };

        return SymbolTable;
    })();

    exports.default = SymbolTable;
});

enifed("glimmer-runtime/lib/symbols", ["exports"], function (exports) {
  "use strict";

  var TRUSTED_STRING = "trusted string [id=7d10c13d-cdf5-45f4-8859-b09ce16517c2]";
  exports.TRUSTED_STRING = TRUSTED_STRING;
});

enifed('glimmer-runtime/lib/syntax/core', ['exports', '../syntax', '../opcodes', '../compiled/opcodes/vm', '../compiled/opcodes/component', '../compiled/expressions/args', '../compiled/expressions/value', '../compiled/expressions/ref', '../compiled/expressions/helper', '../compiled/expressions/concat', 'glimmer-reference', 'glimmer-util', '../compiled/opcodes/dom', '../compiled/opcodes/content'], function (exports, _syntax, _opcodes, _compiledOpcodesVm, _compiledOpcodesComponent, _compiledExpressionsArgs, _compiledExpressionsValue, _compiledExpressionsRef, _compiledExpressionsHelper, _compiledExpressionsConcat, _glimmerReference, _glimmerUtil, _compiledOpcodesDom, _compiledOpcodesContent) {
    'use strict';

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    var EMPTY_ARRAY = Object.freeze([]);

    var Block = (function (_StatementSyntax) {
        _inherits(Block, _StatementSyntax);

        function Block(options) {
            _classCallCheck(this, Block);

            _StatementSyntax.call(this);
            this.type = "block";
            this.path = options.path;
            this.args = options.args;
            this.templates = options.templates;
        }

        Block.fromSpec = function fromSpec(sexp, children) {
            var path = sexp[1];
            var params = sexp[2];
            var hash = sexp[3];
            var templateId = sexp[4];
            var inverseId = sexp[5];

            return new Block({
                path: path,
                args: Args.fromSpec(params, hash),
                templates: Templates.fromSpec(null, [templateId, inverseId, children])
            });
        };

        Block.build = function build(options) {
            return new this(options);
        };

        Block.prototype.compile = function compile(ops) {
            throw new Error("SyntaxError");
        };

        Block.prototype.prettyPrint = function prettyPrint() {
            return null;
            // let [params, hash] = this.args.prettyPrint();
            // let block = new PrettyPrint('expr', this.path.join('.'), params, hash);
            // return new PrettyPrint('block', 'block', [block], null, this.templates.prettyPrint());
        };

        return Block;
    })(_syntax.StatementSyntax);

    exports.Block = Block;

    var Unknown = (function (_ExpressionSyntax) {
        _inherits(Unknown, _ExpressionSyntax);

        function Unknown(options) {
            _classCallCheck(this, Unknown);

            _ExpressionSyntax.call(this);
            this.type = "unknown";
            this.ref = options.ref;
            this.trustingMorph = !!options.unsafe;
        }

        Unknown.fromSpec = function fromSpec(sexp) {
            var path = sexp[1];
            var unsafe = sexp[2];

            return new Unknown({ ref: new Ref({ parts: path }), unsafe: unsafe });
        };

        Unknown.build = function build(path, unsafe) {
            return new this({ ref: Ref.build(path), unsafe: unsafe });
        };

        Unknown.prototype.compile = function compile(compiler) {
            var ref = this.ref;

            if (compiler.env.hasHelper(ref.parts)) {
                return new _compiledExpressionsHelper.default({ helper: compiler.env.lookupHelper(ref.parts), args: _compiledExpressionsArgs.CompiledArgs.empty() });
            } else {
                return this.ref.compile(compiler);
            }
        };

        Unknown.prototype.simplePath = function simplePath() {
            return this.ref.simplePath();
        };

        return Unknown;
    })(_syntax.ExpressionSyntax);

    exports.Unknown = Unknown;

    var Append = (function (_StatementSyntax2) {
        _inherits(Append, _StatementSyntax2);

        function Append(_ref) {
            var value = _ref.value;
            var trustingMorph = _ref.trustingMorph;

            _classCallCheck(this, Append);

            _StatementSyntax2.call(this);
            this.type = "append";
            this.value = value;
            this.trustingMorph = trustingMorph;
        }

        Append.fromSpec = function fromSpec(sexp) {
            var value = sexp[1];
            var trustingMorph = sexp[2];

            return new Append({ value: buildExpression(value), trustingMorph: trustingMorph });
        };

        Append.build = function build(value, trustingMorph) {
            return new this({ value: value, trustingMorph: trustingMorph });
        };

        Append.prototype.prettyPrint = function prettyPrint() {
            var operation = this.trustingMorph ? 'html' : 'text';
            return new _syntax.PrettyPrint('append', operation, [this.value.prettyPrint()]);
        };

        Append.prototype.compile = function compile(compiler) {
            compiler.append(new _compiledOpcodesVm.PutValue(this.value.compile(compiler)));
            if (this.trustingMorph) {
                compiler.append(new _compiledOpcodesContent.TrustingAppendOpcode());
            } else {
                compiler.append(new _compiledOpcodesContent.AppendOpcode());
            }
        };

        return Append;
    })(_syntax.StatementSyntax);

    exports.Append = Append;

    var HelperInvocationReference = (function (_PushPullReference) {
        _inherits(HelperInvocationReference, _PushPullReference);

        function HelperInvocationReference(helper, args) {
            _classCallCheck(this, HelperInvocationReference);

            _PushPullReference.call(this);
            this.helper = helper;
            this.args = args;
        }

        HelperInvocationReference.prototype.get = function get() {
            throw new Error("Unimplemented: Yielding the result of a helper call.");
        };

        HelperInvocationReference.prototype.value = function value() {
            var _args = this.args;
            var positional = _args.positional;
            var named = _args.named;

            return this.helper.call(undefined, positional.value(), named.value(), null);
        };

        return HelperInvocationReference;
    })(_glimmerReference.PushPullReference);

    var DynamicProp = (function (_AttributeSyntax) {
        _inherits(DynamicProp, _AttributeSyntax);

        function DynamicProp(options) {
            _classCallCheck(this, DynamicProp);

            _AttributeSyntax.call(this);
            this["e1185d30-7cac-4b12-b26a-35327d905d92"] = true;
            this.type = "dynamic-prop";
            this.name = options.name;
            this.value = options.value;
        }

        DynamicProp.fromSpec = function fromSpec(sexp) {
            var name = sexp[1];
            var value = sexp[2];

            return new DynamicProp({
                name: name,
                value: buildExpression(value)
            });
        };

        DynamicProp.build = function build(name, value) {
            return new this({ name: _glimmerUtil.intern(name), value: value });
        };

        DynamicProp.prototype.prettyPrint = function prettyPrint() {
            var name = this.name;
            var value = this.value;

            return new _syntax.PrettyPrint('attr', 'prop', [name, value.prettyPrint()]);
        };

        DynamicProp.prototype.compile = function compile(compiler) {
            compiler.append(new _compiledOpcodesVm.PutValue(this.value.compile(compiler)));
            compiler.append(new _compiledOpcodesDom.DynamicPropOpcode(this));
        };

        DynamicProp.prototype.valueSyntax = function valueSyntax() {
            return this.value;
        };

        DynamicProp.prototype.toLookup = function toLookup() {
            var symbol = _glimmerUtil.intern('@' + this.name);
            var lookup = GetNamedParameter.build(symbol);
            return { syntax: DynamicProp.build(this.name, lookup), symbol: symbol };
        };

        return DynamicProp;
    })(_syntax.AttributeSyntax);

    exports.DynamicProp = DynamicProp;

    var StaticAttr = (function (_AttributeSyntax2) {
        _inherits(StaticAttr, _AttributeSyntax2);

        function StaticAttr(options) {
            _classCallCheck(this, StaticAttr);

            _AttributeSyntax2.call(this);
            this["e1185d30-7cac-4b12-b26a-35327d905d92"] = true;
            this.type = "static-attr";
            this.name = options.name;
            this.value = options.value;
            this.namespace = options.namespace;
        }

        StaticAttr.fromSpec = function fromSpec(node) {
            var name = node[1];
            var value = node[2];
            var namespace = node[3];

            return new StaticAttr({ name: name, value: value, namespace: namespace });
        };

        StaticAttr.build = function build(name, value) {
            var namespace = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

            return new this({ name: _glimmerUtil.intern(name), value: _glimmerUtil.intern(value), namespace: namespace && _glimmerUtil.intern(namespace) });
        };

        StaticAttr.prototype.prettyPrint = function prettyPrint() {
            var name = this.name;
            var value = this.value;
            var namespace = this.namespace;

            if (namespace) {
                return new _syntax.PrettyPrint('attr', 'attr', [name, value], { namespace: namespace });
            } else {
                return new _syntax.PrettyPrint('attr', 'attr', [name, value]);
            }
        };

        StaticAttr.prototype.compile = function compile(compiler) {
            compiler.append(new _compiledOpcodesDom.StaticAttrOpcode(this));
        };

        StaticAttr.prototype.valueSyntax = function valueSyntax() {
            return Value.build(this.value);
        };

        StaticAttr.prototype.toLookup = function toLookup() {
            var symbol = _glimmerUtil.intern('@' + this.name);
            var lookup = GetNamedParameter.build(symbol);
            return { syntax: DynamicAttr.build(this.name, lookup, this.namespace), symbol: symbol };
        };

        return StaticAttr;
    })(_syntax.AttributeSyntax);

    exports.StaticAttr = StaticAttr;

    var DynamicAttr = (function (_AttributeSyntax3) {
        _inherits(DynamicAttr, _AttributeSyntax3);

        function DynamicAttr(options) {
            _classCallCheck(this, DynamicAttr);

            _AttributeSyntax3.call(this);
            this["e1185d30-7cac-4b12-b26a-35327d905d92"] = true;
            this.type = "dynamic-attr";
            this.name = options.name;
            this.value = options.value;
            this.namespace = options.namespace;
        }

        DynamicAttr.fromSpec = function fromSpec(sexp) {
            var name = sexp[1];
            var value = sexp[2];
            var namespace = sexp[3];

            return new DynamicAttr({
                name: name,
                namespace: namespace,
                value: buildExpression(value)
            });
        };

        DynamicAttr.build = function build(_name, value) {
            var _namespace = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

            var name = _glimmerUtil.intern(_name);
            var namespace = _namespace ? _glimmerUtil.intern(_namespace) : null;
            return new this({ name: name, value: value, namespace: namespace });
        };

        DynamicAttr.prototype.prettyPrint = function prettyPrint() {
            var name = this.name;
            var value = this.value;
            var namespace = this.namespace;

            if (namespace) {
                return new _syntax.PrettyPrint('attr', 'attr', [name, value.prettyPrint()], { namespace: namespace });
            } else {
                return new _syntax.PrettyPrint('attr', 'attr', [name, value.prettyPrint()]);
            }
        };

        DynamicAttr.prototype.compile = function compile(compiler) {
            compiler.append(new _compiledOpcodesVm.PutValue(this.value.compile(compiler)));
            compiler.append(new _compiledOpcodesDom.DynamicAttrOpcode(this));
        };

        DynamicAttr.prototype.valueSyntax = function valueSyntax() {
            return this.value;
        };

        DynamicAttr.prototype.toLookup = function toLookup() {
            var symbol = _glimmerUtil.intern('@' + this.name);
            var lookup = GetNamedParameter.build(symbol);
            return { syntax: DynamicAttr.build(this.name, lookup, this.namespace), symbol: symbol };
        };

        return DynamicAttr;
    })(_syntax.AttributeSyntax);

    exports.DynamicAttr = DynamicAttr;

    var AddClass = (function (_AttributeSyntax4) {
        _inherits(AddClass, _AttributeSyntax4);

        function AddClass(_ref2) {
            var value = _ref2.value;

            _classCallCheck(this, AddClass);

            _AttributeSyntax4.call(this);
            this["e1185d30-7cac-4b12-b26a-35327d905d92"] = true;
            this.type = "add-class";
            this.name = "class";
            this.value = value;
        }

        AddClass.fromSpec = function fromSpec(node) {
            var value = node[1];

            return new AddClass({ value: buildExpression(value) });
        };

        AddClass.build = function build(value) {
            return new this({ value: value });
        };

        AddClass.prototype.prettyPrint = function prettyPrint() {
            return new _syntax.PrettyPrint('attr', 'attr', ['class', this.value.prettyPrint()]);
        };

        AddClass.prototype.compile = function compile(compiler) {
            compiler.append(new _compiledOpcodesVm.PutValue(this.value.compile(compiler)));
            compiler.append(new _compiledOpcodesDom.AddClassOpcode());
        };

        AddClass.prototype.valueSyntax = function valueSyntax() {
            return this.value;
        };

        AddClass.prototype.toLookup = function toLookup() {
            var symbol = _glimmerUtil.intern('@' + this.name);
            var lookup = GetNamedParameter.build(name);
            return { syntax: AddClass.build(lookup), symbol: symbol };
        };

        return AddClass;
    })(_syntax.AttributeSyntax);

    exports.AddClass = AddClass;

    var CloseElement = (function (_StatementSyntax3) {
        _inherits(CloseElement, _StatementSyntax3);

        function CloseElement() {
            _classCallCheck(this, CloseElement);

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            _StatementSyntax3.call.apply(_StatementSyntax3, [this].concat(args));
            this.type = "close-element";
        }

        CloseElement.fromSpec = function fromSpec() {
            return new CloseElement();
        };

        CloseElement.build = function build() {
            return new this();
        };

        CloseElement.prototype.prettyPrint = function prettyPrint() {
            return new _syntax.PrettyPrint('element', 'close-element');
        };

        CloseElement.prototype.compile = function compile(compiler) {
            compiler.append(new _compiledOpcodesDom.CloseElementOpcode());
        };

        return CloseElement;
    })(_syntax.StatementSyntax);

    exports.CloseElement = CloseElement;

    var Text = (function (_StatementSyntax4) {
        _inherits(Text, _StatementSyntax4);

        function Text(options) {
            _classCallCheck(this, Text);

            _StatementSyntax4.call(this);
            this.type = "text";
            this.content = options.content;
        }

        Text.fromSpec = function fromSpec(node) {
            var content = node[1];

            return new Text({ content: content });
        };

        Text.build = function build(content) {
            return new this({ content: content });
        };

        Text.prototype.prettyPrint = function prettyPrint() {
            return new _syntax.PrettyPrint('append', 'text', [this.content]);
        };

        Text.prototype.compile = function compile(compiler) {
            compiler.append(new _compiledOpcodesDom.TextOpcode(this.content));
        };

        return Text;
    })(_syntax.StatementSyntax);

    exports.Text = Text;

    var Comment = (function (_StatementSyntax5) {
        _inherits(Comment, _StatementSyntax5);

        function Comment(options) {
            _classCallCheck(this, Comment);

            _StatementSyntax5.call(this);
            this.type = "comment";
            this.value = options.value;
        }

        Comment.fromSpec = function fromSpec(sexp) {
            var value = sexp[1];

            return new Comment({ value: value });
        };

        Comment.build = function build(value) {
            return new this({ value: _glimmerUtil.intern(value) });
        };

        Comment.prototype.prettyPrint = function prettyPrint() {
            return new _syntax.PrettyPrint('append', 'append-comment', [this.value]);
        };

        Comment.prototype.compile = function compile(compiler) {
            compiler.append(new _compiledOpcodesDom.CommentOpcode(this));
        };

        return Comment;
    })(_syntax.StatementSyntax);

    exports.Comment = Comment;

    var OpenElement = (function (_StatementSyntax6) {
        _inherits(OpenElement, _StatementSyntax6);

        function OpenElement(options) {
            _classCallCheck(this, OpenElement);

            _StatementSyntax6.call(this);
            this.type = "open-element";
            this.tag = options.tag;
            this.blockParams = options.blockParams;
        }

        OpenElement.fromSpec = function fromSpec(sexp) {
            var tag = sexp[1];
            var blockParams = sexp[2];

            return new OpenElement({ tag: tag, blockParams: blockParams });
        };

        OpenElement.build = function build(tag, blockParams) {
            return new this({ tag: _glimmerUtil.intern(tag), blockParams: blockParams && blockParams.map(_glimmerUtil.intern) });
        };

        OpenElement.prototype.prettyPrint = function prettyPrint() {
            var params = new _syntax.PrettyPrint('block-params', 'as', this.blockParams);
            return new _syntax.PrettyPrint('element', 'open-element', [this.tag, params]);
        };

        OpenElement.prototype.compile = function compile(compiler, env) {
            var component = env.getComponentDefinition([this.tag], this);
            if (component) {
                var attrs = compiler.sliceAttributes();
                var namedArgs = Args.fromHash(attributesToNamedArgs(attrs));
                var lookup = attributeInvocationToLookup(attrs, namedArgs);
                var template = compiler.templateFromTagContents();
                var templates = new Templates({ template: template, inverse: null });
                compiler.append(new _compiledOpcodesComponent.OpenComponentOpcode(component.compile(lookup, templates), namedArgs.compile(compiler)));
            } else {
                compiler.append(new _compiledOpcodesDom.OpenPrimitiveElementOpcode(this.tag));
            }
        };

        OpenElement.prototype.toIdentity = function toIdentity() {
            var tag = this.tag;

            return new OpenPrimitiveElement({ tag: tag });
        };

        return OpenElement;
    })(_syntax.StatementSyntax);

    exports.OpenElement = OpenElement;

    function attributesToNamedArgs(attrs) {
        var map = _glimmerUtil.dict();
        attrs.forEachNode(function (a) {
            map['@' + a.name] = a.valueSyntax();
        });
        return NamedArgs.build(map);
    }
    function attributeInvocationToLookup(attrs, namedArgs) {
        var builder = new _glimmerUtil.LinkedList();
        var symbols = _glimmerUtil.dict();
        attrs.forEachNode(function (a) {
            var _a$toLookup = a.toLookup();

            var syntax = _a$toLookup.syntax;
            var symbol = _a$toLookup.symbol;

            builder.append(syntax);
            symbols[symbol] = true;
        });
        return {
            args: namedArgs,
            syntax: builder,
            locals: null,
            named: Object.keys(symbols)
        };
    }

    var OpenPrimitiveElement = (function (_StatementSyntax7) {
        _inherits(OpenPrimitiveElement, _StatementSyntax7);

        function OpenPrimitiveElement(options) {
            _classCallCheck(this, OpenPrimitiveElement);

            _StatementSyntax7.call(this);
            this.type = "open-primitive-element";
            this.tag = options.tag;
        }

        OpenPrimitiveElement.build = function build(tag) {
            return new this({ tag: _glimmerUtil.intern(tag) });
        };

        OpenPrimitiveElement.prototype.prettyPrint = function prettyPrint() {
            return new _syntax.PrettyPrint('element', 'open-element', [this.tag]);
        };

        OpenPrimitiveElement.prototype.compile = function compile(compiler) {
            compiler.append(new _compiledOpcodesDom.OpenPrimitiveElementOpcode(this.tag));
        };

        return OpenPrimitiveElement;
    })(_syntax.StatementSyntax);

    exports.OpenPrimitiveElement = OpenPrimitiveElement;

    var YieldSyntax = (function (_StatementSyntax8) {
        _inherits(YieldSyntax, _StatementSyntax8);

        function YieldSyntax(_ref3) {
            var args = _ref3.args;

            _classCallCheck(this, YieldSyntax);

            _StatementSyntax8.call(this);
            this.type = "yield";
            this.isStatic = false;
            this.args = args;
        }

        YieldSyntax.prototype.compile = function compile(compiler) {
            compiler.append(new InvokeBlockOpcode());
        };

        return YieldSyntax;
    })(_syntax.StatementSyntax);

    exports.YieldSyntax = YieldSyntax;

    var InvokeBlockOpcode = (function (_Opcode) {
        _inherits(InvokeBlockOpcode, _Opcode);

        function InvokeBlockOpcode() {
            _classCallCheck(this, InvokeBlockOpcode);

            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            _Opcode.call.apply(_Opcode, [this].concat(args));
            this.type = "invoke-block";
        }

        InvokeBlockOpcode.prototype.evaluate = function evaluate(vm) {
            vm.invokeTemplate('default');
        };

        return InvokeBlockOpcode;
    })(_opcodes.Opcode);

    var Value = (function (_ExpressionSyntax2) {
        _inherits(Value, _ExpressionSyntax2);

        function Value(value) {
            _classCallCheck(this, Value);

            _ExpressionSyntax2.call(this);
            this.type = "value";
            this.value = value;
        }

        Value.fromSpec = function fromSpec(value) {
            return new Value(value);
        };

        Value.build = function build(value) {
            return new this(value);
        };

        Value.prototype.prettyPrint = function prettyPrint() {
            return String(this.value);
        };

        Value.prototype.inner = function inner() {
            return this.value;
        };

        Value.prototype.compile = function compile(compiler) {
            return new _compiledExpressionsValue.default(this);
        };

        return Value;
    })(_syntax.ExpressionSyntax);

    exports.Value = Value;

    var Get = (function (_ExpressionSyntax3) {
        _inherits(Get, _ExpressionSyntax3);

        function Get(options) {
            _classCallCheck(this, Get);

            _ExpressionSyntax3.call(this);
            this.type = "get";
            this.ref = options.ref;
        }

        Get.fromSpec = function fromSpec(sexp) {
            var parts = sexp[1];

            return new Get({ ref: new Ref({ parts: parts }) });
        };

        Get.build = function build(path) {
            return new this({ ref: Ref.build(path) });
        };

        Get.prototype.prettyPrint = function prettyPrint() {
            return new _syntax.PrettyPrint('expr', 'get', [this.ref.prettyPrint()], null);
        };

        Get.prototype.compile = function compile(compiler) {
            return this.ref.compile(compiler);
        };

        return Get;
    })(_syntax.ExpressionSyntax);

    exports.Get = Get;

    var GetNamedParameter = (function (_ExpressionSyntax4) {
        _inherits(GetNamedParameter, _ExpressionSyntax4);

        function GetNamedParameter(options) {
            _classCallCheck(this, GetNamedParameter);

            _ExpressionSyntax4.call(this);
            this.type = "get";
            this.parts = options.parts;
        }

        // intern paths because they will be used as keys

        GetNamedParameter.fromSpec = function fromSpec(sexp) {
            var parts = sexp[1];

            return new GetNamedParameter({ parts: parts });
        };

        GetNamedParameter.build = function build(path) {
            return new this({ parts: path.split('.').map(_glimmerUtil.intern) });
        };

        GetNamedParameter.prototype.prettyPrint = function prettyPrint() {
            return new _syntax.PrettyPrint('expr', 'get-named', [this.parts.join('.')], null);
        };

        GetNamedParameter.prototype.compile = function compile(compiler) {
            var parts = this.parts;

            var front = parts[0];
            var symbol = compiler.getSymbol(front);
            var lookup = parts.slice(1);
            return new _compiledExpressionsRef.CompiledLocalRef({ symbol: symbol, lookup: lookup });
        };

        return GetNamedParameter;
    })(_syntax.ExpressionSyntax);

    exports.GetNamedParameter = GetNamedParameter;
    function internPath(path) {
        return path.split('.').map(_glimmerUtil.intern);
    }
    // this is separated out from Get because Unknown also has a ref, but it
    // may turn out to be a helper

    var Ref = (function (_ExpressionSyntax5) {
        _inherits(Ref, _ExpressionSyntax5);

        function Ref(_ref4) {
            var parts = _ref4.parts;

            _classCallCheck(this, Ref);

            _ExpressionSyntax5.call(this);
            this.type = "ref";
            this.parts = parts;
        }

        Ref.build = function build(path) {
            return new this({ parts: internPath(path) });
        };

        Ref.prototype.prettyPrint = function prettyPrint() {
            return this.parts.join('.');
        };

        Ref.prototype.compile = function compile(compiler) {
            var parts = this.parts;

            var front = parts[0];
            var symbol = compiler.getSymbol(front);
            if (symbol) {
                var lookup = parts.slice(1);
                return new _compiledExpressionsRef.CompiledLocalRef({ symbol: symbol, lookup: lookup });
            } else {
                return new _compiledExpressionsRef.CompiledSelfRef({ parts: parts });
            }
        };

        Ref.prototype.path = function path() {
            return this.parts;
        };

        Ref.prototype.simplePath = function simplePath() {
            if (this.parts.length === 1) {
                return this.parts[0];
            }
        };

        return Ref;
    })(_syntax.ExpressionSyntax);

    var Helper = (function (_ExpressionSyntax6) {
        _inherits(Helper, _ExpressionSyntax6);

        function Helper(options) {
            _classCallCheck(this, Helper);

            _ExpressionSyntax6.call(this);
            this.type = "helper";
            this.isStatic = false;
            this.ref = options.ref;
            this.args = options.args;
        }

        Helper.fromSpec = function fromSpec(sexp) {
            var path = sexp[1];
            var params = sexp[2];
            var hash = sexp[3];

            return new Helper({
                ref: new Ref({ parts: path }),
                args: Args.fromSpec(params, hash)
            });
        };

        Helper.build = function build(path, positional, named) {
            return new this({ ref: Ref.build(path), args: new Args({ positional: positional, named: named }) });
        };

        Helper.prototype.prettyPrint = function prettyPrint() {
            var _args$prettyPrint = this.args.prettyPrint();

            var params = _args$prettyPrint[0];
            var hash = _args$prettyPrint[1];

            return new _syntax.PrettyPrint('expr', this.ref.prettyPrint(), params, hash);
        };

        Helper.prototype.compile = function compile(compiler) {
            if (compiler.env.hasHelper(this.ref.parts)) {
                var args = this.args;
                var ref = this.ref;

                return new _compiledExpressionsHelper.default({ helper: compiler.env.lookupHelper(ref.parts), args: args.compile(compiler) });
            } else {
                throw new Error('Compile Error: ' + this.ref.prettyPrint() + ' is not a helper');
            }
        };

        Helper.prototype.simplePath = function simplePath() {
            return this.ref.simplePath();
        };

        return Helper;
    })(_syntax.ExpressionSyntax);

    exports.Helper = Helper;

    var Concat = (function (_Syntax) {
        _inherits(Concat, _Syntax);

        function Concat(_ref5) {
            var parts = _ref5.parts;

            _classCallCheck(this, Concat);

            _Syntax.call(this);
            this.type = "concat";
            this.isStatic = false;
            this.parts = parts;
        }

        Concat.fromSpec = function fromSpec(sexp) {
            var params = sexp[1];

            return new Concat({ parts: params.map(buildExpression) });
        };

        Concat.build = function build(parts) {
            return new this({ parts: parts });
        };

        Concat.prototype.prettyPrint = function prettyPrint() {
            return new _syntax.PrettyPrint('expr', 'concat', this.parts.map(function (p) {
                return p.prettyPrint();
            }));
        };

        Concat.prototype.compile = function compile(compiler) {
            return new _compiledExpressionsConcat.default({ parts: this.parts.map(function (p) {
                    return p.compile(compiler);
                }) });
        };

        return Concat;
    })(_syntax.default);

    exports.Concat = Concat;

    var ExpressionNodes = {
        get: Get,
        attr: GetNamedParameter,
        unknown: Unknown,
        helper: Helper,
        concat: Concat
    };
    function buildExpression(spec) {
        if (typeof spec !== 'object' || spec === null) {
            return Value.fromSpec(spec);
        } else {
            return ExpressionNodes[spec[0]].fromSpec(spec);
        }
    }

    var Args = (function (_Syntax2) {
        _inherits(Args, _Syntax2);

        function Args(options) {
            _classCallCheck(this, Args);

            _Syntax2.call(this);
            this.type = "args";
            this.isStatic = false;
            this.positional = options.positional;
            this.named = options.named;
        }

        Args.fromSpec = function fromSpec(positional, named) {
            return new Args({ positional: PositionalArgs.fromSpec(positional), named: NamedArgs.fromSpec(named) });
        };

        Args.empty = function empty() {
            return this._empty = this._empty || new Args({ positional: PositionalArgs.empty(), named: NamedArgs.empty() });
        };

        Args.fromPositionalArgs = function fromPositionalArgs(positional) {
            return new Args({ positional: positional, named: NamedArgs.empty() });
        };

        Args.fromHash = function fromHash(named) {
            return new Args({ positional: PositionalArgs.empty(), named: named });
        };

        Args.build = function build(positional, named) {
            return new this({ positional: positional, named: named });
        };

        Args.prototype.prettyPrint = function prettyPrint() {
            // return [this.positional.prettyPrint(), this.named.prettyPrint()];
            return null;
        };

        Args.prototype.compile = function compile(compiler) {
            var positional = this.positional;
            var named = this.named;

            return _compiledExpressionsArgs.CompiledArgs.create({ positional: positional.compile(compiler), named: named.compile(compiler) });
        };

        return Args;
    })(_syntax.default);

    exports.Args = Args;

    var PositionalArgs = (function (_Syntax3) {
        _inherits(PositionalArgs, _Syntax3);

        function PositionalArgs(exprs) {
            _classCallCheck(this, PositionalArgs);

            _Syntax3.call(this);
            this.type = "positional";
            this.isStatic = false;
            this.values = exprs;
            this.length = exprs.length;
        }

        PositionalArgs.fromSpec = function fromSpec(sexp) {
            if (!sexp || sexp.length === 0) return PositionalArgs.empty();
            return new PositionalArgs(sexp.map(buildExpression));
        };

        PositionalArgs.build = function build(exprs) {
            return new this(exprs);
        };

        PositionalArgs.empty = function empty() {
            return this._empty = this._empty || new PositionalArgs([]);
        };

        PositionalArgs.prototype.push = function push(expr) {
            this.values.push(expr);
            this.length = this.values.length;
        };

        PositionalArgs.prototype.at = function at(index) {
            return this.values[index];
        };

        PositionalArgs.prototype.compile = function compile(compiler) {
            return _compiledExpressionsArgs.CompiledPositionalArgs.create({ values: this.values.map(function (v) {
                    return v.compile(compiler);
                }) });
        };

        PositionalArgs.prototype.prettyPrint = function prettyPrint() {
            return this.values.map(function (p) {
                return p.prettyPrint();
            });
        };

        return PositionalArgs;
    })(_syntax.default);

    exports.PositionalArgs = PositionalArgs;

    var NamedArgs = (function (_Syntax4) {
        _inherits(NamedArgs, _Syntax4);

        function NamedArgs(_ref6) {
            var keys = _ref6.keys;
            var values = _ref6.values;
            var map = _ref6.map;

            _classCallCheck(this, NamedArgs);

            _Syntax4.call(this);
            this.type = "named";
            this.isStatic = false;
            this.keys = keys;
            this.values = values;
            this.map = map;
        }

        NamedArgs.fromSpec = function fromSpec(rawPairs) {
            if (!rawPairs) {
                return NamedArgs.empty();
            }
            var keys = [];
            var values = [];
            var map = _glimmerUtil.dict();
            for (var i = 0, l = rawPairs.length; i < l; i += 2) {
                var key = rawPairs[i];
                var expr = rawPairs[i + 1];
                keys.push(key);
                var value = buildExpression(expr);
                values.push(value);
                map[key] = value;
            }
            return new NamedArgs({ keys: keys, values: values, map: map });
        };

        NamedArgs.build = function build(map) {
            if (map === undefined) {
                return NamedArgs.empty();
            }
            var keys = [];
            var values = [];
            Object.keys(map).forEach(function (key) {
                keys.push(key);
                values.push(map[key]);
            });
            return new this({ keys: keys, values: values, map: map });
        };

        NamedArgs.empty = function empty() {
            return this._empty = this._empty || new NamedArgs({ keys: EMPTY_ARRAY, values: EMPTY_ARRAY, map: _glimmerUtil.dict() });
        };

        NamedArgs.prototype.prettyPrint = function prettyPrint() {
            var _this = this;

            var out = _glimmerUtil.dict();
            this.keys.forEach(function (key, i) {
                out[key] = _this.values[i].prettyPrint();
            });
            return JSON.stringify(out);
        };

        NamedArgs.prototype.add = function add(key, value) {
            this.keys.push(key);
            this.values.push(value);
            this.map[key] = value;
        };

        NamedArgs.prototype.at = function at(key) {
            return this.map[key];
        };

        NamedArgs.prototype.has = function has(key) {
            return !!this.map[key];
        };

        NamedArgs.prototype.compile = function compile(compiler) {
            var keys = this.keys;
            var rawValues = this.values;

            var values = rawValues.map(function (v) {
                return v.compile(compiler);
            });
            return _compiledExpressionsArgs.CompiledNamedArgs.create({ keys: keys, values: values });
        };

        return NamedArgs;
    })(_syntax.default);

    exports.NamedArgs = NamedArgs;

    var Templates = (function (_Syntax5) {
        _inherits(Templates, _Syntax5);

        function Templates(options) {
            _classCallCheck(this, Templates);

            _Syntax5.call(this);
            this.type = "templates";
            this.default = options.template;
            this.inverse = options.inverse;
        }

        Templates.fromSpec = function fromSpec(_, _ref7) {
            var templateId = _ref7[0];
            var inverseId = _ref7[1];
            var children = _ref7[2];

            return new Templates({
                template: templateId === null ? null : children[templateId],
                inverse: inverseId === null ? null : children[inverseId]
            });
        };

        Templates.build = function build(template) {
            var inverse = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
            var attributes = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

            return new this({ template: template, inverse: inverse });
        };

        Templates.prototype.prettyPrint = function prettyPrint() {
            var _default = this.default;
            var inverse = this.inverse;

            return JSON.stringify({
                default: _default && _default.position,
                inverse: inverse && inverse.position
            });
        };

        Templates.prototype.evaluate = function evaluate(vm) {
            throw new Error("unimplemented evaluate for ExpressionSyntax");
        };

        return Templates;
    })(_syntax.default);

    exports.Templates = Templates;
});

enifed('glimmer-runtime/lib/syntax/statements', ['exports', './core'], function (exports, _core) {
    'use strict';

    // these are all constructors, indexed by statement type

    exports.default = function (name) {
        switch (name) {
            case 'block':
                return _core.Block;
            case 'append':
                return _core.Append;
            case 'dynamicAttr':
                return _core.DynamicAttr;
            case 'dynamicProp':
                return _core.DynamicProp;
            case 'addClass':
                return _core.AddClass;
            case 'text':
                return _core.Text;
            case 'comment':
                return _core.Comment;
            case 'openElement':
                return _core.OpenElement;
            case 'closeElement':
                return _core.CloseElement;
            case 'staticAttr':
                return _core.StaticAttr;
        }
    };

    ;
});

enifed("glimmer-runtime/lib/syntax", ["exports"], function (exports) {
    "use strict";

    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    var PrettyPrint = function PrettyPrint(type, operation) {
        var params = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
        var hash = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
        var templates = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

        _classCallCheck(this, PrettyPrint);

        this.type = type;
        this.operation = operation;
        this.params = params;
        this.hash = hash;
        this.templates = templates;
    };

    exports.PrettyPrint = PrettyPrint;

    var Syntax = (function () {
        function Syntax() {
            _classCallCheck(this, Syntax);

            this.next = null;
            this.prev = null;
        }

        Syntax.fromSpec = function fromSpec(spec, templates) {
            throw new Error("You need to implement fromSpec on " + this);
        };

        Syntax.prototype.prettyPrint = function prettyPrint() {
            return "<" + this.type + ">";
        };

        return Syntax;
    })();

    exports.default = Syntax;

    var StatementSyntax = (function (_Syntax) {
        _inherits(StatementSyntax, _Syntax);

        function StatementSyntax() {
            _classCallCheck(this, StatementSyntax);

            _Syntax.apply(this, arguments);
        }

        StatementSyntax.fromSpec = function fromSpec(spec, templates) {
            throw new Error("You need to implement fromSpec on " + this);
        };

        StatementSyntax.prototype.prettyPrint = function prettyPrint() {
            return new PrettyPrint(this.type, this.type);
        };

        StatementSyntax.prototype.clone = function clone() {
            // not type safe but the alternative is extreme boilerplate per
            // syntax subclass.
            return new this.constructor(this);
        };

        return StatementSyntax;
    })(Syntax);

    exports.StatementSyntax = StatementSyntax;
    var ATTRIBUTE_SYNTAX = "e1185d30-7cac-4b12-b26a-35327d905d92";
    exports.ATTRIBUTE_SYNTAX = ATTRIBUTE_SYNTAX;

    var AttributeSyntax = (function (_StatementSyntax) {
        _inherits(AttributeSyntax, _StatementSyntax);

        function AttributeSyntax() {
            _classCallCheck(this, AttributeSyntax);

            _StatementSyntax.apply(this, arguments);
        }

        return AttributeSyntax;
    })(StatementSyntax);

    exports.AttributeSyntax = AttributeSyntax;

    var ExpressionSyntax = (function (_Syntax2) {
        _inherits(ExpressionSyntax, _Syntax2);

        function ExpressionSyntax() {
            _classCallCheck(this, ExpressionSyntax);

            _Syntax2.apply(this, arguments);
        }

        ExpressionSyntax.prototype.prettyPrint = function prettyPrint() {
            return "" + this.type;
        };

        return ExpressionSyntax;
    })(Syntax);

    exports.ExpressionSyntax = ExpressionSyntax;
});

enifed('glimmer-runtime/lib/template', ['exports', 'glimmer-util', 'glimmer-reference', './compiler', './builder', './vm', './scanner'], function (exports, _glimmerUtil, _glimmerReference, _compiler, _builder, _vm, _scanner) {
    'use strict';

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var Template = (function () {
        function Template(_ref) {
            var meta = _ref.meta;
            var children = _ref.children;
            var root = _ref.root;
            var position = _ref.position;
            var locals = _ref.locals;
            var named = _ref.named;
            var program = _ref.program;
            var spec = _ref.spec;
            var isEmpty = _ref.isEmpty;

            _classCallCheck(this, Template);

            this.meta = meta || {};
            this.children = children;
            this.root = root || null;
            this.position = position === undefined ? null : position;
            this.arity = locals ? locals.length : 0;
            this.raw = new _compiler.RawTemplate({ ops: null, locals: locals, named: named, program: program });
            this.spec = spec || null;
            this.isEmpty = isEmpty === true ? isEmpty : program.isEmpty();
            Object.seal(this);
        }

        Template.fromSpec = function fromSpec(specs) {
            var scanner = new _scanner.default(specs);
            return scanner.scan();
        };

        Template.fromList = function fromList(program) {
            return new Template({
                program: program,
                root: null,
                position: null,
                meta: null,
                locals: null,
                isEmpty: program.isEmpty(),
                spec: null
            });
        };

        Template.fromStatements = function fromStatements(statements) {
            var program = new _glimmerUtil.LinkedList();
            statements.forEach(function (s) {
                return program.append(s);
            });
            return new Template({
                program: program,
                root: null,
                position: null,
                meta: null,
                locals: null,
                isEmpty: statements.length === 0,
                spec: null
            });
        };

        Template.prototype.prettyPrint = function prettyPrint() {
            function pretty(obj) {
                if (typeof obj.prettyPrint === 'function') return obj.prettyPrint();else throw new Error('Cannot pretty print ' + obj.constructor.name);
            }
            return this.root.map(function (template) {
                return template.raw.program.toArray().map(function (statement) {
                    return pretty(statement);
                });
            });
        };

        Template.prototype.render = function render(self, env, options) {
            var blockArguments = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

            var elementStack = new _builder.ElementStack({ dom: env.getDOM(), parentNode: options.appendTo, nextSibling: null });
            var vm = _vm.default.initial(env, { self: new _glimmerReference.UpdatableReference(self), elementStack: elementStack, size: this.raw.symbolTable.size });
            this.raw.compile(env);
            return vm.execute(this.raw.ops);
        };

        return Template;
    })();

    exports.default = Template;
});

enifed('glimmer-runtime/lib/utils', ['exports', 'glimmer-util'], function (exports, _glimmerUtil) {
    'use strict';

    exports.symbol = symbol;
    exports.turbocharge = turbocharge;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var EMPTY_ARRAY = [];
    exports.EMPTY_ARRAY = EMPTY_ARRAY;
    var EMPTY_OBJECT = {};
    exports.EMPTY_OBJECT = EMPTY_OBJECT;
    var KEY = _glimmerUtil.intern('__glimmer' + +new Date());

    function symbol(debugName) {
        var num = Math.floor(Math.random() * +new Date());
        return _glimmerUtil.intern(debugName + ' [id=' + KEY + num + ']');
    }

    function turbocharge(object) {
        function Constructor() {}
        Constructor.prototype = object;
        return object;
    }

    var ListRange = (function () {
        function ListRange(list, start, end) {
            _classCallCheck(this, ListRange);

            this.list = list;
            this.start = start;
            this.end = end;
        }

        ListRange.prototype.at = function at(index) {
            if (index >= this.list.length) return null;
            return this.list[index];
        };

        ListRange.prototype.min = function min() {
            return this.start;
        };

        ListRange.prototype.max = function max() {
            return this.end;
        };

        return ListRange;
    })();

    exports.ListRange = ListRange;
});

enifed('glimmer-runtime/lib/vm', ['exports', './bounds', './builder', 'glimmer-util', 'glimmer-reference', './compiled/expressions/args'], function (exports, _bounds, _builder, _glimmerUtil, _glimmerReference, _compiledExpressionsArgs) {
    'use strict';

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var VM = (function () {
        function VM(env, scope, elementStack) {
            _classCallCheck(this, VM);

            this.scopeStack = new _glimmerUtil.Stack();
            this.updatingOpcodeStack = new _glimmerUtil.Stack();
            this.listBlockStack = new _glimmerUtil.Stack();
            this.frame = new FrameStack();
            this.env = env;
            this.elementStack = elementStack;
            this.scopeStack.push(scope);
        }

        VM.initial = function initial(env, _ref) {
            var elementStack = _ref.elementStack;
            var self = _ref.self;
            var size = _ref.size;

            var scope = env.createRootScope(size).init({ self: self });
            return new VM(env, scope, elementStack);
        };

        VM.prototype.goto = function goto(op) {
            this.frame.goto(op);
        };

        VM.prototype.enter = function enter(ops) {
            this.stack().openBlock();
            var updating = new _glimmerUtil.LinkedList();
            var tryOpcode = new TryOpcode({ ops: ops, vm: this, updating: updating });
            this.didEnter(tryOpcode, updating);
        };

        VM.prototype.enterWithKey = function enterWithKey(key, ops) {
            this.stack().openBlock();
            var updating = new _glimmerUtil.LinkedList();
            var tryOpcode = new TryOpcode({ ops: ops, vm: this, updating: updating });
            this.listBlockStack.current.map[key] = tryOpcode;
            this.didEnter(tryOpcode, updating);
        };

        VM.prototype.enterList = function enterList(manager, ops) {
            var updating = new _glimmerUtil.LinkedList();
            this.stack().openBlockList(updating);
            var opcode = new ListBlockOpcode({ ops: ops, vm: this, updating: updating, manager: manager });
            this.listBlockStack.push(opcode);
            this.didEnter(opcode, updating);
        };

        VM.prototype.didEnter = function didEnter(opcode, updating) {
            this.updateWith(opcode);
            this.updatingOpcodeStack.push(updating);
        };

        VM.prototype.exit = function exit() {
            this.stack().closeBlock();
            this.updatingOpcodeStack.pop();
        };

        VM.prototype.exitList = function exitList() {
            this.exit();
            this.listBlockStack.pop();
        };

        VM.prototype.updateWith = function updateWith(opcode) {
            this.updatingOpcodeStack.current.insertBefore(opcode, null);
        };

        VM.prototype.stack = function stack() {
            return this.elementStack;
        };

        VM.prototype.scope = function scope() {
            return this.scopeStack.current;
        };

        VM.prototype.pushFrame = function pushFrame(ops, args, templates, frameDidPop) {
            this.frame.push(ops);
            if (args) this.frame.setArgs(args);
            if (templates) this.frame.setTemplates(templates);
            if (frameDidPop) this.frame.setPopHandler(frameDidPop);
        };

        VM.prototype.popFrame = function popFrame() {
            var frame = this.frame;

            frame.pop();
            var current = frame.getCurrent();
            if (current === null) return;
        };

        VM.prototype.pushChildScope = function pushChildScope() {
            this.scopeStack.push(this.scopeStack.current.child());
        };

        VM.prototype.popScope = function popScope() {
            this.scopeStack.pop();
        };

        /// SCOPE HELPERS

        VM.prototype.getSelf = function getSelf() {
            return this.scope().getSelf();
        };

        VM.prototype.referenceForSymbol = function referenceForSymbol(symbol) {
            return this.scope().getSymbol(symbol);
        };

        /// EXECUTION

        VM.prototype.execute = function execute(opcodes, initialize) {
            var elementStack = this.elementStack;
            var frame = this.frame;
            var updatingOpcodeStack = this.updatingOpcodeStack;
            var env = this.env;

            var self = this.scope().getSelf();
            elementStack.openBlock();
            updatingOpcodeStack.push(new _glimmerUtil.LinkedList());
            frame.push(opcodes);
            if (initialize) initialize(this);
            var opcode = undefined;
            while (frame.hasOpcodes()) {
                if (opcode = frame.nextStatement()) opcode.evaluate(this);
            }
            return new RenderResult(updatingOpcodeStack.pop(), elementStack.closeBlock(), env.getDOM(), self);
        };

        VM.prototype.evaluateOpcode = function evaluateOpcode(opcode) {
            opcode.evaluate(this);
        };

        VM.prototype.invoke = function invoke(template, args, templates) {
            this.elementStack.openBlock();
            var evaledArgs = args.evaluate(this);
            template.compile(this.env);
            this.pushFrame(template.ops, evaledArgs, templates, this);
        };

        VM.prototype.frameDidPop = function frameDidPop() {
            this.elementStack.closeBlock();
        };

        VM.prototype.evaluateOperand = function evaluateOperand(expr) {
            this.frame.setOperand(expr.evaluate(this));
        };

        VM.prototype.evaluateArgs = function evaluateArgs(args) {
            var evaledArgs = this.frame.setArgs(args.evaluate(this));
            this.frame.setOperand(evaledArgs.positional.at(0));
        };

        VM.prototype.bindArgs = function bindArgs(positionalParams, namedParams) {
            var args = this.frame.getArgs();
            if (!args) return;
            var positional = args.positional;
            var named = args.named;

            var scope = this.scope();
            if (positionalParams) {
                for (var i = 0; i < positionalParams.length; i++) {
                    var symbol = positionalParams[i];
                    if (symbol !== 0) {
                        scope.bindSymbol(symbol, positional.at(i));
                    }
                }
            }
            if (namedParams) {
                Object.keys(namedParams).forEach(function (p) {
                    scope.bindSymbol(namedParams[p], named.get(p));
                });
            }
        };

        VM.prototype.setTemplates = function setTemplates(templates) {
            this.frame.setTemplates(templates);
        };

        VM.prototype.invokeTemplate = function invokeTemplate(name) {
            var template = this.frame.getTemplates()[name].raw;
            template.compile(this.env);
            this.pushFrame(template.ops);
        };

        return VM;
    })();

    exports.VM = VM;
    exports.default = VM;

    var UpdatingVM = (function () {
        function UpdatingVM(dom) {
            _classCallCheck(this, UpdatingVM);

            this.frameStack = new _glimmerUtil.Stack();
            this.dom = dom;
        }

        UpdatingVM.prototype.execute = function execute(opcodes, handler) {
            var frameStack = this.frameStack;

            this.try(opcodes, handler);
            while (true) {
                if (frameStack.isEmpty()) break;
                var opcode = this.frameStack.current.nextStatement();
                if (opcode === null) {
                    this.frameStack.pop();
                    continue;
                }
                opcode.evaluate(this);
            }
        };

        UpdatingVM.prototype.try = function _try(ops, handler) {
            this.frameStack.push(new UpdatingVMFrame(this, ops, handler));
        };

        UpdatingVM.prototype.throw = function _throw(initialize) {
            this.frameStack.current.handleException(initialize);
        };

        UpdatingVM.prototype.evaluateOpcode = function evaluateOpcode(opcode) {
            opcode.evaluate(this);
        };

        return UpdatingVM;
    })();

    exports.UpdatingVM = UpdatingVM;

    var BlockOpcode = (function () {
        function BlockOpcode(_ref2) {
            var ops = _ref2.ops;
            var vm = _ref2.vm;
            var updating = _ref2.updating;

            _classCallCheck(this, BlockOpcode);

            this.type = "block";
            this.next = null;
            this.prev = null;
            this.ops = ops;
            this.updating = updating;
            this.env = vm.env;
            this.scope = vm.scope();
            this.bounds = vm.stack().block();
        }

        BlockOpcode.prototype.parentElement = function parentElement() {
            return this.bounds.parentElement();
        };

        BlockOpcode.prototype.firstNode = function firstNode() {
            return this.bounds.firstNode();
        };

        BlockOpcode.prototype.lastNode = function lastNode() {
            return this.bounds.lastNode();
        };

        BlockOpcode.prototype.evaluate = function evaluate(vm) {
            vm.try(this.updating, null);
        };

        return BlockOpcode;
    })();

    var TryOpcode = (function (_BlockOpcode) {
        _inherits(TryOpcode, _BlockOpcode);

        function TryOpcode() {
            _classCallCheck(this, TryOpcode);

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            _BlockOpcode.call.apply(_BlockOpcode, [this].concat(args));
            this.type = "try";
        }

        TryOpcode.prototype.evaluate = function evaluate(vm) {
            vm.try(this.updating, this);
        };

        TryOpcode.prototype.handleException = function handleException(initialize) {
            var stack = new _builder.ElementStack({
                dom: this.env.getDOM(),
                parentNode: this.bounds.parentElement(),
                nextSibling: initialize ? this.bounds.lastNode().nextSibling : _bounds.clear(this.bounds)
            });
            var vm = new VM(this.env, this.scope, stack);
            var result = vm.execute(this.ops, initialize);
            if (!initialize) {
                this.updating = result.opcodes();
            }
            this.bounds = result;
        };

        return TryOpcode;
    })(BlockOpcode);

    var ListRevalidationDelegate = (function () {
        function ListRevalidationDelegate(opcode) {
            _classCallCheck(this, ListRevalidationDelegate);

            var map = opcode.map;
            var updating = opcode.updating;

            this.opcode = opcode;
            this.map = map;
            this.updating = updating;
        }

        ListRevalidationDelegate.prototype.insert = function insert(key, item, before) {
            var map = this.map;
            var opcode = this.opcode;
            var updating = this.updating;

            var nextSibling = null;
            var reference = null;
            if (before) {
                reference = map[before];
                nextSibling = reference.bounds.firstNode();
            }
            var vm = opcode.vmForInsertion(nextSibling);
            var tryOpcode = undefined;
            vm.execute(opcode.ops, function (vm) {
                vm.frame.setArgs(_compiledExpressionsArgs.EvaluatedArgs.positional([item]));
                vm.frame.setOperand(item);
                vm.frame.setCondition(new _glimmerReference.ConstReference(true));
                vm.frame.setKey(key);
                tryOpcode = new TryOpcode({
                    vm: vm,
                    ops: opcode.ops,
                    updating: vm.updatingOpcodeStack.current
                });
            });
            updating.insertBefore(tryOpcode, reference);
            map[key] = tryOpcode;
        };

        ListRevalidationDelegate.prototype.retain = function retain(key, item) {};

        ListRevalidationDelegate.prototype.move = function move(key, item, before) {
            var map = this.map;
            var updating = this.updating;

            var entry = map[key];
            var reference = map[before] || null;
            if (before) {
                _bounds.move(entry, reference.firstNode());
            } else {
                _bounds.move(entry, this.opcode.lastNode());
            }
            updating.remove(entry);
            updating.insertBefore(entry, reference);
        };

        ListRevalidationDelegate.prototype.delete = function _delete(key) {
            var map = this.map;

            var opcode = map[key];
            _bounds.clear(opcode);
            this.updating.remove(opcode);
            delete map[key];
        };

        ListRevalidationDelegate.prototype.done = function done() {
            // this.vm.registers.condition = new ConstReference(false);
        };

        return ListRevalidationDelegate;
    })();

    var ListBlockOpcode = (function (_BlockOpcode2) {
        _inherits(ListBlockOpcode, _BlockOpcode2);

        function ListBlockOpcode(options) {
            _classCallCheck(this, ListBlockOpcode);

            _BlockOpcode2.call(this, options);
            this.type = "list-block";
            this.map = _glimmerUtil.dict();
            this.manager = options.manager;
        }

        ListBlockOpcode.prototype.firstNode = function firstNode() {
            var head = this.updating.head();
            if (head) {
                return head.firstNode();
            } else {
                return this.lastNode();
            }
        };

        ListBlockOpcode.prototype.lastNode = function lastNode() {
            return this.bounds.lastNode();
        };

        ListBlockOpcode.prototype.evaluate = function evaluate(vm) {
            // Revalidate list somehow....
            var delegate = new ListRevalidationDelegate(this);
            this.manager.sync(delegate);
            // Run now-updated updating opcodes
            _BlockOpcode2.prototype.evaluate.call(this, vm);
        };

        ListBlockOpcode.prototype.vmForInsertion = function vmForInsertion(nextSibling) {
            var stack = new _builder.ElementStack({
                dom: this.env.getDOM(),
                parentNode: this.bounds.parentElement(),
                nextSibling: nextSibling || this.bounds.lastNode()
            });
            return new VM(this.env, this.scope, stack);
        };

        return ListBlockOpcode;
    })(BlockOpcode);

    var UpdatingVMFrame = (function () {
        function UpdatingVMFrame(vm, ops, handler) {
            _classCallCheck(this, UpdatingVMFrame);

            this.vm = vm;
            this.ops = ops;
            this.current = ops.head();
            this.exceptionHandler = handler;
        }

        UpdatingVMFrame.prototype.nextStatement = function nextStatement() {
            var current = this.current;
            var ops = this.ops;

            if (current) this.current = ops.nextNode(current);
            return current;
        };

        UpdatingVMFrame.prototype.handleException = function handleException(initialize) {
            this.exceptionHandler.handleException(initialize);
        };

        return UpdatingVMFrame;
    })();

    var RenderResult = (function () {
        function RenderResult(updating, bounds, dom, self) {
            _classCallCheck(this, RenderResult);

            this.updating = updating;
            this.bounds = bounds;
            this.dom = dom;
            this.self = self;
        }

        RenderResult.prototype.rerender = function rerender(self) {
            var vm = new UpdatingVM(this.dom);
            if (self !== undefined) {
                this.self.update(self);
            }
            vm.execute(this.updating, this);
        };

        RenderResult.prototype.parentElement = function parentElement() {
            return this.bounds.parentElement();
        };

        RenderResult.prototype.firstNode = function firstNode() {
            return this.bounds.firstNode();
        };

        RenderResult.prototype.lastNode = function lastNode() {
            return this.bounds.lastNode();
        };

        RenderResult.prototype.opcodes = function opcodes() {
            return this.updating;
        };

        RenderResult.prototype.handleException = function handleException() {
            throw "this should never happen";
        };

        return RenderResult;
    })();

    exports.RenderResult = RenderResult;

    var Frame = function Frame(ops) {
        _classCallCheck(this, Frame);

        this.operand = null;
        this.args = null;
        this.condition = null;
        this.iterator = null;
        this.key = null;
        this.templates = null;
        this.popHandler = null;
        this.ops = ops;
        this.op = ops.head();
    };

    var FrameStack = (function () {
        function FrameStack() {
            _classCallCheck(this, FrameStack);

            this.frames = [];
            this.frame = undefined;
        }

        FrameStack.prototype.push = function push(ops) {
            var frame = this.frame === undefined ? this.frame = 0 : ++this.frame;
            if (this.frames.length <= frame) {
                this.frames.push(null);
            }
            this.frames[frame] = new Frame(ops);
        };

        FrameStack.prototype.pop = function pop() {
            var popHandler = this.getPopHandler();
            if (popHandler) popHandler.frameDidPop();
            var frames = this.frames;
            var frame = this.frame;

            frames[frame] = null;
            this.frame = frame === 0 ? undefined : frame - 1;
        };

        FrameStack.prototype.getOps = function getOps() {
            return this.frames[this.frame].ops;
        };

        FrameStack.prototype.getCurrent = function getCurrent() {
            return this.frames[this.frame].op;
        };

        FrameStack.prototype.setCurrent = function setCurrent(op) {
            return this.frames[this.frame].op = op;
        };

        FrameStack.prototype.getOperand = function getOperand() {
            return this.frames[this.frame].operand;
        };

        FrameStack.prototype.setOperand = function setOperand(operand) {
            return this.frames[this.frame].operand = operand;
        };

        FrameStack.prototype.getArgs = function getArgs() {
            return this.frames[this.frame].args;
        };

        FrameStack.prototype.setArgs = function setArgs(args) {
            return this.frames[this.frame].args = args;
        };

        FrameStack.prototype.getCondition = function getCondition() {
            return this.frames[this.frame].condition;
        };

        FrameStack.prototype.setCondition = function setCondition(condition) {
            return this.frames[this.frame].condition = condition;
        };

        FrameStack.prototype.getIterator = function getIterator() {
            return this.frames[this.frame].iterator;
        };

        FrameStack.prototype.setIterator = function setIterator(iterator) {
            return this.frames[this.frame].iterator = iterator;
        };

        FrameStack.prototype.getKey = function getKey() {
            return this.frames[this.frame].key;
        };

        FrameStack.prototype.setKey = function setKey(key) {
            return this.frames[this.frame].key = key;
        };

        FrameStack.prototype.getTemplates = function getTemplates() {
            return this.frames[this.frame].templates;
        };

        FrameStack.prototype.setTemplates = function setTemplates(templates) {
            return this.frames[this.frame].templates = templates;
        };

        FrameStack.prototype.getPopHandler = function getPopHandler() {
            return this.frames[this.frame].popHandler;
        };

        FrameStack.prototype.setPopHandler = function setPopHandler(handler) {
            return this.frames[this.frame].popHandler = handler;
        };

        FrameStack.prototype.goto = function goto(op) {
            this.setCurrent(op);
        };

        FrameStack.prototype.hasOpcodes = function hasOpcodes() {
            return this.frame !== undefined;
        };

        FrameStack.prototype.nextStatement = function nextStatement() {
            var op = this.frames[this.frame].op;
            var ops = this.getOps();
            if (op) {
                this.setCurrent(ops.nextNode(op));
                return op;
            } else {
                this.pop();
                return null;
            }
        };

        return FrameStack;
    })();

    var Slots;
    (function (Slots) {
        Slots[Slots["Ops"] = 0] = "Ops";
        Slots[Slots["Current"] = 1] = "Current";
        Slots[Slots["Operand"] = 2] = "Operand";
        Slots[Slots["Args"] = 3] = "Args";
        Slots[Slots["Condition"] = 4] = "Condition";
        Slots[Slots["Iterator"] = 5] = "Iterator";
        Slots[Slots["Key"] = 6] = "Key";
        Slots[Slots["Templates"] = 7] = "Templates";
    })(Slots || (Slots = {}));
});

enifed('glimmer-syntax/index', ['exports', './lib/syntax', './lib/utils', './lib/parser'], function (exports, _libSyntax, _libUtils, _libParser) {
  'use strict';

  function _interopExportWildcard(obj, defaults) { var newObj = defaults({}, obj); delete newObj['default']; return newObj; }

  function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

  _defaults(exports, _interopExportWildcard(_libSyntax, _defaults));

  exports.isHelper = _libUtils.isHelper;
  exports.preprocess = _libParser.preprocess;
});

enifed("glimmer-syntax/lib/builders", ["exports"], function (exports) {
    // Statements
    "use strict";

    exports.buildMustache = buildMustache;
    exports.buildBlock = buildBlock;
    exports.buildElementModifier = buildElementModifier;
    exports.buildPartial = buildPartial;
    exports.buildComment = buildComment;
    exports.buildConcat = buildConcat;
    exports.buildElement = buildElement;
    exports.buildComponent = buildComponent;
    exports.buildAttr = buildAttr;
    exports.buildText = buildText;
    exports.buildSexpr = buildSexpr;
    exports.buildPath = buildPath;
    exports.buildString = buildString;
    exports.buildBoolean = buildBoolean;
    exports.buildNumber = buildNumber;
    exports.buildNull = buildNull;
    exports.buildUndefined = buildUndefined;
    exports.buildHash = buildHash;
    exports.buildPair = buildPair;
    exports.buildProgram = buildProgram;

    function buildMustache(path, params, hash, raw, loc) {
        return {
            type: "MustacheStatement",
            path: buildPath(path),
            params: params || [],
            hash: hash || buildHash([]),
            escaped: !raw,
            loc: buildLoc(loc)
        };
    }

    function buildBlock(path, params, hash, program, inverse, loc) {
        return {
            type: "BlockStatement",
            path: buildPath(path),
            params: params ? params.map(buildPath) : [],
            hash: hash || buildHash([]),
            program: program || null,
            inverse: inverse || null,
            loc: buildLoc(loc)
        };
    }

    function buildElementModifier(path, params, hash, loc) {
        return {
            type: "ElementModifierStatement",
            path: buildPath(path),
            params: params || [],
            hash: hash || buildHash([]),
            loc: buildLoc(loc)
        };
    }

    function buildPartial(name, params, hash, indent) {
        return {
            type: "PartialStatement",
            name: name,
            params: params || [],
            hash: hash || buildHash([]),
            indent: indent
        };
    }

    function buildComment(value) {
        return {
            type: "CommentStatement",
            value: value
        };
    }

    function buildConcat(parts) {
        return {
            type: "ConcatStatement",
            parts: parts || []
        };
    }

    // Nodes

    function buildElement(tag, attributes, modifiers, children, loc) {
        return {
            type: "ElementNode",
            tag: tag || "",
            attributes: attributes || [],
            blockParams: [],
            modifiers: modifiers || [],
            children: children || [],
            loc: buildLoc(loc)
        };
    }

    function buildComponent(tag, attributes, program, loc) {
        return {
            type: "ComponentNode",
            tag: tag,
            attributes: attributes,
            program: program,
            loc: buildLoc(loc),
            // this should be true only if this component node is guaranteed
            // to produce start and end points that can never change after the
            // initial render, regardless of changes to dynamic inputs. If
            // a component represents a "fragment" (any number of top-level nodes),
            // this will usually not be true.
            isStatic: false
        };
    }

    function buildAttr(name, value) {
        return {
            type: "AttrNode",
            name: name,
            value: value
        };
    }

    function buildText(chars, loc) {
        return {
            type: "TextNode",
            chars: chars || "",
            loc: buildLoc(loc)
        };
    }

    // Expressions

    function buildSexpr(path, params, hash) {
        return {
            type: "SubExpression",
            path: buildPath(path),
            params: params || [],
            hash: hash || buildHash([])
        };
    }

    function buildPath(original) {
        if (typeof original !== 'string') return original;
        return {
            type: "PathExpression",
            original: original,
            parts: original.split('.'),
            data: false
        };
    }

    function buildString(value) {
        return {
            type: "StringLiteral",
            value: value,
            original: value
        };
    }

    function buildBoolean(value) {
        return {
            type: "BooleanLiteral",
            value: value,
            original: value
        };
    }

    function buildNumber(value) {
        return {
            type: "NumberLiteral",
            value: value,
            original: value
        };
    }

    function buildNull() {
        return {
            type: "NullLiteral",
            value: null,
            original: null
        };
    }

    function buildUndefined() {
        return {
            type: "UndefinedLiteral",
            value: undefined,
            original: undefined
        };
    }

    // Miscellaneous

    function buildHash(pairs) {
        return {
            type: "Hash",
            pairs: pairs || []
        };
    }

    function buildPair(key, value) {
        return {
            type: "HashPair",
            key: key,
            value: value
        };
    }

    function buildProgram(body, blockParams, loc) {
        return {
            type: "Program",
            body: body || [],
            blockParams: blockParams || [],
            loc: buildLoc(loc)
        };
    }

    function buildSource(source) {
        return source || null;
    }
    function buildPosition(line, column) {
        return {
            line: typeof line === 'number' ? line : null,
            column: typeof column === 'number' ? column : null
        };
    }
    function buildLoc() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        if (args.length === 1) {
            var loc = args[0];
            if (typeof loc === 'object') {
                return {
                    source: buildSource(loc.source),
                    start: buildPosition(loc.start.line, loc.start.column),
                    end: buildPosition(loc.end.line, loc.end.column)
                };
            } else {
                return null;
            }
        } else {
            var startLine = args[0];
            var startColumn = args[1];
            var endLine = args[2];
            var endColumn = args[3];
            var source = args[4];

            return {
                source: buildSource(source),
                start: buildPosition(startLine, startColumn),
                end: buildPosition(endLine, endColumn)
            };
        }
    }
    exports.default = {
        mustache: buildMustache,
        block: buildBlock,
        partial: buildPartial,
        comment: buildComment,
        element: buildElement,
        elementModifier: buildElementModifier,
        component: buildComponent,
        attr: buildAttr,
        text: buildText,
        sexpr: buildSexpr,
        path: buildPath,
        string: buildString,
        boolean: buildBoolean,
        number: buildNumber,
        undefined: buildUndefined,
        null: buildNull,
        concat: buildConcat,
        hash: buildHash,
        pair: buildPair,
        program: buildProgram,
        loc: buildLoc,
        pos: buildPosition
    };
});

enifed('glimmer-syntax/lib/generation/print', ['exports'], function (exports) {
    'use strict';

    exports.default = build;

    function build(ast) {
        if (!ast) {
            return '';
        }
        var output = [];
        switch (ast.type) {
            case 'Program':
                {
                    var chainBlock = ast.chained && ast.body[0];
                    if (chainBlock) {
                        chainBlock.chained = true;
                    }
                    var body = buildEach(ast.body).join('');
                    output.push(body);
                }
                break;
            case 'ElementNode':
                output.push('<', ast.tag);
                if (ast.attributes.length) {
                    output.push(' ', buildEach(ast.attributes).join(' '));
                }
                if (ast.modifiers.length) {
                    output.push(' ', buildEach(ast.modifiers).join(' '));
                }
                output.push('>');
                output.push.apply(output, buildEach(ast.children));
                output.push('</', ast.tag, '>');
                break;
            case 'AttrNode':
                output.push(ast.name, '=');
                var value = build(ast.value);
                if (ast.value.type === 'TextNode') {
                    output.push('"', value, '"');
                } else {
                    output.push(value);
                }
                break;
            case 'ConcatStatement':
                output.push('"');
                ast.parts.forEach(function (node) {
                    if (node.type === 'StringLiteral') {
                        output.push(node.original);
                    } else {
                        output.push(build(node));
                    }
                });
                output.push('"');
                break;
            case 'TextNode':
                output.push(ast.chars);
                break;
            case 'MustacheStatement':
                {
                    output.push(compactJoin(['{{', pathParams(ast), '}}']));
                }
                break;
            case 'ElementModifierStatement':
                {
                    output.push(compactJoin(['{{', pathParams(ast), '}}']));
                }
                break;
            case 'PathExpression':
                output.push(ast.original);
                break;
            case 'SubExpression':
                {
                    output.push('(', pathParams(ast), ')');
                }
                break;
            case 'BooleanLiteral':
                output.push(ast.value ? 'true' : false);
                break;
            case 'BlockStatement':
                {
                    var lines = [];
                    if (ast.chained) {
                        lines.push(['{{else ', pathParams(ast), '}}'].join(''));
                    } else {
                        lines.push(openBlock(ast));
                    }
                    lines.push(build(ast.program));
                    if (ast.inverse) {
                        if (!ast.inverse.chained) {
                            lines.push('{{else}}');
                        }
                        lines.push(build(ast.inverse));
                    }
                    if (!ast.chained) {
                        lines.push(closeBlock(ast));
                    }
                    output.push(lines.join(''));
                }
                break;
            case 'PartialStatement':
                {
                    output.push(compactJoin(['{{>', pathParams(ast), '}}']));
                }
                break;
            case 'CommentStatement':
                {
                    output.push(compactJoin(['<!--', ast.value, '-->']));
                }
                break;
            case 'StringLiteral':
                {
                    output.push('"' + ast.value + '"');
                }
                break;
            case 'NumberLiteral':
                {
                    output.push(ast.value);
                }
                break;
            case 'UndefinedLiteral':
                {
                    output.push('undefined');
                }
                break;
            case 'NullLiteral':
                {
                    output.push('null');
                }
                break;
            case 'Hash':
                {
                    output.push(ast.pairs.map(function (pair) {
                        return build(pair);
                    }).join(' '));
                }
                break;
            case 'HashPair':
                {
                    output.push(ast.key + '=' + build(ast.value));
                }
                break;
        }
        return output.join('');
    }

    function compact(array) {
        var newArray = [];
        array.forEach(function (a) {
            if (typeof a !== 'undefined' && a !== null && a !== '') {
                newArray.push(a);
            }
        });
        return newArray;
    }
    function buildEach(asts) {
        var output = [];
        asts.forEach(function (node) {
            output.push(build(node));
        });
        return output;
    }
    function pathParams(ast) {
        var name = build(ast.name);
        var path = build(ast.path);
        var params = buildEach(ast.params).join(' ');
        var hash = build(ast.hash);
        return compactJoin([name, path, params, hash], ' ');
    }
    function compactJoin(array, delimiter) {
        return compact(array).join(delimiter || '');
    }
    function blockParams(block) {
        var params = block.program.blockParams;
        if (params.length) {
            return ' as |' + params.join(',') + '|';
        }
    }
    function openBlock(block) {
        return ['{{#', pathParams(block), blockParams(block), '}}'].join('');
    }
    function closeBlock(block) {
        return ['{{/', build(block.path), '}}'].join('');
    }
});

enifed("glimmer-syntax/lib/parser/handlebars-node-visitors", ["exports", "../builders", "../utils"], function (exports, _builders, _utils) {
    "use strict";

    exports.default = {
        Program: function (program) {
            var body = [];
            var node = _builders.default.program(body, program.blockParams, program.loc);
            var i,
                l = program.body.length;
            this.elementStack.push(node);
            if (l === 0) {
                return this.elementStack.pop();
            }
            for (i = 0; i < l; i++) {
                this.acceptNode(program.body[i]);
            }
            // Ensure that that the element stack is balanced properly.
            var poppedNode = this.elementStack.pop();
            if (poppedNode !== node) {
                throw new Error("Unclosed element `" + poppedNode.tag + "` (on line " + poppedNode.loc.start.line + ").");
            }
            return node;
        },
        BlockStatement: function (block) {
            delete block.inverseStrip;
            delete block.openString;
            delete block.closeStrip;
            if (this.tokenizer.state === 'comment') {
                this.appendToCommentData('{{' + this.sourceForMustache(block) + '}}');
                return;
            }
            if (this.tokenizer.state !== 'comment' && this.tokenizer.state !== 'data' && this.tokenizer.state !== 'beforeData') {
                throw new Error("A block may only be used inside an HTML element or another block.");
            }
            block = acceptCommonNodes(this, block);
            var program = block.program ? this.acceptNode(block.program) : null;
            var inverse = block.inverse ? this.acceptNode(block.inverse) : null;
            var node = _builders.default.block(block.path, block.params, block.hash, program, inverse, block.loc);
            var parentProgram = this.currentElement();
            _utils.appendChild(parentProgram, node);
        },
        MustacheStatement: function (rawMustache) {
            var tokenizer = this.tokenizer;
            var path = rawMustache.path;
            var params = rawMustache.params;
            var hash = rawMustache.hash;
            var escaped = rawMustache.escaped;
            var loc = rawMustache.loc;

            var mustache = _builders.default.mustache(path, params, hash, !escaped, loc);
            if (tokenizer.state === 'comment') {
                this.appendToCommentData('{{' + this.sourceForMustache(mustache) + '}}');
                return;
            }
            acceptCommonNodes(this, mustache);
            switch (tokenizer.state) {
                // Tag helpers
                case "tagName":
                    addElementModifier(this.currentNode, mustache);
                    tokenizer.state = "beforeAttributeName";
                    break;
                case "beforeAttributeName":
                    addElementModifier(this.currentNode, mustache);
                    break;
                case "attributeName":
                case "afterAttributeName":
                    this.beginAttributeValue(false);
                    this.finishAttributeValue();
                    addElementModifier(this.currentNode, mustache);
                    tokenizer.state = "beforeAttributeName";
                    break;
                case "afterAttributeValueQuoted":
                    addElementModifier(this.currentNode, mustache);
                    tokenizer.state = "beforeAttributeName";
                    break;
                // Attribute values
                case "beforeAttributeValue":
                    appendDynamicAttributeValuePart(this.currentAttribute, mustache);
                    tokenizer.state = 'attributeValueUnquoted';
                    break;
                case "attributeValueDoubleQuoted":
                case "attributeValueSingleQuoted":
                case "attributeValueUnquoted":
                    appendDynamicAttributeValuePart(this.currentAttribute, mustache);
                    break;
                // TODO: Only append child when the tokenizer state makes
                // sense to do so, otherwise throw an error.
                default:
                    _utils.appendChild(this.currentElement(), mustache);
            }
            return mustache;
        },
        ContentStatement: function (content) {
            var changeLines = 0;
            if (content.rightStripped) {
                changeLines = leadingNewlineDifference(content.original, content.value);
            }
            this.tokenizer.line = this.tokenizer.line + changeLines;
            this.tokenizer.tokenizePart(content.value);
            this.tokenizer.flushData();
        },
        CommentStatement: function (comment) {
            return comment;
        },
        PartialStatement: function (partial) {
            _utils.appendChild(this.currentElement(), partial);
            return partial;
        },
        SubExpression: function (sexpr) {
            return acceptCommonNodes(this, sexpr);
        },
        PathExpression: function (path) {
            delete path.depth;
            return path;
        },
        Hash: function (hash) {
            for (var i = 0; i < hash.pairs.length; i++) {
                this.acceptNode(hash.pairs[i].value);
            }
            return hash;
        },
        StringLiteral: function () {},
        BooleanLiteral: function () {},
        NumberLiteral: function () {},
        UndefinedLiteral: function () {},
        NullLiteral: function () {}
    };

    function leadingNewlineDifference(original, value) {
        if (value === '') {
            // if it is empty, just return the count of newlines
            // in original
            return original.split("\n").length - 1;
        }
        // otherwise, return the number of newlines prior to
        // `value`
        var difference = original.split(value)[0];
        var lines = difference.split(/\n/);
        return lines.length - 1;
    }
    function acceptCommonNodes(compiler, node) {
        compiler.acceptNode(node.path);
        if (node.params) {
            for (var i = 0; i < node.params.length; i++) {
                compiler.acceptNode(node.params[i]);
            }
        } else {
            node.params = [];
        }
        if (node.hash) {
            compiler.acceptNode(node.hash);
        } else {
            node.hash = _builders.default.hash();
        }
        return node;
    }
    function addElementModifier(element, mustache) {
        var path = mustache.path;
        var params = mustache.params;
        var hash = mustache.hash;
        var loc = mustache.loc;

        var modifier = _builders.default.elementModifier(path, params, hash, loc);
        element.modifiers.push(modifier);
    }
    function appendDynamicAttributeValuePart(attribute, part) {
        attribute.isDynamic = true;
        attribute.parts.push(part);
    }
});

enifed("glimmer-syntax/lib/parser/tokenizer-event-handlers", ["exports", "glimmer-util", "../builders", "../utils"], function (exports, _glimmerUtil, _builders, _utils) {
    "use strict";

    exports.default = {
        reset: function () {
            this.currentNode = null;
        },
        // Comment
        beginComment: function () {
            this.currentNode = _builders.default.comment("");
        },
        appendToCommentData: function (char) {
            this.currentNode.value += char;
        },
        finishComment: function () {
            _utils.appendChild(this.currentElement(), this.currentNode);
        },
        // Data
        beginData: function () {
            this.currentNode = _builders.default.text();
        },
        appendToData: function (char) {
            this.currentNode.chars += char;
        },
        finishData: function () {
            _utils.appendChild(this.currentElement(), this.currentNode);
        },
        // Tags - basic
        beginStartTag: function () {
            this.currentNode = {
                type: 'StartTag',
                name: "",
                attributes: [],
                modifiers: [],
                selfClosing: false,
                loc: null
            };
        },
        beginEndTag: function () {
            this.currentNode = {
                type: 'EndTag',
                name: "",
                attributes: [],
                modifiers: [],
                selfClosing: false,
                loc: null
            };
        },
        finishTag: function () {
            var _tokenizer = this.tokenizer;
            var tagLine = _tokenizer.tagLine;
            var tagColumn = _tokenizer.tagColumn;
            var line = _tokenizer.line;
            var column = _tokenizer.column;

            var tag = this.currentNode;
            tag.loc = _builders.default.loc(tagLine, tagColumn, line, column);
            if (tag.type === 'StartTag') {
                this.finishStartTag();
                if (_glimmerUtil.voidMap.hasOwnProperty(tag.name) || tag.selfClosing) {
                    this.finishEndTag(true);
                }
            } else if (tag.type === 'EndTag') {
                this.finishEndTag(false);
            }
        },
        finishStartTag: function () {
            var _currentNode = this.currentNode;
            var name = _currentNode.name;
            var attributes = _currentNode.attributes;
            var modifiers = _currentNode.modifiers;

            var loc = _builders.default.loc(this.tokenizer.tagLine, this.tokenizer.tagColumn);
            var element = _builders.default.element(name, attributes, modifiers, [], loc);
            this.elementStack.push(element);
        },
        finishEndTag: function (isVoid) {
            var tag = this.currentNode;
            var element = this.elementStack.pop();
            var parent = this.currentElement();
            var disableComponentGeneration = this.options.disableComponentGeneration === true;
            validateEndTag(tag, element, isVoid);
            element.loc.end.line = this.tokenizer.line;
            element.loc.end.column = this.tokenizer.column;
            if (disableComponentGeneration || element.tag.indexOf("-") === -1) {
                _utils.parseElementBlockParams(element);
                _utils.appendChild(parent, element);
            } else {
                var program = _builders.default.program(element.children);
                _utils.parseComponentBlockParams(element, program);
                var component = _builders.default.component(element.tag, element.attributes, program, element.loc);
                _utils.appendChild(parent, component);
            }
        },
        markTagAsSelfClosing: function () {
            this.currentNode.selfClosing = true;
        },
        // Tags - name
        appendToTagName: function (char) {
            this.currentNode.name += char;
        },
        // Tags - attributes
        beginAttribute: function () {
            var tag = this.currentNode;
            if (tag.type === 'EndTag') {
                throw new Error("Invalid end tag: closing tag must not have attributes, " + ("in `" + tag.name + "` (on line " + this.tokenizer.line + ")."));
            }
            this.currentAttribute = {
                name: "",
                parts: [],
                isQuoted: false,
                isDynamic: false
            };
        },
        appendToAttributeName: function (char) {
            this.currentAttribute.name += char;
        },
        beginAttributeValue: function (isQuoted) {
            this.currentAttribute.isQuoted = isQuoted;
        },
        appendToAttributeValue: function (char) {
            var parts = this.currentAttribute.parts;
            if (typeof parts[parts.length - 1] === 'string') {
                parts[parts.length - 1] += char;
            } else {
                parts.push(char);
            }
        },
        finishAttributeValue: function () {
            var _currentAttribute = this.currentAttribute;
            var name = _currentAttribute.name;
            var parts = _currentAttribute.parts;
            var isQuoted = _currentAttribute.isQuoted;
            var isDynamic = _currentAttribute.isDynamic;

            var value = assembleAttributeValue(parts, isQuoted, isDynamic, this.tokenizer.line);
            this.currentNode.attributes.push(_builders.default.attr(name, value));
        }
    };

    function assembleAttributeValue(parts, isQuoted, isDynamic, line) {
        if (isDynamic) {
            if (isQuoted) {
                return assembleConcatenatedValue(parts);
            } else {
                if (parts.length === 1) {
                    return parts[0];
                } else {
                    throw new Error("An unquoted attribute value must be a string or a mustache, " + "preceeded by whitespace or a '=' character, and " + ("followed by whitespace or a '>' character (on line " + line + ")"));
                }
            }
        } else {
            return _builders.default.text(parts.length > 0 ? parts[0] : "");
        }
    }
    function assembleConcatenatedValue(parts) {
        for (var i = 0; i < parts.length; i++) {
            var part = parts[i];
            if (typeof part === 'string') {
                parts[i] = _builders.default.string(parts[i]);
            } else {
                if (part.type === 'MustacheStatement') {
                    parts[i] = _utils.unwrapMustache(part);
                } else {
                    throw new Error("Unsupported node in quoted attribute value: " + part.type);
                }
            }
        }
        return _builders.default.concat(parts);
    }
    function validateEndTag(tag, element, selfClosing) {
        var error;
        if (_glimmerUtil.voidMap[tag.name] && !selfClosing) {
            // EngTag is also called by StartTag for void and self-closing tags (i.e.
            // <input> or <br />, so we need to check for that here. Otherwise, we would
            // throw an error for those cases.
            error = "Invalid end tag " + formatEndTagInfo(tag) + " (void elements cannot have end tags).";
        } else if (element.tag === undefined) {
            error = "Closing tag " + formatEndTagInfo(tag) + " without an open tag.";
        } else if (element.tag !== tag.name) {
            error = "Closing tag " + formatEndTagInfo(tag) + " did not match last open tag `" + element.tag + "` (on line " + element.loc.start.line + ").";
        }
        if (error) {
            throw new Error(error);
        }
    }
    function formatEndTagInfo(tag) {
        return "`" + tag.name + "` (on line " + tag.loc.end.line + ")";
    }
});

enifed("glimmer-syntax/lib/parser", ["exports", "handlebars/compiler/base", "./syntax", "simple-html-tokenizer/evented-tokenizer", "simple-html-tokenizer/entity-parser", "simple-html-tokenizer/html5-named-char-refs", "./parser/handlebars-node-visitors", "./parser/tokenizer-event-handlers"], function (exports, _handlebarsCompilerBase, _syntax, _simpleHtmlTokenizerEventedTokenizer, _simpleHtmlTokenizerEntityParser, _simpleHtmlTokenizerHtml5NamedCharRefs, _parserHandlebarsNodeVisitors, _parserTokenizerEventHandlers) {
    "use strict";

    exports.preprocess = preprocess;
    exports.Parser = Parser;

    function preprocess(html, options) {
        var ast = typeof html === 'object' ? html : _handlebarsCompilerBase.parse(html);
        var combined = new Parser(html, options).acceptNode(ast);
        if (options && options.plugins && options.plugins.ast) {
            for (var i = 0, l = options.plugins.ast.length; i < l; i++) {
                var plugin = new options.plugins.ast[i](options);
                plugin.syntax = _syntax;
                combined = plugin.transform(combined);
            }
        }
        return combined;
    }

    exports.default = preprocess;

    var entityParser = new _simpleHtmlTokenizerEntityParser.default(_simpleHtmlTokenizerHtml5NamedCharRefs.default);

    function Parser(source, options) {
        this.options = options || {};
        this.elementStack = [];
        this.tokenizer = new _simpleHtmlTokenizerEventedTokenizer.default(this, entityParser);
        this.currentNode = null;
        this.currentAttribute = null;
        if (typeof source === 'string') {
            this.source = source.split(/(?:\r\n?|\n)/g);
        }
    }

    for (var key in _parserHandlebarsNodeVisitors.default) {
        Parser.prototype[key] = _parserHandlebarsNodeVisitors.default[key];
    }
    for (var key in _parserTokenizerEventHandlers.default) {
        Parser.prototype[key] = _parserTokenizerEventHandlers.default[key];
    }
    Parser.prototype.acceptNode = function (node) {
        return this[node.type](node);
    };
    Parser.prototype.currentElement = function () {
        return this.elementStack[this.elementStack.length - 1];
    };
    Parser.prototype.sourceForMustache = function (mustache) {
        var firstLine = mustache.loc.start.line - 1;
        var lastLine = mustache.loc.end.line - 1;
        var currentLine = firstLine - 1;
        var firstColumn = mustache.loc.start.column + 2;
        var lastColumn = mustache.loc.end.column - 2;
        var string = [];
        var line;
        if (!this.source) {
            return '{{' + mustache.path.id.original + '}}';
        }
        while (currentLine < lastLine) {
            currentLine++;
            line = this.source[currentLine];
            if (currentLine === firstLine) {
                if (firstLine === lastLine) {
                    string.push(line.slice(firstColumn, lastColumn));
                } else {
                    string.push(line.slice(firstColumn));
                }
            } else if (currentLine === lastLine) {
                string.push(line.slice(0, lastColumn));
            } else {
                string.push(line);
            }
        }
        return string.join('\n');
    };
});

enifed("glimmer-syntax/lib/syntax", ["exports", "./builders", "./parser", "./generation/print", "./traversal/traverse", "./traversal/walker"], function (exports, _builders, _parser, _generationPrint, _traversalTraverse, _traversalWalker) {
  "use strict";

  exports.builders = _builders.default;
  exports.parse = _parser.default;
  exports.print = _generationPrint.default;
  exports.traverse = _traversalTraverse.default;
  exports.Walker = _traversalWalker.default;
});

enifed("glimmer-syntax/lib/traversal/errors", ["exports"], function (exports) {
    "use strict";

    exports.cannotRemoveNode = cannotRemoveNode;
    exports.cannotReplaceNode = cannotReplaceNode;
    exports.cannotReplaceOrRemoveInKeyHandlerYet = cannotReplaceOrRemoveInKeyHandlerYet;
    function TraversalError(message, node, parent, key) {
        this.name = "TraversalError";
        this.message = message;
        this.node = node;
        this.parent = parent;
        this.key = key;
    }
    TraversalError.prototype = Object.create(Error.prototype);
    TraversalError.prototype.constructor = TraversalError;
    exports.default = TraversalError;

    function cannotRemoveNode(node, parent, key) {
        return new TraversalError("Cannot remove a node unless it is part of an array", node, parent, key);
    }

    function cannotReplaceNode(node, parent, key) {
        return new TraversalError("Cannot replace a node with multiple nodes unless it is part of an array", node, parent, key);
    }

    function cannotReplaceOrRemoveInKeyHandlerYet(node, key) {
        return new TraversalError("Replacing and removing in key handlers is not yet supported.", node, null, key);
    }
});

enifed('glimmer-syntax/lib/traversal/traverse', ['exports', '../types/visitor-keys', './errors'], function (exports, _typesVisitorKeys, _errors) {
    'use strict';

    exports.default = traverse;
    exports.normalizeVisitor = normalizeVisitor;

    function visitNode(visitor, node) {
        var handler = visitor[node.type] || visitor.All;
        var result = undefined;
        if (handler && handler.enter) {
            result = handler.enter.call(null, node);
        }
        if (result === undefined) {
            var keys = _typesVisitorKeys.default[node.type];
            for (var i = 0; i < keys.length; i++) {
                visitKey(visitor, handler, node, keys[i]);
            }
            if (handler && handler.exit) {
                result = handler.exit.call(null, node);
            }
        }
        return result;
    }
    function visitKey(visitor, handler, node, key) {
        var value = node[key];
        if (!value) {
            return;
        }
        var keyHandler = handler && (handler.keys[key] || handler.keys.All);
        var result = undefined;
        if (keyHandler && keyHandler.enter) {
            result = keyHandler.enter.call(null, node, key);
            if (result !== undefined) {
                throw _errors.cannotReplaceOrRemoveInKeyHandlerYet(node, key);
            }
        }
        if (Array.isArray(value)) {
            visitArray(visitor, value);
        } else {
            var _result = visitNode(visitor, value);
            if (_result !== undefined) {
                assignKey(node, key, _result);
            }
        }
        if (keyHandler && keyHandler.exit) {
            result = keyHandler.exit.call(null, node, key);
            if (result !== undefined) {
                throw _errors.cannotReplaceOrRemoveInKeyHandlerYet(node, key);
            }
        }
    }
    function visitArray(visitor, array) {
        for (var i = 0; i < array.length; i++) {
            var result = visitNode(visitor, array[i]);
            if (result !== undefined) {
                i += spliceArray(array, i, result) - 1;
            }
        }
    }
    function assignKey(node, key, result) {
        if (result === null) {
            throw _errors.cannotRemoveNode(node[key], node, key);
        } else if (Array.isArray(result)) {
            if (result.length === 1) {
                node[key] = result[0];
            } else {
                if (result.length === 0) {
                    throw _errors.cannotRemoveNode(node[key], node, key);
                } else {
                    throw _errors.cannotReplaceNode(node[key], node, key);
                }
            }
        } else {
            node[key] = result;
        }
    }
    function spliceArray(array, index, result) {
        if (result === null) {
            array.splice(index, 1);
            return 0;
        } else if (Array.isArray(result)) {
            array.splice.apply(array, [index, 1].concat(result));
            return result.length;
        } else {
            array.splice(index, 1, result);
            return 1;
        }
    }

    function traverse(node, visitor) {
        visitNode(normalizeVisitor(visitor), node);
    }

    function normalizeVisitor(visitor) {
        var normalizedVisitor = {};
        for (var type in visitor) {
            var handler = visitor[type] || visitor.All;
            var normalizedKeys = {};
            if (typeof handler === 'object') {
                var keys = handler.keys;
                if (keys) {
                    for (var key in keys) {
                        var keyHandler = keys[key];
                        if (typeof keyHandler === 'object') {
                            normalizedKeys[key] = {
                                enter: typeof keyHandler.enter === 'function' ? keyHandler.enter : null,
                                exit: typeof keyHandler.exit === 'function' ? keyHandler.exit : null
                            };
                        } else if (typeof keyHandler === 'function') {
                            normalizedKeys[key] = {
                                enter: keyHandler,
                                exit: null
                            };
                        }
                    }
                }
                normalizedVisitor[type] = {
                    enter: typeof handler.enter === 'function' ? handler.enter : null,
                    exit: typeof handler.exit === 'function' ? handler.exit : null,
                    keys: normalizedKeys
                };
            } else if (typeof handler === 'function') {
                normalizedVisitor[type] = {
                    enter: handler,
                    exit: null,
                    keys: normalizedKeys
                };
            }
        }
        return normalizedVisitor;
    }
});

enifed('glimmer-syntax/lib/traversal/walker', ['exports'], function (exports) {
    'use strict';

    function Walker() {
        var order = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];

        this.order = order;
        this.stack = [];
    }
    exports.default = Walker;

    Walker.prototype.visit = function (node, callback) {
        if (!node) {
            return;
        }
        this.stack.push(node);
        if (this.order === 'post') {
            this.children(node, callback);
            callback(node, this);
        } else {
            callback(node, this);
            this.children(node, callback);
        }
        this.stack.pop();
    };
    var visitors = {
        Program: function (walker, node, callback) {
            for (var i = 0; i < node.body.length; i++) {
                walker.visit(node.body[i], callback);
            }
        },
        ElementNode: function (walker, node, callback) {
            for (var i = 0; i < node.children.length; i++) {
                walker.visit(node.children[i], callback);
            }
        },
        BlockStatement: function (walker, node, callback) {
            walker.visit(node.program, callback);
            walker.visit(node.inverse, callback);
        },
        ComponentNode: function (walker, node, callback) {
            walker.visit(node.program, callback);
        }
    };
    Walker.prototype.children = function (node, callback) {
        var visitor = visitors[node.type];
        if (visitor) {
            visitor(this, node, callback);
        }
    };
});

enifed('glimmer-syntax/lib/types/visitor-keys', ['exports'], function (exports) {
    'use strict';

    exports.default = {
        Program: ['body'],
        MustacheStatement: ['path', 'params', 'hash'],
        BlockStatement: ['path', 'params', 'hash', 'program', 'inverse'],
        ElementModifierStatement: ['path', 'params', 'hash'],
        PartialStatement: ['name', 'params', 'hash'],
        CommentStatement: [],
        ElementNode: ['attributes', 'modifiers', 'children'],
        ComponentNode: ['attributes', 'program'],
        AttrNode: ['value'],
        TextNode: [],
        ConcatStatement: ['parts'],
        SubExpression: ['path', 'params', 'hash'],
        PathExpression: [],
        StringLiteral: [],
        BooleanLiteral: [],
        NumberLiteral: [],
        NullLiteral: [],
        UndefinedLiteral: [],
        Hash: ['pairs'],
        HashPair: ['value']
    };
});

enifed('glimmer-syntax/lib/utils', ['exports', 'glimmer-util'], function (exports, _glimmerUtil) {
    'use strict';

    exports.parseComponentBlockParams = parseComponentBlockParams;
    exports.parseElementBlockParams = parseElementBlockParams;
    exports.childrenFor = childrenFor;
    exports.appendChild = appendChild;
    exports.isHelper = isHelper;
    exports.unwrapMustache = unwrapMustache;

    // Regex to validate the identifier for block parameters.
    // Based on the ID validation regex in Handlebars.
    var ID_INVERSE_PATTERN = /[!"#%-,\.\/;->@\[-\^`\{-~]/;
    // Checks the component's attributes to see if it uses block params.
    // If it does, registers the block params with the program and
    // removes the corresponding attributes from the element.

    function parseComponentBlockParams(element, program) {
        var params = parseBlockParams(element);
        if (params) program.blockParams = params;
    }

    function parseElementBlockParams(element) {
        var params = parseBlockParams(element);
        if (params) element.blockParams = params;
    }

    function parseBlockParams(element) {
        var l = element.attributes.length;
        var attrNames = [];
        for (var i = 0; i < l; i++) {
            attrNames.push(element.attributes[i].name);
        }
        var asIndex = _glimmerUtil.indexOfArray(attrNames, 'as');
        if (asIndex !== -1 && l > asIndex && attrNames[asIndex + 1].charAt(0) === '|') {
            // Some basic validation, since we're doing the parsing ourselves
            var paramsString = attrNames.slice(asIndex).join(' ');
            if (paramsString.charAt(paramsString.length - 1) !== '|' || paramsString.match(/\|/g).length !== 2) {
                throw new Error('Invalid block parameters syntax: \'' + paramsString + '\'');
            }
            var params = [];
            for (i = asIndex + 1; i < l; i++) {
                var param = attrNames[i].replace(/\|/g, '');
                if (param !== '') {
                    if (ID_INVERSE_PATTERN.test(param)) {
                        throw new Error('Invalid identifier for block parameters: \'' + param + '\' in \'' + paramsString + '\'');
                    }
                    params.push(param);
                }
            }
            if (params.length === 0) {
                throw new Error('Cannot use zero block parameters: \'' + paramsString + '\'');
            }
            element.attributes = element.attributes.slice(0, asIndex);
            return params;
        }
    }

    function childrenFor(node) {
        if (node.type === 'Program') {
            return node.body;
        }
        if (node.type === 'ElementNode') {
            return node.children;
        }
    }

    function appendChild(parent, node) {
        childrenFor(parent).push(node);
    }

    function isHelper(mustache) {
        return mustache.params && mustache.params.length > 0 || mustache.hash && mustache.hash.pairs.length > 0;
    }

    function unwrapMustache(mustache) {
        if (isHelper(mustache)) {
            return mustache;
        } else {
            return mustache.path;
        }
    }
});

enifed('glimmer-test-helpers/index', ['exports', './lib/helpers'], function (exports, _libHelpers) {
  'use strict';

  exports.equalInnerHTML = _libHelpers.equalInnerHTML;
  exports.equalHTML = _libHelpers.equalHTML;
  exports.equalTokens = _libHelpers.equalTokens;
  exports.normalizeInnerHTML = _libHelpers.normalizeInnerHTML;
  exports.isCheckedInputHTML = _libHelpers.isCheckedInputHTML;
  exports.getTextContent = _libHelpers.getTextContent;
  exports.strip = _libHelpers.strip;
  exports.stripTight = _libHelpers.stripTight;
});

enifed("glimmer-test-helpers/lib/helpers", ["exports", "simple-html-tokenizer", "glimmer-util"], function (exports, _simpleHtmlTokenizer, _glimmerUtil) {
    "use strict";

    exports.equalInnerHTML = equalInnerHTML;
    exports.equalHTML = equalHTML;
    exports.equalTokens = equalTokens;
    exports.normalizeInnerHTML = normalizeInnerHTML;
    exports.isCheckedInputHTML = isCheckedInputHTML;
    exports.getTextContent = getTextContent;
    exports.strip = strip;
    exports.stripTight = stripTight;

    function equalInnerHTML(fragment, html, msg) {
        var actualHTML = normalizeInnerHTML(fragment.innerHTML);
        QUnit.push(actualHTML === html, actualHTML, html, msg);
    }

    function equalHTML(node, html) {
        var fragment;
        if (!node.nodeType && node.length) {
            fragment = document.createDocumentFragment();
            while (node[0]) {
                fragment.appendChild(node[0]);
            }
        } else {
            fragment = node;
        }
        var div = document.createElement("div");
        div.appendChild(fragment.cloneNode(true));
        equalInnerHTML(div, html);
    }

    function generateTokens(divOrHTML) {
        var div;
        if (typeof divOrHTML === 'string') {
            div = document.createElement("div");
            div.innerHTML = divOrHTML;
        } else {
            div = divOrHTML;
        }
        return { tokens: _simpleHtmlTokenizer.tokenize(div.innerHTML), html: div.innerHTML };
    }

    function equalTokens(fragment, html) {
        var message = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

        if (fragment.fragment) {
            fragment = fragment.fragment;
        }
        if (html.fragment) {
            html = html.fragment;
        }
        var fragTokens = generateTokens(fragment);
        var htmlTokens = generateTokens(html);
        function normalizeTokens(token) {
            if (token.type === 'StartTag') {
                token.attributes = token.attributes.sort(function (a, b) {
                    if (a[0] > b[0]) {
                        return 1;
                    }
                    if (a[0] < b[0]) {
                        return -1;
                    }
                    return 0;
                });
            }
        }
        _glimmerUtil.forEach(fragTokens.tokens, normalizeTokens);
        _glimmerUtil.forEach(htmlTokens.tokens, normalizeTokens);
        // var msg = "Expected: " + htmlTokens.html + "; Actual: " + fragTokens.html;
        // if (message) { msg += " (" + message + ")"; }
        var equiv = QUnit.equiv(fragTokens.tokens, htmlTokens.tokens);
        if (equiv && fragTokens.html !== htmlTokens.html) {
            deepEqual(fragTokens.tokens, htmlTokens.tokens, message);
        } else {
            QUnit.push(QUnit.equiv(fragTokens.tokens, htmlTokens.tokens), fragTokens.html, htmlTokens.html, message);
        }
        // deepEqual(fragTokens.tokens, htmlTokens.tokens, msg);
    }

    // detect side-effects of cloning svg elements in IE9-11
    var ieSVGInnerHTML = (function () {
        if (!document.createElementNS) {
            return false;
        }
        var div = document.createElement('div');
        var node = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        div.appendChild(node);
        var clone = div.cloneNode(true);
        return clone.innerHTML === '<svg xmlns="http://www.w3.org/2000/svg" />';
    })();

    function normalizeInnerHTML(actualHTML) {
        if (ieSVGInnerHTML) {
            // Replace `<svg xmlns="http://www.w3.org/2000/svg" height="50%" />` with `<svg height="50%"></svg>`, etc.
            // drop namespace attribute
            actualHTML = actualHTML.replace(/ xmlns="[^"]+"/, '');
            // replace self-closing elements
            actualHTML = actualHTML.replace(/<([^ >]+) [^\/>]*\/>/gi, function (tag, tagName) {
                return tag.slice(0, tag.length - 3) + '></' + tagName + '>';
            });
        }
        return actualHTML;
    }

    // detect weird IE8 checked element string
    var checkedInput = document.createElement('input');
    checkedInput.setAttribute('checked', 'checked');
    var checkedInputString = checkedInput.outerHTML;

    function isCheckedInputHTML(element) {
        equal(element.outerHTML, checkedInputString);
    }

    // check which property has the node's text content
    var textProperty = document.createElement('div').textContent === undefined ? 'innerText' : 'textContent';

    function getTextContent(el) {
        // textNode
        if (el.nodeType === 3) {
            return el.nodeValue;
        } else {
            return el[textProperty];
        }
    }

    function strip(strings) {
        return strings[0].split('\n').map(function (s) {
            return s.trim();
        }).join(' ');
    }

    function stripTight(strings) {
        return strings[0].split('\n').map(function (s) {
            return s.trim();
        }).join('');
    }
});

enifed('glimmer-util/index', ['exports', './lib/object-utils', './lib/safe-string', './lib/namespaces', './lib/platform-utils', './lib/assert', './lib/array-utils', './lib/void-tag-names', './lib/guid', './lib/collections', './lib/list-utils'], function (exports, _libObjectUtils, _libSafeString, _libNamespaces, _libPlatformUtils, _libAssert, _libArrayUtils, _libVoidTagNames, _libGuid, _libCollections, _libListUtils) {
  /*globals console*/

  'use strict';

  exports.SafeString = _libSafeString.default;
  exports.getAttrNamespace = _libNamespaces.getAttrNamespace;
  exports.LITERAL = _libPlatformUtils.LITERAL;
  exports.InternedString = _libPlatformUtils.InternedString;
  exports.symbol = _libPlatformUtils.symbol;
  exports.intern = _libPlatformUtils.intern;
  exports.numberKey = _libPlatformUtils.numberKey;
  exports.assert = _libAssert.default;
  exports.forEach = _libArrayUtils.forEach;
  exports.map = _libArrayUtils.map;
  exports.isArray = _libArrayUtils.isArray;
  exports.indexOfArray = _libArrayUtils.indexOfArray;
  exports.voidMap = _libVoidTagNames.default;

  /* tslint:disable:no-unused-variable */

  /* tslint:enable:no-unused-variable */
  exports.merge = _libObjectUtils.merge;
  exports.assign = _libObjectUtils.assign;
  exports.installGuid = _libGuid.installGuid;
  exports.HasGuid = _libGuid.HasGuid;
  exports.types = _libObjectUtils;
  exports.Stack = _libCollections.Stack;
  exports.Dict = _libCollections.Dict;
  exports.Set = _libCollections.Set;
  exports.DictSet = _libCollections.DictSet;
  exports.dict = _libCollections.dict;
  exports.EMPTY_SLICE = _libListUtils.EMPTY_SLICE;
  exports.LinkedList = _libListUtils.LinkedList;
  exports.LinkedListNode = _libListUtils.LinkedListNode;
  exports.ListNode = _libListUtils.ListNode;
  exports.ListSlice = _libListUtils.ListSlice;
  exports.Slice = _libListUtils.Slice;
});

enifed('glimmer-util/lib/array-utils', ['exports'], function (exports) {
    'use strict';

    exports.forEach = forEach;
    exports.map = map;

    function forEach(array, callback) {
        var binding = arguments.length <= 2 || arguments[2] === undefined ? undefined : arguments[2];

        var i, l;
        if (binding === undefined) {
            for (i = 0, l = array.length; i < l; i++) {
                callback(array[i], i, array);
            }
        } else {
            for (i = 0, l = array.length; i < l; i++) {
                callback.call(binding, array[i], i, array);
            }
        }
    }

    function map(array, callback) {
        var output = [];
        var i, l;
        for (i = 0, l = array.length; i < l; i++) {
            output.push(callback(array[i], i, array));
        }
        return output;
    }

    var getIdx;
    if (Array.prototype.indexOf) {
        getIdx = function (array, obj, from) {
            return array.indexOf(obj, from);
        };
    } else {
        getIdx = function (array, obj, from) {
            if (from === undefined || from === null) {
                from = 0;
            } else if (from < 0) {
                from = Math.max(0, array.length + from);
            }
            for (var i = from, l = array.length; i < l; i++) {
                if (array[i] === obj) {
                    return i;
                }
            }
            return -1;
        };
    }
    var isArray = Array.isArray || function (array) {
        return Object.prototype.toString.call(array) === '[object Array]';
    };
    exports.isArray = isArray;
    var indexOfArray = getIdx;
    exports.indexOfArray = indexOfArray;
});

enifed("glimmer-util/lib/assert", ["exports"], function (exports) {
    "use strict";

    exports.debugAssert = debugAssert;
    exports.prodAssert = prodAssert;
    var alreadyWarned = false;

    function debugAssert(test, msg) {
        if (!alreadyWarned) {
            alreadyWarned = true;
            console.log("Don't leave debug assertions on in public builds");
        }
        if (!test) {
            throw new Error(msg || "assertion failure");
        }
    }

    function prodAssert() {}

    exports.default = debugAssert;
});

enifed('glimmer-util/lib/collections', ['exports', './guid'], function (exports, _guid) {
    'use strict';

    exports.dict = dict;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function dict() {
        var d = Object.create(null);
        d.x = 1;
        delete d.x;
        return d;
    }

    var DictSet = (function () {
        function DictSet() {
            _classCallCheck(this, DictSet);

            this.dict = dict();
        }

        DictSet.prototype.add = function add(obj) {
            this.dict[_guid.installGuid(obj)] = obj;
            return this;
        };

        DictSet.prototype.delete = function _delete(obj) {
            if (obj._guid) delete this.dict[obj._guid];
        };

        DictSet.prototype.forEach = function forEach(callback) {
            var dict = this.dict;

            Object.keys(dict).forEach(function (key) {
                return callback(dict[key]);
            });
        };

        return DictSet;
    })();

    exports.DictSet = DictSet;

    var Stack = (function () {
        function Stack() {
            _classCallCheck(this, Stack);

            this.stack = [];
            this.current = null;
        }

        Stack.prototype.push = function push(item) {
            this.current = item;
            this.stack.push(item);
        };

        Stack.prototype.pop = function pop() {
            var item = this.stack.pop();
            var len = this.stack.length;
            this.current = len === 0 ? null : this.stack[len - 1];
            return item;
        };

        Stack.prototype.isEmpty = function isEmpty() {
            return this.stack.length === 0;
        };

        return Stack;
    })();

    exports.Stack = Stack;
});

enifed("glimmer-util/lib/guid", ["exports"], function (exports) {
    "use strict";

    exports.installGuid = installGuid;
    var GUID = 0;

    function installGuid(object) {
        return object._guid = object._guid || ++GUID;
    }
});

enifed("glimmer-util/lib/list-utils", ["exports"], function (exports) {
    "use strict";

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    var ListNode = function ListNode(value) {
        _classCallCheck(this, ListNode);

        this.next = null;
        this.prev = null;
        this.value = value;
    };

    exports.ListNode = ListNode;

    var LinkedList = (function () {
        function LinkedList() {
            _classCallCheck(this, LinkedList);

            this.clear();
        }

        LinkedList.fromSlice = function fromSlice(slice) {
            var list = new LinkedList();
            slice.forEachNode(function (n) {
                return list.append(n.clone());
            });
            return list;
        };

        LinkedList.prototype.clone = function clone(callback) {
            var cloned = new LinkedList();
            this.forEachNode(function (node) {
                cloned.append(callback(node));
            });
            return cloned;
        };

        LinkedList.prototype.head = function head() {
            return this._head;
        };

        LinkedList.prototype.tail = function tail() {
            return this._tail;
        };

        LinkedList.prototype.clear = function clear() {
            this._head = this._tail = null;
        };

        LinkedList.prototype.isEmpty = function isEmpty() {
            return this._head === null;
        };

        LinkedList.prototype.toArray = function toArray() {
            var out = [];
            this.forEachNode(function (n) {
                return out.push(n);
            });
            return out;
        };

        LinkedList.prototype.splice = function splice(start, end, reference) {
            reference = reference || this._tail;
            var before = reference.prev;
            before.next = start;
            start.prev = before;
            reference.prev = end;
            end.next = reference;
        };

        LinkedList.prototype.spliceList = function spliceList(list, reference) {
            if (list.isEmpty()) return;
            this.splice(list.head(), list.tail(), reference);
        };

        LinkedList.prototype.nextNode = function nextNode(node) {
            return node.next;
        };

        LinkedList.prototype.prevNode = function prevNode(node) {
            return node.prev;
        };

        LinkedList.prototype.forEachNode = function forEachNode(callback) {
            var node = this._head;
            while (node !== null) {
                callback(node);
                node = node.next;
            }
        };

        LinkedList.prototype.insertBefore = function insertBefore(node) {
            var reference = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

            if (reference === null) return this.append(node);
            if (reference.prev) reference.prev.next = node;else this._head = node;
            node.prev = reference.prev;
            node.next = reference;
            reference.prev = node;
            return node;
        };

        LinkedList.prototype.append = function append(node) {
            var tail = this._tail;
            if (tail) {
                tail.next = node;
                node.prev = tail;
                node.next = null;
            } else {
                this._head = node;
            }
            return this._tail = node;
        };

        LinkedList.prototype.pop = function pop() {
            if (this._tail) return this.remove(this._tail);
            return null;
        };

        LinkedList.prototype.prepend = function prepend(node) {
            if (this._head) return this.insertBefore(node, this._head);
            return this._head = this._tail = node;
        };

        LinkedList.prototype.remove = function remove(node) {
            if (node.prev) node.prev.next = node.next;else this._head = node.next;
            if (node.next) node.next.prev = node.prev;else this._tail = node.prev;
            return node;
        };

        return LinkedList;
    })();

    exports.LinkedList = LinkedList;

    var LinkedListRemover = (function () {
        function LinkedListRemover(node) {
            _classCallCheck(this, LinkedListRemover);

            this.node = node;
        }

        LinkedListRemover.prototype.destroy = function destroy() {
            var _node = this.node;
            var prev = _node.prev;
            var next = _node.next;

            prev.next = next;
            next.prev = prev;
        };

        return LinkedListRemover;
    })();

    var ListSlice = (function () {
        function ListSlice(head, tail) {
            _classCallCheck(this, ListSlice);

            this._head = head;
            this._tail = tail;
        }

        ListSlice.toList = function toList(slice) {
            var list = new LinkedList();
            slice.forEachNode(function (n) {
                return list.append(n.clone());
            });
            return list;
        };

        ListSlice.prototype.forEachNode = function forEachNode(callback) {
            var node = this._head;
            while (node !== null) {
                callback(node);
                node = this.nextNode(node);
            }
        };

        ListSlice.prototype.head = function head() {
            return this._head;
        };

        ListSlice.prototype.tail = function tail() {
            return this._tail;
        };

        ListSlice.prototype.toArray = function toArray() {
            var out = [];
            this.forEachNode(function (n) {
                return out.push(n);
            });
            return out;
        };

        ListSlice.prototype.nextNode = function nextNode(node) {
            if (node === this._tail) return null;
            return node.next;
        };

        ListSlice.prototype.prevNode = function prevNode(node) {
            if (node === this._head) return null;
            return node.prev;
        };

        ListSlice.prototype.isEmpty = function isEmpty() {
            return false;
        };

        return ListSlice;
    })();

    exports.ListSlice = ListSlice;
    var EMPTY_SLICE = new ListSlice(null, null);
    exports.EMPTY_SLICE = EMPTY_SLICE;
});

enifed('glimmer-util/lib/namespaces', ['exports'], function (exports) {
    // ref http://dev.w3.org/html5/spec-LC/namespaces.html
    'use strict';

    exports.getAttrNamespace = getAttrNamespace;
    var defaultNamespaces = {
        html: 'http://www.w3.org/1999/xhtml',
        mathml: 'http://www.w3.org/1998/Math/MathML',
        svg: 'http://www.w3.org/2000/svg',
        xlink: 'http://www.w3.org/1999/xlink',
        xml: 'http://www.w3.org/XML/1998/namespace'
    };

    function getAttrNamespace(attrName) {
        var namespace;
        var colonIndex = attrName.indexOf(':');
        if (colonIndex !== -1) {
            var prefix = attrName.slice(0, colonIndex);
            namespace = defaultNamespaces[prefix];
        }
        return namespace || null;
    }
});

enifed("glimmer-util/lib/object-utils", ["exports"], function (exports) {
    /*globals console*/
    "use strict";

    exports.merge = merge;
    exports.assign = assign;
    exports.shallowCopy = shallowCopy;
    exports.keySet = keySet;
    exports.keyLength = keyLength;

    function merge(options, defaults) {
        for (var prop in defaults) {
            if (options.hasOwnProperty(prop)) {
                continue;
            }
            options[prop] = defaults[prop];
        }
        return options;
    }

    function assign(obj) {
        for (var _len = arguments.length, assignments = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            assignments[_key - 1] = arguments[_key];
        }

        return assignments.reduce(function (obj, extensions) {
            Object.keys(extensions).forEach(function (key) {
                return obj[key] = extensions[key];
            });
            return obj;
        }, obj);
    }

    function shallowCopy(obj) {
        return merge({}, obj);
    }

    function keySet(obj) {
        var set = {};
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                set[prop] = true;
            }
        }
        return set;
    }

    function keyLength(obj) {
        var count = 0;
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                count++;
            }
        }
        return count;
    }
});

enifed('glimmer-util/lib/platform-utils', ['exports'], function (exports) {
    'use strict';

    exports.intern = intern;
    exports.numberKey = numberKey;
    exports.LITERAL = LITERAL;
    exports.symbol = symbol;

    function intern(str) {
        return str;
        // var obj = {};
        // obj[str] = 1;
        // for (var key in obj) return <InternedString>key;
    }

    function numberKey(num) {
        return String(num);
    }

    function LITERAL(str) {
        return str;
    }

    var BASE_KEY = intern('__htmlbars' + +new Date());

    function symbol(debugName) {
        var number = +new Date();
        return intern(debugName + ' [id=' + BASE_KEY + Math.floor(Math.random() * number) + ']');
    }
});

enifed("glimmer-util/lib/quoting", ["exports"], function (exports) {
    "use strict";

    exports.hash = hash;
    exports.repeat = repeat;
    function escapeString(str) {
        str = str.replace(/\\/g, "\\\\");
        str = str.replace(/"/g, '\\"');
        str = str.replace(/\n/g, "\\n");
        return str;
    }
    exports.escapeString = escapeString;

    function string(str) {
        return '"' + escapeString(str) + '"';
    }
    exports.string = string;

    function array(a) {
        return "[" + a + "]";
    }
    exports.array = array;

    function hash(pairs) {
        return "{" + pairs.join(", ") + "}";
    }

    function repeat(chars, times) {
        var str = "";
        while (times--) {
            str += chars;
        }
        return str;
    }
});

enifed('glimmer-util/lib/safe-string', ['exports', 'handlebars/safe-string'], function (exports, _handlebarsSafeString) {
  'use strict';

  exports.default = _handlebarsSafeString.default;
});

enifed("glimmer-util/lib/void-tag-names", ["exports", "./array-utils"], function (exports, _arrayUtils) {
    "use strict";

    // The HTML elements in this list are speced by
    // http://www.w3.org/TR/html-markup/syntax.html#syntax-elements,
    // and will be forced to close regardless of if they have a
    // self-closing /> at the end.
    var voidTagNames = "area base br col command embed hr img input keygen link meta param source track wbr";
    var voidMap = {};
    _arrayUtils.forEach(voidTagNames.split(" "), function (tagName) {
        voidMap[tagName] = true;
    });
    exports.default = voidMap;
});

enifed('handlebars/compiler/ast', ['exports'], function (exports) {
  'use strict';

  var AST = {
    Program: function (statements, blockParams, strip, locInfo) {
      this.loc = locInfo;
      this.type = 'Program';
      this.body = statements;

      this.blockParams = blockParams;
      this.strip = strip;
    },

    MustacheStatement: function (path, params, hash, escaped, strip, locInfo) {
      this.loc = locInfo;
      this.type = 'MustacheStatement';

      this.path = path;
      this.params = params || [];
      this.hash = hash;
      this.escaped = escaped;

      this.strip = strip;
    },

    BlockStatement: function (path, params, hash, program, inverse, openStrip, inverseStrip, closeStrip, locInfo) {
      this.loc = locInfo;
      this.type = 'BlockStatement';

      this.path = path;
      this.params = params || [];
      this.hash = hash;
      this.program = program;
      this.inverse = inverse;

      this.openStrip = openStrip;
      this.inverseStrip = inverseStrip;
      this.closeStrip = closeStrip;
    },

    PartialStatement: function (name, params, hash, strip, locInfo) {
      this.loc = locInfo;
      this.type = 'PartialStatement';

      this.name = name;
      this.params = params || [];
      this.hash = hash;

      this.indent = '';
      this.strip = strip;
    },

    ContentStatement: function (string, locInfo) {
      this.loc = locInfo;
      this.type = 'ContentStatement';
      this.original = this.value = string;
    },

    CommentStatement: function (comment, strip, locInfo) {
      this.loc = locInfo;
      this.type = 'CommentStatement';
      this.value = comment;

      this.strip = strip;
    },

    SubExpression: function (path, params, hash, locInfo) {
      this.loc = locInfo;

      this.type = 'SubExpression';
      this.path = path;
      this.params = params || [];
      this.hash = hash;
    },

    PathExpression: function (data, depth, parts, original, locInfo) {
      this.loc = locInfo;
      this.type = 'PathExpression';

      this.data = data;
      this.original = original;
      this.parts = parts;
      this.depth = depth;
    },

    StringLiteral: function (string, locInfo) {
      this.loc = locInfo;
      this.type = 'StringLiteral';
      this.original = this.value = string;
    },

    NumberLiteral: function (number, locInfo) {
      this.loc = locInfo;
      this.type = 'NumberLiteral';
      this.original = this.value = Number(number);
    },

    BooleanLiteral: function (bool, locInfo) {
      this.loc = locInfo;
      this.type = 'BooleanLiteral';
      this.original = this.value = bool === 'true';
    },

    UndefinedLiteral: function (locInfo) {
      this.loc = locInfo;
      this.type = 'UndefinedLiteral';
      this.original = this.value = undefined;
    },

    NullLiteral: function (locInfo) {
      this.loc = locInfo;
      this.type = 'NullLiteral';
      this.original = this.value = null;
    },

    Hash: function (pairs, locInfo) {
      this.loc = locInfo;
      this.type = 'Hash';
      this.pairs = pairs;
    },
    HashPair: function (key, value, locInfo) {
      this.loc = locInfo;
      this.type = 'HashPair';
      this.key = key;
      this.value = value;
    },

    // Public API used to evaluate derived attributes regarding AST nodes
    helpers: {
      // a mustache is definitely a helper if:
      // * it is an eligible helper, and
      // * it has at least one parameter or hash segment
      helperExpression: function (node) {
        return !!(node.type === 'SubExpression' || node.params.length || node.hash);
      },

      scopedId: function (path) {
        return (/^\.|this\b/.test(path.original)
        );
      },

      // an ID is simple if it only has one part, and that part is not
      // `..` or `this`.
      simpleId: function (path) {
        return path.parts.length === 1 && !AST.helpers.scopedId(path) && !path.depth;
      }
    }
  };

  // Must be exported as an object rather than the root of the module as the jison lexer
  // must modify the object to operate properly.
  exports.default = AST;
});

enifed('handlebars/compiler/base', ['exports', './parser', './ast', './whitespace-control', './helpers', '../utils'], function (exports, _parser, _ast, _whitespaceControl, _helpers, _utils) {
  'use strict';

  exports.parse = parse;
  exports.parser = _parser.default;

  var yy = {};
  _utils.extend(yy, _helpers, _ast.default);

  function parse(input, options) {
    // Just return if an already-compiled AST was passed in.
    if (input.type === 'Program') {
      return input;
    }

    _parser.default.yy = yy;

    // Altering the shared object here, but this is ok as parser is a sync operation
    yy.locInfo = function (locInfo) {
      return new yy.SourceLocation(options && options.srcName, locInfo);
    };

    var strip = new _whitespaceControl.default();
    return strip.accept(_parser.default.parse(input));
  }
});

enifed('handlebars/compiler/helpers', ['exports', '../exception'], function (exports, _exception) {
  'use strict';

  exports.SourceLocation = SourceLocation;
  exports.id = id;
  exports.stripFlags = stripFlags;
  exports.stripComment = stripComment;
  exports.preparePath = preparePath;
  exports.prepareMustache = prepareMustache;
  exports.prepareRawBlock = prepareRawBlock;
  exports.prepareBlock = prepareBlock;

  function SourceLocation(source, locInfo) {
    this.source = source;
    this.start = {
      line: locInfo.first_line,
      column: locInfo.first_column
    };
    this.end = {
      line: locInfo.last_line,
      column: locInfo.last_column
    };
  }

  function id(token) {
    if (/^\[.*\]$/.test(token)) {
      return token.substr(1, token.length - 2);
    } else {
      return token;
    }
  }

  function stripFlags(open, close) {
    return {
      open: open.charAt(2) === '~',
      close: close.charAt(close.length - 3) === '~'
    };
  }

  function stripComment(comment) {
    return comment.replace(/^\{\{~?\!-?-?/, '').replace(/-?-?~?\}\}$/, '');
  }

  function preparePath(data, parts, locInfo) {
    locInfo = this.locInfo(locInfo);

    var original = data ? '@' : '',
        dig = [],
        depth = 0,
        depthString = '';

    for (var i = 0, l = parts.length; i < l; i++) {
      var part = parts[i].part,

      // If we have [] syntax then we do not treat path references as operators,
      // i.e. foo.[this] resolves to approximately context.foo['this']
      isLiteral = parts[i].original !== part;
      original += (parts[i].separator || '') + part;

      if (!isLiteral && (part === '..' || part === '.' || part === 'this')) {
        if (dig.length > 0) {
          throw new _exception.default('Invalid path: ' + original, { loc: locInfo });
        } else if (part === '..') {
          depth++;
          depthString += '../';
        }
      } else {
        dig.push(part);
      }
    }

    return new this.PathExpression(data, depth, dig, original, locInfo);
  }

  function prepareMustache(path, params, hash, open, strip, locInfo) {
    // Must use charAt to support IE pre-10
    var escapeFlag = open.charAt(3) || open.charAt(2),
        escaped = escapeFlag !== '{' && escapeFlag !== '&';

    return new this.MustacheStatement(path, params, hash, escaped, strip, this.locInfo(locInfo));
  }

  function prepareRawBlock(openRawBlock, content, close, locInfo) {
    if (openRawBlock.path.original !== close) {
      var errorNode = { loc: openRawBlock.path.loc };

      throw new _exception.default(openRawBlock.path.original + " doesn't match " + close, errorNode);
    }

    locInfo = this.locInfo(locInfo);
    var program = new this.Program([content], null, {}, locInfo);

    return new this.BlockStatement(openRawBlock.path, openRawBlock.params, openRawBlock.hash, program, undefined, {}, {}, {}, locInfo);
  }

  function prepareBlock(openBlock, program, inverseAndProgram, close, inverted, locInfo) {
    // When we are chaining inverse calls, we will not have a close path
    if (close && close.path && openBlock.path.original !== close.path.original) {
      var errorNode = { loc: openBlock.path.loc };

      throw new _exception.default(openBlock.path.original + ' doesn\'t match ' + close.path.original, errorNode);
    }

    program.blockParams = openBlock.blockParams;

    var inverse = undefined,
        inverseStrip = undefined;

    if (inverseAndProgram) {
      if (inverseAndProgram.chain) {
        inverseAndProgram.program.body[0].closeStrip = close.strip;
      }

      inverseStrip = inverseAndProgram.strip;
      inverse = inverseAndProgram.program;
    }

    if (inverted) {
      inverted = inverse;
      inverse = program;
      program = inverted;
    }

    return new this.BlockStatement(openBlock.path, openBlock.params, openBlock.hash, program, inverse, openBlock.strip, inverseStrip, close && close.strip, this.locInfo(locInfo));
  }
});

enifed("handlebars/compiler/parser", ["exports"], function (exports) {
    /* istanbul ignore next */
    /* Jison generated parser */
    "use strict";

    var handlebars = (function () {
        var parser = { trace: function trace() {},
            yy: {},
            symbols_: { "error": 2, "root": 3, "program": 4, "EOF": 5, "program_repetition0": 6, "statement": 7, "mustache": 8, "block": 9, "rawBlock": 10, "partial": 11, "content": 12, "COMMENT": 13, "CONTENT": 14, "openRawBlock": 15, "END_RAW_BLOCK": 16, "OPEN_RAW_BLOCK": 17, "helperName": 18, "openRawBlock_repetition0": 19, "openRawBlock_option0": 20, "CLOSE_RAW_BLOCK": 21, "openBlock": 22, "block_option0": 23, "closeBlock": 24, "openInverse": 25, "block_option1": 26, "OPEN_BLOCK": 27, "openBlock_repetition0": 28, "openBlock_option0": 29, "openBlock_option1": 30, "CLOSE": 31, "OPEN_INVERSE": 32, "openInverse_repetition0": 33, "openInverse_option0": 34, "openInverse_option1": 35, "openInverseChain": 36, "OPEN_INVERSE_CHAIN": 37, "openInverseChain_repetition0": 38, "openInverseChain_option0": 39, "openInverseChain_option1": 40, "inverseAndProgram": 41, "INVERSE": 42, "inverseChain": 43, "inverseChain_option0": 44, "OPEN_ENDBLOCK": 45, "OPEN": 46, "mustache_repetition0": 47, "mustache_option0": 48, "OPEN_UNESCAPED": 49, "mustache_repetition1": 50, "mustache_option1": 51, "CLOSE_UNESCAPED": 52, "OPEN_PARTIAL": 53, "partialName": 54, "partial_repetition0": 55, "partial_option0": 56, "param": 57, "sexpr": 58, "OPEN_SEXPR": 59, "sexpr_repetition0": 60, "sexpr_option0": 61, "CLOSE_SEXPR": 62, "hash": 63, "hash_repetition_plus0": 64, "hashSegment": 65, "ID": 66, "EQUALS": 67, "blockParams": 68, "OPEN_BLOCK_PARAMS": 69, "blockParams_repetition_plus0": 70, "CLOSE_BLOCK_PARAMS": 71, "path": 72, "dataName": 73, "STRING": 74, "NUMBER": 75, "BOOLEAN": 76, "UNDEFINED": 77, "NULL": 78, "DATA": 79, "pathSegments": 80, "SEP": 81, "$accept": 0, "$end": 1 },
            terminals_: { 2: "error", 5: "EOF", 13: "COMMENT", 14: "CONTENT", 16: "END_RAW_BLOCK", 17: "OPEN_RAW_BLOCK", 21: "CLOSE_RAW_BLOCK", 27: "OPEN_BLOCK", 31: "CLOSE", 32: "OPEN_INVERSE", 37: "OPEN_INVERSE_CHAIN", 42: "INVERSE", 45: "OPEN_ENDBLOCK", 46: "OPEN", 49: "OPEN_UNESCAPED", 52: "CLOSE_UNESCAPED", 53: "OPEN_PARTIAL", 59: "OPEN_SEXPR", 62: "CLOSE_SEXPR", 66: "ID", 67: "EQUALS", 69: "OPEN_BLOCK_PARAMS", 71: "CLOSE_BLOCK_PARAMS", 74: "STRING", 75: "NUMBER", 76: "BOOLEAN", 77: "UNDEFINED", 78: "NULL", 79: "DATA", 81: "SEP" },
            productions_: [0, [3, 2], [4, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [12, 1], [10, 3], [15, 5], [9, 4], [9, 4], [22, 6], [25, 6], [36, 6], [41, 2], [43, 3], [43, 1], [24, 3], [8, 5], [8, 5], [11, 5], [57, 1], [57, 1], [58, 5], [63, 1], [65, 3], [68, 3], [18, 1], [18, 1], [18, 1], [18, 1], [18, 1], [18, 1], [18, 1], [54, 1], [54, 1], [73, 2], [72, 1], [80, 3], [80, 1], [6, 0], [6, 2], [19, 0], [19, 2], [20, 0], [20, 1], [23, 0], [23, 1], [26, 0], [26, 1], [28, 0], [28, 2], [29, 0], [29, 1], [30, 0], [30, 1], [33, 0], [33, 2], [34, 0], [34, 1], [35, 0], [35, 1], [38, 0], [38, 2], [39, 0], [39, 1], [40, 0], [40, 1], [44, 0], [44, 1], [47, 0], [47, 2], [48, 0], [48, 1], [50, 0], [50, 2], [51, 0], [51, 1], [55, 0], [55, 2], [56, 0], [56, 1], [60, 0], [60, 2], [61, 0], [61, 1], [64, 1], [64, 2], [70, 1], [70, 2]],
            performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$) {

                var $0 = $$.length - 1;
                switch (yystate) {
                    case 1:
                        return $$[$0 - 1];
                        break;
                    case 2:
                        this.$ = new yy.Program($$[$0], null, {}, yy.locInfo(this._$));
                        break;
                    case 3:
                        this.$ = $$[$0];
                        break;
                    case 4:
                        this.$ = $$[$0];
                        break;
                    case 5:
                        this.$ = $$[$0];
                        break;
                    case 6:
                        this.$ = $$[$0];
                        break;
                    case 7:
                        this.$ = $$[$0];
                        break;
                    case 8:
                        this.$ = new yy.CommentStatement(yy.stripComment($$[$0]), yy.stripFlags($$[$0], $$[$0]), yy.locInfo(this._$));
                        break;
                    case 9:
                        this.$ = new yy.ContentStatement($$[$0], yy.locInfo(this._$));
                        break;
                    case 10:
                        this.$ = yy.prepareRawBlock($$[$0 - 2], $$[$0 - 1], $$[$0], this._$);
                        break;
                    case 11:
                        this.$ = { path: $$[$0 - 3], params: $$[$0 - 2], hash: $$[$0 - 1] };
                        break;
                    case 12:
                        this.$ = yy.prepareBlock($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0], false, this._$);
                        break;
                    case 13:
                        this.$ = yy.prepareBlock($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0], true, this._$);
                        break;
                    case 14:
                        this.$ = { path: $$[$0 - 4], params: $$[$0 - 3], hash: $$[$0 - 2], blockParams: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 5], $$[$0]) };
                        break;
                    case 15:
                        this.$ = { path: $$[$0 - 4], params: $$[$0 - 3], hash: $$[$0 - 2], blockParams: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 5], $$[$0]) };
                        break;
                    case 16:
                        this.$ = { path: $$[$0 - 4], params: $$[$0 - 3], hash: $$[$0 - 2], blockParams: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 5], $$[$0]) };
                        break;
                    case 17:
                        this.$ = { strip: yy.stripFlags($$[$0 - 1], $$[$0 - 1]), program: $$[$0] };
                        break;
                    case 18:
                        var inverse = yy.prepareBlock($$[$0 - 2], $$[$0 - 1], $$[$0], $$[$0], false, this._$),
                            program = new yy.Program([inverse], null, {}, yy.locInfo(this._$));
                        program.chained = true;

                        this.$ = { strip: $$[$0 - 2].strip, program: program, chain: true };

                        break;
                    case 19:
                        this.$ = $$[$0];
                        break;
                    case 20:
                        this.$ = { path: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 2], $$[$0]) };
                        break;
                    case 21:
                        this.$ = yy.prepareMustache($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0 - 4], yy.stripFlags($$[$0 - 4], $$[$0]), this._$);
                        break;
                    case 22:
                        this.$ = yy.prepareMustache($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0 - 4], yy.stripFlags($$[$0 - 4], $$[$0]), this._$);
                        break;
                    case 23:
                        this.$ = new yy.PartialStatement($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], yy.stripFlags($$[$0 - 4], $$[$0]), yy.locInfo(this._$));
                        break;
                    case 24:
                        this.$ = $$[$0];
                        break;
                    case 25:
                        this.$ = $$[$0];
                        break;
                    case 26:
                        this.$ = new yy.SubExpression($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], yy.locInfo(this._$));
                        break;
                    case 27:
                        this.$ = new yy.Hash($$[$0], yy.locInfo(this._$));
                        break;
                    case 28:
                        this.$ = new yy.HashPair(yy.id($$[$0 - 2]), $$[$0], yy.locInfo(this._$));
                        break;
                    case 29:
                        this.$ = yy.id($$[$0 - 1]);
                        break;
                    case 30:
                        this.$ = $$[$0];
                        break;
                    case 31:
                        this.$ = $$[$0];
                        break;
                    case 32:
                        this.$ = new yy.StringLiteral($$[$0], yy.locInfo(this._$));
                        break;
                    case 33:
                        this.$ = new yy.NumberLiteral($$[$0], yy.locInfo(this._$));
                        break;
                    case 34:
                        this.$ = new yy.BooleanLiteral($$[$0], yy.locInfo(this._$));
                        break;
                    case 35:
                        this.$ = new yy.UndefinedLiteral(yy.locInfo(this._$));
                        break;
                    case 36:
                        this.$ = new yy.NullLiteral(yy.locInfo(this._$));
                        break;
                    case 37:
                        this.$ = $$[$0];
                        break;
                    case 38:
                        this.$ = $$[$0];
                        break;
                    case 39:
                        this.$ = yy.preparePath(true, $$[$0], this._$);
                        break;
                    case 40:
                        this.$ = yy.preparePath(false, $$[$0], this._$);
                        break;
                    case 41:
                        $$[$0 - 2].push({ part: yy.id($$[$0]), original: $$[$0], separator: $$[$0 - 1] });this.$ = $$[$0 - 2];
                        break;
                    case 42:
                        this.$ = [{ part: yy.id($$[$0]), original: $$[$0] }];
                        break;
                    case 43:
                        this.$ = [];
                        break;
                    case 44:
                        $$[$0 - 1].push($$[$0]);
                        break;
                    case 45:
                        this.$ = [];
                        break;
                    case 46:
                        $$[$0 - 1].push($$[$0]);
                        break;
                    case 53:
                        this.$ = [];
                        break;
                    case 54:
                        $$[$0 - 1].push($$[$0]);
                        break;
                    case 59:
                        this.$ = [];
                        break;
                    case 60:
                        $$[$0 - 1].push($$[$0]);
                        break;
                    case 65:
                        this.$ = [];
                        break;
                    case 66:
                        $$[$0 - 1].push($$[$0]);
                        break;
                    case 73:
                        this.$ = [];
                        break;
                    case 74:
                        $$[$0 - 1].push($$[$0]);
                        break;
                    case 77:
                        this.$ = [];
                        break;
                    case 78:
                        $$[$0 - 1].push($$[$0]);
                        break;
                    case 81:
                        this.$ = [];
                        break;
                    case 82:
                        $$[$0 - 1].push($$[$0]);
                        break;
                    case 85:
                        this.$ = [];
                        break;
                    case 86:
                        $$[$0 - 1].push($$[$0]);
                        break;
                    case 89:
                        this.$ = [$$[$0]];
                        break;
                    case 90:
                        $$[$0 - 1].push($$[$0]);
                        break;
                    case 91:
                        this.$ = [$$[$0]];
                        break;
                    case 92:
                        $$[$0 - 1].push($$[$0]);
                        break;
                }
            },
            table: [{ 3: 1, 4: 2, 5: [2, 43], 6: 3, 13: [2, 43], 14: [2, 43], 17: [2, 43], 27: [2, 43], 32: [2, 43], 46: [2, 43], 49: [2, 43], 53: [2, 43] }, { 1: [3] }, { 5: [1, 4] }, { 5: [2, 2], 7: 5, 8: 6, 9: 7, 10: 8, 11: 9, 12: 10, 13: [1, 11], 14: [1, 18], 15: 16, 17: [1, 21], 22: 14, 25: 15, 27: [1, 19], 32: [1, 20], 37: [2, 2], 42: [2, 2], 45: [2, 2], 46: [1, 12], 49: [1, 13], 53: [1, 17] }, { 1: [2, 1] }, { 5: [2, 44], 13: [2, 44], 14: [2, 44], 17: [2, 44], 27: [2, 44], 32: [2, 44], 37: [2, 44], 42: [2, 44], 45: [2, 44], 46: [2, 44], 49: [2, 44], 53: [2, 44] }, { 5: [2, 3], 13: [2, 3], 14: [2, 3], 17: [2, 3], 27: [2, 3], 32: [2, 3], 37: [2, 3], 42: [2, 3], 45: [2, 3], 46: [2, 3], 49: [2, 3], 53: [2, 3] }, { 5: [2, 4], 13: [2, 4], 14: [2, 4], 17: [2, 4], 27: [2, 4], 32: [2, 4], 37: [2, 4], 42: [2, 4], 45: [2, 4], 46: [2, 4], 49: [2, 4], 53: [2, 4] }, { 5: [2, 5], 13: [2, 5], 14: [2, 5], 17: [2, 5], 27: [2, 5], 32: [2, 5], 37: [2, 5], 42: [2, 5], 45: [2, 5], 46: [2, 5], 49: [2, 5], 53: [2, 5] }, { 5: [2, 6], 13: [2, 6], 14: [2, 6], 17: [2, 6], 27: [2, 6], 32: [2, 6], 37: [2, 6], 42: [2, 6], 45: [2, 6], 46: [2, 6], 49: [2, 6], 53: [2, 6] }, { 5: [2, 7], 13: [2, 7], 14: [2, 7], 17: [2, 7], 27: [2, 7], 32: [2, 7], 37: [2, 7], 42: [2, 7], 45: [2, 7], 46: [2, 7], 49: [2, 7], 53: [2, 7] }, { 5: [2, 8], 13: [2, 8], 14: [2, 8], 17: [2, 8], 27: [2, 8], 32: [2, 8], 37: [2, 8], 42: [2, 8], 45: [2, 8], 46: [2, 8], 49: [2, 8], 53: [2, 8] }, { 18: 22, 66: [1, 32], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 18: 33, 66: [1, 32], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 4: 34, 6: 3, 13: [2, 43], 14: [2, 43], 17: [2, 43], 27: [2, 43], 32: [2, 43], 37: [2, 43], 42: [2, 43], 45: [2, 43], 46: [2, 43], 49: [2, 43], 53: [2, 43] }, { 4: 35, 6: 3, 13: [2, 43], 14: [2, 43], 17: [2, 43], 27: [2, 43], 32: [2, 43], 42: [2, 43], 45: [2, 43], 46: [2, 43], 49: [2, 43], 53: [2, 43] }, { 12: 36, 14: [1, 18] }, { 18: 38, 54: 37, 58: 39, 59: [1, 40], 66: [1, 32], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 5: [2, 9], 13: [2, 9], 14: [2, 9], 16: [2, 9], 17: [2, 9], 27: [2, 9], 32: [2, 9], 37: [2, 9], 42: [2, 9], 45: [2, 9], 46: [2, 9], 49: [2, 9], 53: [2, 9] }, { 18: 41, 66: [1, 32], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 18: 42, 66: [1, 32], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 18: 43, 66: [1, 32], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 31: [2, 73], 47: 44, 59: [2, 73], 66: [2, 73], 74: [2, 73], 75: [2, 73], 76: [2, 73], 77: [2, 73], 78: [2, 73], 79: [2, 73] }, { 21: [2, 30], 31: [2, 30], 52: [2, 30], 59: [2, 30], 62: [2, 30], 66: [2, 30], 69: [2, 30], 74: [2, 30], 75: [2, 30], 76: [2, 30], 77: [2, 30], 78: [2, 30], 79: [2, 30] }, { 21: [2, 31], 31: [2, 31], 52: [2, 31], 59: [2, 31], 62: [2, 31], 66: [2, 31], 69: [2, 31], 74: [2, 31], 75: [2, 31], 76: [2, 31], 77: [2, 31], 78: [2, 31], 79: [2, 31] }, { 21: [2, 32], 31: [2, 32], 52: [2, 32], 59: [2, 32], 62: [2, 32], 66: [2, 32], 69: [2, 32], 74: [2, 32], 75: [2, 32], 76: [2, 32], 77: [2, 32], 78: [2, 32], 79: [2, 32] }, { 21: [2, 33], 31: [2, 33], 52: [2, 33], 59: [2, 33], 62: [2, 33], 66: [2, 33], 69: [2, 33], 74: [2, 33], 75: [2, 33], 76: [2, 33], 77: [2, 33], 78: [2, 33], 79: [2, 33] }, { 21: [2, 34], 31: [2, 34], 52: [2, 34], 59: [2, 34], 62: [2, 34], 66: [2, 34], 69: [2, 34], 74: [2, 34], 75: [2, 34], 76: [2, 34], 77: [2, 34], 78: [2, 34], 79: [2, 34] }, { 21: [2, 35], 31: [2, 35], 52: [2, 35], 59: [2, 35], 62: [2, 35], 66: [2, 35], 69: [2, 35], 74: [2, 35], 75: [2, 35], 76: [2, 35], 77: [2, 35], 78: [2, 35], 79: [2, 35] }, { 21: [2, 36], 31: [2, 36], 52: [2, 36], 59: [2, 36], 62: [2, 36], 66: [2, 36], 69: [2, 36], 74: [2, 36], 75: [2, 36], 76: [2, 36], 77: [2, 36], 78: [2, 36], 79: [2, 36] }, { 21: [2, 40], 31: [2, 40], 52: [2, 40], 59: [2, 40], 62: [2, 40], 66: [2, 40], 69: [2, 40], 74: [2, 40], 75: [2, 40], 76: [2, 40], 77: [2, 40], 78: [2, 40], 79: [2, 40], 81: [1, 45] }, { 66: [1, 32], 80: 46 }, { 21: [2, 42], 31: [2, 42], 52: [2, 42], 59: [2, 42], 62: [2, 42], 66: [2, 42], 69: [2, 42], 74: [2, 42], 75: [2, 42], 76: [2, 42], 77: [2, 42], 78: [2, 42], 79: [2, 42], 81: [2, 42] }, { 50: 47, 52: [2, 77], 59: [2, 77], 66: [2, 77], 74: [2, 77], 75: [2, 77], 76: [2, 77], 77: [2, 77], 78: [2, 77], 79: [2, 77] }, { 23: 48, 36: 50, 37: [1, 52], 41: 51, 42: [1, 53], 43: 49, 45: [2, 49] }, { 26: 54, 41: 55, 42: [1, 53], 45: [2, 51] }, { 16: [1, 56] }, { 31: [2, 81], 55: 57, 59: [2, 81], 66: [2, 81], 74: [2, 81], 75: [2, 81], 76: [2, 81], 77: [2, 81], 78: [2, 81], 79: [2, 81] }, { 31: [2, 37], 59: [2, 37], 66: [2, 37], 74: [2, 37], 75: [2, 37], 76: [2, 37], 77: [2, 37], 78: [2, 37], 79: [2, 37] }, { 31: [2, 38], 59: [2, 38], 66: [2, 38], 74: [2, 38], 75: [2, 38], 76: [2, 38], 77: [2, 38], 78: [2, 38], 79: [2, 38] }, { 18: 58, 66: [1, 32], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 28: 59, 31: [2, 53], 59: [2, 53], 66: [2, 53], 69: [2, 53], 74: [2, 53], 75: [2, 53], 76: [2, 53], 77: [2, 53], 78: [2, 53], 79: [2, 53] }, { 31: [2, 59], 33: 60, 59: [2, 59], 66: [2, 59], 69: [2, 59], 74: [2, 59], 75: [2, 59], 76: [2, 59], 77: [2, 59], 78: [2, 59], 79: [2, 59] }, { 19: 61, 21: [2, 45], 59: [2, 45], 66: [2, 45], 74: [2, 45], 75: [2, 45], 76: [2, 45], 77: [2, 45], 78: [2, 45], 79: [2, 45] }, { 18: 65, 31: [2, 75], 48: 62, 57: 63, 58: 66, 59: [1, 40], 63: 64, 64: 67, 65: 68, 66: [1, 69], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 66: [1, 70] }, { 21: [2, 39], 31: [2, 39], 52: [2, 39], 59: [2, 39], 62: [2, 39], 66: [2, 39], 69: [2, 39], 74: [2, 39], 75: [2, 39], 76: [2, 39], 77: [2, 39], 78: [2, 39], 79: [2, 39], 81: [1, 45] }, { 18: 65, 51: 71, 52: [2, 79], 57: 72, 58: 66, 59: [1, 40], 63: 73, 64: 67, 65: 68, 66: [1, 69], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 24: 74, 45: [1, 75] }, { 45: [2, 50] }, { 4: 76, 6: 3, 13: [2, 43], 14: [2, 43], 17: [2, 43], 27: [2, 43], 32: [2, 43], 37: [2, 43], 42: [2, 43], 45: [2, 43], 46: [2, 43], 49: [2, 43], 53: [2, 43] }, { 45: [2, 19] }, { 18: 77, 66: [1, 32], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 4: 78, 6: 3, 13: [2, 43], 14: [2, 43], 17: [2, 43], 27: [2, 43], 32: [2, 43], 45: [2, 43], 46: [2, 43], 49: [2, 43], 53: [2, 43] }, { 24: 79, 45: [1, 75] }, { 45: [2, 52] }, { 5: [2, 10], 13: [2, 10], 14: [2, 10], 17: [2, 10], 27: [2, 10], 32: [2, 10], 37: [2, 10], 42: [2, 10], 45: [2, 10], 46: [2, 10], 49: [2, 10], 53: [2, 10] }, { 18: 65, 31: [2, 83], 56: 80, 57: 81, 58: 66, 59: [1, 40], 63: 82, 64: 67, 65: 68, 66: [1, 69], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 59: [2, 85], 60: 83, 62: [2, 85], 66: [2, 85], 74: [2, 85], 75: [2, 85], 76: [2, 85], 77: [2, 85], 78: [2, 85], 79: [2, 85] }, { 18: 65, 29: 84, 31: [2, 55], 57: 85, 58: 66, 59: [1, 40], 63: 86, 64: 67, 65: 68, 66: [1, 69], 69: [2, 55], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 18: 65, 31: [2, 61], 34: 87, 57: 88, 58: 66, 59: [1, 40], 63: 89, 64: 67, 65: 68, 66: [1, 69], 69: [2, 61], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 18: 65, 20: 90, 21: [2, 47], 57: 91, 58: 66, 59: [1, 40], 63: 92, 64: 67, 65: 68, 66: [1, 69], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 31: [1, 93] }, { 31: [2, 74], 59: [2, 74], 66: [2, 74], 74: [2, 74], 75: [2, 74], 76: [2, 74], 77: [2, 74], 78: [2, 74], 79: [2, 74] }, { 31: [2, 76] }, { 21: [2, 24], 31: [2, 24], 52: [2, 24], 59: [2, 24], 62: [2, 24], 66: [2, 24], 69: [2, 24], 74: [2, 24], 75: [2, 24], 76: [2, 24], 77: [2, 24], 78: [2, 24], 79: [2, 24] }, { 21: [2, 25], 31: [2, 25], 52: [2, 25], 59: [2, 25], 62: [2, 25], 66: [2, 25], 69: [2, 25], 74: [2, 25], 75: [2, 25], 76: [2, 25], 77: [2, 25], 78: [2, 25], 79: [2, 25] }, { 21: [2, 27], 31: [2, 27], 52: [2, 27], 62: [2, 27], 65: 94, 66: [1, 95], 69: [2, 27] }, { 21: [2, 89], 31: [2, 89], 52: [2, 89], 62: [2, 89], 66: [2, 89], 69: [2, 89] }, { 21: [2, 42], 31: [2, 42], 52: [2, 42], 59: [2, 42], 62: [2, 42], 66: [2, 42], 67: [1, 96], 69: [2, 42], 74: [2, 42], 75: [2, 42], 76: [2, 42], 77: [2, 42], 78: [2, 42], 79: [2, 42], 81: [2, 42] }, { 21: [2, 41], 31: [2, 41], 52: [2, 41], 59: [2, 41], 62: [2, 41], 66: [2, 41], 69: [2, 41], 74: [2, 41], 75: [2, 41], 76: [2, 41], 77: [2, 41], 78: [2, 41], 79: [2, 41], 81: [2, 41] }, { 52: [1, 97] }, { 52: [2, 78], 59: [2, 78], 66: [2, 78], 74: [2, 78], 75: [2, 78], 76: [2, 78], 77: [2, 78], 78: [2, 78], 79: [2, 78] }, { 52: [2, 80] }, { 5: [2, 12], 13: [2, 12], 14: [2, 12], 17: [2, 12], 27: [2, 12], 32: [2, 12], 37: [2, 12], 42: [2, 12], 45: [2, 12], 46: [2, 12], 49: [2, 12], 53: [2, 12] }, { 18: 98, 66: [1, 32], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 36: 50, 37: [1, 52], 41: 51, 42: [1, 53], 43: 100, 44: 99, 45: [2, 71] }, { 31: [2, 65], 38: 101, 59: [2, 65], 66: [2, 65], 69: [2, 65], 74: [2, 65], 75: [2, 65], 76: [2, 65], 77: [2, 65], 78: [2, 65], 79: [2, 65] }, { 45: [2, 17] }, { 5: [2, 13], 13: [2, 13], 14: [2, 13], 17: [2, 13], 27: [2, 13], 32: [2, 13], 37: [2, 13], 42: [2, 13], 45: [2, 13], 46: [2, 13], 49: [2, 13], 53: [2, 13] }, { 31: [1, 102] }, { 31: [2, 82], 59: [2, 82], 66: [2, 82], 74: [2, 82], 75: [2, 82], 76: [2, 82], 77: [2, 82], 78: [2, 82], 79: [2, 82] }, { 31: [2, 84] }, { 18: 65, 57: 104, 58: 66, 59: [1, 40], 61: 103, 62: [2, 87], 63: 105, 64: 67, 65: 68, 66: [1, 69], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 30: 106, 31: [2, 57], 68: 107, 69: [1, 108] }, { 31: [2, 54], 59: [2, 54], 66: [2, 54], 69: [2, 54], 74: [2, 54], 75: [2, 54], 76: [2, 54], 77: [2, 54], 78: [2, 54], 79: [2, 54] }, { 31: [2, 56], 69: [2, 56] }, { 31: [2, 63], 35: 109, 68: 110, 69: [1, 108] }, { 31: [2, 60], 59: [2, 60], 66: [2, 60], 69: [2, 60], 74: [2, 60], 75: [2, 60], 76: [2, 60], 77: [2, 60], 78: [2, 60], 79: [2, 60] }, { 31: [2, 62], 69: [2, 62] }, { 21: [1, 111] }, { 21: [2, 46], 59: [2, 46], 66: [2, 46], 74: [2, 46], 75: [2, 46], 76: [2, 46], 77: [2, 46], 78: [2, 46], 79: [2, 46] }, { 21: [2, 48] }, { 5: [2, 21], 13: [2, 21], 14: [2, 21], 17: [2, 21], 27: [2, 21], 32: [2, 21], 37: [2, 21], 42: [2, 21], 45: [2, 21], 46: [2, 21], 49: [2, 21], 53: [2, 21] }, { 21: [2, 90], 31: [2, 90], 52: [2, 90], 62: [2, 90], 66: [2, 90], 69: [2, 90] }, { 67: [1, 96] }, { 18: 65, 57: 112, 58: 66, 59: [1, 40], 66: [1, 32], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 5: [2, 22], 13: [2, 22], 14: [2, 22], 17: [2, 22], 27: [2, 22], 32: [2, 22], 37: [2, 22], 42: [2, 22], 45: [2, 22], 46: [2, 22], 49: [2, 22], 53: [2, 22] }, { 31: [1, 113] }, { 45: [2, 18] }, { 45: [2, 72] }, { 18: 65, 31: [2, 67], 39: 114, 57: 115, 58: 66, 59: [1, 40], 63: 116, 64: 67, 65: 68, 66: [1, 69], 69: [2, 67], 72: 23, 73: 24, 74: [1, 25], 75: [1, 26], 76: [1, 27], 77: [1, 28], 78: [1, 29], 79: [1, 31], 80: 30 }, { 5: [2, 23], 13: [2, 23], 14: [2, 23], 17: [2, 23], 27: [2, 23], 32: [2, 23], 37: [2, 23], 42: [2, 23], 45: [2, 23], 46: [2, 23], 49: [2, 23], 53: [2, 23] }, { 62: [1, 117] }, { 59: [2, 86], 62: [2, 86], 66: [2, 86], 74: [2, 86], 75: [2, 86], 76: [2, 86], 77: [2, 86], 78: [2, 86], 79: [2, 86] }, { 62: [2, 88] }, { 31: [1, 118] }, { 31: [2, 58] }, { 66: [1, 120], 70: 119 }, { 31: [1, 121] }, { 31: [2, 64] }, { 14: [2, 11] }, { 21: [2, 28], 31: [2, 28], 52: [2, 28], 62: [2, 28], 66: [2, 28], 69: [2, 28] }, { 5: [2, 20], 13: [2, 20], 14: [2, 20], 17: [2, 20], 27: [2, 20], 32: [2, 20], 37: [2, 20], 42: [2, 20], 45: [2, 20], 46: [2, 20], 49: [2, 20], 53: [2, 20] }, { 31: [2, 69], 40: 122, 68: 123, 69: [1, 108] }, { 31: [2, 66], 59: [2, 66], 66: [2, 66], 69: [2, 66], 74: [2, 66], 75: [2, 66], 76: [2, 66], 77: [2, 66], 78: [2, 66], 79: [2, 66] }, { 31: [2, 68], 69: [2, 68] }, { 21: [2, 26], 31: [2, 26], 52: [2, 26], 59: [2, 26], 62: [2, 26], 66: [2, 26], 69: [2, 26], 74: [2, 26], 75: [2, 26], 76: [2, 26], 77: [2, 26], 78: [2, 26], 79: [2, 26] }, { 13: [2, 14], 14: [2, 14], 17: [2, 14], 27: [2, 14], 32: [2, 14], 37: [2, 14], 42: [2, 14], 45: [2, 14], 46: [2, 14], 49: [2, 14], 53: [2, 14] }, { 66: [1, 125], 71: [1, 124] }, { 66: [2, 91], 71: [2, 91] }, { 13: [2, 15], 14: [2, 15], 17: [2, 15], 27: [2, 15], 32: [2, 15], 42: [2, 15], 45: [2, 15], 46: [2, 15], 49: [2, 15], 53: [2, 15] }, { 31: [1, 126] }, { 31: [2, 70] }, { 31: [2, 29] }, { 66: [2, 92], 71: [2, 92] }, { 13: [2, 16], 14: [2, 16], 17: [2, 16], 27: [2, 16], 32: [2, 16], 37: [2, 16], 42: [2, 16], 45: [2, 16], 46: [2, 16], 49: [2, 16], 53: [2, 16] }],
            defaultActions: { 4: [2, 1], 49: [2, 50], 51: [2, 19], 55: [2, 52], 64: [2, 76], 73: [2, 80], 78: [2, 17], 82: [2, 84], 92: [2, 48], 99: [2, 18], 100: [2, 72], 105: [2, 88], 107: [2, 58], 110: [2, 64], 111: [2, 11], 123: [2, 70], 124: [2, 29] },
            parseError: function parseError(str, hash) {
                throw new Error(str);
            },
            parse: function parse(input) {
                var self = this,
                    stack = [0],
                    vstack = [null],
                    lstack = [],
                    table = this.table,
                    yytext = "",
                    yylineno = 0,
                    yyleng = 0,
                    recovering = 0,
                    TERROR = 2,
                    EOF = 1;
                this.lexer.setInput(input);
                this.lexer.yy = this.yy;
                this.yy.lexer = this.lexer;
                this.yy.parser = this;
                if (typeof this.lexer.yylloc == "undefined") this.lexer.yylloc = {};
                var yyloc = this.lexer.yylloc;
                lstack.push(yyloc);
                var ranges = this.lexer.options && this.lexer.options.ranges;
                if (typeof this.yy.parseError === "function") this.parseError = this.yy.parseError;
                function popStack(n) {
                    stack.length = stack.length - 2 * n;
                    vstack.length = vstack.length - n;
                    lstack.length = lstack.length - n;
                }
                function lex() {
                    var token;
                    token = self.lexer.lex() || 1;
                    if (typeof token !== "number") {
                        token = self.symbols_[token] || token;
                    }
                    return token;
                }
                var symbol,
                    preErrorSymbol,
                    state,
                    action,
                    a,
                    r,
                    yyval = {},
                    p,
                    len,
                    newState,
                    expected;
                while (true) {
                    state = stack[stack.length - 1];
                    if (this.defaultActions[state]) {
                        action = this.defaultActions[state];
                    } else {
                        if (symbol === null || typeof symbol == "undefined") {
                            symbol = lex();
                        }
                        action = table[state] && table[state][symbol];
                    }
                    if (typeof action === "undefined" || !action.length || !action[0]) {
                        var errStr = "";
                        if (!recovering) {
                            expected = [];
                            for (p in table[state]) if (this.terminals_[p] && p > 2) {
                                expected.push("'" + this.terminals_[p] + "'");
                            }
                            if (this.lexer.showPosition) {
                                errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
                            } else {
                                errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1 ? "end of input" : "'" + (this.terminals_[symbol] || symbol) + "'");
                            }
                            this.parseError(errStr, { text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected });
                        }
                    }
                    if (action[0] instanceof Array && action.length > 1) {
                        throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
                    }
                    switch (action[0]) {
                        case 1:
                            stack.push(symbol);
                            vstack.push(this.lexer.yytext);
                            lstack.push(this.lexer.yylloc);
                            stack.push(action[1]);
                            symbol = null;
                            if (!preErrorSymbol) {
                                yyleng = this.lexer.yyleng;
                                yytext = this.lexer.yytext;
                                yylineno = this.lexer.yylineno;
                                yyloc = this.lexer.yylloc;
                                if (recovering > 0) recovering--;
                            } else {
                                symbol = preErrorSymbol;
                                preErrorSymbol = null;
                            }
                            break;
                        case 2:
                            len = this.productions_[action[1]][1];
                            yyval.$ = vstack[vstack.length - len];
                            yyval._$ = { first_line: lstack[lstack.length - (len || 1)].first_line, last_line: lstack[lstack.length - 1].last_line, first_column: lstack[lstack.length - (len || 1)].first_column, last_column: lstack[lstack.length - 1].last_column };
                            if (ranges) {
                                yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
                            }
                            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
                            if (typeof r !== "undefined") {
                                return r;
                            }
                            if (len) {
                                stack = stack.slice(0, -1 * len * 2);
                                vstack = vstack.slice(0, -1 * len);
                                lstack = lstack.slice(0, -1 * len);
                            }
                            stack.push(this.productions_[action[1]][0]);
                            vstack.push(yyval.$);
                            lstack.push(yyval._$);
                            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
                            stack.push(newState);
                            break;
                        case 3:
                            return true;
                    }
                }
                return true;
            }
        };
        /* Jison generated lexer */
        var lexer = (function () {
            var lexer = { EOF: 1,
                parseError: function parseError(str, hash) {
                    if (this.yy.parser) {
                        this.yy.parser.parseError(str, hash);
                    } else {
                        throw new Error(str);
                    }
                },
                setInput: function (input) {
                    this._input = input;
                    this._more = this._less = this.done = false;
                    this.yylineno = this.yyleng = 0;
                    this.yytext = this.matched = this.match = '';
                    this.conditionStack = ['INITIAL'];
                    this.yylloc = { first_line: 1, first_column: 0, last_line: 1, last_column: 0 };
                    if (this.options.ranges) this.yylloc.range = [0, 0];
                    this.offset = 0;
                    return this;
                },
                input: function () {
                    var ch = this._input[0];
                    this.yytext += ch;
                    this.yyleng++;
                    this.offset++;
                    this.match += ch;
                    this.matched += ch;
                    var lines = ch.match(/(?:\r\n?|\n).*/g);
                    if (lines) {
                        this.yylineno++;
                        this.yylloc.last_line++;
                    } else {
                        this.yylloc.last_column++;
                    }
                    if (this.options.ranges) this.yylloc.range[1]++;

                    this._input = this._input.slice(1);
                    return ch;
                },
                unput: function (ch) {
                    var len = ch.length;
                    var lines = ch.split(/(?:\r\n?|\n)/g);

                    this._input = ch + this._input;
                    this.yytext = this.yytext.substr(0, this.yytext.length - len - 1);
                    //this.yyleng -= len;
                    this.offset -= len;
                    var oldLines = this.match.split(/(?:\r\n?|\n)/g);
                    this.match = this.match.substr(0, this.match.length - 1);
                    this.matched = this.matched.substr(0, this.matched.length - 1);

                    if (lines.length - 1) this.yylineno -= lines.length - 1;
                    var r = this.yylloc.range;

                    this.yylloc = { first_line: this.yylloc.first_line,
                        last_line: this.yylineno + 1,
                        first_column: this.yylloc.first_column,
                        last_column: lines ? (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length : this.yylloc.first_column - len
                    };

                    if (this.options.ranges) {
                        this.yylloc.range = [r[0], r[0] + this.yyleng - len];
                    }
                    return this;
                },
                more: function () {
                    this._more = true;
                    return this;
                },
                less: function (n) {
                    this.unput(this.match.slice(n));
                },
                pastInput: function () {
                    var past = this.matched.substr(0, this.matched.length - this.match.length);
                    return (past.length > 20 ? '...' : '') + past.substr(-20).replace(/\n/g, "");
                },
                upcomingInput: function () {
                    var next = this.match;
                    if (next.length < 20) {
                        next += this._input.substr(0, 20 - next.length);
                    }
                    return (next.substr(0, 20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
                },
                showPosition: function () {
                    var pre = this.pastInput();
                    var c = new Array(pre.length + 1).join("-");
                    return pre + this.upcomingInput() + "\n" + c + "^";
                },
                next: function () {
                    if (this.done) {
                        return this.EOF;
                    }
                    if (!this._input) this.done = true;

                    var token, match, tempMatch, index, col, lines;
                    if (!this._more) {
                        this.yytext = '';
                        this.match = '';
                    }
                    var rules = this._currentRules();
                    for (var i = 0; i < rules.length; i++) {
                        tempMatch = this._input.match(this.rules[rules[i]]);
                        if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                            match = tempMatch;
                            index = i;
                            if (!this.options.flex) break;
                        }
                    }
                    if (match) {
                        lines = match[0].match(/(?:\r\n?|\n).*/g);
                        if (lines) this.yylineno += lines.length;
                        this.yylloc = { first_line: this.yylloc.last_line,
                            last_line: this.yylineno + 1,
                            first_column: this.yylloc.last_column,
                            last_column: lines ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length };
                        this.yytext += match[0];
                        this.match += match[0];
                        this.matches = match;
                        this.yyleng = this.yytext.length;
                        if (this.options.ranges) {
                            this.yylloc.range = [this.offset, this.offset += this.yyleng];
                        }
                        this._more = false;
                        this._input = this._input.slice(match[0].length);
                        this.matched += match[0];
                        token = this.performAction.call(this, this.yy, this, rules[index], this.conditionStack[this.conditionStack.length - 1]);
                        if (this.done && this._input) this.done = false;
                        if (token) return token;else return;
                    }
                    if (this._input === "") {
                        return this.EOF;
                    } else {
                        return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), { text: "", token: null, line: this.yylineno });
                    }
                },
                lex: function lex() {
                    var r = this.next();
                    if (typeof r !== 'undefined') {
                        return r;
                    } else {
                        return this.lex();
                    }
                },
                begin: function begin(condition) {
                    this.conditionStack.push(condition);
                },
                popState: function popState() {
                    return this.conditionStack.pop();
                },
                _currentRules: function _currentRules() {
                    return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
                },
                topState: function () {
                    return this.conditionStack[this.conditionStack.length - 2];
                },
                pushState: function begin(condition) {
                    this.begin(condition);
                } };
            lexer.options = {};
            lexer.performAction = function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {

                function strip(start, end) {
                    return yy_.yytext = yy_.yytext.substr(start, yy_.yyleng - end);
                }

                var YYSTATE = YY_START;
                switch ($avoiding_name_collisions) {
                    case 0:
                        if (yy_.yytext.slice(-2) === "\\\\") {
                            strip(0, 1);
                            this.begin("mu");
                        } else if (yy_.yytext.slice(-1) === "\\") {
                            strip(0, 1);
                            this.begin("emu");
                        } else {
                            this.begin("mu");
                        }
                        if (yy_.yytext) return 14;

                        break;
                    case 1:
                        return 14;
                        break;
                    case 2:
                        this.popState();
                        return 14;

                        break;
                    case 3:
                        yy_.yytext = yy_.yytext.substr(5, yy_.yyleng - 9);
                        this.popState();
                        return 16;

                        break;
                    case 4:
                        return 14;
                        break;
                    case 5:
                        this.popState();
                        return 13;

                        break;
                    case 6:
                        return 59;
                        break;
                    case 7:
                        return 62;
                        break;
                    case 8:
                        return 17;
                        break;
                    case 9:
                        this.popState();
                        this.begin('raw');
                        return 21;

                        break;
                    case 10:
                        return 53;
                        break;
                    case 11:
                        return 27;
                        break;
                    case 12:
                        return 45;
                        break;
                    case 13:
                        this.popState();return 42;
                        break;
                    case 14:
                        this.popState();return 42;
                        break;
                    case 15:
                        return 32;
                        break;
                    case 16:
                        return 37;
                        break;
                    case 17:
                        return 49;
                        break;
                    case 18:
                        return 46;
                        break;
                    case 19:
                        this.unput(yy_.yytext);
                        this.popState();
                        this.begin('com');

                        break;
                    case 20:
                        this.popState();
                        return 13;

                        break;
                    case 21:
                        return 46;
                        break;
                    case 22:
                        return 67;
                        break;
                    case 23:
                        return 66;
                        break;
                    case 24:
                        return 66;
                        break;
                    case 25:
                        return 81;
                        break;
                    case 26:
                        // ignore whitespace
                        break;
                    case 27:
                        this.popState();return 52;
                        break;
                    case 28:
                        this.popState();return 31;
                        break;
                    case 29:
                        yy_.yytext = strip(1, 2).replace(/\\"/g, '"');return 74;
                        break;
                    case 30:
                        yy_.yytext = strip(1, 2).replace(/\\'/g, "'");return 74;
                        break;
                    case 31:
                        return 79;
                        break;
                    case 32:
                        return 76;
                        break;
                    case 33:
                        return 76;
                        break;
                    case 34:
                        return 77;
                        break;
                    case 35:
                        return 78;
                        break;
                    case 36:
                        return 75;
                        break;
                    case 37:
                        return 69;
                        break;
                    case 38:
                        return 71;
                        break;
                    case 39:
                        return 66;
                        break;
                    case 40:
                        return 66;
                        break;
                    case 41:
                        return 'INVALID';
                        break;
                    case 42:
                        return 5;
                        break;
                }
            };
            lexer.rules = [/^(?:[^\x00]*?(?=(\{\{)))/, /^(?:[^\x00]+)/, /^(?:[^\x00]{2,}?(?=(\{\{|\\\{\{|\\\\\{\{|$)))/, /^(?:\{\{\{\{\/[^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=[=}\s\/.])\}\}\}\})/, /^(?:[^\x00]*?(?=(\{\{\{\{\/)))/, /^(?:[\s\S]*?--(~)?\}\})/, /^(?:\()/, /^(?:\))/, /^(?:\{\{\{\{)/, /^(?:\}\}\}\})/, /^(?:\{\{(~)?>)/, /^(?:\{\{(~)?#)/, /^(?:\{\{(~)?\/)/, /^(?:\{\{(~)?\^\s*(~)?\}\})/, /^(?:\{\{(~)?\s*else\s*(~)?\}\})/, /^(?:\{\{(~)?\^)/, /^(?:\{\{(~)?\s*else\b)/, /^(?:\{\{(~)?\{)/, /^(?:\{\{(~)?&)/, /^(?:\{\{(~)?!--)/, /^(?:\{\{(~)?![\s\S]*?\}\})/, /^(?:\{\{(~)?)/, /^(?:=)/, /^(?:\.\.)/, /^(?:\.(?=([=~}\s\/.)|])))/, /^(?:[\/.])/, /^(?:\s+)/, /^(?:\}(~)?\}\})/, /^(?:(~)?\}\})/, /^(?:"(\\["]|[^"])*")/, /^(?:'(\\[']|[^'])*')/, /^(?:@)/, /^(?:true(?=([~}\s)])))/, /^(?:false(?=([~}\s)])))/, /^(?:undefined(?=([~}\s)])))/, /^(?:null(?=([~}\s)])))/, /^(?:-?[0-9]+(?:\.[0-9]+)?(?=([~}\s)])))/, /^(?:as\s+\|)/, /^(?:\|)/, /^(?:([^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=([=~}\s\/.)|]))))/, /^(?:\[[^\]]*\])/, /^(?:.)/, /^(?:$)/];
            lexer.conditions = { "mu": { "rules": [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42], "inclusive": false }, "emu": { "rules": [2], "inclusive": false }, "com": { "rules": [5], "inclusive": false }, "raw": { "rules": [3, 4], "inclusive": false }, "INITIAL": { "rules": [0, 1, 42], "inclusive": true } };
            return lexer;
        })();
        parser.lexer = lexer;
        function Parser() {
            this.yy = {};
        }Parser.prototype = parser;parser.Parser = Parser;
        return new Parser();
    })();exports.default = handlebars;
});

enifed('handlebars/compiler/visitor', ['exports', '../exception', './ast'], function (exports, _exception, _ast) {
  'use strict';

  function Visitor() {
    this.parents = [];
  }

  Visitor.prototype = {
    constructor: Visitor,
    mutating: false,

    // Visits a given value. If mutating, will replace the value if necessary.
    acceptKey: function (node, name) {
      var value = this.accept(node[name]);
      if (this.mutating) {
        // Hacky sanity check:
        if (value && (!value.type || !_ast.default[value.type])) {
          throw new _exception.default('Unexpected node type "' + value.type + '" found when accepting ' + name + ' on ' + node.type);
        }
        node[name] = value;
      }
    },

    // Performs an accept operation with added sanity check to ensure
    // required keys are not removed.
    acceptRequired: function (node, name) {
      this.acceptKey(node, name);

      if (!node[name]) {
        throw new _exception.default(node.type + ' requires ' + name);
      }
    },

    // Traverses a given array. If mutating, empty respnses will be removed
    // for child elements.
    acceptArray: function (array) {
      for (var i = 0, l = array.length; i < l; i++) {
        this.acceptKey(array, i);

        if (!array[i]) {
          array.splice(i, 1);
          i--;
          l--;
        }
      }
    },

    accept: function (object) {
      if (!object) {
        return;
      }

      if (this.current) {
        this.parents.unshift(this.current);
      }
      this.current = object;

      var ret = this[object.type](object);

      this.current = this.parents.shift();

      if (!this.mutating || ret) {
        return ret;
      } else if (ret !== false) {
        return object;
      }
    },

    Program: function (program) {
      this.acceptArray(program.body);
    },

    MustacheStatement: function (mustache) {
      this.acceptRequired(mustache, 'path');
      this.acceptArray(mustache.params);
      this.acceptKey(mustache, 'hash');
    },

    BlockStatement: function (block) {
      this.acceptRequired(block, 'path');
      this.acceptArray(block.params);
      this.acceptKey(block, 'hash');

      this.acceptKey(block, 'program');
      this.acceptKey(block, 'inverse');
    },

    PartialStatement: function (partial) {
      this.acceptRequired(partial, 'name');
      this.acceptArray(partial.params);
      this.acceptKey(partial, 'hash');
    },

    ContentStatement: function () /* content */{},
    CommentStatement: function () /* comment */{},

    SubExpression: function (sexpr) {
      this.acceptRequired(sexpr, 'path');
      this.acceptArray(sexpr.params);
      this.acceptKey(sexpr, 'hash');
    },

    PathExpression: function () /* path */{},

    StringLiteral: function () /* string */{},
    NumberLiteral: function () /* number */{},
    BooleanLiteral: function () /* bool */{},
    UndefinedLiteral: function () /* literal */{},
    NullLiteral: function () /* literal */{},

    Hash: function (hash) {
      this.acceptArray(hash.pairs);
    },
    HashPair: function (pair) {
      this.acceptRequired(pair, 'value');
    }
  };

  exports.default = Visitor;
});

enifed('handlebars/compiler/whitespace-control', ['exports', './visitor'], function (exports, _visitor) {
  'use strict';

  function WhitespaceControl() {}
  WhitespaceControl.prototype = new _visitor.default();

  WhitespaceControl.prototype.Program = function (program) {
    var isRoot = !this.isRootSeen;
    this.isRootSeen = true;

    var body = program.body;
    for (var i = 0, l = body.length; i < l; i++) {
      var current = body[i],
          strip = this.accept(current);

      if (!strip) {
        continue;
      }

      var _isPrevWhitespace = isPrevWhitespace(body, i, isRoot),
          _isNextWhitespace = isNextWhitespace(body, i, isRoot),
          openStandalone = strip.openStandalone && _isPrevWhitespace,
          closeStandalone = strip.closeStandalone && _isNextWhitespace,
          inlineStandalone = strip.inlineStandalone && _isPrevWhitespace && _isNextWhitespace;

      if (strip.close) {
        omitRight(body, i, true);
      }
      if (strip.open) {
        omitLeft(body, i, true);
      }

      if (inlineStandalone) {
        omitRight(body, i);

        if (omitLeft(body, i)) {
          // If we are on a standalone node, save the indent info for partials
          if (current.type === 'PartialStatement') {
            // Pull out the whitespace from the final line
            current.indent = /([ \t]+$)/.exec(body[i - 1].original)[1];
          }
        }
      }
      if (openStandalone) {
        omitRight((current.program || current.inverse).body);

        // Strip out the previous content node if it's whitespace only
        omitLeft(body, i);
      }
      if (closeStandalone) {
        // Always strip the next node
        omitRight(body, i);

        omitLeft((current.inverse || current.program).body);
      }
    }

    return program;
  };
  WhitespaceControl.prototype.BlockStatement = function (block) {
    this.accept(block.program);
    this.accept(block.inverse);

    // Find the inverse program that is involed with whitespace stripping.
    var program = block.program || block.inverse,
        inverse = block.program && block.inverse,
        firstInverse = inverse,
        lastInverse = inverse;

    if (inverse && inverse.chained) {
      firstInverse = inverse.body[0].program;

      // Walk the inverse chain to find the last inverse that is actually in the chain.
      while (lastInverse.chained) {
        lastInverse = lastInverse.body[lastInverse.body.length - 1].program;
      }
    }

    var strip = {
      open: block.openStrip.open,
      close: block.closeStrip.close,

      // Determine the standalone candiacy. Basically flag our content as being possibly standalone
      // so our parent can determine if we actually are standalone
      openStandalone: isNextWhitespace(program.body),
      closeStandalone: isPrevWhitespace((firstInverse || program).body)
    };

    if (block.openStrip.close) {
      omitRight(program.body, null, true);
    }

    if (inverse) {
      var inverseStrip = block.inverseStrip;

      if (inverseStrip.open) {
        omitLeft(program.body, null, true);
      }

      if (inverseStrip.close) {
        omitRight(firstInverse.body, null, true);
      }
      if (block.closeStrip.open) {
        omitLeft(lastInverse.body, null, true);
      }

      // Find standalone else statments
      if (isPrevWhitespace(program.body) && isNextWhitespace(firstInverse.body)) {
        omitLeft(program.body);
        omitRight(firstInverse.body);
      }
    } else if (block.closeStrip.open) {
      omitLeft(program.body, null, true);
    }

    return strip;
  };

  WhitespaceControl.prototype.MustacheStatement = function (mustache) {
    return mustache.strip;
  };

  WhitespaceControl.prototype.PartialStatement = WhitespaceControl.prototype.CommentStatement = function (node) {
    /* istanbul ignore next */
    var strip = node.strip || {};
    return {
      inlineStandalone: true,
      open: strip.open,
      close: strip.close
    };
  };

  function isPrevWhitespace(body, i, isRoot) {
    if (i === undefined) {
      i = body.length;
    }

    // Nodes that end with newlines are considered whitespace (but are special
    // cased for strip operations)
    var prev = body[i - 1],
        sibling = body[i - 2];
    if (!prev) {
      return isRoot;
    }

    if (prev.type === 'ContentStatement') {
      return (sibling || !isRoot ? /\r?\n\s*?$/ : /(^|\r?\n)\s*?$/).test(prev.original);
    }
  }
  function isNextWhitespace(body, i, isRoot) {
    if (i === undefined) {
      i = -1;
    }

    var next = body[i + 1],
        sibling = body[i + 2];
    if (!next) {
      return isRoot;
    }

    if (next.type === 'ContentStatement') {
      return (sibling || !isRoot ? /^\s*?\r?\n/ : /^\s*?(\r?\n|$)/).test(next.original);
    }
  }

  // Marks the node to the right of the position as omitted.
  // I.e. {{foo}}' ' will mark the ' ' node as omitted.
  //
  // If i is undefined, then the first child will be marked as such.
  //
  // If mulitple is truthy then all whitespace will be stripped out until non-whitespace
  // content is met.
  function omitRight(body, i, multiple) {
    var current = body[i == null ? 0 : i + 1];
    if (!current || current.type !== 'ContentStatement' || !multiple && current.rightStripped) {
      return;
    }

    var original = current.value;
    current.value = current.value.replace(multiple ? /^\s+/ : /^[ \t]*\r?\n?/, '');
    current.rightStripped = current.value !== original;
  }

  // Marks the node to the left of the position as omitted.
  // I.e. ' '{{foo}} will mark the ' ' node as omitted.
  //
  // If i is undefined then the last child will be marked as such.
  //
  // If mulitple is truthy then all whitespace will be stripped out until non-whitespace
  // content is met.
  function omitLeft(body, i, multiple) {
    var current = body[i == null ? body.length - 1 : i - 1];
    if (!current || current.type !== 'ContentStatement' || !multiple && current.leftStripped) {
      return;
    }

    // We omit the last node if it's whitespace only and not preceeded by a non-content node.
    var original = current.value;
    current.value = current.value.replace(multiple ? /\s+$/ : /[ \t]+$/, '');
    current.leftStripped = current.value !== original;
    return current.leftStripped;
  }

  exports.default = WhitespaceControl;
});

enifed('handlebars/exception', ['exports'], function (exports) {
  'use strict';

  var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

  function Exception(message, node) {
    var loc = node && node.loc,
        line = undefined,
        column = undefined;
    if (loc) {
      line = loc.start.line;
      column = loc.start.column;

      message += ' - ' + line + ':' + column;
    }

    var tmp = Error.prototype.constructor.call(this, message);

    // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
    for (var idx = 0; idx < errorProps.length; idx++) {
      this[errorProps[idx]] = tmp[errorProps[idx]];
    }

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, Exception);
    }

    if (loc) {
      this.lineNumber = line;
      this.column = column;
    }
  }

  Exception.prototype = new Error();

  exports.default = Exception;
});

enifed('handlebars/safe-string', ['exports'], function (exports) {
  // Build out our basic SafeString type
  'use strict';

  function SafeString(string) {
    this.string = string;
  }

  SafeString.prototype.toString = SafeString.prototype.toHTML = function () {
    return '' + this.string;
  };

  exports.default = SafeString;
});

enifed('handlebars/utils', ['exports'], function (exports) {
  'use strict';

  exports.extend = extend;
  exports.indexOf = indexOf;
  exports.escapeExpression = escapeExpression;
  exports.isEmpty = isEmpty;
  exports.blockParams = blockParams;
  exports.appendContextPath = appendContextPath;
  var escape = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };

  var badChars = /[&<>"'`]/g,
      possible = /[&<>"'`]/;

  function escapeChar(chr) {
    return escape[chr];
  }

  function extend(obj /* , ...source */) {
    for (var i = 1; i < arguments.length; i++) {
      for (var key in arguments[i]) {
        if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
          obj[key] = arguments[i][key];
        }
      }
    }

    return obj;
  }

  var toString = Object.prototype.toString;

  exports.toString = toString;
  // Sourced from lodash
  // https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
  /*eslint-disable func-style, no-var */
  var isFunction = function (value) {
    return typeof value === 'function';
  };
  // fallback for older versions of Chrome and Safari
  /* istanbul ignore next */
  if (isFunction(/x/)) {
    exports.isFunction = isFunction = function (value) {
      return typeof value === 'function' && toString.call(value) === '[object Function]';
    };
  }
  var isFunction;
  exports.isFunction = isFunction;
  /*eslint-enable func-style, no-var */

  /* istanbul ignore next */
  var isArray = Array.isArray || function (value) {
    return value && typeof value === 'object' ? toString.call(value) === '[object Array]' : false;
  };

  exports.isArray = isArray;
  // Older IE versions do not directly support indexOf so we must implement our own, sadly.

  function indexOf(array, value) {
    for (var i = 0, len = array.length; i < len; i++) {
      if (array[i] === value) {
        return i;
      }
    }
    return -1;
  }

  function escapeExpression(string) {
    if (typeof string !== 'string') {
      // don't escape SafeStrings, since they're already safe
      if (string && string.toHTML) {
        return string.toHTML();
      } else if (string == null) {
        return '';
      } else if (!string) {
        return string + '';
      }

      // Force a string conversion as this will be done by the append regardless and
      // the regex test will do this transparently behind the scenes, causing issues if
      // an object's to string has escaped characters in it.
      string = '' + string;
    }

    if (!possible.test(string)) {
      return string;
    }
    return string.replace(badChars, escapeChar);
  }

  function isEmpty(value) {
    if (!value && value !== 0) {
      return true;
    } else if (isArray(value) && value.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  function blockParams(params, ids) {
    params.path = ids;
    return params;
  }

  function appendContextPath(contextPath, id) {
    return (contextPath ? contextPath + '.' : '') + id;
  }
});

enifed("simple-html-tokenizer/entity-parser", ["exports"], function (exports) {
  "use strict";

  function EntityParser(named) {
    this.named = named;
  }

  var HEXCHARCODE = /^#[xX]([A-Fa-f0-9]+)$/;
  var CHARCODE = /^#([0-9]+)$/;
  var NAMED = /^([A-Za-z0-9]+)$/;

  EntityParser.prototype.parse = function (entity) {
    if (!entity) {
      return;
    }
    var matches = entity.match(HEXCHARCODE);
    if (matches) {
      return String.fromCharCode(parseInt(matches[1], 16));
    }
    matches = entity.match(CHARCODE);
    if (matches) {
      return String.fromCharCode(parseInt(matches[1], 10));
    }
    matches = entity.match(NAMED);
    if (matches) {
      return this.named[matches[1]];
    }
  };

  exports.default = EntityParser;
});

enifed('simple-html-tokenizer/evented-tokenizer', ['exports', './utils'], function (exports, _utils) {
  'use strict';

  function EventedTokenizer(delegate, entityParser) {
    this.delegate = delegate;
    this.entityParser = entityParser;

    this.state = null;
    this.input = null;

    this.index = -1;
    this.line = -1;
    this.column = -1;
    this.tagLine = -1;
    this.tagColumn = -1;

    this.reset();
  }

  EventedTokenizer.prototype = {
    reset: function () {
      this.state = 'beforeData';
      this.input = '';

      this.index = 0;
      this.line = 1;
      this.column = 0;

      this.tagLine = -1;
      this.tagColumn = -1;

      this.delegate.reset();
    },

    tokenize: function (input) {
      this.reset();
      this.tokenizePart(input);
      this.tokenizeEOF();
    },

    tokenizePart: function (input) {
      this.input += _utils.preprocessInput(input);

      while (this.index < this.input.length) {
        this.states[this.state].call(this);
      }
    },

    tokenizeEOF: function () {
      this.flushData();
    },

    flushData: function () {
      if (this.state === 'data') {
        this.delegate.finishData();
        this.state = 'beforeData';
      }
    },

    peek: function () {
      return this.input.charAt(this.index);
    },

    consume: function () {
      var char = this.peek();

      this.index++;

      if (char === "\n") {
        this.line++;
        this.column = 0;
      } else {
        this.column++;
      }

      return char;
    },

    consumeCharRef: function () {
      var endIndex = this.input.indexOf(';', this.index);
      if (endIndex === -1) {
        return;
      }
      var entity = this.input.slice(this.index, endIndex);
      var chars = this.entityParser.parse(entity);
      if (chars) {
        this.index = endIndex + 1;
        return chars;
      }
    },

    markTagStart: function () {
      this.tagLine = this.line;
      this.tagColumn = this.column;
    },

    states: {
      beforeData: function () {
        var char = this.peek();

        if (char === "<") {
          this.state = 'tagOpen';
          this.markTagStart();
          this.consume();
        } else {
          this.state = 'data';
          this.delegate.beginData();
        }
      },

      data: function () {
        var char = this.peek();

        if (char === "<") {
          this.delegate.finishData();
          this.state = 'tagOpen';
          this.markTagStart();
          this.consume();
        } else if (char === "&") {
          this.consume();
          this.delegate.appendToData(this.consumeCharRef() || "&");
        } else {
          this.consume();
          this.delegate.appendToData(char);
        }
      },

      tagOpen: function () {
        var char = this.consume();

        if (char === "!") {
          this.state = 'markupDeclaration';
        } else if (char === "/") {
          this.state = 'endTagOpen';
        } else if (_utils.isAlpha(char)) {
          this.state = 'tagName';
          this.delegate.beginStartTag();
          this.delegate.appendToTagName(char.toLowerCase());
        }
      },

      markupDeclaration: function () {
        var char = this.consume();

        if (char === "-" && this.input.charAt(this.index) === "-") {
          this.index++;
          this.state = 'commentStart';
          this.delegate.beginComment();
        }
      },

      commentStart: function () {
        var char = this.consume();

        if (char === "-") {
          this.state = 'commentStartDash';
        } else if (char === ">") {
          this.delegate.finishComment();
          this.state = 'beforeData';
        } else {
          this.delegate.appendToCommentData(char);
          this.state = 'comment';
        }
      },

      commentStartDash: function () {
        var char = this.consume();

        if (char === "-") {
          this.state = 'commentEnd';
        } else if (char === ">") {
          this.delegate.finishComment();
          this.state = 'beforeData';
        } else {
          this.delegate.appendToCommentData("-");
          this.state = 'comment';
        }
      },

      comment: function () {
        var char = this.consume();

        if (char === "-") {
          this.state = 'commentEndDash';
        } else {
          this.delegate.appendToCommentData(char);
        }
      },

      commentEndDash: function () {
        var char = this.consume();

        if (char === "-") {
          this.state = 'commentEnd';
        } else {
          this.delegate.appendToCommentData("-" + char);
          this.state = 'comment';
        }
      },

      commentEnd: function () {
        var char = this.consume();

        if (char === ">") {
          this.delegate.finishComment();
          this.state = 'beforeData';
        } else {
          this.delegate.appendToCommentData("--" + char);
          this.state = 'comment';
        }
      },

      tagName: function () {
        var char = this.consume();

        if (_utils.isSpace(char)) {
          this.state = 'beforeAttributeName';
        } else if (char === "/") {
          this.state = 'selfClosingStartTag';
        } else if (char === ">") {
          this.delegate.finishTag();
          this.state = 'beforeData';
        } else {
          this.delegate.appendToTagName(char);
        }
      },

      beforeAttributeName: function () {
        var char = this.consume();

        if (_utils.isSpace(char)) {
          return;
        } else if (char === "/") {
          this.state = 'selfClosingStartTag';
        } else if (char === ">") {
          this.delegate.finishTag();
          this.state = 'beforeData';
        } else {
          this.state = 'attributeName';
          this.delegate.beginAttribute();
          this.delegate.appendToAttributeName(char);
        }
      },

      attributeName: function () {
        var char = this.consume();

        if (_utils.isSpace(char)) {
          this.state = 'afterAttributeName';
        } else if (char === "/") {
          this.delegate.beginAttributeValue(false);
          this.delegate.finishAttributeValue();
          this.state = 'selfClosingStartTag';
        } else if (char === "=") {
          this.state = 'beforeAttributeValue';
        } else if (char === ">") {
          this.delegate.beginAttributeValue(false);
          this.delegate.finishAttributeValue();
          this.delegate.finishTag();
          this.state = 'beforeData';
        } else {
          this.delegate.appendToAttributeName(char);
        }
      },

      afterAttributeName: function () {
        var char = this.consume();

        if (_utils.isSpace(char)) {
          return;
        } else if (char === "/") {
          this.delegate.beginAttributeValue(false);
          this.delegate.finishAttributeValue();
          this.state = 'selfClosingStartTag';
        } else if (char === "=") {
          this.state = 'beforeAttributeValue';
        } else if (char === ">") {
          this.delegate.beginAttributeValue(false);
          this.delegate.finishAttributeValue();
          this.delegate.finishTag();
          this.state = 'beforeData';
        } else {
          this.delegate.beginAttributeValue(false);
          this.delegate.finishAttributeValue();
          this.state = 'attributeName';
          this.delegate.beginAttribute();
          this.delegate.appendToAttributeName(char);
        }
      },

      beforeAttributeValue: function () {
        var char = this.consume();

        if (_utils.isSpace(char)) {} else if (char === '"') {
          this.state = 'attributeValueDoubleQuoted';
          this.delegate.beginAttributeValue(true);
        } else if (char === "'") {
          this.state = 'attributeValueSingleQuoted';
          this.delegate.beginAttributeValue(true);
        } else if (char === ">") {
          this.delegate.beginAttributeValue(false);
          this.delegate.finishAttributeValue();
          this.delegate.finishTag();
          this.state = 'beforeData';
        } else {
          this.state = 'attributeValueUnquoted';
          this.delegate.beginAttributeValue(false);
          this.delegate.appendToAttributeValue(char);
        }
      },

      attributeValueDoubleQuoted: function () {
        var char = this.consume();

        if (char === '"') {
          this.delegate.finishAttributeValue();
          this.state = 'afterAttributeValueQuoted';
        } else if (char === "&") {
          this.delegate.appendToAttributeValue(this.consumeCharRef('"') || "&");
        } else {
          this.delegate.appendToAttributeValue(char);
        }
      },

      attributeValueSingleQuoted: function () {
        var char = this.consume();

        if (char === "'") {
          this.delegate.finishAttributeValue();
          this.state = 'afterAttributeValueQuoted';
        } else if (char === "&") {
          this.delegate.appendToAttributeValue(this.consumeCharRef("'") || "&");
        } else {
          this.delegate.appendToAttributeValue(char);
        }
      },

      attributeValueUnquoted: function () {
        var char = this.consume();

        if (_utils.isSpace(char)) {
          this.delegate.finishAttributeValue();
          this.state = 'beforeAttributeName';
        } else if (char === "&") {
          this.delegate.appendToAttributeValue(this.consumeCharRef(">") || "&");
        } else if (char === ">") {
          this.delegate.finishAttributeValue();
          this.delegate.finishTag();
          this.state = 'beforeData';
        } else {
          this.delegate.appendToAttributeValue(char);
        }
      },

      afterAttributeValueQuoted: function () {
        var char = this.peek();

        if (_utils.isSpace(char)) {
          this.consume();
          this.state = 'beforeAttributeName';
        } else if (char === "/") {
          this.consume();
          this.state = 'selfClosingStartTag';
        } else if (char === ">") {
          this.consume();
          this.delegate.finishTag();
          this.state = 'beforeData';
        } else {
          this.state = 'beforeAttributeName';
        }
      },

      selfClosingStartTag: function () {
        var char = this.peek();

        if (char === ">") {
          this.consume();
          this.delegate.markTagAsSelfClosing();
          this.delegate.finishTag();
          this.state = 'beforeData';
        } else {
          this.state = 'beforeAttributeName';
        }
      },

      endTagOpen: function () {
        var char = this.consume();

        if (_utils.isAlpha(char)) {
          this.state = 'tagName';
          this.delegate.beginEndTag();
          this.delegate.appendToTagName(char.toLowerCase());
        }
      }
    }
  };

  exports.default = EventedTokenizer;
});

enifed("simple-html-tokenizer/html5-named-char-refs", ["exports"], function (exports) {
  "use strict";

  exports.default = {
    Aacute: "Á", aacute: "á", Abreve: "Ă", abreve: "ă", ac: "∾", acd: "∿", acE: "∾̳", Acirc: "Â", acirc: "â", acute: "´", Acy: "А", acy: "а", AElig: "Æ", aelig: "æ", af: "\u2061", Afr: "𝔄", afr: "𝔞", Agrave: "À", agrave: "à", alefsym: "ℵ", aleph: "ℵ", Alpha: "Α", alpha: "α", Amacr: "Ā", amacr: "ā", amalg: "⨿", AMP: "&", amp: "&", And: "⩓", and: "∧", andand: "⩕", andd: "⩜", andslope: "⩘", andv: "⩚", ang: "∠", ange: "⦤", angle: "∠", angmsd: "∡", angmsdaa: "⦨", angmsdab: "⦩", angmsdac: "⦪", angmsdad: "⦫", angmsdae: "⦬", angmsdaf: "⦭", angmsdag: "⦮", angmsdah: "⦯", angrt: "∟", angrtvb: "⊾", angrtvbd: "⦝", angsph: "∢", angst: "Å", angzarr: "⍼", Aogon: "Ą", aogon: "ą", Aopf: "𝔸", aopf: "𝕒", ap: "≈", apacir: "⩯", apE: "⩰", ape: "≊", apid: "≋", apos: "'", ApplyFunction: "\u2061", approx: "≈", approxeq: "≊", Aring: "Å", aring: "å", Ascr: "𝒜", ascr: "𝒶", Assign: "≔", ast: "*", asymp: "≈", asympeq: "≍", Atilde: "Ã", atilde: "ã", Auml: "Ä", auml: "ä", awconint: "∳", awint: "⨑", backcong: "≌", backepsilon: "϶", backprime: "‵", backsim: "∽", backsimeq: "⋍", Backslash: "∖", Barv: "⫧", barvee: "⊽", Barwed: "⌆", barwed: "⌅", barwedge: "⌅", bbrk: "⎵", bbrktbrk: "⎶", bcong: "≌", Bcy: "Б", bcy: "б", bdquo: "„", becaus: "∵", Because: "∵", because: "∵", bemptyv: "⦰", bepsi: "϶", bernou: "ℬ", Bernoullis: "ℬ", Beta: "Β", beta: "β", beth: "ℶ", between: "≬", Bfr: "𝔅", bfr: "𝔟", bigcap: "⋂", bigcirc: "◯", bigcup: "⋃", bigodot: "⨀", bigoplus: "⨁", bigotimes: "⨂", bigsqcup: "⨆", bigstar: "★", bigtriangledown: "▽", bigtriangleup: "△", biguplus: "⨄", bigvee: "⋁", bigwedge: "⋀", bkarow: "⤍", blacklozenge: "⧫", blacksquare: "▪", blacktriangle: "▴", blacktriangledown: "▾", blacktriangleleft: "◂", blacktriangleright: "▸", blank: "␣", blk12: "▒", blk14: "░", blk34: "▓", block: "█", bne: "=⃥", bnequiv: "≡⃥", bNot: "⫭", bnot: "⌐", Bopf: "𝔹", bopf: "𝕓", bot: "⊥", bottom: "⊥", bowtie: "⋈", boxbox: "⧉", boxDL: "╗", boxDl: "╖", boxdL: "╕", boxdl: "┐", boxDR: "╔", boxDr: "╓", boxdR: "╒", boxdr: "┌", boxH: "═", boxh: "─", boxHD: "╦", boxHd: "╤", boxhD: "╥", boxhd: "┬", boxHU: "╩", boxHu: "╧", boxhU: "╨", boxhu: "┴", boxminus: "⊟", boxplus: "⊞", boxtimes: "⊠", boxUL: "╝", boxUl: "╜", boxuL: "╛", boxul: "┘", boxUR: "╚", boxUr: "╙", boxuR: "╘", boxur: "└", boxV: "║", boxv: "│", boxVH: "╬", boxVh: "╫", boxvH: "╪", boxvh: "┼", boxVL: "╣", boxVl: "╢", boxvL: "╡", boxvl: "┤", boxVR: "╠", boxVr: "╟", boxvR: "╞", boxvr: "├", bprime: "‵", Breve: "˘", breve: "˘", brvbar: "¦", Bscr: "ℬ", bscr: "𝒷", bsemi: "⁏", bsim: "∽", bsime: "⋍", bsol: "\\", bsolb: "⧅", bsolhsub: "⟈", bull: "•", bullet: "•", bump: "≎", bumpE: "⪮", bumpe: "≏", Bumpeq: "≎", bumpeq: "≏", Cacute: "Ć", cacute: "ć", Cap: "⋒", cap: "∩", capand: "⩄", capbrcup: "⩉", capcap: "⩋", capcup: "⩇", capdot: "⩀", CapitalDifferentialD: "ⅅ", caps: "∩︀", caret: "⁁", caron: "ˇ", Cayleys: "ℭ", ccaps: "⩍", Ccaron: "Č", ccaron: "č", Ccedil: "Ç", ccedil: "ç", Ccirc: "Ĉ", ccirc: "ĉ", Cconint: "∰", ccups: "⩌", ccupssm: "⩐", Cdot: "Ċ", cdot: "ċ", cedil: "¸", Cedilla: "¸", cemptyv: "⦲", cent: "¢", CenterDot: "·", centerdot: "·", Cfr: "ℭ", cfr: "𝔠", CHcy: "Ч", chcy: "ч", check: "✓", checkmark: "✓", Chi: "Χ", chi: "χ", cir: "○", circ: "ˆ", circeq: "≗", circlearrowleft: "↺", circlearrowright: "↻", circledast: "⊛", circledcirc: "⊚", circleddash: "⊝", CircleDot: "⊙", circledR: "®", circledS: "Ⓢ", CircleMinus: "⊖", CirclePlus: "⊕", CircleTimes: "⊗", cirE: "⧃", cire: "≗", cirfnint: "⨐", cirmid: "⫯", cirscir: "⧂", ClockwiseContourIntegral: "∲", CloseCurlyDoubleQuote: "”", CloseCurlyQuote: "’", clubs: "♣", clubsuit: "♣", Colon: "∷", colon: ":", Colone: "⩴", colone: "≔", coloneq: "≔", comma: ",", commat: "@", comp: "∁", compfn: "∘", complement: "∁", complexes: "ℂ", cong: "≅", congdot: "⩭", Congruent: "≡", Conint: "∯", conint: "∮", ContourIntegral: "∮", Copf: "ℂ", copf: "𝕔", coprod: "∐", Coproduct: "∐", COPY: "©", copy: "©", copysr: "℗", CounterClockwiseContourIntegral: "∳", crarr: "↵", Cross: "⨯", cross: "✗", Cscr: "𝒞", cscr: "𝒸", csub: "⫏", csube: "⫑", csup: "⫐", csupe: "⫒", ctdot: "⋯", cudarrl: "⤸", cudarrr: "⤵", cuepr: "⋞", cuesc: "⋟", cularr: "↶", cularrp: "⤽", Cup: "⋓", cup: "∪", cupbrcap: "⩈", CupCap: "≍", cupcap: "⩆", cupcup: "⩊", cupdot: "⊍", cupor: "⩅", cups: "∪︀", curarr: "↷", curarrm: "⤼", curlyeqprec: "⋞", curlyeqsucc: "⋟", curlyvee: "⋎", curlywedge: "⋏", curren: "¤", curvearrowleft: "↶", curvearrowright: "↷", cuvee: "⋎", cuwed: "⋏", cwconint: "∲", cwint: "∱", cylcty: "⌭", Dagger: "‡", dagger: "†", daleth: "ℸ", Darr: "↡", dArr: "⇓", darr: "↓", dash: "‐", Dashv: "⫤", dashv: "⊣", dbkarow: "⤏", dblac: "˝", Dcaron: "Ď", dcaron: "ď", Dcy: "Д", dcy: "д", DD: "ⅅ", dd: "ⅆ", ddagger: "‡", ddarr: "⇊", DDotrahd: "⤑", ddotseq: "⩷", deg: "°", Del: "∇", Delta: "Δ", delta: "δ", demptyv: "⦱", dfisht: "⥿", Dfr: "𝔇", dfr: "𝔡", dHar: "⥥", dharl: "⇃", dharr: "⇂", DiacriticalAcute: "´", DiacriticalDot: "˙", DiacriticalDoubleAcute: "˝", DiacriticalGrave: "`", DiacriticalTilde: "˜", diam: "⋄", Diamond: "⋄", diamond: "⋄", diamondsuit: "♦", diams: "♦", die: "¨", DifferentialD: "ⅆ", digamma: "ϝ", disin: "⋲", div: "÷", divide: "÷", divideontimes: "⋇", divonx: "⋇", DJcy: "Ђ", djcy: "ђ", dlcorn: "⌞", dlcrop: "⌍", dollar: "$", Dopf: "𝔻", dopf: "𝕕", Dot: "¨", dot: "˙", DotDot: "⃜", doteq: "≐", doteqdot: "≑", DotEqual: "≐", dotminus: "∸", dotplus: "∔", dotsquare: "⊡", doublebarwedge: "⌆", DoubleContourIntegral: "∯", DoubleDot: "¨", DoubleDownArrow: "⇓", DoubleLeftArrow: "⇐", DoubleLeftRightArrow: "⇔", DoubleLeftTee: "⫤", DoubleLongLeftArrow: "⟸", DoubleLongLeftRightArrow: "⟺", DoubleLongRightArrow: "⟹", DoubleRightArrow: "⇒", DoubleRightTee: "⊨", DoubleUpArrow: "⇑", DoubleUpDownArrow: "⇕", DoubleVerticalBar: "∥", DownArrow: "↓", Downarrow: "⇓", downarrow: "↓", DownArrowBar: "⤓", DownArrowUpArrow: "⇵", DownBreve: "̑", downdownarrows: "⇊", downharpoonleft: "⇃", downharpoonright: "⇂", DownLeftRightVector: "⥐", DownLeftTeeVector: "⥞", DownLeftVector: "↽", DownLeftVectorBar: "⥖", DownRightTeeVector: "⥟", DownRightVector: "⇁", DownRightVectorBar: "⥗", DownTee: "⊤", DownTeeArrow: "↧", drbkarow: "⤐", drcorn: "⌟", drcrop: "⌌", Dscr: "𝒟", dscr: "𝒹", DScy: "Ѕ", dscy: "ѕ", dsol: "⧶", Dstrok: "Đ", dstrok: "đ", dtdot: "⋱", dtri: "▿", dtrif: "▾", duarr: "⇵", duhar: "⥯", dwangle: "⦦", DZcy: "Џ", dzcy: "џ", dzigrarr: "⟿", Eacute: "É", eacute: "é", easter: "⩮", Ecaron: "Ě", ecaron: "ě", ecir: "≖", Ecirc: "Ê", ecirc: "ê", ecolon: "≕", Ecy: "Э", ecy: "э", eDDot: "⩷", Edot: "Ė", eDot: "≑", edot: "ė", ee: "ⅇ", efDot: "≒", Efr: "𝔈", efr: "𝔢", eg: "⪚", Egrave: "È", egrave: "è", egs: "⪖", egsdot: "⪘", el: "⪙", Element: "∈", elinters: "⏧", ell: "ℓ", els: "⪕", elsdot: "⪗", Emacr: "Ē", emacr: "ē", empty: "∅", emptyset: "∅", EmptySmallSquare: "◻", emptyv: "∅", EmptyVerySmallSquare: "▫", emsp: " ", emsp13: " ", emsp14: " ", ENG: "Ŋ", eng: "ŋ", ensp: " ", Eogon: "Ę", eogon: "ę", Eopf: "𝔼", eopf: "𝕖", epar: "⋕", eparsl: "⧣", eplus: "⩱", epsi: "ε", Epsilon: "Ε", epsilon: "ε", epsiv: "ϵ", eqcirc: "≖", eqcolon: "≕", eqsim: "≂", eqslantgtr: "⪖", eqslantless: "⪕", Equal: "⩵", equals: "=", EqualTilde: "≂", equest: "≟", Equilibrium: "⇌", equiv: "≡", equivDD: "⩸", eqvparsl: "⧥", erarr: "⥱", erDot: "≓", Escr: "ℰ", escr: "ℯ", esdot: "≐", Esim: "⩳", esim: "≂", Eta: "Η", eta: "η", ETH: "Ð", eth: "ð", Euml: "Ë", euml: "ë", euro: "€", excl: "!", exist: "∃", Exists: "∃", expectation: "ℰ", ExponentialE: "ⅇ", exponentiale: "ⅇ", fallingdotseq: "≒", Fcy: "Ф", fcy: "ф", female: "♀", ffilig: "ﬃ", fflig: "ﬀ", ffllig: "ﬄ", Ffr: "𝔉", ffr: "𝔣", filig: "ﬁ", FilledSmallSquare: "◼", FilledVerySmallSquare: "▪", fjlig: "fj", flat: "♭", fllig: "ﬂ", fltns: "▱", fnof: "ƒ", Fopf: "𝔽", fopf: "𝕗", ForAll: "∀", forall: "∀", fork: "⋔", forkv: "⫙", Fouriertrf: "ℱ", fpartint: "⨍", frac12: "½", frac13: "⅓", frac14: "¼", frac15: "⅕", frac16: "⅙", frac18: "⅛", frac23: "⅔", frac25: "⅖", frac34: "¾", frac35: "⅗", frac38: "⅜", frac45: "⅘", frac56: "⅚", frac58: "⅝", frac78: "⅞", frasl: "⁄", frown: "⌢", Fscr: "ℱ", fscr: "𝒻", gacute: "ǵ", Gamma: "Γ", gamma: "γ", Gammad: "Ϝ", gammad: "ϝ", gap: "⪆", Gbreve: "Ğ", gbreve: "ğ", Gcedil: "Ģ", Gcirc: "Ĝ", gcirc: "ĝ", Gcy: "Г", gcy: "г", Gdot: "Ġ", gdot: "ġ", gE: "≧", ge: "≥", gEl: "⪌", gel: "⋛", geq: "≥", geqq: "≧", geqslant: "⩾", ges: "⩾", gescc: "⪩", gesdot: "⪀", gesdoto: "⪂", gesdotol: "⪄", gesl: "⋛︀", gesles: "⪔", Gfr: "𝔊", gfr: "𝔤", Gg: "⋙", gg: "≫", ggg: "⋙", gimel: "ℷ", GJcy: "Ѓ", gjcy: "ѓ", gl: "≷", gla: "⪥", glE: "⪒", glj: "⪤", gnap: "⪊", gnapprox: "⪊", gnE: "≩", gne: "⪈", gneq: "⪈", gneqq: "≩", gnsim: "⋧", Gopf: "𝔾", gopf: "𝕘", grave: "`", GreaterEqual: "≥", GreaterEqualLess: "⋛", GreaterFullEqual: "≧", GreaterGreater: "⪢", GreaterLess: "≷", GreaterSlantEqual: "⩾", GreaterTilde: "≳", Gscr: "𝒢", gscr: "ℊ", gsim: "≳", gsime: "⪎", gsiml: "⪐", GT: ">", Gt: "≫", gt: ">", gtcc: "⪧", gtcir: "⩺", gtdot: "⋗", gtlPar: "⦕", gtquest: "⩼", gtrapprox: "⪆", gtrarr: "⥸", gtrdot: "⋗", gtreqless: "⋛", gtreqqless: "⪌", gtrless: "≷", gtrsim: "≳", gvertneqq: "≩︀", gvnE: "≩︀", Hacek: "ˇ", hairsp: " ", half: "½", hamilt: "ℋ", HARDcy: "Ъ", hardcy: "ъ", hArr: "⇔", harr: "↔", harrcir: "⥈", harrw: "↭", Hat: "^", hbar: "ℏ", Hcirc: "Ĥ", hcirc: "ĥ", hearts: "♥", heartsuit: "♥", hellip: "…", hercon: "⊹", Hfr: "ℌ", hfr: "𝔥", HilbertSpace: "ℋ", hksearow: "⤥", hkswarow: "⤦", hoarr: "⇿", homtht: "∻", hookleftarrow: "↩", hookrightarrow: "↪", Hopf: "ℍ", hopf: "𝕙", horbar: "―", HorizontalLine: "─", Hscr: "ℋ", hscr: "𝒽", hslash: "ℏ", Hstrok: "Ħ", hstrok: "ħ", HumpDownHump: "≎", HumpEqual: "≏", hybull: "⁃", hyphen: "‐", Iacute: "Í", iacute: "í", ic: "\u2063", Icirc: "Î", icirc: "î", Icy: "И", icy: "и", Idot: "İ", IEcy: "Е", iecy: "е", iexcl: "¡", iff: "⇔", Ifr: "ℑ", ifr: "𝔦", Igrave: "Ì", igrave: "ì", ii: "ⅈ", iiiint: "⨌", iiint: "∭", iinfin: "⧜", iiota: "℩", IJlig: "Ĳ", ijlig: "ĳ", Im: "ℑ", Imacr: "Ī", imacr: "ī", image: "ℑ", ImaginaryI: "ⅈ", imagline: "ℐ", imagpart: "ℑ", imath: "ı", imof: "⊷", imped: "Ƶ", Implies: "⇒", in: "∈", incare: "℅", infin: "∞", infintie: "⧝", inodot: "ı", Int: "∬", int: "∫", intcal: "⊺", integers: "ℤ", Integral: "∫", intercal: "⊺", Intersection: "⋂", intlarhk: "⨗", intprod: "⨼", InvisibleComma: "\u2063", InvisibleTimes: "\u2062", IOcy: "Ё", iocy: "ё", Iogon: "Į", iogon: "į", Iopf: "𝕀", iopf: "𝕚", Iota: "Ι", iota: "ι", iprod: "⨼", iquest: "¿", Iscr: "ℐ", iscr: "𝒾", isin: "∈", isindot: "⋵", isinE: "⋹", isins: "⋴", isinsv: "⋳", isinv: "∈", it: "\u2062", Itilde: "Ĩ", itilde: "ĩ", Iukcy: "І", iukcy: "і", Iuml: "Ï", iuml: "ï", Jcirc: "Ĵ", jcirc: "ĵ", Jcy: "Й", jcy: "й", Jfr: "𝔍", jfr: "𝔧", jmath: "ȷ", Jopf: "𝕁", jopf: "𝕛", Jscr: "𝒥", jscr: "𝒿", Jsercy: "Ј", jsercy: "ј", Jukcy: "Є", jukcy: "є", Kappa: "Κ", kappa: "κ", kappav: "ϰ", Kcedil: "Ķ", kcedil: "ķ", Kcy: "К", kcy: "к", Kfr: "𝔎", kfr: "𝔨", kgreen: "ĸ", KHcy: "Х", khcy: "х", KJcy: "Ќ", kjcy: "ќ", Kopf: "𝕂", kopf: "𝕜", Kscr: "𝒦", kscr: "𝓀", lAarr: "⇚", Lacute: "Ĺ", lacute: "ĺ", laemptyv: "⦴", lagran: "ℒ", Lambda: "Λ", lambda: "λ", Lang: "⟪", lang: "⟨", langd: "⦑", langle: "⟨", lap: "⪅", Laplacetrf: "ℒ", laquo: "«", Larr: "↞", lArr: "⇐", larr: "←", larrb: "⇤", larrbfs: "⤟", larrfs: "⤝", larrhk: "↩", larrlp: "↫", larrpl: "⤹", larrsim: "⥳", larrtl: "↢", lat: "⪫", lAtail: "⤛", latail: "⤙", late: "⪭", lates: "⪭︀", lBarr: "⤎", lbarr: "⤌", lbbrk: "❲", lbrace: "{", lbrack: "[", lbrke: "⦋", lbrksld: "⦏", lbrkslu: "⦍", Lcaron: "Ľ", lcaron: "ľ", Lcedil: "Ļ", lcedil: "ļ", lceil: "⌈", lcub: "{", Lcy: "Л", lcy: "л", ldca: "⤶", ldquo: "“", ldquor: "„", ldrdhar: "⥧", ldrushar: "⥋", ldsh: "↲", lE: "≦", le: "≤", LeftAngleBracket: "⟨", LeftArrow: "←", Leftarrow: "⇐", leftarrow: "←", LeftArrowBar: "⇤", LeftArrowRightArrow: "⇆", leftarrowtail: "↢", LeftCeiling: "⌈", LeftDoubleBracket: "⟦", LeftDownTeeVector: "⥡", LeftDownVector: "⇃", LeftDownVectorBar: "⥙", LeftFloor: "⌊", leftharpoondown: "↽", leftharpoonup: "↼", leftleftarrows: "⇇", LeftRightArrow: "↔", Leftrightarrow: "⇔", leftrightarrow: "↔", leftrightarrows: "⇆", leftrightharpoons: "⇋", leftrightsquigarrow: "↭", LeftRightVector: "⥎", LeftTee: "⊣", LeftTeeArrow: "↤", LeftTeeVector: "⥚", leftthreetimes: "⋋", LeftTriangle: "⊲", LeftTriangleBar: "⧏", LeftTriangleEqual: "⊴", LeftUpDownVector: "⥑", LeftUpTeeVector: "⥠", LeftUpVector: "↿", LeftUpVectorBar: "⥘", LeftVector: "↼", LeftVectorBar: "⥒", lEg: "⪋", leg: "⋚", leq: "≤", leqq: "≦", leqslant: "⩽", les: "⩽", lescc: "⪨", lesdot: "⩿", lesdoto: "⪁", lesdotor: "⪃", lesg: "⋚︀", lesges: "⪓", lessapprox: "⪅", lessdot: "⋖", lesseqgtr: "⋚", lesseqqgtr: "⪋", LessEqualGreater: "⋚", LessFullEqual: "≦", LessGreater: "≶", lessgtr: "≶", LessLess: "⪡", lesssim: "≲", LessSlantEqual: "⩽", LessTilde: "≲", lfisht: "⥼", lfloor: "⌊", Lfr: "𝔏", lfr: "𝔩", lg: "≶", lgE: "⪑", lHar: "⥢", lhard: "↽", lharu: "↼", lharul: "⥪", lhblk: "▄", LJcy: "Љ", ljcy: "љ", Ll: "⋘", ll: "≪", llarr: "⇇", llcorner: "⌞", Lleftarrow: "⇚", llhard: "⥫", lltri: "◺", Lmidot: "Ŀ", lmidot: "ŀ", lmoust: "⎰", lmoustache: "⎰", lnap: "⪉", lnapprox: "⪉", lnE: "≨", lne: "⪇", lneq: "⪇", lneqq: "≨", lnsim: "⋦", loang: "⟬", loarr: "⇽", lobrk: "⟦", LongLeftArrow: "⟵", Longleftarrow: "⟸", longleftarrow: "⟵", LongLeftRightArrow: "⟷", Longleftrightarrow: "⟺", longleftrightarrow: "⟷", longmapsto: "⟼", LongRightArrow: "⟶", Longrightarrow: "⟹", longrightarrow: "⟶", looparrowleft: "↫", looparrowright: "↬", lopar: "⦅", Lopf: "𝕃", lopf: "𝕝", loplus: "⨭", lotimes: "⨴", lowast: "∗", lowbar: "_", LowerLeftArrow: "↙", LowerRightArrow: "↘", loz: "◊", lozenge: "◊", lozf: "⧫", lpar: "(", lparlt: "⦓", lrarr: "⇆", lrcorner: "⌟", lrhar: "⇋", lrhard: "⥭", lrm: "\u200e", lrtri: "⊿", lsaquo: "‹", Lscr: "ℒ", lscr: "𝓁", Lsh: "↰", lsh: "↰", lsim: "≲", lsime: "⪍", lsimg: "⪏", lsqb: "[", lsquo: "‘", lsquor: "‚", Lstrok: "Ł", lstrok: "ł", LT: "<", Lt: "≪", lt: "<", ltcc: "⪦", ltcir: "⩹", ltdot: "⋖", lthree: "⋋", ltimes: "⋉", ltlarr: "⥶", ltquest: "⩻", ltri: "◃", ltrie: "⊴", ltrif: "◂", ltrPar: "⦖", lurdshar: "⥊", luruhar: "⥦", lvertneqq: "≨︀", lvnE: "≨︀", macr: "¯", male: "♂", malt: "✠", maltese: "✠", Map: "⤅", map: "↦", mapsto: "↦", mapstodown: "↧", mapstoleft: "↤", mapstoup: "↥", marker: "▮", mcomma: "⨩", Mcy: "М", mcy: "м", mdash: "—", mDDot: "∺", measuredangle: "∡", MediumSpace: " ", Mellintrf: "ℳ", Mfr: "𝔐", mfr: "𝔪", mho: "℧", micro: "µ", mid: "∣", midast: "*", midcir: "⫰", middot: "·", minus: "−", minusb: "⊟", minusd: "∸", minusdu: "⨪", MinusPlus: "∓", mlcp: "⫛", mldr: "…", mnplus: "∓", models: "⊧", Mopf: "𝕄", mopf: "𝕞", mp: "∓", Mscr: "ℳ", mscr: "𝓂", mstpos: "∾", Mu: "Μ", mu: "μ", multimap: "⊸", mumap: "⊸", nabla: "∇", Nacute: "Ń", nacute: "ń", nang: "∠⃒", nap: "≉", napE: "⩰̸", napid: "≋̸", napos: "ŉ", napprox: "≉", natur: "♮", natural: "♮", naturals: "ℕ", nbsp: " ", nbump: "≎̸", nbumpe: "≏̸", ncap: "⩃", Ncaron: "Ň", ncaron: "ň", Ncedil: "Ņ", ncedil: "ņ", ncong: "≇", ncongdot: "⩭̸", ncup: "⩂", Ncy: "Н", ncy: "н", ndash: "–", ne: "≠", nearhk: "⤤", neArr: "⇗", nearr: "↗", nearrow: "↗", nedot: "≐̸", NegativeMediumSpace: "​", NegativeThickSpace: "​", NegativeThinSpace: "​", NegativeVeryThinSpace: "​", nequiv: "≢", nesear: "⤨", nesim: "≂̸", NestedGreaterGreater: "≫", NestedLessLess: "≪", NewLine: "\u000a", nexist: "∄", nexists: "∄", Nfr: "𝔑", nfr: "𝔫", ngE: "≧̸", nge: "≱", ngeq: "≱", ngeqq: "≧̸", ngeqslant: "⩾̸", nges: "⩾̸", nGg: "⋙̸", ngsim: "≵", nGt: "≫⃒", ngt: "≯", ngtr: "≯", nGtv: "≫̸", nhArr: "⇎", nharr: "↮", nhpar: "⫲", ni: "∋", nis: "⋼", nisd: "⋺", niv: "∋", NJcy: "Њ", njcy: "њ", nlArr: "⇍", nlarr: "↚", nldr: "‥", nlE: "≦̸", nle: "≰", nLeftarrow: "⇍", nleftarrow: "↚", nLeftrightarrow: "⇎", nleftrightarrow: "↮", nleq: "≰", nleqq: "≦̸", nleqslant: "⩽̸", nles: "⩽̸", nless: "≮", nLl: "⋘̸", nlsim: "≴", nLt: "≪⃒", nlt: "≮", nltri: "⋪", nltrie: "⋬", nLtv: "≪̸", nmid: "∤", NoBreak: "\u2060", NonBreakingSpace: " ", Nopf: "ℕ", nopf: "𝕟", Not: "⫬", not: "¬", NotCongruent: "≢", NotCupCap: "≭", NotDoubleVerticalBar: "∦", NotElement: "∉", NotEqual: "≠", NotEqualTilde: "≂̸", NotExists: "∄", NotGreater: "≯", NotGreaterEqual: "≱", NotGreaterFullEqual: "≧̸", NotGreaterGreater: "≫̸", NotGreaterLess: "≹", NotGreaterSlantEqual: "⩾̸", NotGreaterTilde: "≵", NotHumpDownHump: "≎̸", NotHumpEqual: "≏̸", notin: "∉", notindot: "⋵̸", notinE: "⋹̸", notinva: "∉", notinvb: "⋷", notinvc: "⋶", NotLeftTriangle: "⋪", NotLeftTriangleBar: "⧏̸", NotLeftTriangleEqual: "⋬", NotLess: "≮", NotLessEqual: "≰", NotLessGreater: "≸", NotLessLess: "≪̸", NotLessSlantEqual: "⩽̸", NotLessTilde: "≴", NotNestedGreaterGreater: "⪢̸", NotNestedLessLess: "⪡̸", notni: "∌", notniva: "∌", notnivb: "⋾", notnivc: "⋽", NotPrecedes: "⊀", NotPrecedesEqual: "⪯̸", NotPrecedesSlantEqual: "⋠", NotReverseElement: "∌", NotRightTriangle: "⋫", NotRightTriangleBar: "⧐̸", NotRightTriangleEqual: "⋭", NotSquareSubset: "⊏̸", NotSquareSubsetEqual: "⋢", NotSquareSuperset: "⊐̸", NotSquareSupersetEqual: "⋣", NotSubset: "⊂⃒", NotSubsetEqual: "⊈", NotSucceeds: "⊁", NotSucceedsEqual: "⪰̸", NotSucceedsSlantEqual: "⋡", NotSucceedsTilde: "≿̸", NotSuperset: "⊃⃒", NotSupersetEqual: "⊉", NotTilde: "≁", NotTildeEqual: "≄", NotTildeFullEqual: "≇", NotTildeTilde: "≉", NotVerticalBar: "∤", npar: "∦", nparallel: "∦", nparsl: "⫽⃥", npart: "∂̸", npolint: "⨔", npr: "⊀", nprcue: "⋠", npre: "⪯̸", nprec: "⊀", npreceq: "⪯̸", nrArr: "⇏", nrarr: "↛", nrarrc: "⤳̸", nrarrw: "↝̸", nRightarrow: "⇏", nrightarrow: "↛", nrtri: "⋫", nrtrie: "⋭", nsc: "⊁", nsccue: "⋡", nsce: "⪰̸", Nscr: "𝒩", nscr: "𝓃", nshortmid: "∤", nshortparallel: "∦", nsim: "≁", nsime: "≄", nsimeq: "≄", nsmid: "∤", nspar: "∦", nsqsube: "⋢", nsqsupe: "⋣", nsub: "⊄", nsubE: "⫅̸", nsube: "⊈", nsubset: "⊂⃒", nsubseteq: "⊈", nsubseteqq: "⫅̸", nsucc: "⊁", nsucceq: "⪰̸", nsup: "⊅", nsupE: "⫆̸", nsupe: "⊉", nsupset: "⊃⃒", nsupseteq: "⊉", nsupseteqq: "⫆̸", ntgl: "≹", Ntilde: "Ñ", ntilde: "ñ", ntlg: "≸", ntriangleleft: "⋪", ntrianglelefteq: "⋬", ntriangleright: "⋫", ntrianglerighteq: "⋭", Nu: "Ν", nu: "ν", num: "#", numero: "№", numsp: " ", nvap: "≍⃒", nVDash: "⊯", nVdash: "⊮", nvDash: "⊭", nvdash: "⊬", nvge: "≥⃒", nvgt: ">⃒", nvHarr: "⤄", nvinfin: "⧞", nvlArr: "⤂", nvle: "≤⃒", nvlt: "<⃒", nvltrie: "⊴⃒", nvrArr: "⤃", nvrtrie: "⊵⃒", nvsim: "∼⃒", nwarhk: "⤣", nwArr: "⇖", nwarr: "↖", nwarrow: "↖", nwnear: "⤧", Oacute: "Ó", oacute: "ó", oast: "⊛", ocir: "⊚", Ocirc: "Ô", ocirc: "ô", Ocy: "О", ocy: "о", odash: "⊝", Odblac: "Ő", odblac: "ő", odiv: "⨸", odot: "⊙", odsold: "⦼", OElig: "Œ", oelig: "œ", ofcir: "⦿", Ofr: "𝔒", ofr: "𝔬", ogon: "˛", Ograve: "Ò", ograve: "ò", ogt: "⧁", ohbar: "⦵", ohm: "Ω", oint: "∮", olarr: "↺", olcir: "⦾", olcross: "⦻", oline: "‾", olt: "⧀", Omacr: "Ō", omacr: "ō", Omega: "Ω", omega: "ω", Omicron: "Ο", omicron: "ο", omid: "⦶", ominus: "⊖", Oopf: "𝕆", oopf: "𝕠", opar: "⦷", OpenCurlyDoubleQuote: "“", OpenCurlyQuote: "‘", operp: "⦹", oplus: "⊕", Or: "⩔", or: "∨", orarr: "↻", ord: "⩝", order: "ℴ", orderof: "ℴ", ordf: "ª", ordm: "º", origof: "⊶", oror: "⩖", orslope: "⩗", orv: "⩛", oS: "Ⓢ", Oscr: "𝒪", oscr: "ℴ", Oslash: "Ø", oslash: "ø", osol: "⊘", Otilde: "Õ", otilde: "õ", Otimes: "⨷", otimes: "⊗", otimesas: "⨶", Ouml: "Ö", ouml: "ö", ovbar: "⌽", OverBar: "‾", OverBrace: "⏞", OverBracket: "⎴", OverParenthesis: "⏜", par: "∥", para: "¶", parallel: "∥", parsim: "⫳", parsl: "⫽", part: "∂", PartialD: "∂", Pcy: "П", pcy: "п", percnt: "%", period: ".", permil: "‰", perp: "⊥", pertenk: "‱", Pfr: "𝔓", pfr: "𝔭", Phi: "Φ", phi: "φ", phiv: "ϕ", phmmat: "ℳ", phone: "☎", Pi: "Π", pi: "π", pitchfork: "⋔", piv: "ϖ", planck: "ℏ", planckh: "ℎ", plankv: "ℏ", plus: "+", plusacir: "⨣", plusb: "⊞", pluscir: "⨢", plusdo: "∔", plusdu: "⨥", pluse: "⩲", PlusMinus: "±", plusmn: "±", plussim: "⨦", plustwo: "⨧", pm: "±", Poincareplane: "ℌ", pointint: "⨕", Popf: "ℙ", popf: "𝕡", pound: "£", Pr: "⪻", pr: "≺", prap: "⪷", prcue: "≼", prE: "⪳", pre: "⪯", prec: "≺", precapprox: "⪷", preccurlyeq: "≼", Precedes: "≺", PrecedesEqual: "⪯", PrecedesSlantEqual: "≼", PrecedesTilde: "≾", preceq: "⪯", precnapprox: "⪹", precneqq: "⪵", precnsim: "⋨", precsim: "≾", Prime: "″", prime: "′", primes: "ℙ", prnap: "⪹", prnE: "⪵", prnsim: "⋨", prod: "∏", Product: "∏", profalar: "⌮", profline: "⌒", profsurf: "⌓", prop: "∝", Proportion: "∷", Proportional: "∝", propto: "∝", prsim: "≾", prurel: "⊰", Pscr: "𝒫", pscr: "𝓅", Psi: "Ψ", psi: "ψ", puncsp: " ", Qfr: "𝔔", qfr: "𝔮", qint: "⨌", Qopf: "ℚ", qopf: "𝕢", qprime: "⁗", Qscr: "𝒬", qscr: "𝓆", quaternions: "ℍ", quatint: "⨖", quest: "?", questeq: "≟", QUOT: "\"", quot: "\"", rAarr: "⇛", race: "∽̱", Racute: "Ŕ", racute: "ŕ", radic: "√", raemptyv: "⦳", Rang: "⟫", rang: "⟩", rangd: "⦒", range: "⦥", rangle: "⟩", raquo: "»", Rarr: "↠", rArr: "⇒", rarr: "→", rarrap: "⥵", rarrb: "⇥", rarrbfs: "⤠", rarrc: "⤳", rarrfs: "⤞", rarrhk: "↪", rarrlp: "↬", rarrpl: "⥅", rarrsim: "⥴", Rarrtl: "⤖", rarrtl: "↣", rarrw: "↝", rAtail: "⤜", ratail: "⤚", ratio: "∶", rationals: "ℚ", RBarr: "⤐", rBarr: "⤏", rbarr: "⤍", rbbrk: "❳", rbrace: "}", rbrack: "]", rbrke: "⦌", rbrksld: "⦎", rbrkslu: "⦐", Rcaron: "Ř", rcaron: "ř", Rcedil: "Ŗ", rcedil: "ŗ", rceil: "⌉", rcub: "}", Rcy: "Р", rcy: "р", rdca: "⤷", rdldhar: "⥩", rdquo: "”", rdquor: "”", rdsh: "↳", Re: "ℜ", real: "ℜ", realine: "ℛ", realpart: "ℜ", reals: "ℝ", rect: "▭", REG: "®", reg: "®", ReverseElement: "∋", ReverseEquilibrium: "⇋", ReverseUpEquilibrium: "⥯", rfisht: "⥽", rfloor: "⌋", Rfr: "ℜ", rfr: "𝔯", rHar: "⥤", rhard: "⇁", rharu: "⇀", rharul: "⥬", Rho: "Ρ", rho: "ρ", rhov: "ϱ", RightAngleBracket: "⟩", RightArrow: "→", Rightarrow: "⇒", rightarrow: "→", RightArrowBar: "⇥", RightArrowLeftArrow: "⇄", rightarrowtail: "↣", RightCeiling: "⌉", RightDoubleBracket: "⟧", RightDownTeeVector: "⥝", RightDownVector: "⇂", RightDownVectorBar: "⥕", RightFloor: "⌋", rightharpoondown: "⇁", rightharpoonup: "⇀", rightleftarrows: "⇄", rightleftharpoons: "⇌", rightrightarrows: "⇉", rightsquigarrow: "↝", RightTee: "⊢", RightTeeArrow: "↦", RightTeeVector: "⥛", rightthreetimes: "⋌", RightTriangle: "⊳", RightTriangleBar: "⧐", RightTriangleEqual: "⊵", RightUpDownVector: "⥏", RightUpTeeVector: "⥜", RightUpVector: "↾", RightUpVectorBar: "⥔", RightVector: "⇀", RightVectorBar: "⥓", ring: "˚", risingdotseq: "≓", rlarr: "⇄", rlhar: "⇌", rlm: "\u200f", rmoust: "⎱", rmoustache: "⎱", rnmid: "⫮", roang: "⟭", roarr: "⇾", robrk: "⟧", ropar: "⦆", Ropf: "ℝ", ropf: "𝕣", roplus: "⨮", rotimes: "⨵", RoundImplies: "⥰", rpar: ")", rpargt: "⦔", rppolint: "⨒", rrarr: "⇉", Rrightarrow: "⇛", rsaquo: "›", Rscr: "ℛ", rscr: "𝓇", Rsh: "↱", rsh: "↱", rsqb: "]", rsquo: "’", rsquor: "’", rthree: "⋌", rtimes: "⋊", rtri: "▹", rtrie: "⊵", rtrif: "▸", rtriltri: "⧎", RuleDelayed: "⧴", ruluhar: "⥨", rx: "℞", Sacute: "Ś", sacute: "ś", sbquo: "‚", Sc: "⪼", sc: "≻", scap: "⪸", Scaron: "Š", scaron: "š", sccue: "≽", scE: "⪴", sce: "⪰", Scedil: "Ş", scedil: "ş", Scirc: "Ŝ", scirc: "ŝ", scnap: "⪺", scnE: "⪶", scnsim: "⋩", scpolint: "⨓", scsim: "≿", Scy: "С", scy: "с", sdot: "⋅", sdotb: "⊡", sdote: "⩦", searhk: "⤥", seArr: "⇘", searr: "↘", searrow: "↘", sect: "§", semi: ";", seswar: "⤩", setminus: "∖", setmn: "∖", sext: "✶", Sfr: "𝔖", sfr: "𝔰", sfrown: "⌢", sharp: "♯", SHCHcy: "Щ", shchcy: "щ", SHcy: "Ш", shcy: "ш", ShortDownArrow: "↓", ShortLeftArrow: "←", shortmid: "∣", shortparallel: "∥", ShortRightArrow: "→", ShortUpArrow: "↑", shy: "\u00ad", Sigma: "Σ", sigma: "σ", sigmaf: "ς", sigmav: "ς", sim: "∼", simdot: "⩪", sime: "≃", simeq: "≃", simg: "⪞", simgE: "⪠", siml: "⪝", simlE: "⪟", simne: "≆", simplus: "⨤", simrarr: "⥲", slarr: "←", SmallCircle: "∘", smallsetminus: "∖", smashp: "⨳", smeparsl: "⧤", smid: "∣", smile: "⌣", smt: "⪪", smte: "⪬", smtes: "⪬︀", SOFTcy: "Ь", softcy: "ь", sol: "/", solb: "⧄", solbar: "⌿", Sopf: "𝕊", sopf: "𝕤", spades: "♠", spadesuit: "♠", spar: "∥", sqcap: "⊓", sqcaps: "⊓︀", sqcup: "⊔", sqcups: "⊔︀", Sqrt: "√", sqsub: "⊏", sqsube: "⊑", sqsubset: "⊏", sqsubseteq: "⊑", sqsup: "⊐", sqsupe: "⊒", sqsupset: "⊐", sqsupseteq: "⊒", squ: "□", Square: "□", square: "□", SquareIntersection: "⊓", SquareSubset: "⊏", SquareSubsetEqual: "⊑", SquareSuperset: "⊐", SquareSupersetEqual: "⊒", SquareUnion: "⊔", squarf: "▪", squf: "▪", srarr: "→", Sscr: "𝒮", sscr: "𝓈", ssetmn: "∖", ssmile: "⌣", sstarf: "⋆", Star: "⋆", star: "☆", starf: "★", straightepsilon: "ϵ", straightphi: "ϕ", strns: "¯", Sub: "⋐", sub: "⊂", subdot: "⪽", subE: "⫅", sube: "⊆", subedot: "⫃", submult: "⫁", subnE: "⫋", subne: "⊊", subplus: "⪿", subrarr: "⥹", Subset: "⋐", subset: "⊂", subseteq: "⊆", subseteqq: "⫅", SubsetEqual: "⊆", subsetneq: "⊊", subsetneqq: "⫋", subsim: "⫇", subsub: "⫕", subsup: "⫓", succ: "≻", succapprox: "⪸", succcurlyeq: "≽", Succeeds: "≻", SucceedsEqual: "⪰", SucceedsSlantEqual: "≽", SucceedsTilde: "≿", succeq: "⪰", succnapprox: "⪺", succneqq: "⪶", succnsim: "⋩", succsim: "≿", SuchThat: "∋", Sum: "∑", sum: "∑", sung: "♪", Sup: "⋑", sup: "⊃", sup1: "¹", sup2: "²", sup3: "³", supdot: "⪾", supdsub: "⫘", supE: "⫆", supe: "⊇", supedot: "⫄", Superset: "⊃", SupersetEqual: "⊇", suphsol: "⟉", suphsub: "⫗", suplarr: "⥻", supmult: "⫂", supnE: "⫌", supne: "⊋", supplus: "⫀", Supset: "⋑", supset: "⊃", supseteq: "⊇", supseteqq: "⫆", supsetneq: "⊋", supsetneqq: "⫌", supsim: "⫈", supsub: "⫔", supsup: "⫖", swarhk: "⤦", swArr: "⇙", swarr: "↙", swarrow: "↙", swnwar: "⤪", szlig: "ß", Tab: "\u0009", target: "⌖", Tau: "Τ", tau: "τ", tbrk: "⎴", Tcaron: "Ť", tcaron: "ť", Tcedil: "Ţ", tcedil: "ţ", Tcy: "Т", tcy: "т", tdot: "⃛", telrec: "⌕", Tfr: "𝔗", tfr: "𝔱", there4: "∴", Therefore: "∴", therefore: "∴", Theta: "Θ", theta: "θ", thetasym: "ϑ", thetav: "ϑ", thickapprox: "≈", thicksim: "∼", ThickSpace: "  ", thinsp: " ", ThinSpace: " ", thkap: "≈", thksim: "∼", THORN: "Þ", thorn: "þ", Tilde: "∼", tilde: "˜", TildeEqual: "≃", TildeFullEqual: "≅", TildeTilde: "≈", times: "×", timesb: "⊠", timesbar: "⨱", timesd: "⨰", tint: "∭", toea: "⤨", top: "⊤", topbot: "⌶", topcir: "⫱", Topf: "𝕋", topf: "𝕥", topfork: "⫚", tosa: "⤩", tprime: "‴", TRADE: "™", trade: "™", triangle: "▵", triangledown: "▿", triangleleft: "◃", trianglelefteq: "⊴", triangleq: "≜", triangleright: "▹", trianglerighteq: "⊵", tridot: "◬", trie: "≜", triminus: "⨺", TripleDot: "⃛", triplus: "⨹", trisb: "⧍", tritime: "⨻", trpezium: "⏢", Tscr: "𝒯", tscr: "𝓉", TScy: "Ц", tscy: "ц", TSHcy: "Ћ", tshcy: "ћ", Tstrok: "Ŧ", tstrok: "ŧ", twixt: "≬", twoheadleftarrow: "↞", twoheadrightarrow: "↠", Uacute: "Ú", uacute: "ú", Uarr: "↟", uArr: "⇑", uarr: "↑", Uarrocir: "⥉", Ubrcy: "Ў", ubrcy: "ў", Ubreve: "Ŭ", ubreve: "ŭ", Ucirc: "Û", ucirc: "û", Ucy: "У", ucy: "у", udarr: "⇅", Udblac: "Ű", udblac: "ű", udhar: "⥮", ufisht: "⥾", Ufr: "𝔘", ufr: "𝔲", Ugrave: "Ù", ugrave: "ù", uHar: "⥣", uharl: "↿", uharr: "↾", uhblk: "▀", ulcorn: "⌜", ulcorner: "⌜", ulcrop: "⌏", ultri: "◸", Umacr: "Ū", umacr: "ū", uml: "¨", UnderBar: "_", UnderBrace: "⏟", UnderBracket: "⎵", UnderParenthesis: "⏝", Union: "⋃", UnionPlus: "⊎", Uogon: "Ų", uogon: "ų", Uopf: "𝕌", uopf: "𝕦", UpArrow: "↑", Uparrow: "⇑", uparrow: "↑", UpArrowBar: "⤒", UpArrowDownArrow: "⇅", UpDownArrow: "↕", Updownarrow: "⇕", updownarrow: "↕", UpEquilibrium: "⥮", upharpoonleft: "↿", upharpoonright: "↾", uplus: "⊎", UpperLeftArrow: "↖", UpperRightArrow: "↗", Upsi: "ϒ", upsi: "υ", upsih: "ϒ", Upsilon: "Υ", upsilon: "υ", UpTee: "⊥", UpTeeArrow: "↥", upuparrows: "⇈", urcorn: "⌝", urcorner: "⌝", urcrop: "⌎", Uring: "Ů", uring: "ů", urtri: "◹", Uscr: "𝒰", uscr: "𝓊", utdot: "⋰", Utilde: "Ũ", utilde: "ũ", utri: "▵", utrif: "▴", uuarr: "⇈", Uuml: "Ü", uuml: "ü", uwangle: "⦧", vangrt: "⦜", varepsilon: "ϵ", varkappa: "ϰ", varnothing: "∅", varphi: "ϕ", varpi: "ϖ", varpropto: "∝", vArr: "⇕", varr: "↕", varrho: "ϱ", varsigma: "ς", varsubsetneq: "⊊︀", varsubsetneqq: "⫋︀", varsupsetneq: "⊋︀", varsupsetneqq: "⫌︀", vartheta: "ϑ", vartriangleleft: "⊲", vartriangleright: "⊳", Vbar: "⫫", vBar: "⫨", vBarv: "⫩", Vcy: "В", vcy: "в", VDash: "⊫", Vdash: "⊩", vDash: "⊨", vdash: "⊢", Vdashl: "⫦", Vee: "⋁", vee: "∨", veebar: "⊻", veeeq: "≚", vellip: "⋮", Verbar: "‖", verbar: "|", Vert: "‖", vert: "|", VerticalBar: "∣", VerticalLine: "|", VerticalSeparator: "❘", VerticalTilde: "≀", VeryThinSpace: " ", Vfr: "𝔙", vfr: "𝔳", vltri: "⊲", vnsub: "⊂⃒", vnsup: "⊃⃒", Vopf: "𝕍", vopf: "𝕧", vprop: "∝", vrtri: "⊳", Vscr: "𝒱", vscr: "𝓋", vsubnE: "⫋︀", vsubne: "⊊︀", vsupnE: "⫌︀", vsupne: "⊋︀", Vvdash: "⊪", vzigzag: "⦚", Wcirc: "Ŵ", wcirc: "ŵ", wedbar: "⩟", Wedge: "⋀", wedge: "∧", wedgeq: "≙", weierp: "℘", Wfr: "𝔚", wfr: "𝔴", Wopf: "𝕎", wopf: "𝕨", wp: "℘", wr: "≀", wreath: "≀", Wscr: "𝒲", wscr: "𝓌", xcap: "⋂", xcirc: "◯", xcup: "⋃", xdtri: "▽", Xfr: "𝔛", xfr: "𝔵", xhArr: "⟺", xharr: "⟷", Xi: "Ξ", xi: "ξ", xlArr: "⟸", xlarr: "⟵", xmap: "⟼", xnis: "⋻", xodot: "⨀", Xopf: "𝕏", xopf: "𝕩", xoplus: "⨁", xotime: "⨂", xrArr: "⟹", xrarr: "⟶", Xscr: "𝒳", xscr: "𝓍", xsqcup: "⨆", xuplus: "⨄", xutri: "△", xvee: "⋁", xwedge: "⋀", Yacute: "Ý", yacute: "ý", YAcy: "Я", yacy: "я", Ycirc: "Ŷ", ycirc: "ŷ", Ycy: "Ы", ycy: "ы", yen: "¥", Yfr: "𝔜", yfr: "𝔶", YIcy: "Ї", yicy: "ї", Yopf: "𝕐", yopf: "𝕪", Yscr: "𝒴", yscr: "𝓎", YUcy: "Ю", yucy: "ю", Yuml: "Ÿ", yuml: "ÿ", Zacute: "Ź", zacute: "ź", Zcaron: "Ž", zcaron: "ž", Zcy: "З", zcy: "з", Zdot: "Ż", zdot: "ż", zeetrf: "ℨ", ZeroWidthSpace: "​", Zeta: "Ζ", zeta: "ζ", Zfr: "ℨ", zfr: "𝔷", ZHcy: "Ж", zhcy: "ж", zigrarr: "⇝", Zopf: "ℤ", zopf: "𝕫", Zscr: "𝒵", zscr: "𝓏", zwj: "\u200d", zwnj: "\u200c"
  };
});

enifed('simple-html-tokenizer/index', ['exports', './html5-named-char-refs', './entity-parser', './evented-tokenizer', './tokenizer', './tokenize'], function (exports, _html5NamedCharRefs, _entityParser, _eventedTokenizer, _tokenizer, _tokenize) {
  'use strict';

  exports.HTML5NamedCharRefs = _html5NamedCharRefs.default;
  exports.EntityParser = _entityParser.default;
  exports.EventedTokenizer = _eventedTokenizer.default;
  exports.Tokenizer = _tokenizer.default;
  exports.tokenize = _tokenize.default;
});

enifed('simple-html-tokenizer/tokenize', ['exports', './tokenizer', './entity-parser', './html5-named-char-refs'], function (exports, _tokenizer, _entityParser, _html5NamedCharRefs) {
  'use strict';

  exports.default = tokenize;

  function tokenize(input, options) {
    var tokenizer = new _tokenizer.default(new _entityParser.default(_html5NamedCharRefs.default), options);
    return tokenizer.tokenize(input);
  }
});

enifed('simple-html-tokenizer/tokenizer', ['exports', './evented-tokenizer'], function (exports, _eventedTokenizer) {
  'use strict';

  function Tokenizer(entityParser, options) {
    this.token = null;
    this.startLine = 1;
    this.startColumn = 0;
    this.options = options || {};
    this.tokenizer = new _eventedTokenizer.default(this, entityParser);
  }

  Tokenizer.prototype = {
    tokenize: function (input) {
      this.tokens = [];
      this.tokenizer.tokenize(input);
      return this.tokens;
    },

    tokenizePart: function (input) {
      this.tokens = [];
      this.tokenizer.tokenizePart(input);
      return this.tokens;
    },

    tokenizeEOF: function () {
      this.tokens = [];
      this.tokenizer.tokenizeEOF();
      return this.tokens[0];
    },

    reset: function () {
      this.token = null;
      this.startLine = 1;
      this.startColumn = 0;
    },

    addLocInfo: function () {
      if (this.options.loc) {
        this.token.loc = {
          start: {
            line: this.startLine,
            column: this.startColumn
          },
          end: {
            line: this.tokenizer.line,
            column: this.tokenizer.column
          }
        };
      }
      this.startLine = this.tokenizer.line;
      this.startColumn = this.tokenizer.column;
    },

    // Data

    beginData: function () {
      this.token = {
        type: 'Chars',
        chars: ''
      };
      this.tokens.push(this.token);
    },

    appendToData: function (char) {
      this.token.chars += char;
    },

    finishData: function () {
      this.addLocInfo();
    },

    // Comment

    beginComment: function () {
      this.token = {
        type: 'Comment',
        chars: ''
      };
      this.tokens.push(this.token);
    },

    appendToCommentData: function (char) {
      this.token.chars += char;
    },

    finishComment: function () {
      this.addLocInfo();
    },

    // Tags - basic

    beginStartTag: function () {
      this.token = {
        type: 'StartTag',
        tagName: '',
        attributes: [],
        selfClosing: false
      };
      this.tokens.push(this.token);
    },

    beginEndTag: function () {
      this.token = {
        type: 'EndTag',
        tagName: ''
      };
      this.tokens.push(this.token);
    },

    finishTag: function () {
      this.addLocInfo();
    },

    markTagAsSelfClosing: function () {
      this.token.selfClosing = true;
    },

    // Tags - name

    appendToTagName: function (char) {
      this.token.tagName += char;
    },

    // Tags - attributes

    beginAttribute: function () {
      this._currentAttribute = ["", "", null];
      this.token.attributes.push(this._currentAttribute);
    },

    appendToAttributeName: function (char) {
      this._currentAttribute[0] += char;
    },

    beginAttributeValue: function (isQuoted) {
      this._currentAttribute[2] = isQuoted;
    },

    appendToAttributeValue: function (char) {
      this._currentAttribute[1] = this._currentAttribute[1] || "";
      this._currentAttribute[1] += char;
    },

    finishAttributeValue: function () {}
  };

  exports.default = Tokenizer;
});

enifed("simple-html-tokenizer/utils", ["exports"], function (exports) {
  "use strict";

  exports.isSpace = isSpace;
  exports.isAlpha = isAlpha;
  exports.preprocessInput = preprocessInput;
  var WSP = /[\t\n\f ]/;
  var ALPHA = /[A-Za-z]/;
  var CRLF = /\r\n?/g;

  function isSpace(char) {
    return WSP.test(char);
  }

  function isAlpha(char) {
    return ALPHA.test(char);
  }

  function preprocessInput(input) {
    return input.replace(CRLF, "\n");
  }
});
//# sourceMappingURL=glimmer-compiler.amd.map