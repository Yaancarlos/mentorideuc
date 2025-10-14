import {useEffect, useState} from "react";
import {ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View, TextInput, Modal} from "react-native";
import {router} from "expo-router";
import {Ionicons} from '@expo/vector-icons';
import {supabase} from "@/lib/supabase";
import {useCurrentUser} from "@/lib/hooks";
import {cancelEvent} from "@/lib/api/caledar";
import {formatDate, formatDateTime} from "@/src/utils/date";
import {getSessionColor} from "@/src/utils/tagColors";
import SearchFilter from "@/src/components/Search";

export default function SessionsListScreenTutor() {
    const { profile, loading: loadingUser } = useCurrentUser();
    const [repositories, setRepositories] = useState<any[]>([]);
    const [filteredRepositories, setFilteredRepositories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (profile?.id && profile?.role === "tutor") {
            loadRepositories();
        }
    }, [profile?.id]);

    async function loadRepositories() {
        try {
            setLoading(true);

            const { data: events, error: eventsError } = await supabase
                .from("calendar_events")
                .select(`
                id,
                title,
                description,
                status,  
                start_time,
                end_time,
                student:profiles!calendar_events_student_id_fkey(name)
            `)
                .eq("tutor_id", profile?.id as string)
                .order("created_at", { ascending: false });

            if (eventsError) throw eventsError;

            const eventIds = events.map(event => event.id);
            const { data: repositories, error: reposError } = await supabase
                .from("repository")
                .select("id, status, booking_id")
                .in("booking_id", eventIds);

            if (reposError) throw reposError;

            const eventsWithRepos = events.map(event => ({
                ...event,
                repository: repositories?.find(repo => repo.booking_id === event.id) || []
            }));

            setRepositories(eventsWithRepos || []);
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    }

    function navigateToRepository(repositoryId: string) {
        router.push(`/(tutor)/sessions/${repositoryId}`);
    }

    async function handleDeleteSession(eventId: string, profile: string) {
        try {
            setLoading(true);

            await cancelEvent(eventId, profile);

            Alert.alert("Sesion eliminada");
            loadRepositories();
        } catch (error: any) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    if (loading || loadingUser) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text className="mt-2 text-gray-500">Cargando agenda...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 p-5">
            <Text className="text-2xl font-bold w-full text-center mb-4">Mi Agenda</Text>
            <SearchFilter
                data={repositories}
                onFilteredDataChange={setFilteredRepositories}
                searchFields={['title', 'description', 'student.name']}
                filterConfig={{
                    repositoryStatus: true,
                    sessionStatus: true
                }}
                placeholder="Buscar sesiones..."
                emptyMessage="No se encontraron sesiones"
            />
            <FlatList
                data={filteredRepositories}
                contentContainerStyle={{
                    flexGrow: 1,
                }}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        className={`bg-white p-4 rounded-lg mb-3 border border-gray-200`}
                        onPress={() => {
                            if (item.status === 'booked' && item.repository?.id) {
                                navigateToRepository(item.repository.id);
                            } else {
                                Alert.alert(
                                    "Información",
                                    item.status === 'available'
                                        ? "Esta sesión está disponible para ser reservada"
                                        : "Esta sesión no tiene repositorio asociado"
                                );
                            }
                        }}
                        onLongPress={() => {
                            Alert.alert(
                                "Opciones de Sesión",
                                `¿Qué quieres hacer con "${item.title}"?`,
                                [
                                    { text: "Salir", style: "cancel" },
                                    { text: "Ver Detalles", onPress: () => navigateToRepository(item.repository?.id) },
                                    { text: "Cancelar Sesión", style: "destructive", onPress: () => handleDeleteSession(item.id, profile?.id as string) },
                                ]
                            );
                        }}
                        delayLongPress={500}
                    >
                        <Text className="font-semibold text-2xl">
                            {item?.title || "Session"}
                        </Text>

                        {item.status === 'booked' && item.student?.name && (
                            <View className="flex-row my-3 items-center">
                                <Ionicons name="person-outline" size={17} color="#6B7280" />
                                <Text className="text-gray-600 ml-2">
                                    Estudiante: {item.student.name}
                                </Text>
                            </View>
                        )}

                        {item.status === 'available' && (
                            <View className="flex-row my-3 items-center bg-blue-50 rounded-lg p-2">
                                <Ionicons name="information-circle-outline" size={17} color="#3B82F6" />
                                <Text className="text-blue-600 ml-2 text-sm">
                                    Sesión disponible para reservar
                                </Text>
                            </View>
                        )}
                        {item.status === 'canceled' && (
                            <View className="flex-row my-3 items-center bg-red-50 rounded-lg p-2">
                                <Ionicons name="close-circle-outline" size={17} color="#EF4444" />
                                <Text className="text-red-600 ml-2 text-sm">
                                    Sesión cancelada
                                </Text>
                            </View>
                        )}
                        <Text className="text-gray-500 text-sm">
                            {item?.description || "No descripción"}
                        </Text>

                        <View className="flex flex-row justify-end gap-3 my-3 items-center">
                            <View className="flex flex-row items-center gap-2">
                                <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                                <Text className="text-gray-600">
                                    {item?.start_time ?
                                        formatDate(item?.start_time, true) :
                                        "No date"
                                    }
                                </Text>
                            </View>
                            <View className="flex flex-row items-center gap-2">
                                <Ionicons name="time-outline" size={16} color="#6B7280" />
                                <Text className="text-gray-600">
                                    {(item?.start_time && item?.end_time) ?
                                        formatDateTime(item?.start_time, item?.end_time) :
                                        "No date"
                                    }
                                </Text>
                            </View>
                        </View>

                        <View className={`flex flex-row items-center ${
                            item.status === "canceled" ? "justify-end" : "justify-end"
                        }`}>
                            {item?.status && (
                                <View className={`rounded-md px-2 py-1 ${getSessionColor(item?.status)}`}>
                                    <Text className="text-white text-xs">
                                        {item?.status}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <View className="flex-1 items-center justify-center py-10 px-6">
                        <Ionicons name="document-text-outline" size={48} color="#9CA3AF" />
                        <Text className="text-gray-500 max-w-60 mt-2 text-center">
                            {repositories.length === 0
                                ? "No hay sesiones programadas"
                                : "No se encontraron sesiones con los filtros aplicados"
                            }
                        </Text>
                    </View>
                }
            />
        </View>
    );
}