exports.run = async (client, message, args) => {
    const config = require("../config.json");
    const capitalize = require("capitalize");
    const _ = require("underscore");
    var commaNumber = require('comma-number');

    const {Assets, BuyOrder} = require('../models/Index.js');

    const permCheck = require("../checkPermissions");
  
    //check the permissions of the user
    if(!permCheck.verify(message)){
      return message.reply("You do not have permission to execute that command");
    }

    var entriesRaw = [];
    var entries = [];
    var alphabetizedEntries = [];
    var categorziedEntries = [[]];
    var sortedEntires = [];
    var slicedNames = [[]];
    var slicedToOrder = [[]];
    var sortedNames = [];
    var sortedToOrder = [];
    var lastCat = null;
    var currentCat = 0;
    var totalCost = 0;

    
    //Find information in model with findAll and a specific column
    entriesRaw = await BuyOrder.findAll({
        attributes: ['shortName', 'longName', 'category', 'toOrder']
    });

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
        }

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

        //Sort subarrays by toOrder
        for (let i = 0; i < categorziedEntries.length; i++) {

            const e = categorziedEntries[i];
            var sorted = _.sortBy(e,'toOrder');
            sortedEntires.push(sorted);
        }

        //concatanate names and push to new array with divders, do same with toOrder
        lastCat = null;
        for (let i = 0; i < sortedEntires.length; i++) {
            for (let j = 0; j < sortedEntires[i].length; j++) {
                const e = sortedEntires[i][j];
                if(e.category === lastCat){
                    var combined = e.longName + " / " + e.shortName;

                    sortedNames.push(combined);
                    sortedToOrder.push(e.toOrder);
                    lastCat = e.category;
                }
                else if (e.category !== lastCat){
                    var combined = e.longName + " / " + e.shortName;

                    sortedNames.push(`\n${capitalize.words(e.category)}\n--------------`);
                    sortedNames.push(combined);
                    sortedToOrder.push(`\n${capitalize.words(e.category)}\n--------------`);
                    sortedToOrder.push(e.toOrder);
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
                    slicedToOrder.push([]);
                }
                const e = sortedNames[i];
                slicedNames[toSlice].push(e);
                slicedToOrder[toSlice].push(sortedToOrder[i])
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
                    "description": "Assets in Current Order:",
                    "color": 11302656,
                    "author": {
                    "name": "CLS Order Management",
                    "icon_url": "https://cdn.discordapp.com/attachments/393288361122594818/413171704383406091/CLS_No_Text.png"
                    },
                    "fields": [
                    {
                        "name": "Long Name / Short Name",
                        "value": "```\n-----------------------------------------\n" + e.join("\n") + "```",
                        "inline": true
                    },
                    {
                        "name": "To Order",
                        "value": "```\n--------------\n" + slicedToOrder[i].join("\n") + "```",
                        "inline": true
                    }
                    ]
                };
                message.channel.send({ embed });
            }else{
                const embed = { 
                    "color": 11302656,
                    "fields": [
                    {
                        "name": "Long Name / Short Name",
                        "value": "```\n^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n" + e.join("\n") + "```",
                        "inline": true
                    },
                    {
                        "name": "To Order",
                        "value": "```\n^^^^^^^^^^^^^^\n" + slicedToOrder[i].join("\n") + "```",
                        "inline": true
                    }
                    ]
                };
                message.channel.send({ embed });
            }
        }
        message.channel.send(`Total order cost: **$${commaNumber(totalCost)}**`)
    }
    else if(sortedNames.length > 0){
        const embed = { 
            "description": "Assets in Current Order:",
            "color": 11302656,
            "author": {
            "name": "CLS Order Management",
            "icon_url": "https://cdn.discordapp.com/attachments/393288361122594818/413171704383406091/CLS_No_Text.png"
            },
            "fields": [
            {
                "name": "Long Name / Short Name",
                "value": "```" + sortedNames.join("\n") + `\n\n-----------------------------------------\n| Total order cost: $${commaNumber(totalCost)} \n-----------------------------------------` + "```",
                "inline": true
            },
            {
                "name": "To Order",
                "value": "```" + sortedToOrder.join("\n") + "\n\n--------------\n             |\n--------------" + "```",
                "inline": true
            }
            ]
        };
        message.channel.send({ embed });
    }
    else{
        const embed = { 
            "description": "No Assets Currently in Order.",
            "color": 11302656,
            "author": {
            "name": "CLS Order Management",
            "icon_url": "https://cdn.discordapp.com/attachments/393288361122594818/413171704383406091/CLS_No_Text.png"
            }
        };
        return message.channel.send({ embed });
    }

}