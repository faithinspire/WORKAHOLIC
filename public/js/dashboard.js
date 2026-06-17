// WORKAHOLIC Dashboard Management
// Comprehensive dashboard logic for all sections

const API_BASE = 'http://localhost:5000/api';

// ============================================
// DASHBOARD STATE & INITIALIZATION
// ============================================

let currentUser = null;
let currentSection = 'profile';

function initDashboard() {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!user || !token) {
        window.location.href = '/';
        return;
    }

    currentUser = user;
    renderDashboard();
    setupEventListeners();
}

function renderDashboard() {
    const nav = `
        <nav style="background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1); padding: 15px 30px; display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 24px; font-weight: 900; color: #FF6B35;">WORKAHOLIC</div>
            <div style="display: flex; gap: 30px; align-items: center;">
                <span>Welcome, <strong>${currentUser.fullname}</strong></span>
                <button onclick="handleLogout()" style="background: #FF6B35; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 600;">Logout</button>
            </div>
        </nav>
    `;

    const content = `
        <div style="display: flex; min-height: calc(100vh - 70px);">
            <!-- Sidebar Navigation -->
            <div style="width: 250px; background: #f8f9fa; border-right: 1px solid #e0e0e0; padding: 20px; display: none;" class="sidebar">
                <div onclick="switchSection('profile')" class="nav-item" style="padding: 12px; margin-bottom: 10px; cursor: pointer; border-radius: 6px; background: white; border-left: 4px solid #FF6B35;">
                    <i class="fas fa-user"></i> Profile
                </div>
                <div onclick="switchSection('jobs')" class="nav-item" style="padding: 12px; margin-bottom: 10px; cursor: pointer; border-radius: 6px;">
                    <i class="fas fa-briefcase"></i> Jobs
                </div>
                <div onclick="switchSection('feeds')" class="nav-item" style="padding: 12px; margin-bottom: 10px; cursor: pointer; border-radius: 6px;">
                    <i class="fas fa-feed"></i> Feeds
                </div>
                <div onclick="switchSection('messages')" class="nav-item" style="padding: 12px; margin-bottom: 10px; cursor: pointer; border-radius: 6px;">
                    <i class="fas fa-envelope"></i> Messages
                </div>
                <div onclick="switchSection('settings')" class="nav-item" style="padding: 12px; margin-bottom: 10px; cursor: pointer; border-radius: 6px;">
                    <i class="fas fa-cog"></i> Settings
                </div>
            </div>

            <!-- Main Content -->
            <div style="flex: 1; padding: 30px; overflow-y: auto;">
                <div id="dashboard-content"></div>
            </div>
        </div>

        <!-- Bottom Mobile Navigation -->
        <nav style="display: none; position: fixed; bottom: 0; left: 0; right: 0; background: white; border-top: 1px solid #e0e0e0; padding: 10px 0; z-index: 100;" class="mobile-nav">
            <div style="display: flex; justify-content: space-around; align-items: center;">
                <div onclick="switchSection('profile')" style="flex: 1; padding: 12px; text-align: center; cursor: pointer; color: #999;"><i class="fas fa-user"></i> <div style="font-size: 11px;">Profile</div></div>
                <div onclick="switchSection('jobs')" style="flex: 1; padding: 12px; text-align: center; cursor: pointer; color: #999;"><i class="fas fa-briefcase"></i> <div style="font-size: 11px;">Jobs</div></div>
                <div onclick="switchSection('feeds')" style="flex: 1; padding: 12px; text-align: center; cursor: pointer; color: #999;"><i class="fas fa-feed"></i> <div style="font-size: 11px;">Feeds</div></div>
                <div onclick="switchSection('messages')" style="flex: 1; padding: 12px; text-align: center; cursor: pointer; color: #999;"><i class="fas fa-envelope"></i> <div style="font-size: 11px;">Msgs</div></div>
                <div onclick="switchSection('settings')" style="flex: 1; padding: 12px; text-align: center; cursor: pointer; color: #999;"><i class="fas fa-cog"></i> <div style="font-size: 11px;">Settings</div></div>
            </div>
        </nav>
    `;

    document.body.innerHTML = nav + content;
    switchSection('profile');
}

