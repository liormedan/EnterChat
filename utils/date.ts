import { format, formatDistanceToNow } from "date-fns";

export function formatMessageDate(date: string | Date): string {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatFullDate(date: string | Date): string {
    return format(new Date(date), "PPP p");
}
