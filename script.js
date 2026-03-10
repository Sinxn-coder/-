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

    /* --- 6. Supabase Admission Form Submission --- */
    const admissionForm = document.getElementById('admissionForm');

    // Supabase Configuration
    const supabaseUrl = 'https://kwrszibirsysedhhfkkq.supabase.co';
    const supabaseKey = 'sb_publishable_UyavIQCoc3VM2Gx6GwwIkA_ebDi47DW';
    const supabase = window.supabase ? window.supabase.createClient(supabaseUrl, supabaseKey) : null;

    if (admissionForm) {
        admissionForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Update button UI to 'Processing'
            const btn = admissionForm.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
            btn.style.opacity = '0.8';
            btn.disabled = true;

            try {
                // Get form data
                const formData = new FormData(admissionForm);
                const submissionData = {
                    student_name: formData.get('Student_Name'),
                    date_of_birth: formData.get('Date_of_Birth'),
                    gender: formData.get('Gender'),
                    program: formData.get('Program'),
                    parent_name: formData.get('Parent_Name'),
                    relationship: formData.get('Relationship'),
                    phone_number: formData.get('Phone_Number'),
                    address: formData.get('Address'),
                    additional_notes: formData.get('Additional_Notes') || ""
                };

                if (!supabase) throw new Error("Supabase SDK not loaded");

                // Save to Supabase
                const { error } = await supabase
                    .from('admissions')
                    .insert([submissionData]);

                if (error) throw error;

                // Success State
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Submitted';
                btn.style.background = 'var(--accent-primary)';

                // Show Success Modal
                const successModal = document.getElementById('successModal');
                if (successModal) {
                    successModal.style.display = "flex";
                    setTimeout(() => successModal.classList.add('active'), 10);
                }

                admissionForm.reset();

            } catch (err) {
                console.error('Submission error:', err);
                alert('Submission failed. Please try again or contact support.');
                btn.innerHTML = originalText;
            } finally {
                btn.style.opacity = '1';
                btn.disabled = false;
            }
        });
    }

    // Global function to close success modal
    window.closeSuccessModal = () => {
        const successModal = document.getElementById('successModal');
        if (successModal) {
            successModal.classList.remove('active');
            setTimeout(() => {
                successModal.style.display = "none";
            }, 300);
        }
    };

    /* --- 6.5. Hidden Admin Dashboard Logic --- */
    const adminLogo = document.querySelector('.nav-logo');
    const adminLoginModal = document.getElementById('adminLoginModal');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminDashboard = document.getElementById('adminDashboard');

    // Secret Trigger: Alt + Double Click Logo
    if (adminLogo) {
        adminLogo.addEventListener('dblclick', (e) => {
            if (e.altKey) {
                if (adminLoginModal) {
                    adminLoginModal.style.display = "flex";
                    setTimeout(() => adminLoginModal.classList.add('active'), 10);
                }
            }
        });
    }

    // Close Admin Modal
    window.closeAdminModal = () => {
        if (adminLoginModal) {
            adminLoginModal.classList.remove('active');
            setTimeout(() => {
                adminLoginModal.style.display = "none";
            }, 300);
        }
    };

    // Logout Admin
    window.logoutAdmin = async () => {
        if (supabase) await supabase.auth.signOut();
        if (adminDashboard) adminDashboard.classList.remove('active');
        document.body.style.overflow = "";
    };

    // Admin Login
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('adminEmail').value;
            const password = document.getElementById('adminPassword').value;
            const btn = adminLoginForm.querySelector('button');
            const originalText = btn.innerHTML;

            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...';

            try {
                if (!supabase) throw new Error("Supabase SDK not loaded");

                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });

                if (error) throw error;

                // Success
                closeAdminModal();
                showAdminDashboard();

            } catch (err) {
                alert("Access Denied: " + err.message);
                btn.innerHTML = originalText;
            }
        });
    }

    async function showAdminDashboard() {
        if (!adminDashboard) return;
        adminDashboard.classList.add('active');
        document.body.style.overflow = "hidden";

        loadAdmissions();
    }

    async function loadAdmissions() {
        const tableContainer = document.getElementById('admissionsList');
        if (!tableContainer) return;

        try {
            const { data, error } = await supabase
                .from('admissions')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data.length === 0) {
                tableContainer.innerHTML = '<div class="text-center" style="padding: 4rem;"><h3>No admissions yet.</h3></div>';
                return;
            }

            let html = `
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Parent/Phone</th>
                            <th>Program</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            data.forEach(item => {
                const date = new Date(item.created_at).toLocaleDateString();
                html += `
                    <tr>
                        <td>
                            <strong>${item.student_name}</strong><br>
                            <small>${item.gender} | DOB: ${item.date_of_birth}</small>
                        </td>
                        <td>
                            ${item.parent_name}<br>
                            <small>${item.phone_number}</small>
                        </td>
                        <td><span class="status-badge">${item.program}</span></td>
                        <td>${date}</td>
                        <td>
                            <button class="btn btn-outline-sm" onclick="alert('Student: ${item.student_name}\\nAddress: ${item.address}\\nNotes: ${item.additional_notes}')">Details</button>
                        </td>
                    </tr>
                `;
            });

            html += `</tbody></table>`;
            tableContainer.innerHTML = html;

        } catch (err) {
            tableContainer.innerHTML = `<div class="text-center" style="padding: 2rem; color: #ef4444;">Error loading data: ${err.message}</div>`;
        }
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
    const heroContainer = document.querySelector('.hero-image-container');
    const heroImages = document.querySelectorAll('.hero-image-container .hero-img');

    if (heroContainer && heroImages.length > 1) {
        let currentIdx = 0;
        let sliderInterval;
        let isRunning = true;

        const startSlider = () => {
            sliderInterval = setInterval(() => {
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

                // Clean up old 'prev' classes after transition
                setTimeout(() => {
                    heroImages.forEach((img, idx) => {
                        if (idx !== currentIdx) img.classList.remove('prev');
                    });
                }, 800);
            }, 4000);
        };

        const stopSlider = () => {
            clearInterval(sliderInterval);
        };

        // Initial start
        startSlider();

        // Toggle on click
        heroContainer.addEventListener('click', () => {
            if (isRunning) {
                stopSlider();
                heroContainer.style.opacity = "0.8"; // Visual feedback for pause
            } else {
                startSlider();
                heroContainer.style.opacity = "1";
            }
            isRunning = !isRunning;
        });
    }

});
