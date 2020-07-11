
function Box() {
  const g = new PIXI.Graphics()
  g.lineStyle(2, 0xFEEB77, 1)
  g.beginFill(0x650A5A)
  g.drawRect(-20, -20, 40, 40)
  g.endFill()
  return <Node el={g}></Node>
}

function Page({ path }) {
  const route = compute(() => path()[0] || '')
  const rest = compute(() => path().slice(1))

  console.log(`create ${path()}`)
  // {route('*', Page)}
  // {route('/items/:id', ({ route, params }) => <Page path={route} params={route.params}></Page>)}
  return <Container x={20} y={20}>
    <Box></Box>
    <Text>{route}</Text>
    {_if(() => route().includes('+'), () => <Page path={rest}></Page>)}
  </Container>
}

function App() {
  return <Container>
    <Page path={compute(() => hash().split('/').filter(v => v))}></Page>
  </Container>
}
