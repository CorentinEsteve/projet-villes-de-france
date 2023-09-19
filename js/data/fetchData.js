// Fetches data from given endpoint and returns it as JSON
export const fetchData = async (endpoint) => {
    const response = await fetch(endpoint);
    return response.json();
}