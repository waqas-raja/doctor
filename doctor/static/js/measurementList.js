let dataTable = '';

document.addEventListener('DOMContentLoaded', () => {
    loadPatientMeasurement();
});

async function loadPatientMeasurement() {
    let accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        window.location.href = "/login/"
        return;
    }
    try {
        const response = await fetch(`/patient/api/patient/measurement/list/${parseInt(patient_id)}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        if (response.status === 401) {
            try {
                accessToken = await refreshToken();
                const retryResponse = await fetch(`/patient/api/patient/measurement/list/${parseInt(id)}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                if (!retryResponse.ok) throw new Error('Failed to fetch Measurement after refreshing token.');
                const data = await retryResponse.json();
                displayMeasurement(data.data);
            } catch (refreshError) {
                window.location.href = "/login/";
            }
            return;
        }
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        displayMeasurement(data.data);
    } catch (error) {
        showHideMessage('alert-danger', error.message);
    }
}

function displayMeasurement(data) {
    const contactsDiv = document.getElementById('measurementListTableBody');
    contactsDiv.innerHTML = '';
    if (data.length > 0) {
        data.forEach(measure => {
            let contactCard = document.createElement('tr');
            contactCard.style.cursor = 'pointer';
            contactCard.setAttribute("onclick", `showMeasurementDetail('${measure.dt}', '${measure.patient_id}', event)`);
            contactCard.innerHTML = `
                                    <td>${measure.dt}</td>
                                    <td>${measure.weight}</td>
                                    <td>${measure.height}</td>
                                    `;
                                    // <td><button type="button" class="btn btn-primary" onclick="event.stopPropagation(); editRecord('${measure.dt}', '${measure.patient_id}')">Edit</button><button type="button" class="btn btn-danger" onclick="event.stopPropagation(); deleteRecord('${measure.dt}', '${measure.patient_id}')">Delete</button></td>
            contactsDiv.appendChild(contactCard);
        });
        dataTable = new DataTable('#measurementListTable', {
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
    } else {
        let contactCard = document.createElement('tr');
        contactCard.innerHTML = `<td colspan="5">No measurement found for this patient</td>`;
        contactsDiv.appendChild(contactCard);
    }
}

async function showMeasurementDetail(date, patient_id, e) {
    window.location.href = `/patient/measurement_detail/${patient_id}/${date}/`;
}