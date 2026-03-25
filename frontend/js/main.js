/**
 * BlockRate Common JavaScript
 * Handles shared components like Navbar and Mobile Menu
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('BlockRate App Initialized');
    initNavbar();
    initProductFilters();
});

/**
 * Navbar Logic
 */
function initNavbar() {
    const nav = document.querySelector('nav');
    
    // Change navbar shadow on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            nav.classList.add('shadow-sm');
        } else {
            nav.classList.remove('shadow-sm');
        }
    });

    // Mobile Menu Toggle using Bootstrap d-none
    const mobileMenuBtn = document.querySelector('#mobile-menu-btn');
    const mobileMenu = document.querySelector('#mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('d-none');
            mobileMenu.classList.toggle('d-block');
        });
    }
}

/**
 * Product Filtering Logic
 */
function initProductFilters() {
    const filterBtns = document.querySelectorAll('[data-filter]');
    const productCards = document.querySelectorAll('.product-card');

    if (filterBtns.length === 0 || productCards.length === 0) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');

            // Update active button state
            filterBtns.forEach(b => {
                b.classList.remove('bg-primary', 'text-white');
                b.classList.add('bg-surface-container-low', 'text-secondary');
            });
            btn.classList.add('bg-primary', 'text-white');
            btn.classList.remove('bg-surface-container-low', 'text-secondary');

            // Filter products
            productCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.classList.remove('d-none');
                } else {
                    card.classList.add('d-none');
                }
            });
        });
    });
}
