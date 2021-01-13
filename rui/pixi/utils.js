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
export const oncePointerDrag = (target, handler, endHandler) => {
  target.on('pointermove', handler)
  oncePointerEnd(target, (...args) => {
    target.off('pointermove', handler)
    endHandler(...args)
  })
}

// export const awaitTween = playback =>


async function doload(list, onProgress) {
  const loader = PIXI.Loader.shared

  for (const [id, image, metadata, loadType ] of list) {
    loader.add(`${id}`, image, { metadata, loadType })
  }

  await new Promise((resolve) => {
    const onProgress2 = () => onProgress(loader.progress/100)
    const binding = loader.onProgress.add(onProgress2)
    loader.onComplete.once(() => {
      binding.detach()
      resolve()
    })
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
  { format = 'image/png', quality = 1 } = {}
) {
  const { x, y, width, height } = displayObject.getBounds()
  const container = new PIXI.Container()
  container.addChild(displayObject)
  container.x = -x
  container.y = -y

  // cache
  const renderer = sharedRenderer = sharedRenderer || PIXI.autoDetectRenderer()
  const rt = sharedRenderTexture = sharedRenderTexture || PIXI.RenderTexture.create(0, 0)
  rt.resize(width, height)
  renderer.render(container, rt)
  const dataURL = renderer.extract.canvas(rt).toDataURL(format, quality)
  return dataURL
}


// TODO better
export function resetEventTarget(app, getRatio) {
  // set event target to support event behind capture img
  const { renderer } = app
  const { interaction } = renderer.plugins
  const target = document.body
  interaction.setTargetElement(target, renderer.resolution)
  // window.interaction = interaction
  const { mapPositionToPoint, normalizeToPointerData } = interaction

  interaction.autoPreventDefault = false
  interaction.normalizeToPointerData = function (event) {
    // fix: prevent pointerupoutside
    // https://github.com/pixijs/pixi.js/blob/902d0029617091a1e67a189b245b5bcd39499974/src/interaction/InteractionManager.js#L1249
    this.interactionDOMElement = event.target
    return normalizeToPointerData.call(this, event)
  }

  interaction.mapPositionToPoint = function (point, x, y) {
    // FIXME?
    // const { devicePixelRatio } = director
    // mapPositionToPoint.call(this, point, x, y)
    // const { resolution, interactionDOMElement } = this
    // interactionDOMElement.width / interactionDOMElement.clientWidth * resolution
    // const { ratio } = app
    point.x = x * getRatio()
    point.y = y * getRatio()
  }

  // FIX PIXI
  // browsers that not support pointer but support touch&mouse
  // when not prevent default, will trigger twice
  // https://github.com/pixijs/pixi.js/blob/902d0029617091a1e67a189b245b5bcd39499974/src/interaction/InteractionManager.js#L737-L755
  // https://github.com/pixijs/pixi.js/blob/902d0029617091a1e67a189b245b5bcd39499974/src/interaction/InteractionManager.js#L1144
  if (!interaction.supportsPointerEvents && interaction.supportsTouchEvents) {
    // https://github.com/pixijs/pixi.js/blob/902d0029617091a1e67a189b245b5bcd39499974/src/interaction/InteractionManager.js#L795-L799
    window.document.removeEventListener('mousemove', interaction.onPointerMove, true)
    interaction.interactionDOMElement.removeEventListener('mousedown', interaction.onPointerDown, true)
    interaction.interactionDOMElement.removeEventListener('mouseout', interaction.onPointerOut, true)
    interaction.interactionDOMElement.removeEventListener('mouseover', interaction.onPointerOver, true)
    window.removeEventListener('mouseup', interaction.onPointerUp, true)
  }
}
