//==== user profile====//

import { getUser } from "./supabase-config";

function getProfile(email) {
  const colors = [
    "bg-purple-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];

  const index = email.charCodeAt(0) % colors.length;
  return colors[index];
}

function getInitial(email) {
  return email ? email.charAt(0).toUpperCase() : "U";
}


async function initProfile() {
  try {
    const user = await getUser();
    const userEmail = user.email;

    // if (!user) {
    //   console.error("No user logged in");
    //   // Redirect to signin if no user
    //   window.location.href = "./auth.html";
    //   return;
    // }

    const profileBtn = document.getElementById("profileBtn");
    const userInitial = document.getElementById("userInitial");
    const userEmailEl = document.getElementById("userEmail");
    const usernameEl = document.getElementById("username");

    const color = getProfile(userEmail);

    profileBtn.className = `w-10 h-10 rounded-full ${color} flex items-center justify-center text-white font-semibold hover:opacity-90 transition cursor-pointer`;
    userInitial.textContent = getInitial(userEmail);

    // Set email in dropdown
    userEmailEl.textContent = userEmail;
    usernameEl.textContent = "@" + userEmail.split("@")[0];
  } catch (error) {
    console.error("Error initializing profile:", error);
    //window.location.href = "./auth.html";
    //alert("Try Again");
  }
}

document.getElementById("profileBtn").addEventListener("click", () => {
  const menu = document.getElementById("profileMenu");
  menu.classList.toggle("hidden");
});

document.addEventListener("click", (e) => {
  const profileBtn = document.getElementById("profileBtn");
  const profileMenu = document.getElementById("profileMenu");

  if (!profileBtn.contains(e.target) && !profileMenu.contains(e.target)) {
    profileMenu.classList.add("hidden");
  }
});

initProfile();
