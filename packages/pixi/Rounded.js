// @jsx h
import { h, compute, useRoot } from 'rui'
import * as PIXI from 'pixi.js'
import { Node, Container, Sprite } from './nodes'

export default function Rounded(props, [node]) {
  const { width, height } = node.el

  const g = new PIXI.Graphics()
  g.beginFill(0xFFFFFF, 1)
  // g.drawRoundedRect(width/-2, height/-2, width, height, width/2)
  g.drawCircle(0, 0, width/2)
  g.endFill()

  return <Container mask={g} {...props}>
    <Node el={g}/>
    {node}
  </Container>
}
