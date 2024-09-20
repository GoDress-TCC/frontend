import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ImageBackground } from 'react-native'
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import Checkbox from 'expo-checkbox';

import { MyButton } from '../components/button/button';
import { Clothing } from '@/src/services/types/types';
import { clothingStyle, clothingTemperature } from '@/src/services/local-data/dropDownData';
import { useCats } from '@/src/services/contexts/catsContext';
import { useClothes } from '@/src/services/contexts/clothesContext';
import { globalColors } from '@/src/styles/global';
import Modal from '../components/modals/modal';
import Api from '@/src/services/api';

import { FontAwesome, Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import ModalScreen from '../components/modals/modalScreen';
import { ClothesList } from '../components/flatLists/clothesList';

const { width } = Dimensions.get('window');

type FormData = {
  clothingId?: Array<string>,
  catId?: string,
  style?: string,
  temperature?: string,
  fav: boolean
};

const outfitClothing = (clothing: Clothing | null) => {
  return (
    <View style={styles.clothingContainer}>
      {clothing ? (
        <ImageBackground source={{ uri: clothing.image }} style={styles.clothingImage}>
          {clothing.fav === true && <MaterialIcons name="favorite" color="red" size={16} style={{ marginRight: 5, marginBottom: 5 }} />}
        </ImageBackground>
      ) : (
        <FontAwesome5 name="plus-circle" size={28} />
      )}
    </View>
  );
}

export default function Outfits() {
  const [outfitClothes, setOutfitClothes] = useState<Clothing[] | undefined>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openSelectClothing, setOpenSelectClothing] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<string>('');

  const { cats, getCats } = useCats();
  const { clothes, getClothes, selectedClothingId } = useClothes();

  const form = useForm<FormData>({
    defaultValues: {
      clothingId: undefined,
      catId: "",
      style: "",
      temperature: "",
      fav: false
    }
  });

  const { handleSubmit, control, formState: { errors }, reset, setValue } = form;

  const generateOutfit: SubmitHandler<FormData> = async (data) => {
    await Api.post('/outfit/generate_outfit', {
      ...data
    })
      .then(response => {
        console.log(response.data)
        setOutfitClothes(response.data.outfit);
      })
      .catch(error => {
        console.log(error.response.data)
        Toast.show({
          type: 'error',
          text1: error.response.data.msg,
          text2: 'Tente novamente'
        });
      });
  };

  useEffect(() => {
    getCats();
    getClothes();
  }, []);

  useEffect(() => {
    if (selectedClothingId) {
      setOpenSelectClothing(false)
    }
  }, [selectedClothingId]);

  const upperBody = outfitClothes?.find(item => item.type === 'upperBody') || null;
  const lowerBody = outfitClothes?.find(item => item.type === 'lowerBody') || null;
  const footwear = outfitClothes?.find(item => item.type === 'footwear') || null;

  const resetOutfit = () => {
    reset();
    setOutfitClothes(undefined);
    Toast.show({
      type: "info",
      text1: "Outfit resetado",
      text2: "Todos os filtros e roupas foram resetados"
    })
  }

  return (
    <View style={styles.container}>
      <View style={{ width: "100%", flexDirection: "row", alignItems: "center" }}>
        <Text style={[styles.title, { flex: 1, textAlign: "center" }]}>Outfits</Text>
        <View style={{ position: "absolute", right: 0, flexDirection: "column", alignItems: "center", alignSelf: "flex-start" }}>
          <TouchableOpacity onPress={() => { setOpenModal(true) }} style={{ marginBottom: 10 }}>
            <Ionicons name="options" size={28} color={"#000"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { console.log('maneiro') }} style={{ marginBottom: 30 }}>
            <FontAwesome name='bookmark' size={28} color={"#000"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { resetOutfit() }}>
            <FontAwesome5 name='trash' size={24} color={"#000"} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.containfit}>
        <TouchableOpacity onPress={() => { setSelectedType('upperBody'); setOpenSelectClothing(true); }}>{outfitClothing(upperBody)}</TouchableOpacity>
        <TouchableOpacity onPress={() => { setSelectedType('lowerBody'); setOpenSelectClothing(true); }}>{outfitClothing(lowerBody)}</TouchableOpacity>
        <TouchableOpacity onPress={() => { setSelectedType('footwear'); setOpenSelectClothing(true); }}>{outfitClothing(footwear)}</TouchableOpacity>
      </View>

      <View style={{ width: "100%", gap: 10 }}>
        <MyButton title={"Gerar outfit"} onPress={handleSubmit(generateOutfit)} />
        <MyButton title={"Salvar outfit"} onPress={() => console.log("maneiro")} />
      </View>

      <Modal isOpen={openModal} onRequestClose={() => setOpenModal(false)}>
        <View style={styles.modalContent}>

          <Controller
            control={control}
            name="style"
            render={({ field: { value, onChange } }) => (
              <View>
                <View style={styles.pickerContainer}>
                  <Picker
                    style={styles.picker}
                    selectedValue={value}
                    onValueChange={(itemValue) => onChange(itemValue)}
                  >
                    <Picker.Item label="Estilo" value="" />
                    {clothingStyle.map(item => (
                      <Picker.Item key={item.value} label={item.label} value={item.value} />
                    ))}
                  </Picker>
                </View>
              </View>
            )}
          />

          <Controller
            control={control}
            name="temperature"
            render={({ field: { value, onChange } }) => (
              <View>
                <View style={styles.pickerContainer}>
                  <Picker
                    style={styles.picker}
                    selectedValue={value}
                    onValueChange={(itemValue) => onChange(itemValue)}
                  >
                    <Picker.Item label="Temperatura" value="" />
                    {clothingTemperature.map(item => (
                      <Picker.Item key={item.value} label={item.label} value={item.value} />
                    ))}
                  </Picker>
                </View>
              </View>
            )}
          />

          <Controller
            control={control}
            name="catId"
            render={({ field: { onChange, value } }) => (
              <View>
                <View style={styles.pickerContainer}>
                  <Picker
                    style={styles.picker}
                    selectedValue={value}
                    onValueChange={(itemValue) => onChange(itemValue)}
                  >
                    <Picker.Item label="Categoria" value="" />
                    {cats.map(item => (
                      <Picker.Item key={item._id} label={item.name} value={item._id} />
                    ))}
                  </Picker>
                </View>
              </View>
            )}
          />

          <Controller
            control={control}
            name="fav"
            render={({ field: { onChange, value } }) => (
              <View style={{ flexDirection: "row", gap: 5, marginTop: 10 }}>
                <Checkbox
                  value={!!value}
                  onValueChange={(itemValue) => onChange(itemValue)}
                  color={value === true ? globalColors.primary : undefined}
                />
                <Text>Usar apenas roupas favoritas</Text>
              </View>
            )}
          />

        </View>
      </Modal>

      <ModalScreen isOpen={openSelectClothing} onRequestClose={() => setOpenSelectClothing(false)}>
        <View style={styles.modalScreenContent}>
          <Text style={[styles.title, { textAlign: "center" }]}>{selectedType}</Text>
          <ClothesList clothes={clothes} typeFilter={selectedType} canPick={true} />
        </View>
      </ModalScreen>
    </View >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "space-between"
  },

  containfit: {
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 10,
    flexDirection: "column",
    gap: 5,
    alignItems: "center",
    borderColor:globalColors.primary,
    borderLeftWidth:8,
    borderBottomWidth:8,
  },

  title: {
    fontWeight: "500",
    fontSize: 22,
  },
  clothingContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: width * 0.4,
    width: width * 0.4,
    overflow: 'hidden',
  },
  clothingImage: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
    alignItems: 'flex-end',
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    gap: 10,
    padding: 20,
    width: width * 0.8,
    height: width * 0.8,
    justifyContent: "center"
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    height: 70
  },
  picker: {
    width: "100%",
    height: "100%"
  },
  modalScreenContent: {
    backgroundColor: "#fff",
    width: "100%",
    height: "95%",
    paddingTop: 40,
    borderRadius: 10,
    gap: 10
  },
});