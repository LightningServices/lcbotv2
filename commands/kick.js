const discord = require("discord.js");
const config = require('../config.json');

module.exports.run = async (bot, message, args) => {

    let target = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    let reason = args.slice(1).join(' ');
    let logs = message.guild.channels.find('name', config.logsChannel);

    if (!message.member.hasPermission('KICK_MEMBERS')) return message.reply('You do not have permissions to use this command!');
    
    if (!target) return message.reply('Who specifically are you trying to kick? Please tag user in order for the member to be kicked!');
    if (!reason) return message.reply('Why are you kicking this user? Please include a reason!');
    if (!logs) return message.reply(`Please create a channel called ${config.logsChannel} to keep track of why each user was kicked!`);
    
    let embed = new discord.RichEmbed()
        .setColor('#8f2809')
        .setThumbnail(target.user.avatarURL)
        .addField('Kicked Member', `${target.user.username} with an ID: ${target.user.id}`)
        .addField('Kicked By', `${message.author.username} with an ID: ${message.author.id}`)
        .addField('Kicked Time', message.createdAt)
        .addField('Kicked At', message.channel)
        .addField('Kicked Reason', reason)
        .setFooter('Kicked user information', target.user.displayAvatarURL);

    message.channel.send(`${target.user.username} was kicked by ${message.author} for ${reason}`);
    target.kick(reason);
    logs.send(embed);

};

module.exports.help = {
    name: 'kick'
};