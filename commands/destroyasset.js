exports.run = async (client, message, args) => {
    const config = require("../config.json");
    var permCheck = require("../checkPermissions.js");
    const {Balances, Assets, OwnedAssets} = require('../models/Index.js');

    //check the permissions of the user
    if(!permCheck.verify(message)){
        return message.reply("You do not have permission to execute that command");
    }

    var toRemove = args[0];
    var numToRemove = parseInt(args[1]);

    if(numToRemove < 1){
        return message.reply("You must destroy at least one asset.")
    }

    const asset = await OwnedAssets.findOne({ where: { shortName: toRemove } });
    try{
        if(asset){
            var owned = asset.owned;
            var name = asset.longName;
            if((owned - numToRemove) < 0){
                return message.reply(`You are attempting to destroy more assets than are currently owned.`)
            }
            else if((owned - numToRemove) <= 0){
                asset.destroy({ force: true })
                if(numToRemove === 1){
                    return message.channel.send(`**${numToRemove}** of asset **${name}** has been destroyed.`)
                }else{
                    return message.channel.send(`**${numToRemove}** of asset **${name}** have been destroyed.`)
                }
            }
            else{
                asset.owned -= numToRemove;
                asset.save();
                if(numToRemove === 1){
                    return message.channel.send(`**${numToRemove}** of asset **${name}** has been destroyed.`)
                }else{
                    return message.channel.send(`**${numToRemove}** of asset **${name}** have been destroyed.`)
                }
            }
        }
    }catch(e){
        console.log(e);
        message.reply("Something went wrong with destroying an asset.")
    }
}