// @jsx h
import { h, compute, useRoot } from 'rui'
import * as PIXI from 'pixi.js'
import { Sprite } from './nodes'

export default function Mask(props) {
  const root = useRoot()
  const size = compute(() => root().size())

  return <Sprite
    tex={PIXI.Texture.WHITE}
    width={compute(() => size().width)}
    height={compute(() => size().height)}
    tint={0x000000}
    alpha={0.8}
    {...props}
  />
}
