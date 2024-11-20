import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions, VirtualizedList } from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Clothing } from '@/src/services/types/types';
import { useCats } from '@/src/services/contexts/catsContext';
import { useUser } from '@/src/services/contexts/userContext';
import Modal from '../components/modals/modal';
import ModalScreen from '../components/modals/modalScreen';
import ClothesList from '../components/flatLists/clothesList';
import Api from '@/src/services/api';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MyButton from '../components/button/button';
import { globalColors, globalStyles } from '@/src/styles/global';
import { useClothes } from '@/src/services/contexts/clothesContext';
import Fonts from '@/src/services/utils/Fonts';

type FormData = {
    name: string;
};

const addCatSchema = yup.object({
    name: yup.string().required('Nome é obrigatório')
}).required();

const { width } = Dimensions.get('window');

export default function Home() {
    // getCatClothes
    const [catClothes, setCatClothes] = useState<Clothing[]>([]);

    // modals
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [catScreenOpen, setCatScreenOpen] = useState<boolean>(false);
    const [openCatId, setOpenCatId] = useState<string | null>(null);

    // buttons
    const [showUpdateCatButton, setShowUpdateCatButton] = useState<string>("");
    const [showGenerateOutfitButton, setShowGenerateOutfitButton] = useState<boolean>(false);
    const [neededClothes, setNeededClothes] = useState<number>(3);
    const [upperBody, setUpperBody] = useState<Clothing[]>([]);
    const [lowerBody, setLowerBody] = useState<Clothing[]>([]);
    const [footwear, setFootwear] = useState<Clothing[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const { cats, getCats } = useCats();
    const { user, getUser } = useUser();
    const { clothes, getClothes } = useClothes();

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

    const onSubmitUpdateCat: SubmitHandler<FormData> = async (data) => {
        setLoading(true);

        await Api.put(`/cat/${openCatId}`, data)
            .then(response => {
                console.log(response.data);
                setCatScreenOpen(false);
                getCats();
            })
            .catch(error => {
                console.log(error.response.data);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const delCat = async () => {
        await Api.delete(`/cat/${openCatId}`)
            .then(response => {
                console.log(response.data);
                setCatScreenOpen(false);
                getCats();
            })
            .catch(error => {
                console.log(error.response.data);
            });
    };

    const getCatClothes = async () => {
        await Api.get(`/clothing/${openCatId}`)
            .then(response => {
                setCatClothes(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.log(error.response.data);
            })
    };

    const handleOpenCat = (id: string) => {
        setOpenCatId(id);
        setCatScreenOpen(true);
        setShowUpdateCatButton("");
    };

    const handleCloseCat = () => {
        setCatScreenOpen(false),
            setOpenCatId(null)
    };

    const outfitClothes = () => {
        const filteredUpperBody = clothes.filter(item => item.type === "upperBody");
        const filteredLowerBody = clothes.filter(item => item.type === "lowerBody");
        const filteredFootwear = clothes.filter(item => item.type === "footwear");

        setUpperBody(filteredUpperBody);
        setLowerBody(filteredLowerBody);
        setFootwear(filteredFootwear);

        const remainingClothes = 3 - (filteredUpperBody.length > 0 ? 1 : 0) - (filteredLowerBody.length > 0 ? 1 : 0) - (filteredFootwear.length > 0 ? 1 : 0);
        setNeededClothes(remainingClothes);

        if (upperBody.length > 0 && lowerBody.length > 0 && footwear.length > 0) {
            setShowGenerateOutfitButton(true);
        } else {
            setShowGenerateOutfitButton(false)
        }
    };

    useEffect(() => {
        getCats();
        getUser();
        getClothes();
    }, []);

    useEffect(() => {
        if (openCatId) {
            getCatClothes();
        }
    }, [openCatId]);

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
        <View style={globalStyles.containerGlobal}>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
                <View style={{ flexDirection: "row" }}>
                    <Text style={styles.title}>Olá, </Text>
                    <Text style={styles.title}>{user?.name ? user.name : "..."} </Text>
                    <Text style={styles.title}>{user?.surname ? user.surname : "..."}</Text>
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
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom:8, borderBottomWidth:1, borderColor:globalColors.primary, }}>
                    <Text style={{ fontSize: 16, fontWeight: "500" }}>Minhas Categorias:</Text>
                    <TouchableOpacity style={styles.plusBnt}  onPress={() => { setModalOpen(true), reset() }}>
                        <FontAwesome5 name="plus" size={14} color={'#fff'} />
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 10, gap: 10 }}>
                    {cats.map((category) => (
                        <View key={category._id}>
                            <TouchableOpacity onPress={() => { handleOpenCat(category._id) }}>
                                <Text style={{ fontSize: 16, fontWeight: "400" }}>{category.name}</Text>
                            </TouchableOpacity>

                            {openCatId === category._id && (
                                <ModalScreen isOpen={catScreenOpen} onRequestClose={handleCloseCat}>
                                    <View style={styles.modalScreenContent}>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", paddingHorizontal: 20 }}>
                                            <TouchableOpacity onPress={handleCloseCat}>
                                                <FontAwesome5 name="arrow-left" size={18} />
                                            </TouchableOpacity>
                                            <Controller
                                                control={control}
                                                name="name"
                                                render={({ field: { onChange } }) => (
                                                    <>
                                                        <TextInput
                                                            style={{ textAlign: "center", fontSize: 18, fontWeight: "500" }}
                                                            onChangeText={(text) => { onChange(text), setShowUpdateCatButton(text) }}
                                                            defaultValue={category.name}
                                                            autoCapitalize="none"
                                                        />
                                                    </>
                                                )}
                                            />
                                            <TouchableOpacity onPress={delCat}>
                                                <FontAwesome5 name="trash" size={18} color="red" />
                                            </TouchableOpacity>
                                        </View>

                                        {showUpdateCatButton !== category.name && showUpdateCatButton !== "" && (
                                            <View style={{ marginHorizontal: 20, marginTop: 10 }}>
                                                <MyButton title='Atualizar' onPress={handleSubmit(onSubmitUpdateCat)} loading={loading} />
                                            </View>
                                        )}
                                        <ClothesList clothes={catClothes} canOpen={true} clothingBg={globalColors.secundary} />
                                    </View>
                                </ModalScreen>
                            )}
                        </View>
                    ))}
                </View>

                <Modal isOpen={modalOpen} withInput={true} onRequestClose={() => { setModalOpen(false) }}>
                    <View style={{ width: width * 0.9 }}>
                        <View style={styles.modalContent}>
                            <Text style={{ fontSize: 16, fontFamily:Fonts['montserrat-bold'], }}>Adicionar Categoria</Text>

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
                                            autoCapitalize="none"
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
        </View>
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
        gap: 5
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
