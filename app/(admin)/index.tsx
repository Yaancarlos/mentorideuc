import React, {useState, useEffect} from "react";
import { Alert, View, Text } from "react-native";
import { getUsers, createUser, updateUser, deleteUser } from '@/lib/api/admin';
import Loading from "@/src/components/Loading";
import { useCurrentUser } from "@/lib/hooks";

export default function Home() {
    const { profile } = useCurrentUser();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const usersData = await getUsers();
            setUsers(usersData);
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    if (loading) {
        return <Loading />
    }

    return (
        <View className="flex-1 bg-white px-5 pt-20 pb-5">
            <Text>Index</Text>
        </View>
    )
}