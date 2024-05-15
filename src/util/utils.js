export default async function fetchData(route, settings = {}) {
  try {
      const response = await fetch(route, {
          headers: {
              Accept: 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
            ...settings
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error);
      }

      const responseData = await response.json();
      return responseData;
  } catch (error) {
      throw new Error(error.message);
  }
}

