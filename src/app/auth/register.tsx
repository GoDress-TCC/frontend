import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Fonts from '@/src/services/utils/Fonts';

import Api from '@/src/services/api';
import { router } from 'expo-router';

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
    const [resultData, setResultData] = useState(null);

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
        await Api.post('/auth/register', {
            name: data.name,
            surname: data.surname,
            email: data.email,
            password: data.password
        })
            .then(function (response) {
                console.log(response.data);
                setResultData(response.data.msg);
                router.navigate('/auth/login')
                reset();
            })
            .catch(function (error) {
                console.log(error.response.data);
                setResultData(error.response.data.msg);
            });
    };

    return (
        <View style={styles.container}>

            <View style={styles.containlogotxt}>
                <Text style={styles.titulo} >Cadastre-se</Text>
                <Image style={styles.logoimg} source={require('../../../assets/images/logoGpreta.png')} />
            </View>

            <Controller
                control={control}
                name="name"
                render={({ field: { value, onChange } }) => (
                    <>
                        <TextInput
                            style={styles.input}
                            placeholder="Nome"
                            onChangeText={onChange}
                            value={value}
                        />
                        {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}
                    </>
                )}
            />
            <Controller
                control={control}
                name="surname"
                render={({ field: { value, onChange } }) => (
                    <>
                        <TextInput
                            style={styles.input}
                            placeholder="Sobrenome"
                            onChangeText={onChange}
                            value={value}
                        />
                        {errors.surname && <Text style={styles.error}>{errors.surname.message}</Text>}
                    </>
                )}
            />
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
            <Controller
                control={control}
                name="confirm_password"
                render={({ field: { value, onChange } }) => (
                    <>
                        <TextInput
                            style={styles.input}
                            placeholder="Confirmar senha"
                            onChangeText={onChange}
                            value={value}
                            secureTextEntry={true}
                            autoCapitalize="none"
                        />
                        {errors.confirm_password && <Text style={styles.error}>{errors.confirm_password.message}</Text>}
                    </>
                )}
            />


            <TouchableOpacity style={styles.BNTcadastro} onPress={handleSubmit(onSubmit)}>
                <Text style={styles.txtBNT}>Cadastrar-se</Text>
            </TouchableOpacity>

            {resultData && (
                <View style={styles.resultContainer}>
                    <Text style={{ fontWeight: "500", marginBottom: 10 }}>Status:</Text>
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
        padding:20,
        gap: 10
    },

    containlogotxt:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-start',
        marginBottom:40,
    },

    titulo:{
        fontFamily:Fonts['montserrat-black'],
        fontSize:32,
        color:'#593C9D',
        paddingRight:15,
    },

    logoimg:{
        height:60,
        width:60,
        resizeMode:'contain',
    },

    

    input: {
        backgroundColor: "#fff",
        padding: 10,
        width: "100%",
        borderWidth: 1,
        borderRadius: 10,
        borderColor:'#A7A7A7',
        fontFamily: Fonts['montserrat-regular'],
        fontSize:16,
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

    BNTcadastro:{
        backgroundColor:'#593C9D',
        borderRadius:10,
        alignItems:'center',
        paddingVertical:15,
        marginTop:20,
    },

    txtBNT:{
        color:'#fff',
        fontFamily:Fonts['montserrat-black'],
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
