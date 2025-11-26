import { Database } from "@/types/supabase";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export function isAdmin(profile: Profile | null): boolean {
    return profile?.role === "admin";
}

export function canCreateChannel(profile: Profile | null): boolean {
    return isAdmin(profile);
}
