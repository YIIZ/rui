const SUPPORTED = typeof TransitionEvent !== 'undefined'

document.addEventListener('transitionend', ({ target }) => {
  target.classList.remove('transiting')
}, false)
document.addEventListener('webkitTransitionEnd', ({ target }) => {
  target.classList.remove('transiting')
}, false)

export const fadeIn = el => {
  if (SUPPORTED) {
    el.classList.add('transiting')
    el.offsetTop // reflow
  }
  el.classList.add('in')
}
export const fade = el => {
  if (!el.classList.contains('in')) return
  if (SUPPORTED) {
    el.classList.add('transiting')
  }
  el.classList.remove('in')
}
