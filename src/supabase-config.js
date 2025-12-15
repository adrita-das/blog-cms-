
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ovhwtqnktucsjidiwzjo.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
export const supabase = createClient(supabaseUrl, supabaseKey)

//signup authentication function

export async function signUp(email, password) {

    const { data, error} = await supabase.auth.signUp({
        email,
        password,
    });

    return { data, error}
    
}


//signin function 

export async function signIn(email, password) {

    const { data, error} = await supabase.auth.signUp({
        email,
        password,
    });

    return { data, error}
    
}

export async function signOut() {

    const {error} = await supabase.auth.signOut()

    return {error}
    
}

export async function getUser() {

    const {data: {user} } = await supabase.auth.getUser()

    return {user}
    
}

export async function isUserLoggedIn() {

    const user = await getUser()

    return !!user
    
}