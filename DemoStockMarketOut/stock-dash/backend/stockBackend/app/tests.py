from django.test import TestCase
from django.test import Client
from .views import TickerList
# Create your tests here.


clinet = Client()

response = client.get("/tickers/")

print(response.status_code)
print(response.json())