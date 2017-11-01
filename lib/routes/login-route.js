function logout(req, res){
  req.logout();
  res.redirect('/');
}

function authDiscordCallback(req, res) {
  if(req.user['Status'] == 'Not Registered') {
      res.redirect('/signup');
  }
  else {
    res.redirect('/');
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
