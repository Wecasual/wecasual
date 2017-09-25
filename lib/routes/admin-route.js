function admin(req, res) {
  if(req.user.admin){
    res.render('pages/admin');
  }
  else{
    res.redirect('/');
  }
}



module.exports = () =>{
  return{
    admin: {
      route: '/admin',
      handler: admin.bind(null)
    }
  }
}
