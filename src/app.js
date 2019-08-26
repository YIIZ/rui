// @jsx h
import { useCompute, useState } from './core'
import h from './html'

function Time() {
  const [date, setDate] = useState(new Date())

  const jsonTime = useCompute(() => date().toJSON())
  const displayTime = useCompute(() => date().toLocaleString())

  // useEffect
  setInterval(() => {
    setDate(new Date())
  }, 1000)

  return <time datetime={jsonTime}>{displayTime}</time>
}

function App() {
  const [show, setShow] = useState(false)

  const [name, setName] = useState('gates')
  const fullname = useCompute(() => `bill ${name()}`)

  window.setName = setName
  window.setShow = setShow

  return <div>
    <span>Hi {fullname}</span>
    {useCompute(() => {
      console.log('new time')
      return show() ? <Time/> : null
    })}
  </div>
}

const app = <App></App>
document.body.appendChild(app)

