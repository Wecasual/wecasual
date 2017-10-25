$(document).ready(function(){
  var elements = new Array('.dota-scroll', '.lol-scroll', '.esports-scroll');
  var i = 0;
  $(elements[0]).slideToggle();
  setInterval( function(){
    $(elements[i]).slideToggle();
    setTimeout(function(){
      if(i + 2 > elements.length)
      {
          i = -1;
      }
      $(elements[i+1]).slideToggle()
      i++;
    }, 500) ;
  }, 2000 );
});
