$(document).ready(function(){
  $.ajax({
    type: 'POST',
    url: '/challenge/getChallenge',
    success: function(res){
      if(!res.success){
        alert(res.error);
      }
      else if(res.success){

      }
    }
  });
});
