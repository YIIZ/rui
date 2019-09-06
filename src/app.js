// @jsx h
import { h, useCompute, useState, useEffect } from './core'
import { Element } from './html'


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
    <Element tag="span">Hi {fullname}</Element>
    {useCompute(() => {
      console.log('new time')
      return show() ? <Time/> : null
    })}
    {useCompute(() => {
      return show() ? <Element tag="span">Hi {fullname}</Element> : null
    })}
  </Element>
}

const app = <App></App>
document.body.appendChild(app.el)
app.attach()
window.app = app