function switchSection(section) {
    currentSection = section;
    const content = document.getElementById('dashboard-content');

    if (section === 'profile') {
        loadProfileSection();
    } else if (section === 'jobs') {
        loadJobsSection();
    } else if (section === 'feeds') {
        loadFeedsSection();
    } else if (section === 'messages') {
        loadMessagesSection();
    } else if (section === 'settings') {
        loadSettingsSection();
    }
}

// ============================================
// PROFILE SECTION
// ============================================

async function loadProfileSection() {
    const content = document.getElementById('dashboard-content');
    
    content.innerHTML = `
        <h2 style="margin-bottom: 30px;"><i class="fas fa-user-circle"></i> My Profile</h2>
        
        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 30px; max-width: 900px;">
            <!-- Profile Card -->
            <div style="background: white; border-radius: 12px; padding: 30px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                <div style="width: 150px; height: 150px; background: linear-gradient(135deg, #FF6B35, #F7931E); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 60px;">👤</div>
                <h3 style="font-size: 20px; font-weight: 700; margin-bottom: 10px;">${currentUser.fullname}</h3>
                <p style="color: #666; margin-bottom: 15px;">${currentUser.email}</p>
                <div style="display: flex; justify-content: center; gap: 5px; margin-bottom: 20px; color: #FF9800;">
                    ${'⭐'.repeat(Math.floor(currentUser.star_rating || 1))}
                </div>
            </div>

            <!-- Profile Info & Edit -->
            <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                <h4 style="font-size: 16px; font-weight: 700; margin-bottom: 20px;">Profile Information</h4>
                <div style="display: grid; gap: 15px;">
                    <div>
                        <label style="display: block; font-weight: 600; color: #FF6B35; margin-bottom: 5px;">Full Name</label>
                        <input type="text" id="editFullname" value="${currentUser.fullname}" style="width: 100%; padding: 10px; border: 1px solid #e0e0e0; border-radius: 6px;">
                    </div>
                    <div>
                        <label style="display: block; font-weight: 600; color: #FF6B35; margin-bottom: 5px;">Phone</label>
                        <input type="text" id="editPhone" value="${currentUser.phone || ''}" style="width: 100%; padding: 10px; border: 1px solid #e0e0e0; border-radius: 6px;">
                    </div>
                    ${currentUser.role === 'jobseeker' ? `
                        <div>
                            <label style="display: block; font-weight: 600; color: #FF6B35; margin-bottom: 5px;">Subject/Specialty</label>
                            <input type="text" id="editSubject" value="${currentUser.subject || ''}" style="width: 100%; padding: 10px; border: 1px solid #e0e0e0; border-radius: 6px;">
                        </div>
                        <div>
                            <label style="display: block; font-weight: 600; color: #FF6B35; margin-bottom: 5px;">Years of Experience</label>
                            <input type="number" id="editExperience" value="${currentUser.years_experience || 0}" style="width: 100%; padding: 10px; border: 1px solid #e0e0e0; border-radius: 6px;">
                        </div>
                        <div>
                            <label style="display: block; font-weight: 600; color: #FF6B35; margin-bottom: 5px;">Bio</label>
                            <textarea id="editBio" style="width: 100%; padding: 10px; border: 1px solid #e0e0e0; border-radius: 6px; min-height: 100px; font-family: inherit;">${currentUser.bio || ''}</textarea>
                        </div>
                    ` : ''}
                </div>
                
                <div style="margin-top: 20px; display: flex; gap: 10px;">
                    <button onclick="saveProfile()" style="flex: 1; padding: 12px; background: #FF6B35; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Save Changes</button>
                    <button onclick="cancelEdit()" style="flex: 1; padding: 12px; background: #f0f0f0; color: #333; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Cancel</button>
                </div>
                
                <div id="profileMessage" style="margin-top: 15px; padding: 12px; border-radius: 6px; display: none;"></div>
            </div>
        </div>
    `;
}

