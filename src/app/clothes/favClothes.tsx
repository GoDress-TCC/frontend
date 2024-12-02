import React from 'react';
import { View, Text } from 'react-native';

import { useClothes } from '@/src/services/contexts/clothesContext';
import { globalStyles } from '@/src/styles/global';
import ClothesList from '../components/flatLists/clothesList';
import MainHeader from '../components/headers/mainHeader';

export default function favClothes() {
    const { clothes } = useClothes();

    const favClothes = clothes.filter(item => item.fav === true)

    return (
        <View style={globalStyles.globalContainerForLists}>
            <View style={{ marginHorizontal: 20 }}>
                <MainHeader title="Roupas favoritas" backButton />
            </View>

            {favClothes.length === 0 ?
                <View style={globalStyles.message}>
                    <Text>Você não possui roupas favoritas</Text>
                </View>
                :
                <View style={globalStyles.flatListContainer}>
                    <ClothesList clothes={favClothes} canOpen={true} clothingBg='#fff' canSelect={true} operations={true} />
                </View>
            }
        </View>
    );
}