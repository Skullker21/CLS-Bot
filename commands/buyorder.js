exports.run = async (client, message, args) => {
    const config = require("../config.json");
    const account = config.accountName;
    var permCheck = require("../checkPermissions.js");
    const {Assets, OwnedAssets, BuyOrder} = require('../models/Index.js');
    var commaNumber = require('comma-number');

    //check the permissions of the user
    if(!permCheck.verify(message)){
        return message.reply("You do not have permission to execute that command");
    }

    var newArgs = args.join(" ");
    var separatedArgs = [];
    var orderSize = 0;
    var orderCost = 0;

    newArgs = newArgs.split(config.splitter);
    newArgs.forEach(e => {
        separatedArgs.push(e.trim().split(/ +/g))
    });

    for (let i = 0; i < separatedArgs.length; i++) {
        const e = separatedArgs[i];
        if(e.length > 2){
            return message.reply("Too many parameters in one of your arguments.");
        }
        else if(e[1] < 1){
            return message.reply("Minimum assets to add is 1");
        }    
    }

    for (let i = 0; i < separatedArgs.length; i++) {
        const e = separatedArgs[i];
        var toOrder = e[0];
        var numOrdered = parseInt(e[1]);
        const asset = await Assets.findOne({ where: { shortName: toOrder } });
        if(asset){
            const alreadyOrdered = await BuyOrder.findOne({ where: { shortName: toOrder } });
            if(alreadyOrdered){
                alreadyOrdered.toOrder += numOrdered;
                alreadyOrdered.save();
                orderCost += (asset.cost * numOrdered);
                orderSize += numOrdered;
            }else{
                try {
                    const boughtAsset = await BuyOrder.create({
                        shortName: asset.shortName,
                        longName: asset.longName,
                        category: asset.category,
                        toOrder: numOrdered,
                    })
                    orderCost += (asset.cost * numOrdered);
                    orderSize += numOrdered;
                }
                catch (e) {
                    console.log(e);
                    return message.reply('Something went wrong with add an asset to the buy order.');
                }
            }
        
        }
    }

    if(separatedArgs.length == 1){
        return message.channel.send(`**${orderSize}** asset have been added to a buy order.`)

    }else{
        return message.channel.send(`**${orderSize}** assets have been added to a buy order.`)
    }
}