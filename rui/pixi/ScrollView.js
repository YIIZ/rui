// @jsx h
import { h, take, value, compute, hook, if as _if, unless, apply, peek, useRoot } from 'rui'
import { Container, Sprite, Node } from 'lib/rui/pixi'
import Crop from 'lib/rui/pixi/Crop'
import { oncePointerDrag } from 'lib/rui/pixi/utils'
import * as PIXI from 'pixi.js'

import { clamp } from '@popmotion/popcorn'

export default function ScrollView({ height=400 }, children) {
  const [y, setY] = value(0)

  const content = <Container y={compute(() => -y())}>{...children}</Container>
  const {
    width: contentWidth,
    height: contentHeight,
    y: offsetY,
  } = content.el.getBounds()

  const minY = offsetY+height*0.5
  const maxY = contentHeight+offsetY-height*0.5
  setY(minY)

  const clampY = (v) => clamp(minY, maxY, v)
  // TODO velocity
  // https://github.com/YIIZ/wegame-xiongan/blob/master/src/usePointer.js#L69
  const down = ({ currentTarget: target, data }) => {
    const { y: sy } = data.getLocalPosition(target)
    const ry = y() + sy

    oncePointerDrag(target, ({ data }) => {
      const { y: my } = data.getLocalPosition(target)
      setY(clampY(ry-my))
    }, () => {})
  }

  return <Container>
    <Crop width={contentWidth} height={height}
      onpointerdown={down}
    >
      {content}
    </Crop>
    <VerticalScrollViewBar x={contentWidth*0.5+10} v={y} size={height} max={contentHeight}/>
  </Container>
}


export function VerticalScrollViewBar({ v, size, max, ...props }) {
  const scale = size/max
  const y = compute(() => v()*scale)

  // TODO rounded graphic? antialias
  // TODO not anchor 0.5 content
  return <Sprite y={y} tex={PIXI.Texture.WHITE} height={size*scale}
    width={8}
    tint={0x000000}
    alpha={0.3}
    {...props}
  >
  </Sprite>
}
