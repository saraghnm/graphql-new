async function showDashboard() {
    const app = document.getElementById('app');
    const userInfo = await fetchUserInfo();
    const xpTransactions = await fetchUserXP();
    const completedProjects = await fetchCompletedProjects();
    const auditTransactions = await fetchAuditTransactions();
    
    if (!userInfo) {
        alert('Failed to load user data');
        return;
    }
    const totalXP = calculateTotalXP(xpTransactions);
    const projectCount = completedProjects.length;
    const auditRatio = userInfo.auditRatio ? userInfo.auditRatio.toFixed(1) : '0';
    
    app.innerHTML = `
        <!-- Sidebar -->
        <div class="sidebar">
            <div class="sidebar-icon active">
                <img src="assets/dashboard.png" alt="Dashboard">
            </div>
            <div class="sidebar-icon" onclick="goToProfile()">
                <img src="assets/user.png" alt="Profile">
            </div>
            <div class="sidebar-icon logout" onclick="handleLogout()">
                <img src="assets/logout.png" alt="Logout">
            </div>
        </div>
        
        <!-- Main Content -->
        <div class="main-content">
            <!-- Top Navigation -->
            <div class="top-nav">
                <div class="nav-tabs">
                    <button class="nav-tab active">Dashboard</button>
                    <button class="nav-tab" onclick="goToProfile()">Profile</button>
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
            
            <!-- Dashboard Content -->
            <div class="dashboard-content">
                <div class="card-grid">
                    <div class="dashboard-card">
                        <div class="card-header">
                            <span class="card-label">Total XP</span>
                        </div>
                        <div class="card-value">${formatXP(totalXP)}</div>
                        <div class="card-stat">
                            <span class="stat-dot green"></span>
                            <span class="stat-text">Active Learning</span>
                        </div>
                    </div>
                    <div class="dashboard-card">
                        <div class="card-header">
                            <span class="card-label">Projects Completed</span>
                        </div>
                        <div class="card-value" style="color: #FFA600;">${projectCount}</div>
                        <div class="card-stat">
                            <span class="stat-dot orange"></span>
                            <span class="stat-text">In Progress</span>
                        </div>
                    </div>
                    <div class="dashboard-card">
                        <div class="card-header">
                            <span class="card-label">Audit Ratio</span>
                        </div>
                        <div class="card-value" style="color: #ffffff;">${auditRatio}</div>
                        <div class="card-stat">
                            <span class="stat-dot white"></span>
                            <span class="stat-text">Balanced</span>
                        </div>
                    </div>
                </div>
                
                <div class="graph-section">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(500px, 1fr)); gap: 24px;">
                        <div class="graph-card">
                            <div class="graph-header">
                                <h3 class="graph-title">XP Progress Over Time</h3>
                            </div>
                            <div id="xpChart">
                                ${generateXPLineChart(xpTransactions)}
                            </div>
                        </div>
                        
                        <div class="graph-card">
                            <div class="graph-header">
                                <h3 class="graph-title">Audits Overview</h3>
                            </div>
                            <div style="margin-top: 20px;">
                                ${generateAuditDonutChart(auditTransactions)}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="graph-section">
                    <div class="graph-card">
                        <div class="graph-header">
                            <h3 class="graph-title">Project Grades Performance</h3>
                        </div>
                        <div style="overflow-x: auto; margin-top: 20px;">
                            ${generateProjectGradesChart(completedProjects)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}