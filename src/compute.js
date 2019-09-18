import compute from 'compute-js'

export function value(inital) {
  const state = compute.value(inital)
  return [state, state.set]
}
export function isCompute(v) {
  return v && typeof v.computeName === 'string'
}
export function isReplace(v) {
  return isCompute(v) && v.__replace
}


// convenience methods
export function replace(value) {
  // TODO `dep()` in compute
  const v = compute(value)
  v.__replace = true
  return v
}
export function each(value, fn) {
  return replace(() => value().map(fn))
}
function _if(value, fn) {
  return replace(() => value() ? fn() : null)
}
export function unless(value, fn) {
  return _if(() => !value(), fn)
}

export { _if as if, compute }
