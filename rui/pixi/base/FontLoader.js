import WebFontLoader from 'webfontloader'
import { Loader, LoaderResource, Rectangle, Texture } from 'pixi.js'

async function pre(resource, next) {
  const { extension, name, url } = resource
  if (extension !== 'ttf') {
    next()
    return
  }

  await new Promise((resolve, reject) => {
    const style = document.createElement('style')
    style.append(`@font-face { font-family: "${name}"; src: url("${url}"); }`)
    document.head.append(style)
    WebFontLoader.load({
      timeout: 60*1000, // 1min
      custom: { families: [name] },
      active: resolve,
      inactive: reject,
    })
  })

  resource.complete()
  next()
}

Loader.registerPlugin({ pre })

