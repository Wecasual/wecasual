$(document).ready(function() {
  var pathname = window.location.pathname;
  var url = window.location.href;
  var playerid = url.split('=')[1];
  if(playerid){
    populatePlayer(playerid);
  }
  //Get all user playerids and usernames
  var $loading = $('.loading-ring').hide();
  $(document)
    .ajaxStart(function () {
      $loading.show();
    })
    .ajaxStop(function () {
      $loading.hide();
    });
  $.ajax({
    type: 'POST',
    url: '/profile/getAllUsers',
    success: function(res){
      if(!res.success){
        alert(res.error);
      }
      else if(res.success){
        var player = res.data;
        player.forEach(function(ele){
          $("#user-list").append('<li><a href="#" id="' + ele.playerid + '" class="player-btn">' + ele.username + '</a></li>')
        });
      }
    }
  });
  $(document).on('click', '.player-btn', function(){
    populatePlayer(parseInt(this.id));
  });
});

function populatePlayer(playerid){
  //Remove any current info. Do for all divs
  // $('#avatar').empty();
  // $('#username').empty();
  // $('#reg-date').empty();
  // $('#premium').empty();
  // $('#points').empty();
  // $('#team').empty();
  // $('#games-played').empty();
  $('#friends-list').empty();

  //Get info  for selected player
  $.ajax({
    type: 'POST',
    url: '/profile/getUser',
    data: {playerid: playerid},
    success: function(res){
      if(!res.success){
        alert(res.error);
      }
      else if(res.success){
        var player = res.data;
        //Append  user info to each div
        if(player.avatar.includes('null')){//Set avatar to default avatar if player doesn't have one
          $('#avatar')[0].innerHTML = '<img height="128" width="128" class = "rounded-circle" src=/images/avatar-default.png alt="Avatar Image" />';
        }
        else{
          $('#avatar')[0].innerHTML = '<img height="128" width="128" class = "rounded-circle" src=' + player.avatar + ' alt="Avatar Image" />';
        }
        $('#username')[0].innerHTML = player.username;
        var date = new Date(player.registrationdate)
        $('#reg-date')[0].innerHTML = 'Member since: ' + date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
        if(player.premium){
          $('#premium')[0].innerHTML = '<img class="rounded mb-2" alt="wecasual-premium-image-active" width="64" height="64" src="/images/premium-active.png">\
          <h5><p><b>Active</b></p></h5>';
          $('#points')[0].innerHTML = '<img class="rounded mb-3" alt="wecasual-points-image" width="107" height="55" src="/images/coins-gold-dark.png">\
          <h5><b>' + player.wecasualpoints + '</b></h5>';
        }
        else{
          $('#premium')[0].innerHTML = '<img class="rounded mb-2" alt="wecasual-premium-image-non-active" width="64" height="64" src="/images/premium-non-active.png">\
          <h5><p><b>Not Active</b></p></h5>';
          $('#points')[0].innerHTML = '<img class="rounded mb-3" alt="wecasual-points-image" width="107" height="55" src="/images/coins-small.png">\
          <h5><b>N/A</b></h5>';

        }

        if(player.activeTeam[0]){
          $('#team')[0].innerHTML = '<a href="/dota/tournament"><b> ' + player.activeTeam[0].teamname + '</b></a>';
        }
        else{
          $('#team')[0].innerHTML = '<b> No Team</b>';
        }

        $('#games-played')[0].innerHTML = '<b> ' + player.totalgames + '</b>';
      }
    }
  });

  //Get selected player friend list
  $.ajax({
    type: 'POST',
    url: '/profile/getFriends',
    data: {playerid: playerid},
    success: function(res){
      if(!res.success){
        alert(res.error);
      }
      else if(res.success){
        friend = res.data;
        if(friend.length){
          friend.forEach(function(friendEle){
            $("#friends-list").append('<tr><th scope="row"><img height="46" width="46"class="rounded-circle" src=' + friendEle.avatar + '></th><td>' + friendEle.username + '</td></tr>');
          });
        }
        else{
          $("#friends-list").append('<tr><th scope="row">No Friends</th><td>:(</td></tr>')
        }
      }
    }
  });
}

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
