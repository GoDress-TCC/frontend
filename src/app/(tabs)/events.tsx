import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import { globalColors, globalStyles } from '@/src/styles/global';
import MainHeader from '../components/headers/mainHeader';

export default function Events() {
  return (
    <View style={globalStyles.globalContainer}>
      <MainHeader title="Eventos" />
    </View>
  )
}

const styles = StyleSheet.create({

});