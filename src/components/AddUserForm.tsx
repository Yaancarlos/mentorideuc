// components/AddUserForm.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    Modal,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserFormData } from '@/src/types/auth';
import { createUser } from '@/lib/api/admin';

interface AddUserFormProps {
    visible: boolean;
    onClose: () => void;
    onUserCreated: () => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ visible, onClose, onUserCreated }) => {
    const [formData, setFormData] = useState<UserFormData>({
        name: '',
        role: 'student',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async () => {
        if (!formData.email || !formData.name || !formData.password) {
            Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
            return;
        }

        if (formData.password.length < 6) {
            Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setLoading(true);
        try {
            const response = await createUser(formData);
            Alert.alert('Éxito', `Usuario ${response.name} fue creado con exito`);
            setFormData({ email: '', name: '', role: 'student', password: '' });
            onUserCreated();
            onClose();
        } catch (error: any) {
            console.error('Error creating user:', error);
            Alert.alert('Error', error.message || 'Error al crear el usuario');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ email: '', name: '', role: 'student', password: '' });
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
        >
            <View className="flex-1 bg-white pt-10">
                <View className="flex-row justify-between items-center px-5 pb-4 border-b border-gray-200">
                    <View style={{ width: 24 }} />
                    <Text className="text-2xl font-semibold">Agregar Usuario</Text>
                    <TouchableOpacity onPress={handleClose}>
                        <Ionicons name="close-outline" size={28} color="#333" />
                    </TouchableOpacity>
                </View>

                <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
                    <View className="flex w-full gap-5 mt-5">
                        <View>
                            <Text className="text-base font-medium text-gray-700 mb-2">
                                Nombre Completo *
                            </Text>
                            <TextInput
                                className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                                placeholder="Nombre del usuario"
                                placeholderTextColor="#4b5563"
                                value={formData.name}
                                onChangeText={(text) => setFormData({ ...formData, name: text })}
                            />
                        </View>

                        <View>
                            <Text className="text-base font-medium text-gray-700 mb-2">
                                Correo Electrónico *
                            </Text>
                            <TextInput
                                className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                                placeholder="usuario@ejemplo.com"
                                placeholderTextColor="#4b5563"
                                value={formData.email}
                                onChangeText={(text) => setFormData({ ...formData, email: text })}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View>
                            <Text className="text-base font-medium text-gray-700 mb-2">
                                Rol *
                            </Text>
                            <View className="flex-row gap-3">
                                {(['student', 'tutor', 'admin'] as const).map((role) => (
                                    <TouchableOpacity
                                        key={role}
                                        className={`flex-1 py-3 rounded-xl border ${
                                            formData.role === role
                                                ? 'bg-transparent border-purple-500 text-purple-500'
                                                : 'bg-gray-100 border-gray-300'
                                        }`}
                                        onPress={() => setFormData({ ...formData, role })}
                                    >
                                        <Text
                                            className={`text-center font-medium ${
                                                formData.role === role ? 'text-white' : 'text-gray-700'
                                            }`}
                                        >
                                            {role === 'student' && 'Estudiante'}
                                            {role === 'tutor' && 'Tutor'}
                                            {role === 'admin' && 'Admin'}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View>
                            <Text className="text-base font-medium text-gray-700 mb-2">
                                Contraseña *
                            </Text>
                            <View className="relative">
                                <TextInput
                                    className="border border-gray-300 rounded-lg px-4 py-3 text-base pr-12"
                                    placeholder="Mínimo 6 caracteres"
                                    placeholderTextColor="#4b5563"
                                    value={formData.password}
                                    onChangeText={(text) => setFormData({ ...formData, password: text })}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity
                                    className="absolute right-3 top-3"
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    <Ionicons
                                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                        size={20}
                                        color="#666"
                                    />
                                </TouchableOpacity>
                            </View>
                            <Text className="text-xs text-gray-500 mt-1">
                                La contraseña debe tener al menos 6 caracteres
                            </Text>
                        </View>
                    </View>

                    <View className="my-8">
                        <TouchableOpacity
                            className={`bg-purple-500 rounded-lg py-4 ${
                                loading ? 'opacity-50' : ''
                            }`}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white text-center font-semibold text-lg">
                                    Crear Usuario
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
};

export default AddUserForm;