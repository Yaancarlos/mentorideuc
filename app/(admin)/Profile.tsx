import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import useAuth from "@/src/components/Auth";

const Profile = () => {
    const { signOut } = useAuth();

    return (
        <View>
            <TouchableOpacity
                onPress={() => signOut()}
            >
                <Text>Sign out</Text>
            </TouchableOpacity>
        </View>
    )
};

export default Profile;