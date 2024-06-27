import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { router, Link } from 'expo-router';
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Api from '@/src/services/api';

type FormData = {
    email: string;
    password: string;
}

const registerSchema = yup.object({
    email: yup.string().email('Email inválido').required('Email é obrigatório'),
    password: yup.string().required('Senha é obrigatória'),
}).required();

export default function Login() {
    const [resultData, setResultData] = useState(null);

    const form = useForm<FormData>({
        defaultValues: {
            email: "",
            password: ""
        },
        resolver: yupResolver(registerSchema),
    });

    const { handleSubmit, control, formState: { errors }, reset } = form;

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        await Api.post('/auth/login', {
            ...data
        })
            .then(async function (response) {
                console.log(response.data);
                setResultData(response.data.msg);
                reset();

                const { id, token } = response.data;
                await AsyncStorage.setItem('jwtToken', token);
                await AsyncStorage.setItem('userId', id);

                router.replace('user/home');
            })
            .catch(function (error) {
                console.log(error.response.data);
                setResultData(error.response.data.msg);
            });

    };

    return (
        <View style={styles.container}>
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
            <Controller
                control={control}
                name="password"
                render={({ field: { value, onChange } }) => (
                    <>
                        <TextInput
                            style={styles.input}
                            placeholder="Senha"
                            onChangeText={onChange}
                            value={value}
                            secureTextEntry={true}
                            autoCapitalize="none"
                        />
                        {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
                    </>
                )}
            />

            <TouchableOpacity>
                <Link href={"/auth/forgotPassword/sendEmail"} style={{ textDecorationLine: "underline" }}>Esqueci a senha</Link>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                <Text style={{ color: "#fff", fontWeight: "500" }}>Entrar</Text>
            </TouchableOpacity>

            {resultData && (
                <View style={styles.resultContainer}>
                    <Text style={{ fontWeight: 500, marginBottom: 10 }}>Status:</Text>
                    <Text style={styles.resultText}>{resultData}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingVertical: 40,
        paddingHorizontal: 20,
        gap: 10
    },
    button: {
        backgroundColor: "#593C9D",
        borderRadius: 5,
        paddingVertical: 10,
        color: "#fff",
        width: "100%",
        alignItems: "center",
        marginTop: 50,
    },
    input: {
        backgroundColor: "#fff",
        padding: 10,
        width: "100%",
        borderWidth: 1,
        borderRadius: 5,
    },
    error: {
        color: 'red',
        alignSelf: 'flex-start',
        fontSize: 10,
        fontWeight: '500'
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
