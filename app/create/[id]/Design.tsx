import React from 'react';

interface Dimensions {
    width: number;
    height: number;
    linkDimensions: boolean;
}

interface DesignProps {
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onUpload: () => void;
    uploadedImageUrl: string;
    onShowModal: () => void;
    selectedImage: any;
    dimensions: Dimensions;
    handleWidthChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleHeightChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    toggleLinkDimensions: () => void;
}

const Design: React.FC<DesignProps> = ({
                                           onFileChange,
                                           onUpload,
                                           uploadedImageUrl,
                                           onShowModal,
                                           selectedImage,
                                           dimensions,
                                           handleWidthChange,
                                           handleHeightChange,
                                           toggleLinkDimensions
                                       }) => {
    const downloadImage = (imageUrl: string) => {
        console.log('Downloading image:', imageUrl);
        fetch(imageUrl)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'image.png'; // You can customize the filename here
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            })
            .catch(error => console.error('Error downloading image:', error));
    };

    return (
        <>
            <div className="text-gray-700 font-bold mb-4">Upload Image</div>
            <input type="file" onChange={onFileChange} className="mb-2"/>
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
                            <img src={selectedImage.url} alt={selectedImage.title} className="w-full rounded"/>
                            <button onClick={() => downloadImage(selectedImage.url)}
                                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Download
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-4 flex items-center">
                <label className="text-gray-700">w</label>
                <input
                    type="number"
                    value={dimensions.width}
                    onChange={handleWidthChange}
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
                    value={dimensions.height}
                    onChange={handleHeightChange}
                    className="w-16 ml-2 p-2 border rounded"
                />
            </div>
        {/*    Download button*/}
            <div className="mt-4">
                <button
                    onClick={() => downloadImage(uploadedImageUrl)}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                >
                    Download Image
                </button>
            </div>
        </>
    );
};

export default Design;
