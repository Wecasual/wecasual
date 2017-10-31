$(document).ready(function() {
  //Get friends and friend requests
  console.log($("#userid").innerHTML);
  $.ajax({
    type: 'POST',
    url: '/dota/profile/getFriends',
    data: $("#userid").innerHTML,
    success: function(res){
      if(!res.success){
        alert(res.error);
      }
      else if(res.success){
        // console.log(res.data);
        res.data.forEach(function(ele){

        });
      }
    }
  });
  //Send friend request

});
