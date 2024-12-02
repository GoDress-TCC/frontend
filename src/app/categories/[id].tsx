import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { useLocalSearchParams } from 'expo-router';

import MainHeader from '../components/headers/mainHeader';
import ClothesList from '../components/flatLists/clothesList';
import ModalScreen from '../components/modals/modalScreen';
import { useCats } from '@/src/services/contexts/catsContext';
import { useClothes } from '@/src/services/contexts/clothesContext';
import { Category, Clothing } from '@/src/services/types/types';
import { globalColors, globalStyles } from '@/src/styles/global';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function CategoryScreen() {
    const [cat, setCat] = useState<Category>();
    const [catClothes, setCatClothes] = useState<Clothing[]>([]);
    const [openSelectClothes, setOpenSelectClothes] = useState(false);

    const { id } = useLocalSearchParams();
    const { cats } = useCats();
    const { clothes } = useClothes();

    useEffect(() => {
        const cat = cats.filter(item => item._id === id);
        setCat(cat[0]);

        const catClothes = clothes.filter(item => item.catId === id);
        setCatClothes(catClothes);
    }, []);

    return (
        <View style={globalStyles.globalContainerForLists}>
            <View style={{ marginHorizontal: 20 }}>
                <MainHeader title="Eventos" functionButtonTitle="Adicionar roupas" functionButtonIcon="plus" backButton functionButtonOnPress={() => setOpenSelectClothes(true)} />
            </View>

            {catClothes.length === 0 ?
                <View style={globalStyles.message}>
                    <Text>Esta categoria não possui roupas cadastradas</Text>
                </View>
                :
                <View style={globalStyles.flatListContainer}>
                    <ClothesList clothes={catClothes} clothingBg='#fff' canSelect operations />
                </View>
            }

            <ModalScreen isOpen={openSelectClothes} onRequestClose={() => setOpenSelectClothes(false)}>
                <View style={styles.modalContent}>
                    <View style={{ flexDirection: "row", marginHorizontal: 20, justifyContent: "center" }}>
                        <TouchableOpacity onPress={() => { setOpenSelectClothes(false) }} style={{ position: "absolute", left: 0 }}>
                            <Ionicons name="chevron-back" size={26} />
                        </TouchableOpacity>

                        <Text style={globalStyles.subTitle}>Adicionar roupas</Text>
                    </View>

                    <ClothesList clothes={clothes} clothingBg={globalColors.secundary} canSelect pickerFilter fixedSelectMode buttonTitle="Adicionar" />
                </View>
            </ModalScreen>
        </View>
    )
}

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: "#fff",
        width: "100%",
        height: "95%",
        paddingTop: 40,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        gap: 10
    }
});
