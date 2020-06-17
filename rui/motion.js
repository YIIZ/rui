import { take, compute } from 'rui'
import sync, { cancelSync } from 'framesync'

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
  let to
  let velocity = initialVelocity

  const animate = take(() => current, update => {
    const process = sync.update(({ delta: elapsed }) => {
      const force = tension * (to - current)
      const damping = friction * velocity
      const acceleration = (force - damping) / mass
      velocity += (acceleration * elapsed) / 1000
      current += (velocity * elapsed) / 1000
      update()
    }, true)
    return () => cancelSync.update(process)
  })
  const complete = compute(() => {
    to = getTo()
    return velocity < precision && Math.abs(to - current) < precision
  })
  const animating = compute(() => !complete())
  const value = compute(() => complete() ? to : animate())
  return [value, animating]
}


// TODO
// tween
// chain? keyframes? composite?
