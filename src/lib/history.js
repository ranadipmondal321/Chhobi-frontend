export const addToHistory = async ({ mediaId, mediaType, title, poster_path, release_date }) => {
  try {
    await fetch(`${import.meta.env.VITE_API_URL}/api/history/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ mediaId, mediaType, title, poster_path, release_date }),
    });
  } catch (err) {
    console.error("Failed to add to history", err);
  }
};