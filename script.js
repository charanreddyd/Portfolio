// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const icon = themeToggle.querySelector('i');

// Check for saved theme preference or default to light
const currentTheme = localStorage.getItem('theme') || 'light';

// Apply the saved theme on page load
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    }
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('[class*="animate-"]').forEach(el => {
    observer.observe(el);
});

// Rating System
const stars = document.querySelectorAll('.star');
const submitRating = document.getElementById('submitRating');
const reviewsGrid = document.getElementById('reviewsGrid');
const reviewerName = document.getElementById('reviewerName');
const reviewComment = document.getElementById('reviewComment');

let currentRating = 0;

// reviews array will be loaded from Firestore
let reviews = [];

/* ---------------------------
   Firestore integration helpers
   (these functions are provided by the module script in index.html)
   window.addReviewToDB(review)
   window.getAllReviews()
   window.deleteReviewFromDB(id)
   --------------------------- */

// Display existing reviews
function displayReviews() {
    reviewsGrid.innerHTML = '';
    
    if (!reviews || reviews.length === 0) {
        reviewsGrid.innerHTML = '<div class="no-reviews">No reviews yet. Be the first to rate!</div>';
        return;
    }
    
    // Sort reviews by created date (newest first)
    reviews.sort((a, b) => {
        // ensure we have createdAt as ISO string; fallback to date string
        const ta = a.createdAt || a.date || '';
        const tb = b.createdAt || b.date || '';
        return new Date(tb) - new Date(ta);
    });
    
    reviews.forEach((review) => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        reviewCard.setAttribute('data-id', review.id || '');

        const starsHtml = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        
        reviewCard.innerHTML = `
            <div class="review-header">
                <div class="reviewer">${escapeHtml(review.name)}</div>
                <div class="review-date">${escapeHtml(review.displayDate || review.createdAt || review.date || '')}</div>
            </div>
            <div class="review-stars">${starsHtml}</div>
            <div class="review-text">${escapeHtml(review.comment || 'No comment provided.')}</div>
        `;
        
        reviewsGrid.appendChild(reviewCard);
    });
}

// Initialize star rating
stars.forEach(star => {
    star.addEventListener('click', () => {
        currentRating = parseInt(star.getAttribute('data-rating'));
        
        stars.forEach(s => {
            if (parseInt(s.getAttribute('data-rating')) <= currentRating) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
    });
    
    // Hover effect
    star.addEventListener('mouseenter', () => {
        const rating = parseInt(star.getAttribute('data-rating'));
        
        stars.forEach(s => {
            if (parseInt(s.getAttribute('data-rating')) <= rating) {
                s.style.color = '#ffc107';
            }
        });
    });
    
    star.addEventListener('mouseleave', () => {
        stars.forEach(s => {
            if (!s.classList.contains('active')) {
                s.style.color = '#ddd';
            }
        });
    });
});

// Submit rating
submitRating.addEventListener('click', async () => {
    if (currentRating === 0) {
        alert('Please select a rating first.');
        return;
    }
    
    const name = reviewerName.value.trim();
    if (!name) {
        alert('Please enter your name.');
        return;
    }
    
    const comment = reviewComment.value.trim();

    // Prepare review object (store ISO timestamp and a human-friendly display date)
    const now = new Date();
    const iso = now.toISOString();
    const displayDate = now.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const newReview = {
        name: name,
        rating: currentRating,
        comment: comment || 'No comment provided.',
        createdAt: iso,
        displayDate: displayDate
    };

    try {
        // Add to Firestore (exposed in index.html)
        await window.addReviewToDB(newReview);

        // Reload reviews from DB
        await loadReviews();

        showSuccessMessage('Thank you for your rating!');

        // Reset form
        stars.forEach(star => {
            star.classList.remove('active');
            star.style.color = '#ddd';
        });
        currentRating = 0;
        reviewerName.value = '';
        reviewComment.value = '';
    } catch (err) {
        console.error('Error submitting review:', err);
        alert('There was an error submitting your review. Please try again later.');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Interactive Robot Guide
const miniRobot = document.getElementById('miniRobot');
const miniSpeechBubble = document.getElementById('miniSpeechBubble');
const miniPupils = document.querySelectorAll('.mini-pupil');
const sections = document.querySelectorAll('section');

// Robot messages for different sections
const sectionMessages = {
    home: "Welcome to my portfolio! I'm Robo, your guide! 👋",
    about: "This is where you can learn more about Charan! 📖",
    skills: "Check out Charan's technical skills and proficiencies! 💻",
    projects: "Explore Charan's projects and creative work! 🚀",
    contact: "Get in touch with Charan through these channels! 📧",
    reviews: "Share your feedback and see what others think! ⭐"
};

// Robot responses when clicked
const robotResponses = [
    "Need help navigating? Just scroll or ask me! 🗺️",
    "Check out Charan's skills and projects! 💼",
    "Let me know if you have any questions! ❓",
    "Thanks for visiting the portfolio! 🌟",
    "I'm here to help you explore! 🔍",
    "Don't forget to leave a rating! ⭐",
    "Feel free to contact Charan for opportunities! 📧"
];

// Show message when section is in view
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            if (sectionMessages[sectionId]) {
                showRobotMessage(sectionMessages[sectionId]);
            }
        }
    });
}, { threshold: 0.5 });

