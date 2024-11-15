
document.addEventListener('DOMContentLoaded', () => {
    checkUserStatus();
    activeCurrentLink();

    document.getElementById('btnLogoutLink').addEventListener('click', function () {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login/';
    });
});

function activeCurrentLink() {
    let links = document.getElementById('sidebarLinks');
    links.children[0].classList.add('activeLink');
}

function checkUserStatus() {
    let accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        window.location.href = "/login/";
        return;
    }
}

function showHideMessage(cls = '', msg = '') {
    let messageDiv = document.getElementById('messageDiv');
    messageDiv.classList.add(cls);
    messageDiv.innerText = msg;
    setTimeout(() => {
        messageDiv.classList.remove(cls);
        messageDiv.innerHTML = '';
    }, 3000);
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

async function refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
        throw new Error('No refresh token available.');
    }
    const response = await fetch('/docapp/api/user/auth/refresh/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error('Failed to refresh token. Please log in again.');
    }
    localStorage.setItem('access_token', data.access);
    return data.access;
}