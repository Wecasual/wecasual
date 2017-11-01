//GET
function signup(req, res) {
  if(req.isAuthenticated() && req.user['Status'] == 'Not Registered') {
    if(req.session.realm == "dota"){
      res.render('pages/dota/signup', { user: req.user});
    }
    else if(req.session.realm == "lol"){
      res.render('pages/lol/signup', { user: req.user});
    }
  }
  else{
    res.redirect('/auth/discord');
  }
}


//POST
function submit(profilesRepo, req, res) {
  profilesRepo.updateUser({"Email": req.body.email, "Status": "Registered", "Skill Level": req.body['skill-level'], "Registration Date": new Date(), "Id": req.user['Id']}, req.user['Id'], function(err, user){
    if(err){
      console.log(err);
    }
    else{
      req.user['Status'] = "Registered";
      req.user['Email'] = req.body.email;
      req.user['Skill Level'] = req.body['skill-level'];
      if(req.session.realm == "dota"){
        res.redirect('/dota/thank-you-signup');
      }
      else if(req.session.realm == "lol"){
        res.redirect('/lol/thank-you-signup');
      }
    }
  });
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
    }
  }
}
