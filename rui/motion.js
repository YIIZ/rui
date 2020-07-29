import { take, compute, peek } from 'rui'
import sync, { cancelSync } from 'framesync'

export const useFrame = () => {
  let delta = 0
  let timestamp = 0
  return take(() => ([delta, timestamp]), update => {
    delta = 0 // reset after re-watch
    const proc = sync.update(({ delta: d, timestamp: t }) => {
      delta = d
      timestamp = t
      update()
    }, true)
    return () => cancelSync.update(proc)
  })
}
export const useElapsed = () => {
  const frame = useFrame()
  let elapsed = 0
  return compute(() => elapsed += frame()[0])
}
const sharedFrame = useFrame()
export { sharedFrame as frame }


// inspired by react-spring
// https://github.com/react-spring/react-spring/blob/master/src/animated/FrameLoop.ts#L76-L83
// TODO
// universal physics? decay?
// spring equation?
// https://github.com/Popmotion/popmotion/blob/67de44d30e7e5fa3eb14f7cf60b97dd96fe34cd8/packages/popmotion/src/animations/spring.ts#L22-L63
export const spring = (getTo, {
  from, velocity: initialVelocity=0,
  mass=1, tension=170, friction=26, precision=0.01,
}={}) => {
  let current
  let velocity = initialVelocity

  const frame = useFrame()
  const initCurrent = compute(() => current = from || peek(getTo))
  const calc = compute(() => {
    const to = getTo()
    // after to prevent multiple call `getTo()`
    initCurrent()
    const complete = velocity < precision && Math.abs(to - current) < precision
    if (complete) return [to, false]

    const [delta] = frame()

    const force = tension * (to - current)
    const damping = friction * velocity
    const acceleration = (force - damping) / mass
    velocity += (acceleration * delta) / 1000
    current += (velocity * delta) / 1000

    return [current, true]
  })

  const value = compute(() => calc()[0])
  const animating = compute(() => calc()[1])

  // TODO, expose { current, to, velocity }?
  return [value, animating]
}


// TODO
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

