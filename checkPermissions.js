const config = require("./config.json");

try{
    //check if invoker ID matches json defined permitted users
    var verify = function (message){
        var cleared = config.permittedUsers.find(function(element) {
            if(message.author.id === element){
                return true;
            }
            return false;
        });
        return cleared;
    }
}
catch(e){
    console.log(e);
}

module.exports = {
    verify: verify
}