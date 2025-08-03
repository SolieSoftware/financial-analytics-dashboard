import asyncio
from typing import Dict, List, Any
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
import logging
import os
from huggingface_hub import InferenceClient, HfApi, list_models
from dotenv import load_dotenv

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

HF_API_URL = "https://api-inference.huggingface.co/models/"

load_dotenv()


class YahooFinanceMCPClient:
    def __init__(self, mcp_server_path: str = "../mcp_servers/yahoo_mcp_server.py"):
        self.mcp_server_path = mcp_server_path
        self.session = None
        self.hf_token = os.getenv("Hf_TOKEN")
        self.available_tools = {}
        self.models = {
            # Summarization models (no download required)
            "distilbart": "sshleifer/distilbart-cnn-12-6",  # 120MB - Fast summarization
            "bart_large": "facebook/bart-large-cnn",  # 400MB - High quality news/financial
            "pegasus": "google/pegasus-xsum",  # 570MB - Excellent summarization
            # Text generation models - use models that work with HF Inference API
            "gpt2": "gpt2",  # Small, reliable text generation
            "gpt2_medium": "gpt2-medium",  # Better quality
            "microsoft_dialo": "microsoft/DialoGPT-medium",  # Good for conversations
            # Financial domain specific
            "finbert": "ProsusAI/finbert",
            "zai-org":"zai-org/GLM-4.5",
            "HuggingFaceH4":"HuggingFaceH4/zephyr-7b-beta"
        }
        self.hf_client = InferenceClient(token=self.hf_token)

    async def connect_to_mcp_server(self):
        server_params = StdioServerParameters(
            command="python", args=[self.mcp_server_path]
        )

        logger.info(f"Starting MCP server from: {self.mcp_server_path}")
        self.stdio_client = stdio_client(server_params)
        self.read_write_streams = await self.stdio_client.__aenter__()
        read_stream, write_stream = self.read_write_streams

        self.session = ClientSession(read_stream, write_stream)
        await self.session.__aenter__()
        await self.session.initialize()

        tools_response = await self.session.list_tools()

        self.available_tools = {tool.name: tool for tool in tools_response.tools}

        logger.info(f"Connected to MCP server with tools: {self.available_tools}")
        for tool_name in self.available_tools:
            print(f"Tool: {tool_name}")

        return self.session

    async def cleanup(self):
        """Clean up MCP server connection"""
        if hasattr(self, "session") and self.session:
            await self.session.__aexit__(None, None, None)
        if hasattr(self, "stdio_client") and self.stdio_client:
            await self.stdio_client.__aexit__(None, None, None)

    async def call_mcp_tool(self, tool_name: str, args: Dict[str, Any]) -> str:
        if not self.session:
            raise Exception("Not connected to MCP server")

        if tool_name not in self.available_tools:
            raise Exception(f"Tool {tool_name} not found in available tools")

        try:
            print(f"Calling MCP tool: {tool_name} with args: {args}")
            result = await self.session.call_tool(tool_name, args)
            print(f"Tool result: {result}")

            if result.content:
                return (
                    result.content[0].text
                    if result.content[0].text
                    else str(result.content[0])
                )

            return str(result)
        except Exception as e:
            print(f"Error calling MCP tool {tool_name}: {str(e)}")

    async def analyze_stock(self, ticker: str) -> str:
        """Get stock data and provide AI summary"""
        try:
            # Get detailed company info
            info_data = await self.call_mcp_tool("get_stock_quote", {"ticker": ticker})

            # Combine the data
            # combined_data = f"Stock Quote:\n{quote_data}\n\nCompany Information:\n{info_data}"

            # Generate summary
            context = f"Analysis for {ticker.upper()}"
            summary = self.summarize_with_llm(info_data, context)

            return f"=== {ticker.upper()} Analysis ===\n\n{summary}\n\n=== Raw Data ===\n{info_data}"

        except Exception as e:
            return f"Error analyzing {ticker}: {str(e)}"

    async def compare_stocks(self, tickers: List[str]) -> str:
        """Compare multiple stocks with AI analysis"""
        try:
            # Get data for all stocks
            tickers_str = ",".join(tickers)
            quotes_data = await self.call_mcp_tool(
                "get_multiple_quotes", {"tickers": tickers_str}
            )

            # Generate comparative analysis
            context = f"Comparative analysis of {', '.join(tickers)}"
            summary = self.summarize_with_llm(quotes_data, context)

            return f"=== Stock Comparison: {', '.join(tickers)} ===\n\n{summary}\n\n=== Raw Data ===\n{quotes_data}"

        except Exception as e:
            return f"Error comparing stocks: {str(e)}"

    def summarize_with_llm(self, data: str, context: str = "") -> str:
        """Use LLM to summarize the financial data"""

        # Check if HF token is available
        if not self.hf_token:
            return f"Financial Analysis Summary:\n\n{context}\n\nKey Data Points:\n{data[:500]}...\n\nNote: Hugging Face token not configured for AI analysis."

        print(f"HF Token: {self.hf_token}")

        api = HfApi()

        model_name = self.models.get("HuggingFaceH4")  # Use GPT-2 which is reliable with HF API

        model_info = api.model_info(model_name)
        if hasattr(model_info, 'inference') and model_info.inference:
            print("Inference API is available")
        else:
            print("Inference API is not available")

        # Create a very simple prompt for GPT-2
        prompt = f"Financial analysis: {data[:500]}"

        print(f"Prompt: {prompt}")
        if model_name:
            try:
                print(f"Using model: {model_name}")
                print(f"Prompt length: {len(prompt)} characters")

                # Use instruction based modle to generate a summary

                messages = [{"role": "user", "content": prompt}]

                response = self.hf_client.chat_completion(
                            messages=messages,
                            model=model_name,
                            max_tokens=100,
                            temperature=0.7
                )
                print(f"Response: {response}")
                return response

            except Exception as e:
                print(f"HF API Error: {str(e)}")
                import traceback

                traceback.print_exc()
                return f"Financial Analysis Summary:\n\n{context}\n\nKey Data Points:\n{data[:500]}...\n\nNote: AI analysis failed - {str(e)}"
        else:
            return {"Error": "No model found"}

    async def market_overview(self) -> str:
        """Get market summary with AI analysis"""
        try:
            market_data = await self.call_mcp_tool("get_market_summary", {})

            context = "Overall market conditions and major indices analysis"
            summary = self.summarize_with_llm(market_data, context)

            return f"=== Market Overview ===\n\n{summary}\n\n=== Raw Data ===\n{market_data}"

        except Exception as e:
            return f"Error getting market overview: {str(e)}"
        
    async def generate_summary(self, data: str, context: str = "") -> str:
        try:
            await self.connect_to_mcp_server()

            analysis = await self.analyze_stock("AAPL")

            market_overview = await self.market_overview()

            return analysis, market_overview

        except Exception as e:
            return f"Error generating summary: {str(e)}"
        
        finally:
            await self.cleanup()


# Example usage
async def main():
    # Initialize the client
    client = YahooFinanceMCPClient()

    # Connect to MCP server
    server_path = "../mcp/yahoo_finance_mcp.py"

    try:
        # Connect to MCP server
        await client.connect_to_mcp_server()

        # Analyze a single stock
        analysis = await client.analyze_stock("AAPL")

        # Market overview
        market = await client.market_overview()

    except Exception as e:
        print(f"Error: {str(e)}")
    finally:
        # Clean up connection
        await client.cleanup()


if __name__ == "__main__":
    asyncio.run(main())
