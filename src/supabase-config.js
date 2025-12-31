import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });
    return { data, error }
}

export async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    return { data, error }
}

export async function signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
}

export async function getUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

export async function uploadImage(file) {

    try{
        const {data: {user} ,error: userError} = await supabase.auth.getUser();
    return user

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

    console.log('Uploading file:', fileName);

    const {data, error} = await supabase.storage
    .from('blog-covers')
    .upload(fileName ,file,{
        cacheControl: '3600',
        upsert:false

    });

     if (error) {
            console.error('Upload error:', error);
            throw error;
    }

    console.log('Upload successful:', data);

    const {data : { publicUrl } } = supabase.storage
     .from('blog-covers')
     .getPublicUrl(fileName);

    console.log('Public URL:', publicUrl);

    return publicUrl;
  
    }
    catch (error){ 
        console.error('Error in uploadImage:', error);
        throw error;

    }

    
}