$(document).ready(function(){
  var savedState = $.cookie("pa_state");
  
  // Set initial panel state
  if (savedState === "closed") {
    $("#pa").hide();
    $("#pa-btn").html("<i class='ion-chevron-down'></i>");
  }
  
  $("#pa-btn").click(function(){
    $("#pa").slideToggle("normal", function(){
      
      if ($(this).is(":hidden")) {
        state = "closed";
        $("#pa-btn").html("<i class='ion-chevron-down'></i>");
      } else {
        state = "open";
        $("#pa-btn").html("<i class='ion-chevron-up'></i>"); 
      }
      
      $.cookie("pa_state", state);
      console.log($.cookie("pa_state"));
    });
  });
});