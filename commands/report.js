const discord = require('discord.js');
const config = require('../config.json');

module.exports.run = async (bot, message, args) => {

    let target = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    let reason = args.slice(1).join(' ');
    let reports = message.guild.channels.find('name', config.reportsChannel);

    if (!target) return message.reply('Who are you trying to report?');
    if (!reason) return message.reply('What are you reporting the user for?');
    if (!reports) return message.reply(`Please create a channel called ${config.reportsChannel} to track all the reports that come in!`);

    let embed = new discord.RichEmbed()
        .setColor('RANDOM')
        .setThumbnail(target.user.avatarURL)
        .addField('Reported Member', `${target.user.username} with an ID: ${target.user.id}`)
        .addField('Reported By', `${message.author.username} with an ID: ${message.author.id}`)
        .addField('Reported Time', message.createdAt)
        .addField('Reported In', message.channel)
        .addField('Reported Reason', reason)
        .setFooter('Reported user imformation', target.user.displayAvatarURL);

    message.channel.send(`${target} was reported by ${message.author} for ${reason}`).then(msg => msg.delete(2000));
    reports.send(embed);

};

module.exports.help = {
    name: 'report'
};