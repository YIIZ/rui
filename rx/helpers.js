// TODO more extras
// https://github.com/zenparsing/zen-observable/blob/master/src/Observable.js#L244
// https://github.com/tc39/proposal-observable/issues/58#issuecomment-141629873
const take = (source, n) =>
  new Observable(observer => {
    let remain = n
    return source.subscribe({
      next(value) {
        remain -= 1
        if (remain < 1) observer.complete()
        else observer.next(value)
      },
      error(e) {
        observer.error(e)
      },
      complete() {
        observer.complete()
      },
    })
  })

export { take }
