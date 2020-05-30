import test from 'ava'
import { take, compute, value, watch } from '../src/compute'

test('take basic', t => {
  let state = 0
  const get = take(() => {
    return state += 1
  }, () => {
    t.fail()
    return () => {}
  })

  t.is(get(), 1)
  t.is(get(), 2)
})

test('take without watch will not cache value', t => {
  t.plan(3)
  const get = take(() => {
    t.pass()
  }, () => {
    t.fail()
    return () => {}
  })
  get()
  get()
  get()
})

test('take with watch will cache value', t => {
  t.plan(2)
  const get = take(() => {
    t.pass()
  }, () => {
    t.pass()
    return () => {}
  })
  watch(() => get())
  get()
  get()
  get()
})

test('watch', t => {
  let watching = false
  const v = take(() => 1, () => {
    watching = true
    return () => {
      watching = false
    }
  })
  const unwatch = watch(() => v())
  t.true(watching)
  unwatch()
  t.false(watching)
})


test('unwatch', t => {
  t.plan(2)
  const v = take(() => {}, () => {
    t.pass()
    return () => {
      t.pass()
    }
  })
  const unwatch = watch(() => v())
  unwatch()
})

test('value basic', async t => {
  t.plan(4)
  const [v, setV] = value(0)

  t.is(v(), 0)
  setV(1)
  t.is(v(), 1)

  let tmp = v()
  const unwatch = watch(() => t.is(v(), tmp))
  setV(tmp = 2)
  await 0
  unwatch()
})

test('compute change dep', async t => {
  const [depIndex, setDepIndex] = value(1)

  let depending1 = false
  const dep1 = take(() => 1, () => {
    depending1 = true
    return () => {
      depending1 = false
    }
  })
  let depending2 = false
  const dep2 = take(() => 2, () => {
    depending2 = true
    return () => {
      depending2 = false
    }
  })

  const out = compute(() => {
    return depIndex() === 1 ? dep1() : dep2()
  })
  const unwatch = watch(() => out())
  t.true(depending1)
  t.false(depending2)
  setDepIndex(2)
  await 0
  t.false(depending1)
  t.true(depending2)
  unwatch()
  t.false(depending2)
})

test('batch', async t => {
  t.plan(3)
  const values = [value(1), value(2), value(3)]

  let answer = 6
  const sum = compute(() => {
    t.pass()
    return values.reduce((acc, [v]) => acc+v(), 0)
  })

  const unwatch = watch(sum) // first sum
  values.forEach(([v, set]) => set(v()+1)) // second sum
  await 0
  t.is(sum(), 9) // third assert
  unwatch()
})

test('compute cache', async t => {
  t.plan(1)
  const [v, setV] = value(1)
  const zero = compute(() => v()*0)

  const unwatch = watch(() => t.is(zero(), 0))
  setV(2)
  await 0
  unwatch()
})


test('watch by multiple dependents', t => {
  t.plan(3)
  let watching = false
  const v = take(() => {
    t.pass()
    return 1
  }, () => {
    watching = true
    return () => {
      watching = false
    }
  })
  const c1 = compute(v)
  const c2 = compute(v)

  const unwatch = watch(() => c1()+c2())
  t.true(watching)
  unwatch()
  t.false(watching)
})

