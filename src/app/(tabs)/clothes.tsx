import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import FontAwesome5 from "@expo/vector-icons/FontAwesome5"

import { Clothing } from '@/src/services/types/types';
import { useClothes } from '@/src/services/contexts/clothesContext';
import { clothingKind } from '@/src/services/local-data/dropDownData';
import { ClothesList } from '../components/flatLists/clothesList';

const { width } = Dimensions.get('window');

export default function Clothes() {
    const [index, setIndex] = useState(0);
    const { clothes } = useClothes();

    const routes = useMemo(() => [
        { key: 'all', title: 'Tudo' },
        ...clothingKind.map(item => ({ key: item.value, title: item.label }))
    ], []);

    const filterClothes = (kind: string) => {
        if (kind === 'all') return clothes;
        return clothes.filter(item => item.kind === kind);
    };

    const renderScene = useMemo(() => SceneMap(
        routes.reduce((scenes, route) => {
            scenes[route.key] = () => <ClothesList clothes={filterClothes(route.key)} canOpen={true} clothingBg='#fff' />;
            return scenes;
        }, {} as Record<string, React.FC<{ clothes: Clothing[] }>>)
    ), [routes, filterClothes]);

    return (
        <View style={styles.container}>
            <View style={{ width: "100%", flexDirection: "row", alignItems: "center", paddingTop: 40, paddingHorizontal: 20 }}>
                <View style={{ width: "100%" }}>
                    <Text style={[styles.title, { textAlign: "center" }]}>Armário</Text>
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
                        indicatorStyle={{ backgroundColor: '#593C9D' }}
                        style={{ backgroundColor: "rgba(52, 52, 52, alpha)", marginTop: 5, elevation: 0, borderBottomWidth: 1, borderBottomColor: "rgba(0, 0, 0, 0.37)" }}
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
    container: {
        flex: 1,
        gap: 5
    },
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
});
