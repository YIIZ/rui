// @jsx h
import { h, compute, useRoot } from '@rui/core'
import * as PIXI from 'pixi.js'
import { Container, Sprite } from './nodes'

export default function Crop({ width, height, ...props }, children) {
  const mask = <Sprite tex={PIXI.Texture.WHITE} width={width} height={height} />
  return <Container mask={mask.el} {...props}>
    {mask}
    {...children}
  </Container>
}
