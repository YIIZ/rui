import { take } from 'rui'
import { Howl, Howler } from 'howler'

export class Audio extends Howl {
  constructor(options) {
    super(options)

    this.playing = take(() => super.playing(), update => {
      this.on('play', update)
      this.on('pause', update)
      // this.on('stop', update)
      // this.on('end', update)
      return () => {
        this.off('play', update)
        this.off('pause', update)
      }
    })
  }
}

export default Audio
