import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Link, router } from 'expo-router';
import { useEffect } from 'react';

import Fonts from '../services/utils/Fonts';
import { globalColors, globalStyles } from '../styles/global';

export default function Index() {
    const hasToken = async () => {
        const token = await AsyncStorage.getItem('jwtToken')
        if (token) { router.replace('(tabs)') }
    };

    useEffect(() => {
        hasToken();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.subcontainer}>
                <Text style={styles.text}>Bem-vindo a GoDress</Text>
                <Image source={require('../../assets/images/goroxo.png')} />

            </View>

            <View style={styles.miniContainer}>
                <Link href={"/auth/register"} style={styles.button}>cadastre-se</Link>
                <View style={styles.containtext}>
                    <Link href={"/auth/login"} style={styles.txtlogin}>ja possui cadastro?</Link>
                    <Link href={"/auth/login"} style={styles.txtentrar}>entrar</Link>
                </View>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: globalColors.primary,
    },

    subcontainer: {
        alignItems: "center",
        marginTop: "35%",
    },

    text: {
        fontSize: 18,
        fontFamily: Fonts['montserrat-light'],
        color: '#fff',
        paddingHorizontal: 100,
        textAlign: 'center',
        marginBottom: 40,
    },

    positioncamaleao: {
        position: 'absolute',
        top: 365,
        right: 20,
        resizeMode: 'contain',
        zIndex: 1,
    },


    miniContainer: {
        position: 'absolute',
        paddingHorizontal: 20,
        bottom: 0,
        height: '40%',
        width: '100%',
        backgroundColor: '#fff',
        borderTopEndRadius: 50,
        borderTopLeftRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },

    button: {
        backgroundColor: "#593C9D",
        borderRadius: 10,
        paddingVertical: 22,
        color: "#fff",
        fontWeight: "500",
        width: "100%",
        textAlign: "center",
        marginBottom: 20,
        fontFamily: Fonts['montserrat-black'],
        fontSize: 18,
    },

    txtlogin: {
        fontSize: 16,
        fontFamily:Fonts['montserrat-regular'],

    },
    txtentrar:{
        color:globalColors.primary, 
        fontSize: 16,
        fontFamily:Fonts['montserrat-semibold'],
        textDecorationLine:'underline',

    },

    containtext: {
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: Fonts['montserrat-regular'],
        fontSize: 16,
        gap:10,
        flexDirection:'row',
    },
});