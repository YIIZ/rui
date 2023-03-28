// @jsx h
import { h, value, compute, replace, if as _if } from 'rui'
import { Container, Sprite, Text } from './nodes'

import { tween } from 'popmotion'
import Animate from './Animate'

// TODO custom animation style
const defaultStyle = { x: 0, alpha: 1, scale: 1 }
const enterStyle = { x: -140, alpha: 0.5, scale: 0.8 }
const leaveStyle = { x: 140, alpha: 0.5, scale: 0.8 }


export default function Carousel({ init = value(0) }, children) {
  const [index, setIndex] = init
  const update = (d) => {
    const newIndex = (index()+d+children.length)%children.length
    setIndex(newIndex)
  }

  const items = children.map((node, i) => {
    const style = compute(() => {
      const idx = index()
      // continuous scroll
      if (idx === 0 && i === children.length-1) {
        return enterStyle
      } else if (idx === children.length-1 && i === 0) {
        return leaveStyle
      } else if (i === idx) {
        return defaultStyle
      } else if (i > idx) {
        return leaveStyle
      } else {
        return enterStyle
      }
    })
    // TODO without zindex?
    const zIndex = compute(() => {
      return i === index() ? 1 : -1
    })
    // TODO remove hidden items
    return <Animate N={Container} animate={style} zIndex={zIndex}>{node}</Animate>
  })

  const node = <Container sortableChildren
    onpointerdown={(evt) => console.log(evt.data.global)}
    onpointermove={(evt) => console.log(evt.data.global)}
  >{...items}</Container>

  node.next = () => update(1)
  node.prev = () => update(-1)
  node.index = index
  return node
}
