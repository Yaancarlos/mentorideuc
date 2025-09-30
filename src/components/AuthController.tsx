import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import {useSession,  useProfile} from "@/lib/hooks";

/* Screens */
import Account from '@/app/Account';
import LoginScreen from "@/app/(auth)/Login";
import AdminTabs from "@/app/(admin)/tabs";
import TutorTabs from "@/app/(tutor)/tabs";
import StudentTabs from "@/app/(student)/tabs";

export default function AuthController() {
    const { session, loading: sessionLoading } = useSession();
    const { profile, loading: profileLoading, error: profileError } = useProfile(session?.user?.id);

    const loading = sessionLoading || (session && profileLoading);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
                <Text className="mt-4 text-gray-600">Loading...</Text>
            </View>
        );
    }

    if (profileError) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text className="text-red-500">Error loading profile</Text>
            </View>
        );
    }

    if (!session) {
        return <LoginScreen />;
    }

    // Show different dashboards according to the Role
    if (profile?.role === 'admin') return <AdminTabs />;
    if (profile?.role === 'tutor') return <TutorTabs />;
    if (profile?.role === 'student') return <StudentTabs />;

    // If Role missing, show account edit screen to set role/name first
    return <Account session={session} />;
}
