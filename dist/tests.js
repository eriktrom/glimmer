enifed("glimmer/tests/htmlbars-node-test", ["exports"], function (exports) {
  "use strict";
});
// import {compile} from "../htmlbars";
// QUnit.module('htmlbars');
// test("compile is exported", function(){
//   ok(typeof compile === 'function', 'compile is exported');
// });

enifed('glimmer-compiler/tests/compile-tests', ['exports', 'glimmer-compiler'], function (exports, _glimmerCompiler) {
    'use strict';

    QUnit.module('compile: buildMeta');
    QUnit.skip('is merged into meta in template', function () {
        var template = _glimmerCompiler.compile('Hi, {{name}}!', {
            buildMeta: function () {
                return { blah: 'zorz' };
            }
        });
        equal(template.meta['blah'], 'zorz', 'return value from buildMeta was pass through');
    });
    QUnit.skip('the program is passed to the callback function', function () {
        var template = _glimmerCompiler.compile('Hi, {{name}}!', {
            buildMeta: function (program) {
                return { loc: program.loc };
            }
        });
        equal(template.meta['loc'].start.line, 1, 'the loc was passed through from program');
    });
    QUnit.skip('value keys are properly stringified', function () {
        var template = _glimmerCompiler.compile('Hi, {{name}}!', {
            buildMeta: function () {
                return { 'loc-derp.lol': 'zorz' };
            }
        });
        equal(template.meta['loc-derp.lol'], 'zorz', 'return value from buildMeta was pass through');
    });
    QUnit.skip('returning undefined does not throw errors', function () {
        var template = _glimmerCompiler.compile('Hi, {{name}}!', {
            buildMeta: function () {
                return;
            }
        });
        ok(template.meta, 'meta is present in template, even if empty');
    });
    QUnit.skip('options are not required for `compile`', function () {
        var template = _glimmerCompiler.compile('Hi, {{name}}!');
        ok(template.meta, 'meta is present in template, even if empty');
    });
});

enifed("glimmer-compiler/tests/fragment-test", ["exports"], function (exports) {
  "use strict";
});
//import FragmentOpcodeCompiler from "../glimmer-compiler/fragment-opcode-compiler";
//import FragmentJavaScriptCompiler from "../glimmer-compiler/fragment-javascript-compiler";
//import DOMHelper from "../dom-helper";
//import { preprocess } from "../glimmer-syntax/parser";
//import { equalHTML, getTextContent } from "../glimmer-test-helpers";
//var xhtmlNamespace = "http://www.w3.org/1999/xhtml",
//svgNamespace = "http://www.w3.org/2000/svg";
//function fragmentFor(ast) {
//[> jshint evil: true <]
//var fragmentOpcodeCompiler = new FragmentOpcodeCompiler(),
//fragmentCompiler = new FragmentJavaScriptCompiler();
//var opcodes = fragmentOpcodeCompiler.compile(ast);
//var program = fragmentCompiler.compile(opcodes);
//var fn = new Function("env", 'return ' + program)();
//return fn({ dom: new DOMHelper() });
//}
//QUnit.module('fragment');
//test('compiles a fragment', function () {
//var ast = preprocess("<div>{{foo}} bar {{baz}}</div>");
//var divNode = fragmentFor(ast).firstChild;
//equalHTML(divNode, "<div><!----> bar <!----></div>");
//});
//if (document && document.createElementNS) {
//test('compiles an svg fragment', function () {
//var ast = preprocess("<div><svg><circle/><foreignObject><span></span></foreignObject></svg></div>");
//var divNode = fragmentFor(ast).firstChild;
//equal( divNode.childNodes[0].namespaceURI, svgNamespace,
//'svg has the right namespace' );
//equal( divNode.childNodes[0].childNodes[0].namespaceURI, svgNamespace,
//'circle has the right namespace' );
//equal( divNode.childNodes[0].childNodes[1].namespaceURI, svgNamespace,
//'foreignObject has the right namespace' );
//equal( divNode.childNodes[0].childNodes[1].childNodes[0].namespaceURI, xhtmlNamespace,
//'span has the right namespace' );
//});
//}
//test('compiles an svg element with classes', function () {
//var ast = preprocess('<svg class="red right hand"></svg>');
//var svgNode = fragmentFor(ast).firstChild;
//equal(svgNode.getAttribute('class'), 'red right hand');
//});
//if (document && document.createElementNS) {
//test('compiles an svg element with proper namespace', function () {
//var ast = preprocess('<svg><use xlink:title="nice-title"></use></svg>');
//var svgNode = fragmentFor(ast).firstChild;
//equal(svgNode.childNodes[0].getAttributeNS('http://www.w3.org/1999/xlink', 'title'), 'nice-title');
//equal(svgNode.childNodes[0].attributes[0].namespaceURI, 'http://www.w3.org/1999/xlink');
//equal(svgNode.childNodes[0].attributes[0].name, 'xlink:title');
//equal(svgNode.childNodes[0].attributes[0].localName, 'title');
//equal(svgNode.childNodes[0].attributes[0].value, 'nice-title');
//});
//}
//test('converts entities to their char/string equivalent', function () {
//var ast = preprocess("<div title=\"&quot;Foo &amp; Bar&quot;\">lol &lt; &#60;&#x3c; &#x3C; &LT; &NotGreaterFullEqual; &Borksnorlax;</div>");
//var divNode = fragmentFor(ast).firstChild;
//equal(divNode.getAttribute('title'), '"Foo & Bar"');
//equal(getTextContent(divNode), "lol < << < < ≧̸ &Borksnorlax;");
//});

enifed("glimmer-compiler/tests/hydration-opcode-compiler-test", ["exports"], function (exports) {
  "use strict";
});
//import HydrationOpcodeCompiler from "../glimmer-compiler/hydration-opcode-compiler";
//import { preprocess } from "../glimmer-syntax/parser";
//import { compile } from "../glimmer-compiler/compiler";
//function opcodesFor(html, options) {
//var ast = preprocess(html, options),
//compiler1 = new HydrationOpcodeCompiler(options);
//compiler1.compile(ast);
//return compiler1.opcodes;
//}
//QUnit.module("HydrationOpcodeCompiler opcode generation");
//function loc(startCol, endCol, startLine=1, endLine=1, source=null) {
//return [
//'loc', [source, [startLine, startCol], [endLine, endCol]]
//];
//}
//function sloc(startCol, endCol, startLine=1, endLine=1, source=null) {
//return ['loc', [source, [startLine, startCol], [endLine, endCol]]];
//}
//function equalOpcodes(actual, expected) {
//let equiv = QUnit.equiv(actual, expected);
//let exString = "";
//let acString = "";
//let i = 0;
//for (; i<actual.length; i++) {
//let a = actual[i];
//let e = expected && expected[i];
//a = a ? JSON.stringify(a).replace(/"/g, "'") : "";
//e = e ? JSON.stringify(e).replace(/"/g, "'") : "";
//exString += e + "\n";
//acString += a + "\n";
//}
//if (expected) {
//for (; i<expected.length; i++) {
//let e = expected[i];
//e = e ? JSON.stringify(e).replace(/"/g, "'") : "";
//acString += "\n";
//exString += e + "\n";
//}
//}
//QUnit.push(equiv, acString, exString);
//}
//function equalStatements(actual, expected) {
//equalOpcodes(actual, expected);
//}
//function testCompile(string, templateSource, opcodes, ...statementList) {
//var template, childTemplates;
//QUnit.module(`Compiling ${string}: ${templateSource}`, {
//setup: function() {
//template = compile(templateSource).raw;
//childTemplates = template.children;
//}
//});
//test("opcodes", function() {
//equalOpcodes(opcodesFor(templateSource), opcodes);
//});
//let statements = statementList.shift();
//test("statements for the root template", function() {
//equalStatements(template.spec.statements, statements);
//});
//test("correct list of child templates", function() {
//equal(template.children.length, statementList.length, "list of child templates should match the expected list of statements");
//});
//for (let i=0, l=statementList.length; i<l; i++) {
//statementTest(statementList, i);
//}
//function statementTest(list, i) {
//test(`statements for template ${i}`, function() {
//equalStatements(childTemplates[i].spec.statements || [], list[i]);
//});
//}
//}
//let s = {
//content(path, loc) {
//return ['content', path, sloc(...loc)];
//},
//block(name, loc, template=null, params=[], hash=[], inverse=null) {
//return ['block', name, params, hash, template, inverse, sloc(...loc)];
//},
//inline(name, params=[], hash=[], loc=null) {
//return [ 'inline', name, params, hash, sloc(...loc) ];
//},
//element(name, params=[], hash=[], loc=null) {
//return [ 'element', name, params, hash, sloc(...loc) ];
//},
//attribute(name, expression) {
//return [ 'attribute', name, expression ];
//},
//component(path, attrs=[], template=null) {
//return [ 'component', path, attrs, template ];
//},
//get(path, loc) {
//return [ 'get', path, sloc(...loc) ];
//},
//concat(...args) {
//return [ 'concat', args ];
//},
//subexpr(name, params=[], hash=[], loc=null) {
//return [ 'subexpr', name, params, hash, sloc(...loc) ];
//}
//};
//QUnit.module(`Compiling <my-component> with isStatic plugin: <my-component />`);
//test("isStatic skips boundary nodes", function() {
//var ast = preprocess('<my-component />');
//ast.body[0].isStatic = true;
//var compiler1 = new HydrationOpcodeCompiler();
//compiler1.compile(ast);
//equalOpcodes(compiler1.opcodes, [
//['createMorph',[0,[],0,0,true]],
//['prepareObject',[0]],
//['pushLiteral',['my-component']],
//['printComponentHook',[0,0,['loc',[null,[1,0],[1,16]]]]]
//]);
//});
//testCompile("simple example", "<div>{{foo}} bar {{baz}}</div>", [
//[ "consumeParent", [ 0 ] ],
//[ "shareElement", [ 0 ] ],
//[ "createMorph", [ 0, [ 0 ], 0, 0, true ] ],
//[ "createMorph", [ 1, [ 0 ], 2, 2, true ] ],
//[ "pushLiteral", [ "foo" ] ],
//[ "printContentHook", [ loc(5, 12) ] ],
//[ "pushLiteral", [ "baz" ] ],
//[ "printContentHook", [ loc(17, 24) ] ],
//[ "popParent", [] ]
//], [
//s.content('foo', [ 5, 12 ]),
//s.content('baz', [ 17, 24 ])
//]);
//testCompile("simple block", "<div>{{#foo}}{{/foo}}</div>", [
//[ "consumeParent", [ 0 ] ],
//[ "createMorph", [ 0, [ 0 ], 0, 0, true ] ],
//[ "prepareObject", [ 0 ] ],
//[ "prepareArray", [ 0 ] ],
//[ "pushLiteral", [ "foo" ] ],
//[ "printBlockHook", [ 0, null, loc(5, 21) ] ],
//[ "popParent", [] ]
//], [
//s.block('foo', [ 5, 21 ], 0)
//], []);
//testCompile("simple block with block params", "<div>{{#foo as |bar baz|}}{{/foo}}</div>", [
//[ "consumeParent", [ 0 ] ],
//[ "createMorph", [ 0, [ 0 ], 0, 0, true ] ],
//[ "prepareObject", [ 0 ] ],
//[ "prepareArray", [ 0 ] ],
//[ "pushLiteral", [ "foo" ] ],
//[ "printBlockHook", [ 0, null, loc(5, 34) ] ],
//[ "popParent", [] ]
//], [
//s.block('foo', [5, 34], 0)
//], []);
//testCompile("element with a sole mustache child", "<div>{{foo}}</div>", [
//[ "consumeParent", [ 0 ] ],
//[ "createMorph", [ 0, [ 0 ], 0, 0, true ] ],
//[ "pushLiteral", [ "foo" ] ],
//[ "printContentHook",[ loc(5, 12) ] ],
//[ "popParent", [] ]
//], [
//s.content('foo', [5, 12])
//]);
//testCompile("element with a mustache between two text nodes", "<div> {{foo}} </div>", [
//[ "consumeParent", [ 0 ] ],
//[ "createMorph", [ 0, [ 0 ], 1, 1, true ] ],
//[ "pushLiteral", [ "foo" ] ],
//[ "printContentHook", [ loc(6, 13) ] ],
//[ "popParent", [] ]
//], [
//s.content('foo', [6, 13])
//]);
//testCompile("mustache two elements deep", "<div><div>{{foo}}</div></div>", [
//[ "consumeParent", [ 0 ] ],
//[ "consumeParent", [ 0 ] ],
//[ "createMorph", [ 0, [ 0, 0 ], 0, 0, true ] ],
//[ "pushLiteral", [ "foo" ] ],
//[ "printContentHook", [ loc(10, 17) ] ],
//[ "popParent", [] ],
//[ "popParent", [] ]
//], [
//s.content('foo', [10, 17])
//]);
//testCompile("two sibling elements with mustaches", "<div>{{foo}}</div><div>{{bar}}</div>", [
//[ "consumeParent", [ 0 ] ],
//[ "createMorph", [ 0, [ 0 ], 0, 0, true ] ],
//[ "pushLiteral", [ "foo" ] ],
//[ "printContentHook", [ loc(5, 12) ] ],
//[ "popParent", [] ],
//[ "consumeParent", [ 1 ] ],
//[ "createMorph", [ 1, [ 1 ], 0, 0, true ] ],
//[ "pushLiteral", [ "bar" ] ],
//[ "printContentHook", [ loc(23, 30) ] ],
//[ "popParent", [] ]
//], [
//s.content('foo', [5, 12]),
//s.content('bar', [23, 30])
//]);
//testCompile("mustaches at the root", "{{foo}} {{bar}}", [
//[ "createMorph", [ 0, [ ], 0, 0, true ] ],
//[ "createMorph", [ 1, [ ], 2, 2, true ] ],
//[ "openBoundary", [ ] ],
//[ "pushLiteral", [ "foo" ] ],
//[ "printContentHook", [ loc(0, 7) ] ],
//[ "closeBoundary", [ ] ],
//[ "pushLiteral", [ "bar" ] ],
//[ "printContentHook", [ loc(8, 15) ] ]
//], [
//s.content('foo', [0, 7]),
//s.content('bar', [8, 15])
//]);
//testCompile("back to back mustaches should have a text node inserted between them", "<div>{{foo}}{{bar}}{{baz}}wat{{qux}}</div>", [
//[ "consumeParent", [ 0 ] ],
//[ "shareElement", [ 0 ] ],
//[ "createMorph", [ 0, [0], 0, 0, true ] ],
//[ "createMorph", [ 1, [0], 1, 1, true ] ],
//[ "createMorph", [ 2, [0], 2, 2, true ] ],
//[ "createMorph", [ 3, [0], 4, 4, true] ],
//[ "pushLiteral", [ "foo" ] ],
//[ "printContentHook", [ loc(5, 12) ] ],
//[ "pushLiteral", [ "bar" ] ],
//[ "printContentHook", [ loc(12, 19) ] ],
//[ "pushLiteral", [ "baz" ] ],
//[ "printContentHook", [ loc(19, 26) ] ],
//[ "pushLiteral", [ "qux" ] ],
//[ "printContentHook", [ loc(29, 36) ] ],
//[ "popParent", [] ]
//], [
//s.content('foo', [5, 12]),
//s.content('bar', [12, 19]),
//s.content('baz', [19, 26]),
//s.content('qux', [29, 36])
//]);
//testCompile("helper usage", "<div>{{foo 'bar' baz.bat true 3.14}}</div>", [
//[ "consumeParent", [ 0 ] ],
//[ "createMorph", [ 0, [0], 0, 0, true ] ],
//[ "prepareObject", [ 0 ] ],
//[ "pushLiteral", [ 3.14 ] ],
//[ "pushLiteral", [ true ] ],
//[ "pushGetHook", [ "baz.bat", loc(17, 24) ] ],
//[ "pushLiteral", [ "bar" ] ],
//[ "prepareArray", [ 4 ] ],
//[ "pushLiteral", [ "foo" ] ],
//[ "printInlineHook", [ loc(5, 36) ] ],
//[ "popParent", [] ]
//], [
//s.inline('foo', [ 'bar', s.get('baz.bat', [17, 24]), true, 3.14 ], [], [5, 36])
//]);
//testCompile("node mustache", "<div {{foo}}></div>", [
//[ "consumeParent", [ 0 ] ],
//[ "prepareObject", [ 0 ] ],
//[ "prepareArray", [ 0 ] ],
//[ "pushLiteral", [ "foo" ] ],
//[ "shareElement", [ 0 ] ],
//[ "createElementMorph", [ 0, 0 ] ],
//[ "printElementHook", [ loc(5, 12) ] ],
//[ "popParent", [] ]
//], [
//s.element('foo', [], [], [ 5, 12 ])
//]);
//testCompile("node helper", "<div {{foo 'bar'}}></div>", [
//[ "consumeParent", [ 0 ] ],
//[ "prepareObject", [ 0 ] ],
//[ "pushLiteral", [ "bar" ] ],
//[ "prepareArray", [ 1 ] ],
//[ "pushLiteral", [ "foo" ] ],
//[ "shareElement", [ 0 ] ],
//[ "createElementMorph", [ 0, 0 ] ],
//[ "printElementHook", [ loc(5, 18) ] ],
//[ "popParent", [] ]
//], [
//s.element('foo', ['bar'], [], [5, 18])
//]);
//testCompile("attribute mustache", "<div class='before {{foo}} after'></div>", [
//[ "consumeParent", [ 0 ] ],
//[ "pushLiteral", [ " after" ] ],
//[ "pushGetHook", [ "foo", loc(21, 24) ] ],
//[ "pushLiteral", [ "before " ] ],
//[ "prepareArray", [ 3 ] ],
//[ "pushConcatHook", [ 0 ] ],
//[ "pushLiteral", [ "class" ] ],
//[ "shareElement", [ 0 ] ],
//[ "createAttrMorph", [ 0, 0, "class", true, null ] ],
//[ "printAttributeHook", [ ] ],
//[ "popParent", [] ]
//], [
//s.attribute('class', s.concat('before ', s.get('foo', [ 21, 24 ]), ' after'))
//]);
//testCompile("quoted attribute mustache", "<div class='{{foo}}'></div>", [
//[ "consumeParent", [ 0 ] ],
//[ "pushGetHook", [ "foo", loc(14, 17) ] ],
//[ "prepareArray", [ 1 ] ],
//[ "pushConcatHook", [ 0 ] ],
//[ "pushLiteral", [ "class" ] ],
//[ "shareElement", [ 0 ] ],
//[ "createAttrMorph", [ 0, 0, "class", true, null ] ],
//[ "printAttributeHook", [ ] ],
//[ "popParent", [] ]
//], [
//s.attribute('class', s.concat(s.get('foo', [ 14, 17 ])))
//]);
//testCompile("safe bare attribute mustache", "<div class={{foo}}></div>", [
//[ "consumeParent", [ 0 ] ],
//[ "pushGetHook", [ "foo", loc(13, 16) ] ],
//[ "pushLiteral", [ "class" ] ],
//[ "shareElement", [ 0 ] ],
//[ "createAttrMorph", [ 0, 0, "class", true, null ] ],
//[ "printAttributeHook", [ ] ],
//[ "popParent", [] ]
//], [
//s.attribute('class', s.get('foo', [ 13, 16 ]))
//]);
//testCompile("unsafe bare attribute mustache", "<div class={{{foo}}}></div>", [
//[ "consumeParent", [ 0 ] ],
//[ "pushGetHook", [ "foo", loc(14, 17) ] ],
//[ "pushLiteral", [ "class" ] ],
//[ "shareElement", [ 0 ] ],
//[ "createAttrMorph", [ 0, 0, "class", false, null ] ],
//[ "printAttributeHook", [ ] ],
//[ "popParent", [] ]
//], [
//s.attribute('class', s.get('foo', [ 14, 17 ]))
//]);
//testCompile("attribute helper", "<div class='before {{foo 'bar'}} after'></div>", [
//[ "consumeParent", [ 0 ] ],
//[ "pushLiteral", [ " after" ] ],
//[ "prepareObject", [ 0 ] ],
//[ "pushLiteral", [ "bar" ] ],
//[ "prepareArray", [ 1 ] ],
//[ "pushLiteral", [ "foo" ] ],
//[ "pushSexprHook", [ loc(19, 32) ] ],
//[ "pushLiteral", [ "before " ] ],
//[ "prepareArray", [ 3 ] ],
//[ "pushConcatHook", [ 0 ] ],
//[ "pushLiteral", [ "class" ] ],
//[ "shareElement", [ 0 ] ],
//[ "createAttrMorph", [ 0, 0, "class", true, null ] ],
//[ "printAttributeHook", [ ] ],
//[ "popParent", [] ]
//], [
//s.attribute('class', s.concat('before ', s.subexpr('foo', [ 'bar' ], [], [19, 32]), ' after'))
//]);
//testCompile("attribute helpers", "<div class='before {{foo 'bar'}} after' id={{bare}}></div>{{morphThing}}<span class='{{ohMy}}'></span>", [
//[ "consumeParent", [ 0 ] ],
//[ "shareElement", [ 0 ] ],
//[ "pushLiteral", [ " after" ] ],
//[ "prepareObject", [ 0 ] ],
//[ "pushLiteral", [ "bar" ] ],
//[ "prepareArray", [ 1 ] ],
//[ "pushLiteral", [ "foo" ] ],
//[ "pushSexprHook", [ loc(19, 32) ] ],
//[ "pushLiteral", [ "before " ] ],
//[ "prepareArray", [ 3 ] ],
//[ "pushConcatHook", [ 0 ] ],
//[ "pushLiteral", [ "class" ] ],
//[ "createAttrMorph", [ 0, 0, "class", true, null ] ],
//[ "printAttributeHook", [ ] ],
//[ "pushGetHook", [ 'bare', loc(45, 49) ] ],
//[ "pushLiteral", [ 'id' ] ],
//[ "createAttrMorph", [ 1, 0, 'id', true, null ] ],
//[ "printAttributeHook", [ ] ],
//[ "popParent", [] ],
//[ "createMorph", [ 2, [], 1, 1, true ] ],
//[ "pushLiteral", [ 'morphThing' ] ],
//[ "printContentHook", [ loc(58, 72) ] ],
//[ "consumeParent", [ 2 ] ],
//[ "pushGetHook", [ 'ohMy', loc(87, 91) ] ],
//[ "prepareArray", [ 1 ] ],
//[ "pushConcatHook", [ 3 ] ],
//[ "pushLiteral", [ 'class' ] ],
//[ "shareElement", [ 1 ] ],
//[ "createAttrMorph", [ 3, 1, 'class', true, null ] ],
//[ "printAttributeHook", [ ] ],
//[ "popParent", [] ]
//], [
//s.attribute('class', s.concat('before ', s.subexpr('foo', ['bar'], [], [ 19, 32 ]), ' after')),
//s.attribute('id', s.get('bare', [ 45, 49 ])),
//s.content('morphThing', [ 58, 72 ]),
//s.attribute('class', s.concat(s.get('ohMy', [ 87, 91 ])))
//]);
//testCompile('component helpers', "<my-component>hello</my-component>", [
//[ "createMorph", [ 0, [ ], 0, 0, true ] ],
//[ "openBoundary", [ ] ],
//[ "closeBoundary", [ ] ],
//[ "prepareObject", [ 0 ] ],
//[ "pushLiteral", [ "my-component" ] ],
//[ "printComponentHook", [ 0, 0, loc(0, 34) ] ]
//], [
//s.component('my-component', [], 0)
//], []);

