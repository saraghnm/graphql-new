function router() {
  
    const path = window.location.pathname;
    
   
    if (path === '/' || path === '/index.html') {
        showLogin();
    } else if (path === '/dashboard') {
        if (!isLoggedIn()) {
            navigateTo('/');
            return;
        }
        showDashboard();
    } else if (path === '/profile') {
        if (!isLoggedIn()) {
            navigateTo('/');
            return;
        }
        showProfile();
    } else {
        showLogin();
    }
}

function navigateTo(path) {
    window.history.pushState({}, '', path);
    router();
}

function goToLogin() {
    navigateTo('/');
}

function goToDashboard() {
    if (!isLoggedIn()) {
        navigateTo('/');
        return;
    }
    navigateTo('/dashboard');
}

function goToProfile() {
    if (!isLoggedIn()) {
        navigateTo('/');
        return;
    }
    navigateTo('/profile');
}

function handleLogout() {
    logout();
    navigateTo('/');
}

window.addEventListener('popstate', router);
window.addEventListener('DOMContentLoaded', router);