import { supabase, resetPassword, updatePassword } from "./supabase-config.js";

// ---- Elements ----
const signInBtn = document.getElementById("signInBtn");
const signUpBtn = document.getElementById("signUpBtn");
const signInForm = document.getElementById("signInForm");
const signUpForm = document.getElementById("signUpForm");
const forgotPasswordForm = document.getElementById("forgotPasswordForm");
const forgotPasswordLink = document.getElementById("forgotPasswordLink");

// ---- Show only one form at a time ----
function showForm(formToShow) {
  [signInForm, signUpForm, forgotPasswordForm].forEach((f) =>
    f.classList.add("hidden")
  );

  const resetBox = document.getElementById("resetPassword");
  if (resetBox) resetBox.classList.add("hidden");

  formToShow.classList.remove("hidden");
}

forgotPasswordLink.addEventListener("click", () => showForm(forgotPasswordForm));
signInBtn.addEventListener("click", () => showForm(signInForm));
signUpBtn.addEventListener("click", () => showForm(signUpForm));

// ---- Step 1: send the reset email ----
forgotPasswordForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("forgotPasswordEmail").value.trim();
  const errorEl = document.getElementById("forgotPasswordError");
  const successEl = document.getElementById("forgotPasswordSuccess");

  errorEl.classList.add("hidden");
  successEl.classList.add("hidden");

  // The email link returns to whichever site you are on right now
  const { error } = await resetPassword(
    email,
    `${window.location.origin}/auth.html`
  );

  if (error) {
    errorEl.textContent = error.message;
    errorEl.classList.remove("hidden");
    return;
  }

  successEl.textContent = "Password reset link sent. Check your email.";
  successEl.classList.remove("hidden");
});

// ---- Step 2: user comes back from the email link ----
function showResetPasswordForm() {
  // Don't create the form twice
  if (document.getElementById("resetPassword")) return;

  [signInForm, signUpForm, forgotPasswordForm].forEach((f) =>
    f.classList.add("hidden")
  );

  const container = document.createElement("div");
  container.id = "resetPassword";
  container.innerHTML = `
    <form id="updatePasswordForm" class="space-y-4">
      <h2 class="text-bold text-xl">Set a New Password</h2>
      <label class="text-sm font-semibold font-sans">New Password</label>
      <input type="password" id="newPassword" minlength="6" required
             class="w-full border-2 border-black rounded-md px-2" />
      <button type="submit"
              class="flex-1 bg-black text-white text-sm p-2 m-2 rounded-md cursor-pointer">
        Update Password
      </button>
      <p id="updatePasswordError" class="text-red-600 text-sm hidden"></p>
      <p id="updatePasswordSuccess" class="text-green-600 text-sm hidden"></p>
    </form>
  `;

  document.querySelector(".max-w-md").appendChild(container);

  document
    .getElementById("updatePasswordForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const newPassword = document.getElementById("newPassword").value;
      const errorEl = document.getElementById("updatePasswordError");
      const successEl = document.getElementById("updatePasswordSuccess");

      errorEl.classList.add("hidden");

      const { error } = await updatePassword(newPassword);

      if (error) {
        errorEl.textContent = error.message;
        errorEl.classList.remove("hidden");
        return;
      }

      successEl.textContent = "Password updated! Redirecting to sign in...";
      successEl.classList.remove("hidden");

      // End the temporary recovery login, then go to a clean sign-in page
      await supabase.auth.signOut();
      setTimeout(() => {
        window.location.href = "./auth.html";
      }, 2000);
    });
}

// Supabase fires this event when the user arrives from the reset email
supabase.auth.onAuthStateChange((event) => {
  if (event === "PASSWORD_RECOVERY") {
    showResetPasswordForm();
  }
});

// Backup check, runs once when the page loads
if (window.location.hash.includes("type=recovery")) {
  showResetPasswordForm();
}