import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, ImageBackground } from 'react-native';
import { useJogadores } from './JogadoresContext';

export default function ProximaScreen() {
  const { proximo, toggleAtivo, bloqueadoStatus, toggleBloqueado } = useJogadores();
  const [valorInput, setValorInput] = useState('');
  const [resultado, setResultado] = useState<number | null>(null);
  const [pagoStatus, setPagoStatus] = useState<{ [key: string]: boolean }>({});

  const proximaLista = proximo;

  // Inicializa/atualiza status de pagamento sem perder os já setados

  useEffect(() => {
    setPagoStatus(prev => {
      const updated: { [key: string]: boolean } = { ...prev };
      proximaLista.forEach(jogador => {
        if (updated[jogador.id] === undefined) {
          updated[jogador.id] = false; // só inicializa se não existir
        }
      });
      return updated;
    });
  }, [proximaLista]);

  // Recalcula automaticamente
  useEffect(() => {
    const valorNumerico = parseFloat(valorInput.replace(',', '.'));
    const quantidadeNomes = proximaLista.length;

    if (!isNaN(valorNumerico) && quantidadeNomes > 0) {
      // regra: quantidade ÷ valor
      const resultadoCalculado = valorNumerico / quantidadeNomes;
      setResultado(resultadoCalculado);
    } else {
      setResultado(null);
    }
  }, [valorInput, proximaLista]);

  const limparLista = () => {
    Alert.alert(
      "Confirmação",
      "Deseja realmente limpar a lista?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Sim",
          onPress: () => {
            proximaLista.forEach(item => toggleAtivo(item.id));
          }
        }
      ],
      { cancelable: true }
    );
  };

  const togglePago = (id: string) => {
    setPagoStatus(prevStatus => ({
      ...prevStatus,
      [id]: !prevStatus[id],
    }));
  };

  const renderItem = ({ item }: { item: any }) => (

    <View style={styles.itemContainer}>

      <Text style={styles.itemText}>{item.nome}</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>

        <Text style={{ fontSize: 20, color: '#fff', marginRight: 30 }}>⚽  {item.gols}   </Text>

        <TouchableOpacity onPress={() => togglePago(item.id)}>
          <Text style={{ fontSize: 20, marginRight: 30 }}>
            {pagoStatus[item.id] ? '✅' : '❌'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => toggleBloqueado(item.id)}>
          <Text style={{ fontSize: 20 }}>{bloqueadoStatus[item.id] ? "🔒" : "🟢"}</Text>
        </TouchableOpacity>

      </View>
    </View>
  );

  return (

    <ImageBackground
      source={require('../assets/Logo3.jpg')}
      style={styles.background}>

      <View style={styles.container}>

        <FlatList
          data={proximaLista}
          keyExtractor={item => item.id}
          renderItem={renderItem}
        />

       
      </View>



      <View style={styles.finaltela}>

        {/* cálculo e contagem */}
        <View style={styles.calculationContainer}>
          <Text style={styles.countText}>{proximaLista.length}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Valor"
            value={valorInput}
            onChangeText={setValorInput}
          />
          <Text style={styles.resultText}>
            {resultado !== null ? `R$ ${resultado.toFixed(2)}` : 'R$ 0,00'}
          </Text>
        </View>

         {proximaLista.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={limparLista}>
            <Text style={styles.clearButtonText}>Limpar</Text>
          </TouchableOpacity>
        )}

      </View>

    </ImageBackground>

  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  background: { flex: 1, borderWidth: 2 },
  calculationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 260,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    marginLeft: 5

  },
  countText: { width: 70, fontSize: 15, fontFamily: 'fantasy', textAlign: 'center' },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    fontSize: 15,

  },
  finaltela: {
    flexDirection: 'row',
    height: 50,
    padding: 3
  },
    clearButton: {
    backgroundColor: '#f44336',
    width: 140,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 10,
    justifyContent: 'center'
  },
  clearButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15, fontFamily: 'fantasy' },
  resultText: {
    fontSize: 15,
    color: '#0c0c0cff',
    marginRight: 5
  },
  itemContainer: {
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemText: { fontSize: 20, color: '#fff' },
});