enifed("glimmer-compiler/tests/template-visitor-node-test", ["exports", "glimmer-syntax", "glimmer-compiler"], function (exports, _glimmerSyntax, _glimmerCompiler) {
    "use strict";

    function actionsEqual(input, expectedActions) {
        var ast = _glimmerSyntax.preprocess(input);
        var templateVisitor = new _glimmerCompiler.TemplateVisitor();
        templateVisitor.visit(ast);
        var actualActions = templateVisitor.actions;
        // Remove the AST node reference from the actions to keep tests leaner
        for (var i = 0; i < actualActions.length; i++) {
            actualActions[i][1].shift();
        }
        deepEqual(actualActions, expectedActions);
    }
    QUnit.module("TemplateVisitor");
    test("empty", function () {
        var input = "";
        actionsEqual(input, [['startProgram', [0, []]], ['endProgram', [0]]]);
    });
    test("basic", function () {
        var input = "foo{{bar}}<div></div>";
        actionsEqual(input, [['startProgram', [0, []]], ['text', [0, 3]], ['mustache', [1, 3]], ['openElement', [2, 3, 0, []]], ['closeElement', [2, 3]], ['endProgram', [0]]]);
    });
    test("nested HTML", function () {
        var input = "<a></a><a><a><a></a></a></a>";
        actionsEqual(input, [['startProgram', [0, []]], ['openElement', [0, 2, 0, []]], ['closeElement', [0, 2]], ['openElement', [1, 2, 0, []]], ['openElement', [0, 1, 0, []]], ['openElement', [0, 1, 0, []]], ['closeElement', [0, 1]], ['closeElement', [0, 1]], ['closeElement', [1, 2]], ['endProgram', [0]]]);
    });
    test("mustaches are counted correctly", function () {
        var input = "<a><a>{{foo}}</a><a {{foo}}><a>{{foo}}</a><a>{{foo}}</a></a></a>";
        actionsEqual(input, [['startProgram', [0, []]], ['openElement', [0, 1, 2, []]], ['openElement', [0, 2, 1, []]], ['mustache', [0, 1]], ['closeElement', [0, 2]], ['openElement', [1, 2, 3, []]], ['openElement', [0, 2, 1, []]], ['mustache', [0, 1]], ['closeElement', [0, 2]], ['openElement', [1, 2, 1, []]], ['mustache', [0, 1]], ['closeElement', [1, 2]], ['closeElement', [1, 2]], ['closeElement', [0, 1]], ['endProgram', [0]]]);
    });
    test("empty block", function () {
        var input = "{{#a}}{{/a}}";
        actionsEqual(input, [['startProgram', [0, []]], ['endProgram', [1]], ['startProgram', [1, []]], ['block', [0, 1]], ['endProgram', [0]]]);
    });
    test("block with inverse", function () {
        var input = "{{#a}}b{{^}}{{/a}}";
        actionsEqual(input, [['startProgram', [0, []]], ['endProgram', [1]], ['startProgram', [0, []]], ['text', [0, 1]], ['endProgram', [1]], ['startProgram', [2, []]], ['block', [0, 1]], ['endProgram', [0]]]);
    });
    test("nested blocks", function () {
        var input = "{{#a}}{{#a}}<b></b>{{/a}}{{#a}}{{b}}{{/a}}{{/a}}{{#a}}b{{/a}}";
        actionsEqual(input, [['startProgram', [0, []]], ['text', [0, 1]], ['endProgram', [1]], ['startProgram', [0, []]], ['mustache', [0, 1]], ['endProgram', [2]], ['startProgram', [0, []]], ['openElement', [0, 1, 0, []]], ['closeElement', [0, 1]], ['endProgram', [2]], ['startProgram', [2, []]], ['block', [0, 2]], ['block', [1, 2]], ['endProgram', [1]], ['startProgram', [2, []]], ['block', [0, 2]], ['block', [1, 2]], ['endProgram', [0]]]);
    });
    test("component", function () {
        var input = "<x-foo>bar</x-foo>";
        actionsEqual(input, [['startProgram', [0, []]], ['text', [0, 1]], ['endProgram', [1]], ['startProgram', [1, []]], ['component', [0, 1]], ['endProgram', [0]]]);
    });
    test("comment", function () {
        var input = "<!-- some comment -->";
        actionsEqual(input, [['startProgram', [0, []]], ['comment', [0, 1]], ['endProgram', [0]]]);
    });
});

enifed('glimmer-object/tests/ember-computed-test', ['exports', 'glimmer-object'], function (exports, _glimmerObject) {
    'use strict';

    var emberGet = function aget(x, y) {
        return x[y];
    };
    var emberSet = function aset(x, y, z) {
        return x[y] = z;
    };
    function testWithDefault(name, callback) {
        QUnit.test(name, function (assert) {
            callback(emberGet, emberSet);
        });
    }
    var EmberObject = _glimmerObject.default;
    function K() {
        return this;
    }
    QUnit.module('GlimmerObject.extend - Computed Properties');
    testWithDefault('computed property on instance', function (get, set) {
        var MyClass = EmberObject.extend({
            foo: _glimmerObject.computed(function () {
                return 'FOO';
            })
        });
        equal(get(new MyClass(), 'foo'), 'FOO');
    });
    testWithDefault('computed property on subclass', function (get, set) {
        var MyClass = EmberObject.extend({
            foo: _glimmerObject.computed(function () {
                return 'FOO';
            })
        });
        var Subclass = MyClass.extend({
            foo: _glimmerObject.computed(function () {
                return 'BAR';
            })
        });
        equal(get(new Subclass(), 'foo'), 'BAR');
    });
    testWithDefault('replacing computed property with regular val', function (get, set) {
        var MyClass = EmberObject.extend({
            foo: _glimmerObject.computed(function () {
                return 'FOO';
            })
        });
        var Subclass = MyClass.extend({
            foo: 'BAR'
        });
        equal(get(new Subclass(), 'foo'), 'BAR');
    });
    testWithDefault('complex dependent keys', function (get, set) {
        var MyClass = EmberObject.extend({
            init: function () {
                this._super.apply(this, arguments);
                set(this, 'bar', { baz: 'BIFF' });
            },
            foo: _glimmerObject.computed(function () {
                return get(get(this, 'bar'), 'baz');
            }).property('bar.baz')
        });
        var Subclass = MyClass.extend({});
        var obj1 = new MyClass();
        var obj2 = new Subclass();
        equal(get(obj1, 'foo'), 'BIFF');
        equal(get(obj2, 'foo'), 'BIFF');
        set(get(obj1, 'bar'), 'baz', 'BLARG');
        equal(get(obj1, 'foo'), 'BLARG');
        equal(get(obj2, 'foo'), 'BIFF');
        set(get(obj2, 'bar'), 'baz', 'BOOM');
        equal(get(obj1, 'foo'), 'BLARG');
        equal(get(obj2, 'foo'), 'BOOM');
    });
    testWithDefault('complex dependent keys changing complex dependent keys', function (get, set) {
        var MyClass = EmberObject.extend({
            init: function () {
                this._super.apply(this, arguments);
                set(this, 'bar', { baz: 'BIFF' });
            },
            foo: _glimmerObject.computed(function () {
                return get(get(this, 'bar'), 'baz');
            }).property('bar.baz')
        });
        var Subclass = MyClass.extend({
            init: function () {
                this._super.apply(this, arguments);
                set(this, 'bar2', { baz: 'BIFF2' });
            },
            foo: _glimmerObject.computed(function () {
                return get(get(this, 'bar2'), 'baz');
            }).property('bar2.baz')
        });
        var obj2 = new Subclass();
        equal(get(obj2, 'foo'), 'BIFF2');
        set(get(obj2, 'bar'), 'baz', 'BLARG');
        equal(get(obj2, 'foo'), 'BIFF2', 'should not invalidate property');
        set(get(obj2, 'bar2'), 'baz', 'BLARG');
        equal(get(obj2, 'foo'), 'BLARG', 'should invalidate property');
    });
    QUnit.test('can retrieve metadata for a computed property', function (assert) {
        var MyClass = EmberObject.extend({
            computedProperty: _glimmerObject.computed(function () {}).meta({ key: 'keyValue' })
        });
        equal(emberGet(MyClass.metaForProperty('computedProperty'), 'key'), 'keyValue', 'metadata saved on the computed property can be retrieved');
        var ClassWithNoMetadata = EmberObject.extend({
            computedProperty: _glimmerObject.computed(function () {}).volatile(),
            staticProperty: 12
        });
        equal(typeof ClassWithNoMetadata.metaForProperty('computedProperty'), 'object', 'returns empty hash if no metadata has been saved');
        assert.throws(function () {
            ClassWithNoMetadata.metaForProperty('nonexistentProperty');
        }, 'metaForProperty() could not find a computed property with key \'nonexistentProperty\'.');
        assert.throws(function () {
            ClassWithNoMetadata.metaForProperty('staticProperty');
        }, 'metaForProperty() could not find a computed property with key \'staticProperty\'.');
    });
    QUnit.test('can iterate over a list of computed properties for a class', function () {
        var MyClass = EmberObject.extend({
            foo: _glimmerObject.computed(function () {}),
            fooDidChange: _glimmerObject.observer('foo', function () {}),
            bar: _glimmerObject.computed(function () {}),
            qux: _glimmerObject.alias('foo')
        });
        var SubClass = MyClass.extend({
            baz: _glimmerObject.computed(function () {})
        });
        SubClass.reopen({
            bat: _glimmerObject.computed(function () {}).meta({ iAmBat: true })
        });
        var list = [];
        MyClass.eachComputedProperty(function (name) {
            list.push(name);
        });
        deepEqual(list.sort(), ['bar', 'foo', 'qux'], 'watched and unwatched computed properties are iterated');
        list = [];
        SubClass.eachComputedProperty(function (name, meta) {
            list.push(name);
            if (name === 'bat') {
                deepEqual(meta, { iAmBat: true });
            } else {
                deepEqual(meta, {});
            }
        });
        deepEqual(list.sort(), ['bar', 'bat', 'baz', 'foo', 'qux'], 'all inherited properties are included');
    });
    QUnit.test('list of properties updates when an additional property is added (such cache busting)', function () {
        var MyClass = EmberObject.extend({
            foo: _glimmerObject.computed(K),
            fooDidChange: _glimmerObject.observer('foo', function () {}),
            bar: _glimmerObject.computed(K)
        });
        var list = [];
        MyClass.eachComputedProperty(function (name) {
            list.push(name);
        });
        deepEqual(list.sort(), ['bar', 'foo'].sort(), 'expected two computed properties');
        MyClass.reopen({
            baz: _glimmerObject.computed(K)
        });
        MyClass.create(); // force apply mixins
        list = [];
        MyClass.eachComputedProperty(function (name) {
            list.push(name);
        });
        deepEqual(list.sort(), ['bar', 'foo', 'baz'].sort(), 'expected three computed properties');
    });
    QUnit.test('Calling _super in call outside the immediate function of a CP getter works', function () {
        function macro(callback) {
            return _glimmerObject.computed(function () {
                return callback.call(this);
            });
        }
        var MyClass = EmberObject.extend({
            foo: _glimmerObject.computed(function () {
                return 'FOO';
            })
        });
        var SubClass = MyClass.extend({
            foo: macro(function () {
                return this._super();
            })
        });
        equal(emberGet(SubClass.create(), 'foo'), 'FOO', 'super value is fetched');
    });
    QUnit.test('Calling _super in apply outside the immediate function of a CP getter works', function () {
        function macro(callback) {
            return _glimmerObject.computed(function () {
                return callback.apply(this);
            });
        }
        var MyClass = EmberObject.extend({
            foo: _glimmerObject.computed(function () {
                return 'FOO';
            })
        });
        var SubClass = MyClass.extend({
            foo: macro(function () {
                return this._super();
            })
        });
        equal(emberGet(SubClass.create(), 'foo'), 'FOO', 'super value is fetched');
    });
});

enifed('glimmer-object/tests/ember-create-test', ['exports', 'glimmer-object', 'glimmer-test-helpers'], function (exports, _glimmerObject, _glimmerTestHelpers) {
    'use strict';

    var _templateObject = _taggedTemplateLiteralLoose(['Ember.Object.create no longer supports defining computed properties.\n           Define computed properties using extend() or reopen() before calling create().'], ['Ember.Object.create no longer supports defining computed properties.\n           Define computed properties using extend() or reopen() before calling create().']);

    function _taggedTemplateLiteralLoose(strings, raw) { strings.raw = raw; return strings; }

    var moduleOptions;
    QUnit.module('GlimmerObject.create', moduleOptions);
    QUnit.test('simple properties are set', function () {
        var o = _glimmerObject.default.create({ ohai: 'there' });
        equal(o.get('ohai'), 'there');
    });
    QUnit.test('reopening a parent flushes the child', function (assert) {
        var MyClass = _glimmerObject.default.extend();
        var SubClass = MyClass.extend();
        MyClass.reopen({
            hello: function () {
                return "hello";
            }
        });
        var sub = SubClass.create();
        assert.equal(sub.hello(), "hello");
    });
    QUnit.test('reopening a parent flushes the child', function (assert) {
        var MyClass = _glimmerObject.default.extend({
            hello: function () {
                return "original hello";
            }
        });
        var SubClass = MyClass.extend({
            hello: function () {
                return this._super();
            }
        });
        var GrandChild = SubClass.extend({
            hello: function () {
                return this._super();
            }
        });
        MyClass.reopen({
            hello: function () {
                return this._super() + " new hello";
            }
        });
        var sub = GrandChild.create();
        assert.equal(sub.hello(), "original hello new hello");
    });
    QUnit.test('reopening a parent with a computed property flushes the child', function (assert) {
        var MyClass = _glimmerObject.default.extend({
            hello: _glimmerObject.computed(function () {
                return "original hello";
            })
        });
        var SubClass = MyClass.extend({
            hello: _glimmerObject.computed(function () {
                return this._super();
            })
        });
        var GrandChild = SubClass.extend({
            hello: _glimmerObject.computed(function () {
                return this._super();
            })
        });
        MyClass.reopen({
            hello: _glimmerObject.computed(function () {
                return this._super() + " new hello";
            })
        });
        var sub = GrandChild.create();
        assert.equal(sub.hello, "original hello new hello");
    });
    QUnit.test('calls computed property setters', function (assert) {
        var MyClass = _glimmerObject.default.extend({
            foo: _glimmerObject.computed({
                get: function () {
                    return 'this is not the value you\'re looking for';
                },
                set: function (key, value) {
                    return value;
                }
            })
        });
        var o = MyClass.create({ foo: 'bar' });
        assert.equal(o.get('foo'), 'bar');
    });
    QUnit.skip('allows bindings to be defined', function () {
        var obj = _glimmerObject.default.create({
            foo: 'foo',
            barBinding: 'foo'
        });
        equal(obj.get('bar'), 'foo', 'The binding value is correct');
    });
    QUnit.skip('calls setUnknownProperty if defined', function () {
        var setUnknownPropertyCalled = false;
        var MyClass = _glimmerObject.default.extend({
            setUnknownProperty: function (key, value) {
                setUnknownPropertyCalled = true;
            }
        });
        MyClass.create({ foo: 'bar' });
        ok(setUnknownPropertyCalled, 'setUnknownProperty was called');
    });
    QUnit.skip('throws if you try to define a computed property', function (assert) {
        assert.throws(function () {
            _glimmerObject.default.create({
                foo: _glimmerObject.computed(function () {})
            });
        }, _glimmerTestHelpers.strip(_templateObject));
    });
    QUnit.skip('throws if you try to call _super in a method', function (assert) {
        assert.throws(function () {
            _glimmerObject.default.create({
                foo: function () {
                    this._super.apply(this, arguments);
                }
            });
        }, 'Ember.Object.create no longer supports defining methods that call _super.');
    });
    QUnit.skip('throws if you try to \'mixin\' a definition', function (assert) {
        var myMixin = _glimmerObject.Mixin.create({
            adder: function (arg1, arg2) {
                return arg1 + arg2;
            }
        });
        assert.throws(function () {
            _glimmerObject.default.create(myMixin);
        }, 'Ember.Object.create no longer supports mixing in other definitions, use .extend & .create seperately instead.');
    });
    // This test is for IE8.
    QUnit.test('property name is the same as own prototype property', function () {
        var MyClass = _glimmerObject.default.extend({
            toString: function () {
                return 'MyClass';
            }
        });
        equal(MyClass.create().toString(), 'MyClass', 'should inherit property from the arguments of `EmberObject.create`');
    });
    QUnit.test('inherits properties from passed in EmberObject', function () {
        var baseObj = _glimmerObject.default.create({ foo: 'bar' });
        var secondaryObj = _glimmerObject.default.create(baseObj);
        equal(secondaryObj['foo'], baseObj['foo'], 'Em.O.create inherits properties from EmberObject parameter');
    });
    QUnit.skip('throws if you try to pass anything a string as a parameter', function () {
        var expected = 'EmberObject.create only accepts an objects.';
        throws(function () {
            _glimmerObject.default.create('some-string');
        }, expected);
    });
    QUnit.test('EmberObject.create can take undefined as a parameter', function () {
        var o = _glimmerObject.default.create(undefined);
        deepEqual(_glimmerObject.default.create(), o);
    });
    QUnit.test('EmberObject.create can take null as a parameter', function () {
        var o = _glimmerObject.default.create(null);
        deepEqual(_glimmerObject.default.create(), o);
    });
});

