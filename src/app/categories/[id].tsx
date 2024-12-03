import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import MainHeader from '../components/headers/mainHeader';
import ClothesList from '../components/flatLists/clothesList';
import ModalScreen from '../components/modals/modalScreen';
import { useCats } from '@/src/services/contexts/catsContext';
import { useClothes } from '@/src/services/contexts/clothesContext';
import { Category } from '@/src/services/types/types';
import { globalColors, globalStyles } from '@/src/styles/global';
import { Ionicons } from '@expo/vector-icons';
import Api from '@/src/services/api';
import Toast from 'react-native-toast-message';

type FormData = {
    catId?: string[];
};

export default function CategoryScreen() {
    const [cat, setCat] = useState<Category>();
    const [openSelectClothes, setOpenSelectClothes] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);

    const { id } = useLocalSearchParams();
    const { cats } = useCats();
    const { clothes, getClothes, selectedClothesIds } = useClothes();

    const catClothes = clothes.filter(item => item.catId.includes(id as string));
    const selectClothesList = clothes.filter(item => !item.catId.includes(id as string));

    const onSubmitUpdateClothing = async (clothingIds: string[], data: FormData) => {
        setButtonLoading(true);

        await Api.put(`/clothing/${clothingIds}`, data)
            .then(response => {
                console.log(response.data);
                getClothes();
                setOpenSelectClothes(false);
            })
            .catch(error => {
                console.log(error.response?.data || error.message);
                Toast.show({
                    type: "error",
                    text1: error.response.data.msg,
                    text2: "Tente novamente",
                });
            })
            .finally(() =>
                setButtonLoading(false)
            );
    };

    useEffect(() => {
        const category = cats.find(item => item._id === id);
        setCat(category);
    }, [id, cats]);

    return (
        <View style={globalStyles.globalContainerForLists}>
            <View style={{ marginHorizontal: 20 }}>
                <MainHeader
                    title={cat?.name}
                    functionButtonTitle="Adicionar"
                    functionButtonIcon="plus"
                    backButton
                    functionButtonOnPress={() => setOpenSelectClothes(true)}
                />
            </View>

            {catClothes.length === 0 ?
                <View style={globalStyles.message}>
                    <Text>Esta categoria não possui roupas cadastradas</Text>
                </View>
                :
                <View style={globalStyles.flatListContainer}>
                    <ClothesList
                        clothes={catClothes}
                        clothingBg="#fff"
                        canSelect
                        operations
                        canOpen
                        additionalOperation="remove-circle"
                        additionalOperationOnPress={() => { onSubmitUpdateClothing(selectedClothesIds, { catId: [] }) }}
                    />
                </View>
            }

            <ModalScreen isOpen={openSelectClothes} onRequestClose={() => setOpenSelectClothes(false)}>
                <View style={styles.modalContent}>
                    <View style={{ flexDirection: "row", marginHorizontal: 20, justifyContent: "center" }}>
                        <TouchableOpacity onPress={() => setOpenSelectClothes(false)} style={{ position: "absolute", left: 0 }}>
                            <Ionicons name="chevron-back" size={26} />
                        </TouchableOpacity>

                        <Text style={globalStyles.subTitle}>Adicionar roupas</Text>
                    </View>

                    <ClothesList
                        clothes={selectClothesList}
                        clothingBg={globalColors.secundary}
                        canSelect
                        pickerFilter
                        fixedSelectMode
                        buttonTitle="Adicionar"
                        buttonOnPress={() => onSubmitUpdateClothing(selectedClothesIds, { catId: [id as string] })}
                        buttonLoading={buttonLoading}
                    />
                </View>
            </ModalScreen>
        </View>
    );
}

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: "#fff",
        width: "100%",
        height: "95%",
        paddingTop: 40,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        gap: 10,
    },
});
