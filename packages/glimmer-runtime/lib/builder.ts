import Bounds from './bounds';

import DOMHelper from './dom';

import { InternedString, Stack, LinkedList, LinkedListNode, assert } from 'glimmer-util';

import {
  ChainableReference,
  PushPullReference,
} from 'glimmer-reference';

interface FirstNode {
  firstNode(): Node;
}

interface LastNode {
  lastNode(): Node;
}

class First {
  private node: Node;

  constructor(node) {
    this.node = node;
  }

  firstNode(): Node {
    return this.node;
  }
}

class Last {
  private node: Node;

  constructor(node) {
    this.node = node;
  }

  lastNode(): Node {
    return this.node;
  }
}

export class ClassList extends PushPullReference {
  private list: ChainableReference[] = [];

  append(reference: ChainableReference) {
    this.list.push(reference);
    // this._addSource(reference);
  }

  value(): string {
    if (this.list.length === 0) return null;
    return this.list.map(i => i.value()).join(' ');
  }
}

interface ElementStackOptions {
  parentNode: Element;
  nextSibling: Node;
  dom: DOMHelper;
}

interface ElementStackClass<T extends ElementStack> {
  new (options: ElementStackOptions): T;
}

class BlockStackElement {
  public firstNode: Node = null;
  public lastNode: Node = null;
}

export class ElementStack {
  public nextSibling: Node;
  public dom: DOMHelper;
  public element: Element;
  public classList: ClassList = null;

  private elementStack = new Stack<Element>();
  private nextSiblingStack = new Stack<Node>();
  private classListStack = new Stack<ClassList>();
  private blockStack = new Stack<Tracker>();

  constructor({ dom, parentNode, nextSibling }: ElementStackOptions) {
    this.dom = dom;
    this.element = parentNode;
    this.nextSibling = nextSibling;
    if (nextSibling && !(nextSibling instanceof Node)) throw new Error("NOPE");

    this.elementStack.push(this.element);
    this.nextSiblingStack.push(this.nextSibling);
  }

  block(): Tracker {
    return this.blockStack.current;
  }

  private pushElement(element) {
    this.elementStack.push(element);
    this.classListStack.push(null);
    this.nextSiblingStack.push(null);
    this.element = element;
    this.classList = null;
    this.nextSibling = null;
  }

  private popElement() {
    let { elementStack, nextSiblingStack, classListStack }  = this;
    let topElement = elementStack.pop();

    nextSiblingStack.pop();
    classListStack.pop();

    this.element = elementStack.current;
    this.nextSibling = nextSiblingStack.current;
    this.classList = classListStack.current;

    return topElement;
  }

  private pushBlock() {
    let tracker = new BlockTracker(this.element);

    if (this.blockStack.current !== null) this.blockStack.current.newBounds(tracker);

    this.blockStack.push(tracker);
  }

  private pushBlockList(list: LinkedList<Bounds & LinkedListNode>) {
    let tracker = new BlockListTracker(this.element, list);

    if (this.blockStack.current !== null) this.blockStack.current.newBounds(tracker);

    this.blockStack.push(tracker);
  }

  private popBlock(): Bounds {
    this.blockStack.current.finalize(this);

    return this.blockStack.pop();
  }

  openElement(tag: string): Element {
    let element = this.dom.createElement(tag, this.element);
    this.pushElement(element);
    this.blockStack.current.openElement(element);
    return element;
  }

  openBlock() {
    this.pushBlock();
  }

  closeBlock(): Bounds {
    return this.popBlock();
  }

  openBlockList(list: LinkedList<Bounds & LinkedListNode>) {
    this.pushBlockList(list);
  }

  newBounds(bounds: Bounds) {
    this.blockStack.current.newBounds(bounds);
  }

  appendText(string: string): Text {
    let { dom } = this;
    let text = dom.createTextNode(string);
    dom.insertBefore(this.element, text, this.nextSibling);
    this.blockStack.current.newNode(text);
    return text;
  }

