import AddModal from "@/components/AddModal";
import EditModal from "@/components/EditModal";
import Element from "@/components/Element";
import Loader from "@/components/Loader";
import MainBg from "@/components/MainBg";
import { Colors } from "@/constants/Colors";
import { getSingleList, updateListElements } from "@/db/db";
import type { List } from "@/types";
import Feather from "@expo/vector-icons/Feather";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInUp, LinearTransition, createAnimatedComponent } from "react-native-reanimated";


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

    // states per add modal
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [addNome, setAddNome] = useState("");
    const [addQuantita, setAddQuantita] = useState("0");

    //state for showing save button on edit modal

    const [isEditChanged, setIsEditChanged] = useState(false);

    // customized save button component with animation
    const AnimatedPressable = createAnimatedComponent(Pressable);

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
        setIsEditChanged(true);
    }

    const openEdit = (index: number) => {
        const item = elements[index];
        setEditIndex(index);
        setEditNome(item.nome);
        setEditQuantita(String(item.quantita ?? "0"));
        setModalVisible(true);
    }

    const openAdd = () => {
        setAddNome("");
        setAddQuantita("0");
        setAddModalVisible(true);
    }

    const closeAdd = () => {
        setAddModalVisible(false);
        setAddNome("");
        setAddQuantita("0");
    }

    const addNewElement = () => {
        const nomeTrim = addNome.trim();
        const qty = parseInt(addQuantita, 10);
        if (!nomeTrim) {
            Alert.alert("Errore", "Il nome non può essere vuoto.");
            return;
        }
        if (Number.isNaN(qty) || qty <= 0) {
            Alert.alert("Errore", "Inserisci una quantità valida (> 0).");
            return;
        }
        const newEl = { id: genId(), nome: nomeTrim, quantita: qty } as any;
        setElements(prev => [...prev, newEl]);
        setIsEditChanged(true);
        closeAdd();
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
        setIsEditChanged(true);
        closeEdit();
    }

    const saveListChanges = () => {
        setIsLoading(true);
        updateListElements(id as string, elements).finally(() => {
            setIsLoading(false);
            setIsEditChanged(false);
        })
    }

    return (
        <View style={styles.container}>
            <MainBg />
            {isLoading ? <Loader /> : (
                <View style={styles.ListContainer}>
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
                </View>
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
            {isEditChanged && <AnimatedPressable entering={FadeInUp} onPress={saveListChanges} style={styles.saveButton}><Text style={{
                color: "white",
                fontFamily: "Quicksand_400Regular",
            }}>Salva modifiche</Text>
            </AnimatedPressable>}
            <Pressable style={styles.plusIcon} onPress={openAdd}>
                <Feather color={"white"} name="plus" size={24}></Feather>
            </Pressable>
            <AddModal
                visible={addModalVisible}
                nome={addNome}
                quantita={addQuantita}
                onClose={closeAdd}
                onNomeChange={setAddNome}
                onQuantitaChange={setAddQuantita}
                onAdd={addNewElement}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center"
    },
    saveButton: {
        borderRadius: 12,
        padding: 10,
        backgroundColor: Colors.VERDE,
    },
    ListContainer:{
        flex:0.7
    },
    plusIcon:{
        position:"absolute",
        bottom:"20%",
        right:30,
        padding:4,
        backgroundColor:Colors.VERDE,
        borderRadius:30,
        justifyContent:"center",
        alignItems:"center"
    }
})