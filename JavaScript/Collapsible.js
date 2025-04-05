$(document).ready(function(){
  var savedState = $.cookie("pa_state");
  
  // Set initial panel state
  if (savedState === "closed") {
    $("#pa").hide();
    $("#pa-btn").html("▼");
  }
  
  $("#pa-btn").click(function(){
    $("#pa").slideToggle("normal", function(){
      
      if ($(this).is(":hidden")) {
        state = "closed";
        $("#pa-btn").html("▼");
      } else {
        state = "open";
        $("#pa-btn").html("▲"); 
      }
      
      $.cookie("pa_state", state);
      console.log($.cookie("pa_state"));
    });
  });
});