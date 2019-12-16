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

// call function without dependencies
// c.peek() not working, c's deps will bind to c's parent
export function peek(fn) {
  const c = compute(fn)
  const tmp = () => {}
  c.onChange(tmp)
  const out = c()
  c.offChange(tmp)
  return out
}


// convenience methods
export function replace(value) {
  // TODO `dep()` in compute
  const v = compute(value)
  v.__replace = true
  return v
}
export function each(value, fn) {
  // cache value
  // TODO key?
  const v = compute(value)
  return replace(() => {
    const list = v()
    return peek(() => list.map(fn))
  })
}
function _if(value, fn) {
  const v = compute(value) // any value to compute
  const bool = compute(() => !!v()) // to bool
  return replace(() => bool() ? peek(fn) : null)
}
export function unless(value, fn) {
  const v = compute(value)
  const bool = compute(() => !v())
  return replace(() => bool() ? peek(fn) : null)
}

export { _if as if, compute }
