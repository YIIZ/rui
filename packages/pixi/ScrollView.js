// @jsx h
import { h, take, value, compute, hook, if as _if, unless, apply, peek, useRoot } from '@rui/core'
import { Container, Sprite, Node } from 'lib/rui/pixi'
import Crop from 'lib/rui/pixi/Crop'
import { oncePointerDrag } from 'lib/rui/pixi/utils'
import * as PIXI from 'pixi.js'

export default function ScrollView({ height=400, padding=0, ...props }, children) {
  const [scrolling, setScrolling] = value(false)
  const content = <Container y={compute(() => oy-y())}
    interactiveChildren={compute(() => !scrolling())}
  >{...children}</Container>
  const {
    width: contentWidth,
    height: contentHeight,
    y: offsetY,
  } = content.el.getBounds()
  const p = padding
  const p2 = padding*2
  const oy = -offsetY-height*0.5+p

  // console.warn('fixme')
  const [y, setY] = value(0)
  const maxY = Math.max(0, contentHeight+p2-height)
  const setClampedY = (v) => setY(Math.clamp(v, 0, maxY))

  // TODO velocity
  // https://github.com/YIIZ/wegame-xiongan/blob/master/src/usePointer.js#L69
  const down = ({ currentTarget: target, data }) => {
    const { y: sy } = data.getLocalPosition(target)
    const ry = y() + sy

    oncePointerDrag(target, ({ data }) => {
      setScrolling(true)
      const { y: my } = data.getLocalPosition(target)
      setClampedY(ry-my)
    }, () => {
      setScrolling(false)
    })
  }

  return <Container {...props}>
    <Crop width={contentWidth+p2} height={height}
      onpointerdown={down}
    >
      {content}
    </Crop>
    <VerticalScrollViewBar x={contentWidth*0.5+p-4} v={y} size={height} max={maxY}/>
  </Container>
}


export function VerticalScrollViewBar({ v, size, max, ...props }) {
  const scale = size/(max+size)
  const center = size/2
  const y = compute(() => v()*scale-center)

  // TODO rounded graphic? antialias
  return <Sprite y={y} tex={PIXI.Texture.WHITE} height={size*scale}
    anchor={[0.5, 0]}
    width={8}
    tint={0x000000}
    alpha={0.3}
    {...props}
  >
  </Sprite>
}
