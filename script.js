document.addEventListener('DOMContentLoaded', () => {
    
    // Shared Lenis reference (initialized later, used by click handlers)
    let lenis = null;
    // Custom Liquid Cursor Logic
    const cursor = document.querySelector('.custom-cursor');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animate cursor smoothly (LERP)
    function animateCursor() {
        const easing = 0.9; // Increased for tighter, faster tracking while preserving the smooth LERP effect
        cursorX += (mouseX - cursorX) * easing;
        cursorY += (mouseY - cursorY) * easing;
        
        // Offset by 10px to center the 20x20 cursor exactly on the pointer
        cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Work Hover Cursor Logic
    const stackImages = document.querySelectorAll('.stack-img');
    const cursorText = document.querySelector('.cursor-text');
    
    stackImages.forEach(img => {
        img.addEventListener('mouseenter', () => {
            cursor.classList.add('hover-work');
            if(cursorText) cursorText.textContent = 'Work';
        });
        img.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover-work');
            if(cursorText) cursorText.textContent = '';
        });
        img.addEventListener('click', () => {
            if (lenis) {
                lenis.scrollTo('#websites', { duration: 2, easing: (t) => 1 - Math.pow(1 - t, 4) });
            } else {
                document.querySelector('#websites').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });


    // ==========================================
    // Hero Intro Animation Sequence (GSAP)
    // ==========================================
    if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        const nameWrapper = document.querySelector('.hero-massive-name-wrapper');

        // --- Initial States ---
        gsap.set("#hero-2d-image, .nav-left, .nav-middle, .nav-right, .hero-headline-wrapper, .hero-footer-bar", 
            { opacity: 0, y: 30 });
        gsap.set(".white-strip", { clipPath: "inset(50% 0%)", opacity: 1 });
        gsap.set(".navbar, .hero-massive-name-wrapper", { "--line-scale": 0 });

        // WasiTM starts far above, fully visible but masked to 10% — ghostly
        gsap.set(nameWrapper, { y: "-50vh", opacity: 1 });
        nameWrapper.style.webkitMaskImage = "linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.1) 100%)";
        nameWrapper.style.maskImage = "linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.1) 100%)";

        // === ACT 1: Drop faded to center, then pause ===
        tl.to(nameWrapper, {
            y: "-12vh",
            duration: 1.0,
            ease: "expo.out"
        })

        // === ACT 2: Sweep white colour from left to right ===
        .to({ pct: 0 }, {
            pct: 105,
            duration: 0.8,
            ease: "power2.inOut",
            onUpdate: function() {
                const p = this.targets()[0].pct;
                const grad = `linear-gradient(90deg, rgba(0,0,0,1) ${p}%, rgba(0,0,0,0.1) ${p + 8}%)`;
                nameWrapper.style.webkitMaskImage = grad;
                nameWrapper.style.maskImage = grad;
            },
            onComplete: () => {
                // Remove mask entirely after sweep is done
                nameWrapper.style.webkitMaskImage = "none";
                nameWrapper.style.maskImage = "none";
            }
        }, "+=0.15")

        // === ACT 3: Drop to final resting position ===
        .to(nameWrapper, {
            y: "0vh",
            duration: 1.2,
            ease: "expo.inOut"
        }, "+=0.1")

        // Lines draw as it settles
        .to([".navbar", ".hero-massive-name-wrapper"], {
            "--line-scale": 1,
            duration: 0.8,
            ease: "power2.inOut"
        }, "-=0.8")

        // White strip opens
        .to(".white-strip", {
            clipPath: "inset(0% 0%)",
            duration: 0.7,
            ease: "power2.inOut"
        }, "-=0.5")

        // Everything else fades in
        .to(".hero-headline-wrapper", {
            opacity: 1, y: 0, duration: 0.7
        }, "-=0.4")
        .to("#hero-2d-image", {
            opacity: 1, y: 0, duration: 0.7
        }, "-=0.6")
        .to(".nav-left, .nav-middle, .nav-right", {
            opacity: 1, y: 0, duration: 0.6, stagger: 0.04
        }, "-=0.5")
        .to(".hero-footer-bar", {
            opacity: 1, y: 0, duration: 0.6
        }, "-=0.4");
    }

    // Initialize Intersection Observer for future scroll animations
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // =========================================
    // Gallery: Scroll Parallax + Entrance Animations
    // =========================================
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach((item, index) => {
            // Clean entrance: fade in + slight scale
            gsap.fromTo(item, 
                { opacity: 0, scale: 0.92, y: 40 },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.7,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: item,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    },
                    delay: index * 0.08
                }
            );
        });
        
        // Cursor hover effect on gallery cards
        galleryItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                cursor.classList.add('hover-work');
                if(cursorText) cursorText.textContent = 'View';
            });
            item.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover-work');
                if(cursorText) cursorText.textContent = '';
            });
        });
    }

    // =========================================
    // About Video Speed Settings
    // =========================================
    const aboutVideo = document.getElementById("about-video");
    if (aboutVideo) {
        aboutVideo.playbackRate = 0.5; // Play at half speed as requested
    }

    // =========================================
    // Lenis Smooth Scrolling
    // =========================================
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            lerp: 0.1,
            smoothWheel: true,
            wheelMultiplier: 1.2
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Make anchor links smoothly scroll via Lenis
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                lenis.scrollTo(this.getAttribute('href'));
            });
        });
    }

    // =========================================
    // Navbar Smart Scroll Hide/Show
    // =========================================
    let lastScrollY = window.scrollY;
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // If scrolling down and past the header height (e.g., 80px)
        if (currentScrollY > lastScrollY && currentScrollY > 80) {
            navbar.classList.add('hidden');
        } 
        // If scrolling up
        else if (currentScrollY < lastScrollY) {
            navbar.classList.remove('hidden');
        }
        
        lastScrollY = currentScrollY;
    }, { passive: true });

});
