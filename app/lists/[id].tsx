import Element from "@/components/Element";
import Loader from "@/components/Loader";
import MainBg from "@/components/MainBg";
import { getSingleList } from "@/db/db";
import type { List } from "@/types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View, Modal, TextInput, Text, Pressable, Alert } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import EditModal from "@/components/EditModal";


export default function singleListPage() {
    const { id } = useLocalSearchParams();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [elements, setElements] = useState<List["elementi"]>([])

    const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    // states per edit modal
    const [modalVisible, setModalVisible] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editNome, setEditNome] = useState("");
    const [editQuantita, setEditQuantita] = useState("0");

    useEffect(() => {
        setIsLoading(true);
        getSingleList(id as string)
            .then((list) => {
                const elems = list?.elementi?.map(el => ({ ...el, id: (el as any).id ?? genId() }));
                setElements(elems as any ?? []);
            })
            .finally(() => setIsLoading(false));
    }, [id])

    function swappingElements(index1: number, index2: number) {
        if (!elements) return;
        const newElements = [...elements];
        const temp = newElements[index1];
        newElements[index1] = newElements[index2];
        newElements[index2] = temp;
        setElements(newElements);
    }

    const openEdit = (index: number) => {
        const item = elements[index];
        setEditIndex(index);
        setEditNome(item.nome);
        setEditQuantita(String(item.quantita ?? "0"));
        setModalVisible(true);
    }

    const closeEdit = () => {
        setModalVisible(false);
        setEditIndex(null);
        setEditNome("");
        setEditQuantita("0");
    }

    const saveEdit = () => {
        // validation: nome non vuoto, quantita intero > 0
        const nomeTrim = editNome.trim();
        const qty = parseInt(editQuantita, 10);
        if (!nomeTrim) {
            Alert.alert("Errore", "Il nome non può essere vuoto.");
            return;
        }
        if (Number.isNaN(qty) || qty <= 0) {
            Alert.alert("Errore", "Inserisci una quantità valida (> 0).");
            return;
        }
        if (editIndex === null) {
            closeEdit();
            return;
        }
        const newElements = [...elements];
        newElements[editIndex] = { ...newElements[editIndex], nome: nomeTrim, quantita: qty };
        setElements(newElements);
        closeEdit();
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
                            onEdit={openEdit} // passiamo la callback
                        />
                    )}
                    itemLayoutAnimation={LinearTransition}
                />
            )}

            <EditModal
                visible={modalVisible}
                nome={editNome}
                quantita={editQuantita}
                onClose={closeEdit}
                onNomeChange={setEditNome}
                onQuantitaChange={setEditQuantita}
                onSave={saveEdit}
            />
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