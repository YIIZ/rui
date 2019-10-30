// @jsx h
import { h, value, compute, hook, if as _if, each } from 'rui'
import { Sprite, Container } from './nodes'

import { everyFrame } from 'popmotion'

import DOMDummy from './DOMDummy'

export default function Video({ src, onEnd, onTimeUpdate, ratio, width, height, ...props }) {
  // Container has no size
  const node = <Container {...props}><Sprite width={width} height={height}></Sprite></Container>

  // TODO?
  // isQQ && isIOS this.elem.setAttribute('x5-playsinline', 'true')
  const dummy = <DOMDummy tag="video" ratio={ratio}
    visible
    src={src}
    playsinline
    webkit-playsinline
    onended={onEnd}
    ontimeupdate={onTimeUpdate}
  >
    {node}
  </DOMDummy>

  const { dom } = dummy

  dummy.play = async () => {
    dom.play()
    await new Promise((resolve) => {
      const check = everyFrame().start(() => {
        if (dom.currentTime >= 0.1) {
          check.stop()
          resolve()
        }
      })
    })
  }
  dummy.pause = () => {
    dom.pause()
  }

  return dummy
}
