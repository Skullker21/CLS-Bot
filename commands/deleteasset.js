exports.run = async (client, message, args) => {
    const config = require("../config.json");
    var permCheck = require("../checkPermissions.js");
    const {Balances, Assets, OwnedAssets} = require('../dbObjects.js');

    //check the permissions of the user
    if(!permCheck.verify(message)){
        return message.reply("You do not have permission to execute that command");
    }

    var toRemove = args[0];

    const asset = await Assets.findOne({ where: { shortName: toRemove } });

    if(asset){
        var name = asset.longName;
        asset.destroy({ force: true })
        return message.reply(`Asset **${name}** has been removed from the database.`)
    }
}