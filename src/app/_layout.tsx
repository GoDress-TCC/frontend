import { Stack } from "expo-router";
import { ClothesProvider } from '@/src/services/contexts/clothesContext';
import { CatsProvider } from "../services/contexts/catsContext";
import { useFonts } from "expo-font"
import fonts from "../services/fonts";

export default function Layout() {
    const [fontsLoaded] = useFonts(fonts);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <ClothesProvider>
        <CatsProvider>
            <Stack >
                <Stack.Screen name="index" options={{ headerShown: false }} />

                <Stack.Screen name="auth/login" options={{ title: "Login" , headerShown:false}}  />
                <Stack.Screen name="auth/register" options={{ title: "Registro" , headerShown:false}} />
                <Stack.Screen name="auth/forgotPassword/sendEmail" options={{ title: "Esqueci a senha" , headerShown:false}} />
                <Stack.Screen name="auth/forgotPassword/resetPassword" options={{ headerShown: false }} />

                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

                <Stack.Screen name="clothes/addClothing" options={{ headerShown: false }} />
                <Stack.Screen name="clothes/favClothes" options={{ title: "Roupas favoritas" , headerShown:false}} />
            </Stack>
        </CatsProvider>
        </ClothesProvider>
    );
}