exports.run = async (client, message, args) => {
    const config = require("../config.json");
    //pull predefined name from config.json in root
    const account = config.accountName;

    const {Balances, Assets, OwnedAssets} = require('../models/Index.js');

    const permCheck = require("../checkPermissions");
  
    //check the permissions of the user
    if(!permCheck.verify(message)){
      return message.reply("You do not have permission to execute that command");
    }

    //try to create new entry into table
    try {
        const balance = await Balances.create({
            accountHolder: account,
            money: 0
        })
        return message.channel.send(`Account **${balance.get('accountHolder')}** added.`);
    }
    catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            return message.reply('That account already exists.');
        }
        console.log(e);
        return message.reply('Something went wrong with adding an account.');
    }

}