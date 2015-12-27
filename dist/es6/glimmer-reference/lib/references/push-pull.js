class NotifyNode {
    constructor(parent, child) {
        this.previousSibling = null;
        this.nextSibling = null;
        this.parent = parent;
        this.child = child;
    }
}
class Unchain {
    constructor(reference, notifyNode) {
        this.reference = reference;
        this.notifyNode = notifyNode;
    }
    destroy() {
        let { reference, notifyNode } = this;
        let { nextSibling, previousSibling } = notifyNode;
        if (nextSibling)
            nextSibling.previousSibling = previousSibling;
        if (previousSibling)
            previousSibling.nextSibling = nextSibling;
        if (reference._notifyTail === notifyNode)
            reference._notifyTail = previousSibling;
    }
}
export class PushPullReference {
    constructor() {
        this.dirty = true;
        this._notifyTail = null;
        this.sources = null;
        this._guid = null;
    }
    isDirty() { return true; }
    chain(child) {
        // return this._append(child);
        return null;
    }
    notify() {
        let notifyNode = this._notifyTail;
        while (notifyNode) {
            // notifyNode.child.notify();
            notifyNode = notifyNode.previousSibling;
        }
    }
    destroy() {
        if (!this.sources)
            return;
        this.sources.forEach(source => source.destroy());
    }
    _addSource(source) {
        // this.sources = this.sources || [];
        // this.sources.push(source.chain(this));
        return source;
    }
}
export default PushPullReference;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVzaC1wdWxsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ2xpbW1lci1yZWZlcmVuY2UvbGliL3JlZmVyZW5jZXMvcHVzaC1wdWxsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBO0lBTUUsWUFBWSxNQUFNLEVBQUUsS0FBSztRQUhsQixvQkFBZSxHQUFlLElBQUksQ0FBQztRQUNuQyxnQkFBVyxHQUFlLElBQUksQ0FBQztRQUdwQyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUNyQixDQUFDO0FBQ0gsQ0FBQztBQUVEO0lBSUUsWUFBWSxTQUE0QixFQUFFLFVBQXNCO1FBQzlELElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0lBQy9CLENBQUM7SUFFRCxPQUFPO1FBQ0wsSUFBSSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDckMsSUFBSSxFQUFFLFdBQVcsRUFBRSxlQUFlLEVBQUUsR0FBRyxVQUFVLENBQUM7UUFFbEQsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDO1lBQUMsV0FBVyxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7UUFDL0QsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDO1lBQUMsZUFBZSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFFL0QsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLFdBQVcsS0FBSyxVQUFVLENBQUM7WUFBQyxTQUFTLENBQUMsV0FBVyxHQUFHLGVBQWUsQ0FBQztJQUNwRixDQUFDO0FBQ0gsQ0FBQztBQUVEO0lBQUE7UUFDWSxVQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLGdCQUFXLEdBQWUsSUFBSSxDQUFDO1FBQzlCLFlBQU8sR0FBa0IsSUFBSSxDQUFDO1FBQy9CLFVBQUssR0FBVyxJQUFJLENBQUM7SUE2QjlCLENBQUM7SUEzQkMsT0FBTyxLQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBRTFCLEtBQUssQ0FBQyxLQUEwQjtRQUM5Qiw4QkFBOEI7UUFDOUIsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFJRCxNQUFNO1FBQ0osSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUNsQyxPQUFPLFVBQVUsRUFBRSxDQUFDO1lBQ2xCLDZCQUE2QjtZQUM3QixVQUFVLEdBQUcsVUFBVSxDQUFDLGVBQWUsQ0FBQztRQUMxQyxDQUFDO0lBQ0gsQ0FBQztJQUVELE9BQU87UUFDTCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7WUFBQyxNQUFNLENBQUM7UUFDMUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFUyxVQUFVLENBQStCLE1BQVM7UUFDMUQscUNBQXFDO1FBQ3JDLHlDQUF5QztRQUN6QyxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2hCLENBQUM7QUFDSCxDQUFDO0FBRUQsZUFBZSxpQkFBaUIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERlc3Ryb3lhYmxlLCBSZWZlcmVuY2UsIE5vdGlmaWFibGVSZWZlcmVuY2UsIENoYWluYWJsZVJlZmVyZW5jZSB9IGZyb20gJ2dsaW1tZXItcmVmZXJlbmNlJztcbmltcG9ydCB7IEhhc0d1aWQgfSBmcm9tICdnbGltbWVyLXV0aWwnO1xuXG5jbGFzcyBOb3RpZnlOb2RlIHtcbiAgcHVibGljIHBhcmVudDogUHVzaFB1bGxSZWZlcmVuY2U7XG4gIHB1YmxpYyBjaGlsZDogTm90aWZpYWJsZVJlZmVyZW5jZTtcbiAgcHVibGljIHByZXZpb3VzU2libGluZzogTm90aWZ5Tm9kZSA9IG51bGw7XG4gIHB1YmxpYyBuZXh0U2libGluZzogTm90aWZ5Tm9kZSA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IocGFyZW50LCBjaGlsZCkge1xuICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgIHRoaXMuY2hpbGQgPSBjaGlsZDtcbiAgfVxufVxuXG5jbGFzcyBVbmNoYWluIHtcbiAgcHJpdmF0ZSByZWZlcmVuY2U6IFB1c2hQdWxsUmVmZXJlbmNlO1xuICBwcml2YXRlIG5vdGlmeU5vZGU6IE5vdGlmeU5vZGU7XG5cbiAgY29uc3RydWN0b3IocmVmZXJlbmNlOiBQdXNoUHVsbFJlZmVyZW5jZSwgbm90aWZ5Tm9kZTogTm90aWZ5Tm9kZSkge1xuICAgIHRoaXMucmVmZXJlbmNlID0gcmVmZXJlbmNlO1xuICAgIHRoaXMubm90aWZ5Tm9kZSA9IG5vdGlmeU5vZGU7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIGxldCB7IHJlZmVyZW5jZSwgbm90aWZ5Tm9kZSB9ID0gdGhpcztcbiAgICBsZXQgeyBuZXh0U2libGluZywgcHJldmlvdXNTaWJsaW5nIH0gPSBub3RpZnlOb2RlO1xuXG4gICAgaWYgKG5leHRTaWJsaW5nKSBuZXh0U2libGluZy5wcmV2aW91c1NpYmxpbmcgPSBwcmV2aW91c1NpYmxpbmc7XG4gICAgaWYgKHByZXZpb3VzU2libGluZykgcHJldmlvdXNTaWJsaW5nLm5leHRTaWJsaW5nID0gbmV4dFNpYmxpbmc7XG5cbiAgICBpZiAocmVmZXJlbmNlLl9ub3RpZnlUYWlsID09PSBub3RpZnlOb2RlKSByZWZlcmVuY2UuX25vdGlmeVRhaWwgPSBwcmV2aW91c1NpYmxpbmc7XG4gIH1cbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFB1c2hQdWxsUmVmZXJlbmNlIGltcGxlbWVudHMgUmVmZXJlbmNlLCBDaGFpbmFibGVSZWZlcmVuY2UsIE5vdGlmaWFibGVSZWZlcmVuY2UsIEhhc0d1aWQge1xuICBwcm90ZWN0ZWQgZGlydHkgPSB0cnVlO1xuICBwdWJsaWMgX25vdGlmeVRhaWw6IE5vdGlmeU5vZGUgPSBudWxsO1xuICBwcml2YXRlIHNvdXJjZXM6IERlc3Ryb3lhYmxlW10gPSBudWxsO1xuICBwdWJsaWMgX2d1aWQ6IG51bWJlciA9IG51bGw7XG5cbiAgaXNEaXJ0eSgpIHsgcmV0dXJuIHRydWU7IH1cblxuICBjaGFpbihjaGlsZDogTm90aWZpYWJsZVJlZmVyZW5jZSk6IERlc3Ryb3lhYmxlIHtcbiAgICAvLyByZXR1cm4gdGhpcy5fYXBwZW5kKGNoaWxkKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGFic3RyYWN0IHZhbHVlKCk6IGFueTtcblxuICBub3RpZnkoKSB7XG4gICAgbGV0IG5vdGlmeU5vZGUgPSB0aGlzLl9ub3RpZnlUYWlsO1xuICAgIHdoaWxlIChub3RpZnlOb2RlKSB7XG4gICAgICAvLyBub3RpZnlOb2RlLmNoaWxkLm5vdGlmeSgpO1xuICAgICAgbm90aWZ5Tm9kZSA9IG5vdGlmeU5vZGUucHJldmlvdXNTaWJsaW5nO1xuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgaWYgKCF0aGlzLnNvdXJjZXMpIHJldHVybjtcbiAgICB0aGlzLnNvdXJjZXMuZm9yRWFjaChzb3VyY2UgPT4gc291cmNlLmRlc3Ryb3koKSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2FkZFNvdXJjZTxUIGV4dGVuZHMgQ2hhaW5hYmxlUmVmZXJlbmNlPihzb3VyY2U6IFQpOiBUIHtcbiAgICAvLyB0aGlzLnNvdXJjZXMgPSB0aGlzLnNvdXJjZXMgfHwgW107XG4gICAgLy8gdGhpcy5zb3VyY2VzLnB1c2goc291cmNlLmNoYWluKHRoaXMpKTtcbiAgICByZXR1cm4gc291cmNlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFB1c2hQdWxsUmVmZXJlbmNlO1xuIl19