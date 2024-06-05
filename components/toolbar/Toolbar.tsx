'use client';

import React, { useEffect, useState } from 'react';
import useSupabaseClient from "@/lib/supabase/client";

interface ToolbarProps {
    mode: string;
    imageUrl: string;
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
}

const Toolbar: React.FC<ToolbarProps> = ({
                                             mode,
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
                                         }) => {
    const [messages, setMessages] = useState<any[]>([]);
    const supabase = useSupabaseClient();

    const fetchMessages = async () => {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('session_id', sessionID);

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
            .on('postgres_changes', { event: '*', schema: 'public', table: 'messages', filter: `session_id=eq.${sessionID}` }, payload => {
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

    return (
        <div className="w-64 bg-gray-200 p-4">
            {mode === 'Design' && (
                <>
                    <div className="text-gray-700 font-bold mb-4">Upload Image</div>
                    <input type="file" onChange={onFileChange} className="mb-2" />
                    <button onClick={onUpload}
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
                        Upload Image
                    </button>
                    {uploadedImageUrl && <p className="mt-2 text-sm">Image URL: {uploadedImageUrl}</p>}
                    <div className="mt-4">
                        <button
                            onClick={onShowModal}
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                        >
                            Select Reference Image
                        </button>
                        <div className="mt-2">
                            {selectedImage && (
                                <div>
                                    <img src={selectedImage.url} alt={selectedImage.title} className="w-full rounded" />
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
            {mode === 'Edit' && (
                <div>
                    <div className="mt-4">
                        <button onClick={() => setTool('none')}
                                className={`py-2 px-4 rounded ${tool === 'none' ? 'bg-yellow-500 text-white' : 'bg-gray-300 text-black'}`}>
                            Select
                        </button>
                        <button onClick={() => setTool('brush')}
                                className={`py-2 px-4 rounded mr-2 ${tool === 'brush' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                            Brush
                        </button>
                        <button onClick={() => setTool('eraser')}
                                className={`py-2 px-4 rounded mr-2 ${tool === 'eraser' ? 'bg-red-500 text-white' : 'bg-gray-300 text-black'}`}>
                            Eraser
                        </button>
                    </div>
                    <div className="mt-4">
                        <label className="block mb-2 text-gray-700">Brush Size</label>
                        <input
                            type="range"
                            min="1"
                            max="50"
                            value={brushSize}
                            onChange={(e) => setBrushSize(Number(e.target.value))}
                            className="w-full"
                        />
                    </div>
                </div>
            )}
            {mode === 'History' && (
                <div>
                    <div className="text-gray-700 font-bold mb-4">Project History</div>
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <div key={message.id} className="bg-white p-2 rounded shadow">
                                <p><strong>Type:</strong> {message.type}</p>
                                <p><strong>Text:</strong> {message.text}</p>
                                {message.gen_img_id && (
                                    <div>
                                        <strong>Generated Image:</strong>
                                        <img src={message.gen_img_id} alt={`Generated ${message.id}`}
                                             className="w-full rounded mt-2" />
                                    </div>
                                )}
                                {message.input_img_id && (
                                    <div>
                                        <strong>Input Image:</strong>
                                        <img src={message.input_img_id} alt={`Input ${message.id}`}
                                             className="w-full rounded mt-2" />
                                    </div>
                                )}
                                {message.ref_img_id && (
                                    <div>
                                        <strong>Reference Image:</strong>
                                        <img src={message.ref_img_id} alt={`Reference ${message.id}`}
                                             className="w-full rounded mt-2" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Toolbar;