enifed('glimmer-object/tests/ember-extend-test', ['exports', 'glimmer-object'], function (exports, _glimmerObject) {
    'use strict';

    QUnit.module('GlimmerObject.extend');
    QUnit.test('Basic extend', function () {
        var SomeClass = _glimmerObject.default.extend({ foo: 'BAR' });
        ok(SomeClass.isClass, 'A class has isClass of true');
        var obj = new SomeClass();
        equal(obj.foo, 'BAR');
    });
    QUnit.test('Sub-subclass', function () {
        var SomeClass = _glimmerObject.default.extend({ foo: 'BAR' });
        var AnotherClass = SomeClass.extend({ bar: 'FOO' });
        var obj = new AnotherClass();
        equal(obj.foo, 'BAR');
        equal(obj.bar, 'FOO');
    });
    QUnit.test('Overriding a method several layers deep', function () {
        var SomeClass = _glimmerObject.default.extend({
            fooCnt: 0,
            foo: function () {
                this.fooCnt++;
            },
            barCnt: 0,
            bar: function () {
                this.barCnt++;
            }
        });
        var AnotherClass = SomeClass.extend({
            barCnt: 0,
            bar: function () {
                this.barCnt++;
                this._super.apply(this, arguments);
            }
        });
        var FinalClass = AnotherClass.extend({
            fooCnt: 0,
            foo: function () {
                this.fooCnt++;
                this._super.apply(this, arguments);
            }
        });
        var obj = new FinalClass();
        obj.foo();
        obj.bar();
        equal(obj.fooCnt, 2, 'should invoke both');
        equal(obj.barCnt, 2, 'should invoke both');
        // Try overriding on create also
        obj = FinalClass.extend({
            foo: function () {
                this.fooCnt++;
                this._super.apply(this, arguments);
            }
        }).create();
        obj.foo();
        obj.bar();
        equal(obj.fooCnt, 3, 'should invoke final as well');
        equal(obj.barCnt, 2, 'should invoke both');
    });
    QUnit.test('With concatenatedProperties', function () {
        var SomeClass = _glimmerObject.default.extend({ things: 'foo', concatenatedProperties: ['things'] });
        var AnotherClass = SomeClass.extend({ things: 'bar' });
        var YetAnotherClass = SomeClass.extend({ things: 'baz' });
        var some = new SomeClass();
        var another = new AnotherClass();
        var yetAnother = new YetAnotherClass();
        deepEqual(some.get('things'), ['foo'], 'base class should have just its value');
        deepEqual(another.get('things'), ['foo', 'bar'], 'subclass should have base class\' and its own');
        deepEqual(yetAnother.get('things'), ['foo', 'baz'], 'subclass should have base class\' and its own');
    });
    function get(obj, key) {
        return obj[key];
    }
    QUnit.test('With concatenatedProperties class properties', function () {
        var SomeClass = _glimmerObject.default.extend();
        SomeClass.reopenClass({
            concatenatedProperties: ['things'],
            things: 'foo'
        });
        var AnotherClass = SomeClass.extend();
        AnotherClass.reopenClass({ things: 'bar' });
        var YetAnotherClass = SomeClass.extend();
        YetAnotherClass.reopenClass({ things: 'baz' });
        var some = new SomeClass();
        var another = new AnotherClass();
        var yetAnother = new YetAnotherClass();
        deepEqual(get(some.constructor, 'things'), ['foo'], 'base class should have just its value');
        deepEqual(get(another.constructor, 'things'), ['foo', 'bar'], 'subclass should have base class\' and its own');
        deepEqual(get(yetAnother.constructor, 'things'), ['foo', 'baz'], 'subclass should have base class\' and its own');
    });
});

enifed('glimmer-object/tests/ember-metal-alias-method-test', ['exports', './support', 'glimmer-object'], function (exports, _support, _glimmerObject) {
    'use strict';

    QUnit.module('Mixin.aliasMethod');
    function validateAliasMethod(obj) {
        equal(obj.fooMethod(), 'FOO', 'obj.fooMethod()');
        equal(obj.barMethod(), 'FOO', 'obj.barMethod should be a copy of foo');
    }
    QUnit.test('methods of another name are aliased when the mixin is applied', function () {
        var MyMixin = _support.Mixin.create({
            fooMethod: function () {
                return 'FOO';
            },
            barMethod: _glimmerObject.aliasMethod('fooMethod')
        });
        var obj = MyMixin.apply({});
        validateAliasMethod(obj);
    });
    QUnit.test('should follow aliasMethods all the way down', function () {
        var MyMixin = _support.Mixin.create({
            bar: _glimmerObject.aliasMethod('foo'),
            baz: function () {
                return 'baz';
            },
            foo: _glimmerObject.aliasMethod('baz')
        });
        var obj = MyMixin.apply({});
        equal(_support.get(obj, 'bar')(), 'baz', 'should have followed aliasMethods');
    });
    QUnit.skip('should alias methods from other dependent mixins', function () {
        var BaseMixin = _support.Mixin.create({
            fooMethod: function () {
                return 'FOO';
            }
        });
        var MyMixin = _support.Mixin.create(BaseMixin, {
            barMethod: _glimmerObject.aliasMethod('fooMethod')
        });
        var obj = MyMixin.apply({});
        validateAliasMethod(obj);
    });
    QUnit.test('should alias methods from other mixins applied at same time', function () {
        var BaseMixin = _support.Mixin.create({
            fooMethod: function () {
                return 'FOO';
            }
        });
        var MyMixin = _support.Mixin.create({
            barMethod: _glimmerObject.aliasMethod('fooMethod')
        });
        var obj = _support.mixin({}, BaseMixin, MyMixin);
        validateAliasMethod(obj);
    });
    QUnit.test('should alias methods from mixins already applied on object', function () {
        var BaseMixin = _support.Mixin.create({
            quxMethod: function () {
                return 'qux';
            }
        });
        var MyMixin = _support.Mixin.create({
            bar: _glimmerObject.aliasMethod('foo'),
            barMethod: _glimmerObject.aliasMethod('fooMethod')
        });
        var obj = {
            fooMethod: function () {
                return 'FOO';
            }
        };
        BaseMixin.apply(obj);
        MyMixin.apply(obj);
        validateAliasMethod(obj);
    });
});

