$(document).ready(function(){
  $.ajax({
    type: 'POST',
    url: '/teams/getTeams',
    success: function(res) {
      if(!res.success){
        alert(res.error);
      }
      else if(res.success){
        res.data.forEach(function(ele){
          $('#team-list').append('<tr class="add-row teams"><td scope="row"> </td><td id="' + ele.id + '">' + ele.name + '</td>' +
          '<td>' + ele.id + '</td>' + 
          '<td id="' + ele.p1.id + '">' + '<img class="rounded-circle" src=' + ele.p1.avatar + '> ' + ele.p1.displayName + '</td>' +
          '<td id="' + ele.p2.id + '">' + '<img class="rounded-circle" src=' + ele.p2.avatar + '> ' + ele.p2.displayName + '</td>' +
          '<td id="' + ele.p3.id + '">' + '<img class="rounded-circle" src=' + ele.p3.avatar + '> ' + ele.p3.displayName + '</td>' +
          '<td id="' + ele.p4.id + '">' + '<img class="rounded-circle" src=' + ele.p4.avatar + '> ' + ele.p4.displayName + '</td>' +
          '<td id="' + ele.p5.id + '">' + '<img class="rounded-circle" src=' + ele.p5.avatar + '> ' + ele.p5.displayName + '</td>' +
          '</tr>');
        });
      }
    }
  });
});
