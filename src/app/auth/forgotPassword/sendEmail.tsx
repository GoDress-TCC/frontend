import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { router, Link } from 'expo-router';
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import Api from '@/src/services/api';
import { globalColors, globalStyles } from '@/src/styles/global';
import Fonts from '@/src/services/utils/Fonts';
import MyButton from '../../components/button/button';
import MainHeader from '../../components/headers/mainHeader';

type FormData = {
    email: string;
}

const registerSchema = yup.object({
    email: yup.string().email('Email inválido').required('Email é obrigatório')
}).required();

export default function sendEmail() {
    const [loading, setLoading] = useState<boolean>(false);

    const form = useForm<FormData>({
        defaultValues: {
            email: ""
        },
        resolver: yupResolver(registerSchema),
    });

    const { handleSubmit, control, formState: { errors }, reset } = form;

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        setLoading(true); 
        await Api.post('/auth/forgot_password', {
            ...data
        })
            .then(async function (response) {
                console.log(response.data);
                reset();
                Toast.show({
                    type: 'success',
                    text1: 'Email enviado com sucesso'
                });
                await AsyncStorage.setItem('userEmail', data.email)

                router.navigate('/auth/forgotPassword/resetPassword')
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
                setLoading(false);
            });

    };

    return (
        <View style={styles.container}>
             <MainHeader backButton />

            <View>
                <Text style={styles.title}>Redefinir sua senha</Text>
            </View>
            <Controller
                control={control}
                name="email"
                render={({ field: { value, onChange } }) => (
                    <>
                        <TextInput
                            style={styles.input}
                            onChangeText={onChange}
                            placeholder="Email"
                            value={value}
                            autoCapitalize="none"
                        />
                        {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
                    </>
                )}
            />

            <Text style={styles.texto}>Você irá receber um e-mail no endereçoinformado acima contendo o procedimento para criar uma nova senha para esse usúario</Text>

            <MyButton onPress={handleSubmit(onSubmit)} title='Enviar' loading={loading}/>
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

    title:{
        marginTop:"30%",
        marginBottom:20,
        fontFamily: Fonts['montserrat-extrabold'],
        fontSize: 32,
        color: globalColors.primary,
        paddingRight: 15,
    },

    texto:{
        fontFamily:Fonts['montserrat-regular'],
        fontSize:11,
        marginBottom:20,
    },

    button: {
        backgroundColor: "#593C9D",
        borderRadius: 5,
        paddingVertical: 10,
        color: "#fff",
        width: "100%",
        alignItems: "center",
        marginTop: 20,
    },
    input: {
        backgroundColor: "#fff",
        padding: 10,
        width: "100%",
        borderWidth: 1.5,
        borderRadius: 10,
        borderColor: globalColors.primary,
        fontFamily: Fonts['montserrat-regular'],
        fontSize: 16,
    },
    error: {
        color: 'red',
        alignSelf: 'flex-start',
        fontSize: 10,
        fontWeight: "500"
    },
});