enifed('glimmer-object/tests/ember-metal-alias-test', ['exports', 'glimmer-object', 'glimmer-reference', 'glimmer-util', './support'], function (exports, _glimmerObject, _glimmerReference, _glimmerUtil, _support) {
    'use strict';

    var obj, count;
    QUnit.module('defineProperty - alias', {
        setup: function () {
            obj = { foo: { faz: 'FOO' } };
            count = 0;
        },
        teardown: function () {
            obj = null;
        }
    });
    function shouldBeClean(reference, msg) {
        // a "clean" reference is allowed to report dirty
    }
    function shouldBeDirty(reference, msg) {
        equal(reference.isDirty(), true, msg || reference + ' should be dirty');
    }
    QUnit.test('should proxy get to alt key', function () {
        _support.defineProperty(obj, 'bar', _glimmerObject.alias('foo.faz'));
        equal(_support.get(obj, 'bar'), 'FOO');
    });
    QUnit.test('should proxy set to alt key', function () {
        _support.defineProperty(obj, 'bar', _glimmerObject.alias('foo.faz'));
        _support.set(obj, 'bar', 'BAR');
        equal(_support.get(obj, 'foo.faz'), 'BAR');
    });
    QUnit.test('should observe the alias', function () {
        _support.defineProperty(obj, 'bar', _glimmerObject.alias('foo.faz'));
        var ref = _glimmerReference.Meta.for(obj).root().get(_glimmerUtil.LITERAL('bar'));
        var val = ref.value();
        equal(val, 'FOO');
        shouldBeClean(ref);
        _support.set(obj.foo, 'faz', 'FAZ');
        shouldBeDirty(ref, "after setting the property the alias is for");
        equal(ref.isDirty(), true);
        equal(ref.value(), 'FAZ');
    });
    function observe(obj, key) {
        var ref = _glimmerReference.fork(_glimmerReference.Meta.for(obj).root().get(key));
        // ref.value();
        return ref;
    }
    QUnit.test('old dependent keys should not trigger property changes', function () {
        var obj1 = Object.create(null);
        _support.defineProperty(obj1, 'foo', null);
        _support.defineProperty(obj1, 'bar', _glimmerObject.alias('foo'));
        _support.defineProperty(obj1, 'baz', _glimmerObject.alias('foo'));
        _support.defineProperty(obj1, 'baz', _glimmerObject.alias('bar')); // redefine baz
        var ref = observe(obj1, 'baz');
        equal(ref.value(), null, "The value starts out null");
        shouldBeClean(ref);
        _support.set(obj1, 'foo', 'FOO');
        shouldBeDirty(ref, "Now that we set the dependent value, the ref is dirty");
        equal(ref.value(), 'FOO', "And it sees the new value");
        shouldBeClean(ref, "But now that we got the value, the ref is no longer dirty");
        ref.destroy();
        _support.set(obj1, 'foo', 'OOF');
        shouldBeClean(ref, "Destroyed refs aren't dirty");
    });
    QUnit.test('overridden dependent keys should not trigger property changes', function () {
        var obj1 = Object.create(null);
        _support.defineProperty(obj1, 'foo', null);
        _support.defineProperty(obj1, 'bar', _glimmerObject.alias('foo'));
        _support.defineProperty(obj1, 'baz', _glimmerObject.alias('foo'));
        var ref = observe(obj1, 'baz');
        equal(ref.value(), null);
        shouldBeClean(ref);
        var obj2 = Object.create(obj1);
        _support.defineProperty(obj2, 'baz', _glimmerObject.alias('bar')); // override baz
        _support.set(obj2, 'foo', 'FOO');
        shouldBeClean(ref);
        ref.destroy();
        _support.set(obj2, 'foo', 'OOF');
        shouldBeClean(ref);
    });
    QUnit.test('begins watching alt key as soon as alias is watched', function () {
        _support.defineProperty(obj, 'bar', _glimmerObject.alias('foo.faz'));
        var ref = observe(obj, 'bar');
        equal(ref.value(), 'FOO');
        _support.set(obj, 'foo.faz', 'BAR');
        shouldBeDirty(ref);
        equal(ref.value(), 'BAR');
    });
    QUnit.test('immediately sets up dependencies if already being watched', function () {
        var ref = observe(obj, 'bar');
        _support.defineProperty(obj, 'bar', _glimmerObject.alias('foo.faz'));
        shouldBeDirty(ref, "The reference starts out dirty");
        _support.set(obj, 'foo.faz', 'BAR');
        shouldBeDirty(ref, "The reference is still dirty");
        equal(ref.value(), 'BAR');
        // equal(count, 1);
    });
    QUnit.test('setting alias on self should fail assertion', function (assert) {
        assert.throws(function () {
            _support.defineProperty(obj, 'bar', _glimmerObject.alias('bar'));
        }, /Setting alias \'bar\' on self/);
    });
});

enifed('glimmer-object/tests/ember-metal-computed-test', ['exports', './support', 'glimmer-object'], function (exports, _support, _glimmerObject) {
    'use strict';

    function K() {
        return this;
    }
    QUnit.module('Mixin.create - Computed Properties');
    QUnit.test('overriding computed properties', function () {
        var MixinA, MixinB, MixinC, MixinD;
        var obj;
        MixinA = _support.Mixin.create({
            aProp: _glimmerObject.computed(function () {
                return 'A';
            })
        });
        MixinB = _support.Mixin.create({
            aProp: _glimmerObject.computed(function () {
                return this._super.apply(this, arguments) + 'B';
            })
        });
        MixinC = _support.Mixin.create({
            aProp: _glimmerObject.computed(function () {
                return this._super.apply(this, arguments) + 'C';
            })
        });
        MixinD = _support.Mixin.create({
            aProp: _glimmerObject.computed(function () {
                return this._super.apply(this, arguments) + 'D';
            })
        });
        obj = {};
        MixinA.apply(obj);
        MixinB.apply(obj);
        equal(_support.get(obj, 'aProp'), 'AB', 'should expose super for B');
        obj = {};
        MixinA.apply(obj);
        MixinC.apply(obj);
        equal(_support.get(obj, 'aProp'), 'AC', 'should expose super for C');
        obj = {};
        MixinA.apply(obj);
        MixinD.apply(obj);
        equal(_support.get(obj, 'aProp'), 'AD', 'should define super for D');
        obj = {};
        _support.mixin(obj, {
            aProp: _glimmerObject.computed(function (key) {
                return 'obj';
            })
        });
        MixinD.apply(obj);
        equal(_support.get(obj, 'aProp'), 'objD', 'should preserve original computed property');
    });
    QUnit.test('calling set on overridden computed properties', function () {
        var SuperMixin, SubMixin;
        var obj;
        var superGetOccurred = false;
        var superSetOccurred = false;
        SuperMixin = _support.Mixin.create({
            aProp: _glimmerObject.computed({
                get: function (key) {
                    superGetOccurred = true;
                },
                set: function (key, value) {
                    superSetOccurred = true;
                }
            })
        });
        SubMixin = _support.Mixin.create(SuperMixin, {
            aProp: _glimmerObject.computed({
                get: function (key) {
                    return this._super.apply(this, arguments);
                },
                set: function (key, value) {
                    return this._super.apply(this, arguments);
                }
            })
        });
        obj = {};
        SubMixin.apply(obj);
        _support.set(obj, 'aProp', 'set thyself');
        ok(superSetOccurred, 'should pass set to _super');
        superSetOccurred = false; // reset the set assertion
        obj = {};
        SubMixin.apply(obj);
        _support.get(obj, 'aProp');
        ok(superGetOccurred, 'should pass get to _super');
        _support.set(obj, 'aProp', 'set thyself');
        ok(superSetOccurred, 'should pass set to _super after getting');
    });
    QUnit.test('setter behavior works properly when overriding computed properties', function () {
        var obj = {};
        var MixinA = _support.Mixin.create({
            cpWithSetter2: _glimmerObject.computed(K),
            cpWithSetter3: _glimmerObject.computed(K),
            cpWithoutSetter: _glimmerObject.computed(K)
        });
        var cpWasCalled = false;
        var MixinB = _support.Mixin.create({
            cpWithSetter2: _glimmerObject.computed({
                get: K,
                set: function (k, v) {
                    cpWasCalled = true;
                }
            }),
            cpWithSetter3: _glimmerObject.computed({
                get: K,
                set: function (k, v) {
                    cpWasCalled = true;
                }
            }),
            cpWithoutSetter: _glimmerObject.computed(function (k) {
                cpWasCalled = true;
            })
        });
        MixinA.apply(obj);
        MixinB.apply(obj);
        _support.set(obj, 'cpWithSetter2', 'test');
        ok(cpWasCalled, 'The computed property setter was called when defined with two args');
        cpWasCalled = false;
        _support.set(obj, 'cpWithSetter3', 'test');
        ok(cpWasCalled, 'The computed property setter was called when defined with three args');
        cpWasCalled = false;
        _support.set(obj, 'cpWithoutSetter', 'test');
        equal(_support.get(obj, 'cpWithoutSetter'), 'test', 'The default setter was called, the value is correct');
        ok(!cpWasCalled, 'The default setter was called, not the CP itself');
    });
});

enifed('glimmer-object/tests/ember-metal-concatenated-properties-test', ['exports', './support', 'glimmer-object'], function (exports, _support, _glimmerObject) {
    'use strict';

    QUnit.module('Mixin.concatenatedProperties');
    QUnit.test('defining concatenated properties should concat future version', function () {
        var MixinA = _glimmerObject.Mixin.create({
            concatenatedProperties: ['foo'],
            foo: ['a', 'b', 'c']
        });
        var MixinB = _glimmerObject.Mixin.create({
            foo: ['d', 'e', 'f']
        });
        var obj = _support.mixin({}, MixinA, MixinB);
        deepEqual(_support.get(obj, 'foo'), ['a', 'b', 'c', 'd', 'e', 'f']);
    });
    QUnit.test('defining concatenated properties should concat future version', function () {
        var MixinA = _glimmerObject.Mixin.create({
            concatenatedProperties: null
        });
        var MixinB = _glimmerObject.Mixin.create({
            concatenatedProperties: null
        });
        var obj = _support.mixin({}, MixinA, MixinB);
        deepEqual(obj.concatenatedProperties, []);
    });
    QUnit.test('concatenatedProperties should be concatenated', function () {
        var MixinA = _glimmerObject.Mixin.create({
            concatenatedProperties: ['foo'],
            foo: ['a', 'b', 'c']
        });
        var MixinB = _glimmerObject.Mixin.create({
            concatenatedProperties: 'bar',
            foo: ['d', 'e', 'f'],
            bar: [1, 2, 3]
        });
        var MixinC = _glimmerObject.Mixin.create({
            bar: [4, 5, 6]
        });
        var obj = _support.mixin({}, MixinA, MixinB, MixinC);
        deepEqual(_support.get(obj, 'concatenatedProperties'), ['foo', 'bar'], 'get concatenatedProperties');
        deepEqual(_support.get(obj, 'foo'), ['a', 'b', 'c', 'd', 'e', 'f'], 'get foo');
        deepEqual(_support.get(obj, 'bar'), [1, 2, 3, 4, 5, 6], 'get bar');
    });
    QUnit.test('adding a prop that is not an array should make array', function () {
        var MixinA = _glimmerObject.Mixin.create({
            concatenatedProperties: ['foo'],
            foo: [1, 2, 3]
        });
        var MixinB = _glimmerObject.Mixin.create({
            foo: 4
        });
        var obj = _support.mixin({}, MixinA, MixinB);
        deepEqual(_support.get(obj, 'foo'), [1, 2, 3, 4]);
    });
    QUnit.test('adding a prop that is not an array should make array', function () {
        var MixinA = _glimmerObject.Mixin.create({
            concatenatedProperties: ['foo'],
            foo: 'bar'
        });
        var obj = _support.mixin({}, MixinA);
        deepEqual(_support.get(obj, 'foo'), ['bar']);
    });
    QUnit.skip('adding a non-concatenable property that already has a defined value should result in an array with both values', function () {
        var mixinA = _glimmerObject.Mixin.create({
            foo: 1
        });
        var mixinB = _glimmerObject.Mixin.create({
            concatenatedProperties: ['foo'],
            foo: 2
        });
        var obj = _support.mixin({}, mixinA, mixinB);
        deepEqual(_support.get(obj, 'foo'), [1, 2]);
    });
    QUnit.skip('adding a concatenable property that already has a defined value should result in a concatenated value', function () {
        var mixinA = _glimmerObject.Mixin.create({
            foobar: 'foo'
        });
        var mixinB = _glimmerObject.Mixin.create({
            concatenatedProperties: ['foobar'],
            foobar: 'bar'
        });
        var obj = _support.mixin({}, mixinA, mixinB);
        equal(_support.get(obj, 'foobar'), 'foobar');
    });
});

enifed('glimmer-object/tests/ember-metal-merged-properties-test', ['exports', 'glimmer-object', './support'], function (exports, _glimmerObject, _support) {
    'use strict';

    QUnit.module('Mixin.create - mergedProperties');
    QUnit.test('defining mergedProperties should merge future version', function () {
        var MixinA = _glimmerObject.Mixin.create({
            mergedProperties: ['foo'],
            foo: { a: true, b: true, c: true }
        });
        var MixinB = _glimmerObject.Mixin.create({
            foo: { d: true, e: true, f: true }
        });
        var obj = _support.mixin({}, MixinA, MixinB);
        deepEqual(_support.get(obj, 'foo'), { a: true, b: true, c: true, d: true, e: true, f: true });
    });
    QUnit.test('defining mergedProperties on future mixin should merged into past', function () {
        var MixinA = _glimmerObject.Mixin.create({
            foo: { a: true, b: true, c: true }
        });
        var MixinB = _glimmerObject.Mixin.create({
            mergedProperties: ['foo'],
            foo: { d: true, e: true, f: true }
        });
        var obj = _support.mixin({}, MixinA, MixinB);
        deepEqual(_support.get(obj, 'foo'), { a: true, b: true, c: true, d: true, e: true, f: true });
    });
    QUnit.test('defining mergedProperties with null properties should keep properties null', function () {
        var MixinA = _glimmerObject.Mixin.create({
            mergedProperties: ['foo'],
            foo: null
        });
        var MixinB = _glimmerObject.Mixin.create({
            foo: null
        });
        var obj = _support.mixin({}, MixinA, MixinB);
        equal(_support.get(obj, 'foo'), null);
    });
    QUnit.test('mergedProperties\' properties can get overwritten', function () {
        var MixinA = _glimmerObject.Mixin.create({
            mergedProperties: ['foo'],
            foo: { a: 1 }
        });
        var MixinB = _glimmerObject.Mixin.create({
            foo: { a: 2 }
        });
        var obj = _support.mixin({}, MixinA, MixinB);
        deepEqual(_support.get(obj, 'foo'), { a: 2 });
    });
    QUnit.test('mergedProperties should be concatenated', function () {
        var MixinA = _glimmerObject.Mixin.create({
            mergedProperties: ['foo'],
            foo: { a: true, b: true, c: true }
        });
        var MixinB = _glimmerObject.Mixin.create({
            mergedProperties: 'bar',
            foo: { d: true, e: true, f: true },
            bar: { a: true, l: true }
        });
        var MixinC = _glimmerObject.Mixin.create({
            bar: { e: true, x: true }
        });
        var obj = _support.mixin({}, MixinA, MixinB, MixinC);
        deepEqual(_support.get(obj, 'mergedProperties'), ['foo', 'bar'], 'get mergedProperties');
        deepEqual(_support.get(obj, 'foo'), { a: true, b: true, c: true, d: true, e: true, f: true }, 'get foo');
        deepEqual(_support.get(obj, 'bar'), { a: true, l: true, e: true, x: true }, 'get bar');
    });
    QUnit.test('mergedProperties should exist even if not explicitly set on create', function () {
        var AnObj = _glimmerObject.default.extend({
            mergedProperties: ['options'],
            options: {
                a: 'a',
                b: {
                    c: 'ccc'
                }
            }
        });
        var obj = AnObj.create({
            options: {
                a: 'A'
            }
        });
        equal(_support.get(obj, 'options').a, 'A');
        equal(_support.get(obj, 'options').b.c, 'ccc');
    });
    QUnit.test('mergedProperties\' overwriting methods can call _super', function () {
        expect(4);
        var MixinA = _glimmerObject.Mixin.create({
            mergedProperties: ['foo'],
            foo: {
                meth: function (a) {
                    equal(a, 'WOOT', '_super successfully called MixinA\'s `foo.meth` method');
                    return 'WAT';
                }
            }
        });
        var MixinB = _glimmerObject.Mixin.create({
            foo: {
                meth: function (a) {
                    ok(true, 'MixinB\'s `foo.meth` method called');
                    return this._super.apply(this, arguments);
                }
            }
        });
        var MixinC = _glimmerObject.Mixin.create({
            foo: {
                meth: function (a) {
                    ok(true, 'MixinC\'s `foo.meth` method called');
                    return this._super(a);
                }
            }
        });
        var obj = _support.mixin({}, MixinA, MixinB, MixinC);
        equal(obj.foo.meth('WOOT'), 'WAT');
    });
    QUnit.test('Merging an Array should raise an error', function (assert) {
        expect(1);
        var MixinA = _glimmerObject.Mixin.create({
            mergedProperties: ['foo'],
            foo: { a: true, b: true, c: true }
        });
        var MixinB = _glimmerObject.Mixin.create({
            foo: ['a']
        });
        assert.throws(function () {
            _support.mixin({}, MixinA, MixinB);
        }, /You passed in `\["a"\]` as the value for `foo` but `foo` cannot be an Array/);
    });
});

enifed('glimmer-object/tests/ember-metal-mixin-introspection-test', ['exports', './support', 'glimmer-object'], function (exports, _support, _glimmerObject) {
    // NOTE: A previous iteration differentiated between public and private props
    // as well as methods vs props.  We are just keeping these for testing; the
    // current impl doesn't care about the differences as much...
    'use strict';

    var PrivateProperty = _glimmerObject.Mixin.create({
        _foo: '_FOO'
    });
    var PublicProperty = _glimmerObject.Mixin.create({
        foo: 'FOO'
    });
    var PrivateMethod = _glimmerObject.Mixin.create({
        _fooMethod: function () {}
    });
    var PublicMethod = _glimmerObject.Mixin.create({
        fooMethod: function () {}
    });
    var BarProperties = _glimmerObject.Mixin.create({
        _bar: '_BAR',
        bar: 'bar'
    });
    var BarMethods = _glimmerObject.Mixin.create({
        _barMethod: function () {},
        barMethod: function () {}
    });
    var Combined = _glimmerObject.Mixin.create(BarProperties, BarMethods);
    var obj;
    QUnit.module('Mixin.mixins (introspection)', {
        setup: function () {
            obj = {};
            _support.mixin(obj, PrivateProperty, PublicProperty, PrivateMethod, PublicMethod, Combined);
        }
    });
    QUnit.test('Ember.mixins()', function () {
        deepEqual(_glimmerObject.Mixin.mixins(obj), [PrivateProperty, PublicProperty, PrivateMethod, PublicMethod, BarProperties, BarMethods, Combined], 'should return included mixins');
    });
});

enifed('glimmer-object/tests/ember-metal-mixin-reopen-test', ['exports', 'glimmer-object', './support'], function (exports, _glimmerObject, _support) {
    'use strict';

    QUnit.module('Mixin#reopen');
    QUnit.test('using reopen() to add more properties to a simple', function () {
        var MixinA = _glimmerObject.Mixin.create({ foo: 'FOO', baz: 'BAZ' });
        MixinA.reopen({ bar: 'BAR', foo: 'FOO2' });
        var obj = {};
        MixinA.apply(obj);
        equal(_support.get(obj, 'foo'), 'FOO2', 'mixin() should override');
        equal(_support.get(obj, 'baz'), 'BAZ', 'preserve MixinA props');
        equal(_support.get(obj, 'bar'), 'BAR', 'include MixinB props');
    });
    QUnit.test('using reopen() and calling _super where there is not a super function does not cause infinite recursion', function () {
        var Taco = _glimmerObject.default.extend({
            createBreakfast: function () {
                // There is no original createBreakfast function.
                // Calling the wrapped _super function here
                // used to end in an infinite call loop
                this._super.apply(this, arguments);
                return 'Breakfast!';
            }
        });
        Taco.reopen({
            createBreakfast: function () {
                return this._super.apply(this, arguments);
            }
        });
        var taco = Taco.create();
        var result;
        try {
            result = taco.createBreakfast();
        } catch (e) {
            result = 'Your breakfast was interrupted by an infinite stack error.';
            throw e;
        }
        equal(result, 'Breakfast!');
    });
});

enifed('glimmer-object/tests/ember-mixin-detect-test', ['exports', 'glimmer-object'], function (exports, _glimmerObject) {
    'use strict';

    QUnit.module('Mixin.detect');
    QUnit.test('detect() finds a directly applied mixin', function () {
        var MixinA = _glimmerObject.Mixin.create();
        var obj = {};
        equal(MixinA.detect(obj), false, 'MixinA.detect(obj) before apply()');
        MixinA.apply(obj);
        equal(MixinA.detect(obj), true, 'MixinA.detect(obj) after apply()');
    });
    QUnit.test('detect() finds nested mixins', function () {
        var MixinA = _glimmerObject.Mixin.create({});
        var MixinB = _glimmerObject.Mixin.create(MixinA);
        var obj = {};
        equal(MixinA.detect(obj), false, 'MixinA.detect(obj) before apply()');
        MixinB.apply(obj);
        equal(MixinA.detect(obj), true, 'MixinA.detect(obj) after apply()');
    });
    QUnit.test('detect() finds mixins on other mixins', function () {
        var MixinA = _glimmerObject.Mixin.create({});
        var MixinB = _glimmerObject.Mixin.create(MixinA);
        equal(MixinA.detect(MixinB), true, 'MixinA is part of MixinB');
        equal(MixinB.detect(MixinA), false, 'MixinB is not part of MixinA');
    });
    QUnit.test('detect handles null values', function () {
        var MixinA = _glimmerObject.Mixin.create();
        equal(MixinA.detect(null), false);
    });
});

enifed('glimmer-object/tests/ember-mixin-method-test', ['exports', './support', 'glimmer-object'], function (exports, _support, _glimmerObject) {
    'use strict';

    QUnit.module('Mixin.create - Methods');
    QUnit.test('defining simple methods', function () {
        var MixinA, obj, props;
        props = {
            publicMethod: function () {
                return 'publicMethod';
            },
            _privateMethod: function () {
                return 'privateMethod';
            }
        };
        MixinA = _glimmerObject.Mixin.create(props);
        obj = {};
        MixinA.apply(obj);
        // but should be defined
        equal(props.publicMethod(), 'publicMethod', 'publicMethod is func');
        equal(props._privateMethod(), 'privateMethod', 'privateMethod is func');
    });
    QUnit.test('overriding public methods', function () {
        var MixinA, MixinB, MixinD, MixinF, obj;
        MixinA = _glimmerObject.Mixin.create({
            publicMethod: function () {
                return 'A';
            }
        });
        MixinB = _glimmerObject.Mixin.create(MixinA, {
            publicMethod: function () {
                return this._super.apply(this, arguments) + 'B';
            }
        });
        MixinD = _glimmerObject.Mixin.create(MixinA, {
            publicMethod: function () {
                return this._super.apply(this, arguments) + 'D';
            }
        });
        MixinF = _glimmerObject.Mixin.create({
            publicMethod: function () {
                return this._super.apply(this, arguments) + 'F';
            }
        });
        obj = {};
        MixinB.apply(obj);
        equal(obj.publicMethod(), 'AB', 'should define super for A and B');
        obj = {};
        MixinD.apply(obj);
        equal(obj.publicMethod(), 'AD', 'should define super for A and B');
        obj = {};
        MixinA.apply(obj);
        MixinF.apply(obj);
        equal(obj.publicMethod(), 'AF', 'should define super for A and F');
        obj = { publicMethod: function () {
                return 'obj';
            } };
        MixinF.apply(obj);
        equal(obj.publicMethod(), 'objF', 'should define super for F');
    });
    QUnit.test('overriding inherited objects', function () {
        var cnt = 0;
        var MixinA = _glimmerObject.Mixin.create({
            foo: function () {
                cnt++;
            }
        });
        var MixinB = _glimmerObject.Mixin.create({
            foo: function () {
                this._super.apply(this, arguments);
                cnt++;
            }
        });
        var objA = {};
        MixinA.apply(objA);
        var objB = Object.create(objA);
        MixinB.apply(objB);
        cnt = 0;
        objB.foo();
        equal(cnt, 2, 'should invoke both methods');
        cnt = 0;
        objA['foo']();
        equal(cnt, 1, 'should not screw w/ parent obj');
    });
    QUnit.test('Including the same mixin more than once will only run once', function () {
        var cnt = 0;
        var MixinA = _glimmerObject.Mixin.create({
            foo: function () {
                cnt++;
            }
        });
        var MixinB = _glimmerObject.Mixin.create(MixinA, {
            foo: function () {
                this._super.apply(this, arguments);
            }
        });
        var MixinC = _glimmerObject.Mixin.create(MixinA, {
            foo: function () {
                this._super.apply(this, arguments);
            }
        });
        var MixinD = _glimmerObject.Mixin.create(MixinB, MixinC, MixinA, {
            foo: function () {
                this._super.apply(this, arguments);
            }
        });
        var obj = {};
        MixinD.apply(obj);
        MixinA.apply(obj); // try to apply again..
        cnt = 0;
        obj['foo']();
        equal(cnt, 1, 'should invoke MixinA.foo one time');
    });
    QUnit.test('_super from a single mixin with no superclass does not error', function () {
        var MixinA = _glimmerObject.Mixin.create({
            foo: function () {
                this._super.apply(this, arguments);
            }
        });
        var obj = {};
        MixinA.apply(obj);
        obj['foo']();
        ok(true);
    });
    QUnit.test('_super from a first-of-two mixins with no superclass function does not error', function () {
        // _super was previously calling itself in the second assertion.
        // Use remaining count of calls to ensure it doesn't loop indefinitely.
        var remaining = 3;
        var MixinA = _glimmerObject.Mixin.create({
            foo: function () {
                if (remaining-- > 0) {
                    this._super.apply(this, arguments);
                }
            }
        });
        var MixinB = _glimmerObject.Mixin.create({
            foo: function () {
                this._super.apply(this, arguments);
            }
        });
        var obj = {};
        MixinA.apply(obj);
        MixinB.apply(obj);
        obj['foo']();
        ok(true);
    });
    // ..........................................................
    // CONFLICTS
    //
    QUnit.module('Mixin.create - Method Conflicts');
    QUnit.test('overriding toString', function () {
        var MixinA = _glimmerObject.Mixin.create({
            toString: function () {
                return 'FOO';
            }
        });
        var obj = {};
        MixinA.apply(obj);
        equal(obj.toString(), 'FOO', 'should override toString w/o error');
        obj = {};
        _support.mixin(obj, { toString: function () {
                return 'FOO';
            } });
        equal(obj.toString(), 'FOO', 'should override toString w/o error');
    });
    // ..........................................................
    // BUGS
    //
    QUnit.module('Mixin.create - Method Regressions (BUGS)');
    QUnit.test('applying several mixins at once with sup already defined causes infinite loop', function () {
        var cnt = 0;
        var MixinA = _glimmerObject.Mixin.create({
            foo: function () {
                cnt++;
            }
        });
        var MixinB = _glimmerObject.Mixin.create({
            foo: function () {
                this._super.apply(this, arguments);
                cnt++;
            }
        });
        var MixinC = _glimmerObject.Mixin.create({
            foo: function () {
                this._super.apply(this, arguments);
                cnt++;
            }
        });
        var obj = {};
        _support.mixin(obj, MixinA); // sup already exists
        _support.mixin(obj, MixinB, MixinC); // must be more than one mixin
        cnt = 0;
        obj['foo']();
        equal(cnt, 3, 'should invoke all 3 methods');
    });
});

enifed('glimmer-object/tests/ember-reopen-class-test', ['exports', 'glimmer-object'], function (exports, _glimmerObject) {
    'use strict';

    function get(obj, key) {
        return obj[key];
    }
    QUnit.module('GlimmerObject.reopenClass');
    QUnit.test('adds new properties to subclass', function () {
        var Subclass = _glimmerObject.default.extend();
        Subclass.reopenClass({
            foo: function () {
                return 'FOO';
            },
            bar: 'BAR'
        });
        equal(Subclass.foo(), 'FOO', 'Adds method');
        equal(get(Subclass, 'bar'), 'BAR', 'Adds property');
    });
    QUnit.test('class properties inherited by subclasses', function () {
        var Subclass = _glimmerObject.default.extend();
        Subclass.reopenClass({
            foo: function () {
                return 'FOO';
            },
            bar: 'BAR'
        });
        var SubSub = Subclass.extend();
        equal(SubSub['foo'](), 'FOO', 'Adds method');
        equal(get(SubSub, 'bar'), 'BAR', 'Adds property');
    });
});

enifed('glimmer-object/tests/ember-reopen-test', ['exports', 'glimmer-object'], function (exports, _glimmerObject) {
    'use strict';

    function get(obj, key) {
        return obj[key];
    }
    QUnit.module('GlimmerObject.reopen');
    QUnit.test('adds new properties to subclass instance', function () {
        var Subclass = _glimmerObject.default.extend();
        Subclass.reopen({
            foo: function () {
                return 'FOO';
            },
            bar: 'BAR'
        });
        equal(new Subclass()['foo'](), 'FOO', 'Adds method');
        equal(get(new Subclass(), 'bar'), 'BAR', 'Adds property');
    });
    QUnit.test('reopened properties inherited by subclasses', function () {
        var Subclass = _glimmerObject.default.extend();
        var SubSub = Subclass.extend();
        Subclass.reopen({
            foo: function () {
                return 'FOO';
            },
            bar: 'BAR'
        });
        equal(new SubSub()['foo'](), 'FOO', 'Adds method');
        equal(get(new SubSub(), 'bar'), 'BAR', 'Adds property');
    });
    QUnit.test('allows reopening already instantiated classes', function () {
        var Subclass = _glimmerObject.default.extend();
        Subclass.create();
        Subclass.reopen({
            trololol: true
        });
        equal(Subclass.create().get('trololol'), true, 'reopen works');
    });
});

enifed('glimmer-object/tests/object-test', ['exports', 'glimmer-object', 'glimmer-reference', 'glimmer-util'], function (exports, _glimmerObject, _glimmerReference, _glimmerUtil) {
    'use strict';

    var Wrapper = _glimmerObject.default.extend({
        fullName: _glimmerObject.computed(function () {
            return this.model && this.model.fullName;
        }).property('model.fullName')
    });
    var Model = _glimmerObject.default.extend({
        fullName: _glimmerObject.computed(function () {
            return this.person && this.person.fullName;
        }).property('person.fullName')
    });
    var Person = _glimmerObject.default.extend({
        fullName: _glimmerObject.computed(function () {
            return this.name && this.name.fullName;
        }).property('name.fullName')
    });
    var Name = _glimmerObject.default.extend({
        fullName: _glimmerObject.computed(function () {
            return this.first + ' ' + this.last;
        }).property('first', 'last')
    });
    QUnit.module('the object model');
    QUnit.test('the simple object model allows you to derive references', function () {
        var obj1 = new Wrapper({
            model: new Model({
                person: new Person({
                    name: new Name({ first: "Yehuda", last: "Katz" })
                })
            })
        });
        var originalPerson = obj1.model.person;
        var obj2 = new Wrapper({
            model: new Model({
                person: new Person({
                    name: obj1.model.person.name
                })
            })
        });
        var obj3 = new Wrapper({
            model: new Model({
                person: obj1.model.person
            })
        });
        var obj4 = new Wrapper({
            model: obj1.model
        });
        var o1 = referencesFor(obj1);
        var o2 = referencesFor(obj2);
        var o3 = referencesFor(obj3);
        var o4 = referencesFor(obj4);
        allDirty(o1, "Yehuda");
        allDirty(o2, "Yehuda");
        allDirty(o3, "Yehuda");
        allDirty(o4, "Yehuda");
        allClean(o1);
        allClean(o2);
        allClean(o3);
        allClean(o4);
        _glimmerReference.setProperty(obj1.model, 'person', new Person({ name: new Name({ first: 'Godfrey', last: 'Chan' }) }));
        isDirty(o1[0], "Godfrey");
        isDirty(o1[1], "Godfrey");
        isClean(o1[2]);
        isClean(o1[3]);
        allClean(o2);
        allClean(o3);
        isDirty(o4[0], "Godfrey");
        isDirty(o4[1], "Godfrey");
        isClean(o4[2]);
        isClean(o4[3]);
        _glimmerReference.setProperty(originalPerson.name, 'first', "Godhuda");
        isClean(o1[0]);
        isClean(o1[1]);
        isDirty(o1[2], "Godhuda");
        isDirty(o1[3], "Godhuda");
        allDirty(o2, "Godhuda");
        allDirty(o3, "Godhuda");
        isClean(o4[0]);
        isClean(o4[1]);
        isDirty(o4[2], "Godhuda");
        isDirty(o4[3], "Godhuda");
        _glimmerReference.setProperty(obj1.model, 'person', undefined);
        isDirty(o1[0], undefined);
        isDirty(o1[1], undefined);
        isClean(o1[2]);
        isClean(o1[3]);
        allClean(o2);
        allClean(o3);
        isDirty(o4[0], undefined);
        isDirty(o4[1], undefined);
        isClean(o4[2]);
        isClean(o4[3]);
        _glimmerReference.setProperty(obj1.model, 'person', originalPerson);
        isDirty(o1[0], "Godhuda");
        isDirty(o1[1], "Godhuda");
        isClean(o1[2]);
        isClean(o1[3]);
        allClean(o2);
        allClean(o3);
        isDirty(o4[0], "Godhuda");
        isDirty(o4[1], "Godhuda");
        isClean(o4[2]);
        isClean(o4[3]);
        function referencesFor(obj) {
            return [root(obj).path('model.person.name.first').fork(), root(obj.model).path('person.name.first').fork(), root(obj.model.person).path('name.first').fork(), root(obj.model.person.name).path('first').fork()];
        }
    });
    function root(obj) {
        return _glimmerReference.metaFor(obj).root();
    }
    QUnit.test("Simple computed properties", function () {
        var name = new Name({ first: "Godfrey", last: "Chan" });
        var ref = _glimmerReference.fork(_glimmerReference.metaFor(name).root().get(_glimmerUtil.intern('fullName')));
        equal(name.fullName, "Godfrey Chan");
        equal(ref.value(), "Godfrey Chan");
        isClean(ref);
        _glimmerReference.setProperty(name, 'first', "Godhuda");
        isDirty(ref, 'Godhuda Chan');
        equal(name.fullName, "Godhuda Chan");
        equal(ref.value(), "Godhuda Chan");
        isClean(ref);
    });
    QUnit.test("Computed properties", function () {
        var obj1 = new Wrapper({
            model: new Model({
                person: new Person({
                    name: new Name({ first: "Yehuda", last: "Katz" })
                })
            })
        });
        var originalPerson = obj1.model.person;
        var ref = _glimmerReference.fork(_glimmerReference.metaFor(obj1).root().get(_glimmerUtil.intern('fullName')));
        equal(obj1.fullName, "Yehuda Katz");
        equal(ref.value(), "Yehuda Katz");
        isClean(ref);
        _glimmerReference.setProperty(obj1.model, 'person', new Person({ name: new Name({ first: 'Godfrey', last: 'Chan' }) }));
        isDirty(ref, "Godfrey Chan");
        equal(obj1.fullName, "Godfrey Chan");
        equal(ref.value(), "Godfrey Chan");
        isClean(ref);
        _glimmerReference.setProperty(originalPerson.name, 'first', "Godhuda");
        isDirty(ref, "Godfrey Chan");
        equal(obj1.fullName, "Godfrey Chan");
        equal(ref.value(), "Godfrey Chan");
        isClean(ref);
        _glimmerReference.setProperty(obj1.model, 'person', undefined);
        isDirty(ref, undefined);
        equal(obj1.fullName, undefined);
        equal(ref.value(), undefined);
        isClean(ref);
        _glimmerReference.setProperty(obj1.model, 'person', originalPerson);
        isDirty(ref, "Godhuda Katz");
        equal(obj1.fullName, "Godhuda Katz");
        equal(ref.value(), "Godhuda Katz");
        isClean(ref);
    });
    function isDirty(ref, newValue) {
        ok(ref.isDirty(), ref.label() + " is dirty");
        ok(ref.value() === newValue, ref.label() + " has new value " + newValue);
    }
    function isClean(ref) {
        // clean references are allowed to report dirty
    }
    function allDirty(refs, newValue) {
        refs.forEach(function (ref) {
            isDirty(ref, newValue);
        });
    }
    function allClean(refs) {
        refs.forEach(function (ref) {
            isClean(ref);
        });
    }
});

enifed('glimmer-object/tests/support', ['exports', 'glimmer-object', 'glimmer-reference'], function (exports, _glimmerObject, _glimmerReference) {
    'use strict';

    exports.get = get;
    exports.set = set;
    exports.mixin = mixin;
    exports.defineProperty = defineProperty;
    exports.Mixin = _glimmerObject.Mixin;

    function get(obj, key) {
        if (key.indexOf('.') !== -1) {
            var path = key.split('.');
            return path.reduce(function (obj, key) {
                return obj[key];
            }, obj);
        }
        return obj[key];
    }

    function set(obj, key, value) {
        if (key.indexOf('.') !== -1) {
            var path = key.split('.');
            var _parent = path.slice(0, -1).reduce(function (obj, key) {
                return obj[key];
            }, obj);
            _glimmerReference.setProperty(_parent, path[path.length - 1], value);
        } else {
            _glimmerReference.setProperty(obj, key, value);
        }
    }

    function mixin(obj) {
        for (var _len = arguments.length, extensions = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            extensions[_key - 1] = arguments[_key];
        }

        // if (obj._meta) throw new Error("Can't reopen a POJO after mixins were already applied to it");
        extensions.forEach(function (e) {
            return _glimmerObject.toMixin(e).apply(obj);
        });
        return obj;
    }

    function defineProperty(obj, key, desc) {
        var extensions = {};
        extensions[key] = desc;
        mixin(obj, extensions);
    }
});

enifed('glimmer-reference/tests/iterable-test', ['exports', 'glimmer-reference', 'glimmer-util'], function (exports, _glimmerReference, _glimmerUtil) {
    'use strict';

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    QUnit.module("Reference iterables");

    var Target = (function () {
        function Target() {
            _classCallCheck(this, Target);

            this.map = _glimmerUtil.dict();
            this.list = new _glimmerUtil.LinkedList();
        }

        Target.prototype.retain = function retain() {};

        Target.prototype.done = function done() {};

        Target.prototype.insert = function insert(key, item, before) {
            var referenceNode = before ? this.map[before] : null;
            var node = this.map[key] = new _glimmerUtil.ListNode(item);
            this.list.insertBefore(node, referenceNode);
        };

        Target.prototype.move = function move(key, item, before) {
            var referenceNode = before ? this.map[before] : null;
            var node = this.map[key];
            this.list.remove(node);
            this.list.insertBefore(node, referenceNode);
        };

        Target.prototype.delete = function _delete(key) {
            var node = this.map[key];
            delete this.map[key];
            this.list.remove(node);
        };

        Target.prototype.toArray = function toArray() {
            return this.list.toArray().map(function (node) {
                return node.value;
            });
        };

        return Target;
    })();

    function toValues(target) {
        var refs = target.toArray();
        return refs.map(function (ref) {
            return ref.value();
        });
    }
    QUnit.test("They provide a sequence of references with keys", function (assert) {
        var arr = [{ key: "a", name: "Yehuda" }, { key: "b", name: "Godfrey" }];
        var arrRef = new _glimmerReference.UpdatableReference(arr);
        var target = new Target();
        var manager = new _glimmerReference.ListManager(arrRef, _glimmerUtil.LITERAL('key'));
        manager.sync(target);
        assert.deepEqual(toValues(target), arr);
    });
    QUnit.test("When re-iterated via mutation, the original references are updated", function (assert) {
        var arr = [{ key: "a", name: "Yehuda" }, { key: "b", name: "Godfrey" }];
        var arrRef = new _glimmerReference.UpdatableReference(arr);
        var target = new Target();
        var manager = new _glimmerReference.ListManager(arrRef, _glimmerUtil.LITERAL('key'));
        manager.sync(target);

        var _target$toArray = target.toArray();

        var yehudaRef = _target$toArray[0];
        var godfreyRef = _target$toArray[1];

        assert.equal(yehudaRef.value().name, "Yehuda");
        assert.equal(godfreyRef.value().name, "Godfrey");
        arr.reverse();
        manager.sync(target);
        assert.deepEqual(toValues(target), arr);
        assert.deepEqual(target.toArray(), [godfreyRef, yehudaRef]);
        arr.push({ key: "c", name: "Godhuda" });
        manager.sync(target);

        var _target$toArray2 = target.toArray();

        var godhudaRef = _target$toArray2[2];

        assert.deepEqual(toValues(target), arr);
        assert.deepEqual(target.toArray(), [godfreyRef, yehudaRef, godhudaRef]);
        arr.shift();
        manager.sync(target);
        assert.deepEqual(target.toArray(), [yehudaRef, godhudaRef]);
        assert.deepEqual(toValues(target), arr);
    });
    QUnit.test("When re-iterated via deep mutation, the original references are updated", function (assert) {
        var arr = [{ key: "a", name: "Yehuda" }, { key: "b", name: "Godfrey" }];
        var arrRef = new _glimmerReference.UpdatableReference(arr);
        var target = new Target();
        var manager = new _glimmerReference.ListManager(arrRef, _glimmerUtil.LITERAL('key'));
        manager.sync(target);

        var _target$toArray3 = target.toArray();

        var yehudaRef = _target$toArray3[0];
        var godfreyRef = _target$toArray3[1];

        assert.equal(yehudaRef.value().name, "Yehuda");
        assert.equal(godfreyRef.value().name, "Godfrey");
        arr[0].key = "b";
        arr[0].name = "Godfrey";
        arr[1].key = "a";
        arr[1].name = "Yehuda";
        manager.sync(target);
        assert.deepEqual(toValues(target), arr);
        assert.deepEqual(target.toArray(), [godfreyRef, yehudaRef]);
        arr[0].name = "Yehuda";
        arr[1].name = "Godfrey";
        manager.sync(target);
        assert.deepEqual(toValues(target), arr);
        assert.deepEqual(target.toArray(), [godfreyRef, yehudaRef]);
        arr.push({ key: "c", name: "Godhuda" });
        manager.sync(target);

        var _target$toArray4 = target.toArray();

        var godhudaRef = _target$toArray4[2];

        assert.deepEqual(toValues(target), arr);
        assert.deepEqual(target.toArray(), [godfreyRef, yehudaRef, godhudaRef]);
        arr.shift();
        manager.sync(target);
        assert.deepEqual(target.toArray(), [yehudaRef, godhudaRef]);
        assert.deepEqual(toValues(target), arr);
    });
    QUnit.test("When re-iterated via replacement, the original references are updated", function (assert) {
        var arr = [{ key: "a", name: "Yehuda" }, { key: "b", name: "Godfrey" }];
        var arrRef = new _glimmerReference.UpdatableReference(arr);
        var target = new Target();
        var manager = new _glimmerReference.ListManager(arrRef, _glimmerUtil.LITERAL('key'));
        manager.sync(target);

        var _target$toArray5 = target.toArray();

        var yehudaRef = _target$toArray5[0];
        var godfreyRef = _target$toArray5[1];

        assert.equal(yehudaRef.value().name, "Yehuda");
        assert.equal(godfreyRef.value().name, "Godfrey");
        arr = arr.slice();
        arr.reverse();
        arrRef.update(arr);
        manager.sync(target);
        assert.deepEqual(toValues(target), arr);
        assert.deepEqual(target.toArray(), [godfreyRef, yehudaRef]);
        arrRef.update([{ key: 'a', name: "Tom" }, { key: "b", name: "Stef " }]);
        manager.sync(target);
        assert.deepEqual(toValues(target), [{ key: 'a', name: "Tom" }, { key: "b", name: "Stef " }]);
        assert.deepEqual(target.toArray(), [yehudaRef, godfreyRef]);
        arr = arr.slice();
        arr.push({ key: "c", name: "Godhuda" });
        arrRef.update(arr);
        manager.sync(target);

        var _target$toArray6 = target.toArray();

        var godhudaRef = _target$toArray6[2];

        assert.deepEqual(toValues(target), arr);
        assert.deepEqual(target.toArray(), [godfreyRef, yehudaRef, godhudaRef]);
        arr = arr.slice();
        arr.shift();
        arrRef.update(arr);
        manager.sync(target);
        assert.deepEqual(target.toArray(), [yehudaRef, godhudaRef]);
        assert.deepEqual(toValues(target), arr);
    });
});

enifed('glimmer-reference/tests/reference-test', ['exports', 'glimmer-reference', 'glimmer-util'], function (exports, _glimmerReference, _glimmerUtil) {
    'use strict';

    function addObserver(obj, name, path) {
        return _glimmerReference.fork(_glimmerReference.metaFor(obj).root().referenceFromParts(path.split('.').map(_glimmerUtil.intern)));
    }
    QUnit.module("references");
    QUnit.test("basic reference data flow", function () {
        var obj1 = { label: "obj1", model: { person: { name: { first: "Yehuda", last: "Katz" } } } };
        var obj2 = { label: "obj2", model: { person: { name: obj1.model.person.name } } };
        var obj3 = { label: "obj3", model: { person: obj1.model.person } };
        var obj4 = { label: "obj4", model: obj1.model };
        var originalPerson = obj1.model.person;
        var o1 = [addObserver(obj1, 'obj1', 'model.person.name.first'), addObserver(obj1.model, 'obj1.model', 'person.name.first'), addObserver(obj1.model.person, 'obj1.model.person', 'name.first'), addObserver(obj1.model.person.name, 'obj1.model.person.name', 'first')];
        var o2 = [addObserver(obj2, 'obj2', 'model.person.name.first'), addObserver(obj2.model, 'obj2.model', 'person.name.first'), addObserver(obj2.model.person, 'obj2.model.person', 'name.first'), addObserver(obj2.model.person.name, 'obj2.model.person.name', 'first')];
        var o3 = [addObserver(obj3, 'obj3', 'model.person.name.first'), addObserver(obj3.model, 'obj3.model', 'person.name.first'), addObserver(obj3.model.person, 'obj3.model.person', 'name.first'), addObserver(obj3.model.person.name, 'obj3.model.person.name', 'first')];
        var o4 = [addObserver(obj4, 'obj4', 'model.person.name.first'), addObserver(obj4.model, 'obj4.model', 'person.name.first'), addObserver(obj4.model.person, 'obj4.model.person', 'name.first'), addObserver(obj4.model.person.name, 'obj4.model.person.name', 'first')];
        allDirty(o1, "Yehuda");
        allDirty(o2, "Yehuda");
        allDirty(o3, "Yehuda");
        allDirty(o4, "Yehuda");
        allClean(o1);
        allClean(o2);
        allClean(o3);
        allClean(o4);
        _glimmerReference.setProperty(obj1.model, 'person', { name: { first: 'Godfrey', last: 'Chan' } });
        isDirty(o1[0], "Godfrey");
        isDirty(o1[1], "Godfrey");
        isClean(o1[2]);
        isClean(o1[3]);
        allClean(o2);
        allClean(o3);
        isDirty(o4[0], "Godfrey");
        isDirty(o4[1], "Godfrey");
        isClean(o4[2]);
        isClean(o4[3]);
        _glimmerReference.setProperty(originalPerson.name, 'first', "Godhuda");
        isClean(o1[0]);
        isClean(o1[1]);
        isDirty(o1[2], "Godhuda");
        isDirty(o1[3], "Godhuda");
        allDirty(o2, "Godhuda");
        allDirty(o3, "Godhuda");
        isClean(o4[0]);
        isClean(o4[1]);
        isDirty(o4[2], "Godhuda");
        isDirty(o4[3], "Godhuda");
        _glimmerReference.setProperty(obj1.model, 'person', undefined);
        isDirty(o1[0], undefined);
        isDirty(o1[1], undefined);
        isClean(o1[2]);
        isClean(o1[3]);
        allClean(o2);
        allClean(o3);
        isDirty(o4[0], undefined);
        isDirty(o4[1], undefined);
        isClean(o4[2]);
        isClean(o4[3]);
        _glimmerReference.setProperty(obj1.model, 'person', originalPerson);
        isDirty(o1[0], "Godhuda");
        isDirty(o1[1], "Godhuda");
        isClean(o1[2]);
        isClean(o1[3]);
        allClean(o2);
        allClean(o3);
        isDirty(o4[0], "Godhuda");
        isDirty(o4[1], "Godhuda");
        isClean(o4[2]);
        isClean(o4[3]);
    });
    QUnit.test("test data flow that goes through primitive wrappers", function () {
        var obj1 = { label: "obj1", model: { person: { name: { first: "Yehuda", last: "Katz" } } } };
        var obj2 = { label: "obj2", model: { person: { name: obj1.model.person.name } } };
        var obj3 = { label: "obj3", model: { person: obj1.model.person } };
        var obj4 = { label: "obj4", model: obj1.model };
        var originalPerson = obj1.model.person;
        var o1 = [addObserver(obj1, 'obj1', 'model.person.name.first.length'), addObserver(obj1.model, 'obj1.model', 'person.name.first.length'), addObserver(obj1.model.person, 'obj1.model.person', 'name.first.length'), addObserver(obj1.model.person.name, 'obj1.model.person.name', 'first.length')];
        var o2 = [addObserver(obj2, 'obj2', 'model.person.name.first.length'), addObserver(obj2.model, 'obj2.model', 'person.name.first.length'), addObserver(obj2.model.person, 'obj2.model.person', 'name.first.length'), addObserver(obj2.model.person.name, 'obj2.model.person.name', 'first.length')];
        var o3 = [addObserver(obj3, 'obj3', 'model.person.name.first.length'), addObserver(obj3.model, 'obj3.model', 'person.name.first.length'), addObserver(obj3.model.person, 'obj3.model.person', 'name.first.length'), addObserver(obj3.model.person.name, 'obj3.model.person.name', 'first.length')];
        var o4 = [addObserver(obj4, 'obj4', 'model.person.name.first.length'), addObserver(obj4.model, 'obj4.model', 'person.name.first.length'), addObserver(obj4.model.person, 'obj4.model.person', 'name.first.length'), addObserver(obj4.model.person.name, 'obj4.model.person.name', 'first.length')];
        allDirty(o1, 6);
        allDirty(o2, 6);
        allDirty(o3, 6);
        allDirty(o4, 6);
        allClean(o1);
        allClean(o2);
        allClean(o3);
        allClean(o4);
        _glimmerReference.setProperty(obj1.model, 'person', { name: { first: 'Godfrey', last: 'Chan' } });
        isDirty(o1[0], 7);
        isDirty(o1[1], 7);
        isClean(o1[2]);
        isClean(o1[3]);
        allClean(o2);
        allClean(o3);
        isDirty(o4[0], 7);
        isDirty(o4[1], 7);
        isClean(o4[2]);
        isClean(o4[3]);
        _glimmerReference.setProperty(originalPerson.name, 'first', "God-huda");
        isClean(o1[0]);
        isClean(o1[1]);
        isDirty(o1[2], 8);
        isDirty(o1[3], 8);
        allDirty(o2, 8);
        allDirty(o3, 8);
        isClean(o4[0]);
        isClean(o4[1]);
        isDirty(o4[2], 8);
        isDirty(o4[3], 8);
        _glimmerReference.setProperty(obj1.model, 'person', undefined);
        isDirty(o1[0], undefined);
        isDirty(o1[1], undefined);
        isClean(o1[2]);
        isClean(o1[3]);
        allClean(o2);
        allClean(o3);
        isDirty(o4[0], undefined);
        isDirty(o4[1], undefined);
        isClean(o4[2]);
        isClean(o4[3]);
        _glimmerReference.setProperty(obj1.model, 'person', originalPerson);
        isDirty(o1[0], 8);
        isDirty(o1[1], 8);
        isClean(o1[2]);
        isClean(o1[3]);
        allClean(o2);
        allClean(o3);
        isDirty(o4[0], 8);
        isDirty(o4[1], 8);
        isClean(o4[2]);
        isClean(o4[3]);
    });
    function isDirty(ref, newValue) {
        ok(ref.isDirty(), ref.label() + " is dirty");
        ok(ref.value() === newValue, ref.label() + " has new value " + newValue);
    }
    function isClean(ref) {
        // clean references are allowed to report dirty
    }
    function allDirty(refs, newValue) {
        refs.forEach(function (ref) {
            isDirty(ref, newValue);
        });
    }
    function allClean(refs) {
        refs.forEach(function (ref) {
            isClean(ref);
        });
    }
});

enifed("glimmer-runtime/tests/component-test", ["exports", "glimmer-compiler", "glimmer-test-helpers", "./support"], function (exports, _glimmerCompiler, _glimmerTestHelpers, _support) {
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

enifed("glimmer-runtime/tests/ember-component-test", ["exports", "glimmer-object", "./support", "glimmer-util", "glimmer-test-helpers", "glimmer-reference"], function (exports, _glimmerObject, _support, _glimmerUtil, _glimmerTestHelpers, _glimmerReference) {
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

enifed("glimmer-runtime/tests/extern", ["exports"], function (exports) {
  "use strict";
});

enifed("glimmer-runtime/tests/initial-render-test", ["exports", "glimmer-compiler", "glimmer-util", "glimmer-test-helpers", "./support"], function (exports, _glimmerCompiler, _glimmerUtil, _glimmerTestHelpers, _support) {
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

enifed("glimmer-runtime/tests/support", ["exports", "glimmer-runtime", "glimmer-compiler", "glimmer-util", "glimmer-reference"], function (exports, _glimmerRuntime, _glimmerCompiler, _glimmerUtil, _glimmerReference) {
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

enifed("glimmer-runtime/tests/updating-test", ["exports", "glimmer-compiler", "glimmer-test-helpers", "./support"], function (exports, _glimmerCompiler, _glimmerTestHelpers, _support) {
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

enifed('glimmer-syntax/tests/generation/print-test', ['exports', 'glimmer-syntax'], function (exports, _glimmerSyntax) {
    'use strict';

    var b = _glimmerSyntax.builders;
    function printEqual(template) {
        var ast = _glimmerSyntax.parse(template);
        equal(_glimmerSyntax.print(ast), template);
    }
    QUnit.module('[glimmer-syntax] Code generation');
    test('ElementNode: tag', function () {
        printEqual('<h1></h1>');
    });
    test('ElementNode: nested tags with indent', function () {
        printEqual('<div>\n  <p>Test</p>\n</div>');
    });
    test('ElementNode: attributes', function () {
        printEqual('<h1 class="foo" id="title"></h1>');
    });
    test('TextNode: chars', function () {
        printEqual('<h1>Test</h1>');
    });
    test('MustacheStatement: slash in path', function () {
        printEqual('{{namespace/foo "bar" baz="qux"}}');
    });
    test('MustacheStatement: path', function () {
        printEqual('<h1>{{model.title}}</h1>');
    });
    test('MustacheStatement: StringLiteral param', function () {
        printEqual('<h1>{{link-to "Foo"}}</h1>');
    });
    test('MustacheStatement: hash', function () {
        printEqual('<h1>{{link-to "Foo" class="bar"}}</h1>');
    });
    test('MustacheStatement: as element attribute', function () {
        printEqual('<h1 class={{if foo "foo" "bar"}}>Test</h1>');
    });
    test('MustacheStatement: as element attribute with path', function () {
        printEqual('<h1 class={{color}}>Test</h1>');
    });
    test('ConcatStatement: in element attribute string', function () {
        printEqual('<h1 class="{{if active "active" "inactive"}} foo">Test</h1>');
    });
    test('ElementModifierStatement', function () {
        printEqual('<p {{action "activate"}} {{someting foo="bar"}}>Test</p>');
    });
    test('PartialStatement', function () {
        printEqual('<p>{{>something "param"}}</p>');
    });
    test('SubExpression', function () {
        printEqual('<p>{{my-component submit=(action (mut model.name) (full-name model.firstName "Smith"))}}</p>');
    });
    test('BlockStatement: multiline', function () {
        printEqual('<ul>{{#each foos as |foo|}}\n  {{foo}}\n{{/each}}</ul>');
    });
    test('BlockStatement: inline', function () {
        printEqual('{{#if foo}}<p>{{foo}}</p>{{/if}}');
    });
    test('UndefinedLiteral', function () {
        var ast = b.program([b.mustache(b.undefined())]);
        equal(_glimmerSyntax.print(ast), '{{undefined}}');
    });
    test('NumberLiteral', function () {
        var ast = b.program([b.mustache('foo', null, b.hash([b.pair('bar', b.number(5))]))]);
        equal(_glimmerSyntax.print(ast), '{{foo bar=5}}');
    });
    test('BooleanLiteral', function () {
        var ast = b.program([b.mustache('foo', null, b.hash([b.pair('bar', b.boolean(true))]))]);
        equal(_glimmerSyntax.print(ast), '{{foo bar=true}}');
    });
    test('HTML comment', function () {
        printEqual('<!-- foo -->');
    });
});

enifed("glimmer-syntax/tests/loc-node-test", ["exports", "glimmer-syntax"], function (exports, _glimmerSyntax) {
    "use strict";

    QUnit.module("[glimmer-syntax] Parser - Location Info");
    function locEqual(node, startLine, startColumn, endLine, endColumn, message) {
        var expected = {
            source: null,
            start: { line: startLine, column: startColumn },
            end: { line: endLine, column: endColumn }
        };
        deepEqual(node.loc, expected, message);
    }
    test("programs", function () {
        var ast = _glimmerSyntax.parse("\n  {{#if foo}}\n    {{bar}}\n       {{/if}}\n    ");
        locEqual(ast, 1, 0, 5, 4, 'outer program');
        // startColumn should be 13 not 2.
        // This should be fixed upstream in Handlebars.
        locEqual(ast.body[1].program, 2, 2, 4, 7, 'nested program');
    });
    test("blocks", function () {
        var ast = _glimmerSyntax.parse("\n  {{#if foo}}\n    {{#if bar}}\n        test\n        {{else}}\n      test\n  {{/if    }}\n       {{/if\n      }}\n    ");
        locEqual(ast.body[1], 2, 2, 9, 8, 'outer block');
        locEqual(ast.body[1].program.body[0], 3, 4, 7, 13, 'nested block');
    });
    test("mustache", function () {
        var ast = _glimmerSyntax.parse("\n    {{foo}}\n    {{#if foo}}\n      bar: {{bar\n        }}\n    {{/if}}\n  ");
        locEqual(ast.body[1], 2, 4, 2, 11, 'outer mustache');
        locEqual(ast.body[3].program.body[1], 4, 11, 5, 10, 'inner mustache');
    });
    test("element modifier", function () {
        var ast = _glimmerSyntax.parse("\n    <div {{bind-attr\n      foo\n      bar=wat}}></div>\n  ");
        locEqual(ast.body[1].modifiers[0], 2, 9, 4, 15, 'element modifier');
    });
    test("html elements", function () {
        var ast = _glimmerSyntax.parse("\n    <section>\n      <br>\n      <div>\n        <hr />\n      </div>\n    </section>\n  ");
        var _ast$body = ast.body;
        var section = _ast$body[1];
        var _section$children = section.children;
        var br = _section$children[1];
        var div = _section$children[3];
        var _div$children = div.children;
        var hr = _div$children[1];

        locEqual(section, 2, 4, 7, 14, 'section element');
        locEqual(br, 3, 6, 3, 10, 'br element');
        locEqual(div, 4, 6, 6, 12, 'div element');
        locEqual(hr, 5, 8, 5, 14, 'hr element');
    });
    test("components", function () {
        var ast = _glimmerSyntax.parse("\n    <el-page>\n      <el-header></el-header>\n      <el-input />\n      <el-footer>\n          </el-footer>\n    </el-page>\n  ");
        var _ast$body2 = ast.body;
        var page = _ast$body2[1];
        var _page$program$body = page.program.body;
        var header = _page$program$body[1];
        var input = _page$program$body[3];
        var footer = _page$program$body[5];

        locEqual(page, 2, 4, 7, 14, 'page component');
        locEqual(header, 3, 6, 3, 29, 'header component');
        locEqual(input, 4, 6, 4, 18, 'input component');
        locEqual(footer, 5, 6, 6, 22, 'footer component');
    });
});

enifed("glimmer-syntax/tests/parser-node-test", ["exports", "handlebars/compiler/base", "glimmer-syntax", "glimmer-syntax/lib/builders", "./support"], function (exports, _handlebarsCompilerBase, _glimmerSyntax, _glimmerSyntaxLibBuilders, _support) {
    "use strict";

    QUnit.module("[glimmer-syntax] Parser - AST");
    test("a simple piece of content", function () {
        var t = 'some content';
        _support.astEqual(t, _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.text('some content')]));
    });
    test("allow simple AST to be passed", function () {
        var ast = _glimmerSyntax.parse(_handlebarsCompilerBase.parse("simple"));
        _support.astEqual(ast, _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.text("simple")]));
    });
    test("allow an AST with mustaches to be passed", function () {
        var ast = _glimmerSyntax.parse(_handlebarsCompilerBase.parse("<h1>some</h1> ast {{foo}}"));
        _support.astEqual(ast, _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.element("h1", [], [], [_glimmerSyntaxLibBuilders.default.text("some")]), _glimmerSyntaxLibBuilders.default.text(" ast "), _glimmerSyntaxLibBuilders.default.mustache(_glimmerSyntaxLibBuilders.default.path('foo'))]));
    });
    test("self-closed element", function () {
        var t = '<g />';
        _support.astEqual(t, _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.element("g")]));
    });
    test("elements can have empty attributes", function () {
        var t = '<img id="">';
        _support.astEqual(t, _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.element("img", [_glimmerSyntaxLibBuilders.default.attr("id", _glimmerSyntaxLibBuilders.default.text(""))])]));
    });
    test("svg content", function () {
        var t = "<svg></svg>";
        _support.astEqual(t, _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.element("svg")]));
    });
    test("html content with html content inline", function () {
        var t = '<div><p></p></div>';
        _support.astEqual(t, _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.element("div", [], [], [_glimmerSyntaxLibBuilders.default.element("p")])]));
    });
    test("html content with svg content inline", function () {
        var t = '<div><svg></svg></div>';
        _support.astEqual(t, _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.element("div", [], [], [_glimmerSyntaxLibBuilders.default.element("svg")])]));
    });
    var integrationPoints = ['foreignObject', 'desc', 'title'];
    function buildIntegrationPointTest(integrationPoint) {
        return function integrationPointTest() {
            var t = '<svg><' + integrationPoint + '><div></div></' + integrationPoint + '></svg>';
            _support.astEqual(t, _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.element("svg", [], [], [_glimmerSyntaxLibBuilders.default.element(integrationPoint, [], [], [_glimmerSyntaxLibBuilders.default.element("div")])])]));
        };
    }
    for (var i = 0, length = integrationPoints.length; i < length; i++) {
        test("svg content with html content inline for " + integrationPoints[i], buildIntegrationPointTest(integrationPoints[i]));
    }
    test("a piece of content with HTML", function () {
        var t = 'some <div>content</div> done';
        _support.astEqual(t, _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.text("some "), _glimmerSyntaxLibBuilders.default.element("div", [], [], [_glimmerSyntaxLibBuilders.default.text("content")]), _glimmerSyntaxLibBuilders.default.text(" done")]));
    });
    test("a piece of Handlebars with HTML", function () {
        var t = 'some <div>{{content}}</div> done';
        _support.astEqual(t, _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.text("some "), _glimmerSyntaxLibBuilders.default.element("div", [], [], [_glimmerSyntaxLibBuilders.default.mustache(_glimmerSyntaxLibBuilders.default.path('content'))]), _glimmerSyntaxLibBuilders.default.text(" done")]));
    });
    test("Handlebars embedded in an attribute (quoted)", function () {
        var t = 'some <div class="{{foo}}">content</div> done';
        _support.astEqual(t, _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.text("some "), _glimmerSyntaxLibBuilders.default.element("div", [_glimmerSyntaxLibBuilders.default.attr("class", _glimmerSyntaxLibBuilders.default.concat([_glimmerSyntaxLibBuilders.default.path('foo')]))], [], [_glimmerSyntaxLibBuilders.default.text("content")]), _glimmerSyntaxLibBuilders.default.text(" done")]));
    });
    test("Handlebars embedded in an attribute (unquoted)", function () {
        var t = 'some <div class={{foo}}>content</div> done';
        _support.astEqual(t, _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.text("some "), _glimmerSyntaxLibBuilders.default.element("div", [_glimmerSyntaxLibBuilders.default.attr("class", _glimmerSyntaxLibBuilders.default.mustache(_glimmerSyntaxLibBuilders.default.path('foo')))], [], [_glimmerSyntaxLibBuilders.default.text("content")]), _glimmerSyntaxLibBuilders.default.text(" done")]));
    });
    test("Handlebars embedded in an attribute (sexprs)", function () {
        var t = 'some <div class="{{foo (foo "abc")}}">content</div> done';
        _support.astEqual(t, _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.text("some "), _glimmerSyntaxLibBuilders.default.element("div", [_glimmerSyntaxLibBuilders.default.attr("class", _glimmerSyntaxLibBuilders.default.concat([_glimmerSyntaxLibBuilders.default.mustache(_glimmerSyntaxLibBuilders.default.path('foo'), [_glimmerSyntaxLibBuilders.default.sexpr(_glimmerSyntaxLibBuilders.default.path('foo'), [_glimmerSyntaxLibBuilders.default.string('abc')])])]))], [], [_glimmerSyntaxLibBuilders.default.text("content")]), _glimmerSyntaxLibBuilders.default.text(" done")]));
    });
    test("Handlebars embedded in an attribute with other content surrounding it", function () {
        var t = 'some <a href="http://{{link}}/">content</a> done';
        _support.astEqual(t, _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.text("some "), _glimmerSyntaxLibBuilders.default.element("a", [_glimmerSyntaxLibBuilders.default.attr("href", _glimmerSyntaxLibBuilders.default.concat([_glimmerSyntaxLibBuilders.default.string("http://"), _glimmerSyntaxLibBuilders.default.path('link'), _glimmerSyntaxLibBuilders.default.string("/")]))], [], [_glimmerSyntaxLibBuilders.default.text("content")]), _glimmerSyntaxLibBuilders.default.text(" done")]));
    });
    test("A more complete embedding example", function () {
        var t = "{{embed}} {{some 'content'}} " + "<div class='{{foo}} {{bind-class isEnabled truthy='enabled'}}'>{{ content }}</div>" + " {{more 'embed'}}";
        _support.astEqual(t, _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.mustache(_glimmerSyntaxLibBuilders.default.path('embed')), _glimmerSyntaxLibBuilders.default.text(' '), _glimmerSyntaxLibBuilders.default.mustache(_glimmerSyntaxLibBuilders.default.path('some'), [_glimmerSyntaxLibBuilders.default.string('content')]), _glimmerSyntaxLibBuilders.default.text(' '), _glimmerSyntaxLibBuilders.default.element("div", [_glimmerSyntaxLibBuilders.default.attr("class", _glimmerSyntaxLibBuilders.default.concat([_glimmerSyntaxLibBuilders.default.path('foo'), _glimmerSyntaxLibBuilders.default.string(' '), _glimmerSyntaxLibBuilders.default.mustache(_glimmerSyntaxLibBuilders.default.path('bind-class'), [_glimmerSyntaxLibBuilders.default.path('isEnabled')], _glimmerSyntaxLibBuilders.default.hash([_glimmerSyntaxLibBuilders.default.pair('truthy', _glimmerSyntaxLibBuilders.default.string('enabled'))]))]))], [], [_glimmerSyntaxLibBuilders.default.mustache(_glimmerSyntaxLibBuilders.default.path('content'))]), _glimmerSyntaxLibBuilders.default.text(' '), _glimmerSyntaxLibBuilders.default.mustache(_glimmerSyntaxLibBuilders.default.path('more'), [_glimmerSyntaxLibBuilders.default.string('embed')])]));
    });
    test("Simple embedded block helpers", function () {
        var t = "{{#if foo}}<div>{{content}}</div>{{/if}}";
        _support.astEqual(t, _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.block(_glimmerSyntaxLibBuilders.default.path('if'), [_glimmerSyntaxLibBuilders.default.path('foo')], _glimmerSyntaxLibBuilders.default.hash(), _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.element('div', [], [], [_glimmerSyntaxLibBuilders.default.mustache(_glimmerSyntaxLibBuilders.default.path('content'))])]))]));
    });
    test("Involved block helper", function () {
        var t = '<p>hi</p> content {{#testing shouldRender}}<p>Appears!</p>{{/testing}} more <em>content</em> here';
        _support.astEqual(t, _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.element('p', [], [], [_glimmerSyntaxLibBuilders.default.text('hi')]), _glimmerSyntaxLibBuilders.default.text(' content '), _glimmerSyntaxLibBuilders.default.block(_glimmerSyntaxLibBuilders.default.path('testing'), [_glimmerSyntaxLibBuilders.default.path('shouldRender')], _glimmerSyntaxLibBuilders.default.hash(), _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.element('p', [], [], [_glimmerSyntaxLibBuilders.default.text('Appears!')])])), _glimmerSyntaxLibBuilders.default.text(' more '), _glimmerSyntaxLibBuilders.default.element('em', [], [], [_glimmerSyntaxLibBuilders.default.text('content')]), _glimmerSyntaxLibBuilders.default.text(' here')]));
    });
    test("Element modifiers", function () {
        var t = "<p {{action 'boom'}} class='bar'>Some content</p>";
        _support.astEqual(t, _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.element('p', [_glimmerSyntaxLibBuilders.default.attr('class', _glimmerSyntaxLibBuilders.default.text('bar'))], [_glimmerSyntaxLibBuilders.default.elementModifier(_glimmerSyntaxLibBuilders.default.path('action'), [_glimmerSyntaxLibBuilders.default.string('boom')])], [_glimmerSyntaxLibBuilders.default.text('Some content')])]));
    });
    test("Tokenizer: MustacheStatement encountered in tagName state", function () {
        var t = "<input{{bar}}>";
        _support.astEqual(t, _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.element('input', [], [_glimmerSyntaxLibBuilders.default.elementModifier(_glimmerSyntaxLibBuilders.default.path('bar'))])]));
    });
    test("Tokenizer: MustacheStatement encountered in beforeAttributeName state", function () {
        var t = "<input {{bar}}>";
        _support.astEqual(t, _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.element('input', [], [_glimmerSyntaxLibBuilders.default.elementModifier(_glimmerSyntaxLibBuilders.default.path('bar'))])]));
    });
    test("Tokenizer: MustacheStatement encountered in attributeName state", function () {
        var t = "<input foo{{bar}}>";
        _support.astEqual(t, _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.element('input', [_glimmerSyntaxLibBuilders.default.attr('foo', _glimmerSyntaxLibBuilders.default.text(''))], [_glimmerSyntaxLibBuilders.default.elementModifier(_glimmerSyntaxLibBuilders.default.path('bar'))])]));
    });
    test("Tokenizer: MustacheStatement encountered in afterAttributeName state", function () {
        var t = "<input foo {{bar}}>";
        _support.astEqual(t, _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.element('input', [_glimmerSyntaxLibBuilders.default.attr('foo', _glimmerSyntaxLibBuilders.default.text(''))], [_glimmerSyntaxLibBuilders.default.elementModifier(_glimmerSyntaxLibBuilders.default.path('bar'))])]));
    });
    test("Tokenizer: MustacheStatement encountered in afterAttributeValue state", function () {
        var t = "<input foo=1 {{bar}}>";
        _support.astEqual(t, _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.element('input', [_glimmerSyntaxLibBuilders.default.attr('foo', _glimmerSyntaxLibBuilders.default.text('1'))], [_glimmerSyntaxLibBuilders.default.elementModifier(_glimmerSyntaxLibBuilders.default.path('bar'))])]));
    });
    test("Tokenizer: MustacheStatement encountered in afterAttributeValueQuoted state", function () {
        var t = "<input foo='1'{{bar}}>";
        _support.astEqual(t, _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.element('input', [_glimmerSyntaxLibBuilders.default.attr('foo', _glimmerSyntaxLibBuilders.default.text('1'))], [_glimmerSyntaxLibBuilders.default.elementModifier(_glimmerSyntaxLibBuilders.default.path('bar'))])]));
    });
    test("Stripping - mustaches", function () {
        var t = "foo {{~content}} bar";
        _support.astEqual(t, _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.text('foo'), _glimmerSyntaxLibBuilders.default.mustache(_glimmerSyntaxLibBuilders.default.path('content')), _glimmerSyntaxLibBuilders.default.text(' bar')]));
        t = "foo {{content~}} bar";
        _support.astEqual(t, _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.text('foo '), _glimmerSyntaxLibBuilders.default.mustache(_glimmerSyntaxLibBuilders.default.path('content')), _glimmerSyntaxLibBuilders.default.text('bar')]));
    });
    test("Stripping - blocks", function () {
        var t = "foo {{~#wat}}{{/wat}} bar";
        _support.astEqual(t, _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.text('foo'), _glimmerSyntaxLibBuilders.default.block(_glimmerSyntaxLibBuilders.default.path('wat'), [], _glimmerSyntaxLibBuilders.default.hash(), _glimmerSyntaxLibBuilders.default.program()), _glimmerSyntaxLibBuilders.default.text(' bar')]));
        t = "foo {{#wat}}{{/wat~}} bar";
        _support.astEqual(t, _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.text('foo '), _glimmerSyntaxLibBuilders.default.block(_glimmerSyntaxLibBuilders.default.path('wat'), [], _glimmerSyntaxLibBuilders.default.hash(), _glimmerSyntaxLibBuilders.default.program()), _glimmerSyntaxLibBuilders.default.text('bar')]));
    });
    test("Stripping - programs", function () {
        var t = "{{#wat~}} foo {{else}}{{/wat}}";
        _support.astEqual(t, _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.block(_glimmerSyntaxLibBuilders.default.path('wat'), [], _glimmerSyntaxLibBuilders.default.hash(), _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.text('foo ')]), _glimmerSyntaxLibBuilders.default.program())]));
        t = "{{#wat}} foo {{~else}}{{/wat}}";
        _support.astEqual(t, _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.block(_glimmerSyntaxLibBuilders.default.path('wat'), [], _glimmerSyntaxLibBuilders.default.hash(), _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.text(' foo')]), _glimmerSyntaxLibBuilders.default.program())]));
        t = "{{#wat}}{{else~}} foo {{/wat}}";
        _support.astEqual(t, _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.block(_glimmerSyntaxLibBuilders.default.path('wat'), [], _glimmerSyntaxLibBuilders.default.hash(), _glimmerSyntaxLibBuilders.default.program(), _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.text('foo ')]))]));
        t = "{{#wat}}{{else}} foo {{~/wat}}";
        _support.astEqual(t, _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.block(_glimmerSyntaxLibBuilders.default.path('wat'), [], _glimmerSyntaxLibBuilders.default.hash(), _glimmerSyntaxLibBuilders.default.program(), _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.text(' foo')]))]));
    });
    test("Stripping - removes unnecessary text nodes", function () {
        var t = "{{#each~}}\n  <li> foo </li>\n{{~/each}}";
        _support.astEqual(t, _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.block(_glimmerSyntaxLibBuilders.default.path('each'), [], _glimmerSyntaxLibBuilders.default.hash(), _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.element('li', [], [], [_glimmerSyntaxLibBuilders.default.text(' foo ')])]))]));
    });
    // TODO: Make these throw an error.
    //test("Awkward mustache in unquoted attribute value", function() {
    //  var t = "<div class=a{{foo}}></div>";
    //  astEqual(t, b.program([
    //    b.element('div', [ b.attr('class', concat([b.string("a"), b.sexpr([b.path('foo')])])) ])
    //  ]));
    //
    //  t = "<div class=a{{foo}}b></div>";
    //  astEqual(t, b.program([
    //    b.element('div', [ b.attr('class', concat([b.string("a"), b.sexpr([b.path('foo')]), b.string("b")])) ])
    //  ]));
    //
    //  t = "<div class={{foo}}b></div>";
    //  astEqual(t, b.program([
    //    b.element('div', [ b.attr('class', concat([b.sexpr([b.path('foo')]), b.string("b")])) ])
    //  ]));
    //});
    test("an HTML comment", function () {
        var t = 'before <!-- some comment --> after';
        _support.astEqual(t, _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.text("before "), _glimmerSyntaxLibBuilders.default.comment(" some comment "), _glimmerSyntaxLibBuilders.default.text(" after")]));
    });
    test("allow {{null}} to be passed as helper name", function () {
        var ast = _glimmerSyntax.parse("{{null}}");
        _support.astEqual(ast, _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.mustache(_glimmerSyntaxLibBuilders.default.null())]));
    });
    test("allow {{null}} to be passed as a param", function () {
        var ast = _glimmerSyntax.parse("{{foo null}}");
        _support.astEqual(ast, _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.mustache(_glimmerSyntaxLibBuilders.default.path('foo'), [_glimmerSyntaxLibBuilders.default.null()])]));
    });
    test("allow {{undefined}} to be passed as helper name", function () {
        var ast = _glimmerSyntax.parse("{{undefined}}");
        _support.astEqual(ast, _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.mustache(_glimmerSyntaxLibBuilders.default.undefined())]));
    });
    test("allow {{undefined}} to be passed as a param", function () {
        var ast = _glimmerSyntax.parse("{{foo undefined}}");
        _support.astEqual(ast, _glimmerSyntaxLibBuilders.default.program([_glimmerSyntaxLibBuilders.default.mustache(_glimmerSyntaxLibBuilders.default.path('foo'), [_glimmerSyntaxLibBuilders.default.undefined()])]));
    });
});

