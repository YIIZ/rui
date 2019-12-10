// @jsx h
import { h, value, compute, replace } from 'rui'
import { Container, Sprite, Text } from './nodes'

import { tween } from 'popmotion'

function replaceItem(getNode, fromState, toState) {
  return replace(() => {
    const node = getNode()
    if (!node) return

    const from = fromState()
    const to = toState()
    const container = <Container>{node}</Container>
    function apply(props) {
      // TODO? cache keys
      for (const [key, value] of Object.entries(props)) {
        container.applyProp(key, value)
      }
    }
    apply(from)
    tween({ from, to, duration: 300 }).start(apply)
    return container
  })
}

// TODO custom animation style
const defaultStyle = () => ({
  x: 0,
  alpha: 1,
  scale: 1,
})
const moveStyle = (left) => ({
  x: left ? 100 : -100,
  alpha: 0,
  scale: 0.8,
})


export default function Carousel(props, children) {
  const [index, setIndex] = value(0)
  const [lastIndex, setLastIndex] = value(-1)

  const enter = compute(() => children[index()])
  const leave = compute(() => children[lastIndex()])

  let direction = 1
  const update = (d) => {
    direction = d
    const lastIndex = index()
    const newIndex = (lastIndex+d+children.length)%children.length
    setIndex(newIndex)
    setLastIndex(lastIndex)
  }

  const node = <Container>
    {replaceItem(enter, () => leave() ? moveStyle(direction>0) : defaultStyle(), defaultStyle)}
    {replaceItem(leave, defaultStyle, () => moveStyle(direction<0))}
  </Container>

  node.next = () => update(1)
  node.prev = () => update(-1)
  node.index = index
  return node
}
