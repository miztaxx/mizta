import { performance } from "perf_hooks";
import fs from "fs";
import path from "path";

const handler = async (m, { conn, usedPrefix }) => {
  try {
    // System and bot information
    const _uptime = process.uptime() * 1000;
    const uptime = clockString(_uptime);
    const totalusrReg = Object.values(global.db.data.users).filter(
      (user) => user.registered == true
    ).length;
    const totalusr = Object.keys(global.db.data.users).length;
    const chats = Object.entries(conn.chats).filter(
      ([id, data]) => id && data.isChats
    );
    const groupsIn = chats.filter(([id]) => id.endsWith("@g.us"));
    const groups = chats.filter(([id]) => id.endsWith("@g.us"));
    const used = process.memoryUsage();
    const { restrict, antiCall, antiprivado, modejadibot } =
      global.db.data.settings[conn.user.jid] || {};
    const { autoread, gconly, pconly, self } = global.opts || {};
    const old = performance.now();
    const neww = performance.now();
    const rtime = (neww - old).toFixed(7);

    // Bot metadata
    const wm = "ᴍɪᴢᴛʏ ʙᴇᴛᴀ 🌙";
    const imagen1 = global.imagen1 || null; // Ensure imagen1 is defined
    const info = `

  🍄: *ᴏᴡɴᴇʀ* : MIZTA CLOUD\n
  🍒: *ᴄᴏɴᴛᴀᴄᴛ* : +94774533771\n
  🍄: *ᴀʙᴏᴜᴛ ᴜꜱ* : https://mizta-x.com\n\n
  ⚡: *PING : ${rtime}*\n\n
  🍄: *Uptime :* ${uptime}\n
  🍒: *Used Prefix :* ${usedPrefix}\n
  🍄: *Bot Mood :* ${self ? "privet" : "public"}\n\n
  🍒: *Auto Read :* ${autoread ? "active" : "deactive"}\n
  🍄: *Restrict :* ${restrict ? "active" : "deactive"}\n
  🍒: *Personal only :*  ${pconly ? "active" : "deactive"}\n
  🍄: *Group only :* ${gconly ? "active" : "deactive"}\n\n> ꜱɪᴍᴘʟᴇ ɪꜱ ʙᴇᴀᴜᴛʏ 🌙`;

    // Document types
    const doc = [
      "pdf",
      "zip",
      "vnd.openxmlformats-officedocument.presentationml.presentation",
      "vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const document = doc[Math.floor(Math.random() * doc.length)];

    // Message payload
    const Message = {
      document: { url: `https://whatsapp.com/channel/0029Vb3KvHc4inoqAMpdKz03` },
      mimetype: `application/${document}`,
      fileName: `ꜱɪᴍᴘʟᴇ ɪꜱ ʙᴇᴀᴜᴛʏ 🌙`,
      fileLength: 99999999999999,
      pageCount: 200,
      contextInfo: {
        forwardingScore: 200,
        isForwarded: true,
        externalAdReply: {
          mediaUrl: "https://whatsapp.com/channel/0029Vb3KvHc4inoqAMpdKz03",
          mediaType: 2,
          previewType: "pdf",
          title: "The Mystic - Bot",
          body: wm,
          thumbnail: imagen1,
          sourceUrl: "https://whatsapp.com/channel/0029Vb3KvHc4inoqAMpdKz03",
        },
      },
      caption: info,
      footer: wm,
      headerType: 6,
    };

    // Send the message
    await conn.sendMessage(m.chat, Message, { quoted: m });
  } catch (error) {
    console.error("Error in ping/info handler:", error);
    m.reply("An error occurred while processing your request. Please try again later.");
  }
};

handler.command = /^(ping|info|status|estado|infobot)$/i;
export default handler;

// Helper function to format uptime
function clockString(ms) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor(ms / 60000) % 60;
  const s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map((v) => v.toString().padStart(2, 0)).join(":");
}
