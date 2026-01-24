import { db } from "@/firebase.config";
import type { List } from "@/types";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";

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

export async function deleteList(id: string): Promise<void> {
    if (!id || typeof id !== "string") {
        throw new Error("ID non valido fornito a deleteList");
    }

    try {
        const ref = doc(db, "liste", id);
        await deleteDoc(ref);
    } catch (error) {
        console.error(`deleteList error (id=${id}):`, error);
        throw new Error("Impossibile eliminare la lista dal database.");
    }
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


export async function createList(elementi: List['elementi'] = [], data_creazione?: string): Promise<string> {
    try {
        const lists = collection(db, "liste");
        const dateValue = data_creazione ?? new Date().toLocaleDateString();
        const docRef = await addDoc(lists, {
            data_creazione: dateValue,
            elementi,
        });
        return docRef.id;
    } catch (error) {
        console.error("createList error:", error);
        throw new Error("Impossibile creare la nuova lista.");
    }
}