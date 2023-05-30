import { take, compute, peek } from '@rui/core'
// import { interpolate } from 'popmotion'
import { pageVisible } from './platform'

// // convenience method
// export const interp = (source, input, output) => {
//   const p = interpolate(input, output)
//   return compute(() => p(source()))
// }

const getTimestamp = () => performance.now()
export const timestamp = take(getTimestamp, update => {
  let f
  const loop = () => {
    update()
    f = requestAnimationFrame(loop)
  }
  f = requestAnimationFrame(loop)
  return () => cancelAnimationFrame(f)
})

export const useVisibleTime = () => {
  let invisibleTime = 0
  let invisibleStart = 0
  const setInvisibleStart = compute(() => {
    if (!pageVisible()) invisibleStart = peek(timestamp)
  })
  return compute(() => {
    setInvisibleStart()
    const t = timestamp()
    if (invisibleStart > 0) {
      invisibleTime += t - invisibleStart
      invisibleStart = 0
    }
    return t - invisibleTime
  })
}

export const useElapsed = () => {
  let startTime
  const initStartTime = compute(() => {
    startTime = peek(timestamp)
  })
  return compute(() => {
    const t = timestamp()
    initStartTime()
    return t - startTime
  })
}
export const useDelta = () => {
  let lastTime = 0
  const initLastTime = compute(() => {
    lastTime = peek(timestamp)
  })
  const getDelta = compute(() => {
    const currentTime = timestamp()
    initLastTime()
    const delta = currentTime - lastTime
    lastTime = currentTime
    return [delta] // force update
  })
  return () => getDelta()[0]
}


// inspired by react-spring
// https://github.com/react-spring/react-spring/blob/master/src/animated/FrameLoop.ts#L76-L83
// TODO
// universal physics? decay?
// spring equation?
// https://github.com/Popmotion/popmotion/blob/67de44d30e7e5fa3eb14f7cf60b97dd96fe34cd8/packages/popmotion/src/animations/spring.ts#L22-L63
export const spring = (getTo, {
  from=getTo(), velocity: initialVelocity=0,
  mass=1, tension=170, friction=26, precision=0.01,
}={}) => {
  let current = from
  let velocity = initialVelocity

  const getDelta = useDelta()
  const calc = compute(() => {
    const to = getTo()
    const complete = velocity < precision && Math.abs(to - current) < precision
    if (complete) return [to, false]

    const delta = Math.min(getDelta(), 40) // max 40ms

    const force = tension * (to - current)
    const damping = friction * velocity
    const acceleration = (force - damping) / mass
    velocity += (acceleration * delta) / 1000
    current += (velocity * delta) / 1000

    return [current, true]
  })

  const value = compute(() => calc()[0])
  const animating = compute(() => calc()[1])
  return [value, animating]
}


// TODO remove
// tween
// chain? keyframes? composite?
export const useAction = (getAction) => {
  const animate = compute(() => {
    const action = getAction()
    let v
    return take(() => v, update => {
      const play = action.start({
        update: (_v) => {
          v = _v
          update()
        },
        // complete: () => ,
      })
      return () => play.stop()
    })
  })
  return compute(() => animate()())
}

