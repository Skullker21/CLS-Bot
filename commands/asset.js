exports.run = async (client, message, args) => {
    const config = require("../config.json");
    var commaNumber = require('comma-number');
    const capitalize = require("capitalize");

    var assetName = args[0];

    const {Balances, Assets, OwnedAssets} = require('../models/Index.js');

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
                "value": `$ ${commaNumber(asset.cost)}`
              },
              {
                "name": "Category",
                "value": `${capitalize.words(asset.category)}`
              }
            ]
        };
        return message.channel.send({ embed });
    }
    return message.reply('Asset could not be located, make sure you are using the short name of the asset');
    

}