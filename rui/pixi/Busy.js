// @jsx h
import * as PIXI from 'pixi.js'
import { h, value, compute } from 'rui'
import { Sprite } from './nodes'
import Closable from './Closable'
import Spinner from './Spinner'

export default function Busy(props) {
  const [count, setCount] = value(0)
  const open = compute(() => count() > 0)

  const inc = () => setCount(count() + 1)
  const dec = () => setCount(count() - 1)

  const node = <Closable open={open}>
    <Sprite tex={PIXI.Texture.WHITE}
      interactive
      tint={0x000000}
      alpha={0.8}
      {...props}
    ></Sprite>
    <Spinner></Spinner>
  </Closable>

  node.inc = inc
  node.dec = dec

  return node
}
