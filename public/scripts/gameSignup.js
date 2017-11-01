$(document).ready(function(){
  var pathname = window.location.pathname;
  var table;
  if(pathname == "/dota"){
    table = "Schedule-Dota";
  }
  else if(pathname == "/lol"){
    table = "Schedule-LoL";
  }
  $.ajax({
    type: 'POST',
    url: '/schedule/getAllSchedule',
    data: JSON.stringify({table: table}),
    contentType: 'application/json',
    success: function(res){
      if(!res.success){
        alert(res.error);
      }
      else if(res.success){
        // console.log(res.data);
        res.data.other_games.forEach(function(ele){
          if(ele.fields['Pub Session']){
            $('#game-list').append('<tr><td><label><input class="pub" type="radio" name="game" value="' + ele.id + '|' +
            ele.fields['Team 1'] + '|' + ele.fields['Team 2'] + '|' + table + '"></label></td><td>' +
            ele.fields.Game + '</td><td>' +
            ele.fields['Game Time'] + '</td><td>' +
            ele.fields['Team 1 Slots'] + '</td><td>' + ele.fields['Team 2 Slots'] + '</td></tr>');
          }
          else{
            $('#game-list').append('<tr><td><label><input type="radio" name="game" value="' + ele.id + '|' +
            ele.fields['Team 1'] + '|' + ele.fields['Team 2'] + '|' + table + '"></label></td><td>' +
            ele.fields.Game + '</td><td>' +
            ele.fields['Game Time'] + '</td><td>' +
            ele.fields['Team 1 Slots'] + '</td><td>' + ele.fields['Team 2 Slots'] + '</td></tr>');
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
          $('#my-game-list').append('<tr><td>' +
          ele.fields.Game + '</td><td><a href="#my-schedule">' +
          ele.fields['Game Time'] + '</a></td><td>' +
          ele.fields['Team 1 Slots'] + '</td> <td>' + ele.fields['Team 2 Slots'] + '</td><td>' + team + '</td><td>' +
          ele.fields['Discord Room'] + '</td></tr>');
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
