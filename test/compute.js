import test from 'ava'
import { fake } from 'sinon'
import { take, compute, value, watch } from '../src/compute'

test('take basic', t => {
  let state = 0
  const get = take(() => {
    return state += 1
  }, () => {
    t.fail()
  })

  t.is(get(), 1)
  t.is(get(), 2)
})

test('take without watch will not cache value', t => {
  const fn = fake()
  const get = take(fn, () => t.fail())
  get()
  get()
  get()

  t.is(fn.callCount, 3)
})

test('take with watch will cache value', t => {
  const taker = fake()
  const subscriber = fake()
  const get = take(taker, subscriber)
  const unwatch = watch(() => get())
  get()
  get()
  get()

  t.is(taker.callCount, 1)
  t.true(subscriber.called)

  unwatch()
})

test('watch and unwatch', t => {
  const subscriber = fake()
  const unsubscriber = fake()
  const v = take(() => 1, () => {
    subscriber()
    return unsubscriber
  })
  const unwatch = watch(() => v())
  t.true(subscriber.called)
  t.false(unsubscriber.called)
  unwatch()
  t.true(unsubscriber.called)
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
  const sumFn = fake()
  const values = [value(1), value(2), value(3)]

  let answer = 6
  const sum = compute(() => {
    sumFn()
    return values.reduce((acc, [v]) => acc+v(), 0)
  })

  const unwatch = watch(sum) // first sum
  values.forEach(([v, set]) => set(v()+1)) // second sum
  await 0
  t.is(sum(), 9)
  t.is(sumFn.callCount, 2)
  unwatch()
})

test('visit expired value while batching', async t => {
  const [a, set] = value(0)
  const b = compute(() => a())

  const unwatch = watch(b)
  t.is(b(), 0)
  set(1)
  t.is(b(), 1)
  set(2)
  await 0
  t.is(b(), 2)
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
  const taker = fake()
  const subscriber = fake()
  const unsubscriber = fake()

  const v = take(taker, () => {
    subscriber()
    return unsubscriber
  })
  const c1 = compute(v)
  const c2 = compute(v)

  const unwatch1 = watch(() => c1()+c2())
  const unwatch2 = watch(() => c2())
  t.is(subscriber.callCount, 1)
  t.is(unsubscriber.callCount, 0)
  unwatch1()
  t.is(unsubscriber.callCount, 0)
  unwatch2()
  t.is(subscriber.callCount, 1)
  t.is(unsubscriber.callCount, 1)
  t.is(taker.callCount, 1)
})

test('simple executing order', async t => {
  let result = []

  const a = take(() => {
    result.push('a')
    return a.v = (a.v || 0) + 1
  }, (u) => {
    a.update = u
  })
  const b = compute(() => {
    result.push('b')
    return a()
  })
  const c = compute(() => {
    result.push('c')
    return a()+b()
  })

  const unwatch = watch(c)
  result = []
  a.update()
  await 0
  t.deepEqual(result, ['a', 'c', 'b'])
  unwatch()
})

test('complex executing order', async t => {
  // a>b-->e
  // |>c>d|
  let result = []

  const a = take(() => {
    result.push('a')
    return a.v = (a.v || 0) + 1
  }, (u) => {
    a.update = u
  })
  const b = compute(() => {
    result.push('b')
    return a()
  })
  const c = compute(() => {
    result.push('c')
    return a()
  })
  const d = compute(() => {
    result.push('d')
    return c()
  })
  const e = compute(() => {
    result.push('e')
    return b() + d()
  })

  const unwatch = watch(e)
  result = []
  a.update()
  await 0
  t.deepEqual(result, ['a', 'b', 'e', 'c', 'd'])
  unwatch()
})

test('complex executing order with skip', async t => {
  // a>b--->e
  // |>*c>d|
  let result = []

  const a = take(() => {
    result.push('a')
    return a.v = (a.v || 0) + 1
  }, (u) => {
    a.update = u
  })
  const b = compute(() => {
    result.push('b')
    return a()
  })
  const c = compute(() => {
    result.push('c')
    return a()*0
  })
  const d = compute(() => {
    result.push('d')
    return c()
  })
  const e = compute(() => {
    result.push('e')
    return b() + d()
  })

  const unwatch = watch(e)
  result = []
  a.update()
  await 0
  t.deepEqual(result, ['a', 'b', 'e', 'c'])

  unwatch()
})

test('executing order with batch', async t => {
  // a>-|
  // b>c>d
  let result = []

  const a = take(() => {
    result.push('a')
    return a.v = (a.v || 0) + 1
  }, (u) => {
    a.update = u
  })
  const b = take(() => {
    result.push('b')
    return b.v = (b.v || 0) + 1
  }, (u) => {
    b.update = u
  })
  const c = compute(() => {
    result.push('c')
    return b()
  })
  const d = compute(() => {
    result.push('d')
    return a() + c()
  })

  const unwatch = watch(d)
  result = []
  a.update()
  b.update()
  await 0
  t.deepEqual(result, ['a', 'd', 'b', 'c'])

  unwatch()
})

test('executing order with circular updating(unchanged)', async t => {
  // a-->b
  // |>c|<*d
  let result = []

  const a = take(() => {
    result.push('a')
    return a.v
  }, (u) => {
    a.update = u
  })
  const d = take(() => {
    result.push('d')
    return d.v
  }, (u) => {
    d.update = u
  })
  const b = compute(() => {
    result.push('b')
    // d.v = Date.now() // unchanged
    d.update && d.update() // circular update
    return a() + c()
  })
  const c = compute(() => {
    result.push('c')
    return a() + d()
  })

  a.v = 1
  d.v = 1

  const unwatch = watch(b)
  result = []
  a.v = 2
  a.update()
  await 0
  t.deepEqual(result, ['a', 'b', 'd', 'c'])
  t.is(b(), 5)

  unwatch()
})


test('unwatch while notify', async t => {
  // a>b
  // |>c>d
  const callc = fake()
  const calld = fake()

  let unwatchd
  const [a, set] = value('watchd')
  const unwatchb = watch(() => {
    if (a() === 'stopwatchd') unwatchd()
  })

  const c = compute(() => {
    callc(a())
    return a()
  })
  unwatchd = watch(() => {
    calld(c())
  })

  t.is(callc.callCount, 1)
  t.is(calld.callCount, 1)
  t.is(callc.lastCall.firstArg, 'watchd')
  t.is(calld.lastCall.firstArg, 'watchd')

  set('stopwatchd')
  await 0
  t.is(callc.callCount, 1)
  t.is(calld.callCount, 1)
  unwatchb()
})


test('change depdendency while notify', async t => {
  // a>b>d
  // |>c>|
  const callb = fake()
  const callc = fake()
  const calld = fake()

  const [a, set] = value('watchc')
  const b = compute(() => {
    callb(a())
    return a()
  })
  const c = compute(() => {
    callc(a())
    return a()
  })
  const unwatchd = watch(() => {
    calld()
    if (b() === 'watchc') {
      c()
    }
  })

  t.is(callb.callCount, 1)
  t.is(callc.callCount, 1)
  t.is(calld.callCount, 1)
  set('stopwatchc')
  await 0
  t.is(callb.callCount, 2)
  t.is(callc.callCount, 1)
  t.is(calld.callCount, 2)
  unwatchd()
})
