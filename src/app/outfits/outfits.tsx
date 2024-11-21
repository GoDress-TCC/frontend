import { View, Text } from 'react-native'
import React from 'react'
import MainHeader from '../components/headers/mainHeader'
import { globalStyles } from '@/src/styles/global'

export default function Outfits() {
    return (
        <View style={globalStyles.globalContainerForLists}>
            <View style={{ marginHorizontal: 20 }}>
                <MainHeader title='Outfits' backButton={true} />
            </View>
        </View>
    )
}