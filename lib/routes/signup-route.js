//GET
function signup(req, res) {
  // if(req.isAuthenticated() && req.user['Status'] == 'Not Registered') {
  //   res.render('pages/choose-game')
  // }
  if(req.isAuthenticated() && req.user['Status'] == 'Not Registered') {
    res.redirect('/dota/signup');
  }
  else if(req.isAuthenticated() && !req.user['dota'] && req.session.realm == "dota") {
    res.render('pages/dota/skill-level', { user: req.user});
  }
  else if(req.isAuthenticated() && !req.user['lol'] && req.session.realm == "lol") {
    res.render('pages/lol/skill-level', { user: req.user});
  }
  else{
    res.redirect('/auth/discord');
  }
}


//POST
function submit(profilesRepo, req, res) {

  var realm = req.session.realm;
  profilesRepo.updateUser({"Email": req.body.email, "Status": "Registered", [realm + " Skill Level"]: req.body['skill-level'], "Registration Date": new Date(), "Id": req.user['Id'], [realm]: true}, req.user['Id'], function(err, user){
    if(err){
      console.log(err);
    }
    else{
      req.user['Status'] = "Registered";
      req.user['Email'] = req.body.email;
      req.user[realm + " Skill Level"] = req.body['skill-level'];
      req.user[realm] = true;
      if(realm == "dota"){
        res.redirect('/dota/thank-you-signup');
      }
      else if(realm == "lol"){
        res.redirect('/lol/thank-you-signup');
      }
      // else if(realm == "dota/quickLink"){
      //   res.redirect('/schedule/dota/quickLink?id=' + req.session.quickLinkId);
      // }
    }
  });
}

function submitSkillLevel(profilesRepo, req, res) {
  var realm = req.session.realm;
  profilesRepo.updateUser({[realm + " Skill Level"]: req.body['skill-level'], [realm]: true}, req.user['Id'], function(err, user){
    if(err){
      console.log(err);
    }
    else{
      req.user[realm + " Skill Level"] = req.body['skill-level'];
      req.user[realm] = true;
      if(realm == "dota"){
        res.redirect('/dota');
      }
      else if(realm == "lol"){
        res.redirect('/lol');
      }
      // else if(realm == "dota/quickLink"){
      //   res.redirect('/schedule/dota/quickLink?id=' + req.session.quickLinkId);
      // }
    }
  });
}

function dotaSignup(req, res){
  if(!req.user){
    res.redirect('/signup');
  }
  else if(req.user && req.user['Status'] != 'Not Registered' && !req.user['dota']) {
    res.render('pages/dota/skill-level', { user: req.user});
  }
  else{
    res.render('pages/dota/signup', {user: req.user});
  }
}

function lolSignup(req, res){
  if(!req.user){
    res.redirect('/signup');
  }
  else if(req.user && req.user['Status'] != 'Not Registered' && !req.user['lol']) {
    res.render('pages/lol/skill-level', { user: req.user});
  }
  else{
    res.render('pages/lol/signup', {user: req.user});
  }
}

module.exports = (profilesRepo) =>{
  return{
    signup: {
      route: '/signup',
      handler: signup.bind(null)
    },
    submit: {
      route: '/signup/submit',
      handler: submit.bind(null, profilesRepo)
    },
    submitSkillLevel: {
      route: '/signup/submitSkillLevel',
      handler: submitSkillLevel.bind(null, profilesRepo)
    },
    dotaSignup: {
      route: '/dota/signup',
      handler: dotaSignup.bind(null)
    },
    lolSignup: {
      route: '/lol/signup',
      handler: lolSignup.bind(null)
    }
  }
}
