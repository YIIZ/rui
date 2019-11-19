import * as PIXI from 'pixi.js'
import { value, compute } from 'rui'
import { tween } from 'popmotion'

export const onPointerEnd = (target, handler) => {
  target.on('pointerup', handler)
  target.on('pointerupoutside', handler)
  target.on('pointercancel', handler)
}
export const oncePointerEnd = (target, handler) => {
  const end = (...args) => {
    target.off('pointerup', end)
    target.off('pointerupoutside', end)
    target.off('pointercancel', end)
    handler(...args)
  }
  onPointerEnd(target, end)
}

// export const awaitTween = playback =>


async function doload(list, onProgress) {
  const loader = PIXI.Loader.shared

  for (const [id, image, metadata] of list) {
    loader.add(`${id}`, image, { metadata })
  }

  await new Promise((resolve) => {
    loader.on('progress', () => onProgress(loader.progress/100))
    loader.on('complete', resolve)
    loader.load()
  })
  return loader.resources
}
export function load(items, { minDuration=0 } = {}) {
  const [ready, setReady] = value(false)
  const [loadProgress, setLoadProgress] = value(0)
  const [fakeProgress, setFakeProgress] = value(0)
  const progress = compute(() => loadProgress() * fakeProgress())

  const realLoad = doload(items, setLoadProgress)
  const fakeLoad = minDuration > 0
    ? new Promise(complete => tween({ duration: minDuration }).start({ update: setFakeProgress, complete }))
    : setFakeProgress(1)

  Promise.all([fakeLoad, realLoad]).then(() => setReady(true))
  realLoad.ready = ready
  realLoad.progress = progress
  return realLoad
}
