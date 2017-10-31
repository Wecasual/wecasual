$(document).ready(function() {
  //Get friends and friend requests
  var friendsList;
  var friendRequests;
  var friendIds = new Array();
  var friendRequestIds = new Array();
  var userId = $("#userid").html();
  $.ajax({
    type: 'POST',
    url: '/dota/profile/getFriends',
    data: {id: userId},
    success: function(res){
      if(!res.success){
        alert(res.error);
      }
      else if(res.success){
        friendsList = res.data.friendsList;
        friendRequests = res.data.friendRequests;
        friendsList.forEach(function(ele){
          $("#friends-list").append('<tr><th scope="row"><img class="rounded-circle" src=' + ele['Avatar'] + '></th><td>' + ele['Steam Name'] + '</td></tr>')
          friendIds.push(ele['Id']);
        });
        var i = 0;
        friendRequests.forEach(function(ele){
          $("#friend-requests").append('<tr id="' + ele['Id'] + '"><th scope="row"><img class="rounded-circle" src=' + ele['Avatar'] + '></th><td>' + ele['Steam Name'] +
          '</td><td><button type="button" class="btn btn-success">&#10004;</button></td>\
          <td><button type="button" class="btn btn-danger">&#10008;</button></td></tr>');
          friendRequestIds.push(ele['Id']);
          i++;
        });
      }
    }
  });
  $(document).on('click', '.btn-success', function(){
    var index = friendRequestIds.indexOf($(this).closest('tr').attr('id'));
    //Get data for new friend
    var newFriend = friendRequests[index];
    $.ajax({
      type: 'POST',
      url: '/dota/profile/acceptFriend',
      contentType: 'application/json',
      data: JSON.stringify({id: userId,
      friendIds: friendIds,
      friendRequestIds: friendRequestIds,
      index: index}),
      success: function(res){
        if(!res.success){
          alert(res.error);
        }
        else if(res.success){
          $('#' + friendRequestIds[index]).remove();
          $("#friends-list").append('<tr><th scope="row"><img class="rounded-circle" src=' + newFriend['Avatar'] + '></th><td>' + newFriend['Steam Name'] + '</td></tr>')
          friendIds.push(friendRequestIds[index]);
          if(friendRequestIds.length == 1){
            friendRequests = [];
            friendRequestIds = [];
          }
          else{
            friendRequests.splice(index, 1);
            friendRequestIds.splice(index, 1);
          }
          friendsList.push(newFriend);
        }
      }
    });
  });
  $(document).on('click', '.btn-danger', function(){
    var index = friendRequestIds.indexOf($(this).closest('tr').attr('id'));
    $.ajax({
      type: 'POST',
      url: '/dota/profile/declineFriend',
      contentType: 'application/json',
      data: JSON.stringify({id: userId,
      friendRequestIds: friendRequestIds,
      index: index}),
      success: function(res){
        if(!res.success){
          alert(res.error);
        }
        else if(res.success){
          $('#' + friendRequestIds[index]).remove();
          if(friendRequestIds.length == 1){
            friendRequests = [];
            friendRequestIds = [];
          }
          else{
            friendRequests.splice(index, 1);
            friendRequestIds.splice(index, 1);
          }
        }
      }
    });
  });
  //Send friend request

});
