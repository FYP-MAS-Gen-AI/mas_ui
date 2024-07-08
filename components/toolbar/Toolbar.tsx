import React, { useEffect, useState } from 'react';
import useSupabaseClient from "@/lib/supabase/client";
import Design from "@/app/create/[id]/Design";
import Edit from "@/app/create/[id]/Edit";
import History from "@/app/create/[id]/History";
import Chat from "@/app/create/[id]/Chat";


interface Dimensions {
    width: number;
    height: number;
    linkDimensions: boolean;
}

interface ToolbarProps {
    mode: string;
    selectedTab: string;
    imageUrl: any;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onUpload: () => void;
    uploadedImageUrl: string;
    onShowModal: () => void;
    selectedImage: any;
    brushSize: number;
    setBrushSize: React.Dispatch<React.SetStateAction<number>>;
    tool: string;
    setTool: React.Dispatch<React.SetStateAction<string>>;
    sessionID: string;
    dimensions: Dimensions;
    setDimensions: React.Dispatch<React.SetStateAction<Dimensions>>;
    user: any;
    selectedModel: string;
    setImageUrl: React.Dispatch<React.SetStateAction<any>>;
}

const Toolbar: React.FC<ToolbarProps> = ({
                                             mode,
                                                selectedTab,
                                             imageUrl,
                                             onFileChange,
                                             onUpload,
                                             uploadedImageUrl,
                                             onShowModal,
                                             selectedImage,
                                             brushSize,
                                             setBrushSize,
                                             tool,
                                             setTool,
                                             sessionID,
                                             dimensions,
                                             setDimensions,
                                             user,
                                             selectedModel,
                                             setImageUrl
                                         }) => {
    const [messages, setMessages] = useState<any[]>([]);
    const supabase = useSupabaseClient();

    const fetchMessages = async () => {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('session_id', sessionID)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching messages from Supabase', error);
        } else {
            setMessages(data || []);
        }
    };

    useEffect(() => {
        if (sessionID) {
            fetchMessages();
        }

        const channel = supabase
            .channel('realtime messages')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'messages',
                filter: `session_id=eq.${sessionID}`
            }, payload => {
                console.log('Change received!', payload);
                fetchMessages(); // Refetch messages on any change
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [sessionID, supabase]);

    useEffect(() => {
        console.log('Messages updated', messages);
    }, [messages]);

    const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newWidth = Number(e.target.value);
        setDimensions((prev: Dimensions) => {
            const newHeight = prev.linkDimensions ? (newWidth / prev.width) * prev.height : prev.height;
            return { ...prev, width: newWidth, height: newHeight };
        });
    };

    const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newHeight = Number(e.target.value);
        setDimensions((prev: Dimensions) => {
            const newWidth = prev.linkDimensions ? (newHeight / prev.height) * prev.width : prev.width;
            return { ...prev, height: newHeight, width: newWidth };
        });
    };

    const toggleLinkDimensions = () => {
        setDimensions((prev: Dimensions) => ({ ...prev, linkDimensions: !prev.linkDimensions }));
    };

    const handleImageGenerated = (url: string) => {
        setMessages([...messages, { type: 'Generated Image', gen_img_id: url }]);
        setImageUrl(url);
    };

    return (
        <div className={`${selectedTab === 'History' ? 'w-4/5' : 'w-64'} bg-gray-200 p-4`}>
            {selectedTab === 'Design' && (
                <Design
                    mode={mode}
                    selectedModel={selectedModel}
                    onFileChange={onFileChange}
                    onUpload={onUpload}
                    imageUrl={imageUrl}
                    uploadedImageUrl={uploadedImageUrl}
                    onShowModal={onShowModal}
                    selectedImage={selectedImage}
                    dimensions={dimensions}
                    handleWidthChange={handleWidthChange}
                    handleHeightChange={handleHeightChange}
                    toggleLinkDimensions={toggleLinkDimensions}
                />
            )}
            {selectedTab === 'Edit' && (
                <Edit
                    brushSize={brushSize}
                    setBrushSize={setBrushSize}
                    tool={tool}
                    setTool={setTool}
                />
            )}
            {selectedTab === 'History' && (
                <History
                    messages={messages}
                    sessionID={sessionID}
                    user={user}
                    supabase={supabase}
                />
            )}
            {selectedTab === 'Chatbot' && (
                <Chat
                    imageUrl={imageUrl}
                    selectedImage={selectedImage}
                    user={user}
                    selectedModel={selectedModel}
                    sessionID={sessionID}
                    handleImageGenerated={handleImageGenerated}
                />
            )}
        </div>
    );
};

export default Toolbar;
