// @jsx h
import * as PIXI from 'pixi.js'
import { h, value, compute, watch } from 'rui'
import { Sprite } from './nodes'
import Closable from './Closable'
import Spinner from './Spinner'
import Mask from './Mask'
import { spring } from '../motion'

export default function Busy(props) {
  const [count, setCount] = value(0)
  const open = compute(() => count() > 0)

  const inc = () => setCount(count() + 1)
  const dec = () => setCount(count() - 1)


  const [alpha, animating] = spring(() => open() ? 1 : 0)
  const alive = compute(() => open() || animating())

  const node = <Closable open={alive} alpha={alpha}>
    <Mask></Mask>
    <Spinner></Spinner>
  </Closable>

  node.inc = inc
  node.dec = dec

  return node
}
