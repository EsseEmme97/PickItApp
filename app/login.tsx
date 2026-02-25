import { useAuthContext } from "@/components/auth/AuthProvider";
import MainBg from "@/components/MainBg";
import { Colors } from "@/constants/Colors";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Loader from "@/components/Loader";

export default function LoginPage() {
    const { signInAnonymously, signInWithEmail } = useAuthContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert("Errore", "Inserisci email e password.");
            return;
        }
        setIsLoading(true);
        try {
            await signInWithEmail(email.trim(), password.trim());
        } catch (err: any) {
            Alert.alert("Errore", "credenziali errate");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnonymousLogin = async () => {
        setIsLoading(true);
        try {
            await signInAnonymously();
        } catch (err: any) {
            Alert.alert("Errore", "impossibile accedere come utente anonimo");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.wrapper}>
            <MainBg />
            {isLoading ?
                <Loader /> :
                <>
                    <Text style={styles.text}>Entra con mail e password</Text>
                    <View style={styles.form}>
                        <TextInput
                            style={styles.input}
                            placeholder="email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                        <Pressable style={styles.button} onPress={handleEmailLogin} disabled={isLoading}>
                            <Text style={styles.buttonText}>Entra</Text>
                        </Pressable>
                    </View>
                    <View style={styles.separator} />
                    <Text style={styles.altText}>Oppure entra come utente anonimo</Text>
                    <Pressable style={styles.anonymousButton} onPress={handleAnonymousLogin} disabled={isLoading}>
                        <Text style={{...styles.buttonText, color:"black"}}>Entra come utente anonimo</Text>
                    </Pressable>
                </>}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontFamily: "Quicksand_400Regular",
        fontSize: 18,
        marginBottom: 20,
        fontWeight: "bold",
    },
    form: {
        width: "80%",
        gap: 10,
        marginBottom: 20,
        alignItems: "center",
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        fontFamily: "Quicksand_400Regular",
        fontSize: 16,
        backgroundColor: "white",
    },
    button: {
        backgroundColor: Colors.VERDE,
        padding: 12,
        borderRadius: 8,
        width: "100%",
    },
    anonymousButton:{
        backgroundColor: Colors.GIALLO,
        padding: 12,
        borderRadius: 8,
        width: "80%",
    },
    buttonText: {
        color: Colors.BIANCO,
        fontFamily: "Quicksand_400Regular",
        fontSize: 16,
        textAlign: "center",
    },
    separator: {
        borderBottomColor: "black",
        borderBottomWidth: StyleSheet.hairlineWidth,
        width: "80%",
        marginVertical: 20,
    },
    altText:{
        fontFamily: "Quicksand_400Regular",
        fontSize: 12,
        textAlign: "center",
        color: "black",
        marginBottom: 20,
    }
})