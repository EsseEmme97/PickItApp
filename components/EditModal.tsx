import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Colors } from "@/constants/Colors";
import Feather from "@expo/vector-icons/Feather";

type EditModalProps = {
    visible: boolean;
    nome: string;
    quantita: string;
    onClose: () => void;
    onNomeChange: (text: string) => void;
    onQuantitaChange: (text: string) => void;
    onSave: () => void;
};

export default function EditModal({
    visible,
    nome,
    quantita,
    onClose,
    onNomeChange,
    onQuantitaChange,
    onSave,
}: EditModalProps) {
    return (
        <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
            <View style={styles.modal}>
                <TextInput
                    style={styles.input}
                    value={nome}
                    onChangeText={onNomeChange}
                    placeholder="Nome"
                />
                <TextInput
                    style={styles.input}
                    value={quantita}
                    onChangeText={onQuantitaChange}
                    keyboardType="numeric"
                    placeholder="Quantità"
                />
                <Pressable style={styles.button} onPress={onSave}>
                    <Text style={styles.buttonText}>Salva</Text>
                </Pressable>
                <Pressable style={styles.closeButton} onPress={onClose}>
                    <Feather name="x-circle" size={24} />
                </Pressable>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modal: {
        width: "80%",
        height:"80%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.BIANCO,
        gap: 15,
        borderRadius:30,
        alignSelf:"center",
        marginVertical:"auto",
    },
    input: {
        width: "80%",
        borderWidth: 1,
        borderColor: Colors.VERDE,
        backgroundColor:Colors.GIALLO_CHIARO,
        borderRadius: 8,
        padding: 10,
        fontFamily: "Quicksand_400Regular",
    },
    button: {
        backgroundColor: Colors.VERDE,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    buttonText: {
        color: "#fff",
        fontFamily: "Quicksand_400Regular",
        fontSize: 16,
    },
    closeButton:{
        position:"absolute",
        top:10,
        right:10,
    }
});