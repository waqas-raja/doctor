document.addEventListener('DOMContentLoaded', () => {
    loadMeasurementDetailByDate();
});

async function loadMeasurementDetailByDate() {

    const csrftoken = getCookie('csrftoken');
    const fields = {
        dt: date,
        patient_id: patient_id
    };
    try {
        const response = await fetch('/patient/api/patient/measurement/detail/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify(fields),
        });
        const data = await response.json();
        if (data.status === "OK") displayRetrievedData(data);
        else showHideMessage('alert-danger', data.message);
    } catch (error) {
        showHideMessage('alert-danger', error.message);
    }

}

function displayRetrievedData(d) {
    const objLen = Object.keys(d).length;
    let div = document.getElementById('measurementDetailSection');
    if (div !== null) div.innerHTML = '';

    Object.keys(d).forEach(function (key) {
        if (key !== 'status' && key !== 'measurement') {
            let col = document.createElement('div');
            col.classList.add('col');
            let card = document.createElement('div');
            card.classList.add('card');
            card.style.border = '1px solid #878787';
            let cardHeader = document.createElement('div');
            cardHeader.classList.add('card-header', 'text-center', 'text-uppercase', 'p-1');
            if (key === 'heg') cardHeader.style.backgroundColor = '#BDD7EE';
            if (key === 'ppg_stress_flow') cardHeader.style.backgroundColor = '#FFE699';
            
            const heading = key.indexOf("_") > 0 ? key.replaceAll("_", " ") : key;
            cardHeader.innerText = heading;
            cardHeader.style.fontWeight = 700;
            let cardBody = document.createElement('div');
            cardBody.classList.add('card-body', 'p-2');
            

            Object.keys(d[key][0]).forEach(function (k) {
                if (k !== 'dt' && k !== 'patient_id') {
                    let justifyContent = document.createElement('div');
                    justifyContent.classList.add('d-flex', 'justify-content-between');
                    let dataKey = document.createElement('span');
                    let dataVal = document.createElement('span');
                    dataKey.classList.add('text-uppercase');
                    dataKey.innerText = k;
                    dataVal.innerText = d[key][0][k];
                    justifyContent.appendChild(dataKey);
                    justifyContent.appendChild(dataVal);
                    cardBody.appendChild(justifyContent);
                }
            })
            card.appendChild(cardHeader);
            card.appendChild(cardBody);
            col.appendChild(card);
            div.appendChild(col);
        }
    });
}