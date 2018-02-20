exports.run = async (client, message, args) => {
    const config = require("../config.json");
    var permCheck = require("../checkPermissions.js");
    const {Assets, BuyOrder} = require('../models/Index.js');

    //check the permissions of the user
    if(!permCheck.verify(message)){
        return message.reply("You do not have permission to execute that command");
    }

    var newArgs = args.join(" ");
    var separatedArgs = [];
    var numRemoved = 0;
    var orderCost = 0;
    var total = 0;

    newArgs = newArgs.split(config.splitter);
    newArgs.forEach(e => {
        separatedArgs.push(e.split(/ +/g))
    });

    for (let i = 0; i < separatedArgs.length; i++) {
        const e = separatedArgs[i];
        if(e.length > 2){
            return message.reply("Too many parameters in one of your arguments.");
        }
        else if(e[1] < 1){
            return message.reply("Minimum assets to remove is 1");
        }    
    }

    for (let i = 0; i < separatedArgs.length; i++) {
        const e = separatedArgs[i];
        var toRemove = e[0];
        var numToRemove = parseInt(e[1]);
        const asset = await BuyOrder.findOne({ where: { shortName: toRemove } });
        try{
            if(asset){
                var toOrder = asset.toOrder;
                var name = asset.longName;
                if((toOrder - numToRemove) < 0){
                    return message.reply(`You are attempting to omit more assets than are currently in the buy order.`)
                }
                else if((toOrder - numToRemove) <= 0){
                    asset.destroy({ force: true })
                    total += numToRemove;
                }
                else{
                    asset.toOrder -= numToRemove;
                    asset.save();
                    total += numToRemove;
                }
            }else{
                return message.reply(`**${toRemove}** does not exist in the current buy order.`)
            }
        }catch(e){
            console.log(e);
            message.reply("Something went wrong with editing the buy order.")
        }
    }
    if(total === 1){
        return message.channel.send(`**${total}** asset has been omitted from the buy order.`)
    }else{
        return message.channel.send(`**${total}** assets have been omitted from the buy order.`)
    }   
}

