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
  constructor(inital) {
    this.v = compute.value(inital)
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
  const state = new State(inital)
  const set = (newValue) => state.v(newValue)
  return [state, set]
}

export function watchState(state, callback) {
  if (state instanceof State) {
    state.watch(callback)
  }
}
