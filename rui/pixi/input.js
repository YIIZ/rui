// @jsx h
import { h, value, compute, hook, if as _if, each, isCompute, apply } from 'rui'
import { Element } from 'rui/src/html'
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


function Form({ text, type, active, onSubmit, onDestroy }) {
  const h = buildDOM

  let input
  const submit = (evt) => {
    evt.preventDefault()
    const inputEl = input.el
    const { value } = inputEl
    inputEl.value = ''

    const text = value.trim()
    if (text) {
      onSubmit(text)
      // hide()
    }
  }

  const [ani, animating] = spring(() => active() ? 1 : 0, { from: 0 })
  apply(() => {
    if (active() && !animating()) input.el.focus()
    if (!active() && !animating()) onDestroy()
  })

  // TODO html mask?
  return <form action="" onsubmit={submit} style={{
    display: 'flex',
    zIndex: 100,
    padding: 10,
    boxSizing: 'border-box',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#1c1c1c',
    borderTop: '1px solid #282828',
    y: compute(() => (1-ani())*50),
    opacity: ani,
  }}>
    {input = <input type={type} value={text} style={{
      flex: 1,
      boxSizing: 'border-box',
      color: '#fff',
      borderRadius: 4,
      outline: 0,
      padding: '6px 12px',
      border: 0,
      backgroundColor: '#282828',
      fontSize: 16,
    }}/>}
    <button type="submit" style={{
      marginLeft: 8,
      color: '#fff',
      borderRadius: 4,
      outline: 0,
      padding: '6px 12px',
      border: 0,
      backgroundColor: '#333',
      fontSize: 16,
    }}>确定</button>
  </form>
}

let formCache
export default (initText='', type='text') => {
  if (!formCache) {
    const [active, setActive] = value(false)
    const [text, setText] = value('')
    const [type, setType] = value('text')

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
      type={type}
      onDestroy={detach}
      onSubmit={t => {
        onSubmit(t)
        formCache.close()
      }}
    />
    formCache = {
      open: (text, type, handler) => {
        setText(text)
        setType(type)
        onSubmit = handler
        setActive(true)
        attach()
      },
      close: () => {
        setActive(false)
      },
    }
  }

  return new Promise(resolve => formCache.open(initText, type, resolve))
}
