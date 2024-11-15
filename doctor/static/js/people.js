
let dataTable = '';
document.addEventListener('DOMContentLoaded', () => {
    loadPatientList();

    const pForm = document.getElementById('patientForm')
    if (pForm !== null) {
        pForm.addEventListener('submit', function (event) {
            event.preventDefault();
            savePatient();
        });
    }

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
        patientRow.setAttribute("onclick", `showPatientDetail(${patient.id})`);
        patientRow.innerHTML = `
                                        <td>Code_${String(patient.internal_code)}</td>
                                        <td class="textToBlur">${patient.name +' '+ patient.surname}</td>
                                        <td>${patient.gender}</td>
                                        <td class="textToBlur">${patient.telephone !== '' ? patient.telephone : '+39 312 51 07 012'}</td>
                                        <td class="textToBlur">${patient.email !== '' ? patient.email : 'test@mail.com'}</td>
                `;
        // patientRow.innerHTML = `
        //                                 <td>${patient.internal_code}</td>
        //                                 <td>${patient.surname +' '+ patient.surname}</td>
        //                                 <td>${patient.gender}</td>
        //                                 <td>123456789</td>
        //                                 <td>${patient.internal_code}</td>
        //                                 <td><button type="button" class="btn btn-primary py-0" onclick="event.stopPropagation(); updatePatient('${patient.id}')">Edit</button>&nbsp;<button type="button" class="btn btn-danger py-0" onclick="event.stopPropagation(); deletePatient('${patient.id}')">Delete</button></td>
        //         `;
        // contactCard.onclick = showPatientDetail();
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
}

function showPatientDetail(pid) {
    const id = pid;
    // window.location.href = "{% url 'PatientDetail' 0 %}".replace('0', id);
    window.location.href = `/patient/patient_detail/${id}/`;
}

function updatePatient(pid) {
    debugger;
    // const csrftoken = getCookie('csrftoken');
    showHideMessage('alert-success', 'Edit is clicked');
}

async function deletePatient(pid) {
    if (confirm("Are you sure you want to delete this patient and all their related measurements?")) {
        const csrftoken = getCookie('csrftoken');
        try {
            const response = await fetch('/patient/api/patient/delete/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify({ patient_id: pid }),
            });
            const data = await response.json();
            if (data.status === "OK") {
                showHideMessage('alert-success', data.message);
                if (!!dataTable) dataTable.destroy();
                loadPatientList();
            } else showHideMessage('alert-danger', data.message);
        } catch (error) {
            showHideMessage('alert-danger', error.message);
        }
    }
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