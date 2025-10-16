import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Alert, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { uploadRepositoryFile, getRepositoryFiles, deleteRepositoryFile, getRepositoryFeedback, addFeedback } from "@/lib/api/caledar";
import * as DocumentPicker from "expo-document-picker";
import { supabase } from "@/lib/supabase";
import { useCurrentUser } from "@/lib/hooks";
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Loading from "@/src/components/Loading";
import MessageSection from "@/src/components/Message";

export default function RepositoryDetailTutorScreen() {
    const { id } = useLocalSearchParams();
    const { profile } = useCurrentUser();
    const [repository, setRepository] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState<any[]>([])
    const [feedBackUser, setFeedBackUser] = useState<string>("");
    const [files, setFiles] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState("");

    useEffect(() => {
        if (id) {
            loadRepository();
        } else {
            Alert.alert("Error", "No repository ID provided");
            setLoading(false);
        }
    }, [id]);

    async function loadRepository() {
        try {
            setLoading(true);

            const { data, error } = await supabase
                .from("repository")
                .select(`
                          id,
                          title,
                          description,
                          status,  
                          feedback,
                          student:profiles!repository_student_id_fkey(name),
                          calendar:calendar_events!repository_booking_id_fkey(start_time, end_time, status)
                        `)
                .eq("id", id as string)
                .maybeSingle();

            if (error) throw error;

            setRepository(data);
            await loadRepositoryFiles();
            await loadFeedback();
        } catch (error: any) {
            console.error("Error loading repository:", error);
            Alert.alert("Error", error.message || "Failed to load repository");
        } finally {
            setLoading(false);
        }
    }

    const formatDate = (iString: string) => {
        if (!iString) return null;

        const date = new Date(iString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const formatTime = (startTime: string, endTime: string) => {
        if (!endTime || !startTime) return null;

        const start = new Date(startTime);
        const end = new Date(endTime);
        return `${start.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        })} - ${end.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        })}`;
    };

    const loadRepositoryFiles = async () => {
        try {
            setLoading(true);
            const filesData = await getRepositoryFiles(id as string);
            setFiles(filesData || []);
        } catch (error: any) {
            console.error("Error loading repository:", error);
        } finally {
            setLoading(false);
        }
    }

    const loadFeedback = async () => {
        try {
            setLoading(true);
            const feedbackData = await getRepositoryFeedback(id as string);
            setFeedback(feedbackData || []);
        } catch (error: any) {
            console.error("Error cargando feedback: ", error);
        } finally {
            setLoading(false);
        }
    }

    const handleFeedbackAdd = async () => {
        if (!feedBackUser.trim()) {
            Alert.alert("Error", "Ingresa la observacion");
            return;
        }

        try {
            setLoading(true);

            const response = await addFeedback(id as string, feedBackUser, profile?.id as string, profile?.role as string);

            setFeedBackUser("");
            await loadRepository();
        } catch (error: any) {
            console.error("Error cargando feedback:", error);
        }   finally {
            setLoading(false);
        }
    }

    const handleFileAttachment = async () => {
        try {
            setUploading(true);
            setLoading(true);

            const result = await DocumentPicker.getDocumentAsync({
                type: "*/*",
                copyToCacheDirectory: true,
                multiple: true,
            });

            if (result.canceled) return;

            result.assets.map(asset => {
                uploadRepositoryFile(id as string, asset, profile?.id as string);
            })

            await loadRepositoryFiles();
        } catch (error:any) {
            console.error("Error loading repository:", error);
            Alert.alert("Error", error.message || "Failed to load files");
        } finally {
            setUploading(false);
            setLoading(false);
        }
    }

    const handleDeleteFile = async (fileId: string, fileName: string) => {
        Alert.alert(
            "Delete File",
            `Are you sure you want to delete "${fileName}"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteRepositoryFile(fileId);
                            await loadRepositoryFiles();
                            Alert.alert("Success", "File deleted successfully");
                        } catch (error: any) {
                            Alert.alert("Error", error.message || "Failed to delete file");
                        }
                    }
                }
            ]
        );
    };

    const handleDownloadFile = async (fileUrl: string, fileName: string) => {
        try {
            if (fileUrl) {
                // You can use Linking.openURL(fileUrl) for direct download
                Alert.alert("Download", `Downloading: ${fileName}`);
                return;
            }
        } catch (error) {
            Alert.alert("Download Failed", "Could not download file");
        }
    };

    const getFeedbackIcon = (name: string) => {
        switch (name) {
            case "tutor":
                return { icon: "user-secret", color: "#84abfc" }
            case "student":
                return { icon: "user-ninja", color: "#10B981" }
            default:
                return { icon: "user-injured", color: "#3B82F6" }
        }
    }

    const getFileIcon = (fileType: string) => {
        if (fileType.includes("pdf")) return { icon: "document-text", color: "#EF4444" };
        if (fileType.includes("zip") || fileType.includes("compressed")) return { icon: "archive", color: "#F59E0B" };
        if (fileType.includes("word") || fileType.includes("document")) return { icon: "document-text", color: "#2563EB" };
        if (fileType.includes("xlx")) return { icon: "document-text", color: "#10B981" };
        return { icon: "document", color: "#6B7280" };
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleCompleted = () => {
        Alert.alert("Exito", "Session completada")
        return;
    }

    if (loading) {
        return (
            <Loading />
        );
    }

    return (
        <ScrollView className="flex-1 bg-white">
            <View className="px-6 py-8">
                <Text className="text-2xl font-bold w-full text-center text-gray-900 mb-8">
                    {repository?.title || "Sin titulo"}
                </Text>
                <View className="mb-6">
                    <Text className="text-base text-xl font-semibold text-gray-900 mb-2">
                        Descripcion
                    </Text>
                    <Text className="text-base text-gray-700 leading-6">
                        {repository?.description || "No descripcion"}
                    </Text>
                </View>
                <View className="flex-row items-center justify-end gap-6">
                    <View className="flex-row items-center gap-2">
                        <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                        <Text className="text-base text-gray-600">
                            {formatDate(repository?.calendar?.start_time) || "No Date"}
                        </Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                        <Ionicons name="time-outline" size={20} color="#6B7280" />
                        <Text className="text-base text-gray-600">
                            {formatTime(repository?.calendar?.start_time, repository?.calendar?.end_time) || "No Date"}
                        </Text>
                    </View>
                </View>
                <View className="my-20">
                    <Text className="text-xl font-semibold text-gray-900 mb-3">
                        Observaciones
                    </Text>
                    <View>
                        <View className="flex-1">
                            <MessageSection
                                feedback={feedback}
                                profile={profile?.role as string}
                            />
                        </View>
                    </View>
                    <View className="flex flex-row mt-3 items-end gap-2">
                        <TextInput
                            className="flex-1 border border-solid border-gray-300 rounded-xl py-2.5 px-4 bg-white text-base"
                            value={feedBackUser}
                            onChangeText={setFeedBackUser}
                            placeholder="Type your message..."
                            multiline
                            numberOfLines={5}
                            textAlignVertical="top"
                        />
                        <TouchableOpacity
                            className={`rounded-full p-3 ${feedBackUser.trim() ? 'bg-green-500' : 'bg-gray-400'}`}
                            onPress={() => handleFeedbackAdd()}
                            disabled={!feedBackUser.trim()}
                        >
                            <Ionicons
                                name="send"
                                size={18}
                                color="white"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View className="mb-6">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-xl font-semibold text-gray-900">
                            Documentos Adjuntados ({files.length})
                        </Text>
                    </View>

                    {files.length > 0 ? (
                        files.map((file) => {
                            const fileIcon = getFileIcon(file.file_type as string);
                            return (
                                <View
                                    key={file.id}
                                    className="flex-row items-center gap-4 p-3 mb-3 border border-gray-200 rounded-lg bg-gray-50"
                                >
                                    <View className="w-10 h-10 items-center justify-center">
                                        <Ionicons name={fileIcon.icon as any} size={24} color={fileIcon.color} />
                                    </View>

                                    <View className="flex-1">
                                        <Text className="text-base text-gray-800 font-medium" numberOfLines={1}>
                                            {file.file_name}
                                        </Text>
                                        <View className="flex-row gap-3.5 mt-1">
                                            <Text className="text-xs text-gray-500">
                                                {formatFileSize(file.file_size)}
                                            </Text>
                                            <Text className="text-xs text-gray-500">
                                                {new Date(file.created_at).toLocaleDateString()}
                                            </Text>
                                            {file.uploaded_by && (
                                                <Text
                                                    numberOfLines={1}
                                                    ellipsizeMode="tail"
                                                    className="text-xs w-20 text-gray-500"
                                                >
                                                    By: {file.uploaded_by.name}
                                                </Text>
                                            )}
                                        </View>
                                    </View>

                                    <View className="flex-row">
                                        <TouchableOpacity
                                            onPress={() => handleDownloadFile(file.file_url, file.file_name)}
                                            className="p-2"
                                        >
                                            <Ionicons name="download-outline" size={20} color="#3B82F6" />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => handleDeleteFile(file.id, file.file_name)}
                                            className="p-2"
                                        >
                                            <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            );
                        })
                    ) : (
                        <View className="flex items-center gap-2 justify-center py-8">
                            <Ionicons name="document-outline" size={30} color="#9CA3AF" />
                            <Text className="text-gray-500 text-center mt-2">
                                No hay documentos adjuntados
                            </Text>
                            <Text className="text-gray-400 text-sm text-center mt-1">
                                Presiona "Agregar documento(s)" para subir archivos
                            </Text>
                        </View>
                    )}
                </View>

                <View className="w-full mt-12 flex-col gap-3">
                    <TouchableOpacity
                        className="bg-blue-50 p-4 rounded-lg"
                        onPress={handleFileAttachment}
                        disabled={uploading}
                    >
                        <View className="flex flex-row justify-center items-center">
                            <Ionicons name="add-outline" size={20} color="#3B82F6" />
                            <Text className="text-blue-600 font-base font-semibold">
                                {uploading ? "Subiendo..." : "Agregar documento(s)"}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="rounded-md bg-green-500 w-full p-4"
                        onPress={handleCompleted}
                    >
                        <Text className="text-white font-semibold text-center text-base">
                            Marcar como completa
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}