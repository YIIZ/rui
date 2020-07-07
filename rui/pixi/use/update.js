import { hook } from 'rui'

export function useUpdate(fn) {
  hook(({ root: { ticker } }) => {
    const update = () => {
      const { deltaMS, deltaTime, elapsedMS } = ticker
      fn(deltaMS, deltaTime, elapsedMS)
    }
    ticker.add(update)
    return () => ticker.remove(update)
  })
}
