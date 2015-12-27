import { Stack, assert } from 'glimmer-util';
import { PushPullReference } from 'glimmer-reference';
class First {
    constructor(node) {
        this.node = node;
    }
    firstNode() {
        return this.node;
    }
}
class Last {
    constructor(node) {
        this.node = node;
    }
    lastNode() {
        return this.node;
    }
}
export class ClassList extends PushPullReference {
    constructor(...args) {
        super(...args);
        this.list = [];
    }
    append(reference) {
        this.list.push(reference);
        // this._addSource(reference);
    }
    value() {
        if (this.list.length === 0)
            return null;
        return this.list.map(i => i.value()).join(' ');
    }
}
class BlockStackElement {
    constructor() {
        this.firstNode = null;
        this.lastNode = null;
    }
}
export class ElementStack {
    constructor({ dom, parentNode, nextSibling }) {
        this.classList = null;
        this.elementStack = new Stack();
        this.nextSiblingStack = new Stack();
        this.classListStack = new Stack();
        this.blockStack = new Stack();
        this.dom = dom;
        this.element = parentNode;
        this.nextSibling = nextSibling;
        if (nextSibling && !(nextSibling instanceof Node))
            throw new Error("NOPE");
        this.elementStack.push(this.element);
        this.nextSiblingStack.push(this.nextSibling);
    }
    block() {
        return this.blockStack.current;
    }
    pushElement(element) {
        this.elementStack.push(element);
        this.classListStack.push(null);
        this.nextSiblingStack.push(null);
        this.element = element;
        this.classList = null;
        this.nextSibling = null;
    }
    popElement() {
        let { elementStack, nextSiblingStack, classListStack } = this;
        let topElement = elementStack.pop();
        nextSiblingStack.pop();
        classListStack.pop();
        this.element = elementStack.current;
        this.nextSibling = nextSiblingStack.current;
        this.classList = classListStack.current;
        return topElement;
    }
    pushBlock() {
        let tracker = new BlockTracker(this.element);
        if (this.blockStack.current !== null)
            this.blockStack.current.newBounds(tracker);
        this.blockStack.push(tracker);
    }
    pushBlockList(list) {
        let tracker = new BlockListTracker(this.element, list);
        if (this.blockStack.current !== null)
            this.blockStack.current.newBounds(tracker);
        this.blockStack.push(tracker);
    }
    popBlock() {
        this.blockStack.current.finalize(this);
        return this.blockStack.pop();
    }
    openElement(tag) {
        let element = this.dom.createElement(tag, this.element);
        this.pushElement(element);
        this.blockStack.current.openElement(element);
        return element;
    }
    openBlock() {
        this.pushBlock();
    }
    closeBlock() {
        return this.popBlock();
    }
    openBlockList(list) {
        this.pushBlockList(list);
    }
    newBounds(bounds) {
        this.blockStack.current.newBounds(bounds);
    }
    appendText(string) {
        let { dom } = this;
        let text = dom.createTextNode(string);
        dom.insertBefore(this.element, text, this.nextSibling);
        this.blockStack.current.newNode(text);
        return text;
    }
    appendComment(string) {
        let { dom } = this;
        let comment = dom.createComment(string);
        dom.insertBefore(this.element, comment, this.nextSibling);
        this.blockStack.current.newNode(comment);
        return comment;
    }
    insertHTMLBefore(nextSibling, html) {
        if (!(this.element instanceof HTMLElement)) {
            throw new Error(`You cannot insert HTML (using triple-curlies or htmlSafe) into an SVG context: ${this.element.tagName}`);
        }
        let bounds = this.dom.insertHTMLBefore(this.element, nextSibling, html);
        this.blockStack.current.newBounds(bounds);
        return bounds;
    }
    setAttribute(name, value) {
        this.dom.setAttribute(this.element, name, value);
    }
    setAttributeNS(name, value, namespace) {
        this.dom.setAttributeNS(this.element, name, value, namespace);
    }
    addClass(ref) {
        let classList = this.classList;
        if (classList === null) {
            classList = this.classList = new ClassList();
            this.classListStack.push(classList);
        }
        classList.append(ref);
    }
    closeElement() {
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
    appendHTML(html) {
        return this.dom.insertHTMLBefore(this.element, this.nextSibling, html);
    }
}
class BlockTracker {
    constructor(parent) {
        this.first = null;
        this.last = null;
        this.nesting = 0;
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
    openElement(element) {
        this.newNode(element);
        this.nesting++;
    }
    closeElement() {
        this.nesting--;
    }
    newNode(node) {
        if (this.nesting !== 0)
            return;
        if (!this.first) {
            this.first = new First(node);
        }
        this.last = new Last(node);
    }
    newBounds(bounds) {
        if (this.nesting !== 0)
            return;
        if (!this.first) {
            this.first = bounds;
        }
        this.last = bounds;
    }
    finalize(stack) {
        if (!this.first) {
            stack.appendComment('');
        }
    }
}
class BlockListTracker {
    constructor(parent, boundList) {
        this.last = null;
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
    openElement(element) {
        assert(false, 'Cannot openElement directly inside a block list');
    }
    closeElement() {
        assert(false, 'Cannot closeElement directly inside a block list');
    }
    newNode(node) {
        assert(false, 'Cannot create a new node directly inside a block list');
    }
    newBounds(bounds) {
    }
    finalize(stack) {
        let { dom, element: parent, nextSibling } = stack;
        let comment = dom.createComment('');
        dom.insertBefore(parent, comment, nextSibling);
        this.last = comment;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdsaW1tZXItcnVudGltZS9saWIvYnVpbGRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FJTyxFQUFrQixLQUFLLEVBQThCLE1BQU0sRUFBRSxNQUFNLGNBQWM7T0FFakYsRUFFTCxpQkFBaUIsRUFDbEIsTUFBTSxtQkFBbUI7QUFVMUI7SUFHRSxZQUFZLElBQUk7UUFDZCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNuQixDQUFDO0lBRUQsU0FBUztRQUNQLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ25CLENBQUM7QUFDSCxDQUFDO0FBRUQ7SUFHRSxZQUFZLElBQUk7UUFDZCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNuQixDQUFDO0lBRUQsUUFBUTtRQUNOLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ25CLENBQUM7QUFDSCxDQUFDO0FBRUQsK0JBQStCLGlCQUFpQjtJQUFoRDtRQUErQixlQUFpQjtRQUN0QyxTQUFJLEdBQXlCLEVBQUUsQ0FBQztJQVcxQyxDQUFDO0lBVEMsTUFBTSxDQUFDLFNBQTZCO1FBQ2xDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzFCLDhCQUE4QjtJQUNoQyxDQUFDO0lBRUQsS0FBSztRQUNILEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDeEMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDakQsQ0FBQztBQUNILENBQUM7QUFZRDtJQUFBO1FBQ1MsY0FBUyxHQUFTLElBQUksQ0FBQztRQUN2Qixh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SUFFRCxXQUFXLENBQUMsT0FBZ0I7UUFDMUIsTUFBTSxDQUFDLEtBQUssRUFBRSxpREFBaUQsQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFRCxZQUFZO1FBQ1YsTUFBTSxDQUFDLEtBQUssRUFBRSxrREFBa0QsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFFRCxPQUFPLENBQUMsSUFBVTtRQUNoQixNQUFNLENBQUMsS0FBSyxFQUFFLHVEQUF1RCxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVELFNBQVMsQ0FBQyxNQUFjO0lBQ3hCLENBQUM7SUFFRCxRQUFRLENBQUMsS0FBbUI7UUFDMUIsSUFBSSxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxHQUFHLEtBQUssQ0FBQztRQUVsRCxJQUFJLE9BQU8sR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3BDLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQztRQUUvQyxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztJQUN0QixDQUFDO0FBQ0gsQ0FBQztBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJvdW5kcyBmcm9tICcuL2JvdW5kcyc7XG5cbmltcG9ydCBET01IZWxwZXIgZnJvbSAnLi9kb20nO1xuXG5pbXBvcnQgeyBJbnRlcm5lZFN0cmluZywgU3RhY2ssIExpbmtlZExpc3QsIExpbmtlZExpc3ROb2RlLCBhc3NlcnQgfSBmcm9tICdnbGltbWVyLXV0aWwnO1xuXG5pbXBvcnQge1xuICBDaGFpbmFibGVSZWZlcmVuY2UsXG4gIFB1c2hQdWxsUmVmZXJlbmNlLFxufSBmcm9tICdnbGltbWVyLXJlZmVyZW5jZSc7XG5cbmludGVyZmFjZSBGaXJzdE5vZGUge1xuICBmaXJzdE5vZGUoKTogTm9kZTtcbn1cblxuaW50ZXJmYWNlIExhc3ROb2RlIHtcbiAgbGFzdE5vZGUoKTogTm9kZTtcbn1cblxuY2xhc3MgRmlyc3Qge1xuICBwcml2YXRlIG5vZGU6IE5vZGU7XG5cbiAgY29uc3RydWN0b3Iobm9kZSkge1xuICAgIHRoaXMubm9kZSA9IG5vZGU7XG4gIH1cblxuICBmaXJzdE5vZGUoKTogTm9kZSB7XG4gICAgcmV0dXJuIHRoaXMubm9kZTtcbiAgfVxufVxuXG5jbGFzcyBMYXN0IHtcbiAgcHJpdmF0ZSBub2RlOiBOb2RlO1xuXG4gIGNvbnN0cnVjdG9yKG5vZGUpIHtcbiAgICB0aGlzLm5vZGUgPSBub2RlO1xuICB9XG5cbiAgbGFzdE5vZGUoKTogTm9kZSB7XG4gICAgcmV0dXJuIHRoaXMubm9kZTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ2xhc3NMaXN0IGV4dGVuZHMgUHVzaFB1bGxSZWZlcmVuY2Uge1xuICBwcml2YXRlIGxpc3Q6IENoYWluYWJsZVJlZmVyZW5jZVtdID0gW107XG5cbiAgYXBwZW5kKHJlZmVyZW5jZTogQ2hhaW5hYmxlUmVmZXJlbmNlKSB7XG4gICAgdGhpcy5saXN0LnB1c2gocmVmZXJlbmNlKTtcbiAgICAvLyB0aGlzLl9hZGRTb3VyY2UocmVmZXJlbmNlKTtcbiAgfVxuXG4gIHZhbHVlKCk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMubGlzdC5sZW5ndGggPT09IDApIHJldHVybiBudWxsO1xuICAgIHJldHVybiB0aGlzLmxpc3QubWFwKGkgPT4gaS52YWx1ZSgpKS5qb2luKCcgJyk7XG4gIH1cbn1cblxuaW50ZXJmYWNlIEVsZW1lbnRTdGFja09wdGlvbnMge1xuICBwYXJlbnROb2RlOiBFbGVtZW50O1xuICBuZXh0U2libGluZzogTm9kZTtcbiAgZG9tOiBET01IZWxwZXI7XG59XG5cbmludGVyZmFjZSBFbGVtZW50U3RhY2tDbGFzczxUIGV4dGVuZHMgRWxlbWVudFN0YWNrPiB7XG4gIG5ldyAob3B0aW9uczogRWxlbWVudFN0YWNrT3B0aW9ucyk6IFQ7XG59XG5cbmNsYXNzIEJsb2NrU3RhY2tFbGVtZW50IHtcbiAgcHVibGljIGZpcnN0Tm9kZTogTm9kZSA9IG51bGw7XG4gIHB1YmxpYyBsYXN0Tm9kZTogTm9kZSA9IG51bGw7XG59XG5cbmV4cG9ydCBjbGFzcyBFbGVtZW50U3RhY2sge1xuICBwdWJsaWMgbmV4dFNpYmxpbmc6IE5vZGU7XG4gIHB1YmxpYyBkb206IERPTUhlbHBlcjtcbiAgcHVibGljIGVsZW1lbnQ6IEVsZW1lbnQ7XG4gIHB1YmxpYyBjbGFzc0xpc3Q6IENsYXNzTGlzdCA9IG51bGw7XG5cbiAgcHJpdmF0ZSBlbGVtZW50U3RhY2sgPSBuZXcgU3RhY2s8RWxlbWVudD4oKTtcbiAgcHJpdmF0ZSBuZXh0U2libGluZ1N0YWNrID0gbmV3IFN0YWNrPE5vZGU+KCk7XG4gIHByaXZhdGUgY2xhc3NMaXN0U3RhY2sgPSBuZXcgU3RhY2s8Q2xhc3NMaXN0PigpO1xuICBwcml2YXRlIGJsb2NrU3RhY2sgPSBuZXcgU3RhY2s8VHJhY2tlcj4oKTtcblxuICBjb25zdHJ1Y3Rvcih7IGRvbSwgcGFyZW50Tm9kZSwgbmV4dFNpYmxpbmcgfTogRWxlbWVudFN0YWNrT3B0aW9ucykge1xuICAgIHRoaXMuZG9tID0gZG9tO1xuICAgIHRoaXMuZWxlbWVudCA9IHBhcmVudE5vZGU7XG4gICAgdGhpcy5uZXh0U2libGluZyA9IG5leHRTaWJsaW5nO1xuICAgIGlmIChuZXh0U2libGluZyAmJiAhKG5leHRTaWJsaW5nIGluc3RhbmNlb2YgTm9kZSkpIHRocm93IG5ldyBFcnJvcihcIk5PUEVcIik7XG5cbiAgICB0aGlzLmVsZW1lbnRTdGFjay5wdXNoKHRoaXMuZWxlbWVudCk7XG4gICAgdGhpcy5uZXh0U2libGluZ1N0YWNrLnB1c2godGhpcy5uZXh0U2libGluZyk7XG4gIH1cblxuICBibG9jaygpOiBUcmFja2VyIHtcbiAgICByZXR1cm4gdGhpcy5ibG9ja1N0YWNrLmN1cnJlbnQ7XG4gIH1cblxuICBwcml2YXRlIHB1c2hFbGVtZW50KGVsZW1lbnQpIHtcbiAgICB0aGlzLmVsZW1lbnRTdGFjay5wdXNoKGVsZW1lbnQpO1xuICAgIHRoaXMuY2xhc3NMaXN0U3RhY2sucHVzaChudWxsKTtcbiAgICB0aGlzLm5leHRTaWJsaW5nU3RhY2sucHVzaChudWxsKTtcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgIHRoaXMuY2xhc3NMaXN0ID0gbnVsbDtcbiAgICB0aGlzLm5leHRTaWJsaW5nID0gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgcG9wRWxlbWVudCgpIHtcbiAgICBsZXQgeyBlbGVtZW50U3RhY2ssIG5leHRTaWJsaW5nU3RhY2ssIGNsYXNzTGlzdFN0YWNrIH0gID0gdGhpcztcbiAgICBsZXQgdG9wRWxlbWVudCA9IGVsZW1lbnRTdGFjay5wb3AoKTtcblxuICAgIG5leHRTaWJsaW5nU3RhY2sucG9wKCk7XG4gICAgY2xhc3NMaXN0U3RhY2sucG9wKCk7XG5cbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50U3RhY2suY3VycmVudDtcbiAgICB0aGlzLm5leHRTaWJsaW5nID0gbmV4dFNpYmxpbmdTdGFjay5jdXJyZW50O1xuICAgIHRoaXMuY2xhc3NMaXN0ID0gY2xhc3NMaXN0U3RhY2suY3VycmVudDtcblxuICAgIHJldHVybiB0b3BFbGVtZW50O1xuICB9XG5cbiAgcHJpdmF0ZSBwdXNoQmxvY2soKSB7XG4gICAgbGV0IHRyYWNrZXIgPSBuZXcgQmxvY2tUcmFja2VyKHRoaXMuZWxlbWVudCk7XG5cbiAgICBpZiAodGhpcy5ibG9ja1N0YWNrLmN1cnJlbnQgIT09IG51bGwpIHRoaXMuYmxvY2tTdGFjay5jdXJyZW50Lm5ld0JvdW5kcyh0cmFja2VyKTtcblxuICAgIHRoaXMuYmxvY2tTdGFjay5wdXNoKHRyYWNrZXIpO1xuICB9XG5cbiAgcHJpdmF0ZSBwdXNoQmxvY2tMaXN0KGxpc3Q6IExpbmtlZExpc3Q8Qm91bmRzICYgTGlua2VkTGlzdE5vZGU+KSB7XG4gICAgbGV0IHRyYWNrZXIgPSBuZXcgQmxvY2tMaXN0VHJhY2tlcih0aGlzLmVsZW1lbnQsIGxpc3QpO1xuXG4gICAgaWYgKHRoaXMuYmxvY2tTdGFjay5jdXJyZW50ICE9PSBudWxsKSB0aGlzLmJsb2NrU3RhY2suY3VycmVudC5uZXdCb3VuZHModHJhY2tlcik7XG5cbiAgICB0aGlzLmJsb2NrU3RhY2sucHVzaCh0cmFja2VyKTtcbiAgfVxuXG4gIHByaXZhdGUgcG9wQmxvY2soKTogQm91bmRzIHtcbiAgICB0aGlzLmJsb2NrU3RhY2suY3VycmVudC5maW5hbGl6ZSh0aGlzKTtcblxuICAgIHJldHVybiB0aGlzLmJsb2NrU3RhY2sucG9wKCk7XG4gIH1cblxuICBvcGVuRWxlbWVudCh0YWc6IHN0cmluZyk6IEVsZW1lbnQge1xuICAgIGxldCBlbGVtZW50ID0gdGhpcy5kb20uY3JlYXRlRWxlbWVudCh0YWcsIHRoaXMuZWxlbWVudCk7XG4gICAgdGhpcy5wdXNoRWxlbWVudChlbGVtZW50KTtcbiAgICB0aGlzLmJsb2NrU3RhY2suY3VycmVudC5vcGVuRWxlbWVudChlbGVtZW50KTtcbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxuXG4gIG9wZW5CbG9jaygpIHtcbiAgICB0aGlzLnB1c2hCbG9jaygpO1xuICB9XG5cbiAgY2xvc2VCbG9jaygpOiBCb3VuZHMge1xuICAgIHJldHVybiB0aGlzLnBvcEJsb2NrKCk7XG4gIH1cblxuICBvcGVuQmxvY2tMaXN0KGxpc3Q6IExpbmtlZExpc3Q8Qm91bmRzICYgTGlua2VkTGlzdE5vZGU+KSB7XG4gICAgdGhpcy5wdXNoQmxvY2tMaXN0KGxpc3QpO1xuICB9XG5cbiAgbmV3Qm91bmRzKGJvdW5kczogQm91bmRzKSB7XG4gICAgdGhpcy5ibG9ja1N0YWNrLmN1cnJlbnQubmV3Qm91bmRzKGJvdW5kcyk7XG4gIH1cblxuICBhcHBlbmRUZXh0KHN0cmluZzogc3RyaW5nKTogVGV4dCB7XG4gICAgbGV0IHsgZG9tIH0gPSB0aGlzO1xuICAgIGxldCB0ZXh0ID0gZG9tLmNyZWF0ZVRleHROb2RlKHN0cmluZyk7XG4gICAgZG9tLmluc2VydEJlZm9yZSh0aGlzLmVsZW1lbnQsIHRleHQsIHRoaXMubmV4dFNpYmxpbmcpO1xuICAgIHRoaXMuYmxvY2tTdGFjay5jdXJyZW50Lm5ld05vZGUodGV4dCk7XG4gICAgcmV0dXJuIHRleHQ7XG4gIH1cblxuICBhcHBlbmRDb21tZW50KHN0cmluZzogc3RyaW5nKTogQ29tbWVudCB7XG4gICAgbGV0IHsgZG9tIH0gPSB0aGlzO1xuICAgIGxldCBjb21tZW50ID0gZG9tLmNyZWF0ZUNvbW1lbnQoc3RyaW5nKTtcbiAgICBkb20uaW5zZXJ0QmVmb3JlKHRoaXMuZWxlbWVudCwgY29tbWVudCwgdGhpcy5uZXh0U2libGluZyk7XG4gICAgdGhpcy5ibG9ja1N0YWNrLmN1cnJlbnQubmV3Tm9kZShjb21tZW50KTtcbiAgICByZXR1cm4gY29tbWVudDtcbiAgfVxuXG4gIGluc2VydEhUTUxCZWZvcmUobmV4dFNpYmxpbmc6IE5vZGUsIGh0bWw6IHN0cmluZyk6IEJvdW5kcyB7XG4gICAgaWYgKCEodGhpcy5lbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFlvdSBjYW5ub3QgaW5zZXJ0IEhUTUwgKHVzaW5nIHRyaXBsZS1jdXJsaWVzIG9yIGh0bWxTYWZlKSBpbnRvIGFuIFNWRyBjb250ZXh0OiAke3RoaXMuZWxlbWVudC50YWdOYW1lfWApO1xuICAgIH1cblxuICAgIGxldCBib3VuZHMgPSB0aGlzLmRvbS5pbnNlcnRIVE1MQmVmb3JlKDxIVE1MRWxlbWVudCAmIEVsZW1lbnQ+dGhpcy5lbGVtZW50LCBuZXh0U2libGluZywgaHRtbCk7XG4gICAgdGhpcy5ibG9ja1N0YWNrLmN1cnJlbnQubmV3Qm91bmRzKGJvdW5kcyk7XG4gICAgcmV0dXJuIGJvdW5kcztcbiAgfVxuXG4gIHNldEF0dHJpYnV0ZShuYW1lOiBJbnRlcm5lZFN0cmluZywgdmFsdWU6IGFueSkge1xuICAgIHRoaXMuZG9tLnNldEF0dHJpYnV0ZSg8SFRNTEVsZW1lbnQgJiBFbGVtZW50PnRoaXMuZWxlbWVudCwgbmFtZSwgdmFsdWUpO1xuICB9XG5cbiAgc2V0QXR0cmlidXRlTlMobmFtZTogSW50ZXJuZWRTdHJpbmcsIHZhbHVlOiBhbnksIG5hbWVzcGFjZTogSW50ZXJuZWRTdHJpbmcpIHtcbiAgICB0aGlzLmRvbS5zZXRBdHRyaWJ1dGVOUyh0aGlzLmVsZW1lbnQsIG5hbWUsIHZhbHVlLCBuYW1lc3BhY2UpO1xuICB9XG5cbiAgYWRkQ2xhc3MocmVmOiBDaGFpbmFibGVSZWZlcmVuY2UpIHtcbiAgICBsZXQgY2xhc3NMaXN0ID0gdGhpcy5jbGFzc0xpc3Q7XG4gICAgaWYgKGNsYXNzTGlzdCA9PT0gbnVsbCkge1xuICAgICAgY2xhc3NMaXN0ID0gdGhpcy5jbGFzc0xpc3QgPSBuZXcgQ2xhc3NMaXN0KCk7XG4gICAgICB0aGlzLmNsYXNzTGlzdFN0YWNrLnB1c2goY2xhc3NMaXN0KTtcbiAgICB9XG5cbiAgICBjbGFzc0xpc3QuYXBwZW5kKHJlZik7XG4gIH1cblxuICBjbG9zZUVsZW1lbnQoKTogeyBlbGVtZW50OiBFbGVtZW50LCBjbGFzc0xpc3Q6IENsYXNzTGlzdCwgY2xhc3NOYW1lczogc3RyaW5nIH0ge1xuICAgIGxldCB7IGNsYXNzTGlzdCB9ID0gdGhpcztcbiAgICB0aGlzLmJsb2NrU3RhY2suY3VycmVudC5jbG9zZUVsZW1lbnQoKTtcbiAgICBsZXQgY2hpbGQgPSB0aGlzLnBvcEVsZW1lbnQoKTtcbiAgICB0aGlzLmRvbS5pbnNlcnRCZWZvcmUodGhpcy5lbGVtZW50LCBjaGlsZCwgdGhpcy5uZXh0U2libGluZyk7XG5cbiAgICBsZXQgY2xhc3NOYW1lcyA9IGNsYXNzTGlzdCA/IGNsYXNzTGlzdC52YWx1ZSgpIDogbnVsbDtcbiAgICBpZiAoY2xhc3NOYW1lcyAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5kb20uc2V0QXR0cmlidXRlKGNoaWxkLCAnY2xhc3MnLCBjbGFzc05hbWVzKTtcbiAgICB9XG5cbiAgICByZXR1cm4geyBlbGVtZW50OiBjaGlsZCwgY2xhc3NMaXN0LCBjbGFzc05hbWVzIH07XG4gIH1cblxuICBhcHBlbmRIVE1MKGh0bWw6IHN0cmluZyk6IEJvdW5kcyB7XG4gICAgcmV0dXJuIHRoaXMuZG9tLmluc2VydEhUTUxCZWZvcmUoPEhUTUxFbGVtZW50PnRoaXMuZWxlbWVudCwgdGhpcy5uZXh0U2libGluZywgaHRtbCk7XG4gIH1cbn1cblxuaW50ZXJmYWNlIFRyYWNrZXIgZXh0ZW5kcyBCb3VuZHMge1xuICBvcGVuRWxlbWVudChlbGVtZW50OiBFbGVtZW50KTtcbiAgY2xvc2VFbGVtZW50KCk7XG4gIG5ld05vZGUobm9kZTogTm9kZSk7XG4gIG5ld0JvdW5kcyhib3VuZHM6IEJvdW5kcyk7XG4gIGZpbmFsaXplKHN0YWNrOiBFbGVtZW50U3RhY2spO1xufVxuXG5jbGFzcyBCbG9ja1RyYWNrZXIgaW1wbGVtZW50cyBUcmFja2VyIHtcbiAgcHJpdmF0ZSBmaXJzdDogRmlyc3ROb2RlID0gbnVsbDtcbiAgcHJpdmF0ZSBsYXN0OiBMYXN0Tm9kZSA9IG51bGw7XG4gIHByaXZhdGUgbmVzdGluZyA9IDA7XG5cbiAgcHJpdmF0ZSBwYXJlbnQ6IEVsZW1lbnQ7XG5cbiAgY29uc3RydWN0b3IocGFyZW50OiBFbGVtZW50KXtcbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgfVxuXG4gIHBhcmVudEVsZW1lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyZW50O1xuICB9XG5cbiAgZmlyc3ROb2RlKCkge1xuICAgIHJldHVybiB0aGlzLmZpcnN0ICYmIHRoaXMuZmlyc3QuZmlyc3ROb2RlKCk7XG4gIH1cblxuICBsYXN0Tm9kZSgpIHtcbiAgICByZXR1cm4gdGhpcy5sYXN0ICYmIHRoaXMubGFzdC5sYXN0Tm9kZSgpO1xuICB9XG5cbiAgb3BlbkVsZW1lbnQoZWxlbWVudDogRWxlbWVudCkge1xuICAgIHRoaXMubmV3Tm9kZShlbGVtZW50KTtcbiAgICB0aGlzLm5lc3RpbmcrKztcbiAgfVxuXG4gIGNsb3NlRWxlbWVudCgpIHtcbiAgICB0aGlzLm5lc3RpbmctLTtcbiAgfVxuXG4gIG5ld05vZGUobm9kZTogTm9kZSkge1xuICAgIGlmICh0aGlzLm5lc3RpbmcgIT09IDApIHJldHVybjtcblxuICAgIGlmICghdGhpcy5maXJzdCkge1xuICAgICAgdGhpcy5maXJzdCA9IG5ldyBGaXJzdChub2RlKTtcbiAgICB9XG5cbiAgICB0aGlzLmxhc3QgPSBuZXcgTGFzdChub2RlKTtcbiAgfVxuXG4gIG5ld0JvdW5kcyhib3VuZHM6IEJvdW5kcykge1xuICAgIGlmICh0aGlzLm5lc3RpbmcgIT09IDApIHJldHVybjtcblxuICAgIGlmICghdGhpcy5maXJzdCkge1xuICAgICAgdGhpcy5maXJzdCA9IGJvdW5kcztcbiAgICB9XG5cbiAgICB0aGlzLmxhc3QgPSBib3VuZHM7XG4gIH1cblxuICBmaW5hbGl6ZShzdGFjazogRWxlbWVudFN0YWNrKSB7XG4gICAgaWYgKCF0aGlzLmZpcnN0KSB7XG4gICAgICBzdGFjay5hcHBlbmRDb21tZW50KCcnKTtcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgQmxvY2tMaXN0VHJhY2tlciBpbXBsZW1lbnRzIFRyYWNrZXIge1xuICBwcml2YXRlIGxhc3Q6IE5vZGUgPSBudWxsO1xuICBwcml2YXRlIHBhcmVudDogRWxlbWVudDtcbiAgcHJpdmF0ZSBib3VuZExpc3Q6IExpbmtlZExpc3Q8Qm91bmRzICYgTGlua2VkTGlzdE5vZGU+O1xuXG4gIGNvbnN0cnVjdG9yKHBhcmVudDogRWxlbWVudCwgYm91bmRMaXN0OiBMaW5rZWRMaXN0PEJvdW5kcyAmIExpbmtlZExpc3ROb2RlPikge1xuICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgIHRoaXMuYm91bmRMaXN0ID0gYm91bmRMaXN0O1xuICB9XG5cbiAgcGFyZW50RWxlbWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQ7XG4gIH1cblxuICBmaXJzdE5vZGUoKSB7XG4gICAgbGV0IGhlYWQgPSB0aGlzLmJvdW5kTGlzdC5oZWFkKCk7XG5cbiAgICByZXR1cm4gaGVhZCA/IGhlYWQuZmlyc3ROb2RlKCkgOiB0aGlzLmxhc3Q7XG4gIH1cblxuICBsYXN0Tm9kZSgpIHtcbiAgICByZXR1cm4gdGhpcy5sYXN0O1xuICB9XG5cbiAgb3BlbkVsZW1lbnQoZWxlbWVudDogRWxlbWVudCkge1xuICAgIGFzc2VydChmYWxzZSwgJ0Nhbm5vdCBvcGVuRWxlbWVudCBkaXJlY3RseSBpbnNpZGUgYSBibG9jayBsaXN0Jyk7XG4gIH1cblxuICBjbG9zZUVsZW1lbnQoKSB7XG4gICAgYXNzZXJ0KGZhbHNlLCAnQ2Fubm90IGNsb3NlRWxlbWVudCBkaXJlY3RseSBpbnNpZGUgYSBibG9jayBsaXN0Jyk7XG4gIH1cblxuICBuZXdOb2RlKG5vZGU6IE5vZGUpIHtcbiAgICBhc3NlcnQoZmFsc2UsICdDYW5ub3QgY3JlYXRlIGEgbmV3IG5vZGUgZGlyZWN0bHkgaW5zaWRlIGEgYmxvY2sgbGlzdCcpO1xuICB9XG5cbiAgbmV3Qm91bmRzKGJvdW5kczogQm91bmRzKSB7XG4gIH1cblxuICBmaW5hbGl6ZShzdGFjazogRWxlbWVudFN0YWNrKSB7XG4gICAgbGV0IHsgZG9tLCBlbGVtZW50OiBwYXJlbnQsIG5leHRTaWJsaW5nIH0gPSBzdGFjaztcblxuICAgIGxldCBjb21tZW50ID0gZG9tLmNyZWF0ZUNvbW1lbnQoJycpO1xuICAgIGRvbS5pbnNlcnRCZWZvcmUocGFyZW50LCBjb21tZW50LCBuZXh0U2libGluZyk7XG5cbiAgICB0aGlzLmxhc3QgPSBjb21tZW50O1xuICB9XG59XG4iXX0=