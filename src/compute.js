let current
class Node extends Set {
  constructor(taker, collectDependencies=false) {
    super()
    this.taker = taker
    this.value = undefined
    this.needUpdate = false
    this.dependencies = collectDependencies ? new Set() : false

    const boundEval = this.eval.bind(this)
    boundEval.__compute = true
    this.boundEval = boundEval
  }
  update() {
    this.needUpdate = false
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
      this.forEach(d => d.needUpdate = d !== current)
      this.forEach(d => d.needUpdate && d.update())
    }
  }
  checkUpdate() {
    if (this.needUpdate) {
      this.update()
    } else if (this.dependencies) {
      // TODO skip unchanged
      this.dependencies.forEach(d => d.checkUpdate())
    }
  }
  eval() {
    if (current && current.dependencies) {
      current.dependencies.add(this)
      if (!this.has(current)) {
        this.add(current)
      }
    }
    if (this.size > 0) {
      this.checkUpdate()
      return this.value
    } else {
      return this.taker()
    }
  }
  add(node) {
    super.add(node)
    if (this.size === 1) {
      if (this.onStart) this.onStart()
      this.update()
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


const notify = (nodes) => {
  nodes.forEach(node => {
    node.needUpdate = true
  })
  nodes.forEach(node => {
    node.checkUpdate()
  })
}

const batchNodes = new Set()
export let batching = true
const batchNotify = (node) => {
  if (!batching) {
    // sync: trigger maximum call stack error if circular
    notify([node])
    return
  }
  batchNodes.add(node)
  if (batchNodes.size === 1) {
    return Promise.resolve().then(() => {
      batching = false
      try {
        notify([...batchNodes])
      } finally {
        batchNodes.clear()
        batching = true
      }
    })
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
  return node.boundEval
}

export const compute = (taker) => {
  const node = new Node(taker, true)
  return node.boundEval
}

export const value = (init) => {
  let v = init
  const node = new Node(() => v)
  const update = (newValue) => {
    v = newValue
    return batchNotify(node)
  }
  return [node.boundEval, update]
}

export const watch = (fn) => {
  const node = new Node(fn, true)
  node.update()
  return () => node.delete()
}

export const isCompute = (fn) => {
  return typeof fn === 'function' && fn.__compute === true
}

export const peek = (fn, ...args) => {
  const prev = current
  current = null
  const out = fn(...args)
  current = prev
  return out
}

