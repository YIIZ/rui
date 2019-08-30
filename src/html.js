import { isObservable } from 'rxjs'
import { Node, watchState } from './core'

class DOMNode extends Node {
  constructor(name, props, children) {
    const el = document.createElement(name)
    super(el)

    const self = this
    const toNodes = (data) => {
      const array = Array.isArray(data) ? data
        : (data === null || typeof data === 'undefined') ? []
        : [data]

      return array.map((v) => v instanceof Node ? v : new Node(this.createText(v)))
        .map(n => n.el)
    }

    const { onAttached, onDetached, ...otherProps } = props || {}
    for (const [key, value] of Object.entries(otherProps)) {
      if (isObservable(value)) {
        watchState(value, (v) => self.applyProp(el, key, v))
      } else {
        self.applyProp(el, key, value)
      }
    }

    for (const child of children) {
      if (isObservable(child)) {
        const anchor = self.createAnchor()
        self.append(el, anchor)

        let nodes = []
        // use compute?
        watchState(child, (v) => {
          nodes.forEach(n => self.remove(el, n))
          nodes = toNodes(v)
          anchor.after(...nodes)
        })
      } else {
        const nodes = toNodes(child)
        el.append(...nodes)
      }
    }
  }

  append(el, ...children) {
    el.append(...children)
  }
  after(el, ref, ...children) {
    ref.after(...children)
  }
  remove(el, target) {
    target.remove()
  }
  applyProp(el, key, value) {
    el.setAttribute(key, value)
  }
  createAnchor() {
    return document.createTextNode('')
  }
  createText(text) {
    return document.createTextNode(text)
  }
}


export const h = (name, props, ...children) => {
  if (typeof name === 'string') {
    return new DOMNode(name, props, children)
  } else {
    return name(h, props, children)
  }
}
export default h
