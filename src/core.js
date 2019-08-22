import compute from 'compute-js'

export class Node {
  constructor(el, children) {
    this.el = el
    this.children = children
  }

  onAttached() {
  }
  onDetached() {
  }
}

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
