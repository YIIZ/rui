// @jsx h
import { h, compute, value, hook } from './core'
import { Element } from './html'

function Time() {
  const [date, setDate] = value(new Date())

  const jsonTime = compute(() => date().toJSON())
  const displayTime = compute(() => date().toLocaleString())

  hook(() => {
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
  const [show, setShow] = value(false)
  const [name, setName] = value('gates')
  const fullname = compute(() => `bill ${name()}`)

  window.setName = setName
  window.setShow = setShow
  window.fullname = fullname

  return <Element tag="div">
    <Element tag="div">Hi {fullname}</Element>
    <Element tag="button" onclick={() => setShow(!show())}>Toggle</Element>
    <Element tag="div">{compute(() => show() ? <Time/> : null)}</Element>
  </Element>
}

const app = <App></App>
document.body.appendChild(app.el)
app.attach()
window.app = app
