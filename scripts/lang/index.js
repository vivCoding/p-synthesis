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
export var Type;
(function (Type) {
    Type["NUMBER"] = "number";
})(Type || (Type = {}));
export class ASTNode {
    holes;
    rules;
    parent;
    constructor() {
        this.holes = {};
        this.rules = {};
    }
    run(context) {
        throw `${this.constructor.name}: run not implemented`;
    }
    toString() {
        throw `${this.constructor.name}: toString not implemented`;
    }
    produceForHole(holeName, context) {
        // produce corresponding new nodes for the specified hole
        if (!this.rules[holeName])
            return [];
        return this.rules[holeName].map((rule) => new rule());
    }
    deepClone() {
        // https://stackoverflow.com/questions/41474986/how-to-clone-a-javascript-es6-class-instance
        const copy = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
        copy.holes = {};
        for (const [key, val] of Object.entries(this.holes)) {
            copy.holes[key] = val ? val.deepClone() : undefined;
        }
        return copy;
    }
    get nodeName() {
        return this.constructor.name;
    }
}
export class Expr extends ASTNode {
    type;
    constructor(type) {
        super();
        this.type = type;
        this.holes = { value: undefined };
        this.rules = { value: [Index, AMath] };
    }
    run(context) {
        if (!this.holes.value)
            throw "expr: run, no value defined";
        return this.holes.value.run(context);
    }
    toString() {
        return this.holes.value ? this.holes.value.toString() : this.constructor.name;
    }
}
export class Term extends ASTNode {
    type;
    value;
    constructor(type, value) {
        super();
        this.type = type;
        this.value = value;
    }
    toString() {
        return this.value;
    }
}
export class Index extends Expr {
    constructor(idx) {
        super();
        this.holes = {
            idx,
        };
        this.rules = {
            idx: [IndexConstant],
        };
    }
    run(context) {
        if (this.holes.idx === undefined)
            throw "index: idx not defined";
        if (!context.arr || !context.arr.length)
            throw "index: no context arr defined";
        return context.arr[this.holes.idx.run(context)];
    }
    produceForHole(holeName, context) {
        // produce new constant nodes where each value is an index in the input array
        if (holeName !== "idx")
            return [];
        if (!context.inputLength)
            throw "index: no inputLength defined";
        const nodes = [];
        for (let i = 0; i < context.inputLength; i++) {
            nodes.push(new IndexConstant(i));
        }
        return nodes;
    }
    toString() {
        return `arr[${this.holes.idx?.toString()}]`;
    }
}
export class IndexConstant extends Term {
    constructor(idx) {
        super(Type.NUMBER, idx);
    }
    run(context) {
        if (this.value === undefined)
            throw `indexConstant: no term value`;
        return this.value;
    }
    toString() {
        return this.value;
    }
}
export class AMath extends Expr {
    constructor() {
        super();
        this.holes = { value: undefined };
        this.rules = { value: [Add, Sub, Mul, Div] };
    }
    run(context) {
        if (!this.holes.value)
            throw "math: run, no value defined";
        return this.holes.value.run(context);
    }
    toString() {
        return this.holes.value ? this.holes.value.toString() : this.constructor.name;
    }
}
export class BinaryOp extends Expr {
    constructor(a, b) {
        super(Type.NUMBER);
        this.holes = { a, b };
        this.rules = {
            a: [Expr],
            b: [Expr],
        };
    }
}
export class Add extends BinaryOp {
    constructor(a, b) {
        super(a, b);
    }
    run(context) {
        if (!this.holes.a || !this.holes.b)
            throw "add: params not defined";
        return Math.floor(this.holes.a.run(context) + this.holes.b.run(context));
    }
    toString() {
        return `(${this.holes.a?.toString()} + ${this.holes.b?.toString()})`;
    }
}
export class Sub extends BinaryOp {
    constructor(a, b) {
        super(a, b);
    }
    run(context) {
        if (!this.holes.a || !this.holes.b)
            throw "sub: params not defined";
        return Math.floor(this.holes.a.run(context) - this.holes.b.run(context));
    }
    toString() {
        return `(${this.holes.a?.toString()} - ${this.holes.b?.toString()})`;
    }
}
export class Mul extends BinaryOp {
    constructor(a, b) {
        super(a, b);
    }
    run(context) {
        if (!this.holes.a || !this.holes.b)
            throw "mul: params not defined";
        return Math.floor(this.holes.a.run(context) * this.holes.b.run(context));
    }
    toString() {
        return `(${this.holes.a?.toString()} * ${this.holes.b?.toString()})`;
    }
}
export class Div extends BinaryOp {
    constructor(a, b) {
        super(a, b);
    }
    run(context) {
        if (!this.holes.a || !this.holes.b)
            throw "div: params not defined";
        return Math.floor(this.holes.a.run(context) / this.holes.b.run(context));
    }
    toString() {
        return `(${this.holes.a?.toString()} / ${this.holes.b?.toString()})`;
    }
}
export const GRAMMAR_START = [Expr];
