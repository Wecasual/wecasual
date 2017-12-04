var item;
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
        html += ' <div class="item-card p-1 mb-1" id="item-' + item.itemid + '"><img height="30" width="30" src=' + item.icon + '> ' + item.name +
        '<div class="item-points"><img height="20" width="39" src=/images/coins-gold-dark.png> ' + item.wecasualpoints + '</div></div>';
      });
      $('#item-container').html(html);
    }
  }
});

//Close item info dialog when click outside of box
$(document).on('click', '#item-opacity', function(){
  $('#item-opacity').fadeOut('fast');
  $('#item-info').slideUp('fast');
});

$(document).on('click', '.item-card', function(){
  var selectedItemid = this.id.split('-')[1];
  selectedItem = getItem(selectedItemid, item);
  $('#item-name').html('<img height="30" width="30" src=' + selectedItem.icon + '> ' + selectedItem.name);
  $('#item-desc').html(selectedItem.description);
  $('#item-cost').html('<img height="20" width="39" src=/images/coins-gold-dark.png> ' + selectedItem.wecasualpoints + " Wecasual Points");
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
        alert(res.error);
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
