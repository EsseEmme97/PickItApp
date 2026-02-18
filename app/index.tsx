import { StyleSheet, View, } from "react-native";
import { Link, RelativePathString } from "expo-router";
import { Colors } from "@/constants/Colors";
import Animated, { FadeInUp } from "react-native-reanimated";
import { createAnimatedComponent } from "react-native-reanimated";
import MainBg from "@/components/MainBg";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { Redirect } from "expo-router";

export default function Index() {
    const AnimatedLink= createAnimatedComponent(Link);
    const {isAuthenticated} = useAuthContext();

    if (!isAuthenticated) {
        return <Redirect href={"/login" as RelativePathString} />
    };
    return (
        <View style={styles.container}>
            <MainBg />
            <Animated.Text entering={FadeInUp} style={styles.mainTitle}>Benvenuto in pick it app</Animated.Text>
            <Animated.Text entering={FadeInUp.delay(200)}>La tua app per fare la spesa</Animated.Text>
            <AnimatedLink entering={FadeInUp.delay(400)} style={styles.button} href="/lists">
                Vedi tutte le liste
            </AnimatedLink>
        </View>
    )
}

const styles = StyleSheet.create({
    mainTitle: {
        fontSize: 24,
        fontFamily: "Quicksand_400Regular",
        fontWeight:"bold"
    },
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        gap:10,
    },
    button:{
        backgroundColor:Colors.VERDE,
        color: Colors.BIANCO,
        borderRadius:10,
        padding:10,
        textTransform:"uppercase",
        fontFamily:"Quicksand_400Regular"
    }
})