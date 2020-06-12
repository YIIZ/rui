import { take, compute } from 'rui'


export const damp = (getTo, damping=10) => {
  const ratio = 1/60/damping

  let current = getTo()
  const ani = compute(() => {
    const to = getTo()
    return take(() => current, (update) => {
      let last = performance.now()
      let r = requestAnimationFrame(function loop(now) {
        const elapsed = now - last
        last = now

        const delta = (to-current)*ratio*elapsed
        current += delta
        update()

        // TODO fix restDelta
        if (Math.abs(to-current) < 0.01) {
          current = to
        } else {
          r = requestAnimationFrame(loop)
        }
      })
      return () => cancelAnimationFrame(r)
    })
  })

  // cache
  return compute(() => ani()())
}


// export const tween
// export const spring

// timeline?
