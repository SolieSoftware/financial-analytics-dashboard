import asyncio
import json
from mcp.client.stdio import stdio_client
from mcp import ClientSession, StdioServerParameters


async def test_mcp_service():
    # Connect to the MCP server

    server_params = StdioServerParameters(
        command="python",
        args=["mcp_servers/financial_datasets_api_assistant.py"],
        env=None
        )
    

    try:
        # Connect to the MCP server with proper parameter structure
        async with stdio_client(server_params) as (read, write):
            # Create a ClientSession using the read/write streams
            async with ClientSession(read, write) as session:
                # Initialize the session
                await session.initialize()
                
                # List available tools
                tools_response = await session.list_tools()
                print("Available tools:")
                for tool in tools_response.tools:
                    print(f"  - {tool.name}: {tool.description}")
                
                # Test get_income_statements tool
                print("\nTesting get_income_statements...")
                try:
                    result = await session.call_tool(
                        "get_income_statements", 
                        {"ticker": "AAPL", "period": "annual", "limit": 5}
                    )
                    
                    # Handle the result properly
                    if result.content:
                        for content_item in result.content:
                            if hasattr(content_item, 'text'):
                                print(f"Result: {content_item.text[:200]}...")
                            elif hasattr(content_item, 'data'):
                                print(f"Result data: {str(content_item.data)[:200]}...")
                    else:
                        print("No content in result")
                        
                except Exception as tool_error:
                    print(f"Error calling tool: {tool_error}")
                
                # Test additional capabilities if available
                try:
                    # List resources (if your server provides any)
                    resources_response = await session.list_resources()
                    if resources_response.resources:
                        print(f"\nAvailable resources: {len(resources_response.resources)}")
                        for resource in resources_response.resources:
                            print(f"  - {resource.uri}: {resource.name}")
                except Exception as e:
                    print(f"No resources available or error listing resources: {e}")
                
                try:
                    # List prompts (if your server provides any)
                    prompts_response = await session.list_prompts()
                    if prompts_response.prompts:
                        print(f"\nAvailable prompts: {len(prompts_response.prompts)}")
                        for prompt in prompts_response.prompts:
                            print(f"  - {prompt.name}: {prompt.description}")
                except Exception as e:
                    print(f"No prompts available or error listing prompts: {e}")
                    
    except Exception as connection_error:
        print(f"Error connecting to MCP server: {connection_error}")
        print("Make sure your server script exists and is executable")


if __name__ == "__main__":
    asyncio.run(test_mcp_service())
