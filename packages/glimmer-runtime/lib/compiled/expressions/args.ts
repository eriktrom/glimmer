import { COMPILED_EMPTY_POSITIONAL_ARGS, EVALUATED_EMPTY_POSITIONAL_ARGS, CompiledPositionalArgs, EvaluatedPositionalArgs } from './positional-args';
import { COMPILED_EMPTY_NAMED_ARGS, EVALUATED_EMPTY_NAMED_ARGS, CompiledNamedArgs, EvaluatedNamedArgs } from './named-args';
import VM from '../../vm';
import { PathReference } from 'glimmer-reference';

interface CompiledArgOptions {
  positional: CompiledPositionalArgs;
  named: CompiledNamedArgs;
}

export abstract class CompiledArgs {
  public type: string;
  public positional: CompiledPositionalArgs;
  public named: CompiledNamedArgs;

  static create({ positional, named }: CompiledArgOptions): CompiledArgs {
    if (positional === COMPILED_EMPTY_POSITIONAL_ARGS && named ===  COMPILED_EMPTY_NAMED_ARGS) {
      return COMPILED_EMPTY_ARGS;
    } else {
      return new CompiledNonEmptyArgs({ positional, named });
    }
  }

  static empty(): CompiledArgs {
    return COMPILED_EMPTY_ARGS;
  }

  abstract evaluate(vm: VM): EvaluatedArgs;
}

class CompiledNonEmptyArgs extends CompiledArgs {
  public type = "named-args";
  public positional: CompiledPositionalArgs;
  public named: CompiledNamedArgs;

  constructor({ positional, named }: CompiledArgOptions) {
    super();
    this.positional = positional;
    this.named = named;
  }

  evaluate(vm: VM): EvaluatedArgs {
    return EvaluatedArgs.create({
      positional: this.positional.evaluate(vm),
      named: this.named.evaluate(vm)
    });
  }
}

export const COMPILED_EMPTY_ARGS = new (class extends CompiledArgs {
  public type = "empty-named-args";

  evaluate(vm): EvaluatedArgs {
    return EvaluatedArgs.empty();
  }
});

interface EvaluatedArgsOptions {
  positional: EvaluatedPositionalArgs;
  named: EvaluatedNamedArgs;
}

export abstract class EvaluatedArgs {
  static empty(): EvaluatedArgs {
    return EMPTY_EVALUATED_ARGS;
  }

  static create(options: EvaluatedArgsOptions): EvaluatedArgs {
    return new NonEmptyEvaluatedArgs(options);
  }

  static positional(values: PathReference[]): EvaluatedArgs {
    return new NonEmptyEvaluatedArgs({ positional: EvaluatedPositionalArgs.create({ values }), named: EvaluatedNamedArgs.empty() });
  }

  public type: string;
  public positional: EvaluatedPositionalArgs;
  public named: EvaluatedNamedArgs;
}

class NonEmptyEvaluatedArgs extends EvaluatedArgs {
  constructor({ positional, named }: EvaluatedArgsOptions) {
    super();
    this.positional = positional;
    this.named = named;
  }
}

export const EMPTY_EVALUATED_ARGS = new (class extends EvaluatedArgs {
  public positional = EVALUATED_EMPTY_POSITIONAL_ARGS;
  public named = EVALUATED_EMPTY_NAMED_ARGS;
});

export { CompiledPositionalArgs, EvaluatedPositionalArgs, CompiledNamedArgs, EvaluatedNamedArgs };