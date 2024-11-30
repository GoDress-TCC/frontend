import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import { globalColors, globalStyles } from '@/src/styles/global';
import { useUser } from '@/src/services/contexts/userContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Fonts from '@/src/services/utils/Fonts';
import { router } from 'expo-router';
import MainHeader from '../components/headers/mainHeader';

export default function Profile() {

  const { user, getUser } = useUser();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('jwtToken');
    router.replace("../");
    getUser();
  };

  return (
    <View style={globalStyles.globalContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: 30 }}>
          <MainHeader title='Perfil' />
        </View>

        <View>
          <View style={{ alignItems: "center", gap: 5 }}>
            <FontAwesome name="user-circle-o" size={97} color="#0009" />
            <View style={styles.txtnName}>
              <Text style={styles.title}>{user?.name ? user.name : "..."} </Text>
              <Text style={styles.title}>{user?.surname ? user.surname : "..."}</Text>
            </View>
          </View>

          <View style={{ gap: 10, marginVertical: 30 }}>
            <TouchableOpacity style={styles.boxFav} onPress={() => router.navigate("/clothes/favClothes")}>
              <Text style={styles.txt}>Favoritos</Text>
              <Image style={styles.iconLav} source={require('../../../assets/icons/coracao.png')} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.boxFav} onPress={() => router.navigate("/laundry/dirtyClothes")}>
              <Text style={styles.txt}>Lavanderia</Text>
              <Image style={styles.iconLav} source={require('../../../assets/icons/lavanderia.png')} />
            </TouchableOpacity>
          </View>

          <View>
            <Text style={[styles.title, { marginBottom: 16 }]}>Configurações</Text>
            <View style={styles.configBox}>
              <TouchableOpacity style={styles.bottom} >
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Ionicons name="information-circle-outline" size={24} color="black" />
                  <Text style={styles.txt}>Informações pessoais</Text>
                </View>
                <Ionicons name="chevron-forward-outline" size={24} color="black" />

              </TouchableOpacity>

              <TouchableOpacity style={styles.bottom}>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <MaterialIcons name="security" size={24} color="black" />
                  <Text style={styles.txt}>Login e segurança</Text>
                </View>
                <Ionicons name="chevron-forward-outline" size={24} color="black" />

              </TouchableOpacity>

              <TouchableOpacity style={styles.bottom}>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Ionicons name="accessibility-outline" size={24} color="black" />
                  <Text style={styles.txt}>Acessibilidade</Text>
                </View>

                <Ionicons name="chevron-forward-outline" size={24} color="black" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.bottom} onPress={handleLogout}>
                <Text style={{ textDecorationLine: "underline", fontFamily: Fonts['montserrat-bold'], fontSize: 16, marginVertical: 5 }}>Sair da conta</Text>
              </TouchableOpacity>

            </View>

          </View>

        </View>
      </ScrollView>
    </View >
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
    borderWidth: 1,
    borderLeftWidth: 8,
    borderBottomWidth: 8,
    borderRadius: 10,
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

  configBox: {
    gap: 16,
  },

  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderColor: globalColors.primary,
  },

});