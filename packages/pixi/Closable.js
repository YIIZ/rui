// @jsx h
import * as PIXI from 'pixi.js'
import { h, value, compute, replace } from '@rui/core'
import { Container } from './nodes'

export default function Closable({ open, ...props }, children) {
  return <Container visible={open} {...props}>
    {replace(() => open() ? children : null)}
  </Container>
}
