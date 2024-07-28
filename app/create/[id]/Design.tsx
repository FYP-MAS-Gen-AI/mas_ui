import React, { useState, useEffect } from 'react';
import ImageInformation from "@/app/create/[id]/ImageInformation";

interface Dimensions {
    width: number;
    height: number;
    linkDimensions: boolean;
}

interface DesignProps {
    mode: string;
    selectedModel: string;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onUpload: () => void;
    imageUrl: string;
    uploadedImageUrl: string;
    onShowModal: () => void;
    selectedImage: any;
    dimensions: Dimensions;
    handleWidthChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleHeightChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    toggleLinkDimensions: () => void;
    aspectRatio: string;
    setAspectRatio: React.Dispatch<React.SetStateAction<string>>;
    imageWidth: number;
    setImageWidth: React.Dispatch<React.SetStateAction<number>>;
    imageHeight: number;
    setImageHeight: React.Dispatch<React.SetStateAction<number>>;
    stylePreset: string;
    setStylePreset: React.Dispatch<React.SetStateAction<string>>;
}

const UploadImageSection: React.FC<{
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onUpload: () => void;
    uploadedImageUrl: string;
}> = ({ onFileChange, onUpload, uploadedImageUrl }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState('');

    const handleUpload = async () => {
        setIsUploading(true);
        setUploadMessage('');
        await onUpload();
        setIsUploading(false);
        setUploadMessage('Image uploaded successfully.');
        console.log('Uploaded image URL:', uploadedImageUrl);
    };

    return (
        <>
            <div className="text-gray-700 font-bold mb-4">Upload Image</div>
            <input type="file" onChange={onFileChange} className="mb-2" />
            <button
                onClick={handleUpload}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                disabled={isUploading}
            >
                {isUploading ? 'Uploading...' : 'Upload Image'}
            </button>
            {uploadMessage && <p className="mt-2 text-sm text-green-600">{uploadMessage}</p>}
        </>
    );
};

const modelOptions = {
    "stability-ultra": {
        "aspect_ratios": ["16:9", "1:1", "21:9", "2:3", "3:2", "4:5", "5:4", "9:16", "9:21"]
    },
    "stability-core": {
        "aspect_ratios": ["16:9", "1:1", "21:9", "2:3", "3:2", "4:5", "5:4", "9:16", "9:21"],
        "style_preset": ["none", "3d-model", "analog-film", "anime", "cinematic", "comic-book", "digital-art", "enhance",
            "fantasy-art", "isometric", "line-art", "low-poly", "modeling-compound", "neon-punk",
            "origami", "photographic", "pixel-art", "tile-texture"]
    },
    "stability-diffusion": {
        "aspect_ratios": ["16:9", "1:1", "21:9", "2:3", "3:2", "4:5", "5:4", "9:16", "9:21"]
    },
    "sd1-sdai": {
        "min_dimension": 320,
        "max_dimension": 1536,
        "model": "stable-diffusion-xl-1024-v1-0"
    }
};

const Design: React.FC<DesignProps> = ({
                                           mode = "Text to Image",
                                           selectedModel,
                                           onFileChange,
                                           onUpload,
                                           imageUrl,
                                           uploadedImageUrl,
                                           onShowModal,
                                           selectedImage,
                                           dimensions,
                                           handleWidthChange,
                                           handleHeightChange,
                                           toggleLinkDimensions,
                                           aspectRatio,
                                           setAspectRatio,
                                           imageWidth = 1024,
                                           setImageWidth,
                                           imageHeight = 1024,
                                           setImageHeight,
                                           stylePreset = "none",
                                           setStylePreset
                                       }) => {
    const downloadImage = (imageUrl: string) => {
        console.log('Downloading image:', imageUrl);
        fetch(imageUrl)
            .then((response) => response.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'image.png'; // You can customize the filename here
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            })
            .catch((error) => console.error('Error downloading image:', error));
    };

    const options = modelOptions[selectedModel];

    useEffect(() => {
        if (options) {
            if (options.aspect_ratios && !options.aspect_ratios.includes(aspectRatio)) {
                setAspectRatio("1:1");
            }
            if (options.style_preset && !options.style_preset.includes(stylePreset)) {
                setStylePreset("none");
            }
        }
    }, [selectedModel]);

    return (
        <>
            <div className="text-gray-700 font-bold mb-4 mt-4">Selected Model and Mode</div>
            <div className="mb-4">
                <p><span className="font-bold">Selected Model:</span> {selectedModel}</p>
                <p><span className="font-bold">Mode:</span> {mode}</p>
            </div>

            {mode === "Text to Image" && options && (options.aspect_ratios || options.style_preset) && (
                <div className="mb-4">
                    <div className="text-gray-700 font-bold mb-4 mt-4">Model Options</div>
                    {options.aspect_ratios && (
                        <div>
                            <label className="font-bold">Aspect Ratios:</label>
                            <select
                                value={aspectRatio}
                                onChange={(e) => setAspectRatio(e.target.value)}
                                className="ml-2 p-2 border rounded"
                            >
                                {options.aspect_ratios.map((ratio) => (
                                    <option key={ratio} value={ratio}>
                                        {ratio}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    {options.style_preset && (
                        <div>
                            <label className="font-bold">Style Presets:</label>
                            <select
                                value={stylePreset}
                                onChange={(e) => setStylePreset(e.target.value)}
                                className="ml-2 p-2 border rounded"
                            >
                                {options.style_preset.map((preset) => (
                                    <option key={preset} value={preset}>
                                        {preset}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    {options.min_dimension && (
                        <p><span className="font-bold">Min Dimension:</span> {options.min_dimension}</p>
                    )}
                    {options.max_dimension && (
                        <p><span className="font-bold">Max Dimension:</span> {options.max_dimension}</p>
                    )}
                </div>
            )}
            <div className="text-gray-700 font-bold mb-4 mt-4">Image Information</div>
            <ImageInformation imageUrl={imageUrl} dimensions={dimensions} />
            <UploadImageSection
                onFileChange={onFileChange}
                onUpload={onUpload}
                uploadedImageUrl={uploadedImageUrl}
            />
            <div className="text-gray-700 font-bold mb-4 mt-5">Download</div>
            <div className="mt-4 flex items-center">
                <label className="text-gray-700">w</label>
                <input
                    type="number"
                    value={imageWidth}
                    onChange={(e) => setImageWidth(Math.max(320, Math.min(1536, Number(e.target.value))))}
                    className="w-16 mx-2 p-2 border rounded"
                />
                <span>🔗</span>
                <input
                    type="checkbox"
                    checked={dimensions.linkDimensions}
                    onChange={toggleLinkDimensions}
                    className="mx-2"
                />
                <label className="text-gray-700">h</label>
                <input
                    type="number"
                    value={imageHeight}
                    onChange={(e) => setImageHeight(Math.max(320, Math.min(1536, Number(e.target.value))))}
                    className="w-16 ml-2 p-2 border rounded"
                />
            </div>
            <div className="mt-4">
                <button
                    onClick={() => downloadImage(imageUrl)}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                >
                    Download Image
                </button>
            </div>
        </>
    );
};

export default Design;
