import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addListener, removeListener } from './events';

interface NomeItem {
  id: string;
  nome: string;
  ativo: boolean;
}

const STORAGE_KEY_CADASTRO = '@nomes_lista';
const STORAGE_KEY_PROXIMA = '@nomes_proxima';

export default function CadastroScreen() {
  const [nome, setNome] = useState('');
  const [lista, setLista] = useState<NomeItem[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  // Carregar nomes e ouvir evento de limpeza

useEffect(() => {
  carregarNomes();

  const listener = () => sincronizarAtivacao();
  addListener(listener);

  return () => removeListener(listener); // cleanup ao desmontar
}, []);

  // Salvar lista no AsyncStorage sempre que mudar
  useEffect(() => {
    salvarNomes();
  }, [lista]);

  const carregarNomes = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY_CADASTRO);
      if (jsonValue) setLista(JSON.parse(jsonValue));
    } catch (e) {
      console.error(e);
    }
  };

  const salvarNomes = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_CADASTRO, JSON.stringify(lista));
    } catch (e) {
      console.error(e);
    }
  };

const adicionarOuEditarNome = () => {
  if (nome.trim() === '') return;

  if (editId) {
    setLista(prev => {
      const updated = prev.map(item => item.id === editId ? { ...item, nome } : item);

      // Atualiza também na Próxima se o item estiver ativo
      (async () => {
        try {
          const jsonProxima = await AsyncStorage.getItem(STORAGE_KEY_PROXIMA);
          let proximaLista: NomeItem[] = jsonProxima ? JSON.parse(jsonProxima) : [];

          proximaLista = proximaLista.map(p =>
            p.id === editId ? { ...p, nome } : p
          );

          await AsyncStorage.setItem(STORAGE_KEY_PROXIMA, JSON.stringify(proximaLista));
        } catch (e) {
          console.error(e);
        }
      })();

      return updated;
    });
    setEditId(null);
  } else {
    const novoItem: NomeItem = { id: Date.now().toString(), nome, ativo: false };
    setLista(prev => [...prev, novoItem]);
  }

  setNome('');
};


  const confirmarExcluir = (id: string) => {
    Alert.alert('Confirmar exclusão', 'Tem certeza que deseja excluir este nome?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => excluirNome(id) }
    ]);
  };

  const excluirNome = (id: string) => {
    setLista(prev => prev.filter(item => item.id !== id));
  };

  const iniciarEdicao = (item: NomeItem) => {
    setNome(item.nome);
    setEditId(item.id);
  };

  const sincronizarAtivacao = async () => {
    setLista(prevLista => {
      const atualizada = prevLista.map(item => ({ ...item, ativo: false }));

      (async () => {
        try {
          await AsyncStorage.setItem(STORAGE_KEY_CADASTRO, JSON.stringify(atualizada));
        } catch (e) {
          console.error(e);
        }
      })();

      return atualizada;
    });
  };

  const ativarNome = async (item: NomeItem) => {
    setLista(prevLista => {
      const updated = prevLista.map(i => i.id === item.id ? { ...i, ativo: !i.ativo } : i);

      (async () => {
        try {
          const jsonProxima = await AsyncStorage.getItem(STORAGE_KEY_PROXIMA);
          const proximaLista: NomeItem[] = jsonProxima ? JSON.parse(jsonProxima) : [];

          const isAtivo = item.ativo; // estado antigo
          if (!isAtivo) {
            await AsyncStorage.setItem(STORAGE_KEY_PROXIMA, JSON.stringify([...proximaLista, { ...item, ativo: true }]));
          } else {
            const novaListaProxima = proximaLista.filter(i => i.id !== item.id);
            await AsyncStorage.setItem(STORAGE_KEY_PROXIMA, JSON.stringify(novaListaProxima));
          }
        } catch (e) {
          console.error(e);
        }
      })();

      return updated;
    });
  };

  const renderItem = ({ item }: { item: NomeItem }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.nome}</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => iniciarEdicao(item)}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => confirmarExcluir(item.id)}>
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, item.ativo ? styles.ativoButton : styles.inativoButton]}
          onPress={() => ativarNome(item)}
        >
          <Text style={styles.buttonText}>{item.ativo ? 'Desativar' : 'Ativar'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Nomes</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Digite um nome"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
        />
        <TouchableOpacity style={styles.addButton} onPress={adicionarOuEditarNome}>
          <Text style={styles.addButtonText}>{editId ? 'Salvar' : 'Adicionar'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={lista}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f2f2f2' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, alignSelf: 'center' },
  inputContainer: { flexDirection: 'row', marginBottom: 20 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 12, paddingHorizontal: 15, paddingVertical: 10, backgroundColor: '#fff' },
  addButton: { marginLeft: 10, backgroundColor: '#4CAF50', borderRadius: 12, paddingHorizontal: 15, justifyContent: 'center' },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  itemContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#fff', borderRadius: 12, marginBottom: 10 },
  itemText: { fontSize: 18 },
  buttonsContainer: { flexDirection: 'row' },
  button: { paddingVertical: 5, paddingHorizontal: 10, borderRadius: 8, marginLeft: 5 },
  editButton: { backgroundColor: '#2196F3' },
  deleteButton: { backgroundColor: '#f44336' },
  inativoButton: { backgroundColor: '#9E9E9E' },
  ativoButton: { backgroundColor: '#4CAF50' },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});
