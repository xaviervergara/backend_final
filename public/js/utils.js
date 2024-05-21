// let resource_url;

async function fetchResourceUrl() {
  try {
    const response = await fetch('http://localhost:8080/api/resources-url', {
      method: 'GET',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export default fetchResourceUrl;
