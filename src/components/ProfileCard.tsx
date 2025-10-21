import React, { useState, useEffect } from 'react';
import {Ionicons} from "@expo/vector-icons";
import {View, Text, Alert, TouchableOpacity} from 'react-native';
import useAuth from "@/src/components/Auth";
import {router} from "expo-router";
import Feather from "@expo/vector-icons/Feather";

interface ProfileCardProps {
    item: {
        id: string;
        name?: string;
        email?: string;
        avatar_url?: string;
        created_at?: string;
        role?: string;
        updated_at?: string;
    };
    onPress?: (item: any) => void;
    currentUserId?: string;
    showStudentInfo?: boolean;
    showStatusBadge?: boolean;
    variant?: 'default' | 'compact';
}

const ProfileCard: React.FC<ProfileCardProps> = ({
                                                    item,
                                                    onPress,
                                                 }) => {
    const { signOut } = useAuth();

    const handleOnPress = () => {
        if (onPress) onPress(item);
        else {
            Alert.alert("On press", "Press")
        }
    }

    return (
        <View className="flex-1 gap-10 bg-white p-5">
            <View className="flex justify-between flex-row items-center">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back-outline" color="#333333" size={24}/>
                </TouchableOpacity>
                <Text className="font-bold text-xl text-gray-800">
                    Mi perfil
                </Text>
                <Ionicons name="settings-outline" color="#333333" size={24} />
            </View>
            <View className="flex flex-row items-center gap-5">
                <View className="w-36 h-36 bg-gray-400 rounded-full"></View>
                <View className="flex flex-col items-start gap-5">
                    <View>
                        <Text className="text-xl font-semibold text-gray-800">{item.name}</Text>
                        <Text className="text-md font-semibold text-gray-800">{item.email}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={handleOnPress}
                        className="bg-green-600 rounded px-7 py-3"
                    >
                        <Text className="text-white font-semibold">Editar Perfil</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View>
                <TouchableOpacity
                    className="flex gap-3 justify-between flex-row"
                    onPress={signOut}
                >
                    <View className="flex flex-row gap-5 items-center">
                        <Feather name="log-out" color="#ef4444" size={24} />
                        <Text className="font-semibold text-red-500 text-xl">
                            Salir
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward-outline" color="#ef4444" size={24}></Ionicons>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ProfileCard;