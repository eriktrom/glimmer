import { EvaluatedArgs } from '../expressions/args';
import { LITERAL, ListSlice, assert } from 'glimmer-util';
import { ConstReference, ListManager } from 'glimmer-reference';
class ListOpcode {
    constructor() {
        this.next = null;
        this.prev = null;
    }
}
class ListUpdatingOpcode {
    constructor() {
        this.next = null;
        this.prev = null;
    }
}
export class EnterListOpcode extends ListOpcode {
    constructor(start, end) {
        super();
        this.type = "enter-list";
        this.slice = new ListSlice(start, end);
    }
    evaluate(vm) {
        let listRef = vm.frame.getOperand();
        let keyPath = vm.frame.getArgs().named.get(LITERAL("key")).value();
        let manager = new ListManager(listRef /* WTF */, keyPath);
        let delegate = new IterateDelegate(vm);
        vm.frame.setIterator(manager.iterator(delegate));
        vm.enterList(manager, this.slice);
    }
}
export class ExitListOpcode extends ListOpcode {
    constructor(...args) {
        super(...args);
        this.type = "exit-list";
    }
    evaluate(vm) {
        vm.exitList();
    }
}
export class EnterWithKeyOpcode extends ListOpcode {
    constructor(start, end) {
        super();
        this.type = "enter-with-key";
        this.slice = new ListSlice(start, end);
    }
    evaluate(vm) {
        vm.enterWithKey(vm.frame.getKey(), this.slice);
    }
}
const TRUE_REF = new ConstReference(true);
const FALSE_REF = new ConstReference(false);
class IterateDelegate {
    constructor(vm) {
        this.vm = vm;
    }
    insert(key, item, before) {
        let { vm } = this;
        assert(!before, "Insertion should be append-only on initial render");
        vm.frame.setArgs(EvaluatedArgs.positional([item]));
        vm.frame.setOperand(item);
        vm.frame.setCondition(TRUE_REF);
        vm.frame.setKey(key);
    }
    retain(key, item) {
        assert(false, "Insertion should be append-only on initial render");
    }
    move(key, item, before) {
        assert(false, "Insertion should be append-only on initial render");
    }
    delete(key) {
        assert(false, "Insertion should be append-only on initial render");
    }
    done() {
        this.vm.frame.setCondition(FALSE_REF);
    }
}
export class NextIterOpcode extends ListOpcode {
    constructor(end) {
        super();
        this.type = "next-iter";
        this.end = end;
    }
    evaluate(vm) {
        if (vm.frame.getIterator().next()) {
            vm.goto(this.end);
        }
    }
}
class ReiterateOpcode extends ListUpdatingOpcode {
    constructor(initialize) {
        super();
        this.type = "reiterate";
        this.initialize = initialize;
    }
    evaluate(vm) {
        vm.throw(this.initialize);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJnbGltbWVyLXJ1bnRpbWUvbGliL2NvbXBpbGVkL29wY29kZXMvbGlzdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BR08sRUFBRSxhQUFhLEVBQUUsTUFBTSxxQkFBcUI7T0FFNUMsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUErQixNQUFNLEVBQUUsTUFBTSxjQUFjO09BQy9FLEVBQWlCLGNBQWMsRUFBRSxXQUFXLEVBQWdCLE1BQU0sbUJBQW1CO0FBRTVGO0lBQUE7UUFFUyxTQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ1osU0FBSSxHQUFHLElBQUksQ0FBQztJQUdyQixDQUFDO0FBQUQsQ0FBQztBQUVEO0lBQUE7UUFFUyxTQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ1osU0FBSSxHQUFHLElBQUksQ0FBQztJQUdyQixDQUFDO0FBQUQsQ0FBQztBQUVELHFDQUFxQyxVQUFVO0lBSzdDLFlBQVksS0FBaUIsRUFBRSxHQUFlO1FBQzVDLE9BQU8sQ0FBQztRQUxILFNBQUksR0FBRyxZQUFZLENBQUM7UUFNekIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVELFFBQVEsQ0FBQyxFQUFNO1FBQ2IsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNwQyxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFbkUsSUFBSSxPQUFPLEdBQUksSUFBSSxXQUFXLENBQWdCLE9BQU8sQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDMUUsSUFBSSxRQUFRLEdBQUcsSUFBSSxlQUFlLENBQUMsRUFBRSxDQUFDLENB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OEJBQThCLGtCQUFrQjtJQUs5QyxZQUFZLFVBQTRCO1FBQ3RDLE9BQU8sQ0FBQztRQUxILFNBQUksR0FBRyxXQUFXLENBQUM7UUFNeEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7SUFDL0IsQ0FBQztJQUVELFFBQVEsQ0FBQyxFQUFjO1FBQ3JCLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzVCLENBQUM7QUFDSCxDQUFDO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcGNvZGUsIFVwZGF0aW5nT3Bjb2RlLCBVbmZsYXR0ZW5lZE9wY29kZSB9IGZyb20gJy4uLy4uL29wY29kZXMnO1xuaW1wb3J0IHsgVk0sIFVwZGF0aW5nVk0gfSBmcm9tICcuLi8uLi92bSc7XG5pbXBvcnQgeyBCaW5kQXJnc09wY29kZSwgTm9vcE9wY29kZSB9IGZyb20gJy4uLy4uL2NvbXBpbGVkL29wY29kZXMvdm0nO1xuaW1wb3J0IHsgRXZhbHVhdGVkQXJncyB9IGZyb20gJy4uL2V4cHJlc3Npb25zL2FyZ3MnO1xuaW1wb3J0IHsgTGlzdFJhbmdlLCBSYW5nZSB9IGZyb20gJy4uLy4uL3V0aWxzJztcbmltcG9ydCB7IExJVEVSQUwsIExpc3RTbGljZSwgU2xpY2UsIERpY3QsIEludGVybmVkU3RyaW5nLCBhc3NlcnQgfSBmcm9tICdnbGltbWVyLXV0aWwnO1xuaW1wb3J0IHsgUm9vdFJlZmVyZW5jZSwgQ29uc3RSZWZlcmVuY2UsIExpc3RNYW5hZ2VyLCBMaXN0RGVsZWdhdGUgfSBmcm9tICdnbGltbWVyLXJlZmVyZW5jZSc7XG5cbmFic3RyYWN0IGNsYXNzIExpc3RPcGNvZGUgaW1wbGVtZW50cyBPcGNvZGUge1xuICBwdWJsaWMgdHlwZTogc3RyaW5nO1xuICBwdWJsaWMgbmV4dCA9IG51bGw7XG4gIHB1YmxpYyBwcmV2ID0gbnVsbDtcblxuICBhYnN0cmFjdCBldmFsdWF0ZSh2bTogVk0pO1xufVxuXG5hYnN0cmFjdCBjbGFzcyBMaXN0VXBkYXRpbmdPcGNvZGUgaW1wbGVtZW50cyBVcGRhdGluZ09wY29kZSB7XG4gIHB1YmxpYyB0eXBlOiBzdHJpbmc7XG4gIHB1YmxpYyBuZXh0ID0gbnVsbDtcbiAgcHVibGljIHByZXYgPSBudWxsO1xuXG4gIGFic3RyYWN0IGV2YWx1YXRlKHZtOiBVcGRhdGluZ1ZNKTtcbn1cblxuZXhwb3J0IGNsYXNzIEVudGVyTGlzdE9wY29kZSBleHRlbmRzIExpc3RPcGNvZGUge1xuICBwdWJsaWMgdHlwZSA9IFwiZW50ZXItbGlzdFwiO1xuXG4gIHByaXZhdGUgc2xpY2U6IFNsaWNlPE9wY29kZT47XG5cbiAgY29uc3RydWN0b3Ioc3RhcnQ6IE5vb3BPcGNvZGUsIGVuZDogTm9vcE9wY29kZSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5zbGljZSA9IG5ldyBMaXN0U2xpY2Uoc3RhcnQsIGVuZCk7XG4gIH1cblxuICBldmFsdWF0ZSh2bTogVk0pIHtcbiAgICBsZXQgbGlzdFJlZiA9IHZtLmZyYW1lLmdldE9wZXJhbmQoKTtcbiAgICBsZXQga2V5UGF0aCA9IHZtLmZyYW1lLmdldEFyZ3MoKS5uYW1lZC5nZXQoTElURVJBTChcImtleVwiKSkudmFsdWUoKTtcblxuICAgIGxldCBtYW5hZ2VyID0gIG5ldyBMaXN0TWFuYWdlcig8Um9vdFJlZmVyZW5jZT5saXN0UmVmIC8qIFdURiAqLywga2V5UGF0aCk7XG4gICAgbGV0IGRlbGVnYXRlID0gbmV3IEl0ZXJhdGVEZWxlZ2F0ZSh2bSk7XG5cbiAgICB2bS5mcmFtZS5zZXRJdGVyYXRvcihtYW5hZ2VyLml0ZXJhdG9yKGRlbGVnYXRlKSk7XG5cbiAgICB2bS5lbnRlckxpc3QobWFuYWdlciwgdGhpcy5zbGljZSk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEV4aXRMaXN0T3Bjb2RlIGV4dGVuZHMgTGlzdE9wY29kZSB7XG4gIHB1YmxpYyB0eXBlID0gXCJleGl0LWxpc3RcIjtcblxuICBldmFsdWF0ZSh2bTogVk0pIHtcbiAgICB2bS5leGl0TGlzdCgpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBFbnRlcldpdGhLZXlPcGNvZGUgZXh0ZW5kcyBMaXN0T3Bjb2RlIHtcbiAgcHVibGljIHR5cGUgPSBcImVudGVyLXdpdGgta2V5XCI7XG5cbiAgcHJpdmF0ZSBzbGljZTogU2xpY2U8T3Bjb2RlPjtcblxuICBjb25zdHJ1Y3RvcihzdGFydDogTm9vcE9wY29kZSwgZW5kOiBOb29wT3Bjb2RlKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnNsaWNlID0gbmV3IExpc3RTbGljZShzdGFydCwgZW5kKTtcbiAgfVxuXG4gIGV2YWx1YXRlKHZtOiBWTSkge1xuICAgIHZtLmVudGVyV2l0aEtleSh2bS5mcmFtZS5nZXRLZXkoKSwgdGhpcy5zbGljZSk7XG4gIH1cbn1cblxuY29uc3QgVFJVRV9SRUYgPSBuZXcgQ29uc3RSZWZlcmVuY2UodHJ1ZSk7XG5jb25zdCBGQUxTRV9SRUYgPSBuZXcgQ29uc3RSZWZlcmVuY2UoZmFsc2UpO1xuXG5jbGFzcyBJdGVyYXRlRGVsZWdhdGUgaW1wbGVtZW50cyBMaXN0RGVsZWdhdGUge1xuICBwcml2YXRlIHZtOiBWTTtcblxuICBjb25zdHJ1Y3Rvcih2bTogVk0pIHtcbiAgICB0aGlzLnZtID0gdm07XG4gIH1cblxuICBpbnNlcnQoa2V5OiBJbnRlcm5lZFN0cmluZywgaXRlbTogUm9vdFJlZmVyZW5jZSwgYmVmb3JlOiBJbnRlcm5lZFN0cmluZykge1xuICAgIGxldCB7IHZtIH0gPSB0aGlzO1xuXG4gICAgYXNzZXJ0KCFiZWZvcmUsIFwiSW5zZXJ0aW9uIHNob3VsZCBiZSBhcHBlbmQtb25seSBvbiBpbml0aWFsIHJlbmRlclwiKTtcblxuICAgIHZtLmZyYW1lLnNldEFyZ3MoRXZhbHVhdGVkQXJncy5wb3NpdGlvbmFsKFtpdGVtXSkpO1xuICAgIHZtLmZyYW1lLnNldE9wZXJhbmQoaXRlbSk7XG4gICAgdm0uZnJhbWUuc2V0Q29uZGl0aW9uKFRSVUVfUkVGKTtcbiAgICB2bS5mcmFtZS5zZXRLZXkoa2V5KTtcbiAgfVxuXG4gIHJldGFpbihrZXk6IEludGVybmVkU3RyaW5nLCBpdGVtOiBSb290UmVmZXJlbmNlKSB7XG4gICAgYXNzZXJ0KGZhbHNlLCBcIkluc2VydGlvbiBzaG91bGQgYmUgYXBwZW5kLW9ubHkgb24gaW5pdGlhbCByZW5kZXJcIik7XG4gIH1cblxuICBtb3ZlKGtleTogSW50ZXJuZWRTdHJpbmcsIGl0ZW06IFJvb3RSZWZlcmVuY2UsIGJlZm9yZTogSW50ZXJuZWRTdHJpbmcpIHtcbiAgICBhc3NlcnQoZmFsc2UsIFwiSW5zZXJ0aW9uIHNob3VsZCBiZSBhcHBlbmQtb25seSBvbiBpbml0aWFsIHJlbmRlclwiKTtcbiAgfVxuXG4gIGRlbGV0ZShrZXk6IEludGVybmVkU3RyaW5nKSB7XG4gICAgYXNzZXJ0KGZhbHNlLCBcIkluc2VydGlvbiBzaG91bGQgYmUgYXBwZW5kLW9ubHkgb24gaW5pdGlhbCByZW5kZXJcIik7XG4gIH1cblxuICBkb25lKCkge1xuICAgIHRoaXMudm0uZnJhbWUuc2V0Q29uZGl0aW9uKEZBTFNFX1JFRik7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIE5leHRJdGVyT3Bjb2RlIGV4dGVuZHMgTGlzdE9wY29kZSB7XG4gIHB1YmxpYyB0eXBlID0gXCJuZXh0LWl0ZXJcIjtcblxuICBwcml2YXRlIGVuZDogTm9vcE9wY29kZTtcblxuICBjb25zdHJ1Y3RvcihlbmQ6IE5vb3BPcGNvZGUpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuZW5kID0gZW5kO1xuICB9XG5cbiAgZXZhbHVhdGUodm06IFZNKSB7XG4gICAgaWYgKHZtLmZyYW1lLmdldEl0ZXJhdG9yKCkubmV4dCgpKSB7XG4gICAgICB2bS5nb3RvKHRoaXMuZW5kKTtcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgUmVpdGVyYXRlT3Bjb2RlIGV4dGVuZHMgTGlzdFVwZGF0aW5nT3Bjb2RlIHtcbiAgcHVibGljIHR5cGUgPSBcInJlaXRlcmF0ZVwiO1xuXG4gIHByaXZhdGUgaW5pdGlhbGl6ZTogKHZtOiBWTSkgPT4gdm9pZDtcblxuICBjb25zdHJ1Y3Rvcihpbml0aWFsaXplOiAodm06IFZNKSA9PiB2b2lkKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmluaXRpYWxpemUgPSBpbml0aWFsaXplO1xuICB9XG5cbiAgZXZhbHVhdGUodm06IFVwZGF0aW5nVk0pIHtcbiAgICB2bS50aHJvdyh0aGlzLmluaXRpYWxpemUpO1xuICB9XG59Il19