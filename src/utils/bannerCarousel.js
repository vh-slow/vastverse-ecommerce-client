export function initBannerCarousel() {
    const bannerCarousel = document.querySelector('.banner-carousel');
    if (!bannerCarousel) return null;

    const slides = document.querySelectorAll('.carousel-slide');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const indicatorsContainer = document.querySelector('.carousel-indicators');

    if (!slides.length || !nextBtn || !prevBtn || !indicatorsContainer)
        return null;

    let currentSlide = 0;
    let autoSlideInterval;

    // --- INDICATORS ---
    indicatorsContainer.innerHTML = '';
    slides.forEach((slide, index) => {
        const indicator = document.createElement('span');
        indicator.classList.add('indicator-item');
        indicator.setAttribute('data-slide-to', index);
        indicatorsContainer.appendChild(indicator);
    });

    const indicators = document.querySelectorAll('.indicator-item');

    function updateIndicators() {
        indicators.forEach((indicator) => indicator.classList.remove('active'));
        indicators[currentSlide].classList.add('active');
    }

    function showSlide(n) {
        slides[currentSlide].classList.remove('active-slide');
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active-slide');
        updateIndicators();
    }

    function startAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 3000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // --- HANDLERS ---
    const nextHandler = () => {
        showSlide(currentSlide + 1);
        startAutoSlide();
    };

    const prevHandler = () => {
        showSlide(currentSlide - 1);
        startAutoSlide();
    };

    const indicatorHandler = (e) => {
        const slideIndex = Number(e.target.getAttribute('data-slide-to'));
        showSlide(slideIndex);
        startAutoSlide();
    };

    nextBtn.addEventListener('click', nextHandler);
    prevBtn.addEventListener('click', prevHandler);
    indicators.forEach((indicator) =>
        indicator.addEventListener('click', indicatorHandler)
    );

    bannerCarousel.addEventListener('mouseenter', stopAutoSlide);
    bannerCarousel.addEventListener('mouseleave', startAutoSlide);

    showSlide(0);
    startAutoSlide();

    // --- CLEANUP ---
    return () => {
        nextBtn.removeEventListener('click', nextHandler);
        prevBtn.removeEventListener('click', prevHandler);
        indicators.forEach((indicator) =>
            indicator.removeEventListener('click', indicatorHandler)
        );
        bannerCarousel.removeEventListener('mouseenter', stopAutoSlide);
        bannerCarousel.removeEventListener('mouseleave', startAutoSlide);
        clearInterval(autoSlideInterval);
    };
}
