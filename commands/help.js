exports.run = (client, message, args) => {
    const help = require("../help.json");

    var fs = require('fs');
    const dir = './commands/';
    
    switch (args[0]) {
        case "newasset":
            return message.channel.send(help.newasset);
            break;
        case "asset":
            return message.channel.send(help.asset);
            break;
        case "editasset":
            return message.channel.send(help.editasset);
            break;
        case "balance":
            return message.channel.send(help.balance);
            break;
        case "listassets":
            return message.channel.send(help.listassets);
            break;
        case "generatetable":
            return message.channel.send(help.generatetable);
            break;
        case "reload":
            return message.channel.send(help.reload);
            break;
        case "buyasset":
            return message.channel.send(help.buyasset);
            break;
        case "destroyasset":
            return message.channel.send(help.destroyasset);
            break;
        case "ownedassets":
            return message.channel.send(help.ownedassets);
            break;
        case "deleteasset":
            return message.channel.send(help.deleteasset);
            break;
        case "buyorder":
            return message.channel.send(help.buyorder);
            break;
        case "listorder":
            return message.channel.send(help.listorder);
            break;
        case "discardorder":
            return message.channel.send(help.discardorder);
            break;
        case "omitfromorder":
            return message.channel.send(help.omitfromorder);
            break;
        case "sendorder":
            return message.channel.send(help.sendorder);
            break;
        case "newfaction":
            return message.channel.send(help.newfaction);
            break;
        case "deletefaction":
            return message.channel.send(help.deletefaction);
            break;
        case "reputation":
            return message.channel.send(help.reputation);
            break;
        case "openprivateaccount":
            return message.channel.send(help.openprivateaccount);
            break;
        case "privatebalance":
            return message.channel.send(help.privatebalance);
            break;
        case "payout":
            return message.channel.send(help.payout);
            break;
        case "buyprivateasset":
            return message.channel.send(help.buyprivateasset);
            break;
        case "privatetransfer":
            return message.channel.send(help.privatetransfer);
            break;
        default:
            var commands = [];
            fs.readdir(dir, (err, files) => {
                files.forEach(file => {
                    commands.push(file.slice(0,file.length-3));
                });
                return message.channel.send("Currently available commands are: ```" + commands.join(", ") + "```")
            })
            break;
    }

}
