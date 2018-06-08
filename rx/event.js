// ideas
// - default passive
import { take } from './index'

// export const once
export const listen = (element, eventName) => {
  const eventNames = eventName.split(/\s+/)
  return new Observable(observer => {
    const handler = event => observer.next(event)

    for (const name of eventNames) {
      element.addEventListener(name, handler)
    }
    return () => {
      for (const name of eventNames) {
        element.removeEventListener(name, handler)
      }
    }
  })
}

// or?
// combineLatest(
//   listen(el, 'mousedown'),
//   listen(el, 'touchstart')
// ) |> take(1)
export const listenOnce = (...args) => listen(...args) |> take(1)
// listenActive (opposite to passive)
// listenPreventDefault
