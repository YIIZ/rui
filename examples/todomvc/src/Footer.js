// @jsx h
import { compute, if as _if } from 'rui'
import h from './h'

import { classNames } from './helpers'

export default function Footer({ count, completedCount, nowShowing, onClearCompleted }) {
  const activeTodoWord = compute(() => count() > 1 ? 'items' : 'item')

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{count}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <a href="#/" className={classNames({ selected: compute(() => nowShowing() === '') })}>
            All
          </a>
        </li>{' '}
        <li>
          <a href="#/active" className={classNames({ selected: compute(() => nowShowing() === 'active') })}>
            Active
          </a>
        </li>{' '}
        <li>
          <a
            href="#/completed"
            className={classNames({ selected: compute(() => nowShowing() === 'completed') })}
          >
            Completed
          </a>
        </li>
      </ul>
      {_if(completedCount, () =>
        <button className="clear-completed" onclick={onClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  )
}
