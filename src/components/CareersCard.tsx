import React from 'react';
import { View, Text,TouchableOpacity } from 'react-native';

interface CareerCardProps {
    data: {
        id: string,
        name: string,
        code: string,
        faculty: string,
        duration_semesters: number,
        is_active: boolean,
        created_at: string,
        updated_at: string
    }
}

const CareersCard: React.FC<CareerCardProps> = ({
                                                data
                                                }) => {
    return (
        <TouchableOpacity
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-3"
        >
            <View className="flex-1 flex-col mb-2 gap-5">
                <Text className="text-lg font-medium text-gray-900">{data.name}</Text>
            </View>
            <View className="mb-2">
                <Text className="text-base font-medium text-gray-900">Codigo</Text>
                <Text className="text-base text-gray-900">{data.code}</Text>
            </View>
            <View>
                <Text className="text-base font-medium text-gray-900">Facultad</Text>
                <Text className="text-base text-gray-900">{data.faculty}</Text>
            </View>
        </TouchableOpacity>
    )
};

export default CareersCard;