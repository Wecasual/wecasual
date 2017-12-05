function buyItem(itemRepo, req, res){
  if(req.body.premium == "true" && req.user.premium == false){
    res.send({
      success: false,
      error: 'You must be a premium member to purchase this item'
    });
  }
  else{
    itemRepo.buyItem(req.user.playerid, req.body.itemid, req.body.wecasualpoints, function(err, result){
      if(err){
        if(result){
          res.send({
            success: false,
            error: 'You do not have enough Wecasual Points to purchase this item'
          });
        }
        else{
          console.log(err);
          res.send({
            success: false,
            error: 'Unable to buy item'
          });
        }
      }
      else{
        req.session.message = req.body.name + ' purchased successfuly';
        res.send({
          success: true
        });
      }
    });
  }
}

function getItem(itemRepo, req, res){
  itemRepo.getItem(function(err, items){
    if(err){
      console.log(err);
      res.send({
        success: false,
        error: 'Unable to fetch items'
      });
    }
    else{
      res.send({
        success: true,
        data: items
      });
    }
  });
}

function getPlayerItem(itemRepo,req, res){
  itemRepo.getPlayerItem(req.user.playerid, function(err, items){
    if(err){
      console.log(err);
      res.send({
        success: false,
        error: 'Unable to fetch player items'
      });
    }
    else{
      res.send({
        success: true,
        data: items
      });
    }
  });
}

module.exports = (itemRepo) =>{
  return{
    buyItem: {
      route: '/item/buyItem',
      handler: buyItem.bind(null, itemRepo)
    },
    getItem: {
      route: '/item/getItem',
      handler: getItem.bind(null, itemRepo)
    },
    getPlayerItem: {
      route: '/item/getPlayerItem',
      handler: getPlayerItem.bind(null, itemRepo)
    }
  }
}
