// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
});

function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            navigateToPage(page);
        });
    });
}

function navigateToPage(page) {
    const pages = {
        'feed': 'feed.html',
        'create': 'create.html',
        'profile': 'profile.html'
    };
    
    if (pages[page]) {
        window.location.href = pages[page];
    }
}

function navigateToFeed() {
    window.location.href = 'feed.html';
}

function navigateToCreate() {
    window.location.href = 'create.html';
}

function navigateToProfile() {
    window.location.href = 'profile.html';
}

function navigateToLanding() {
    window.location.href = 'index.html';
}

// Add smooth transitions for page loads
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = '1';
    }, 10);
});

