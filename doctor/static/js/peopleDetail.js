let dataTable = '';
document.addEventListener('DOMContentLoaded', () => {
    // loadPatientMeasurement();

    // let searchBar = document.getElementById('txtSearchPatient');
    // if (searchBar !== null) searchBar.addEventListener('keyup', function () {
    //     dataTable.search(this.value).draw();
    // });
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
    const contactsDiv = document.getElementById('patientMeasurementTableBody');
    contactsDiv.innerHTML = '';
    if (data.length > 0) {
        data.forEach(measure => {
            let contactCard = document.createElement('tr');
            contactCard.style.cursor = 'pointer';
            contactCard.setAttribute("onclick", `showMeasurementDetail('${measure.dt}', '${measure.patient_id}', event)`);
            contactCard.innerHTML = `
                                            <td>${measure.dt}</td>
                                            <td>${patient_name}</td>
                                            <td>${measure.weight}</td>
                                            <td>${measure.height}</td>
                                            <td><button type="button" class="btn btn-primary" onclick="event.stopPropagation(); editRecord('${measure.dt}', '${measure.patient_id}')">Edit</button><button type="button" class="btn btn-danger" onclick="event.stopPropagation(); deleteRecord('${measure.dt}', '${measure.patient_id}')">Delete</button></td>
                    `;
            contactsDiv.appendChild(contactCard);
        });
        dataTable = new DataTable('#patientMeasurementTable', {
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

async function showMeasurementDetail(dt, patient_id, e) {
    let tr = e.target.closest('tr');
    let row = dataTable.row(tr);
    if (row.child.isShown()) row.child.hide();
    else {
        const csrftoken = getCookie('csrftoken');
        const fields = {
            dt: dt,
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
            if (data.status === "OK") row.child(format(data)).show();
            else showHideMessage('alert-danger', data.message);
        } catch (error) {
            showHideMessage('alert-danger', error.message);
        }
    }

}

function format(d) {
    const dlen = Object.keys(d).length;
    let div = document.createElement('div');
    div.classList.add('fs-6', 'p-3', 'bg-success-subtle');

    Object.keys(d).forEach(function (key) {
        if (key !== 'status' && key !== 'measurement') {
            let tableTitle = document.createElement('h3');
            tableTitle.classList.add('fs-5');
            tableTitle.innerText = key;
            let table = document.createElement('table');
            table.classList.add('table', 'table-sm', 'fs-6');
            let thead = document.createElement('thead');
            let headrow = document.createElement('tr');

            let tbody = document.createElement('tbody');
            let bodyrow = document.createElement('tr');

            Object.keys(d[key][0]).forEach(function (k) {
                if (k !== 'dt' && k !== 'patient_id') {
                    let th = document.createElement('th');
                    th.innerText = k;
                    headrow.appendChild(th);
                    let td = document.createElement('td');
                    td.innerText = d[key][0][k];
                    bodyrow.appendChild(td);
                }
            })
            thead.appendChild(headrow);
            tbody.appendChild(bodyrow);
            table.appendChild(thead);
            table.appendChild(tbody);
            div.appendChild(tableTitle);
            div.appendChild(table);
        }
    });
    return (div);
}

async function editRecord(dt, patient_id) {
    dtime = dt;
    pid = patient_id;
    editCase = true;
    const csrftoken = getCookie('csrftoken');
    const fields = {
        dt: dt,
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
        if (data.status === "OK") {
            console.log(data);
            // Measurement data
            document.getElementById('txtWeight').value = parseFloat(data.measurement[0].weight);
            document.getElementById('txtHeight').value = parseFloat(data.measurement[0].height);
            // ppg_stress_flow data
            document.getElementById('txtsdnn').value = parseFloat(data.ppg_stress_flow[0].sdnn);
            document.getElementById('txtrmssd').value = parseFloat(data.ppg_stress_flow[0].rmssd);
            document.getElementById('txtcrer').value = parseFloat(data.ppg_stress_flow[0].c_rer);
            document.getElementById('txtthmpw').value = parseFloat(data.ppg_stress_flow[0].thm_pw);
            document.getElementById('txtlf_vlf_le').value = parseFloat(data.ppg_stress_flow[0].lf_vlf_le);
            document.getElementById('txtlf_vlf_ri').value = parseFloat(data.ppg_stress_flow[0].lf_vlf_ri);
            document.getElementById('txtme_hr').value = parseFloat(data.ppg_stress_flow[0].me_hr);
            document.getElementById('txthrv_min').value = parseFloat(data.ppg_stress_flow[0].hrv_min);
            document.getElementById('txthrv_max').value = parseFloat(data.ppg_stress_flow[0].hrv_max);
            // heg data
            document.getElementById('txtrcbo2').value = parseFloat(data.heg[0].rcbo2);
            document.getElementById('txtsd').value = parseFloat(data.heg[0].sd);
            document.getElementById('txtslope').value = parseFloat(data.heg[0].slope);
            document.getElementById('txtcbf_ratio').value = parseFloat(data.heg[0].cbf_ratio);
            // bia_acc_water data
            document.getElementById('txttbw').value = parseFloat(data.bia_acc_water[0].tbw);
            document.getElementById('txtscam_to').value = parseFloat(data.bia_acc_water[0].scam_to);
            document.getElementById('txtecw').value = parseFloat(data.bia_acc_water[0].ecw);
            document.getElementById('txticw').value = parseFloat(data.bia_acc_water[0].icw);
            // bia_acc_soft_tissue_mineral data
            document.getElementById('txttbk').value = parseFloat(data.bia_acc_soft_tissue_mineral[0].tbk);
            document.getElementById('txteck').value = parseFloat(data.bia_acc_soft_tissue_mineral[0].eck);
            document.getElementById('txttbna').value = parseFloat(data.bia_acc_soft_tissue_mineral[0].tbna);
            document.getElementById('txttbcl').value = parseFloat(data.bia_acc_soft_tissue_mineral[0].tbcl);
            document.getElementById('txto_pral').value = parseFloat(data.bia_acc_soft_tissue_mineral[0].o_pral);
            // bia_acc_proteins data
            document.getElementById('txttbprot').value = parseFloat(data.bia_acc_proteins[0].tbprot);
            document.getElementById('txtbcmprot').value = parseFloat(data.bia_acc_proteins[0].bcmprot);
            document.getElementById('txtecfprot').value = parseFloat(data.bia_acc_proteins[0].ecfprot);
            document.getElementById('txtecmprot').value = parseFloat(data.bia_acc_proteins[0].ecmprot);
            document.getElementById('txtle').value = parseFloat(data.bia_acc_proteins[0].le);
            document.getElementById('txtcr_24h').value = parseFloat(data.bia_acc_proteins[0].cr_24h);
            document.getElementById('txtstm').value = parseFloat(data.bia_acc_proteins[0].stm);
            document.getElementById('txtgly_free').value = parseFloat(data.bia_acc_proteins[0].gly_free);
            // bia_acc_bone data
            document.getElementById('txtbo_dens').value = parseFloat(data.bia_acc_bone[0].bo_dens);
            document.getElementById('txtbone').value = parseFloat(data.bia_acc_bone[0].bone);
            document.getElementById('txtt_score').value = parseFloat(data.bia_acc_bone[0].t_score);
            document.getElementById('txtbm').value = parseFloat(data.bia_acc_bone[0].bm);
            document.getElementById('txttbca').value = parseFloat(data.bia_acc_bone[0].tbca);
            document.getElementById('txtbbuffer').value = parseFloat(data.bia_acc_bone[0].bbuffer);
            document.getElementById('txttbmg').value = parseFloat(data.bia_acc_bone[0].tbmg);
            document.getElementById('txttbp').value = parseFloat(data.bia_acc_bone[0].tbp);
            // bia_acc_body_composition data
            document.getElementById('txtffm').value = parseFloat(data.bia_acc_body_composition[0].ffm);
            document.getElementById('txtbrm').value = parseFloat(data.bia_acc_body_composition[0].brm);
            document.getElementById('txtecm').value = parseFloat(data.bia_acc_body_composition[0].ecm);
            document.getElementById('txthpa_axir').value = parseFloat(data.bia_acc_body_composition[0].hpa_axir);
            // bia_acc_active_metabolic_mass data
            document.getElementById('txts_score').value = parseFloat(data.bia_acc_active_metabolic_mass[0].s_score);
            document.getElementById('txtskel_m').value = parseFloat(data.bia_acc_active_metabolic_mass[0].skel_m);
            document.getElementById('txtfm').value = parseFloat(data.bia_acc_active_metabolic_mass[0].fm);
            document.getElementById('txtimat').value = parseFloat(data.bia_acc_active_metabolic_mass[0].imat);
            document.getElementById('txtaat').value = parseFloat(data.bia_acc_active_metabolic_mass[0].aat);
            document.getElementById('txtmm_le').value = parseFloat(data.bia_acc_active_metabolic_mass[0].le);
            document.getElementById('txtgly').value = parseFloat(data.bia_acc_active_metabolic_mass[0].gly);
            document.getElementById('txtvi_org').value = parseFloat(data.bia_acc_active_metabolic_mass[0].vi_org);
            document.getElementById('btnSaveMeasurementDetail').style.display = 'none';
            const btnEdit = document.getElementById('btnEditMeasurementDetail');
            if (btnEdit !== null) {
                btnEdit.style.display = 'block';
            }
            let btnCollapseForm = document.getElementById('btnShowMeasurementForm');
            if (btnCollapseForm !== null && !!btnCollapseForm.classList.contains('collapsed')) btnCollapseForm.click();
        } else showHideMessage('alert-danger', data.message);
    } catch (error) {
        showHideMessage('alert-danger', error.message);
    }
}

async function deleteRecord(dt, id) {
    if (confirm("Are you sure you want to delete all the related measurements?")) {
        const csrftoken = getCookie('csrftoken');
        let messageDiv = document.getElementById('messageDiv');
        messageDiv.innerHTML = '';
        const fields = {
            dt: dt,
            patient_id: id
        };
        try {
            const response = await fetch('/patient/api/patient/delete_measurement/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify(fields),
            });
            const data = await response.json();
            if (data.status === "OK") {
                showHideMessage('alert-success', data.message);
                if (dataTable !== null) dataTable.destroy();
                loadPatientMeasurement();
            } else showHideMessage('alert-danger', data.message);
        } catch (error) {
            showHideMessage('alert-danger', error.message);
        }
    }
}

async function savePatientMeasurementDetail() {
    const patient = pid === '' ? '{{patientDetail.id}}' : pid;
    const dt = dtime === '' ? getFormattedDate() : dtime;
    // Measurement data
    const weight = document.getElementById('txtWeight').value;
    const height = document.getElementById('txtHeight').value;
    // ppg_stress_flow data
    const sdnn = document.getElementById('txtsdnn').value == '' ? 0 : document.getElementById('txtsdnn').value;
    const rmssd = document.getElementById('txtrmssd').value == '' ? 0 : document.getElementById('txtrmssd').value;
    const c_rer = document.getElementById('txtcrer').value == '' ? 0 : document.getElementById('txtcrer').value;
    const thm_pw = document.getElementById('txtthmpw').value == '' ? 0 : document.getElementById('txtthmpw').value;
    const lf_vlf_le = document.getElementById('txtlf_vlf_le').value == '' ? 0 : document.getElementById('txtlf_vlf_le').value;
    const lf_vlf_ri = document.getElementById('txtlf_vlf_ri').value == '' ? 0 : document.getElementById('txtlf_vlf_ri').value;
    const me_hr = document.getElementById('txtme_hr').value == '' ? 0 : document.getElementById('txtme_hr').value;
    const hrv_min = document.getElementById('txthrv_min').value == '' ? 0 : document.getElementById('txthrv_min').value;
    const hrv_max = document.getElementById('txthrv_max').value == '' ? 0 : document.getElementById('txthrv_max').value;
    // heg data
    const rcbo2 = document.getElementById('txtrcbo2').value == '' ? 0 : document.getElementById('txtrcbo2').value;
    const sd = document.getElementById('txtsd').value == '' ? 0 : document.getElementById('txtsd').value;
    const slope = document.getElementById('txtslope').value == '' ? 0 : document.getElementById('txtslope').value;
    const cbf_ratio = document.getElementById('txtcbf_ratio').value == '' ? 0 : document.getElementById('txtcbf_ratio').value;
    // bia_acc_water data
    const tbw = document.getElementById('txttbw').value == '' ? 0 : document.getElementById('txttbw').value;
    const scam_to = document.getElementById('txtscam_to').value == '' ? 0 : document.getElementById('txtscam_to').value;
    const ecw = document.getElementById('txtecw').value == '' ? 0 : document.getElementById('txtecw').value;
    const icw = document.getElementById('txticw').value == '' ? 0 : document.getElementById('txticw').value;
    // bia_acc_soft_tissue_mineral data
    const tbk = document.getElementById('txttbk').value == '' ? 0 : document.getElementById('txttbk').value;
    const eck = document.getElementById('txteck').value == '' ? 0 : document.getElementById('txteck').value;
    const tbna = document.getElementById('txttbna').value == '' ? 0 : document.getElementById('txttbna').value;
    const tbcl = document.getElementById('txttbcl').value == '' ? 0 : document.getElementById('txttbcl').value;
    const o_pral = document.getElementById('txto_pral').value == '' ? 0 : document.getElementById('txto_pral').value;
    // bia_acc_proteins data
    const tbprot = document.getElementById('txttbprot').value == '' ? 0 : document.getElementById('txttbprot').value;
    const bcmprot = document.getElementById('txtbcmprot').value == '' ? 0 : document.getElementById('txtbcmprot').value;
    const ecfprot = document.getElementById('txtecfprot').value == '' ? 0 : document.getElementById('txtecfprot').value;
    const ecmprot = document.getElementById('txtecmprot').value == '' ? 0 : document.getElementById('txtecmprot').value;
    const le = document.getElementById('txtle').value == '' ? 0 : document.getElementById('txtle').value;
    const cr_24h = document.getElementById('txtcr_24h').value == '' ? 0 : document.getElementById('txtcr_24h').value;
    const stm = document.getElementById('txtstm').value == '' ? 0 : document.getElementById('txtstm').value;
    const gly_free = document.getElementById('txtgly_free').value == '' ? 0 : document.getElementById('txtgly_free').value;
    // bia_acc_bone data
    const bo_dens = document.getElementById('txtbo_dens').value == '' ? 0 : document.getElementById('txtbo_dens').value;
    const bone = document.getElementById('txtbone').value == '' ? 0 : document.getElementById('txtbone').value;
    const t_score = document.getElementById('txtt_score').value == '' ? 0 : document.getElementById('txtt_score').value;
    const bm = document.getElementById('txtbm').value == '' ? 0 : document.getElementById('txtbm').value;
    const tbca = document.getElementById('txttbca').value == '' ? 0 : document.getElementById('txttbca').value;
    const bbuffer = document.getElementById('txtbbuffer').value == '' ? 0 : document.getElementById('txtbbuffer').value;
    const tbmg = document.getElementById('txttbmg').value == '' ? 0 : document.getElementById('txttbmg').value;
    const tbp = document.getElementById('txttbp').value == '' ? 0 : document.getElementById('txttbp').value;
    // bia_acc_body_composition data
    const ffm = document.getElementById('txtffm').value == '' ? 0 : document.getElementById('txtffm').value;
    const brm = document.getElementById('txtbrm').value == '' ? 0 : document.getElementById('txtbrm').value;
    const ecm = document.getElementById('txtecm').value == '' ? 0 : document.getElementById('txtecm').value;
    const hpa_axir = document.getElementById('txthpa_axir').value == '' ? 0 : document.getElementById('txthpa_axir').value;
    // bia_acc_active_metabolic_mass data
    const s_score = document.getElementById('txts_score').value == '' ? 0 : document.getElementById('txts_score').value;
    const skel_m = document.getElementById('txtskel_m').value == '' ? 0 : document.getElementById('txtskel_m').value;
    const fm = document.getElementById('txtfm').value == '' ? 0 : document.getElementById('txtfm').value;
    const imat = document.getElementById('txtimat').value == '' ? 0 : document.getElementById('txtimat').value;
    const aat = document.getElementById('txtaat').value == '' ? 0 : document.getElementById('txtaat').value;
    const mm_le = document.getElementById('txtmm_le').value == '' ? 0 : document.getElementById('txtmm_le').value;
    const gly = document.getElementById('txtgly').value == '' ? 0 : document.getElementById('txtgly').value;
    const vi_org = document.getElementById('txtvi_org').value == '' ? 0 : document.getElementById('txtvi_org').value;

    const csrftoken = getCookie('csrftoken');
    let messageDiv = document.getElementById('messageDiv');
    messageDiv.innerHTML = '';
    const formData = {
        patient: parseInt(patient),
        dt: dt,
        weight: parseFloat(weight),
        height: parseFloat(height),
        sdnn: sdnn,
        rmssd: rmssd,
        c_rer: c_rer,
        thm_pw: thm_pw,
        lf_vlf_le: lf_vlf_le,
        lf_vlf_ri: lf_vlf_ri,
        me_hr: me_hr,
        hrv_min: hrv_min,
        hrv_max: hrv_max,
        rcbo2: rcbo2,
        sd: sd,
        slope: slope,
        cbf_ratio: cbf_ratio,
        tbw: tbw,
        scam_to: scam_to,
        ecw: ecw,
        icw: icw,
        tbk: tbk,
        eck: eck,
        tbna: tbna,
        tbcl: tbcl,
        o_pral: o_pral,
        tbprot: tbprot,
        bcmprot: bcmprot,
        ecfprot: ecfprot,
        ecmprot: ecmprot,
        le: le,
        cr_24h: cr_24h,
        stm: stm,
        gly_free: gly_free,
        bo_dens: bo_dens,
        bone: bone,
        t_score: t_score,
        bm: bm,
        tbca: tbca,
        bbuffer: bbuffer,
        tbmg: tbmg,
        tbp: tbp,
        ffm: ffm,
        brm: brm,
        ecm: ecm,
        hpa_axir: hpa_axir,
        s_score: s_score,
        skel_m: skel_m,
        fm: fm,
        imat: imat,
        aat: aat,
        mm_le: mm_le,
        gly: gly,
        vi_org: vi_org,
    };
    try {
        let response = '';
        if (editCase === false) {
            response = await fetch('/patient/api/patient/measurement/create/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify(formData),
            });
        } else {
            response = await fetch('/patient/api/patient/measurement/update/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify(formData),
            });
        }
        const data = await response.json();
        if (data.status === "OK") {
            if (editCase) {
                editCase = false;
                dtime = '';
                let btnEdit = document.getElementById('btnEditMeasurementDetail');
                btnEdit.style.display = 'none';
                document.getElementById('btnSaveMeasurementDetail').style.display = 'block';
            }
            if (dataTable !== null) dataTable.destroy();
            let btn = document.getElementById('btnShowMeasurementForm');
            if (btn !== null) btn.click();
            showHideMessage('alert-success', data.message);
            let elements = document.getElementsByTagName("input");
            for (let i = 0; i < elements.length; i++) {
                if (elements[i].type == "text") {
                    elements[i].value = "";
                }
            }
            loadPatientMeasurement();
        } else showHideMessage('alert-danger', data.message);
    } catch (error) {
        showHideMessage('alert-danger', error.message);
    }
}

function getFormattedDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}