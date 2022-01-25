import { View, Text, TouchableOpacity, Image } from "react-native"
import { useRecoilValue } from "recoil"
import { historyState } from "store/atoms"
import { SafeAreaView } from "react-native-safe-area-context"

const History = ({ navigation }) => {
  const history = useRecoilValue(historyState)

  return (
    <SafeAreaView>
      <View>
        {history.map((h) => (
          <TouchableOpacity
            key={h.slug}
            onPress={() =>
              navigation.navigate("Episodes", {
                data: h,
              })
            }
            style={{ flexDirection: "row", height: 167 }}
          >
            <Image
              style={{ width: 100 }}
              source={{ uri: h.img }}
              resizeMode={"contain"}
            />
            <Text>{`${h.title} Episode ${h.ep}`}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  )
}

export { History }
