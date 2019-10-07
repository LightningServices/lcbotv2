const discord = require("discord.js");
const fs = require("fs");
const config = require("./config.json");
const bot = new discord.Client({disableEveryone: true});
require('http').createServer().listen(3000)

// When bot is ready message
bot.on("ready", async () => {
    console.log(`${bot.user.username} is ready for action!`);
    bot.user.setActivity(config.activity.game, {type: 'WATCHING', url: 'https://lightningservices.tk'});
    bot.user.setStatus('dnd');
});

// Load Commands
bot.commands = new discord.Collection();
fs.readdir("./commands/", (err, files)=>{
    if (err) console.error(err);
    let jsfiles = files.filter(f => f.split(".").pop() === "js");

    if (jsfiles.length <= 0) return console.log("There are not any commands to load!");
        console.log(`Loading ${jsfiles.length} commands!`);
        jsfiles.forEach((f, i)=> {
            let props = require(`./commands/${f}`);
            console.log(`${i + 1}: ${f} loaded!`);
            bot.commands.set(props.help.name, props);
    });
});

// Message event
bot.afk = new Map();
bot.on("message", async message => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  let prefix = config.prefix;
  let messageArray = message.content.split(" ");
  let command = messageArray[0].toLowerCase();
  let args = messageArray.slice(1);

    //return message.channel.send(`**${user_tag}** is currently afk. Reason: ${key.reason}`);
    //return message.reply(`you have been removed from the afk list!`).then(msg => msg.delete(5000));

  if (message.content.includes(message.mentions.users.first())) {
    let mentioned = bot.afk.get(message.mentions.users.first().id);
    if (mentioned) message.channel.send(`***${mentioned.usertag}*** is currently afk. Reason: ${mentioned.reason}`);
  }
  let afkcheck = bot.afk.get(message.author.id);
  if (afkcheck) return [bot.afk.delete(message.author.id), message.reply(`you have been removed from the afk list!`).then(msg => msg.delete(5000))];

  if (!command.startsWith(prefix)) return;

  let cmd = bot.commands.get(command.slice(prefix.length));
  if (cmd) cmd.run(bot, message, args);
});


bot.login(config.token);