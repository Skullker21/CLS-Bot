exports.run = async (client, message, args) => {
    const config = require("../config.json");
    const capitalize = require("capitalize");
    const _ = require("underscore");

    const {Balances, Assets, OwnedAssets} = require('../models/Index.js');

    var entriesRaw = [];
    var entries = [];
    var alphabetizedEntries = [];
    var categorziedEntries = [[]];
    var sortedEntires = [];
    var sortedNames = [];
    var sortedPrices = [];
    var lastCat = null;
    var currentCat = 0;

    //Find information in model with findAll and a specific column
    entriesRaw = await OwnedAssets.findAll({
        attributes: ['shortName', 'longName', 'category', 'owned']
    });
    try{
        //Process long arrays into simplified data with only desired data
        entriesRaw.forEach(element => {
            entries.push(element.dataValues)
        });

        //sort entries by category alphabetically
        alphabetizedEntries = _.sortBy(entries,'category');
        
        lastCat = alphabetizedEntries[0].category;
        for (let i = 0; i < alphabetizedEntries.length; i++) {
            const element = alphabetizedEntries[i];
            if(element.category === lastCat){
                categorziedEntries[currentCat].push(element);

                lastCat = element.category;

            }else if(element.category !== lastCat){

                categorziedEntries.push([]);
                currentCat += 1;

                categorziedEntries[currentCat].push(element)

                lastCat = element.category;
            }
        }

        for (let i = 0; i < categorziedEntries.length; i++) {

            const e = categorziedEntries[i];
            var sorted = _.sortBy(e,'owned');
            sortedEntires.push(sorted);
        }
        
        lastCat = null;
        for (let i = 0; i < sortedEntires.length; i++) {
            for (let j = 0; j < sortedEntires[i].length; j++) {
                const e = sortedEntires[i][j];
                if(e.category === lastCat){
                    var combined = e.longName + " / " + e.shortName;

                    sortedNames.push(combined);
                    sortedPrices.push(e.owned);
                    lastCat = e.category;
                }
                else if (e.category !== lastCat){
                    var combined = e.longName + " / " + e.shortName;

                    sortedNames.push(`\n${capitalize(e.category)}\n--------------`);
                    sortedNames.push(combined);
                    sortedPrices.push(`\n${capitalize(e.category)}\n--------------`);
                    sortedPrices.push(e.owned);
                    lastCat = e.category;
                }
            }
            
        }
    }catch(e){
        console.log(e);
    }
    if(sortedNames.length > 0){
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
                "value": "```" + sortedNames.join("\n") + "```",
                "inline": true
            },
            {
                "name": "Owned",
                "value": "```" + sortedPrices.join("\n") + "```",
                "inline": true
            }
            ]
        };
        message.channel.send({ embed });
    }else{
            const embed = { 
                "description": "No Assets Currently Owned.",
                "color": 9704468,
                "author": {
                "name": "CLS Asset Management",
                "icon_url": "https://cdn.discordapp.com/attachments/393288361122594818/413171704383406091/CLS_No_Text.png"
                }
            };
            message.channel.send({ embed });
    }
}