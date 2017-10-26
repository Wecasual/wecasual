$(document).ready(function() {
    $('#contact-form').bootstrapValidator({
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      message: {
        validators: {
          notEmpty: {
            message: 'Required'
          }
        }
      },
      email: {
        validators: {
          notEmpty: {
            message: 'Required'
          },
          emailAddress: {
            message: 'Please enter a valid email address'
          }
        }
      }
    }
  }).on('success.form.bv', function(e){
    // console.log('sending');
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: $('#contact-form').attr('action'),
      data: $('#contact-form').serialize(),
      success: function(res){
        if(!res.success){
          alert(res.error);
        }
        else if(res.success){
          // console.log('test');
          alert(res.message);
          $('#email').val('');
          $('#message').val('');
        }
      }
    });
  });
});
