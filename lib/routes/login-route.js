
function logout(req, res){
  req.logout();
  res.redirect('/');
}

function steamReturn(req, res) {
  if(req.session.pressedJoin && !req.user.paid) {
    req.session.pressedJoin = null;
    res.redirect('/signup');
  }
  else {
    res.redirect('/');
  }
}

function steamAuth(req, res) {
  res.redirect('/');
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
      route: '/auth/steam',
      handler: steamAuth.bind(null)
    }
  }
}
