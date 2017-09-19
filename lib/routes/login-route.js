
function logout(req, res){
  req.logout();
  res.redirect('/');
}

function steamReturn(req, res) {
    if(!req.user.email){
      res.redirect('/signup');
    }
    else{
      res.redirect('/');
    }
}

function steamAuth(req, res) {
  res.redirect('/');
}

function signup(req, res) {
	let error = req.session.error;
	req.session.error = null;
	let message = req.session.message;
	req.session.message = null;
	res.render('pages/signup', { user: req.user, message: message, error: error});
}

module.exports = {
  logout: {
    route: '/logout',
    handler: logout(req, res)
  }
  steamReturn: {
    route: '/auth/steam/return',
    handler: steamReturn(req, res)
  }
  steamAuth:{
    route: '/auth/steam',
    handler: steamAuth(req, res)
  }
  signup: {
    route: '/signup',
    handler: signup(req, res)
  }
}
