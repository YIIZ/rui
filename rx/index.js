// curry for pipeline usage

// TODO more
// https://github.com/zenparsing/zen-observable/blob/master/src/Observable.js#L244
// https://github.com/tc39/proposal-observable/issues/58#issuecomment-141629873

// subscribe pipe?
// source |> take(1) |> subscribe(action)
// cons: no observable chains afterwards(it's a subscription)
const subscribe = (next, complete, error) => (source) =>
  source.subscribe({ next, complete, error })

const take = (n) => (source) =>
  new Observable(observer => {
    let remain = n
    return source.subscribe({
      next(value) {
        remain -= 1
        observer.next(value)
        if (remain < 1) observer.complete()
      },
      error(e) {
        observer.error(e)
      },
      complete() {
        observer.complete()
      },
    })
  })

export {
  take
}
// export {
//   currify(take) as take
// }
