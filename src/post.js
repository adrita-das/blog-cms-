import {uploadImage,blogPost,updateData,publishPost,getAllPost,supabase} from "./supabase-config.js";

//===elements===//
const uploadCover = document.getElementById("upload-cover");
const postTitle = document.getElementById("post-title");
const postContent = document.getElementById("post-content");
const publishBtn = document.getElementById("publishBtn");
const draftBtn = document.getElementById("draftBtn");

//===handle cover images===//
let imageUrl = null;
let currentPostId = null;

//load post for editing
window.addEventListener("DOMContentLoaded", async () => {
  const url = new URLSearchParams(window.location.search);
  const postId = url.get("id");

  if (postId) {
    await editPost(postId);
  }
});

async function editPost(postId) {
  try {
    console.log("Loading post for editing", postId);
    postTitle.disabled = true,
    postContent.disabled = true,
    postTitle.placeholder = "Loading Post...",
    postContent.placeholder = "Loading Post...";

    const { data: post, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", postId)
      .single();

    if (error) {
      console.error("Error loading post:", error);
      alert("Failed to load post. Redirecting...");
      window.location.href = "post.html";
      return;
    }

    console.log('Post loaded:', post);

    currentPostId = postId;

    postTitle.value = post.title || '';
    postContent.value = post.content || '';
    imageUrl = post.cover_image || null;


    if(post.cover_image){
      displayImage(post.cover_image);
    
  }

    publishBtn.textContent = 'Update & Publish';
    draftBtn.textContent = 'Update Draft';
    
    // Re-enable inputs
    postTitle.disabled = false;
    postContent.disabled = false;
    postTitle.placeholder = "Title";
    postContent.placeholder = "Tell your story...";
    
    console.log('Post loaded successfully');
  }

  catch (error) {

    console.error('Error in loadPostForEditing:', error);
    alert('Failed to load post');
  }
}

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

//===post function====//

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

    if (currentPostId) {
      const updatedPost = await updateData(currentPostId, {
        title: title,
        content: content,
        coverImage: imageUrl,
        status: status,
      });
      console.log("Post updated:", updatedPost);
      alert("Post updated successfully!");


      if(status === "draft") {
        alert("Post in Draft")
      }
      else{
        alert("Post Published successfully");
      }
    } else {
      const newPost = await blogPost({
        title: title,
        content: content,
        coverImage: imageUrl,
        status: status,
      });
      console.log("Post created:", newPost);
      //alert("Post saved successfully!");

      if (status === "draft") {
        alert("Draft saved successfully!");
      } else {
        alert("Post published successfully!");
      }
    }

    if(status === "draft"){

      window.location.href = "./stories.html"

    }
    else{

      window.location.href = "./profile.html"
    }

    const btn = status === " Published " ? publishBtn : draftBtn;
    //const btn = status === "Draft" ? draftBtn;
    const text = btn.textContent;
    btn.disabled = true;
    btn.innerHTML = "Saving...";

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
  
  } catch (error) {
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



