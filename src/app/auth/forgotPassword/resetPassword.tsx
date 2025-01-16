import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { router, Link } from 'expo-router';
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import Feather from '@expo/vector-icons/Feather';

import Api from '@/src/services/api';
import { globalColors, globalStyles } from '@/src/styles/global';
import Fonts from '@/src/services/utils/Fonts';
import MyButton from '../../components/button/button';
import MainHeader from '../../components/headers/mainHeader';

type FormData = {
    token: string;
    password: string;
    confirm_password: string;
}

const registerSchema = yup.object({
    token: yup.string().required('Código é obrigatório'),
    password: yup.string()
        .min(6, 'Senha deve ter pelo menos 6 caracteres')
        .matches(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
        .matches(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
        .matches(/[0-9]/, 'Senha deve conter pelo menos um número')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Senha deve conter pelo menos um caractere especial')
        .required('Senha é obrigatória'),
    confirm_password: yup.string().required('Confirme a senha').oneOf([yup.ref('password')], 'As senhas devem ser iguais!')
}).required();

export default function resetPassword() {
    const form = useForm<FormData>({
        defaultValues: {
            token: "",
            password: "",
            confirm_password: ""
        },
        resolver: yupResolver(registerSchema),
    });

    const { handleSubmit, control, formState: { errors }, reset } = form;
    const [loading, setLoading] = useState<boolean>(false);
    const [hidepass, setHidepass] = useState(true);

    const resendToken = async () => {
        const email = await AsyncStorage.getItem('userEmail');

        await Api.post('/auth/forgot_password', {
            email: email
        })
            .then(async function (response) {
                console.log(response.data);
                reset();
            })
            .catch(function (error) {
                console.log(error.response.data);
            });
    }


    const onSubmit: SubmitHandler<FormData> = async (data) => {
        setLoading(true);
        const email = await AsyncStorage.getItem('userEmail')

        await Api.post('/auth/reset_password', {
            email: email,
            token: data.token,
            password: data.password
        })
            .then(async function (response) {
                Toast.show({
                    type: 'success',
                    text1: 'Senha alterada com sucesso!',
                });
                reset();

                await AsyncStorage.removeItem('userEmail');

                router.replace('/');
            })
            .catch(function (error) {
                Toast.show({
                    type: 'error',
                    text1: error.response.data.msg,
                    text2: 'Tente novamente'
                });
            })
            .finally(() => {
                setLoading(false);
            });

    };

    return (
        <View style={styles.container}>
                 <MainHeader backButton />
            

            <View>
                <Text style={styles.title}>Codigo enviado para seu email</Text>
            </View>

            <Controller
                control={control}
                name="token"
                render={({ field: { value, onChange } }) => (
                    <>
                    <View style={globalStyles.inputArea}>
                        <TextInput
                            style={globalStyles.input}
                            onChangeText={onChange}
                            placeholder="Código"
                            value={value}
                            autoCapitalize="none"
                        />
                        </View>
                        {errors.token && <Text style={styles.error}>{errors.token.message}</Text>}
                    </>
                )}
            />
            <Controller
                control={control}
                name="password"
                render={({ field: { value, onChange } }) => (
                    <>
                        <View style={[globalStyles.inputArea, { marginBottom: 0 }]}>
                            <TextInput
                                style={globalStyles.input}
                                onChangeText={onChange}
                                placeholder="Nova senha"
                                value={value}
                                autoCapitalize="none"
                                secureTextEntry={hidepass}
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
                    <>
                    <View style={globalStyles.inputArea}>
                        <TextInput
                            style={globalStyles.input}
                            onChangeText={onChange}
                            placeholder="Confirmar senha"
                            value={value}
                            autoCapitalize="none"
                            secureTextEntry={hidepass}
                        />
                        </View>
                        {errors.confirm_password && <Text style={styles.error}>{errors.confirm_password.message}</Text>}
                    </>
                )}
            />
            <View style={{ marginTop: 50, gap: 10 }}>

                <MyButton onPress={resendToken} title='Reenviar código' loading={false} borderButton />

                <MyButton onPress={handleSubmit(onSubmit)} title='Alterar senha' loading={false} />

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 40,
        paddingHorizontal: 20,
        gap: 10
    },

    containVoltar: {
        paddingTop: '15%',
    },

    imgVoltar: {
        height: 30,
        width: 30,
    },

    title: {
        marginTop: "30%",
        marginBottom: 20,

        color: globalColors.primary,
        fontSize: 32,
        fontFamily: Fonts['montserrat-extrabold'],
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
        backgroundColor: '#f5f5f5',
        width: '100%',
        gap: 10
    },
    resultText: {
        fontSize: 14,
    },
});
