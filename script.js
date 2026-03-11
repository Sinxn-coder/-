/* =========================================================================
   St. Zenith Academy - Global Public Sharing Platform
   Interactivity & Animation Scripts
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* --- 0. Supabase Initialization --- */
    const supabaseUrl = 'https://kwrszibirsysedhhfkkq.supabase.co';
    const supabaseKey = 'sb_publishable_UyavIQCoc3VM2Gx6GwwIkA_ebDi47DW';
    // Use window.supabase as the constructor from the CDN
    const supabase = window.supabase ? window.supabase.createClient(supabaseUrl, supabaseKey) : null;

    /* --- 0.1 Admin Page Initialization & Security --- */
    const adminPage = document.getElementById('adminPage');
    const authLoading = document.getElementById('authLoading');

    async function checkAdminAuth() {
        // Only run if we are on the admin page
        if (!adminPage) return;

        try {
            if (!supabase) throw new Error("Supabase not initialized");

            const { data: { session }, error } = await supabase.auth.getSession();

            if (error || !session) {
                // Not logged in, redirect to home
                window.location.href = 'index.html';
                return;
            }

            // Logged in! Show the dashboard
            if (authLoading) authLoading.style.display = 'none';
            adminPage.style.display = 'flex';
            loadAdmissions();

        } catch (err) {
            console.error("Auth check failed:", err);
            window.location.href = 'index.html';
        }
    }

    // Run auth check early
    checkAdminAuth();

    /* --- 1. Navbar Scroll Effect --- */
    const navbar = document.querySelector('.navbar');

    if (navbar) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    /* --- 2. Mobile Menu Toggle --- */
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const closeMenuBtn = document.querySelector('.close-menu');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-links a');

    if (mobileMenuBtn && mobileNavOverlay) {
        const toggleMobileMenu = () => {
            mobileNavOverlay.classList.toggle('active');
            document.body.style.overflow = mobileNavOverlay.classList.contains('active') ? 'hidden' : '';
        };

        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        if (closeMenuBtn) closeMenuBtn.addEventListener('click', toggleMobileMenu);

        // Close mobile menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileNavOverlay.classList.contains('active')) {
                    toggleMobileMenu();
                }
            });
        });
    }

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
    const adminTriggers = document.querySelectorAll('.admin-trigger');
    const adminLoginModal = document.getElementById('adminLoginModal');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminDashboard = document.getElementById('adminDashboard');

    // Secret Trigger: Alt + Double Click OR Long Press (3s)
    adminTriggers.forEach(trigger => {
        // Method 1: Double Click
        trigger.addEventListener('dblclick', (e) => {
            openAdminModal();
        });

        // Method 2: Long Press (for Mobile & Desktop)
        let pressTimer;
        const startPress = () => {
            pressTimer = setTimeout(openAdminModal, 3000); // 3 seconds
        };
        const endPress = () => {
            clearTimeout(pressTimer);
        };

        trigger.addEventListener('mousedown', startPress);
        trigger.addEventListener('touchstart', (e) => {
            startPress();
        }, { passive: true });

        trigger.addEventListener('mouseup', endPress);
        trigger.addEventListener('mouseleave', endPress);
        trigger.addEventListener('touchend', endPress);
        trigger.addEventListener('touchcancel', endPress);
    });

    function openAdminModal() {
        if (adminLoginModal) {
            adminLoginModal.style.display = "flex";
            setTimeout(() => adminLoginModal.classList.add('active'), 10);
        }
    }

    // Close Admin Modal
    window.closeAdminModal = () => {
        if (adminLoginModal) {
            adminLoginModal.classList.remove('active');
            setTimeout(() => {
                adminLoginModal.style.display = "none";
                // Reset password visibility
                if (adminPasswordInput) adminPasswordInput.setAttribute('type', 'password');
                if (toggleLoginPassword) {
                    toggleLoginPassword.classList.add('fa-eye');
                    toggleLoginPassword.classList.remove('fa-eye-slash');
                }
            }, 300);
        }
    };

    // Logout Admin
    window.logoutAdmin = async () => {
        if (supabase) await supabase.auth.signOut();
        window.location.href = 'index.html';
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
                btn.innerHTML = originalText;
                closeAdminModal();
                // Redirect to the separate admin page
                window.location.href = 'admin.html';

            } catch (err) {
                alert("Access Denied: " + err.message);
                btn.innerHTML = originalText;
            }
        });
    }

    // Login Password Visibility Toggle
    const toggleLoginPassword = document.getElementById('toggleLoginPassword');
    const adminPasswordInput = document.getElementById('adminPassword');

    if (toggleLoginPassword && adminPasswordInput) {
        toggleLoginPassword.addEventListener('click', function () {
            const isPassword = adminPasswordInput.getAttribute('type') === 'password';
            adminPasswordInput.setAttribute('type', isPassword ? 'text' : 'password');
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    // Dashboard Tab Switching
    window.switchAdminTab = (tabName) => {
        // Toggle active tab button
        document.querySelectorAll('.dashboard-tab').forEach(tab => {
            tab.classList.toggle('active', tab.textContent.toLowerCase().includes(tabName));
        });

        // Show selected content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `tab-${tabName}`);
        });

        // Special loading per tab if needed
        if (tabName === 'admissions') loadAdmissions();
        if (tabName === 'events') loadAdminEvents();
    };

    // Add New Event
    const addEventForm = document.getElementById('addEventForm');
    if (addEventForm) {
        addEventForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = addEventForm.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Publishing...';
            btn.disabled = true;

            const formData = new FormData(addEventForm);
            const eventData = {
                title: formData.get('title'),
                date: formData.get('date'),
                time: formData.get('time'),
                location: formData.get('location'),
                description: formData.get('description')
            };

            try {
                const { error } = await supabase.from('events').insert([eventData]);
                if (error) throw error;

                alert("Event published successfully!");
                addEventForm.reset();
                loadAdminEvents(); // Refresh Admin list
            } catch (err) {
                alert("Error publishing event: " + err.message);
            } finally {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
    }

    /* --- 8.5 Admin Event Management Logic --- */
    window.loadAdminEvents = async function () {
        const eventsList = document.getElementById('adminEventsList');
        if (!eventsList) return;

        // Show loading animation immediately
        eventsList.innerHTML = `
            <div class="text-center" style="padding: 2rem;">
                <i class="fa-solid fa-spinner fa-spin fa-2x" style="color: var(--primary);"></i>
                <p style="margin-top: 1rem;">Refreshing events...</p>
            </div>
        `;

        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('date', { ascending: true });

            if (error) throw error;

            if (data.length === 0) {
                eventsList.innerHTML = `
                    <div class="text-center" style="padding: 2rem;">
                        <p>No events found.</p>
                        <button onclick="loadAdminEvents()" class="btn btn-outline-sm" style="margin-top: 1rem;">
                            <i class="fa-solid fa-arrows-rotate"></i> Refresh
                        </button>
                    </div>
                `;
                return;
            }

            let html = '';
            data.forEach(event => {
                const date = new Date(event.date).toLocaleDateString();
                html += `
                    <div class="admin-event-card">
                        <div class="admin-event-info">
                            <h4>${event.title}</h4>
                            <p>${date} | ${event.time}</p>
                            <p>${event.location}</p>
                        </div>
                        <button onclick="deleteEvent(${event.id})" class="delete-event-btn" title="Delete Event">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                `;
            });

            eventsList.innerHTML = html;

        } catch (err) {
            eventsList.innerHTML = `<div class="text-center" style="padding: 2rem; color: #ef4444;">Error: ${err.message}</div>`;
        }
    };

    window.deleteEvent = async (id) => {
        if (!confirm("Are you sure you want to delete this event?")) return;

        try {
            const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', id);

            if (error) throw error;

            loadAdminEvents(); // Refresh list
            if (typeof loadPublicEvents === 'function') loadPublicEvents(); // Refresh public if possible

        } catch (err) {
            alert("Delete failed: " + err.message);
        }
    };

    // Update Admin Password
    const updateProfileForm = document.getElementById('updateProfileForm');
    const toggleCurrentPassword = document.getElementById('toggleCurrentPassword');
    const currentPasswordInput = document.getElementById('currentPassword');
    const toggleNewPassword = document.getElementById('toggleNewPassword');
    const newPasswordInput = document.getElementById('newPassword');

    // Toggle for Current Password
    if (toggleCurrentPassword && currentPasswordInput) {
        toggleCurrentPassword.addEventListener('click', () => {
            const isPassword = currentPasswordInput.getAttribute('type') === 'password';
            currentPasswordInput.setAttribute('type', isPassword ? 'text' : 'password');
            toggleCurrentPassword.classList.toggle('fa-eye');
            toggleCurrentPassword.classList.toggle('fa-eye-slash');
        });
    }

    // Toggle for New Password
    if (toggleNewPassword && newPasswordInput) {
        toggleNewPassword.addEventListener('click', () => {
            const isPassword = newPasswordInput.getAttribute('type') === 'password';
            newPasswordInput.setAttribute('type', isPassword ? 'text' : 'password');
            toggleNewPassword.classList.toggle('fa-eye');
            toggleNewPassword.classList.toggle('fa-eye-slash');
        });
    }

    if (updateProfileForm) {
        updateProfileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const currentPass = document.getElementById('currentPassword').value;
            const newPass = document.getElementById('newPassword').value;
            const confirmPass = document.getElementById('confirmPassword').value;
            const btn = updateProfileForm.querySelector('button');

            if (newPass !== confirmPass) {
                alert("New passwords do not match!");
                return;
            }

            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verifying & Updating...';
            btn.disabled = true;

            try {
                if (!supabase) throw new Error("Supabase not initialized");

                // 1. Get current user's email
                const { data: { user }, error: userError } = await supabase.auth.getUser();
                if (userError || !user) throw new Error("Could not identify current admin.");

                // 2. Re-authenticate to verify current password
                const { error: authError } = await supabase.auth.signInWithPassword({
                    email: user.email,
                    password: currentPass
                });

                if (authError) throw new Error("Incorrect current password.");

                // 3. Update to new password
                const { error: updateError } = await supabase.auth.updateUser({ password: newPass });
                if (updateError) throw updateError;

                alert("Password updated successfully!");
                updateProfileForm.reset();

                // Reset visibility toggles
                [currentPasswordInput, newPasswordInput].forEach(input => {
                    if (input) input.setAttribute('type', 'password');
                });
                [toggleCurrentPassword, toggleNewPassword].forEach(toggle => {
                    if (toggle) {
                        toggle.classList.add('fa-eye');
                        toggle.classList.remove('fa-eye-slash');
                    }
                });

            } catch (err) {
                alert("Security Error: " + err.message);
            } finally {
                btn.innerHTML = "Update Password";
                btn.disabled = false;
            }
        });
    }

    async function showAdminDashboard() {
        if (!adminDashboard) return;
        adminDashboard.classList.add('active');
        document.body.style.overflow = "hidden";

        loadAdmissions();
    }

    window.currentAdmissionFilter = 'all';

    window.loadAdmissions = async function () {
        const tableContainer = document.getElementById('admissionsList');
        const chipsContainer = document.getElementById('admissionChips');
        if (!tableContainer) return;

        // Show loading state
        tableContainer.innerHTML = `
            <div class="text-center" style="padding: 4rem;">
                <i class="fa-solid fa-spinner fa-spin fa-3x" style="color: var(--primary);"></i>
                <p style="margin-top: 1rem; color: var(--text-secondary);">Updating admissions list...</p>
            </div>
        `;

        try {
            const { data, error } = await supabase
                .from('admissions')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Store data globally for modal access and filtering
            window.lastAdmissionsData = data;

            // Define available classes (programs)
            const classes = [
                { id: 'all', label: 'All Students' },
                { id: 'class-1', label: 'Class 1' },
                { id: 'class-2', label: 'Class 2' },
                { id: 'class-3', label: 'Class 3' },
                { id: 'class-4', label: 'Class 4' },
                { id: 'class-5', label: 'Class 5' },
                { id: 'class-6', label: 'Class 6' },
                { id: 'class-7', label: 'Class 7' }
            ];

            // Render Chips
            if (chipsContainer) {
                chipsContainer.innerHTML = classes.map(cls => `
                    <div class="chip ${window.currentAdmissionFilter === cls.id ? 'active' : ''}" 
                         onclick="filterAdmissions('${cls.id}')">
                        ${cls.label}
                    </div>
                `).join('');
            }

            // Initial Filter & Render
            renderAdmissionsTable(window.currentAdmissionFilter);

        } catch (err) {
            tableContainer.innerHTML = `<div class="text-center" style="padding: 4rem; color: #ef4444;">Error: ${err.message}</div>`;
        }
    };

    window.filterAdmissions = function (program) {
        window.currentAdmissionFilter = program;

        // Update active chip UI
        const chips = document.querySelectorAll('#admissionChips .chip');
        const classes = {
            'all': 0, 'class-1': 1, 'class-2': 2, 'class-3': 3,
            'class-4': 4, 'class-5': 5, 'class-6': 6, 'class-7': 7
        };
        const index = classes[program];

        chips.forEach((chip, i) => {
            if (i === index) chip.classList.add('active');
            else chip.classList.remove('active');
        });

        renderAdmissionsTable(program);
    };

    function renderAdmissionsTable(filter) {
        const tableContainer = document.getElementById('admissionsList');
        const data = window.lastAdmissionsData || [];

        // Filter data if not 'all'
        const filteredData = filter === 'all'
            ? data
            : data.filter(item => {
                const itemProgram = (item.program || item.Program || "").toString().toLowerCase();
                return itemProgram === filter.toLowerCase();
            });

        if (filteredData.length === 0) {
            tableContainer.innerHTML = `
                <div class="text-center" style="padding: 4rem;">
                    <i class="fa-solid fa-user-graduate fa-3x" style="color: var(--text-secondary); opacity: 0.3;"></i>
                    <p style="margin-top: 1rem; color: var(--text-secondary);">No admissions found for ${filter === 'all' ? 'any class' : filter.replace('-', ' ')}.</p>
                </div>
            `;
            return;
        }

        let html = `
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Class/Program</th>
                        <th class="hide-mobile">Parent Name</th>
                        <th class="hide-mobile">Phone</th>
                        <th class="hide-mobile">Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
        `;

        filteredData.forEach((item) => {
            const globalIndex = data.indexOf(item);
            const dateStr = new Date(item.created_at).toLocaleDateString();
            const studentName = item.student_name || item.Student_Name || 'Unknown';
            const programName = item.program || item.Program || 'N/A';
            const parentName = item.parent_name || item.Parent_Name || 'N/A';
            const phoneNumber = item.phone_number || item.Phone || 'N/A';
            html += `
                <tr class="admin-row" onclick="openStudentModal(${globalIndex})">
                    <td><strong>${studentName}</strong></td>
                    <td><span class="status-badge">${programName}</span></td>
                    <td class="hide-mobile">${parentName}</td>
                    <td class="hide-mobile">${phoneNumber}</td>
                    <td class="hide-mobile">${dateStr}</td>
                    <td><button class="btn btn-outline-sm">View</button></td>
                </tr>
            `;
        });

        html += `</tbody></table>`;
        tableContainer.innerHTML = html;
    }

    window.openStudentModal = function (index) {
        const item = window.lastAdmissionsData[index];
        const modal = document.getElementById('studentDetailsModal');
        const body = document.getElementById('studentDetailsBody');

        if (!item || !modal || !body) return;

        const studentName = item.student_name || item.Student_Name || 'Unknown';
        const gender = item.gender || item.Gender || 'N/A';
        const dob = item.date_of_birth || item.Date_of_Birth || 'N/A';
        const program = item.program || item.Program || 'N/A';
        const parentName = item.parent_name || item.Parent_Name || 'N/A';
        const phone = item.phone_number || item.Phone || 'N/A';
        const address = item.address || item.Address || 'N/A';
        const notes = item.additional_notes || item.Additional_Notes || 'No extra notes provided.';
        const dateStr = new Date(item.created_at).toLocaleString();

        body.innerHTML = `
            <div class="details-grid">
                <div class="detail-item">
                    <label>Full Student Name</label>
                    <p>${studentName}</p>
                </div>
                <div class="detail-item">
                    <label>Gender & DOB</label>
                    <p>${gender} | ${dob}</p>
                </div>
                <div class="detail-item">
                    <label>Class/Program</label>
                    <p>${program}</p>
                </div>
                <div class="detail-item">
                    <label>Parent/Guardian Name</label>
                    <p>${parentName}</p>
                </div>
                <div class="detail-item">
                    <label>Phone Number</label>
                    <p>${phone}</p>
                </div>
                <div class="detail-item">
                    <label>Address</label>
                    <p>${address}</p>
                </div>
                <div class="detail-item">
                    <label>Additional Notes</label>
                    <p>${notes}</p>
                </div>
                <div class="detail-item">
                    <label>Application Date</label>
                    <p>${dateStr}</p>
                </div>
            </div>
            <div class="modal-footer" style="padding: 1.5rem 2rem; display: flex; gap: 1rem; border-top: 1px solid #f1f5f9; background: #fff;">
                <button onclick="closeStudentModal()" class="p-submit-btn" style="background: var(--text-secondary); flex: 1;">Close</button>
                <a href="tel:${phone}" class="p-submit-btn" style="text-decoration: none; text-align: center; flex: 1;">Call Parent</a>
            </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    window.closeStudentModal = function () {
        const modal = document.getElementById('studentDetailsModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // --- PDF Export Logic ---
    window.openExportModal = function () {
        const modal = document.getElementById('exportModal');
        const list = document.getElementById('exportOptionsList');
        if (!modal || !list) return;

        const classes = [
            { id: 'all', label: 'All Students' },
            { id: 'class-1', label: 'Class 1' },
            { id: 'class-2', label: 'Class 2' },
            { id: 'class-3', label: 'Class 3' },
            { id: 'class-4', label: 'Class 4' },
            { id: 'class-5', label: 'Class 5' },
            { id: 'class-6', label: 'Class 6' },
            { id: 'class-7', label: 'Class 7' }
        ];

        list.innerHTML = classes.map(cls => `
            <div class="export-option" onclick="exportClassData('${cls.id}', '${cls.label}')">
                <span>${cls.label}</span>
                <i class="fa-solid fa-chevron-right"></i>
            </div>
        `).join('');

        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
    };

    window.closeExportModal = function () {
        const modal = document.getElementById('exportModal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.style.display = 'none', 300);
        }
    };

    window.exportClassData = async function (programId, label) {
        const { jsPDF } = window.jspdf;
        const data = window.lastAdmissionsData || [];

        // Filter data
        const filteredData = programId === 'all'
            ? data
            : data.filter(item => {
                const itemProgram = (item.program || item.Program || "").toString().toLowerCase();
                return itemProgram === programId.toLowerCase();
            });

        if (filteredData.length === 0) {
            alert(`No student data found for ${label}`);
            return;
        }

        const doc = new jsPDF();

        // Header Section
        doc.setFontSize(18);
        doc.setTextColor(40);
        doc.text("Al-Bishara Madrassa", 105, 15, { align: 'center' });
        
        doc.setFontSize(14);
        doc.setTextColor(100);
        doc.text(`Student Admission List - ${label}`, 105, 25, { align: 'center' });

        // Table Generation
        const tableColumn = ["Sl No", "Student Name", "Class", "Parent Name", "Phone Number", "Date"];
        const tableRows = [];

        filteredData.forEach((item, index) => {
            const studentData = [
                index + 1,
                item.student_name || item.Student_Name || 'Unknown',
                item.program || item.Program || 'N/A',
                item.parent_name || item.Parent_Name || 'N/A',
                item.phone_number || item.Phone || 'N/A',
                new Date(item.created_at).toLocaleDateString()
            ];
            tableRows.push(studentData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 35,
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
            bodyStyles: { textColor: 50 },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            margin: { top: 35 }
        });

        // Summary
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(`Total Students: ${filteredData.length}`, 14, finalY);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, finalY + 5);

        doc.save(`Admissions_${label.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
        closeExportModal();
    };

    // Close modal on background click
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('studentDetailsModal');
        if (e.target === modal) {
            closeStudentModal();
        }
    });

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

    /* --- 9. Dynamic Events Loading (Public Page) --- */
    async function loadPublicEvents() {
        const eventsContainer = document.getElementById('eventsContainer');
        if (!eventsContainer) return;

        eventsContainer.innerHTML = `
            <div class="text-center" style="grid-column: 1/-1; padding: 4rem;">
                <i class="fa-solid fa-spinner fa-spin fa-2x" style="color: var(--primary);"></i>
                <p style="margin-top: 1rem; color: var(--text-secondary);">Loading events...</p>
            </div>
        `;

        try {
            if (!supabase) return;
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('date', { ascending: true });

            if (error) throw error;

            if (!data || data.length === 0) {
                eventsContainer.innerHTML = `
                    <div class="text-center" style="grid-column: 1/-1; padding: 4rem;">
                        <i class="fa-solid fa-calendar-days fa-3x" style="color: var(--text-secondary); opacity: 0.3;"></i>
                        <p style="margin-top: 1rem; color: var(--text-secondary);">No upcoming events at the moment. Check back soon!</p>
                    </div>
                `;
                return;
            }

            let html = '';
            data.forEach((event, index) => {
                const eventDate = new Date(event.date);
                const day = eventDate.getDate();
                const month = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();
                const gradientClass = (index % 2 === 0) ? 'bg-gradient-1' : 'bg-gradient-2';
                const delay = (index * 0.1).toFixed(1);

                html += `
                    <div class="event-item glass-panel hover-scale" style="transition-delay: ${delay}s">
                        <div class="event-date ${gradientClass}" 
                             style="display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 0.8rem; text-align: center; line-height: 1.2;">
                            <span class="month" style="font-size: 0.7rem;">${month}</span>
                            <span class="day" style="font-size: 1.1rem;">${day}</span>
                        </div>
                        <div class="event-details">
                            <h3>${event.title}</h3>
                            <p class="event-meta">
                                <i class="fa-solid fa-location-dot"></i> ${event.location} 
                                <span class="dot-sep">&middot;</span> 
                                <i class="fa-regular fa-clock"></i> ${event.time}
                            </p>
                            <p class="event-description">${event.description || ''}</p>
                        </div>
                    </div>
                `;
            });

            eventsContainer.innerHTML = html;

        } catch (err) {
            console.error("Error loading events:", err);
            eventsContainer.innerHTML = `
                <div class="text-center" style="grid-column: 1/-1; padding: 2rem; color: #ef4444;">
                    <p>Failed to load events. Please refresh the page.</p>
                </div>
            `;
        }
    }

    // Run dynamic event loader
    loadPublicEvents();

    if (document.getElementById('adminDashboard') && document.getElementById('adminDashboard').classList.contains('active')) {
        loadAdmissions();
    }

});
