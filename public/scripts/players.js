$(document).ready(function() {
  var pathname = window.location.pathname;
  var url = window.location.href;
  var playerid = url.split('=')[1];
  if(!playerid){
    playerid = $("#userid").html();
  }
  if(playerid){
    populatePlayer(playerid);
  }
  //Get all user playerids and usernames
  // var $loading = $('.loading-ring').hide();
  // $(document)
  //   .ajaxStart(function () {
  //     $loading.show();
  //   })
  //   .ajaxStop(function () {
  //     $loading.hide();
  //   });
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
        var avatar = player.avatar;
        if(avatar.includes('null')){
          avatar='/images/avatar-default.png';
        }
        $('#avatar').html('<img height="128" width="128" class = "rounded-circle" src=' + avatar + ' alt="Avatar Image" />');
        $('#username').html(player.username);
        var date = new Date(player.registrationdate)
        $('#reg-date').html('Member since: ' + date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate());
        if(player.premium){
          $('#premium').html('<img class="rounded mb-2" alt="wecasual-premium-image-active" width="64" height="64" src="/images/premium-active.png">\
          <h5><p><b>Active</b></p></h5>');
        }
        else{
          $('#premium').html('<img class="rounded mb-2" alt="wecasual-premium-image-non-active" width="64" height="64" src="/images/premium-non-active.png">\
          <h5><p><b>Not Active</b></p></h5>');
        }
        $('#points').html('<img class="rounded mb-3" alt="wecasual-points-image" width="107" height="55" src="/images/coins-gold-dark.png">\
        <h5><b>' + player.wecasualpoints + '</b></h5>');

        if(player.activeTeam.length != 0){
          $('#team').html('<a href="/dota/tournament?teamid=' + player.activeTeam[0].teamid + '" target="_blank"><b> ' + player.activeTeam[0].teamname + '</b></a>');
        }
        else{
          $('#team').html('<b> No Team</b>');
        }
        if(player.inactiveTeam.length != 0){
          var html = '<a href="/dota/tournament?teamid=' + player.inactiveTeam[0].teamid + '" target="_blank"><b> ' + player.inactiveTeam[0].teamname + '</b></a>';
          for(var i = 1; i < player.inactiveTeam.length; i++){
            html += ', <a href="/dota/tournament?teamid=' + player.inactiveTeam[i].teamid + '" target="_blank"><b> ' + player.inactiveTeam[i].teamname + '</b></a>'
          }
          $('#prev-team').html(html);
        }
        else{
          $('#prev-team').html('<b> No previous teams</b>');
        }

        $('#games-played').html('<b> ' + player.totalgames + '</b>');
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
          var html = "";
          friend.forEach(function(fr){
            var avatar = fr.avatar;
            if(avatar.includes('null')){
              avatar='/images/avatar-default.png';
            }
            html += '<a id="' + fr.playerid + '"class="player-btn roster-link"><div class="card-player mb-1 p-1"><img height="20" width="20" class = "rounded-circle" src=' + avatar + ' alt"Avatar"> ' +
            fr.username + '</div></a>';
            // $("#friends-list").append('<tr><th scope="row"><img height="46" width="46"class="rounded-circle" src=' + ele.avatar + '></th><td>' + ele.username + '</td></tr>')
          });
          $("#friends-list").html(html);
        }
        else{
          $("#friends-list").html('<div>No Friends :(</div>');
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
