import fetch from 'node-fetch';

let globalMovies = {}; // Store search results globally for each user

const handler = async (m, { conn, text, command, usedPrefix, quoted }) => {
  // Handle the "moviesearch" command
  if (command === 'moviesearch') {
    if (!text) throw `Please provide a movie name to search. Example: ${usedPrefix + command} Inception`;

    try {
      // Fetch movie search results
      const apiUrl = `https://cinesubz.mizta-x.com/movie-search?name=${encodeURIComponent(text)}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      // Validate the response structure
      if (!data || !data.results || !Array.isArray(data.results) || data.results.length === 0) {
        throw `Sorry, no movies were found for "${text}".`;
      }

      // Save the results for this user globally
      globalMovies[m.sender] = data.results;

      // Format the search results message
      let message = `🎥 *Search Results for:* "${text}"\n\n`;
      data.results.forEach((movie, index) => {
        message += `*${index + 1}. ${movie.title}*\n`;
        message += `⭐ *Rating:*\n   ${movie.rating}\n`;
        message += `📅 *Year:*\n   ${movie.year}\n`;
        message += `📜 *Description:*\n   ${movie.description.trim().slice(0, 300)}...\n`;
        message += `🔗 *Link:*\n   ${movie.movieLink}\n\n`;
        message += `───────────────────────────────\n\n`;
      });

      await m.reply(message.trim());
    } catch (e) {
      console.error("Error during movie search:", e);
      return m.reply(e.message || "An error occurred while searching for movies. Please try again later.");
    }
  }

  // Handle numeric reply for fetching movie details
  const userReply = m.text.trim(); // Get the user's message
  if (!isNaN(userReply) && globalMovies[m.sender]) {
    const movieIndex = parseInt(userReply) - 1; // Convert to 0-based index
    const userMovies = globalMovies[m.sender]; // Retrieve stored movies for this user

    // Validate the userMovies array and the movie index
    if (!Array.isArray(userMovies) || userMovies.length === 0) {
      return m.reply("No movies found. Please perform a search again.");
    }
    if (movieIndex < 0 || movieIndex >= userMovies.length) {
      return m.reply("Invalid movie number. Please select a valid movie from the list.");
    }

    const movie = userMovies[movieIndex];
    const movieDetailsUrl = `https://cinesubz.mizta-x.com/movie-details?url=${movie.movieLink}`;

    try {
      // Fetch detailed movie information
      const response = await fetch(movieDetailsUrl);
      const details = await response.json();

      // Validate the response structure
      if (!details || !details.title || !details.downloadLinks) {
        return m.reply("An error occurred while fetching movie details. Please try again later.");
      }

      // Build the detailed message
      let message = `🎬 *Title:* ${details.title}\n\n`;
      message += `📜 *Description:*\n${details.description}\n\n`;
      message += `📅 *Release Date:*\n${details.releaseDate}\n\n`;
      message += `🌍 *Country:*\n${details.country}\n\n`;
      message += `⏱️ *Runtime:*\n${details.runtime}\n\n`;
      message += `🎭 *Genres:*\n${details.genres.join(", ")}\n\n`;
      message += `⬇️ *Download Links:*\n`;

      details.downloadLinks.forEach((link, index) => {
        message += `   *${index + 1}. ${link.quality} (${link.size})* - [Download](${link.link})\n`;
      });

      // Send the image and message
      await conn.sendMessage(
        m.chat,
        {
          image: { url: details.image },
          caption: message.trim(),
        },
        { quoted: m }
      );
    } catch (e) {
      console.error("Error fetching movie details:", e);
      return m.reply("An error occurred while fetching movie details. Please try again later.");
    }
  } else if (!isNaN(userReply) && !globalMovies[m.sender]) {
    return m.reply("No movies found for your session. Please perform a search again.");
  }
};

// Plugin metadata
handler.help = ['moviesearch'];
handler.tags = ['tools', 'movies'];
handler.command = /^moviesearch$/i; // Trigger for the movie search

export default handler;
