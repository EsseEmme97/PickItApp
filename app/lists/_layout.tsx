import { Stack } from "expo-router";

export default function UserPage() {

  return (
      <Stack.Screen
        options={{
          title: "singola lista",
          headerBackTitle: "tutte le liste",
          headerStyle: {
            backgroundColor: "#111",
          },
          headerTintColor: "#fff",
        }}/>
  )
}
