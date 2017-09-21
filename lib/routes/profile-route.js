function profile(req, res){
  let error = req.session.error;
  req.session.error = null;
  let message = req.session.message;
  req.session.message = null;
  res.render('pages/profile', { user: req.user, message: message, error: error });
}

function updateEmail(profiles, req, res){
  req.checkBody('email', 'Please enter your email address').notEmpty();
  req.checkBody('email', 'Please enter a valid email address').isEmail();
  let error = req.validationErrors();
  let message = null;

  if(error){
    req.session.error = error[0].msg;
    res.redirect(req.get('referer'));
  }
  else{
    let newEmail = req.body.email;
    profiles.updateEmail(newEmail, function(err){
      if(err){
        req.session.error = "Error adding email. Please try again later";
        res.redirect(req.get('referer'));
      }
      else{
        req.user.email = newEmail;
        var postingURL = req.get('referer').slice(req.get('referer').lastIndexOf('/')+1, req.get('referer').length);
        if(postingURL ==  'signup'){
          res.redirect('/');
        }
        else if(postingURL == 'profile'){
          req.session.message = "Email added successfully";
          res.redirect('/profile');
        }
      }
    }, req, res);
  }
}

module.exports = (profiles) => {
  return{
    profile: {
      route: '/profile',
      handler: profile.bind(null)
    },
    updateEmail: {
      route: '/profile/updateEmail',
      handler: updateEmail.bind(null, profiles)
    }
  }
}
