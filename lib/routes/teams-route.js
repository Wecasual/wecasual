function  joinTeam(req, res){
  res.render('join-team', { user: req.user});
}

function createTeam(req, res){
  res.render('create-team', { user: req.user});
}

module.exports = {
  joinTeam: {
    route: '/join-team',
    handler: joinTeam(req, res)
  }
  createTeam: {
    route: '/create-team',
    handler: createTeam(req, res)
  }
}
