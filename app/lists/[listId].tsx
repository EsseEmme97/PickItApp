import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";

export default function SingleListString(){
    const listId= useLocalSearchParams().listId;
    return(
        <Text style={{color:"white"}}>{listId}</Text>
    )
}