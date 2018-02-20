exports.run = async (client, message, args) => {
    const config = require("../config.json");
    const account = config.accountName;
    const capitalize = require("capitalize");
    const _ = require("underscore");
    var commaNumber = require('comma-number');

    var totalOrdered = 0;
    var totalCost = 0;

    const {Balances, Assets, BuyOrder, OwnedAssets} = require('../models/Index.js');

    const permCheck = require("../checkPermissions");
  
    //check the permissions of the user
    if(!permCheck.verify(message)){
      return message.reply("You do not have permission to execute that command");
    }

    var entriesRaw = [];
    var entries = [];

    //Find information in model with findAll and a specific column
    entriesRaw = await BuyOrder.findAll({
        attributes: ['shortName', 'longName', 'category', 'toOrder']
    });

    const balance = await Balances.findOne({ where: { accountHolder: account } });

    try{
        //Process long arrays into simplified data with only desired data
        entriesRaw.forEach(element => {
            entries.push(element.dataValues)
        });

        //Add up total cost
        for (let i = 0; i < entries.length; i++) {
            const e = entries[i];
            const asset = await Assets.findOne({ where: { shortName: e.shortName } });
            totalCost += (asset.cost * e.toOrder)

            totalOrdered += e.toOrder
            var numBought = e.toOrder;
            if(asset){
                const alreadyOwned = await OwnedAssets.findOne({ where: { shortName: e.shortName } });
                if(alreadyOwned){
                    alreadyOwned.owned += numBought;
                    alreadyOwned.save();  
                }else{
                    try {
                        const boughtAsset = await OwnedAssets.create({
                            shortName: asset.shortName,
                            longName: asset.longName,
                            photo: asset.photo,
                            category: asset.category,
                            owned: numBought,
                        })
                    }
                    catch (e) {
                        console.log(e);
                        return message.reply('Something went wrong with sending the order.');
                    }
                }
            
            }
        }

            for (let i = 0; i < entries.length; i++) {
                const e = entries[i];
                const asset = await BuyOrder.findOne({ where: { shortName: e.shortName } });

                if(asset){
                    asset.destroy({ force: true })
                }
            }
        balance.money -= totalCost;
        balance.save();

        message.channel.send(`Order sent, **${totalOrdered}** assets purchased for a total of **$${commaNumber(totalCost)}**.`)
    }catch(e){
        console.log(e);
    }
    
}