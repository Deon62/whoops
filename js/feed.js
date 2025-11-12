// Feed page functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeFeed();
});

async function initializeFeed() {
    // Load posts from database
    await loadPosts();
    
    // Subscribe to real-time updates
    subscribeToNewPosts((newPost) => {
        prependPost(newPost);
    });
    
    // Add animation to posts on load
    animatePosts();
}

async function loadPosts() {
    const postsList = document.getElementById('postsList');
    
    // Show loading state
    postsList.innerHTML = '<div class="loading">Loading posts...</div>';
    
    const result = await getPosts(50);
    
    if (result.success && result.data.length > 0) {
        postsList.innerHTML = '';
        result.data.forEach(post => {
            appendPost(post);
        });
        
        // Initialize action buttons
        initializeActionButtons();
    } else if (result.success && result.data.length === 0) {
        postsList.innerHTML = '<div class="empty-state">No posts yet. Be the first to share!</div>';
    } else {
        postsList.innerHTML = '<div class="error-state">Failed to load posts. Please refresh.</div>';
    }
}

function appendPost(post) {
    const postsList = document.getElementById('postsList');
    const postElement = createPostElement(post);
    postsList.appendChild(postElement);
}

function prependPost(post) {
    const postsList = document.getElementById('postsList');
    
    // Remove empty state if it exists
    const emptyState = postsList.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }
    
    const postElement = createPostElement(post);
    postsList.insertBefore(postElement, postsList.firstChild);
    
    // Add entrance animation
    postElement.style.opacity = '0';
    postElement.style.transform = 'translateY(-20px)';
    setTimeout(() => {
        postElement.style.transition = 'all 0.5s ease';
        postElement.style.opacity = '1';
        postElement.style.transform = 'translateY(0)';
    }, 10);
    
    initializeActionButtons();
}

function createPostElement(post) {
    const postCard = document.createElement('div');
    postCard.className = 'post-card';
    postCard.dataset.postId = post.id;
    postCard.dataset.userId = post.user_id;
    
    const timeAgo = getTimeAgo(new Date(post.created_at));
    const currentUser = getCurrentUser();
    const isOwnPost = post.user_id === currentUser.userId;
    
    postCard.innerHTML = `
        <div class="post-header">
            <div class="user-avatar-with-img">
                <img src="profiles/${post.user_avatar}" alt="${post.user_name}" class="avatar-img">
            </div>
            <div class="user-info">
                <h3 class="user-name">${escapeHtml(post.user_name)}</h3>
                <p class="post-time">${timeAgo}</p>
            </div>
            ${isOwnPost ? `
            <button class="delete-post-btn" data-action="delete" title="Delete post">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            </button>
            ` : ''}
        </div>
        <div class="post-content">
            <p class="post-text">${escapeHtml(post.content)}</p>
        </div>
        <div class="post-actions">
            <button class="action-btn" data-action="like" data-count="${post.likes}">
                <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <span class="count">${post.likes}</span>
            </button>
            <button class="action-btn" data-action="comment" data-count="${post.comments}">
                <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span class="count">${post.comments}</span>
            </button>
            <button class="action-btn" data-action="share" data-count="${post.shares}">
                <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                </svg>
                <span class="count">${post.shares}</span>
            </button>
        </div>
    `;
    
    return postCard;
}

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + ' min ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' hours ago';
    if (seconds < 604800) return Math.floor(seconds / 86400) + ' days ago';
    return Math.floor(seconds / 604800) + ' weeks ago';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function initializeActionButtons() {
    const actionButtons = document.querySelectorAll('.action-btn');
    
    actionButtons.forEach(button => {
        // Remove old listeners by cloning
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        newButton.addEventListener('click', function(e) {
            handleActionClick(this);
        });
    });
    
    // Initialize delete buttons
    const deleteButtons = document.querySelectorAll('.delete-post-btn');
    deleteButtons.forEach(button => {
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        newButton.addEventListener('click', function(e) {
            handleDeletePost(this);
        });
    });
}

async function handleActionClick(button) {
    const action = button.getAttribute('data-action');
    const countElement = button.querySelector('.count');
    const postCard = button.closest('.post-card');
    const postId = postCard.dataset.postId;
    
    // Add click animation
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 100);
    
    if (action === 'like') {
        // Handle like action
        const currentCount = parseInt(countElement.textContent);
        
        if (button.classList.contains('liked')) {
            // Unlike (for demo, we'll just toggle locally)
            button.classList.remove('liked');
            countElement.textContent = currentCount - 1;
        } else {
            // Like the post
            button.classList.add('liked');
            countElement.textContent = currentCount + 1;
            
            // Update in database
            const result = await likePost(postId, currentCount);
            if (!result.success) {
                // Revert on error
                button.classList.remove('liked');
                countElement.textContent = currentCount;
                showMessage('Failed to like post');
            }
        }
    } else if (action === 'comment') {
        showMessage('Comments feature coming soon!');
    } else if (action === 'share') {
        showMessage('Share feature coming soon!');
    }
}

async function handleDeletePost(button) {
    const postCard = button.closest('.post-card');
    const postId = postCard.dataset.postId;
    const userId = postCard.dataset.userId;
    
    // Show custom confirmation modal
    const confirmed = await showConfirmModal();
    
    if (!confirmed) {
        return;
    }
    
    // Add deleting state
    button.disabled = true;
    button.style.opacity = '0.5';
    
    // Delete from database
    const result = await deletePost(postId, userId);
    
    if (result.success) {
        // Animate out and remove
        postCard.style.transition = 'all 0.3s ease';
        postCard.style.opacity = '0';
        postCard.style.transform = 'translateX(-100%)';
        
        setTimeout(() => {
            postCard.remove();
            
            // Check if feed is empty
            const postsList = document.getElementById('postsList');
            if (postsList.children.length === 0) {
                postsList.innerHTML = '<div class="empty-state">No posts yet. Be the first to share!</div>';
            }
        }, 300);
        
        showMessage('Post deleted successfully');
    } else {
        button.disabled = false;
        button.style.opacity = '1';
        showMessage('Failed to delete post. Please try again.');
    }
}

function showConfirmModal() {
    return new Promise((resolve) => {
        const modal = document.getElementById('confirmModal');
        const confirmBtn = document.getElementById('confirmDeleteBtn');
        const cancelBtn = document.getElementById('cancelDeleteBtn');
        
        modal.classList.add('show');
        
        const handleConfirm = () => {
            modal.classList.remove('show');
            cleanup();
            resolve(true);
        };
        
        const handleCancel = () => {
            modal.classList.remove('show');
            cleanup();
            resolve(false);
        };
        
        const cleanup = () => {
            confirmBtn.removeEventListener('click', handleConfirm);
            cancelBtn.removeEventListener('click', handleCancel);
            modal.removeEventListener('click', handleBackdropClick);
        };
        
        const handleBackdropClick = (e) => {
            if (e.target === modal) {
                handleCancel();
            }
        };
        
        confirmBtn.addEventListener('click', handleConfirm);
        cancelBtn.addEventListener('click', handleCancel);
        modal.addEventListener('click', handleBackdropClick);
    });
}

function animatePosts() {
    const posts = document.querySelectorAll('.post-card');
    posts.forEach((post, index) => {
        post.style.opacity = '0';
        post.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            post.style.transition = 'all 0.5s ease';
            post.style.opacity = '1';
            post.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function showMessage(message) {
    // Create temporary message element
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #0A1D37;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideDown 0.3s ease;
    `;
    
    document.body.appendChild(messageDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 300);
    }, 3000);
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
`;
document.head.appendChild(style);

