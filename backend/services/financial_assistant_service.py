import asyncio
import json
import logging
from typing import Any, Dict, List
from contextlib import asynccontextmanager
from mcp.client.stdio import stdio_client
from mcp import ClientSession, StdioServerParameters

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class FinancialAssistantService:
    def __init__(self, mcp_server_path: str = "../mcp_servers/financial_datasets_api_assistant.py"):
        self.mcp_server_path = mcp_server_path
        self._server_params = StdioServerParameters(
            command="python",
            args=[self.mcp_server_path],
        )
        self._available_tools = None


    @asynccontextmanager
    async def _get_session(self) -> ClientSession:
        client = stdio_client(self._server_params)

        try: 
            # Fires up MCP server and returns communication channels
            read, write = await client.__aenter__()

            session = ClientSession(read,write)
            await session.initialize()
            yield session
        except Exception as e:
            logger.error(f"Error initializing MCP session: {e}")
            raise
        finally:
            try: 
                await session.close()
                await client.__aexit__(None, None, None)
            except Exception as e:
                logger.error(f"Error closing MCP session: {e}")

    
    async def _get_available_tools(self) -> List[str]:
        async with self._get_session() as session:
            tools_response = await session.list_tools()
            self._available_tools = [tool.name for tool in tools_response]
            return self._available_tools
        
    async def call_tool(self, tool_name: str, args: Dict[str, Any]) -> str:
        async with self._get_session() as session:
            try:
                tool_response = await session.call_tool(tool_name, args)

            
                if tool_response.content and len(tool_response.content) > 0:
                    response_text = tool_response.content[0].text
                    try:
                        return json.loads(response_text)
                    except json.JSONDecodeError:
                        return {"response": response_text}
                else:
                    return {"error": "No response from tool"}
            except Exception as e:
                logger.error(f"Error calling tool {tool_name}: {e}")
                return {"error": str(e)}
            
    async def get_income_statements(
        self, ticker: str, period: str = "annual", limit: int = 10
    ) -> str:
        params = {"ticker": ticker, "period": period, "limit": limit}
        return await self.call_tool("get_income_statements", params)
    
    async def get_balance_sheet(self,
                                ticker: str,
                                period: str = "annual",
                                limit: int = 10
                                ) -> str:
        params = {"ticker": ticker, "period": period, "limit": limit}
        return await self.call_tool("get_balance_sheet", params)
    
    async def get_cash_flow(self,
                            ticker: str,
                            period: str = "annual",
                            limit: int = 10
                            ) -> str:
        params = {"ticker": ticker, "period": period, "limit": limit}
        return await self.call_tool("get_cash_flow", params)
    
    async def get_comprehensive_financial_data(self, ticker: str, period: str = "annual", limit: int = 5) -> Dict[str, Any]:
        """
        Get all financial data for a company using your MCP server.
        Makes multiple concurrent calls to your MCP tools.
        """
        try:
            # Call all tools concurrently
            tasks = [
                self.get_income_statements(ticker, period, limit),
                self.get_balance_sheet(ticker, period, limit),
                self.get_cash_flow(ticker, period, limit)
            ]
            
            # Add company overview if the tool exists
            if self._available_tools is None:
                await self.get_available_tools()
            
            if "get_company_overview" in (self._available_tools or []):
                tasks.append(self.get_company_overview(ticker))
                income, balance, cash_flow, overview = await asyncio.gather(*tasks, return_exceptions=True)
            else:
                overview = {"info": "Company overview tool not available"}
                income, balance, cash_flow = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Handle any exceptions
            def process_result(result, name):
                if isinstance(result, Exception):
                    logger.error(f"Error getting {name} for {ticker}: {result}")
                    return {"error": str(result)}
                return result
            
            return {
                "ticker": ticker.upper(),
                "period": period,
                "overview": process_result(overview, "overview"),
                "income_statements": process_result(income, "income statements"),
                "balance_sheet": process_result(balance, "balance sheet"),
                "cash_flow": process_result(cash_flow, "cash flow"),
                "timestamp": asyncio.get_event_loop().time()
            }
            
        except Exception as e:
            logger.error(f"Error getting comprehensive data for {ticker}: {e}")
            return {"error": str(e)}
    
    async def compare_companies(self, tickers: List[str], period: str = "annual") -> Dict[str, Any]:
        """Compare multiple companies using your MCP server."""
        comparison_data = {}
        
        # Process companies concurrently
        async def get_company_data(ticker):
            try:
                # Get latest financial data for comparison
                income = await self.get_income_statements(ticker, period, 1)
                balance = await self.get_balance_sheet(ticker, period, 1)
                cash_flow = await self.get_cash_flow(ticker, period, 1)
                
                return {
                    "ticker": ticker.upper(),
                    "latest_income": income.get("data", [{}])[0] if income.get("data") else {},
                    "latest_balance": balance.get("data", [{}])[0] if balance.get("data") else {},
                    "latest_cash_flow": cash_flow.get("data", [{}])[0] if cash_flow.get("data") else {},
                    "errors": {
                        "income": income.get("error"),
                        "balance": balance.get("error"),
                        "cash_flow": cash_flow.get("error")
                    }
                }
            except Exception as e:
                return {
                    "ticker": ticker.upper(),
                    "error": str(e)
                }
        
        # Run all company data fetching concurrently
        tasks = [get_company_data(ticker) for ticker in tickers]
        results = await asyncio.gather(*tasks)
        
        for result in results:
            comparison_data[result["ticker"]] = result
        
        return {
            "comparison": comparison_data,
            "period": period,
            "companies_count": len(tickers),
            "timestamp": asyncio.get_event_loop().time()
        }
    
    async def health_check(self) -> Dict[str, Any]:
        """Check if your MCP server is healthy."""
        try:
            tools = await self.get_available_tools()
            return {
                "status": "healthy",
                "available_tools": tools,
                "tools_count": len(tools)
            }
        except Exception as e:
            return {
                "status": "unhealthy",
                "error": str(e)
            }
    

