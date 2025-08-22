

## Overview

The world of publicly traded financial instruments while large in dollar amount is not that large in terms of the number of instruments.

Some estimates of the numbers (see below and FAQ for sources):

* Listed companies: WFE: "Our member exchanges are home to more than 44,000 listed companies"
* ETFs: Wiki: "By the end of 2015, ETFs offered "1,800 different products, covering almost every conceivable market sector, niche and trading strategy"
* ETNs: Wiki: "As of April 2008, there were 56 ETNs from nine issuers tracking different indexes."
* Mutual Funds: Wiki: "There are several hundred families of registered mutual funds in the United States, some with a single fund and others offering dozens."

Looking at these numbers, it seems unlikely that that there are anything more that a hundred thousand tradable instruments. And a more likely number is in the range of fifty to sixty thousand instruments.

In other words, the number is small enough to fit to a single work sheet of a single spreadsheet.

Gathering the sources for the exchanges and symbol names for the great majority of these instruments might take a day or two. Writing scripts to gather the symbols on a regular basis might take a few days. In any case it's neither an insurmountable project nor even a very big project.

## Lists of Exchanges

### World Federation of Exchanges

> keywords: "WFE, World Federation of Exchanges, OECD, IOSCO, IOMA, Financial Stability Board"

> description: "The World Federation of Exchanges represents 64 regulated exchanges across the world, and acts on behalf of a total of 99 organizations including affiliate members and clearinghouses. Our member exchanges are home to more than 44,000 listed companies, while our widely used statistics database covers more than 350 indicators and 70 years of data from exchanges worldwide. Our members provide a significant contribution to the real economy, representing a total market capitalization of USD 60.1 trillion and a total trading value of USD 52 trillion, a value which is over 75% of the world GDP."

* <https://www.world-exchanges.org/home/>
	* <https://www.world-exchanges.org/home/index.php/members/wfe-members>
	* <https://www.world-exchanges.org/home/index.php/members/affiliates>

### Wikipedia

* https://en.wikipedia.org/wiki/List_of_stock_exchanges>

> There are 16 stock exchanges (bourse) in the world that have a market capitalization of over US$ 1 trillion each. They are sometimes referred to as the "$1 Trillion Club". These 16 exchanges accounted for 87% of global market capitalization in 2015.[1]. Some exchanges do include companies from outside the country where the exchange is located.

* <https://en.wikipedia.org/wiki/List_of_futures_exchanges>
* <https://en.wikipedia.org/wiki/List_of_stock_exchange_trading_hours>

## [StockMarketClock.com]( https://www.stockmarketclock.com/ )

* <https://www.stockmarketclock.com/exchanges>

### Symbol List Aggregators

### Barchart.com


* <https://www.barchart.com/>

> Barchart.com is the leading provider of intraday stock and commodities real-time or delayed charts with powerful indicators and technical analysis.

### EODDATA


* http://eoddata.com/default.aspx
* <http://eoddata.com/symbols.aspx>

> Free end of day stock market data and historical quotes for many of the world's top exchanges including NASDAQ, NYSE, AMEX, TSX, OTCBB, FTSE, SGX, HKEX, and FOREX.


### IEX Trading

* <https://iextrading.com/>
* <https://iextrading.com/developer/>
* <https://api.iextrading.com/1.0/ref-data/symbols>


### NASDAQ.com

* <http://www.nasdaq.com/screening/company-list.aspx>

### NASDAQTrader

* <ftp://ftp.nasdaqtrader.com/SymbolDirectory>
* <ftp://ftp.nasdaqtrader.com/SymbolDirectory/nasdaqlisted.txt>
* <ftp://ftp.nasdaqtrader.com/SymbolDirectory/otherlisted.txt>
* <ftp://ftp.nasdaqtrader.com/symboldirectory>
* <ftp://nasdaqtrader.com/SymbolDirectory/nasdaqlisted.txt>
* <ftp://nasdaqtrader.com/SymbolDirectory/otherlisted.txt>

### Yahoo

* <https://finance.yahoo.com/>
* <http://d.yimg.com/aq/autoc?query=term&region=US&lang=en-US>
* <http://d.yimg.com/aq/autoc?query=msft&region=US&lang=en-US?





## Constituents

As WSE reports there are about 44,000 listed companies. The great majority are listed perhaps 80 or so exchanges with business that might be of interest to an international investor.

The data for the constituents of each exchange is available with the help of the search engines,

Below are links to web pages that allow you to download list of constituents. These links were gathered in a matter of minutes,

Gathering the data for all the exchanges would probably take less than a day. Writing a utility that downloaded each list and made the data available via GitHu pages or any static server might take a day or two.


### Australia

* <https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=FLN.AX&apikey=YOUR-API-KEY>

#### ASX - Sydney

* <http://www.asx.com.au/asx/research/listedCompanies.do>
* <http://www.asx.com.au/asx/research/ASXListedCompanies.csv>



### China

#### Shanghai Stock Exchange

https://en.wikipedia.org/wiki/Shanghai_Stock_Exchange
http://english.sse.com.cn/
http://english.sse.com.cn/listed/company/


https://en.wikipedia.org/wiki/Shenzhen_Stock_Exchange
http://www.szse.cn/main/en/
http://www.szse.cn/main/en/marketdata/stockinformation/



