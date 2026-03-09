import ListItem from "@/components/ListItem";
import Loader from "@/components/Loader";
import MainBg from "@/components/MainBg";
import { getLists } from "@/db/db";
import type { List } from "@/types";
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";

const LIST_CONTENT_BOTTOM_PADDING = 40;


export default function AllListsPage() {
    const [lists, setLists] = useState<List[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const isFocused = useIsFocused();

    useEffect(() => {
        setIsLoading(true);
        getLists().then(setLists).finally(() => setIsLoading(false));
    }, [isFocused])


    return (
        <>
            <MainBg />
            <View style={styles.container}>
                <Text style={styles.title}>Tutte le liste</Text>
                {isLoading ? <Loader /> :
                    <View style={styles.listWrapper}>
                        <Animated.FlatList
                            style={styles.list}
                            contentContainerStyle={styles.listContent}
                            data={lists}
                            renderItem={({ item }) => <ListItem {...item} />}
                            itemLayoutAnimation={LinearTransition}
                        />
                    </View>
                }
            </View>
        </>);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 20,
    },
    title: {
        fontFamily: "Quicksand_400Regular",
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 10,
    },
    listWrapper: {
        flex: 1,
        width: "100%",
    },
    list: {
        flex: 1,
        width: "100%",
    },
    listContent: {
        paddingBottom: LIST_CONTENT_BOTTOM_PADDING,
    }
})
