// @jsx h
import { compute, value } from 'rui'
import h from './h'
import { classNames } from './helpers'

export default function Item({ todo, editing, onEdit, onSave, onToggle, onDestroy, onCancel }) {
  const [editText, setEditText] = value('')

  const handleSubmit = () => {
    if (!editing()) return
    const val = editText().trim()

    if (val) {
      onSave(val)
    } else {
      onDestroy()
    }
  }
  const handleChange = ({ target }) => {
    setEditText(target.value)
  }
  const handleKeyDown = ({ code }) => {
    if (code === 'Enter') {
      handleSubmit()
    } else if (code === 'Escape') {
      onCancel()
    }
  }


  let editNode
  const handleEdit = () => {
    onEdit()

    const text = todo.title()
    const { el } = editNode
    setEditText(text)
    el.focus()
    el.setSelectionRange(text.length, text.length)
  }

  return (
    <li
      className={classNames({
        completed: todo.completed,
        editing: editing,
      })}
    >
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onchange={onToggle}
        />
        <label ondblclick={handleEdit}>{todo.title}</label>
        <button className="destroy" onclick={onDestroy} />
      </div>
      {editNode = <input
        className="edit"
        value={editText}
        onblur={handleSubmit}
        oninput={handleChange}
        onkeydown={handleKeyDown}
      />}
    </li>
  )
}
