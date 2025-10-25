function showLogin() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="login-wrapper">
            <div class="login-card">
                <h1 class="login-title">Welcome Back</h1>
                <p class="login-subtitle">Sign in to access your analytics dashboard</p>
                
                <form id="loginForm">
                    <input type="text" id="username" placeholder="Username or Email" 
                           style="width: 100%; padding: 14px 18px; margin-bottom: 16px; border-radius: 12px;" required>
                    
                    <input type="password" id="password" placeholder="Password" 
                           style="width: 100%; padding: 14px 18px; margin-bottom: 24px; border-radius: 12px;" required>
                    
                    <button type="submit" class="btn btn-primary" style="width: 100%;">
                        Sign In
                    </button>
                    
                    <div id="errorMessage" style="display: none; margin-top: 16px; padding: 12px; background: rgba(239, 68, 68, 0.1); color: #ef4444; border-radius: 10px; font-size: 14px; border: 1px solid rgba(239, 68, 68, 0.2);">
                    </div>
                    
                    <div id="loadingMessage" style="display: none; margin-top: 16px; text-align: center; color: #9DFF00; font-size: 14px;">
                        Signing in...
                    </div>
                </form>
            </div>
        </div>
    `;
    
    const form = document.getElementById('loginForm');
    form.addEventListener('submit', handleLogin);
}

async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const errorMsg = document.getElementById('errorMessage');
    const loadingMsg = document.getElementById('loadingMessage');
    const submitBtn = event.target.querySelector('button[type="submit"]');
    
    loadingMsg.style.display = 'block';
    errorMsg.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';
    
    const result = await login(username, password);
    
    if (result.success) {
        navigateTo('/dashboard');
    } else {
        errorMsg.textContent = result.error;
        errorMsg.style.display = 'block';
        loadingMsg.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login';
    }
}