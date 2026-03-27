import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}


//=======cover image ========//

export async function uploadImage(file) {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("User not authenticated. Please sign in.");
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;

    console.log("Uploading file:", fileName);

    const { data, error } = await supabase.storage
      .from("blog-covers")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      throw error;
    }

    console.log("Upload successful:", data);

    const {
      data: { publicUrl },
    } = supabase.storage.from("blog-covers").getPublicUrl(fileName);

    console.log("Public URL:", publicUrl);

    return publicUrl;
  } catch (error) {
    console.error("Error in uploadImage:", error);
    throw error;
  }
}

//========== Post ========//

export async function blogPost(postData) {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    // if (userError || !user) {
    //   throw new Error("User not authenticated. Please sign in.");
    // }

    if (!postData.title || !postData.title.trim()) {
      throw new Error("Title is required");
    }

    if (!postData.content || !postData.content.trim()) {
      throw new Error("Content is required");
    }

    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          author_id: user.id,
          title: postData.title.trim(),
          content: postData.content.trim(),
          cover_image: postData.coverImage || null,
          status: postData.status || "draft",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error("Database error:", error);
      throw error;
    }
    console.log("Post saved successfully:", data);
    return data[0];
  } catch (error) {
    console.error("Error in blogPost:", error);
    throw error;
  }
}

export async function getUserPosts(status = null) {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("User not authenticated. Please sign in.");
    }

    let query = supabase
      .from("posts")
      .select("*")
      .eq("author_id", user.id)
      .order("updated_at", { ascending: false });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}

export async function getAllPost() {

  try{
    const {data, error} = await supabase
     .from("posts")
     .select(`
      *,
      profiles: author_id(
      username,
      avatar_url)
      `)
      .eq("status", "published")
      .order("created_at" , { ascending: false});

    if(error) {
      
      throw error;
    }
    
    return data;
  } catch(error) {

    console.error("Error fetching published posts:", error);
    throw error;

  }
  
}

export async function deletePost(postId) {

  try{ 

    const {error} = await supabase 
     .from("posts")
     .delete()
     .eq("id" , postId);

    if (error) {
      throw error;
    } 

    return true;

  } catch(error) { 
    console.error("Error deleting post :" , error);
    throw error;

  }
 
}


export async function updateData(postId, postData) {

  try{ 
    const {data, error} = await supabase 
     .from("posts")
     .update({
      title : postData.title.trim(),
      content : postData.content.trim(),
      cover_image : postData.coverImage || null,
      status: postData.status || "draft",
      updated_at:new Date().toISOString(),
     })
     .eq("id" , postId)
     .select();
    
    if(error) {
      throw error;
    } 

    return data[0];
  } 
  catch (error) {

    console.error("Error updating post:", error);
    throw error;

  }
}

 export async function publishPost(postId) {

  try{
    const {data, error} = await supabase
     .from("posts")
     .update({
      status: "published",
      updated_at: new Date().toISOString(),
     })
     .eq("id" , postId)
     .select();

     if(error) {
      throw error;
     }

     return data[0];
  }

  catch(error) {
    console.error("Error publishing post :" , error);
    throw error;
  }

 }


