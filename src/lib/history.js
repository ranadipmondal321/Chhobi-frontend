import { API_URL } from "./api";

export const addToHistory = async ({ mediaId, mediaType, title, poster_path, release_date }) => {
  try {
    await fetch(`${API_URL}/history/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ mediaId, mediaType, title, poster_path, release_date }),
    });
  } catch (err) {
    console.error("Failed to add to history", err);
  }
};
