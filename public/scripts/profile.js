$(document).ready(function() {
  var friendid = new Array();
  var friendRequestid = new Array();
  var playerid = $("#userid").html();
  var playerids = new Array();
  var retrievedFriends = false;

  //=====LOADING RING=====
  // var $loading = $('.loading-ring').hide();
  // $(document)
  //   .ajaxStart(function () {
  //     $loading.show();
  //   })
  //   .ajaxStop(function () {
  //     $loading.hide();
  //   });


  //=====FRIENDS=====
  //Populate friends and friend requests
  if(!retrievedFriends){
    retrievedFriends = true;
    $.ajax({
      type: 'POST',
      url: '/profile/getFriendReq',
      data: {playerid: playerid},
      success: function(res){
        if(!res.success){
          alert(res.error);
        }
        else if(res.success){
          var html = "";
          res.data.forEach(function(frReq){
            var avatar = frReq.avatar;
            if(avatar.includes('null')){
              avatar='/images/avatar-default.png';
            }
            html += '<div class="row mb-1"><div class="col-md-8"><a class="roster-link" href="dota/players?playerid=' + frReq.reqid +
            '" target="_blank"><div class="card-player mb-1 p-1"><img height="20" width="20" class = "rounded-circle" src=' + avatar + ' alt"Avatar"> ' +
            frReq.username + '</div></a></div><div class="col-md-2"><button id="req-' + frReq.reqid + '" type="button" class="btn btn-success">&#10004;</button></div><div class="col-md-2">\
            <button id="req-' + frReq.reqid + '" type="button" class="btn btn-danger">&#10008;</button></div></div>';
            friendRequestid.push(frReq.reqid);
          });
          $('#friend-requests')[0].innerHTML = html;
        }
      }
    });
    $.ajax({
      type: 'POST',
      url: '/profile/getFriends',
      data: {playerid: playerid},
      success: function(res){
        if(!res.success){
          alert(res.error);
        }
        else if(res.success){
          var html = "";
          res.data.forEach(function(fr){
            var avatar = fr.avatar;
            if(avatar.includes('null')){
              avatar='/images/avatar-default.png';
            }
            html += '<a class="roster-link" href="dota/players?playerid=' + fr.playerid +
            '" target="_blank"><div class="card-player mb-1 p-1"><img height="20" width="20" class = "rounded-circle" src=' + avatar + ' alt"Avatar"> ' +
            fr.username + '</div></a>';
            friendid.push(fr.playerid);
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
                res.data.forEach(function(ele){
                  if(friendid.indexOf(ele.playerid) == -1 && friendRequestid.indexOf(ele.playerid) == -1 && ele.playerid != playerid){
                    $("#user-list").append('<li><a href="#" id="' + ele.playerid + '" class="friend-request-send">' + ele.username + '</a></li>')
                    playerids.push(ele.playerid);
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
      url: '/schedule/getAllSchedule',
      contentType: 'application/json',
      success: function(res){
        if(!res.success){
          alert(res.error);
        }
        else if(res.success){
          res.data.myGames.forEach(function(game){
            var team;
            if(game.team1){
              if(game.team1.includes(res.data.playerid)){
                team = 'Team 1';
              }
            }
            if(game.team2){
              if(game.team2.includes(res.data.playerid)){
                team = 'Team 2';
              }
            }
            if(game.pubsession){
              $('#my-game-list').append('<tr><td>' +
              game.name + '</td><td>' +
              game.gametime + '</td><td>' +
              game.team1Slots + '</td> <td>N/A</td><td>' + team + '</td><td>' +
              game.discordroom + '</td></tr>');
            }
            else{
              $('#my-game-list').append('<tr><td>' +
              game.name + '</td><td>' +
              game.gametime + '</td><td>' +
              game.team1Slots + '</td> <td>' + game.team2Slots + '</td><td>' + team + '</td><td>' +
              game.discordroom + '</td></tr>');
            }
          });
        }
      }
    });
  }

  //Accept friend request
  $(document).on('click', '.btn-success', function(){
    reqid = this.id.substring(4, this.id.length);
    $.ajax({
      type: 'POST',
      url: '/profile/acceptFriend',
      contentType: 'application/json',
      data: JSON.stringify({
        playerid: playerid,
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

  //Decline friend request
  $(document).on('click', '.btn-danger', function(){
    reqid = this.id.substring(4, this.id.length);
    $.ajax({
      type: 'POST',
      url: '/profile/declineFriend',
      contentType: 'application/json',
      data: JSON.stringify({
        playerid: playerid,
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

  //Send friend request
  $(document).on('click', '.friend-request-send', function(){
    if(confirm("Send friend request?")){
      var requestId = this.id;
      $.ajax({
        type: 'POST',
        url: '/profile/sendFriendReq',
        contentType: 'application/json',
        data: JSON.stringify({playerid: requestId,
        reqid: playerid}),
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
});

//Search player list for sending friend request
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
