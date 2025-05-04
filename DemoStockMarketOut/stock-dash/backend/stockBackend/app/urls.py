from django.urls import path
from .views import TickerList, TickerData


urlpatterns = [
    path('tickers/', TickerList.as_view(), name='ticker-list'),
    path('tickers/<str:ticker>/', TickerData.as_view(), name='ticker-data'),
]