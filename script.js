/* =========================================================================
   St. Zenith Academy - Global Public Sharing Platform
   Interactivity & Animation Scripts
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Navbar Scroll Effect --- */
    const navbar = document.querySelector('.navbar');

    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Check initial state
    handleScroll();

    /* --- 2. Mobile Menu Toggle --- */
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const closeMenuBtn = document.querySelector('.close-menu');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-links a');

    const toggleMobileMenu = () => {
        mobileNavOverlay.classList.toggle('active');
        document.body.style.overflow = mobileNavOverlay.classList.contains('active') ? 'hidden' : '';
    };

    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    closeMenuBtn.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNavOverlay.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    /* --- 3. Scroll Reveal Animations (Intersection Observer) --- */
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    /* --- 4. Smooth Scrolling for Anchor Links (Removed for Multi-page) --- */
    // Removed because navigation is now multi-page, not single-page scroll.

    /* --- 5. Newsletter Form Submission (Mock) --- */
    const subscribeForm = document.getElementById('subscribeForm');

    if (subscribeForm) {
        subscribeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = subscribeForm.querySelector('button');
            const originalText = btn.innerHTML;

            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Subscribing...';
            btn.style.opacity = '0.8';

            // Mock API call
            setTimeout(() => {
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Subscribed!';
                btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                subscribeForm.reset();

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.style.opacity = '1';
                }, 3000);
            }, 1500);
        });
    }

    /* --- 6. WhatsApp Admission Form Submission --- */
    const admissionForm = document.getElementById('admissionForm');

    if (admissionForm) {
        admissionForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form data
            const formData = new FormData(admissionForm);

            // Format WhatsApp Message
            let message = "assalamu alaikum! I would like to submit a new admission application:%0A%0A";

            message += "*-- Student Information --*%0A";
            message += `*Name:* ${formData.get('Student_Name')}%0A`;
            message += `*DOB:* ${formData.get('Date_of_Birth')}%0A`;
            message += `*Gender:* ${formData.get('Gender')}%0A`;
            message += `*Program:* ${formData.get('Program')}%0A%0A`;

            message += "*-- Parent/Guardian Information --*%0A";
            message += `*Parent Name:* ${formData.get('Parent_Name')}%0A`;
            message += `*Relationship:* ${formData.get('Relationship')}%0A`;
            message += `*Phone:* ${formData.get('Phone_Number')}%0A`;
            message += `*Address:* ${formData.get('Address')}%0A%0A`;

            const notes = formData.get('Additional_Notes');
            if (notes && notes.trim() !== "") {
                message += `*Notes:* ${notes}%0A`;
            }

            // Admin Phone Number (Include precise country code format, typical for India is 91)
            // Using 919846170136 as per user's 9846170136 number
            const phoneNumber = "919846170136";
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

            // Update button UI temporarily
            const btn = admissionForm.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Opening WhatsApp...';
            btn.style.opacity = '0.8';

            // Redirect to WhatsApp
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');

                // Reset form and button
                btn.innerHTML = originalText;
                btn.style.opacity = '1';
                admissionForm.reset();
            }, 800);
        });
    }

    /* --- 7. Image Modal Logic (Feed Cards) --- */
    const imageModal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    const modalCaption = document.getElementById('modalCaption');
    const closeModal = document.querySelector('.close-modal');
    const viewButtons = document.querySelectorAll('.feed-card .read-more');

    if (imageModal && viewButtons.length > 0) {
        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();

                // Get the image from the parent card
                const card = btn.closest('.feed-card');
                const cardImg = card.querySelector('.card-image img');
                const cardTitle = card.querySelector('h3').textContent;

                if (cardImg) {
                    imageModal.style.display = "flex";
                    // Small delay for transition
                    setTimeout(() => imageModal.classList.add('active'), 10);
                    modalImg.src = cardImg.src;
                    modalCaption.innerHTML = cardTitle;
                    document.body.style.overflow = "hidden"; // Prevent scroll
                }
            });
        });

        const closeImageModal = () => {
            imageModal.classList.remove('active');
            setTimeout(() => {
                imageModal.style.display = "none";
            }, 300);
            document.body.style.overflow = ""; // Re-enable scroll
        };

        if (closeModal) {
            closeModal.addEventListener('click', closeImageModal);
        }

        // Close on click outside the image
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) {
                closeImageModal();
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === "Escape" && imageModal.classList.contains('active')) {
                closeImageModal();
            }
        });
    }

    /* --- 8. Hero Image Slider (Home Page) --- */
    const heroImages = document.querySelectorAll('.hero-image-container .hero-img');
    if (heroImages.length > 1) {
        let currentIdx = 0;

        setInterval(() => {
            // Mark current as 'prev' and remove 'active'
            const prevImg = heroImages[currentIdx];
            prevImg.classList.remove('active');
            prevImg.classList.add('prev');

            // Increment index
            currentIdx = (currentIdx + 1) % heroImages.length;

            // Mark new as 'active' and remove 'prev'
            const nextImg = heroImages[currentIdx];
            nextImg.classList.remove('prev');
            nextImg.classList.add('active');

            // Clean up old 'prev' classes from others after transition
            setTimeout(() => {
                heroImages.forEach((img, idx) => {
                    if (idx !== currentIdx) {
                        img.classList.remove('prev');
                    }
                });
            }, 800); // Match CSS transition duration
        }, 4000); // 4 seconds
    }

});
