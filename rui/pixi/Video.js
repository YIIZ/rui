// @jsx h
import { h, value, compute, hook, if as _if, each } from 'rui'
import { Sprite, Container } from './nodes'

import { everyFrame } from 'popmotion'

import DOMDummy from './DOMDummy'
import Spinner from './Spinner'

export default function Video({ src, onEnd, onTimeUpdate, ratio, width, height, ...props }) {
  const [playing, setPlaying] = value(false)
  const [waiting, setWaiting] = value(false)

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
  const out = <Container>
    {dummy}
    {_if(waiting, () => <Spinner></Spinner>)}
  </Container>


  out.play = async () => {
    setPlaying(true)
    setWaiting(true)
    dom.play()
    await new Promise((resolve) => {
      const play = everyFrame().start(() => {
        if (dom.currentTime >= 0.1) {
          resolve()
          play.stop()
        }
      })
    })
    setWaiting(false)
  }
  out.pause = () => {
    setPlaying(false)
    setWaiting(false)
  }

  return out
}
