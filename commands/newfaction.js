exports.run = async (client, message, args) => {
    const config = require("../config.json");
    const permCheck = require("../checkPermissions");
  
    //check the permissions of the user
    if(!permCheck.verify(message)){
      return message.reply("You do not have permission to execute that command");
    }

    const {Factions} = require('../models/Index.js');

    var newArgs = args.join(" ")

    newArgs = newArgs.split(config.splitter);

    //Store new info in array
    var info = {
        short: newArgs[0].trim().replace(/\s+/g, ''),

        factionName: newArgs[1].trim(),
    }
    //Create database entry with previously synthesized data
    try {
        const faction = await Factions.create({
            shortName: info.short,
            faction: info.factionName,
            reputation: 0,
        })
        return message.channel.send(`Faction **${faction.get('faction')}** added to database.`);
    }
    catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            return message.reply('That faction already exists.');
        }
        console.log(e);
        return message.reply('Something went wrong with adding the faction.');
    }

}