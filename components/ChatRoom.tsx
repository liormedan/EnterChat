"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import MessageBubble from "@/components/MessageBubble";
import MessageInput from "@/components/MessageInput";
import DateSeparator from "@/components/DateSeparator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
    id: string;
    content: string;
    user_id: string;
    created_at: string;
    profiles: {
        display_name: string;
        photo_url: string;
    };
}

interface ChatRoomProps {
    channelId: string;
}

export default function ChatRoom({ channelId }: ChatRoomProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const { user } = useAuth();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchMessages();
        const messageSubscription = supabase
            .channel(`channel:${channelId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `channel_id=eq.${channelId}`,
                },
                async (payload) => {
                    // Fetch the user profile for the new message
                    const { data: profile } = await supabase
                        .from("profiles")
                        .select("display_name, photo_url")
                        .eq("id", payload.new.user_id)
                        .single();

                    const newMessage = {
                        ...payload.new,
                        profiles: profile || { display_name: "Unknown", photo_url: "" },
                    } as Message;

                    setMessages((current) => [...current, newMessage]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(messageSubscription);
        };
    }, [channelId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const fetchMessages = async () => {
        const { data, error } = await supabase
            .from("messages")
            .select(`
        *,
        profiles (
          display_name,
          photo_url
        )
      `)
            .eq("channel_id", channelId)
            .order("created_at", { ascending: true });

        if (data) setMessages(data as any);
    };

    const sendMessage = async (content: string) => {
        if (!user) return;

        await supabase.from("messages").insert({
            content,
            channel_id: channelId,
            user_id: user.id,
        });
    };

    return (
        <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.map((msg, index) => {
                        const isFirstOfDay =
                            index === 0 ||
                            new Date(msg.created_at).toDateString() !==
                            new Date(messages[index - 1].created_at).toDateString();

                        return (
                            <div key={msg.id}>
                                {isFirstOfDay && <DateSeparator date={msg.created_at} />}
                                <MessageBubble
                                    content={msg.content}
                                    senderName={msg.profiles?.display_name || "Unknown"}
                                    senderId={msg.user_id}
                                    currentUserId={user?.id}
                                    createdAt={msg.created_at}
                                    photoUrl={msg.profiles?.photo_url}
                                />
                            </div>
                        );
                    })}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>
            <MessageInput onSend={sendMessage} />
        </div>
    );
}
