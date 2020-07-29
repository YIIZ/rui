import test from 'ava'
import { fake } from 'sinon'

// import useRouter from './router'

test('take basic', t => {
  t.is(1, 1)
})

// test('take without watch will not cache value', t => {
//   const fn = fake()
//   const get = take(fn, () => t.fail())
//   get()
//   get()
//   get()

//   t.is(fn.callCount, 3)
// })

