// supports easeljs like slim json format
// - multiple images support
// - pure array data
// - load image by manual `${id}/${name}`
import { Loader, LoaderResource, Rectangle, Texture } from 'pixi.js'

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
