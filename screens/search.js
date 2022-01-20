import { useState } from "react"
import { useRecoilState } from "recoil"
import {
  Button,
  View,
  TextInput,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { searchFn } from "utils/ani"
import { resultState } from "store/atoms"

export const Search = ({ navigation }) => {
  const [search, setSearch] = useState("")
  const [results, setResults] = useRecoilState(resultState)

  const handleSearch = async () => {
    let res = await searchFn(search)
    setResults(res)
  }

  return (
    <SafeAreaView>
      <View style={styles.search}>
        <TextInput
          style={styles.input}
          value={search}
          onChangeText={(text) => setSearch(text)}
        />
        <Button title="Search" onPress={() => handleSearch()} />
      </View>
      <ScrollView>
        <View style={styles.results}>
          {results.map((result, i) => (
            <TouchableOpacity
              key={i}
              style={styles.result}
              onPress={() =>
                navigation.navigate("Episodes", {
                  data: result,
                })
              }
            >
              <Image
                style={{ width: "100%", height: 167 }}
                source={{ uri: result.img }}
                resizeMode={"cover"}
              />
              <Text>{result.title}</Text>
              <Text style={{ fontSize: 10 }}>{result.released}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  search: {
    flexDirection: "row",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 5,
  },
  results: {
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  result: {
    marginLeft: 12,
    marginBottom: 12,
    width: 120,
  },
})
