import compute from 'compute-js'
import { h } from './core'

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
export function each(value, Node) {
  // cache value
  // TODO key?
  const v = compute(value)
  return replace(() => {
    const list = v()
    // <Node item={item} index={index}/>
    return peek(() => list.map((item, index) => h(Node, { item, index })))
  })
}
function _if(value, Node) {
  const v = compute(value) // any value to compute
  const bool = compute(() => !!v()) // to bool
  // <Node/>
  return replace(() => bool() ? peek(() => h(Node)) : null)
}
export function unless(value, Node) {
  const v = compute(value)
  const bool = compute(() => !v())
  return replace(() => bool() ? peek(() => h(Node)) : null)
}

export { _if as if, compute }
