export default class ForkedReference {
    constructor(reference) {
        // private chain: Destroyable;
        this._guid = null;
        this.dirty = true;
        this.reference = reference;
        this._guid = null;
        this.dirty = true;
        // this.chain = reference.chain(this);
    }
    notify() {
        this.dirty = true;
    }
    isDirty() {
        return true;
    }
    value() {
        this.dirty = false;
        return this.reference.value();
    }
    destroy() {
        // this.chain.destroy();
    }
    label() {
        return '[reference Leaf]';
    }
}
export function fork(reference) {
    return new ForkedReference(reference);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ya2VkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ2xpbW1lci1yZWZlcmVuY2UvbGliL3JlZmVyZW5jZXMvZm9ya2VkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBO0lBTUUsWUFBWSxTQUE2QjtRQUp6Qyw4QkFBOEI7UUFDdkIsVUFBSyxHQUFXLElBQUksQ0FBQztRQUNwQixVQUFLLEdBQVksSUFBSSxDQUFDO1FBRzVCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBRWxCLHNDQUFzQztJQUN4QyxDQUFDO0lBRUQsTUFBTTtRQUNKLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBQ3BCLENBQUM7SUFFRCxPQUFPO1FBQ0wsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxLQUFLO1FBQ0gsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDaEMsQ0FBQztJQUVELE9BQU87UUFDTCx3QkFBd0I7SUFDMUIsQ0FBQztJQUVELEtBQUs7UUFDSCxNQUFNLENBQUMsa0JBQWtCLENBQUM7SUFDNUIsQ0FBQztBQUNILENBQUM7QUFFRCxxQkFBcUIsU0FBNkI7SUFDaEQsTUFBTSxDQUFDLElBQUksZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3hDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFpbmFibGVSZWZlcmVuY2UsIE5vdGlmaWFibGVSZWZlcmVuY2UgfSBmcm9tICdnbGltbWVyLXJlZmVyZW5jZSc7XG5pbXBvcnQgeyBIYXNHdWlkIH0gZnJvbSAnZ2xpbW1lci11dGlsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRm9ya2VkUmVmZXJlbmNlIGltcGxlbWVudHMgTm90aWZpYWJsZVJlZmVyZW5jZSwgSGFzR3VpZCB7XG4gIHByaXZhdGUgcmVmZXJlbmNlOiBDaGFpbmFibGVSZWZlcmVuY2U7XG4gIC8vIHByaXZhdGUgY2hhaW46IERlc3Ryb3lhYmxlO1xuICBwdWJsaWMgX2d1aWQ6IG51bWJlciA9IG51bGw7XG4gIHByaXZhdGUgZGlydHk6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIGNvbnN0cnVjdG9yKHJlZmVyZW5jZTogQ2hhaW5hYmxlUmVmZXJlbmNlKSB7XG4gICAgdGhpcy5yZWZlcmVuY2UgPSByZWZlcmVuY2U7XG4gICAgdGhpcy5fZ3VpZCA9IG51bGw7XG4gICAgdGhpcy5kaXJ0eSA9IHRydWU7XG5cbiAgICAvLyB0aGlzLmNoYWluID0gcmVmZXJlbmNlLmNoYWluKHRoaXMpO1xuICB9XG5cbiAgbm90aWZ5KCkge1xuICAgIHRoaXMuZGlydHkgPSB0cnVlO1xuICB9XG5cbiAgaXNEaXJ0eSgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHZhbHVlKCkge1xuICAgIHRoaXMuZGlydHkgPSBmYWxzZTtcbiAgICByZXR1cm4gdGhpcy5yZWZlcmVuY2UudmFsdWUoKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgLy8gdGhpcy5jaGFpbi5kZXN0cm95KCk7XG4gIH1cblxuICBsYWJlbCgpIHtcbiAgICByZXR1cm4gJ1tyZWZlcmVuY2UgTGVhZl0nO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JrKHJlZmVyZW5jZTogQ2hhaW5hYmxlUmVmZXJlbmNlKTogRm9ya2VkUmVmZXJlbmNlIHtcbiAgcmV0dXJuIG5ldyBGb3JrZWRSZWZlcmVuY2UocmVmZXJlbmNlKTtcbn1cbiJdfQ==