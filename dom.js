const _matches = Element.prototype.matches
  || Element.prototype.matchesSelector
  || Element.prototype.mozMatchesSelector
  || Element.prototype.msMatchesSelector
  || Element.prototype.oMatchesSelector
  || Element.prototype.webkitMatchesSelector

export function matches(element, selector) {
  return _matches.call(element, selector)
}

export function toArray(elements) {
  return Array.prototype.slice.call(elements)
}

export function closest(el, selector) {
  let parent = el
  while (parent = parent.parentNode) {
    if (matches(parent, selector)) {
      return parent
    }
  }
}

export function find(selector, el = document) {
  return toArray(el.querySelectorAll(selector))
}
export function findOne(selector, el = document) {
  return el.querySelector(selector)
}

