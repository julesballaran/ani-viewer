import { useEffect } from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { NavigationContainer } from "@react-navigation/native"
import Stacks from "./stacks"
import { getData } from "utils/ani"
import { favoriteState, historyState } from "store/atoms"
import { useSetRecoilState } from "recoil"

const Navigation = () => {
  const setFavorites = useSetRecoilState(favoriteState)
  const setHistory = useSetRecoilState(historyState)

  const fetchData = async () => {
    let tempFav = await getData("favorites")
    let tempHistory = await getData("history")
    if (tempFav) setFavorites(tempFav)
    if (tempHistory) setHistory(tempHistory)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stacks />
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

export default Navigation
