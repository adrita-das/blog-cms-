import {supabase,resetPassword, updatePassword} from "./supabase-config.js";

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
    const allForms = [signInForm, signUpForm, forgotPasswordForm]
    allForms.forEach(f => f.classList.add('hidden'))
    formToShow.classList.remove('hidden')

};

// forget password submit

forgotPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = document.getElementById('forgotPasswordEmail').value
    const forget_password_error = document.getElementById('forgotPasswordError')
    const forget_password_success = document.getElementById('forgotPasswordSuccess')

    // forget_password_error.classList.add('hidden')
    // forget_password_success.classList.add('hidden')


    const { data, error } = await resetPassword(
        email,
        `${window.location.origin}/auth.html`
    )

      if (error) {
        forget_password_error.textContent = error.message
        forget_password_error.classList.remove('hidden')
        return
    }

    forget_password_success.textContent = 'Password reset link sent — check your email.'
    forget_password_success.classList.remove('hidden')
})

// reset password submit

supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'PASSWORD_RECOVERY') {
        showResetPasswordForm()
    }
})

function showResetPasswordForm() {

    const newForm = [signInForm, signUpForm, forgotPasswordForm];
    newForm.forEach(f => f.classList.add('hidden'))


    const container = document.createElement('div')
    container.id = 'resetPassword'
    container.innerHTML =
        `
          <form id='updatePasswordForm' class="space-y-4">
            <h2 class="text-bold text-xl">Set a New Password</h2>
            <label class="text-sm font-semibold font-sans">New Password</label>
            <input type="password" id='newPassword' class="w-full border-2 border-black rounded-md px-2" />
            <button type="submit" class="flex-1 bg-black text-white text-sm p-2 m-2 rounded-md cursor-pointer">
                Update Password
            </button>
            <p id='updatePasswordError' class="text-red-600 text-sm hidden"></p>
            <p id='updatePasswordSuccess'class="text-green-600 text-sm hidden"></p>
        </form>
        `
    
    document.querySelector('.max-w-md').appendChild(container)


    document.getElementById('updatePasswordForm').addEventListener('submit', async (e) => {
        e.preventDefault()

        const newPassword = document.getElementById('newPassword').value
        const update_password_error = document.getElementById('updatePasswordError')
        const update_password_success = document.getElementById('updatePasswordSuccess')


        const { data, error } = await updatePassword(newPassword)
        
        if (error) {
            update_password_error.textContent = error.message
            update_password_error.classList.remove('hidden')
            return
        }

        update_password_success.textContent = 'Password updated! You can now sign in.'
        update_password_success.classList.remove('hidden')
        document.getElementById('updatePasswordForm').classList.add('hidden')
        showForm(signInForm)
    })

}