import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { getLists } from "@/db/db";
import type { List } from "@/types";
import { Colors } from "@/constants/Colors";
import Animated, { LinearTransition } from "react-native-reanimated";
import ListItem from "@/components/ListItem";
import MainBg from "@/components/MainBg";

function Loader() {
    return (
        <View style={styles.activityWrapper}>
            <ActivityIndicator size="large" color={Colors.VERDE} />
        </View>
    )
}


export default function AllListsPage() {
    const [lists, setLists] = useState<List[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>();

    useEffect(() => {
        setIsLoading(true);
        getLists().then(setLists).finally(() => setIsLoading(false));
    }, [])


    return (
        <View style={styles.container}>
            <MainBg/>
            <Text>Tutte le liste</Text>
            {isLoading ? <Loader /> : <Animated.FlatList
                data={lists}
                renderItem={({ item }) => <ListItem {...item} />}
                itemLayoutAnimation={LinearTransition}
            />}
        </View>
    )
}

const styles = StyleSheet.create({
    activityWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
     container:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        gap:10,
    },
})