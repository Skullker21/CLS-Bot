exports.run = async (client, message, args) => {
    //argument for adding/subtracting
    var factionName = args[0];
    var operator = args[1];
    var change = parseInt(args[2]);
    var permCheck = require("../checkPermissions.js");

    const {Factions} = require('../models/Index.js');

    var entriesRaw = [];
    var entries = [];
    var names = [];
    var reputations = [];

    if(operator === "+"){

        //check the permissions of the user
        if(!permCheck.verify(message)){
            return message.reply("You do not have permission to execute that command");
        }
        
        const faction = await Factions.findOne({ where: { shortName: factionName } });

        if (faction) {

            if(!((faction.reputation + change) > 10)){
                faction.reputation += change
                faction.save();
                return message.channel.send(`Faction **${faction.faction}** reputation has been updated to **${faction.reputation}**`);
            }
            return message.channel.send(`Reputation with ${factionName} cannot exceed 10`);

        }
        return message.reply(`Could not find faction: **${faction.faction}**`);

    }else if(operator === "-"){

        //check the permissions of the user
        if(!permCheck.verify(message)){
            return message.reply("You do not have permission to execute that command");
        }

        const faction = await Factions.findOne({ where: { shortName: factionName } });

        if (faction) {

            if(!((faction.reputation - change) < -10)){
                faction.reputation -= change
                faction.save();
                return message.channel.send(`Reputation with **${faction.faction}** has been updated to **${faction.reputation}**`);
            }
            return message.channel.send(`Reputation with ${faction.faction} cannot exceed -10`);

        }
        return message.reply(`Could not find faction: **${factionName}**`);

    }else if(operator === undefined){
        entriesRaw = await Factions.findAll({
            attributes: ['shortName', 'faction', 'reputation']
        });
        try{
            //Process long arrays into simplified data with only desired data
            entriesRaw.forEach(element => {
                entries.push(element.dataValues)
            });

            for (let i = 0; i < entries.length; i++) {
                const e = entries[i];
                var combined = e.faction + " / " + e.shortName;

                names.push(combined);
                reputations.push(e.reputation);
                
            }
        }catch(e){
            console.log(e);
        }

        if(names.length > 0){
            const embed = { 
                "description": "Faction Standings:",
                "color": 9321435,
                "author": {
                "name": "CLS Diplomacy Management",
                "icon_url": "https://cdn.discordapp.com/attachments/393288361122594818/413171704383406091/CLS_No_Text.png"
                },
                "fields": [
                {
                    "name": "Faction Name / Short Name",
                    "value": "```\n-----------------------------------------\n" + names.join("\n") + "```",
                    "inline": true
                },
                {
                    "name": "Reputation",
                    "value": "```\n--------------\n" + reputations.join("\n") + "```",
                    "inline": true
                }
                ]
            };
            message.channel.send({ embed });
        }
        else{
            const embed = { 
                "description": "No factions in database.",
                "color": 9321435,
                "author": {
                "name": "CLS Diplomacy Management",
                "icon_url": "https://cdn.discordapp.com/attachments/393288361122594818/413171704383406091/CLS_No_Text.png"
                }
            };
            return message.channel.send({ embed });
        }
    
    }

}