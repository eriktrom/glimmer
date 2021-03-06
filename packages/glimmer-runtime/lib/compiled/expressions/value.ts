import VM from '../../vm';
import { CompiledExpression } from '../expressions';
import { ConstReference, PathReference } from 'glimmer-reference';
import { InternedString, Dict } from 'glimmer-util';

export default class CompiledValue implements CompiledExpression {
  public type = "value";
  private reference: ValueReference;

  constructor({ value }: { value: any }) {
    this.reference = new ValueReference(value);
  }

  clone() {
    return new CompiledValue({ value: this.reference.value() });
  }

  evaluate(vm: VM): PathReference {
    return this.reference;
  }
}

class ValueReference extends ConstReference<any> implements PathReference {
  protected inner: any;
  protected children: Dict<ValueReference>;

  get(key: InternedString) {
    let { children } = this;
    let child = children[<string>key];

    if (!child) {
      child = children[<string>key] = new ValueReference(this.inner[<string>key]);
    }

    return child;
  }

  isDirty() { return false; }
  value(): any { return this.inner; }
  destroy() {}
}