import { BehaviorSubject, isObservable, combineLatest } from 'rxjs'
import { map } from 'rxjs/operators'

export class Node {
  constructor(el, onAttached, onDetached) {
    this._attached = false
    this.el = el
    this.children = []
    this.onAttached = onAttached
    this.onDetached = onDetached
  }

  attached() {
    this._attached = true
    for (const child of this.children) {
      child.attached()
    }
    this.onAttached && this.onAttached()
  }
  detached() {
    this._attached = false
    for (const child of this.children) {
      child.detached()
    }
    this.onDetached && this.onDetached()
  }
}

export const createBuilder = (options) => {
  const {
    createElement, createAnchor, createText,
    applyProp,
    append, after, remove,
  } = options

  const toNodes = (data) => {
    const array = Array.isArray(data) ? data
      : (data === null || typeof data === 'undefined') ? []
      : [data]

    const nodes = array.map((v) => v instanceof Node ? v : new Node(createText(v)))
    return [nodes, nodes.map(n => n.el)]
  }

  return function h(name, props, ...children) {
    if (typeof name === 'function') return name(h, props, children)

    const { onAttached, onDetached, ...otherProps } = props || {}
    const el = createElement(name)
    const node = new Node(el, onAttached, onDetached)

    for (const [key, value] of Object.entries(otherProps)) {
      if (isObservable(value)) {
        watchState(value, (v) => applyProp(el, key, v))
      } else {
        applyProp(el, key, value)
      }
    }

    for (const child of children) {
      if (isObservable(child)) {
        const anchor = createAnchor()
        const anchorNode = new Node(anchor)
        append(el, anchor)
        node.children.push(anchorNode)

        let nodes = []
        // watch after attached
        watchState(child, (v) => {
          const [newNodes, els] = toNodes(v)
          nodes.forEach(n => remove(el, n.el))
          after(el, anchor, ...els)

          node.children.splice(node.children.indexOf(anchorNode) + 1, nodes.length, ...newNodes)
          if (node._attached) {
            newNodes.forEach(n => n.attached())
            nodes.forEach(n => n.detached())
          }

          nodes = newNodes
        })
      } else {
        const [nodes, els] = toNodes(child)
        append(el, ...els)

        node.children.push(...nodes)
        if (node._attached) {
          nodes.forEach(n => n.attached())
        }
      }
    }

    return node
  }
}


// computes
export function useState(inital) {
  const state = new BehaviorSubject(inital)
  const set = (v) => state.next(v)
  return [ state, set ]
}

export function watchState(state, callback) {
  if (state.subscribe) {
    state.subscribe(callback)
  }
  return () => {
    if (state.unsubscribe) {
      state.unsubscribe(callback)
    }
  }
}

export function useCompute(callback, deps) {
  const obs = deps.map(v => isObservable(v) ? v : [v])
  return combineLatest(obs)
    .pipe(map((values) => callback(...values)))
    // cache
}
