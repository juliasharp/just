export const useWordpressApi = async (query: string) => {
  const config = useRuntimeConfig();
  const { data, error } = await useFetch(config.public.wordpressUrl, {
    method: 'post',
    body: JSON.stringify({ query }),
    headers: {
      'Content-Type': 'application/json'
    },
  });

  if (error.value) {
    console.error('Error fetching data:', error.value);
    throw new Error(`Failed to fetch data: ${error.value.message}`);
  }

  if (!data.value) {
    throw new Error('No data returned from the API');
  }
  return data.value;
};