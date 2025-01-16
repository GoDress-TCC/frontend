import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions, ScrollView, BackHandler, Image } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
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
import Toast from 'react-native-toast-message';
import ConfirmationModal from '../components/modals/confirmationModal';

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
    const [editCatMode, setEditCatMode] = useState<boolean>(false);
    const [delCatConfirmationModal, setDelCatConfirmationModal] = useState<boolean>(false);
    const [delCat, setDelCat] = useState<string>("");
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

    useFocusEffect(React.useCallback(() => {
        const onBackAction = () => {
            if (editCatMode) {
                setEditCatMode(false);
                return true;
            }
            return false;
        }
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            onBackAction
        );

        return () => backHandler.remove();
    }, [editCatMode]));

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
                Toast.show({
                    type: "error",
                    text1: error.response.data.msg,
                    text2: "Tente novamente"
                })
                setModalOpen(false);
                reset();
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
        const catClothes = clothes.filter(item => item.catId.includes(cat));
        return catClothes.length;
    };

    const onSubmitDelCat = async (catId: string) => {
        setLoading(true);

        await Api.delete(`/cat/${catId}`)
            .then(response => {
                console.log(response.data);
                getCats();
                Toast.show({
                    type: "success",
                    text1: response.data.msg
                })
            })
            .catch(error => {
                console.log(error.response.data);
                Toast.show({
                    type: "error",
                    text1: error.response.data.msg,
                    text2: "Tente novamente"
                })
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const handleGenerateOutfitsRecommendation = async () => {
        await Api.post("/outfit/generate_outfit", {
            temperature: "current",
            location: "Itu",
        })
            .then(response => {
                setOutfitRecomendation(response.data.outfit);
            })
            .catch(error => {
                console.log(error.response.data.msg);
                Toast.show({
                    type: "error",
                    text1: "Erro ao gerar recomendação de outfit",
                    text2: "Tente novamente mais tarde",
                })
                return
            })
    };

    useEffect(() => {
        getCats();
        getUser();
        getClothes();
        getOutfits();
        getEvents();
        handleGenerateOutfitsRecommendation();
    }, []);

    useEffect(() => {
        outfitClothes();
    }, [clothes]);

    useEffect(() => {
        if (cats.length === 0) {
            setEditCatMode(false);
        }
    }, [cats]);

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

            {outfitRecomendation?.length > 0 &&
                <View style={{ gap: 10, marginVertical: 10 }}>
                    <Text style={globalStyles.subTitle}>Que tal esse outfit para hoje?</Text>

                    <View style={[globalStyles.styledContainer, { padding: 20, alignItems: "center", gap: 10 }]}>
                        <View style={{ flexDirection: "row", gap: 10 }}>
                            <Image source={{ uri: outfitRecomendation[0].image }} style={{ width: width * 0.4, height: width * 0.4 }} />
                            <Image source={{ uri: outfitRecomendation[1].image }} style={{ width: width * 0.4, height: width * 0.4 }} />
                        </View>
                        <Image source={{ uri: outfitRecomendation[2].image }} style={{ width: width * 0.4, height: width * 0.4 }} />
                    </View>
                </View>
            }

            <View style={[styles.functionContainer, { marginBottom: 100 }]}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 8, borderBottomWidth: 1, borderColor: globalColors.primary, }}>
                    <Text style={{ fontSize: 16, fontWeight: "500" }}>Minhas Categorias:</Text>
                    <View style={{ flexDirection: "row", gap: 10 }}>
                        <TouchableOpacity style={[styles.plusBnt, { backgroundColor: "gray" }]} onPress={() => { cats.length > 0 && setEditCatMode(!editCatMode) }}>
                            <FontAwesome5 name={editCatMode ? "times" : "pen"} size={14} color={'#fff'} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.plusBnt, { backgroundColor: globalColors.primary }]} onPress={() => { setModalOpen(true), reset() }}>
                            <FontAwesome5 name="plus" size={14} color={'#fff'} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ marginTop: 10, gap: editCatMode ? 25 : 15 }}>
                    {cats.length === 0 && <Text style={{ textAlign: "center" }}>Você não possui nenhuma categoria cadastrada</Text>}
                    {cats.map((category) => (
                        <View key={category._id}>
                            <TouchableOpacity onPress={() => { editCatMode ? {} : router.navigate(`/categories/${category._id}`) }} onLongPress={() => setEditCatMode(!editCatMode)} style={{ justifyContent: "space-between", flexDirection: "row", alignItems: "center" }}>
                                <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
                                    {editCatMode &&
                                        <View style={{ marginRight: 5 }}>
                                            <FontAwesome5 name="pen" size={16} color="gray" />
                                        </View>
                                    }
                                    <Text style={{ fontSize: 16, fontWeight: "400" }}>{category.name}</Text>
                                    {catClothesLength(category._id) > 0 && <Text style={{ fontWeight: "600", color: globalColors.primary }}>( {catClothesLength(category._id)} )</Text>}
                                </View>

                                {editCatMode ?
                                    <TouchableOpacity onPress={() => { catClothesLength(category._id) === 0 ? onSubmitDelCat(category._id) : setDelCatConfirmationModal(true), setDelCat(category._id) }}>
                                        <FontAwesome5 name="trash" size={16} color="red" />
                                    </TouchableOpacity>
                                    :
                                    <Ionicons name="chevron-forward" size={18} />
                                }
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

            <ConfirmationModal isOpen={delCatConfirmationModal} onRequestClose={() => setDelCatConfirmationModal(false)} onSubmit={() => { onSubmitDelCat(delCat), setDelCatConfirmationModal(false) }} title="Excluir categoria" color="red" description="Essa categoria já possui roupas cadastradas" buttonTitle="Excluir" />

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
        height: 30,
        width: 30,
        padding: 5,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center"
    }
});
