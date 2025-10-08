import { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { supabase } from "@/lib/supabase";
import {useCurrentUser} from "@/lib/hooks";
import {EventStatus} from "@/src/types/auth";

export default function SessionsListScreen() {
    const { profile } = useCurrentUser();
    const [repositories, setRepositories] = useState<any[]>([]);
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

    function formatTimeRange(startTime:string, endTime:string) {
        const start = new Date(startTime);
        const end = new Date(endTime);

        const formatTime = (date:any) => {
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        };

        return `${formatTime(start)} - ${formatTime(end)}`;
    }

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text className="mt-2 text-gray-500">Loading sessions...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 p-5">
            <Text className="text-lg font-bold w-full text-center mb-4">Mis Tutorias</Text>

            <FlatList
                data={repositories}
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
                                        formatTimeRange(item?.calendar?.start_time, item?.calendar?.end_time) :
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
                    <View className="flex items-center justify-center py-10">
                        <Text className="text-gray-500">No sessions found</Text>
                    </View>
                }
            />
        </View>
    );
}