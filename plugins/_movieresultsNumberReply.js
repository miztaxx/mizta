import fetch from 'node-fetch';
 

// const handler = async (m, { conn, text, command, usedPrefix, quoted }) => {
// //  if(!m.quoted) return 

// const Id= m.message?.extendedTextMessage?.contextInfo?.stanzaId 
// console.log("im : " , Id)
// if(!Id) return  
//   // Handle numeric reply for fetching movie details
//   const userReply = m.text.trim(); // Get the user's message
//   console.log("i'm here")
//   if(globalThis.globalMovies[m.sender]){
//   if (!isNaN(userReply) && globalThis.globalMovies[m.sender][Id]) {
//     const selectedNumber  = parseInt(userReply) - 1; // Convert to 0-based index


//     if(globalThis.globalMovies[m.sender][Id].type === "moviesearch"){
//     const userMovies = globalThis.globalMovies[m.sender][Id].data; // Retrieve stored movies for this user
// console.log("here i am")
// console.log(userMovies)
// const  movieIndex = selectedNumber
//     // Validate the userMovies array and the movie index
//     if (!Array.isArray(userMovies) || userMovies.length === 0) {
//       return m.reply("No movies found. Please perform a search again.");
//     }
//     if (movieIndex < 0 || movieIndex >= userMovies.length) {
//       return m.reply("Invalid movie number. Please select a valid movie from the list.");
//     }

//     const movie = userMovies[movieIndex]; 
//     const movieDetailsUrl = `https://cinesubz.mizta-x.com/movie-details?url=${movie.movieLink}`;

//     try {
//       // Fetch detailed movie information
//       const response = await fetch(movieDetailsUrl);
//       const details = await response.json();

//       // Validate the response structure
//       if (!details || !details.title || !details.downloadLinks) {
//         return m.reply("An error occurred while fetching movie details. Please try again later.");
//       }

//       // Build the detailed message
//       let message = `🎬 *Title:* ${details.title}\n\n`;
//       message += `📜 *Description:*\n${details.description}\n\n`;
//       message += `📅 *Release Date:*\n${details.releaseDate}\n\n`;
//       message += `🌍 *Country:*\n${details.country}\n\n`;
//       message += `⏱️ *Runtime:*\n${details.runtime}\n\n`;
//       message += `🎭 *Genres:*\n${details.genres.join(", ")}\n\n`;
//       message += `⬇️ *Download Links:*\n`;

//       details.downloadLinks.forEach((link, index) => {
//         message += `   *${index + 1}. ${link.quality} (${link.size})* - [Download](${link.link})\n`;
//       });

//       // Send the image and message
//       await conn.sendMessage(
//         m.chat,
//         {
//           image: { url: details.image },
//           caption: message.trim(),
//         },
//         { quoted: m }
//       );
//     } catch (e) {
//       console.error("Error fetching movie details:", e);
//       return m.reply("An error occurred while fetching movie details. Please try again later.");
//     }
//   }else{
//     console.log("here2 i am")
//   }


//   } else if (!isNaN(userReply) && !globalThis.globalMovies[m.sender][Id]) {
//     return  
//   } 




// }else{ 
//   return m.reply("No number reply commands found for your session.");
// }
// }

// // Plugin metadata
// // handler.help = ['moviesearch'];
// // handler.tags = ['tools', 'movies'];
 


 


const handler = async (m, { conn, text, command, usedPrefix, quoted }) => { 
  const Id= m.message?.extendedTextMessage?.contextInfo?.stanzaId  
 
if(!Id) return 
 let message =m.message?.extendedTextMessage?.text
 if(!message) return 
//  if (isNaN(message)) return;
  if(!global.globalMovies[Id]) return    
  if(global.globalMovies[Id].type === "moviesearch"){   

 if (isNaN(message)) return
 const selectedNumber  = parseInt(message) - 1;
  const movieIndex = selectedNumber;
  
  const userMovies = global.globalMovies[Id].data; 
  if (!Array.isArray(userMovies) || userMovies.length === 0) {
    return m.reply("No movies found. Please perform a search again.");
  }
  if (movieIndex < 0 || movieIndex >= userMovies.length) {
    return m.reply("Invalid movie number. Please select a valid movie from the list.");
  }

  const movie = userMovies[movieIndex]; 
  if(movie.movieLink?.includes("tvshows")){
     
    // tvshow ekk 
m.reply("not implemented for tv shows")
  }else   if(movie.movieLink?.includes("movies")){
  
  const movieDetailsUrl = `https://cinesubz.mizta-x.com/movie-details?url=${movie.movieLink}`;

  try {
    // Fetch detailed movie information
    const response = await fetch(movieDetailsUrl);
    const details = await response.json();

    // Validate the response structure
    if (!details || !details.title || !details.downloadLinks) {
      console.log(details);
      
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
  }else   if(movie.movieLink?.includes("episodes")){

    // episodes
    m.reply("not implemented for episodes")
  }else{
    m.reply("unsupported type")
  }

  }else if(global.globalMovies[Id].type === "moviedata"){

// movie data wlata adala eka methana gahapn. me wgema anith ewath.............

  }else{
    return
  }

};

handler.numberReply = true;
handler.command = /^\d+(\.\d+)?$/
export default handler;
