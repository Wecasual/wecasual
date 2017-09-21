$(document).ready(function() {
  $('#signup-form').bootstrapValidator({
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      email: {
        validators: {
          notEmpty: {
            message: 'Email address is required'
          },
          emailAddress: {
            message: 'The input is not a valid email address'
          }
        }
      }
    }
  })
  .on('success.form.bv', function(e) {
    e.preventDefault();
    var $form = $(e.target);
    var bv = $form.data('bootstrapValidator');
    $.ajax({
      type: 'POST',
      url: '/signup/submit',
      data: $form.serialize(),
      dataType: 'json',
      success: function(responseText, statusText, xhr, $form) {
          // Process the response returned by the server ...
          console.log(responseText);
      }
    });
  });
  var numPlayerRequests = 1;
  $('#add-player').click(function(){
    if(numPlayerRequests < 4){
      numPlayerRequests++;
      $('#player-requests').append('<input type="text" name="player-request" class="form-control" placeholder="Enter Steam name">');
    }
  });
});
