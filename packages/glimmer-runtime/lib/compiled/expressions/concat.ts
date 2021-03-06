import { CompiledExpression } from '../expressions';
import VM from '../../vm';
import { PathReference, ChainableReference } from 'glimmer-reference';

export default class CompiledConcat {
  public type = "concat";
  public parts: CompiledExpression[];

  constructor({ parts }: { parts: CompiledExpression[] }) {
    this.parts = parts;
  }

  evaluate(vm: VM): ConcatReference {
    let parts = this.parts.map(p => p.evaluate(vm));
    return new ConcatReference(parts);
  }
}

class ConcatReference implements ChainableReference {
  private parts: PathReference[];

  constructor(parts: PathReference[]) {
    this.parts = parts;
  }

  isDirty() {
    return true;
  }

  value() {
    return this.parts.map(p => p.value()).join('');
  }

  destroy() {}
}
