const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const fs = require("fs");
var db = require('./models');

prefix = config.prefix;

db.sequelize.sync()

//handle events
fs.readdir("./events/", (err, files) => {

  if (err){
    return console.error(err);
  } 

  files.forEach(file => {

    let eventFunction = require(`./events/${file}`);

    let eventName = file.split(".")[0];

    //call events with all their proper arguments *after* the `client` var.
    client.on(eventName, (...args) => eventFunction.run(client, ...args));

  });
});


client.on("message", (message) => {

  //check for prefix
  if(!message.content.startsWith(prefix) || message.author.bot) return;
  
  //ignore DMs
  if(message.channel.type === "dm") return;

  //remove prefix and split words into array
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  //remove command phrase and convert arguments to lowercase
  const command = args.shift().toLowerCase();
  
  //run each command file, input client, message, and any arguments
  try {
    let commandFile = require(`./commands/${command}.js`);
    commandFile.run(client, message, args);
  } catch (err) {
    console.error(err);
  }
});

client.login(config.token);