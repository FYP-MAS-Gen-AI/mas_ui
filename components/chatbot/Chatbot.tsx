import {useState, useEffect} from 'react';
import useSupabaseClient from "@/lib/supabase/client";

interface ChatbotProps {
    imageUrl: string | null;
    refImageUrl: string | null;
    userId: string;
    modelId: string;
    sessionId: string;
    onImageGenerated: (url: string) => void;
}

const Chatbot: React.FC<ChatbotProps> = ({imageUrl, refImageUrl, userId, modelId, sessionId, onImageGenerated}) => {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<string[]>([]);

    const supabase = useSupabaseClient();

    const saveMessageToDatabase = async (message: string, role: 'user' | 'bot') => {
        console.log({session_id: sessionId, user_id: userId, message: message, role: 'user'});
        const {data, error} = await supabase
            .from('chats')
            .insert([
                {session_id: sessionId, user_id: userId, message: message, role: 'user'},
            ]);

        if (error) {
            console.error('Error saving message to database:', error);
        } else {
            console.log('Message saved to database:', data);
        }
    };

    const prepareRequestBody = () => {
        return JSON.stringify({
            message: message,
            model: 'gpt-4o',
            session_id: sessionId,
            image_url: imageUrl,
            ref_image_url: refImageUrl,
            mask_img_url: refImageUrl,
            user_id: userId,
            model_id: modelId
        });
    };

    const handleSendMessage = async () => {
        if (message.trim() === '') return;

        await saveMessageToDatabase(message, 'user');

        const requestBody = prepareRequestBody();
        console.log('Chatbot input:', requestBody);

        try {
            console.log('Chatbot input:', JSON.parse(requestBody));
            const response = await fetch(`${process.env.NEXT_PUBLIC_NLP_BACKEND_URL}/chat_model`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: requestBody,
            });

            console.log('Chatbot response:', response);

            if (response.ok) {
                const result = await response.json();
                let newChatHistory = [...chatHistory, `You: ${message}`];

                if (result.imageUrl) {
                    onImageGenerated(result.imageUrl);
                    newChatHistory.push(`Bot: Image generated at ${result.imageUrl}`);
                } else if (result.message) {
                    newChatHistory.push(`Bot: ${result.message}`);
                    await saveMessageToDatabase(result.message, 'bot');
                } else {
                    newChatHistory.push(`Bot: Failed to generate a response`);
                }

                setChatHistory(newChatHistory);
            } else {
                console.error('Failed to generate a response:', response.statusText);
                setChatHistory([...chatHistory, `You: ${message}`, `Bot: Failed to generate a response`]);
            }
        } catch (error) {
            console.error('Error generating image:', error);
            setChatHistory([...chatHistory, `You: ${message}`, `Bot: Error generating image`]);
        }

        setMessage('');
    };

    const fetchChatHistory = async () => {
        const {data, error} = await supabase
            .from('chats')
            .select('*')
            .eq('session_id', sessionId)
            .order('created_at', {ascending: true});

        if (error) {
            console.error('Error fetching chat history:', error);
        } else {
            const formattedChatHistory = data.map((chat) => `${chat.role === 'user' ? 'You' : 'Bot'}: ${chat.message}`);
            setChatHistory(formattedChatHistory);
        }
    };

    useEffect(() => {
        fetchChatHistory();
    }, [sessionId]);

    return (
        <div className="p-4">
            <div className="bg-gray-100 p-4 rounded mb-4" style={{height: '300px', overflowY: 'scroll'}}>
                {chatHistory.map((chat, index) => (
                    <div key={index} className="mb-2">
                        {chat}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2 mb-2 border rounded"
                placeholder="Type a message..."
            />
            <button onClick={handleSendMessage} className="w-full bg-blue-500 text-white py-2 rounded">
                Send
            </button>
        </div>
    );
};

export default Chatbot;
