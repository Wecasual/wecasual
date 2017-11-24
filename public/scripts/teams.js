$(document).ready(function() {
  var pathname = window.location.pathname;
  var url = window.location.href;
  var teamid = url.split('=')[1];
  if(!teamid){
    teamid = $("#teamid").html();
  }
  if(teamid){
    populateTeam(teamid);
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
    url: '/team/getAllTeams',
    success: function(res){
      if(!res.success){
        alert(res.error);
      }
      else if(res.success){
        var team = res.data;
        team.forEach(function(ele){
          if(ele.active){
            $("#team-list").append('<li><a href="#" id="' + ele.teamid + '" class="team-btn">' + ele.teamname + '</a></li>');
          }
          else{
            $("#prev-team-list").append('<li><a href="#" id="' + ele.teamid + '" class="team-btn">' + ele.teamname + '</a></li>');
          }
        });
      }
    }
  });
  $(document).on('click', '.team-btn', function(){
    populateTeam(parseInt(this.id));
  });
});

function populateTeam(teamid){
  //Remove any current info. Do for all divs
  // $('#avatar').empty();
  // $('#username').empty();
  // $('#reg-date').empty();
  // $('#premium').empty();
  // $('#points').empty();
  // $('#team').empty();
  // $('#games-played').empty();
  $('#roster').empty();

  //Get info  for selected team
  $.ajax({
    type: 'POST',
    url: '/team/getTeam',
    data: {teamid: teamid},
    success: function(res){
      if(!res.success){
        alert(res.error);
      }
      else if(res.success){
        var team = res.data;
        console.log(team);
        //Append  team info to each div
        var teamlogo = team.teamlogo;
        if(!teamlogo){
          teamlogo = '/images/teamlogo-placeholder.png';
        }
        $('#teamlogo')[0].innerHTML = '<img height=150 width=250 src=' + teamlogo + ' alt="Team Logo" />';
        $('#teamname')[0].innerHTML = team.teamname;
        // var date = new Date(player.registrationdate)
        // $('#reg-date')[0].innerHTML = 'Member since: ' + date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
        // if(player.premium){
        //   $('#premium')[0].innerHTML = '<img class="rounded mb-2" alt="wecasual-premium-image-active" width="64" height="64" src="/images/premium-active.png">\
        //   <h5><p><b>Active</b></p></h5>';
        //   $('#points')[0].innerHTML = '<img class="rounded mb-3" alt="wecasual-points-image" width="107" height="55" src="/images/coins-gold-dark.png">\
        //   <h5><b>' + player.wecasualpoints + '</b></h5>';
        // }
        // else{
        //   $('#premium')[0].innerHTML = '<img class="rounded mb-2" alt="wecasual-premium-image-non-active" width="64" height="64" src="/images/premium-non-active.png">\
        //   <h5><p><b>Not Active</b></p></h5>';
        //   $('#points')[0].innerHTML = '<img class="rounded mb-3" alt="wecasual-points-image" width="107" height="55" src="/images/coins-small.png">\
        //   <h5><b>N/A</b></h5>';
        //
        // }

        // if(player.activeTeam[0]){
        //   $('#team')[0].innerHTML = '<a href="/dota/tournament"><b> ' + player.activeTeam[0].teamname + '</b></a>';
        // }
        // else{
        //   $('#team')[0].innerHTML = '<b> No Team</b>';
        // }
        //
        // $('#games-played')[0].innerHTML = '<b> ' + player.totalgames + '</b>';
        var html = "";
        team.activeRoster.forEach(function(player){
          var avatar = player.avatar;
          if(avatar.includes('null')){
            avatar='/images/avatar-default.png';
          }
          html += '<a class="roster-link" href="players?playerid=' + player.playerid +
          '" target="_blank"><div class="card-player mb-1 p-1"><img height="20" width="20" class = "rounded-circle" src=' + avatar + ' alt"Avatar"> ' +
          player.username + '</div></a>';
        });
        $("#roster")[0].innerHTML = html;
        html = "";
        team.inactiveRoster.forEach(function(player){
          var avatar = player.avatar;
          if(avatar.includes('null')){
            avatar='/images/avatar-default.png';
          }
          html += '<a class="roster-link" href="players?playerid=' + player.playerid +
          '" target="_blank"><div class="card-player mb-1 p-1"><img height="20" width="20" class = "rounded-circle" src=' + avatar + ' alt"Avatar"> ' +
          player.username + '</div></a>';
        });
        $("#inactiveRoster")[0].innerHTML = html;
      }
    }
  });

  //Get selected player friend list
  // $.ajax({
  //   type: 'POST',
  //   url: '/profile/getFriends',
  //   data: {playerid: playerid},
  //   success: function(res){
  //     if(!res.success){
  //       alert(res.error);
  //     }
  //     else if(res.success){
  //       friend = res.data;
  //       if(friend.length){
  //         friend.forEach(function(friendEle){
  //           $("#friends-list").append('<tr><th scope="row"><img height="46" width="46"class="rounded-circle" src=' + friendEle.avatar + '></th><td>' + friendEle.username + '</td></tr>');
  //         });
  //       }
  //       else{
  //         $("#friends-list").append('<tr><th scope="row">No Friends</th><td>:(</td></tr>')
  //       }
  //     }
  //   }
  // });
}
//
// function search() {
//     // Declare variables
//     var input, filter, ul, li, a, i;
//     input = document.getElementByClass('team-search');
//     filter = input.value.toUpperCase();
//     ul = document.getElementByClass("team-list");
//     li = ul.getElementsByTagName('li');
//
//     // Loop through all list items, and hide those who don't match the search query
//     for (i = 0; i < li.length; i++) {
//         a = li[i].getElementsByTagName("a")[0];
//         if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
//             li[i].style.display = "";
//         } else {
//             li[i].style.display = "none";
//         }
//     }
// }
