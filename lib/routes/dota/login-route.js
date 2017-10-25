function logout(req, res){
  req.logout();
  res.redirect('/');
}

function steamReturn(req, res) {
  // console.log(req.user['Status']);
  if(req.user['Status'] == 'Not Registered') {
    res.redirect('/dota/signup');
  }
  else {
    res.redirect('/dota');
  }
}

function steamAuth(req, res) {
  res.redirect('/dota');
}

module.exports = () =>{
  return{
    logout: {
      route: '/logout',
      handler: logout.bind(null)
    },
    steamReturn: {
      route: '/auth/steam/return',
      handler: steamReturn.bind(null)
    },
    steamAuth:{
      route: '/dota/auth/steam',
      handler: steamAuth.bind(null)
    }
  }
}
