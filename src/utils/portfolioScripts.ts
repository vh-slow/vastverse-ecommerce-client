// Vị trí: src/utils/portfolioScripts.ts

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ==========================================
// CẤU HÌNH GSAP CHUNG (Gọi ở Layout hoặc file Page tổng)
// ==========================================
export const initGlobalGsap = () => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    gsap.set('.gsap-hide', { visibility: 'visible' });
};

// ==========================================
// 1. HEADER & SEARCH LOGIC
// ==========================================
export const initHeader = () => {
    if (typeof window === 'undefined') return;

    // Smart Navbar Scroll Logic
    const nav = document.getElementById('vv-smart-nav');
    const handleScroll = () => {
        if (nav) {
            if (window.scrollY > 50) {
                nav.classList.add('vv-nav-scrolled');
            } else {
                nav.classList.remove('vv-nav-scrolled');
            }
        }
    };
    window.addEventListener('scroll', handleScroll);

    // Search Overlay Logic (DJI Style)
    const searchTrigger = document.getElementById('search-trigger');
    const searchOverlay = document.getElementById('search-overlay');
    const searchBackdrop = document.getElementById('search-backdrop');
    const closeSearch = document.getElementById('close-search');
    const searchDropdown = document.getElementById('search-dropdown');
    const searchInput = document.getElementById(
        'search-input'
    ) as HTMLInputElement | null;

    const openSearchUI = () => {
        if (searchOverlay && searchBackdrop && searchDropdown) {
            searchOverlay.classList.remove('-translate-y-full');
            searchOverlay.classList.add('translate-y-0');

            searchBackdrop.classList.remove('opacity-0', 'pointer-events-none');
            searchBackdrop.classList.add('opacity-100', 'pointer-events-auto');

            setTimeout(() => {
                if (searchInput) searchInput.focus();
            }, 300);

            setTimeout(() => {
                searchDropdown.classList.remove(
                    'opacity-0',
                    'pointer-events-none',
                    '-translate-y-2'
                );
                searchDropdown.classList.add(
                    'opacity-100',
                    'pointer-events-auto',
                    'translate-y-0'
                );
            }, 400);
        }
    };

    const closeSearchUI = () => {
        if (searchOverlay && searchBackdrop && searchDropdown) {
            searchDropdown.classList.add(
                'opacity-0',
                'pointer-events-none',
                '-translate-y-2'
            );
            searchDropdown.classList.remove(
                'opacity-100',
                'pointer-events-auto',
                'translate-y-0'
            );

            searchOverlay.classList.remove('translate-y-0');
            searchOverlay.classList.add('-translate-y-full');

            searchBackdrop.classList.remove(
                'opacity-100',
                'pointer-events-auto'
            );
            searchBackdrop.classList.add('opacity-0', 'pointer-events-none');

            if (searchInput) searchInput.value = '';
        }
    };

    if (searchTrigger) searchTrigger.addEventListener('click', openSearchUI);
    if (closeSearch) closeSearch.addEventListener('click', closeSearchUI);
    if (searchBackdrop) searchBackdrop.addEventListener('click', closeSearchUI);

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeSearchUI();
    };
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
        window.removeEventListener('scroll', handleScroll);
        if (searchTrigger)
            searchTrigger.removeEventListener('click', openSearchUI);
        if (closeSearch)
            closeSearch.removeEventListener('click', closeSearchUI);
        if (searchBackdrop)
            searchBackdrop.removeEventListener('click', closeSearchUI);
        document.removeEventListener('keydown', handleKeyDown);
    };
};

