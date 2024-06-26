"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tanh = exports.relu = exports.div = exports.neg = exports.pow = exports.mul = exports.sub = exports.add = exports.Value = void 0;
class Value {
    data;
    _children;
    _op;
    grad = 0;
    _backward = () => { };
    constructor(data, _children = [], _op = '') {
        this.data = data;
        this._children = _children;
        this._op = _op;
    }
    backward() {
        const topo = [];
        const visited = new Set();
        function buildTopo(v) {
            if (!visited.has(v)) {
                visited.add(v);
                for (const child of v._children) {
                    buildTopo(child);
                }
                topo.push(v);
            }
        }
        buildTopo(this);
        this.grad = 1;
        for (const v of topo.reverse()) {
            v._backward();
        }
    }
}
exports.Value = Value;
const add = (...args) => {
    const out = new Value(args.reduce((acc, cur) => acc + cur.data, 0), args, '+');
    function _backward() {
        for (const arg of args) {
            arg.grad += 1 * out.grad;
        }
    }
    out._backward = _backward;
    return out;
};
exports.add = add;
const sub = (a, b) => {
    const out = new Value(a.data - b.data, [a, b], '-');
    function _backward() {
        a.grad += 1 * out.grad;
        b.grad += -1 * out.grad;
    }
    out._backward = _backward;
    return out;
};
exports.sub = sub;
const mul = (...args) => {
    const out = new Value(args.reduce((acc, cur) => acc * cur.data, 1), args, '*');
    function _backward() {
        for (const arg of args) {
            arg.grad += (out.grad * out.data) / arg.data;
        }
    }
    out._backward = _backward;
    return out;
};
exports.mul = mul;
const pow = (a, b) => {
    const out = new Value(a.data ** b.data, [a, b], '**');
    function _backward() {
        a.grad += b.data * a.data ** (b.data - 1) * out.grad;
        b.grad += Math.log(a.data) * a.data ** b.data * out.grad;
    }
    out._backward = _backward;
    return out;
};
exports.pow = pow;
const neg = (a) => {
    const out = new Value(-a.data, [a], '-');
    function _backward() {
        a.grad += -1 * out.grad;
    }
    out._backward = _backward;
    return out;
};
exports.neg = neg;
const div = (a, b) => {
    const out = new Value(a.data / b.data, [a, b], '/');
    function _backward() {
        a.grad += (1 / b.data) * out.grad;
        b.grad += (-a.data / b.data ** 2) * out.grad;
    }
    out._backward = _backward;
    return out;
};
exports.div = div;
const relu = (a) => {
    const out = new Value(a.data < 0 ? 0 : a.data, [a], "relu");
    function _backward() {
        a.grad += (out.data > 0 ? 1 : 0) * out.grad;
    }
    out._backward = _backward;
    return out;
};
exports.relu = relu;
const tanh = (a) => {
    const out = new Value(Math.tanh(a.data), [a], "tanh");
    function _backward() {
        a.grad += (1 - out.data ** 2) * out.grad;
    }
    out._backward = _backward;
    return out;
};
exports.tanh = tanh;
