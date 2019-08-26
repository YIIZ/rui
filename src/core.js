import compute from 'compute-js'
import * as rx from 'rxjs'
import * as op from 'rxjs/operators'

window.compute = compute

// computes
export function useState(inital) {
  const state = new rx.BehaviorSubject(inital)
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
  const obs = deps.map(v => rx.isObservable(v) ? v : [v])
  return rx.combineLatest(obs)
    .pipe(op.map((values) => callback(...values)))
    // cache
}
