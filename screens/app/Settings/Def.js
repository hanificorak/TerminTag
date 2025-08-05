// Tanimlar.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Def() {
  return (
    <View style={styles.container}>
      <Text>Tanımlar içeriği</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
});
