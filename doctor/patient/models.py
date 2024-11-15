from django.db import models
# from .models import Patient

# Create your models here.
class Patient(models.Model):
    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    )
    name = models.CharField(max_length=50)
    surname = models.CharField(max_length=50)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    internal_code = models.CharField(max_length=20, unique=True)
    # New fields
    telephone = models.CharField(max_length=25, null=True, blank=True)
    email = models.EmailField(max_length=254, null=True, blank=True)

    def __str__(self):
        return f"{self.name} {self.surname} ({self.internal_code})"
    
class Measurement(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    dt = models.DateTimeField()
    weight = models.IntegerField()
    height = models.IntegerField()

    def __str__(self):
        return f"Measurement for {self.patient.name} {self.patient.surname} on {self.dt}"
    
class PPGStressFlow(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    dt = models.DateTimeField()
    sdnn = models.FloatField(null=True, blank=True)
    rmssd = models.FloatField(null=True, blank=True)
    c_rer = models.FloatField(null=True, blank=True)
    thm_pw = models.FloatField(null=True, blank=True)
    lf_vlf_le = models.FloatField(null=True, blank=True)
    lf_vlf_ri = models.FloatField(null=True, blank=True)
    me_hr = models.FloatField(null=True, blank=True)
    hrv_min = models.FloatField(null=True, blank=True)
    hrv_max = models.FloatField(null=True, blank=True)

    class Meta:
        db_table = 'ppg_stress_flow'

    def __str__(self):
        return f"PPG Stress Flow for {self.patient} at {self.dt}"

class HEG(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    dt = models.DateTimeField()
    rcbo2 = models.FloatField(null=True, blank=True)
    sd = models.FloatField(null=True, blank=True)
    slope = models.FloatField(null=True, blank=True)
    cbf_ratio = models.FloatField(null=True, blank=True)

    class Meta:
        db_table = 'heg'

    def __str__(self):
        return f"heg for {self.patient} at {self.dt}"

class BiaAccWater(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    dt = models.DateTimeField()
    tbw = models.FloatField(null=True, blank=True)
    scam_to = models.FloatField(null=True, blank=True)
    ecw = models.FloatField(null=True, blank=True)
    icw = models.FloatField(null=True, blank=True)

    class Meta:
        db_table = 'bia_acc_water'

    def __str__(self):
        return f"bia_acc_water for {self.patient} at {self.dt}"

class BiaAccSoftTissueMineral(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    dt = models.DateTimeField()
    tbk = models.FloatField(null=True, blank=True)
    eck = models.FloatField(null=True, blank=True)
    tbna = models.FloatField(null=True, blank=True)
    tbcl = models.FloatField(null=True, blank=True)
    o_pral = models.FloatField(null=True, blank=True)

    class Meta:
        db_table = 'bia_acc_soft_tissue_mineral'

    def __str__(self):
        return f"bia_acc_soft_tissue_mineral for {self.patient} at {self.dt}"

class BiaAccProteins(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    dt = models.DateTimeField()
    tbprot = models.FloatField(null=True, blank=True)
    bcmprot = models.FloatField(null=True, blank=True)
    ecfprot = models.FloatField(null=True, blank=True)
    ecmprot = models.FloatField(null=True, blank=True)
    le = models.FloatField(null=True, blank=True)
    cr_24h = models.FloatField(null=True, blank=True)
    stm = models.FloatField(null=True, blank=True)
    gly_free = models.FloatField(null=True, blank=True)

    class Meta:
        db_table = 'bia_acc_proteins'

    def __str__(self):
        return f"bia_acc_proteins for {self.patient} at {self.dt}"

class BiaAccBone(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    dt = models.DateTimeField()
    bo_dens = models.FloatField(null=True, blank=True)
    bone = models.FloatField(null=True, blank=True)
    t_score = models.FloatField(null=True, blank=True)
    bm = models.FloatField(null=True, blank=True)
    tbca = models.FloatField(null=True, blank=True)
    bbuffer = models.FloatField(null=True, blank=True)
    tbmg = models.FloatField(null=True, blank=True)
    tbp = models.FloatField(null=True, blank=True)

    class Meta:
        db_table = 'bia_acc_bone'

    def __str__(self):
        return f"bia_acc_bone for {self.patient} at {self.dt}"

class BiaAccBodyComposition(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    dt = models.DateTimeField()
    ffm = models.FloatField(null=True, blank=True)
    brm = models.FloatField(null=True, blank=True)
    ecm = models.FloatField(null=True, blank=True)
    hpa_axir = models.FloatField()

    class Meta:
        db_table = 'bia_acc_body_composition'

    def __str__(self):
        return f"bia_acc_body_composition for {self.patient} at {self.dt}"

class BiaAccActiveMetabolicMass(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    dt = models.DateTimeField()
    s_score = models.FloatField(null=True, blank=True)
    skel_m = models.FloatField(null=True, blank=True)
    fm = models.FloatField(null=True, blank=True)
    imat = models.FloatField(null=True, blank=True)
    aat = models.FloatField(null=True, blank=True)
    le = models.FloatField(null=True, blank=True)
    gly = models.FloatField(null=True, blank=True)
    vi_org = models.FloatField(null=True, blank=True)

    class Meta:
        db_table = 'bia_acc_active_metabolic_mass'

    def __str__(self):
        return f"bia_acc_active_metabolic_mass for {self.patient} at {self.dt}"