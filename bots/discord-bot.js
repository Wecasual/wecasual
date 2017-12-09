var introMessage = "Welcome to the Wecasual Discord server!\n\
Head over to http://www.wecasual.gg/dota and press **Game Signup** to signup for your first game!\n\
You can also signup for games by going to **#signup-for-a-game** and clicking any of the recently posted links.\n\
If no games times work for you, you can **Schedule a Game** at a time that works for you.\n\
For any questions check out **#help**, or message us in **#questions**.\n\
Have fun!";

function init(bot, admins){
  bot.on('ready', function() {
      console.log('Logged in as %s - %s\n', bot.username, bot.id);
  });

  bot.on('message', function(user, userID, channelID, message, event) {
    if(admins.includes(userID)){
      var info = message.split(";")
      if (info[0] === "~weeka") {
        if (info[1] === "edit-intro"){
          introMessage = info[2];
          bot.sendMessage({
              to: channelID,
              message: "Set intro message to:\n" + introMessage
          });
        }
        if(info[1] === "view-intro"){
          bot.sendMessage({
            to: channelID,
            message: "The current intro message is:\n" + introMessage
          });
        }

      }
    }
  });

  bot.on('guildMemberAdd', function(event) {
    bot.sendMessage({
      to: event.id,
      message: introMessage
    })
  });
}

function postQuickLink(bot, info){
  bot.sendMessage({
    to: process.env.SIGNUP_CHANNEL_ID,
    message: "@here Click here to signup for " + info[3] + "'s game: " + info[0] + " on " + info[1] + ": <" + (process.env.SITE_URL || 'http://localhost:5000/') + "schedule/dota/quickLink?id=" + info[2] + ">"
  }, function(err){
    if(err){
      console.log(err);
    }
  });
}

module.exports = bot => {
  return{
    init: init.bind(null, bot),
    postQuickLink: postQuickLink.bind(null, bot)
  }
}
