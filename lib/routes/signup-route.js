function signup(req, res) {
  if(req.isAuthenticated()) {
    res.render('pages/signup', { user: req.user });
  }
  else {
    req.session.pressedJoin = true;
    res.redirect('/auth/steam');
  }
}

function signupSubmit(req, res) {
  console.log(req.body);
}

module.exports = () =>{
  return{
    signup: {
      route: '/signup',
      handler: signup.bind(null)
    },
    signupSubmit: {
      route: '/signup/submit',
      handler: signupSubmit.bind(null)
    }
  }
}
