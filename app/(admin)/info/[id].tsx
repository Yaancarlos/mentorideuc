import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import {useCurrentUser} from "@/lib/hooks";
import Loading from "@/src/components/Loading";
import {getUserById} from "@/lib/api/admin";
import {useLocalSearchParams} from "expo-router";

interface User {
    id: string;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
    avatar_url: string;
}

const UserInfo = () => {
    const { id } = useLocalSearchParams();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User>();

    const loadUserInfo = async () => {
        try {
            const response = await getUserById(id as string);
            setUser(response);
        } catch (error: any) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadUserInfo();
    }, []);

    if (loading) {
        return <Loading />
    }

    return (
        <View>
            <Text>{user?.name}</Text>
            <Text>{user?.email}</Text>
            <Text>{user?.created_at || "No tiene"}</Text>
        </View>
    )

};

export default UserInfo;