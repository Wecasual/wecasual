function logout(req, res){
  req.logout();
  res.redirect('/');
}

function authDiscordCallback(req, res) {
  if(req.user.status == 'Not Registered') {
      res.redirect('/signup');
  }
  else {
    if(req.session.realm == "dota"){
      res.redirect('/dota');
    }
    else if(req.session.realm == "lol"){
      res.redirect('/lol');
    }
    else if(req.session.realm == "dota/quickLink"){
      res.redirect('/schedule/dota/quickLink?id=' + req.session.quickLinkId);
    }
    else{
      res.redirect('/');
    }
  }
}


module.exports = () =>{
  return{
    logout: {
      route: '/logout',
      handler: logout.bind(null)
    },
    authDiscordCallback: {
      route: '/auth/discord/callback',
      handler: authDiscordCallback.bind(null)
    },
    authDiscord:{
      route: '/auth/discord'
    }
  }
}
