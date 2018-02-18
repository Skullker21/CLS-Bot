exports.run = async (client, message, args) => {
    const config = require("../config.json");
    const capitalize = require("capitalize");
    const _ = require("underscore");
    var commaNumber = require('comma-number');

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
    entriesRaw = await Assets.findAll({
        attributes: ['shortName', 'longName', 'category', 'cost']
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
            var sorted = _.sortBy(e,'cost');
            sortedEntires.push(sorted);
        }
        

        // append money sign to costs
        for (let i = 0; i < sortedEntires.length; i++) {
            for (let j = 0; j < sortedEntires[i].length; j++) {

                const e = sortedEntires[i][j];
                e.cost = commaNumber(e.cost);
                e.cost = ('$' + e.cost);
                sortedEntires[i].cost = e.cost;
            }
        }
        lastCat = null;
        for (let i = 0; i < sortedEntires.length; i++) {
            for (let j = 0; j < sortedEntires[i].length; j++) {
                const e = sortedEntires[i][j];
                if(e.category === lastCat){
                    var combined = e.longName + " / " + e.shortName;

                    sortedNames.push(combined);
                    sortedPrices.push(e.cost);
                    lastCat = e.category;
                }
                else if (e.category !== lastCat){
                    var combined = e.longName + " / " + e.shortName;

                    sortedNames.push(`\n${capitalize(e.category)}\n--------------`);
                    sortedNames.push(combined);
                    sortedPrices.push(`\n${capitalize(e.category)}\n--------------`);
                    sortedPrices.push(e.cost);
                    lastCat = e.category;
                }
            }
            
        }
    }
    catch(e){
        console.log(e);
    }

    if(sortedNames.length > 0){
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
                "value": "```" + sortedNames.join("\n") + "```",
                "inline": true
            },
            {
                "name": "Price",
                "value": "```" + sortedPrices.join("\n") + "```",
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