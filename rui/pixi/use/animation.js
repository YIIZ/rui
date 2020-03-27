import { value, compute, replace, hook, watch, isCompute, peek } from 'rui'
import { spring, parallel, stagger, Action } from 'popmotion'

function usePlay({ getAction, update }) {
  const [playing, setPlaying] = value(null)
  function stop() {
    if (playing()) {
      playing().stop()
      setPlaying(null)
    }
  }
  hook(() => stop)
  watch(compute(() => getAction()), (newAction) => {
    stop()
    if (!newAction) return
    setPlaying(
      newAction.start({ update, complete: stop })
    )
  })
  // TODO?
  // .pause() .resume()

  return playing
}

function useBasicAction(init, getAction) {
  const [v, update] = value(init)

  return {
    getAction: () => getAction(peek(v)),
    update,
    value: v,
  }
}

function useParallel() {
  const targets = []
  return {
    getAction: () => {
      const actions = targets.map(({ getAction }) => getAction())
      return parallel(...actions)
    },
    update: values => values.forEach((v, i) => targets[i].update(v)),
    add: (target) => targets.push(target),
  }
}

function useStagger(getInterval=()=>100) {
  const targets = []

  // TODO better?
  // return update also?
  let updates
  return {
    getAction: () => {
      const interval = getInterval()
      const sorted = interval > 0 ? targets : targets.slice().reverse()

      const actions = sorted.map(({ getAction }) => getAction())
      updates = sorted.map(({ update }) => update)
      // TODO zero actions cause error
      return stagger(actions, interval > 0 ? interval : -interval)
    },
    update: values => values.forEach((v, i) => updates[i](v)),
    add: (target) => targets.push(target),
  }
}
export { usePlay, useBasicAction, useStagger, useParallel }

// ez api1
function useAni() {
  const group = useParallel()
  const playing = usePlay(group)

  const ani = (init, toAction) => {
    const basic = useBasicAction(init, toAction)
    group.add(basic)
    return basic.value
  }
  ani.playing = playing
  return ani
}

// TODO zero ani error bug
function useSpringAni(stiffness=170, damping=26/*, mass=1*/) {
  const ani = useAni()

  const ani2 = (toValue) => ani(toValue(), (from) =>
    spring({ from, to: toValue(), stiffness, damping })
  )
  ani2.playing = ani.playing
  return ani2
}
// bad practice api?
function springAni(to, ...args) {
  return useSpringAni(...args)(to)
}
function springAni2(to, stiffness=170, damping=26) {
  const basic = useBasicAction(to(), (from) =>
    spring({ from, to: to(), stiffness, damping })
  )
  usePlay(basic)
  return basic.value
}
export { useAni, useSpringAni, springAni }