async function saveProfile() {
    const fullname = document.getElementById('editFullname').value;
    const phone = document.getElementById('editPhone').value;
    
    try {
        const response = await fetch(`${API_BASE}/jobseekers/profile/${currentUser.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                fullname,
                phone,
                subject: document.getElementById('editSubject')?.value,
                years_experience: document.getElementById('editExperience')?.value,
                bio: document.getElementById('editBio')?.value
            })
        });

        const data = await response.json();

        if (response.ok) {
            currentUser.fullname = fullname;
            currentUser.phone = phone;
            localStorage.setItem('user', JSON.stringify(currentUser));
            
            const msg = document.getElementById('profileMessage');
            msg.innerHTML = '<i class="fas fa-check-circle"></i> Profile updated successfully!';
            msg.style.background = '#e8f5e9';
            msg.style.color = '#2e7d32';
            msg.style.display = 'block';
            
            setTimeout(() => {
                loadProfileSection();
            }, 2000);
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        const msg = document.getElementById('profileMessage');
        msg.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + error.message;
        msg.style.background = '#ffebee';
        msg.style.color = '#c62828';
        msg.style.display = 'block';
    }
}

function cancelEdit() {
    loadProfileSection();
}

// ============================================
// JOBS SECTION
// ============================================

async function loadJobsSection() {
    const content = document.getElementById('dashboard-content');
    content.innerHTML = '<h2><i class="fas fa-briefcase"></i> Jobs</h2><p>Loading jobs...</p>';

    try {
        const response = await fetch(`${API_BASE}/jobs`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        const data = await response.json();
        const jobs = data.jobs || [];

        let html = `<h2 style="margin-bottom: 20px;"><i class="fas fa-briefcase"></i> Available Jobs</h2>`;
        html += '<div style="display: grid; gap: 15px;">';

        if (jobs.length === 0) {
            html += '<p style="padding: 20px; text-align: center; background: #f5f5f5; border-radius: 6px;">No jobs available yet</p>';
        } else {
            jobs.forEach(job => {
                html += `
                    <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border-left: 4px solid #FF6B35;">
                        <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 10px;">${job.title}</h3>
                        <p style="color: #666; margin-bottom: 10px;"><i class="fas fa-building"></i> ${job.company_name || 'Company'}</p>
                        <p style="margin-bottom: 10px;">${job.description || 'No description'}</p>
                        <div style="display: flex; gap: 15px; font-size: 13px; color: #999; margin-bottom: 15px;">
                            <span><i class="fas fa-map-marker"></i> ${job.location_state || 'N/A'}</span>
                            <span><i class="fas fa-briefcase"></i> ${job.employment_type || 'N/A'}</span>
                            <span style="color: #FF6B35; font-weight: 600;"><i class="fas fa-money"></i> ${job.salary || 'Negotiable'}</span>
                        </div>
                        <button onclick="applyJob(${job.id})" style="padding: 10px 20px; background: #FF6B35; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Apply Now</button>
                    </div>
                `;
            });
        }

        html += '</div>';
        content.innerHTML = html;
    } catch (error) {
        content.innerHTML = '<p style="color: red;">Error loading jobs: ' + error.message + '</p>';
    }
}

async function applyJob(jobId) {
    try {
        const response = await fetch(`${API_BASE}/jobs/apply/${jobId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ jobSeekerId: currentUser.id })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Application submitted successfully!');
            loadJobsSection();
        } else {
            alert(data.message || 'Error applying for job');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// ============================================
// FEEDS SECTION
// ============================================

async function loadFeedsSection() {
    const content = document.getElementById('dashboard-content');

    let html = `
        <h2 style="margin-bottom: 20px;"><i class="fas fa-feed"></i> Community Feeds</h2>
        
        <!-- Create Post -->
        <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
            <h4 style="font-size: 14px; font-weight: 700; margin-bottom: 15px;">Share Your Thoughts</h4>
            <textarea id="feedContent" placeholder="What's on your mind?" style="width: 100%; padding: 15px; border: 1px solid #e0e0e0; border-radius: 6px; min-height: 100px; font-family: inherit; font-size: 14px;"></textarea>
            <div style="margin-top: 15px; display: flex; gap: 10px;">
                <button onclick="createFeed()" style="flex: 1; padding: 12px; background: #FF6B35; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Post</button>
                <button onclick="document.getElementById('feedContent').value = ''" style="flex: 1; padding: 12px; background: #f0f0f0; color: #333; border: none; border-radius: 6px; cursor: pointer;">Clear</button>
            </div>
        </div>

        <!-- Feeds List -->
        <div id="feedsList" style="display: grid; gap: 20px;"></div>
    `;

    content.innerHTML = html;

    // Load feeds
    loadFeeds();
}

async function loadFeeds() {
    try {
        const response = await fetch(`${API_BASE}/feeds`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        const data = await response.json();
        const feeds = data.feeds || [];

        let html = '';

        if (feeds.length === 0) {
            html = '<p style="padding: 20px; text-align: center; background: #f5f5f5; border-radius: 6px;">No feeds yet. Be the first to share!</p>';
        } else {
            feeds.forEach(feed => {
                html += `
                    <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                        <div style="display: flex; align-items: center; margin-bottom: 15px; gap: 10px;">
                            <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #FF6B35, #F7931E); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                                ${feed.author_name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                                <div style="font-weight: 700;">${feed.author_name || 'User'}</div>
                                <div style="font-size: 12px; color: #999;">${new Date(feed.created_at).toLocaleDateString()}</div>
                            </div>
                        </div>
                        
                        <p style="margin-bottom: 15px; line-height: 1.6;">${feed.content}</p>
                        
                        <div style="display: flex; gap: 20px; font-size: 13px; color: #999; border-top: 1px solid #e0e0e0; padding-top: 15px;">
                            <button onclick="likeFeed(${feed.id})" style="background: none; border: none; cursor: pointer; color: #666; font-size: 13px;"><i class="fas fa-thumbs-up"></i> ${feed.likes_count || 0} Likes</button>
                            <button onclick="showCommentForm(${feed.id})" style="background: none; border: none; cursor: pointer; color: #666; font-size: 13px;"><i class="fas fa-comment"></i> ${feed.comments_count || 0} Comments</button>
                        </div>

                        <div id="comments-${feed.id}" style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e0e0e0; display: none;"></div>
                    </div>
                `;
            });
        }

        document.getElementById('feedsList').innerHTML = html;
    } catch (error) {
        console.error('Error loading feeds:', error);
    }
}

async function createFeed() {
    const content = document.getElementById('feedContent').value;

    if (!content.trim()) {
        alert('Please write something');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/feeds`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ content, user_id: currentUser.id })
        });

        if (response.ok) {
            document.getElementById('feedContent').value = '';
            loadFeeds();
        } else {
            alert('Error posting feed');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function likeFeed(feedId) {
    try {
        const response = await fetch(`${API_BASE}/feeds/${feedId}/like`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (response.ok) {
            loadFeeds();
        }
    } catch (error) {
        console.error('Error liking feed:', error);
    }
}

function showCommentForm(feedId) {
    const container = document.getElementById(`comments-${feedId}`);
    
    if (container.style.display === 'none' || container.style.display === '') {
        container.style.display = 'block';
        
        // Add comment form if not already there
        if (!container.querySelector('textarea')) {
            container.innerHTML = `
                <div style="background: #f5f5f5; padding: 15px; border-radius: 6px;">
                    <textarea id="commentText-${feedId}" placeholder="Write a comment..." style="width: 100%; padding: 10px; border: 1px solid #e0e0e0; border-radius: 6px; min-height: 80px; font-family: inherit; font-size: 13px; resize: vertical; margin-bottom: 10px;"></textarea>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="postComment(${feedId})" style="flex: 1; padding: 10px; background: #FF6B35; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 13px;">Post Comment</button>
                        <button onclick="cancelComment(${feedId})" style="flex: 1; padding: 10px; background: #e0e0e0; color: #333; border: none; border-radius: 6px; cursor: pointer; font-size: 13px;">Cancel</button>
                    </div>
                </div>
                <div id="commentsDisplay-${feedId}" style="margin-top: 10px;"></div>
            `;
            loadFeedComments(feedId);
        }
    } else {
        container.style.display = 'none';
    }
}

function cancelComment(feedId) {
    const container = document.getElementById(`comments-${feedId}`);
    container.style.display = 'none';
}

async function postComment(feedId) {
    const textarea = document.getElementById(`commentText-${feedId}`);
    const comment = textarea.value.trim();

    if (!comment) {
        alert('Please write a comment');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/feeds/${feedId}/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                comment,
                author: currentUser.fullname,
                authorId: currentUser.id
            })
        });

        if (response.ok) {
            textarea.value = '';
            loadFeedComments(feedId);
        } else {
            alert('Error posting comment');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function loadFeedComments(feedId) {
    try {
        const response = await fetch(`${API_BASE}/feeds/${feedId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        const data = await response.json();
        const feed = data.feed;
        const comments = feed.comments || [];
        
        let html = '';
        
        if (comments.length > 0) {
            comments.forEach(comment => {
                html += `
                    <div style="background: white; padding: 10px; margin-bottom: 10px; border-radius: 6px; border-left: 3px solid #FF6B35;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <strong style="color: #333;">${comment.author || 'Anonymous'}</strong>
                            <span style="font-size: 11px; color: #999;">${new Date(comment.created_at).toLocaleDateString()}</span>
                        </div>
                        <p style="margin: 0; font-size: 13px; color: #555;">${comment.comment}</p>
                    </div>
                `;
            });
        } else {
            html = '<p style="font-size: 13px; color: #999; text-align: center;">No comments yet. Be the first!</p>';
        }
        
        const display = document.getElementById(`commentsDisplay-${feedId}`);
        if (display) {
            display.innerHTML = html;
        }
    } catch (error) {
        console.error('Error loading comments:', error);
    }
}

// ============================================
// MESSAGES SECTION
// ============================================

function loadMessagesSection() {
    const content = document.getElementById('dashboard-content');
    content.innerHTML = `
        <h2 style="margin-bottom: 20px;"><i class="fas fa-envelope"></i> Messages</h2>
        <div style="background: white; border-radius: 12px; padding: 30px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
            <p style="color: #999;">Messages feature coming soon</p>
        </div>
    `;
}

// ============================================
// SETTINGS SECTION
// ============================================

function loadSettingsSection() {
    const content = document.getElementById('dashboard-content');
    content.innerHTML = `
        <h2 style="margin-bottom: 20px;"><i class="fas fa-cog"></i> Settings</h2>
        
        <div style="max-width: 600px;">
            <!-- Change Password -->
            <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                <h4 style="font-size: 16px; font-weight: 700; margin-bottom: 20px;">Change Password</h4>
                <div style="display: grid; gap: 15px;">
                    <div>
                        <label style="display: block; font-weight: 600; color: #FF6B35; margin-bottom: 5px;">Current Password</label>
                        <input type="password" id="currentPass" style="width: 100%; padding: 10px; border: 1px solid #e0e0e0; border-radius: 6px;">
                    </div>
                    <div>
                        <label style="display: block; font-weight: 600; color: #FF6B35; margin-bottom: 5px;">New Password</label>
                        <input type="password" id="newPass" style="width: 100%; padding: 10px; border: 1px solid #e0e0e0; border-radius: 6px;">
                    </div>
                    <div>
                        <label style="display: block; font-weight: 600; color: #FF6B35; margin-bottom: 5px;">Confirm Password</label>
                        <input type="password" id="confirmPass" style="width: 100%; padding: 10px; border: 1px solid #e0e0e0; border-radius: 6px;">
                    </div>
                    <button onclick="changePassword()" style="padding: 12px; background: #FF6B35; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Update Password</button>
                </div>
            </div>

            <!-- Danger Zone -->
            <div style="background: #fff3e0; border-radius: 12px; padding: 20px; border: 1px solid #ffe0b2;">
                <h4 style="font-size: 16px; font-weight: 700; margin-bottom: 15px; color: #e65100;">Danger Zone</h4>
                <p style="margin-bottom: 15px; color: #666;">Permanently delete your account and all associated data.</p>
                <button onclick="deleteAccount()" style="padding: 12px 20px; background: #d32f2f; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Delete My Account</button>
            </div>
        </div>
    `;
}

function changePassword() {
    alert('Password change feature coming soon');
}

function deleteAccount() {
    if (confirm('Are you sure? This cannot be undone.')) {
        alert('Account deletion feature coming soon');
    }
}

// ============================================
// LOGOUT
// ============================================

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Setup any global event listeners
}

// Initialize on load
window.addEventListener('load', initDashboard);
