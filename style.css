/* ==========================================================================
   RC Call Elite — frontend behaviour
   Extracted from the original inline <script> blocks in index.html
   (loading screen + legal/info modal handlers). Content is unchanged
   from the source; only the location moved. Backend/API integration
   and analytics live separately in js/backend-integration.js.
   ========================================================================== */

// ---- Loading screen ----
        // ============================================================
        // LOADING SCREEN
        // ============================================================
        window.addEventListener('load', () => {
            const loader = document.getElementById('loader');
            setTimeout(() => {
                loader.classList.add('hidden');
            }, 800);
        });

        // ============================================================
        // CUSTOM CURSOR
        // ============================================================
        (function() {
            const glow = document.getElementById('cursorGlow');
            const dot = document.getElementById('cursorDot');
            if (!glow || !dot) return;

            let mouseX = 0,
                mouseY = 0;
            let glowX = 0,
                glowY = 0;
            let dotX = 0,
                dotY = 0;

            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                dotX = e.clientX;
                dotY = e.clientY;
            });

            // Interactive elements
            const interactives = document.querySelectorAll('a, button, .btn-glow, .btn-outline-glow, .service-card, .project-card, .step-card, .feature-item');
            interactives.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    glow.classList.add('active');
                    dot.classList.add('active');
                });
                el.addEventListener('mouseleave', () => {
                    glow.classList.remove('active');
                    dot.classList.remove('active');
                });
            });

            function animateCursor() {
                glowX += (mouseX - glowX) * 0.12;
                glowY += (mouseY - glowY) * 0.12;
                glow.style.left = glowX + 'px';
                glow.style.top = glowY + 'px';

                dotX += (mouseX - dotX) * 0.25;
                dotY += (mouseY - dotY) * 0.25;
                dot.style.left = dotX + 'px';
                dot.style.top = dotY + 'px';

                requestAnimationFrame(animateCursor);
            }
            animateCursor();
        })();

        // ============================================================
        // GSAP + SCROLLTRIGGER
        // ============================================================
        gsap.registerPlugin(ScrollTrigger);

        document.addEventListener('DOMContentLoaded', function() {

            // ----- Fade-up Observer (fallback + GSAP enhancement) -----
            const fadeElements = document.querySelectorAll('.fade-up');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -20px 0px' });
            fadeElements.forEach(el => observer.observe(el));

            // ----- Stagger Children Observer -----
            const staggerEls = document.querySelectorAll('.stagger-children');
            const staggerObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.10, rootMargin: '0px 0px -30px 0px' });
            staggerEls.forEach(el => staggerObserver.observe(el));

            // ----- Navbar scroll -----
            const nav = document.getElementById('mainNav');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
            });

            // ----- Active nav link -----
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-link');
            window.addEventListener('scroll', () => {
                let current = '';
                sections.forEach(section => {
                    const top = section.offsetTop - 130;
                    if (window.scrollY >= top) {
                        current = section.getAttribute('id');
                    }
                });
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + current) {
                        link.classList.add('active');
                    }
                });
            });

            // ----- GSAP Hero Animations -----
            const heroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });
            heroTL
                .from('.hero h1 .gradient-text, .hero h1 .gradient-text-pink', {
                    opacity: 0,
                    y: 40,
                    stagger: 0.15,
                    duration: 1.0
                })
                .from('.hero p', { opacity: 0, y: 30, duration: 0.8 }, '-=0.4')
                .from('.hero .hero-tags span', { opacity: 0, y: 20, stagger: 0.08, duration: 0.6 }, '-=0.3')
                .from('.hero .btn-group-hero a', { opacity: 0, y: 20, stagger: 0.10, duration: 0.6 }, '-=0.3')
                .from('.hero-badge', { opacity: 0, y: 20, duration: 0.6 }, '-=0.8');

            // ----- Floating shapes parallax (mouse) -----
            const shape1 = document.getElementById('shape1');
            const shape2 = document.getElementById('shape2');
            const shape3 = document.getElementById('shape3');

            document.addEventListener('mousemove', (e) => {
                const x = (e.clientX / window.innerWidth - 0.5) * 30;
                const y = (e.clientY / window.innerHeight - 0.5) * 30;
                if (shape1) shape1.style.transform = `translate(${x * 0.6}px, ${y * 0.6}px)`;
                if (shape2) shape2.style.transform = `translate(${x * -0.4}px, ${y * 0.5}px)`;
                if (shape3) shape3.style.transform = `translate(${x * 0.3}px, ${y * -0.7}px)`;
            });

            // ----- Floating particles -----
            (function createParticles() {
                const container = document.getElementById('particles');
                if (!container) return;
                const count = 30;
                for (let i = 0; i < count; i++) {
                    const p = document.createElement('div');
                    p.className = 'particle';
                    const size = 4 + Math.random() * 20;
                    p.style.width = size + 'px';
                    p.style.height = size + 'px';
                    p.style.left = Math.random() * 100 + '%';
                    p.style.animationDuration = 15 + Math.random() * 25 + 's';
                    p.style.animationDelay = Math.random() * 20 + 's';
                    p.style.opacity = 0.2 + Math.random() * 0.3;
                    const colors = ['rgba(248, 177, 149, 0.3)', 'rgba(242, 139, 130, 0.25)', 'rgba(248, 177, 149, 0.20)'];
                    p.style.background = `radial-gradient(circle, ${colors[i % colors.length]}, transparent 70%)`;
                    container.appendChild(p);
                }
            })();

            // ----- Counter animation (GSAP enhanced) -----
            const counters = document.querySelectorAll('.num');
            let countersAnimated = false;

            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !countersAnimated) {
                        countersAnimated = true;
                        counters.forEach(counter => {
                            const target = parseInt(counter.getAttribute('data-count'));
                            let current = 0;
                            const increment = Math.ceil(target / 55);
                            const timer = setInterval(() => {
                                current += increment;
                                if (current >= target) {
                                    counter.textContent = target + (target > 100 ? '+' : '%');
                                    clearInterval(timer);
                                } else {
                                    counter.textContent = current;
                                }
                            }, 28);
                        });
                    }
                });
            }, { threshold: 0.4 });

            const aboutCounter = document.querySelector('#about .counter-wrap');
            if (aboutCounter) counterObserver.observe(aboutCounter);

            // ----- Swiper -----
            new Swiper('.testimonialSwiper', {
                slidesPerView: 1,
                spaceBetween: 24,
                loop: true,
                autoplay: { delay: 4800, disableOnInteraction: false },
                pagination: { el: '.swiper-pagination', clickable: true },
                navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
                breakpoints: {
                    768: { slidesPerView: 2 },
                    992: { slidesPerView: 2 },
                    1200: { slidesPerView: 3 }
                }
            });

            // ----- Smooth nav scroll -----
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        const menu = document.getElementById('navMenu');
                        if (menu && menu.classList.contains('show')) {
                            menu.classList.remove('show');
                        }
                    }
                });
            });

            // ----- Hero badge pulse (CSS handles it) -----

            console.log('🚀 RC Call Elite — Premium Redesign');
        });

