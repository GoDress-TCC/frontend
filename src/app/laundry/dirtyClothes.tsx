import { View, Text, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import React, { useState } from 'react'

import { useClothes } from '@/src/services/contexts/clothesContext'
import { globalColors, globalStyles } from '@/src/styles/global'
import { Ionicons } from '@expo/vector-icons'
import ClothesList from '../components/flatLists/clothesList'
import Api from '@/src/services/api'
import Toast from 'react-native-toast-message'
import MainHeader from '../components/headers/mainHeader'
import ConfirmationModal from '../components/modals/confirmationModal'

export default function DirtyClothes() {
  const [loading, setLoading] = useState(false);
  const [confirmationModalwash, setConfirmationModalwash] = useState(false);

  const { clothes, getClothes, selectedClothesIds } = useClothes();

  const filteredClothes = clothes.filter(item => item.dirty === true);

  const onSubmitWashClothes = async () => {
    setLoading(true);

    const currentClothes = filteredClothes.map(item => item._id);

    await Api.put(`/clothing/${selectedClothesIds.length > 0 ? selectedClothesIds : currentClothes}`, { dirty: false })
      .then((response) => {
        console.log(response.data.msg);
        getClothes();
        setConfirmationModalwash(false);
      })
      .catch(error => {
        console.log(error.response.data);
        Toast.show({
          type: 'error',
          text1: error.reponse.data,
          text2: 'Tente novamente'
        });
      })
      .finally(() => {
        setLoading(false);

        Toast.show({
          type: 'success',
          text1: 'Roupas lavadas com sucesso!'
        });
      });
  }
  return (
    <View style={globalStyles.globalContainerForLists}>
      <View style={{ marginHorizontal: 20 }}>
        <MainHeader title='Lavanderia' backButton={true} />
      </View>

      {filteredClothes.length === 0 ?
        <View style={globalStyles.message}>
          <Text>Você não possui roupas sujas</Text>
        </View>
        :
        <View style={globalStyles.flatListContainer}>
          <ClothesList clothes={filteredClothes} clothingBg='#fff' canSelect={true} canOpen={true} operations={["delete", "fav"]} buttonTitle={selectedClothesIds.length === 0 ? "Lavar todas as roupas" : "Lavar roupas selecionadas"} buttonOnPress={() => selectedClothesIds.length > 0 ? onSubmitWashClothes() : setConfirmationModalwash(true)} buttonLoading={loading} />
        </View>
      }

      <ConfirmationModal isOpen={confirmationModalwash} onRequestClose={() => setConfirmationModalwash(false)} onSubmit={onSubmitWashClothes} title="Lavar roupas" description="Todas suas roupas retornarão ao seu armário" buttonTitle="Confirmar" />
    </View>
  )
}