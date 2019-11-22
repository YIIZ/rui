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



let sharedRenderer
let sharedRenderTexture
export function capture(
  displayObject,
  { format = 'image/jpeg', quality = 0.8, width=displayObject.width, height=displayObject.height } = {}
) {
  // cache
  const renderer = sharedRenderer = sharedRenderer || PIXI.autoDetectRenderer()
  const rt = sharedRenderTexture = sharedRenderTexture || PIXI.RenderTexture.create(0, 0)
  rt.resize(width, height)
  renderer.render(displayObject, rt)
  const dataURL = renderer.extract.canvas(rt).toDataURL(format, quality)
  return dataURL
}

