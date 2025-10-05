import {supabase} from "@/lib/supabase";
import {EventStatus} from "@/src/types/auth";

export async function getAvailableEvents() {
    const { data, error } = await supabase
        .from("calendar_events")
        .select("*")
        .eq("status", EventStatus.AVAILABLE)
        .order("start_time", {ascending: true});
    if (error) throw error;
    return data;
}

export async function getTutorAvailability(tutorId: string) {
    const { data, error } = await supabase
        .from("calendar_events")
        .select("*")
        .eq("tutor_id", tutorId)
        .eq("status", "available")
        .order("start_time");

    if (error) throw error;
    return data;
}


export async function createEvent(tutorId: string, startTime: string, endTime: string) {
    const { data, error } = await supabase
        .from("calendar_events")
        .insert([{
            tutor_id: tutorId,
            start_time: startTime,
            end_time: endTime
        }])
        .select()
        .maybeSingle();
    if (error) throw error;
    return data;
}

export async function bookEvent(eventId: string, studentId: string, title: string, description: string) {
    const { data, error } = await supabase
        .from("calendar_events")
        .update({
            student_id: studentId,
            status: EventStatus.BOOKED,
            title: title,
            description: description,
        })
        .eq("id", eventId)
        .eq("status", EventStatus.AVAILABLE)
        .select()
        .maybeSingle();
    if (error) throw error;
}

export async function cancelEvent(eventId: string, tutorId: string) {
    const { data, error } = await supabase
        .from("calendar_events")
        .update({ status: EventStatus.CANCELED })
        .eq("id", eventId)
        .eq("tutor_id", tutorId)
        .select()
        .maybeSingle();
    if (error) throw error;
    return data;
}