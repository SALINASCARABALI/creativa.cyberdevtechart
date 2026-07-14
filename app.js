// ============================================
// CYBERDEVTECHART - MAIN APP SCRIPT
// by Liliana Salinas
// ============================================

// ============================
// DATA LOADING FROM LOCALSTORAGE
// ============================
function loadSiteData() {
    const saved = localStorage.getItem('cyberdev_data');
    const data = saved ? JSON.parse(saved) : null;
    if (!data) return;

    // Update contact info on homepage
    const emailEl = document.getElementById('displayEmail');
    const phoneEl = document.getElementById('displayPhone');
    const countryEl = document.getElementById('displayCountry');
    const descEl = document.getElementById('heroDescription');
    const statusEl = document.getElementById('adminStatus');

    if (emailEl && data.contact.email) emailEl.textContent = data.contact.email;
    if (phoneEl && data.contact.phone) phoneEl.textContent = data.contact.phone;
    if (countryEl && data.contact.country) countryEl.textContent = data.contact.country;
    if (descEl && data.contact.description) descEl.textContent = data.contact.description;
    if (statusEl && data.contact.status) statusEl.textContent = data.contact.status;
}

// ============================
// PARTICLES ANIMATION
// ============================
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const particleCount = window.innerWidth < 768 ? 15 : 25;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = Math.random() * 15 + 5;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';

        container.appendChild(particle);
    }
}

// ============================
// SCROLL REVEAL
// ============================
function initReveal() {
    const reveals = document.querySelectorAll('.reveal');

    function reveal() {
        const windowHeight = window.innerHeight;
        for (let i = 0; i < reveals.length; i++) {
            const elementTop = reveals[i].getBoundingClientRect().top;
            if (elementTop < windowHeight - 80) {
                reveals[i].classList.add('active');
            }
        }
    }

    window.addEventListener('scroll', reveal);
    reveal();
}

// ============================
// NAVBAR SCROLL EFFECT
// ============================
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ============================
// SMOOTH SCROLL
// ============================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });

                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const toggler = document.querySelector('.navbar-toggler');
                    if (toggler) toggler.click();
                }
            }
        });
    });
}

// ============================
// CONTACT FORM
// ============================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = {
            name: form.querySelector('input[type="text"]').value,
            email: form.querySelector('input[type="email"]').value,
            type: form.querySelector('select').value,
            message: form.querySelector('textarea').value,
            date: new Date().toLocaleString('es-MX')
        };

        // Save to admin messages
        let appData = JSON.parse(localStorage.getItem('cyberdev_data'));
        if (!appData) {
            appData = { messages: [] };
        }
        if (!appData.messages) appData.messages = [];
        appData.messages.unshift(formData);
        localStorage.setItem('cyberdev_data', JSON.stringify(appData));

        // Show success
        const btn = form.querySelector('.btn-submit');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check me-2"></i>¡Mensaje Enviado!';
        btn.style.background = '#00b894';
        form.reset();

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
        }, 3000);
    });
}

// ============================
// YEAR UPDATE
// ============================
function updateYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

// ============================
// ANIMATED COUNTERS
// ============================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-item h3');
    counters.forEach(counter => {
        const target = counter.textContent;
        const numMatch = target.match(/[\d.]+/);
        if (!numMatch) return;

        const numTarget = parseFloat(numMatch[0]);
        const suffix = target.replace(/[\d.]+/, '');
        const isK = suffix.includes('K');
        const finalValue = isK ? numTarget * 1000 : numTarget;

        let current = 0;
        const increment = finalValue / 60;
        const timer = setInterval(() => {
            current += increment;
            if (current >= finalValue) {
                current = finalValue;
                clearInterval(timer);
            }
            if (isK) {
                counter.textContent = (current / 1000).toFixed(1) + 'K';
            } else {
                counter.textContent = Math.floor(current) + suffix;
            }
        }, 30);
    });
}

// ============================
// LOADER
// ============================
function removeLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
        }, 600);
    }
}

// ============================
// INIT
// ============================
document.addEventListener('DOMContentLoaded', function() {
    loadSiteData();
    createParticles();
    initReveal();
    initNavbar();
    initSmoothScroll();
    initContactForm();
    updateYear();
    removeLoader();

    // Trigger counters when hero is visible
    setTimeout(animateCounters, 800);
});
