import React, { useEffect, useState } from 'react';
import { respondToBooking } from "@/lib/api/caledar";
import {View, Text, ActivityIndicator, FlatList, TouchableOpacity, Alert} from 'react-native';
import { supabase } from "@/lib/supabase";
import { useCurrentUser } from "@/lib/hooks";
import { EventStatus } from "@/src/types/auth";
import {Ionicons} from "@expo/vector-icons";
import Entypo from '@expo/vector-icons/Entypo'


const PendingSessions = () => {
    const { profile,loading: profileLoading } = useCurrentUser();
    const [pendingSessions, setPendingSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (profile?.id) {
            getPendingSession();
        }
    }, [profile?.id]);

    const getPendingSession = async () => {
        try {
            setLoading(true);

            const { data, error } = await supabase
                .from("calendar_events")
                .select("*")
                .eq("tutor_id", profile?.id)
                .eq("status", EventStatus.PENDING)
                .order("created_at", {ascending: false});

            if (error) throw error;
            setPendingSessions(data || []);
        } catch (error: any) {

        } finally {
            setLoading(false);
        }
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

    const handlePending = async (eventId: string, accept: boolean) => {
        try {
            if (!profile?.id) {
                Alert.alert("Error", "User profile not found");
                return;
            }

            setLoading(true);

            const response = await respondToBooking(eventId, accept);

            if (accept) {
                Alert.alert("Exito", "Haz reservado con exito la sesion");
            } else {
                Alert.alert("Exito", "Haz eliminado la sesion");
            }

            getPendingSession();
        } catch (error: any) {

        } finally {
            setLoading(false);
        }
    }

    if (loading || profileLoading) return (
        <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="mt-2 text-gray-500">Cargando...</Text>
        </View>
    );

    return (
        <View className="flex-1 p-5">
            <Text className="text-2xl font-bold w-full text-center mb-4">Sesiones Pendientes</Text>
            <FlatList
                data={pendingSessions}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{
                    flexGrow: 1,
                }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        className="bg-white p-4 rounded-lg mb-3 border border-gray-200"
                        onPress={() => {}}
                        onLongPress={() => {}}
                        delayLongPress={500}
                    >
                        <Text className="font-semibold text-xl">
                            {item?.title || "Session"}
                        </Text>
                        <Text className="text-gray-500 text-sm mt-2 mb-5">
                            {item?.description || "No descripcion"}
                        </Text>
                        <View className="flex flex-row w-full justify-end gap-3 items-center">
                            <View className="flex flex-row items-center gap-2 ">
                                <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                                <Text className="text-gray-600">
                                    {item?.start_time ?
                                        new Date(item?.start_time).toLocaleString().split(', ')[0] :
                                        "No date"
                                    }
                                </Text>
                            </View>
                            <View className="flex flex-row items-center gap-2 ">
                                <Ionicons name="time-outline" size={16} color="#6B7280" />
                                <Text className="text-gray-600">
                                    {(item?.start_time && item?.end_time) ?
                                        formatTimeRange(item?.start_time, item?.end_time) :
                                        "No date"
                                    }
                                </Text>
                            </View>
                        </View>
                        <View className="flex mt-5 flex-row gap-5">
                            <TouchableOpacity
                                className="rounded p-3 grow bg-white border border-solid border-blue-500"
                                onPress={() => handlePending(item.id, false)}
                            >
                                <Text className="text-blue-500 font-semibold text-center text-base">Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="rounded p-3 grow bg-blue-500"
                                onPress={() => handlePending(item.id, true)}
                            >
                                <Text className="text-white text-center font-semibold text-base">Reservar</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <View className="flex-1 items-center justify-center py-10 px-6">
                        <Entypo name="emoji-sad" size={38} color="#9CA3AF" />
                        <Text className="mt-3 text-gray-500">No tienes sesiones pendientes</Text>
                    </View>
                }
            />
        </View>
    );
};

export default PendingSessions;