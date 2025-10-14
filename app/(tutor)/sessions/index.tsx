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
import SessionCard from "@/src/components/SessionCard";

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

    const handleCardPress = (item: any) => {
        if (item.status === 'booked' && item.repository?.id) {
            router.push(`/(tutor)/sessions/${item.repository.id}`);
        } else {
            Alert.alert("Información", `Esta sesión está ${item.status}`);
        }
    };

    const handleLongPress = (item: any) => {
        Alert.alert(
            "Opciones de Sesión",
            `¿Qué quieres hacer con "${item.title}"?`,
            [
                { text: "Salir", style: "cancel" },
                { text: "Ver Detalles", onPress: () => {
                        if (item.status === 'booked' && item.repository?.id) {
                            handleCardPress(item);
                        }
                    }},
                { text: "Cancelar Sesión", style: "destructive", onPress: () => {handleDeleteSession(item?.id, profile?.id as string)} },
            ]
        );
    }

    if (loading || loadingUser) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text className="mt-2 text-gray-500">Cargando...</Text>
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
                    <SessionCard
                        item={item}
                        onPress={handleCardPress}
                        onLongPress={handleLongPress}
                        currentUserId={profile?.id}
                        showStudentInfo={true}
                        variant="default"
                    />
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