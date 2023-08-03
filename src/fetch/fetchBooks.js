async function fetchBooks(bibleId) {
  const FETCH_OPTIONS = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "api-key": import.meta.env.VITE_API_KEY,
    },
  };

  const response = await fetch(
    `https://api.scripture.api.bible/v1/bibles/${bibleId}/books`,
    FETCH_OPTIONS,
  );

  if (!response.ok) {
    console.error("Fetch books failed, refetching...");
    fetchBooks(bibleId, FETCH_OPTIONS);
  } else {
    const { data } = await response.json();
    return data;
  }
}

export default fetchBooks;
