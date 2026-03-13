document.addEventListener('DOMContentLoaded', () => {
    // 3. Mobile Hamburger Menu
    const hamburger = document.getElementById('hamburger');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const mobileNavClose = document.getElementById('mobileNavClose');

    const openMobileNav = () => {
        if (hamburger) hamburger.classList.add('open');
        if (mobileNavOverlay) mobileNavOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    const closeMobileNav = () => {
        if (hamburger) hamburger.classList.remove('open');
        if (mobileNavOverlay) mobileNavOverlay.classList.remove('open');
        document.body.style.overflow = '';
    };

    if (hamburger) hamburger.addEventListener('click', openMobileNav);
    if (hamburger) hamburger.addEventListener('touchstart', (e) => { e.preventDefault(); openMobileNav(); }, { passive: false });

    if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileNav);
    if (mobileNavClose) mobileNavClose.addEventListener('touchstart', (e) => { e.preventDefault(); closeMobileNav(); }, { passive: false });

    // Close on overlay link click / touch
    if (mobileNavOverlay) {
        mobileNavOverlay.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileNav);
            link.addEventListener('touchstart', () => { closeMobileNav(); }, { passive: true });
        });

        // Close overlay when tapping outside nav links area
        mobileNavOverlay.addEventListener('touchstart', (e) => {
            if (e.target === mobileNavOverlay) closeMobileNav();
        }, { passive: true });
    }

    // 4. Accordion Logic (FAQ)
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        if (header) {
            header.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');

                // Close others
                accordionItems.forEach(other => {
                    other.classList.remove('active');
                    const content = other.querySelector('.accordion-content');
                    if (content) content.style.maxHeight = null;
                });

                // Toggle current
                if (!isOpen) {
                    item.classList.add('active');
                    const content = item.querySelector('.accordion-content');
                    if (content) content.style.maxHeight = content.scrollHeight + "px";
                }
            });
        }
    });

    // 5. Scroll Performance (Header & Reveal)
    const header = document.querySelector('header');
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        // Header styles
        if (header) {
            header.classList.toggle('scrolled', currentScrollY > 20);
            header.classList.toggle('nav-hidden', currentScrollY > lastScrollY && currentScrollY > 150);
        }

        lastScrollY = currentScrollY;
    };

    // Efficient scroll listener
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Intersection Observer for reveal elements
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        revealElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('is-visible'));
    }

    // 6. Special Offers Carousel Logic
    const carouselSection = document.querySelector('.offers-carousel-container');
    const offerSlides = document.querySelectorAll('.offer-slide');
    const dots = document.querySelectorAll('.carousel-dot');

    if (offerSlides.length > 0) {
        let currentSlide = 0;
        let slideInterval;

        const showSlide = (index) => {
            offerSlides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));

            offerSlides[index].classList.add('active');
            dots[index].classList.add('active');
            currentSlide = index;
        };

        const nextSlide = () => {
            let index = (currentSlide + 1) % offerSlides.length;
            showSlide(index);
        };

        const startSlideShow = () => {
            stopSlideShow();
            slideInterval = setInterval(nextSlide, 5000); // Increased speed
        };

        const stopSlideShow = () => {
            if (slideInterval) clearInterval(slideInterval);
        };

        // Event Listeners
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                startSlideShow();
            });
        });

        // Pause on hover
        if (carouselSection) {
            carouselSection.addEventListener('mouseenter', stopSlideShow);
            carouselSection.addEventListener('mouseleave', startSlideShow);
        }

        // Initialize
        startSlideShow();
    }

    // 7. Services Carousel Logic
    const servicesCarousel = document.querySelector('.services-carousel-container');
    const servicesSlides = document.querySelectorAll('.services-slide');
    const servicesDotContainer = document.querySelector('.service-dots');

    if (servicesSlides.length > 0) {
        let currentServiceSlide = 0;
        let serviceInterval;

        // Create dots dynamically
        servicesSlides.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (idx === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                showServiceSlide(idx);
                startServiceRotation();
            });
            if (servicesDotContainer) servicesDotContainer.appendChild(dot);
        });

        const servicesDots = document.querySelectorAll('.service-dots .carousel-dot');

        const showServiceSlide = (index) => {
            servicesSlides.forEach(slide => slide.classList.remove('active'));
            servicesDots.forEach(dot => dot.classList.remove('active'));

            servicesSlides[index].classList.add('active');
            if (servicesDots[index]) servicesDots[index].classList.add('active');
            currentServiceSlide = index;
        };

        const nextServiceSlide = () => {
            let index = (currentServiceSlide + 1) % servicesSlides.length;
            showServiceSlide(index);
        };

        const startServiceRotation = () => {
            stopServiceRotation();
            serviceInterval = setInterval(nextServiceSlide, 3000); // Increased speed
        };

        const stopServiceRotation = () => {
            if (serviceInterval) clearInterval(serviceInterval);
        };

        if (servicesCarousel) {
            servicesCarousel.addEventListener('mouseenter', stopServiceRotation);
            servicesCarousel.addEventListener('mouseleave', startServiceRotation);
        }

        startServiceRotation();
    }

    // 7.1 Testimonial Carousel Logic (Auto-sliding)
    const testimonialGrid = document.querySelector('.testimonial-grid');
    const testimonialCards = document.querySelectorAll('.testimonial-card');

    if (testimonialGrid && testimonialCards.length > 0) {
        let testimonialInterval;

        const nextTestimonial = () => {
            const cardWidth = testimonialCards[0].offsetWidth + 32; // card width + gap
            const maxScroll = testimonialGrid.scrollWidth - testimonialGrid.clientWidth;

            if (testimonialGrid.scrollLeft + 10 >= maxScroll) {
                // Wrap back to start
                testimonialGrid.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                // Scroll to next card
                testimonialGrid.scrollBy({ left: cardWidth, behavior: 'smooth' });
            }
        };

        const startTestimonialRotation = () => {
            stopTestimonialRotation();
            testimonialInterval = setInterval(nextTestimonial, 4000);
        };

        const stopTestimonialRotation = () => {
            if (testimonialInterval) clearInterval(testimonialInterval);
        };

        // Event Listeners for pausing
        testimonialGrid.addEventListener('mouseenter', stopTestimonialRotation);
        testimonialGrid.addEventListener('mouseleave', startTestimonialRotation);
        testimonialGrid.addEventListener('touchstart', stopTestimonialRotation, { passive: true });
        testimonialGrid.addEventListener('touchend', startTestimonialRotation, { passive: true });

        startTestimonialRotation();
    }

    // 7.5 Hero Background Carousel Logic
    const heroSlides = document.querySelectorAll('.hero-slide');
    if (heroSlides.length > 1) {
        let currentHeroSlide = 0;

        const nextHeroSlide = () => {
            heroSlides[currentHeroSlide].classList.remove('active');
            currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
            heroSlides[currentHeroSlide].classList.add('active');
        };

        // Rotate every 2.5 seconds for a more dynamic feel
        setInterval(nextHeroSlide, 2500);
    }

    // 8. Interactive Service List (Services Page)
    const serviceItems = document.querySelectorAll('.interactive-service-item');
    serviceItems.forEach(item => {
        item.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Close all
            serviceItems.forEach(other => other.classList.remove('open'));

            // Toggle current
            if (!isOpen) {
                item.classList.add('open');
            }
        });
    });

    handleScroll();

});

