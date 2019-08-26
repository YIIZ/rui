import { Node, useState, watchState } from './core'


const createPrimitive = value => {
  const primitive = document.createTextNode(value)
  watchState(value, () => primitive.data = value)
  return primitive
}

const applyProp = (el, key, value) => {
  el.setAttribute(key, value)
  watchState(value, () => el.setAttribute(key, value))
}


export const h = (name, props, ...children) => {
  if (typeof name === 'string') {
    const el = document.createElement(name)

    const { onAttached, ...otherProps } = props || {}
    for (const [key, value] of Object.entries(otherProps)) {
      applyProp(el, key, value)
    }

    for (const child of children) {
      // const childEl = child instanceof Node ? child.el : createPrimitive(child)
      const childEl = child instanceof Element ? child : createPrimitive(child)
      console.log(childEl, child, child.valueOf())
      el.appendChild(childEl)
    }

    // const node = new Node(el, children, onAttached)
    return el
  } else {
    return name(h, props, ...children)
  }
}
export default h
