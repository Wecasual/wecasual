$(document).ready(function() {
  var pathname = window.location.pathname;
  var url = window.location.href;
  var teamid = url.split('=')[1];
  // if(!teamid){
  //   teamid = $("#teamid").html();
  // }
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
        // console.log(team);
        //Append  team info to each div
        var teamlogo = team.teamlogo;
        if(!teamlogo){
          teamlogo = '/images/teamlogo-placeholder.png';
        }
        $('#teamlogo').html('<img height=150 width=250 src=' + teamlogo + ' alt="Team Logo" />');
        $('#teamname').html(team.teamname);
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
        $("#roster").html(html);
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
        $("#inactiveRoster").html(html);
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
