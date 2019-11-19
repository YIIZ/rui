// @jsx h
import { h, value, compute, hook, if as _if, each } from 'rui'
import { Text, Container } from './nodes'

import DOMDummy from './DOMDummy'


export default function Input({ placeholder, ratio, fontSize, fill, fontFamily, ...props }, children) {
  const [text, setText] = value(placeholder)

  // select all on focus https://stackoverflow.com/a/4067488
  const selectAllText = (el) => el.setSelectionRange(0, el.value.length)

  const node = <DOMDummy tag="input"
    style="font-size: 1px;" ratio={ratio}
    onclick={({ target }) => selectAllText(target)}
    oninput={({ target }) => setText(target.value || placeholder)}
  >
    <Container {...props}>
      {...children}
      <Text fontSize={fontSize} fill={fill} fontFamily={fontFamily}>{text}</Text>
    </Container>
  </DOMDummy>

  // const { dom } = node
  node.value = text
  return node
}
