import Loader from "@/components/Loader";
import MainBg from "@/components/MainBg";
import { Colors } from "@/constants/Colors";
import { createList, getLists } from "@/db/db";
import type { List } from "@/types";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function NewListPage() {
    const router = useRouter();
    const [date, setDate] = useState<string>(new Date().toLocaleDateString());
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [lists, setLists] = useState<List[]>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [selectedListId, setSelectedListId] = useState<string | null>(null);
    const [isSelected,setIsSelected] = useState<boolean>(false);    

    useEffect(() => {
        setIsLoading(true);
        getLists()
            .then(setLists)
            .catch(err => {
                console.error(err);
                Alert.alert("Errore", "Impossibile caricare le liste.");
            })
            .finally(() => setIsLoading(false));
    }, [])

    const handleCreate = async () => {
        const trimmed = date.trim();
        if (!trimmed) {
            Alert.alert("Errore", "Inserisci una data valida.");
            return;
        }
        try {
            setIsLoading(true);
            const id = await createList([], trimmed);
            router.replace(`/lists/${id}`);
        } catch (error) {
            console.error(error);
            Alert.alert("Errore", "Impossibile creare la lista.");
        } finally {
            setIsLoading(false);
        }
    }

    const handleDuplicate = async (id:string) => {
        const item = lists.find(l => l.id === id);
        if (!item) {
            Alert.alert("Errore", "Lista non trovata.");
            return;
        }
        try {
            const dateToUse = date.trim() || item.data_creazione;
            setIsLoading(true);
            const newId = await createList(item.elementi ?? [], dateToUse);
            router.replace(`/lists/${newId}`);
        } catch (error) {
            console.error(error);
            Alert.alert("Errore", "Impossibile duplicare la lista.");
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <View style={styles.container}>
            <MainBg />
            <View style={styles.content}>
                <Text style={styles.title}>Crea nuova lista</Text>
                <TextInput
                    style={styles.input}
                    value={date}
                    onChangeText={setDate}
                    placeholder="gg/mm/aaaa"
                    keyboardType="default"
                />

                <Pressable style={styles.createButton} onPress={handleCreate}>
                    <Text style={styles.createButtonText}>Crea lista</Text>
                </Pressable>

                <Pressable style={styles.duplicateButton} onPress={() => setModalVisible(true)}>
                    <Text style={styles.duplicateText}>Duplica una lista esistente</Text>
                </Pressable>
            </View>
            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalContainer}>
                    <Text>Seleziona lista</Text>
                    {isLoading ? <Loader/> : <FlatList 
                    data={lists}
                    renderItem={({item})=>{
                        return (
                            <Pressable style={styles.createButton} onPress={()=>{ setSelectedListId(item.id); setIsSelected(true); }}>
                                <Text style={{color: Colors.BIANCO}}>{item.data_creazione}</Text>
                            </Pressable>
                        )
                    }}
                    />}
                    <Pressable disabled={!isSelected} onPress={() => handleDuplicate(selectedListId!)}>
                        <Text>Duplica</Text>
                    </Pressable>
                </View>
            </Modal>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center"
    },
    content: {
        width: "90%",
        marginTop: 40
    },
    title: {
        fontSize: 20,
        marginBottom: 10,
        fontFamily: "Quicksand_400Regular"
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.BIANCO,
        padding: 10,
        borderRadius: 8,
        marginBottom: 12,
        backgroundColor: Colors.GIALLO_CHIARO,
        fontFamily: "Quicksand_400Regular"
    },
    createButton: {
        backgroundColor: Colors.VERDE,
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 18
    },
    createButtonText: {
        color: Colors.BIANCO,
        fontWeight: "bold",
        fontFamily: "Quicksand_400Regular"
    },
    subtitle: {
        marginBottom: 8,
        fontFamily: "Quicksand_400Regular"
    },
    listRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: "rgba(255,255,255,0.03)"
    },
    listText: {
        color: Colors.BIANCO,
        fontFamily: "Quicksand_400Regular"
    },
    duplicateButton: {
        backgroundColor: Colors.GIALLO,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8
    },
    duplicateText: {
        fontFamily: "Quicksand_400Regular",
        fontWeight: "bold",
    },
    modalContainer: {
        flex: 0.5,
        width: "80%",
        backgroundColor: Colors.GIALLO_CHIARO,
        borderRadius:12,
        marginTop:40,
        alignSelf:"center",
        justifyContent:"center",
        alignItems:"center"
    }
})