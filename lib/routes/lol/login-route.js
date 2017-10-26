function logout(req, res){
  req.logout();
  res.redirect('/lol');
}


function authReturn(req, res) {
  // console.log(req.user['Status']);
  if(req.user['Status'] == 'Not Registered') {
    res.redirect('/lol/signup');
  }
  else {
    res.redirect('/lol');
  }
}

function login(req, res) {
  res.redirect('/lol');
}

module.exports = () =>{
  return{
    logout: {
      route: '/lol/logout',
      handler: logout.bind(null)
    },
    authReturn: {
      route: '/auth0/return',
      handler: authReturn.bind(null)
    },
    login:{
      route: '/login',
      handler: login.bind(null)
    }
  }
}
