import fetch from 'node-fetch';

global.globalMovies = global.globalMovies || {}; // Ensure it doesn't get reinitialized

const handler = async (m, { conn, text, command, usedPrefix, quoted }) => {
  // Handle the movie-related commands
  if (['moviesearch', 'mv', 'movie', 'film', 'filmsearch'].includes(command)) {
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
      const searchResults = data.results;
      const masdata = {
        type: "moviesearch",
        data: searchResults,
      };

      if (!global.globalMovies[m.key.id]) {
        global.globalMovies[m.key.id] = {};
      }
      global.globalMovies[m.key.id] = masdata;

      // Format the search results message
      let message = `⚡ *Movie Results For:* "${text}" ⚡\n\n*°☘️ Please reply with the number of the movie you want* \n\n`;
      searchResults.forEach((movie, index) => {
        message += `*${index + 1} | ${movie.title}*\n`;
        message += `▢ *Rating:* ${movie.rating}\n`;
        message += `▢ *Year:* ${movie.year}\n`;
        message += `▢ *URL:* ${movie.movieLink}\n\n`;
        message += `> ꜱɪᴍᴘʟᴇ ɪꜱ ʙᴇᴀᴜᴛʏ 🌙\n\n`;
      });

      const mas = await m.reply(message.trim());
    } catch (e) {
      console.error("Error during movie search:", e);
      return m.reply(e.message || "An error occurred while searching for movies. Please try again later.");
    }
  }
};

// Plugin metadata
handler.help = ['moviesearch', 'mv', 'movie', 'film', 'filmsearch'];
handler.tags = ['tools', 'movies'];
handler.command = /^(moviesearch|mv|movie|film|filmsearch)$/i; // Triggers for all the commands

export default handler;
