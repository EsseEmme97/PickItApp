import { Colors } from "@/constants/Colors";
import { deleteList } from "@/db/db";
import type { List } from "@/types";
import Feather from "@expo/vector-icons/Feather";
import { Link } from "expo-router";
import { StyleSheet, Text } from "react-native";
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, { LinearTransition, useAnimatedStyle } from "react-native-reanimated";

export default function ListItem({ data_creazione, id }: List) {
    const handleDelete = async () => {
        if (!id) return;
        try {
            await deleteList(id);
        } catch (error) {
            console.error("deleteList failed:", error);
        }
    };

    function leftSwipeAction(progress: any, dragValue: any) {
        const styleAnimation = useAnimatedStyle(() => ({
            opacity: progress.value,
            width: progress.value * 30,
        }));

        return (
            <Animated.View style={[styles.deleteLeft, styleAnimation]}>
                <Feather name="trash-2" size={24} color={"#b30000"} />
            </Animated.View>
        );
    }

    function rightSwipeAction(progress: any, dragValue: any) {
        const styleAnimation = useAnimatedStyle(() => ({
            opacity: progress.value,
            width: progress.value * 30,
        }));

        return (
            <Animated.View style={[styles.deleteRight, styleAnimation]}>
                <Feather name="trash-2" size={24} color={"#b30000"} />
            </Animated.View>
        );
    }

    return (
        <ReanimatedSwipeable
            renderLeftActions={leftSwipeAction}
            renderRightActions={rightSwipeAction}
            onSwipeableOpen={handleDelete}
        >
            <Animated.View style={styles.wrapper} layout={LinearTransition}>
                <Link style={styles.link} href={{ pathname: "/lists/[id]", params: { id } }}>
                    <Text style={styles.text}>{data_creazione}</Text>
                </Link>
            </Animated.View>
        </ReanimatedSwipeable>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: Colors.VERDE,
        borderRadius: 12,
        padding: 8,
        marginTop: 10,
    },
    link: {
        paddingVertical: 6,
        paddingHorizontal: 8,
    },
    text: {
        color: "#fff",
        fontFamily: "Quicksand_400Regular",
    },
    deleteLeft: {
        backgroundColor: "#ff6467",
        justifyContent: "center",
        alignItems: "flex-start",
        borderRadius: 12,
        marginTop: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    deleteRight: {
        backgroundColor: "#ff6467",
        justifyContent: "center",
        alignItems: "flex-end",
        borderRadius: 12,
        marginTop: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
});