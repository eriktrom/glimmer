import { PropertyReference } from './references/descriptors';
import RootReference from './references/root';
import { MetaOptions } from './types';
import { InternedString } from 'glimmer-util';

import { Dict, DictSet, HasGuid, Set, dict } from 'glimmer-util';

import {
  RootReferenceFactory,
  PathReferenceFactory,
  PathReference as IPathReference,
  Meta as IMeta,
  RootReference as IRootReference
} from './types';

import { InnerReferenceFactory } from './references/descriptors';

const NOOP_DESTROY = { destroy() {} };

class ConstPath implements IPathReference {
  private parent: any;
  private property: InternedString;

  constructor(parent: any, property: InternedString) {
    this.parent = parent;
  }

  chain() { return NOOP_DESTROY; }
  isDirty() { return false; }
  destroy() {}
  notify() {}

  value() {
    return this.parent[<string>this.property];
  }

  get(prop: InternedString): IPathReference {
    return new ConstPath(this.parent[<string>this.property], prop);
  }
}

class ConstRoot implements IRootReference {
  private inner: any;
  private dirty = false;

  constructor(value) {
    this.inner = value;
  }

  update(inner: any) {
    this.inner = inner;
    this.dirty = true;
  }

  chain() { return NOOP_DESTROY; }
  isDirty() { return this.dirty; }
  destroy() {}
  notify() {}

  value(): any {
    this.dirty = false;
    return this.inner;
  }

  referenceFromParts(parts: InternedString[]): IPathReference {
    throw new Error("Not implemented");
  }

  chainFor(prop: InternedString): IPathReference {
    throw new Error("Not implemented");
  }

  get(prop: InternedString): IPathReference {
    return new ConstPath(this.inner, prop);
  }
}

class ConstMeta /*implements IMeta*/ {
  private object: any;

  constructor(object: any) {
    this.object = object;
  }

  root(): IRootReference {
    return new ConstRoot(this.object);
  }
}

export const CLASS_META = "df8be4c8-4e89-44e2-a8f9-550c8dacdca7";

const hasOwnProperty = Object.hasOwnProperty;

class Meta implements IMeta, HasGuid {
  static for(obj: any): IMeta {
    if (obj === null || obj === undefined) return new Meta(obj, {});
    if (hasOwnProperty.call(obj, '_meta') && obj._meta) return obj._meta;
    if (!Object.isExtensible(obj)) return <any>new ConstMeta(obj);

    let MetaToUse: typeof Meta = Meta;

    if (obj.constructor && obj.constructor[<string>CLASS_META]) {
      let classMeta: ClassMeta = obj.constructor[<string>CLASS_META];
      MetaToUse = classMeta.InstanceMetaConstructor;
    } else if (obj[<string>CLASS_META]) {
      MetaToUse = obj[<string>CLASS_META].InstanceMetaConstructor;
    }

    return (obj._meta = new MetaToUse(obj, {}));
  }

  static exists(obj: any): boolean {
    return typeof obj === 'object' && obj._meta;
  }

  static metadataForProperty(key: InternedString): any {
    return null;
  }

  private object: any;
  private RootReferenceFactory: RootReferenceFactory;
  private DefaultPathReferenceFactory: InnerReferenceFactory;
  private rootCache: IRootReference;
  private references: Dict<DictSet<IPathReference & HasGuid>> = null;
  public _guid;
  protected slots: Dict<any> = null;
  protected referenceTypes: Dict<InnerReferenceFactory> = null;
  protected propertyMetadata: Dict<any> = null;

  constructor(object: any, { RootReferenceFactory, DefaultPathReferenceFactory }: MetaOptions) {
    this.object = object;
    this.RootReferenceFactory = RootReferenceFactory || RootReference;
    this.DefaultPathReferenceFactory = DefaultPathReferenceFactory || PropertyReference;
  }

  addReference(property: InternedString, reference: IPathReference & HasGuid) {
    var refs = this.references = this.references || dict<DictSet<IPathReference & HasGuid>>();
    var set = refs[<string>property] = refs[<string>property] || new DictSet<IPathReference & HasGuid>();
    set.add(reference);
  }

  addReferenceTypeFor(property: InternedString, type: PathReferenceFactory) {
    this.referenceTypes = this.referenceTypes || dict<PathReferenceFactory>();
    this.referenceTypes[<string>property] = type;
  }

  referenceTypeFor(property: InternedString): InnerReferenceFactory {
    if (!this.referenceTypes) return PropertyReference;
    return this.referenceTypes[<string>property] || PropertyReference;
  }

  removeReference(property: InternedString, reference: IPathReference & HasGuid) {
    if (!this.references) return;
    var set = this.references[<string>property];
    set.delete(reference);
  }

  getReferenceTypes(): Dict<InnerReferenceFactory> {
    this.referenceTypes = this.referenceTypes || dict<PathReferenceFactory>();
    return this.referenceTypes;
  }

  referencesFor(property: InternedString): Set<IPathReference> {
    if (!this.references) return;
    return this.references[<string>property];
  }

  getSlots() {
    return (this.slots = this.slots || dict());
  }

  root(): IRootReference {
    return (this.rootCache = this.rootCache || new this.RootReferenceFactory(this.object));
  }
}

export default Meta;

interface ClassMeta {
  InstanceMetaConstructor: typeof Meta;
}

export function metaFor(obj: any): IMeta {
  return Meta.for(obj);
}
