import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { GraduationCap, Bell, Settings, BookOpen, UserRoundCog, HatGlasses } from 'lucide-react-native';
import {RepositoryStatus} from "@/src/types/auth";
import {router} from "expo-router";

interface HeaderProps {
    name: string,
    role: string,
    icon?: string,
}

export const DashboardHeader: React.FC<HeaderProps> = ({
                                                        name,
                                                        role,
                                                       }) => {
    const labelUser = [
        { value: 'student', label: "Estudiante" },
        { value: 'tutor', label: "Tutor" },
        { value: 'admin', label: "Administrador" },
        { value: '', label: "Desconocido" }
    ];

    const getBackground = (data: string) => {
        switch (data){
            case 'admin':
                return "bg-purple-50 border border-purple-500";
                case 'student':
                    return "bg-blue-50 border border-blue-500";
                    case 'tutor':
                        return "bg-green-50 border border-green-500";
                        default:
                            return "bg-gray-50 border border-gray-500";
        }
    }

    const getIcon = (icon: string) => {
        switch (icon) {
            case 'admin':
                return <UserRoundCog size={28} color="#9333ea" />;
            case 'tutor':
                return <BookOpen size={28} color="#22c55e" />;
            case 'student':
                return <GraduationCap size={28} color="#3b82f6" />;
            default:
                return <HatGlasses size={28} color=" #6b7280" />;
        }
    };

    const getColorLetter = (data: string) => {
        switch (data){
            case 'admin':
                return "text-purple-500";
            case 'student':
                return "text-blue-500";
            case 'tutor':
                return "text-green-500";
            default:
                return "text-gray-500";
        }
    }


    return (
        <View className="flex-row items-center justify-between p-5">
            <View className="flex-row items-center">
                <View className={`w-16 h-16 ${getBackground(role)} rounded-full items-center justify-center mr-3`}>
                    {getIcon(role)}
                </View>
                <View className="flex flex-col gap-1 items-start">
                    <Text className="text-base font-semibold text-gray-900">
                        {name}
                    </Text>
                    <View className={`rounded-md px-1 py-0.5 ${getBackground(role)}`}>
                        <Text className={`${getColorLetter(role)} text-sm font-medium`}>
                            {labelUser.find(user => user.value === role)?.label || "Desconocido"}
                        </Text>
                    </View>
                </View>
            </View>
            <View className="flex-row items-center gap-3">
                <TouchableOpacity className="relative w-12 h-12 bg-white border border-gray-300 rounded-full items-center justify-center">
                    <Bell size={24} color="#374151" />
                    <View className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full items-center justify-center">
                        <Text className="text-white text-xs font-bold">2</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push(`/(${role})/Profile`)}
                    className="w-12 h-12 bg-white border border-gray-300 rounded-full items-center justify-center">
                    <Settings size={24} color="#374151" />
                </TouchableOpacity>
            </View>
        </View>
    );
}