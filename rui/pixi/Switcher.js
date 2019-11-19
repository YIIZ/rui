// @jsx h
import * as PIXI from 'pixi.js'
import { h, value, compute } from 'rui'
import { Container } from './nodes'

// items: [['key', Component], ...others]
// <Component onNext={(nextKey, params, async function callback (enter, leave) => done())}></Component>
export default function Switcher({ init }, items) {
  const itemsMap = new Map(items)
  const head = <Container></Container>
  const container = <Container>{head}</Container>

  let prev, current
  const change = async (name, { prepend, ...params }={}, cb) => {
    // TODO once onNext?
    const Node = itemsMap.get(name)
    const node = <Node onNext={change} {...params}></Node>

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
