import { Stack } from "expo-router";

export default function StudentLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="tabs" />
            <Stack.Screen name="index" />
            <Stack.Screen name="sessions" />
        </Stack>
    );
}