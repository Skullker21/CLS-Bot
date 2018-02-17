exports.run = async (client, message, args) => {

    const permCheck = require("../checkPermissions");
  
    //check the permissions of the user
    if(!permCheck.verify(message)){
      return message.reply("You do not have permission to execute that command");
    }

    const config = require("../config.json");

    const {Balances, Assets, OwnedAssets} = require('../dbObjects.js');

    //Re-split args based on splitter operator
    var newArgs = args.join(" ")

    newArgs = newArgs.split(config.splitter);

    //Store new info in array
    var info = {
        short: newArgs[0].trim().replace(/\s+/g, ''),

        long: newArgs[1].trim(),
    
        pic: newArgs[2].trim(),

        section: newArgs[3].toLowerCase().trim(),

        price: parseInt(newArgs[4])
    }

    //Create database entry with previously synthesized data
    try {
        const asset = await Assets.create({
            shortName: info.short,
            longName: info.long,
            photo: info.pic,
            category: info.section,
            cost: info.price,
        })
        return message.reply(`Asset **${asset.get('longName')}** added to database.`);
    }
    catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            return message.reply('That asset already exists.');
        }
        console.log(e);
        return message.reply('Something went wrong with adding the asset.');
    }

}