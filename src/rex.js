
class Component {
}
class Fragment {
  constructor(children) {
    this.children = children
  }
}
class LifeCycle extends Fragment {
  constructor(attached, detached, children) {
    super(children)
    this.attached = attached
    this.detached = detached
  }
}
// or
class State extends Fragment {
  static getEvents(children, attached, detached) {
    const states = children.filter(item => item instanceof State)

    const attachedList = states
      .map(child => child.attached)
      .concat(attached)
      .filter(attached => typeof attached === 'function')
    const detachedList = states
      .map(child => child.detached)
      .concat(detached)
      .filter(detached => typeof detached === 'function')

    return {
      ...attachedList.length < 1 ? null
        : { attached() { for (handler of attachedList) handler() } }
      ...detachedList.length < 1 ? null
        : { detached() { for (handler of detachedList) handler() } }
    }
  }

  constructor({ attached, detached, ...props}, children) {
    super(children)
    this.props = props

    const events = State.getEvents(children, attached, detached)
    Object.assign(this, events)
  }
}


const createFragment(props, ...children) {
  return new Fragment(children)
}
const createState(props, ...children) {
  return new State(props, children)
}

export { createFragment as Fragment, createState as State }


// html
// @jsx-lowercase-create createElement
const append = (parent, children) {
  for (const child of children)
  if (child instanceof Node) {
    el.appendChild(child)
  } else if (child instanceof State) {
    // DocumnetFragment?
    append(el, child.children)
  } else if (child instanceof Fragment)
    append(el, child.children)
  } else {
    const text = document.createTextNode(child)
    el.appendChild(child)
  }
}
// before
// after
const remove = (el) => {
  if (el instanceof Node) {
    el.remove()
  } else {
    // fragment or state
    append(target, el.children)
    el.attached()
  }
}

const attach = (el, target) => {
  append(target, el)
  if (el instanceof State) {
    el.attached()
  }
}
// trigger detach on remove
// remove detach on remove
const detach = (el) => {
  el.remove()
}
const createElement = (name, props, ...children) {
  const el = document.createElement(name)
  append(el, children)

  const events = State.getEvents(children)
  if (Object.keys(events).length === 0) return el
  return <State {...events}>{el}</State>
}

// TODO
// detach 只有在 attach 之后才会触发
// append 到已经 attach 的树上
