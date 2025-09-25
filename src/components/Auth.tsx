import React, { useState } from 'react'
import { Alert, View, AppState } from 'react-native'
import { supabase } from '@/lib/supabase'
import { TextInput, Text, TouchableOpacity } from "react-native";

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.

AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh()
    } else {
        supabase.auth.stopAutoRefresh()
    }
})

export default function Auth() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    async function signInWithEmail() {
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (error) Alert.alert(error.message)
        setLoading(false)
    }

    async function signUpWithEmail() {
        setLoading(true)

        if (password.length < 6) {
            Alert.alert("Contraseña debe de tener mas de 6 digitos");
            setLoading(false);
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    // Change this shit
                    name: 'Diana',
                    role: 'admin',
                }
            }
        });

        if (error) Alert.alert(error.message)
        setLoading(false)
    }

    return (
        <View className="flex justify-center align-middle h-full pt-28 px-5">
            <View className="flex flex-col mb-10 gap-5">
                <TextInput
                    className="border text-lg border-gray-400 rounded-lg px-4"
                    placeholder="correo@ucundinamarca.edu.co"
                    onChangeText={setEmail}
                    value={email}
                    keyboardType="email-address"
                    autoCapitalize='none'
                    style={{
                        fontSize: 18,
                        height: 52,
                        lineHeight: 24,
                        textAlignVertical: 'center',
                    }}
                />
                <TextInput
                    className="w-full text-lg px-4 py-4 border border-solid border-gray-400 rounded-lg"
                    onChangeText={setPassword}
                    value={password}
                    placeholder="Password"
                    secureTextEntry
                />
            </View>
            <View className="flex flex-col gap-5">
                <TouchableOpacity
                    className="bg-blue-600 rounded-lg p-4"
                    onPress={() => signInWithEmail()}
                    disabled={loading}
                >
                    <Text className="text-white text-center font-semibold text-lg">
                        {loading ? "Cargando..." : "Sign In"}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="bg-blue-600 rounded-lg p-4"
                    onPress={() => signUpWithEmail()}
                    disabled={true}
                >
                    <Text className="text-white text-center font-semibold text-lg">
                        {loading ? "Cargando..." : "Sign Up"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}