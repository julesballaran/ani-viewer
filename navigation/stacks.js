import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Episodes } from "screens"
import Tabs from "./tabs"

const Stack = createNativeStackNavigator()

const Stacks = () => {
  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen
        name="Main"
        component={Tabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Episodes" component={Episodes} />
    </Stack.Navigator>
  )
}

export default Stacks
