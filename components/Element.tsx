import { Colors } from "@/constants/Colors";
import Feather from "@expo/vector-icons/Feather";
import { Pressable, StyleSheet, Text, View } from "react-native";
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import type { SharedValue } from "react-native-reanimated";
import Animated, { LinearTransition, useAnimatedStyle } from "react-native-reanimated";


type ElementProps = {
    nome: string,
    quantita: number,
    currentElementIndex: number,
    totalElements: number,
    onSwap: (index1: number, index2: number) => void,
    onEdit: (index: number) => void, // new prop: request parent to open edit modal
    onDelete: (index: number) => void, // new prop: request parent to delete element
}

export default function Element({ nome, quantita, currentElementIndex, totalElements, onSwap, onEdit, onDelete }: ElementProps) {
    const handleMoveUp = () => {
        if (currentElementIndex === 0) return;
        onSwap(currentElementIndex, currentElementIndex - 1);
    }

    const handleMoveDown = () => {
        if (currentElementIndex === totalElements - 1) return;
        onSwap(currentElementIndex, currentElementIndex + 1);
    }

    const handleEdit = () => {
        onEdit(currentElementIndex);
    }

    const handleDelete = () => {
        onDelete(currentElementIndex);
    }

    function leftSwipeAction(progress: SharedValue<number>, dragValue: SharedValue<number>) {
        const styleAnimation = useAnimatedStyle(() => ({
            opacity: progress.value,
            width: progress.value * 30,
        }));

        return (
            <Animated.View style={[styles.deleteElementLeft, styleAnimation]}>
                <Feather name="trash-2" size={24} color={"#b30000"} />
            </Animated.View>
        );
    }

    function rightSwipeAction(progress: SharedValue<number>, dragValue: SharedValue<number>) {
        const styleAnimation = useAnimatedStyle(() => ({
            opacity: progress.value,
            width: progress.value * 30,
        }));

        return (
            <Animated.View style={[styles.deleteElementRight, styleAnimation]}>
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
                <Text style={styles.colorWhite}>{nome}</Text>
                <Text style={styles.colorWhite}>{quantita}</Text>
                <View style={styles.actionWrapper}>
                    <Pressable style={styles.actionButton} onPress={handleMoveUp}>
                        <Feather name="arrow-up" size={24} color={Colors.BIANCO} />
                    </Pressable>
                    <Pressable style={styles.actionButton} onPress={handleMoveDown}>
                        <Feather name="arrow-down" size={24} color={Colors.BIANCO} />
                    </Pressable>
                    <Pressable style={styles.actionButton} onPress={handleEdit}>
                        <Feather name="edit-2" size={24} color={Colors.BIANCO} />
                    </Pressable>
                </View>
            </Animated.View>
        </ReanimatedSwipeable>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 20,
        backgroundColor: Colors.VERDE,
        borderRadius: 12,
        padding: 8,
        marginTop: 10,
    },
    colorWhite: {
        color: "#fff",
        fontFamily: "Quicksand_400Regular",
    },
    actionButton: {
        backgroundColor: Colors.GIALLO_CHIARO,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    actionWrapper: {
        gap: 10,
        flexDirection: "row"
    },
    modal: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.GIALLO_CHIARO,
    },
    deleteElementLeft: {
        backgroundColor: "#ff6467",
        justifyContent: "center",
        alignItems: "flex-start",
        borderRadius: 12,
        marginTop: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    deleteElementRight: {
        backgroundColor: "#ff6467",
        justifyContent: "center",
        alignItems: "flex-end",
        borderRadius: 12,
        marginTop: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
    }
})