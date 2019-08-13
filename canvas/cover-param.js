// cover fill mode
// https://github.com/fregante/intrinsic-scale/blob/master/index.js
// ctx.drawImage(...coverParam(img, x, y, w, h))
export default function coverParam(image, x, y, w, h) {
  const { width, height } = image

  const doRatio = width / height
  const cRatio = w / h

  const [tw, th] = doRatio > cRatio ? [h*doRatio, h] : [w, w / doRatio]

  const sx = (tw - w) * 0.5
  const sy = (th - h) * 0.5
  const sw = width / tw * w
  const sh = height / th * h

  return [image, sx, sy, sw, sh, x, y, w, h]
}
