// let resource_url;

async function fetchResourceUrl() {
  try {
    const response = await fetch('/api/resources-url', {
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
