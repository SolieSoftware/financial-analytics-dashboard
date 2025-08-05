export type stockEntry = {
  Date: string;
  Open: number;
  High: number;
  Low: number;
  Close: number;
  Volume: number;
  Dividends: number;
  "Stock Splits": number;
};

export type stockEntryCleaned = {
  Date: Date;
  Open: number;
  High: number;
  Low: number;
  Close: number;
  Volume: number;
  Dividends: number;
  "Stock Splits": number;
};

interface CompanyOfficer {
  maxAge: number;
  name: string;
  age?: number;
  title: string;
  yearBorn?: number;
  fiscalYear: number;
  totalPay?: number;
  exercisedValue: number;
  unexercisedValue: number;
}

interface stockInfoData {
  // Company Information
  address1: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  website: string;
  industry: string;
  industryKey: string;
  industryDisp: string;
  sector: string;
  sectorKey: string;
  sectorDisp: string;
  longBusinessSummary: string;
  fullTimeEmployees: number;
  companyOfficers: CompanyOfficer[];
  compensationAsOfEpochDate: number;
  executiveTeam: any[]; // Empty array in the data

  // Trading Information
  maxAge: number;
  priceHint: number;
  previousClose: number;
  open: number;
  dayLow: number;
  dayHigh: number;
  regularMarketPreviousClose: number;
  regularMarketOpen: number;
  regularMarketDayLow: number;
  regularMarketDayHigh: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketPrice: number;
  regularMarketTime: number;
  regularMarketDayRange: string;

  // Dividend Information
  dividendRate: number;
  dividendYield: number;
  exDividendDate: number;
  payoutRatio: number;
  trailingAnnualDividendRate: number;
  trailingAnnualDividendYield: number;
  lastDividendValue: number;
  lastDividendDate: number;
  dividendDate: number;

  // Risk Metrics
  beta: number;

  // Valuation Metrics
  trailingPE: number;
  forwardPE: number;
  priceToSalesTrailing12Months: number;
  priceToBook: number;
  trailingPegRatio: number;

  // Volume & Market Data
  volume: number;
  regularMarketVolume: number;
  averageVolume: number;
  averageVolume10days: number;
  averageDailyVolume10Day: number;
  averageDailyVolume3Month: number;
  bid: number;
  ask: number;
  bidSize: number;
  askSize: number;

  // Market Cap & Shares
  marketCap: number;
  floatShares: number;
  sharesOutstanding: number;
  sharesShort: number;
  sharesShortPriorMonth: number;
  sharesShortPreviousMonthDate: number;
  dateShortInterest: number;
  sharesPercentSharesOut: number;
  shortRatio: number;
  impliedSharesOutstanding: number;
  heldPercentInsiders: number;
  heldPercentInstitutions: number;

  // 52-Week Data
  fiftyTwoWeekLow: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLowChange: number;
  fiftyTwoWeekLowChangePercent: number;
  fiftyTwoWeekHighChange: number;
  fiftyTwoWeekHighChangePercent: number;
  fiftyTwoWeekRange: string;
  fiftyTwoWeekChange: number;
  fiftyTwoWeekChangePercent: number;

  // Moving Averages
  fiftyDayAverage: number;
  fiftyDayAverageChange: number;
  fiftyDayAverageChangePercent: number;
  twoHundredDayAverage: number;
  twoHundredDayAverageChange: number;
  twoHundredDayAverageChangePercent: number;

  // Financial Metrics
  bookValue: number;
  lastFiscalYearEnd: number;
  nextFiscalYearEnd: number;
  mostRecentQuarter: number;
  earningsQuarterlyGrowth: number;
  netIncomeToCommon: number;
  trailingEps: number;
  forwardEps: number;
  epsTrailingTwelveMonths: number;
  epsForward: number;
  epsCurrentYear: number;
  priceEpsCurrentYear: number;

  // Stock Split Information
  lastSplitFactor: string;
  lastSplitDate: number;

  // Enterprise & Revenue Metrics
  enterpriseValue: number;
  enterpriseToRevenue: number;
  enterpriseToEbitda: number;
  profitMargins: number;

  // Cash & Debt
  totalCash: number;
  totalCashPerShare: number;
  totalDebt: number;
  quickRatio: number;
  currentRatio: number;
  debtToEquity: number;

  // Revenue & Profitability
  totalRevenue: number;
  revenuePerShare: number;
  returnOnAssets: number;
  returnOnEquity: number;
  grossProfits: number;
  freeCashflow: number;
  operatingCashflow: number;
  earningsGrowth: number;
  revenueGrowth: number;
  grossMargins: number;
  ebitdaMargins: number;
  operatingMargins: number;
  ebitda: number;

  // Analyst Information
  targetHighPrice: number;
  targetLowPrice: number;
  targetMeanPrice: number;
  targetMedianPrice: number;
  recommendationMean: number;
  recommendationKey: string;
  numberOfAnalystOpinions: number;
  averageAnalystRating: string;

  // Market & Exchange Info
  currency: string;
  financialCurrency: string;
  tradeable: boolean;
  symbol: string;
  language: string;
  region: string;
  typeDisp: string;
  quoteSourceName: string;
  triggerable: boolean;
  customPriceAlertConfidence: string;
  corporateActions: any[]; // Empty array in the data
  exchange: string;
  messageBoardId: string;
  exchangeTimezoneName: string;
  exchangeTimezoneShortName: string;
  gmtOffSetMilliseconds: number;
  market: string;
  esgPopulated: boolean;
  marketState: string;
  fullExchangeName: string;

  // Company Names
  shortName: string;
  longName: string;
  displayName: string;

  // Trading Data
  hasPrePostMarketData: boolean;
  firstTradeDateMilliseconds: number;
  sourceInterval: number;
  exchangeDataDelayedBy: number;
  cryptoTradeable: boolean;

  // Earnings Information
  earningsTimestamp: number;
  earningsTimestampStart: number;
  earningsTimestampEnd: number;
  earningsCallTimestampStart: number;
  earningsCallTimestampEnd: number;
  isEarningsDateEstimate: boolean;

  // Quote Type
  quoteType: string;
  currentPrice: number;
  SandP52WeekChange: number;
}

export interface stockHistoricalData {
  historyData: stockEntry[];
}

export interface stockData {
  info_data: stockInfoData;
  history_data: stockEntry[];
}

export interface stockDataResponse {
  stockData: stockData | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
