import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';

import { Clothing } from '@/src/services/types/types';
import { ClothesList } from '../components/flatLists/clothesList';
import Api from '@/src/services/api';

export default function favClothes() {
    const [clothes, setClothes] = useState<Clothing[]>([])

    const getFavClothes = async () => {
        await Api.get('/clothing/favs')
            .then(response => {
                setClothes(response.data)
                console.log(clothes);
            })
            .catch(error => {
                console.log(error.response.data)
            })
    }

    useEffect(() => {
        getFavClothes();
    }, []);
    
    return (
        <ClothesList clothes={clothes} canOpen={true}/>       
    );
}