import React, { useRef, useState } from "react";
import { View, FlatList, TouchableOpacity, StyleSheet, Dimensions, Text, ImageBackground, ScrollView, Animated, Easing } from "react-native";
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import _isEqual from 'lodash/isEqual';

import { Clothing } from "@/src/services/types/types";
import { useClothes } from "@/src/services/contexts/clothesContext";
import Modal from "../modals/modal";
import Api from "@/src/services/api";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const { width } = Dimensions.get('window');

type FormData = {
    kind?: string,
    color?: string,
    fit?: string,
    gender?: string,
    tissue?: string,
    fav?: boolean,
}

export const ClothesList = React.memo(({ clothes, canOpen }: { clothes: Clothing[], canOpen: boolean }) => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openClothing, setOpenClothing] = useState<Clothing | null>(null);
    const [editClothing, setEditClothing] = useState<boolean>(false);
    const { getClothes } = useClothes();

    const form = useForm<FormData>({
        defaultValues: {
            kind: openClothing?.kind ?? '',
            color: openClothing?.color ?? '',
            fit: openClothing?.color ?? '',
            gender: openClothing?.color ?? '',
            tissue: openClothing?.color ?? '',
            fav: openClothing?.fav ?? false,
        },
    });

    const { watch, setValue, handleSubmit, reset, getValues } = form;

    const favoriteValue = watch('fav');

    const editAnimation = useRef(new Animated.Value(0)).current;
    const favAnimation = useRef(new Animated.Value(0)).current;

    const handleOpenClothing = (clothing: Clothing) => {
        setOpenClothing(clothing);
        reset(clothing);
        setOpenModal(true);
    };

    const hasFormChanged = (initialData: FormData, currentData: FormData) => {
        return !_isEqual(initialData, currentData);
    };    

    const onSubmitUpdateClothing: SubmitHandler<FormData> = async (data) => {
        if (openClothing && hasFormChanged(openClothing, data)) {
            await Api.put(`/clothing/${openClothing._id}`, data)
                .then(response => {
                    console.log(response.data);
                    setOpenClothing((prev) => prev ? { ...prev, ...data } : null);
                    getClothes();
                })
                .catch(error => {
                    console.log(error.response.data);
                });
        }
    };

    const handleEditClothing = () => {
        Animated.timing(editAnimation, {
            toValue: editClothing ? 0 : 1,
            duration: 300,
            easing: Easing.ease,
            useNativeDriver: false,
        }).start(() => {
            setEditClothing(!editClothing);
        });
    };

    const editClothingStyle = {
        height: editAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: ["100%", "40%"],
        }),
        borderBottomWidth: editAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 3],
        }),
    };

    const handleFavClothing = () => {
        Animated.sequence([
            Animated.timing(favAnimation, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(favAnimation, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setValue('fav', !favoriteValue);
        });
    }

    const favClothingStyle = {
        transform: [
            {
                scale: favAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.5],
                }),
            },
        ],
    }

    const handleCloseModal = async () => {
        await handleSubmit(onSubmitUpdateClothing)();
        setOpenModal(false);
        setOpenClothing(null);
        setEditClothing(false);
        editAnimation.setValue(0);
        favAnimation.setValue(0);
    };

    return (
        <View style={{ alignItems: "center" }}>
            <FlatList
                data={[...clothes].reverse()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.itemContainer} onPress={() => handleOpenClothing(item)}>
                        <View style={styles.imageContainer}>
                            <ImageBackground source={{ uri: item.image }} style={styles.image}>
                                {item.fav === true && <MaterialIcons name="favorite" color="red" size={16} />}
                            </ImageBackground>
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item._id}
                numColumns={3}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 20 }}
            />

            {canOpen === true && openClothing && (
                <View key={openClothing._id}>
                    <Modal isOpen={openModal} onRequestClose={handleCloseModal}>
                        <View style={styles.modalContent}>
                            <Animated.View style={[{ borderRadius: 5, overflow: 'hidden', paddingBottom: 10 }, editClothingStyle]}>
                                <ImageBackground source={{ uri: openClothing.image }} style={{ flex: 1, padding: 5 }} resizeMode="contain">
                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                        <TouchableOpacity onPress={handleCloseModal}>
                                            <FontAwesome5 name="arrow-left" style={styles.icon} size={22} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={handleEditClothing}>
                                            <MaterialIcons name={editClothing === true ? "close" : "edit"} size={22} style={styles.icon} />
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity style={{ position: 'absolute', right: 10, bottom: 10 }} onPress={handleFavClothing}>
                                        <Animated.View style={favClothingStyle}>
                                            <MaterialIcons name={favoriteValue === true ? "favorite" : "favorite-border"} color={favoriteValue === true ? "red" : styles.icon.color} size={26} />
                                        </Animated.View>
                                    </TouchableOpacity>
                                </ImageBackground>
                            </Animated.View>

                            {editClothing === true &&
                                <ScrollView>
                                    <View style={{ marginTop: 20 }}>
                                        <Text>Teste</Text>
                                    </View>
                                </ScrollView>
                            }
                        </View>
                    </Modal>
                </View>
            )}
        </View>
    )
});

const styles = StyleSheet.create({
    itemContainer: {
        margin: 5,
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    imageContainer: {
        height: width * 0.25,
        width: width * 0.25,
        borderRadius: 5,
        overflow: 'hidden'
    },
    image: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        padding: 5
    },
    modalContent: {
        backgroundColor: "#fff",
        height: "75%",
        width: "90%",
        borderRadius: 10,
        padding: 10
    },
    icon: {
        color: "rgba(0, 0, 0, 0.70)",
    }
});
