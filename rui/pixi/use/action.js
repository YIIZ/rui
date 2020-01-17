import { value, isCompute, hook, watch } from 'rui'

export function useAction(initial, action) {
  // TODO? auto initial?
  const [v, update] = value(initial)
  if (isCompute(action)) {
    let lastPlay
    watch(action, action => {
      if (lastPlay) lastPlay.stop()
      lastPlay = action.start(update)
    })
    hook(() => {
      return () => {
        // TODO do this in core/watch?
        if (lastPlay) lastPlay.stop()
      }
    })
  } else {
    hook(() => {
      const play = action.start(update)
      return play.stop
    })
  }
  return v
}
