const signInBtn = document.getElementById('signInBtn');
const signupBtn = document.getElementById('signUpBtn');
const signInForm = document.getElementById('signInForm');
const signUpForm = document.getElementById('signUpForm');

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