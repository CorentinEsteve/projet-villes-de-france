// Fetches data from given endpoint and returns it as JSON
export async function fetchData(endpoint) {
    const response = await fetch(endpoint);
    return response.json();
}