$(document).ready(function() {
  //Get all users
  var player;
  var playerid = new Array();
  var friend;
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
        player = res.data;
        player.forEach(function(ele){
          $("#user-list").append('<li><a href="#" id="' + ele.playerid + '" class="player-btn">' + ele.username + '</a></li>')
          playerid.push(ele.playerid);
        });
      }
    }
  });
  $(document).on('click', '.player-btn', function(){
    var selectedPlayerid = parseInt(this.id)
    var playerInfo = player[playerid.indexOf(selectedPlayerid)];
    //Remove any current info. Do for all divs
    $('#avatar').empty();
    $('#username').empty();
    $('#reg-date').empty();
    $('#premium').empty();
    $('#points').empty();
    $('#team').empty();
    $('#games-played').empty();
    $('#friends-list').empty();

    //Append  user info to each div
    if(playerInfo.avatar.includes('null')){//Set avatar to default avatar if player doesn't have one
      $('#avatar').append('<img height="128" width="128" class = "rounded-circle" src=/images/avatar-default.png alt="Avatar Image" />');
    }
    else{
      $('#avatar').append('<img height="128" width="128" class = "rounded-circle" src=' + playerInfo.avatar + ' alt="Avatar Image" />');
    }
    $('#username').append(playerInfo.username);
    var date = new Date(playerInfo.registrationdate)
    $('#reg-date').append('Member since: ' + date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate());
    if(playerInfo.premium){
      $('#premium').append('<img class="rounded mb-2" alt="wecasual-premium-image-active" width="64" height="64" src="/images/premium-active.png">\
      <h5><p><b>Active</b></p></h5>');
      $('#points').append('<img class="rounded mb-3" alt="wecasual-points-image" width="107" height="55" src="/images/coins-gold-dark.png">\
      <h5><b>' + playerInfo.wecasualpoints + '</b></h5>');
    }
    else{
      $('#premium').append('<img class="rounded mb-2" alt="wecasual-premium-image-non-active" width="64" height="64" src="/images/premium-non-active.png">\
      <h5><p><b>Not Active</b></p></h5>');
      $('#points').append('<img class="rounded mb-3" alt="wecasual-points-image" width="107" height="55" src="/images/coins-small.png">\
      <h5><b>N/A</b></h5>');

    }

    if(playerInfo.team){
      $('#team').append('<a href="/dota/teams"><b> ' + playerInfo['Team Name'] + '</b></a>');
    }
    else{
      $('#team').append('<b> No Team</b>');
    }

    $('#games-played').append('<b> ' + playerInfo.totalgames + '</b>');

    $.ajax({
      type: 'POST',
      url: '/profile/getFriends',
      data: {playerid: selectedPlayerid},
      success: function(res){
        if(!res.success){
          alert(res.error);
        }
        else if(res.success){
          friend = res.data;
          if(friend.length){
            friend.forEach(function(ele){
              $("#friends-list").append('<tr><th scope="row"><img height="46" width="46"class="rounded-circle" src=' + ele.avatar + '></th><td>' + ele.username + '</td></tr>');
            });
          }
          else{
            $("#friends-list").append('<tr><th scope="row">No Friends</th><td>:(</td></tr>')
          }
        }
      }
    });
  });
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
