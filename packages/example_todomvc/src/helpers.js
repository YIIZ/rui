import { isCompute, compute, value } from 'rui'

const val = (v) => isCompute(v) ? v() : v

export function classNames(obj) {
  const keys = Object.keys(obj)
  const values = Object.values(obj)

  return compute(() => keys.filter((_, i) => !!val(values[i])).join(' '))
}
