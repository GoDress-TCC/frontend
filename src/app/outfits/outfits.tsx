import { View, Text, Image } from 'react-native'
import React, { useEffect } from 'react'

import { globalStyles } from '@/src/styles/global'
import { useOutfits } from '@/src/services/contexts/outfitsContext'
import MainHeader from '../components/headers/mainHeader'
import OutfitsList from '../components/flatLists/outfitsList'

export default function Outfits() {
    const { outfits } = useOutfits();

    return (
        <View style={globalStyles.globalContainerForLists}>
            <View style={{ marginHorizontal: 20 }}>
                <MainHeader title='Outfits' backButton={true} />
            </View>

            {outfits.length > 0 ?
                <View style={globalStyles.flatListContainer}>
                    <OutfitsList outfits={outfits} />
                </View>
                :
                <View style={globalStyles.message}>
                    <Text>Você não possui outfits salvos</Text>
                </View>
            }
        </View>
    )
}