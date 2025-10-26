import React, { useState, useEffect } from 'react';
import {View, Text, FlatList, RefreshControl} from 'react-native';
import Loading from "@/src/components/Loading";
import {getCareers} from "@/lib/api/admin";
import CareersCard from "@/src/components/CareersCard";
import {Search} from "lucide-react-native";
import SearchFilter from "@/src/components/Search";
import Entypo from "@expo/vector-icons/Entypo";

interface CareerProps {
    id: string,
    name: string,
    code: string,
    faculty: string,
    duration_semesters: number,
    is_active: boolean,
    created_at: string,
    updated_at: string
}

const Careers = () => {
    const [careers, setCareers] = useState<CareerProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [filteredCareers, setFilteredCareers] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        loadCareers();
    };

    const loadCareers = async () => {
        try {
            const response = await getCareers();
            setCareers(response || []);
        } catch (error: any) {
            console.log(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useEffect(() => {
        loadCareers();
    }, []);

    if (loading && !refreshing) {
        return <Loading />;
    }

    return (
        <View className="flex-1 bg-white pt-20 px-5">
            <Text className="text-2xl text-center font-semibold text-gray-900 mb-5">Carreras</Text>
            <SearchFilter
                data={careers}
                onFilteredDataChange={setFilteredCareers}
                searchFields={["name", "faculty", "code"]}
                filterConfig={{
                    repositoryStatus: false,
                    sessionStatus: false
                }}
                placeholder="Buscar carreras..."
                emptyMessage="No se encontraron sesiones"
            />
            <FlatList
                data={filteredCareers}
                keyExtractor={(item) => item.id}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#10B981']}
                        tintColor={'#10B981'}
                    />
                }
                renderItem={({ item }) => (
                    <CareersCard
                        data={item}
                    />
                )}
                ListEmptyComponent={
                    <View className="flex-1 items-center justify-center py-10 px-6">
                        <Entypo name="emoji-sad" size={38} color="#9CA3AF" />
                        <Text className="mt-3 text-gray-500">No se encontraron carreras</Text>
                    </View>
                }
            >
            </FlatList>
        </View>
    )
};

export default Careers;