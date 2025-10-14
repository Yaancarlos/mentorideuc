import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { supabase } from "@/lib/supabase";
import {useCurrentUser} from "@/lib/hooks";
import {formatDateTime} from "@/src/utils/date";
import SearchFilter from "@/src/components/Search";
import Entypo from "@expo/vector-icons/Entypo";

export default function SessionsListScreen() {
    const { profile } = useCurrentUser();
    const [repositories, setRepositories] = useState<any[]>([]);
    const [filteredRepositories, setFilteredRepositories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (profile?.id) {
            loadRepositories();
        }
    }, [profile?.id]);

    async function loadRepositories() {
        try {
            setLoading(true);

            const { data, error } = await supabase
                .from("repository")
                .select(`
                          id,
                          title,
                          description,
                          status,  
                          student:profiles!repository_student_id_fkey(name),
                          tutor:profiles!repository_tutor_id_fkey(name),
                          calendar:calendar_events!repository_booking_id_fkey(start_time, end_time, status)
                        `)
                .eq("student_id", profile?.id as string)
                .order("created_at", { ascending: false });

                if (error) console.error(error);
                setRepositories(data || [])
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    }

    function navigateToRepository(repositoryId: string) {
        router.push(`/(student)/sessions/${repositoryId}`);
    }

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text className="mt-2 text-gray-500">Cargando sesiones...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 p-5">
            <Text className="text-lg font-bold w-full text-center mb-4">Mis Tutorias</Text>
            <SearchFilter
                data={repositories}
                onFilteredDataChange={setFilteredRepositories}
                searchFields={["title", "description", "student.name"]}
                filterConfig={{
                    repositoryStatus: true,
                    sessionStatus: true
                }}
                placeholder="Buscar sesiones..."
                emptyMessage="No se encontraron sesiones"
            />
            <FlatList
                contentContainerStyle={{
                    flexGrow: 1,
                }}
                data={filteredRepositories}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        className="bg-white p-4 rounded-lg mb-3 border border-gray-200"
                        onPress={() => navigateToRepository(item.id)}
                        onLongPress={() => {}}
                        delayLongPress={500}
                    >
                        <Text className="font-semibold text-2xl">
                            {item?.title || "Session"}
                        </Text>
                        <Text className="text-gray-500 text-sm">
                            Tutor: {`Ing. ${item?.tutor?.name}` || "Unknown"}
                        </Text>
                        <Text className="text-gray-500 text-sm mt-2 mb-5">
                            {item?.description || "No descripcion"}
                        </Text>
                        <View className="flex flex-row gap-3 items-center">
                            <View className="flex flex-row items-center gap-2 ">
                                <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                                <Text className="text-gray-600">
                                    {item?.calendar?.start_time ?
                                        new Date(item?.calendar?.start_time).toLocaleString().split(', ')[0] :
                                        "No date"
                                    }
                                </Text>
                            </View>
                            <View className="flex flex-row items-center gap-2 ">
                                <Ionicons name="time-outline" size={16} color="#6B7280" />
                                <Text className="text-gray-600">
                                    {(item?.calendar?.start_time && item?.calendar?.end_time) ?
                                        formatDateTime(item?.calendar?.start_time, item?.calendar?.end_time) :
                                        "No date"
                                    }
                                </Text>
                            </View>
                        </View>
                        <Text className={`text-sm mt-1 ${
                            item.status === 'submitted' ? 'text-blue-600' :
                                item.status === 'reviewed' ? 'text-yellow-600' :
                                    item.status === 'approved' ? 'text-green-600' :
                                        'text-red-600'
                        }`}>
                            Status: {item.status}
                        </Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <View className="flex-1 items-center justify-center py-10 px-6">
                        <Entypo name="emoji-sad" size={38} color="#9CA3AF" />
                        <Text className="mt-3 text-gray-500">No se encontraron tutorias</Text>
                    </View>
                }
            />
        </View>
    );
}