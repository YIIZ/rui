// @jsx h
import * as PIXI from 'pixi.js'
import { h, hook } from 'rui'
import { Node, useUpdate } from '.'

import { tween } from 'popmotion'
import * as easing from '@popmotion/easing'

export default function Spinner({ width=6, radius=30, color=0xffffff, alpha=0.8, ...props }) {
  const arc = new PIXI.Graphics()
  const ease = easing.mirrored(easing.createExpoIn(3))

  let t = 0
  useUpdate((delta) => {
    t+= delta

    const v = t/1500 // arc rotation 1.5s/round
    const r = t/1800 // overall rotation 1.8s/round
    const start = r+ease(v%1)
    const end = r+ease((v+0.5)%1) // offset 0.5
    arc.clear()
    arc.lineStyle(width, color, alpha)
    arc.arc(0, 0, radius, start * Math.PI*2, end * Math.PI*2)
  })

  return <Node el={arc} {...props}></Node>
}
