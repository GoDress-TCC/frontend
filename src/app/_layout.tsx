import { Stack } from "expo-router";
import { ClothesProvider } from '@/src/services/contexts/clothesContext';
import { CatsProvider } from "../services/contexts/catsContext";

export default function Layout() {
    return (
        <ClothesProvider>
        <CatsProvider>
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />

                <Stack.Screen name="auth/login" options={{ title: "Login" }} />
                <Stack.Screen name="auth/register" options={{ title: "Registro" }} />
                <Stack.Screen name="auth/forgotPassword/sendEmail" options={{ title: "Esqueci a senha" }} />
                <Stack.Screen name="auth/forgotPassword/resetPassword" options={{ headerShown: false }} />

                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

                <Stack.Screen name="clothes/addClothing" options={{ headerShown: false }} />
                <Stack.Screen name="clothes/favClothes" options={{ title: "Roupas favoritas" }} />
            </Stack>
        </CatsProvider>
        </ClothesProvider>
    );
}