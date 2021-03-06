import { Opcode, UpdatingOpcode, UnflattenedOpcode } from '../../opcodes';
import { VM, UpdatingVM } from '../../vm';
import { BindArgsOpcode, NoopOpcode } from '../../compiled/opcodes/vm';
import { EvaluatedArgs } from '../expressions/args';
import { ListRange, Range } from '../../utils';
import { LITERAL, ListSlice, Slice, Dict, InternedString, assert } from 'glimmer-util';
import { RootReference, ConstReference, ListManager, ListDelegate } from 'glimmer-reference';

abstract class ListOpcode implements Opcode {
  public type: string;
  public next = null;
  public prev = null;

  abstract evaluate(vm: VM);
}

abstract class ListUpdatingOpcode implements UpdatingOpcode {
  public type: string;
  public next = null;
  public prev = null;

  abstract evaluate(vm: UpdatingVM);
}

export class EnterListOpcode extends ListOpcode {
  public type = "enter-list";

  private slice: Slice<Opcode>;

  constructor(start: NoopOpcode, end: NoopOpcode) {
    super();
    this.slice = new ListSlice(start, end);
  }

  evaluate(vm: VM) {
    let listRef = vm.frame.getOperand();
    let keyPath = vm.frame.getArgs().named.get(LITERAL("key")).value();

    let manager =  new ListManager(<RootReference>listRef /* WTF */, keyPath);
    let delegate = new IterateDelegate(vm);

    vm.frame.setIterator(manager.iterator(delegate));

    vm.enterList(manager, this.slice);
  }
}

export class ExitListOpcode extends ListOpcode {
  public type = "exit-list";

  evaluate(vm: VM) {
    vm.exitList();
  }
}

export class EnterWithKeyOpcode extends ListOpcode {
  public type = "enter-with-key";

  private slice: Slice<Opcode>;

  constructor(start: NoopOpcode, end: NoopOpcode) {
    super();
    this.slice = new ListSlice(start, end);
  }

  evaluate(vm: VM) {
    vm.enterWithKey(vm.frame.getKey(), this.slice);
  }
}

const TRUE_REF = new ConstReference(true);
const FALSE_REF = new ConstReference(false);

class IterateDelegate implements ListDelegate {
  private vm: VM;

  constructor(vm: VM) {
    this.vm = vm;
  }

  insert(key: InternedString, item: RootReference, before: InternedString) {
    let { vm } = this;

    assert(!before, "Insertion should be append-only on initial render");

    vm.frame.setArgs(EvaluatedArgs.positional([item]));
    vm.frame.setOperand(item);
    vm.frame.setCondition(TRUE_REF);
    vm.frame.setKey(key);
  }

  retain(key: InternedString, item: RootReference) {
    assert(false, "Insertion should be append-only on initial render");
  }

  move(key: InternedString, item: RootReference, before: InternedString) {
    assert(false, "Insertion should be append-only on initial render");
  }

  delete(key: InternedString) {
    assert(false, "Insertion should be append-only on initial render");
  }

  done() {
    this.vm.frame.setCondition(FALSE_REF);
  }
}

export class NextIterOpcode extends ListOpcode {
  public type = "next-iter";

  private end: NoopOpcode;

  constructor(end: NoopOpcode) {
    super();
    this.end = end;
  }

  evaluate(vm: VM) {
    if (vm.frame.getIterator().next()) {
      vm.goto(this.end);
    }
  }
}

class ReiterateOpcode extends ListUpdatingOpcode {
  public type = "reiterate";

  private initialize: (vm: VM) => void;

  constructor(initialize: (vm: VM) => void) {
    super();
    this.initialize = initialize;
  }

  evaluate(vm: UpdatingVM) {
    vm.throw(this.initialize);
  }
}