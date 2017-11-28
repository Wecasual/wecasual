$(document).ready(function(){
  var username = $("#username").html();
  var playerid = $("#userid").html();

  //=====SIGN UP FOR A GAME======
  //Available games to sign up for
  $.ajax({
    type: 'POST',
    url: '/schedule/getAllSchedule',
    contentType: 'application/json',
    success: function(res){
      if(!res.success){
        alert(res.error);
      }
      else if(res.success){
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
      }
    }
  });

  //=====SCHEDULE A GAME======
  //Toggle team 2 radio button if a pub session is selected
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

  $('#schedule-game').bootstrapValidator({
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      gameType: {
        validators: {
          notEmpty: {
            message: 'Required'
          }
        }
      },
      date: {
        validators: {
          notEmpty: {
            message: 'Required'
          }
        }
      },
      time: {
        validators: {
          notEmpty: {
            message: 'Required'
          }
        }
      }
    }
  }).on('success.form.bv', function(e){
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: $('#schedule-game').attr('action'),
      data: {
        gameType: $('#gameType').val(),
        pubSession: $('#pubSession').is(":checked"),
        date: $('#date').val(),
        time: $('#time').val(),
        discordRoom: $('#discordRoom').find(":selected").text(),
        announce: $('#announce').is(":checked"),
        username: username,
        playerid: playerid},
      success: function(res){
        if(!res.success){
          alert(res.error);
        }
        else if(res.success){
          $('#gameType').val("");
          $('#pubSession')[0].checked = false;
          $('#date').val("");
          $('#time').val("21:00");
          $('#discordRoom').val("1");
          $('#announce')[0].checked = true;
          alert(res.message);
          location.reload();
        }
      }
    });
  });
});