### Denmark

#### OMCX - Copenhagen

* <http://www.nasdaqomxnordic.com/shares/listed-companies/copenhagen>




### Euronext Stock Exchange

* <https://www.euronext.com/en/equities/directory>

Cannot get via a link. Must click button




### India

#### BSE

* <http://www.bseindia.com/>
* <https://en.wikipedia.org/wiki/Bombay_Stock_Exchange>


Working:

* https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=NYSE:WIT&apikey=tbd1
* https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=BSE:507685&apikey=tbd1
* https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=BSE:507685&apikey=tbd1
* https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=BSE:500470&apikey=tbd1
* https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=BSE:507685&apikey=tbd1
*  https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=BSE:500477&apikey=KEY&outputsize=full


#### sensex

* https://en.wikipedia.org/wiki/BSE_SENSEX

HDFC *
* http://www.bseindia.com/stock-share-price/housing-development-finance-corpltd/hdfc/500010/
SBIN
* http://www.bseindia.com/stock-share-price/state-bank-of-india/sbin/500112/
LT
* http://www.bseindia.com/stock-share-price/larsen--toubro-ltd/lt/500510/
YESBANK *
* http://www.bseindia.com/stock-share-price/yes-bank-ltd/yesbank/532648/
HDFCBANK
* http://www.bseindia.com/stock-share-price/hdfc-bank-ltd/hdfcbank/500180/


#### NSE
* <https://en.wikipedia.org/wiki/National_Stock_Exchange_of_India>
* <https://www.nseindia.com/>

#### Various NSE Symbols
* <https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=NSE:ASHOKLEY&apikey=tbd1&outputsize=full>
* <https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=NSE:HDFC&apikey=KEY&outputsize=full>
* <https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=NSE:SBIN&apikey=KEY&outputsize=full>
* <https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=NSE:LT&apikey=KEY&outputsize=full>
* <https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=NSE:ARVSMART&apikey=>


#### NIFTY 50 and Nifty 500

* <https://en.wikipedia.org/wiki/NIFTY_50>
* <https://www.nseindia.com/live_market/dynaContent/live_watch/equities_stock_watch.htm?cat=N>
* <https://www.nseindia.com/content/indices/ind_nifty50list.csv>
* <https://www.nseindia.com/content/indices/ind_nifty500list.csv>



### South Africa

#### JSE Johannesburg stock exchange

Use finance.yahoo.com and type in the name of the company in the search box. If it's traded on the JSE it will show the symbol followed by the suffix .JO. Use that suffix in your API call.  ABSP.JO is Absa Bank Limited, for example.

https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=SOL.JO&apikey=tbd1
https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=SOL.JO&apikey=KEY

https://www.african-markets.com/en/stock-markets/jse/listed-companies


### Sweden

#### OMX - Stockholm

* <http://www.nasdaqomxnordic.com/shares/listed-companies/stockholm>



### United Kindom

* <https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=GBG.L&apikey=YOUR-API-KEY>
* <https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=LON:RR&apikey=YOUR-API-KEY>


#### London Stock Exchange

* <http://www.londonstockexchange.com/statistics/companies-and-issuers/companies-and-issuers.htm>

List of listed company names - but does not include the symbols

#### Instrument list

* <http://www.londonstockexchange.com/statistics/companies-and-issuers/instruments-defined-by-mifir-identifiers-list-on-lse.xlsx>


### United States




## Links of Interest

### Stackoverflow
* https://stackoverflow.com/questions/5246843/how-to-get-a-complete-list-of-ticker-symbols-from-yahoo-finance?rq=1
* url for symbols: <https://stackoverflow.com/questions/32899143/yahoo-finance-api-stock-ticker-lookup-only-allowing-exact-match>

### More

* <http://www.hedgechatter.com/96-stocks-apis-bloomberg-nasdaq-and-etrade/>
* <http://www.eoddata.com/>
	* https://www.alpha-vantage.community/post/new-app-sharelane-9628286?pid=1302972833
* <https://www.reuters.com/finance/stocks/lookup?searchType=any&comSortBy=marketcap&sortBy=&dateRange=&search=goog>
* NYSE is at http://www.nyse.com/interface/html/SymbolLookup.html
* NASDAQ is at http://www.nasdaq.com/asp/NasdaqSymLookup2.asp?mode=stock
* London Stock Exchange is at http://www.londonstockexchange.com/en-gb/pricesnews/prices/Trigger/genericsearch.htm
* ASX is at http://www.asx.com.au/asx/research/codeLookup.do
* https://openexchangerates.org/

etf_symbols = {
    "S&P 500": "SPY",      # SPDR S&P 500 ETF
    "NASDAQ": "QQQ",       # Invesco QQQ Trust (NASDAQ-100)
    "Dow Jones": "DIA",    # SPDR Dow Jones Industrial Average ETF
    "FTSE 100": "ISF",     # iShares Core FTSE 100 UCITS ETF
    "FTSE 250": "MIDD"     # iShares Core FTSE 250 UCITS ETF
}

    # ETF fallbacks
    etf_fallbacks = {
        "nasdaq": "QQQ",
        "dow": "DIA",
        "sp500": "SPY", 
        "ftse100": "ISF",
        "ftse250": "MIDD"
    }