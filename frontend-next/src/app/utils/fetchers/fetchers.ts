
export const fetcher = async (url: string, queryParams: object) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(queryParams),
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
  
    return response.json();
  };