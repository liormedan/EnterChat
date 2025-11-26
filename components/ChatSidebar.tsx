"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Hash } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/AuthProvider";

interface Channel {
    id: string;
    name: string;
}

export default function ChatSidebar() {
    const [channels, setChannels] = useState<Channel[]>([]);
    const [newChannelName, setNewChannelName] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const pathname = usePathname();
    const { user } = useAuth();

    useEffect(() => {
        fetchChannels();
        const channelSubscription = supabase
            .channel("public:channels")
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "channels" }, (payload) => {
                setChannels((current) => [...current, payload.new as Channel]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channelSubscription);
        };
    }, []);

    const fetchChannels = async () => {
        const { data, error } = await supabase.from("channels").select("*").order("name");
        if (data) setChannels(data);
    };

    const createChannel = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newChannelName.trim()) return;

        const { error } = await supabase.from("channels").insert({
            name: newChannelName,
            created_by: user?.id,
        });

        if (!error) {
            setNewChannelName("");
            setIsDialogOpen(false);
        }
    };

    return (
        <div className="w-64 bg-[var(--sidebar-bg)] text-[var(--sidebar-text)] flex flex-col h-screen border-r border-gray-800">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center hover:bg-[var(--sidebar-hover)] transition-colors cursor-pointer">
                <h1 className="font-bold text-lg text-white">EnterChat</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:bg-[var(--sidebar-hover)] text-[var(--sidebar-text)] hover:text-white">
                            <Plus className="h-5 w-5" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-800">
                        <DialogHeader>
                            <DialogTitle>Create Channel</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={createChannel} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Channel Name</Label>
                                <Input
                                    id="name"
                                    value={newChannelName}
                                    onChange={(e) => setNewChannelName(e.target.value)}
                                    className="bg-gray-800 border-gray-700 text-white"
                                    placeholder="general"
                                />
                            </div>
                            <Button type="submit" className="w-full bg-[var(--enter-primary)] hover:bg-[var(--enter-secondary)]">Create</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                    {channels.map((channel) => (
                        <Link
                            key={channel.id}
                            href={`/app/${channel.id}`}
                            className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors ${pathname === `/app/${channel.id}`
                                    ? "bg-[var(--sidebar-active)] text-white"
                                    : "text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-white"
                                }`}
                        >
                            <Hash className="h-4 w-4 mr-2 opacity-70" />
                            {channel.name}
                        </Link>
                    ))}
                </div>
            </ScrollArea>
            <div className="p-4 border-t border-gray-800 hover:bg-[var(--sidebar-hover)] transition-colors cursor-pointer">
                <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm text-white font-medium">{user?.email}</span>
                </div>
            </div>
        </div>
    );
}
