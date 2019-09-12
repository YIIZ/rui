import compute from 'compute-js'

export function value(inital) {
  const state = compute.value(inital)
  return [state, state.set]
}
export function isCompute(v) {
  return v && typeof v.computeName === 'string'
}


// convenience methods
export function each(value, fn) {
  const c = compute(() => value().map(fn))
  c.__each = true
  return c
}
function _if(value, fn) {
  // pre-create them for cache purpose
  const one = [1]
  const zero = []
  return each(compute(() => value() ? one : zero), fn)
}
export function unless(value, fn) {
  return _if(compute(() => !value()), fn)
}

export { _if as if, compute }
