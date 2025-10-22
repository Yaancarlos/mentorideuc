import React, {useEffect, useState} from "react";
import {ActivityIndicator, Alert, Button, FlatList, Text, TextInput, TouchableOpacity, View} from "react-native";
import {cancelEvent, createEvent} from "@/lib/api/caledar";
import {supabase} from "@/lib/supabase";
import {useCurrentUser} from "@/lib/hooks";
import {EventStatus} from "@/src/types/auth";
import {Ionicons} from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import {formatDate, formatDateTime} from "@/src/utils/date";
import Loading from "@/src/components/Loading";

export default function MyCalendarScreen() {
    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState<any[]>([])
    const [start, setStart] = useState<string>('');
    const [end, setEnd] = useState<string>('');
    const { profile, loading: sessionLoading } = useCurrentUser();

    async function loadEvents() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("calendar_events")
                .select("*")
                .eq("tutor_id", profile?.id)
                .eq("status", EventStatus.AVAILABLE)
                .order("start_time");

            if (error) throw error;
            setEvents(data || []);
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (profile?.id && profile.role === "tutor") {
            loadEvents();
        }
    }, [profile?.id])

    async function addEvent() {
        try {
            if (!profile?.id) {
                Alert.alert("Error", "Profile not loaded");
                return;
            }

            if (!start || !end) {
                Alert.alert("Error", "Ingresa hora de empiezo y fin");
                return;
            }

            const startDate = new Date(start);
            const endDate = new Date(end);

            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                Alert.alert("Error", "Formato de fecha inválido");
                return;
            }

            if (startDate >= endDate) {
                Alert.alert("Error", "La hora de fin debe ser después de la hora de inicio");
                return;
            }

            setLoading(true);
            await createEvent(profile.id, startDate.toISOString(), endDate.toISOString());
            Alert.alert("Éxito", "Evento creado");
            setStart("")
            setEnd("")
            loadEvents();
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleCancel(eventId: string, profileId: string) {
        try {
            if (!profile?.id) {
                Alert.alert("Error", "Profile not loaded");
                return;
            }

            setLoading(true);
            await cancelEvent(eventId, profileId);
            Alert.alert("Éxito", "Evento cancelado");
            loadEvents();
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading || sessionLoading) {
        return <Loading />;
    }
    return (
        <View className="flex-1 bg-white pt-20 px-5">
            {profile?.role === "tutor" && (
                <View>
                    <Text className="text-2xl font-semibold mb-4">Agregar una nueva sesión</Text>
                    <View className="flex mb-5 flex-col gap-3">
                        <TextInput
                            className="border border-solid border-gray-300 rounded p-3"
                            placeholder="Inicio (ej: 2024-09-25 14:30)"
                            value={start}
                            onChangeText={setStart}
                        />
                        <TextInput
                            className="border border-solid border-gray-300 rounded p-3"
                            placeholder="Fin (ej: 2024-09-25 15:30)"
                            placeholderTextColor="#333"
                            value={end}
                            onChangeText={setEnd}
                        />
                        <TouchableOpacity
                            className="bg-blue-500 rounded-lg p-4"
                            onPress={() => addEvent()}
                        >
                            <Text className="text-white text-center font-semibold text-lg">
                                Agregar Horario
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
            <FlatList
                data={events}
                contentContainerStyle={{
                    flexGrow: 1,
                }}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        className={`bg-white p-4 rounded-lg mb-3 border flex-1 flex-row justify-between items-center border-gray-200`}
                    >
                        <View className="flex flex-col my-3 items-start">
                            <View className="flex flex-row items-center gap-2">
                                <Text className="text-gray-800 font-semibold text-lg">
                                    {item?.start_time ?
                                        formatDate(item?.start_time, true): ""
                                    }
                                </Text>
                            </View>
                            <View className="flex flex-row items-center gap-2">
                                <Text className="text-gray-600">
                                    {(item?.start_time && item?.end_time) ?
                                        formatDateTime(item?.start_time, item?.end_time) : "Null"
                                    }
                                </Text>
                            </View>
                        </View>

                        <View className="flex flex-col gap-1">
                            <View className={`flex flex-row items-center justify-end`}>
                                {item?.status && (
                                    <Text className="text-gray-500 font-semibold text-xs">
                                        {item?.status == EventStatus.AVAILABLE ? "Disponible" : "Null"}
                                    </Text>
                                )}
                            </View>
                            <TouchableOpacity
                                className="bg-red-500 rounded-lg px-4 py-2"
                                onPress={() => handleCancel(item.id, profile?.id as string)}
                            >
                                <Text className="font-semibold text-center text-base text-white">Cancelar</Text>
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
    )
}