enifed('glimmer-syntax/tests/plugin-node-test', ['exports', 'glimmer-syntax'], function (exports, _glimmerSyntax) {
    'use strict';

    QUnit.module('[glimmer-syntax] Plugins - AST Transforms');
    test('AST plugins can be provided to the compiler', function () {
        expect(1);
        function Plugin() {}
        Plugin.prototype.transform = function () {
            ok(true, 'transform was called!');
        };
        _glimmerSyntax.parse('<div></div>', {
            plugins: {
                ast: [Plugin]
            }
        });
    });
    test('provides syntax package as `syntax` prop if value is null', function () {
        expect(1);
        function Plugin() {}
        Plugin.prototype.transform = function () {
            equal(this.syntax.Walker, _glimmerSyntax.Walker);
        };
        _glimmerSyntax.parse('<div></div>', {
            plugins: {
                ast: [Plugin]
            }
        });
    });
    test('AST plugins can modify the AST', function () {
        expect(1);
        var expected = "OOOPS, MESSED THAT UP!";
        function Plugin() {}
        Plugin.prototype.transform = function () {
            return expected;
        };
        var ast = _glimmerSyntax.parse('<div></div>', {
            plugins: {
                ast: [Plugin]
            }
        });
        equal(ast, expected, 'return value from AST transform is used');
    });
    test('AST plugins can be chained', function () {
        expect(2);
        var expected = "OOOPS, MESSED THAT UP!";
        function Plugin() {}
        Plugin.prototype.transform = function () {
            return expected;
        };
        function SecondaryPlugin() {}
        SecondaryPlugin.prototype.transform = function (ast) {
            equal(ast, expected, 'return value from AST transform is used');
            return 'BOOM!';
        };
        var ast = _glimmerSyntax.parse('<div></div>', {
            plugins: {
                ast: [Plugin, SecondaryPlugin]
            }
        });
        equal(ast, 'BOOM!', 'return value from last AST transform is used');
    });
});

