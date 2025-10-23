import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView, FlatList, Alert} from 'react-native';
import {DashboardHeader} from "@/src/components/Header";
import {InfoCard} from "@/src/components/InfoCards";
import {router} from "expo-router";
import SessionCard from "@/src/components/SessionCard";
import Entypo from "@expo/vector-icons/Entypo";
import {supabase} from "@/lib/supabase";
import { useCurrentUser } from '@/lib/hooks';
import Loading from "@/src/components/Loading";

interface InfoCard {
    title: string;
    value: string | number;
    subtitle: string;
    icon: string;
}

export default function StudentDashboard() {
    const { profile } = useCurrentUser();
    const [loading, setLoading] = useState(true);
    const [repositories, setRepositories] = useState<any[]>([]);


    useEffect(() => {
        if (profile?.id) {
            loadRepositories();
        }
    }, [profile?.id]);

    async function loadRepositories() {
        try {
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
                .eq("student_id", profile?.id as string)
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

    const handleOnPress = (item: any) => {
        Alert.alert("Informacion", `Ve a la seccion 'Sesiones' para ver la informacion '${item.title}'`)
    }

    const handleOnLongPress = () => {
        Alert.alert("Informacion", "Ve a la seccion 'Sesiones' para ver todas las opciones")
    }

    if (loading) {
        return <Loading />
    }


    const infoCards: InfoCard[] = [
        {
            title: "Progreso",
            value: "27%",
            subtitle: "+6% este mes",
            icon: "progress"
        },
        {
            title: "Tutorias Programadas",
            value: 3,
            subtitle: "1 pendiente",
            icon: "calendar"
        },
        {
            title: "Tareas pendientes",
            value: 2,
            subtitle: "1 retrasada",
            icon: "book"
        },
        {
            title: "Horas de estudio",
            value: 7,
            subtitle: "+1 hora esta semana",
            icon: "clock"
        }
    ];

    return (
        <View className="flex-1 pt-12 bg-white">
            <DashboardHeader
                name={profile?.name as string}
                role={profile?.role as string}
            />
            <ScrollView className="p-5">
                <View>
                    {infoCards.map((card, index) => (
                        <InfoCard
                            key={index}
                            title={card.title}
                            value={card.value}
                            subtitle={card.subtitle}
                            icon={card.icon}
                        />
                    ))}
                </View>
                <View className="mb-6">
                    <View className="bg-white border border-gray-300 rounded-2xl p-5 flex-row items-center justify-between">
                        <Text className="text-xl font-bold text-gray-900">
                            Accion Rapida
                        </Text>
                        <TouchableOpacity
                            className="bg-blue-500 rounded-xl px-6 py-3"
                            onPress={() => {router.push("/(student)/BookingScreen")}}
                        >
                            <Text className="text-white text-base font-semibold">
                                solicitar tutoria
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <Text className="text-2xl mb-6 font-bold text-gray-900">
                        Mis tutorias
                    </Text>
                    {repositories.length > 0 ? (
                        repositories.slice(0,3).map((item) => (
                            <SessionCard
                                key={item.id}
                                item={item}
                                currentUserId={profile?.id}
                                onPress={handleOnPress}
                                onLongPress={handleOnLongPress}
                                showStudentInfo={true}
                                variant="default"
                            />
                        ))
                    ) : (
                        <View className="flex-1 items-center justify-center py-10 px-6">
                            <Entypo name="emoji-sad" size={38} color="#9CA3AF" />
                            <Text className="mt-3 text-gray-500">No se encontraron tutorias</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}