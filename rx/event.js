// ideas
// - default passive
import { take } from './helpers'

// export const once
export const listen = (element, eventName) => {
  const eventNames = eventName.split(/\s+/)
  new Observable(observer => {
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

export const listenOnce = (...args) => take(listen(...args), 1)
