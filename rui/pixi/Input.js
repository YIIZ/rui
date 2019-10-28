// @jsx h
import { h, value, compute, hook, if as _if, each } from 'rui'
import { Text } from './nodes'

import DOMDummy from './DOMDummy'


export default function Input({ width, placeholder, ratio, ...props }) {
  const [text, setText] = value(placeholder)
  const node = <Text {...props}>{text}</Text>
  node.value = text

  // TODO select all on focus
  return <DOMDummy tag="input"
    fixedWidth={width} style="font-size: 1px;" ratio={ratio}
    oninput={({ target }) => setText(target.value || placeholder)}
  >
    {node}
  </DOMDummy>
}
