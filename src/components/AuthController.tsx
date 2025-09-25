// src/components/AuthController.tsx
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

import Auth from './Auth';
import AdminDashboard from "@/src/screens/admin/Dashboard";
import TutorDashboard from '@/src/screens/tutor/Dashboard';
import StudentDashboard from '@/src/screens/student/Dashboard';
import Account from '@/src/screens/Account';

export default function AuthController() {
    const [session, setSession] = useState<Session | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get Session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        // listen to Auth.tsx's changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (session?.user) {
            fetchRole(session.user.id);
        } else {
            setRole(null);
            setLoading(false);
        }
    }, [session]);

    async function fetchRole(userId: string) {
        setLoading(true);

        // Get Role
        const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .maybeSingle();

        if (error) {
            console.warn('role fetch error', error);
        }
        setRole(data?.role ?? null);
        setLoading(false);
    }

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator />
            </View>
        );
    }

    if (!session) {
        return <Auth />;
    }

    // Show different dashboards according to the Role
    if (role === 'admin') return <AdminDashboard />;
    if (role === 'tutor') return <TutorDashboard />;
    if (role === 'student') return <StudentDashboard />;

    // If Role missing, show account edit screen to set role/name first
    return <Account session={session} />;
}
