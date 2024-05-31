'use client';

import { useState, useEffect, useRef } from 'react';

import NavBar from '@/components/navbar/NavBar';
import Toolbar from '@/components/toolbar/Toolbar';
import InputSection from '@/components/input_section/InputSection';
import DrawingCanvas from '@/components/toolbar/DrawingContext';
import {
    uploadImageToCloudinary,
    saveUrlToSupabase,
    generateImage
} from '@/components/apis/Apis';
import useSupabaseClient from "@/lib/supabase/client";

const BASE_URL = "http://127.0.0.1:8005";

const Page = () => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState<string>('');
    const [selectedModel, setSelectedModel] = useState<string>('fooocus');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
    const [files, setFiles] = useState<any[]>([]);
    const [selectedImages, setSelectedImages] = useState<any[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [mode, setMode] = useState<string>('Text -> Image');
    const [selectedTab, setSelectedTab] = useState<string>('Design');
    const [brushSize, setBrushSize] = useState<number>(5);
    const [tool, setTool] = useState<string>('brush');

    const canvasRef = useRef<any>(null); // Use a ref to get the canvas data URL

    const supabase = useSupabaseClient();

    useEffect(() => {
        const fetchFiles = async () => {
            const { data, error } = await supabase.from('files').select('*');
            if (error) {
                console.error('Error fetching files from Supabase', error);
            } else {
                setFiles(data || []);
            }
        };
        fetchFiles();
    }, [supabase]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (imageFile) {
            const url = await uploadImageToCloudinary(imageFile);
            if (url) {
                setUploadedImageUrl(url);
                const data = await saveUrlToSupabase(supabase, 'files', url, imageFile.name);
                setFiles([...files, ...data]);
            }
        }
    };

    const handleGenerateImage = async () => {
        console.log("Generating image with input:", inputValue);

        if (mode === 'Edit') {
            console.log("Generating image with Inpaint and Outpaint");
            // Get the mask data URL from the canvas
            const maskDataUrl = canvasRef.current ? canvasRef.current.getCanvasDataUrl() : '';
            console.log("maskDataUrl", maskDataUrl);
            const maskUrl = await uploadImageToCloudinary(maskDataUrl);
            console.log("maskUrl", maskUrl);
            if (maskUrl) {
                await saveUrlToSupabase(supabase, 'files_mask', maskUrl, `mask`);

                const data = await generateImage(`${BASE_URL}/inpaintAndOutpaint`, {
                    file1: imageUrl,
                    file2: maskUrl,
                    prompt: inputValue,
                    sharpness: '5',
                    cn_type1: 'ImagePrompt',
                    base_model_name: 'model_name',
                    style_selections: 'style',
                    performance_selection: 'performance',
                    image_number: '1',
                    negative_prompt: '',
                    image_strength: '0.8',
                    cfg_scale: '7',
                    samples: '1',
                    steps: '50',
                    init_image_mode: 'IMAGE_STRENGTH',
                    clip_guidance_preset: 'FAST_BLUE',
                    mask_source: 'MASK_IMAGE',
                    model: selectedModel
                });
                console.log("Generating image with Inpaint and Outpaint successful");

                if (data && data[0]) {
                    const generatedImageUrl = data[0].url;
                    setImageUrl(generatedImageUrl);

                    // Fetch the image from the URL
                    const response = await fetch(generatedImageUrl);
                    const blob = await response.blob();

                    // Upload the image blob to Cloudinary
                    const uploadedUrl = await uploadImageToCloudinary(blob);

                    // set image url
                    setImageUrl(uploadedUrl);

                    console.log("uploadedUrl", uploadedUrl);
                    if (uploadedUrl) {
                        console.log("Generated image uploaded to Cloudinary:", uploadedUrl);
                        await saveUrlToSupabase(supabase, 'files', uploadedUrl, "");
                    }
                }
            }
        } else if (mode === 'Text + Image -> Image' && selectedImages.length > 0) {
            console.log("Generating image with Text and Image");
            const data = await generateImage(`${BASE_URL}/textAndImageToImage`, {
                image_url: selectedImages[0].link,
                prompt: inputValue,
                sharpness: '5',
                cn_type1: 'ImagePrompt',
                base_model_name: 'model_name',
                style_selections: 'style',
                performance_selection: 'performance',
                image_number: '1',
                negative_prompt: '',
                image_strength: '0.8',
                cfg_scale: '7',
                samples: '1',
                steps: '50',
                init_image_mode: 'IMAGE_STRENGTH',
                model: selectedModel
            });

            console.log("data", data);
            if (data && data[0]) {
                const generatedImageUrl = data[0].url;
                setImageUrl(generatedImageUrl);

                // Fetch the image from the URL
                const response = await fetch(generatedImageUrl);
                const blob = await response.blob();

                // Upload the image blob to Cloudinary
                const uploadedUrl = await uploadImageToCloudinary(blob);

                // set image url
                setImageUrl(uploadedUrl);

                console.log("uploadedUrl", uploadedUrl);
                if (uploadedUrl) {
                    console.log("Generated image uploaded to Cloudinary:", uploadedUrl);
                    await saveUrlToSupabase(supabase, 'files', uploadedUrl, "");
                }
            }
        } else {
            console.log("Generating image with Text");
            const data = await generateImage(`${BASE_URL}/textToImage`, {
                model: selectedModel,
                input: { prompt: inputValue }
            });

            console.log("data", data);
            if (data && data[0]) {
                const generatedImageUrl = data[0].url;
                setImageUrl(generatedImageUrl);

                // Fetch the image from the URL
                const response = await fetch(generatedImageUrl);
                const blob = await response.blob();

                // Upload the image blob to Cloudinary
                const uploadedUrl = await uploadImageToCloudinary(blob);

                // set image url
                setImageUrl(uploadedUrl);

                console.log("uploadedUrl", uploadedUrl);
                if (uploadedUrl) {
                    console.log("Generated image uploaded to Cloudinary:", uploadedUrl);
                    await saveUrlToSupabase(supabase, 'files', uploadedUrl, "");
                }
            }
        }
    };


    return (
        <div className="min-h-screen flex flex-col">
            <NavBar selectedTab={selectedTab} onSelectTab={setSelectedTab} />
            <div className="flex flex-1">
                <Toolbar
                    mode={selectedTab}
                    imageUrl={uploadedImageUrl}
                    onFileChange={handleFileChange}
                    onUpload={handleUpload}
                    uploadedImageUrl={uploadedImageUrl}
                    onShowModal={() => setShowModal(true)}
                    selectedImages={selectedImages}
                    brushSize={brushSize}
                    setBrushSize={setBrushSize}
                    tool={tool}
                    setTool={setTool}
                />
                <div className="flex-1 flex flex-col">
                    <div className="flex-1 flex justify-center items-center bg-gray-100 p-4">
                        <DrawingCanvas
                            imageUrl={imageUrl}
                            brushSize={brushSize}
                            tool={tool}
                            ref={canvasRef} // Use ref to get the canvas data URL
                        />
                    </div>
                    <InputSection
                        mode={mode}
                        selectedModel={selectedModel}
                        inputValue={inputValue}
                        onModelChange={(e) => setSelectedModel(e.target.value)}
                        onInputChange={(e) => setInputValue(e.target.value)}
                        onGenerateImage={handleGenerateImage}
                        onModeChange={(e) => setMode(e.target.value)}
                    />
                </div>
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-4 rounded shadow-lg max-w-lg w-full">
                        <h2 className="text-xl font-bold mb-4">Select an Image</h2>
                        <div className="grid grid-cols-2 gap-2">
                            {files.map((file) => (
                                <div key={file.id} className="cursor-pointer" onClick={() => {
                                    setSelectedImages([...selectedImages, file]);
                                    setShowModal(false);
                                }}>
                                    <img src={file.link} alt={file.title} className="w-full rounded" />
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowModal(false)}
                            className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Page;
