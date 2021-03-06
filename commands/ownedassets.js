exports.run = async (client, message, args) => {
    const config = require("../config.json");
    const capitalize = require("capitalize");
    const _ = require("underscore");

    const {OwnedAssets} = require('../models/Index.js');

    var entriesRaw = [];
    var entries = [];
    var alphabetizedEntries = [];
    var categorziedEntries = [[]];
    var sortedEntires = [];
    var slicedNames = [[]];
    var slicedOwned = [[]];
    var sortedNames = [];
    var sortedOwned = [];
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
        
        //Sort elements by category into sub arrays
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

        //Sort subarrays by owned
        for (let i = 0; i < categorziedEntries.length; i++) {

            const e = categorziedEntries[i];
            var sorted = _.sortBy(e,'owned');
            sortedEntires.push(sorted);
        }

        //concatanate names and push to new array with divders, do same with owned
        lastCat = null;
        for (let i = 0; i < sortedEntires.length; i++) {
            for (let j = 0; j < sortedEntires[i].length; j++) {
                const e = sortedEntires[i][j];
                if(e.category === lastCat){
                    var combined = e.longName + " / " + e.shortName;

                    sortedNames.push(combined);
                    sortedOwned.push(e.owned);
                    lastCat = e.category;
                }
                else if (e.category !== lastCat){
                    var combined = e.longName + " / " + e.shortName;

                    sortedNames.push(`\n${capitalize.words(e.category)}\n--------------`);
                    sortedNames.push(combined);
                    sortedOwned.push(`\n${capitalize.words(e.category)}\n--------------`);
                    sortedOwned.push(e.owned);
                    lastCat = e.category;
                }
            }
            
        }

        //split organized entries into sub arrays of 30, only if the total number of entires is greater than 30
        if((sortedNames.length - (currentCat + 1)) > 30){
            let toSlice = 0;
            for (let i = 0; i < sortedNames.length; i++) {
                if(i > 0 && i%30 === 0){
                    toSlice++;
                    slicedNames.push([]);
                    slicedOwned.push([]);
                }
                const e = sortedNames[i];
                slicedNames[toSlice].push(e);
                slicedOwned[toSlice].push(sortedOwned[i])
            }
        }

    }
    catch(e){
        console.log(e);
    }
    if(slicedNames[0].length > 0){
        for (let i = 0; i < slicedNames.length; i++) {
            const e = slicedNames[i];
            if(i === 0){
                const embed = { 
                    "description": "Currently Owned Assets:",
                    "color": 2573226,
                    "author": {
                    "name": "CLS Asset Management",
                    "icon_url": "https://cdn.discordapp.com/attachments/393288361122594818/413171704383406091/CLS_No_Text.png"
                    },
                    "fields": [
                    {
                        "name": "Long Name / Short Name",
                        "value": "```\n-----------------------------------------\n" + e.join("\n") + "```",
                        "inline": true
                    },
                    {
                        "name": "Owned",
                        "value": "```\n--------------\n" + slicedOwned[i].join("\n") + "```",
                        "inline": true
                    }
                    ]
                };
                message.channel.send({ embed });
            }else{
                const embed = { 
                    "color": 2573226,
                    "fields": [
                    {
                        "name": "Long Name / Short Name",
                        "value": "```\n^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n" + e.join("\n") + "```",
                        "inline": true
                    },
                    {
                        "name": "Owned",
                        "value": "```\n^^^^^^^^^^^^^^\n" + slicedOwned[i].join("\n") + "```",
                        "inline": true
                    }
                    ]
                };
                message.channel.send({ embed });
            }
        }
    }
    else 
    if(sortedNames.length > 0){
        const embed = { 
            "description": "Currently Owned Assets:",
            "color": 2573226,
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
                "value": "```" + sortedOwned.join("\n") + "```",
                "inline": true
            }
            ]
        };
        message.channel.send({ embed });
    }
    else{
        const embed = { 
            "description": "No Assets Currently Owned.",
            "color": 2573226,
            "author": {
            "name": "CLS Asset Management",
            "icon_url": "https://cdn.discordapp.com/attachments/393288361122594818/413171704383406091/CLS_No_Text.png"
            }
        };
        return message.channel.send({ embed });
    }

}