// @jsx h
import { h, value, compute, hook, if as _if, each } from 'rui'
import * as PIXI from 'pixi.js'
import { Container, Sprite, Spine, Text } from './nodes'

export default function Progress({ value, barTex, vertical=false, ...props }, children) {

  const barMask = vertical
  ? <Sprite tex={PIXI.Texture.WHITE}
    anchor={[0.5, 1]}
    width={barTex.width}
    height={compute(() => value() * barTex.height)}
    y={barTex.height * 0.5}
  ></Sprite>
  : <Sprite tex={PIXI.Texture.WHITE}
    anchor={[0, 0.5]}
    width={compute(() => value() * barTex.width)}
    height={barTex.height}
    x={barTex.width * -0.5}
  ></Sprite>

  return <Sprite {...props}>
    <Sprite tex={barTex} mask={barMask.el}>{barMask}</Sprite>
    <Container x={compute(() => (value() - 0.5) * barTex.width)}>{...children}</Container>
  </Sprite>
}
