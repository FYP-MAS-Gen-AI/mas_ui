import React from 'react';

interface InputSectionProps {
    mode: string;
    selectedModel: string;
    inputValue: string;
    onModelChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onGenerateImage: () => void;
    onModeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const InputSection: React.FC<InputSectionProps> = ({
                                                       mode,
                                                       selectedModel,
                                                       inputValue,
                                                       onModelChange,
                                                       onInputChange,
                                                       onGenerateImage,
                                                       onModeChange,
                                                   }) => {
    return (
        <div className="bg-white p-4 border-t border-gray-200">
            <select
                value={mode}
                onChange={onModeChange}
                className="border rounded px-4 py-2 w-full mb-2"
            >
                <option value="Text -> Image">Text -> Image</option>
                <option value="Text + Image -> Image">Text + Image -> Image</option>
                <option value="Edit">Edit (Inpaint/Outpaint)</option>
            </select>
            <select
                value={selectedModel}
                onChange={onModelChange}
                className="border rounded px-4 py-2 w-full mb-2"
            >
                <option value="fooocus">Fooocus</option>
                <option value="stability">Stability</option>
                <option value="getimg">Getimg</option>
            </select>
            <input
                type="text"
                value={inputValue}
                onChange={onInputChange}
                className="border rounded px-4 py-2 w-full mb-2"
                placeholder="Enter input for image generation"
            />
            <button
                onClick={onGenerateImage}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
            >
                Generate Image
            </button>
        </div>
    );
};

export default InputSection;
