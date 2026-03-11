import MainBg from "@/components/MainBg";
import { StyleSheet, Text, View } from "react-native";

export default function CostsPage() {
    return (<View style={styles.wrapper}>
        <MainBg></MainBg>
        <Text style={{fontFamily: "Quicksand_400Regular"}}>Pagina delle spese in costruzione...</Text>
    </View>);
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1
    }
});