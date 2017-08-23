import { matches } from './dom'

export function on(element, eventName, handler) {
  element.addEventListener(eventName, handler, false)
}

export function off(element, eventName, handler) {
  element.removeEventListener(eventName, handler, false)
}

export function once(element, eventName, handler) {
  on(element, eventName, function fn(evt) {
    off(element, eventName, fn)
    handler.call(this, evt)
  })
}

// https://github.com/rails/rails/blob/master/actionview/app/assets/javascripts/rails-ujs/utils/event.coffee#L34
export function delegate(element, selector, eventType, handler) {
  on(element, eventType, function (e) {
    var target
    target = e.target
    while (!(!(target instanceof Element) || matches(target, selector))) {
      target = target.parentNode
    }
    if (target instanceof Element && handler.call(target, e) === false) {
      e.preventDefault()
      return e.stopPropagation()
    }
  })
}
export function live(selector, eventType, handler) {
  delegate(document, selector, eventType, handler)
}
