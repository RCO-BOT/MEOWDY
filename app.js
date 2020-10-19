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
app.get(`/members/:id/mod`, async (req, res) => {
    let {id} = req.params;
    if(!id) return res.json({status: false, mod: 0});
    let guild = client.guilds.cache.get(process.env.GUILD_ID);
    if(!guild) return res.json({status: false, mod: 0});
    let member = guild.members.cache.get(id);
    if(!member) member = await guild.members.fetch(id, true).catch(() => null);
    if(!member) return res.json({status: false, mod: 0});
    if(member.roles.cache.has(process.env.MOD_ROLE)) return res.json({status: true, mod: 1});
    return res.json({status: false, mod: 0});
})

app.get(`/admins`, async (req, res) => {
    
    let val = client.users.cache.get("248947473161256972")
    let chif = client.users.cache.get("288450828837322764")

    let valAvatarLink = `https://cdn.discordapp.com/avatars/${val.id}/${val.avatar}.webp`
    let chifAvatarLink = `https://cdn.discordapp.com/avatars/${chif.id}/${chif.avatar}.webp`

    if(!valAvatarLink && !chifAvatarLink) return res.json({status: false, msg: "broken avatar links"})
    return res.json({
        VAL: valAvatarLink, 
        CHIF: chifAvatarLink
    })
})

app.get(`/members/:id/webtester`, async (req, res) => {
    let {id} = req.params;
    if(!id) return res.json({status: false, webTester: 0});
    let guild = client.guilds.cache.get(process.env.GUILD_ID);
    if(!guild) return res.json({status: false, webTester: 0});
    let member = guild.members.cache.get(id);
    if(!member) member = await guild.members.fetch(id, true).catch(() => null);
    if(!member) return res.json({status: false, webTester: 0});
    if(member.roles.cache.has(process.env.WEBTESTER_ROLE)) return res.json({status: true, webTester: 1});
    return res.json({status: false, webTester: 0});
})

app.get(`/serverMods`, async (req, res) => {
    let members = client.guilds.cache.get(process.env.GUILD_ID).roles.cache.get("746519293063331881").members.array();
    
    let mods = [];
    for (const member of members){
        mods.push({
            username: member.user.username,
            tag: member.user.tag,
            id: member.user.id,
            discriminator: member.user.discriminator,
            bot: member.user.bot,
            avatarURL: member.user.displayAvatarURL({dynamic: true, format: "png"}),
            displayAvatarURL: member.user.displayAvatarURL({dynamic: true, format: "png"})
        })
    }
    return res.json({status: true, moderators: mods})
})

app.get(`/members/:id/donator`, async (req, res) => {
    let {id} = req.params;
    if(!id) return res.json({status: false, donator: 0});
    let guild = client.guilds.cache.get(process.env.GUILD_ID);
    if(!guild) return res.json({status: false, donator: 0});
    let member = guild.members.cache.get(id);
    if(!member) member = await guild.members.fetch(id, true).catch(() => null);
    if(!member) return res.json({status: false, donator: 0});
    if(member.roles.cache.has(process.env.DONATOR_ROLE)) return res.json({status: true, donator: 1});
    return res.json({status: false, donator: 0});
})

app.listen(PORT, () => console.log(`API started on port: ${PORT}`));

