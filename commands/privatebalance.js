exports.run = async (client, message, args) => {
    const config = require("../config.json");
    //pull predefined name from config.json in root
    var account = message.mentions.users.first();
    //argument for adding/subtracting
    var operator = args[1];
    var change = parseInt(args[2]);
    var commaNumber = require('comma-number');
    var permCheck = require("../checkPermissions.js");

    const {Balances} = require('../models/Index.js');

    if(operator === "+" && account != undefined){

        //check the permissions of the user
        if(!permCheck.verify(message)){
            return message.reply("You do not have permission to execute that command");
        }
        
        // equivalent to: SELECT * FROM balances WHERE accountHolder = 'account' LIMIT 1;
        const balance = await Balances.findOne({ where: { accountHolder: account.id } });

        if (balance) {

            balance.money += change
            balance.save();
            return message.channel.send(`Private account **${client.users.get(balance.accountHolder)}** has been updated to **$${commaNumber(balance.money)}**`);

        }
        return message.reply(`Could not find your private account.`);

    }else if(operator === "-" && account != undefined){

        //check the permissions of the user
        if(!permCheck.verify(message)){
            return message.reply("You do not have permission to execute that command");
        }

        // equivalent to: SELECT * FROM balances WHERE accountHolder = 'account' LIMIT 1;
        const balance = await Balances.findOne({ where: { accountHolder: account.id } });

        if (balance) {
            if(balance.money - change < 0){
                return message.reply(`Private account **${client.users.get(balance.accountHolder)}** cannot be depleted past **zero**`)
            }
            balance.money -= change
            balance.save();
            return message.channel.send(`Private account **${client.users.get(balance.accountHolder)}** has been updated to **$${commaNumber(balance.money)}**`);

        }
        return message.reply(`Could not find your private account.`);

    }else if(account != undefined){

        const balance = await Balances.findOne({ where: { accountHolder: account.id } });
        if(balance){
            return message.channel.send(`${client.users.get(balance.accountHolder)}'s private account has a balance of **$${commaNumber(balance.money)}**`);
        }
        return message.reply('You have not opened a private account, use **!openprivateaccount**');

    }
    else {

        const balance = await Balances.findOne({ where: { accountHolder: message.author.id } });
        if(balance){
            return message.reply(`Your private account has a balance of **$${commaNumber(balance.money)}**`);
        }
        return message.reply('You have not opened a private account, use **!openprivateaccount**');
    }

}