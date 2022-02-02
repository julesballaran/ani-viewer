import { useCallback } from "react"
import { Pressable, View, Text, Linking, Alert, StyleSheet } from "react-native"

export const OpenURLButton = ({ url, handleClose, children }) => {
  const handlePress = useCallback(async () => {
    const supported = await Linking.canOpenURL(url)

    if (supported) {
      await Linking.openURL(url)
      handleClose()
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`)
    }
  }, [url])

  return (
    <Pressable onPress={handlePress}>
      <View style={styles.count}>
        <Text>{children}</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
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
})
