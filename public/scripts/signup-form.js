$(document).ready(function() {
  $('#signup-form').BootstrapValidator({
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
    $.post($form.attr('action'), $form.serialize(), function(result) {
        console.log(result);
    }, 'json');
  });
});

    // $('#signup-form')
    //     .formValidation({
    //       framework: 'bootstrap',
    //       icon: {
    //         valid: 'glyphicon glyphicon-ok',
    //         invalid: 'glyphicon glyphicon-remove',
    //         validating: 'glyphicon glyphicon-refresh'
    //       },
    //       fields: {
    //         email: {
    //           validators: {
    //             notEmpty: {
    //               message: 'Email address is required'
    //             },
    //             emailAddress: {
    //               message: 'The input is not a valid email address'
    //             }
    //           }
    //         }
    //       }
    //     })
    //     .on('success.form.fv', function(e) {
    //         // Prevent form submission
    //         e.preventDefault();
    //
    //         var $form = $(e.target);
    //
    //         $.ajax({
    //             // You can change the url option to desired target
    //             url: '/signup/submit',
    //             type: 'POST',
    //             dataType: 'json',
    //             data: $form.serialize(),
    //             success: function(responseText, statusText, xhr, $form) {
    //                 // Process the response returned by the server ...
    //                 // console.log(responseText);
    //             }
    //         });
    //     });
//http://formvalidation.io/examples/contact-form/
