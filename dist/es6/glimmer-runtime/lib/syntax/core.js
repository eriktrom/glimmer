import Syntax, { AttributeSyntax, ExpressionSyntax, StatementSyntax, PrettyPrint } from '../syntax';
import { Opcode } from '../opcodes';
import { PutValue } from '../compiled/opcodes/vm';
import { OpenComponentOpcode } from '../compiled/opcodes/component';
import { CompiledArgs, CompiledNamedArgs, CompiledPositionalArgs } from '../compiled/expressions/args';
import CompiledValue from '../compiled/expressions/value';
import { CompiledLocalRef, CompiledSelfRef } from '../compiled/expressions/ref';
import CompiledHelper from '../compiled/expressions/helper';
import CompiledConcat from '../compiled/expressions/concat';
import { PushPullReference } from 'glimmer-reference';
import { LinkedList, dict, intern } from 'glimmer-util';
import { TextOpcode, OpenPrimitiveElementOpcode, CloseElementOpcode, StaticAttrOpcode, DynamicAttrOpcode, DynamicPropOpcode, AddClassOpcode, CommentOpcode } from '../compiled/opcodes/dom';
import { AppendOpcode, TrustingAppendOpcode } from '../compiled/opcodes/content';
const EMPTY_ARRAY = Object.freeze([]);
export class Block extends StatementSyntax {
    constructor(options) {
        super();
        this.type = "block";
        this.path = options.path;
        this.args = options.args;
        this.templates = options.templates;
    }
    static fromSpec(sexp, children) {
        let [, path, params, hash, templateId, inverseId] = sexp;
        return new Block({
            path,
            args: Args.fromSpec(params, hash),
            templates: Templates.fromSpec(null, [templateId, inverseId, children])
        });
    }
    static build(options) {
        return new this(options);
    }
    compile(ops) {
        throw new Error("SyntaxError");
    }
    prettyPrint() {
        return null;
        // let [params, hash] = this.args.prettyPrint();
        // let block = new PrettyPrint('expr', this.path.join('.'), params, hash);
        // return new PrettyPrint('block', 'block', [block], null, this.templates.prettyPrint());
    }
}
export class Unknown extends ExpressionSyntax {
    constructor(options) {
        super();
        this.type = "unknown";
        this.ref = options.ref;
        this.trustingMorph = !!options.unsafe;
    }
    static fromSpec(sexp) {
        let [, path, unsafe] = sexp;
        return new Unknown({ ref: new Ref({ parts: path }), unsafe });
    }
    static build(path, unsafe) {
        return new this({ ref: Ref.build(path), unsafe });
    }
    compile(compiler) {
        let { ref } = this;
        if (compiler.env.hasHelper(ref.parts)) {
            return new CompiledHelper({ helper: compiler.env.lookupHelper(ref.parts), args: CompiledArgs.empty() });
        }
        else {
            return this.ref.compile(compiler);
        }
    }
    simplePath() {
        return this.ref.simplePath();
    }
}
export class Append extends StatementSyntax {
    constructor({ value, trustingMorph }) {
        super();
        this.type = "append";
        this.value = value;
        this.trustingMorph = trustingMorph;
    }
    static fromSpec(sexp) {
        let [, value, trustingMorph] = sexp;
        return new Append({ value: buildExpression(value), trustingMorph });
    }
    static build(value, trustingMorph) {
        return new this({ value, trustingMorph });
    }
    prettyPrint() {
        let operation = this.trustingMorph ? 'html' : 'text';
        return new PrettyPrint('append', operation, [this.value.prettyPrint()]);
    }
    compile(compiler) {
        compiler.append(new PutValue(this.value.compile(compiler)));
        if (this.trustingMorph) {
            compiler.append(new TrustingAppendOpcode());
        }
        else {
            compiler.append(new AppendOpcode());
        }
    }
}
class HelperInvocationReference extends PushPullReference {
    constructor(helper, args) {
        super();
        this.helper = helper;
        this.args = args;
    }
    get() {
        throw new Error("Unimplemented: Yielding the result of a helper call.");
    }
    value() {
        let { args: { positional, named } } = this;
        return this.helper.call(undefined, positional.value(), named.value(), null);
    }
}
export class DynamicProp extends AttributeSyntax {
    constructor(options) {
        super();
        this["e1185d30-7cac-4b12-b26a-35327d905d92"] = true;
        this.type = "dynamic-prop";
        this.name = options.name;
        this.value = options.value;
    }
    static fromSpec(sexp) {
        let [, name, value] = sexp;
        return new DynamicProp({
            name,
            value: buildExpression(value)
        });
    }
    static build(name, value) {
        return new this({ name: intern(name), value });
    }
    prettyPrint() {
        let { name, value } = this;
        return new PrettyPrint('attr', 'prop', [name, value.prettyPrint()]);
    }
    compile(compiler) {
        compiler.append(new PutValue(this.value.compile(compiler)));
        compiler.append(new DynamicPropOpcode(this));
    }
    valueSyntax() {
        return this.value;
    }
    toLookup() {
        let symbol = intern(`@${this.name}`);
        let lookup = GetNamedParameter.build(symbol);
        return { syntax: DynamicProp.build(this.name, lookup), symbol };
    }
}
export class StaticAttr extends AttributeSyntax {
    constructor(options) {
        super();
        this["e1185d30-7cac-4b12-b26a-35327d905d92"] = true;
        this.type = "static-attr";
        this.name = options.name;
        this.value = options.value;
        this.namespace = options.namespace;
    }
    static fromSpec(node) {
        let [, name, value, namespace] = node;
        return new StaticAttr({ name, value, namespace });
    }
    static build(name, value, namespace = null) {
        return new this({ name: intern(name), value: intern(value), namespace: namespace && intern(namespace) });
    }
    prettyPrint() {
        let { name, value, namespace } = this;
        if (namespace) {
            return new PrettyPrint('attr', 'attr', [name, value], { namespace });
        }
        else {
            return new PrettyPrint('attr', 'attr', [name, value]);
        }
    }
    compile(compiler) {
        compiler.append(new StaticAttrOpcode(this));
    }
    valueSyntax() {
        return Value.build(this.value);
    }
    toLookup() {
        let symbol = intern(`@${this.name}`);
        let lookup = GetNamedParameter.build(symbol);
        return { syntax: DynamicAttr.build(this.name, lookup, this.namespace), symbol };
    }
}
export class DynamicAttr extends AttributeSyntax {
    constructor(options) {
        super();
        this["e1185d30-7cac-4b12-b26a-35327d905d92"] = true;
        this.type = "dynamic-attr";
        this.name = options.name;
        this.value = options.value;
        this.namespace = options.namespace;
    }
    static fromSpec(sexp) {
        let [, name, value, namespace] = sexp;
        return new DynamicAttr({
            name,
            namespace,
            value: buildExpression(value)
        });
    }
    static build(_name, value, _namespace = null) {
        let name = intern(_name);
        let namespace = _namespace ? intern(_namespace) : null;
        return new this({ name, value, namespace });
    }
    prettyPrint() {
        let { name, value, namespace } = this;
        if (namespace) {
            return new PrettyPrint('attr', 'attr', [name, value.prettyPrint()], { namespace });
        }
        else {
            return new PrettyPrint('attr', 'attr', [name, value.prettyPrint()]);
        }
    }
    compile(compiler) {
        compiler.append(new PutValue(this.value.compile(compiler)));
        compiler.append(new DynamicAttrOpcode(this));
    }
    valueSyntax() {
        return this.value;
    }
    toLookup() {
        let symbol = intern(`@${this.name}`);
        let lookup = GetNamedParameter.build(symbol);
        return { syntax: DynamicAttr.build(this.name, lookup, this.namespace), symbol };
    }
}
export class AddClass extends AttributeSyntax {
    constructor({ value }) {
        super();
        this["e1185d30-7cac-4b12-b26a-35327d905d92"] = true;
        this.type = "add-class";
        this.name = "class";
        this.value = value;
    }
    static fromSpec(node) {
        let [, value] = node;
        return new AddClass({ value: buildExpression(value) });
    }
    static build(value) {
        return new this({ value });
    }
    prettyPrint() {
        return new PrettyPrint('attr', 'attr', ['class', this.value.prettyPrint()]);
    }
    compile(compiler) {
        compiler.append(new PutValue(this.value.compile(compiler)));
        compiler.append(new AddClassOpcode());
    }
    valueSyntax() {
        return this.value;
    }
    toLookup() {
        let symbol = intern(`@${this.name}`);
        let lookup = GetNamedParameter.build(name);
        return { syntax: AddClass.build(lookup), symbol };
    }
}
export class CloseElement extends StatementSyntax {
    constructor(...args) {
        super(...args);
        this.type = "close-element";
    }
    static fromSpec() {
        return new CloseElement();
    }
    static build() {
        return new this();
    }
    prettyPrint() {
        return new PrettyPrint('element', 'close-element');
    }
    compile(compiler) {
        compiler.append(new CloseElementOpcode());
    }
}
export class Text extends StatementSyntax {
    constructor(options) {
        super();
        this.type = "text";
        this.content = options.content;
    }
    static fromSpec(node) {
        let [, content] = node;
        return new Text({ content });
    }
    static build(content) {
        return new this({ content });
    }
    prettyPrint() {
        return new PrettyPrint('append', 'text', [this.content]);
    }
    compile(compiler) {
        compiler.append(new TextOpcode(this.content));
    }
}
export class Comment extends StatementSyntax {
    constructor(options) {
        super();
        this.type = "comment";
        this.value = options.value;
    }
    static fromSpec(sexp) {
        let [, value] = sexp;
        return new Comment({ value });
    }
    static build(value) {
        return new this({ value: intern(value) });
    }
    prettyPrint() {
        return new PrettyPrint('append', 'append-comment', [this.value]);
    }
    compile(compiler) {
        compiler.append(new CommentOpcode(this));
    }
}
export class OpenElement extends StatementSyntax {
    constructor(options) {
        super();
        this.type = "open-element";
        this.tag = options.tag;
        this.blockParams = options.blockParams;
    }
    static fromSpec(sexp) {
        let [, tag, blockParams] = sexp;
        return new OpenElement({ tag, blockParams });
    }
    static build(tag, blockParams) {
        return new this({ tag: intern(tag), blockParams: blockParams && blockParams.map(intern) });
    }
    prettyPrint() {
        let params = new PrettyPrint('block-params', 'as', this.blockParams);
        return new PrettyPrint('element', 'open-element', [this.tag, params]);
    }
    compile(compiler, env) {
        let component = env.getComponentDefinition([this.tag], this);
        if (component) {
            let attrs = compiler.sliceAttributes();
            let namedArgs = Args.fromHash(attributesToNamedArgs(attrs));
            let lookup = attributeInvocationToLookup(attrs, namedArgs);
            let template = compiler.templateFromTagContents();
            let templates = new Templates({ template, inverse: null });
            compiler.append(new OpenComponentOpcode(component.compile(lookup, templates), namedArgs.compile(compiler)));
        }
        else {
            compiler.append(new OpenPrimitiveElementOpcode(this.tag));
        }
    }
    toIdentity() {
        let { tag } = this;
        return new OpenPrimitiveElement({ tag });
    }
}
function attributesToNamedArgs(attrs) {
    let map = dict();
    attrs.forEachNode(a => {
        map[`@${a.name}`] = a.valueSyntax();
    });
    return NamedArgs.build(map);
}
function attributeInvocationToLookup(attrs, namedArgs) {
    let builder = new LinkedList();
    let symbols = dict();
    attrs.forEachNode(a => {
        let { syntax, symbol } = a.toLookup();
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
export class OpenPrimitiveElement extends StatementSyntax {
    constructor(options) {
        super();
        this.type = "open-primitive-element";
        this.tag = options.tag;
    }
    static build(tag) {
        return new this({ tag: intern(tag) });
    }
    prettyPrint() {
        return new PrettyPrint('element', 'open-element', [this.tag]);
    }
    compile(compiler) {
        compiler.append(new OpenPrimitiveElementOpcode(this.tag));
    }
}
export class YieldSyntax extends StatementSyntax {
    constructor({ args }) {
        super();
        this.type = "yield";
        this.isStatic = false;
        this.args = args;
    }
    compile(compiler) {
        compiler.append(new InvokeBlockOpcode());
    }
}
class InvokeBlockOpcode extends Opcode {
    constructor(...args) {
        super(...args);
        this.type = "invoke-block";
    }
    evaluate(vm) {
        vm.invokeTemplate('default');
    }
}
export class Value extends ExpressionSyntax {
    constructor(value) {
        super();
        this.type = "value";
        this.value = value;
    }
    static fromSpec(value) {
        return new Value(value);
    }
    static build(value) {
        return new this(value);
    }
    prettyPrint() {
        return String(this.value);
    }
    inner() {
        return this.value;
    }
    compile(compiler) {
        return new CompiledValue(this);
    }
}
export class Get extends ExpressionSyntax {
    constructor(options) {
        super();
        this.type = "get";
        this.ref = options.ref;
    }
    static fromSpec(sexp) {
        let [, parts] = sexp;
        return new Get({ ref: new Ref({ parts }) });
    }
    static build(path) {
        return new this({ ref: Ref.build(path) });
    }
    prettyPrint() {
        return new PrettyPrint('expr', 'get', [this.ref.prettyPrint()], null);
    }
    compile(compiler) {
        return this.ref.compile(compiler);
    }
}
export class GetNamedParameter extends ExpressionSyntax {
    constructor(options) {
        super();
        this.type = "get";
        this.parts = options.parts;
    }
    static fromSpec(sexp) {
        let [, parts] = sexp;
        return new GetNamedParameter({ parts });
    }
    static build(path) {
        return new this({ parts: path.split('.').map(intern) });
    }
    prettyPrint() {
        return new PrettyPrint('expr', 'get-named', [this.parts.join('.')], null);
    }
    compile(compiler) {
        let { parts } = this;
        let front = parts[0];
        let symbol = compiler.getSymbol(front);
        let lookup = parts.slice(1);
        return new CompiledLocalRef({ symbol, lookup });
    }
}
// intern paths because they will be used as keys
function internPath(path) {
    return path.split('.').map(intern);
}
// this is separated out from Get because Unknown also has a ref, but it
// may turn out to be a helper
class Ref extends ExpressionSyntax {
    constructor({ parts }) {
        super();
        this.type = "ref";
        this.parts = parts;
    }
    static build(path) {
        return new this({ parts: internPath(path) });
    }
    prettyPrint() {
        return this.parts.join('.');
    }
    compile(compiler) {
        let { parts } = this;
        let front = parts[0];
        let symbol = compiler.getSymbol(front);
        if (symbol) {
            let lookup = parts.slice(1);
            return new CompiledLocalRef({ symbol, lookup });
        }
        else {
            return new CompiledSelfRef({ parts });
        }
    }
    path() {
        return this.parts;
    }
    simplePath() {
        if (this.parts.length === 1) {
            return this.parts[0];
        }
    }
}
export class Helper extends ExpressionSyntax {
    constructor(options) {
        super();
        this.type = "helper";
        this.isStatic = false;
        this.ref = options.ref;
        this.args = options.args;
    }
    static fromSpec(sexp) {
        let [, path, params, hash] = sexp;
        return new Helper({
            ref: new Ref({ parts: path }),
            args: Args.fromSpec(params, hash)
        });
    }
    static build(path, positional, named) {
        return new this({ ref: Ref.build(path), args: new Args({ positional, named }) });
    }
    prettyPrint() {
        let [params, hash] = this.args.prettyPrint();
        return new PrettyPrint('expr', this.ref.prettyPrint(), params, hash);
    }
    compile(compiler) {
        if (compiler.env.hasHelper(this.ref.parts)) {
            let { args, ref } = this;
            return new CompiledHelper({ helper: compiler.env.lookupHelper(ref.parts), args: args.compile(compiler) });
        }
        else {
            throw new Error(`Compile Error: ${this.ref.prettyPrint()} is not a helper`);
        }
    }
    simplePath() {
        return this.ref.simplePath();
    }
}
export class Concat extends Syntax {
    constructor({ parts }) {
        super();
        this.type = "concat";
        this.isStatic = false;
        this.parts = parts;
    }
    static fromSpec(sexp) {
        let [, params] = sexp;
        return new Concat({ parts: params.map(buildExpression) });
    }
    static build(parts) {
        return new this({ parts });
    }
    prettyPrint() {
        return new PrettyPrint('expr', 'concat', this.parts.map(p => p.prettyPrint()));
    }
    compile(compiler) {
        return new CompiledConcat({ parts: this.parts.map(p => p.compile(compiler)) });
    }
}
const ExpressionNodes = {
    get: Get,
    attr: GetNamedParameter,
    unknown: Unknown,
    helper: Helper,
    concat: Concat
};
function buildExpression(spec) {
    if (typeof spec !== 'object' || spec === null) {
        return Value.fromSpec(spec);
    }
    else {
        return ExpressionNodes[spec[0]].fromSpec(spec);
    }
}
export class Args extends Syntax {
    constructor(options) {
        super();
        this.type = "args";
        this.isStatic = false;
        this.positional = options.positional;
        this.named = options.named;
    }
    static fromSpec(positional, named) {
        return new Args({ positional: PositionalArgs.fromSpec(positional), named: NamedArgs.fromSpec(named) });
    }
    static empty() {
        return (this._empty = this._empty || new Args({ positional: PositionalArgs.empty(), named: NamedArgs.empty() }));
    }
    static fromPositionalArgs(positional) {
        return new Args({ positional, named: NamedArgs.empty() });
    }
    static fromHash(named) {
        return new Args({ positional: PositionalArgs.empty(), named });
    }
    static build(positional, named) {
        return new this({ positional, named });
    }
    prettyPrint() {
        // return [this.positional.prettyPrint(), this.named.prettyPrint()];
        return null;
    }
    compile(compiler) {
        let { positional, named } = this;
        return CompiledArgs.create({ positional: positional.compile(compiler), named: named.compile(compiler) });
    }
}
export class PositionalArgs extends Syntax {
    constructor(exprs) {
        super();
        this.type = "positional";
        this.isStatic = false;
        this.values = exprs;
        this.length = exprs.length;
    }
    static fromSpec(sexp) {
        if (!sexp || sexp.length === 0)
            return PositionalArgs.empty();
        return new PositionalArgs(sexp.map(buildExpression));
    }
    static build(exprs) {
        return new this(exprs);
    }
    static empty() {
        return (this._empty = this._empty || new PositionalArgs([]));
    }
    push(expr) {
        this.values.push(expr);
        this.length = this.values.length;
    }
    at(index) {
        return this.values[index];
    }
    compile(compiler) {
        return CompiledPositionalArgs.create({ values: this.values.map(v => v.compile(compiler)) });
    }
    prettyPrint() {
        return this.values.map(p => p.prettyPrint());
    }
}
export class NamedArgs extends Syntax {
    constructor({ keys, values, map }) {
        super();
        this.type = "named";
        this.isStatic = false;
        this.keys = keys;
        this.values = values;
        this.map = map;
    }
    static fromSpec(rawPairs) {
        if (!rawPairs) {
            return NamedArgs.empty();
        }
        let keys = [];
        let values = [];
        let map = dict();
        for (let i = 0, l = rawPairs.length; i < l; i += 2) {
            let key = rawPairs[i];
            let expr = rawPairs[i + 1];
            keys.push(key);
            let value = buildExpression(expr);
            values.push(value);
            map[key] = value;
        }
        return new NamedArgs({ keys, values, map });
    }
    static build(map) {
        if (map === undefined) {
            return NamedArgs.empty();
        }
        let keys = [];
        let values = [];
        Object.keys(map).forEach(key => {
            keys.push(key);
            values.push(map[key]);
        });
        return new this({ keys, values, map });
    }
    static empty() {
        return (this._empty = this._empty || new NamedArgs({ keys: EMPTY_ARRAY, values: EMPTY_ARRAY, map: dict() }));
    }
    prettyPrint() {
        let out = dict();
        this.keys.forEach((key, i) => {
            out[key] = this.values[i].prettyPrint();
        });
        return JSON.stringify(out);
    }
    add(key, value) {
        this.keys.push(key);
        this.values.push(value);
        this.map[key] = value;
    }
    at(key) {
        return this.map[key];
    }
    has(key) {
        return !!this.map[key];
    }
    compile(compiler) {
        let { keys, values: rawValues } = this;
        let values = rawValues.map(v => v.compile(compiler));
        return CompiledNamedArgs.create({ keys, values });
    }
}
export class Templates extends Syntax {
    constructor(options) {
        super();
        this.type = "templates";
        this.default = options.template;
        this.inverse = options.inverse;
    }
    static fromSpec(_, [templateId, inverseId, children]) {
        return new Templates({
            template: templateId === null ? null : children[templateId],
            inverse: inverseId === null ? null : children[inverseId],
        });
    }
    static build(template, inverse = null, attributes = null) {
        return new this({ template, inverse });
    }
    prettyPrint() {
        let { default: _default, inverse } = this;
        return JSON.stringify({
            default: _default && _default.position,
            inverse: inverse && inverse.position
        });
    }
    evaluate(vm) {
        throw new Error("unimplemented evaluate for ExpressionSyntax");
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdsaW1tZXItcnVudGltZS9saWIvc3ludGF4L2NvcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BS08sTUFBTSxFQUFFLEVBQ2IsZUFBZSxFQUNmLGdCQUFnQixFQUNoQixlQUFlLEVBRWYsV0FBVyxFQUNaLE1BQU0sV0FBVztPQUVYLEVBQ0wsTUFBTSxFQUNQLE1BQU0sWUFBWTtPQUVaLEVBQ0wsUUFBUSxFQUNULE1BQU0sd0JBQXdCO09BRXhCLEVBQ0wsbUJBQW1CLEVBQ3BCLE1BQU0sK0JBQStCO09BTS9CLEVBQ0wsWUFBWSxFQUNaLGlCQUFpQixFQUNqQixzQkFBc0IsRUFFdkIsTUFBTSw4QkFBOEI7T0FFOUIsYUFBYSxNQUFNLCtCQUErQjtPQUVsRCxFQUNMLGdCQUFnQixFQUNoQixlQUFlLEVBQ2hCLE1BQU0sNkJBQTZCO09BRTdCLGNBQWMsTUFBTSxnQ0FBZ0M7T0FFcEQsY0FBYyxNQUFNLGdDQUFnQztPQU1wRCxFQUNMLGlCQUFpQixFQUVsQixNQUFNLG1CQUFtQjtPQUluQixFQUNMLFVBQVUsRUFJVixJQUFJLEVBQ0osTUFBTSxFQUNQLE1BQU0sY0FBYztPQUVkLEVBQ0wsVUFBVSxFQUNWLDBCQUEwQixFQUMxQixrQkFBa0IsRUFDbEIsZ0JBQWdCLEVBQ2hCLGlCQUFpQixFQUNqQixpQkFBaUIsRUFDakIsY0FBYyxFQUNkLGFBQWEsRUFDZCxNQUFNLHlCQUF5QjtPQUV6QixFQUNMLFlBQVksRUFDWixvQkFBb0IsRUFDckIsTUFBTSw2QkFBNkI7QUFZcEMsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztBQWF0QywyQkFBMkIsZUFBZTtJQXFCeEMsWUFBWSxPQUFxRTtRQUMvRSxPQUFPLENBQUM7UUFyQkgsU0FBSSxHQUFHLE9BQU8sQ0FBQztRQXNCcEIsSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQ3pC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TUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQVdELFdBQVc7UUFDVCxJQUFJLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFFMUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDcEIsT0FBTyxFQUFFLFFBQVEsSUFBSSxRQUFRLENBQUMsUUFBUTtZQUN0QyxPQUFPLEVBQUUsT0FBTyxJQUFJLE9BQU8sQ0FBQyxRQUFRO1NBQ3JDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxRQUFRLENBQUMsRUFBTTtRQUNiLE1BQU0sSUFBSSxLQUFLLENBQUMsNkNBQTZDLENBQUMsQ0FBQztJQUNqRSxDQUFDO0FBQ0gsQ0FBQztBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVk0gfSBmcm9tICcuLi92bSc7XG5pbXBvcnQgQ29tcGlsZXIgZnJvbSAnLi4vY29tcGlsZXInO1xuXG5pbXBvcnQgVGVtcGxhdGUgZnJvbSAnLi4vdGVtcGxhdGUnO1xuXG5pbXBvcnQgU3ludGF4LCB7XG4gIEF0dHJpYnV0ZVN5bnRheCxcbiAgRXhwcmVzc2lvblN5bnRheCxcbiAgU3RhdGVtZW50U3ludGF4LFxuICBQcmV0dHlQcmludFZhbHVlLFxuICBQcmV0dHlQcmludFxufSBmcm9tICcuLi9zeW50YXgnO1xuXG5pbXBvcnQge1xuICBPcGNvZGVcbn0gZnJvbSAnLi4vb3Bjb2Rlcyc7XG5cbmltcG9ydCB7XG4gIFB1dFZhbHVlXG59IGZyb20gJy4uL2NvbXBpbGVkL29wY29kZXMvdm0nO1xuXG5pbXBvcnQge1xuICBPcGVuQ29tcG9uZW50T3Bjb2RlXG59IGZyb20gJy4uL2NvbXBpbGVkL29wY29kZXMvY29tcG9uZW50JztcblxuaW1wb3J0IHtcbiAgQ29tcGlsZUNvbXBvbmVudE9wdGlvbnNcbn0gZnJvbSAnLi4vY29tcG9uZW50L2ludGVyZmFjZXMnO1xuXG5pbXBvcnQge1xuICBDb21waWxlZEFyZ3MsXG4gIENvbXBpbGVkTmFtZWRBcmdzLFxuICBDb21waWxlZFBvc2l0aW9uYWxBcmdzLFxuICBFdmFsdWF0ZWRBcmdzXG59IGZyb20gJy4uL2NvbXBpbGVkL2V4cHJlc3Npb25zL2FyZ3MnO1xuXG5pbXBvcnQgQ29tcGlsZWRWYWx1ZSBmcm9tICcuLi9jb21waWxlZC9leHByZXNzaW9ucy92YWx1ZSc7XG5cbmltcG9ydCB7XG4gIENvbXBpbGVkTG9jYWxSZWYsXG4gIENvbXBpbGVkU2VsZlJlZlxufSBmcm9tICcuLi9jb21waWxlZC9leHByZXNzaW9ucy9yZWYnO1xuXG5pbXBvcnQgQ29tcGlsZWRIZWxwZXIgZnJvbSAnLi4vY29tcGlsZWQvZXhwcmVzc2lvbnMvaGVscGVyJztcblxuaW1wb3J0IENvbXBpbGVkQ29uY2F0IGZyb20gJy4uL2NvbXBpbGVkL2V4cHJlc3Npb25zL2NvbmNhdCc7XG5cbmltcG9ydCB7XG4gIENvbXBpbGVkRXhwcmVzc2lvblxufSBmcm9tICcuLi9jb21waWxlZC9leHByZXNzaW9ucyc7XG5cbmltcG9ydCB7XG4gIFB1c2hQdWxsUmVmZXJlbmNlLFxuICBQYXRoUmVmZXJlbmNlXG59IGZyb20gJ2dsaW1tZXItcmVmZXJlbmNlJztcblxuaW1wb3J0IHsgRW52aXJvbm1lbnQsIEluc2VydGlvbiwgSGVscGVyIGFzIEVudkhlbHBlciB9IGZyb20gJy4uL2Vudmlyb25tZW50JztcblxuaW1wb3J0IHtcbiAgTGlua2VkTGlzdCxcbiAgSW50ZXJuZWRTdHJpbmcsXG4gIFNsaWNlLFxuICBEaWN0LFxuICBkaWN0LFxuICBpbnRlcm4sXG59IGZyb20gJ2dsaW1tZXItdXRpbCc7XG5cbmltcG9ydCB7XG4gIFRleHRPcGNvZGUsXG4gIE9wZW5QcmltaXRpdmVFbGVtZW50T3Bjb2RlLFxuICBDbG9zZUVsZW1lbnRPcGNvZGUsXG4gIFN0YXRpY0F0dHJPcGNvZGUsXG4gIER5bmFtaWNBdHRyT3Bjb2RlLFxuICBEeW5hbWljUHJvcE9wY29kZSxcbiAgQWRkQ2xhc3NPcGNvZGUsXG4gIENvbW1lbnRPcGNvZGVcbn0gZnJvbSAnLi4vY29tcGlsZWQvb3Bjb2Rlcy9kb20nO1xuXG5pbXBvcnQge1xuICBBcHBlbmRPcGNvZGUsXG4gIFRydXN0aW5nQXBwZW5kT3Bjb2RlXG59IGZyb20gJy4uL2NvbXBpbGVkL29wY29kZXMvY29udGVudCc7XG5cbmludGVyZmFjZSBCb3VuZHMge1xuICBwYXJlbnROb2RlKCk6IE5vZGU7XG4gIGZpcnN0Tm9kZSgpOiBOb2RlO1xuICBsYXN0Tm9kZSgpOiBOb2RlO1xufVxuXG5pbnRlcmZhY2UgUmVmZXJlbmNlIHt9XG5cbnR5cGUgU3BlYyA9IGFueVtdO1xuXG5jb25zdCBFTVBUWV9BUlJBWSA9IE9iamVjdC5mcmVlemUoW10pO1xuXG50eXBlIFBhdGhTZXhwID0gSW50ZXJuZWRTdHJpbmdbXTtcbnR5cGUgRXhwcmVzc2lvblNleHAgPSBhbnlbXTtcbnR5cGUgUG9zaXRpb25hbEFyZ3NTZXhwID0gRXhwcmVzc2lvblNleHBbXTtcbnR5cGUgTmFtZWRBcmdzU2V4cCA9IGFueVtdO1xuXG50eXBlIEJsb2NrU2V4cCA9IFtJbnRlcm5lZFN0cmluZywgUGF0aFNleHAsIFBvc2l0aW9uYWxBcmdzU2V4cCwgTmFtZWRBcmdzU2V4cCwgbnVtYmVyLCBudW1iZXJdO1xuXG5leHBvcnQgaW50ZXJmYWNlIEJsb2NrT3B0aW9ucyB7XG5cbn1cblxuZXhwb3J0IGNsYXNzIEJsb2NrIGV4dGVuZHMgU3RhdGVtZW50U3ludGF4IHtcbiAgcHVibGljIHR5cGUgPSBcImJsb2NrXCI7XG5cbiAgc3RhdGljIGZyb21TcGVjKHNleHA6IEJsb2NrU2V4cCwgY2hpbGRyZW46IFRlbXBsYXRlW10pOiBCbG9jayB7XG4gICAgbGV0IFssIHBhdGgsIHBhcmFtcywgaGFzaCwgdGVtcGxhdGVJZCwgaW52ZXJzZUlkXSA9IHNleHA7XG5cbiAgICByZXR1cm4gbmV3IEJsb2NrKHtcbiAgICAgIHBhdGgsXG4gICAgICBhcmdzOiBBcmdzLmZyb21TcGVjKHBhcmFtcywgaGFzaCksXG4gICAgICB0ZW1wbGF0ZXM6IFRlbXBsYXRlcy5mcm9tU3BlYyhudWxsLCBbdGVtcGxhdGVJZCwgaW52ZXJzZUlkLCBjaGlsZHJlbl0pXG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgYnVpbGQob3B0aW9ucyk6IEJsb2NrIHtcbiAgICByZXR1cm4gbmV3IHRoaXMob3B0aW9ucyk7XG4gIH1cblxuICBwYXRoOiBJbnRlcm5lZFN0cmluZ1tdO1xuICBhcmdzOiBBcmdzO1xuICB0ZW1wbGF0ZXM6IFRlbXBsYXRlcztcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiB7IHBhdGg6IEludGVybmVkU3RyaW5nW10sIGFyZ3M6IEFyZ3MsIHRlbXBsYXRlczogVGVtcGxhdGVzIH0pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMucGF0aCA9IG9wdGlvbnMucGF0aDtcbiAgICB0aGlzLmFyZ3MgPSBvcHRpb25zLmFyZ3M7XG4gICAgdGhpcy50ZW1wbGF0ZXMgPSBvcHRpb25zLnRlbXBsYXRlcztcbiAgfVxuXG4gIGNvbXBpbGUob3BzOiBDb21waWxlcikge1xuICAgIHRocm93IG5ldyBFcnJvcihcIlN5bnRheEVycm9yXCIpO1xuICB9XG5cbiAgcHJldHR5UHJpbnQoKSB7XG4gICAgcmV0dXJuIG51bGw7XG5cbiAgICAvLyBsZXQgW3BhcmFtcywgaGFzaF0gPSB0aGlzLmFyZ3MucHJldHR5UHJpbnQoKTtcbiAgICAvLyBsZXQgYmxvY2sgPSBuZXcgUHJldHR5UHJpbnQoJ2V4cHInLCB0aGlzLnBhdGguam9pbignLicpLCBwYXJhbXMsIGhhc2gpO1xuICAgIC8vIHJldHVybiBuZXcgUHJldHR5UHJpbnQoJ2Jsb2NrJywgJ2Jsb2NrJywgW2Jsb2NrXSwgbnVsbCwgdGhpcy50ZW1wbGF0ZXMucHJldHR5UHJpbnQoKSk7XG4gIH1cbn1cblxudHlwZSBVbmtub3duU2V4cCA9IFtzdHJpbmcsIFBhdGhTZXhwLCBib29sZWFuXTtcblxuZXhwb3J0IGNsYXNzIFVua25vd24gZXh0ZW5kcyBFeHByZXNzaW9uU3ludGF4IHtcbiAgcHVibGljIHR5cGUgPSBcInVua25vd25cIjtcblxuICBzdGF0aWMgZnJvbVNwZWMoc2V4cDogVW5rbm93blNleHApOiBVbmtub3duIHtcbiAgICBsZXQgWywgcGF0aCwgdW5zYWZlXSA9IHNleHA7XG5cbiAgICByZXR1cm4gbmV3IFVua25vd24oeyByZWY6IG5ldyBSZWYoeyBwYXJ0czogcGF0aCB9KSwgdW5zYWZlIH0pO1xuICB9XG5cbiAgc3RhdGljIGJ1aWxkKHBhdGg6IHN0cmluZywgdW5zYWZlOiBib29sZWFuKTogVW5rbm93biB7XG4gICAgcmV0dXJuIG5ldyB0aGlzKHsgcmVmOiBSZWYuYnVpbGQocGF0aCksIHVuc2FmZSB9KTtcbiAgfVxuXG4gIHJlZjogUmVmO1xuICB0cnVzdGluZ01vcnBoOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMucmVmID0gb3B0aW9ucy5yZWY7XG4gICAgdGhpcy50cnVzdGluZ01vcnBoID0gISFvcHRpb25zLnVuc2FmZTtcbiAgfVxuXG4gIGNvbXBpbGUoY29tcGlsZXI6IENvbXBpbGVyKTogQ29tcGlsZWRFeHByZXNzaW9uIHtcbiAgICBsZXQgeyByZWYgfSA9IHRoaXM7XG5cbiAgICBpZiAoY29tcGlsZXIuZW52Lmhhc0hlbHBlcihyZWYucGFydHMpKSB7XG4gICAgICByZXR1cm4gbmV3IENvbXBpbGVkSGVscGVyKHsgaGVscGVyOiBjb21waWxlci5lbnYubG9va3VwSGVscGVyKHJlZi5wYXJ0cyksIGFyZ3M6IENvbXBpbGVkQXJncy5lbXB0eSgpIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWYuY29tcGlsZShjb21waWxlcik7XG4gICAgfVxuICB9XG5cbiAgc2ltcGxlUGF0aCgpOiBJbnRlcm5lZFN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMucmVmLnNpbXBsZVBhdGgoKTtcbiAgfVxufVxuXG50eXBlIEFwcGVuZFNleHAgPSBbSW50ZXJuZWRTdHJpbmcsIEV4cHJlc3Npb25TZXhwLCBib29sZWFuXTtcblxuZXhwb3J0IGNsYXNzIEFwcGVuZCBleHRlbmRzIFN0YXRlbWVudFN5bnRheCB7XG4gIHB1YmxpYyB0eXBlID0gXCJhcHBlbmRcIjtcblxuICBzdGF0aWMgZnJvbVNwZWMoc2V4cDogQXBwZW5kU2V4cCkge1xuICAgIGxldCBbLCB2YWx1ZSwgdHJ1c3RpbmdNb3JwaF0gPSBzZXhwO1xuXG4gICAgcmV0dXJuIG5ldyBBcHBlbmQoeyB2YWx1ZTogYnVpbGRFeHByZXNzaW9uKHZhbHVlKSwgdHJ1c3RpbmdNb3JwaCB9KTtcbiAgfVxuXG4gIHN0YXRpYyBidWlsZCh2YWx1ZTogRXhwcmVzc2lvblN5bnRheCwgdHJ1c3RpbmdNb3JwaDogYm9vbGVhbikge1xuICAgIHJldHVybiBuZXcgdGhpcyh7IHZhbHVlLCB0cnVzdGluZ01vcnBoIH0pO1xuICB9XG5cbiAgdmFsdWU6IEV4cHJlc3Npb25TeW50YXg7XG4gIHRydXN0aW5nTW9ycGg6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IoeyB2YWx1ZSwgdHJ1c3RpbmdNb3JwaCB9OiB7IHZhbHVlOiBFeHByZXNzaW9uU3ludGF4LCB0cnVzdGluZ01vcnBoOiBib29sZWFuIH0pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLnRydXN0aW5nTW9ycGggPSB0cnVzdGluZ01vcnBoO1xuICB9XG5cbiAgcHJldHR5UHJpbnQoKTogUHJldHR5UHJpbnQge1xuICAgIGxldCBvcGVyYXRpb24gPSB0aGlzLnRydXN0aW5nTW9ycGggPyAnaHRtbCcgOiAndGV4dCc7XG4gICAgcmV0dXJuIG5ldyBQcmV0dHlQcmludCgnYXBwZW5kJywgb3BlcmF0aW9uLCBbdGhpcy52YWx1ZS5wcmV0dHlQcmludCgpXSk7XG4gIH1cblxuICBjb21waWxlKGNvbXBpbGVyOiBDb21waWxlcikge1xuICAgIGNvbXBpbGVyLmFwcGVuZChuZXcgUHV0VmFsdWUodGhpcy52YWx1ZS5jb21waWxlKGNvbXBpbGVyKSkpO1xuXG4gICAgaWYgKHRoaXMudHJ1c3RpbmdNb3JwaCkge1xuICAgICAgY29tcGlsZXIuYXBwZW5kKG5ldyBUcnVzdGluZ0FwcGVuZE9wY29kZSgpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29tcGlsZXIuYXBwZW5kKG5ldyBBcHBlbmRPcGNvZGUoKSk7XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIEhlbHBlckludm9jYXRpb25SZWZlcmVuY2UgZXh0ZW5kcyBQdXNoUHVsbFJlZmVyZW5jZSBpbXBsZW1lbnRzIFBhdGhSZWZlcmVuY2Uge1xuICBwcml2YXRlIGhlbHBlcjogRW52SGVscGVyO1xuICBwcml2YXRlIGFyZ3M6IEV2YWx1YXRlZEFyZ3M7XG5cbiAgY29uc3RydWN0b3IoaGVscGVyOiBFbnZIZWxwZXIsIGFyZ3M6IEV2YWx1YXRlZEFyZ3MpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuaGVscGVyID0gaGVscGVyO1xuICAgIHRoaXMuYXJncyA9IGFyZ3M7XG4gIH1cblxuICBnZXQoKTogUGF0aFJlZmVyZW5jZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVW5pbXBsZW1lbnRlZDogWWllbGRpbmcgdGhlIHJlc3VsdCBvZiBhIGhlbHBlciBjYWxsLlwiKTtcbiAgfVxuXG4gIHZhbHVlKCk6IEluc2VydGlvbiB7XG4gICAgbGV0IHsgYXJnczogeyBwb3NpdGlvbmFsLCBuYW1lZCB9IH0gID0gdGhpcztcbiAgICByZXR1cm4gdGhpcy5oZWxwZXIuY2FsbCh1bmRlZmluZWQsIHBvc2l0aW9uYWwudmFsdWUoKSwgbmFtZWQudmFsdWUoKSwgbnVsbCk7XG4gIH1cbn1cblxuLypcbmV4cG9ydCBjbGFzcyBNb2RpZmllciBpbXBsZW1lbnRzIFN0YXRlbWVudFN5bnRheCB7XG4gIHN0YXRpYyBmcm9tU3BlYyhub2RlKSB7XG4gICAgbGV0IFssIHBhdGgsIHBhcmFtcywgaGFzaF0gPSBub2RlO1xuXG4gICAgcmV0dXJuIG5ldyBNb2RpZmllcih7XG4gICAgICBwYXRoLFxuICAgICAgcGFyYW1zOiBQYXJhbXMuZnJvbVNwZWMocGFyYW1zKSxcbiAgICAgIGhhc2g6IEhhc2guZnJvbVNwZWMoaGFzaClcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBidWlsZChwYXRoLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIG5ldyBNb2RpZmllcih7XG4gICAgICBwYXRoLFxuICAgICAgcGFyYW1zOiBvcHRpb25zLnBhcmFtcyxcbiAgICAgIGhhc2g6IG9wdGlvbnMuaGFzaFxuICAgIH0pO1xuICB9XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHRoaXMucGF0aCA9IG9wdGlvbnMucGF0aDtcbiAgICB0aGlzLnBhcmFtcyA9IG9wdGlvbnMucGFyYW1zO1xuICAgIHRoaXMuaGFzaCA9IG9wdGlvbnMuaGFzaDtcbiAgfVxuXG4gIGV2YWx1YXRlKHN0YWNrKSB7XG4gICAgcmV0dXJuIHN0YWNrLmNyZWF0ZU1vcnBoKE1vZGlmaWVyKTtcbiAgfVxufVxuKi9cblxudHlwZSBEeW5hbWljUHJvcFNleHAgPSBbSW50ZXJuZWRTdHJpbmcsIEludGVybmVkU3RyaW5nLCBFeHByZXNzaW9uU2V4cCwgSW50ZXJuZWRTdHJpbmddO1xuXG5leHBvcnQgY2xhc3MgRHluYW1pY1Byb3AgZXh0ZW5kcyBBdHRyaWJ1dGVTeW50YXgge1xuICBcImUxMTg1ZDMwLTdjYWMtNGIxMi1iMjZhLTM1MzI3ZDkwNWQ5MlwiID0gdHJ1ZTtcbiAgdHlwZSA9IFwiZHluYW1pYy1wcm9wXCI7XG5cbiAgc3RhdGljIGZyb21TcGVjKHNleHA6IER5bmFtaWNQcm9wU2V4cCk6IER5bmFtaWNQcm9wIHtcbiAgICBsZXQgWywgbmFtZSwgdmFsdWVdID0gc2V4cDtcblxuICAgIHJldHVybiBuZXcgRHluYW1pY1Byb3Aoe1xuICAgICAgbmFtZSxcbiAgICAgIHZhbHVlOiBidWlsZEV4cHJlc3Npb24odmFsdWUpXG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgYnVpbGQobmFtZTogc3RyaW5nLCB2YWx1ZTogYW55KTogRHluYW1pY1Byb3Age1xuICAgIHJldHVybiBuZXcgdGhpcyh7IG5hbWU6IGludGVybihuYW1lKSwgdmFsdWUgfSk7XG4gIH1cblxuICBwdWJsaWMgbmFtZTogSW50ZXJuZWRTdHJpbmc7XG4gIHB1YmxpYyB2YWx1ZTogRXhwcmVzc2lvblN5bnRheDtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiB7IG5hbWU6IEludGVybmVkU3RyaW5nLCB2YWx1ZTogRXhwcmVzc2lvblN5bnRheCB9KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLm5hbWUgPSBvcHRpb25zLm5hbWU7XG4gICAgdGhpcy52YWx1ZSA9IG9wdGlvbnMudmFsdWU7XG4gIH1cblxuICBwcmV0dHlQcmludCgpIHtcbiAgICBsZXQgeyBuYW1lLCB2YWx1ZSB9ID0gdGhpcztcblxuICAgIHJldHVybiBuZXcgUHJldHR5UHJpbnQoJ2F0dHInLCAncHJvcCcsIFtuYW1lLCB2YWx1ZS5wcmV0dHlQcmludCgpXSk7XG4gIH1cblxuICBjb21waWxlKGNvbXBpbGVyOiBDb21waWxlcikge1xuICAgIGNvbXBpbGVyLmFwcGVuZChuZXcgUHV0VmFsdWUodGhpcy52YWx1ZS5jb21waWxlKGNvbXBpbGVyKSkpO1xuICAgIGNvbXBpbGVyLmFwcGVuZChuZXcgRHluYW1pY1Byb3BPcGNvZGUodGhpcykpO1xuICB9XG5cbiAgdmFsdWVTeW50YXgoKTogRXhwcmVzc2lvblN5bnRheCB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWU7XG4gIH1cblxuICB0b0xvb2t1cCgpOiB7IHN5bnRheDogRHluYW1pY1Byb3AsIHN5bWJvbDogSW50ZXJuZWRTdHJpbmcgfSB7XG4gICAgbGV0IHN5bWJvbCA9IGludGVybihgQCR7dGhpcy5uYW1lfWApO1xuICAgIGxldCBsb29rdXAgPSBHZXROYW1lZFBhcmFtZXRlci5idWlsZChzeW1ib2wpO1xuXG4gICAgcmV0dXJuIHsgc3ludGF4OiBEeW5hbWljUHJvcC5idWlsZCh0aGlzLm5hbWUsIGxvb2t1cCksIHN5bWJvbCB9O1xuICB9XG59XG5cbnR5cGUgU3RhdGljQXR0clNleHAgPSBbSW50ZXJuZWRTdHJpbmcsIEludGVybmVkU3RyaW5nLCBJbnRlcm5lZFN0cmluZywgSW50ZXJuZWRTdHJpbmddO1xuXG5leHBvcnQgY2xhc3MgU3RhdGljQXR0ciBleHRlbmRzIEF0dHJpYnV0ZVN5bnRheCB7XG4gIFwiZTExODVkMzAtN2NhYy00YjEyLWIyNmEtMzUzMjdkOTA1ZDkyXCIgPSB0cnVlO1xuICB0eXBlID0gXCJzdGF0aWMtYXR0clwiO1xuXG4gIHN0YXRpYyBmcm9tU3BlYyhub2RlOiBTdGF0aWNBdHRyU2V4cCk6IFN0YXRpY0F0dHIge1xuICAgIGxldCBbLCBuYW1lLCB2YWx1ZSwgbmFtZXNwYWNlXSA9IG5vZGU7XG5cbiAgICByZXR1cm4gbmV3IFN0YXRpY0F0dHIoeyBuYW1lLCB2YWx1ZSwgbmFtZXNwYWNlIH0pO1xuICB9XG5cbiAgc3RhdGljIGJ1aWxkKG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZywgbmFtZXNwYWNlOiBzdHJpbmc9bnVsbCk6IFN0YXRpY0F0dHIge1xuICAgIHJldHVybiBuZXcgdGhpcyh7IG5hbWU6IGludGVybihuYW1lKSwgdmFsdWU6IGludGVybih2YWx1ZSksIG5hbWVzcGFjZTogbmFtZXNwYWNlICYmIGludGVybihuYW1lc3BhY2UpIH0pO1xuICB9XG5cbiAgbmFtZTogSW50ZXJuZWRTdHJpbmc7XG4gIHZhbHVlOiBJbnRlcm5lZFN0cmluZztcbiAgbmFtZXNwYWNlOiBJbnRlcm5lZFN0cmluZztcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLm5hbWUgPSBvcHRpb25zLm5hbWU7XG4gICAgdGhpcy52YWx1ZSA9IG9wdGlvbnMudmFsdWU7XG4gICAgdGhpcy5uYW1lc3BhY2UgPSBvcHRpb25zLm5hbWVzcGFjZTtcbiAgfVxuXG4gIHByZXR0eVByaW50KCkge1xuICAgIGxldCB7IG5hbWUsIHZhbHVlLCBuYW1lc3BhY2UgfSA9IHRoaXM7XG5cbiAgICBpZiAobmFtZXNwYWNlKSB7XG4gICAgICByZXR1cm4gbmV3IFByZXR0eVByaW50KCdhdHRyJywgJ2F0dHInLCBbbmFtZSwgdmFsdWVdLCB7IG5hbWVzcGFjZSB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5ldyBQcmV0dHlQcmludCgnYXR0cicsICdhdHRyJywgW25hbWUsIHZhbHVlXSk7XG4gICAgfVxuICB9XG5cbiAgY29tcGlsZShjb21waWxlcjogQ29tcGlsZXIpIHtcbiAgICBjb21waWxlci5hcHBlbmQobmV3IFN0YXRpY0F0dHJPcGNvZGUodGhpcykpO1xuICB9XG5cbiAgdmFsdWVTeW50YXgoKTogRXhwcmVzc2lvblN5bnRheCB7XG4gICAgcmV0dXJuIFZhbHVlLmJ1aWxkKHRoaXMudmFsdWUpO1xuICB9XG5cbiAgdG9Mb29rdXAoKTogeyBzeW50YXg6IER5bmFtaWNBdHRyLCBzeW1ib2w6IEludGVybmVkU3RyaW5nIH0ge1xuICAgIGxldCBzeW1ib2wgPSBpbnRlcm4oYEAke3RoaXMubmFtZX1gKTtcbiAgICBsZXQgbG9va3VwID0gR2V0TmFtZWRQYXJhbWV0ZXIuYnVpbGQoc3ltYm9sKTtcblxuICAgIHJldHVybiB7IHN5bnRheDogRHluYW1pY0F0dHIuYnVpbGQodGhpcy5uYW1lLCBsb29rdXAsIHRoaXMubmFtZXNwYWNlKSwgc3ltYm9sIH07XG4gIH1cbn1cblxudHlwZSBEeW5hbWljQXR0clNleHAgPSBbSW50ZXJuZWRTdHJpbmcsIEludGVybmVkU3RyaW5nLCBFeHByZXNzaW9uU2V4cCwgSW50ZXJuZWRTdHJpbmddO1xuXG5leHBvcnQgY2xhc3MgRHluYW1pY0F0dHIgZXh0ZW5kcyBBdHRyaWJ1dGVTeW50YXgge1xuICBcImUxMTg1ZDMwLTdjYWMtNGIxMi1iMjZhLTM1MzI3ZDkwNWQ5MlwiID0gdHJ1ZTtcbiAgdHlwZSA9IFwiZHluYW1pYy1hdHRyXCI7XG5cbiAgc3RhdGljIGZyb21TcGVjKHNleHA6IER5bmFtaWNBdHRyU2V4cCk6IER5bmFtaWNBdHRyIHtcbiAgICBsZXQgWywgbmFtZSwgdmFsdWUsIG5hbWVzcGFjZV0gPSBzZXhwO1xuXG4gICAgcmV0dXJuIG5ldyBEeW5hbWljQXR0cih7XG4gICAgICBuYW1lLFxuICAgICAgbmFtZXNwYWNlLFxuICAgICAgdmFsdWU6IGJ1aWxkRXhwcmVzc2lvbih2YWx1ZSlcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBidWlsZChfbmFtZTogc3RyaW5nLCB2YWx1ZTogRXhwcmVzc2lvblN5bnRheCwgX25hbWVzcGFjZTogc3RyaW5nPW51bGwpOiBEeW5hbWljQXR0ciB7XG4gICAgbGV0IG5hbWUgPSBpbnRlcm4oX25hbWUpO1xuICAgIGxldCBuYW1lc3BhY2UgPSBfbmFtZXNwYWNlID8gaW50ZXJuKF9uYW1lc3BhY2UpIDogbnVsbDtcbiAgICByZXR1cm4gbmV3IHRoaXMoeyBuYW1lLCB2YWx1ZSwgbmFtZXNwYWNlIH0pO1xuICB9XG5cbiAgbmFtZTogSW50ZXJuZWRTdHJpbmc7XG4gIHZhbHVlOiBFeHByZXNzaW9uU3ludGF4O1xuICBuYW1lc3BhY2U6IEludGVybmVkU3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IHsgbmFtZTogSW50ZXJuZWRTdHJpbmcsIHZhbHVlOiBFeHByZXNzaW9uU3ludGF4LCBuYW1lc3BhY2U6IEludGVybmVkU3RyaW5nIH0pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMubmFtZSA9IG9wdGlvbnMubmFtZTtcbiAgICB0aGlzLnZhbHVlID0gb3B0aW9ucy52YWx1ZTtcbiAgICB0aGlzLm5hbWVzcGFjZSA9IG9wdGlvbnMubmFtZXNwYWNlO1xuICB9XG5cbiAgcHJldHR5UHJpbnQoKSB7XG4gICAgbGV0IHsgbmFtZSwgdmFsdWUsIG5hbWVzcGFjZSB9ID0gdGhpcztcblxuICAgIGlmIChuYW1lc3BhY2UpIHtcbiAgICAgIHJldHVybiBuZXcgUHJldHR5UHJpbnQoJ2F0dHInLCAnYXR0cicsIFtuYW1lLCB2YWx1ZS5wcmV0dHlQcmludCgpXSwgeyBuYW1lc3BhY2UgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuZXcgUHJldHR5UHJpbnQoJ2F0dHInLCAnYXR0cicsIFtuYW1lLCB2YWx1ZS5wcmV0dHlQcmludCgpXSk7XG4gICAgfVxuICB9XG5cbiAgY29tcGlsZShjb21waWxlcjogQ29tcGlsZXIpIHtcbiAgICBjb21waWxlci5hcHBlbmQobmV3IFB1dFZhbHVlKHRoaXMudmFsdWUuY29tcGlsZShjb21waWxlcikpKTtcbiAgICBjb21waWxlci5hcHBlbmQobmV3IER5bmFtaWNBdHRyT3Bjb2RlKHRoaXMpKTtcbiAgfVxuXG4gIHZhbHVlU3ludGF4KCk6IEV4cHJlc3Npb25TeW50YXgge1xuICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICB9XG5cbiAgdG9Mb29rdXAoKTogeyBzeW50YXg6IER5bmFtaWNBdHRyLCBzeW1ib2w6IEludGVybmVkU3RyaW5nIH0ge1xuICAgIGxldCBzeW1ib2wgPSBpbnRlcm4oYEAke3RoaXMubmFtZX1gKTtcbiAgICBsZXQgbG9va3VwID0gR2V0TmFtZWRQYXJhbWV0ZXIuYnVpbGQoc3ltYm9sKTtcblxuICAgIHJldHVybiB7IHN5bnRheDogRHluYW1pY0F0dHIuYnVpbGQodGhpcy5uYW1lLCBsb29rdXAsIHRoaXMubmFtZXNwYWNlKSwgc3ltYm9sIH07XG4gIH1cbn1cblxudHlwZSBBZGRDbGFzc1NleHByID0gW0ludGVybmVkU3RyaW5nLCBFeHByZXNzaW9uU2V4cF07XG5cbmV4cG9ydCBjbGFzcyBBZGRDbGFzcyBleHRlbmRzIEF0dHJpYnV0ZVN5bnRheCB7XG4gIFwiZTExODVkMzAtN2NhYy00YjEyLWIyNmEtMzUzMjdkOTA1ZDkyXCIgPSB0cnVlO1xuICB0eXBlID0gXCJhZGQtY2xhc3NcIjtcblxuICBzdGF0aWMgZnJvbVNwZWMobm9kZTogQWRkQ2xhc3NTZXhwcik6IEFkZENsYXNzIHtcbiAgICBsZXQgWywgdmFsdWVdID0gbm9kZTtcblxuICAgIHJldHVybiBuZXcgQWRkQ2xhc3MoeyB2YWx1ZTogYnVpbGRFeHByZXNzaW9uKHZhbHVlKSB9KTtcbiAgfVxuXG4gIHN0YXRpYyBidWlsZCh2YWx1ZTogRXhwcmVzc2lvblN5bnRheCk6IEFkZENsYXNzIHtcbiAgICByZXR1cm4gbmV3IHRoaXMoeyB2YWx1ZSB9KTtcbiAgfVxuXG4gIHB1YmxpYyBuYW1lID0gPEludGVybmVkU3RyaW5nPlwiY2xhc3NcIjtcbiAgcHVibGljIHZhbHVlOiBFeHByZXNzaW9uU3ludGF4O1xuXG4gIGNvbnN0cnVjdG9yKHsgdmFsdWUgfTogeyB2YWx1ZTogRXhwcmVzc2lvblN5bnRheCB9KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gIH1cblxuICBwcmV0dHlQcmludCgpOiBQcmV0dHlQcmludCB7XG4gICAgcmV0dXJuIG5ldyBQcmV0dHlQcmludCgnYXR0cicsICdhdHRyJywgWydjbGFzcycsIHRoaXMudmFsdWUucHJldHR5UHJpbnQoKV0pO1xuICB9XG5cbiAgY29tcGlsZShjb21waWxlcjogQ29tcGlsZXIpIHtcbiAgICBjb21waWxlci5hcHBlbmQobmV3IFB1dFZhbHVlKHRoaXMudmFsdWUuY29tcGlsZShjb21waWxlcikpKTtcbiAgICBjb21waWxlci5hcHBlbmQobmV3IEFkZENsYXNzT3Bjb2RlKCkpO1xuICB9XG5cbiAgdmFsdWVTeW50YXgoKTogRXhwcmVzc2lvblN5bnRheCB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWU7XG4gIH1cblxuICB0b0xvb2t1cCgpOiB7IHN5bnRheDogQWRkQ2xhc3MsIHN5bWJvbDogSW50ZXJuZWRTdHJpbmcgfSB7XG4gICAgbGV0IHN5bWJvbCA9IGludGVybihgQCR7dGhpcy5uYW1lfWApO1xuICAgIGxldCBsb29rdXAgPSBHZXROYW1lZFBhcmFtZXRlci5idWlsZChuYW1lKTtcblxuICAgIHJldHVybiB7IHN5bnRheDogQWRkQ2xhc3MuYnVpbGQobG9va3VwKSwgc3ltYm9sIH07XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIENsb3NlRWxlbWVudCBleHRlbmRzIFN0YXRlbWVudFN5bnRheCB7XG4gIHR5cGUgPSBcImNsb3NlLWVsZW1lbnRcIjtcblxuICBzdGF0aWMgZnJvbVNwZWMoKSB7XG4gICAgcmV0dXJuIG5ldyBDbG9zZUVsZW1lbnQoKTtcbiAgfVxuXG4gIHN0YXRpYyBidWlsZCgpIHtcbiAgICByZXR1cm4gbmV3IHRoaXMoKTtcbiAgfVxuXG4gIHByZXR0eVByaW50KCkge1xuICAgIHJldHVybiBuZXcgUHJldHR5UHJpbnQoJ2VsZW1lbnQnLCAnY2xvc2UtZWxlbWVudCcpO1xuICB9XG5cbiAgY29tcGlsZShjb21waWxlcjogQ29tcGlsZXIpIHtcbiAgICBjb21waWxlci5hcHBlbmQobmV3IENsb3NlRWxlbWVudE9wY29kZSgpKTtcbiAgfVxufVxuXG50eXBlIFRleHRTZXhwID0gW0ludGVybmVkU3RyaW5nLCBJbnRlcm5lZFN0cmluZ107XG5cbmV4cG9ydCBjbGFzcyBUZXh0IGV4dGVuZHMgU3RhdGVtZW50U3ludGF4IHtcbiAgdHlwZSA9IFwidGV4dFwiO1xuXG4gIHN0YXRpYyBmcm9tU3BlYyhub2RlOiBUZXh0U2V4cCk6IFRleHQge1xuICAgIGxldCBbLCBjb250ZW50XSA9IG5vZGU7XG5cbiAgICByZXR1cm4gbmV3IFRleHQoeyBjb250ZW50IH0pO1xuICB9XG5cbiAgc3RhdGljIGJ1aWxkKGNvbnRlbnQpOiBUZXh0IHtcbiAgICByZXR1cm4gbmV3IHRoaXMoeyBjb250ZW50IH0pO1xuICB9XG5cbiAgcHVibGljIGNvbnRlbnQ6IEludGVybmVkU3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IHsgY29udGVudDogSW50ZXJuZWRTdHJpbmcgfSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5jb250ZW50ID0gb3B0aW9ucy5jb250ZW50O1xuICB9XG5cbiAgcHJldHR5UHJpbnQoKSB7XG4gICAgcmV0dXJuIG5ldyBQcmV0dHlQcmludCgnYXBwZW5kJywgJ3RleHQnLCBbdGhpcy5jb250ZW50XSk7XG4gIH1cblxuICBjb21waWxlKGNvbXBpbGVyOiBDb21waWxlcikge1xuICAgIGNvbXBpbGVyLmFwcGVuZChuZXcgVGV4dE9wY29kZSh0aGlzLmNvbnRlbnQpKTtcbiAgfVxufVxuXG50eXBlIENvbW1lbnRTZXhwID0gW0ludGVybmVkU3RyaW5nLCBJbnRlcm5lZFN0cmluZ107XG5cbmV4cG9ydCBjbGFzcyBDb21tZW50IGV4dGVuZHMgU3RhdGVtZW50U3ludGF4IHtcbiAgdHlwZSA9IFwiY29tbWVudFwiO1xuXG4gIHN0YXRpYyBmcm9tU3BlYyhzZXhwOiBDb21tZW50U2V4cCk6IENvbW1lbnQge1xuICAgIGxldCBbLCB2YWx1ZV0gPSBzZXhwO1xuXG4gICAgcmV0dXJuIG5ldyBDb21tZW50KHsgdmFsdWUgfSk7XG4gIH1cblxuICBzdGF0aWMgYnVpbGQodmFsdWU6IHN0cmluZyk6IENvbW1lbnQge1xuICAgIHJldHVybiBuZXcgdGhpcyh7IHZhbHVlOiBpbnRlcm4odmFsdWUpIH0pO1xuICB9XG5cbiAgcHVibGljIHZhbHVlOiBJbnRlcm5lZFN0cmluZztcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnZhbHVlID0gb3B0aW9ucy52YWx1ZTtcbiAgfVxuXG4gIHByZXR0eVByaW50KCkge1xuICAgIHJldHVybiBuZXcgUHJldHR5UHJpbnQoJ2FwcGVuZCcsICdhcHBlbmQtY29tbWVudCcsIFt0aGlzLnZhbHVlXSk7XG4gIH1cblxuICBjb21waWxlKGNvbXBpbGVyOiBDb21waWxlcikge1xuICAgIGNvbXBpbGVyLmFwcGVuZChuZXcgQ29tbWVudE9wY29kZSh0aGlzKSk7XG4gIH1cbn1cblxudHlwZSBPcGVuRWxlbWVudFNleHAgPSBbSW50ZXJuZWRTdHJpbmcsIEludGVybmVkU3RyaW5nLCBJbnRlcm5lZFN0cmluZ1tdXTtcblxuZXhwb3J0IGNsYXNzIE9wZW5FbGVtZW50IGV4dGVuZHMgU3RhdGVtZW50U3ludGF4IHtcbiAgdHlwZSA9IFwib3Blbi1lbGVtZW50XCI7XG5cbiAgc3RhdGljIGZyb21TcGVjKHNleHA6IE9wZW5FbGVtZW50U2V4cCk6IE9wZW5FbGVtZW50IHtcbiAgICBsZXQgWywgdGFnLCBibG9ja1BhcmFtc10gPSBzZXhwO1xuXG4gICAgcmV0dXJuIG5ldyBPcGVuRWxlbWVudCh7IHRhZywgYmxvY2tQYXJhbXMgfSk7XG4gIH1cblxuICBzdGF0aWMgYnVpbGQodGFnOiBzdHJpbmcsIGJsb2NrUGFyYW1zOiBzdHJpbmdbXSk6IE9wZW5FbGVtZW50IHtcbiAgICByZXR1cm4gbmV3IHRoaXMoeyB0YWc6IGludGVybih0YWcpLCBibG9ja1BhcmFtczogYmxvY2tQYXJhbXMgJiYgYmxvY2tQYXJhbXMubWFwKGludGVybikgfSk7XG4gIH1cblxuICBwdWJsaWMgdGFnOiBJbnRlcm5lZFN0cmluZztcbiAgcHVibGljIGJsb2NrUGFyYW1zOiBJbnRlcm5lZFN0cmluZ1tdO1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IHsgdGFnOiBJbnRlcm5lZFN0cmluZywgYmxvY2tQYXJhbXM6IEludGVybmVkU3RyaW5nW10gfSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy50YWcgPSBvcHRpb25zLnRhZztcbiAgICB0aGlzLmJsb2NrUGFyYW1zID0gb3B0aW9ucy5ibG9ja1BhcmFtcztcbiAgfVxuXG4gIHByZXR0eVByaW50KCkge1xuICAgIGxldCBwYXJhbXMgPSBuZXcgUHJldHR5UHJpbnQoJ2Jsb2NrLXBhcmFtcycsICdhcycsIHRoaXMuYmxvY2tQYXJhbXMpO1xuICAgIHJldHVybiBuZXcgUHJldHR5UHJpbnQoJ2VsZW1lbnQnLCAnb3Blbi1lbGVtZW50JywgW3RoaXMudGFnLCBwYXJhbXNdKTtcbiAgfVxuXG4gIGNvbXBpbGUoY29tcGlsZXI6IENvbXBpbGVyLCBlbnY6IEVudmlyb25tZW50KSB7XG4gICAgbGV0IGNvbXBvbmVudCA9IGVudi5nZXRDb21wb25lbnREZWZpbml0aW9uKFt0aGlzLnRhZ10sIHRoaXMpO1xuXG4gICAgaWYgKGNvbXBvbmVudCkge1xuICAgICAgbGV0IGF0dHJzID0gY29tcGlsZXIuc2xpY2VBdHRyaWJ1dGVzKCk7XG4gICAgICBsZXQgbmFtZWRBcmdzID0gQXJncy5mcm9tSGFzaChhdHRyaWJ1dGVzVG9OYW1lZEFyZ3MoYXR0cnMpKTtcbiAgICAgIGxldCBsb29rdXAgPSBhdHRyaWJ1dGVJbnZvY2F0aW9uVG9Mb29rdXAoYXR0cnMsIG5hbWVkQXJncyk7XG4gICAgICBsZXQgdGVtcGxhdGUgPSBjb21waWxlci50ZW1wbGF0ZUZyb21UYWdDb250ZW50cygpO1xuICAgICAgbGV0IHRlbXBsYXRlcyA9IG5ldyBUZW1wbGF0ZXMoeyB0ZW1wbGF0ZSwgaW52ZXJzZTogbnVsbCB9KTtcbiAgICAgIGNvbXBpbGVyLmFwcGVuZChuZXcgT3BlbkNvbXBvbmVudE9wY29kZShjb21wb25lbnQuY29tcGlsZShsb29rdXAsIHRlbXBsYXRlcyksIG5hbWVkQXJncy5jb21waWxlKGNvbXBpbGVyKSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb21waWxlci5hcHBlbmQobmV3IE9wZW5QcmltaXRpdmVFbGVtZW50T3Bjb2RlKHRoaXMudGFnKSk7XG4gICAgfVxuICB9XG5cbiAgdG9JZGVudGl0eSgpOiBPcGVuUHJpbWl0aXZlRWxlbWVudCB7XG4gICAgbGV0IHsgdGFnIH0gPSB0aGlzO1xuICAgIHJldHVybiBuZXcgT3BlblByaW1pdGl2ZUVsZW1lbnQoeyB0YWcgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gYXR0cmlidXRlc1RvTmFtZWRBcmdzKGF0dHJzOiBTbGljZTxBdHRyaWJ1dGVTeW50YXg+KTogTmFtZWRBcmdzIHtcbiAgbGV0IG1hcCA9IGRpY3Q8RXhwcmVzc2lvblN5bnRheD4oKTtcblxuICBhdHRycy5mb3JFYWNoTm9kZShhID0+IHtcbiAgICBtYXBbYEAke2EubmFtZX1gXSA9IGEudmFsdWVTeW50YXgoKTtcbiAgfSk7XG5cbiAgcmV0dXJuIE5hbWVkQXJncy5idWlsZChtYXApO1xufVxuXG5mdW5jdGlvbiBhdHRyaWJ1dGVJbnZvY2F0aW9uVG9Mb29rdXAoYXR0cnM6IFNsaWNlPEF0dHJpYnV0ZVN5bnRheD4sIG5hbWVkQXJnczogQXJncyk6IENvbXBpbGVDb21wb25lbnRPcHRpb25zIHtcbiAgbGV0IGJ1aWxkZXIgPSBuZXcgTGlua2VkTGlzdDxBdHRyaWJ1dGVTeW50YXg+KCk7XG4gIGxldCBzeW1ib2xzID0gZGljdDxib29sZWFuPigpO1xuXG4gIGF0dHJzLmZvckVhY2hOb2RlKGEgPT4ge1xuICAgIGxldCB7IHN5bnRheCwgc3ltYm9sIH0gPSBhLnRvTG9va3VwKCk7XG4gICAgYnVpbGRlci5hcHBlbmQoc3ludGF4KTtcbiAgICBzeW1ib2xzWzxzdHJpbmc+c3ltYm9sXSA9IHRydWU7XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgYXJnczogbmFtZWRBcmdzLFxuICAgIHN5bnRheDogYnVpbGRlcixcbiAgICBsb2NhbHM6IG51bGwsXG4gICAgbmFtZWQ6IDxJbnRlcm5lZFN0cmluZ1tdPk9iamVjdC5rZXlzKHN5bWJvbHMpXG4gIH07XG59XG5cbmV4cG9ydCBjbGFzcyBPcGVuUHJpbWl0aXZlRWxlbWVudCBleHRlbmRzIFN0YXRlbWVudFN5bnRheCB7XG4gIHR5cGUgPSBcIm9wZW4tcHJpbWl0aXZlLWVsZW1lbnRcIjtcblxuICBwdWJsaWMgdGFnOiBJbnRlcm5lZFN0cmluZztcblxuICBzdGF0aWMgYnVpbGQodGFnOiBzdHJpbmcpOiBPcGVuUHJpbWl0aXZlRWxlbWVudCB7XG4gICAgcmV0dXJuIG5ldyB0aGlzKHsgdGFnOiBpbnRlcm4odGFnKSB9KTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IHsgdGFnOiBJbnRlcm5lZFN0cmluZyB9KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnRhZyA9IG9wdGlvbnMudGFnO1xuICB9XG5cbiAgcHJldHR5UHJpbnQoKSB7XG4gICAgcmV0dXJuIG5ldyBQcmV0dHlQcmludCgnZWxlbWVudCcsICdvcGVuLWVsZW1lbnQnLCBbdGhpcy50YWddKTtcbiAgfVxuXG4gIGNvbXBpbGUoY29tcGlsZXI6IENvbXBpbGVyKSB7XG4gICAgY29tcGlsZXIuYXBwZW5kKG5ldyBPcGVuUHJpbWl0aXZlRWxlbWVudE9wY29kZSh0aGlzLnRhZykpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBZaWVsZFN5bnRheCBleHRlbmRzIFN0YXRlbWVudFN5bnRheCB7XG4gIHR5cGUgPSBcInlpZWxkXCI7XG4gIGlzU3RhdGljID0gZmFsc2U7XG4gIHB1YmxpYyBhcmdzOiBBcmdzO1xuXG4gIGNvbnN0cnVjdG9yKHsgYXJncyB9OiB7IGFyZ3M6IEFyZ3MgfSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5hcmdzID0gYXJncztcbiAgfVxuXG4gIGNvbXBpbGUoY29tcGlsZXI6IENvbXBpbGVyKSB7XG4gICAgY29tcGlsZXIuYXBwZW5kKG5ldyBJbnZva2VCbG9ja09wY29kZSgpKTtcbiAgfVxufVxuXG5jbGFzcyBJbnZva2VCbG9ja09wY29kZSBleHRlbmRzIE9wY29kZSB7XG4gIHR5cGUgPSBcImludm9rZS1ibG9ja1wiO1xuXG4gIGV2YWx1YXRlKHZtOiBWTSkge1xuICAgIHZtLmludm9rZVRlbXBsYXRlKDxJbnRlcm5lZFN0cmluZz4nZGVmYXVsdCcpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBWYWx1ZSBleHRlbmRzIEV4cHJlc3Npb25TeW50YXgge1xuICB0eXBlID0gXCJ2YWx1ZVwiO1xuXG4gIHN0YXRpYyBmcm9tU3BlYyh2YWx1ZSk6IFZhbHVlIHtcbiAgICByZXR1cm4gbmV3IFZhbHVlKHZhbHVlKTtcbiAgfVxuXG4gIHN0YXRpYyBidWlsZCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgdGhpcyh2YWx1ZSk7XG4gIH1cblxuICBwdWJsaWMgdmFsdWU6IGJvb2xlYW4gfCBzdHJpbmcgfCBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IodmFsdWUpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgfVxuXG4gIHByZXR0eVByaW50KCkge1xuICAgIHJldHVybiBTdHJpbmcodGhpcy52YWx1ZSk7XG4gIH1cblxuICBpbm5lcigpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgfVxuXG4gIGNvbXBpbGUoY29tcGlsZXI6IENvbXBpbGVyKTogQ29tcGlsZWRFeHByZXNzaW9uIHtcbiAgICByZXR1cm4gbmV3IENvbXBpbGVkVmFsdWUodGhpcyk7XG4gIH1cbn1cblxudHlwZSBQYXRoID0gSW50ZXJuZWRTdHJpbmdbXTtcbnR5cGUgR2V0U2V4cCA9IFtJbnRlcm5lZFN0cmluZywgUGF0aF07XG5cbmV4cG9ydCBjbGFzcyBHZXQgZXh0ZW5kcyBFeHByZXNzaW9uU3ludGF4IHtcbiAgdHlwZSA9IFwiZ2V0XCI7XG5cbiAgc3RhdGljIGZyb21TcGVjKHNleHA6IEdldFNleHApOiBHZXQge1xuICAgIGxldCBbLCBwYXJ0c10gPSBzZXhwO1xuXG4gICAgcmV0dXJuIG5ldyBHZXQoeyByZWY6IG5ldyBSZWYoeyBwYXJ0cyB9KSB9KTtcbiAgfVxuXG4gIHN0YXRpYyBidWlsZChwYXRoOiBzdHJpbmcpOiBHZXQge1xuICAgIHJldHVybiBuZXcgdGhpcyh7IHJlZjogUmVmLmJ1aWxkKHBhdGgpIH0pO1xuICB9XG5cbiAgcHVibGljIHJlZjogUmVmO1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMucmVmID0gb3B0aW9ucy5yZWY7XG4gIH1cblxuICBwcmV0dHlQcmludCgpIHtcbiAgICByZXR1cm4gbmV3IFByZXR0eVByaW50KCdleHByJywgJ2dldCcsIFt0aGlzLnJlZi5wcmV0dHlQcmludCgpXSwgbnVsbCk7XG4gIH1cblxuICBjb21waWxlKGNvbXBpbGVyOiBDb21waWxlcik6IENvbXBpbGVkRXhwcmVzc2lvbiB7XG4gICAgcmV0dXJuIHRoaXMucmVmLmNvbXBpbGUoY29tcGlsZXIpO1xuICB9XG59XG5cbnR5cGUgR2V0TmFtZWRQYXJhbWV0ZXJTZXhwID0gW0ludGVybmVkU3RyaW5nLCBQYXRoXTtcblxuZXhwb3J0IGNsYXNzIEdldE5hbWVkUGFyYW1ldGVyIGV4dGVuZHMgRXhwcmVzc2lvblN5bnRheCB7XG4gIHR5cGUgPSBcImdldFwiO1xuXG4gIHN0YXRpYyBmcm9tU3BlYyhzZXhwOiBHZXROYW1lZFBhcmFtZXRlclNleHApOiBHZXROYW1lZFBhcmFtZXRlciB7XG4gICAgbGV0IFssIHBhcnRzXSA9IHNleHA7XG5cbiAgICByZXR1cm4gbmV3IEdldE5hbWVkUGFyYW1ldGVyKHsgcGFydHMgfSk7XG4gIH1cblxuICBzdGF0aWMgYnVpbGQocGF0aDogc3RyaW5nKTogR2V0TmFtZWRQYXJhbWV0ZXIge1xuICAgIHJldHVybiBuZXcgdGhpcyh7IHBhcnRzOiBwYXRoLnNwbGl0KCcuJykubWFwKGludGVybikgfSk7XG4gIH1cblxuICBwdWJsaWMgcGFydHM6IEludGVybmVkU3RyaW5nW107XG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogeyBwYXJ0czogSW50ZXJuZWRTdHJpbmdbXSB9KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnBhcnRzID0gb3B0aW9ucy5wYXJ0cztcbiAgfVxuXG4gIHByZXR0eVByaW50KCkge1xuICAgIHJldHVybiBuZXcgUHJldHR5UHJpbnQoJ2V4cHInLCAnZ2V0LW5hbWVkJywgW3RoaXMucGFydHMuam9pbignLicpXSwgbnVsbCk7XG4gIH1cblxuICBjb21waWxlKGNvbXBpbGVyOiBDb21waWxlcik6IENvbXBpbGVkRXhwcmVzc2lvbiB7XG4gICAgbGV0IHsgcGFydHMgfSA9IHRoaXM7XG4gICAgbGV0IGZyb250ID0gcGFydHNbMF07XG4gICAgbGV0IHN5bWJvbCA9IGNvbXBpbGVyLmdldFN5bWJvbChmcm9udCk7XG5cbiAgICBsZXQgbG9va3VwID0gcGFydHMuc2xpY2UoMSk7XG4gICAgcmV0dXJuIG5ldyBDb21waWxlZExvY2FsUmVmKHsgc3ltYm9sLCBsb29rdXAgfSk7XG4gIH1cbn1cblxuLy8gaW50ZXJuIHBhdGhzIGJlY2F1c2UgdGhleSB3aWxsIGJlIHVzZWQgYXMga2V5c1xuZnVuY3Rpb24gaW50ZXJuUGF0aChwYXRoOiBzdHJpbmcpOiBJbnRlcm5lZFN0cmluZ1tdIHtcbiAgcmV0dXJuIHBhdGguc3BsaXQoJy4nKS5tYXAoaW50ZXJuKTtcbn1cblxuLy8gdGhpcyBpcyBzZXBhcmF0ZWQgb3V0IGZyb20gR2V0IGJlY2F1c2UgVW5rbm93biBhbHNvIGhhcyBhIHJlZiwgYnV0IGl0XG4vLyBtYXkgdHVybiBvdXQgdG8gYmUgYSBoZWxwZXJcbmNsYXNzIFJlZiBleHRlbmRzIEV4cHJlc3Npb25TeW50YXgge1xuICB0eXBlID0gXCJyZWZcIjtcblxuICBzdGF0aWMgYnVpbGQocGF0aDogc3RyaW5nKTogUmVmIHtcbiAgICByZXR1cm4gbmV3IHRoaXMoeyBwYXJ0czogaW50ZXJuUGF0aChwYXRoKSB9KTtcbiAgfVxuXG4gIHB1YmxpYyBwYXJ0czogSW50ZXJuZWRTdHJpbmdbXTtcblxuICBjb25zdHJ1Y3Rvcih7IHBhcnRzIH06IHsgcGFydHM6IEludGVybmVkU3RyaW5nW10gfSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5wYXJ0cyA9IHBhcnRzO1xuICB9XG5cbiAgcHJldHR5UHJpbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFydHMuam9pbignLicpO1xuICB9XG5cbiAgY29tcGlsZShjb21waWxlcjogQ29tcGlsZXIpOiBDb21waWxlZEV4cHJlc3Npb24ge1xuICAgIGxldCB7IHBhcnRzIH0gPSB0aGlzO1xuICAgIGxldCBmcm9udCA9IHBhcnRzWzBdO1xuICAgIGxldCBzeW1ib2wgPSBjb21waWxlci5nZXRTeW1ib2woZnJvbnQpO1xuXG4gICAgaWYgKHN5bWJvbCkge1xuICAgICAgbGV0IGxvb2t1cCA9IHBhcnRzLnNsaWNlKDEpO1xuICAgICAgcmV0dXJuIG5ldyBDb21waWxlZExvY2FsUmVmKHsgc3ltYm9sLCBsb29rdXAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuZXcgQ29tcGlsZWRTZWxmUmVmKHsgcGFydHMgfSk7XG4gICAgfVxuICB9XG5cbiAgcGF0aCgpOiBJbnRlcm5lZFN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5wYXJ0cztcbiAgfVxuXG4gIHNpbXBsZVBhdGgoKTogSW50ZXJuZWRTdHJpbmcge1xuICAgIGlmICh0aGlzLnBhcnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcmV0dXJuIHRoaXMucGFydHNbMF07XG4gICAgfVxuICB9XG59XG5cbnR5cGUgSGVscGVyU2V4cCA9IFtzdHJpbmcsIFBhdGhTZXhwLCBQb3NpdGlvbmFsQXJnc1NleHAsIE5hbWVkQXJnc1NleHBdO1xuXG5leHBvcnQgY2xhc3MgSGVscGVyIGV4dGVuZHMgRXhwcmVzc2lvblN5bnRheCB7XG4gIHR5cGUgPSBcImhlbHBlclwiO1xuXG4gIHN0YXRpYyBmcm9tU3BlYyhzZXhwOiBIZWxwZXJTZXhwKTogSGVscGVyIHtcbiAgICBsZXQgWywgcGF0aCwgcGFyYW1zLCBoYXNoXSA9IHNleHA7XG5cbiAgICByZXR1cm4gbmV3IEhlbHBlcih7XG4gICAgICByZWY6IG5ldyBSZWYoeyBwYXJ0czogcGF0aCB9KSxcbiAgICAgIGFyZ3M6IEFyZ3MuZnJvbVNwZWMocGFyYW1zLCBoYXNoKVxuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIGJ1aWxkKHBhdGg6IHN0cmluZywgcG9zaXRpb25hbDogUG9zaXRpb25hbEFyZ3MsIG5hbWVkOiBOYW1lZEFyZ3MpOiBIZWxwZXIge1xuICAgIHJldHVybiBuZXcgdGhpcyh7IHJlZjogUmVmLmJ1aWxkKHBhdGgpLCBhcmdzOiBuZXcgQXJncyh7IHBvc2l0aW9uYWwsIG5hbWVkIH0pIH0pO1xuICB9XG5cbiAgaXNTdGF0aWMgPSBmYWxzZTtcbiAgcmVmOiBSZWY7XG4gIGFyZ3M6IEFyZ3M7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogeyByZWY6IFJlZiwgYXJnczogQXJncyB9KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnJlZiA9IG9wdGlvbnMucmVmO1xuICAgIHRoaXMuYXJncyA9IG9wdGlvbnMuYXJncztcbiAgfVxuXG4gIHByZXR0eVByaW50KCkge1xuICAgIGxldCBbcGFyYW1zLCBoYXNoXSA9IHRoaXMuYXJncy5wcmV0dHlQcmludCgpO1xuICAgIHJldHVybiBuZXcgUHJldHR5UHJpbnQoJ2V4cHInLCB0aGlzLnJlZi5wcmV0dHlQcmludCgpLCBwYXJhbXMsIGhhc2gpO1xuICB9XG5cbiAgY29tcGlsZShjb21waWxlcjogQ29tcGlsZXIpOiBDb21waWxlZEV4cHJlc3Npb24ge1xuICAgIGlmIChjb21waWxlci5lbnYuaGFzSGVscGVyKHRoaXMucmVmLnBhcnRzKSkge1xuICAgICAgbGV0IHsgYXJncywgcmVmIH0gPSB0aGlzO1xuICAgICAgcmV0dXJuIG5ldyBDb21waWxlZEhlbHBlcih7IGhlbHBlcjogY29tcGlsZXIuZW52Lmxvb2t1cEhlbHBlcihyZWYucGFydHMpLCBhcmdzOiBhcmdzLmNvbXBpbGUoY29tcGlsZXIpIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENvbXBpbGUgRXJyb3I6ICR7dGhpcy5yZWYucHJldHR5UHJpbnQoKX0gaXMgbm90IGEgaGVscGVyYCk7XG4gICAgfVxuICB9XG5cbiAgc2ltcGxlUGF0aCgpOiBJbnRlcm5lZFN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMucmVmLnNpbXBsZVBhdGgoKTtcbiAgfVxufVxuXG50eXBlIENvbmNhdFNleHAgPSBbc3RyaW5nLCBQb3NpdGlvbmFsQXJnc1NleHBdO1xuXG5leHBvcnQgY2xhc3MgQ29uY2F0IGV4dGVuZHMgU3ludGF4PENvbmNhdD4ge1xuICB0eXBlID0gXCJjb25jYXRcIjtcblxuICBzdGF0aWMgZnJvbVNwZWMoc2V4cDogQ29uY2F0U2V4cCk6IENvbmNhdCB7XG4gICAgbGV0IFssIHBhcmFtc10gPSBzZXhwO1xuXG4gICAgcmV0dXJuIG5ldyBDb25jYXQoeyBwYXJ0czogcGFyYW1zLm1hcChidWlsZEV4cHJlc3Npb24pIH0pO1xuICB9XG5cbiAgc3RhdGljIGJ1aWxkKHBhcnRzKTogQ29uY2F0IHtcbiAgICByZXR1cm4gbmV3IHRoaXMoeyBwYXJ0cyB9KTtcbiAgfVxuXG4gIGlzU3RhdGljID0gZmFsc2U7XG4gIHBhcnRzOiBFeHByZXNzaW9uU3ludGF4W107XG5cbiAgY29uc3RydWN0b3IoeyBwYXJ0cyB9OiB7IHBhcnRzOiBFeHByZXNzaW9uU3ludGF4W10gfSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5wYXJ0cyA9IHBhcnRzO1xuICB9XG5cbiAgcHJldHR5UHJpbnQoKSB7XG4gICAgcmV0dXJuIG5ldyBQcmV0dHlQcmludCgnZXhwcicsICdjb25jYXQnLCB0aGlzLnBhcnRzLm1hcChwID0+IHAucHJldHR5UHJpbnQoKSkpO1xuICB9XG5cbiAgY29tcGlsZShjb21waWxlcjogQ29tcGlsZXIpOiBDb21waWxlZENvbmNhdCB7XG4gICAgcmV0dXJuIG5ldyBDb21waWxlZENvbmNhdCh7IHBhcnRzOiB0aGlzLnBhcnRzLm1hcChwID0+IHAuY29tcGlsZShjb21waWxlcikpIH0pO1xuICB9XG59XG5cbmNvbnN0IEV4cHJlc3Npb25Ob2RlcyA9IHtcbiAgZ2V0OiBHZXQsXG4gIGF0dHI6IEdldE5hbWVkUGFyYW1ldGVyLFxuICB1bmtub3duOiBVbmtub3duLFxuICBoZWxwZXI6IEhlbHBlcixcbiAgY29uY2F0OiBDb25jYXRcbn07XG5cbmZ1bmN0aW9uIGJ1aWxkRXhwcmVzc2lvbihzcGVjOiBTcGVjKTogRXhwcmVzc2lvblN5bnRheCB7XG4gIGlmICh0eXBlb2Ygc3BlYyAhPT0gJ29iamVjdCcgfHwgc3BlYyA9PT0gbnVsbCkge1xuICAgIHJldHVybiBWYWx1ZS5mcm9tU3BlYyhzcGVjKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gRXhwcmVzc2lvbk5vZGVzW3NwZWNbMF1dLmZyb21TcGVjKHNwZWMpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBcmdzIGV4dGVuZHMgU3ludGF4PEFyZ3M+IHtcbiAgcHVibGljIHR5cGUgPSBcImFyZ3NcIjtcblxuICBzdGF0aWMgZnJvbVNwZWMocG9zaXRpb25hbDogUG9zaXRpb25hbEFyZ3NTZXhwLCBuYW1lZDogTmFtZWRBcmdzU2V4cCk6IEFyZ3Mge1xuICAgIHJldHVybiBuZXcgQXJncyh7IHBvc2l0aW9uYWw6IFBvc2l0aW9uYWxBcmdzLmZyb21TcGVjKHBvc2l0aW9uYWwpLCBuYW1lZDogTmFtZWRBcmdzLmZyb21TcGVjKG5hbWVkKSB9KTtcbiAgfVxuXG4gIHN0YXRpYyBfZW1wdHk6IEFyZ3M7XG5cbiAgc3RhdGljIGVtcHR5KCk6IEFyZ3Mge1xuICAgIHJldHVybiAodGhpcy5fZW1wdHkgPSB0aGlzLl9lbXB0eSB8fCBuZXcgQXJncyh7IHBvc2l0aW9uYWw6IFBvc2l0aW9uYWxBcmdzLmVtcHR5KCksIG5hbWVkOiBOYW1lZEFyZ3MuZW1wdHkoKSB9KSk7XG4gIH1cblxuICBzdGF0aWMgZnJvbVBvc2l0aW9uYWxBcmdzKHBvc2l0aW9uYWw6IFBvc2l0aW9uYWxBcmdzKTogQXJncyB7XG4gICAgcmV0dXJuIG5ldyBBcmdzKHsgcG9zaXRpb25hbCwgbmFtZWQ6IE5hbWVkQXJncy5lbXB0eSgpIH0pO1xuICB9XG5cbiAgc3RhdGljIGZyb21IYXNoKG5hbWVkOiBOYW1lZEFyZ3MpOiBBcmdzIHtcbiAgICByZXR1cm4gbmV3IEFyZ3MoeyBwb3NpdGlvbmFsOiBQb3NpdGlvbmFsQXJncy5lbXB0eSgpLCBuYW1lZCB9KTtcbiAgfVxuXG4gIHN0YXRpYyBidWlsZChwb3NpdGlvbmFsOiBQb3NpdGlvbmFsQXJncywgbmFtZWQ6IE5hbWVkQXJncyk6IEFyZ3Mge1xuICAgIHJldHVybiBuZXcgdGhpcyh7IHBvc2l0aW9uYWwsIG5hbWVkIH0pO1xuICB9XG5cbiAgcHVibGljIHBvc2l0aW9uYWw6IFBvc2l0aW9uYWxBcmdzO1xuICBwdWJsaWMgbmFtZWQ6IE5hbWVkQXJncztcbiAgcHVibGljIGlzU3RhdGljID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogeyBwb3NpdGlvbmFsOiBQb3NpdGlvbmFsQXJncywgbmFtZWQ6IE5hbWVkQXJncyB9KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnBvc2l0aW9uYWwgPSBvcHRpb25zLnBvc2l0aW9uYWw7XG4gICAgdGhpcy5uYW1lZCA9IG9wdGlvbnMubmFtZWQ7XG4gIH1cblxuICBwcmV0dHlQcmludCgpIHtcbiAgICAvLyByZXR1cm4gW3RoaXMucG9zaXRpb25hbC5wcmV0dHlQcmludCgpLCB0aGlzLm5hbWVkLnByZXR0eVByaW50KCldO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29tcGlsZShjb21waWxlcjogQ29tcGlsZXIpOiBDb21waWxlZEFyZ3Mge1xuICAgIGxldCB7IHBvc2l0aW9uYWwsIG5hbWVkIH0gPSB0aGlzO1xuICAgIHJldHVybiBDb21waWxlZEFyZ3MuY3JlYXRlKHsgcG9zaXRpb25hbDogcG9zaXRpb25hbC5jb21waWxlKGNvbXBpbGVyKSwgbmFtZWQ6IG5hbWVkLmNvbXBpbGUoY29tcGlsZXIpIH0pO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQb3NpdGlvbmFsQXJncyBleHRlbmRzIFN5bnRheDxQb3NpdGlvbmFsQXJncz4ge1xuICBwdWJsaWMgdHlwZSA9IFwicG9zaXRpb25hbFwiO1xuXG4gIHN0YXRpYyBmcm9tU3BlYyhzZXhwOiBQb3NpdGlvbmFsQXJnc1NleHApOiBQb3NpdGlvbmFsQXJncyB7XG4gICAgaWYgKCFzZXhwIHx8IHNleHAubGVuZ3RoID09PSAwKSByZXR1cm4gUG9zaXRpb25hbEFyZ3MuZW1wdHkoKTtcbiAgICByZXR1cm4gbmV3IFBvc2l0aW9uYWxBcmdzKHNleHAubWFwKGJ1aWxkRXhwcmVzc2lvbikpO1xuICB9XG5cbiAgc3RhdGljIGJ1aWxkKGV4cHJzOiBFeHByZXNzaW9uU3ludGF4W10pOiBQb3NpdGlvbmFsQXJncyB7XG4gICAgcmV0dXJuIG5ldyB0aGlzKGV4cHJzKTtcbiAgfVxuXG4gIHN0YXRpYyBfZW1wdHk6IFBvc2l0aW9uYWxBcmdzO1xuXG4gIHN0YXRpYyBlbXB0eSgpOiBQb3NpdGlvbmFsQXJncyB7XG4gICAgcmV0dXJuICh0aGlzLl9lbXB0eSA9IHRoaXMuX2VtcHR5IHx8IG5ldyBQb3NpdGlvbmFsQXJncyhbXSkpO1xuICB9XG5cbiAgdmFsdWVzOiBFeHByZXNzaW9uU3ludGF4W107XG4gIGxlbmd0aDogbnVtYmVyO1xuICBpc1N0YXRpYyA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKGV4cHJzOiBFeHByZXNzaW9uU3ludGF4W10pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMudmFsdWVzID0gZXhwcnM7XG4gICAgdGhpcy5sZW5ndGggPSBleHBycy5sZW5ndGg7XG4gIH1cblxuICBwdXNoKGV4cHI6IEV4cHJlc3Npb25TeW50YXgpIHtcbiAgICB0aGlzLnZhbHVlcy5wdXNoKGV4cHIpO1xuICAgIHRoaXMubGVuZ3RoID0gdGhpcy52YWx1ZXMubGVuZ3RoO1xuICB9XG5cbiAgYXQoaW5kZXg6IG51bWJlcik6IEV4cHJlc3Npb25TeW50YXgge1xuICAgIHJldHVybiB0aGlzLnZhbHVlc1tpbmRleF07XG4gIH1cblxuICBjb21waWxlKGNvbXBpbGVyOiBDb21waWxlcik6IENvbXBpbGVkUG9zaXRpb25hbEFyZ3Mge1xuICAgIHJldHVybiBDb21waWxlZFBvc2l0aW9uYWxBcmdzLmNyZWF0ZSh7IHZhbHVlczogdGhpcy52YWx1ZXMubWFwKHYgPT4gdi5jb21waWxlKGNvbXBpbGVyKSkgfSk7XG4gIH1cblxuICBwcmV0dHlQcmludCgpOiBQcmV0dHlQcmludFZhbHVlIHtcbiAgICByZXR1cm4gPGFueT50aGlzLnZhbHVlcy5tYXAocCA9PiBwLnByZXR0eVByaW50KCkpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBOYW1lZEFyZ3MgZXh0ZW5kcyBTeW50YXg8TmFtZWRBcmdzPiB7XG4gIHB1YmxpYyB0eXBlID0gXCJuYW1lZFwiO1xuXG4gIHN0YXRpYyBmcm9tU3BlYyhyYXdQYWlyczogTmFtZWRBcmdzU2V4cCk6IE5hbWVkQXJncyB7XG4gICAgaWYgKCFyYXdQYWlycykgeyByZXR1cm4gTmFtZWRBcmdzLmVtcHR5KCk7IH1cblxuICAgIGxldCBrZXlzID0gW107XG4gICAgbGV0IHZhbHVlcyA9IFtdO1xuICAgIGxldCBtYXAgPSBkaWN0PEV4cHJlc3Npb25TeW50YXg+KCk7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHJhd1BhaXJzLmxlbmd0aDsgaSA8IGw7IGkgKz0gMikge1xuICAgICAgbGV0IGtleSA9IHJhd1BhaXJzW2ldO1xuICAgICAgbGV0IGV4cHIgPSByYXdQYWlyc1tpKzFdO1xuICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgICBsZXQgdmFsdWUgPSBidWlsZEV4cHJlc3Npb24oZXhwcik7XG4gICAgICB2YWx1ZXMucHVzaCh2YWx1ZSk7XG4gICAgICBtYXBba2V5XSA9IHZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgTmFtZWRBcmdzKHsga2V5cywgdmFsdWVzLCBtYXAgfSk7XG4gIH1cblxuICBzdGF0aWMgYnVpbGQobWFwOiBEaWN0PEV4cHJlc3Npb25TeW50YXg+KTogTmFtZWRBcmdzIHtcbiAgICBpZiAobWFwID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIE5hbWVkQXJncy5lbXB0eSgpOyB9XG4gICAgbGV0IGtleXMgPSBbXTtcbiAgICBsZXQgdmFsdWVzID0gW107XG5cbiAgICBPYmplY3Qua2V5cyhtYXApLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGtleXMucHVzaChrZXkpO1xuICAgICAgdmFsdWVzLnB1c2gobWFwW2tleV0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG5ldyB0aGlzKHsga2V5cywgdmFsdWVzLCBtYXAgfSk7XG4gIH1cblxuICBzdGF0aWMgX2VtcHR5O1xuXG4gIHN0YXRpYyBlbXB0eSgpOiBOYW1lZEFyZ3Mge1xuICAgIHJldHVybiAodGhpcy5fZW1wdHkgPSB0aGlzLl9lbXB0eSB8fCBuZXcgTmFtZWRBcmdzKHsga2V5czogRU1QVFlfQVJSQVksIHZhbHVlczogRU1QVFlfQVJSQVksIG1hcDogZGljdDxFeHByZXNzaW9uU3ludGF4PigpIH0pKTtcbiAgfVxuXG4gIHB1YmxpYyBtYXA6IERpY3Q8RXhwcmVzc2lvblN5bnRheD47XG4gIHB1YmxpYyBrZXlzOiBJbnRlcm5lZFN0cmluZ1tdO1xuICBwdWJsaWMgdmFsdWVzOiBFeHByZXNzaW9uU3ludGF4W107XG4gIHB1YmxpYyBpc1N0YXRpYyA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHsga2V5cywgdmFsdWVzLCBtYXAgfTogeyBrZXlzOiBJbnRlcm5lZFN0cmluZ1tdLCB2YWx1ZXM6IEV4cHJlc3Npb25TeW50YXhbXSwgbWFwOiBEaWN0PEV4cHJlc3Npb25TeW50YXg+IH0pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMua2V5cyA9IGtleXM7XG4gICAgdGhpcy52YWx1ZXMgPSB2YWx1ZXM7XG4gICAgdGhpcy5tYXAgPSBtYXA7XG4gIH1cblxuICBwcmV0dHlQcmludCgpIHtcbiAgICBsZXQgb3V0ID0gZGljdDxQcmV0dHlQcmludFZhbHVlPigpO1xuICAgIHRoaXMua2V5cy5mb3JFYWNoKChrZXksIGkpID0+IHtcbiAgICAgIG91dFs8c3RyaW5nPmtleV0gPSB0aGlzLnZhbHVlc1tpXS5wcmV0dHlQcmludCgpO1xuICAgIH0pO1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvdXQpO1xuICB9XG5cbiAgYWRkKGtleTogSW50ZXJuZWRTdHJpbmcsIHZhbHVlOiBFeHByZXNzaW9uU3ludGF4KSB7XG4gICAgdGhpcy5rZXlzLnB1c2goa2V5KTtcbiAgICB0aGlzLnZhbHVlcy5wdXNoKHZhbHVlKTtcbiAgICB0aGlzLm1hcFs8c3RyaW5nPmtleV0gPSB2YWx1ZTtcbiAgfVxuXG4gIGF0KGtleTogSW50ZXJuZWRTdHJpbmcpOiBFeHByZXNzaW9uU3ludGF4IHtcbiAgICByZXR1cm4gdGhpcy5tYXBbPHN0cmluZz5rZXldO1xuICB9XG5cbiAgaGFzKGtleTogSW50ZXJuZWRTdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLm1hcFs8c3RyaW5nPmtleV07XG4gIH1cblxuICBjb21waWxlKGNvbXBpbGVyOiBDb21waWxlcik6IENvbXBpbGVkTmFtZWRBcmdzIHtcbiAgICBsZXQgeyBrZXlzLCB2YWx1ZXM6IHJhd1ZhbHVlcyB9ID0gdGhpcztcbiAgICBsZXQgdmFsdWVzID0gcmF3VmFsdWVzLm1hcCh2ID0+IHYuY29tcGlsZShjb21waWxlcikpO1xuXG4gICAgcmV0dXJuIENvbXBpbGVkTmFtZWRBcmdzLmNyZWF0ZSh7IGtleXMsIHZhbHVlcyB9KTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVGVtcGxhdGVzIGV4dGVuZHMgU3ludGF4PFRlbXBsYXRlcz4ge1xuICBwdWJsaWMgdHlwZSA9IFwidGVtcGxhdGVzXCI7XG5cbiAgc3RhdGljIGZyb21TcGVjKF8sIFt0ZW1wbGF0ZUlkLCBpbnZlcnNlSWQsIGNoaWxkcmVuXSk6IFRlbXBsYXRlcyB7XG4gICAgcmV0dXJuIG5ldyBUZW1wbGF0ZXMoe1xuICAgICAgdGVtcGxhdGU6IHRlbXBsYXRlSWQgPT09IG51bGwgPyBudWxsIDogY2hpbGRyZW5bdGVtcGxhdGVJZF0sXG4gICAgICBpbnZlcnNlOiBpbnZlcnNlSWQgPT09IG51bGwgPyBudWxsIDogY2hpbGRyZW5baW52ZXJzZUlkXSxcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBidWlsZCh0ZW1wbGF0ZTogVGVtcGxhdGUsIGludmVyc2U6IFRlbXBsYXRlPW51bGwsIGF0dHJpYnV0ZXM6IFRlbXBsYXRlPW51bGwpOiBUZW1wbGF0ZXMge1xuICAgIHJldHVybiBuZXcgdGhpcyh7IHRlbXBsYXRlLCBpbnZlcnNlIH0pO1xuICB9XG5cbiAgcHVibGljIGRlZmF1bHQ6IFRlbXBsYXRlO1xuICBwdWJsaWMgaW52ZXJzZTogVGVtcGxhdGU7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogeyB0ZW1wbGF0ZTogVGVtcGxhdGUsIGludmVyc2U6IFRlbXBsYXRlIH0pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuZGVmYXVsdCA9IG9wdGlvbnMudGVtcGxhdGU7XG4gICAgdGhpcy5pbnZlcnNlID0gb3B0aW9ucy5pbnZlcnNlO1xuICB9XG5cbiAgcHJldHR5UHJpbnQoKTogc3RyaW5nIHtcbiAgICBsZXQgeyBkZWZhdWx0OiBfZGVmYXVsdCwgaW52ZXJzZSB9ID0gdGhpcztcblxuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICBkZWZhdWx0OiBfZGVmYXVsdCAmJiBfZGVmYXVsdC5wb3NpdGlvbixcbiAgICAgIGludmVyc2U6IGludmVyc2UgJiYgaW52ZXJzZS5wb3NpdGlvblxuICAgIH0pO1xuICB9XG5cbiAgZXZhbHVhdGUodm06IFZNKTogUGF0aFJlZmVyZW5jZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwidW5pbXBsZW1lbnRlZCBldmFsdWF0ZSBmb3IgRXhwcmVzc2lvblN5bnRheFwiKTtcbiAgfVxufSJdfQ==