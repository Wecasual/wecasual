var item;
var playerItem;
var selectedItem;

$.ajax({
  type: 'POST',
  url: '/item/getItem',
  success: function(res){
    if(!res.success){
      alert(res.error);
    }
    else if(res.success){
      item = res.data;
      var html ='';
      item.forEach(function(item){
        if(item.premium){
          html += '<div class="item-card item-card-premium item-card-buy p-1 mb-1" id="item-' + item.itemid + '">\
          <div class="row">\
            <div class="col-md-8">\
              <img height="30" width="30" src=' + item.icon + '> ' + item.name + '\
            </div>\
            <div class="col-md-4">\
              <div class="pull-right">Premium&nbsp;&nbsp;<img height="20" width="39" src=/images/coins-gold-dark.png>&nbsp;&nbsp;' + item.wecasualpoints + '</div>\
            </div>\
          </div></div>';
        }
        else{
          html += '<div class="item-card item-card-buy p-1 mb-1" id="item-' + item.itemid + '">\
          <div class="row">\
            <div class="col-md-8">\
              <img height="30" width="30" src=' + item.icon + '> ' + item.name + '\
            </div>\
            <div class="col-md-4">\
              <div class="pull-right"><img height="20" width="39" src=/images/coins-gold-dark.png>&nbsp;&nbsp;' + item.wecasualpoints + '</div>\
            </div>\
          </div></div>';
        }
      });
      $('#item-container').html(html);
    }
  }
});

$.ajax({
  type: 'POST',
  url: '/item/getPlayerItem',
  success: function(res){
    if(!res.success){
      alert(res.error);
    }
    else if(res.success){
      playerItem = res.data;
      var html ='';
      playerItem.forEach(function(item){
        if(item.redeemed){
          html += '<div class="item-card item-card-redeemed item-card-buy p-1 mb-1" id="item-' + item.itemid + '">\
          <div class="row">\
            <div class="col-md-8">\
              <img height="30" width="30" src=' + item.icon + '> ' + item.name + '\
            </div>\
            <div class="col-md-4">\
              <div class="pull-right">Redeemed&nbsp;&nbsp;<img height="20" width="39" src=/images/coins-gold-dark.png>&nbsp;&nbsp;' + item.wecasualpoints + '</div>\
            </div>\
          </div></div>';
        }
        else{
          html += '<div class="item-card item-card-purchased p-1 mb-1" id="item-' + item.itemid + '">\
          <div class="row">\
            <div class="col-md-8">\
              <img height="30" width="30" src=' + item.icon + '> ' + item.name + '\
            </div>\
            <div class="col-md-4">\
              <div class="pull-right"><img height="20" width="39" src=/images/coins-gold-dark.png>&nbsp;&nbsp;' + item.wecasualpoints + '</div>\
            </div>\
          </div></div>';
        }
        // html += ' <div class="item-card item-card-purchased p-1 mb-1" id="item-' + item.itemid + '"><img height="30" width="30" src=' + item.icon + '> ' + item.name + '</div>';
      });
      $('#item-purchased-container').html(html);
    }
  }
});

//Close item info dialog when click outside of box
$(document).on('click', '#item-opacity', function(){
  $('#item-cost').html("");
  $('#item-other').html("");
  $('#buy-error').html("");
  $('#item-opacity').fadeOut('fast');
  $('#item-info').slideUp('fast');
});

$(document).on('click', '.item-card-buy', function(){
  var selectedItemid = this.id.split('-')[1];
  selectedItem = getItem(selectedItemid, item);
  $('#item-name').html('<img height="30" width="30" src=' + selectedItem.icon + '> ' + selectedItem.name);
  $('#item-desc').html(selectedItem.description);
  $('#item-cost').html('<img height="20" width="39" src=/images/coins-gold-dark.png> ' + selectedItem.wecasualpoints + " Wecasual Points");
  $('#item-other').html('<div class="pink-btn btn btn-primary text-center mt-2 mb-1" id="item-buy">Buy</div><div><small class="" id="buy-error"></small></div>');
  $('#item-opacity').fadeIn('fast');
  $('#item-info').slideDown('fast');
});

$(document).on('click', '.item-card-purchased', function(){
  var selectedItemid = this.id.split('-')[1];
  selectedItem = getItem(selectedItemid, playerItem);
  $('#item-name').html('<img height="30" width="30" src=' + selectedItem.icon + '> ' + selectedItem.name);
  $('#item-desc').html(selectedItem.description);
  date = new Date(selectedItem.purchasedate)
  $('#item-other').html('Purchased: ' + date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate());
  $('#item-opacity').fadeIn('fast');
  $('#item-info').slideDown('fast');
});

$(document).on('click', '#item-buy', function(){
  $.ajax({
    type: 'POST',
    url: '/item/buyItem',
    data: selectedItem,
    success: function(res){
      if(!res.success){
        $('#buy-error').html(res.error);
      }
      else if(res.success){
        location.reload();
      }
    }
  })
})

function getItem(itemid, array){
  var i = 0;
  do{
    if(array[i].itemid == itemid){
      return array[i];
    }
    i++;
  }while(i < array.length);
  return -1;
}
