from django.shortcuts import render
import json
from datetime import datetime
from django.http import JsonResponse
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from .serializers import PatientSerializer, MeasurementSerializer
from rest_framework.permissions import IsAuthenticated  # Adjust permissions as needed
from .models import (
    Patient,
    Measurement,
    PPGStressFlow,
    HEG,
    BiaAccWater,
    BiaAccSoftTissueMineral,
    BiaAccProteins,
    BiaAccBone,
    BiaAccBodyComposition,
    BiaAccActiveMetabolicMass
    )

# Create your views here.
def index(request):
    patient = {"patient":True}
    return render(request, 'dashboard.html', patient)

class PatientCreateView(generics.CreateAPIView):
    """
    API view to create a new Patient.
    Only authenticated users can access this view.
    """
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    # permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # return Response(serializer.errors, status=status.HTTP_201_CREATED)
            patient = serializer.save()
            return Response(
                {
                    "message": "Patient added successfully.",
                    "patient": PatientSerializer(patient).data
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PatientListView(generics.ListAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    # permission_classes = [IsAuthenticated]  # Only authenticated users can view patients

def DeletePatientView(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            patient_id = data.get('patient_id')

            measurements_deleted, _ = Measurement.objects.filter(patient_id=patient_id).delete()
            ppg_stress_flow_deleted, _ = PPGStressFlow.objects.filter(patient_id=patient_id).delete()
            heg_deleted, _ = HEG.objects.filter(patient_id=patient_id).delete()
            bia_acc_water_deleted, _ = BiaAccWater.objects.filter(patient_id=patient_id).delete()
            bia_acc_soft_tissue_mineral_deleted, _ = BiaAccSoftTissueMineral.objects.filter(patient_id=patient_id).delete()
            bia_acc_proteins_deleted, _ = BiaAccProteins.objects.filter(patient_id=patient_id).delete()
            bia_acc_bone_deleted, _ = BiaAccBone.objects.filter(patient_id=patient_id).delete()
            bia_acc_body_composition_deleted, _ = BiaAccBodyComposition.objects.filter(patient_id=patient_id).delete()
            bia_acc_active_metabolic_mass_deleted, _ = BiaAccActiveMetabolicMass.objects.filter(patient_id=patient_id).delete()
            patient = Patient.objects.get(id=patient_id)
            patient.delete()

            total = (measurements_deleted + ppg_stress_flow_deleted + heg_deleted + bia_acc_water_deleted + bia_acc_soft_tissue_mineral_deleted + bia_acc_proteins_deleted + bia_acc_bone_deleted + bia_acc_body_composition_deleted + bia_acc_active_metabolic_mass_deleted)
            return JsonResponse({
                'status': 'OK',
                'message': f'Patient and {total} records deleted successfully!'
            })

        except Patient.DoesNotExist:
            return JsonResponse({'status': 'KO', 'message': 'Patient not found.'})

        except Exception as e:
            return JsonResponse({'status': 'KO', 'message': str(e)})
    return JsonResponse({'status': 'KO', 'message': 'Invalid request method'})

def PatientMeasurementListView(request, patient_id):
    if request.method == "GET":
        try:
            measurements = Measurement.objects.filter(patient_id=patient_id)
            # Create a list of dictionaries to return as JSON
            measurements_list = list(measurements.values(
                'dt', 'patient_id', 'weight', 'height'
            ))
            for item in measurements_list:
                # Convert datetime to string format without 'Z'
                item['dt'] = item['dt'].strftime("%Y-%m-%d %H:%M:%S") 

            return JsonResponse({'status': 'success', 'data': measurements_list})
        except Measurement.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'No measurements found for this patient.'})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})

def PatientDetailView(request, id):
    patientDetail = Patient.objects.get(id=id)
    params = {"patientDetail": patientDetail, "id": id}
    return render(request, 'patient_detail.html', params)

def NewMeasurementWindowView(request):
    return render(request, 'new_measurement_window.html', {"measurement_view": "True"})

def SearchPatientView(request):
    return render(request, 'search_patient.html')

