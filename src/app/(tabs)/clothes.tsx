import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { router } from 'expo-router';

import { Clothing } from '@/src/services/types/types';
import { useClothes } from '@/src/services/contexts/clothesContext';
import { clothingKind } from '@/src/services/local-data/dropDownData';
import { globalColors, globalStyles } from '@/src/styles/global';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ClothesList from '../components/flatLists/clothesList';

const { width } = Dimensions.get('window');

export default function Clothes() {
    const [index, setIndex] = useState(0);
    const { clothes } = useClothes();

    const filteredClothes = useMemo(() => clothes.filter(item => item.dirty === false || item.dirty === undefined), [clothes]);

    const routes = useMemo(() => [
        { key: 'all', title: 'Tudo' },
        ...clothingKind.map(item => ({ key: item.value, title: item.label }))
    ], []);

    const filterClothes = (kind: string) => {
        if (kind === 'all') return filteredClothes;
        return filteredClothes.filter(item => item.kind === kind);
    };

    const renderScene = useMemo(() => SceneMap(
        routes.reduce((scenes, route) => {
            scenes[route.key] = () => <ClothesList clothes={filterClothes(route.key)} canOpen={true} clothingBg='#fff' canSelect={true} operations={true}/>;
            return scenes;
        }, {} as Record<string, React.FC<{ clothes: Clothing[] }>>)
    ), [routes, filterClothes]);

    return (
        <View style={{ flex: 1, paddingTop: 50 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 20 }}>
                <Text style={globalStyles.mainTitle}>Armário</Text>
                <View style={{ flexDirection: "row", gap: 5 }}>
                    <TouchableOpacity onPress={() => router.navigate('/')} style={styles.button}>
                        <MaterialCommunityIcons name="hanger" size={24} color={globalColors.primary} />
                        <Text>Outfits</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.navigate("/laundry/dirtyClothes")} style={styles.button}>
                        <MaterialCommunityIcons name="washing-machine" size={24} color={globalColors.primary} />
                        <Text>Lavanderia</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: width }}
                renderTabBar={props =>
                    <TabBar
                        {...props}
                        indicatorStyle={{ backgroundColor: globalColors.primary }}
                        style={{ backgroundColor: "rgba(52, 52, 52, alpha)", marginTop: 5, elevation: 0, borderBottomWidth: 1, borderBottomColor: "rgba(0, 0, 0, 0.37)", marginHorizontal: 20, marginBottom: 20 }}
                        labelStyle={styles.label}
                        scrollEnabled={true}
                        tabStyle={styles.tabStyle}
                    />
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({

    title: {
        fontWeight: "500",
        fontSize: 22,
    },
    label: {
        color: 'black',
        fontSize: 14,
        textTransform: 'none',
    },
    tabStyle: {
        width: 'auto',
        paddingHorizontal: 12,
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(52, 52, 52, 0.1)",
        padding: 5,
        borderRadius: 10,
    }
});
