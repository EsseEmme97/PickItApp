import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { getLists } from "@/db/db";
import type { List } from "@/types";
import Animated, { LinearTransition } from "react-native-reanimated";
import ListItem from "@/components/ListItem";
import MainBg from "@/components/MainBg";
import Loader from "@/components/Loader";
import { GestureHandlerRootView } from 'react-native-gesture-handler';


export default function AllListsPage() {
    const [lists, setLists] = useState<List[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>();

    useEffect(() => {
        setIsLoading(true);
        getLists().then(setLists).finally(() => setIsLoading(false));
    }, [])


    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <MainBg />
                <Text style={styles.title}>Tutte le liste</Text>
                {isLoading ? <Loader /> :
                    <Animated.FlatList
                        data={lists}
                        renderItem={({ item }) => <ListItem {...item} />}
                        itemLayoutAnimation={LinearTransition}
                    />
                }
            </View>
        </GestureHandlerRootView>);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
    },
    title: {
        fontFamily: "Quicksand_400Regular",
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 10,
    }
})