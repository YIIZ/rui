// like ReactDOM.render(<App/>, document.body)?

class Container extends Rex.Component {
  constructor(name) {
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
