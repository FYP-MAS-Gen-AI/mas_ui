import React from 'react';

interface ToolbarProps {
    mode: string;
    imageUrl: string;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onUpload: () => void;
    uploadedImageUrl: string;
    onShowModal: () => void;
    selectedImages: any[];
    brushSize: number;
    setBrushSize: React.Dispatch<React.SetStateAction<number>>;
    tool: string;
    setTool: React.Dispatch<React.SetStateAction<string>>;
}

const Toolbar: React.FC<ToolbarProps> = ({
                                             mode,
                                             imageUrl,
                                             onFileChange,
                                             onUpload,
                                             uploadedImageUrl,
                                             onShowModal,
                                             selectedImages,
                                             brushSize,
                                             setBrushSize,
                                             tool,
                                             setTool,
                                         }) => {
    return (
        <div className="w-64 bg-gray-200 p-4">
            {mode === 'Design' && (
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
                            {selectedImages.map((file) => (
                                <div key={file.id} className="mb-2">
                                    <img src={file.link} alt={file.title} className="w-full rounded"/>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
            {mode === 'Edit' && (
                <div>
                    <p>Edit Toolbar - Draw on the image to create a mask</p>
                    <div className="mt-4">
                        <button onClick={() => setTool('brush')}
                                className={`py-2 px-4 rounded mr-2 ${tool === 'brush' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                            Brush
                        </button>
                        <button onClick={() => setTool('eraser')}
                                className={`py-2 px-4 rounded mr-2 ${tool === 'eraser' ? 'bg-red-500 text-white' : 'bg-gray-300 text-black'}`}>
                            Eraser
                        </button>
                        <button onClick={() => setTool('none')}
                                className={`py-2 px-4 rounded ${tool === 'none' ? 'bg-yellow-500 text-white' : 'bg-gray-300 text-black'}`}>
                            Select
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
                    <p>History Toolbar - Show project history here</p>
                </div>
            )}
        </div>
    );
};

export default Toolbar;
