// @jsx h
import { h, value, compute, hook, if as _if, each } from 'rui'
import { Sprite, Container } from './nodes'

import { everyFrame } from 'popmotion'

import DOMDummy from './DOMDummy'

export default function Video({ src, onEnd, width, height, ...props }) {
  const [time, setTime] = value(0)
  const [playing, setPlaying] = value(false)
  const [duration, setDuration] = value(Infinity)
  const remain = compute(() => duration() - time())


  const onplaying = () => {
    const check = everyFrame().start(() => {
      if (dom.paused) {
        check.stop()
        return
      }
      if (dom.currentTime >= 0.1) {
        check.stop()
        setPlaying(true)
      }
    })
  }
  const onpause = () => {
    setPlaying(false)
  }

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
    ontimeupdate={() => setTime(dom.currentTime)}
    onplaying={onplaying}
    onpause={onpause}
  >
    {node}
  </DOMDummy>
  const { dom } = dummy

  dummy.playing = playing
  dummy.time = time
  dummy.duration = duration
  dummy.remain = remain
  dummy.play = async () => {
    dom.play()
    await new Promise((resolve) => {
      // TODO bug, play and pause
      // merge onplaying
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
  // TODO no reset?
  dummy.reset = () => {
    setTime(0)
    setDuration(Infinity)
  }

  return dummy
}
