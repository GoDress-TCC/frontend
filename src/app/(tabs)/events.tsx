import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import { globalColors, globalStyles } from '@/src/styles/global';
import Fonts from '@/src/services/utils/Fonts';
import fonts from '@/src/services/fonts';

export default function events() {
  return (
    <View style={styles.container}>
      <View style={styles.eventbox}>

        <View style={{ width: '33%' }}>
          <Image style={styles.imgModelo} source={require('../../../assets/images/ModelRoupa.png')} />
        </View>
        <View style={styles.boxInfo} >
          <Text style={styles.title}> Nome evento</Text>
          <Text style={styles.subTitle}> Dia Evento</Text>
        </View>

        <View >
          <Image style={styles.userEvent} source={require('../../../assets/icons/User.png')} />
        </View>

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  eventbox: {
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 8,
    borderBottomWidth: 8,
    borderRadius: 24,
    height: 150,
    width: "100%",
    borderColor: globalColors.primary,

    flexDirection: 'row',
    paddingHorizontal: 20,
  },

  imgModelo: {
    resizeMode: 'contain',
    width: 50,
    height: 110,
  },

  boxInfo: {
    marginLeft:-70,
  },



  userEvent: {
    height: 60,
    width: 60,
  },

  title: {

    fontFamily: Fonts['montserrat-extrabold'],
    fontSize: 18,
    color: globalColors.primary,
  },

  subTitle:{
    fontFamily: Fonts['montserrat-regular'],
    fontSize:12,
    color:'#979797',
  },



});