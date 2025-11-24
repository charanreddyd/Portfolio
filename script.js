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
    contact: "Get in touch with Charan through these channels! 📧"
};

// Robot responses when clicked
const robotResponses = [
    "Need help navigating? Just scroll or ask me! 🗺️",
    "Check out Charan's skills and projects! 💼",
    "Let me know if you have any questions! ❓",
    "Thanks for visiting the portfolio! 🌟",
    "I'm here to help you explore! 🔍",
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initial robot greeting
    setTimeout(() => {
        showRobotMessage("Hi! I'm Robo! I'll guide you through the portfolio! 👋");
    }, 2000);
});
