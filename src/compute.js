let current
class Node extends Set {
  constructor(taker, collectDependencies=false) {
    super()
    this.taker = taker
    this.value = undefined
    this.needUpdate = false
    this.dependencies = collectDependencies ? new Set() : false
  }
  update() {
    const { dependencies: oldDeps } = this

    if (oldDeps) {
      this.dependencies = new Set()
    }

    const prev = current
    current = this
    const newValue = this.taker()
    current = prev

    if (oldDeps) {
      const newDeps = this.dependencies
      oldDeps.forEach(dep => {
        if (!newDeps.has(dep)) dep.delete(this)
      })
    }

    if (this.value !== newValue) {
      this.value = newValue
      this.forEach(d => d.needUpdate = true)
    }
    this.needUpdate = false
  }
  eval() {
    if (current && current.dependencies) {
      current.dependencies.add(this)
      if (!this.has(current)) {
        this.add(current)
      }
    }
    return this.size > 0 ? this.value : this.taker()
  }
  add(node) {
    super.add(node)
    if (this.size === 1) {
      this.update()
      if (this.onStart) this.onStart()
    }
  }
  delete(node) {
    super.delete(node)
    if (this.size === 0) {
      if (this.dependencies) {
        this.dependencies.forEach(d => d.delete(this))
      }
      if (this.onStop) this.onStop()
    }
  }
}


const sort = (node, set) => {
  // topological order
  // move repeat to end
  set.delete(node)
  set.add(node)
  node.forEach(child => sort(child, set))
  return set
}
const notify = (nodes) => {
  const topologicalNodes = new Set()
  nodes.forEach(node => {
    node.needUpdate = true
    sort(node, topologicalNodes)
  })
  topologicalNodes.forEach(node => {
    if (node.needUpdate) {
      node.update()
    }
  })
}

const batchNodes = new Set()
const batchNotify = async (node) => {
  batchNodes.add(node)
  await 0
  if (batchNodes.size > 0) {
    notify([...batchNodes])
    batchNodes.clear()
  }
}

export const take = (taker, subscriber) => {
  const node = new Node(taker)

  let unsubscriber
  node.onStart = () => {
    // unsubscriber = subscriber(() => notify([node]))
    unsubscriber = subscriber(() => batchNotify(node))
  }
  node.onStop = () => {
    unsubscriber && unsubscriber()
  }
  return () => node.eval()
}

export const compute = (taker) => {
  const node = new Node(taker, true)
  return () => node.eval()
}

export const value = (init) => {
  let v = init
  const node = new Node(() => v)
  const update = (newValue) => {
    v = newValue
    batchNotify(node)
  }
  return [() => node.eval(), update]
}

export const watch = (fn) => {
  const node = new Node(fn, true)
  node.update()
  return () => node.delete()
}

export const peek = (fn, ...args) => {
  const prev = current
  current = null
  const out = fn(...args)
  current = prev
  return out
}

