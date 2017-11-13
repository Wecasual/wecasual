$(document).ready(function() {
  //Get all users
  var users;
  var userIds;
  var $loading = $('.loading-ring').hide();
  $(document)
    .ajaxStart(function () {
      $loading.show();
    })
    .ajaxStop(function () {
      $loading.hide();
    });
  var users;
  var userIds = new Array();
  $.ajax({
    type: 'POST',
    url: '/profile/getAllUsers',
    success: function(res){
      if(!res.success){
        alert(res.error);
      }
      else if(res.success){
        users = res.data;
        users.forEach(function(ele){
          $("#user-list").append('<li><a href="#" id="' + ele['Id'] + '" class="profile-btn">' + ele['Username'] + '</a></li>')
          userIds.push(ele['Id']);
        });
      }
    }
  });
  $(document).on('click', '.profile-btn', function(){
    var userInfo = users[userIds.indexOf(this.id)];
    $('#user-info-div').empty(); //Remove any current info. Do for all divs
    $('#user-info-div').append()//Append  user info to each div
  });

});

function search() {
    // Declare variables
    var input, filter, ul, li, a, i;
    input = document.getElementById('user-search');
    filter = input.value.toUpperCase();
    ul = document.getElementById("user-list");
    li = ul.getElementsByTagName('li');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}
