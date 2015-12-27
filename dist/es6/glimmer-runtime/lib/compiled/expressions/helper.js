export default class CompiledHelper {
    constructor({ helper, args }) {
        this.type = "helper";
        this.helper = helper;
        this.args = args;
    }
    evaluate(vm) {
        return new HelperInvocationReference(this.helper, this.args.evaluate(vm));
    }
}
class HelperInvocationReference {
    constructor(helper, args) {
        this.helper = helper;
        this.args = args;
    }
    get() {
        throw new Error("Unimplemented: Yielding the result of a helper call.");
    }
    isDirty() {
        return true;
    }
    value() {
        let { helper, args: { positional, named } } = this;
        return helper(positional.value(), named.value(), null);
    }
    destroy() { }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ2xpbW1lci1ydW50aW1lL2xpYi9jb21waWxlZC9leHByZXNzaW9ucy9oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBTUE7SUFLRSxZQUFZLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBMEM7UUFKN0QsU0FBSSxHQUFHLFFBQVEsQ0FBQztRQUtyQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNuQixDQUFDO0lBRUQsUUFBUSxDQUFDLEVBQU07UUFDYixNQUFNLENBQUMsSUFBSSx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDNUUsQ0FBQztBQUNILENBQUM7QUFFRDtJQUlFLFlBQVksTUFBYyxFQUFFLElBQW1CO1FBQzdDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ25CLENBQUM7SUFFRCxHQUFHO1FBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxzREFBc0QsQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFFRCxPQUFPO1FBQ0wsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxLQUFLO1FBQ0gsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLEVBQUUsR0FBSSxJQUFJLENBQUM7UUFDcEQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRCxPQUFPLEtBQUksQ0FBQztBQUNkLENBQUM7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBpbGVkRXhwcmVzc2lvbiB9IGZyb20gJy4uL2V4cHJlc3Npb25zJztcbmltcG9ydCB7IENvbXBpbGVkQXJncywgRXZhbHVhdGVkQXJncyB9IGZyb20gJy4vYXJncyc7XG5pbXBvcnQgVk0gZnJvbSAnLi4vLi4vdm0nO1xuaW1wb3J0IHsgSGVscGVyIH0gZnJvbSAnLi4vLi4vZW52aXJvbm1lbnQnO1xuaW1wb3J0IHsgUGF0aFJlZmVyZW5jZSB9IGZyb20gJ2dsaW1tZXItcmVmZXJlbmNlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcGlsZWRIZWxwZXIgaW1wbGVtZW50cyBDb21waWxlZEV4cHJlc3Npb24ge1xuICBwdWJsaWMgdHlwZSA9IFwiaGVscGVyXCI7XG4gIHB1YmxpYyBoZWxwZXI6IEhlbHBlcjtcbiAgcHVibGljIGFyZ3M6IENvbXBpbGVkQXJncztcblxuICBjb25zdHJ1Y3Rvcih7IGhlbHBlciwgYXJncyB9OiB7IGhlbHBlcjogSGVscGVyLCBhcmdzOiBDb21waWxlZEFyZ3MgfSkge1xuICAgIHRoaXMuaGVscGVyID0gaGVscGVyO1xuICAgIHRoaXMuYXJncyA9IGFyZ3M7XG4gIH1cblxuICBldmFsdWF0ZSh2bTogVk0pOiBQYXRoUmVmZXJlbmNlIHtcbiAgICByZXR1cm4gbmV3IEhlbHBlckludm9jYXRpb25SZWZlcmVuY2UodGhpcy5oZWxwZXIsIHRoaXMuYXJncy5ldmFsdWF0ZSh2bSkpO1xuICB9XG59XG5cbmNsYXNzIEhlbHBlckludm9jYXRpb25SZWZlcmVuY2UgaW1wbGVtZW50cyBQYXRoUmVmZXJlbmNlIHtcbiAgcHJpdmF0ZSBoZWxwZXI6IEhlbHBlcjtcbiAgcHJpdmF0ZSBhcmdzOiBFdmFsdWF0ZWRBcmdzO1xuXG4gIGNvbnN0cnVjdG9yKGhlbHBlcjogSGVscGVyLCBhcmdzOiBFdmFsdWF0ZWRBcmdzKSB7XG4gICAgdGhpcy5oZWxwZXIgPSBoZWxwZXI7XG4gICAgdGhpcy5hcmdzID0gYXJncztcbiAgfVxuXG4gIGdldCgpOiBQYXRoUmVmZXJlbmNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmltcGxlbWVudGVkOiBZaWVsZGluZyB0aGUgcmVzdWx0IG9mIGEgaGVscGVyIGNhbGwuXCIpO1xuICB9XG5cbiAgaXNEaXJ0eSgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHZhbHVlKCk6IGFueSB7XG4gICAgbGV0IHsgaGVscGVyLCBhcmdzOiB7IHBvc2l0aW9uYWwsIG5hbWVkIH0gfSAgPSB0aGlzO1xuICAgIHJldHVybiBoZWxwZXIocG9zaXRpb25hbC52YWx1ZSgpLCBuYW1lZC52YWx1ZSgpLCBudWxsKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7fVxufVxuIl19