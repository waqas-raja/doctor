let globalEmail = '';
let globalCode = '';
document.addEventListener('DOMContentLoaded', () => {
    const pswRecoverySection = document.getElementById('pswRecoverySection');
    const codeEntrySection = document.getElementById('codeEntrySection');
    const newPswSection = document.getElementById('newPswSection');
    if (pswRecoverySection !== null) pswRecoverySection.style.display = 'none';
    if (codeEntrySection !== null) codeEntrySection.style.display = 'none';
    if (newPswSection !== null) newPswSection.style.display = 'none';
});

document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const email = document.getElementById('txtEmail').value;
    const password = document.getElementById('txtPsw').value;
    const messageDiv = document.getElementById('message');
    try {
        const response = await fetch('/api/user/auth/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            messageDiv.innerHTML = '<div class="alert alert-success">Login successful! Redirecting to dashboard...</div>';
            messageDiv.style.display = 'block';
            setTimeout(() => {
                messageDiv.style.display = 'none';
                window.location.href = '/patient/';
            }, 1500);
        } else {
            let txtEmail = document.getElementById('txtEmail');
            let txtPsw = document.getElementById('txtPsw');
            txtEmail.classList.add('errorBorder');
            txtPsw.classList.add('errorBorder');
            showErrorMessage('EMAIL O PASSWORD NON VALIDI', 'message');
        }
    } catch (error) {
        messageDiv.innerHTML = `<div class="alert alert-danger">An error occurred: ${error.message}</div>`;
    }
});

function showPswRecoveryDiv() {
    const pswRecoverySection = document.getElementById('pswRecoverySection');
    const loginSection = document.getElementById('loginSection');
    if (pswRecoverySection.style.display === 'none') {
        loginSection.style.display = 'none';
        pswRecoverySection.style.display = 'block';
    }
}

document.getElementById('pswRecoveryForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const email = document.getElementById('txtEmailPswRecovery').value;
    const messageDiv = document.getElementById('messagePswRecovery');
    const validRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (validRegex.test(email)) {
        const csrftoken = getCookie('csrftoken');
        try {
            const response = await fetch('/api/user/auth/email/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify({ "email": email }),
            });
            const data = await response.json();
            if (data.status === 'OK') {
                console.log(data.code);
                globalCode = data.code;
                const pswRecoverySection = document.getElementById('pswRecoverySection');
                const codeEntrySection = document.getElementById('codeEntrySection');
                if (codeEntrySection.style.display === 'none') {
                    pswRecoverySection.style.display = 'none';
                    codeEntrySection.style.display = 'block';
                    document.getElementById('txtCode1').focus();
                }
            } else showErrorMessage(data.message, "messagePswRecovery");
        } catch (error) {
            showErrorMessage(error.message, "messagePswRecovery");
        }
    } else showErrorMessage("EMAIL NON VALIDI", "messagePswRecovery");
});

function setFocus(e) {
    if (e.currentTarget.nextElementSibling !== null) e.currentTarget.nextElementSibling.focus();
    else e.currentTarget.blur();
}

document.getElementById('codeEntryForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const c1 = document.getElementById('txtCode1').value;
    const c2 = document.getElementById('txtCode2').value;
    const c3 = document.getElementById('txtCode3').value;
    const c4 = document.getElementById('txtCode4').value;
    const c5 = document.getElementById('txtCode5').value;
    const c6 = document.getElementById('txtCode6').value;
    const objCode = c1 + c2 + c3 + c4 + c5 + c6;
    if (String(globalCode) === objCode) {
        const codeEntrySection = document.getElementById('codeEntrySection');
        const newPswSection = document.getElementById('newPswSection');
        if (newPswSection.style.display === 'none') {
            codeEntrySection.style.display = 'none';
            newPswSection.style.display = 'block';
        }
    } else {
        const msg = `Il codice inserito non è valido. Rimangono ancora 2 
                        tentativi dopo i quali bisognerà richiedere un nuovo 
                        codice`;
        showErrorMessage(msg, "messageCodeEntry")
    }
});
document.getElementById('newPswForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const newPsw = document.getElementById('txtNewPsw').value;
    const newPswConf = document.getElementById('txtConfNewPsw').value;
    if (newPsw !== newPswConf) showErrorMessage(`La password e la password di autenticazione non corrispondono.`, 'messageNewPsw')
    else {
        debugger;
        // section to implement the password reset functionality
    }
});

function showErrorMessage(msg, divId) {
    const messageDiv = document.getElementById(divId);
    messageDiv.classList.add('mt-4');
    messageDiv.innerText = msg;
    messageDiv.style.display = 'block';
    setTimeout(() => {
        messageDiv.innerText = '';
        messageDiv.style.display = 'none';
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