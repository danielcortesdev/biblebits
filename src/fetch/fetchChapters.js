async function fetchChapters(bibleId, bookId) {
  const FETCH_OPTIONS = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "api-key": import.meta.env.VITE_API_KEY,
    },
  };

  const response = await fetch(
    `https://api.scripture.api.bible/v1/bibles/${bibleId}/books/${bookId}/chapters`,
    FETCH_OPTIONS,
  );

  if (!response.ok) {
    console.error("Fetch chapters failed, refetching...");
    fetchChapters(bibleId, bookId, FETCH_OPTIONS);
  } else {
    const { data } = await response.json();
    
    return data;
  }
}

export default fetchChapters;
