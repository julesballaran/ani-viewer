import { useEffect } from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { NavigationContainer } from "@react-navigation/native"
import Stacks from "./stacks"
import { getData } from "utils/ani"
import { favoriteState } from "store/atoms"
import { useSetRecoilState } from "recoil"

const Navigation = () => {
  const setFavorites = useSetRecoilState(favoriteState)

  const fetchData = async () => {
    let tempFav = await getData("favorites")
    if (tempFav) {
      setFavorites(tempFav)
    }
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
