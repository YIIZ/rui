// @jsx h
import { h, hook, compute } from 'rui'
import * as PIXI from 'pixi.js'

import { Node } from './nodes'

// TODO built-in size?
function Application({ size, transparent=false }, children) {
  const app = new PIXI.Application({ transparent })
  const { stage, renderer, view } = app

  const wh = compute(() => {
    const { width, height, rotate, ratio } = size()
    const w = rotate ? height : width
    const h = rotate ? width : height

    app.ratio = ratio
    renderer.resize(w, h)
    return [w, h]
  })
  const x = compute(() => wh()[0] * 0.5)
  const y = compute(() => wh()[1] * 0.5)
  const rotation = compute(() => size().rotation)

  const node = <Node el={stage} x={x} y={y} rotation={rotation}>{...children}</Node>
  node.app = app
  node.view = view
  node.stage = stage
  node.renderer = renderer
  return node
}
export default function AttachedApplication(props, children) {
  const node = <Application {...props}>{...children}</Application>
  node.attach()
  return node
}
