document.addEventListener('DOMContentLoaded', () => {
    const pForm = document.getElementById('patientForm')
    if (pForm !== null) {
        pForm.addEventListener('submit', function (event) {
            event.preventDefault();
            savePatient();
        });
    }

    let searchBar = document.getElementById('txtSearchPatient');
    if (searchBar !== null) searchBar.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            if (this.value !== '') window.location.href = '/patient/search_patient/';
            else showHideMessage('alert-danger', 'Inserisci i dati del paziente per effettuare la ricerca');
        } else {
            let searchQueryVar = localStorage.getItem("searchQuery");
            if (searchQueryVar === null) localStorage.setItem("searchQuery", this.value);
            else {
                localStorage.removeItem("searchQuery");
                if (this.value !== '') localStorage.setItem("searchQuery", this.value);
            }
        }
    });

    let btn = document.getElementById('createNewPatient');
    if (btn !== null) btn.addEventListener('click', showModalInDashboardBody);
});

function showModalInDashboardBody() {
    document.querySelector('.genCardBody').appendChild(document.querySelector('.modal-backdrop'));
    document.body.classList.remove("modal-open");
    document.body.style.paddingRight = "";
}

async function savePatient() {
    event.preventDefault();
    const name = document.getElementById('txtName').value;
    const surname = document.getElementById('txtSurname').value;
    const gender = document.getElementById('ddlGender').value;
    const internalCode = document.getElementById('txtInternalCode').value;
    const formData = {
        name: name,
        surname: surname,
        gender: gender,
        internal_code: internalCode,
    };
    try {
        const response = await fetch('/patient/api/patient/create/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (response.ok) {
            const btnCloseModal = document.getElementById('closeModal');
            if (btnCloseModal !== null) btnCloseModal.click();
            document.getElementById('txtName').value = '';
            document.getElementById('txtSurname').value = '';
            document.getElementById('ddlGender').value = '';
            document.getElementById('txtInternalCode').value = '';
            showHideMessage('alert-success', data.message);
        }
        else showHideMessage('alert-success', 'Something went wrong while adding a new patient');
    } catch (error) {
        showHideMessage('alert-danger', error.message);
    }
}