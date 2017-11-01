//GET
function signup(req, res) {
  if(req.isAuthenticated() && req.user['Status'] == 'Not Registered') {
    res.render('pages/dota/signup', { user: req.user});
  }
  else{
    res.redirect('/auth/steam');
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
      res.redirect('/dota/thank-you-signup');
    }
  });
}

module.exports = (profilesRepo) =>{
  return{
    signup: {
      route: '/dota/signup',
      handler: signup.bind(null)
    },
    submit: {
      route: '/dota/signup/submit',
      handler: submit.bind(null, profilesRepo)
    }
  }
}
