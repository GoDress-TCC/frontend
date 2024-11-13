import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useEffect } from 'react'
import { globalColors, globalStyles } from '@/src/styles/global';
import { useUser } from '@/src/services/contexts/userContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import Fonts from '@/src/services/utils/Fonts';
import { router } from 'expo-router';

export default function Profile() {

  const { user } = useUser();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('jwtToken');
    router.replace('/');
  };

  return (
    <View style={globalStyles.containerGlobal}>
      <View style={{ marginBottom: 30 }}>
        <Text style={globalStyles.mainTitle}> Perfil </Text>
      </View>

      <View >
        <View style={{ alignItems: "center", gap: 5 }}>
          <FontAwesome name="user-circle-o" size={97} color="#0009" />
          <View style={styles.txtnName}>
            <Text style={styles.title}>{user?.name ? user.name : "..."} </Text>
            <Text style={styles.title}>{user?.surname ? user.surname : "..."}</Text>
          </View>
        </View>

        <View style={{ gap: 10, marginVertical: 30 }}>
          <TouchableOpacity style={styles.boxFav} onPress={() => router.navigate("/clothes/favClothes")}>
            <Text style={styles.txt}> Favoritos</Text>
            <Image style={styles.iconLav} source={require('../../../assets/icons/coracao.png')} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.boxFav} onPress={() => router.navigate("/clothes/favClothes")}>
            <Text style={styles.txt}> Lavanderia</Text>
            <Image style={styles.iconLav} source={require('../../../assets/icons/lavanderia.png')} />
          </TouchableOpacity>
        </View>

        <View>
          <Text style={[styles.title, { marginBottom: 10 }]}>Configurações</Text>
          <View>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={{ fontWeight: "600", textDecorationLine: "underline", fontSize: 16  }}>Sair da conta</Text>
            </TouchableOpacity>
          </View>
        </View>



      </View>
    </View>
  )
}

const styles = StyleSheet.create({

  title: {
    fontFamily: Fonts['montserrat-bold'],
    fontSize: 18,
  },

  txtnName: {
    flexDirection: 'row',
  },

  txt: {
    fontFamily: Fonts['montserrat-medium'],
    fontSize: 16,
  },

  boxFav: {
    backgroundColor: globalColors.white,
    borderLeftWidth: 8,
    borderBottomWidth: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: globalColors.primary,
    paddingVertical: 26,
    paddingHorizontal: 20,
    width: "100%",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  iconLav: {
    width: 20,
    height: 25,
    resizeMode: 'contain',
  },

});