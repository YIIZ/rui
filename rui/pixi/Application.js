// @jsx h
import { h, hook, compute } from 'rui'
import * as PIXI from 'pixi.js'

import { Node } from './nodes'
import Busy from './Busy'

// TODO built-in size?
export function Application({ size, options, ...props }, children) {
  const app = new PIXI.Application(options)
  const { stage, renderer, view, ticker } = app

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

  const node = <Node el={stage} x={x} y={y} rotation={rotation} {...props}>{...children}</Node>
  node.app = app
  node.view = view
  node.stage = stage
  node.renderer = renderer
  node.size = size
  node.ticker = ticker
  return node
}

export function BusyApplication({ size, ...props }, children) {
  const busy = <Busy></Busy>
  const app = <Application size={size} {...props}>
    {...children}
    {busy}
  </Application>

  app.busy = async (cb) => {
    busy.inc()
    const out = await cb()
    busy.dec()
    return out
  }

  return app
}

// TODO DEPRECATED? default attached is not a good practise?
export default function AttachedApplication(props, children) {
  const node = <BusyApplication {...props}>{...children}</BusyApplication>
  node.attach()
  return node
}

// TODO?
// export function CompoundApplication(props, children) {
//   return <AttachedApplication size={useAppSize()}>
//     <Switcher init>{...children}</Switcher>
//     <Busy></Busy>
//   </AttachedApplication>
// }

