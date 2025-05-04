from django.shortcuts import render
import yfinance as yf
import pandas as pd 
import requests
from io import StringIO
from rest_framework.views import APIView
from rest_framework.response import Response

class TickerList(APIView):
    def get(self, request):
        url = "https://www.nasdaqtrader.com/dynamic/SymDir/nasdaqlisted.txt"
        response = requests.get(url)
        response.raise_for_status() 
        nasdaq = pd.read_csv(StringIO(response.text), sep='|')
        nasdaq = nasdaq[~nasdaq['Symbol'].str.contains('File Creation Time', na=False)]
        
        nasdaq = nasdaq.where(pd.notnull(nasdaq), None)  # Replace NaN with None
        nasdaq = nasdaq.replace([float('inf'), float('-inf')], None)  # Replace Inf values
        json_data = nasdaq.to_dict(orient='records')
        return Response({"nasdaq_ticker_list": json_data})

class TickerData(APIView):
    def get(self, request, ticker="GOOG"):
        ticker_obj = yf.Ticker(ticker)
        ticker_info = ticker_obj.info
        hist_df = ticker_obj.history(period='1y')
        hist_df.reset_index()
        hist_json = hist_df.to_dict(orient="records")
        return Response({"ticker_info": ticker_info, "history": hist_df})
    


    
    
