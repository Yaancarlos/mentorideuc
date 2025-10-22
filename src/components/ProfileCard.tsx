import React, { useState, useEffect } from 'react';
import {Ionicons} from "@expo/vector-icons";
import {View, Text, Alert, TouchableOpacity, FlatList, ScrollView, Image} from 'react-native';
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

    const handleSignOut = async () => {
        try {
            await signOut();
            // @ts-ignore
            router.replace('/Login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <View className="flex-1 gap-10 bg-white pt-20 pb-5 px-5">
            <View className="flex justify-between flex-row items-center">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back-outline" color="#333333" size={24}/>
                </TouchableOpacity>
                <Text className="font-bold text-xl text-gray-800">
                    Mi perfil
                </Text>
                <TouchableOpacity onPress={handleOnPress}>
                    <Ionicons name="settings-outline" color="#333333" size={24} />
                </TouchableOpacity>
            </View>
            <View className="flex flex-row items-center gap-5">
                <View className="w-36 h-36 bg-gray-400 rounded-full">
                    <Image
                        source={
                            item?.avatar_url
                                ? { uri: item.avatar_url }
                                : require("@/assets/images/user.png")
                        }
                        className="w-36 h-36 rounded-full"
                    />
                </View>
                <View className="flex flex-col items-start gap-5">
                    <View>
                        <Text className="text-xl font-semibold text-gray-800">{item.name}</Text>
                        <Text
                            className="text-md font-semibold text-gray-800"
                            numberOfLines={2}
                            ellipsizeMode="tail"
                            style={{ flexShrink: 1, flexWrap: 'wrap', maxWidth: 180 }}
                        >
                            {item.email}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={handleOnPress}
                        className="bg-green-600 rounded px-7 py-3"
                    >
                        <Text className="text-white font-semibold">Editar Perfil</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView>
                <View className="flex flex-col gap-5">
                    <TouchableOpacity
                        className="flex gap-3 justify-between flex-row"
                        disabled={true}
                    >
                        <View className="flex flex-row gap-5 items-center">
                            <Feather name="book-open" color="#111827" size={24} />
                            <Text className="font-medium text-gray-700 text-xl">
                                Sesiones
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward-outline" color="#111827" size={24} />
                    </TouchableOpacity>
                    <View className="border border-solid border-gray-400"></View>
                    <TouchableOpacity
                        className="flex gap-3  justify-between flex-row"
                        disabled={true}
                    >
                        <View className="flex flex-row gap-5 items-center">
                            <Feather name="trash-2" color="#111827" size={24} />
                            <Text className="font-medium text-gray-700 text-xl">
                                Limpiar cache
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward-outline" color="#111827" size={24} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="flex gap-3 justify-between flex-row"
                        disabled={true}
                    >
                        <View className="flex flex-row gap-5 items-center">
                            <Feather name="clock" color="#111827" size={24} />
                            <Text className="font-medium text-gray-700 text-xl">
                                Limpiar historial
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward-outline" color="#111827" size={24} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="flex gap-3 justify-between flex-row"
                        onPress={handleSignOut}
                    >
                        <View className="flex flex-row gap-5 items-center">
                            <Feather name="log-out" color="#ef4444" size={24} />
                            <Text className="font-medium text-red-500 text-xl">
                                Salir
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward-outline" color="#ef4444" size={24} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

export default ProfileCard;