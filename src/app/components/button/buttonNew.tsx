import { View, Text,StyleSheet } from 'react-native'
import React from 'react'

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { globalColors } from '@/src/styles/global';

export default function ButtonNew() {
  return (
    <View style={styles.container}>
      <FontAwesome5 name="plus" size={24} color="white" />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        width:60,
        height:60,
        marginBottom:20,
        backgroundColor:globalColors.primary,
        borderRadius:30,
        justifyContent:'center',
        alignItems:'center',   

    },
});