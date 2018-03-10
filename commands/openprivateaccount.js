exports.run = async (client, message, args) => {
    const config = require("../config.json");

    const {Balances} = require('../models/Index.js');

    //try to create new entry into table
    try {
        const balance = await Balances.create({
            accountHolder: message.author.id,
            money: 0
        })
        return message.channel.send(`An account for **${client.users.get(balance.get('accountHolder'))}** has opened.`);
    }
    catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            return message.reply('You already have an account open.');
        }
        console.log(e);
        return message.reply('Something went wrong with adding an account.');
    }

}