enifed('glimmer-syntax/tests/support', ['exports', 'glimmer-syntax'], function (exports, _glimmerSyntax) {
    'use strict';

    exports.astEqual = astEqual;

    function normalizeNode(obj) {
        if (obj && typeof obj === 'object') {
            var newObj;
            if (obj.splice) {
                newObj = new Array(obj.length);
                for (var i = 0; i < obj.length; i++) {
                    newObj[i] = normalizeNode(obj[i]);
                }
            } else {
                newObj = {};
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        newObj[key] = normalizeNode(obj[key]);
                    }
                }
                if (newObj.type) {
                    newObj._type = newObj.type;
                    delete newObj.type;
                }
                delete newObj.loc;
            }
            return newObj;
        } else {
            return obj;
        }
    }

    function astEqual(actual, expected, message) {
        if (typeof actual === 'string') {
            actual = _glimmerSyntax.parse(actual);
        }
        if (typeof expected === 'string') {
            expected = _glimmerSyntax.parse(expected);
        }
        actual = normalizeNode(actual);
        expected = normalizeNode(expected);
        deepEqual(actual, expected, message);
    }
});

enifed('glimmer-syntax/tests/traversal/manipulating-node-test', ['exports', '../support', 'glimmer-syntax', 'glimmer-syntax/lib/traversal/errors'], function (exports, _support, _glimmerSyntax, _glimmerSyntaxLibTraversalErrors) {
    'use strict';

    QUnit.module('[glimmer-syntax] Traversal - manipulating');
    ['enter', 'exit'].forEach(function (eventName) {
        QUnit.test('[' + eventName + '] Replacing self in a key (returning null)', function (assert) {
            var ast = _glimmerSyntax.parse('<x y={{z}} />');
            var attr = ast.body[0].attributes[0];
            assert.throws(function () {
                var _MustacheStatement;

                _glimmerSyntax.traverse(ast, {
                    MustacheStatement: (_MustacheStatement = {}, _MustacheStatement[eventName] = function (node) {
                        if (node.path.parts[0] === 'z') {
                            return null;
                        }
                    }, _MustacheStatement)
                });
            }, _glimmerSyntaxLibTraversalErrors.cannotRemoveNode(attr.value, attr, 'value'));
        });
        QUnit.test('[' + eventName + '] Replacing self in a key (returning an empty array)', function (assert) {
            var ast = _glimmerSyntax.parse('<x y={{z}} />');
            var attr = ast.body[0].attributes[0];
            assert.throws(function () {
                var _MustacheStatement2;

                _glimmerSyntax.traverse(ast, {
                    MustacheStatement: (_MustacheStatement2 = {}, _MustacheStatement2[eventName] = function (node) {
                        if (node.path.parts[0] === 'z') {
                            return [];
                        }
                    }, _MustacheStatement2)
                });
            }, _glimmerSyntaxLibTraversalErrors.cannotRemoveNode(attr.value, attr, 'value'));
        });
        QUnit.test('[' + eventName + '] Replacing self in a key (returning a node)', function () {
            var _MustacheStatement3;

            var ast = _glimmerSyntax.parse('<x y={{z}} />');
            _glimmerSyntax.traverse(ast, {
                MustacheStatement: (_MustacheStatement3 = {}, _MustacheStatement3[eventName] = function (node) {
                    if (node.path.parts[0] === 'z') {
                        return _glimmerSyntax.builders.mustache('a');
                    }
                }, _MustacheStatement3)
            });
            _support.astEqual(ast, '<x y={{a}} />');
        });
        QUnit.test('[' + eventName + '] Replacing self in a key (returning an array with a single node)', function () {
            var _MustacheStatement4;

            var ast = _glimmerSyntax.parse('<x y={{z}} />');
            _glimmerSyntax.traverse(ast, {
                MustacheStatement: (_MustacheStatement4 = {}, _MustacheStatement4[eventName] = function (node) {
                    if (node.path.parts[0] === 'z') {
                        return [_glimmerSyntax.builders.mustache('a')];
                    }
                }, _MustacheStatement4)
            });
            _support.astEqual(ast, '<x y={{a}} />');
        });
        QUnit.test('[' + eventName + '] Replacing self in a key (returning an array with multiple nodes)', function (assert) {
            var ast = _glimmerSyntax.parse('<x y={{z}} />');
            var attr = ast.body[0].attributes[0];
            assert.throws(function () {
                var _MustacheStatement5;

                _glimmerSyntax.traverse(ast, {
                    MustacheStatement: (_MustacheStatement5 = {}, _MustacheStatement5[eventName] = function (node) {
                        if (node.path.parts[0] === 'z') {
                            return [_glimmerSyntax.builders.mustache('a'), _glimmerSyntax.builders.mustache('b'), _glimmerSyntax.builders.mustache('c')];
                        }
                    }, _MustacheStatement5)
                });
            }, _glimmerSyntaxLibTraversalErrors.cannotReplaceNode(attr.value, attr, 'value'));
        });
        QUnit.test('[' + eventName + '] Replacing self in an array (returning null)', function () {
            var _MustacheStatement6;

            var ast = _glimmerSyntax.parse('{{x}}{{y}}{{z}}');
            _glimmerSyntax.traverse(ast, {
                MustacheStatement: (_MustacheStatement6 = {}, _MustacheStatement6[eventName] = function (node) {
                    if (node.path.parts[0] === 'y') {
                        return null;
                    }
                }, _MustacheStatement6)
            });
            _support.astEqual(ast, '{{x}}{{z}}');
        });
        QUnit.test('[' + eventName + '] Replacing self in an array (returning an empty array)', function () {
            var _MustacheStatement7;

            var ast = _glimmerSyntax.parse('{{x}}{{y}}{{z}}');
            _glimmerSyntax.traverse(ast, {
                MustacheStatement: (_MustacheStatement7 = {}, _MustacheStatement7[eventName] = function (node) {
                    if (node.path.parts[0] === 'y') {
                        return [];
                    }
                }, _MustacheStatement7)
            });
            _support.astEqual(ast, '{{x}}{{z}}');
        });
        QUnit.test('[' + eventName + '] Replacing self in an array (returning a node)', function () {
            var _MustacheStatement8;

            var ast = _glimmerSyntax.parse('{{x}}{{y}}{{z}}');
            _glimmerSyntax.traverse(ast, {
                MustacheStatement: (_MustacheStatement8 = {}, _MustacheStatement8[eventName] = function (node) {
                    if (node.path.parts[0] === 'y') {
                        return _glimmerSyntax.builders.mustache('a');
                    }
                }, _MustacheStatement8)
            });
            _support.astEqual(ast, '{{x}}{{a}}{{z}}');
        });
        QUnit.test('[' + eventName + '] Replacing self in an array (returning an array with a single node)', function () {
            var _MustacheStatement9;

            var ast = _glimmerSyntax.parse('{{x}}{{y}}{{z}}');
            _glimmerSyntax.traverse(ast, {
                MustacheStatement: (_MustacheStatement9 = {}, _MustacheStatement9[eventName] = function (node) {
                    if (node.path.parts[0] === 'y') {
                        return [_glimmerSyntax.builders.mustache('a')];
                    }
                }, _MustacheStatement9)
            });
            _support.astEqual(ast, '{{x}}{{a}}{{z}}');
        });
        QUnit.test('[' + eventName + '] Replacing self in an array (returning an array with multiple nodes)', function () {
            var _MustacheStatement10;

            var ast = _glimmerSyntax.parse('{{x}}{{y}}{{z}}');
            _glimmerSyntax.traverse(ast, {
                MustacheStatement: (_MustacheStatement10 = {}, _MustacheStatement10[eventName] = function (node) {
                    if (node.path.parts[0] === 'y') {
                        return [_glimmerSyntax.builders.mustache('a'), _glimmerSyntax.builders.mustache('b'), _glimmerSyntax.builders.mustache('c')];
                    }
                }, _MustacheStatement10)
            });
            _support.astEqual(ast, '{{x}}{{a}}{{b}}{{c}}{{z}}');
        });
    });
    QUnit.module('[glimmer-syntax] Traversal - manipulating (edge cases)');
    QUnit.test('Inside of a block', function () {
        var ast = _glimmerSyntax.parse('{{y}}{{#w}}{{x}}{{y}}{{z}}{{/w}}');
        _glimmerSyntax.traverse(ast, {
            MustacheStatement: function (node) {
                if (node.path.parts[0] === 'y') {
                    return [_glimmerSyntax.builders.mustache('a'), _glimmerSyntax.builders.mustache('b'), _glimmerSyntax.builders.mustache('c')];
                }
            }
        });
        _support.astEqual(ast, '{{a}}{{b}}{{c}}{{#w}}{{x}}{{a}}{{b}}{{c}}{{z}}{{/w}}');
    });
    QUnit.test('Exit event is not triggered if the node is replaced during the enter event', function (assert) {
        var ast = _glimmerSyntax.parse('{{x}}');
        var didExit = false;
        _glimmerSyntax.traverse(ast, {
            MustacheStatement: {
                enter: function () {
                    return _glimmerSyntax.builders.mustache('y');
                },
                exit: function () {
                    didExit = true;
                }
            }
        });
        assert.strictEqual(didExit, false);
    });
});

