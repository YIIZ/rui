import { take, computeWatch } from 'rui'
import { Howl, Howler } from 'howler'

import { pageVisible } from './platform'

export class Audio extends Howl {
  constructor(options) {
    super(options)


    // TODO multiple state control?
    // playing = compute(() => visible() && started() && !mute())

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

    // pause if document hidden
    this.once('play', () => {
      // TODO clean?
      const unwatch = computeWatch(() => {
        if (!pageVisible() && super.playing()) {
          unwatch()
          this.pause()

          const unwatch2 = computeWatch(() => {
            if (pageVisible()) {
              unwatch2()
              this.play()
            }
          })
        }
      })
    })
  }
}

export default Audio
