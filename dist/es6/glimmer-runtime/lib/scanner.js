import StatementNodes from './syntax/statements';
import Template from './template';
import { Block } from './syntax/core';
import SymbolTable from './symbol-table';
import { EMPTY_SLICE, LinkedList } from 'glimmer-util';
export default class Scanner {
    constructor(specs) {
        this.specs = specs;
    }
    scan() {
        let { specs } = this;
        let templates = new Array(specs.length);
        for (let i = 0; i < specs.length; i++) {
            let spec = specs[i];
            let { program, children } = buildStatements(spec.statements, templates);
            templates[i] = new Template({
                program,
                children,
                root: templates,
                position: i,
                meta: spec.meta,
                locals: spec.locals,
                named: spec.named,
                isEmpty: spec.statements.length === 0,
                spec: spec
            });
        }
        let top = templates[templates.length - 1];
        let table = top.raw.symbolTable =
            new SymbolTable(null, top.raw).initNamed(top.raw.named);
        top.children.forEach(t => initTemplate(t, table));
        return top;
    }
}
function initTemplate(template, parent) {
    let { locals } = template.raw;
    let table = parent;
    table = new SymbolTable(parent, template.raw).initPositional(locals);
    template.raw.symbolTable = table;
    template.children.forEach(t => initTemplate(t, table));
}
export function buildStatements(statements, templates) {
    if (statements.length === 0) {
        return { program: EMPTY_SLICE, children: [] };
    }
    let program = new LinkedList();
    let children = [];
    statements.forEach(s => {
        let Statement = StatementNodes(s[0]);
        let statement = Statement.fromSpec(s, templates);
        if (statement instanceof Block) {
            if (statement.templates.default)
                children.push(statement.templates.default);
            if (statement.templates.inverse)
                children.push(statement.templates.inverse);
        }
        program.append(statement);
    });
    return { program, children };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nhbm5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdsaW1tZXItcnVudGltZS9saWIvc2Nhbm5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FDTyxjQUFjLE1BQU0scUJBQXFCO09BQ3pDLFFBQVEsTUFBTSxZQUFZO09BQzFCLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZTtPQUM5QixXQUFXLE1BQU0sZ0JBQWdCO09BQ2pDLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxNQUFNLGNBQWM7QUFFdEQ7SUFHRSxZQUFZLEtBQVk7UUFDdEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDckIsQ0FBQztJQUVELElBQUk7UUFDRixJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBRXJCLElBQUksU0FBUyxHQUFHLElBQUksS0FBSyxDQUFXLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVsRCxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3RDLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVwQixJQUFJLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBRXhFLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLFFBQVEsQ0FBQztnQkFDMUIsT0FBTztnQkFDUCxRQUFRO2dCQUNSLElBQUksRUFBRSxTQUFTO2dCQUNmLFFBQVEsRUFBRSxDQUFDO2dCQUNYLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDZixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07Z0JBQ25CLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztnQkFDakIsT0FBTyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxLQUFLLENBQUM7Z0JBQ3JDLElBQUksRUFBRSxJQUFJO2FBQ1gsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVELElBQUksR0FBRyxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzFDLElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsV0FBVztZQUM3QixJQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTFELEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxZQUFZLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFFbEQsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNiLENBQUM7QUFDSCxDQUFDO0FBRUQsc0JBQXNCLFFBQWtCLEVBQUUsTUFBbUI7SUFDM0QsSUFBSSxFQUFFLE1BQU0sRUFBRSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUM7SUFDOUIsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDO0lBRW5CLEtBQUssR0FBRyxJQUFJLFdBQVcsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUVyRSxRQUFRLENBQUMsR0FBRyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7SUFDakMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLFlBQVksQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN6RCxDQUFDO0FBRUQsZ0NBQWdDLFVBQWlCLEVBQUUsU0FBcUI7SUFDdEUsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsTUFBTSxDQUFDLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQUM7SUFBQyxDQUFDO0lBRS9FLElBQUksT0FBTyxHQUFHLElBQUksVUFBVSxFQUFtQixDQUFDO0lBQ2hELElBQUksUUFBUSxHQUFlLEVBQUUsQ0FBQztJQUU5QixVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbEIsSUFBSSxTQUFTLEdBQTJCLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RCxJQUFJLFNBQVMsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUVqRCxFQUFFLENBQUMsQ0FBQyxTQUFTLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQztZQUMvQixFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztnQkFBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDNUUsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7Z0JBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlFLENBQUM7UUFFRCxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzVCLENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxDQUFDO0FBQy9CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQcm9ncmFtLCBTdGF0ZW1lbnRTeW50YXggfSBmcm9tICcuL3N5bnRheCc7XG5pbXBvcnQgU3RhdGVtZW50Tm9kZXMgZnJvbSAnLi9zeW50YXgvc3RhdGVtZW50cyc7XG5pbXBvcnQgVGVtcGxhdGUgZnJvbSAnLi90ZW1wbGF0ZSc7XG5pbXBvcnQgeyBCbG9jayB9IGZyb20gJy4vc3ludGF4L2NvcmUnO1xuaW1wb3J0IFN5bWJvbFRhYmxlIGZyb20gJy4vc3ltYm9sLXRhYmxlJztcbmltcG9ydCB7IEVNUFRZX1NMSUNFLCBMaW5rZWRMaXN0IH0gZnJvbSAnZ2xpbW1lci11dGlsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2Nhbm5lciB7XG4gIHByaXZhdGUgc3BlY3M6IGFueVtdO1xuXG4gIGNvbnN0cnVjdG9yKHNwZWNzOiBhbnlbXSkge1xuICAgIHRoaXMuc3BlY3MgPSBzcGVjcztcbiAgfVxuXG4gIHNjYW4oKSB7XG4gICAgbGV0IHsgc3BlY3MgfSA9IHRoaXM7XG5cbiAgICBsZXQgdGVtcGxhdGVzID0gbmV3IEFycmF5PFRlbXBsYXRlPihzcGVjcy5sZW5ndGgpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzcGVjcy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IHNwZWMgPSBzcGVjc1tpXTtcblxuICAgICAgbGV0IHsgcHJvZ3JhbSwgY2hpbGRyZW4gfSA9IGJ1aWxkU3RhdGVtZW50cyhzcGVjLnN0YXRlbWVudHMsIHRlbXBsYXRlcyk7XG5cbiAgICAgIHRlbXBsYXRlc1tpXSA9IG5ldyBUZW1wbGF0ZSh7XG4gICAgICAgIHByb2dyYW0sXG4gICAgICAgIGNoaWxkcmVuLFxuICAgICAgICByb290OiB0ZW1wbGF0ZXMsXG4gICAgICAgIHBvc2l0aW9uOiBpLFxuICAgICAgICBtZXRhOiBzcGVjLm1ldGEsXG4gICAgICAgIGxvY2Fsczogc3BlYy5sb2NhbHMsXG4gICAgICAgIG5hbWVkOiBzcGVjLm5hbWVkLFxuICAgICAgICBpc0VtcHR5OiBzcGVjLnN0YXRlbWVudHMubGVuZ3RoID09PSAwLFxuICAgICAgICBzcGVjOiBzcGVjXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBsZXQgdG9wID0gdGVtcGxhdGVzW3RlbXBsYXRlcy5sZW5ndGggLSAxXTtcbiAgICBsZXQgdGFibGUgPSB0b3AucmF3LnN5bWJvbFRhYmxlID1cbiAgICAgIG5ldyBTeW1ib2xUYWJsZShudWxsLCB0b3AucmF3KS5pbml0TmFtZWQodG9wLnJhdy5uYW1lZCk7XG5cbiAgICB0b3AuY2hpbGRyZW4uZm9yRWFjaCh0ID0+IGluaXRUZW1wbGF0ZSh0LCB0YWJsZSkpO1xuXG4gICAgcmV0dXJuIHRvcDtcbiAgfVxufVxuXG5mdW5jdGlvbiBpbml0VGVtcGxhdGUodGVtcGxhdGU6IFRlbXBsYXRlLCBwYXJlbnQ6IFN5bWJvbFRhYmxlKSB7XG4gIGxldCB7IGxvY2FscyB9ID0gdGVtcGxhdGUucmF3O1xuICBsZXQgdGFibGUgPSBwYXJlbnQ7XG5cbiAgdGFibGUgPSBuZXcgU3ltYm9sVGFibGUocGFyZW50LCB0ZW1wbGF0ZS5yYXcpLmluaXRQb3NpdGlvbmFsKGxvY2Fscyk7XG5cbiAgdGVtcGxhdGUucmF3LnN5bWJvbFRhYmxlID0gdGFibGU7XG4gIHRlbXBsYXRlLmNoaWxkcmVuLmZvckVhY2godCA9PiBpbml0VGVtcGxhdGUodCwgdGFibGUpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkU3RhdGVtZW50cyhzdGF0ZW1lbnRzOiBhbnlbXSwgdGVtcGxhdGVzOiBUZW1wbGF0ZVtdKTogeyBwcm9ncmFtOiBQcm9ncmFtLCBjaGlsZHJlbjogVGVtcGxhdGVbXSB9IHtcbiAgaWYgKHN0YXRlbWVudHMubGVuZ3RoID09PSAwKSB7IHJldHVybiB7IHByb2dyYW06IEVNUFRZX1NMSUNFLCBjaGlsZHJlbjogW10gfTsgfVxuXG4gIGxldCBwcm9ncmFtID0gbmV3IExpbmtlZExpc3Q8U3RhdGVtZW50U3ludGF4PigpO1xuICBsZXQgY2hpbGRyZW46IFRlbXBsYXRlW10gPSBbXTtcblxuICBzdGF0ZW1lbnRzLmZvckVhY2gocyA9PiB7XG4gICAgbGV0IFN0YXRlbWVudDogdHlwZW9mIFN0YXRlbWVudFN5bnRheCA9IFN0YXRlbWVudE5vZGVzKHNbMF0pO1xuICAgIGxldCBzdGF0ZW1lbnQgPSBTdGF0ZW1lbnQuZnJvbVNwZWMocywgdGVtcGxhdGVzKTtcblxuICAgIGlmIChzdGF0ZW1lbnQgaW5zdGFuY2VvZiBCbG9jaykge1xuICAgICAgaWYgKHN0YXRlbWVudC50ZW1wbGF0ZXMuZGVmYXVsdCkgY2hpbGRyZW4ucHVzaChzdGF0ZW1lbnQudGVtcGxhdGVzLmRlZmF1bHQpO1xuICAgICAgaWYgKHN0YXRlbWVudC50ZW1wbGF0ZXMuaW52ZXJzZSkgY2hpbGRyZW4ucHVzaChzdGF0ZW1lbnQudGVtcGxhdGVzLmludmVyc2UpO1xuICAgIH1cblxuICAgIHByb2dyYW0uYXBwZW5kKHN0YXRlbWVudCk7XG4gIH0pO1xuXG4gIHJldHVybiB7IHByb2dyYW0sIGNoaWxkcmVuIH07XG59Il19