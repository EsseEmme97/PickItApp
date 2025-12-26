import { StyleSheet, View, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { getLists } from '@/db/db';
import { FlatList } from 'react-native';
import type { List } from '@/types';
import { Link } from 'expo-router';

export default function TabOneScreen() {
  const [lists, setLists] = useState<List[]>([]);

  useEffect(() => {
    getLists().then(setLists);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vedi tutte le liste</Text>
      <FlatList data={lists} renderItem={ ({item}) => 
        <Link style={{color:"white"}} href={{pathname:"/lists/[listId]", params:{listId:item.id}}} asChild>
          <Text style={{color:"white"}}>{item["data_creazione"]}</Text>
        </Link>
         } 
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color:"white",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
