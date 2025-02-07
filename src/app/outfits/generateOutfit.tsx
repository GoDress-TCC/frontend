import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ImageBackground, ScrollView, TextInput } from 'react-native'
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import Checkbox from 'expo-checkbox';
import * as yup from "yup"

import MyButton from '../components/button/button';
import { Clothing } from '@/src/services/types/types';
import { clothingHour, clothingStyle, clothingTemperature } from '@/src/services/local-data/pickerData';
import { useCats } from '@/src/services/contexts/catsContext';
import { useClothes } from '@/src/services/contexts/clothesContext';
import { globalColors, globalStyles } from '@/src/styles/global';
import Modal from '../components/modals/modal';
import Api from '@/src/services/api';

import { FontAwesome, Ionicons, FontAwesome5, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import ModalScreen from '../components/modals/modalScreen';
import ClothesList from '../components/flatLists/clothesList';
import { router } from 'expo-router';
import MainHeader from '../components/headers/mainHeader';
import { useOutfits } from '@/src/services/contexts/outfitsContext';

const { width } = Dimensions.get('window');

type FormData = {
  clothingId?: Array<string | undefined>,
  catId?: string,
  name?: string,
  style?: string,
  temperature?: string,
  fav?: boolean,
  useDirtyClothes?: boolean,
  hour?: string
};

export default function generateOutfits() {
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [openSelectClothing, setOpenSelectClothing] = useState<boolean>(false);
  const [openSaveClothing, setOpenSaveClothing] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const [upperBody, setUpperBody] = useState<Clothing | undefined>(undefined);
  const [lowerBody, setLowerBody] = useState<Clothing | undefined>(undefined);
  const [footwear, setFootwear] = useState<Clothing | undefined>(undefined);

  const { cats, getCats } = useCats();
  const { clothes, getClothes, selectedClothingId, setSelectedClothingId } = useClothes();
  const { getOutfits } = useOutfits();

  const form = useForm<FormData>({
    defaultValues: {
      clothingId: [],
      catId: "",
      name: "",
      style: "",
      temperature: "",
      fav: false,
      useDirtyClothes: false,
      hour: ""
    },
  });

  const { handleSubmit, control, reset, setValue, getValues, watch } = form;

  const generateOutfit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);

    await Api.post('/outfit/generate_outfit', {
      ...data
    })
      .then(response => {
        console.log(response.data);

        const upperBody = response.data.outfit.find((item: { type: string }) => item.type === "upperBody") || undefined;
        const lowerBody = response.data.outfit.find((item: { type: string }) => item.type === "lowerBody") || undefined;
        const footwear = response.data.outfit.find((item: { type: string }) => item.type === "footwear") || undefined;

        setUpperBody(upperBody);
        setLowerBody(lowerBody);
        setFootwear(footwear);
      })
      .catch(error => {
        console.log(error.response.data)
        Toast.show({
          type: 'error',
          text1: error.response.data.msg === "Não foi possível completar o outfit, peças insuficientes" ? "Não foi possível completar o outfit" : error.response.data.msg,
          text2: error.response.data.msg === "Não foi possível completar o outfit, peças insuficientes" ? "Peças insuficientes" : "Tente novamente"
        });
      })
      .finally(() => {
        setLoading(false)
      })
  };

  const handleOpenSaveOutfit = () => {
    let clothingIds = [upperBody, lowerBody, footwear];

    const filteredClothingIds = Array.isArray(clothingIds)
      ? clothingIds.filter(id => id !== undefined && id !== null)
      : [];

    if (filteredClothingIds.length < 3) {
      Toast.show({
        type: 'error',
        text1: 'O outfit deve conter 3 peças de roupa',
        text2: 'Adicione mais roupas ao seu armário'
      });
    } else {
      setOpenSaveClothing(true)
    }

  }

  const onSubmitSaveOutfit: SubmitHandler<FormData> = async (data) => {
    setSaveLoading(true);

    if (!data.catId) { delete data.catId };

    await Api.post('/outfit', {
      ...data,
      clothingId: [upperBody?._id, lowerBody?._id, footwear?._id]
    })
      .then(response => {
        console.log(response.data);
        reset();
        setUpperBody(undefined);
        setLowerBody(undefined);
        setFootwear(undefined);
        setSelectedClothingId(undefined);
        getOutfits();
      })
      .catch(error => {
        setOpenSaveClothing(false)
        console.log(error.response.data)
        Toast.show({
          type: 'error',
          text1: error.response.data.msg,
          text2: 'Tente novamente'
        });
      })
      .finally(() => {
        setSaveLoading(false);
        setOpenSaveClothing(false);
        router.navigate('/outfits/outfits');
      });
  };

  useEffect(() => {
    getCats();
    getClothes();
  }, []);

  useEffect(() => {
    if (selectedType) {
      const selectedClothing = clothes.find(item => item._id === selectedClothingId);

      const currentClothingIds = getValues('clothingId') as (string | undefined)[];

      if (selectedType === 'upperBody') {
        if (selectedClothingId !== undefined) {
          setUpperBody(selectedClothing);
        }
        currentClothingIds[0] = selectedClothing?._id || undefined;
      } else if (selectedType === 'lowerBody') {
        if (selectedClothingId !== undefined) {
          setLowerBody(selectedClothing);
        }
        currentClothingIds[1] = selectedClothing?._id || undefined;
      } else if (selectedType === 'footwear') {
        if (selectedClothingId !== undefined) {
          setFootwear(selectedClothing);
        }
        currentClothingIds[2] = selectedClothing?._id || undefined;
      }

      setValue('clothingId', [...currentClothingIds]);

      setOpenSelectClothing(false)
    }
  }, [selectedClothingId, clothes]);

  const resetOutfit = () => {
    reset();
    setUpperBody(undefined);
    setLowerBody(undefined);
    setFootwear(undefined);
    setSelectedClothingId(undefined);
    Toast.show({
      type: "success",
      text1: "Outfit resetado",
      text2: "Todos os filtros e roupas foram resetados"
    })
  }

  const outfitClothing = (clothing: Clothing | undefined, clothingIndex: number, saving: boolean) => {
    const clothingIds = (getValues('clothingId') as string[]);

    return (
      <View style={styles.clothingContainer}>
        {clothing ? (
          <ImageBackground source={{ uri: clothing.image }} style={[styles.clothingImage, clothing.dirty && { borderWidth: 2, borderColor: globalColors.dirtyGreen }]}>
            {saving === false && (
              <View style={{ flex: 1 }}>
                <View style={{ position: "absolute", right: 5, bottom: 5 }}>
                  {clothing.fav &&
                    <MaterialIcons
                      name="favorite"
                      color="red"
                      size={16}
                    />
                  }
                  {clothing.dirty &&
                    <MaterialCommunityIcons
                      name="washing-machine"
                      size={16}
                      style={{ backgroundColor: "#fff", borderRadius: 4 }}
                    />
                  }
                </View>

                <View style={{ position: "absolute", right: 3, top: 3 }}>
                  <FontAwesome5
                    name={clothingIds[clothingIndex] !== undefined ? "lock" : "unlock"}
                    size={16}
                    color={globalColors.primary}
                    style={{ backgroundColor: "#fff", borderRadius: 4, padding: 2 }}
                  />
                </View>
              </View>
            )}

          </ImageBackground>
        ) : (
          <FontAwesome5 name="plus-circle" size={28} />
        )
        }
      </View >
    );
  }

  return (
    <View style={[globalStyles.globalContainer, { justifyContent: "space-between" }]}>
      <MainHeader title='Gerar Outfit' backButton={true} />

      <View style={{ flexDirection: "row", width: "100%", justifyContent: "center" }}>
        <View style={globalStyles.styledContainer}>
          <TouchableOpacity onPress={() => { setSelectedType('upperBody'); setOpenSelectClothing(true); }}>
            {outfitClothing(upperBody, 0, false)}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setSelectedType('lowerBody'); setOpenSelectClothing(true); }}>
            {outfitClothing(lowerBody, 1, false)}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setSelectedType('footwear'); setOpenSelectClothing(true); }}>
            {outfitClothing(footwear, 2, false)}
          </TouchableOpacity>
        </View>

        <View style={{ position: "absolute", right: 0, alignItems: "center" }}>
          <TouchableOpacity onPress={() => setOpenFilter(true)} style={{ marginBottom: 10 }}>
            <Ionicons name="options" size={28} color={"#000"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.navigate("/outfits/outfits")} style={{ marginBottom: 30 }}>
            <FontAwesome name='bookmark' size={28} color={"#000"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => resetOutfit()}>
            <FontAwesome5 name='trash' size={24} color={"#000"} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ width: "100%", gap: 10 }}>
        <MyButton title={"Gerar outfit"} icon="dice" borderButton onPress={handleSubmit(generateOutfit)} loading={loading} />
        <MyButton title={"Salvar outfit"} onPress={handleOpenSaveOutfit} />
      </View>

      <Modal isOpen={openFilter} onRequestClose={() => setOpenFilter(false)}>
        <View style={styles.modalContent}>
          <View style={{ flexDirection: 'row', width: '100%', marginVertical: 10, }}>
            <Ionicons name="chevron-back" size={30} color="#593C9D" onPress={() => setOpenFilter(false)} />

            <Text style={styles.titleModal}>Filtros</Text>
          </View>

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
            name="hour"
            render={({ field: { onChange, value } }) => (
              <View>
                <View style={styles.pickerContainer}>
                  <Picker
                    style={styles.picker}
                    selectedValue={value}
                    onValueChange={(itemValue) => onChange(itemValue)}
                  >
                    <Picker.Item label="Horário" value="" />
                    {clothingHour.map(item => (
                      <Picker.Item key={item.value} label={item.label} value={item.value} />
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

          <Controller
            control={control}
            name="useDirtyClothes"
            render={({ field: { onChange, value } }) => (
              <View style={{ flexDirection: "row", gap: 5, marginTop: 10 }}>
                <Checkbox
                  value={!!value}
                  onValueChange={(itemValue) => onChange(itemValue)}
                  color={value === true ? globalColors.primary : undefined}
                />
                <Text>Usar roupas sujas</Text>
              </View>
            )}
          />

        </View>
      </Modal>

      <ModalScreen isOpen={openSelectClothing} onRequestClose={() => setOpenSelectClothing(false)}>
        <View style={styles.modalScreenContent}>
          <View style={{ flexDirection: "row", marginHorizontal: 20, justifyContent: "center" }}>
            <TouchableOpacity onPress={() => { setOpenSelectClothing(false) }} style={{ position: "absolute", left: 0 }}>
              <Ionicons name="chevron-back" size={26} />
            </TouchableOpacity>

            <Text style={[globalStyles.subTitle, { textAlign: "center" }]}>{
              selectedType === "upperBody" && "Parte superior"
              ||
              selectedType === "lowerBody" && "Parte inferior"
              ||
              selectedType === "footwear" && "Calçado"
            }</Text>
          </View>

          <ClothesList clothes={clothes} typeFilter={selectedType} canPick={true} clothingBg={globalColors.secundary} pickParam={getValues('clothingId')} />
        </View>
      </ModalScreen>

      <ModalScreen isOpen={openSaveClothing} onRequestClose={() => setOpenSaveClothing(false)} withInput={true}>
        <View style={[styles.modalScreenContent, { paddingHorizontal: 20 }]}>
          <View style={{ flexDirection: "row", marginHorizontal: 20, justifyContent: "center" }}>
            <TouchableOpacity onPress={() => { setOpenSaveClothing(false) }} style={{ position: "absolute", left: 0 }}>
              <Ionicons name="chevron-back" size={26} />
            </TouchableOpacity>

            <Text style={globalStyles.subTitle}>Salvar outfit</Text>
          </View>

          <ScrollView>
            <View style={[globalStyles.styledContainer, { marginTop: 20 }]}>
              {outfitClothing(upperBody, 0, true)}
              {outfitClothing(lowerBody, 1, true)}
              {outfitClothing(footwear, 2, true)}
            </View>

            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <>
                  <View style={[styles.inputarea, { marginTop: 20 }]}>
                    <TextInput
                      style={styles.input}
                      onChangeText={onChange}
                      placeholder="Nome"
                      value={value}
                      autoCapitalize="words"
                    />
                  </View >
                </>
              )}
            />
          </ScrollView>

          <View style={{ paddingBottom: 20 }}>
            <MyButton title='Salvar' onPress={handleSubmit(onSubmitSaveOutfit)} disabled={watch("name") === "" ? true : false} loading={saveLoading} />
          </View>
        </View>
      </ModalScreen>
    </View >
  )
}

const styles = StyleSheet.create({
  title: {
    fontWeight: "500",
    fontSize: 22,
    textAlign: "center"
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
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    gap: 10,
    padding: 20,
    width: width * 0.8,
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
    gap: 10,
  },
  inputarea: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#fff",
    padding: 10,
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: globalColors.primary,
    justifyContent: 'space-between',

  },
  input: {
    fontSize: 16,
    flexDirection: 'row',
    width: '90%',
  },

  titleModal: {
    marginLeft: 10,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },

});