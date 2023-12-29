/*
grammar:

S = expr
expr =
  index idxConst
  | math
math =
  add expr expr
  | sub expr expr
  | mul expr expr
  | div expr expr
idxConst = 0....n

*/

export enum Type {
  NUMBER = "number",
}

type Context = Record<string, any>

export class ASTNode {
  holes: Record<string, ASTNode | undefined>
  rules: Record<string, (typeof ASTNode)[]>
  parent: ASTNode | undefined

  constructor() {
    this.holes = {}
    this.rules = {}
  }

  run(context: Context): number {
    throw `${this.constructor.name}: run not implemented`
  }

  toString(): string {
    throw `${this.constructor.name}: toString not implemented`
  }

  produceForHole(holeName: string, context: Context): ASTNode[] {
    // produce corresponding new nodes for the specified hole
    if (!this.rules[holeName]) return []
    return this.rules[holeName].map((rule) => new rule())
  }

  deepClone(): ASTNode {
    // https://stackoverflow.com/questions/41474986/how-to-clone-a-javascript-es6-class-instance
    const copy: ASTNode = Object.assign(Object.create(Object.getPrototypeOf(this)), this)
    copy.holes = {}
    for (const [key, val] of Object.entries(this.holes)) {
      copy.holes[key] = val ? val.deepClone() : undefined
    }
    return copy
  }

  get nodeName() {
    return this.constructor.name
  }
}

export class Expr extends ASTNode {
  type?: Type

  constructor(type?: Type) {
    super()
    this.type = type
    this.holes = { value: undefined }
    this.rules = { value: [Index, AMath] }
  }

  run(context: Context): number {
    if (!this.holes.value) throw "expr: run, no value defined"
    return this.holes.value.run(context)
  }

  toString(): string {
    return this.holes.value ? this.holes.value.toString() : this.constructor.name
  }
}

export class Term extends ASTNode {
  type?: Type
  value?: any

  constructor(type?: Type, value?: any) {
    super()
    this.type = type
    this.value = value
  }

  toString(): string {
    return this.value
  }
}

export class Index extends Expr {
  constructor(idx?: IndexConstant) {
    super()
    this.holes = {
      idx,
    }
    this.rules = {
      idx: [IndexConstant],
    }
  }

  run(context: Context): number {
    if (this.holes.idx === undefined) throw "index: idx not defined"
    if (!context.arr || !context.arr.length) throw "index: no context arr defined"
    return context.arr[this.holes.idx.run(context)]
  }

  produceForHole(holeName: string, context: Context): ASTNode[] {
    // produce new constant nodes where each value is an index in the input array
    if (holeName !== "idx") return []
    if (!context.inputLength) throw "index: no inputLength defined"
    const nodes: IndexConstant[] = []
    for (let i = 0; i < context.inputLength; i++) {
      nodes.push(new IndexConstant(i))
    }
    return nodes
  }

  toString(): string {
    return `arr[${this.holes.idx?.toString()}]`
  }
}

export class IndexConstant extends Term {
  constructor(idx?: number) {
    super(Type.NUMBER, idx)
  }

  run(context: Context): number {
    if (this.value === undefined) throw `indexConstant: no term value`
    return this.value
  }

  toString(): string {
    return this.value
  }
}

export class AMath extends Expr {
  constructor() {
    super()
    this.holes = { value: undefined }
    this.rules = { value: [Add, Sub, Mul, Div] }
  }

  run(context: Context): number {
    if (!this.holes.value) throw "math: run, no value defined"
    return this.holes.value.run(context)
  }

  toString(): string {
    return this.holes.value ? this.holes.value.toString() : this.constructor.name
  }
}

export class BinaryOp extends Expr {
  constructor(a?: Expr, b?: Expr) {
    super(Type.NUMBER)
    this.holes = { a, b }
    this.rules = {
      a: [Expr],
      b: [Expr],
    }
  }
}

export class Add extends BinaryOp {
  constructor(a?: Expr, b?: Expr) {
    super(a, b)
  }

  run(context: Context): number {
    if (!this.holes.a || !this.holes.b) throw "add: params not defined"
    return Math.floor(this.holes.a.run(context) + this.holes.b.run(context))
  }

  toString(): string {
    return `(${this.holes.a?.toString()} + ${this.holes.b?.toString()})`
  }
}

export class Sub extends BinaryOp {
  constructor(a?: Expr, b?: Expr) {
    super(a, b)
  }

  run(context: Context): number {
    if (!this.holes.a || !this.holes.b) throw "sub: params not defined"
    return Math.floor(this.holes.a.run(context) - this.holes.b.run(context))
  }

  toString(): string {
    return `(${this.holes.a?.toString()} - ${this.holes.b?.toString()})`
  }
}

export class Mul extends BinaryOp {
  constructor(a?: Expr, b?: Expr) {
    super(a, b)
  }

  run(context: Context): number {
    if (!this.holes.a || !this.holes.b) throw "mul: params not defined"
    return Math.floor(this.holes.a.run(context) * this.holes.b.run(context))
  }

  toString(): string {
    return `(${this.holes.a?.toString()} * ${this.holes.b?.toString()})`
  }
}

export class Div extends BinaryOp {
  constructor(a?: Expr, b?: Expr) {
    super(a, b)
  }

  run(context: Context): number {
    if (!this.holes.a || !this.holes.b) throw "div: params not defined"
    return Math.floor(this.holes.a.run(context) / this.holes.b.run(context))
  }

  toString(): string {
    return `(${this.holes.a?.toString()} / ${this.holes.b?.toString()})`
  }
}

export const GRAMMAR_START: (typeof ASTNode)[] = [Expr]