enifed('glimmer-syntax/tests/traversal/visiting-keys-node-test', ['exports', 'glimmer-syntax'], function (exports, _glimmerSyntax) {
    'use strict';

    function traversalEqual(node, expectedTraversal) {
        var actualTraversal = [];
        _glimmerSyntax.traverse(node, {
            All: {
                enter: function (node) {
                    actualTraversal.push(['enter', node]);
                },
                exit: function (node) {
                    actualTraversal.push(['exit', node]);
                },
                keys: {
                    All: {
                        enter: function (node, key) {
                            actualTraversal.push(['enter:' + key, node]);
                        },
                        exit: function (node, key) {
                            actualTraversal.push(['exit:' + key, node]);
                        }
                    }
                }
            }
        });
        deepEqual(actualTraversal.map(function (a) {
            return a[0] + ' ' + a[1].type;
        }), expectedTraversal.map(function (a) {
            return a[0] + ' ' + a[1].type;
        }));
        var nodesEqual = true;
        for (var i = 0; i < actualTraversal.length; i++) {
            if (actualTraversal[i][1] !== expectedTraversal[i][1]) {
                nodesEqual = false;
                break;
            }
        }
        ok(nodesEqual, "Actual nodes match expected nodes");
    }
    QUnit.module('[glimmer-syntax] Traversal - visiting keys');
    test('Blocks', function () {
        var ast = _glimmerSyntax.parse('{{#block param1 param2 key1=value key2=value}}<b></b><b></b>{{/block}}');
        traversalEqual(ast, [['enter', ast], ['enter:body', ast], ['enter', ast.body[0]], ['enter:path', ast.body[0]], ['enter', ast.body[0].path], ['exit', ast.body[0].path], ['exit:path', ast.body[0]], ['enter:params', ast.body[0]], ['enter', ast.body[0].params[0]], ['exit', ast.body[0].params[0]], ['enter', ast.body[0].params[1]], ['exit', ast.body[0].params[1]], ['exit:params', ast.body[0]], ['enter:hash', ast.body[0]], ['enter', ast.body[0].hash], ['enter:pairs', ast.body[0].hash], ['enter', ast.body[0].hash.pairs[0]], ['enter:value', ast.body[0].hash.pairs[0]], ['enter', ast.body[0].hash.pairs[0].value], ['exit', ast.body[0].hash.pairs[0].value], ['exit:value', ast.body[0].hash.pairs[0]], ['exit', ast.body[0].hash.pairs[0]], ['enter', ast.body[0].hash.pairs[1]], ['enter:value', ast.body[0].hash.pairs[1]], ['enter', ast.body[0].hash.pairs[1].value], ['exit', ast.body[0].hash.pairs[1].value], ['exit:value', ast.body[0].hash.pairs[1]], ['exit', ast.body[0].hash.pairs[1]], ['exit:pairs', ast.body[0].hash], ['exit', ast.body[0].hash], ['exit:hash', ast.body[0]], ['enter:program', ast.body[0]], ['enter', ast.body[0].program], ['enter:body', ast.body[0].program], ['enter', ast.body[0].program.body[0]], ['enter:attributes', ast.body[0].program.body[0]], ['exit:attributes', ast.body[0].program.body[0]], ['enter:modifiers', ast.body[0].program.body[0]], ['exit:modifiers', ast.body[0].program.body[0]], ['enter:children', ast.body[0].program.body[0]], ['exit:children', ast.body[0].program.body[0]], ['exit', ast.body[0].program.body[0]], ['enter', ast.body[0].program.body[1]], ['enter:attributes', ast.body[0].program.body[1]], ['exit:attributes', ast.body[0].program.body[1]], ['enter:modifiers', ast.body[0].program.body[1]], ['exit:modifiers', ast.body[0].program.body[1]], ['enter:children', ast.body[0].program.body[1]], ['exit:children', ast.body[0].program.body[1]], ['exit', ast.body[0].program.body[1]], ['exit:body', ast.body[0].program], ['exit', ast.body[0].program], ['exit:program', ast.body[0]], ['exit', ast.body[0]], ['exit:body', ast], ['exit', ast]]);
    });
});

