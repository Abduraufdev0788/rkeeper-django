from django.shortcuts import render
from django.http import HttpRequest, HttpResponse

def products(request:HttpRequest)->HttpResponse:
    return render(request=request, template_name="index.html")