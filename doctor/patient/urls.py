from django.contrib import admin
from . import views
from django.urls import path, include
from .views import PatientCreateView, PatientListView, PatientMeasurementListView


urlpatterns = [
    path('', views.index, name="Patient"),
    path('patient_detail/<int:id>/', views.PatientDetailView, name="PatientDetail"),
    path('api/patient/create/', PatientCreateView.as_view(), name="CreatePatient"),
    path('api/patient/list/', PatientListView.as_view(), name="ListPatient"),
    path('api/patient/delete/', views.DeletePatientView, name="DeletePatient"),

    path('new_measurement/', views.NewMeasurementWindowView, name="NewMeasurementWindow"),
    path('search_patient/', views.SearchPatientView, name="SearchPatient"),
    path('measurement_list/<int:id>/', views.ShowPatientMeasurementListView, name="PatientMeasurementList"),
    path('measurement_detail/<int:id>/<str:date>/', views.ShowPatientMeasurementDetailView, name="PatientMeasurementDetail"),

    path('api/patient/measurement/list/<int:patient_id>/', views.PatientMeasurementListView, name="PatientMeasurementList"),
    path('api/patient/measurement/create/', views.CreatePatientMeasurement, name="CreatePatientMearurement"),
    path('api/patient/measurement/detail/', views.GetDetailPatientMeasurement, name="DetailPatientMearurement"),
    path('api/patient/measurement/update/', views.UpdatePatientMeasurement, name="UpdatePatientMearurement"),
    path('api/patient/delete_measurement/', views.DeletePatientMeasurement, name="DeletePatientMearurement"),

]