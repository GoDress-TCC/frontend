import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

import Api from '@/src/services/api';

export default function Home() {

    const [name, setName] = useState<string | null>(null)
    const [surname, setSurname] = useState<string | null>(null)

    async function getUser() {
        const token = await AsyncStorage.getItem('jwtToken');
        const id = await AsyncStorage.getItem('userId');

        Api.get(`/user/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(function (response) {
                console.log(response);
                setName(response.data.user.name);
                setSurname(response.data.user.surname)
            })
            .catch(function (error) {
                console.log(error.response.data)
                router.replace('/auth/login')
            })

    }

    useEffect(() => {
        getUser();
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.removeItem('jwtToken');
        await AsyncStorage.removeItem('userId');
        router.replace('/');
    }

    return (
        <View style={styles.container}>
            <Text style={{ fontWeight: "500", fontSize: 26 }}>Olá</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.text}>{name ? name : "..."} </Text>
                <Text style={styles.text}>{surname ? surname : "..."}</Text>
            </View>
            <TouchableOpacity onPress={handleLogout}>
                <Text style={{ color: "grey", fontWeight: "500"}}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
        paddingHorizontal: 20,
        gap: 10

    },
    text: {
        fontWeight: 400, 
        fontSize: 20,
    }
});
