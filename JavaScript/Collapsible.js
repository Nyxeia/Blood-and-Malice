$(document).ready(function(){
  var savedState = $.cookie("pa_state");
  
  // Set initial panel state
  if (savedState === "closed") {
    $("#pa").hide();
    // $("#pa-btn").addClass("closed-state");
  }

    $("#pa-btn").click(function(){
      $("#pa").slideToggle('normal',function(){

            if ($(this).is(':hidden')) {
                state = "closed"; 
            } else {
                state = "open";
            }

            $.cookie("pa_state", state);
            console.log($.cookie("pa_state"));
        });
    });
});