import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native'
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { Picker } from '@react-native-picker/picker';

import { MyButton } from '../components/button/button';
import { Clothing } from '@/src/services/types/types';
import { clothingStyle, clothingTemperature } from '@/src/services/local-data/dropDownData';
import { useCats } from '@/src/services/contexts/catsContext';
import Modal from '../components/modals/modal';
import Api from '@/src/services/api';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons'


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
        <Image
          source={{ uri: clothing.image }}
          style={styles.clothingImage}
        />
      ) : (
        <FontAwesome5 name="plus-circle" size={28} />
      )}
    </View>
  );
}

export default function Outfits() {
  const [clothes, setClothes] = useState<Clothing[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const { cats, getCats } = useCats();

  const form = useForm<FormData>({
    defaultValues: {
      clothingId: undefined,
      catId: "",
      style: "",
      temperature: "",
      fav: false
    }
  });

  const { handleSubmit, control, formState: { errors }, reset } = form;

  const generateOutfit: SubmitHandler<FormData> = async (data) => {
    await Api.post('/outfit/generate_outfit', {
      ...data
    })
      .then(response => {
        console.log(response.data)
        setClothes(response.data.outfit);
      })
      .catch(error => {
        console.log(error.response.data)
      });
  };

  useEffect(() => {
    getCats();
  }, []);

  const upperBody = clothes.find(item => item.type === 'upperBody') || null;
  const lowerBody = clothes.find(item => item.type === 'lowerBody') || null;
  const footwear = clothes.find(item => item.type === 'footwear') || null;

  return (
    <View style={styles.container}>
      <View style={{ width: "100%", flexDirection: "row", alignItems: "center" }}>
        <Text style={[styles.title, { flex: 1, textAlign: "center" }]}>Outfits</Text>
        <TouchableOpacity onPress={() => { setModalOpen(true) }} style={{ position: "absolute", right: 0 }}>
          <Ionicons name="options" size={28} color={"#000"} />
        </TouchableOpacity>
      </View>

      <View style={{ backgroundColor: "#fff", padding: 5, borderRadius: 10, flexDirection: "column", gap: 5, alignItems: "center" }}>
        <TouchableOpacity style={styles.clothingContainer}>
          {outfitClothing(upperBody)}
        </TouchableOpacity>

        <TouchableOpacity style={styles.clothingContainer}>
          {outfitClothing(lowerBody)}
        </TouchableOpacity>

        <TouchableOpacity style={styles.clothingContainer}>
          {outfitClothing(footwear)}
        </TouchableOpacity>
      </View>

      <View style={{ width: "100%", gap: 10 }}>
        <MyButton title={"Gerar outfit"} onPress={handleSubmit(generateOutfit)} loading={false} />
        <MyButton title={"Salvar outfit"} onPress={() => console.log("maneiro")} loading={false} />
      </View>

      <Modal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)}>
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

        </View>
      </Modal>
    </View>
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
  title: {
    fontWeight: "500",
    fontSize: 22,
  },
  clothingContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: width * 0.4,
    width: width * 0.4,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
  },
  clothingImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
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
  }
});