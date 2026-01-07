import Element from "@/components/Element";
import Loader from "@/components/Loader";
import MainBg from "@/components/MainBg";
import { getSingleList } from "@/db/db";
import type { List } from "@/types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View, Modal } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";


export default function singleListPage() {
    const { id } = useLocalSearchParams();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [elements, setElements] = useState<List["elementi"]>([])

    const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    useEffect(() => {
        setIsLoading(true);
        getSingleList(id as string)
            .then((list) => {
                const elems = list?.elementi?.map(el => ({ ...el, id: (el as any).id ?? genId() }));
                setElements(elems as any ?? []);
            })
            .finally(() => setIsLoading(false));
    }, [])

    function swappingElements(index1: number, index2: number) {
        if (!elements) return;
        const newElements = [...elements];
        const temp = newElements[index1];
        newElements[index1] = newElements[index2];
        newElements[index2] = temp;
        setElements(newElements);
    }

    return (
        <View style={styles.container}>
            <MainBg />
            {isLoading ? <Loader /> : (
                <Animated.FlatList
                    data={elements}
                    keyExtractor={(item: any) => item.id}
                    renderItem={({ item, index }) => (
                        <Element
                            nome={item.nome}
                            currentElementIndex={index}
                            totalElements={elements.length}
                            quantita={item.quantita}
                            onSwap={swappingElements}
                        />
                    )}
                    itemLayoutAnimation={LinearTransition}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
})