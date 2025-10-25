const API_URL = 'https://learn.reboot01.com/api/auth/signin';

async function login(usernameOrEmail, password) {
    const credentials = btoa(usernameOrEmail + ':' + password);
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + credentials
            }
        });
        if (!response.ok) {
            throw new Error('Invalid username or password');
        }
        const token = await response.json();
       
        localStorage.setItem('jwt_token', token);
        
        return { success: true };
        
    } catch (error) {
        return { success: false, error: error.message };
    }
}

function isLoggedIn() {
    const token = localStorage.getItem('jwt_token');
    return token !== null;
}

function getToken() {
    return localStorage.getItem('jwt_token');
}

function logout() {
    localStorage.removeItem('jwt_token');
    if (typeof clearDataCache === 'function') {
        clearDataCache();
    }
}