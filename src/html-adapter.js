// no env? only by component?
// const env = new Rex.Env({
//   create,
// })
// @jsx env

const createElement = (type) => {
  if (typeof type === 'string') {
    // global.get(type) ?
    // document.createElement(type)
    return new HTMLRawElement(type)
  }
  return new type
}

// not working by extending HTMLElement
// implement by delegating?

// pros of delegating
// no props pollution
// cons
// no direct?

// uniform interface?
class HTMLRawElement extends Rex.Component {
  constructor(name) {
    this.el = document.createElement(name)
  }

  appendChild(child) {
    this.el.appendChild(child.el)
  }
  removeChild(child) {
    this.el.removeChild(child.el)
  }

  remove() {
    const { el } = this
    const { parentNode } = el
    if (parentNode) {
      parentNode.removeChild(el)
      // this.removed
    }
  }

  // get rawElement() {
  toRawElement() {
    return this.el
  }
  // setAttribute()
}

// for batch operation(each)
class HTMLFragment extends Rex.Fragment {
  frag = document.createDocumentFragment()
}

// for extending
class BaseElement extends HTMLRawElement {
  constructor() {
    super('div')
  }
}
