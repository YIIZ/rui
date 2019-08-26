import { BehaviorSubject, isObservable, combineLatest } from 'rxjs'
import { map } from 'rxjs/operators'


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
