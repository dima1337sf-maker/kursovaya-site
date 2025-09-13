// DOM Elements
let mobileMenuToggle;
let navMenu;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeDOMElements();
    initializeCalculator();
    initializeAnimations();
    initializeMobileMenu();
    initializeEventListeners();
    addNotificationStyles();
});

// Initialize DOM elements
function initializeDOMElements() {
    mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    navMenu = document.querySelector('.nav-menu');
}

// Initialize event listeners
function initializeEventListeners() {
    // Modal click outside to close
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            const modalId = event.target.id;
            closeModal(modalId);
        }
    });

    // Escape key to close modals
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal:not(.hidden)');
            openModals.forEach(modal => {
                closeModal(modal.id);
            });
        }
    });

    // Smooth scrolling for anchor links
    document.addEventListener('click', function(event) {
        const target = event.target;
        if (target.matches('a[href^="#"]')) {
            event.preventDefault();
            const targetId = target.getAttribute('href');
            scrollToSection(targetId);
        }
    });
}

// Mobile menu functionality
function initializeMobileMenu() {
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
}

function toggleMobileMenu() {
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}

// Calculator functionality
function initializeCalculator() {
    updatePages();
    calculatePrice();
    
    // Add event listeners for calculator
    const workType = document.getElementById('workType');
    const pages = document.getElementById('pages');
    const deadline = document.getElementById('deadline');
    
    if (workType) {
        workType.addEventListener('change', calculatePrice);
    }
    
    if (pages) {
        pages.addEventListener('input', function() {
            updatePages();
            calculatePrice();
        });
    }
    
    if (deadline) {
        deadline.addEventListener('change', calculatePrice);
    }
}

function updatePages() {
    const pagesSlider = document.getElementById('pages');
    const pagesValue = document.getElementById('pagesValue');
    if (pagesSlider && pagesValue) {
        pagesValue.textContent = pagesSlider.value;
    }
}

function calculatePrice() {
    const workType = document.getElementById('workType');
    const pages = document.getElementById('pages');
    const deadline = document.getElementById('deadline');
    const finalPrice = document.getElementById('finalPrice');
    
    if (!workType || !pages || !deadline || !finalPrice) return;
    
    const basePrice = parseInt(workType.value);
    const pageCount = parseInt(pages.value);
    const deadlineMultiplier = parseFloat(deadline.value);
    
    // Calculate price based on work type
    let pricePerPage;
    switch (basePrice) {
        case 800: // Курсовая
            pricePerPage = 40;
            break;
        case 400: // Реферат
            pricePerPage = 25;
            break;
        case 4500: // Дипломная
            pricePerPage = 75;
            break;
        case 300: // Контрольная
            pricePerPage = 20;
            break;
        default:
            pricePerPage = 40;
    }
    
    const totalPrice = Math.max(basePrice, pricePerPage * pageCount * deadlineMultiplier);
    
    finalPrice.textContent = Math.round(totalPrice).toLocaleString('ru-RU') + ' ₽';
}

// Modal functionality
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Focus first input in modal after animation
        setTimeout(() => {
            const firstInput = modal.querySelector('input, select, textarea');
            if (firstInput) {
                firstInput.focus();
            }
        }, 300);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

// FAQ functionality
function toggleFaq(element) {
    const faqItem = element.closest('.faq-item');
    if (!faqItem) return;
    
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items first
    const allFaqItems = document.querySelectorAll('.faq-item');
    allFaqItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Smooth scrolling function
function scrollToSection(target) {
    const element = document.querySelector(target);
    if (element) {
        const header = document.querySelector('.header');
        const headerHeight = header ? header.offsetHeight : 80;
        const targetPosition = element.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Alternative scroll function for buttons
function scrollTo(target) {
    scrollToSection(target);
}

// Form submission
function submitOrder(event) {
    event.preventDefault();
    
    const form = event.target;
    
    // Basic validation
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    // Remove previous error styles
    form.querySelectorAll('.form-control').forEach(field => {
        field.classList.remove('error');
    });
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
        }
    });
    
    if (!isValid) {
        showNotification('Пожалуйста, заполните все обязательные поля', 'error');
        return;
    }
    
    // Email validation
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && !isValidEmail(emailField.value)) {
        emailField.classList.add('error');
        showNotification('Пожалуйста, введите корректный email', 'error');
        return;
    }
    
    // Phone validation
    const phoneField = form.querySelector('input[type="tel"]');
    if (phoneField && !isValidPhone(phoneField.value)) {
        phoneField.classList.add('error');
        showNotification('Пожалуйста, введите корректный номер телефона', 'error');
        return;
    }
    
    // Simulate form submission
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Отправляем...';
    submitButton.disabled = true;
    
    setTimeout(() => {
        showNotification('Заявка успешно отправлена! Мы свяжемся с вами в течение 15 минут.', 'success');
        form.reset();
        closeModal('orderModal');
        
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
    }, 1500);
}

// Validation helpers
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    
    let backgroundColor;
    switch (type) {
        case 'success':
            backgroundColor = '#10b981';
            break;
        case 'error':
            backgroundColor = '#ef4444';
            break;
        default:
            backgroundColor = '#6b7280';
    }
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${backgroundColor};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 3000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
        font-family: var(--font-family-base);
        font-size: 14px;
    `;
    
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
    `;
    
    closeBtn.addEventListener('mouseenter', function() {
        this.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    });
    
    closeBtn.addEventListener('mouseleave', function() {
        this.style.backgroundColor = 'transparent';
    });
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Add notification and mobile menu styles
function addNotificationStyles() {
    if (document.getElementById('dynamic-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'dynamic-styles';
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
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .form-control.error {
            border-color: #ef4444 !important;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
        }
        
        @media (max-width: 768px) {
            .nav-menu.active {
                display: flex !important;
                flex-direction: column;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: var(--color-surface);
                border: 1px solid var(--color-card-border);
                border-top: none;
                padding: var(--space-16);
                gap: var(--space-16);
                box-shadow: var(--shadow-md);
            }
        }
        
        .slider::-webkit-slider-thumb {
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: var(--color-primary);
            cursor: pointer;
            transition: transform 0.15s ease;
        }
        
        .slider::-webkit-slider-thumb:hover {
            transform: scale(1.1);
        }
        
        .slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: var(--color-primary);
            cursor: pointer;
            border: none;
            transition: transform 0.15s ease;
        }
        
        .slider::-moz-range-thumb:hover {
            transform: scale(1.1);
        }
    `;
    document.head.appendChild(style);
}

// Initialize animations on scroll
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.advantage-card, .review-card, .step');
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Utility function to safely get element
function safeGetElement(selector) {
    try {
        return document.querySelector(selector);
    } catch (e) {
        console.warn('Element not found:', selector);
        return null;
    }
}

// Add click tracking
function trackClick(eventName, element) {
    // Basic analytics tracking - can be extended
    console.log('Event tracked:', eventName, element);
}

// Debug helper
function debugModal(modalId) {
    const modal = document.getElementById(modalId);
    console.log('Modal element:', modal);
    console.log('Modal classes:', modal ? modal.className : 'Not found');
}

// Global error handler
window.addEventListener('error', function(event) {
    console.error('JavaScript error:', event.error);
});

// Ensure functions are available globally
window.openModal = openModal;
window.closeModal = closeModal;
window.toggleFaq = toggleFaq;
window.scrollTo = scrollTo;
window.calculatePrice = calculatePrice;
window.updatePages = updatePages;
window.submitOrder = submitOrder;