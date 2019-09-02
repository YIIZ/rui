// @jsx h
import { useCompute, useState } from './core'
import h from './html'

function Time() {
  const [date, setDate] = useState(new Date())

  const jsonTime = useCompute((date) => date.toJSON(), [date])
  const displayTime = useCompute((date) => date.toLocaleString(), [date])

  // useEffect
  let t
  const onAttached = () => {
    console.log('attached')
    t = setInterval(() => {
      console.log('update time')
      setDate(new Date())
    }, 1000)
  }
  const onDetached = () => {
    console.log('detached')
    clearInterval(t)
  }

  return <time datetime={jsonTime} onAttached={onAttached} onDetached={onDetached}>{displayTime}</time>
}

function App() {
  const [show, setShow] = useState(false)

  const [name, setName] = useState('gates')
  const fullname = useCompute((name) => `bill ${name}`, [name])

  window.setName = setName
  window.setShow = setShow

  return <div>
    <span>Hi {fullname}</span>
    {useCompute((show) => {
      console.log('new time')
      return show ? <Time/> : null
    }, [show])}
    {useCompute((show) => {
      return show ? <span>Hi {fullname}</span> : null
    }, [show])}
  </div>
}

const app = <App></App>
app.attached()
document.body.appendChild(app.el)

