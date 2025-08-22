import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet, ImageBackground } from 'react-native';
import { useJogadores } from './JogadoresContext';

export default function CadastroScreen() {
  const { jogadores, adicionar, editar, excluir, toggleAtivo } = useJogadores();
  const [nome, setNome] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  const adicionarOuEditarNome = () => {
    if (nome.trim() === '') return;

    if (editId) {
      editar(editId, nome); // atualiza o nome pelo contexto
      setEditId(null);
    } else {
      adicionar(nome); // adiciona novo jogador
    }

    setNome('');
  };

  const confirmarExcluir = (id: string) => {
    Alert.alert('Confirmar exclusão', 'Tem certeza que deseja excluir este nome?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => excluir(id) },
    ]);
  };

  const iniciarEdicao = (id: string, nomeAtual: string) => {
    setNome(nomeAtual);
    setEditId(id);
  };

  const ativarNome = (id: string) => {
    toggleAtivo(id);
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        onPress={() => iniciarEdicao(item.id, item.nome)}
        onLongPress={() => confirmarExcluir(item.id)}
      >
        <Text style={styles.itemText}>{item.nome}</Text>
      </TouchableOpacity>

      <View style={styles.golsContainer}>
        <Text style={styles.golsText}>⚽  {item.gols}</Text>
      </View>

      {/* Botão Ativar / Desativar continua */}

      <TouchableOpacity
        style={[styles.button, item.ativo ? styles.ativoButton : styles.inativoButton]}
        onPress={() => ativarNome(item.id)}
      >
        <Text style={styles.buttonText}>{item.ativo ? 'Em campo' : 'Em casa'}</Text>
      </TouchableOpacity>
    </View>
  );


  return (

    <ImageBackground
      source={require('../assets/Home.jpeg')}
      style={styles.background}
      imageStyle={{opacity: 0.6}}
      resizeMode='cover'>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            value={nome}
            onChangeText={setNome}
            style={styles.input}
          />
          <TouchableOpacity style={styles.addButton} onPress={adicionarOuEditarNome}>
            <Text style={styles.addButtonText}>{editId ? 'Salvar' : 'Adicionar'}</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={[...jogadores].sort((a, b) => b.gols - a.gols)}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      </View>
    </ImageBackground>

  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 5, marginTop: 20},
  background: { flex: 1, borderWidth: 5, borderColor: '#020202ff' },
  inputContainer: { flexDirection: 'row', marginBottom: 15 },
  input: {fontFamily: 'fantasy' , fontSize: 18, fontWeight: 'bold', flex: 1, borderWidth: 1, borderColor: '#fff', color: '#2b2a2aff', borderRadius: 10, paddingHorizontal: 15, paddingVertical: 10 },
  addButton: { marginLeft: 10, backgroundColor: '#171591ff', borderRadius: 10, paddingHorizontal: 15, justifyContent: 'center' },
  addButtonText: { fontFamily: 'fantasy' , color: '#fff', fontWeight: 'bold' },
  itemContainer: { flexDirection: 'row', alignItems: 'center', padding: 5, marginBottom: 10, justifyContent: 'space-between' },
  itemText: { width: 100, fontWeight: 'bold', fontSize: 15, flex: 1, color: '#000000ff' },
  golsContainer: {width: 150, textAlign: 'center', borderColor: '#fff', },
  golsText: { fontSize: 15, color: '#000000ff' , textAlign: 'center', fontWeight: 'bold' },
  button: { paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10, marginLeft: 5 },
  inativoButton: { backgroundColor: '#d41717ff', width: 150 },
  ativoButton: { backgroundColor: '#4CAF50', width: 150 },
  buttonText: { fontFamily: 'fantasy' ,color: '#fff', fontWeight: 'bold', textAlign: 'center' },
});
