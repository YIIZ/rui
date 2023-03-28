import { Loader, LoaderResource, Rectangle, Texture } from 'pixi.js'

// TODO use resource-loader's built-in blob type
async function use(resource, next) {
  const { data, loadType } = resource
  if (resource.loadType !== 'blob') {
    next()
    return
  }

  fetch(resource.url)
  .then(res => res.blob())
  .then(blob => URL.createObjectURL(blob))
  .then(url =>{
    resource.blobUrl = url
    next()
  })
}

Loader.registerPlugin({ use })
