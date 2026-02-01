import { Colors } from "@/constants/Colors";
import { deleteList } from "@/db/db";
import type { List } from "@/types";
import Feather from "@expo/vector-icons/Feather";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import Animated, { LinearTransition, useAnimatedStyle } from "react-native-reanimated";
import { Alert } from "react-native";

export default function ListItem({ data_creazione, id }: List) {
    const handleDelete = async () => {
        if (!id) return;
        try {
            Alert.alert("Conferma eliminazione", "Sei sicuro di voler eliminare questa lista?", [
                {
                    text: "Annulla", style: "cancel"
                },
                {
                    text: "Elimina",
                    onPress: async () => {
                        await deleteList(id);
                    },
                    style: "destructive"
                }
            ]);
        } catch (error) {
            console.error("deleteList failed:", error);
        }
    };

    return (
            <Animated.View style={styles.wrapper} layout={LinearTransition}>
                <Link style={styles.link} href={{ pathname: "/lists/[id]", params: { id } }}>
                    <Text style={styles.text}>{data_creazione}</Text>
                </Link>
               <View style={styles.deleteContainer}>
                    <Feather name="trash-2" size={24} color={"#fff"} onPress={handleDelete} />
               </View>
            </Animated.View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: Colors.VERDE,
        borderRadius: 12,
        padding: 8,
        marginTop: 10,
        flexDirection: "row",
        gap:20
    },
    link: {
        paddingVertical: 6,
        paddingHorizontal: 8,
    },
    text: {
        color: "#fff",
        fontFamily: "Quicksand_400Regular",
    },
    deleteContainer:{
        justifyContent: "center",
        alignItems: "center",
        borderRadius:24,
        padding:4,
        backgroundColor:Colors.GIALLO_CHIARO,
    }
});