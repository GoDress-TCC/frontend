import React from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

import { MyButton } from '../components/button/button';
import { Clothing } from '@/src/services/types/types';
import Api from '@/src/services/api';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const { width } = Dimensions.get('window');

type FormData = {
  clothingId?: Array<string>,
  catId?: string,
  style?: string,
  temperature?: string,
  fav: boolean
};

const outfitClothing = (type: string) => {
  return (
    <View>

    </View>
  );
}

export default function Outfits() {

  const form = useForm<FormData>({
    defaultValues: {
      clothingId: [""],
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
        })
        .catch(error => {
          console.log(error.response.data)
        });

};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Outfits</Text>

      <View style={{ width: width * 0.7, backgroundColor: "#fff", padding: 5, borderRadius: 10, flexDirection: "column", gap: 5 }}>
        <TouchableOpacity style={styles.clothingContainer}>
          <FontAwesome5 name="plus-circle" size={28} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.clothingContainer}>

        </TouchableOpacity>

        <TouchableOpacity style={styles.clothingContainer}>

        </TouchableOpacity>
      </View>

      <View style={{ width: "100%", gap: 10 }}>
        <MyButton title={"Gerar outfit"} onPress={handleSubmit(generateOutfit)} />
        <MyButton title={"Salvar outfit"} onPress={() => console.log("maneiro")} />
      </View>
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
  },
});