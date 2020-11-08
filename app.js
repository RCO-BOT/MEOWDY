require("dotenv").config()
const Discord = require("discord.js"),
      express = require("express"),
      {connect} = require("mongoose"),
      Profile = require("./database/models/profile"),
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

const error = (res, msg) => res.json({status: false, message: msg});

app.get("/status", async (req, res) => {
    return res.json({
        status: true,
        client: client.user ? true : false,
        database: require("mongoose").connections.length !== 0
    })
})


const getMember = async (userID) => { // This is a shortcut to get the member.. easier... so we don't have to define it 20 million times. 
    let guild = client.guilds.cache.get(process.env.GUILD_ID);
    if(!guild) return null;
    let member = guild.members.cache.get(userID);
    if(!member) member = await guild.members.fetch(userID, true).catch(() => null);
    if(!member) return null;
    return member;
},
    handleVote = async (user, embed = {}) => {
        let VC = client.channels.cache.get("707961112053940345");
        if(VC) VC.send({embed: embed}).catch(() => {})
        const role = async () => {
            let member = await getMember(user.id);
            if(!member) return 1000;
            let roles = {
                1: process.env.ROLE_ONE,
                2: process.env.ROLE_TWO,
            };
            if(member.roles.cache.has(roles[2])) return 30000;
            if(member.roles.cache.has(roles[1])) return 15000;
            return 3000;
        };
        let db = await Profile.findOne({id: user.id});
        if(!db) return false;
        let amount = await role();
        db.balance = Math.floor(db.balance + amount);
        db.save().catch(() => {});
        return true;
}; // This basically handles the posting and adding the balance to the user. 

// app.post("/upvote", async (req, res) => {
//     if(!client.user) return error(res, `The Meowdy bot client isn't active.`);
//     let key = req.headers["authorization"];
//     if(!key) return error(res, "You didn't provide the 'authorization' header!");
//     if(key !== process.env.ADMINKEY) return error(res, `Unauthorized`);
//     if(!req.body.user) return error(res, `You didn't provide the "user" field in the body request.`)
//     let user = await client.users.fetch(req.body.user, true).catch(() => null);
//     if(!user) return error(res, `I was unable to fetch the user information for ${req.body.user}`);

//     let vote = await handleVote(user, {
//         title: "Vote Here",
//         url: `https://top.gg/bot/${req.body.bot}/vote`,
//         color: 0xbc00ff,
//         timestamp: new Date(),
//         author: {
//             name: `New${req.body.type !== "upvote" ? " Test" : ""} Vote By: @${user.tag}`,
//             icon_url: user.displayAvatarURL({dynamic: true})
//         },  
//         footer: {
//             text: `Discord Bot List`,
//             icon_url: `https://cdn.superchiefyt.xyz/api/bot/DBL.gif`
//         }
//     });
//     if(!vote) return error(res, `No DB found for ${user.tag} (${user.id})`);
//     return res.json({
//         status: true,
//         message: `Successfully upvoted!`
//     })
// });

app.post("/upvote/dboats", async (req, res) => {
    if(!client.user) return error(res, `The Meowdy bot client isn't active.`);
    let key = req.headers["authorization"];
    if(!key) return error(res, "You didn't provide the 'authorization' header!");
    if(key !== process.env.ADMINKEY) return error(res, `Unauthorized`);
    if(!req.body.user) return error(res, `You didn't provide the "user" field in the body request.`)
    let user = await client.users.fetch(req.body.user.id, true).catch(() => null);
    if(!user) return error(res, `I was unable to fetch the user information for ${req.body.user}`);

    let vote = await handleVote(user, {
        title: "Vote Here",
        url: `${req.body.bot.url}/vote`,
        color: 0x7289DA,
        timestamp: new Date(),
        author: {
            name: `New Vote By: @${user.tag}`,
            icon_url: user.displayAvatarURL({dynamic: true})
        },  
        footer: {
            text: `Discord Boats`,
            icon_url: `https://cdn.discordapp.com/emojis/735559399614971904.png?v=1`
        }
    });
    if(!vote) return error(res, `No DB found for ${user.tag} (${user.id})`);
    return res.json({
        status: true,
        message: `Successfully upvoted!`
    })
});


app.post("/upvote/bfd", async (req, res) => {
  if(!client.user) return error(res, `The Meowdy bot client isn't active.`);
  let key = req.headers["authorization"];
  if(!key) return error(res, "You didn't provide the 'authorization' header!");
  if(key !== process.env.ADMINKEY) return error(res, `Unauthorized`);
  if(!req.body.user) return error(res, `You didn't provide the "user" field in the body request.`)
  let user = await client.users.fetch(req.body.user, true).catch(() => null);
  if(!user) return error(res, `I was unable to fetch the user information for ${req.body.user}`);

  let vote = await handleVote(user, {
      title: "Vote Here",
      url: `https://botsfordiscord.com/bot/${req.body.bot}/vote`,
      color: 0x2578fe,
      timestamp: new Date(),
      author: {
          name: `New Vote By: @${user.tag}`,
          icon_url: user.displayAvatarURL({dynamic: true})
      },  
      footer: {
          text: `Bots For Discord`,
          icon_url: `https://cdn.discordapp.com/emojis/735559564153454734.png?v=1`
      }
  });
  if(!vote) return error(res, `No DB found for ${user.tag} (${user.id})`);
  return res.json({
      status: true,
      message: `Successfully upvoted!`
  })
});


// ^------------------------------------------ UPVOTES ---------------------------------------------^







app.get(`/members/:id/vip`, async (req, res) => {
    let {id} = req.params;
    if(!id) return res.json({status: false, tier: 0});

    let member = await getMember(id);
    if(!member) return res.json({status: false, tier: 0});

    if(member.roles.cache.has(process.env.ROLE_TWO)) return res.json({status: true, tier: 2});
    if(member.roles.cache.has(process.env.ROLE_ONE)) return res.json({status: true, tier: 1});
    return res.json({status: false, tier: 0});
})

app.get(`/members/:id/mod`, async (req, res) => {
    let {id} = req.params;
    if(!id) return res.json({status: false, mod: 0});

    let member = await getMember(id);
    if(!member) return res.json({status: false, mod: 0});

    if(member.roles.cache.has(process.env.MOD_ROLE)) return res.json({status: true, mod: 1});
    return res.json({status: false, mod: 0});
})

app.get(`/admins`, async (req, res) => {
    
    let val = await client.users.fetch("248947473161256972", true)
    let chif = await client.users.fetch("288450828837322764", true)

    if(!val && !chif) return res.json({status: false, msg: "broken avatar links"});

    return res.json({
        VAL: val.displayAvatarURL({format: "webp"}), 
        CHIF: chif.displayAvatarURL({format: "webp"})
    })
})

app.get(`/members/:id/webtester`, async (req, res) => {
    let {id} = req.params;
    if(!id) return res.json({status: false, webTester: 0});

    let member = await getMember(id)
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

    let member = await getMember(id);
    if(!member) return res.json({status: false, donator: 0});

    if(member.roles.cache.has(process.env.DONATOR_ROLE)) return res.json({status: true, donator: 1});
    return res.json({status: false, donator: 0});
})

app.listen(PORT, () => console.log(`API started on port: ${PORT}`));

if(process.env.MONGODB) connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log(`MONGODB | Connected`))
.catch(err => console.log(`MONGODB | ERROR\n`, err))
