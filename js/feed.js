// Feed page functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeFeed();
});

function initializeFeed() {
    // Initialize action buttons for all posts
    const actionButtons = document.querySelectorAll('.action-btn');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            handleActionClick(this);
        });
    });
    
    // Add animation to posts on load
    animatePosts();
}

function handleActionClick(button) {
    const icon = button.querySelector('.icon');
    const countElement = button.querySelector('.count');
    
    // Add click animation
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 100);
    
    // Simulate like/comment/share action
    if (icon.textContent === '❤️') {
        // Toggle like
        const currentCount = parseInt(countElement.textContent);
        
        if (button.classList.contains('liked')) {
            button.classList.remove('liked');
            countElement.textContent = currentCount - 1;
            icon.textContent = '❤️';
        } else {
            button.classList.add('liked');
            countElement.textContent = currentCount + 1;
            icon.textContent = '💖';
        }
    } else if (icon.textContent === '💬') {
        // Comment action
        showMessage('Comments feature coming soon! 💬');
    } else if (icon.textContent === '🔄') {
        // Share action
        showMessage('Share feature coming soon! 🔄');
    }
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

