const getAndWatch = (value, callback) => {
  if (typeof value !== 'function') return callback(value)
  const handle = () => callback(value())
  // TODO watch first to prevent repeat compute() bug
  value.onChange(handle)
  handle()
  return () => value.offChange(handle)
}
const get = (value) => typeof value === 'function' ? value() : value



class Component {
  attached = false
  constructor(children) {
    this.children = children
  }

  onDetached() {
    this.attached = false
    for (const child of this.children)
    if (child instanceof Component) {
      child.onDetached()
    }
  }
  onAttached() {
    this.attached = true
    for (const child of this.children)
    if (child instanceof Component) {
      child.onAttached()
    }
  }

  append(child) {
    // this.children.push(child)
    if (!(child instanceof Element)) return
    this.children = [...this.children, child]
    child.parent = this

    if (this.attached) {
      child.onAttached()
    }
  }
  // after() {
  // }
  // before() {
  // }
  remove() {
    const { parent } = this
    if (parent) {
      parent.children = parent.children.filter(child => child !== this)
      this.parent = null
    }

    if (this.attached) {
      this.onDetached()
    }
  }
}


class State extends Component {
  constructor({ attached, detached, ...props }, children) {
    super(children)
    this.props = props

    if (attached) {
      this.onAttached = () => {
        attached()
        super.onAttached()
      }
    }
    if (detached) {
      this.onDetached = () => {
        detached()
        super.onDetached()
      }
    }
  }
}

const createState = (props, ...children) => {
  return new State(props, children)
}

export { createState as State }


// html
// @jsx-lowercase-create createElement
class Element extends Component {
  constructor(type, props, children) {
    super(children)
    this.el = document.createElement(type)

    // TODO by setProp in Component?
    if (props !== null)
    for (const [key, prop] of Object.entries(props)) {
      // TODO watch after attached
      getAndWatch(prop, value => {
        this.el.setAttribute(key, value)
      })
    }

    // TODO append in Component
    for (const child of children) {
      this.append(child)
    }
  }

  attach(target) {
    target.appendChild(this.el)
    this.onAttached()
  }
  append(child) {
    super.append(child)

    if (child instanceof Element) {
      this.el.appendChild(child.el)
    } else if (child instanceof Component) {
      for (const cc of child.children) {
        this.append(cc)
      }
    } else {
      const text = document.createTextNode('')
      getAndWatch(child, value => {
        text.data = value
      })
      this.el.appendChild(text)
    }
  }
  remove() {
    super.remove()
    this.el.remove()
  }
}

const createElement = (name, props, ...children) => {
  return new Element(name, props, children)
}

const createTaggedElement = ({ tag, ...props }, ...children) => {
  return new Element(tag, props, children)
}

export { createElement, createTaggedElement as Element }

// TODO
// detach 只有在 attach 之后才会触发
// append 到已经 attach 的树上
