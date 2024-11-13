import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import { Clothing } from '@/src/services/types/types';
import { useClothes } from '@/src/services/contexts/clothesContext';
import { clothingKind } from '@/src/services/local-data/dropDownData';
import { ClothesList } from '../components/flatLists/clothesList';
import { globalStyles } from '@/src/styles/global';

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
        <View style={{ flex: 1, paddingTop: 60 }}>

            <Text style={[globalStyles.mainTitle, { textAlign: "center" }]}>Armário</Text>

            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: width }}
                renderTabBar={props =>
                    <TabBar
                        {...props}
                        indicatorStyle={{ backgroundColor: '#593C9D' }}
                        style={{ backgroundColor: "rgba(52, 52, 52, alpha)", marginTop: 5, elevation: 0, borderBottomWidth: 1, borderBottomColor: "rgba(0, 0, 0, 0.37)", marginHorizontal: 20 }}
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
});
