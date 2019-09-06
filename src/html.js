import { h, Node, useEffect, isCompute } from './core'

const createElement = (name) => {
  return document.createElement(name)
}
const createAnchor = () => {
  return document.createTextNode('')
}
const createText = (text) => {
  return document.createTextNode(text)
}
const applyProp = (el, key, value) => {
  el.setAttribute(key, value)
}
const append = (el, ...children) => {
  el.append(...children)
}
const after = (el, ref, ...children) => {
  ref.after(...children)
}
const remove = (el, target) => {
  target.remove()
}

// =====
const toNodes = (data) => {
  const array = Array.isArray(data) ? data
    : (data === null || typeof data === 'undefined') ? []
    : [data]

  const nodes = array.map((v) => v instanceof Node ? v : new Node(createText(v)))
  return [nodes, nodes.map(n => n.el)]
}

const watch = (computed, fn) => {
  // TODO no peek?
  const onChange = () => fn(computed.peek())
  useEffect(() => {
    computed.onChange(onChange)
    onChange()
    return () => computed.offChange(onChange)
  })
}

export function Element({ tag, ...props }, children) {
  const el = document.createElement(tag) // dom
  const node = new Node(el)

  for (const [key, value] of Object.entries(props)) {
    if (isCompute(value)) {
      watch(value, (v) => applyProp(el, key, v))
    } else {
      applyProp(el, key, value)
    }
  }

  for (const child of children) {
    if (isCompute(child)) {
      const anchor = createAnchor()
      const anchorNode = new Node(anchor)
      append(el, anchor)
      node.children.push(anchorNode)

      let nodes = []
      watch(child, (v) => {
        const [newNodes, els] = toNodes(v)
        nodes.forEach(n => remove(el, n.el))
        after(el, anchor, ...els)

        node.children.splice(node.children.indexOf(anchorNode) + 1, nodes.length, ...newNodes)
        if (node.attached) {
          newNodes.forEach(n => n.attach())
          nodes.forEach(n => n.detach())
        }
        nodes = newNodes
      })
    } else {
      const [nodes, els] = toNodes(child)
      append(el, ...els)

      node.children.push(...nodes)
      if (node.attached) {
        nodes.forEach(n => n.attach())
      }
    }
  }

  // return <Node el={el}>{...children}</Node>
  return node
}
