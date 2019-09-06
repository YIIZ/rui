class Node {
  constructor(el) {
    this.attached = false
    this.el = el
    this.effects = []
    this.children = []
  }

  append(...children) {
    const nodes = children.map(c => c instanceof Node ? c : new Node(c))

    this.children.push(...nodes)
    this.el.append(...nodes.map(n => n.el)) // dom

    if (this.attached) nodes.forEach(n => n.attach())
  }

  attach() {
    this.attached = true
    this.children.forEach(n => n.attach())
    this.clearEffects = this.effects.map(effect => effect())
      .filter(clear => typeof clear === 'function')
  }
  detach() {
    this.attached = false
    this.children.forEach(n => n.detach())
    this.clearEffects.forEach(clear => clear())
  }
}


const stack = []
function h(fn, props, ...children) {
  const effects = []
  stack.push(effects)
  const node = fn(props, children)
  node.effects.push(...effects)
  stack.pop()
  return node
}
function currentNode() {
  return stack[stack.length - 1]
}
function useEffect(effect) {
  currentNode().push(effect)
}


function NodeTag({ el }, children) {
  const node = new Node(el)
  node.append(...children)
  return node
}

export { h, NodeTag as Node, useEffect }
