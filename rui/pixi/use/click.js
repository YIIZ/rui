import { compute, useRoot, isCompute } from 'rui'

export function useClick(listener) {
  return ({ currentTarget, data }) => {
    const { global: { x: sx, y: sy } } = data
    currentTarget.once('pointerup', (evt) => {
      const { data } = evt
      const { global: { x, y } } = data
      if ((x-sx)**2+(y-sy)**2 < 100) listener(evt)
    })
  }
}
