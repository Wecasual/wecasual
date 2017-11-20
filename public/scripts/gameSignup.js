$(document).ready(function(){
  // var pathname = window.location.pathname;
  // var table;
  // if(pathname == "/dota"){
  //   table = "Schedule-Dota";
  // }
  // else if(pathname == "/lol"){
  //   table = "Schedule-LoL";
  // }
  $.ajax({
    type: 'POST',
    url: '/schedule/getAllSchedule',
    contentType: 'application/json',
    success: function(res){
      if(!res.success){
        alert(res.error);
      }
      else if(res.success){
        // console.log(res.data);
        res.data.otherGames.forEach(function(game){
          if(game.pubsession){
            $('#game-list').append('<tr><td><label><input class="pub" type="radio" name="game" value="' + game.gameid + '|' +
            game.team1 + '|' + game.team2 + '|' + "false" + '"></label></td><td>' +
            game.name + '</td><td>' +
            game.gametime + '</td><td>' +
            game.team1Slots + '</td><td>N/A</td></tr>');
          }
          else{
            $('#game-list').append('<tr><td><label><input type="radio" name="game" value="' + game.gameid + '|' +
            game.team1 + '|' + game.team2 + '|' + "false" + '"></label></td><td>' +
            game.name + '</td><td>' +
            game.gametime + '</td><td>' +
            game.team1Slots + '</td><td>' + game.team2Slots + '</td></tr>');
          }

        });
        $('#game-signup').bootstrapValidator({
          feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
          },
          fields: {
            team: {
              validators: {
                notEmpty: {
                  message: 'Please select a team'
                }
              }
            },
            game: {
              validators: {
                notEmpty: {
                  message: 'Please select a game'
                }
              }
            }
          }
        });
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
          $('#my-game-list').append('<tr><td>' +
          game.name + '</td><td>' +
          game.gametime + '</td><td>' +
          game.team1Slots + '</td> <td>' + game.team2Slots + '</td><td>' + team + '</td><td>' +
          game.discordroom + '</td></tr>');
        });

      }
    }
  });
  $(document).on('change', 'input:radio[name="game"]', function(){
    if(this.className == 'pub'){
      $('#team2').prop('checked', false);
      $('#team2').attr('disabled', true);
      $('#team2').button("refresh");
    }
    else{
      $('#team2').attr('disabled', false);
    }
  });


  //
  // $("#game-signup").submit(function(e) {
  //   e.preventDefault();
  //   $.ajax({
  //     type: 'POST',
  //     url: '/schedule/gameSignup',
  //     data: $("#game-signup").serialize(),
  //     success: function(res){
  //       if(!res.success){
  //         alert(res.error);
  //       }
  //       else if(res.success){
  //         alert(res.success);
  //       }
  //     }
  //   })
  //   $("#game-signup").unbind('submit');
  // });
});
