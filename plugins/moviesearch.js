import fetch from 'node-fetch';

global.globalMovies = global.globalMovies || {}; // Ensure it doesn't get reinitialized


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

      // Format the search results message
      let message = `🎥 *Search Results for:* "${text}"\n\n`;
      data.results.forEach((movie, index) => {
        message += `*${index + 1} ${movie.title}*\n`;
        message += `⭐ *Rating:*\n   ${movie.rating}\n`;
        message += `📅 *Year:*\n   ${movie.year}\n`;
        message += `📜 *Description:*\n   ${movie.description.trim().slice(0, 300)}...\n`;
        message += `🔗 *Link:*\n   ${movie.movieLink}\n\n`;
        message += `───────────────────────────────\n\n`;
      });

      const mas = await m.reply(message.trim()); 
      const masdata = {}
      masdata.type = "moviesearch"
      masdata.data =      data.results
     if(!global.globalMovies[mas.key.id]){
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
handler.help = ['moviesearch'];
handler.tags = ['tools', 'movies'];
handler.command = /^moviesearch$/i; // Trigger for the movie search

export default handler;
