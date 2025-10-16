import { Stack } from "expo-router";

export default function StudentLayout() {
    return (
        <Stack>
            <Stack.Screen name="tabs" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="sessions" options={{ headerShown: false }} />
            <Stack.Screen name="BookingScreen" options={{ headerShown: false }}  />
            <Stack.Screen name="Profile" options={{ headerShown: false }}  />
        </Stack>
    );
}