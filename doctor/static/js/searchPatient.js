
let dataTable = '';
document.addEventListener('DOMContentLoaded', () => {
    loadPatientList();

    let searchBar = document.getElementById('txtSearchPatient');
    if (searchBar !== null) searchBar.addEventListener('keyup', function() {
        dataTable.search( this.value ).draw();
    });
});

async function loadPatientList() {
    let accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        window.location.href = "/login/"
        return;
    }
    try {
        const response = await fetch('/patient/api/patient/list/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (response.status === 401) {  // Unauthorized, try refreshing token
            try {
                accessToken = await refreshToken();
                const retryResponse = await fetch('/patient/api/patient/list/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                if (!retryResponse.ok) {
                    throw new Error('Failed to fetch Patients after refreshing token.');
                }
                const data = await retryResponse.json();
                displayPatients(data);
            } catch (refreshError) {
                window.location.href = '/login/';
            }
            return;
        }
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        displayPatients(data);
    } catch (error) {
        showHideMessage('alert-danger', error.message);
    }
}

function displayPatients(patients) {
    let tbody = document.getElementById('patientTableBody');
    tbody.innerHTML = '';
    patients.forEach(patient => {
        let patientRow = document.createElement('tr');
        patientRow.style.cursor = 'pointer';
        const patientName = patient.name +' '+ patient.surname;
        patientRow.setAttribute("onclick", `showMeasurementListByPatient(${patient.id})`);
        patientRow.innerHTML = `
                                <td>Code_${String(patient.internal_code)}</td>
                                <td class="textToBlur">${patientName}</td>
                                <td>${patient.gender}</td>
                                <td class="textToBlur">${patient.telephone !== '' ? patient.telephone : '+39 312 51 07 012'}</td>
                                <td class="textToBlur">${patient.email !== '' ? patient.email : 'test@mail.com'}</td>
                                `;
        tbody.appendChild(patientRow);
    });
    dataTable = new DataTable('#patientTable', {
        layout: {
            topStart: false,
            topEnd: null,
            bottomEnd: {
                paging: {
                    buttons: 3
                }
            }
        }
    });
    let searchQuery = localStorage.getItem('searchQuery');
    if (searchQuery !== null) {
        document.getElementById('txtSearchPatient').value = searchQuery;
        dataTable.search(searchQuery).draw();
        localStorage.removeItem('searchQuery');
    }
}

function showMeasurementListByPatient(pid, pname) {
    const id = pid;
    window.location.href = `/patient/measurement_list/${id}/`;
}

function blurContentOfTable(e) {
    const iconId = e.currentTarget.id;
    let classes = document.getElementsByClassName('textToBlur');
    if (classes.length > 0) {
        if (iconId === 'eyeIconOpen') {
            for (let i = 0; i < classes.length; i++) classes[i].classList.add('textshadow');   
            document.getElementById('eyeIconOpen').style.display = 'none';
            document.getElementById('eyeIconClose').style.display = 'block';
        } else {
            for (let i = 0; i < classes.length; i++) classes[i].classList.remove('textshadow');
            document.getElementById('eyeIconClose').style.display = 'none';
            document.getElementById('eyeIconOpen').style.display = 'block';
    
        }
    }
}