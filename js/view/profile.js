async function showProfile() {
    const app = document.getElementById('app');
    const userInfo = await fetchUserInfo();
    const xpTransactions = await fetchUserXP();
    const completedProjects = await fetchCompletedProjects();
    const skillsData = await fetchSkills();
    const recentActivity = await fetchRecentActivity();
    const aggregateStats = await fetchAggregateStats();
    
    if (!userInfo) {
        alert('Failed to load user data');
        return;
    }
    const totalXP = calculateTotalXP(xpTransactions);
    const totalUpKB = (userInfo.totalUp / 1000).toFixed(1);
    const totalDownKB = (userInfo.totalDown / 1000).toFixed(1);
    app.innerHTML = `
        <!-- Sidebar -->
        <div class="sidebar">
            <div class="sidebar-icon" onclick="goToDashboard()">
                <img src="assets/dashboard.png" alt="Dashboard">
            </div>
            <div class="sidebar-icon active">
                <img src="assets/user.png" alt="Profile">
            </div>
            <div class="sidebar-icon logout" onclick="handleLogout()">
                <img src="assets/logout.png" alt="Logout">
            </div>
        </div>
        
        <!-- Main Content -->
        <div class="main-content">
            <div class="top-nav">
                <div class="nav-tabs">
                    <button class="nav-tab" onclick="goToDashboard()">Dashboard</button>
                    <button class="nav-tab active">Profile</button>
                </div>
                <div class="nav-controls">
                    <div class="nav-user">
                        <div class="nav-user-avatar">
                            <img src="assets/user.png" alt="User">
                        </div>
                        <span class="nav-user-name">${userInfo.firstName} ${userInfo.lastName}</span>
                    </div>
                </div>
            </div>
            
            <div class="dashboard-content">
                <!-- Greeting Message -->
                <div style="margin-bottom: 32px;">
                    <h1 style="font-size: 36px; font-weight: 700; color: #ffffff; margin: 0 0 8px 0;">
                        Welcome back, <span style="color: #9DFF00;">${userInfo.firstName}</span>! 👋
                    </h1>
                    <p style="font-size: 16px; color: rgba(255,255,255,0.6); margin: 0;">
                        ${userInfo.login} • ${userInfo.email} • ${userInfo.campus}
                    </p>
                </div>
                
                <div class="card-grid">
                    <div class="dashboard-card">
                        <div class="card-label">Total XP</div>
                        <div class="card-value">${formatXP(totalXP)}</div>
                    </div>
                    <div class="dashboard-card">
                        <div class="card-label">Projects Completed</div>
                        <div class="card-value" style="color: #FFA600;">${completedProjects.length}</div>
                    </div>
                    <div class="dashboard-card">
                        <div class="card-label">Average Grade</div>
                        <div class="card-value" style="color: #9DFF00;">${completedProjects.length > 0 ? (completedProjects.reduce((sum, p) => sum + p.grade, 0) / completedProjects.length).toFixed(2) : '0'}</div>
                    </div>
                </div>
                
                <!-- Comparison Stats Section -->
                <div class="graph-section">
                    <div class="graph-card">
                        <div class="graph-header">
                            <h3 class="graph-title">📈 Performance Comparison</h3>
                        </div>
                        <div style="margin-top: 20px;">
                            ${generateComparisonStats(userInfo, xpTransactions, aggregateStats)}
                        </div>
                    </div>
                </div>
                
                <!-- Skills and Activity Side by Side -->
                <div class="graph-section">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 24px;">
                        <div class="graph-card">
                            <div class="graph-header">
                                <h3 class="graph-title">💡 Skills Breakdown</h3>
                            </div>
                            <div style="margin-top: 20px;">
                                ${generateSkillsBreakdown(skillsData)}
                            </div>
                        </div>
                        
                        <div class="graph-card">
                            <div class="graph-header">
                                <h3 class="graph-title">📅 Recent Activity</h3>
                            </div>
                            <div style="margin-top: 20px;">
                                ${generateRecentActivity(recentActivity)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}