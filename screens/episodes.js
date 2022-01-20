import { useEffect, useState } from "react"
import {
  Text,
  View,
  StyleSheet,
  Modal,
  Alert,
  Pressable,
  ScrollView,
} from "react-native"
import { getEpisodeFn, fetchData, getData, storeData } from "utils/ani"
import { OpenURLButton } from "components"
import { favoriteState } from "store/atoms"
import { useRecoilState } from "recoil"

const proxy = "https://cors-link.herokuapp.com/proxy"

export const Episodes = ({ route }) => {
  const { data } = route.params
  const [favorites, setFavorites] = useRecoilState(favoriteState)
  const [count, setCount] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [videos, setVideos] = useState([])
  const [current, setCurrent] = useState("")
  const [watched, setWatched] = useState([])
  const [save, setSave] = useState(false)

  const getEpisode = async () => {
    let ep = await getEpisodeFn(data.slug)
    const w = await getData(data.slug)
    if (w !== null) {
      setWatched(w)
    }
    setCount(ep)
  }

  const handleFetch = async (ep) => {
    let w = [...watched]
    if (!w.includes(ep)) {
      w.push(ep)
      await storeData(data.slug, w)
      setWatched(w)
    }
    setCurrent(ep)
    const res = await fetchData(data.slug, ep)
    setVideos(res)
    setModalVisible(true)
  }

  const handleSave = async () => {
    let tempFav = [...favorites]
    if (!save) {
      tempFav.push(data)
      setFavorites(tempFav)
      await storeData("favorites", tempFav)
    } else {
      tempFav = tempFav.filter((f) => f.slug !== data.slug)
      setFavorites(tempFav)
      await storeData("favorites", tempFav)
    }
  }

  useEffect(() => {
    if (favorites.find((f) => f.slug === data.slug)) setSave(true)
    else setSave(false)
  }, [favorites])

  useEffect(() => {
    getEpisode()
  }, [])

  return (
    <View>
      <Text style={{ fontSize: 20 }}>{data.title}</Text>
      <Pressable onPress={handleSave}>
        <Text style={{ marginTop: 12, marginLeft: 15 }}>
          {save ? "remove" : "save"}
        </Text>
      </Pressable>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.")
          setModalVisible(!modalVisible)
        }}
      >
        <View style={styles.center}>
          <View style={styles.modal}>
            <Text style={{ textAlign: "center", marginTop: 12 }}>
              Episode {current}
            </Text>
            <View style={styles.source}>
              {videos.map((video, i) => (
                <OpenURLButton
                  key={i}
                  url={`${proxy}/${data.slug}-episode-${current}.mp4?url=${video.file}`}
                >
                  {`${video.label}`}
                </OpenURLButton>
              ))}
            </View>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text style={{ textAlign: "center" }}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <ScrollView>
        <View style={styles.eps}>
          {count.map((c) => (
            <Pressable
              key={c}
              onPress={() => handleFetch(c)}
              onLongPress={() => {
                let arr = watched.filter((w) => w !== c)
                storeData(data.slug, arr)
                setWatched(arr)
              }}
            >
              <View style={watched.includes(c) ? styles.count : styles.count2}>
                <Text style={styles.text}>{c}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  eps: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
  },
  text: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
  count: {
    marginLeft: 16,
    marginBottom: 16,
    backgroundColor: "#1194f6",
    width: 80,
    height: 40,
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  count2: {
    marginLeft: 16,
    marginBottom: 16,
    backgroundColor: "#cccccc",
    width: 80,
    height: 40,
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  btn: {
    padding: "8px 24px",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#cccccc",
    paddingBottom: 16,
    paddingRight: 16,
  },
  source: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
    minHeight: 50,
    paddingTop: 16,
    borderRadius: 2,
  },
})