// Observe all sections
sections.forEach(section => {
    sectionObserver.observe(section);
});

// Show robot message
function showRobotMessage(message) {
    miniSpeechBubble.textContent = message;
    miniSpeechBubble.classList.add('show');
    
    // Hide message after 5 seconds
    setTimeout(() => {
        miniSpeechBubble.classList.remove('show');
    }, 5000);
}

// Click interaction
miniRobot.addEventListener('click', () => {
    const randomResponse = robotResponses[Math.floor(Math.random() * robotResponses.length)];
    showRobotMessage(randomResponse);
});

// Mouse follower for pupils
document.addEventListener('mousemove', (e) => {
    const robotRect = miniRobot.getBoundingClientRect();
    const robotCenterX = robotRect.left + robotRect.width / 2;
    const robotCenterY = robotRect.top + robotRect.height / 2;
    
    const angleX = (e.clientX - robotCenterX) / (robotRect.width * 2);
    const angleY = (e.clientY - robotCenterY) / (robotRect.height * 2);
    
    miniPupils.forEach(pupil => {
        const maxMove = 3;
        const moveX = angleX * maxMove;
        const moveY = angleY * maxMove;
        
        pupil.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
    });
});

// Mouse enter effect
miniRobot.addEventListener('mouseenter', () => {
    miniRobot.style.transform = 'scale(1.1)';
    miniPupils.forEach(pupil => {
        pupil.style.transform = 'translate(-50%, -50%) scale(1.2)';
        pupil.style.background = '#ff6b9d';
    });
});

miniRobot.addEventListener('mouseleave', () => {
    miniRobot.style.transform = '';
    miniPupils.forEach(pupil => {
        pupil.style.transform = 'translate(-50%, -50%)';
        pupil.style.background = '#5a6fd8';
    });
});

// Admin Panel Functionality
const adminToggle = document.getElementById('adminToggle');
const adminPanel = document.getElementById('adminPanel');
const closeAdmin = document.getElementById('closeAdmin');
const adminReviews = document.getElementById('adminReviews');

// Toggle admin panel
adminToggle.addEventListener('click', () => {
    adminPanel.classList.add('active');
    displayAdminReviews();
});

closeAdmin.addEventListener('click', () => {
    adminPanel.classList.remove('active');
});

// Display reviews in admin panel
function displayAdminReviews() {
    adminReviews.innerHTML = '';
    
    if (!reviews || reviews.length === 0) {
        adminReviews.innerHTML = '<div class="no-admin-reviews">No reviews to manage.</div>';
        return;
    }
    
    // Sort reviews by date (newest first)
    reviews.sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0));
    
    reviews.forEach((review) => {
        const reviewItem = document.createElement('div');
        reviewItem.className = 'admin-review-item';
        
        const starsHtml = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

        // Use data-id attribute so delete button can target Firestore doc id
        const id = review.id || '';
        
        reviewItem.innerHTML = `
            <div class="admin-review-header">
                <div class="admin-review-name">${escapeHtml(review.name)}</div>
                <div class="admin-review-date">${escapeHtml(review.displayDate || review.createdAt || review.date || '')}</div>
            </div>
            <div class="admin-review-stars">${starsHtml}</div>
            <div class="admin-review-text">${escapeHtml(review.comment || 'No comment provided.')}</div>
            <button class="delete-review" data-id="${id}">Delete Review</button>
        `;
        
        adminReviews.appendChild(reviewItem);
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-review').forEach(button => {
        button.addEventListener('click', async (e) => {
            const id = e.target.getAttribute('data-id');
            if (!id) {
                alert('Cannot delete: missing id.');
                return;
            }
            if (!confirm('Are you sure you want to delete this review?')) return;
            try {
                await window.deleteReviewFromDB(id);
                await loadReviews();
                displayAdminReviews();
                showSuccessMessage('Review deleted successfully!');
            } catch (err) {
                console.error('Error deleting review:', err);
                alert('Error deleting review. Check console.');
            }
        });
    });
}

// Show success message
function showSuccessMessage(message) {
    const successMsg = document.createElement('div');
    successMsg.textContent = message;
    successMsg.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--accent-color);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideInRight 0.5s ease-out;
    `;
    document.body.appendChild(successMsg);
    
    setTimeout(() => {
        successMsg.remove();
    }, 3000);
}

// Add slideInRight animation for success message (inject CSS)
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Load reviews from Firestore and update UI
async function loadReviews() {
    try {
        const remote = await window.getAllReviews();
        // normalize remote data: ensure createdAt/displayDate exist
        reviews = (remote || []).map(r => {
            // some items might already have createdAt string
            // ensure displayDate exists
            if (!r.displayDate && r.createdAt) {
                try {
                    const d = new Date(r.createdAt);
                    r.displayDate = d.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                } catch(e) {
                    r.displayDate = r.createdAt;
                }
            }
            return r;
        });
        displayReviews();
    } catch (err) {
        console.error('Error loading reviews:', err);
        reviews = [];
        displayReviews();
    }
}

// Simple HTML escaper to prevent injection in displayed content
function escapeHtml(str) {
    if (!str && str !== 0) return '';
    return String(str)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadReviews();
    
    // Initial robot greeting
    setTimeout(() => {
        showRobotMessage("Hi! I'm Robo! I'll guide you through the portfolio! 👋");
    }, 2000);
});
