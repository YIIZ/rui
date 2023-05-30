// @jsx h
import * as PIXI from 'pixi.js'
import { h, value, compute, if as _if } from '@rui/core'
import { Container } from './nodes'

// TODO
// design
// const popup = <Opener N={Popup}/>; popup.open()
// or <Opener>{Popup}</Opener>

export default function Opener(props, [build]) {
  const [isOpen, setOpen] = value(false)
  const open = () => setOpen(true)
  const close = () => setOpen(false)

  const node = <Container visible={isOpen} {...props}>
    {_if(isOpen, () => build(close))}
  </Container>

  node.open = open
  node.close = close
  return node
}
