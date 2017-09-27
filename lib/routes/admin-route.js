function admin(req, res) {
  if(req.user.admin){
    res.render('pages/admin/admin');
  }
  else{
    res.redirect('/');
  }
}

function teams(req, res) {
  if(req.user.admin){
    res.render('pages/admin/teams');
  }
  else{
    res.redirect('/');
  }
}

function profiles(req, res) {
  if(req.user.admin){
    res.render('pages/admin/profiles');
  }
  else{
    res.redirect('/');
  }
}

function teamsCreate(req, res){
  if(req.user.admin){
    res.render('pages/admin/create-team');
  }
  else{
    res.redirect('/');
  }
}

module.exports = (teamsRepo, profilesRepo) =>{
  return{
    admin: {
      route: '/admin',
      handler: admin.bind(null)
    },
    teams: {
      route: '/admin/teams',
      handler: teams.bind(null)
    },
    profiles: {
      route: '/admin/profiles',
      handler: profiles.bind(null)
    },
    teamsCreate: {
        route: '/admin/teams/create',
        handler: teamsCreate.bind(null)
    }
  }
}
