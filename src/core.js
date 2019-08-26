import compute from 'compute-js'

export class Node {
  constructor(el, children, onAttached) {
    this.el = el
    this.children = children.filter(c => c instanceof Node)
    this._onAttached = onAttached
  }

  onAttached() {
    this._onDetached = this._onAttached?.()
    for (const child of this.children) {
      child.onAttached()
    }
  }
  onDetached() {
    this._onDetached?.()
    for (const child of this.children) {
      child.onDetached()
    }
  }
}

// computes
class State {
  constructor(v) {
    this.v = v
  }
  valueOf() {
    return this.v()
  }
  toString() {
    return `${this.v()}`
  }
  watch(cb) {
    this.v.onChange(cb)
    return () => this.v.offChange(cb)
  }
}


export function useState(inital) {
  const state = new State(compute.value(inital))
  const set = (newValue) => state.v(newValue)
  return [state, set]
}

export function watchState(state, callback) {
  if (state instanceof State) {
    state.watch(callback)
  }
}

export function useCompute(callback) {
  return new State(compute(callback))
}
