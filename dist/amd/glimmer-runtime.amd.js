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
//# sourceMappingURL=glimmer-runtime.amd.map