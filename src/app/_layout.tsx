import { Stack } from "expo-router";

export default function Layout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />

            <Stack.Screen name="auth/login" options={{ title: "Login" }} />
            <Stack.Screen name="auth/register" options={{ title: "Registro" }} />
            <Stack.Screen name="auth/forgotPassword/sendEmail" options={{ title: "Esqueci a senha" }} />
            <Stack.Screen name="auth/forgotPassword/resetPassword" options={{ headerShown: false }} />
            
            <Stack.Screen name="user/home" options={{ headerShown: false }}/>
        </Stack>
    );
}