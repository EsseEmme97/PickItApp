import { Colors } from "@/constants/Colors";
import type { List } from "@/types";
import { Link } from "expo-router";
import { StyleSheet } from "react-native";


export default function ListItem({data_creazione,id}:List){
    return (
        <Link style={styles.button} href={{pathname:"/lists/[id]", params:{id}}}>
            {data_creazione}
        </Link>
    )
}

const styles= StyleSheet.create({
    button:{
        fontFamily: "Quicksand_400Regular",
        backgroundColor:Colors.VERDE,
        borderRadius:12,
        color: "#fff",
        padding:10,
    }
})