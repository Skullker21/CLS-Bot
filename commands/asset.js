exports.run = async (client, message, args) => {
    const config = require("../config.json");

    const capitalize = require("capitalize");

    var assetName = args[0];

    const {Balances, Assets} = require('../dbObjects.js');

    const asset = await Assets.findOne({ where: { shortName: assetName } });

    if(asset){
        const embed = {
            "title": asset.longName,
            "color": 1340420,
            "image": {
              "url": asset.photo
            },
            "author": {
              "name": "CLS Market",
              "icon_url": "https://cdn.discordapp.com/attachments/393288361122594818/413171704383406091/CLS_No_Text.png"
            },
            "fields": [
              {
                "name": "Price :moneybag:",
                "value": `$ ${asset.cost}`
              },
              {
                "name": "Category",
                "value": `${capitalize(asset.category)}`
              }
            ]
        };
        return message.channel.send({ embed });
    }
    return message.reply('Asset could not be located, make sure you are using the short name of the asset');
    

}