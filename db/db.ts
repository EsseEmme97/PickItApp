import { db } from "@/firebase.config";
import type { List } from "@/types";
import { addDoc, collection, doc, getDoc, getDocs, updateDoc, arrayUnion, arrayRemove, runTransaction } from "firebase/firestore";

export async function getLists(): Promise<List[]>{
    try {
        const lists = collection(db, "liste");
        const querySnapshot = await getDocs(lists);
        if (!querySnapshot || !Array.isArray(querySnapshot.docs)) return [];
        const formattedLists = querySnapshot.docs.map((doc) => {
            const data = doc.data() || {};
            return { id: doc.id, ...(data as object) } as List;
        }) as List[];
        return formattedLists;
    } catch (error) {
        console.error("getLists error:", error);
        throw new Error("Impossibile recuperare le liste dal database.");
    }
}

export async function getSingleList(id:string): Promise<List>{
    if (!id || typeof id !== "string") {
        throw new Error("ID non valido fornito a getSingleList");
    }

    try {
        const lists = collection(db, "liste");
        const singleDocRef = doc(lists, id);
        const singleDocSnap = await getDoc(singleDocRef);

        if (!singleDocSnap.exists()) {
            throw new Error(`Lista con id ${id} non trovata`);
        }

        const data = singleDocSnap.data();
        if (!data) throw new Error(`Documento ${id} privo di dati`);

        return data as List;
    } catch (error) {
        console.error(`getSingleList error (id=${id}):`, error);
        throw new Error("Impossibile recuperare la lista richiesta dal database.");
    }
};

export async function updateListElements(id: string, elementi: List['elementi']): Promise<void> {
  const ref = doc(db, "liste", id);
  await updateDoc(ref, { elementi });
}

export async function addElementToList(id: string, element: List['elementi'][0]): Promise<void> {
  const ref = doc(db, "liste", id);
  await updateDoc(ref, { elementi: arrayUnion(element) });
}

export async function removeElementFromList(id: string, element: List['elementi'][0]): Promise<void> {
  const ref = doc(db, "liste", id);
  await updateDoc(ref, { elementi: arrayRemove(element) });
}


export async function seedDatabase(): Promise<void> {
    try {
        const lists = collection(db, "liste");
        await addDoc(lists, {
            data_creazione: new Date().toLocaleDateString(),
            elementi: [
                { nome: "latte", quantita: 1 },
                { nome: "pane", quantita: 3 }
            ],
        });
    } catch (error) {
        console.error("seedDatabase error:", error);
        throw new Error("Impossibile inserire dati iniziali nel database.");
    }
}

/* console.log(getLists().then(console.log)) */