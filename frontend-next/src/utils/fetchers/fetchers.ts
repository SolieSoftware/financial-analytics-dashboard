
export const fetcher = async (url: string) => {
  console.log("url", url);
    const response = await fetch(url);
  
    if (!response.ok) {
      throw new Error(`
        HTTP error
        Status: ${response.status}
        Message: ${response.statusText}
        URL: ${url}
    `);
    }
  
    return response.json();
  };