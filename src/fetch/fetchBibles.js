async function fetchBibles() {
  const FETCH_OPTIONS = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "api-key": import.meta.env.VITE_API_KEY,
    },
  };

  const response = await fetch(
    `https://api.scripture.api.bible/v1/bibles`,
    FETCH_OPTIONS,
  );

  if (!response.ok) throw new Error("Bibles fetching failed");
  else {
    const { data: bibles } = await response.json();
    return bibles;
  }
}

export default fetchBibles;