// ---- Terms modal ----
        (function() {
            const overlay = document.getElementById('termsModalOverlay');
            const modal = document.getElementById('termsModal');
            const closeBtn = document.getElementById('termsModalClose');
            const openLinks = [
                document.getElementById('openTermsModalLink'),
                document.getElementById('openTermsModalLinkBottom')
            ].filter(Boolean);

            if (!overlay || !modal || openLinks.length === 0) return;

            let lastFocusedEl = null;

            function openTermsModal(e) {
                if (e) e.preventDefault();
                lastFocusedEl = document.activeElement;
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
                if (closeBtn) closeBtn.focus();
            }

            function closeTermsModal() {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
                if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
                    lastFocusedEl.focus();
                }
            }

            openLinks.forEach(function(link) {
                link.addEventListener('click', openTermsModal);
            });

            if (closeBtn) {
                closeBtn.addEventListener('click', closeTermsModal);
            }

            // Click outside modal closes it
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) {
                    closeTermsModal();
                }
            });

            // ESC key closes modal
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && overlay.classList.contains('active')) {
                    closeTermsModal();
                }
            });
        })();

// ---- FAQ modal ----
        (function() {
            const overlay = document.getElementById('faqModalOverlay');
            const modal = document.getElementById('faqModal');
            const closeBtn = document.getElementById('faqModalClose');
            const openLinks = [
                document.getElementById('openFaqModalLink'),
                document.getElementById('openFaqModalLinkBottom')
            ].filter(Boolean);

            if (!overlay || !modal || openLinks.length === 0) return;

            let lastFocusedEl = null;

            function openFaqModal(e) {
                if (e) e.preventDefault();
                lastFocusedEl = document.activeElement;
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
                if (closeBtn) closeBtn.focus();
            }

            function closeFaqModal() {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
                if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
                    lastFocusedEl.focus();
                }
            }

            openLinks.forEach(function(link) {
                link.addEventListener('click', openFaqModal);
            });

            if (closeBtn) {
                closeBtn.addEventListener('click', closeFaqModal);
            }

            // Click outside modal closes it
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) {
                    closeFaqModal();
                }
            });

            // ESC key closes modal
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && overlay.classList.contains('active')) {
                    closeFaqModal();
                }
            });
        })();

