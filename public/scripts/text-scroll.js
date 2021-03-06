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

  if($('.navbar').length > 0){
      $(window).on("scroll load resize", function(){
          checkScroll();
      });
  }
});


/**
 * Listen to scroll to change header opacity class
 */
function checkScroll(){
    var startY = $('.navbar').height() * 2; //The point where the navbar changes in px

    if($(window).scrollTop() < startY){
        $('.navbar').addClass("scrolled");
    }else{
        $('.navbar').removeClass("scrolled");
    }
}
