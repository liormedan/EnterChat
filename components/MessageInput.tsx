"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface MessageInputProps {
    onSend: (content: string) => Promise<void>;
}

export default function MessageInput({ onSend }: MessageInputProps) {
    const [content, setContent] = useState("");
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || sending) return;

        setSending(true);
        try {
            await onSend(content);
            setContent("");
        } finally {
            setSending(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
            <div className="flex gap-2">
                <Input
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                    disabled={sending}
                />
                <Button type="submit" size="icon" disabled={sending || !content.trim()}>
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </form>
    );
}
