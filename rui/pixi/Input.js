// @jsx h
import { h, value, compute, hook, if as _if, each } from 'rui'
import { Element } from 'rui/src/html'
import { Sprite, Text, Container } from './nodes'

import DOMDummy, { attachDOM, domStyleFromNode } from './DOMDummy'
import * as PIXI from 'pixi.js'
import { tween } from 'popmotion'
import * as easing from '@popmotion/easing'

function Caret(props) {
  const [alpha, setAlpha] = value(1)
  hook(() => {
    const play = tween({
      from: 0.8, to: 0, duration: 800,
      yoyo: Infinity,
      ease: easing.linear,
    }).start(setAlpha)
    return () => play.stop()
  })
  return <Sprite tex={PIXI.Texture.WHITE} alpha={alpha}
    width={4}
    {...props}
  />
}

export default function Input({ placeholder, fontSize, fill, fontFamily, ...props }, children) {
  const [text, setText] = value('')
  const usePlaceholder = compute(() => text().length < 1)
  const displayText = compute(() => usePlaceholder() ? placeholder : text())

  // select all on focus https://stackoverflow.com/a/4067488
  const selectAllText = (el) => el.setSelectionRange(0, el.value.length)

  const textNode = <Text fontSize={fontSize} fill={fill} fontFamily={fontFamily}
    alpha={compute(() => usePlaceholder() ? 0.5 : 1)}
  >{displayText}</Text>
  // TODO better position
  textNode.el.text = placeholder
  const caret = <Caret x={textNode.el.width*-0.5-10} height={textNode.el.height} />

  const node = <DOMDummy tag="input"
    style="font-size: 1px; padding: 0; border: 0"
    onclick={({ target }) => selectAllText(target)}
    oninput={({ target }) => setText(target.value)}
  >
    <Container {...props}>
      {...children}
      {_if(usePlaceholder, () => caret)}
      {textNode}
    </Container>
  </DOMDummy>

  // const { dom } = node
  node.value = text
  return node
}

export function BasicInput({ onSubmit }, [node]) {
 const style = domStyleFromNode(node, { visible: false, style: 'padding:0; border:0' })

 const submit = (evt) => {
   evt.preventDefault()
   onSubmit && onSubmit(inputNode.el.value)
   clear()
 }
 const clear = () => {
  inputNode.el.value = ''
 }
 const inputNode = <Element tag="input" type="text" style={style} onfocus={clear}></Element>
 const formNode = <Element tag="form" action="" onsubmit={submit}>{inputNode}</Element>
  attachDOM(formNode)
  return node
}
