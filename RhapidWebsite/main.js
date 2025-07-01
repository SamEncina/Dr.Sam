window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const wrapper = document.querySelector('.scrolling-wrapper');
    const prevBtn = document.querySelector('.scroll-arrow.prev');
    const nextBtn = document.querySelector('.scroll-arrow.next');

    if (wrapper && prevBtn && nextBtn) {
        nextBtn.addEventListener('click', () => {
            wrapper.scrollBy({ left: 300, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            wrapper.scrollBy({ left: -300, behavior: 'smooth' });
        });
    }
});
