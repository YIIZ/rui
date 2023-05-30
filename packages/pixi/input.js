// @jsx h
import { h, value, compute, hook, if as _if, each, isCompute, apply } from '@rui/core'
import { Element } from '@rui/core/src/html'
import styler from 'stylefire'
import { spring } from '../motion'

function buildDOM(Tag, { style, ...props }, ...children) {
  const node = typeof Tag === 'string'
    ? <Element tag={Tag} {...props}>{...children}</Element>
    : <Tag {...props}>{...children}</Tag>

  const s = styler(node.el)
  Object.entries(style).forEach(([key, value]) => {
    if (isCompute(value)) apply(() => s.set(key, value()))
    else s.set(key, value)
  })

  return node
}


function Form({ text, active, onSubmit, onDestroy }) {
  const h = buildDOM

  let input
  const submit = (evt) => {
    evt.preventDefault()
    const inputEl = input.el
    const { value } = inputEl
    inputEl.value = ''

    const text = value.trim()
    onSubmit(text)
  }

  const [ani, animating] = spring(() => active() ? 1 : 0, { from: 0 })
  apply(() => {
    if (active()) input.el.focus()
    if (!active() && !animating()) onDestroy()
  })

  // TODO html mask?
  // TODO theme dark/light
  return <form action="" onsubmit={submit} style={{
    display: 'flex',
    zIndex: 100,
    padding: 10,
    boxSizing: 'border-box',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#f6f6f6', // '#1c1c1c',
    borderTop: '1px solid #dbdbdb', // #282828
    y: compute(() => `${(1-ani())*100}%`),
    opacity: compute(() => Math.max(0.1, ani())), // fix focus when opacity < 0.1
  }}>
    {input = <input type="text" value={text} style={{
      flex: 1,
      boxSizing: 'border-box',
      color: '#0d0d0d', // '#fff',
      borderRadius: 4,
      outline: 0,
      padding: '6px 12px',
      border: 0,
      backgroundColor: '#fff', //'#282828',
      fontSize: 16,
    }}/>}
    <button type="submit" style={{
      marginLeft: 8,
      color: '#0d0d0d', //'#fff',
      borderRadius: 4,
      outline: 0,
      padding: '6px 12px',
      border: 0,
      backgroundColor: '#eee', //'#333',
      fontSize: 16,
    }}>确定</button>
  </form>
}

let formCache
// TODO lazy creating, fix stylefire delayed display input(position/zIndex)
if (!formCache) {
  const [active, setActive] = value(false)
  const [text, setText] = value('')

  let onSubmit
  const attach = () => {
    if (!form.attached) { // input while transition hiding
      document.body.appendChild(form.el)
      form.attach()
    }
  }
  const detach = () => {
    document.body.removeChild(form.el)
    form.detach()
  }
  const form = <Form active={active}
    text={text}
    onDestroy={detach}
    onSubmit={t => {
      onSubmit(t)
      formCache.close()
    }}
  />
  formCache = {
    open: (text, handler) => {
      setText(text)
      onSubmit = handler
      setActive(true)
      attach()
    },
    close: () => {
      setActive(false)
    },
  }
}
export default (initText='') => {
  return new Promise(resolve => formCache.open(initText, resolve))
}
