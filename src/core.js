export * from './compute'
import { isReplace, isCompute, value } from './compute'

export const watch = (computed, fn) => {
  const onChange = () => fn(computed())
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
        watch(value, (v) => this.applyProp(key, v))
      } else {
        this.applyProp(key, value)
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
          // TODO prevent first replace?
          nodes = this.replace(nodes, newNodes)
        })
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
  const node = fn(props || {}, children)
  if (hooks.length) node.hooks.push(...hooks)
  hooks = lastHooks
  return node
}

export function hook(hook) {
  hooks.push(hook)
}
export function useRoot() {
  const [root, setRoot] = value(null)
  hook((self) => {
    setRoot(self.root)
    return () => setRoot(null)
  })
  return root
}

