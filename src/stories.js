import { supabase, getUserPosts, deletePost, updateData} from "./supabase-config.js";

function timeAgo(date) {
  const now = new Date();
  const postDate = new Date(date);
  const sec = Math.floor((now - postDate) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(sec / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? "" : "s"} ago`;
    }
  }

  return "just now";
}

// Calculate reading time 
function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read (${words} words)`;
}


function renderPosts(posts, status) {
  const container = document.getElementById("posts-container");
  const filteredPosts = posts.filter((post) => post.status === status);

  
  if (status === 'draft') {
    document.getElementById("draft-count").textContent = filteredPosts.length;
  }

  if (filteredPosts.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12">
        <p class="text-gray-500 text-lg">No ${status} stories yet</p>
        <a href="post.html" class="inline-block mt-4 text-black hover:text-amber-300 font-medium">
          Create your first story
        </a>
      </div>
    `;
    return;
  }
  
  container.innerHTML = filteredPosts
    .map(
      (post) => `
    <div class="grid grid-cols-12 gap-4 py-6 border-b border-gray-300 hover:bg-gray-50 transition group">
      <!-- Latest Column -->
      <div class="col-span-6">
        <div class="flex gap-4">
          ${
            post.cover_image
              ? `
            <img 
              src="${post.cover_image}" 
              alt="Cover" 
              class="w-20 h-20 object-cover rounded"
            />
          `
              : `
            <div class="w-20 h-20 bg-amber-100 rounded flex items-center justify-center">
              <i class="fas fa-image text-gray-400 text-2xl"></i>
            </div>
          `
          }
          <div class="flex-1">
            <h3 class="font-semibold text-lg mb-1 group-hover:text-amber-300 cursor-pointer" 
                onclick="window.location.href='post.html?id=${post.id}'">
              ${post.title || "Untitled story"}
            </h3>
            <p class="text-sm text-gray-600">
              ${calculateReadingTime(post.content)} · Updated ${timeAgo(post.updated_at)}
            </p>
          </div>
        </div>
      </div>
      
      <!-- Publication Column -->
      <div class="col-span-3 flex items-center">
        <span class="text-sm text-gray-600">PUCC BLOG</span>
      </div>
      
      <!-- Status Column -->
      <div class="col-span-3 flex items-center justify-between">
        <span class="text-sm text-gray-600 capitalize">${post.status}</span>
        <div class="relative">
          <button 
            class="text-gray-400 hover:text-gray-600 p-2"
            onclick="toggleMenu(event, '${post.id}')"
          >
            <i class="fas fa-ellipsis-h"></i>
          </button>
          <div id="menu-${post.id}" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
            <button 
              onclick="editPost('${post.id}')"
              class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
            >
              <i class="fas fa-edit w-4"></i>
              Edit story
            </button>
            <button 
              onclick="deletePostHandler('${post.id}')"
              class="w-full px-4 py-2 text-left hover:bg-gray-50 text-red-600 flex items-center gap-2"
            >
              <i class="fas fa-trash w-4"></i>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

// Toggle menu
 window.toggleMenu = function (event, postId) {
   event.stopPropagation();

   // Close all other menus
   document.querySelectorAll('[id^="menu-"]').forEach((menu) => {
     if (menu.id !== `menu-${postId}`) {
       menu.classList.add("hidden");
    }
   });

   const menu = document.getElementById(`menu-${postId}`);
   menu.classList.toggle("hidden");
 };

// Close menus when clicking outside
 document.addEventListener("click", () => {
   document.querySelectorAll('[id^="menu-"]').forEach((menu) => {
     menu.classList.add("hidden");
   });
 });

// Edit post
window.editPost = function (postId) {
  window.location.href = `post.html?id=${postId}`;
};

// Delete post handler
window.deletePostHandler = async function (postId) {
  if (
    !confirm(
      "Are you sure you want to delete this story? This action cannot be undone."
    )
  ) {
    return;
  }

  try {
    await deletePost(postId);
    alert("Story deleted successfully");
    loadPosts(); 
  } catch (error) {
    console.error("Error deleting post:", error);
    alert("Failed to delete story. Please try again.");
  }
};

async function loadPosts() {
  try {
    const container = document.getElementById("posts-container");
    container.innerHTML = `
      <div class="text-center py-12">
        <i class="fas fa-spinner fa-spin text-3xl text-gray-400"></i>
        <p class="text-gray-500 mt-4">Loading your stories...</p>
      </div>
    `;
    
    const posts = await getUserPosts();

    if (!posts) {
      container.innerHTML = `
        <div class="text-center py-12">
          <p class="text-gray-500">Failed to load stories</p>
        </div>
      `;
      return;
    }

    // Initial load - show drafts
    renderPosts(posts, 'draft');
    
    // Set up tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active state from all tabs
        tabButtons.forEach(btn => {
          btn.classList.remove('border-b-2', 'border-black', 'text-black');
          btn.classList.add('text-gray-500');
        });
        
        // Add active state to clicked tab
        button.classList.add('border-b-2', 'border-black', 'text-black');
        button.classList.remove('text-gray-500');
        
        // Render posts for selected status
        const status = button.dataset.status;
        renderPosts(posts, status);
      });
    });
  } catch (error) {
    console.error('Error loading posts:', error);
    const container = document.getElementById('posts-container');
    container.innerHTML = `
      <div class="text-center py-12">
        <p class="text-red-500">Error loading stories. Please refresh the page.</p>
      </div>
    `;
  }
}

// Set user initial in profile button
async function initializeUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      window.location.href = './login.html';
      return;
    }
    
    const initial = user.email ? user.email[0].toUpperCase() : 'U';
    const profileBtn = document.getElementById('userInitial');
    if (profileBtn) {
      profileBtn.textContent = initial;
    }
  } catch (error) {
    console.error('Error initializing user:', error);
  }
}

// Initialize
initializeUser();
loadPosts(); // FIXED: was calling loadPost() instead of loadPosts()