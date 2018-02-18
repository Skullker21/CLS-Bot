exports.run = async (client, message, args) => {
    const config = require("../config.json");
    var permCheck = require("../checkPermissions.js");
    const {Balances, Assets, OwnedAssets} = require('../dbObjects.js');

    //check the permissions of the user
    if(!permCheck.verify(message)){
        return message.reply("You do not have permission to execute that command");
    }

    var toRemove = args[0];
    var numToRemove = parseInt(args[1]);

    const asset = await OwnedAssets.findOne({ where: { shortName: toRemove } });

    if(asset){
        var owned = asset.owned;
        var name = asset.longName;
        if((owned -= numToRemove) < 0){
            return message.reply(`You are attempting to destroy more assets than are currently owned.`)
        }
        else if((owned -= numToRemove) <= 0){
            asset.destroy({ force: true })
            console.log("destroyed")
            if(numToRemove === 1){
                return message.channel.send(`**${numToRemove}** of asset **${name}** has been destroyed.`)
            }else{
                return message.channel.send(`**${numToRemove}** of asset **${name}** have been destroyed.`)
            }
        }
        else{
            console.log(asset.owned)
            asset.owned -= numToRemove;
            console.log(asset.owned);
            asset.save();
            console.log("lowered")
            if(numToRemove === 1){
                return message.channel.send(`**${numToRemove}** of asset **${name}** has been destroyed.`)
            }else{
                return message.channel.send(`**${numToRemove}** of asset **${name}** have been destroyed.`)
            }
        }
    }
}