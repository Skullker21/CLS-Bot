exports.run = async (client, message, args) => {
    const config = require("../config.json");
    var permCheck = require("../checkPermissions.js");
    const {Factions} = require('../models/Index.js');

    //check the permissions of the user
    if(!permCheck.verify(message)){
        return message.reply("You do not have permission to execute that command");
    }

    var toRemove = args[0];

    const faction = await Factions.findOne({ where: { shortName: toRemove } });

    try{
        if(faction){
            var name = faction.faction ;
            faction.destroy({ force: true })
            return message.channel.send(`Faction **${name}** has been removed from the database.`)
        }
    }catch(e){
        console.log(e);
        message.reply("Something went wrong with deleting an faction.")
    }
}