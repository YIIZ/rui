import { createBuilder } from './core'

export const h = createBuilder({
  createElement(name) {
    return document.createElement(name)
  },
  createAnchor() {
    return document.createTextNode('')
  },
  createText(text) {
    return document.createTextNode(text)
  },
  applyProp(el, key, value) {
    el.setAttribute(key, value)
  },
  append(el, ...children) {
    el.append(...children)
  },
  after(el, ref, ...children) {
    ref.after(...children)
  },
  remove(el, target) {
    target.remove()
  },
})

export default h
