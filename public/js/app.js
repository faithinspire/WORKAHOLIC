// WORKAHOLIC Frontend Application
// Backend API Integration

const API_BASE_URL = 'http://localhost:5000/api';

// Sample data for when API is unavailable
const sampleTeachers = [
    {
        id: 1,
        name: 'Dr. Chioma Okonkwo',
        title: 'Senior Lecturer',
        subject: 'Mathematics',
        rating: 4.8,
        experience: '8 years',
        state: 'Lagos',
        avatar: '👨‍🏫',
        email: 'chioma@workaholic.com',
        phone: '08012345678',
        education_level: 'PhD'
    },
    {
        id: 2,
        name: 'Mr. Tunde Adeyemi',
        title: 'English Teacher',
        subject: 'English Language',
        rating: 4.6,
        experience: '6 years',
        state: 'Oyo',
        avatar: '👨‍🏫',
        email: 'tunde@workaholic.com',
        phone: '08087654321',
        education_level: 'Master\'s'
    },
    {
        id: 3,
        name: 'Mrs. Zainab Hassan',
        title: 'Biology Lecturer',
        subject: 'Biology',
        rating: 4.9,
        experience: '5 years',
        state: 'Abuja',
        avatar: '👩‍🏫',
        email: 'zainab@workaholic.com',
        phone: '08134567890',
        education_level: 'Master\'s'
    },
    {
        id: 4,
        name: 'Prof. Seun Oladele',
        title: 'Physics Professor',
        subject: 'Physics',
        rating: 5.0,
        experience: '12 years',
        state: 'Ibadan',
        avatar: '👨‍🏫',
        email: 'seun@workaholic.com',
        phone: '08145678901',
        education_level: 'PhD'
    },
    {
        id: 5,
        name: 'Miss Blessing Eze',
        title: 'Chemistry Teacher',
        subject: 'Chemistry',
        rating: 4.7,
        experience: '4 years',
        state: 'Enugu',
        avatar: '👩‍🏫',
        email: 'blessing@workaholic.com',
        phone: '08156789012',
        education_level: 'Bachelor\'s'
    }
];

// ============================================
// API HELPER FUNCTIONS
// ============================================

async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        
        if (!response.ok && response.status !== 404) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

// ============================================
// AUTHENTICATION
// ============================================

