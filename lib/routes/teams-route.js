function  joinTeam(req, res){
  res.render('pages/join-team', { user: req.user});
}

function createTeam(req, res){
  if(req.user.paid){
    res.render('pages/create-team', { user: req.user});
  }
  else{
    //redirect to payment
    res.redirect('/account');
  }

}

module.exports = {
  joinTeam: {
    route: '/join-team',
    handler: joinTeam.bind(null)
  },
  createTeam: {
    route: '/create-team',
    handler: createTeam.bind(null)
  }
}
