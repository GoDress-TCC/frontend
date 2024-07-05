import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Tabs } from 'expo-router';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: '#593C9D' }}>
            <Tabs.Screen
                name="index"
                options={{
                    headerShown: false,
                    title: 'Home',
                    tabBarIcon: ({ color }) => <FontAwesome5 size={22} name="home" color={color} />,
                }}
            />
            <Tabs.Screen
                name="clothes"
                options={{
                    headerShown: false,
                    title: 'Clothes',
                    tabBarIcon: ({ color }) => <FontAwesome5 size={22} name="tshirt" color={color} />,
                }}
            />
        </Tabs>
    );
}