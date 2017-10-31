function getFriends(profilesRepo, req, res){
  profilesRepo.getUser(req.body.id, function(err, user){
    console.log(user);
  });
}


module.exports = (profilesRepo) =>{
  return{
    getFriends: {
      route: '/dota/profile/getFriends',
      handler: getFriends.bind(null, profilesRepo)
    }
  }
}
