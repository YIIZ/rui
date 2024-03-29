import { Node } from '@rui/core'

function createTextNode(data='') {
  return new Node(document.createTextNode(data), { data })
}
// convert text to node
const toNode = c => c instanceof Node ? c : createTextNode(c)

class HTMLNode extends Node {
  constructor(tag, props, children) {
    const el = typeof tag === 'string' ? document.createElement(tag) : tag
    super(el, props, children)
  }
  createAnchor() {
    return createTextNode()
  }
  applyProp(key, value) {
    const { el } = this
    if (key in el) {
      el[key] = value
    } else {
      el.setAttribute(key, value)
    }
  }
  append(_node) {
    const node = toNode(_node)
    this.el.append(node.el)
    super.append(node)
  }
  replace(oldNodes, _newNodes) {
    const newNodes = _newNodes.map(toNode)

    const container = this.el
    const ref = oldNodes[oldNodes.length-1].el.nextSibling
    oldNodes.forEach(({ el }) => container.removeChild(el))
    newNodes.forEach(({ el }) => container.insertBefore(el, ref))
    return super.replace(oldNodes, newNodes)
  }
}

export function Element({ tag, ...props }, children) {
  return new HTMLNode(tag, props, children)
}
