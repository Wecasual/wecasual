function admin(req, res) {
  if(req.user.admin){
    res.render('pages/admin/admin');
  }
  else{
    res.redirect('/');
  }
}

function adminTeams(req, res) {
  if(req.user.admin){
    res.render('pages/admin/teams');
  }
  else{
    res.redirect('/');
  }
}

function adminProfiles(req, res) {
  if(req.user.admin){
    res.render('pages/admin/profiles');
  }
  else{
    res.redirect('/');
  }
}

module.exports = (teams, profiles) =>{
  return{
    admin: {
      route: '/admin',
      handler: admin.bind(null)
    },
    adminTeams: {
      route: '/admin/teams',
      handler: adminTeams.bind(null)
    },
    adminProfiles: {
      route: '/admin/profiles',
      handler: adminProfiles.bind(null)
    }
  }
}
