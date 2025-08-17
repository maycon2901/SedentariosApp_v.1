import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { emitEvent } from './events';

interface NomeItem {
  id: string;
  nome: string;
  ativo: boolean;
}

const STORAGE_KEY_PROXIMA = '@nomes_proxima';

export default function ProximaScreen() {
  const [proximaLista, setProximaLista] = useState<NomeItem[]>([]);

useFocusEffect(
  React.useCallback(() => {
    const carregarProxima = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY_PROXIMA);
        setProximaLista(jsonValue ? JSON.parse(jsonValue) : []);
      } catch (e) {
        console.error(e);
      }
    };
    carregarProxima();
  }, [])
);

  const carregarProxima = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY_PROXIMA);
      if (jsonValue) setProximaLista(JSON.parse(jsonValue));
      else setProximaLista([]);
    } catch (e) { console.error(e); }
  };

 const limparLista = async () => {
  setProximaLista([]);
  await AsyncStorage.setItem(STORAGE_KEY_PROXIMA, JSON.stringify([]));

  emitEvent(); // chama listener do CadastroScreen
};

  const renderItem = ({ item }: { item: NomeItem }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.nome}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Próxima Lista</Text>
      <FlatList
        data={proximaLista}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
      {proximaLista.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={limparLista}>
          <Text style={styles.clearButtonText}>Limpar Lista</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f2f2f2' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, alignSelf: 'center' },
  itemContainer: { padding: 15, backgroundColor: '#fff', borderRadius: 12, marginBottom: 10 },
  itemText: { fontSize: 18 },
  clearButton: { backgroundColor: '#f44336', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  clearButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
