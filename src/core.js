import compute from 'compute-js'

window.compute = compute

// export class Node {
//   constructor(el, children, onAttached) {
//     this.el = el
//     this.children = children.filter(c => c instanceof Node)
//     this._onAttached = onAttached
//   }

//   onAttached() {
//     this._onDetached = this._onAttached?.()
//     for (const child of this.children) {
//       child.onAttached()
//     }
//   }
//   onDetached() {
//     this._onDetached?.()
//     for (const child of this.children) {
//       child.onDetached()
//     }
//   }
// }

// computes
export function useState(inital) {
  const state = compute.value(inital)
  const { get, set } = state
  // get has no watch hook
  return [ state, set ]
}

export const valueOf = (value) => typeof value === 'function' ? value() : value

export function watchState(state, callback) {
  if (state.onChange) {
    state.onChange(callback)
  }
  return () => {
    if (state.offChange) {
      state.offChange(callback)
    }
  }
}

export function useCompute(callback) {
  return compute(callback)
}
