import React, { useMemo, useState, useCallback } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { router } from 'expo-router';

import { useClothes } from '@/src/services/contexts/clothesContext';
import { clothingKind } from '@/src/services/local-data/pickerData';
import { globalColors, globalStyles } from '@/src/styles/global';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ClothesList from '../components/flatLists/clothesList';

const { width } = Dimensions.get('window');

export default function Clothes() {
    const [index, setIndex] = useState(0);
    const { clothes } = useClothes();

    const filteredClothes = useMemo(() => clothes.filter(item => item.dirty === false || item.dirty === undefined), [clothes]);
    const dirtyClothes = useMemo(() => clothes.filter(item => item.dirty === true), [clothes]);

    const routes = useMemo(() => [
        { key: 'all', title: 'Tudo' },
        ...clothingKind.map(item => ({ key: item.value, title: item.label }))
    ], []);

    const filterClothes = useCallback((kind: string) => {
        if (kind === 'all') return filteredClothes;
        return filteredClothes.filter(item => item.kind === kind);
    }, [filteredClothes]);

    const renderScene = useCallback(({ route }: { route: { key: string, title: string } }) => {
        const filtered = filterClothes(route.key);
        if (filtered.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                        {`Você não possui ${route.title.toLowerCase().endsWith("a") ? "nenhuma" : "nenhum"} ${route.title !== "Tudo" ? route.title.toLowerCase() : "roupa"} disponível no momento`}
                    </Text>
                </View>
            );
        }
        return (
            <ClothesList
                clothes={filtered}
                canOpen={true}
                clothingBg="#fff"
                canSelect={true}
                operations={true}
            />
        );
    }, [filterClothes]);

    return (
        <View style={globalStyles.globalContainerForLists}>
            <View style={styles.header}>
                <Text style={globalStyles.mainTitle}>Armário</Text>
                <View style={styles.headerButtons}>
                    <TouchableOpacity
                        onPress={() => router.navigate('/outfits/outfits')}
                        style={[globalStyles.tinyStyledContainer, styles.buttonContainer]}
                    >
                        <MaterialCommunityIcons name="hanger" size={24} />
                        <Text>Outfits</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => router.navigate('/laundry/dirtyClothes')}
                        style={[globalStyles.tinyStyledContainer, styles.buttonContainer]}
                    >
                        {dirtyClothes.length > 0 && (
                            <View style={styles.dirtyBadge}>
                                <Text style={styles.dirtyBadgeText}>
                                    {dirtyClothes.length < 10 ? '0' : ''}
                                    {dirtyClothes.length < 100 ? dirtyClothes.length : '+99'}
                                </Text>
                            </View>
                        )}
                        <MaterialCommunityIcons name="washing-machine" size={24} />
                        <Text>Lavanderia</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width }}
                renderTabBar={props => (
                    <TabBar
                        {...props}
                        indicatorStyle={{ backgroundColor: globalColors.primary }}
                        style={{
                            backgroundColor: globalColors.secundary,
                            borderBottomWidth: 1,
                            borderBottomColor: 'rgba(0, 0, 0, 0.1)',
                            elevation: 0,
                            marginHorizontal: 20,
                            marginBottom: 20,
                            marginTop: 8
                        }}
                        labelStyle={{
                            color: 'black',
                            fontSize: 14,
                            textTransform: 'none',
                        }}
                        activeColor="black"
                        inactiveColor="gray"
                        tabStyle={styles.tabStyle}
                        scrollEnabled
                    />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20,
    },
    headerButtons: {
        flexDirection: 'row',
        gap: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    dirtyBadge: {
        position: 'absolute',
        right: -5,
        top: -10,
        backgroundColor: '#fff',
        borderRadius: 5,
        paddingHorizontal: 4,
        alignItems: 'center',
    },
    dirtyBadgeText: {
        color: globalColors.primary,
        fontSize: 14,
        fontWeight: '500',
    },
    tabBar: {
        backgroundColor: 'rgba(52, 52, 52, alpha)',
        marginTop: 5,
        elevation: 0,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.37)',
        marginHorizontal: 20,
        marginBottom: 20,
    },
    tabIndicator: {
        backgroundColor: globalColors.primary,
    },
    label: {
        fontSize: 14,
        textTransform: 'none',
    },
    tabStyle: {
        width: 'auto',
        paddingHorizontal: 12,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 50,
    },
    emptyText: {
        textAlign: 'center',
    },
});
