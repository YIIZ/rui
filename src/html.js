import { Node } from './core'

export const h = (name, props, ...children) => {
  if (typeof name === 'string') {
    const el = document.createElement(name)

    for (const child of children) {
      const childEl = child instanceof Node
        ? child.el
        : document.createTextNode(child)

      el.appendChild(childEl)
    }

    const node = new Node(el, children)
    return node
  } else {
    return name(h, props, ...children)
  }
}
export default h
