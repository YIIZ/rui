import { take, computeWatch } from '@rui/core'
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
          // TODO fix, hide first, unwatch unavailable
          this.pause()
          unwatch()

          const unwatch2 = computeWatch(() => {
            if (pageVisible()) {
              this.play()
              unwatch2()
            }
          })
        }
      })
    })
  }
}

export default Audio
