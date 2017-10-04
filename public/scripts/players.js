$(document).ready(function(){
  $.ajax({
    type: 'POST',
    url: '/players/getPlayers',
    success: function(res) {
      if(!res.success){
        alert(res.error);
      }
      else if(res.success){
        var i = 1;
        res.data = res.data.sort(function(a, b) {
          return compareStrings(a.displayName, b.displayName);
        })
        res.data.forEach(function(ele){
          $('#player-list').append('<tr><td>' + i + '</td><th scope="row"><img class="rounded-circle" src=' + ele.avatar + '></th><td>' + ele.displayName + '</td><td>' + ele.team + '</td> ' + '</tr>');
          i++;
        });
      }
    }
  });
});
function compareStrings(a, b) {
// Assuming you want case-insensitive comparison
a = a.toLowerCase();
b = b.toLowerCase();

return (a < b) ? -1 : (a > b) ? 1 : 0;
}
