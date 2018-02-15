exports.run = async (client, message, args) => {
    const config = require("../config.json");
    //pull predefined name from config.json in root
    var account = config.accountName;
    //argument for adding/subtracting
    var operator = args[0];
    var change = parseInt(args[1]);

    var permCheck = require("../checkPermissions.js");

    const {Balances, Assets} = require('../dbObjects.js');

    if(operator === "+"){

        //check the permissions of the user
        if(!permCheck.verify(message)){
            return message.reply("You do not have permission to execute that command");
        }
        
        // equivalent to: SELECT * FROM balances WHERE accountHolder = 'account' LIMIT 1;
        const balance = await Balances.findOne({ where: { accountHolder: account } });

        if (balance) {

            balance.money += change
            balance.save();
            return message.channel.send(`Account **${balance.accountHolder}** has been updated to **$${balance.money}**`);

        }
        return message.reply(`Could not find account: **${account}**`);

    }else if(operator === "-"){

        //check the permissions of the user
        if(!permCheck.verify(message)){
            return message.reply("You do not have permission to execute that command");
        }

        // equivalent to: SELECT * FROM balances WHERE accountHolder = 'account' LIMIT 1;
        const balance = await Balances.findOne({ where: { accountHolder: account } });

        if (balance) {

            balance.money -= change
            balance.save();
            return message.channel.send(`Account **${balance.accountHolder}** has been updated to **$${balance.money}**`);

        }
        return message.reply(`Could not find account: **${account}**`);

    }else {

        const balance = await Balances.findOne({ where: { accountHolder: account } });
        if(balance){
            return message.channel.send(`Account **${balance.accountHolder}** has a balance of **$${balance.money}**`);
        }
        return message.reply('Account not created, use **!generatetable**');

        

    }

}