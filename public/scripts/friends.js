$(document).ready(function() {
  //Get friends and friend requests
  var friend;
  var friendid = new Array();
  var friendRequest;
  var friendRequestid = new Array();
  var id = $("#userid").html();
  var player;
  var playerid = new Array();
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
        data: {playerid: id},
        success: function(res){
          if(!res.success){
            alert(res.error);
          }
          else if(res.success){
            friend = res.data;
            var html = "";
            friend.forEach(function(fr){
              var avatar = fr.avatar;
              if(avatar.includes('null')){
                avatar='/images/avatar-default.png';
              }
              html += '<a class="roster-link" href="dota/players?playerid=' + fr.friendid +
              '" target="_blank"><div class="card-player mb-1 p-1"><img height="20" width="20" class = "rounded-circle" src=' + avatar + ' alt"Avatar"> ' +
              fr.username + '</div></a>';
              // $("#friends-list").append('<tr><th scope="row"><img height="46" width="46"class="rounded-circle" src=' + ele.avatar + '></th><td>' + ele.username + '</td></tr>')
              friendid.push(fr.friendid);
            });
            $("#friends-list")[0].innerHTML = html;
            $.ajax({
              type: 'POST',
              url: '/profile/getAllUsers',
              success: function(res){
                if(!res.success){
                  alert(res.error);
                }
                else if(res.success){
                  player = res.data;
                  player.forEach(function(ele){
                    if(friendid.indexOf(ele.playerid) == -1 && ele.playerid != id){
                      $("#user-list").append('<li><a href="#" id="' + ele.playerid + '" class="friend-request-send">' + ele.username + '</a></li>')
                      playerid.push(ele.playerid);
                    }
                  });
                }
              }
            });
          }
        }
      });
      $.ajax({
        type: 'POST',
        url: '/profile/getFriendReq',
        data: {playerid: id},
        success: function(res){
          if(!res.success){
            alert(res.error);
          }
          else if(res.success){
            friendRequest = res.data;
            var html = "";
            friendRequest.forEach(function(frReq){
              var avatar = frReq.avatar;
              if(avatar.includes('null')){
                avatar='/images/avatar-default.png';
              }
              html += '<div class="row mb-1"><div class="col-md-8"><a class="roster-link" href="dota/players?playerid=' + frReq.reqid +
              '" target="_blank"><div class="card-player mb-1 p-1"><img height="20" width="20" class = "rounded-circle" src=' + avatar + ' alt"Avatar"> ' +
              frReq.username + '</div></a></div><div class="col-md-2"><button id="req-' + frReq.reqid + '" type="button" class="btn btn-success">&#10004;</button></div><div class="col-md-2">\
              <button id="req-' + frReq.reqid + '" type="button" class="btn btn-danger">&#10008;</button></div></div>';
              // html += '<tr><td><a class="roster-link" href="dota/players?playerid=' + frReq.playerid +
              // '" target="_blank"><div class="card-player mb-1 p-1"><img height="20" width="20" class = "rounded-circle" src=' + avatar + ' alt"Avatar"> ' +
              // frReq.username + '</div></a></td><td><button type="button" class="btn btn-success">&#10004;</button></td><td>\
              // <button type="button" class="btn btn-danger">&#10008;</button></td></tr>';
            });
            $('#friend-requests')[0].innerHTML = html;
          //   friendRequest.forEach(function(ele){
          //     $("#friend-requests").append('<tr id="' + ele.playerid + '"><th scope="row"><img height="46" width="46" class="rounded-circle" src=' + ele.avatar + '></th><td>' + ele.username +
          //     '</td><td><button type="button" class="btn btn-success">&#10004;</button></td>\
          //     <td><button type="button" class="btn btn-danger">&#10008;</button></td></tr>');
          //     friendRequestid.push(ele.playerid);
          //   });
          // }
          }
        }
      });
    }
  });
  $(document).on('click', '.btn-success', function(){
    reqid = this.id.substring(4, this.id.length);
    $.ajax({
      type: 'POST',
      url: '/profile/acceptFriend',
      contentType: 'application/json',
      data: JSON.stringify({
        playerid: id,
        reqid: reqid
      }),
      success: function(res){
        if(!res.success){
          alert(res.error);
        }
        else if(res.success){
          location.reload();
        }
      }
    });
  });
  $(document).on('click', '.btn-danger', function(){
    reqid = this.id.substring(4, this.id.length);
    $.ajax({
      type: 'POST',
      url: '/profile/declineFriend',
      contentType: 'application/json',
      data: JSON.stringify({
        playerid: id,
        reqid: reqid
      }),
      success: function(res){
        if(!res.success){
          alert(res.error);
        }
        else if(res.success){
          location.reload();
        }
      }
    });
  });
  $(document).on('click', '.friend-request-send', function(){
    if(confirm("Send friend request?")){
      var requestId = this.id;
      $.ajax({
        type: 'POST',
        url: '/profile/sendFriendReq',
        contentType: 'application/json',
        data: JSON.stringify({playerid: requestId,
        reqid: id}),
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
