import React, {useState} from 'react';
import useAuth from '@/src/components/Auth';
import {ActivityIndicator, Text, TextInput, TouchableOpacity, View} from "react-native";

export default function LoginScreen () {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const { loading, signInWithEmail, signUpWithEmail } = useAuth();

    const handleSignIn = () => {
        signInWithEmail(email, password);
    };

    const handleSignUp = () => {
        signUpWithEmail(email, password);
    };

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
                    onPress={() => handleSignIn()}
                    disabled={loading}
                >
                    <Text className="text-white text-center font-semibold text-lg">
                        {loading ?
                            (<View className="flex-1 justify-center items-center">
                                <ActivityIndicator color="#FFFFFF" />
                            </View>) :
                            "Sign In"}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="bg-gray-400 rounded-lg p-4"
                    onPress={() => handleSignUp()}
                >
                    <Text className="text-white text-center font-semibold text-lg">
                        {loading ? (<ActivityIndicator color="#fff" />) : "Sign Up"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}