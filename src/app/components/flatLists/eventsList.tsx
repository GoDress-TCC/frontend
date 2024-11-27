import React, { useEffect, useState } from "react";
import { View, FlatList, TouchableOpacity, StyleSheet, Dimensions, Image, Text } from "react-native";
import dayjs from "dayjs";

import { Event, Outfit } from "@/src/services/types/types";
import { globalColors, globalStyles } from "@/src/styles/global";
import { useOutfits } from "@/src/services/contexts/outfitsContext";
import { autoCapitalizer } from "../../events/addEvent";

const { width } = Dimensions.get('window');

const EventsList = React.memo(({
    events,
}:
    {
        events: Event[],
    }) => {

    const { outfits } = useOutfits();

    return (
        <View style={{ alignItems: "center", flex: 1 }}>
            <FlatList
                data={[...events].reverse()}
                renderItem={({ item }) => {
                    const outfit = outfits.find(outfit => outfit._id === item.outfitId);

                    return (
                        <TouchableOpacity style={[styles.tinyStyledContainer, { width: "100%", marginBottom: 20, paddingVertical: 20, paddingHorizontal: 20 }]}>
                            <View style={{ flexDirection: "row", gap: 20 }}>
                                {item.image &&
                                    <Image source={{ uri: item.image }} style={{ width: 60, height: 60, borderRadius: 100 }} />
                                }
                                <View style={{ flexDirection: "column" }}>
                                    <Text style={[globalStyles.subTitle, { color: globalColors.primary }]}>{item.name}</Text>
                                    <Text>{`Dia: ${dayjs(item.date).format("MMM D, YYYY HH:mm")}`}</Text>
                                    <Text>{`Local: ${autoCapitalizer(item.location)}`}</Text>
                                </View>
                            </View>

                            {outfit && outfit.clothingId.length > 0 &&
                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                    <Image source={{ uri: outfit.clothingId[0].image }} style={styles.image} />
                                    <Image source={{ uri: outfit.clothingId[1].image }} style={styles.image} />
                                    <Image source={{ uri: outfit.clothingId[2].image }} style={styles.image} />
                                </View>
                            }
                        </TouchableOpacity>
                    )
                }}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                style={{ width: "100%" }}
            />
        </View>
    )
});

const styles = StyleSheet.create({
    tinyStyledContainer: {
        backgroundColor: "#fff",
        padding: 5,
        borderRadius: 10,
        gap: 5,
        borderColor: globalColors.primary,
        borderBottomWidth: 5,
        borderWidth: 1,
    },
    imageContainer: {
        borderRadius: 5,
        overflow: 'hidden',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 5,
        margin: 5,
    }
})

export default EventsList;