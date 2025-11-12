// Create post page functionality
let selectedEmoji = '';
let tags = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeCreatePage();
});

function initializeCreatePage() {
    // Initialize emoji picker
    const emojiButtons = document.querySelectorAll('.emoji-btn');
    emojiButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            selectEmoji(this);
        });
    });
    
    // Initialize character counter
    const failureInput = document.getElementById('failureText');
    if (failureInput) {
        failureInput.addEventListener('input', updateCharCount);
    }
    
    // Initialize tag input
    const tagInput = document.getElementById('tagInput');
    if (tagInput) {
        tagInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
            }
        });
    }
}

function selectEmoji(button) {
    // Remove previous selection
    document.querySelectorAll('.emoji-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Add selection to clicked button
    button.classList.add('selected');
    selectedEmoji = button.getAttribute('data-emoji');
    
    // Add bounce animation
    button.style.animation = 'none';
    setTimeout(() => {
        button.style.animation = 'bounce 0.5s ease';
    }, 10);
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

function addTag() {
    const tagInput = document.getElementById('tagInput');
    const tagText = tagInput.value.trim();
    
    if (tagText === '') return;
    
    // Add # if not present
    const formattedTag = tagText.startsWith('#') ? tagText : '#' + tagText;
    
    // Check if tag already exists
    if (tags.includes(formattedTag)) {
        showNotification('Tag already added!', 'warning');
        return;
    }
    
    // Limit to 5 tags
    if (tags.length >= 5) {
        showNotification('Maximum 5 tags allowed!', 'warning');
        return;
    }
    
    tags.push(formattedTag);
    renderTags();
    tagInput.value = '';
}

function removeTag(index) {
    tags.splice(index, 1);
    renderTags();
}

function renderTags() {
    const tagsList = document.getElementById('tagsList');
    
    if (tags.length === 0) {
        tagsList.innerHTML = '';
        return;
    }
    
    tagsList.innerHTML = tags.map((tag, index) => `
        <div class="tag-item">
            <span>${tag}</span>
            <button class="remove-tag-btn" onclick="removeTag(${index})">×</button>
        </div>
    `).join('');
}

function publishPost() {
    const failureText = document.getElementById('failureText').value.trim();
    const lessonText = document.getElementById('lessonInput').value.trim();
    
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
        emoji: selectedEmoji,
        text: failureText,
        tags: tags,
        lesson: lessonText,
        timestamp: new Date().toISOString()
    };
    
    console.log('Publishing post:', post);
    
    // Show success message
    showSuccessMessage();
    
    // Redirect to feed after 2 seconds
    setTimeout(() => {
        navigateToFeed();
    }, 2000);
}

function showSuccessMessage() {
    const container = document.querySelector('.create-card');
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <h3>🎉 Your failure has been shared!</h3>
        <p>Redirecting to feed...</p>
    `;
    
    container.insertBefore(successDiv, container.firstChild);
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

