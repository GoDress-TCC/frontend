import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'

import { globalColors, globalStyles } from '@/src/styles/global'
import { useOutfits } from '@/src/services/contexts/outfitsContext'
import MainHeader from '../components/headers/mainHeader'
import OutfitsList from '../components/flatLists/outfitsList'
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons'
import { Outfit } from '@/src/services/types/types'

export default function Outfits() {
    const [searchValue, setSearchValue] = useState<string>("");
    const [filteredOutfits, setFilteredOutfits] = useState<Outfit[]>([]);

    const { outfits } = useOutfits();

    useEffect(() => {
        if (searchValue) {
            const filteredOutfits = outfits.filter(item => item.name.toLowerCase().includes(searchValue.toLowerCase()));
            setFilteredOutfits(filteredOutfits);
        }
        else {
            setFilteredOutfits(outfits);
        }
    }, [searchValue])


    return (
        <View style={globalStyles.globalContainerForLists}>
            <View style={{ marginHorizontal: 20 }}>
                <MainHeader title='Outfits' backButton={true} />
            </View>

            {outfits.length > 0 ?
                <View style={globalStyles.flatListContainer}>
                    <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
                        <View style={styles.searchInputArea}>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                <FontAwesome5 name="search" size={20} color={globalColors.primary} />
                                <TextInput style={globalStyles.input} placeholder="Pesquisar" value={searchValue} onChangeText={(text) => setSearchValue(text)} />
                            </View>
                            {searchValue &&
                                <TouchableOpacity onPress={() => setSearchValue("")}>
                                    <MaterialIcons name="close" size={20} color={globalColors.primary} />
                                </TouchableOpacity>
                            }
                        </View>
                    </View>


                    <OutfitsList outfits={filteredOutfits} />
                </View>
                :
                <View style={globalStyles.message}>
                    <Text>Você não possui outfits salvos</Text>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    searchInputArea: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#fff",
        paddingVertical: 3,
        paddingHorizontal: 10,
        width: "100%",
        borderWidth: 1,
        borderRadius: 10,
        borderColor: globalColors.primary,
        justifyContent: 'space-between',
    }
});