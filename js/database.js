// Database operations using Supabase

// Get current user info from localStorage
function getCurrentUser() {
    return {
        name: localStorage.getItem('userName') || 'Anonymous',
        avatar: localStorage.getItem('userAvatar') || 'ic.png',
        userId: localStorage.getItem('userId') || generateUserId()
    };
}

function generateUserId() {
    const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', userId);
    return userId;
}

// Create a new post
async function createPost(text) {
    try {
        const user = getCurrentUser();
        
        const { data, error } = await supabase
            .from('posts')
            .insert([
                {
                    user_id: user.userId,
                    user_name: user.name,
                    user_avatar: user.avatar,
                    content: text,
                    likes: 0,
                    comments: 0,
                    shares: 0
                }
            ])
            .select();

        if (error) throw error;
        
        console.log('Post created successfully:', data);
        return { success: true, data };
    } catch (error) {
        console.error('Error creating post:', error);
        return { success: false, error: error.message };
    }
}

// Get all posts (ordered by newest first)
async function getPosts(limit = 50) {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching posts:', error);
        return { success: false, error: error.message };
    }
}

// Get posts by specific user
async function getUserPosts(userId) {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching user posts:', error);
        return { success: false, error: error.message };
    }
}

// Update like count
async function likePost(postId, currentLikes) {
    try {
        const { data, error } = await supabase
            .from('posts')
            .update({ likes: currentLikes + 1 })
            .eq('id', postId)
            .select();

        if (error) throw error;
        
        return { success: true, data };
    } catch (error) {
        console.error('Error liking post:', error);
        return { success: false, error: error.message };
    }
}

// Delete a post
async function deletePost(postId, userId) {
    try {
        const { data, error } = await supabase
            .from('posts')
            .delete()
            .eq('id', postId)
            .eq('user_id', userId); // Only allow users to delete their own posts

        if (error) throw error;
        
        return { success: true };
    } catch (error) {
        console.error('Error deleting post:', error);
        return { success: false, error: error.message };
    }
}

// Subscribe to real-time updates
function subscribeToNewPosts(callback) {
    const subscription = supabase
        .channel('posts')
        .on('postgres_changes', 
            { event: 'INSERT', schema: 'public', table: 'posts' }, 
            (payload) => {
                console.log('New post received:', payload);
                callback(payload.new);
            }
        )
        .subscribe();
    
    return subscription;
}

