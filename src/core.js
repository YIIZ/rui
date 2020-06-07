export * from './compute'
import { value, compute, watch, peek, isCompute } from './compute'

export class Node {
  constructor(el, props, children) {
    this.attached = false
    this.el = el
    this.hooks = []
    this.children = []

    if (props)
    for (const [key, value] of Object.entries(props)) {
      // next?
      // const applyProp = this.createApply(key)
      if (isCompute(value)) {
        apply(() => this.applyProp(key, value()))
      } else {
        this.applyProp(key, value)
      }
    }

    if (children)
    for (const child of children) {
      if (isCompute(child)) {
        const anchor = this.createAnchor()
        this.append(anchor)

        let nodes = [anchor]
        apply(() => {
          const v = child()
          const newNodes = Array.isArray(v) ? v : v != null ? [v] : [anchor]
          // TODO prevent first replace?
          nodes = this.replace(nodes, newNodes)
        })
      } else {
        this.append(child)
      }
    }
  }

  createAnchor() {
    return new Node()
  }
  applyProp(key, value) {
    this.el[key] = value
  }
  append(node) {
    this.children.push(node)
    if (this.attached) node.attach(this.root, this)
  }
  replace(oldNodes, newNodes) {
    const { children } = this
    children.splice(children.indexOf(oldNodes[0]), oldNodes.length, ...newNodes)
    if (this.attached) {
      newNodes.forEach(n => n.attach(this.root, this))
      oldNodes.forEach(n => n.detach())
    }
    return newNodes
  }

  attach(root=this, parent) {
    // TODO ancestors?
    this.root = root
    this.attached = true
    this.children.forEach(n => n.attach(this.root, this))
    this.clearhooks = this.hooks.map(hook => hook(this))
      .filter(clear => typeof clear === 'function')
  }
  detach() {
    this.attached = false
    this.children.forEach(n => n.detach())
    this.clearhooks.forEach(clear => clear())
  }
}


let hooks
export function h(fn, props, ...children) {
  const lastHooks = hooks
  hooks = []
  // TODO peek in if/each?
  const node = peek(fn, props || {}, children)
  if (hooks.length) node.hooks.push(...hooks)
  hooks = lastHooks
  return node
}

export function hook(hook) {
  hooks.push(hook)
}
export const apply = (fn) => {
  hook(() => watch(fn))
}

const deprecatedWatch = (get, cb) => {
  apply(() => {
    const v = get()
    // cb(get())
    peek(cb, v)
  })
}
export { deprecatedWatch as watch }

export function useRoot() {
  const [root, setRoot] = value(null)
  hook((self) => {
    setRoot(self.root)
    return () => setRoot(null)
  })
  return root
}


// convenience methods
export function each(value, Node) {
  const items = typeof value === 'function' ? value : () => value
  // cache value
  // TODO key?
  return compute(() => {
    // <Node item={item} index={index}/>
    return items().map((item, index) => h(Node, { item, index }))
  })
}
function _if(value, Node) {
  const bool = typeof value === 'function'
    ? compute(() => !!value()) // cache bool
    : () => value
  return compute(() => bool() ? h(Node) : null)
}
export function unless(value, Node) {
  const bool = typeof value === 'function'
    ? compute(() => !value()) // cache bool
    : () => value
  return compute(() => bool() ? h(Node) : null)
}

export { _if as if, compute as replace }

