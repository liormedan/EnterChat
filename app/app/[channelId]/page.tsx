import ChatRoom from "@/components/ChatRoom";

export default function ChannelPage({ params }: { params: { channelId: string } }) {
    return <ChatRoom channelId={params.channelId} />;
}
