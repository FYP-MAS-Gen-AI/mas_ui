// export const generateSimpleMask = async (imageUrl: string) => {
//     // For demonstration, create a simple mask with a black rectangle in the center
//     const img = new Image();
//     img.crossOrigin = "Anonymous";
//     img.src = imageUrl;
//
//     return new Promise<string>((resolve) => {
//         img.onload = () => {
//             const canvas = document.createElement('canvas');
//             canvas.width = img.width;
//             canvas.height = img.height;
//             const ctx = canvas.getContext('2d');
//             if (ctx) {
//                 ctx.drawImage(img, 0, 0);
//                 ctx.fillStyle = 'black';
//                 ctx.fillRect(img.width / 4, img.height / 4, img.width / 2, img.height / 2);
//                 resolve(canvas.toDataURL('image/png'));
//             }
//         };
//     });
// };

export const uploadImageToCloudinary = async (image: string | File, preset: string = 'fr2fxnpz') => {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', preset);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/det0mvsek/image/upload`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error('Error uploading the image', error);
        return null;
    }
};

export const saveUrlToSupabase = async (supabase, table: string, url: string, fileName: string) => {
    const {data, error} = await supabase
        .from(table)
        .insert([{file_name: fileName, title: fileName, link: url}]);

    if (error) {
        console.error(`Error saving the ${table} URL to Supabase`, error);
        return null;
    } else {
        console.log(`${table} URL saved to Supabase`, data);
        return data;
    }
};

export const generateImage = async (url: string, payload: object) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            return await response.json();
        } else {
            console.error('Failed to generate image:', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error generating image:', error);
        return null;
    }
};
