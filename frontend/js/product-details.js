/**
 * Product Details Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Product Details Page Loaded');
    initStarRating();
    initCopyButtons();
});

/**
 * Interactive Star Rating
 */
function initStarRating() {
    const stars = document.querySelectorAll('.text-tertiary .material-symbols-outlined');
    stars.forEach((star, index) => {
        star.classList.add('cursor-pointer', 'transition-colors');
        star.addEventListener('click', () => {
            updateStars(index);
        });
    });

    function updateStars(index) {
        stars.forEach((s, i) => {
            if (i <= index) {
                s.style.fontVariationSettings = "'FILL' 1";
            } else {
                s.style.fontVariationSettings = "'FILL' 0";
            }
        });
    }
}

/**
 * Copy Transaction Hash
 */
function initCopyButtons() {
    const copyBtns = document.querySelectorAll('.copy-hash-btn');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const hashText = e.target.previousElementSibling.innerText;
            navigator.clipboard.writeText(hashText).then(() => {
                const originalIcon = e.target.innerText;
                e.target.innerText = 'check';
                setTimeout(() => {
                    e.target.innerText = originalIcon;
                }, 2000);
            });
        });
    });
}
