$(document).ready(function() {
  $('#signup-form').bootstrapValidator({
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      rules: {
        validators: {
          notEmpty: {
            message: 'Required'
          }
        }
      },
      conduct: {
        validators: {
          notEmpty: {
            message: 'Required'
          }
        }
      },
      name: {
        validators: {
          notEmpty: {
            message: 'Please enter your summoner name'
          }
        }
      }
    }
  });
  // .on('success.form.bv', function(e) {
  //   e.preventDefault();
  //   var $form = $(e.target);
  //   //var bv = $form.data('bootstrapValidator');
  //   $.post('/signup/submit', $form.serialize(), 'json');
  //   // $.ajax({
  //   //   type: 'POST',
  //   //   url: '/signup/submit',
  //   //   data: $form.serialize(),
  //   //   dataType: 'json',
  //   //   success: function(responseText, statusText, xhr, $form) {
  //   //       // Process the response returned by the server ...
  //   //       console.log(statusText);
  //   //   }
  //   //});
  // });
  // var numPlayerRequests = 1;
  // $('#add-player').click(function(){
  //   if(numPlayerRequests < 4){
  //     numPlayerRequests++;
  //     $('#player-requests').append('<input type="text" name="player-request" class="my-3 form-control" placeholder="Enter Steam display name">');
  //   }
  // });
});
