// @jsx h
import * as PIXI from 'pixi.js'
import { h, value, compute, if as _if } from 'rui'
import { Container } from './nodes'

export default function Closable({ open, ...props }, children) {
  return <Container visible={open} {...props}>
    {_if(open, () => children)}
  </Container>
}
