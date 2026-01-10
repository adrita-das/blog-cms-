import { uploadImage, blogPost, getUser } from "./supabase-config.js";

//===elements===//
const uploadCover = document.getElementById("upload-cover");
const postTitle = document.getElementById("post-title");
const postContent = document.getElementById("post-content");
const publishBtn = document.getElementById("publishBtn");
const draftBtn = document.getElementById("draftBtn");
const count = document.getElementById("char-count");

//===handle cover images===//
let imageUrl = null;

uploadCover.addEventListener("change", async (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const validTypes = ["image/png", "image/jpeg", "image/jpg"];

  if (!validTypes.includes(file.type)) {
    alert("Please upload a valid image (PNG or JPEG)");
    return;
  }

  try {
    showLoadingState();

    imageUrl = await uploadImage(file);
    if (imageUrl) {
      displayImage(imageUrl);
      hideLoadingState();
      console.log("Image uploaded successfully:", imageUrl);
      alert("Image uploaded successfully");
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    alert("Failed to upload image. Please try again.");
    hideLoadingState();
  }
});

function displayImage(url) {
  const preview = document.createElement("div");
  preview.id = "cover-preview";
  preview.className = "mt-4 relative flex justify-center";

  const img = document.createElement("img");
  img.src = url;
  img.className =
    "w-100 max-w-md h-80 object-cover rounded-lg border-2 border-gray-300 items-center";
  img.alt = "Cover preview";

  const removeBtn = document.createElement("button");
  removeBtn.innerHTML = '<i class="fa-solid fa-times"></i>';
  removeBtn.className =
    "relative top-0 right-0 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-red-600 transition";
  removeBtn.type = "button";
  removeBtn.onclick = () => {
    preview.remove();
    imageUrl = null;
    uploadCover.value = "";
  };

  preview.appendChild(img);
  preview.appendChild(removeBtn);

  const uploadParent =
    uploadCover.closest(".mb-8") || uploadCover.parentElement;
  uploadParent.appendChild(preview);
}
// Loading state functions
function showLoadingState() {
  const label = document.querySelector('label[for="upload-cover"]');
  if (label) {
    label.classList.add("opacity-50", "pointer-events-none");
    const icon = label.querySelector("i");
    if (icon) {
      icon.className = "fa-solid fa-spinner fa-spin";
    }
  }
}

function hideLoadingState() {
  const label = document.querySelector('label[for="upload-cover"]');
  if (label) {
    label.classList.remove("opacity-50", "pointer-events-none");
    const icon = label.querySelector("i");
    if (icon) {
      icon.className = "fa-solid fa-circle-plus";
    }
  }
}

export function getCoverImageUrl() {
  return imageUrl;
}

//===post function

async function savePost(status = "draft") {
  try {
    const title = postTitle.value.trim();
    const content = postContent.value.trim();

    if (!title) {
      alert("Please enter a title");
      postTitle.focus();
      return;
    }

    if (!content) {
      alert("Please add some content");
      return;
    }

    const btn = status === " Published " ? publishBtn : draftBtn;
    const text = btn.textContent;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>Saving...';

    const savedPost = await blogPost({
      title: title,
      content: content,
      coverImage: imageUrl,
      status: status,
    });

    console.log("Post saved:", savedPost);

    alert(
      status === "published"
        ? "Post published successfully!"
        : "Draft saved successfully!"
    );

    window.location.href = "./stories.html";
  } catch(error) {
    console.error("Error saving post:", error);
    alert(error.message || "Failed to save post. Please try again.");

    // Reset button
    const btn = status === "published" ? publishBtn : draftBtn;
    btn.disabled = false;
    btn.textContent = status === "published" ? "Publish" : "Save Draft";

  }  
}


 publishBtn.addEventListener("click", () => savePost("published"));
 draftBtn.addEventListener("click", () => savePost("draft"));

// // Warn before leaving with unsaved changes
// window.addEventListener("beforeunload", (e) => {
//   const title = postTitle.value.trim();
//   const content = postContent.value.trim();

//   if (title || content) {
//     e.preventDefault();
//     e.returnValue = "";
//   }
// });
