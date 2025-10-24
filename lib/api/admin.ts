import {supabase} from "@/lib/supabase";
import {Alert} from "react-native";

// ---------------- Admin calls ------------------------
export async function getUsers() {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", {ascending: false});

    if (error) throw error;
    return data;
}

export async function getUserById(id: string) {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) throw error;
    return data;
}

export async function createUser(user: {
    name: string;
    role: string;
    email: string,
    password: string
}) {
    const emailVerified = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$')

    if (user.password.length < 6) {
        Alert.alert("Contraseña debe de tener mas de 6 digitos");
        return;
    }

    if (user.name.length < 4) {
        Alert.alert("El nombre debe de tener mas de 3 digitos");
        return;
    }

    if (!emailVerified.test(user.email)) {
        Alert.alert("Email no valido");
        return;
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
            data: {
                name: user.name,
                role: user.role,
            }
        }
    });

    if (authError) throw authError;

    if (authData.user) {
        const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", authData.user.id)
            .maybeSingle();

        if (profileError) throw profileError;
        return profileData;
    }

    return authData;
}

export async function updateUser(id: string, updates: {
    name?: string;
    role?: string;
    avatar_url?: string;
}) {
    if (updates.name && updates.name.length < 3) {
        Alert.alert("El nombre debe tener al menos 3 caracteres");
    }

    const { data, error } = await supabase
        .from("profiles")
        .update({
            ...updates,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .maybeSingle();

    if (error) throw error;
    return data;
}

export async function deleteUser(id: string) {
    const { error: authError } = await supabase.auth.admin.deleteUser(id);

    if (authError) {
        const { error: profileError } = await supabase
            .from("profiles")
            .delete()
            .eq("id", id);

        if (profileError) throw profileError;
    }

    return true;
}

export async function cleanUserHistory(userId: string) {
    const cutoffDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();

    const { data: calendarData, error: calendarDataError } = await supabase
        .from("calendar_events")
        .delete()
        .or(`student_id.eq.${userId},tutor_id.eq.${userId}`)
        .or(`status.eq.canceled,status.eq.pending,end_time.lt.${cutoffDate}`);

    if (calendarDataError) throw calendarDataError;

    return { success: true };
}


export async function cleanUserCache(userId: string) {
    const { data: userRepositories, error: userRepositoriesError } = await supabase
        .from("repository")
        .select("id")
        .or(`student_id.eq.${userId},tutor_id.eq.${userId}`);

    if (userRepositoriesError) throw userRepositoriesError;

    if (userRepositories && userRepositories.length > 0) {
        for (const repository of userRepositories) {
            const { data: files, error: listError } = await supabase.storage
                .from('repository-files')
                .list(repository.id);

            if (!listError && files && files.length > 0) {
                const filePaths = files.map(file => `${repository.id}/${file.name}`);
                const { error: storageError } = await supabase.storage
                    .from('repository-files')
                    .remove(filePaths);

                if (storageError) {
                    console.error(`Could not delete storage files for repo ${repository.id}:`, storageError);
                }
            }
        }
    }

    const { error: calendarError } = await supabase
        .from("calendar_events")
        .delete()
        .or(`student_id.eq.${userId},tutor_id.eq.${userId}`);

    if (calendarError) throw calendarError;

    const { error: reposDeleteError } = await supabase
        .from("repository")
        .delete()
        .or(`student_id.eq.${userId},tutor_id.eq.${userId}`);

    if (reposDeleteError) throw reposDeleteError;

    return { success: true };
}

