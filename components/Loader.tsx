import {View,ActivityIndicator, StyleSheet} from "react-native";
import { Colors } from "@/constants/Colors";

export default function Loader() {
    return (
        <View style={styles.activityWrapper}>
            <ActivityIndicator size="large" color={Colors.VERDE} />
        </View>
    )
}

const styles= StyleSheet.create({
     activityWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
})