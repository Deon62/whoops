// Profile page functionality
let selectedAvatar = 'ic.png';

document.addEventListener('DOMContentLoaded', function() {
    initializeProfile();
});

function initializeProfile() {
    // Load saved profile data
    loadProfile();
    
    // Initialize avatar selection
    const avatarOptions = document.querySelectorAll('.avatar-option');
    avatarOptions.forEach(option => {
        option.addEventListener('click', function() {
            selectAvatar(this);
        });
    });
    
    // Animate profile elements on load
    animateProfile();
}

function loadProfile() {
    const savedName = localStorage.getItem('userName') || 'John Doe';
    const savedAvatar = localStorage.getItem('userAvatar') || 'ic.png';
    
    document.getElementById('profileName').textContent = savedName;
    document.getElementById('avatarImage').src = `profiles/${savedAvatar}`;
    selectedAvatar = savedAvatar;
}

function openEditModal() {
    const modal = document.getElementById('editModal');
    const nameInput = document.getElementById('nameInput');
    
    // Load current values
    nameInput.value = document.getElementById('profileName').textContent;
    
    // Highlight current avatar
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.classList.remove('selected');
        if (option.getAttribute('data-avatar') === selectedAvatar) {
            option.classList.add('selected');
        }
    });
    
    modal.classList.add('show');
}

function closeEditModal() {
    const modal = document.getElementById('editModal');
    modal.classList.remove('show');
}

function selectAvatar(element) {
    // Remove selection from all avatars
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selection to clicked avatar
    element.classList.add('selected');
    selectedAvatar = element.getAttribute('data-avatar');
}

function saveProfile() {
    const nameInput = document.getElementById('nameInput');
    const newName = nameInput.value.trim();
    
    if (newName === '') {
        showNotification('Please enter a name', 'error');
        return;
    }
    
    // Save to localStorage
    localStorage.setItem('userName', newName);
    localStorage.setItem('userAvatar', selectedAvatar);
    
    // Update UI
    document.getElementById('profileName').textContent = newName;
    document.getElementById('avatarImage').src = `profiles/${selectedAvatar}`;
    
    // Close modal
    closeEditModal();
    
    // Show success message
    showNotification('Profile updated successfully!', 'success');
}

function handleEditProfile() {
    openEditModal();
}

function handleSettings() {
    showNotification('Settings feature coming soon!', 'info');
}

function handleEditProfile() {
    showNotification('Edit profile feature coming soon! ✏️', 'info');
}

function handleSettings() {
    showNotification('Settings feature coming soon! ⚙️', 'info');
}


async function animateProfile() {
    // Load user's posts from database
    await loadUserPosts();
    
    // Animate posts
    const posts = document.querySelectorAll('.profile-post-card');
    posts.forEach((post, index) => {
        post.style.opacity = '0';
        post.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            post.style.transition = 'all 0.5s ease';
            post.style.opacity = '1';
            post.style.transform = 'translateX(0)';
        }, index * 150);
    });
}

async function loadUserPosts() {
    const user = getCurrentUser();
    const postsSection = document.querySelector('.posts-section');
    const postsContainer = postsSection.querySelector('.profile-post-card')?.parentElement || postsSection;
    
    // Remove existing posts except the section title
    const existingPosts = postsSection.querySelectorAll('.profile-post-card');
    existingPosts.forEach(post => post.remove());
    
    const result = await getUserPosts(user.userId);
    
    if (result.success && result.data.length > 0) {
        result.data.forEach(post => {
            const postCard = createProfilePostCard(post);
            postsSection.appendChild(postCard);
        });
    } else if (result.success && result.data.length === 0) {
        const emptyState = document.createElement('p');
        emptyState.className = 'empty-posts';
        emptyState.textContent = 'No posts yet. Share your first post!';
        emptyState.style.textAlign = 'center';
        emptyState.style.color = 'var(--text-secondary)';
        emptyState.style.padding = '2rem';
        postsSection.appendChild(emptyState);
    }
}

function createProfilePostCard(post) {
    const postCard = document.createElement('div');
    postCard.className = 'profile-post-card';
    postCard.dataset.postId = post.id;
    postCard.dataset.userId = post.user_id;
    
    const timeAgo = getTimeAgo(new Date(post.created_at));
    
    postCard.innerHTML = `
        <div class="post-header-profile">
            <div class="post-date">${timeAgo}</div>
            <button class="delete-post-btn-profile" title="Delete post">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            </button>
        </div>
        <p class="post-text">${escapeHtml(post.content)}</p>
        <div class="post-stats">
            <span>${post.likes} likes</span>
            <span>${post.comments} comments</span>
        </div>
    `;
    
    // Add delete button listener
    const deleteBtn = postCard.querySelector('.delete-post-btn-profile');
    deleteBtn.addEventListener('click', () => handleDeleteProfilePost(postCard));
    
    return postCard;
}

async function handleDeleteProfilePost(postCard) {
    const postId = postCard.dataset.postId;
    const userId = postCard.dataset.userId;
    
    // Show custom confirmation modal
    const confirmed = await showConfirmModal();
    
    if (!confirmed) {
        return;
    }
    
    // Delete from database
    const result = await deletePost(postId, userId);
    
    if (result.success) {
        // Animate out and remove
        postCard.style.transition = 'all 0.3s ease';
        postCard.style.opacity = '0';
        postCard.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
            postCard.remove();
            
            // Check if no posts left
            const postsSection = document.querySelector('.posts-section');
            const remainingPosts = postsSection.querySelectorAll('.profile-post-card');
            
            if (remainingPosts.length === 0) {
                const emptyState = document.createElement('p');
                emptyState.className = 'empty-posts';
                emptyState.textContent = 'No posts yet. Share your first post!';
                emptyState.style.textAlign = 'center';
                emptyState.style.color = 'var(--text-secondary)';
                emptyState.style.padding = '2rem';
                postsSection.appendChild(emptyState);
            }
        }, 300);
        
        showNotification('Post deleted successfully', 'success');
    } else {
        showNotification('Failed to delete post. Please try again.', 'error');
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

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.textContent = message;
    
    const colors = {
        'error': '#ff4444',
        'warning': '#ff9800',
        'success': '#4caf50',
        'info': '#2196F3'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background-color: ${colors[type] || colors.info};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideDown 0.3s ease;
        max-width: 90%;
        text-align: center;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
    
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
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translate(-50%, 0);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
    }
`;
document.head.appendChild(style);

