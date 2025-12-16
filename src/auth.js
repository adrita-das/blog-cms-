import { signIn , signUp } from "./supabase-config.js";

const signInBtn = document.getElementById('signInBtn');
const signupBtn = document.getElementById('signUpBtn');
const signInForm = document.getElementById('signInForm');
const signUpForm = document.getElementById('signUpForm');
const signInError = document.getElementById('signInError');
const signUpError = document.getElementById('signUpError');
const signUpSuccess = document.getElementById('signUpSuccess');


//handle toggle

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
  alert('Creating Account');

  const { data, error } = await signUp(email, password);

  if (error) {
    signUpError.textContent = error.message;
    signUpError.classList.remove('hidden');
    createBtn.textContent = originalText;
    createBtn.disabled = false;
  } else {
    signUpSuccess.textContent = 'Account created successfully!';
    signUpSuccess.classList.remove('hidden');
    signUpForm.reset();
    
    createBtn.textContent = originalText;
    createBtn.disabled = false;
    
    // Switch to sign in after 2 seconds
    setTimeout(() => {
      signInBtn.click();
    }, 2000);
  }
});

// Sign In Form Submit
signInForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('signInEmail').value;
  const password = document.getElementById('signInPassword').value;

  signInError.classList.add('hidden');
  signUpSuccess.classList.add('hidden');

  const submitBtn = signInForm.querySelector('button[type="submit"]');
  alert('Signing in...');

  const { data, error } = await signIn(email, password);

});



