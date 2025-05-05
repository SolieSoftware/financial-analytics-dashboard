from django.urls import path
from .views import TickerList, TickerHistoricalData


urlpatterns = [
    path('tickers/', TickerList.as_view(), name='ticker-list'),
    path('tickers/<str:ticker>/', TickerHistoricalData.as_view(), name='ticker-data'),
]