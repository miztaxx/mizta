import axios from 'axios';
import cheerio from 'cheerio';
import { generateWAMessageFromContent } from "baileys";
import { tiktokdl } from '@bochilteam/scraper';

let tiktok;
import('@xct007/frieren-scraper')
  .then((module) => {
    tiktok = module.tiktok;
  })
  .catch((error) => {
    console.error('Failed to import "@xct007/frieren-scraper".');
  });

const handler = async (m, { conn, text, args, usedPrefix, command }) => {
  if (!text) throw `Please provide a valid TikTok URL! Example: _${usedPrefix + command} https://vt.tiktok.com/ZS6pwFLBM/_`;

  if (!/(?:https:?\/{2})?(?:w{3}|vm|vt|t)?\.?tiktok.com\/([^\s&]+)/gi.test(text)) {
    throw `Invalid TikTok URL! Example: _${usedPrefix + command} https://vt.tiktok.com/ZS6pwFLBM/_`;
  }

  const messageContent = `> 🍄 : Downloading youre tiktok video !`;

  try {
    const aa = { quoted: m, userJid: conn.user.jid };
    const prep = generateWAMessageFromContent(
      m.chat,
      {
        extendedTextMessage: {
          text: messageContent,
          contextInfo: {
            externalAdReply: {
              title: 'ᴍɪᴢᴛʏ ʙᴇᴛᴀ 🌙',
              thumbnail: imagen1,
              sourceUrl: 'https://mizta-x.com',
            },
            mentionedJid: [m.sender],
          },
        },
      },
      aa
    );

    await conn.relayMessage(m.chat, prep.message, { messageId: prep.key.id, mentions: [m.sender] });

    const dataFn = await conn.getFile(`${global.MyApiRestBaseUrl}/api/tiktokv2?url=${args[0]}&apikey=${global.MyApiRestApikey}`);
    const caption = `Here is your video! Use _${usedPrefix}tomp3_ to extract audio if needed.`;
    await conn.sendMessage(m.chat, { video: dataFn.data, caption }, { quoted: m });
  } catch (error) {
    await handleFallbacks(m, conn, args, usedPrefix, command);
  }
};

handler.command = /^(tiktok|ttdl|tiktokdl|tiktoknowm|tt|ttnowm|tiktokaudio)$/i;
export default handler;

async function handleFallbacks(m, conn, args, usedPrefix, command) {
  try {
    const dataF = await tiktok.v1(args[0]);
    const caption = `🍄 : Here Is Youre Video\n\n> ꜱɪᴍᴘʟᴇ ɪꜱ ʙᴇᴀᴜᴛʏ 🌙`;
    await conn.sendMessage(m.chat, { video: { url: dataF.play }, caption }, { quoted: m });
  } catch (e1) {
    try {
      const tTiktok = await tiktokdlF(args[0]);
      const caption = `Here is your video! Use _${usedPrefix}tomp3_ to extract audio if needed.`;
      await conn.sendMessage(m.chat, { video: { url: tTiktok.video }, caption }, { quoted: m });
    } catch (e2) {
      try {
        const { author: { nickname }, video } = await tiktokdl(args[0]);
        const url = video.no_watermark2 || video.no_watermark || `https://tikcdn.net${video.no_watermark_raw}` || video.no_watermark_hd;
        const caption = `🍄 : Here Is Youre Video\n\n> ꜱɪᴍᴘʟᴇ ɪꜱ ʙᴇᴀᴜᴛʏ 🌙`;
        await conn.sendMessage(m.chat, { video: { url }, caption }, { quoted: m });
      } catch {
        throw `Failed to download the video. Please ensure the URL is correct or try again later.`;
      }
    }
  }
}

async function tiktokdlF(url) {
  if (!/tiktok/.test(url)) return `Invalid TikTok URL! Example: _${usedPrefix + command} https://vt.tiktok.com/ZS6pwFLBM/_`;

  const response = await axios.get('https://tikdown.org/id');
  const $ = cheerio.load(response.data);
  const token = $('#download-form > input[type=hidden]:nth-child(2)').attr('value');

  const params = new URLSearchParams({ url, _token: token });
  const { data } = await axios.post('https://tikdown.org/getAjax?', params.toString(), {
    headers: {
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'user-agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.88 Safari/537.36',
    },
  });

  if (data.status) {
    const result = cheerio.load(data.html);
    return {
      status: true,
      thumbnail: result('img').attr('src'),
      video: result('div.download-links > div:nth-child(1) > a').attr('href'),
      audio: result('div.download-links > div:nth-child(2) > a').attr('href'),
    };
  }
  return { status: false };
}
