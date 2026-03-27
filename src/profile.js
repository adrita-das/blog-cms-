//==== user profile====//

import { getUser, supabase } from "./supabase-config.js";  
import {
  timeAgo,
  readingTime,
  getProfile,
  getInitial
} from './utils.js'

//profile dropdown
async function initProfile() {
  try {
    const user = await getUser();
    
    if (!user) {
      console.error("No user logged in");
      window.location.href = "./index.html";
      return;
    }

    const userEmail = user.email;
    const profileBtn = document.getElementById("profileBtn");
    const userInitial = document.getElementById("userInitial");
    const userEmailEl = document.getElementById("userEmail");
    const usernameEl = document.getElementById("username");

    const color = getProfile(userEmail);

    profileBtn.className = `w-10 h-10 rounded-full ${color} flex items-center justify-center text-white font-semibold hover:opacity-90 transition cursor-pointer`;
    userInitial.textContent = getInitial(userEmail);

    // Set email in dropdown
    if (userEmailEl) userEmailEl.textContent = userEmail;
    if (usernameEl) usernameEl.textContent = "@" + userEmail.split("@")[0];
  } catch (error) {
    console.error("Error initializing profile:", error);
  }
}

// Profile menu toggle
const profileBtn = document.getElementById("profileBtn");
const profileMenu = document.getElementById("profileMenu");

if (profileBtn && profileMenu) {
  profileBtn.addEventListener("click", () => {
    profileMenu.classList.toggle("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!profileBtn.contains(e.target) && !profileMenu.contains(e.target)) {
      profileMenu.classList.add("hidden");
    }
  });
}

//get published posts
async function publishedPost() {
  try {
    const { data: posts, error } = await supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return posts || [];
  } catch (error) {
    console.error("Error fetching published posts:", error);
    return [];
  }
}


async function displayPublishPost() {
  const feed = document.getElementById("posts-feed");

  if (!feed) {
    console.error("Posts feed element not found");
    return;
  }

  // Show loading
  feed.innerHTML = `
    <div class="text-center py-12">
      <i class="fas fa-spinner fa-spin text-3xl text-gray-400"></i>
      <p class="text-gray-500 mt-4">Loading posts...</p>
    </div>
  `;

  const posts = await publishedPost();

  if (posts.length === 0) {
    feed.innerHTML = `
      <div class="text-center py-12">
        <i class="fas fa-newspaper text-5xl text-gray-300 mb-4"></i>
        <p class="text-gray-500 text-lg">No published posts yet</p>
        <a href="post.html" class="inline-block mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
          Write first post
        </a>
      </div>
    `;
    return;
  }

  feed.innerHTML = posts
    .map((post) => {
      const authorColor = getProfile(post.author_id);
      const authorInitial = getInitial(post.author_id);
      
      
      return `
      <article class="bg-white rounded-lg shadow-sm hover:shadow-md transition p-6 mb-6">
        <!-- Author Info -->
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full ${authorColor} flex items-center justify-center text-white font-semibold">
            ${authorInitial}
          </div>
          <div>
            <p class="font-medium text-sm">Blog Author</p>
            <p class="text-xs text-gray-500">${timeAgo(post.created_at)}</p>
          </div>
        </div>
        
        <!-- Post Content -->
        <div class="flex gap-6">
          <div class="flex-1">
            <h2 class="text-2xl font-bold mb-2 hover:text-green-600 cursor-pointer">
              ${post.title}
            </h2>
            <p class="text-gray-600 mb-4" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
              ${post.content.substring(0, 200)}${post.content.length > 200 ? "..." : ""}
            </p>
            <div class="flex items-center gap-4 text-sm text-gray-500">
              <span>${readingTime(post.content)}</span>
              <span>·</span>
              <span>${new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
            </div>
          </div>
          
          <!-- Cover Image -->
          ${post.cover_image
            ? `
            <div class="w-40 h-32 flex shrink-0">
              <img 
                src="${post.cover_image}" 
                alt="Cover" 
                class="w-full h-full object-cover rounded-lg"
              />
            </div>
            `
            : ""
          }
        </div>
      </article>
    `;
    })
    .join("");
}

// Initialize
initProfile();
displayPublishPost();