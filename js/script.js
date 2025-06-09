// Gas light effect creator function
function createGasLight(container, options = {}) {
    const gasLight = document.createElement('div');
    gasLight.className = `gas-light ${options.className || ''}`;
    container.appendChild(gasLight);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let isMoving = false;
    let rafId = null;

    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    function handleMouseMove(e) {
        const rect = container.getBoundingClientRect();
        if (rect.top <= e.clientY && e.clientY <= rect.bottom) {
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
            
            if (!isMoving) {
                isMoving = true;
                cancelAnimationFrame(rafId);
                animate();
            }
        }
    }

    function handleTouch(e) {
        e.preventDefault();
        const rect = container.getBoundingClientRect();
        const touch = e.touches[0];
        if (rect.top <= touch.clientY && touch.clientY <= rect.bottom) {
            mouseX = touch.clientX - rect.left;
            mouseY = touch.clientY - rect.top;
            
            if (!isMoving) {
                isMoving = true;
                cancelAnimationFrame(rafId);
                animate();
            }
        }
    }

    function resetPosition() {
        mouseX = container.offsetWidth / 2;
        mouseY = container.offsetHeight / 2;
    }

    function animate() {
        currentX = lerp(currentX, mouseX, options.ease || 0.1);
        currentY = lerp(currentY, mouseY, options.ease || 0.1);

        const dx = mouseX - currentX;
        const dy = mouseY - currentY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        gasLight.style.transform = `translate(${currentX}px, ${currentY}px)`;

        const scale = Math.min(1 + distance * 0.0005, 1.2);
        gasLight.style.transform += ` scale(${scale})`;

        if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
            rafId = requestAnimationFrame(animate);
        } else {
            isMoving = false;
        }
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouch, { passive: false });
    container.addEventListener('mouseleave', resetPosition);
    container.addEventListener('touchend', resetPosition);

    window.addEventListener('resize', () => {
        resetPosition();
        currentX = mouseX;
        currentY = mouseY;
        gasLight.style.transform = `translate(${currentX}px, ${currentY}px)`;
    });

    // Initial position
    resetPosition();
    gasLight.style.transform = `translate(${currentX}px, ${currentY}px)`;

    return {
        element: gasLight,
        reset: resetPosition
    };
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Hero section gas light
    const hero = document.querySelector('.hero-section');
    if (hero) {
        createGasLight(hero, {
            className: 'hero-gas-light',
            ease: 0.1,
            color: 'rgba(255, 87, 34, 0.15)' // Orange accent color
        });
    }

    // Carthage section gas light
    const carthage = document.querySelector('.colossus-section');
    if (carthage) {
        createGasLight(carthage, {
            className: 'colossus-gas-light',
            ease: 0.15,
            color: 'rgba(255, 87, 34, 0.12)' // Slightly dimmer orange
        });
    }

    // Mobile menu functionality
    const mobileMenu = document.getElementById('mobile-menu');
    const menuButton = document.querySelector('nav button');
    const closeButton = document.getElementById('close-menu');

    function toggleMenu() {
        const isHidden = mobileMenu.classList.contains('hidden');
        mobileMenu.classList.toggle('hidden', !isHidden);
        mobileMenu.classList.toggle('animate-fadeIn', isHidden);
        document.body.style.overflow = isHidden ? 'hidden' : '';
    }

    menuButton?.addEventListener('click', toggleMenu);
    closeButton?.addEventListener('click', toggleMenu);

    // Logo interaction enhancement
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('mouseover', () => {
            logo.style.filter = 'drop-shadow(0 0 12px var(--accent-orange))';
        });
        
        logo.addEventListener('mouseout', () => {
            logo.style.filter = 'none';
        });
    }

    // Close menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeIn');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});
