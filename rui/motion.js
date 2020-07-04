import { take, compute, peek } from 'rui'
import sync, { cancelSync } from 'framesync'

// inspired by react-spring
// https://github.com/react-spring/react-spring/blob/master/src/animated/FrameLoop.ts#L76-L83
// TODO
// universal physics? decay?
// spring equation?
// https://github.com/Popmotion/popmotion/blob/67de44d30e7e5fa3eb14f7cf60b97dd96fe34cd8/packages/popmotion/src/animations/spring.ts#L22-L63
export const spring = (getTo, {
  from=peek(getTo), velocity: initialVelocity=0,
  mass=1, tension=170, friction=26, precision=0.01,
}={}) => {
  let current = from
  let to
  let velocity = initialVelocity


  let forceUpdate = false
  const animate = take(() => forceUpdate = !forceUpdate, update => {
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
    const complete = velocity < precision && Math.abs(to - current) < precision
    // NOTICE: velocity changed, current not changed
    if (!complete) animate() // update current&velocity if not complete
    return complete
  })
  const animating = compute(() => !complete())
  const value = compute(() => {
    if (complete()) {
      return to
    }
    else {
      animate() // subscribe animation
      return current
    }
  })

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

