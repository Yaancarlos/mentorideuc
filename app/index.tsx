import React from 'react';
import { View } from 'react-native';
import AuthController from '@/src/components/AuthController';

export default function App() {
    return (
        <View className="flex-1">
            <AuthController />
        </View>
    );
}