// supports easeljs like slim json format
// - multiple images support
// - pure array data
// - load image by manual adding `${id}-${index}`
import { Loader, SpritesheetLoader, LoaderResource, Rectangle, Texture } from 'pixi.js'

// TODO batch?
async function use(resource, next) {
  const { data } = resource
  if (resource.type !== LoaderResource.TYPE.JSON
    || !data.frames
    || !data.images
  ) {
    next()
    return
  }

  const baseTextures = await Promise.all(data.images.map(async (name, index) => {
    const res = this.resources[`${resource.name}-${index}`]
    // wait dep res complete
    // res.isComplete is not safe
    // https://github.com/englercj/resource-loader/blob/60539c696216b5a2a941ca7dc50d81b3af616807/src/Loader.js#L646
    // https://github.com/englercj/resource-loader/blob/60539c696216b5a2a941ca7dc50d81b3af616807/src/async.js#L40-L42
    if (!res.texture) await new Promise(r => res.onAfterMiddleware.once(r))
    return res.texture.baseTexture
  }))

  const textures = data.frames.map((frameArray) => {
    const [x,y,w,h,imageIndex,dx,dy] = frameArray.map(Math.floor)

    const baseTexture = baseTextures[imageIndex]
    const orig = new Rectangle(0, 0, w, h)
    const frame = new Rectangle(x, y, w, h)
    const trim = new Rectangle(-dx, -dy, w, h)

    // https://github.com/pixijs/pixi.js/blob/bc43647acd022a3945f32923d956cb03ebe55d20/packages/spritesheet/src/Spritesheet.js#L194-L245
    const tex = new Texture(
      baseTexture,
      frame,
      orig,
      trim,
      // 0, // rotated TODO?
      // anchor TODO?
    )
    return tex
  })

  const animations = Object.fromEntries(Object.entries(data.animations).map(([name, { frames }]) =>
    [name, frames.map(k => textures[k])]
  ))

  resource.textures = textures
  resource.animations = animations
  next()
}

{
  // remove incompatible SpritesheetLoader
  const i = Loader._plugins.indexOf(SpritesheetLoader)
  Loader._plugins.splice(i, 1)
}
Loader.registerPlugin({ use })
