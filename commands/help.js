exports.run = (client, message, args) => {
    const help = require("../help.json");

    var fs = require('fs');
    const dir = './commands/';
    
    switch (args[0]) {
        case "newasset":
            return message.reply(help.newasset);
            break;
        case "asset":
            return message.reply(help.asset);
            break;
        case "editasset":
            return message.reply(help.editasset);
            break;
        case "balance":
            return message.reply(help.balance);
            break;
        case "listassets":
            return message.reply(help.listassets);
            break;
        case "generatetable":
            return message.reply(help.generatetable);
            break;
        case "reload":
            return message.reply(help.reload);
            break;
        default:
            var commands = [];
            fs.readdir(dir, (err, files) => {
                files.forEach(file => {
                    commands.push(file.slice(0,file.length-3));
                });
                return message.reply("Currently available commands are: ```" + commands.join(", ") + "```")
            })
            break;
    }

}
