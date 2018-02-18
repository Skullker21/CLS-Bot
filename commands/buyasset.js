exports.run = async (client, message, args) => {
    const config = require("../config.json");
    const account = config.accountName;
    var permCheck = require("../checkPermissions.js");
    const {Balances, Assets, OwnedAssets} = require('../dbObjects.js');
    var commaNumber = require('comma-number');

    //check the permissions of the user
    if(!permCheck.verify(message)){
        return message.reply("You do not have permission to execute that command");
    }

    var toBuy = args[0];
    var numBought = parseInt(args[1]);

    if(numBought <= 0 ){
        return message.reply("The minimum purchase amount is one.");
    }

    //find asset, subtract money from balance, add to ownedasset model containing owned assets
    const asset = await Assets.findOne({ where: { shortName: toBuy } });
    const balance = await Balances.findOne({ where: { accountHolder: account } });

    if(asset){
        const alreadyOwned = await OwnedAssets.findOne({ where: { shortName: toBuy } });
        if(alreadyOwned){
            alreadyOwned.owned += numBought;
            alreadyOwned.save();
            balance.money -= (numBought * asset.cost)
            balance.save();
            if(numBought === 1){
                return message.reply(`**${numBought}** of asset **${alreadyOwned.longName}** has been purchased for a total of **$${commaNumber(numBought*asset.cost)}**`)
            }else{
                return message.reply(`**${numBought}** of asset **${alreadyOwned.longName}** have been purchased for a total of **$${commaNumber(numBought*asset.cost)}**`)
            }    
        }else{
            try {
                const boughtAsset = await OwnedAssets.create({
                    shortName: asset.shortName,
                    longName: asset.longName,
                    photo: asset.photo,
                    category: asset.category,
                    owned: numBought,
                })
                if(numBought === 1){
                    return message.reply(`**${numBought}** of asset **${asset.longName}** has been purchased for a total of **$${commaNumber(numBought*asset.cost)}**`)
                }else{
                    return message.reply(`**${numBought}** of asset **${asset.longName}** have been purchased for a total of **$${commaNumber(numBought*asset.cost)}**`)
                }  
            }
            catch (e) {
                console.log(e);
                return message.reply('Something went wrong with purchasing the asset.');
            }
        }
    
    }
    else{
        return message.reply(`**${toBuy}** does not exist on the market.`)
    }
}