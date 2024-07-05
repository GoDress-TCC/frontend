import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import Api from '@/src/services/api';
import Modal from '../components/modals/modal';
import ModalScreen from '../components/modals/modalScreen';

type FormData = {
    name: string;
};

type Category = {
    _id: string;
    name: string;
};

const addCatSchema = yup.object({
    name: yup.string().required('Nome é obrigatório')
}).required();

export default function Home() {
    // getUser
    const [name, setName] = useState<string | null>(null);
    const [surname, setSurname] = useState<string | null>(null);

    // getCat
    const [cats, setCats] = useState<Category[]>([]);

    // modals
    const [modalOpen, setModalOpen] = useState(false);
    const [catScreenOpen, setCatScreenOpen] = useState(false);
    const [openCatId, setOpenCatId] = useState<string | null>(null);

    // buttons
    const [showButton, setShowButton] = useState<string>("");

    // data
    const [resultData, setResultData] = useState<string | null>(null);

    const form = useForm<FormData>({
        defaultValues: {
            name: ""
        },
        resolver: yupResolver(addCatSchema),
    });

    const { handleSubmit, control, formState: { errors }, reset } = form;

    const getUser = async () => {
        Api.get('/user')
            .then(response => {
                console.log(response);
                setName(response.data.user.name);
                setSurname(response.data.user.surname);
            })
            .catch(error => {
                console.log(error.response.data);
                router.replace('/auth/login');
            });
    };

    const onSubmitCreateCat: SubmitHandler<FormData> = async (data) => {
        await Api.post('/cat', data)
            .then(response => {
                console.log(response.data);
                setModalOpen(false);
                setResultData(null);
                getCats();
                reset();
            })
            .catch(error => {
                console.log(error.response.data);
                setResultData(error.response.data.msg);
            });
    };

    const getCats = async () => {
        await Api.get('/cat')
            .then(response => {
                console.log(response);
                setCats(response.data);
            })
            .catch(error => {
                console.log(error.response.data);
            });
    };

    const onSubmitUpdateCat: SubmitHandler<FormData> = async (data) => {
        await Api.put(`/cat/${openCatId}`, data)
            .then(response => {
                console.log(response.data);
                setResultData(null);
                setCatScreenOpen(false);
                getCats();
            })
            .catch(error => {
                console.log(error.response.data);
                setResultData(error.response.data.msg);
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
            })
    }

    useEffect(() => {
        getUser();
        getCats();
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.removeItem('jwtToken');
        router.replace('/');
    };

    const handleOpenCat = (id: string) => setOpenCatId(id);
    const handleCloseCat = () => setOpenCatId(null);

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.title}>Olá, </Text>
                <Text style={styles.title}>{name ? name : "..."} </Text>
                <Text style={styles.title}>{surname ? surname : "..."}</Text>
            </View>
            <TouchableOpacity onPress={handleLogout}>
                <Text style={{ color: "grey", fontWeight: "500" }}>Logout</Text>
            </TouchableOpacity>

            <View style={{ backgroundColor: "#fff", padding: 10, marginTop: 20, borderRadius: 10, gap: 5 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ fontSize: 16, fontWeight: "500" }}>Minhas Categorias:</Text>
                    <TouchableOpacity onPress={() => { setModalOpen(true), reset() }}>
                        <FontAwesome5 name="plus" size={14} />
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 10, gap: 10 }}>
                    {cats.map((category) => (
                        <View key={category._id}>
                            <TouchableOpacity onPress={() => { handleOpenCat(category._id), setCatScreenOpen(true) }}>
                                <Text style={{ fontSize: 16, fontWeight: "400" }}>{category.name}</Text>
                            </TouchableOpacity>

                            {openCatId === category._id && (
                                <ModalScreen isOpen={catScreenOpen}>
                                    <View style={styles.modalScreenContent}>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                                            <TouchableOpacity onPress={() => { setCatScreenOpen(false), handleCloseCat, setResultData(null), setShowButton("") }}>
                                                <FontAwesome5 name="arrow-left" size={18} />
                                            </TouchableOpacity>
                                            <Controller
                                                control={control}
                                                name="name"
                                                render={({ field: { onChange } }) => (
                                                    <>
                                                        <TextInput
                                                            style={{ textAlign: "center", fontSize: 18, fontWeight: "500" }}
                                                            onChangeText={(text) => { onChange(text), setResultData(null), setShowButton(text) }}
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

                                        {resultData && (
                                            <View>
                                                <Text style={styles.error}>{resultData}</Text>
                                            </View>
                                        )}

                                        {showButton !== category.name && showButton !== "" && (
                                            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmitUpdateCat)}>
                                                <Text style={styles.textButton}>Atualizar</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </ModalScreen>
                            )}
                        </View>
                    ))}
                </View>

                <Modal isOpen={modalOpen}>
                    <View>
                        <View style={styles.modalContent}>
                            <Text style={{ fontSize: 14, fontWeight: "500" }}>Adicionar Categoria</Text>

                            <Controller
                                control={control}
                                name="name"
                                render={({ field: { value, onChange } }) => (
                                    <>
                                        <TextInput
                                            style={styles.input}
                                            onChangeText={(text) => { onChange(text), setResultData(null) }}
                                            placeholder="Nome"
                                            value={value}
                                            autoCapitalize="none"
                                        />
                                        {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}
                                    </>
                                )}
                            />

                            {resultData && (
                                <View>
                                    <Text style={styles.error}>{resultData}</Text>
                                </View>
                            )}

                            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmitCreateCat)}>
                                <Text style={styles.textButton}>Adicionar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.closeButton} onPress={() => { setModalOpen(false), setResultData(null) }}>
                                <Text style={styles.textButton}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <View style={{ marginTop: 16, gap: 10 }} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 40,
        paddingHorizontal: 20,
        gap: 5
    },
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
        padding: 20
    },
    modalScreenContent: {
        backgroundColor: "#fff",
        width: "100%",
        height: "95%",
        paddingTop: 40,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: "center",
        gap: 10
    },
    input: {
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    submitButton: {
        backgroundColor: "#593C9D",
        borderRadius: 5,
        paddingVertical: 10,
        width: "100%",
        alignItems: "center",
    },
    closeButton: {
        backgroundColor: "grey",
        borderRadius: 5,
        paddingVertical: 10,
        width: "100%",
        alignItems: "center",
    },
    textButton: {
        color: "#fff",
        fontWeight: "500"
    },
    error: {
        color: 'red',
        alignSelf: 'flex-start',
        fontSize: 10,
        fontWeight: '500'
    },
});
