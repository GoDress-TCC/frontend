import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { router, Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Fontisto from '@expo/vector-icons/Fontisto';

import ButtonNew from '../components/button/buttonNew';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: '#593C9D',}}>

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
            <Tabs.Screen
              name="whiteScreen" 
              options={{
                  tabBarLabel: '',
                  headerShown: false,
                  tabBarIcon: ({ color }) => <ButtonNew />, 
              }}
              listeners={{
                  tabPress: (e) => {
                      e.preventDefault();
                      router.navigate('/clothes/addClothing'); 
                  },
              }}
            />
            <Tabs.Screen
                name="events"
                options={{
                    headerShown: false,
                    title: 'Eventos',
                    tabBarIcon: ({ color }) =>  <Fontisto name="calendar" size={22} color={color} />, }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    headerShown: false,
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <FontAwesome5 size={22} name="user-alt" color={color} />,
                }}
            />
        </Tabs>
    );
}