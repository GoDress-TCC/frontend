import { View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Teste1 from './teste';
import Teste2 from './teste2';

const Tab = createMaterialTopTabNavigator();

export default function TopTabs() {
    return (
        <View style={{ marginTop: 20 }}>
            <Tab.Navigator>
                <Tab.Screen name="Teste 1" component={Teste1} />
                <Tab.Screen name="Teste 2" component={Teste2} />
            </Tab.Navigator >
        </View>
    );
}