// ==========================================
// 2. HERO SECTION LOGIC
// ==========================================
export const initHero = () => {
    if (typeof window === 'undefined') return;

    // ==========================================
    // HERO GSAP ANIMATION
    // ==========================================
    const ctx = gsap.context(() => {
        const tlHero = gsap.timeline();

        tlHero
            .from('#vv-smart-nav', {
                y: '-100%',
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
            })
            .from(
                '.gsap-slide-up',
                {
                    y: 80,
                    opacity: 0,
                    duration: 1.2,
                    stagger: 0.15,
                    ease: 'power4.out',
                },
                '-=0.5'
            )
            .from(
                '.gsap-fade-in',
                {
                    y: 40,
                    opacity: 0,
                    duration: 1.2,
                    ease: 'power3.out',
                },
                '-=1'
            );
    });

    // ==========================================
    // HERO MINI SLIDER
    // ==========================================
    const sliderContainer = document.getElementById('hero-mini-slider');

    let slideInterval: number | undefined;

    if (sliderContainer) {
        const slides = Array.from(
            sliderContainer.querySelectorAll<HTMLElement>('.slide-item')
        );

        const prevBtn =
            sliderContainer.querySelector<HTMLElement>('.slider-prev');

        const nextBtn =
            sliderContainer.querySelector<HTMLElement>('.slider-next');

        const progressBar =
            sliderContainer.querySelector<HTMLElement>('.slider-progress');

        let currentIndex = 0;
        let isAnimating = false;

        const totalSlides = slides.length;

        // ==========================================
        // INITIALIZE SLIDES
        // ==========================================
        slides.forEach((slide, index) => {
            slide.style.position = 'absolute';
            slide.style.inset = '0';
            slide.style.width = '100%';
            slide.style.height = '100%';

            slide.style.transition = 'none';

            slide.style.backfaceVisibility = 'hidden';
            slide.style.transformStyle = 'preserve-3d';
            slide.style.willChange = 'transform, opacity';

            if (index === 0) {
                slide.style.transform = 'translate3d(0%,0,0)';
                slide.style.opacity = '1';
                slide.style.zIndex = '2';
                slide.style.pointerEvents = 'auto';
            } else {
                slide.style.transform = 'translate3d(100%,0,0)';
                slide.style.opacity = '0';
                slide.style.zIndex = '1';
                slide.style.pointerEvents = 'none';
            }
        });

        // ==========================================
        // PROGRESS BAR
        // ==========================================
        if (progressBar) {
            progressBar.style.width = `${100 / totalSlides}%`;
            progressBar.style.transform = 'translateX(0%)';
        }

        // ==========================================
        // GO TO SLIDE
        // ==========================================
        const goToSlide = (nextIndex: number, direction: 'next' | 'prev') => {
            if (isAnimating || nextIndex === currentIndex) return;

            isAnimating = true;

            const currentSlide = slides[currentIndex];
            const nextSlide = slides[nextIndex];

            // ==========================================
            // PREPARE NEXT SLIDE
            // ==========================================
            nextSlide.style.transition = 'none';

            nextSlide.style.transform =
                direction === 'next'
                    ? 'translate3d(100%,0,0)'
                    : 'translate3d(-100%,0,0)';

            nextSlide.style.opacity = '1';
            nextSlide.style.zIndex = '3';
            nextSlide.style.pointerEvents = 'auto';

            currentSlide.style.zIndex = '2';

            // ==========================================
            // UPDATE PROGRESS BAR
            // ==========================================
            if (progressBar) {
                progressBar.style.transform = `translateX(${nextIndex * 100}%)`;
            }

            // ==========================================
            // FORCE FRAME
            // ==========================================
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    const transitionEase =
                        'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.8s ease';

                    nextSlide.style.transition = transitionEase;
                    currentSlide.style.transition = transitionEase;

                    // ==========================================
                    // START ANIMATION
                    // ==========================================
                    nextSlide.style.transform = 'translate3d(0%,0,0)';

                    currentSlide.style.transform =
                        direction === 'next'
                            ? 'translate3d(-100%,0,0)'
                            : 'translate3d(100%,0,0)';

                    currentSlide.style.opacity = '0';

                    // ==========================================
                    // CLEANUP
                    // ==========================================
                    window.setTimeout(() => {
                        currentSlide.style.transition = 'none';

                        currentSlide.style.transform =
                            direction === 'next'
                                ? 'translate3d(100%,0,0)'
                                : 'translate3d(-100%,0,0)';

                        currentSlide.style.opacity = '0';
                        currentSlide.style.zIndex = '1';
                        currentSlide.style.pointerEvents = 'none';

                        nextSlide.style.transition = 'none';
                        nextSlide.style.transform = 'translate3d(0%,0,0)';

                        nextSlide.style.opacity = '1';
                        nextSlide.style.zIndex = '3';
                        nextSlide.style.pointerEvents = 'auto';

                        currentIndex = nextIndex;
                        isAnimating = false;
                    }, 800);
                });
            });
        };

        // ==========================================
        // NEXT
        // ==========================================
        const nextSlideFunc = () => {
            const nextIndex = (currentIndex + 1) % totalSlides;

            goToSlide(nextIndex, 'next');
        };

        // ==========================================
        // PREV
        // ==========================================
        const prevSlideFunc = () => {
            const nextIndex = (currentIndex - 1 + totalSlides) % totalSlides;

            goToSlide(nextIndex, 'prev');
        };

        // ==========================================
        // BUTTON EVENTS
        // ==========================================
        nextBtn?.addEventListener('click', nextSlideFunc);

        prevBtn?.addEventListener('click', prevSlideFunc);

        // ==========================================
        // AUTOPLAY
        // ==========================================
        const startAutoPlay = () => {
            if (slideInterval) {
                window.clearInterval(slideInterval);
            }

            slideInterval = window.setInterval(() => {
                nextSlideFunc();
            }, 3500);
        };

        const stopAutoPlay = () => {
            if (slideInterval) {
                window.clearInterval(slideInterval);
            }
        };

        sliderContainer.addEventListener('mouseenter', stopAutoPlay);

        sliderContainer.addEventListener('mouseleave', startAutoPlay);

        startAutoPlay();

        // ==========================================
        // CLEANUP
        // ==========================================
        return () => {
            stopAutoPlay();

            nextBtn?.removeEventListener('click', nextSlideFunc);

            prevBtn?.removeEventListener('click', prevSlideFunc);

            sliderContainer.removeEventListener('mouseenter', stopAutoPlay);

            sliderContainer.removeEventListener('mouseleave', startAutoPlay);

            ctx.revert();
        };
    }

    return () => {
        if (slideInterval) {
            window.clearInterval(slideInterval);
        }

        ctx.revert();
    };
};

