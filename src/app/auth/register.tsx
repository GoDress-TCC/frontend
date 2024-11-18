import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Feather from '@expo/vector-icons/Feather';


import Fonts from '@/src/services/utils/Fonts';

import Api from '@/src/services/api';
import { router } from 'expo-router';
import { globalColors } from '@/src/styles/global';
import MyButton from '../components/button/button';
import Toast from 'react-native-toast-message';

type FormData = {
    name: string;
    surname: string;
    email: string;
    password: string;
    confirm_password: string
}

const registerSchema = yup.object({
    name: yup.string().required('Nome é obrigatório'),
    surname: yup.string().required('Sobrenome é obrigatório'),
    email: yup.string().email('Email inválido').required('Email é obrigatório'),
    password: yup.string()
        .min(6, 'Senha deve ter pelo menos 6 caracteres')
        .matches(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
        .matches(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
        .matches(/[0-9]/, 'Senha deve conter pelo menos um número')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Senha deve conter pelo menos um caractere especial')
        .required('Senha é obrigatória'),
    confirm_password: yup.string().required('Confirme a senha').oneOf([yup.ref('password')], 'As senhas devem ser iguais!')
}).required();



export default function Register() {
    const [loading, setLoading] = useState<boolean>(false);

    const form = useForm<FormData>({
        defaultValues: {
            name: "",
            surname: "",
            email: "",
            password: "",
            confirm_password: ""
        },
        resolver: yupResolver(registerSchema),
    });

    const { handleSubmit, control, formState: { errors }, reset } = form;


    const onSubmit: SubmitHandler<FormData> = async (data) => {
        setLoading(true);
        await Api.post('/auth/register', {
            name: data.name,
            surname: data.surname,
            email: data.email,
            password: data.password
        })
            .then(function (response) {
                console.log(response.data);
                Toast.show({
                    type: 'success',
                    text1: 'Sucesso',
                    text2: 'Faça login para continuar'
                });
                router.navigate('/auth/login')
                reset();
            })
            .catch(function (error) {
                console.log(error.response.data);
                Toast.show({
                    type: 'error',
                    text1: error.response.data.msg,
                    text2: 'Tente novamente'
                });
            })
            .finally(() => {
                setLoading(false)
            })
    };

    const [hidepass, setHidepass] = useState(true);

    return (
        <View style={styles.container}>


            <TouchableOpacity style={styles.containVoltar} onPress={() => router.back()}>
                <Image style={styles.imgVoltar} source={require('../../../assets/icons/voltar.png')} />
            </TouchableOpacity >

            <View style={styles.containlogotxt}>
                <Text style={styles.titulo} >Cadastre-se</Text>
                <Image style={styles.logoimg} source={require('../../../assets/images/gPurple.png')} />
            </View>

            <Controller
                control={control}
                name="name"
                render={({ field: { value, onChange } }) => (
                    <>
                        <View style={styles.inputarea}>
                            <TextInput
                                style={styles.input}
                                placeholder="Nome"
                                onChangeText={onChange}
                                value={value}
                            />
                        </View>
                        {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}
                    </>
                )}
            />
            <Controller
                control={control}
                name="surname"
                render={({ field: { value, onChange } }) => (
                    <>
                        <View style={styles.inputarea}>
                            <TextInput
                                style={styles.input}
                                placeholder="Sobrenome"
                                onChangeText={onChange}
                                value={value}
                            />
                        </View>
                        {errors.surname && <Text style={styles.error}>{errors.surname.message}</Text>}
                    </>
                )}
            />
            <Controller
                control={control}
                name="email"
                render={({ field: { value, onChange } }) => (
                    <>
                        <View style={styles.inputarea}>
                            <TextInput
                                style={styles.input}
                                onChangeText={onChange}
                                placeholder="Email"
                                value={value}
                                autoCapitalize="none"
                            />
                        </View>
                        {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
                    </>
                )}
            />
            <Controller
                control={control}
                name="password"
                render={({ field: { value, onChange } }) => (
                    <>
                        <View style={styles.inputarea}>
                            <TextInput
                                style={styles.input}
                                placeholder="Senha"
                                onChangeText={onChange}
                                value={value}
                                secureTextEntry={hidepass}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity onPress={() => setHidepass(!hidepass)}>
                                {hidepass ?
                                    <Feather name="eye-off" size={24} color="#593C9D" />
                                    :
                                    <Feather name="eye" size={24} color="#593C9D" />
                                }

                            </TouchableOpacity>
                        </View>
                        {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
                    </>
                )}
            />
            <Controller
                control={control}
                name="confirm_password"
                render={({ field: { value, onChange } }) => (
                    <View style={{ marginBottom: 20 }}>
                        <View style={styles.inputarea}>
                            <TextInput
                                style={styles.input}
                                placeholder="Confirmar senha"
                                onChangeText={onChange}
                                value={value}
                                secureTextEntry={hidepass}
                                autoCapitalize="none"
                            />
                        </View>

                        {errors.confirm_password && <Text style={styles.error}>{errors.confirm_password.message}</Text>}
                    </View>
                )}
            />

            <MyButton onPress={handleSubmit(onSubmit)} title='Cadastre-se ' loading={loading} />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        gap: 10
    },

    containVoltar: {
        paddingTop: '15%',
    },

    imgVoltar: {
        height: 30,
        width: 30,
    },

    containlogotxt: {
        marginTop: 70,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 40,
    },

    titulo: {
        fontFamily: Fonts['montserrat-extrabold'],
        fontSize: 32,
        color: globalColors.primary,
        paddingRight: 15,
    },

    logoimg: {
        height: 55,
        width: 55,
        resizeMode: 'contain',
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

        fontFamily: Fonts['montserrat-regular'],
        fontSize: 16,
        flexDirection: 'row',
        width: '90%',
    },

    button: {
        backgroundColor: globalColors.secundary,
        borderRadius: 5,
        paddingVertical: 10,
        color: globalColors.white,
        width: "100%",
        alignItems: "center",
        marginTop: 50,
    },

    BNTcadastro: {
        backgroundColor: globalColors.primary,
        borderRadius: 10,
        alignItems: 'center',
        paddingVertical: 15,
        marginTop: 20,
    },

    txtBNT: {
        color: globalColors.white,
        fontFamily: Fonts['montserrat-black'],
    },

    error: {
        color: 'red',
        alignSelf: 'flex-start',
        fontSize: 10,
        fontWeight: "500"
    },
    resultContainer: {
        marginTop: 20,
        padding: 10,
        borderRadius: 5,
        backgroundColor: globalColors.primary,
        width: '100%',
        gap: 10
    },
    resultText: {
        fontSize: 14,
    },
});
