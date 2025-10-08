import { useEffect, useState } from "react";
import {View, Text, Button, FlatList, ActivityIndicator, TextInput, Alert, TouchableOpacity} from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import { bookEvent, getTutorAvailability } from "@/lib/api/caledar";
import { useCurrentUser } from "@/lib/hooks";
import { supabase } from "@/lib/supabase";

export default function BookingScreen() {
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tutors, setTutors] = useState<any[]>([]);
    const [selectedTutor, setSelectedTutor] = useState("");
    const [availability, setAvailability] = useState<any[]>([]);
    const { profile, loading: profileLoading } = useCurrentUser();

    useEffect(() => {
        loadTutors();
    }, []);

    async function loadTutors() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("profiles")
                .select("id, name")
                .eq("role", "tutor")
                .order("name");

            if (error) throw error;
            setTutors(data || []);
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleSelectTutor(tutorId: string) {
        if (!tutorId) return;

        try {
            setLoading(true);
            setSelectedTutor(tutorId);
            const slots = await getTutorAvailability(tutorId);
            setAvailability(slots || []);
        } catch (error: any) {
            Alert.alert("Error", "No se pudieron cargar los horarios disponibles");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleBook(eventId: string) {
        try {
            setLoading(true);
            if (!profile?.id) {
                Alert.alert("Error", "User profile not found");
                return;
            }

            if (!title.trim()) {
                Alert.alert("Error", "Por favor ingresa un título para la sesión");
                return;
            }

            const newTitle = title.trim();
            const newDescription = description.trim();

            await bookEvent(eventId, profile.id, newTitle, newDescription);
            Alert.alert("Éxito", "La sesión ha sido guardada");

            // Reset form
            setTitle("");
            setDescription("");
            setAvailability([]);
        } catch (error: any) {
            Alert.alert("Error", error.message);
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
            <Text className="text-lg font-semibold mb-5">Nueva solicitud de tutoría</Text>

            <View className="flex mb-5 flex-col gap-4">
                <View>
                    <Text className="text-gray-700 mb-2 font-medium">Titulo de la sesión</Text>
                    <TextInput
                        className="border border-solid border-gray-300 rounded p-3 bg-white"
                        placeholder="Título de la sesión"
                        placeholderTextColor="#9ca3af"
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                <View>
                    <Text className="text-gray-700 mb-2 font-medium">Seleccionar tutor:</Text>
                    <Dropdown
                        data={tutors.map(tutor => ({
                            label: tutor.name,
                            value: tutor.id
                        }))}
                        labelField="label"
                        valueField="value"
                        placeholder="Selecciona un tutor"
                        value={selectedTutor}
                        onChange={(item) => handleSelectTutor(item.value)}
                        style={{
                            backgroundColor: 'white',
                            borderWidth: 1,
                            borderColor: '#d1d5db',
                            borderRadius: 8,
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                        }}
                        placeholderStyle={{
                            color: '#9ca3af',
                            fontSize: 16,
                        }}
                        selectedTextStyle={{
                            fontSize: 16,
                            color: '#1f2937',
                        }}
                        containerStyle={{
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: '#d1d5db',
                            marginTop: 4,
                        }}
                    />
                </View>

                <View>
                    <Text className="text-gray-700 mb-2 font-medium">Descripción</Text>
                    <TextInput
                        className="border border-solid border-gray-300 h-full min-h-36 max-h-36 rounded p-3 bg-white"
                        placeholder="Descripción (opcional)"
                        placeholderTextColor="#9ca3af"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                    />
                </View>
            </View>

            {availability.length > 0 && (
                <View className="flex-1">
                    <Text className="text-lg font-semibold mb-3">Horarios disponibles:</Text>
                    <FlatList
                        data={availability}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View className="mb-3 p-4 bg-white rounded-lg border gap-4 border-gray-200 flex flex-col shadow-sm">
                                <View>
                                    <Text className="text-gray-800 font-medium">
                                        {new Date(item.start_time).toLocaleString('es-ES', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </Text>
                                    <Text className="text-gray-600 text-sm">
                                        Duración: {Math.round((new Date(item.end_time).getTime() - new Date(item.start_time).getTime()) / (1000 * 60))} minutos
                                    </Text>
                                </View>
                                <View className="flex flex-row gap-5">
                                    <TouchableOpacity
                                        className="rounded p-3 grow bg-white border border-solid border-blue-500"
                                        disabled={true}
                                    >
                                        <Text className="text-blue-500 font-semibold text-center text-base">Cancelar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        className="rounded p-3 grow bg-blue-500"
                                        onPress={() => handleBook(item.id)}
                                    >
                                        <Text className="text-white text-center font-semibold text-base">Reservar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            )}

            {selectedTutor && availability.length === 0 && !loading && (
                <View className="flex-1 justify-center items-center">
                    <Text className="text-gray-500 text-center">
                        No hay horarios disponibles para este tutor en este momento.
                    </Text>
                </View>
            )}
        </View>
    );
}