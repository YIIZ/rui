import { watchState } from './core'

const toNodes = (data) => {
  const array = Array.isArray(data) ? data
    : (data === null || typeof data === 'undefined') ? []
    : [data]

  return array.map((v) => v instanceof Node ? v : document.createTextNode(v))
}


export const h = (name, props, ...children) => {
  if (typeof name === 'string') {
    const el = document.createElement(name)

    if (props)
    for (const [key, value] of Object.entries(props)) {
      if (typeof value === 'function') {
        el.setAttribute(key, value())
        watchState(value, () => el.setAttribute(key, value()))
      } else {
        el.setAttribute(key, value)
      }
    }

    for (const child of children) {
      if (typeof child === 'function') {
        const anchor = document.createTextNode('')
        el.append(anchor)

        let nodes = toNodes(child())
        anchor.after(...nodes)
        // use compute?
        watchState(child, () => {
          nodes.forEach(el => el.remove())
          nodes = toNodes(child())
          anchor.after(...nodes)
        })
      } else {
        const nodes = toNodes(child)
        el.append(...nodes)
      }
    }
    return el
  } else {
    return name(h, props, ...children)
  }
}
export default h
