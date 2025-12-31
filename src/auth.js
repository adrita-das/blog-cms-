import { signIn, signUp } from "./supabase-config.js";

const signInBtn = document.getElementById('signInBtn');
const signupBtn = document.getElementById('signUpBtn');
const signInForm = document.getElementById('signInForm');
const signUpForm = document.getElementById('signUpForm');
const signInError = document.getElementById('signInError');
const signUpError = document.getElementById('signUpError');
const signUpSuccess = document.getElementById('signUpSuccess');

// Handle toggle between Sign In and Sign Up
signInBtn.addEventListener('click', () => {
  // Show sign in form
  signInForm.classList.remove('hidden');
  signUpForm.classList.add('hidden');
  
  // Update button styles
  signInBtn.classList.add('bg-black', 'text-white');
  signInBtn.classList.remove('bg-gray-200', 'text-gray-600');
  
  signupBtn.classList.remove('bg-black', 'text-white');
  signupBtn.classList.add('bg-gray-200', 'text-gray-600');
});

signupBtn.addEventListener('click', () => {
  // Show sign up form
  signUpForm.classList.remove('hidden');
  signInForm.classList.add('hidden');
  
  // Update button styles
  signupBtn.classList.add('bg-black', 'text-white');
  signupBtn.classList.remove('bg-gray-200', 'text-gray-600');
  
  signInBtn.classList.remove('bg-black', 'text-white');
  signInBtn.classList.add('bg-gray-200', 'text-gray-600');
});

// Sign Up Form Submit
signUpForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('signUpEmail').value;
  const password = document.getElementById('signUpPassword').value;

  signUpError.classList.add('hidden');
  signUpSuccess.classList.add('hidden');

  const createBtn = signUpForm.querySelector('button[type="submit"]');
  const originalText = createBtn.textContent;
  createBtn.textContent = 'Creating Account...';
  createBtn.disabled = true;

  const { data, error } = await signUp(email, password);

  if (error) {
    signUpError.textContent = error.message;
    signUpError.classList.remove('hidden');
    createBtn.textContent = originalText;
    createBtn.disabled = false;
  } else {
    signUpSuccess.textContent = 'Account created successfully! Redirecting...';
    signUpSuccess.classList.remove('hidden');
    signUpForm.reset();
    
    // Redirect to dashboard after successful signup
    setTimeout(() => {
      window.location.href = 'profile.html';
    }, 1500);
  }
});

// Sign In Form Submit
signInForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('signInEmail').value;
  const password = document.getElementById('signInPassword').value;

  signInError.classList.add('hidden');

  const submitBtn = signInForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Signing in...';
  submitBtn.disabled = true;

  const { data, error } = await signIn(email, password);

  if (error) {
    signInError.textContent = error.message;
    signInError.classList.remove('hidden');
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  } else {
    // Successful sign in - redirect to dashboard
    window.location.href = 'profile.html';
  }
});

