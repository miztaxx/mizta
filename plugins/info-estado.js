import { generateWAMessageFromContent } from "baileys";
import os from "os";
import util from "util";
import sizeFormatter from "human-readable";
import MessageType from "baileys";
import fs from "fs";
import { performance } from "perf_hooks";

const handler = async (m, { conn, usedPrefix }) => {
  const datas = global
  const idioma = datas.db.data.users[m.sender].language || global.defaultLenguaje
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`))
  const tradutor = _translate.plugins.info_estado

  const _uptime = process.uptime() * 1000;
  const uptime = clockString(_uptime);
  const totalusrReg = Object.values(global.db.data.users).filter((user) => user.registered == true).length;
  const totalusr = Object.keys(global.db.data.users).length;
  const chats = Object.entries(conn.chats).filter(
    ([id, data]) => id && data.isChats,
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
  const wm = 'ᴍɪᴢᴛʏ ʙᴇᴛᴀ 🌙';
  const info = ` ɪɴꜰᴏ 

  🍄 ᴏᴡɴᴇʀ - ᴍɪᴢᴛᴀ 
  🍒 ᴄᴏɴᴛᴀᴄᴛ - +94774533771
  🍄 ᴀʙᴏᴜᴛ ᴜꜱ - https://mizta-x.com

  ⚡ PING: ${rtime}
  🍄 Uptime: ${uptime}
  🍒 Used Prefix: ${usedPrefix}
  🍄 Bot Mood: ${self ? "privet" : "public"}
  
  🍒 Auto Read: ${autoread ? "active" : "deactive"}
  🍄 Restrict : ${restrict ? "active" : "deactive"}
  🍒 Personal only:  ${pconly ? "active" : "deactive"}
  🍄 Group only: ${gconly ? "active" : "deactive"}\n\n> ꜱɪᴍᴘʟᴇ ɪꜱ ʙᴇᴀᴜᴛʏ 🌙
  const doc = [
    "pdf",
    "zip",
    "vnd.openxmlformats-officedocument.presentationml.presentation",
    "vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const document = doc[Math.floor(Math.random() * doc.length)];
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
        body: tradutor.texto2,
        thumbnail: imagen1,
        sourceUrl: "https://whatsapp.com/channel/0029Vb3KvHc4inoqAMpdKz03",
      },
    },
    caption: info,
    footer: wm,
    headerType: 6,
  };
  conn.sendMessage(m.chat, Message, { quoted: m });
};

handler.command = /^(ping|info|status|estado|infobot)$/i;
export default handler;

function clockString(ms) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor(ms / 60000) % 60;
  const s = Math.floor(ms / 1000) % 60;
  console.log({ ms, h, m, s });
  return [h, m, s].map((v) => v.toString().padStart(2, 0)).join(":");
}
