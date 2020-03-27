// supports easeljs like slim json format
// - multiple images support
// - pure array data
// - load image by manual `${id}/${name}`
import { Loader, SpritesheetLoader, LoaderResource, Rectangle, Texture } from 'pixi.js'

// TODO batch?
async function use(resource, next) {
  const { data, metadata } = resource
  if (resource.type !== LoaderResource.TYPE.VIDEO
    || !metadata.blob
  ) {
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
