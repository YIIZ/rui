import compute from 'compute-js'

export function value(inital) {
  const state = compute.value(inital)
  return [state, state.set]
}
export function isCompute(v) {
  return typeof v?.computeName === 'string'
}


// convenience methods
export function each(value, fn) {
  const c = compute(() => value().map(fn))
  c.__each = true
  return c
}
function _if(value, fn) {
  return each(compute(() => value() ? [null] : []), fn)
}
export function unless(value, fn) {
  return _if(compute(() => !value()), fn)
}

export { _if as if, compute }
