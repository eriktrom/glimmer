import { NULL_REFERENCE } from '../../references';
import { CompiledExpression } from '../expressions';
import VM from '../../vm';
import { PathReference } from 'glimmer-reference';

export abstract class CompiledPositionalArgs {
  static create({ values }: { values: CompiledExpression[] }): CompiledPositionalArgs {
    if (values.length) {
      return new CompiledNonEmptyPositionalArgs({ values });
    } else {
      return COMPILED_EMPTY_POSITIONAL_ARGS;
    }
  }

  public type: string;
  abstract evaluate(vm: VM): EvaluatedPositionalArgs;
}

class CompiledNonEmptyPositionalArgs extends CompiledPositionalArgs {
  public type = "named-args";
  public values: CompiledExpression[];

  constructor({ values }: { values: CompiledExpression[] }) {
    super();
    this.values = values;
  }

  evaluate(vm: VM): EvaluatedPositionalArgs {
    let { values } = this;

    let valueReferences = values.map((value, i) => {
      return <PathReference>value.evaluate(vm);
    });

    return EvaluatedPositionalArgs.create({ values: valueReferences });
  }
}

export const COMPILED_EMPTY_POSITIONAL_ARGS = new (class extends CompiledPositionalArgs {
  public type = "empty-named-args";

  evaluate(vm): EvaluatedPositionalArgs {
    return EvaluatedPositionalArgs.empty();
  }
});

export abstract class EvaluatedPositionalArgs {
  static empty(): EvaluatedPositionalArgs {
    return EVALUATED_EMPTY_POSITIONAL_ARGS;
  }

  static create({ values }: { values: PathReference[] }) {
    return new NonEmptyEvaluatedPositionalArgs({ values });
  }

  public type: string;
  public values: PathReference[];

  forEach(callback: (value: PathReference) => void) {
    let values = this.values;
    values.forEach((key, i) => callback(values[i]));
  }

  abstract at(index: number): PathReference;
  abstract value(): any[];
}

class NonEmptyEvaluatedPositionalArgs extends EvaluatedPositionalArgs {
  public values: PathReference[];

  constructor({ values }: { values: PathReference[] }) {
    super();
    this.values = values;
  }

  at(index: number): PathReference {
    return this.values[index];
  }

  value(): any[] {
    return this.values.map(v => v.value());
  }
}

export const EVALUATED_EMPTY_POSITIONAL_ARGS = new (class extends EvaluatedPositionalArgs {
  at(): PathReference {
    return NULL_REFERENCE;
  }

  value(): any[] {
    return null;
  }
});