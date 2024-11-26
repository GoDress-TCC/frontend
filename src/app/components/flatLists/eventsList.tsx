import React, { useEffect } from "react";
import { View, FlatList, TouchableOpacity, StyleSheet, Dimensions, Image, Text } from "react-native";
const { width } = Dimensions.get('window');

import { Event } from "@/src/services/types/types";
import { globalColors, globalStyles } from "@/src/styles/global";
import { useOutfits } from "@/src/services/contexts/outfitsContext";

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
                    const eventOutfit = outfits.filter(outfit => outfit._id === item._id)

                    return (
                        <TouchableOpacity style={[styles.tinyStyledContainer, { width: "100%" }]}>
                            <View>
                               
                            </View>
                            <Text>{item.name}</Text>
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
        flexDirection: "row",
        gap: 5,
        borderColor: globalColors.primary,
        borderBottomWidth: 5,
        borderWidth: 1
    },
})

export default EventsList;