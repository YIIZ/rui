export * from './compute'
import { isCompute } from './compute'

const watch = (computed, fn) => {
  // TODO no peek?
  const onChange = () => fn(computed.peek())
  hook(() => {
    computed.onChange(onChange)
    onChange()
    return () => computed.offChange(onChange)
  })
}

export class Node {
  constructor(el, props, children) {
    this.attached = false
    this.el = el
    this.hooks = []
    this.children = []

    if (props)
    for (const [key, value] of Object.entries(props)) {
      if (isCompute(value)) {
        watch(value, (v) => this.applyProp(el, key, v))
      } else {
        this.applyProp(el, key, value)
      }
    }

    if (children)
    for (const child of children) {
      if (!isCompute(child)) {
        if (child instanceof Node) {
          this.append(child)
        } else {
          const node = new Node(this.createText(child))
          this.append(node)
        }
      } else {
        if (child.__each) {
          const anchor = new Node(this.createAnchor())
          this.append(anchor)

          let nodes = []
          watch(child, (items) => {
            // TODO no createText as param
            const newNodes = items.map((v) => v instanceof Node ? v : new Node(this.createText(v)))
            this.replace(anchor, nodes, newNodes)
            nodes = newNodes
          })
        } else {
          const node = new Node(this.createText(''))
          watch(child, (v) => this.updateText(node.el, v))
          this.append(node)
        }
      }
    }
  }

  createText() {}
  createAnchor() {}
  applyProp(el, key, value) {}
  append(node) {
    this.children.push(node)
    if (this.attached) node.attach()
  }
  replace(anchor, oldNodes, newNodes) {
    const { children } = this
    children.splice(children.indexOf(anchor)+1, oldNodes.length, ...newNodes)
    if (this.attached) {
      newNodes.forEach(n => n.attach())
      oldNodes.forEach(n => n.detach())
    }
  }

  attach() {
    this.attached = true
    this.children.forEach(n => n.attach())
    this.clearhooks = this.hooks.map(hook => hook())
      .filter(clear => typeof clear === 'function')
  }
  detach() {
    this.attached = false
    this.children.forEach(n => n.detach())
    this.clearhooks.forEach(clear => clear())
  }
}


const stack = []
export function h(fn, props, ...children) {
  const hooks = []
  stack.push(hooks)
  const node = fn(props, children)
  node.hooks.push(...hooks)
  stack.pop()
  return node
}
function currentNode() {
  return stack[stack.length - 1]
}
export function hook(hook) {
  currentNode().push(hook)
}

