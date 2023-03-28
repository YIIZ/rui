// multiline text drawing
// based on https://github.com/geongeorge/Canvas-Txt/blob/master/src/index.js
// why
// https://www.npmjs.com/package/canvas-txt: from bottom to top
// https://www.npmjs.com/package/multiline-canvas-text: export canvas
// https://www.npmjs.com/package/canvas-multiline: context api pollution
// https://www.npmjs.com/package/canvas-multiline-text: add space in chinese
export default function drawText(ctx, text, x, y, width, lineHeight=30) {
  const lines = []
  let remain = text
  let cut = 1
  while (true) {
    if (cut >= remain.length) {
      lines.push(remain)
      break
    }
    // same as white-space: pre-wrap
    if (remain[cut] === '\n') {
      lines.push(remain.slice(0, cut))
      remain = remain.slice(cut+1)
      cut = 1
    } else {
      const next = remain.slice(0, cut+1)
      if (ctx.measureText(next).width > width) {
        lines.push(remain.slice(0, cut))
        remain = remain.slice(cut)
        cut = 1
      } else {
        cut += 1
      }
    }
  }

  lines.forEach((line, i) => {
    ctx.fillText(line, x, y+lineHeight*i)
  })
}
