// @jsx h
import { useState, useCompute } from './core'
import h from './html'

function Time(h) {
  const [time, setTime] = useState(new Date())

  const onAttached = () => {
    const t = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => {
      console.log('clean')
      clearTimeout(t)
    }
  }

  return <time onAttached={onAttached}>{time}</time>
}

function App(h) {
  const [name, setName] = useState('bill')
  const fullName = useCompute(() => `${name} gates`)

  const [show, setShow] = useState(false)

  window.setName = setName
  window.setShow = setShow
  window.node = node

  return <div title={fullName} onAttached={() => console.log('hehe')}>
    <span>hello {fullName}!</span>
    {useCompute(() => show.valueOf() ? <Time></Time> : null )}
  </div>
}

const node = <App></App>
// node.onAttached()
// document.body.appendChild(node.el)
document.body.appendChild(node)


const A = () => <div>A</div>
const B = () => <A></A>
const C = () => <B></B>
const c = <C></C>

window.c = c
// document.body.appendChild(c.el)

