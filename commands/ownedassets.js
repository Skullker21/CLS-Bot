exports.run = async (client, message, args) => {
    const config = require("../config.json");
    const capitalize = require("capitalize");
    const _ = require("underscore");

    const {Balances, Assets, OwnedAssets} = require('../dbObjects.js');

    var entriesRaw = [];
    var entries = [];
    var sortedEntries = [];
    var categorizedNames = [];
    var categorizedNumOwned = [];
    var lastCat = null;

    //Find information in model with findAll and a specific column
    entriesRaw = await OwnedAssets.findAll({
        attributes: ['shortName', 'longName', 'category', 'owned']
    });

    //Process long arrays into simplified data with only desired data
    entriesRaw.forEach(element => {
        entries.push(element.dataValues)
    });

    //sort entries by category alphabetically
    sortedEntries = _.sortBy(entries,'category');

    console.log(sortedEntries);


    for (let i = 0; i < sortedEntries.length; i++) {
        const element = sortedEntries[i];
        if(element.category === lastCat){
            var combined;
            combined = element.longName + " / " + element.shortName;

            categorizedNames.push(combined);
            categorizedNumOwned.push(element.owned);
            lastCat = element.category;
        }else if (element.category !== lastCat){
            var combined;
            combined = element.longName + " / " + element.shortName;

            categorizedNames.push(`\n${capitalize(element.category)}s\n--------------`);
            categorizedNames.push(combined);
            categorizedNumOwned.push(`\n${capitalize(element.category)}s\n--------------`);
            categorizedNumOwned.push(element.owned);
            lastCat = element.category;
        }
    }

    const embed = { 
        "description": "Currently Owned Assets:",
        "color": 9704468,
        "author": {
          "name": "CLS Asset Management",
          "icon_url": "https://cdn.discordapp.com/attachments/393288361122594818/413171704383406091/CLS_No_Text.png"
        },
        "fields": [
          {
            "name": "Long Name / Short Name",
            "value": "```" + categorizedNames.join("\n") + "```",
            "inline": true
          },
          {
            "name": "Owned",
            "value": "```" + categorizedNumOwned.join("\n") + "```",
            "inline": true
          }
        ]
      };
    message.channel.send({ embed });

}