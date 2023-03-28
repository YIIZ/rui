// @jsx h
import { h, value, compute, hook, if as _if, each } from 'rui'
import { Container, Sprite, Text } from './nodes'

import { oncePointerEnd } from './utils'
import { tween } from 'popmotion'

export default function Button({ tex, onTap, ...props }, children) {
  const [scale, setScale] = value(1)

  let taped = false
  const tap = () => taped = true
  const down = () => tween({ from: 1, to: 0.9, duration: 50 }).start(setScale)
  const up = () => tween({ from: 0.9, to: 1, duration: 50 }).start(setScale)


  return <Sprite tex={tex} {...props}
    scale={scale}
    onpointertap={tap}
    onpointerdown={down}
    onpointerup={up}
    onpointerupoutside={up}
    onpointercancel={up}
  >{...children}</Sprite>

  // copyed
  // TODO rui-it
  async function listen() {
    await new Promise((resolve) => sprite.once('pointerdown', resolve))
    const { x, y } = sprite.scale
    const downAnimation = new PIXI.Tween(sprite.scale).to({ x: x*0.9, y: y*0.9 }, 50).startAsync()

    let isTap = false
    const tap = () => { isTap = true }
    sprite.once('pointertap', tap)

    await new Promise((resolve) => oncePointerEnd(sprite, resolve))
    await downAnimation
    await new PIXI.Tween(sprite.scale).to({ x, y }, 50).startAsync()

    sprite.off('pointertap', tap)

    if (isTap) {
      onbuttontap?.()
    }
    listen()
  }
  listen()

  return node
}

