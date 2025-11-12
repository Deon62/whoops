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


function animateProfile() {
    // Animate stats
    const statBoxes = document.querySelectorAll('.stat-box');
    statBoxes.forEach((box, index) => {
        box.style.opacity = '0';
        box.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            box.style.transition = 'all 0.5s ease';
            box.style.opacity = '1';
            box.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Animate badges
    const badges = document.querySelectorAll('.badge-item');
    badges.forEach((badge, index) => {
        badge.style.opacity = '0';
        badge.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            badge.style.transition = 'all 0.5s ease';
            badge.style.opacity = '1';
            badge.style.transform = 'scale(1)';
        }, 500 + (index * 100));
    });
    
    // Animate posts
    const posts = document.querySelectorAll('.profile-post-card');
    posts.forEach((post, index) => {
        post.style.opacity = '0';
        post.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            post.style.transition = 'all 0.5s ease';
            post.style.opacity = '1';
            post.style.transform = 'translateX(0)';
        }, 1000 + (index * 150));
    });
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

