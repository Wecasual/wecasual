//GET
function signup(req, res) {
  if(req.isAuthenticated()) {
    res.render('pages/signup', { user: req.user, signupInfo: req.session.signupInfo });
  }
  else {
    req.session.pressedJoin = true;
    res.redirect('/auth/steam');
  }
}

function payment(req, res) {
  res.render('pages/payment', { user:req.user });
}

//POST
function signupSubmit(req, res) {
  req.session.signupInfo = req.body;
  console.log(req.session.signupInfo);
  res.redirect('/payment');
}



module.exports = () =>{
  return{
    signup: {
      route: '/signup',
      handler: signup.bind(null)
    },
    payment: {
      route: '/payment',
      handler: payment.bind(null)
    },
    signupSubmit: {
      route: '/signup/submit',
      handler: signupSubmit.bind(null)
    }
  }
}
