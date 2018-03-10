exports.run = async (client, message, args) => {
    const config = require("../config.json");
    var commaNumber = require('comma-number');
    const permCheck = require("../checkPermissions");
  
    //check the permissions of the user
    if(!permCheck.verify(message)){
      return message.reply("You do not have permission to execute that command");
    }

    const {Balances} = require('../models/Index.js');
    var entriesRaw = [];
    var entries = [];
    var newArgs;
    var pay;

    //Find information in model with findAll and a specific column
    entriesRaw = await Balances.findAll({
        attributes: ['accountHolder', 'money']
    });
    
    //Process long arrays into simplified data with only desired data
    entriesRaw.forEach(element => {
        entries.push(element.dataValues)
    });

    //Check if there are members to exclude
    if(Number.isInteger(parseInt(args[0]))){

        pay = parseInt(args[0]);

        try{

            for (let i = 1; i < entries.length; i++) {
                const e = entries[i];
                
                const balance = await Balances.findOne({ where: { accountHolder: e.accountHolder } });

                if (balance) {

                    balance.money += pay
                    balance.save();
        
                }
            }
    
            return message.channel.send(`Payout **completed**.`);
        }
        catch(e){
            console.log(e);
        }
    }else{
        //Re-split args based on splitter operator
        newArgs = args.join(" ")
        newArgs = newArgs.split(config.splitter);

        if(newArgs[1] === undefined){
            return message.reply("Remember to divide users to exclude, and the payout amount with a **semicolon**")
        }

        //Store new info in array
        var info = {
            excluded: message.mentions.users.array(),

            payout: newArgs[1].trim()
        }

        

        try{
            for (let i = 1; i < entries.length; i++) {
                const e = entries[i];

                var isExcluded = false;

                for (let j = 0; j < info.excluded.length; j++) {

                    if(e.accountHolder === (info.excluded[j].id)){
                        isExcluded = true;
                    }

                    if(!isExcluded){
                        const balance = await Balances.findOne({ where: { accountHolder: e.accountHolder } });
    
                        if (balance) {
    
                            balance.money += parseInt(info.payout);
                            balance.save();
                
                        }
                    }
                }
            }
            return message.channel.send(`Payout **completed**.`);
        }
        catch(e){
            
            console.log(e);
        }
    }
}