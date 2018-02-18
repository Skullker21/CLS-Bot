exports.run = async (client, message, args) => {
    const config = require("../config.json");
    var permCheck = require("../checkPermissions.js");
    var commaNumber = require('comma-number');
    const {Balances, Assets, OwnedAssets} = require('../dbObjects.js');

        //Re-split args based on splitter operator
        var newArgs = args.join(" ")

        newArgs = newArgs.split(config.splitter);
    
        //Store new info in array
        var info = {

            short: newArgs[0].trim(),

            attribute: newArgs[1].trim(),
    
            change: newArgs[2].trim()
        }

    //check the permissions of the user
    if(!permCheck.verify(message)){
        return message.reply("You do not have permission to execute that command");
    }

    const asset = await Assets.findOne({ where: { shortName: info.short } });

    switch(info.attribute.toLowerCase()){
        case "shortname":
            if (asset) {
                var oldName = asset.shortName;
                asset.shortName = info.change;
                asset.save();
                return message.channel.send(`Asset **${asset.longName}** short name updated from **${oldName}** to **${asset.shortName}**.`);
            }
            return message.reply(`Could not find asset with the short name of **${info.short}**`);
            break;
            
        case "longname":
            if (asset) {
                var oldName = asset.longName;
                asset.longName = info.change;
                asset.save();
                return message.channel.send(`Asset **${oldName}** long name updated to **${asset.longName}**.`);
            }
            return message.reply(`Could not find asset with the short name of **${info.short}**`);
            break;
        
        case "photo":
            if (asset) {
                var oldPhoto = asset.photo;
                asset.photo = info.change;
                asset.save();
                return message.channel.send(`Asset **${asset.longName}** photo updated from **${oldPhoto}** to **${asset.photo}**.`);
            }
            return message.reply(`Could not find asset with the short name of **${info.short}**`);
            break;

        case "category":
            if (asset) {
                var oldCategory = asset.category;
                asset.category = info.change;
                asset.save();
                return message.channel.send(`Asset **${asset.longName}** category updated from **${oldCategory}** to **${asset.category}**.`);
            }
            return message.reply(`Could not find asset with the short name of **${info.short}**`);
            break;

        case "cost":
            if (asset) {
                var oldCost = asset.cost;
                asset.cost = info.change;
                asset.save();
                return message.channel.send(`Asset **${asset.longName}** price updated from **$${commaNumber(oldCost)}** to **$${commaNumber(asset.cost)}**.`);
            }
            return message.reply(`Could not find asset with the short name of **${info.short}**`);
            break;
        default:
            return message.reply("Parameter unknown");
    }
}