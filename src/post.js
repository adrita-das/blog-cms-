import {uploadImage} from "./supabase-config.js";

//supabase-bucket for cover images

const uploadCover = document.getElementById('upload-cover');
let imageUrl = null;

uploadCover.addEventListener('change' , async(e) => {

    const file = e.target.files[0];

    if (!file) return;


const validTypes = ['image/png' , 'image/jpeg' , 'image/jpg'];

if (!validTypes.includes(file.type)) {
    alert('Please upload a valid image (PNG or JPEG)');
    return;
}

try {
    showLoadingState();

    imageUrl = await uploadImage(file);
    if(imageUrl) {
        displayImage(imageUrl);
        hideLoadingState();
        console.log('Image uploaded successfully:', imageUrl);
        alert('Image uploaded successfully');
    }
} catch (error){
    console.error('Error uploading image:', error);
    alert('Failed to upload image. Please try again.');
    hideLoadingState();
}

});

function displayImage(url) {

    const preview = document.createElement('div');
    preview.id='cover-preview';
    preview.className = 'mt-4 relative inline-block';

    const img = document.createElement('img');
    img.src = url;
    img.className = 'w-100 max-w-md h-80 object-cover rounded-lg border-2 border-gray-300 items-center';
    img.alt = 'Cover preview';

    const removeBtn = document.createElement('button');
    removeBtn.innerHTML = '<i class="fa-solid fa-times"></i>';
    removeBtn.className = 'absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition';
    removeBtn.type = 'button';
    removeBtn.onclick = () => {
        preview.remove();
        imageUrl = null;
        uploadCover.value = '';
    };

    preview.appendChild(img);
    preview.appendChild(removeBtn);

    const uploadParent = uploadCover.closest('.mb-8') || uploadCover.parentElement;
    uploadParent.appendChild(preview);
}
// Loading state functions
function showLoadingState() {
    const label = document.querySelector('label[for="upload-cover"]');
    if (label) {
        label.classList.add('opacity-50', 'pointer-events-none');
        const icon = label.querySelector('i');
        if (icon) {
            icon.className = 'fa-solid fa-spinner fa-spin';
        }
    }
}

function hideLoadingState() {
    const label = document.querySelector('label[for="upload-cover"]');
    if (label) {
        label.classList.remove('opacity-50', 'pointer-events-none');
        const icon = label.querySelector('i');
        if (icon) {
            icon.className = 'fa-solid fa-circle-plus';
        }
    }
}

export function getCoverImageUrl() {
    return imageUrl;
}