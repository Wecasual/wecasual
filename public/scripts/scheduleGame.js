$(document).ready(function(){
  var username = $("#username").html();
  var playerid = $("#userid").html();
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