// ---- Disclaimer modal ----
        (function() {
            const overlay = document.getElementById('disclaimerModalOverlay');
            const modal = document.getElementById('disclaimerModal');
            const closeBtn = document.getElementById('disclaimerModalClose');
            const openLinks = [
                document.getElementById('openDisclaimerModalLink'),
                document.getElementById('openDisclaimerModalLinkBottom')
            ].filter(Boolean);

            if (!overlay || !modal || openLinks.length === 0) return;

            let lastFocusedEl = null;

            function openDisclaimerModal(e) {
                if (e) e.preventDefault();
                lastFocusedEl = document.activeElement;
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
                if (closeBtn) closeBtn.focus();
            }

            function closeDisclaimerModal() {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
                if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
                    lastFocusedEl.focus();
                }
            }

            openLinks.forEach(function(link) {
                link.addEventListener('click', openDisclaimerModal);
            });

            if (closeBtn) {
                closeBtn.addEventListener('click', closeDisclaimerModal);
            }

            // Click outside modal closes it
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) {
                    closeDisclaimerModal();
                }
            });

            // ESC key closes modal
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && overlay.classList.contains('active')) {
                    closeDisclaimerModal();
                }
            });
        })();

// ---- Privacy modal ----
        (function() {
            const overlay = document.getElementById('privacyModalOverlay');
            const modal = document.getElementById('privacyModal');
            const closeBtn = document.getElementById('privacyModalClose');
            const openLinks = [
                document.getElementById('openPrivacyModalLink'),
                document.getElementById('openPrivacyModalLinkBottom')
            ].filter(Boolean);

            if (!overlay || !modal || openLinks.length === 0) return;

            let lastFocusedEl = null;

            function openPrivacyModal(e) {
                if (e) e.preventDefault();
                lastFocusedEl = document.activeElement;
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
                if (closeBtn) closeBtn.focus();
            }

            function closePrivacyModal() {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
                if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
                    lastFocusedEl.focus();
                }
            }

            openLinks.forEach(function(link) {
                link.addEventListener('click', openPrivacyModal);
            });

            if (closeBtn) {
                closeBtn.addEventListener('click', closePrivacyModal);
            }

            // Click outside modal closes it
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) {
                    closePrivacyModal();
                }
            });

            // ESC key closes modal
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && overlay.classList.contains('active')) {
                    closePrivacyModal();
                }
            });
        })();
