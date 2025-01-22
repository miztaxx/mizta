import fetch from 'node-fetch'; 
import fg from 'api-dylux';
 
const handler = async (m, { conn, text, command, usedPrefix, quoted }) => { 
  const Id= m.message?.extendedTextMessage?.contextInfo?.stanzaId  
 
if(!Id) return //  message ekak quote krala naththan e msg eka ignore kranawa,
 let message =m.message?.extendedTextMessage?.text
 if(!message) return  // message eke text eka detect karaganna barinam e msg eka ignore kranawa,
 
  if(!global.globalMovies[Id]) return     // quote karapu msg eke id eka globalMovies array eke naththan return karanawa

  if(global.globalMovies[Id].type === "moviesearch"){   // quote karapu message eka movie ekak search karapu ekak

 if (isNaN(message)) return // number ekak nemeinm return karanawa.

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
    
    await handleMovies(conn,m,movie)

  }else   if(movie.movieLink?.includes("episodes")){

    // episodes
    m.reply("not implemented for episodes")
  }else{
    m.reply("unsupported type")
  }

  }else if(global.globalMovies[Id].type === "moviedownload"){

    if (isNaN(message)) return // number ekak nemeinm return karanawa.

    const selectedNumber  = parseInt(message) - 1;
     const movieIndex = selectedNumber;
     
     const userMovie = global.globalMovies[Id].data; 
      if (!userMovie) {
        return m.reply("No movies found. Please perform a search again.");
      }

      if (movieIndex < 0 || movieIndex >= userMovie.downloadLinks.length) {
        return m.reply("Invalid number. Please select a valid quality from the list.");
      }

      const data = userMovie.downloadLinks[movieIndex];
      const title = userMovie.title;
      await downloadMovie(conn,m,data,title)

  }else{
    return
  }

};

handler.numberReply = true;
handler.command = /^\d+(\.\d+)?$/
export default handler;

const handleMovies = async(conn,m,movie)=>{
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
    message += `▢ *Description:*\n${details.description}\n\n`;
    message += `▢ *Release Date:*\n${details.releaseDate}\n\n`;
    message += `▢ *Country:*\n${details.country}\n\n`;
    message += `▢ *Runtime:*\n${details.runtime}\n\n`;
    message += `▢ *Genres:*\n${details.genres.join(", ")}\n\n`;
    message += `▢ *Download Links:*\n`;
   
    details.downloadLinks.forEach((link, index) => { 
      message += `   *${index+1} ${link.quality} [ ${link.size} ]*\n`; 
   
   
  });
   
    message += `\n> ꜱɪᴍᴘʟᴇ ɪꜱ ʙᴇᴀᴜᴛʏ 🌙`;


    // Send the image and message
    const mas = await conn.sendMessage(
      m.chat,
      {
        image: { url: details.image },
        caption: message.trim(),
      },
      { quoted: m }
    );
    
    const masdata = {}
    masdata.type = "moviedownload"
    masdata.data =      details
   if(!global.globalMovies[mas.key.id]){
    global.globalMovies[mas.key.id] = {}
   }
    
    global.globalMovies[mas.key.id] = masdata
  } catch (e) {
    console.error("Error fetching movie details:", e);
    return m.reply("An error occurred while fetching movie details. Please try again later.");
  }
}


const downloadMovie = async(conn,m,data,title)=>{
  
  const downloadlInkUrl = `https://cinesubz.mizta-x.com/movie-direct?url=${data.link}`;
const fileName = title + +"_"+ data.quality?.trim()?.replace(" ","_")
const caption = `🎬 *Title:* ${title}\n\n> ꜱɪᴍᴘʟᴇ ɪꜱ ʙᴇᴀᴜᴛʏ 🌙`
const size = data.size
  try {

    const response = await fetch(downloadlInkUrl);
    const details = await response.json();
    const data =  details.data;

    if(data.gdriveLink && typeof data.gdriveLink === "string"){
      const link = convertToDriveLink(data.gdriveLink)
    const res = await fg.GDriveDl(link);
    if (!res || !res.downloadUrl) {
      throw new Error('Failed to fetch downloadlink.');
    } 
    
    await sendFile(conn,m,res.mimetype,caption,fileName,size,{url:res.downloadUrl})

    }else  if(data.gdriveLink2 && typeof data.gdriveLink2 === "string"){
      
      const link = convertToDriveLink(data.gdriveLink2)
      const res = await fg.GDriveDl(link);
      if (!res || !res.downloadUrl) {
        throw new Error('Failed to fetch downloadlink.');
      }

      
      await sendFile(conn,m,res.mimetype,caption,fileName,size,{url:res.downloadUrl})

    }else  if(data.directLink && typeof data.directLink === "string"){
       const buffer = await getBuffer(data.directLink)

       
       const { default: fileType } = await import('file-type');
       const type = await fileType.fromBuffer(data); 
       const mime = type?.mime;

       await sendFile(conn,m,mime,caption,fileName,size,{buffer:buffer})
    }

  } catch (e) {
    console.error("Error fetching movie details:", e);
    return m.reply("An error occurred while downloading movie. Please try again later.");
  }
}

function checkSizeAndReply(size) {
  const MAX_FILE_SIZE_MB = 2100; // 2100 MB = 2.1 GB
  if (size) {
      const unitToMB = {
          "GB": 1024,          // 1 GB = 1024 MB
          "MB": 1,             // 1 MB = 1 MB
          "KB": 1 / 1024,      // 1 KB = 0.0009765625 MB
          "TB": 1024 * 1024    // 1 TB = 1,048,576 MB
      };

      // Match the input size (e.g., "2 GB", "500 KB", "1.5 TB")
      let sizeMatch = size.match(/([\d.]+)\s*(GB|MB|KB|TB)/i);
      if (sizeMatch) {
          const numericValue = parseFloat(sizeMatch[1]); // Extract the number
          const unit = sizeMatch[2].toUpperCase(); // Extract and normalize the unit
          const sizeInMB = numericValue * unitToMB[unit]; // Convert size to MB

          // Return true if size is within the limit, otherwise false
          return sizeInMB <= MAX_FILE_SIZE_MB;
      }else{
        // Return false for invalid or missing UNIT
        return false;
      }
  }
  // Return false for invalid or missing input
  return false;
}

const sendFile = async(conn,m,mime,caption,fileName,size,{url,buffer})=>{

 
  if (!checkSizeAndReply(size)) {
    return conn.reply(
      m.chat,
      `❌ *Error: File size exceeds the limit of 2.1 GB.*\n\nFile size: ${size}, \n\n download link: ${url}`,
      m
    );
  }
if(buffer){
  await conn.sendMessage(
    m.chat,
    {
      document: buffer,
      caption: caption||"",
      mimetype: mime||"video/mp4",
    },
    { quoted: m }
  );
}else if (url){
  await conn.sendMessage(
    m.chat,
    {
      document: { url },
      caption: caption||"",
      fileName: fileName,
      mimetype: mime||"video/mp4",
    },
    { quoted: m }
  );
}else{
  await m.reply("No download link found")
}

}

const getBuffer = async (url, options) => {
  try {
    options ? options : {};
    const res = await axios({
      method: 'get',
      url,
      headers: {
        'DNT': 1,
        'Upgrade-Insecure-Request': 1,
      },
      ...options,
      responseType: 'arraybuffer',
    });
    return res.data;
  } catch (e) {
    console.log(`Error : ${e}`);
    throw e;  
  }
};



function convertToDriveLink(url) {
	const fileId = url.match(/id=([a-zA-Z0-9_-]+)/)[1];
	return `https://drive.google.com/file/d/${fileId}/view`;
}
