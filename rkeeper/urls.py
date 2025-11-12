from django.urls import path
from .views import products

urlpatterns = [
    path('home/', products, name='products'),
]
