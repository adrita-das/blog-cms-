// ===== admin.js =====
import { getUser, supabase } from "./supabase-config.js";

let allPosts = [];
let postToDelete = null;

// ── 1. Guard: only admin can access ──────────────────────────────────────────
async function checkAdmin() {
  const user = await getUser();

  if (!user) {
    window.location.href = "./auth.html";
    return null;
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();


  if (error || !profile || profile.role !== "admin") {
    // Not an admin → send them away
    window.location.href = "./profile.html";
    return null;
  }

  // Show admin email in navbar
  const adminEmailEl = document.getElementById("adminEmail");
  if (adminEmailEl) adminEmailEl.textContent = user.email;

  return user;
}

// ── 2. Load stats ─────────────────────────────────────────────────────────────
async function loadStats() {
  const { data: posts } = await supabase.from("posts").select("status");
  const { data: profiles } = await supabase.from("profiles").select("id");

  const total = posts?.length ?? 0;
  const published = posts?.filter((p) => p.status === "published").length ?? 0;
  const drafts = posts?.filter((p) => p.status === "draft").length ?? 0;
  const users = profiles?.length ?? 0;

  document.getElementById("stat-total").textContent = total;
  document.getElementById("stat-published").textContent = published;
  document.getElementById("stat-drafts").textContent = drafts;
  document.getElementById("stat-users").textContent = users;
}

// ── 3. Load all posts ─────────────────────────────────────────────────────────
async function loadPosts(filter = "all") {
  const postsList = document.getElementById("posts-list");

  let query = supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (filter !== "all") {
    query = query.eq("status", filter);
  }

  const { data: posts, error } = await query;

  if (error) {
    postsList.innerHTML = `<p class="text-red-500 text-sm px-6 py-4">Error loading posts: ${error.message}</p>`;
    return;
  }

  allPosts = posts || [];

  if (allPosts.length === 0) {
    postsList.innerHTML = `
      <div class="px-6 py-10 text-center text-gray-400 text-sm">
        No posts found.
      </div>
    `;
    return;
  }

  postsList.innerHTML = allPosts
    .map((post) => {
      const author = post.author_email?.split("@")[0] ?? "unknown";
      const date = new Date(post.created_at).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      });
      const isPublished = post.status === "published";

      return `
        <div class="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 items-center transition">
          
          <!-- Title -->
          <div class="col-span-5">
            <p class="font-medium text-sm text-gray-900 truncate">${post.title}</p>
            <p class="text-xs text-gray-400 mt-0.5">${date}</p>
          </div>

          <!-- Author -->
          <div class="col-span-3">
            <p class="text-sm text-gray-600">@${author}</p>
          </div>

          <!-- Status Badge -->
          <div class="col-span-2">
            <span class="inline-block px-2 py-1 rounded-full text-xs font-semibold ${
              isPublished
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }">
              ${post.status}
            </span>
          </div>

          <!-- Actions -->
          <div class="col-span-2 flex justify-end gap-2">
            <!-- Toggle Status -->
            <button
              onclick="toggleStatus('${post.id}', '${post.status}')"
              title="${isPublished ? "Move to Draft" : "Publish"}"
              class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
            >
              <i class="fas ${isPublished ? "fa-eye-slash" : "fa-eye"} text-xs"></i>
            </button>

            <!-- Delete -->
            <button
              onclick="openDeleteModal('${post.id}')"
              title="Delete Post"
              class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
            >
              <i class="fas fa-trash text-xs"></i>
            </button>
          </div>
        </div>
      `;
    })
    .join("");
}

// ── 4. Toggle post status ─────────────────────────────────────────────────────
window.toggleStatus = async function (postId, currentStatus) {
  const newStatus = currentStatus === "published" ? "draft" : "published";

  const { error } = await supabase
    .from("posts")
    .update({ status: newStatus })
    .eq("id", postId);

  if (error) {
    alert("Failed to update status: " + error.message);
    return;
  }

  // Reload the active filter
  const activeFilter = document.querySelector(".active-filter")?.dataset.filter ?? "all";
  await loadPosts(activeFilter);
  await loadStats();
};

// ── 5. Delete post ────────────────────────────────────────────────────────────
window.openDeleteModal = function (postId) {
  postToDelete = postId;
  document.getElementById("deleteModal").classList.remove("hidden");
};

document.getElementById("cancelDelete").addEventListener("click", () => {
  postToDelete = null;
  document.getElementById("deleteModal").classList.add("hidden");
});

document.getElementById("confirmDelete").addEventListener("click", async () => {
  if (!postToDelete) return;

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postToDelete);

  document.getElementById("deleteModal").classList.add("hidden");
  postToDelete = null;

  if (error) {
    alert("Failed to delete: " + error.message);
    return;
  }

  const activeFilter = document.querySelector(".active-filter")?.dataset.filter ?? "all";
  await loadPosts(activeFilter);
  await loadStats();
});

// ── 6. Load users ─────────────────────────────────────────────────────────────
async function loadUsers() {
  const usersList = document.getElementById("users-list");

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    usersList.innerHTML = `<p class="text-red-500 text-sm px-6 py-4">Error loading users: ${error.message}</p>`;
    return;
  }

  if (!profiles || profiles.length === 0) {
    usersList.innerHTML = `
      <div class="px-6 py-10 text-center text-gray-400 text-sm">
        No users found.
      </div>
    `;
    return;
  }

  usersList.innerHTML = profiles
    .map((profile) => {
      const date = new Date(profile.created_at).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      });
      const isAdmin = profile.role === "admin";

      return `
        <div class="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 items-center transition">
          
          <!-- Email -->
          <div class="col-span-5">
            <p class="text-sm text-gray-900">${profile.username ?? "—"}</p>
          </div>

          <!-- Role -->
          <div class="col-span-3">
            <span class="inline-block px-2 py-1 rounded-full text-xs font-semibold ${
              isAdmin
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-600"
            }">
              ${profile.role ?? "user"}
            </span>
          </div>

          <!-- Joined -->
          <div class="col-span-4">
            <p class="text-sm text-gray-500">${date}</p>
          </div>
        </div>
      `;
    })
    .join("");
}

// ── 7. Filter tabs ────────────────────────────────────────────────────────────
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    // Update active style
    document.querySelectorAll(".filter-btn").forEach((b) => {
      b.classList.remove("active-filter", "bg-black", "text-white");
      b.classList.add("bg-gray-100", "text-gray-700");
    });
    btn.classList.add("active-filter", "bg-black", "text-white");
    btn.classList.remove("bg-gray-100", "text-gray-700");

    await loadPosts(btn.dataset.filter);
  });
});

// ── 8. Sign out ───────────────────────────────────────────────────────────────
document.getElementById("signOutBtn").addEventListener("click", async () => {
  await supabase.auth.signOut();
  window.location.href = "./auth.html";
});

// ── 9. Init ───────────────────────────────────────────────────────────────────
async function init() {
  const user = await checkAdmin();
  if (!user) return; // Redirected if not admin

  await Promise.all([loadStats(), loadPosts(), loadUsers()]);
}

init();