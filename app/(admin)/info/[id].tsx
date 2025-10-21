import React, { useState, useEffect } from 'react';
import {View, Text, Alert} from 'react-native';
import {useCurrentUser} from "@/lib/hooks";
import Loading from "@/src/components/Loading";
import {getUserById} from "@/lib/api/admin";
import {useLocalSearchParams} from "expo-router";
import ProfileCard from "@/src/components/ProfileCard";

interface User {
    id: string;
    name?: string;
    email?: string;
    created_at?: string;
    updated_at?: string;
    avatar_url?: string;
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

    const handleOnPress = (item: any) => {
        Alert.alert("Edit", "Edit profile")
    }

    return (
        <ProfileCard
            item={user}
            onPress={handleOnPress}
        />
    )

};

export default UserInfo;