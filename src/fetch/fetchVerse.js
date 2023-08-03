async function fetchVerse(bibleId, verseId) {
  const FETCH_OPTIONS = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "api-key": import.meta.env.VITE_API_KEY,
    },
  };

  const response = await fetch(
    `https://api.scripture.api.bible/v1/bibles/${bibleId}/verses/${verseId}?content-type=${"text"}&include-notes=${false}&include-titles=${false}&include-chapter-numbers=${false}&include-verse-numbers=${false}&include-verse-spans=${false}&use-org-id=${false}`,
    FETCH_OPTIONS,
  );

  if (!response.ok) {
    console.error("Fetch verse failed, refetching...");
    fetchVerse(bibleId, verseId, FETCH_OPTIONS);
  } else return response.json();
}

export default fetchVerse;
