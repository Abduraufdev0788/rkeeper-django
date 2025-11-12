from django.db import models

class Product(models.Model):
    nomi = models.CharField(max_length=128)
    kodi = models.IntegerField()
    narxi = models.FloatField()

    def __str__(self):
        return f" {self.nomi} (Kod: {self.kodi}) - Narxi: {self.narxi} "


