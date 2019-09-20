// @jsx h
import { compute, value, hook, if as _if, each } from 'rui'
import h from './h'
import { useHash } from './platform'

import Item from './Item'
import Footer from './Footer'

window.compute = require('compute-js')

class ItemData {
  constructor(text) {
    this.id = Date.now()

    const [title, setTitle] = value(text)
    const [completed, setCompleted] = value(false)

    this.title = title
    this.completed = completed
    this.setTitle = setTitle
    this.setCompleted = setCompleted
  }
}

function App() {
  const [todos, setTodos] = value([new ItemData('hello')])
  const [title, setTitle] = value('')
  const [editing, setEditing] = value()

  const hash = useHash()
  const route = compute(() => hash().slice(1)) // strip /
  const displayTodos = compute(() => {
    if (route() === '') return todos()
    if (route() === 'active') return todos().filter(todo => !todo.completed())
    if (route() === 'completed') return todos().filter(todo => todo.completed())
  })

  const activeTodoCount = compute(() => {
    return todos().reduce((acc, todo) => todo.completed() ? acc : acc + 1, 0)
  })

  const completedCount = compute(() => todos().length - activeTodoCount())


  const onkeydown = (evt) => {
    if (evt.code !== 'Enter') return
    evt.preventDefault()

    const value = title()
    setTitle('')

    setTodos(todos().concat(new ItemData(value)))
  }
  const cancel = () => setEditing(null)
  const save = (todo, newVal) => {
    console.log(`save ${todo.id}: ${newVal}`)
    todo.setTitle(newVal)
    setEditing(null)
  }
  const destroy = (id) => {
    setTodos(todos().filter(todo => todo.id !== id))
  }
  const toggle = (todo) => {
    console.log(`toggle ${todo.id}`)
    todo.setCompleted(!todo.completed())
  }
  const toggleAll = ({ target }) => {
    const completed = target.checked
    todos().forEach((todo) => todo.setCompleted(completed))
  }
  const clearCompleted = () => {
    setTodos(todos().filter(todo => !todo.completed()))
  }

  return <div>
    <header className="header">
      <h1>todos</h1>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        autofocus
        value={title}
        onkeydown={onkeydown}
        oninput={({ target }) => setTitle(target.value)}
      />
    </header>
    {_if(() => displayTodos().length > 0, () => {
      console.log('render main')
      return <section className="main">
        <input
          id="toggle-all"
          className="toggle-all"
          type="checkbox"
          onchange={toggleAll}
          checked={compute(() => activeTodoCount() === 0)}
        />
        <label
          htmlFor="toggle-all"
        />
        <ul className="todo-list">
          {each(displayTodos, todo => <Item
            key={todo.id}
            todo={todo}
            onToggle={() => toggle(todo)}
            onDestroy={() => destroy(todo.id)}
            onEdit={() => setEditing(todo.id)}
            editing={compute(() => editing() === todo.id)}
            onSave={(val) => save(todo, val)}
            onCancel={cancel}
          />)}
        </ul>
      </section>
    })}

    {_if(() => activeTodoCount() || completedCount(), () => {
      console.log('render footer')
      return <Footer
        count={activeTodoCount}
        completedCount={completedCount}
        nowShowing={hash}
        onClearCompleted={clearCompleted}
      />
    })}
  </div>
}

const app = <App></App>
document.querySelector('.todoapp').appendChild(app.el)
app.attach()
