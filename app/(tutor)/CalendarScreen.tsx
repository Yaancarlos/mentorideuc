import React, { useEffect, useState } from "react";
import {View, Text, Button, FlatList, ActivityIndicator, Alert, TextInput, TouchableOpacity} from "react-native";
import { createEvent, cancelEvent } from "@/lib/api/caledar";
import { supabase } from "@/lib/supabase";
import { useCurrentUser } from "@/lib/hooks";
import {EventStatus} from "@/src/types/auth";

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

    async function handleCancel(eventId: string) {
        try {
            if (!profile?.id) {
                Alert.alert("Error", "Profile not loaded");
                return;
            }

            setLoading(true);
            await cancelEvent(eventId, profile.id);
            Alert.alert("Éxito", "Evento cancelado");
            loadEvents();
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading || sessionLoading) return (
        <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="mt-2 text-gray-500">Cargando calendario...</Text>
        </View>
    );
    return (
        <View className="flex-1 p-5">
            {profile?.role === "tutor" && (
                <View>
                    <Text className="text-lg mb-4">Agregar una nueva sesión</Text>
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
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View className="mb-3 p-3 border border-solid border-gray-300 rounded">
                        <Text>
                            {new Date(item.start_time).toLocaleString()} - {new Date(item.end_time).toLocaleString()}
                        </Text>
                        <Text>Estado: {item.status}</Text>
                        {item.status !== EventStatus.CANCELED && profile?.role === "tutor" && (
                            <Button
                                title="Cancelar"
                                onPress={() => handleCancel(item.id)}
                            />
                        )}
                    </View>
                )}
                ListEmptyComponent={
                    <Text className="text-center text-gray-500 mt-4">
                        {profile?.role === "tutor"
                            ? "No hay eventos programados"
                            : "No tienes eventos reservados"}
                    </Text>
                }
            />
        </View>
    )
}