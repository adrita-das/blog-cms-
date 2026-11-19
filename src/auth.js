import { signIn, signUp , resetPassword} from "./supabase-config.js";

// ---- Tab / form switching ----
const signInBtn = document.getElementById('signInBtn')
const signUpBtn = document.getElementById('signUpBtn')
const signInForm = document.getElementById('signInForm')
const signUpForm = document.getElementById('signUpForm')
const forgotPasswordForm = document.getElementById('forgotPasswordForm')
const forgotPasswordLink = document.getElementById('forgotPasswordLink')

forgotPasswordLink.addEventListener('click', () => showForm(forgotPasswordForm))
signInBtn.addEventListener('click', () => showForm(signInForm))
signUpBtn.addEventListener('click',() =>showForm(signUpForm))

function showForm(formToShow) {
    const allForms = [signInForm, signUpForm]
    allForms.forEach(f => f.classList.add('hidden'))
    formToShow.classList.remove('hidden')

};

// ---------signIn submit----------//

signInForm.addEventListener('submit', async (e) => {

    e.preventDefault()
    const signin_email = document.getElementById('signInEmail').value
    const signin_password = document.getElementById('signInPassword').value
    const signin_error= document.getElementById('signInError')

    signin_error.classList.add('hidden')


    const { data, error } = await signIn(signin_email, signin_password)

    //------------signIn error handle----------//
    
    if (error) {

        signin_error.textContent = error.message
        signin_error.classList.remove('hidden')
        return

    }

    
    window.location.href = '/profile.html' 
    
})

// ---------signUp submit----------//

signUpForm.addEventListener('submit', async (e) => {
    
    e.preventDefault() 
    const signup_email = document.getElementById('signUpEmail').value
    const signup_password = document.getElementById('signUpPassword').value
    const signup_error = document.getElementById('signUpError')
    const signup_success = document.getElementById('signUpSuccess')

    signup_error.classList.add('hidden')
    signup_success.classList.add('hidden')


    const { data, error } = await signUp(signup_email, signup_password)
    
     if (error) {
        
        signup_error.textContent = error.message
        signup_error.classList.remove('hidden')
        return
    }

    signup_success.textContent = 'Account created! You can now sign in.'
    signup_success.classList.remove('hidden')
})



