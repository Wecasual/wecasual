$(document).ready(function() {
  //Get friends and friend requests
  var friendsList;
  var friendRequests;
  var friendIds = new Array();
  var friendRequestIds = new Array();
  var userId = $("#userid").html();
  var users;
  var userIds = new Array();
  var $loading = $('.loading-ring').hide();
  var retrievedFriends = false;
  $(document)
    .ajaxStart(function () {
      $loading.show();
    })
    .ajaxStop(function () {
      $loading.hide();
    });
  $(document).on('click', '#list-profile-list', function(){
    if(!retrievedFriends){
      retrievedFriends = true;
      $.ajax({
        type: 'POST',
        url: '/profile/getFriends',
        data: {id: userId},
        success: function(res){
          if(!res.success){
            alert(res.error);
          }
          else if(res.success){
            friendsList = res.data.friendsList;
            friendRequests = res.data.friendRequests;
            users = res.data.users;
            friendsList.forEach(function(ele){
              $("#friends-list").append('<tr><th scope="row"><img height="46" width="46"class="rounded-circle" src=' + ele['Avatar'] + '></th><td>' + ele['Username'] + '</td></tr>')
              friendIds.push(ele['Id']);
            });
            friendRequests.forEach(function(ele){
              $("#friend-requests").append('<tr id="' + ele['Id'] + '"><th scope="row"><img height="46" width="46" class="rounded-circle" src=' + ele['Avatar'] + '></th><td>' + ele['Username'] +
              '</td><td><button type="button" class="btn btn-success">&#10004;</button></td>\
              <td><button type="button" class="btn btn-danger">&#10008;</button></td></tr>');
              friendRequestIds.push(ele['Id']);
            });
            users.forEach(function(ele){
              $("#user-list").append('<li><a href="#" id="' + ele['Id'] + '" class="friend-request-send">' + ele['Username'] + '</a></li>')
              userIds.push(ele['Id']);
            });
          }
        }
      });
    }
  });
  $(document).on('click', '.btn-success', function(){
    var index = friendRequestIds.indexOf($(this).closest('tr').attr('id'));
    //Get data for new friend
    var newFriend = friendRequests[index];
    $.ajax({
      type: 'POST',
      url: '/profile/acceptFriend',
      contentType: 'application/json',
      data: JSON.stringify({id: userId,
      friendIds: friendIds,
      friendRequestIds: friendRequestIds,
      friendRequests: friendRequests,
      index: index}),
      success: function(res){
        if(!res.success){
          alert(res.error);
        }
        else if(res.success){
          $('#' + friendRequestIds[index]).remove();
          $("#friends-list").append('<tr><th scope="row"><img height="46" width="46" class="rounded-circle" src=' + newFriend['Avatar'] + '></th><td>' + newFriend['Username'] + '</td></tr>')
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
      url: '/profile/declineFriend',
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
  $(document).on('click', '.friend-request-send', function(){
    if(confirm("Send friend request?")){
      var requestId = this.id;
      var currentRequests = users[userIds.indexOf(requestId)]['Friend Requests'];
      $.ajax({
        type: 'POST',
        url: '/profile/sendFriendRequest',
        contentType: 'application/json',
        data: JSON.stringify({id: requestId,
        requesterId: userId,
        currentRequests: currentRequests}),
        success: function(res){
          if(!res.success){
            alert(res.error);
          }
          else if(res.success){
            alert(res.message);
          }
        }
      });
    }
  });
  //Send friend request
});

function search() {
    // Declare variables
    var input, filter, ul, li, a, i;
    input = document.getElementById('user-search');
    filter = input.value.toUpperCase();
    ul = document.getElementById("user-list");
    li = ul.getElementsByTagName('li');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}
