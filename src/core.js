export * from './compute'
import { isReplace, isCompute } from './compute'

const watch = (computed, fn) => {
  // TODO no peek?
  const onChange = () => fn(computed.peek())
  hook(() => {
    computed.onChange(onChange)
    // NODE: due to compute's mechanism, retrieve before watch will cause compute double times
    // eg. {_if(v, () => <Large/>)}
    // will init `<Large/>` in initialization and attach phase
    // so we currently only retrieve value after attach
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
      if (!isReplace(child)) {
        // TODO check instanceof Node?
        this.append(child)
      } else {
        const anchor = this.createAnchor()
        this.append(anchor)

        let nodes = [anchor]
        watch(child, (v) => {
          // v[Symbol.iterator]?
          const newNodes = Array.isArray(v) ? v : v != null ? [v] : [anchor]
          nodes = this.replace(nodes, newNodes)
        })
      }
    }
  }

  createAnchor() {}
  applyProp(el, key, value) {
    el[key] = value
  }
  append(node) {
    this.children.push(node)
    if (this.attached) node.attach()
  }
  replace(oldNodes, newNodes) {
    const { children } = this
    children.splice(children.indexOf(oldNodes[0])+1, oldNodes.length, ...newNodes)
    if (this.attached) {
      newNodes.forEach(n => n.attach())
      oldNodes.forEach(n => n.detach())
    }
    return newNodes
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
  const node = fn(props || {}, children)
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

