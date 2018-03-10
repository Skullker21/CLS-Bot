exports.run = async (client, message, args) => {

    var account = message.author.id;
    var permCheck = require("../checkPermissions.js");
    var commaNumber = require('comma-number');

    const {Balances} = require('../models/Index.js');
    try{
        const initiator = await Balances.findOne({ where: { accountHolder: account } });
        if(initiator){
            const currentAmount = initiator.money;
            const transferAmount = args.find(arg => !/<@!?\d+>/g.test(arg));
            const transferTarget = message.mentions.users.first();

            const target = await Balances.findOne({ where: { accountHolder: transferTarget.id } });
            if(target){
                if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`Sorry ${message.author}, that's an invalid amount.`);
                if (transferAmount > currentAmount) return message.channel.send(`Sorry ${message.author}, you only have **$${commaNumber(currentAmount)}**.`);
                if (transferAmount <= 0) return message.channel.send(`Please enter an amount greater than zero, ${message.author}.`);
                
                initiator.money -= transferAmount
                target.money += transferAmount;
                initiator.save();
                target.save();
                
                return message.channel.send(`Successfully transferred **$${commaNumber(transferAmount)}** to **${transferTarget}**. ${message.author}, your current balance is **$${commaNumber(initiator.money)}**`);  
            }
            else{
                return message.reply("That target user does not have a private account open.");
            }
        
        }
        else{
            return message.reply("You do not have a private account, create one with **!openprivateaccount**");
        }
    }
    catch(e){
        console.log(e);
    }
    
}