import { BehaviorSubject, isObservable, combineLatest } from 'rxjs'
import { map } from 'rxjs/operators'

export class Node {
  constructor(el, children, onAttached, onDetached) {
    this._attached = false
    this.el = el
    this.children = children
    this.onAttached = onAttached
    this.onDetached = onDetached
  }

  attached() {
    this._attached = true
    for (const child of this.children) {
      child.attached()
    }
  }
  detached() {
    this._attached = false
    for (const child of this.children) {
      child.detached()
    }
  }
}


// computes
export function useState(inital) {
  const state = new BehaviorSubject(inital)
  const set = (v) => state.next(v)
  return [ state, set ]
}

export function watchState(state, callback) {
  if (state.subscribe) {
    state.subscribe(callback)
  }
  return () => {
    if (state.unsubscribe) {
      state.unsubscribe(callback)
    }
  }
}

export function useCompute(callback, deps) {
  const obs = deps.map(v => isObservable(v) ? v : [v])
  return combineLatest(obs)
    .pipe(map((values) => callback(...values)))
    // cache
}

export function useEffect(callback/*, deps*/) {
}

