import { Stack } from "expo-router";
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

import { ClothesProvider } from '@/src/services/contexts/clothesContext';
import { CatsProvider } from "../services/contexts/catsContext";
import { useFonts } from "expo-font"
import fonts from "../services/fonts";
import { UserProvider } from "../services/contexts/userContext";
import { globalColors } from "../styles/global";
import { OutfitsProvider } from "../services/contexts/outfitsContext";

export default function Layout() {

    const toastConfig = {
        success: (props: any) => (
          <BaseToast
            {...props}
            style={{ borderLeftColor: globalColors.primary }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            position='bottom'
            text1Style={{
              fontSize: 14,
              fontWeight: '400',
            }}            
          />
        ),

        error: (props: any) => (
          <ErrorToast
            {...props}
            text1Style={{
              fontSize: 14,
              fontWeight: '400',
            }}
          />
        ),
      };
    
    const [fontsLoaded] = useFonts(fonts);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <UserProvider>
        <OutfitsProvider>
        <ClothesProvider>
        <CatsProvider>
            <Stack >
                <Stack.Screen name="index" options={{ headerShown: false }} />

                <Stack.Screen name="auth/login" options={{ headerShown: false }}  />
                <Stack.Screen name="auth/register" options={{ headerShown: false }} />
                <Stack.Screen name="auth/forgotPassword/sendEmail" options={{ headerShown: false }} />
                <Stack.Screen name="auth/forgotPassword/resetPassword" options={{ headerShown: false }} />

                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

                <Stack.Screen name="clothes/favClothes" options={{ headerShown: false }} />
                <Stack.Screen name="clothes/addClothing" options={{ headerShown: false }} />

                <Stack.Screen name="outfits/generateOutfit" options={{ headerShown: false }} />
                <Stack.Screen name="outfits/outfits" options={{ headerShown: false}} />

                <Stack.Screen name="laundry/dirtyClothes" options={{ headerShown: false }} />
            </Stack>
        </CatsProvider>
        </ClothesProvider>
        </OutfitsProvider>
        <Toast config={toastConfig} />
        </UserProvider>
    );
}