exports.run = async (client, message, args) => {
    const config = require("../config.json");
    var permCheck = require("../checkPermissions.js");
    const {Balances, Assets, OwnedAssets} = require('../models/Index.js');

    //check the permissions of the user
    if(!permCheck.verify(message)){
        return message.reply("You do not have permission to execute that command");
    }

    var toRemove = args[0];

    const asset = await Assets.findOne({ where: { shortName: toRemove } });

    try{
        if(asset){
            var name = asset.longName;
            asset.destroy({ force: true })
            return message.channel.send(`Asset **${name}** has been removed from the database.`)
        }
    }catch(e){
        console.log(e);
        message.reply("Something went wrong with deleting an asset.")
    }
}