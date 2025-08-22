import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, ImageBackground } from 'react-native';
import { useJogadores } from './JogadoresContext';
import { transformer } from '../metro.config';

export default function TimesScreen() {
  const { proximo, jogadores, atualizarGols, toggleAtivo, bloqueadoStatus } = useJogadores();
  const [timeAIds, setTimeAIds] = useState<string[]>([]);
  const [timeBIds, setTimeBIds] = useState<string[]>([]);

  const proximaLista = proximo;

  // ---------- Substituir jogador ----------
  const substituirJogador = (time: 'A' | 'B', jogadorId: string) => {
    if (proximaLista.length === 0) {
      Alert.alert('Aviso', 'Não há jogadores na lista Próxima para substituição.');
      return;
    }

    // Pega o primeiro da lista Próxima
    const primeiroProximo = proximaLista[0];
    toggleAtivo(primeiroProximo.id); // marca como inativo (sai da Próxima)

    // Remove jogador clicado do time
    if (time === 'A') {
      setTimeAIds(prev => {
        const novo = prev.filter(id => id !== jogadorId);
        // devolve jogador removido ao final da Próxima
        toggleAtivo(jogadorId); // ativa de volta (vai para o final)
        return [...novo, primeiroProximo.id];
      });
    } else {
      setTimeBIds(prev => {
        const novo = prev.filter(id => id !== jogadorId);
        toggleAtivo(jogadorId);
        return [...novo, primeiroProximo.id];
      });
    }
  };

  // ---------- Distribuir ou Limpar ----------
  const handleDistribuirOuLimpar = () => {
    if (timeAIds.length === 0 && timeBIds.length === 0) {
      if (proximaLista.length < 10) {
        Alert.alert('Aviso', 'Não há nomes suficientes (mínimo 10) na lista Próxima.');
        return;
      }

      Alert.alert('Confirmar', 'Deseja distribuir os primeiros 10 nomes nos times?', [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Distribuir',
          onPress: () => {
            const primeiros10 = proximaLista.slice(0, 10);
            const novosA = primeiros10.slice(0, 5);
            const novosB = primeiros10.slice(5, 10);

            primeiros10.forEach(j => toggleAtivo(j.id));

            setTimeAIds(novosA.map(j => j.id));
            setTimeBIds(novosB.map(j => j.id));
          },
        },
      ]);
    } else {
      Alert.alert('Confirmar', 'Deseja limpar os times e devolver os nomes para a Próxima?', [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          onPress: () => {
            [...timeAIds, ...timeBIds].forEach(id => toggleAtivo(id));
            setTimeAIds([]);
            setTimeBIds([]);
          },
        },
      ]);
    }
  };

  // ---------- Subir/Perder times inteiros ----------
  const handleTimeA = () => {
    if (timeAIds.length > 0) {
      Alert.alert('Confirmar', 'Deseja limpar o Time A?', [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Perdeu',
          onPress: () => {
            timeAIds.forEach(id => toggleAtivo(id));
            setTimeAIds([]);
          },
        },
      ]);
    } else {
      // 🔹 Filtra somente os desbloqueados
      const disponiveis = proximaLista.filter(j => !bloqueadoStatus[j.id]);

      if (disponiveis.length < 5) {
        Alert.alert('Aviso', 'Não há jogadores suficientes (mínimo 5 desbloqueados) na lista Próxima.');
        return;
      }

      Alert.alert('Confirmar', 'Deseja subir 5 jogadores para o Time A?', [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Subir',
          onPress: () => {
            const primeiros5 = disponiveis.slice(0, 5);
            primeiros5.forEach(j => toggleAtivo(j.id));
            setTimeAIds(primeiros5.map(j => j.id));
          },
        },
      ]);
    }
  };


  const handleTimeB = () => {
    if (timeBIds.length > 0) {
      Alert.alert('Confirmar', 'Deseja limpar o Time B?', [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Perdeu',
          onPress: () => {
            timeBIds.forEach(id => toggleAtivo(id));
            setTimeBIds([]);
          },
        },
      ]);
    } else {
      // 🔹 Filtra somente os desbloqueados
      const disponiveis = proximaLista.filter(j => !bloqueadoStatus[j.id]);

      if (disponiveis.length < 5) {
        Alert.alert('Aviso', 'Não há jogadores suficientes (mínimo 5 desbloqueados) na lista Próxima.');
        return;
      }

      Alert.alert('Confirmar', 'Deseja subir 5 jogadores para o Time B?', [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Subir',
          onPress: () => {
            const primeiros5 = disponiveis.slice(0, 5);
            primeiros5.forEach(j => toggleAtivo(j.id));
            setTimeBIds(primeiros5.map(j => j.id));
          },
        },
      ]);
    }
  };


  // ---------- Render jogador com botão de substituição ----------
  const renderItem = ({ item, time }: { item: any, time: 'A' | 'B' }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.nome}</Text>
      <TouchableOpacity
        onPress={() => atualizarGols(item.id, 1)}
        onLongPress={() => atualizarGols(item.id, -1)}
      >
        <Text style={styles.golsText}>⚽ {item.gols}</Text>
      </TouchableOpacity>

      {/* Botão de Substituir */}
      <TouchableOpacity
        style={styles.subButton}
        onPress={() => substituirJogador(time, item.id)}
      >
        <Text style={styles.subButtonText}>🔄</Text>
      </TouchableOpacity>
    </View>
  );

  const timeA = timeAIds.map(id => jogadores.find(j => j.id === id)!);
  const timeB = timeBIds.map(id => jogadores.find(j => j.id === id)!);

  return (

    <ImageBackground
      source={require('../assets/transferir1.jpg')}
      style={styles.background}>

      <View >
      <View style={styles.Times}>

        <View style={styles.TimeA}>

          <Text style={styles.subtitle}>Time A</Text>

          <FlatList
            data={timeA}
            keyExtractor={item => item.id}
            renderItem={({ item }) => renderItem({ item, time: 'A' })}
            ListEmptyComponent={<Text style={styles.empty}>Sem jogadores</Text>}
          />

          <View style={styles.buttonTime}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: timeAIds.length > 0 ? '#f44336' : '#0c09a8ff', width: 350, height: 50 }]}
              onPress={handleTimeA}
            >
              <Text style={styles.buttonText}>
                {timeAIds.length > 0 ? 'Perdeu' : 'Subir Time A'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.TimeB}>

          <Text style={styles.subtitle}>Time B</Text>
          =
          <FlatList
            data={timeB}
            keyExtractor={item => item.id}
            renderItem={({ item }) => renderItem({ item, time: 'B' })}
            ListEmptyComponent={<Text style={styles.empty}>Sem jogadores</Text>}
          />

          <View style={styles.buttonTime}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: timeBIds.length > 0 ? '#f44336' : '#0c09a8ff', width: 350, height: 50 }]}
              onPress={handleTimeB}
            >
              <Text style={styles.buttonText}>
                {timeBIds.length > 0 ? 'Perdeu' : 'Subir Time B'}
              </Text>
            </TouchableOpacity>
          </View>

        </View>

      </View>


      <View style={styles.buttonTimeGeral}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: (timeAIds.length > 0 || timeBIds.length > 0) ? '#f44336' : '#0c09a8ff', width: 400, height: 50 }]}
          onPress={handleDistribuirOuLimpar}
        >
          <Text style={styles.buttonText}>
            {(timeAIds.length > 0 || timeBIds.length > 0) ? 'Limpar Times' : 'Distribuir'}
          </Text>
        </TouchableOpacity>
      </View>

    </View>

      </ImageBackground >
  );
}

const styles = StyleSheet.create({
  container: { padding: 3},
  background: {flex: 1},
  subtitle: { borderBottomWidth: 5 , borderBottomColor: '#b92f2fff', color: '#ffffff', fontSize: 20, fontWeight: 'bold', marginBottom: 8, fontFamily: 'fantasy'},
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 3
  },
  Times: {
    padding: 5
  },
  TimeA: {
    padding: 3,
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 20
  },
  TimeB: {
    padding: 3,
    borderWidth: 1,
    borderColor: '#f3e3e3ff',
    borderRadius: 20
  },
  buttonTime: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonTimeGeral: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 20,
  },
  itemText: { width: 150, fontSize: 20, color: '#fff', fontWeight: 'bold', fontFamily: 'fantasy'},
  golsText: { width: 100, fontSize: 20, color: '#fff', marginHorizontal: 10 },
  empty: { fontSize: 16, color: '#888', fontStyle: 'italic' },
  button: { padding: 10, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15, fontFamily: 'fantasy' },
  
  subButton: {
    borderRadius: 8,
    padding: 6,
    marginRight: 30
  },
  subButtonText: { color: '#141414ff', fontSize: 18, fontWeight: 'bold' },
});
