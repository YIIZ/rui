// @jsx h
import * as PIXI from 'pixi.js'
import { h, value, compute } from 'rui'
import { Container } from './nodes'

// items: [['key', Component], ...others]
// <Component onNext={(nextKey, params, async function callback (enter, leave) => done())}></Component>
const once = cb => {
  let called = false
  return (...args) => {
    if (called) return
    called = true
    return cb(...args)
  }
}


export default function Switcher({ init }, items) {
  const itemsMap = new Map(items)
  const head = <Container></Container>
  const container = <Container>{head}</Container>

  let prev, current
  const change = async (name, options, cb) => {
    const { prepend, ...props } = options || {}
    const Node = itemsMap.get(name)
    const node = <Node onNext={once(change)} {...props}></Node>

    prev = current
    current = node

    if (prepend) {
      // no prepend api
      container.replace([head], [head, current])
    } else {
      container.append(current)
    }

    if (typeof cb === 'function') {
      // clean non-function param
      await cb(current, prev)
    }

    // remove prev
    prev && container.replace([prev], [])
  }

  init(change)

  // container.change = change
  return container
}
