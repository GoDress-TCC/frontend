import React, { useEffect } from "react";
import { View, FlatList, TouchableOpacity, StyleSheet, Dimensions, Image, Text } from "react-native";
const { width } = Dimensions.get('window');

import { Outfit } from "@/src/services/types/types";

const OutfitsList = React.memo(({
    outfits,
    listOrientation = "vertical",
}:
    {
        outfits: Outfit[],
        listOrientation?: "vertical" | "horizontal",
    }) => {

    return (
        <View style={{ alignItems: "center", flex: 1 }}>
            <FlatList
                data={[...outfits].reverse()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.itemContainer}>
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: item.clothingId[0].image }} style={{ width: width / 2.5, height: width / 2.5 }} />
                            <Image source={{ uri: item.clothingId[1].image }} style={{ width: width / 2.5, height: width / 2.5 }} />
                            <Image source={{ uri: item.clothingId[2].image }} style={{ width: width / 2.5, height: width / 2.5 }} />
                        </View>

                        <Text>{item.name}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item._id}
                numColumns={listOrientation !== "horizontal" ? 2 : 0}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                horizontal={listOrientation === "horizontal"}
            />
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
        borderRadius: 5,
        overflow: 'hidden',
    },
});

export default OutfitsList;