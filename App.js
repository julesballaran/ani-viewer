import { useEffect } from "react"
import { LogBox } from "react-native"
import { RecoilRoot } from "recoil"
import Navigation from "navigation"

export default function App() {
  useEffect(() => {
    LogBox.ignoreLogs(["timer"])
  }, [])

  return (
    <RecoilRoot>
      <Navigation />
    </RecoilRoot>
  )
}
