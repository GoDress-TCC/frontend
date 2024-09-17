import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function Outfits() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Outfits</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontWeight: "500",
    fontSize: 22,
    textAlign: "center"
  }
});