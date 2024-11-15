from rest_framework import serializers
from .models import Patient, Measurement

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['id', 'name', 'surname', 'gender', 'internal_code', 'email', 'telephone']

class MeasurementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Measurement
        fields = ['patient_id', 'dt', 'weight', 'height']