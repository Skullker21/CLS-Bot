exports.run = async (client, message, args) => {
    const config = require("../config.json");
    const account = message.author.id;
    var permCheck = require("../checkPermissions.js");
    const {Balances, Assets, OwnedAssets} = require('../models/Index.js');
    var commaNumber = require('comma-number');

    //check the permissions of the user
    if(!permCheck.verify(message)){
        return message.reply("You do not have permission to execute that command");
    }

    var toBuy = args[0];
    var numBought = parseInt(args[1]);

    if(numBought <= 0 || isNaN(numBought) ){
        return message.reply("The minimum purchase amount is one.");
    }

    //find asset, subtract money from balance, add to ownedasset model containing owned assets
    const asset = await Assets.findOne({ where: { shortName: toBuy } });
    const balance = await Balances.findOne({ where: { accountHolder: account } });

    if(balance){
        if(asset){
            try {
                if(balance.money - (numBought * asset.cost) < 0){
                    return message.reply(`Private account **${client.users.get(balance.accountHolder)}** cannot be depleted past **zero**`)
                }

                balance.money -= (numBought * asset.cost)
                balance.save();
                if(numBought === 1){
                    return message.channel.send(`**${numBought}** of asset **${asset.longName}** has been purchased by ${message.author} for a total of **$${commaNumber(numBought*asset.cost)}**`)
                }else{
                    return message.channel.send(`**${numBought}** of asset **${asset.longName}** have been purchased by ${message.author} for a total of **$${commaNumber(numBought*asset.cost)}**`)
                }  
            }
            catch (e) {
                console.log(e);
                return message.reply('Something went wrong with purchasing the asset.');
            }
        
        }
        else{
            return message.reply(`**${toBuy}** does not exist on the market.`)
        }
    }
    else{
        return message.reply('You have not opened a private account, use **!openprivateaccount**');
    }
}