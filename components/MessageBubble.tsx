import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface MessageBubbleProps {
    content: string;
    senderName: string;
    senderId: string;
    currentUserId?: string;
    createdAt: string;
    photoUrl?: string;
}

export default function MessageBubble({
    content,
    senderName,
    senderId,
    currentUserId,
    createdAt,
    photoUrl,
}: MessageBubbleProps) {
    const isOwn = senderId === currentUserId;

    return (
        <div className={`flex items-start gap-3 mb-4 ${isOwn ? "flex-row-reverse" : ""}`}>
            <Avatar className="h-8 w-8">
                <AvatarImage src={photoUrl} />
                <AvatarFallback>{senderName[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className={`flex flex-col max-w-[70%] ${isOwn ? "items-end" : "items-start"}`}>
                <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {senderName}
                    </span>
                    <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                    </span>
                </div>
                <div
                    dir="auto"
                    className={`px-4 py-2 rounded-lg text-sm shadow-sm ${isOwn
                            ? "bg-[var(--enter-primary)] text-white rounded-tr-none"
                            : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-none border border-gray-200 dark:border-gray-700"
                        }`}
                >
                    {content}
                </div>
            </div>
        </div>
    );
}