export const initInnovation = () => {
    if (typeof window === 'undefined') return;

    const innoSlider = document.getElementById('main-innovation-slider');

    let autoplayInterval: number | undefined;
    let resumeTimeout: number | undefined;

    if (innoSlider) {
        const slides =
            innoSlider.querySelectorAll<HTMLElement>('.innovation-slide');

        const progressContainer = document.getElementById(
            'inno-progress-segments'
        );

        const nextBtn = innoSlider.querySelector<HTMLElement>('.inno-next');

        const prevBtn = innoSlider.querySelector<HTMLElement>('.inno-prev');

        let currentIndex = 0;
        let isAnimating = false;

        const totalSlides = slides.length;
        const slideDuration = 5000;

        if (progressContainer && totalSlides > 0) {
            // ==============================
            // CREATE PROGRESS SEGMENTS
            // ==============================
            slides.forEach((_, i) => {
                const segment = document.createElement('div');

                segment.className =
                    'relative w-10 md:w-14 h-[2px] bg-white/20 overflow-hidden cursor-pointer pointer-events-auto hover:bg-white/40 transition-colors';

                segment.innerHTML = `
                    <div class="progress-fill absolute inset-0 bg-white w-0 h-full"></div>
                `;

                segment.onclick = () => {
                    if (isAnimating || i === currentIndex) return;

                    goToSlide(i, i > currentIndex ? 'next' : 'prev');
                };

                progressContainer.appendChild(segment);
            });

            const fills =
                progressContainer.querySelectorAll<HTMLElement>(
                    '.progress-fill'
                );

            // ==============================
            // UPDATE SLIDE VISUAL
            // ==============================
            function updateVisuals(direction: 'next' | 'prev') {
                const prevIndex =
                    (currentIndex - 1 + totalSlides) % totalSlides;

                const nextIndex = (currentIndex + 1) % totalSlides;

                slides.forEach((slide, i) => {
                    const content =
                        slide.querySelector<HTMLElement>('.slide-content');

                    const video =
                        slide.querySelector<HTMLVideoElement>('video');

                    const centerTransform = 'translate3d(-50%,0,0) scale(1)';
                    const leftTransform =
                        window.innerWidth > 768
                            ? 'translate3d(-115%,0,0) scale(0.9)'
                            : 'translate3d(-120%,0,0) scale(0.9)';

                    const rightTransform =
                        window.innerWidth > 768
                            ? 'translate3d(15%,0,0) scale(0.9)'
                            : 'translate3d(20%,0,0) scale(0.9)';

                    // // PREPARE SLIDE POSITION
                    // if (slides.length === 3) {
                    //     if (direction === 'next' && i === nextIndex) {
                    //         slide.style.transition = 'none';

                    //         slide.style.transform =
                    //             'translateX(100%) scale(0.85)';

                    //         void slide.offsetWidth;
                    //     }

                    //     if (direction === 'prev' && i === prevIndex) {
                    //         slide.style.transition = 'none';

                    //         slide.style.transform =
                    //             'translateX(-200%) scale(0.85)';

                    //         void slide.offsetWidth;
                    //     }
                    // }

                    slide.style.transition =
                        'transform 1s cubic-bezier(0.25, 1, 0.5, 1), opacity 1s ease';

                    // ACTIVE
                    if (i === currentIndex) {
                        slide.style.transform = centerTransform;
                        slide.style.opacity = '1';
                        slide.style.zIndex = '10';

                        slide.classList.remove('grayscale', 'brightness-50');

                        if (content) {
                            content.style.opacity = '1';
                        }

                        if (video) {
                            video.play().catch(() => {});
                        }
                    }

                    // LEFT
                    else if (i === prevIndex) {
                        slide.style.transform = leftTransform;
                        slide.style.opacity = '0.6';
                        slide.style.zIndex = '5';

                        slide.classList.add('brightness-50');

                        if (content) {
                            content.style.opacity = '0';
                        }

                        if (video) {
                            video.pause();
                        }
                    }

                    // RIGHT
                    else if (i === nextIndex) {
                        slide.style.transform = rightTransform;
                        slide.style.opacity = '0.6';
                        slide.style.zIndex = '5';

                        slide.classList.add('brightness-50');

                        if (content) {
                            content.style.opacity = '0';
                        }

                        if (video) {
                            video.pause();
                        }
                    }

                    // HIDDEN
                    else {
                        slide.style.opacity = '0';
                        slide.style.zIndex = '1';
                    }
                });

                // ==============================
                // PROGRESS BAR FIX
                // ==============================
                fills.forEach((fill, i) => {
                    fill.style.transition = 'none';

                    if (i < currentIndex) {
                        fill.style.width = '100%';
                    } else {
                        fill.style.width = '0%';
                    }
                });

                const activeFill = fills[currentIndex];

                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        activeFill.style.transition = `width ${slideDuration}ms linear`;

                        activeFill.style.width = '100%';
                    });
                });
            }

            // ==============================
            // SLIDE CHANGE
            // ==============================
            function goToSlide(index: number, direction: 'next' | 'prev') {
                if (isAnimating) return;

                isAnimating = true;

                currentIndex = index;

                updateVisuals(direction);

                resetAutoplay();

                window.setTimeout(() => {
                    isAnimating = false;
                }, 1000);
            }

            const slideNext = () => {
                goToSlide((currentIndex + 1) % totalSlides, 'next');
            };

            const slidePrev = () => {
                goToSlide(
                    (currentIndex - 1 + totalSlides) % totalSlides,
                    'prev'
                );
            };

            // ==============================
            // AUTOPLAY
            // ==============================
            function resetAutoplay() {
                if (autoplayInterval) {
                    window.clearInterval(autoplayInterval);
                }

                autoplayInterval = window.setInterval(slideNext, slideDuration);
            }

            // ==============================
            // BUTTON EVENTS
            // ==============================
            if (nextBtn) {
                nextBtn.onclick = slideNext;
            }

            if (prevBtn) {
                prevBtn.onclick = slidePrev;
            }

            // ==============================
            // HOVER PAUSE
            // ==============================
            innoSlider.onmouseenter = () => {
                if (autoplayInterval) {
                    window.clearInterval(autoplayInterval);
                }

                if (resumeTimeout) {
                    window.clearTimeout(resumeTimeout);
                }

                const activeFill = fills[currentIndex];

                const computedWidth = window.getComputedStyle(activeFill).width;

                activeFill.dataset.width = computedWidth;

                activeFill.style.transition = 'none';

                activeFill.style.width = computedWidth;
            };

            innoSlider.onmouseleave = () => {
                const activeFill = fills[currentIndex];

                const parentWidth = activeFill.parentElement?.clientWidth || 1;

                const currentWidth = parseFloat(
                    activeFill.dataset.width || '0'
                );

                const progressPercent = currentWidth / parentWidth;

                const remainingTime = slideDuration * (1 - progressPercent);

                activeFill.style.transition = `width ${remainingTime}ms linear`;

                activeFill.style.width = '100%';

                resumeTimeout = window.setTimeout(() => {
                    slideNext();
                    resetAutoplay();
                }, remainingTime);
            };

            // INIT
            updateVisuals('next');
            resetAutoplay();
        }
    }

    // ==============================
    // GSAP ANIMATION
    // ==============================
    const st = gsap.from('.gsap-innovation-header', {
        scrollTrigger: {
            trigger: '#innovation-showcase',
            start: 'top 70%',
        },

        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
    });

    // ==============================
    // CLEANUP
    // ==============================
    return () => {
        if (autoplayInterval) {
            window.clearInterval(autoplayInterval);
        }

        if (resumeTimeout) {
            window.clearTimeout(resumeTimeout);
        }

        st.kill();
    };
};

