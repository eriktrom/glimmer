import { CompiledExpression } from '../expressions';
import VM from '../../vm';
import { InternedString } from 'glimmer-util';
import { PathReference, referenceFromParts } from 'glimmer-reference';

export class CompiledLocalRef implements CompiledExpression {
  public type = "local-ref";
  private symbol: number;
  private lookup: InternedString[];

  constructor({ symbol, lookup }: { symbol: number, lookup: InternedString[] }) {
    this.symbol = symbol;
    this.lookup = lookup;
  }

  evaluate(vm: VM): PathReference {
    let base: PathReference = vm.referenceForSymbol(this.symbol);
    return referenceFromParts(base, this.lookup);
  }
}

export class CompiledSelfRef implements CompiledExpression {
  public type = "self-ref";
  private parts: InternedString[];

  constructor({ parts }: { parts: InternedString[] }) {
    this.parts = parts;
  }

  evaluate(vm: VM): PathReference {
    return referenceFromParts(vm.getSelf(), this.parts);
  }
}
