$(document).ready(function(){
  $.ajax({
    type: 'POST',
    url: '/schedule/getAllSchedule',
    success: function(res){
      if(!res.success){
        alert(res.error);
      }
      else if(res.success){
        res.data.other_games.forEach(function(ele){
          $('#game-list').append('<tr><td>' + ele.fields.Game + '</td> <td><label><input type="radio" name="game" value="' + ele.id + '"></label></td> </tr>');
        });
        res.data.my_games.forEach(function(ele){
          var team;
          if(ele.fields['Team 1']){
            if(ele.fields['Team 1'].includes(res.data.user_id)){
              team = 'Team 1';
            }
          }
          if(ele.fields['Team 2']){
            if(ele.fields['Team 2'].includes(res.data.user_id)){
              team = 'Team 2';
            }
          }
          $('#my-game-list').append('<tr><td>' + ele.fields.Game + '</td><td>' + team + '</td></tr>');
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
