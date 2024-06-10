// components/chatbot/Chatbot.tsx

import { useState } from 'react';
// import axios from 'axios';

interface ChatbotProps {
    imageUrl: string | null;
    refImageUrl: string | null;
    userId: string;
    modelId: string;
    sessionId: string;
    onImageGenerated: (url: string) => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ imageUrl, refImageUrl, userId, modelId, sessionId, onImageGenerated }) => {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<string[]>([]);

    const handleSendMessage = async () => {
        if (message.trim() === '') return;

        const chatbotInput = {
            operation: 'Text -> Image',
            text: message,
            image_url: imageUrl,
            ref_image_url: refImageUrl
        };

        try {
            // const response = await axios.post('/api/generateImage', {
            //     ...chatbotInput,
            //     user_id: userId,
            //     model_id: modelId,
            //     session_id: sessionId
            // });
            //
            // const { imageUrl: generatedImageUrl } = response.data;
            // if (generatedImageUrl) {
            //     onImageGenerated(generatedImageUrl);
            //     setChatHistory([...chatHistory, `You: ${message}`, `Bot: Image generated at ${generatedImageUrl}`]);
            // } else {
            //     setChatHistory([...chatHistory, `You: ${message}`, `Bot: Failed to generate image`]);
            // }
        } catch (error) {
            console.error('Error generating image:', error);
            setChatHistory([...chatHistory, `You: ${message}`, `Bot: Error generating image`]);
        }

        setMessage('');
    };

    return (
        <div className="p-4">
            <div className="bg-gray-100 p-4 rounded mb-4" style={{ height: '300px', overflowY: 'scroll' }}>
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
