// Profile page functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeProfile();
});

function initializeProfile() {
    // Initialize edit profile button
    const editBtn = document.querySelector('.edit-profile-btn');
    if (editBtn) {
        editBtn.addEventListener('click', handleEditProfile);
    }
    
    // Initialize settings button
    const settingsBtn = document.querySelector('.settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', handleSettings);
    }
    
    // Add click handlers to badges
    const badges = document.querySelectorAll('.badge-item:not(.locked)');
    badges.forEach(badge => {
        badge.addEventListener('click', function() {
            showBadgeInfo(this);
        });
    });
    
    // Add click handlers to stats
    const statBoxes = document.querySelectorAll('.stat-box');
    statBoxes.forEach(box => {
        box.addEventListener('click', function() {
            handleStatClick(this);
        });
    });
    
    // Animate profile elements on load
    animateProfile();
}

function handleEditProfile() {
    showNotification('Edit profile feature coming soon! ✏️', 'info');
}

function handleSettings() {
    showNotification('Settings feature coming soon! ⚙️', 'info');
}

function showBadgeInfo(badge) {
    const badgeName = badge.querySelector('.badge-name').textContent;
    const badgeIcon = badge.querySelector('.badge-icon').textContent;
    
    // Add pulse animation
    badge.style.animation = 'pulse 0.5s ease';
    setTimeout(() => {
        badge.style.animation = '';
    }, 500);
    
    const messages = {
        'Hot Streak': 'Posted 5 failures in a row! 🔥',
        'Comeback Kid': 'Shared a lesson learned from a failure! 💪',
        'Lesson Master': 'Helped 50 people learn from your failures! 🎯',
        'Epic Failure': 'Share 100 failures to unlock this badge! 🌟'
    };
    
    showNotification(`${badgeIcon} ${badgeName}: ${messages[badgeName] || 'Keep going!'}`, 'success');
}

function handleStatClick(statBox) {
    const label = statBox.querySelector('.stat-label').textContent;
    
    // Add bounce animation
    statBox.style.transform = 'scale(0.95)';
    setTimeout(() => {
        statBox.style.transform = 'scale(1)';
    }, 100);
    
    const messages = {
        'Failures': 'View all your shared failures',
        'Supporters': 'See who supports you',
        'Lessons': 'View all lessons learned'
    };
    
    showNotification(messages[label] || 'Feature coming soon!', 'info');
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

