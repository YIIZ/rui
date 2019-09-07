import compute from 'compute-js'

// TODO if unless each
export { compute }
export { _if as if }
function _if(value, fn) {}

export function value(inital) {
  const state = compute.value(inital)
  return [state, state.set]
}
export function isCompute(v) {
  return typeof v?.computeName === 'string'
}
