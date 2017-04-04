$(document).ready(function(){
  $("#menu-toggle").click(function(e){
  	e.preventDefault();
  	$("#wrapper").toggleClass("toggled");
  });

  $("#menu-toggle").click(function(e){
  	$("#slidebar-white").toggle();
  });


})
