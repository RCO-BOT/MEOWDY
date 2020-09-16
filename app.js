require("dotenv").config()
const Discord = require("discord.js"),
      express = require("express"),
      client = new Discord.Client({
          disableMentions: "all",
          fetchAllMembers: true,
          messageCacheMaxSize: 1,
          messageCacheLifetime: 1,
          ws: {
            intents: [
                "GUILD_MEMBERS",
                "GUILDS",
                "GUILD_MESSAGES"
            ]
        }
      });
client.on("ready", () => console.log(`The bot is online!`));

client.on("message", async (msg) => {
    if(msg.author.bot || msg.channel.type === "dm") return null;
     const IFTTT = require('ifttt-webhooks-channel')
            const ifttt = new IFTTT(process.env.IFTTT_KEY)
    if(msg.content.toLowerCase().includes("m.lights on")){
          ifttt.post('light_on')
                .then(res => console.log(res))
                .catch(err => console.error(err))
                msg.channel.send(`Lights on!`)
                
    }else
    if(msg.content.toLowerCase().includes("m.lights off")){
      ifttt.post('light_off')
                .then(res => console.log(res))
                .catch(err => console.error(err))
                msg.channel.send(`Lights off!`)
    }
    })


client.login(process.env.TOKEN).catch((err) => {
    console.log(`LOGIN ISSUE\n`, err)
    return process.exit(1);
});

let PORT = process.env.PORT || 3001

const app = express()
app.use(express.json());
app.get(`/`, (req, res) => res.json({status: true, message: "Ello"}));
app.get(`/members/:id/vip`, async (req, res) => {
    let {id} = req.params;
    if(!id) return res.json({status: false, tier: 0});
    let guild = client.guilds.cache.get(process.env.GUILD_ID);
    if(!guild) return res.json({status: false, tier: 0});
    let member = guild.members.cache.get(id);
    if(!member) member = await guild.members.fetch(id, true).catch(() => null);
    if(!member) return res.json({status: false, tier: 0});
    if(member.roles.cache.has(process.env.ROLE_ONE)) return res.json({status: true, tier: 2});
    if(member.roles.cache.has(process.env.ROLE_TWO)) return res.json({status: true, tier: 1});
    return res.json({status: false, tier: 0});
})
app.listen(PORT, () => console.log(`API started on port: ${PORT}`));

