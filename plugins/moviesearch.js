import fetch from 'node-fetch';

global.globalMovies = global.globalMovies || {}; // Ensure it doesn't get reinitialized

const handler = async (m, { conn, text, command, usedPrefix, quoted }) => {
  // Handle the "moviesearch" command and its aliases
  if (/^(moviesearch|mv|movies|movie|film|filmsearch)$/i.test(command)) {
    if (!text) throw `Please provide a movie name to search. Example: ${usedPrefix}moviesearch Inception`;

    try {
      // Fetch movie search results
      const apiUrl = `https://cinesubz.mizta-x.com/movie-search?name=${encodeURIComponent(text)}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      // Validate the response structure
      if (!data || !data.results || !Array.isArray(data.results) || data.results.length === 0) {
        throw `Sorry, no movies were found for "${text}".`;
      }

      // Format the search results message
      let message = `°🍄 : *Search Results for:* "${text}"\n\n`;
      data.results.forEach((movie, index) => {
        message += `*${index + 1}. ${movie.title}*\n\n`;
        message += `°🍒 : *Rating:* ${movie.rating}\n\n`;
        message += `°🍄 : *Year:* ${movie.year}\n\n`;
        //message += `📜 *Description:* ${movie.description.trim().slice(0, 300)}...\n`;
        message += `°⚡ : *Link:*\n\n  ${movie.movieLink}\n\n`;
        message += `> ─────────ᴍɪᴢᴛʏ 🌙─────────\n\n`;
      });

      const mas = await m.reply(message.trim()); 
      const masdata = {}
      masdata.type = "moviesearch"
      masdata.data = data.results
      if (!global.globalMovies[mas.key.id]) {
        global.globalMovies[mas.key.id] = {}
      }
      global.globalMovies[mas.key.id] = masdata
    } catch (e) {
      console.error("Error during movie search:", e);
      return m.reply(e.message || "An error occurred while searching for movies. Please try again later.");
    }
  }
};

// Plugin metadata
handler.help = ['moviesearch (mv, movies, movie, film, filmsearch)'];
handler.tags = ['tools', 'movies'];
handler.command = /^(moviesearch|mv|movies|movie|film|filmsearch)$/i; // Triggers for the movie search

export default handler;