async function handleSignup(e) {
    e.preventDefault();
    const signupBtn = document.getElementById('signupBtn');
    signupBtn.disabled = true;
    signupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';

    const role = document.getElementById('signupRole').value;
    const fullname = document.getElementById('signupFullname').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;

    const userData = { email, password, role, fullname, phone };

    if (role === 'jobseeker') {
        userData.education_level = document.getElementById('signupEducationLevel').value;
        userData.subject = document.getElementById('signupSubject').value;
        userData.job_type = document.getElementById('signupJobType').value;
        userData.years_experience = parseInt(document.getElementById('signupExperience').value) || 0;
        userData.state = document.getElementById('signupState').value;
    } else {
        userData.company_name = document.getElementById('signupCompanyName').value;
        userData.institution_type = document.getElementById('signupInstitutionType').value;
        userData.state = document.getElementById('recruiterState').value;
    }

    try {
        const response = await apiCall('/auth/signup', 'POST', userData);

        if (response && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            
            closeSignupModal();
            document.getElementById('signupForm').reset();
            showDashboard(response.user);
            
            showNotification('Welcome!', `Account created successfully for ${response.user.fullname}`);
        } else {
            showError('signupError', response?.message || 'Signup failed. Please try again.');
        }
    } catch (error) {
        showError('signupError', 'Connection error. Please check your internet and try again.');
    } finally {
        signupBtn.disabled = false;
        signupBtn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const loginBtn = document.querySelector('#loginModal .btn-submit');
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';

    try {
        const response = await apiCall('/auth/login', 'POST', { email, password });

        if (response && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            
            closeLoginModal();
            document.getElementById('loginForm').reset();
            showDashboard(response.user);
            
            showNotification('Welcome Back!', `Hello ${response.user.fullname}`);
        } else {
            showError('loginError', response?.message || 'Login failed. Please try again.');
        }
    } catch (error) {
        showError('loginError', 'Connection error. Please check your internet and try again.');
    } finally {
        loginBtn.disabled = false;
        loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
    }
}

// ============================================
// DATA LOADING FUNCTIONS
// ============================================

async function loadTeachers() {
    try {
        const response = await apiCall('/jobseekers');
        
        if (response && response.data && Array.isArray(response.data)) {
            const teachers = response.data.map(teacher => ({
                id: teacher.id,
                user_id: teacher.user_id,
                name: teacher.fullname,
                title: `${teacher.education_level || 'Teacher'}`,
                subject: teacher.subject,
                rating: teacher.star_rating || 3.5,
                experience: `${teacher.years_experience || 0} years`,
                state: teacher.state,
                avatar: '👨‍🏫',
                email: teacher.email,
                phone: teacher.phone
            }));
            
            renderTeachers(teachers);
            return teachers;
        } else {
            console.log('No teachers data from API, using defaults');
            loadSampleTeachers();
        }
    } catch (error) {
        console.log('Using sample teachers data');
        loadSampleTeachers();
    }
}

function loadSampleTeachers() {
    const teachers = [
        {
            id: 1,
            name: 'Chioma Okonkwo',
            title: 'Secondary School Teacher',
            subject: 'Mathematics',
            rating: 4.8,
            experience: '5 years',
            state: 'Lagos',
            avatar: '👩‍🏫'
        },
        {
            id: 2,
            name: 'Tunde Adebayo',
            title: 'University Lecturer',
            subject: 'Physics',
            rating: 4.9,
            experience: '10 years',
            state: 'Oyo',
            avatar: '👨‍🏫'
        },
        {
            id: 3,
            name: 'Aisha Mohammed',
            title: 'Primary School Teacher',
            subject: 'English Language',
            rating: 4.7,
            experience: '3 years',
            state: 'Rivers',
            avatar: '👩‍🏫'
        },
        {
            id: 4,
            name: 'Emeka Eze',
            title: 'Polytechnic Lecturer',
            subject: 'Computer Science',
            rating: 4.6,
            experience: '7 years',
            state: 'Delta',
            avatar: '👨‍🏫'
        }
    ];
    
    renderTeachers(teachers);
}

async function loadJobs() {
    try {
        const response = await apiCall('/jobs');
        
        if (response && response.data && Array.isArray(response.data)) {
            const jobs = response.data.map(job => ({
                id: job.id,
                title: job.title,
                company: job.company_name || 'Verified Company',
                salary: job.salary_range || '₦100K - ₦200K',
                type: job.employment_type,
                subject: job.subject || 'General'
            }));
            
            renderJobs(jobs);
            return jobs;
        } else {
            loadSampleJobs();
        }
    } catch (error) {
        console.log('Using sample jobs data');
        loadSampleJobs();
    }
}

function loadSampleJobs() {
    const jobs = [
        {
            id: 1,
            title: 'Mathematics Teacher',
            company: 'Lagos Excellence School',
            salary: '₦150K - ₦200K',
            type: 'Full-time',
            subject: 'Mathematics'
        },
        {
            id: 2,
            title: 'Online English Tutor',
            company: 'Global Learning Academy',
            salary: '₦100K - ₦150K',
            type: 'Online',
            subject: 'English'
        },
        {
            id: 3,
            title: 'Physics Lecturer',
            company: 'Federal Polytechnic',
            salary: '₦200K - ₦300K',
            type: 'Full-time',
            subject: 'Physics'
        }
    ];
    
    renderJobs(jobs);
}

async function loadFeeds() {
    try {
        const response = await apiCall('/feeds');
        
        if (response && response.data && Array.isArray(response.data)) {
            const feeds = response.data.map(feed => ({
                author: feed.author_name || 'WORKAHOLIC User',
                title: feed.title,
                content: feed.content,
                likes: feed.likes || 0,
                comments: feed.comments_count || 0,
                shares: feed.shares || 0
            }));
            
            renderFeeds(feeds);
            return feeds;
        } else {
            loadSampleFeeds();
        }
    } catch (error) {
        console.log('Using sample feeds data');
        loadSampleFeeds();
    }
}

function loadSampleFeeds() {
    const feeds = [
        {
            author: 'Dr. John Smith',
            title: '5 Tips for Effective Online Teaching',
            content: 'In today\'s digital age, online teaching has become essential. Here are my top 5 tips for making your virtual classroom more engaging...',
            likes: 234,
            comments: 45,
            shares: 12
        },
        {
            author: 'Prof. Mary Johnson',
            title: 'New Job: Senior Mathematics Lecturer',
            content: 'We are hiring experienced Mathematics lecturers. Competitive salary and benefits. Apply now!',
            likes: 156,
            comments: 28,
            shares: 8
        }
    ];
    
    renderFeeds(feeds);
}

// ============================================
// RENDER FUNCTIONS
// ============================================

function renderTeachers(teachers) {
    const html = teachers.map(teacher => `
        <div class="teacher-card">
            <div class="teacher-image">
                <div class="teacher-image-placeholder">${teacher.avatar}</div>
            </div>
            <div class="teacher-info">
                <div class="teacher-name">${teacher.name}</div>
                <div class="teacher-title">${teacher.title}</div>
                <div class="teacher-rating">
                    ${'⭐'.repeat(Math.floor(teacher.rating))} <span>(${teacher.rating})</span>
                </div>
                <div class="teacher-tags">
                    <span class="teacher-tag">${teacher.subject}</span>
                    <span class="teacher-tag">${teacher.experience}</span>
                    <span class="teacher-tag">${teacher.state}</span>
                </div>
                <div class="teacher-actions">
                    <button class="view-btn" onclick="showTeacherModal(${teacher.id}, '${teacher.name}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="hire-btn" onclick="hireTeacher(${teacher.id}, '${teacher.name}')">
                        <i class="fas fa-check"></i> Hire
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    const grid = document.getElementById('teachersGrid');
    if (grid) {
        grid.innerHTML = html;
    }
}

function renderJobs(jobs) {
    const html = jobs.map(job => `
        <div class="job-item">
            <div class="job-header">
                <div>
                    <div class="job-title">${job.title}</div>
                    <div class="job-company">${job.company}</div>
                </div>
                <div class="job-salary">${job.salary}</div>
            </div>
            <div class="job-meta">
                <span><i class="fas fa-briefcase"></i> ${job.type}</span>
                <span><i class="fas fa-book"></i> ${job.subject}</span>
            </div>
        </div>
    `).join('');
    
    const list = document.getElementById('jobsList');
    if (list) {
        list.innerHTML = html;
    }
}

function renderFeeds(feeds) {
    const html = feeds.map(feed => `
        <div class="feed-post">
            <div class="feed-header">
                <div class="feed-avatar">${feed.author.charAt(0)}</div>
                <div class="feed-author">
                    <div class="feed-author-name">${feed.author}</div>
                    <div class="feed-time">Recently</div>
                </div>
            </div>
            <div style="margin-bottom: 12px;">
                <div style="font-weight: 700; color: var(--dark); margin-bottom: 8px; font-size: 14px;">${feed.title}</div>
                <div class="feed-content">${feed.content.substring(0, 150)}...</div>
            </div>
            <div class="feed-stats">
                <div class="feed-stat"><i class="fas fa-heart"></i> ${feed.likes}</div>
                <div class="feed-stat"><i class="fas fa-comment"></i> ${feed.comments}</div>
                <div class="feed-stat"><i class="fas fa-share"></i> ${feed.shares}</div>
            </div>
        </div>
    `).join('');
    
    const list = document.getElementById('feedsList');
    if (list) {
        list.innerHTML = html;
    }
}

// ============================================
// UI HELPER FUNCTIONS
// ============================================

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}

function showNotification(title, message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-header">
            <div class="notification-icon">🔔</div>
            <div class="notification-title">${title}</div>
        </div>
        <div class="notification-message">${message}</div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideInUp 0.5s ease-out reverse';
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

function showTeacherModal(teacherId, name) {
    alert(`View profile for ${name}. Detailed profile modal coming soon!`);
}

function hireTeacher(teacherId, name) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role === 'recruiter') {
        showPaymentModal(teacherId, name);
    } else if (!user.id) {
        showError('loginError', 'Please login as a recruiter to hire teachers');
        showLoginModal();
    } else {
        showError('loginError', 'Only recruiters can hire teachers');
    }
}

function showPaymentModal(teacherId, teacherName) {
    const paymentModal = document.createElement('div');
    paymentModal.className = 'modal';
    paymentModal.style.display = 'block';
    paymentModal.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <div class="modal-header">
                <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
                <h2>Confirm Hire: ${teacherName}</h2>
                <p>Complete payment to hire this teacher</p>
            </div>
            <div class="modal-body">
                <div style="background: var(--light); padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
                    <p style="color: #666; margin-bottom: 10px;">First Hire: <strong>FREE</strong></p>
                    <p style="color: var(--primary); font-size: 24px; font-weight: 700;">₦0</p>
                </div>
                <p style="font-size: 13px; color: #666; margin-bottom: 20px; text-align: center;">After your first hire, each subsequent hire requires <strong>₦5,000/month</strong> subscription for unlimited access</p>
                <button class="btn-submit" onclick="completeHire(${teacherId}, '${teacherName}', this.closest('.modal'))">
                    <i class="fas fa-check"></i> Confirm & Hire Now
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(paymentModal);
    paymentModal.onclick = (e) => {
        if (e.target === paymentModal) paymentModal.remove();
    };
}

async function completeHire(teacherId, teacherName, modal) {
    try {
        const response = await apiCall(`/recruiters/hire/${teacherId}`, 'POST', {});
        
        if (response && response.success) {
            showNotification('Hire Successful!', `You have successfully hired ${teacherName}`);
            modal.remove();
        } else {
            showError('loginError', response?.message || 'Hire failed. Please try again.');
        }
    } catch (error) {
        showError('loginError', 'Connection error. Please try again.');
    }
}

// ============================================
// INITIALIZATION
// ============================================

window.addEventListener('load', () => {
    const user = localStorage.getItem('user');
    if (user) {
        showDashboard(JSON.parse(user));
    } else {
        loadTeachers();
        loadFeeds();
        loadJobs();
    }
});

// Search functionality
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('teacherSearch');
    if (searchInput) {
        let debounceTimer;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            const query = e.target.value.toLowerCase();
            
            debounceTimer = setTimeout(async () => {
                if (query.length < 2) {
                    loadTeachers();
                    return;
                }
                
                try {
                    const response = await apiCall(`/jobseekers?search=${query}`);
                    
                    if (response && response.data && Array.isArray(response.data)) {
                        const filtered = response.data.map(teacher => ({
                            id: teacher.id,
                            name: teacher.fullname,
                            title: `${teacher.education_level || 'Teacher'}`,
                            subject: teacher.subject,
                            rating: teacher.star_rating || 3.5,
                            experience: `${teacher.years_experience || 0} years`,
                            state: teacher.state,
                            avatar: '👨‍🏫'
                        }));
                        renderTeachers(filtered);
                    } else {
                        renderTeachers([]);
                    }
                } catch (error) {
                    console.log('Search error', error);
                }
            }, 300);
        });
    }
});

console.log('WORKAHOLIC App initialized. API Base URL:', API_BASE_URL);
