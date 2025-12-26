import { db } from "@/firebase.config";
import { collection, getDocs, doc, getDoc, addDoc } from "firebase/firestore";
import type { List } from "@/types";

export async function getLists(): Promise<List[]>{
    const lists= collection(db, "liste");
    const querySnapshot= await getDocs(lists);
    const formattedLists= querySnapshot.docs.map((doc)=>{
        return {id:doc.id, ...doc.data()};
    }) as List[];
    return formattedLists;
}

export async function getSingleList(id:string){
    const lists= collection(db,"liste");
    const singleDocRef= doc(lists,id);
    const singleDocSnap= await getDoc(singleDocRef);
    return singleDocSnap.data();
};

export async function seedDatabase(): Promise<void> {
    const lists= collection(db,"liste");
    await addDoc(lists,{
        data_creazione: new Date().toLocaleDateString(),
        elementi:[
            {nome:"latte", quantita:1},
            {nome:"pane", quantita:3}
        ],
    });
}

/* console.log(getLists().then(console.log)) */