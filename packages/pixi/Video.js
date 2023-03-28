// @jsx h
import { h, value, compute, hook, if as _if, each, computeWatch } from 'rui'
import { Sprite, Container } from './nodes'
import { timestamp } from '../motion'

import DOMDummy from './DOMDummy'

export default function Video({ src, onEnd, width, height, domProps={}, ...props }) {
  const [playing, setPlaying] = value(false)
  // precision time
  const time = compute(() => {
    if (playing()) {
      timestamp()
    }
    return dom.currentTime
  })
  const [duration, setDuration] = value(Infinity)
  const remain = compute(() => duration() - time())

  const onplaying = () => {
    setPlaying(true)
  }
  const onpause = () => {
    setPlaying(false)
  }
  const truePlaying = compute(() => {
    if (playing() && dom.currentTime >= 0.1) {
      return true
    } else {
      timestamp()
      return false
    }
  })


  // Container has no size
  const node = <Container {...props}><Sprite width={width} height={height}></Sprite></Container>

  // TODO?
  // isQQ && isIOS this.elem.setAttribute('x5-playsinline', 'true')
  const dummy = <DOMDummy tag="video"
    visible
    src={src}
    playsinline
    webkit-playsinline
    onended={onEnd}
    ondurationchange={() => setDuration(dom.duration)}
    onplaying={onplaying}
    onpause={onpause}
    {...domProps}
  >
    {node}
  </DOMDummy>
  const { dom } = dummy

  dummy.playing = truePlaying
  dummy.time = time
  dummy.duration = duration
  dummy.remain = remain
  dummy.play = async () => {
    dom.play()
    await new Promise((resolve) => {
      // TODO bug, play and pause
      // merge onplaying
      const unwatch = computeWatch(() => {
        if (truePlaying()) {
          resolve()
          Promise.resolve().then(unwatch)
        }
      })
    })
  }
  dummy.pause = () => {
    dom.pause()
  }
  // TODO no reset?
  dummy.reset = () => {
    setDuration(Infinity)
  }

  return dummy
}
