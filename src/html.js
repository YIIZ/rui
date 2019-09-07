import { Node } from './core'

class HTMLNode extends Node {
  constructor(tag, props, children) {
    super(document.createElement(tag), props, children)
  }
  createAnchor() {
    return document.createTextNode('')
  }
  createText(text) {
    return document.createTextNode(text)
  }
  applyProp(el, key, value) {
    if (key in el) {
      el[key] = value
    } else {
      el.setAttribute(key, value)
    }
  }
  append(nodes) {
    this.el.append(...nodes.map(({ el }) => el))
    super.append(nodes)
  }
  replace(anchor, oldNodes, newNodes) {
    oldNodes.forEach(({ el }) => el.remove())
    anchor.el.after(...newNodes.map(({ el }) => el))
    super.replace(anchor, oldNodes, newNodes)
  }
}

export function Element({ tag, ...props }, children) {
  return new HTMLNode(tag, props, children)
}
