import { Opcode, UpdatingOpcode } from '../../opcodes';
import { VM, UpdatingVM } from '../../vm';
import { PathReference } from 'glimmer-reference';
import Bounds, { clear } from '../../bounds';

abstract class ContentOpcode implements Opcode {
  public type: string;
  public next = null;
  public prev = null;

  abstract evaluate(vm: VM);
}

abstract class UpdatingContentOpcode implements UpdatingOpcode {
  public type: string;
  public next = null;
  public prev = null;

  abstract evaluate(vm: UpdatingVM);
}

export class AppendOpcode extends ContentOpcode {
  evaluate(vm: VM) {
    let reference = vm.frame.getOperand();
    let value = reference.value();
    let node = vm.stack().appendText(value);
    vm.updateWith(new UpdateAppendOpcode(reference, value, node));
  }
}

export class UpdateAppendOpcode extends UpdatingContentOpcode {
  private reference: PathReference;
  private lastValue: string;
  private textNode: Text;

  constructor(reference: PathReference, lastValue: string, textNode: Text) {
    super();
    this.reference = reference;
    this.lastValue = lastValue;
    this.textNode = textNode;
  }

  evaluate() {
    let val = this.reference.value();

    if (val !== this.lastValue) {
      this.lastValue = this.textNode.nodeValue = val;
    }
  }
}

export class TrustingAppendOpcode extends ContentOpcode {
  evaluate(vm: VM) {
    let reference = vm.frame.getOperand();
    let value = reference.value();

    let bounds = vm.stack().insertHTMLBefore(null, value);
    vm.updateWith(new UpdateTrustingAppendOpcode(reference, value, bounds));
  }
}

export class UpdateTrustingAppendOpcode extends UpdatingContentOpcode {
  private reference: PathReference;
  private lastValue: string;
  private bounds: Bounds;

  constructor(reference: PathReference, lastValue: string, bounds: Bounds) {
    super();
    this.reference = reference;
    this.lastValue = lastValue;
    this.bounds = bounds;
  }

  evaluate(vm: UpdatingVM) {
    let val = this.reference.value();

    if (val !== this.lastValue) {
      let parent = <HTMLElement>this.bounds.parentElement();
      let nextSibling = clear(this.bounds);
      this.bounds = vm.dom.insertHTMLBefore(parent, nextSibling, val);
    }
  }
}