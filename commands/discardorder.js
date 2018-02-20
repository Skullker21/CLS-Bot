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

    try{
        //Process long arrays into simplified data with only desired data
        entriesRaw.forEach(element => {
            entries.push(element.dataValues)
        });

        if(entries.length < 1){
            return message.channel.send("**No order** currently open.")
        }

        for (let i = 0; i < entries.length; i++) {
            const e = entries[i];
            const asset = await BuyOrder.findOne({ where: { shortName: e.shortName } });

            if(asset){
                asset.destroy({ force: true })
            }
        }

        return message.channel.send("Current order **discarded.**")
    }
    catch(e){
        console.log(e);
    }
}