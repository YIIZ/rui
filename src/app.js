// @jsx h
import { h, useCompute, useState, useEffect } from './core'
import { Element } from './html'

import compute from 'compute-js'
window.compute = compute

function Time() {
  const [date, setDate] = useState(new Date())

  const jsonTime = useCompute(() => date().toJSON())
  const displayTime = useCompute(() => date().toLocaleString())

  useEffect(() => {
    console.log('setInterval')
    const t = setInterval(() => {
      console.log('update time')
      setDate(new Date())
    }, 1000)

    return () => {
      console.log('clearInterval')
      clearInterval(t)
    }
  })


  return <Element tag="time" datetime={jsonTime}>{displayTime}</Element>
}

function App() {
  const [show, setShow] = useState(false)
  const [name, setName] = useState('gates')
  const fullname = useCompute(() => `bill ${name()}`)

  window.setName = setName
  window.setShow = setShow
  window.fullname = fullname

  return <Element tag="div">
    <Element tag="div">Hi {fullname}</Element>
    <Element tag="button" onclick={() => setShow(!show())}>Toggle</Element>
    <Element tag="div">{useCompute(() => show() ? <Time/> : null)}</Element>
  </Element>
}

const app = <App></App>
document.body.appendChild(app.el)
app.attach()
window.app = app
