exports.run = async (client, message, args) => {
    const config = require("../config.json");
    const capitalize = require("capitalize");
    const _ = require("underscore");

    const {Balances, Assets, OwnedAssets} = require('../dbObjects.js');

    var entriesRaw = [];
    var entries = [];
    var sortedEntries = [];
    var categorizedNames = [];
    var categorizedPrices = [];
    var lastCat = null;

    //Find information in model with findAll and a specific column
    entriesRaw = await Assets.findAll({
        attributes: ['shortName', 'longName', 'category', 'cost']
    });

    //Process long arrays into simplified data with only desired data
    entriesRaw.forEach(element => {
        entries.push(element.dataValues)
    });

    //sort entries by category alphabetically
    sortedEntries = _.sortBy(entries,'category');

    //append money sign to costs
    for (let i = 0; i < sortedEntries.length; i++) {
        const element = sortedEntries[i];
        element.cost = element.cost.toString();
        element.cost = ('$' + element.cost);
        sortedEntries[i].cost = element.cost;
    }

    for (let i = 0; i < sortedEntries.length; i++) {
        const element = sortedEntries[i];
        if(element.category === lastCat){
            var combined;
            combined = element.longName + " / " + element.shortName;

            categorizedNames.push(combined);
            categorizedPrices.push(element.cost);
            lastCat = element.category;
        }else if (element.category !== lastCat){
            var combined;
            combined = element.longName + " / " + element.shortName;

            categorizedNames.push(`\n${capitalize(element.category)}s\n--------------`);
            categorizedNames.push(combined);
            categorizedPrices.push(`\n${capitalize(element.category)}s\n--------------`);
            categorizedPrices.push(element.cost);
            lastCat = element.category;
        }
    }

    if(categorizedNames.length > 0){
        const embed = { 
            "description": "Assets Available For Purchase:",
            "color": 1340420,
            "author": {
            "name": "CLS Market",
            "icon_url": "https://cdn.discordapp.com/attachments/393288361122594818/413171704383406091/CLS_No_Text.png"
            },
            "fields": [
            {
                "name": "Long Name / Short Name",
                "value": "```" + categorizedNames.join("\n") + "```",
                "inline": true
            },
            {
                "name": "Price",
                "value": "```" + categorizedPrices.join("\n") + "```",
                "inline": true
            }
            ]
        };
        message.channel.send({ embed });
    }
    else{
        const embed = { 
            "description": "No Assets Available For Purchase.",
            "color": 1340420,
            "author": {
            "name": "CLS Market",
            "icon_url": "https://cdn.discordapp.com/attachments/393288361122594818/413171704383406091/CLS_No_Text.png"
            }
        };
        message.channel.send({ embed });
    }

}