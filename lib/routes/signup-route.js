function signup(req, res) {
  if(req.isAuthenticated()) {
    let error = req.session.error;
    req.session.error = null;
    let message = req.session.message;
    req.session.message = null;
    res.render('pages/signup', { user: req.user, message: message, error: error});
  }
  else {
    req.session.pressedJoin = true;
    res.redirect('/auth/steam');
  }

  // let error = req.session.error;
	// req.session.error = null;
	// let message = req.session.message;
	// req.session.message = null;
	// res.render('pages/signup', { user: req.user, message: message, error: error});
}

function signupSubmit(req, res) {
  console.log("hello");
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
