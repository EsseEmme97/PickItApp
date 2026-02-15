import { ImageBackground, StyleSheet } from "react-native"

export default function MainBg(){
    return (
        <ImageBackground resizeMode="cover" style={styles.bgImage} source={require("@/assets/images/main_bg.png")}/>
    )
}

const styles= StyleSheet.create({
     bgImage:{
        position:"absolute",
        top:0,
        width:"100%",
        height:"100%"
    }
})