  appendComment(string: string): Comment {
    let { dom } = this;
    let comment = dom.createComment(string);
    dom.insertBefore(this.element, comment, this.nextSibling);
    this.blockStack.current.newNode(comment);
    return comment;
  }

  insertHTMLBefore(nextSibling: Node, html: string): Bounds {
    if (!(this.element instanceof HTMLElement)) {
      throw new Error(`You cannot insert HTML (using triple-curlies or htmlSafe) into an SVG context: ${this.element.tagName}`);
    }

    let bounds = this.dom.insertHTMLBefore(<HTMLElement & Element>this.element, nextSibling, html);
    this.blockStack.current.newBounds(bounds);
    return bounds;
  }

  setAttribute(name: InternedString, value: any) {
    this.dom.setAttribute(<HTMLElement & Element>this.element, name, value);
  }

  setAttributeNS(name: InternedString, value: any, namespace: InternedString) {
    this.dom.setAttributeNS(this.element, name, value, namespace);
  }

  addClass(ref: ChainableReference) {
    let classList = this.classList;
    if (classList === null) {
      classList = this.classList = new ClassList();
      this.classListStack.push(classList);
    }

    classList.append(ref);
  }

  closeElement(): { element: Element, classList: ClassList, classNames: string } {
    let { classList } = this;
    this.blockStack.current.closeElement();
    let child = this.popElement();
    this.dom.insertBefore(this.element, child, this.nextSibling);

    let classNames = classList ? classList.value() : null;
    if (classNames !== null) {
      this.dom.setAttribute(child, 'class', classNames);
    }

    return { element: child, classList, classNames };
  }

  appendHTML(html: string): Bounds {
    return this.dom.insertHTMLBefore(<HTMLElement>this.element, this.nextSibling, html);
  }
}

interface Tracker extends Bounds {
  openElement(element: Element);
  closeElement();
  newNode(node: Node);
  newBounds(bounds: Bounds);
  finalize(stack: ElementStack);
}

class BlockTracker implements Tracker {
  private first: FirstNode = null;
  private last: LastNode = null;
  private nesting = 0;

  private parent: Element;

  constructor(parent: Element){
    this.parent = parent;
  }

  parentElement() {
    return this.parent;
  }

  firstNode() {
    return this.first && this.first.firstNode();
  }

  lastNode() {
    return this.last && this.last.lastNode();
  }

  openElement(element: Element) {
    this.newNode(element);
    this.nesting++;
  }

  closeElement() {
    this.nesting--;
  }

  newNode(node: Node) {
    if (this.nesting !== 0) return;

    if (!this.first) {
      this.first = new First(node);
    }

    this.last = new Last(node);
  }

  newBounds(bounds: Bounds) {
    if (this.nesting !== 0) return;

    if (!this.first) {
      this.first = bounds;
    }

    this.last = bounds;
  }

  finalize(stack: ElementStack) {
    if (!this.first) {
      stack.appendComment('');
    }
  }
}

class BlockListTracker implements Tracker {
  private last: Node = null;
  private parent: Element;
  private boundList: LinkedList<Bounds & LinkedListNode>;

  constructor(parent: Element, boundList: LinkedList<Bounds & LinkedListNode>) {
    this.parent = parent;
    this.boundList = boundList;
  }

  parentElement() {
    return this.parent;
  }

  firstNode() {
    let head = this.boundList.head();

    return head ? head.firstNode() : this.last;
  }

  lastNode() {
    return this.last;
  }

  openElement(element: Element) {
    assert(false, 'Cannot openElement directly inside a block list');
  }

  closeElement() {
    assert(false, 'Cannot closeElement directly inside a block list');
  }

  newNode(node: Node) {
    assert(false, 'Cannot create a new node directly inside a block list');
  }

  newBounds(bounds: Bounds) {
  }

  finalize(stack: ElementStack) {
    let { dom, element: parent, nextSibling } = stack;

    let comment = dom.createComment('');
    dom.insertBefore(parent, comment, nextSibling);

    this.last = comment;
  }
}
