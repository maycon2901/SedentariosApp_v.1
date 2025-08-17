// screens/TimesScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TimesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Times</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24, fontWeight: 'bold' },
});