// ==========================================
// 4. ECOSYSTEM SECTION LOGIC
// ==========================================
export const initEco = () => {
    if (typeof window === 'undefined') return;
    const st1 = gsap.from('.gsap-group-slide-up', {
        scrollTrigger: { trigger: '#explore', start: 'top 55%' },
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
    });

    const st2 = gsap.from('.gsap-eco-card', {
        scrollTrigger: { trigger: '#explore', start: 'top 50%' },
        y: 80,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.2,
    });

    return () => {
        st1.kill();
        st2.kill();
    };
};

// ==========================================
// 5. PRODUCT SHOWCASE SECTION LOGIC
// ==========================================
export const initShowcase = () => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
        gsap.fromTo(
            '.gsap-showcase-header',
            {
                y: 60,
                opacity: 0,
                visibility: 'hidden',
            },
            {
                scrollTrigger: {
                    trigger: '#showcase',
                    start: 'top 75%',
                    toggleActions: 'play none none reverse',
                },

                y: 0,
                opacity: 1,
                visibility: 'visible',
                duration: 1,
                ease: 'power3.out',
            }
        );

        gsap.fromTo(
            '.gsap-showcase-item',
            {
                y: 80,
                opacity: 0,
                visibility: 'hidden',
            },
            {
                scrollTrigger: {
                    trigger: '#showcase',
                    start: 'top 70%',
                    toggleActions: 'play none none reverse',
                },

                y: 0,
                opacity: 1,
                visibility: 'visible',

                duration: 1,
                stagger: 0.12,
                ease: 'power3.out',
            }
        );
    });

    return () => {
        ctx.revert();
    };
};

// ==========================================
// 6. TEAM SECTION LOGIC
// ==========================================
export const initTeam = () => {
    if (typeof window === 'undefined') return;
    const st1 = gsap.from('.gsap-team-header', {
        scrollTrigger: { trigger: '#team-section', start: 'top 55%' },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
    });

    const st2 = gsap.from('.gsap-team-accordion', {
        scrollTrigger: { trigger: '#team-section', start: 'top 50%' },
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
    });

    return () => {
        st1.kill();
        st2.kill();
    };
};

// ==========================================
// 7. FOOTER SECTION LOGIC
// ==========================================
export const initFooter = () => {
    if (typeof window === 'undefined') return;
    const st = gsap.from('.gsap-footer-fade', {
        scrollTrigger: { trigger: 'footer', start: 'top 90%' },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
    });

    return () => {
        st.kill();
    };
};
