import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Clothing } from '@/src/services/types/types';
import { useCats } from '@/src/services/contexts/catsContext';
import { useUser } from '@/src/services/contexts/userContext';
import { useOutfits } from '@/src/services/contexts/outfitsContext';
import Modal from '../components/modals/modal';
import Api from '@/src/services/api';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MyButton from '../components/button/button';
import { globalColors, globalStyles } from '@/src/styles/global';
import { useClothes } from '@/src/services/contexts/clothesContext';
import Fonts from '@/src/services/utils/Fonts';
import { useEvents } from '@/src/services/contexts/eventsContext';
import { Ionicons } from '@expo/vector-icons';

type FormData = {
    name: string;
};

const addCatSchema = yup.object({
    name: yup.string().required('Nome é obrigatório')
}).required();

const { width } = Dimensions.get('window');

export default function Home() {
    // modals
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    // buttons
    const [showGenerateOutfitButton, setShowGenerateOutfitButton] = useState<boolean>(false);
    const [neededClothes, setNeededClothes] = useState<number>(3);
    const [upperBody, setUpperBody] = useState<Clothing[]>([]);
    const [lowerBody, setLowerBody] = useState<Clothing[]>([]);
    const [footwear, setFootwear] = useState<Clothing[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [outfitRecomendation, setOutfitRecomendation] = useState<Clothing[]>([]);

    const { cats, getCats } = useCats();
    const { user, getUser } = useUser();
    const { clothes, getClothes } = useClothes();
    const { getOutfits } = useOutfits();
    const { getEvents } = useEvents();

    const form = useForm<FormData>({
        defaultValues: {
            name: ""
        },
        resolver: yupResolver(addCatSchema),
    });

    const { handleSubmit, control, formState: { errors }, reset } = form;

    const onSubmitCreateCat: SubmitHandler<FormData> = async (data) => {
        setLoading(true);

        await Api.post('/cat', data)
            .then(response => {
                console.log(response.data);
                setModalOpen(false);
                getCats();
                reset();
            })
            .catch(error => {
                console.log(error.response.data);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const outfitClothes = () => {
        if (clothes.length > 0) {
            const filteredUpperBody = clothes.filter(item => item.type === "upperBody");
            const filteredLowerBody = clothes.filter(item => item.type === "lowerBody");
            const filteredFootwear = clothes.filter(item => item.type === "footwear");

            setUpperBody(filteredUpperBody);
            setLowerBody(filteredLowerBody);
            setFootwear(filteredFootwear);

            const remainingClothes = 3 - (filteredUpperBody.length > 0 ? 1 : 0) - (filteredLowerBody.length > 0 ? 1 : 0) - (filteredFootwear.length > 0 ? 1 : 0);
            setNeededClothes(remainingClothes);

            if (filteredUpperBody.length > 0 && filteredLowerBody.length > 0 && filteredFootwear.length > 0) {
                setShowGenerateOutfitButton(true);
            } else {
                setShowGenerateOutfitButton(false)
            }
        }
    };

    const catClothesLength = (cat: string) => {
        const catClothes = clothes.filter(item => item.catId === cat);
        return catClothes.length;
    };

    useEffect(() => {
        getCats();
        getUser();
        getClothes();
        getOutfits();
        getEvents();
    }, []);

    useEffect(() => {
        outfitClothes();
    }, [clothes]);

    const check = () => {
        return (
            <>
                <MaterialIcons name="check-circle" color={globalColors.primary} size={22} style={{ position: "absolute", right: 1, bottom: 1, backgroundColor: "#fff", borderRadius: 100 }} />
            </>
        )
    }

    return (
        <ScrollView style={globalStyles.globalContainer}>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
                <View style={{ flexDirection: "row" }}>
                    <Text style={globalStyles.mainTitle}>Olá, </Text>
                    <Text style={globalStyles.mainTitle}>{user?.name ? user.name : "..."} </Text>
                    <Text style={globalStyles.mainTitle}>{user?.surname ? user.surname : "..."}</Text>
                </View>
            </View>

            <View style={{ marginVertical: 20 }}>
                {showGenerateOutfitButton === false ?
                    <View>
                        <Text style={{ textAlign: "center" }}>Adicione mais {neededClothes} {neededClothes < 2 ? "peça" : "peças"} de roupa para gerar combinações incríveis</Text>

                        <View style={{ flexDirection: "row", marginVertical: 20, gap: 10, justifyContent: "space-between" }}>
                            <View style={styles.boxTop}>
                                <FontAwesome5 name="tshirt" size={width * 0.3} />
                                <Text>Parte Superior</Text>
                                {upperBody.length > 0 && check()}
                            </View>
                            <View style={styles.boxTop}>
                                <FontAwesome5 name="tshirt" size={width * 0.3} />
                                <Text>Parte Inferior</Text>
                                {lowerBody.length > 0 && check()}
                            </View>
                        </View>
                        <View style={styles.boxLower}>
                            <FontAwesome5 name="tshirt" size={width * 0.3} />
                            <Text>Calçados</Text>
                            {footwear.length > 0 && check()}
                        </View>
                    </View>
                    :
                    <View>
                        <MyButton title="Criar Outfit" onPress={() => router.navigate("/outfits/generateOutfit")} />
                    </View>
                }
            </View>

            <View style={styles.functionContainer}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 8, borderBottomWidth: 1, borderColor: globalColors.primary, }}>
                    <Text style={{ fontSize: 16, fontWeight: "500" }}>Minhas Categorias:</Text>
                    <TouchableOpacity style={styles.plusBnt} onPress={() => { setModalOpen(true), reset() }}>
                        <FontAwesome5 name="plus" size={14} color={'#fff'} />
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 10, gap: 15 }}>
                    {cats.map((category) => (
                        <View key={category._id}>
                            <TouchableOpacity onPress={() => { router.navigate(`/categories/${category._id}`) }} style={{ justifyContent: "space-between", flexDirection: "row" }}>
                                <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
                                    <Text style={{ fontSize: 16, fontWeight: "400" }}>{category.name}</Text>
                                    {catClothesLength(category._id) > 0 && <Text style={{ fontWeight: "600", color: globalColors.primary }}>( {catClothesLength(category._id)} )</Text>}
                                </View>
                                <Ionicons name="chevron-forward" size={18} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                <Modal isOpen={modalOpen} withInput={true} onRequestClose={() => { setModalOpen(false) }}>
                    <View style={{ width: width * 0.9 }}>
                        <View style={styles.modalContent}>
                            <Text style={{ fontSize: 16, fontFamily: Fonts['montserrat-bold'], }}>Adicionar Categoria</Text>

                            <Controller
                                control={control}
                                name="name"
                                render={({ field: { value, onChange } }) => (
                                    <>
                                        <TextInput
                                            style={styles.input}
                                            onChangeText={(text) => { onChange(text) }}
                                            placeholder="Nome"
                                            value={value}
                                            autoCapitalize="words"
                                        />
                                        {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}
                                    </>
                                )}
                            />

                            <View style={{ marginTop: 10, gap: 10 }}>
                                <MyButton title='Criar' onPress={handleSubmit(onSubmitCreateCat)} loading={loading} />
                                <MyButton title='Cancelar' onPress={() => { setModalOpen(false) }} color='gray' />
                            </View>
                        </View>
                    </View>
                </Modal>

                <View style={{ marginTop: 16, gap: 10 }} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({

    title: {
        fontWeight: "500",
        fontSize: 22
    },
    text: {
        fontWeight: "400",
        fontSize: 20,
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 10,
        gap: 10,
        padding: 20,
    },
    modalScreenContent: {
        backgroundColor: "#fff",
        width: "100%",
        height: "95%",
        paddingTop: 40,
        borderRadius: 10,
        gap: 10
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    textButton: {
        color: "#fff",
        fontWeight: "500"
    },
    error: {
        color: 'red',
        alignSelf: 'center',
        fontSize: 10,
        fontWeight: "500"
    },
    functionContainer: {
        backgroundColor: "#fff",
        padding: 10,
        marginTop: 20,
        borderRadius: 10,
        gap: 5,
        borderWidth: 1,
        borderColor: globalColors.primary,
        borderBottomWidth: 8
    },
    boxTop: {
        borderLeftWidth: 10,
        borderBottomWidth: 10,
        borderWidth: 1.5,
        borderColor: globalColors.primary,
        padding: 5,
        borderRadius: 22,
        alignItems: "center"
    },
    boxLower: {
        borderLeftWidth: 10,
        borderBottomWidth: 10,
        borderWidth: 1.5,
        borderColor: globalColors.primary,
        padding: 5,
        borderRadius: 22,
        alignItems: "center"
    },

    plusBnt: {
        backgroundColor: globalColors.primary,
        height: 30,
        width: 30,
        padding: 5,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center"
    }
});
