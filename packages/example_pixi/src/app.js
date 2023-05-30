// @jsx h
import { hash, setHash, useAppSize } from "@rui/browser/platform"
import { route } from "@rui/browser/router"
import { h, apply, compute, useRoot, value, if as _if } from "@rui/core"
import { BusyApplication, Container, Sprite } from "@rui/pixi"
import Spine from "@rui/pixi/Spine"
import Video from "@rui/pixi/Video"
import { load } from "@rui/pixi/utils"
import * as PIXI from "pixi.js"
import { res, res0 } from "./res"
import { spring } from "@rui/browser/motion"

export const size = useAppSize(750, 1500)
const { resources } = PIXI.Loader.shared

function Loading({ loading: { progress, ready }, onNext }) {
  const go = () => {
    if (!ready()) return
    // _track('开始')
    onNext("movie", null, (enter, leave) => enter.play())
  }

  const spine = <Spine data={resources.loading.spineData} x={-375} y={-825} />
  const { state: spineState } = spine.el

  apply(() => {
    ready()
      ? spineState.setEmptyAnimation(0, 0.1, 0)
      : spineState.setAnimation(0, "guangbiao", true)
  })

  apply(() => {
    ready()
      ? spineState.setAnimation(2, "start_enabled", true)
      : spineState.setAnimation(2, "start_disabled", true)
  })

  const progressEntry = spineState.setAnimation(1, "jindu", false)
  progressEntry.timeScale = 0
  // progressEntry.trackTime = 0.9
  apply(() => (progressEntry.trackTime = progress()))

  return (
    <Container onpointertap={go}>
      <Sprite tex={resources.loading_bg.texture} />
      {spine}
    </Container>
  )
}

function App() {
  const loading = load(
    res,
    process.env.NODE_ENV === "development"
      ? { minDuration: 500 }
      : { minDuration: 2000 }
  )

  const [fullPath, setFullPath] =
    process.env.NODE_ENV === "development" ? [hash, setHash] : value("/")

  const [path, go, subRoute] = route(fullPath, setFullPath)
  const p = compute(() => {
    if (!loading.ready()) return "loading"
    return path() || "loading"
  })

  const root = useRoot()

  const movie = (
    <Video
      src="https://demo.yiz.design/movie.5s.mp4"
      width={750}
      height={1500}
      onEnd={() => {
        // go("end")
      }}
    />
  )
  const goMovie = async () => {
    await root().busy(() => movie.play())
    go("movie")
  }

  return (
    <BusyApplication size={size} options={{ transparent: true }}>
      {_if(
        () => p() === "loading",
        () => (
          <Loading loading={loading} onNext={goMovie} />
        )
      )}
      {_if(
        () => p() === "movie",
        () => (
          <Container>{movie}</Container>
        )
      )}
    </BusyApplication>
  )
}

await load(res0)
const app = <App></App>
app.attach()
document.body.appendChild(app.view)
