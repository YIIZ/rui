// @jsx h
import { h, take, value, compute, hook, if as _if, unless, apply, peek, useRoot } from 'rui'
import { Container, Sprite, Node } from 'lib/rui/pixi'
import Crop from 'lib/rui/pixi/Crop'
import { oncePointerDrag } from 'lib/rui/pixi/utils'
import * as PIXI from 'pixi.js'

export default function ScrollView({ height=400, ...props }, children) {
  const content = <Container y={compute(() => oy-y())}>{...children}</Container>
  const {
    width: contentWidth,
    height: contentHeight,
    y: offsetY,
  } = content.el.getBounds()
  const oy = -offsetY-height*0.5

  const [y, setY] = value(0)
  const maxY = Math.max(0, contentHeight-height)
  const setClampedY = (v) => setY(Math.clamp(v, 0, maxY))

  // TODO velocity
  // https://github.com/YIIZ/wegame-xiongan/blob/master/src/usePointer.js#L69
  const down = ({ currentTarget: target, data }) => {
    const { y: sy } = data.getLocalPosition(target)
    const ry = y() + sy

    oncePointerDrag(target, ({ data }) => {
      const { y: my } = data.getLocalPosition(target)
      setClampedY(ry-my)
    }, () => {})
  }

  return <Container {...props}>
    <Crop width={contentWidth} height={height}
      onpointerdown={down}
    >
      {content}
    </Crop>
    <VerticalScrollViewBar x={contentWidth*0.5-4} v={y} size={height} max={contentHeight}/>
  </Container>
}


export function VerticalScrollViewBar({ v, size, max, ...props }) {
  const scale = size/max
  const center = (max-size)/2
  const y = compute(() => (v()-center)*scale)

  // TODO rounded graphic? antialias
  return <Sprite y={y} tex={PIXI.Texture.WHITE} height={size*scale}
    width={8}
    tint={0x000000}
    alpha={0.3}
    {...props}
  >
  </Sprite>
}