enifed('glimmer-syntax/tests/traversal/visiting-node-test', ['exports', 'glimmer-syntax'], function (exports, _glimmerSyntax) {
    'use strict';

    function traversalEqual(node, expectedTraversal) {
        var actualTraversal = [];
        _glimmerSyntax.traverse(node, {
            All: {
                enter: function (node) {
                    actualTraversal.push(['enter', node]);
                },
                exit: function (node) {
                    actualTraversal.push(['exit', node]);
                }
            }
        });
        deepEqual(actualTraversal.map(function (a) {
            return a[0] + ' ' + a[1].type;
        }), expectedTraversal.map(function (a) {
            return a[0] + ' ' + a[1].type;
        }));
        var nodesEqual = true;
        for (var i = 0; i < actualTraversal.length; i++) {
            if (actualTraversal[i][1] !== expectedTraversal[i][1]) {
                nodesEqual = false;
                break;
            }
        }
        ok(nodesEqual, "Actual nodes match expected nodes");
    }
    QUnit.module('[glimmer-syntax] Traversal - visiting');
    test('Elements and attributes', function () {
        var ast = _glimmerSyntax.parse('<div id="id" class="large {{classes}}" value={{value}}><b></b><b></b></div>');
        traversalEqual(ast, [['enter', ast], ['enter', ast.body[0]], ['enter', ast.body[0].attributes[0]], ['enter', ast.body[0].attributes[0].value], ['exit', ast.body[0].attributes[0].value], ['exit', ast.body[0].attributes[0]], ['enter', ast.body[0].attributes[1]], ['enter', ast.body[0].attributes[1].value], ['enter', ast.body[0].attributes[1].value.parts[0]], ['exit', ast.body[0].attributes[1].value.parts[0]], ['enter', ast.body[0].attributes[1].value.parts[1]], ['exit', ast.body[0].attributes[1].value.parts[1]], ['exit', ast.body[0].attributes[1].value], ['exit', ast.body[0].attributes[1]], ['enter', ast.body[0].attributes[2]], ['enter', ast.body[0].attributes[2].value], ['enter', ast.body[0].attributes[2].value.path], ['exit', ast.body[0].attributes[2].value.path], ['enter', ast.body[0].attributes[2].value.hash], ['exit', ast.body[0].attributes[2].value.hash], ['exit', ast.body[0].attributes[2].value], ['exit', ast.body[0].attributes[2]], ['enter', ast.body[0].children[0]], ['exit', ast.body[0].children[0]], ['enter', ast.body[0].children[1]], ['exit', ast.body[0].children[1]], ['exit', ast.body[0]], ['exit', ast]]);
    });
    test('Element modifiers', function () {
        var ast = _glimmerSyntax.parse('<div {{modifier}}{{modifier param1 param2 key1=value key2=value}}></div>');
        traversalEqual(ast, [['enter', ast], ['enter', ast.body[0]], ['enter', ast.body[0].modifiers[0]], ['enter', ast.body[0].modifiers[0].path], ['exit', ast.body[0].modifiers[0].path], ['enter', ast.body[0].modifiers[0].hash], ['exit', ast.body[0].modifiers[0].hash], ['exit', ast.body[0].modifiers[0]], ['enter', ast.body[0].modifiers[1]], ['enter', ast.body[0].modifiers[1].path], ['exit', ast.body[0].modifiers[1].path], ['enter', ast.body[0].modifiers[1].params[0]], ['exit', ast.body[0].modifiers[1].params[0]], ['enter', ast.body[0].modifiers[1].params[1]], ['exit', ast.body[0].modifiers[1].params[1]], ['enter', ast.body[0].modifiers[1].hash], ['enter', ast.body[0].modifiers[1].hash.pairs[0]], ['enter', ast.body[0].modifiers[1].hash.pairs[0].value], ['exit', ast.body[0].modifiers[1].hash.pairs[0].value], ['exit', ast.body[0].modifiers[1].hash.pairs[0]], ['enter', ast.body[0].modifiers[1].hash.pairs[1]], ['enter', ast.body[0].modifiers[1].hash.pairs[1].value], ['exit', ast.body[0].modifiers[1].hash.pairs[1].value], ['exit', ast.body[0].modifiers[1].hash.pairs[1]], ['exit', ast.body[0].modifiers[1].hash], ['exit', ast.body[0].modifiers[1]], ['exit', ast.body[0]], ['exit', ast]]);
    });
    test('Blocks', function () {
        var ast = _glimmerSyntax.parse('{{#block}}{{/block}}' + '{{#block param1 param2 key1=value key2=value}}<b></b><b></b>{{/block}}');
        traversalEqual(ast, [['enter', ast], ['enter', ast.body[0]], ['enter', ast.body[0].path], ['exit', ast.body[0].path], ['enter', ast.body[0].hash], ['exit', ast.body[0].hash], ['enter', ast.body[0].program], ['exit', ast.body[0].program], ['exit', ast.body[0]], ['enter', ast.body[1]], ['enter', ast.body[1].path], ['exit', ast.body[1].path], ['enter', ast.body[1].params[0]], ['exit', ast.body[1].params[0]], ['enter', ast.body[1].params[1]], ['exit', ast.body[1].params[1]], ['enter', ast.body[1].hash], ['enter', ast.body[1].hash.pairs[0]], ['enter', ast.body[1].hash.pairs[0].value], ['exit', ast.body[1].hash.pairs[0].value], ['exit', ast.body[1].hash.pairs[0]], ['enter', ast.body[1].hash.pairs[1]], ['enter', ast.body[1].hash.pairs[1].value], ['exit', ast.body[1].hash.pairs[1].value], ['exit', ast.body[1].hash.pairs[1]], ['exit', ast.body[1].hash], ['enter', ast.body[1].program], ['enter', ast.body[1].program.body[0]], ['exit', ast.body[1].program.body[0]], ['enter', ast.body[1].program.body[1]], ['exit', ast.body[1].program.body[1]], ['exit', ast.body[1].program], ['exit', ast.body[1]], ['exit', ast]]);
    });
    test('Mustaches', function () {
        var ast = _glimmerSyntax.parse('{{mustache}}' + '{{mustache param1 param2 key1=value key2=value}}');
        traversalEqual(ast, [['enter', ast], ['enter', ast.body[0]], ['enter', ast.body[0].path], ['exit', ast.body[0].path], ['enter', ast.body[0].hash], ['exit', ast.body[0].hash], ['exit', ast.body[0]], ['enter', ast.body[1]], ['enter', ast.body[1].path], ['exit', ast.body[1].path], ['enter', ast.body[1].params[0]], ['exit', ast.body[1].params[0]], ['enter', ast.body[1].params[1]], ['exit', ast.body[1].params[1]], ['enter', ast.body[1].hash], ['enter', ast.body[1].hash.pairs[0]], ['enter', ast.body[1].hash.pairs[0].value], ['exit', ast.body[1].hash.pairs[0].value], ['exit', ast.body[1].hash.pairs[0]], ['enter', ast.body[1].hash.pairs[1]], ['enter', ast.body[1].hash.pairs[1].value], ['exit', ast.body[1].hash.pairs[1].value], ['exit', ast.body[1].hash.pairs[1]], ['exit', ast.body[1].hash], ['exit', ast.body[1]], ['exit', ast]]);
    });
    test('Components', function () {
        var ast = _glimmerSyntax.parse('<x-block />' + '<x-block></x-block>' + '<x-block id="id" class="large {{classes}}" value={{value}}><b></b><b></b></x-block>');
        traversalEqual(ast, [['enter', ast], ['enter', ast.body[0]], ['enter', ast.body[0].program], ['exit', ast.body[0].program], ['exit', ast.body[0]], ['enter', ast.body[1]], ['enter', ast.body[1].program], ['exit', ast.body[1].program], ['exit', ast.body[1]], ['enter', ast.body[2]], ['enter', ast.body[2].attributes[0]], ['enter', ast.body[2].attributes[0].value], ['exit', ast.body[2].attributes[0].value], ['exit', ast.body[2].attributes[0]], ['enter', ast.body[2].attributes[1]], ['enter', ast.body[2].attributes[1].value], ['enter', ast.body[2].attributes[1].value.parts[0]], ['exit', ast.body[2].attributes[1].value.parts[0]], ['enter', ast.body[2].attributes[1].value.parts[1]], ['exit', ast.body[2].attributes[1].value.parts[1]], ['exit', ast.body[2].attributes[1].value], ['exit', ast.body[2].attributes[1]], ['enter', ast.body[2].attributes[2]], ['enter', ast.body[2].attributes[2].value], ['enter', ast.body[2].attributes[2].value.path], ['exit', ast.body[2].attributes[2].value.path], ['enter', ast.body[2].attributes[2].value.hash], ['exit', ast.body[2].attributes[2].value.hash], ['exit', ast.body[2].attributes[2].value], ['exit', ast.body[2].attributes[2]], ['enter', ast.body[2].program], ['enter', ast.body[2].program.body[0]], ['exit', ast.body[2].program.body[0]], ['enter', ast.body[2].program.body[1]], ['exit', ast.body[2].program.body[1]], ['exit', ast.body[2].program], ['exit', ast.body[2]], ['exit', ast]]);
    });
    test('Nested helpers', function () {
        var ast = _glimmerSyntax.parse('{{helper\n    (helper param1 param2 key1=value key2=value)\n    key1=(helper param)\n    key2=(helper key=(helper param))\n  }}');
        traversalEqual(ast, [['enter', ast], ['enter', ast.body[0]], ['enter', ast.body[0].path], ['exit', ast.body[0].path], ['enter', ast.body[0].params[0]], ['enter', ast.body[0].params[0].path], ['exit', ast.body[0].params[0].path], ['enter', ast.body[0].params[0].params[0]], ['exit', ast.body[0].params[0].params[0]], ['enter', ast.body[0].params[0].params[1]], ['exit', ast.body[0].params[0].params[1]], ['enter', ast.body[0].params[0].hash], ['enter', ast.body[0].params[0].hash.pairs[0]], ['enter', ast.body[0].params[0].hash.pairs[0].value], ['exit', ast.body[0].params[0].hash.pairs[0].value], ['exit', ast.body[0].params[0].hash.pairs[0]], ['enter', ast.body[0].params[0].hash.pairs[1]], ['enter', ast.body[0].params[0].hash.pairs[1].value], ['exit', ast.body[0].params[0].hash.pairs[1].value], ['exit', ast.body[0].params[0].hash.pairs[1]], ['exit', ast.body[0].params[0].hash], ['exit', ast.body[0].params[0]], ['enter', ast.body[0].hash], ['enter', ast.body[0].hash.pairs[0]], ['enter', ast.body[0].hash.pairs[0].value], ['enter', ast.body[0].hash.pairs[0].value.path], ['exit', ast.body[0].hash.pairs[0].value.path], ['enter', ast.body[0].hash.pairs[0].value.params[0]], ['exit', ast.body[0].hash.pairs[0].value.params[0]], ['enter', ast.body[0].hash.pairs[0].value.hash], ['exit', ast.body[0].hash.pairs[0].value.hash], ['exit', ast.body[0].hash.pairs[0].value], ['exit', ast.body[0].hash.pairs[0]], ['enter', ast.body[0].hash.pairs[1]], ['enter', ast.body[0].hash.pairs[1].value], ['enter', ast.body[0].hash.pairs[1].value.path], ['exit', ast.body[0].hash.pairs[1].value.path], ['enter', ast.body[0].hash.pairs[1].value.hash], ['enter', ast.body[0].hash.pairs[1].value.hash.pairs[0]], ['enter', ast.body[0].hash.pairs[1].value.hash.pairs[0].value], ['enter', ast.body[0].hash.pairs[1].value.hash.pairs[0].value.path], ['exit', ast.body[0].hash.pairs[1].value.hash.pairs[0].value.path], ['enter', ast.body[0].hash.pairs[1].value.hash.pairs[0].value.params[0]], ['exit', ast.body[0].hash.pairs[1].value.hash.pairs[0].value.params[0]], ['enter', ast.body[0].hash.pairs[1].value.hash.pairs[0].value.hash], ['exit', ast.body[0].hash.pairs[1].value.hash.pairs[0].value.hash], ['exit', ast.body[0].hash.pairs[1].value.hash.pairs[0].value], ['exit', ast.body[0].hash.pairs[1].value.hash.pairs[0]], ['exit', ast.body[0].hash.pairs[1].value.hash], ['exit', ast.body[0].hash.pairs[1].value], ['exit', ast.body[0].hash.pairs[1]], ['exit', ast.body[0].hash], ['exit', ast.body[0]], ['exit', ast]]);
    });
    test('Comments', function () {
        var ast = _glimmerSyntax.parse('<!-- HTML comment -->{{!-- Handlebars comment --}}');
        traversalEqual(ast, [['enter', ast], ['enter', ast.body[0]], ['exit', ast.body[0]],
        // TODO: Ensure Handlebars comments are in the AST.
        // ['enter', ast.body[1]],
        // ['exit',  ast.body[1]],
        ['exit', ast]]);
    });
});

enifed('glimmer-syntax/tests/traversal/walker-node-test', ['exports', 'glimmer-syntax'], function (exports, _glimmerSyntax) {
    'use strict';

    function compareWalkedNodes(html, expected) {
        var ast = _glimmerSyntax.parse(html);
        var walker = new _glimmerSyntax.Walker();
        var nodes = [];
        walker.visit(ast, function (node) {
            nodes.push(node.type);
        });
        deepEqual(nodes, expected);
    }
    QUnit.module('[glimmer-syntax] (Legacy) Traversal - Walker');
    test('walks elements', function () {
        compareWalkedNodes('<div><li></li></div>', ['Program', 'ElementNode', 'ElementNode']);
    });
    test('walks blocks', function () {
        compareWalkedNodes('{{#foo}}<li></li>{{/foo}}', ['Program', 'BlockStatement', 'Program', 'ElementNode']);
    });
    test('walks components', function () {
        compareWalkedNodes('<my-foo><li></li></my-foo>', ['Program', 'ComponentNode', 'Program', 'ElementNode']);
    });
});

enifed("glimmer-test-helpers/tests/main-test", ["exports"], function (exports) {
  "use strict";
});

enifed("glimmer-util/tests/htmlbars-util-test", ["exports", "glimmer-util"], function (exports, _glimmerUtil) {
    "use strict";

    QUnit.module('glimmer-util');
    test("SafeString is exported", function () {
        ok(typeof _glimmerUtil.SafeString === 'function', 'SafeString is exported');
    });
});
//# sourceMappingURL=tests.map