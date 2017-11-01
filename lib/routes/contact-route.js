function contact(req, res){
  if(req.session.realm == "dota"){
      res.render('pages/contact', {user: req.user, realm: "dota"});
  }
  else if(req.session.realm == "lol"){
      res.render('pages/contact', {user: req.user, realm: "lol"});
  }

}

function submit(contactRepo, req, res){
  if(req.user){
    contactRepo.submit(req.body.message, req.body.subject, [req.user['Id']], null, req.session.realm, function(err){
      if(err){
        console.log(err);
        res.send({
          success: false,
          error: "Error sending message."
        });
      }
      else{
        res.send({
          success: true,
          message: "Message sent successfully."
        });
      }
    });
  }
  else{
    contactRepo.submit(req.body.message, req.body.subject, null, req.body.email, req.session.realm, function(err){
      if(err){
        console.log(err);
        res.send({
          success: false,
          error: "Error sending message."
        });
      }
      else{
        res.send({
          success: true,
          message: "Message sent successfully."
        });
      }
    });
  }

}

module.exports = (contactRepo) =>{
  return{
    contact: {
      route: '/contact',
      handler: contact.bind(null)
    },
    submit: {
      route: '/contact/submit',
      handler: submit.bind(null, contactRepo)
    }
  }
}
