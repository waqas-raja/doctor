from django.contrib import admin
from .models import (
    Patient,
    Measurement,
    PPGStressFlow,
    HEG,
    BiaAccWater,
    BiaAccActiveMetabolicMass,
    BiaAccBodyComposition,
    BiaAccBone,
    BiaAccProteins,
    BiaAccSoftTissueMineral
)

# Register your models here.
admin.site.register(Patient)
admin.site.register(Measurement)
admin.site.register(PPGStressFlow)
admin.site.register(HEG)
admin.site.register(BiaAccWater)
admin.site.register(BiaAccActiveMetabolicMass)
admin.site.register(BiaAccBodyComposition)
admin.site.register(BiaAccBone)
admin.site.register(BiaAccProteins)
admin.site.register(BiaAccSoftTissueMineral)