def ShowPatientMeasurementListView(request, id):
    patientDetail = Patient.objects.get(id=id)
    params = {'patient_id': id, 'patient_name': f"{patientDetail.name} {patientDetail.surname}", "measurement_view": "True", "page":"Measurement List"}
    return render(request, 'measurement_list.html', params)

def ShowPatientMeasurementDetailView(request, id, date):
    patientDetail = Patient.objects.get(id=id)
    params = {'patient_id': id,'patient_name': f"{patientDetail.name} {patientDetail.surname}", 'date': date, "measurement_view": "True", "page":"Measurement Detail"}
    return render(request, 'measurement_detail.html', params)

def CreatePatientMeasurement(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            patient = data.get('patient')
            # Collect Measurement Data
            dt_str = data.get('dt')
            dt = datetime.strptime(dt_str, "%Y-%m-%d %H:%M:%S")
            weight = data.get('weight')
            height = data.get('height')

            # Collect ppg_stress_flow Data
            sdnn = data.get('sdnn')
            rmssd = data.get('rmssd')
            c_rer = data.get('c_rer')
            thm_pw = data.get('thm_pw')
            lf_vlf_le = data.get('lf_vlf_le')
            lf_vlf_ri = data.get('lf_vlf_ri')
            me_hr = data.get('me_hr')
            hrv_min = data.get('hrv_min')
            hrv_max = data.get('hrv_max')

            # Collect heg Data
            rcbo2 = data.get('rcbo2')
            sd = data.get('sd')
            slope = data.get('slope')
            cbf_ratio = data.get('cbf_ratio')
            
            # Collect bia_acc_water Data
            tbw = data.get('tbw')
            scam_to = data.get('scam_to')
            ecw = data.get('ecw')
            icw = data.get('icw')

            # Collect bia_acc_soft_tissue_mineral Data
            tbk = data.get('tbk')
            eck = data.get('eck')
            tbna = data.get('tbna')
            tbcl = data.get('tbcl')
            o_pral = data.get('o_pral')

            # Collect bia_acc_proteins Data
            tbprot = data.get('tbprot')
            bcmprot = data.get('bcmprot')
            ecfprot = data.get('ecfprot')
            ecmprot = data.get('ecmprot')
            le = data.get('le')
            cr_24h = data.get('cr_24h')
            stm = data.get('stm')
            gly_free = data.get('gly_free')
            # Collect bia_acc_bone Data
            bo_dens = data.get('bo_dens')
            bone = data.get('bone')
            t_score = data.get('t_score')
            bm = data.get('bm')
            tbca = data.get('tbca')
            bbuffer = data.get('bbuffer')
            tbmg = data.get('tbmg')
            tbp = data.get('tbp')
            # Collect bia_acc_body_composition Data
            ffm = data.get('ffm')
            brm = data.get('brm')
            ecm = data.get('ecm')
            hpa_axir = data.get('hpa_axir')
            # Collect bia_acc_active_metabolic_mass Data
            s_score = data.get('s_score')
            skel_m = data.get('skel_m')
            fm = data.get('fm')
            imat = data.get('imat')
            aat = data.get('aat')
            mmle = data.get('mm_le')
            gly = data.get('gly')
            vi_org = data.get('vi_org')

            measurement = Measurement(
                patient_id=patient,
                dt=dt,
                weight=weight,
                height=height
            )
            measurement.save()

            # Create ppg_stress_flow instance and save the data in db
            ppg_stress_flow = PPGStressFlow(
                patient_id = patient,
                dt = dt,
                sdnn = sdnn,
                rmssd = rmssd,
                c_rer = c_rer,
                thm_pw = thm_pw,
                lf_vlf_le = lf_vlf_le,
                lf_vlf_ri = lf_vlf_ri,
                me_hr = me_hr,
                hrv_min = hrv_min,
                hrv_max = hrv_max
            )
            ppg_stress_flow.save()

            # Create heg instance and save the data in db
            heg = HEG(
                patient_id=patient,
                dt=dt,
                rcbo2=rcbo2,
                sd=sd,
                slope=slope,
                cbf_ratio=cbf_ratio
            )
            heg.save()

            # Create bia_acc_water and save the data in db
            biaAccWater = BiaAccWater(
                patient_id = patient,
                dt = dt,
                tbw = tbw,
                scam_to = scam_to,
                ecw = ecw,
                icw = icw
            )
            biaAccWater.save()
            
            # Create bia_acc_soft_tissue_mineral and save the data in db
            bia_acc_soft_tissue_mineral = BiaAccSoftTissueMineral(
                patient_id = patient,
                dt = dt,
                tbk = tbk,
                eck = eck,
                tbna = tbna, 
                tbcl = tbcl,
                o_pral = o_pral
            )
            bia_acc_soft_tissue_mineral.save()

            # Create bia_acc_proteins and save the data in db
            bia_acc_proteins = BiaAccProteins(
                patient_id = patient,
                dt = dt,
                tbprot = tbprot,
                bcmprot = bcmprot,
                ecfprot = ecfprot,
                ecmprot = ecmprot,
                le = le,
                cr_24h = cr_24h,
                stm = stm,
                gly_free = gly_free
            )
            bia_acc_proteins.save()
            
            # Create bia_acc_bone and save the data in db
            bia_acc_bone = BiaAccBone(
                patient_id = patient,
                dt = dt,
                bo_dens = bo_dens,
                bone = bone,
                t_score = t_score,
                bm = bm,
                tbca = tbca,
                bbuffer = bbuffer,
                tbmg = tbmg,
                tbp = tbp
            )
            bia_acc_bone.save()
            
            # Create bia_acc_body_composition and save the data in db
            bia_acc_body_composition = BiaAccBodyComposition(
                patient_id = patient,
                dt = dt,
                ffm = ffm,
                brm = brm,
                ecm = ecm,
                hpa_axir = hpa_axir
            )
            bia_acc_body_composition.save()
            
            # Create bia_acc_active_metabolic_mass and save the data in db
            bia_acc_active_metabolic_mass = BiaAccActiveMetabolicMass(
                patient_id = patient,
                dt = dt,
                s_score = s_score,
                skel_m = skel_m,
                fm = fm,
                imat = imat,
                aat = aat,
                le = mmle,
                gly = gly,
                vi_org = vi_org
            )
            bia_acc_active_metabolic_mass.save()

            return JsonResponse({'status': 'OK', 'message': 'Measurement has been saved successfully!'})
        except Exception as e:
            return JsonResponse({'status': 'KO', 'message': str(e)})
    return JsonResponse({'status': 'KO', 'message': 'Invalid request method'})

def DeletePatientMeasurement(request):
    if request.method == "POST":
        try:
            # Parse JSON data from request
            data = json.loads(request.body)
            patient_id = data.get('patient_id')
            dt_str = data.get('dt')
            dt = datetime.strptime(dt_str, "%Y-%m-%d %H:%M:%S")
            # record = Measurement.objects.get(patient_id=patient_id, dt=dt)

            # Delete records from PPGStressFlow model
            ppg_records = PPGStressFlow.objects.filter(patient_id=patient_id, dt=dt)
            ppg_deleted, _ = ppg_records.delete()  # Returns the number of deleted objects
            
            heg_records = HEG.objects.filter(patient_id=patient_id, dt=dt)
            heg_deleted, _ = heg_records.delete()
            
            water_records = BiaAccWater.objects.filter(patient_id=patient_id, dt=dt)
            water_deleted, _ = water_records.delete()
            
            mineral_records = BiaAccSoftTissueMineral.objects.filter(patient_id=patient_id, dt=dt)
            mineral_deleted, _ = mineral_records.delete()
            
            protines_records = BiaAccProteins.objects.filter(patient_id=patient_id, dt=dt)
            protines_deleted, _ = protines_records.delete()
            
            bone_records = BiaAccBone.objects.filter(patient_id=patient_id, dt=dt)
            bone_deleted, _ = bone_records.delete()
            
            body_records = BiaAccBodyComposition.objects.filter(patient_id=patient_id, dt=dt)
            body_deleted, _ = body_records.delete()
            
            mass_records = BiaAccActiveMetabolicMass.objects.filter(patient_id=patient_id, dt=dt)
            mass_deleted, _ = mass_records.delete()
            
            measure_records = Measurement.objects.filter(patient_id=patient_id, dt=dt)
            meausre_deleted, _ = measure_records.delete()

            return JsonResponse({
                'status': 'OK',
                'message': f'{ppg_deleted + meausre_deleted} records deleted successfully!'
            })

        except PPGStressFlow.DoesNotExist:
            return JsonResponse({'status': 'KO1', 'message': 'Record not found.'})

        except Exception as e:
            return JsonResponse({'status': 'KO2', 'message': str(e)})

    return JsonResponse({'status': 'KO', 'message': 'Invalid request method'})

def UpdatePatientMeasurement(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            patient_id = data.get('patient')
            # Collect Measurement Data
            dt_str = data.get('dt')
            dt = datetime.strptime(dt_str, "%Y-%m-%d %H:%M:%S")
            weight = data.get('weight')
            height = data.get('height')

            # Collect ppg_stress_flow Data
            sdnn = data.get('sdnn')
            rmssd = data.get('rmssd')
            c_rer = data.get('c_rer')
            thm_pw = data.get('thm_pw')
            lf_vlf_le = data.get('lf_vlf_le')
            lf_vlf_ri = data.get('lf_vlf_ri')
            me_hr = data.get('me_hr')
            hrv_min = data.get('hrv_min')
            hrv_max = data.get('hrv_max')

            # Collect heg Data
            rcbo2 = data.get('rcbo2')
            sd = data.get('sd')
            slope = data.get('slope')
            cbf_ratio = data.get('cbf_ratio')
            
            # Collect bia_acc_water Data
            tbw = data.get('tbw')
            scam_to = data.get('scam_to')
            ecw = data.get('ecw')
            icw = data.get('icw')

            # Collect bia_acc_soft_tissue_mineral Data
            tbk = data.get('tbk')
            eck = data.get('eck')
            tbna = data.get('tbna')
            tbcl = data.get('tbcl')
            o_pral = data.get('o_pral')

            # Collect bia_acc_proteins Data
            tbprot = data.get('tbprot')
            bcmprot = data.get('bcmprot')
            ecfprot = data.get('ecfprot')
            ecmprot = data.get('ecmprot')
            le = data.get('le')
            cr_24h = data.get('cr_24h')
            stm = data.get('stm')
            gly_free = data.get('gly_free')
            # Collect bia_acc_bone Data
            bo_dens = data.get('bo_dens')
            bone = data.get('bone')
            t_score = data.get('t_score')
            bm = data.get('bm')
            tbca = data.get('tbca')
            bbuffer = data.get('bbuffer')
            tbmg = data.get('tbmg')
            tbp = data.get('tbp')
            # Collect bia_acc_body_composition Data
            ffm = data.get('ffm')
            brm = data.get('brm')
            ecm = data.get('ecm')
            hpa_axir = data.get('hpa_axir')
            # Collect bia_acc_active_metabolic_mass Data
            s_score = data.get('s_score')
            skel_m = data.get('skel_m')
            fm = data.get('fm')
            imat = data.get('imat')
            aat = data.get('aat')
            mmle = data.get('mm_le')
            gly = data.get('gly')
            vi_org = data.get('vi_org')

            measurement_record = Measurement.objects.get(patient_id=patient_id, dt=dt)
            measurement_record.weight = weight
            measurement_record.height = height
            measurement_record.save()
            
            ppg_record = PPGStressFlow.objects.get(patient_id=patient_id, dt=dt)
            ppg_record.sdnn = sdnn
            ppg_record.rmssd = rmssd
            ppg_record.c_rer = c_rer
            ppg_record.thm_pw = thm_pw
            ppg_record.lf_vlf_le = lf_vlf_le
            ppg_record.lf_vlf_ri = lf_vlf_ri
            ppg_record.me_hr = me_hr
            ppg_record.hrv_min = hrv_min
            ppg_record.hrv_max = hrv_max
            ppg_record.save()
            
            heg_record = HEG.objects.get(patient_id=patient_id, dt=dt)
            heg_record.rcbo2 = rcbo2
            heg_record.sd = sd
            heg_record.slope = slope
            heg_record.cbf_ratio = cbf_ratio
            heg_record.save()
            
            acc_water_record = BiaAccWater.objects.get(patient_id=patient_id, dt=dt)
            acc_water_record.tbw = tbw
            acc_water_record.scam_to = scam_to
            acc_water_record.ecw = ecw
            acc_water_record.icw = icw
            acc_water_record.save()
            
            acc_soft_tissue_record = BiaAccSoftTissueMineral.objects.get(patient_id=patient_id, dt=dt)
            acc_soft_tissue_record.tbk = tbk
            acc_soft_tissue_record.eck = eck
            acc_soft_tissue_record.tbna = tbna
            acc_soft_tissue_record.tbcl = tbcl
            acc_soft_tissue_record.o_pral = o_pral
            acc_soft_tissue_record.save()
            
            acc_protine_record = BiaAccProteins.objects.get(patient_id=patient_id, dt=dt)
            acc_protine_record.tbprot = tbprot
            acc_protine_record.bcmprot = bcmprot
            acc_protine_record.ecfprot = ecfprot
            acc_protine_record.ecmprot = ecmprot
            acc_protine_record.le = le
            acc_protine_record.cr_24h = cr_24h
            acc_protine_record.stm = stm
            acc_protine_record.gly_free = gly_free
            acc_protine_record.save()
            
            acc_bone_record = BiaAccBone.objects.get(patient_id=patient_id, dt=dt)
            acc_bone_record.bo_dens = bo_dens
            acc_bone_record.bone = bone
            acc_bone_record.t_score = t_score
            acc_bone_record.bm = bm
            acc_bone_record.tbca = tbca
            acc_bone_record.bbuffer = bbuffer
            acc_bone_record.tbmg = tbmg
            acc_bone_record.tbp = tbp
            acc_bone_record.save()
            
            acc_body_record = BiaAccBodyComposition.objects.get(patient_id=patient_id, dt=dt)
            acc_body_record.ffm = ffm
            acc_body_record.brm = brm
            acc_body_record.ecm = ecm
            acc_body_record.hpa_axir = hpa_axir
            acc_body_record.save()
            
            acc_mass_record = BiaAccActiveMetabolicMass.objects.get(patient_id=patient_id, dt=dt)
            acc_mass_record.s_score = s_score
            acc_mass_record.skel_m = skel_m
            acc_mass_record.fm = fm
            acc_mass_record.imat = imat
            acc_mass_record.aat = aat
            acc_mass_record.le = mmle
            acc_mass_record.gly = gly
            acc_mass_record.vi_org = vi_org
            acc_mass_record.save()

            return JsonResponse({'status': 'OK', 'message': 'Measurement has been updated successfully!'})
        except Exception as e:
            return JsonResponse({'status': 'KO', 'message': str(e)})
    return JsonResponse({'status': 'KO', 'message': 'Invalid request method to update the record'})

def GetDetailPatientMeasurement(request):
    if request.method == "POST":
        try:
            # Parse JSON data from request
            data = json.loads(request.body)
            patient_id = data.get('patient_id')
            dt_str = data.get('dt')
            dt = datetime.strptime(dt_str, "%Y-%m-%d %H:%M:%S")
            
            measurement = Measurement.objects.filter(patient_id=patient_id, dt=dt)
            measurement_list = list(measurement.values(
                'dt', 'patient_id', 'weight', 'height'
            ))
            for item in measurement_list:
                item['dt'] = item['dt'].strftime("%Y-%m-%d %H:%M:%S")

            ppg_stress_flow = PPGStressFlow.objects.filter(patient_id=patient_id, dt=dt)
            stress_flow_list = list(ppg_stress_flow.values(
                'dt', 'patient_id', 'sdnn', 'rmssd', 'c_rer', 'thm_pw', 'lf_vlf_le', 'lf_vlf_ri', 'me_hr', 'hrv_min', 'hrv_max' 
            ))
            for item in stress_flow_list:
                item['dt'] = item['dt'].strftime("%Y-%m-%d %H:%M:%S")
            
            heg = HEG.objects.filter(patient_id=patient_id, dt=dt)
            heg_list = list(heg.values(
                'dt', 'patient_id', 'rcbo2', 'sd', 'slope', 'cbf_ratio'
            ))
            for item in heg_list:
                item['dt'] = item['dt'].strftime("%Y-%m-%d %H:%M:%S")
            
            acc_water = BiaAccWater.objects.filter(patient_id=patient_id, dt=dt)
            acc_water_list = list(acc_water.values(
                'dt', 'patient_id', 'tbw', 'scam_to', 'ecw', 'icw'
            ))
            for item in acc_water_list:
                item['dt'] = item['dt'].strftime("%Y-%m-%d %H:%M:%S")
            
            soft_tissue = BiaAccSoftTissueMineral.objects.filter(patient_id=patient_id, dt=dt)
            soft_tissue_list = list(soft_tissue.values(
                'dt', 'patient_id', 'tbk', 'eck', 'tbna', 'tbcl', 'o_pral'
            ))
            for item in soft_tissue_list:
                item['dt'] = item['dt'].strftime("%Y-%m-%d %H:%M:%S")
            
            acc_protine = BiaAccProteins.objects.filter(patient_id=patient_id, dt=dt)
            acc_protine_list = list(acc_protine.values(
                'dt', 'patient_id', 'tbprot', 'bcmprot', 'ecfprot', 'ecmprot', 'le', 'cr_24h', 'stm', 'gly_free'
            ))
            for item in acc_protine_list:
                item['dt'] = item['dt'].strftime("%Y-%m-%d %H:%M:%S")
            
            acc_bone = BiaAccBone.objects.filter(patient_id=patient_id, dt=dt)
            acc_bone_list = list(acc_bone.values(
                'dt', 'patient_id', 'bo_dens', 'bone', 't_score', 'bm', 'tbca', 'bbuffer', 'tbmg', 'tbp'
            ))
            for item in acc_bone_list:
                item['dt'] = item['dt'].strftime("%Y-%m-%d %H:%M:%S")
            
            acc_body = BiaAccBodyComposition.objects.filter(patient_id=patient_id, dt=dt)
            acc_body_list = list(acc_body.values(
                'dt', 'patient_id', 'ffm', 'brm', 'ecm', 'hpa_axir'
            ))
            for item in acc_body_list:
                item['dt'] = item['dt'].strftime("%Y-%m-%d %H:%M:%S")
            
            acc_mass = BiaAccActiveMetabolicMass.objects.filter(patient_id=patient_id, dt=dt)
            acc_mass_list = list(acc_mass.values(
                'dt', 'patient_id', 's_score', 'skel_m', 'fm', 'imat', 'aat', 'le', 'gly', 'vi_org'
            ))
            for item in acc_mass_list:
                item['dt'] = item['dt'].strftime("%Y-%m-%d %H:%M:%S")

            return JsonResponse({
                'status': 'OK',
                'measurement': measurement_list,
                'ppg_stress_flow': stress_flow_list,
                'heg': heg_list,
                'bia_acc_water': acc_water_list,
                'bia_acc_soft_tissue_mineral': soft_tissue_list,
                'bia_acc_proteins': acc_protine_list,
                'bia_acc_bone': acc_bone_list,
                'bia_acc_body_composition': acc_body_list,
                'bia_acc_active_metabolic_mass': acc_mass_list,
            })

        except PPGStressFlow.DoesNotExist:
            return JsonResponse({'status': 'KO', 'message': 'Record not found.'})

        except Exception as e:
            return JsonResponse({'status': 'KO', 'message': str(e)})

    return JsonResponse({'status': 'KO', 'message': 'Invalid request method'})



