let current
export class Node extends Set {
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
      this.forEach(d => d.checkUpdate())
    }
  }
  checkUpdate() {
    if (!this.potentialUpdate) return
    if (this.needUpdate) {
      this.needUpdate = false
      this.potentialUpdate = false
      this.update()
    } else if (this.dependencies) {
      this.dependencies.forEach(d => d.checkUpdate())
      this.potentialUpdate = false
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


const collect = (n, set, condition) => {
  if (condition(n)) {
    set.add(n)
    n.forEach(n => collect(n, set, condition))
  }
  return set
}

const batchNodes = new Set()
const potentialUpdates = new Set()
export let batching = true
const batchNotify = (node) => {
  node.needUpdate = true
  collect(node, potentialUpdates, n => {
    const { potentialUpdate } = n
    if (!potentialUpdate) n.potentialUpdate = true
    return !potentialUpdate
  })

  if (!batching) {
    // sync: trigger maximum call stack error if circular
    node.checkUpdate()
    return
  }
  batchNodes.add(node)
  if (batchNodes.size === 1) {
    return Promise.resolve().then(() => {
      batching = false
      try {
        batchNodes.forEach(n => n.checkUpdate())
      } finally {
        batchNodes.clear()
        batching = true
        // clean
        potentialUpdates.forEach(n => n.potentialUpdate = false)
        potentialUpdates.clear()
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

