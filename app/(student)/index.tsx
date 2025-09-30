import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {supabase} from "@/lib/supabase";
import useAuth from "@/src/components/Auth";

export default function StudentDashboard() {
    const {signOut } = useAuth();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Student Dashboard</Text>
            <TouchableOpacity
                className="bg-blue-600 rounded-lg p-4"
                onPress={() => signOut()}
            >
                <Text className="text-white text-center font-semibold text-lg">Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
}