// @jsx h
import { h, value, compute, hook, if as _if, each } from 'rui'
import { Container, Sprite, Text } from './nodes'

import { oncePointerEnd } from './utils'

export default function Button({ tex, onbuttontap, ...props }, children) {
  const node = <Sprite tex={tex} {...props}>{...children}</Sprite>
  const sprite = node.el

  sprite.interactive = true

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

