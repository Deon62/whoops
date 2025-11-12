// Create post page functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeCreatePage();
});

function initializeCreatePage() {
    // Initialize character counter and post button
    const failureInput = document.getElementById('failureText');
    const postBtn = document.getElementById('postBtn');
    
    if (failureInput) {
        failureInput.addEventListener('input', function() {
            updateCharCount();
            togglePostButton();
        });
    }
}

function togglePostButton() {
    const text = document.getElementById('failureText').value.trim();
    const postBtn = document.getElementById('postBtn');
    
    if (text.length > 0 && text.length <= 500) {
        postBtn.disabled = false;
    } else {
        postBtn.disabled = true;
    }
}


function updateCharCount() {
    const text = document.getElementById('failureText').value;
    const count = text.length;
    const charCountElement = document.getElementById('charCount');
    
    charCountElement.textContent = count;
    
    // Change color based on character count
    if (count > 450) {
        charCountElement.style.color = '#ff4444';
    } else if (count > 400) {
        charCountElement.style.color = '#ff9800';
    } else {
        charCountElement.style.color = 'var(--text-light)';
    }
}


function publishPost() {
    const failureText = document.getElementById('failureText').value.trim();
    
    // Validation
    if (failureText === '') {
        showNotification('Please share your failure story!', 'error');
        return;
    }
    
    if (failureText.length > 500) {
        showNotification('Story is too long! Maximum 500 characters.', 'error');
        return;
    }
    
    // Create post object (in a real app, this would be sent to a backend)
    const post = {
        text: failureText,
        timestamp: new Date().toISOString()
    };
    
    console.log('Publishing post:', post);
    
    // Show success message
    showSuccessMessage();
    
    // Redirect to feed after 1.5 seconds
    setTimeout(() => {
        navigateToFeed();
    }, 1500);
}

function showSuccessMessage() {
    showNotification('Your failure has been shared!', 'success');
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.textContent = message;
    
    const colors = {
        'error': '#ff4444',
        'warning': '#ff9800',
        'success': '#4caf50'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background-color: ${colors[type] || colors.error};
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
    @keyframes bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.3); }
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

