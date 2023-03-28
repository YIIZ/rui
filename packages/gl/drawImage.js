// https://github.com/gameclosure/webgl-2d/blob/master/webgl-2d.js#L1248
// TODO

var imageCache = [],
  textureCache = []

function Texture(image) {
  this.obj = gl.createTexture()
  this.index = textureCache.push(this)

  imageCache.push(image)

  // we may wish to consider tiling large images like this instead of scaling and
  // adjust appropriately (flip to next texture source and tile offset) when drawing
  if (image.width > gl2d.maxTextureSize || image.height > gl2d.maxTextureSize) {
    var canvas = document.createElement('canvas')

    canvas.width = image.width > gl2d.maxTextureSize ? gl2d.maxTextureSize : image.width
    canvas.height = image.height > gl2d.maxTextureSize ? gl2d.maxTextureSize : image.height

    var ctx = canvas.getContext('2d')

    ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height)

    image = canvas
  }

  gl.bindTexture(gl.TEXTURE_2D, this.obj)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

  // Enable Mip mapping on power-of-2 textures
  if (isPOT(image.width) && isPOT(image.height)) {
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
    gl.generateMipmap(gl.TEXTURE_2D)
  } else {
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  }

  // Unbind texture
  gl.bindTexture(gl.TEXTURE_2D, null)
}


function drawImage(image, a, b, c, d, e, f, g, h) {
  var transform = gl2d.transform

  transform.pushMatrix()

  var sMask = shaderMask.texture
  var doCrop = false

  //drawImage(image, dx, dy)
  if (arguments.length === 3) {
    transform.translate(a, b)
    transform.scale(image.width, image.height)
  } else if (arguments.length === 5) {
    //drawImage(image, dx, dy, dw, dh)
    transform.translate(a, b)
    transform.scale(c, d)
  } else if (arguments.length === 9) {
    //drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
    transform.translate(e, f)
    transform.scale(g, h)
    sMask = sMask | shaderMask.crop
    doCrop = true
  }

  var shaderProgram = gl2d.initShaders(transform.c_stack, sMask)

  var texture,
    cacheIndex = imageCache.indexOf(image)

  if (cacheIndex !== -1) {
    texture = textureCache[cacheIndex]
  } else {
    texture = new Texture(image)
  }

  if (doCrop) {
    gl.uniform4f(
      shaderProgram.uCropSource,
      a / image.width,
      b / image.height,
      c / image.width,
      d / image.height
    )
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, rectVertexPositionBuffer)
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 4, gl.FLOAT, false, 0, 0)

  gl.bindTexture(gl.TEXTURE_2D, texture.obj)
  gl.activeTexture(gl.TEXTURE0)

  gl.uniform1i(shaderProgram.uSampler, 0)

  sendTransformStack(shaderProgram)
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)

  transform.popMatrix()
}
