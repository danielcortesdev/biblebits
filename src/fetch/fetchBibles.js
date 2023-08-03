async function fetchBibles() {
  const FETCH_OPTIONS = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "api-key": import.meta.env.VITE_API_KEY,
    },
  };

  const response = await fetch(
    `https://api.scripture.api.bible/v1/bibles?language=${"spa"}`,
    FETCH_OPTIONS,
  );

  if (!response.ok) throw new Error("Bibles fetching failed");
  else return response.json();
}

export default fetchBibles;
