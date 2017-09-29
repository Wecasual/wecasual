var gf = require('./../../repos/globalFuncs')();

function profile(req, res){
  let error = req.session.error;
  req.session.error = null;
  let message = req.session.message;
  req.session.message = null;
  res.render('pages/profile', { user: req.user, message: message, error: error });
}

function updateEmail(profilesRepo, req, res){
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
    profilesRepo.updateUser([{field: "email", value: '\'' + newEmail + '\''}], req.user.id, function(err){
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

function updatePlayerRequests(profilesRepo, req, res){
  var playerRequestsArray = req.body['player-request'];
  if(!playerRequestsArray){
    playerRequestsArray = ['', '', '', ''];
  }
  if(typeof playerRequestsArray === 'string'){
    playerRequestsArray = [playerRequestsArray, '', '', ''];
  }
  var playerRequestsJson = {};
  for(var i = 0; i < 4; i++){
    if(i < playerRequestsArray.length){
      playerRequestsArray[i] = gf.addEscape(playerRequestsArray[i]);
      playerRequestsJson['player' + (i + 1)] = playerRequestsArray[i];
    }
    else{
      playerRequestsJson['player' + (i + 1)] = '';
    }
  }
  profilesRepo.updateUser([{field: "playerrequests", value: '\'' + JSON.stringify(playerRequestsJson) + '\''}], req.user.id, function(err){
    if(err){
      console.log('fail');
      res.send({
        success: false,
        error: 'Unable to update teammate requests. Try again later.'
      });
    }
    else {
      req.user.playerrequests = playerRequestsJson;
      res.send({
        success: true,
        message: 'Teammates requests updated.'
      });
    }
  });
}


module.exports = (profilesRepo) => {
  return{
    profile: {
      route: '/profile',
      handler: profile.bind(null)
    },
    updateEmail: {
      route: '/profile/updateEmail',
      handler: updateEmail.bind(null, profilesRepo)
    },
    updatePlayerRequests: {
      route: '/profile/updatePlayerRequests',
      handler: updatePlayerRequests.bind(null, profilesRepo)
    }
  }
}
